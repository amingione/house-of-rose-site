import { createClient } from '@sanity/client';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

type LeadStatus = 'qualified' | 'consultationBooked' | 'completed';
type GoalKey = 'qualified_lead' | 'consultation_booked' | 'completed_booking';

interface OfflineLead {
  _id: string;
  _rev: string;
  status: LeadStatus;
  qualifiedAt?: string;
  bookedAt?: string;
  completedAt?: string;
  attribution?: {
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    consentSnapshot?: { adUserData?: string; adPersonalization?: string };
  };
  offlineConversions?: {
    qualifiedUploadedAt?: string;
    consultationBookedUploadedAt?: string;
    completedBookingUploadedAt?: string;
  };
}

interface GoalConfiguration {
  key: GoalKey;
  conversionActionId: string;
  timestamp?: string;
  uploadedField:
    | 'qualifiedUploadedAt'
    | 'consultationBookedUploadedAt'
    | 'completedBookingUploadedAt';
}

const statusGoal = (lead: OfflineLead): GoalConfiguration | null => {
  if (lead.status === 'qualified') {
    return {
      key: 'qualified_lead',
      conversionActionId: process.env.GOOGLE_ADS_QUALIFIED_LEAD_ACTION_ID ?? '',
      timestamp: lead.qualifiedAt,
      uploadedField: 'qualifiedUploadedAt',
    };
  }
  if (lead.status === 'consultationBooked') {
    return {
      key: 'consultation_booked',
      conversionActionId: process.env.GOOGLE_ADS_CONSULTATION_BOOKED_ACTION_ID ?? '',
      timestamp: lead.bookedAt,
      uploadedField: 'consultationBookedUploadedAt',
    };
  }
  if (lead.status === 'completed') {
    return {
      key: 'completed_booking',
      conversionActionId: process.env.GOOGLE_ADS_COMPLETED_BOOKING_ACTION_ID ?? '',
      timestamp: lead.completedAt,
      uploadedField: 'completedBookingUploadedAt',
    };
  }
  return null;
};

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const accessToken = async (): Promise<string> => {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth is not configured.');
  }
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const body = (await response.json()) as { access_token?: string; error?: string };
  if (!response.ok || !body.access_token) {
    throw new Error(`Google OAuth token exchange failed${body.error ? `: ${body.error}` : '.'}`);
  }
  return body.access_token;
};

const appendAttempt = async (
  client: ReturnType<typeof createClient>,
  lead: OfflineLead,
  goal: GoalConfiguration,
  outcome: 'accepted' | 'rejected' | 'retried' | 'deduplicated' | 'validated',
  detail: string,
  requestId?: string,
): Promise<void> => {
  await client
    .patch(lead._id)
    .setIfMissing({ offlineConversions: {}, 'offlineConversions.attempts': [] })
    .insert('after', 'offlineConversions.attempts[-1]', [
      {
        _key: crypto.randomUUID(),
        _type: 'object',
        at: new Date().toISOString(),
        goal: goal.key,
        outcome,
        requestId,
        detail: detail.slice(0, 500),
      },
    ])
    .commit();
};

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const rawBody = await request.text();
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
  if (
    !webhookSecret ||
    !isValidSignature(rawBody, request.headers.get(SIGNATURE_HEADER_NAME) ?? '', webhookSecret)
  ) {
    return json({ error: 'Invalid webhook signature.' }, 401);
  }

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !apiVersion || !token) {
    return json({ error: 'Sanity is not configured.' }, 503);
  }

  let leadId: string;
  try {
    const body = JSON.parse(rawBody) as { _id?: unknown };
    leadId = typeof body._id === 'string' ? body._id : '';
  } catch {
    return json({ error: 'Invalid webhook body.' }, 400);
  }
  if (!leadId.startsWith('lead-')) return json({ error: 'Unsupported document.' }, 400);

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  // Deliberately excludes name, email, phone, treatment interest, message, and notes.
  const lead = await client.fetch<OfflineLead | null>(
    `*[_type == "leadSubmission" && _id == $leadId][0]{
      _id, _rev, status, qualifiedAt, bookedAt, completedAt,
      attribution{ gclid, gbraid, wbraid, consentSnapshot{ adUserData, adPersonalization } },
      offlineConversions{
        qualifiedUploadedAt, consultationBookedUploadedAt, completedBookingUploadedAt
      }
    }`,
    { leadId },
  );
  if (!lead) return json({ error: 'Lead not found.' }, 404);

  const goal = statusGoal(lead);
  if (!goal) return json({ ignored: true, reason: 'Status is not an offline conversion goal.' }, 202);
  if (lead.offlineConversions?.[goal.uploadedField]) {
    await appendAttempt(client, lead, goal, 'deduplicated', 'Goal was already uploaded.');
    return json({ deduplicated: true });
  }
  if (lead.attribution?.consentSnapshot?.adUserData !== 'granted') {
    await appendAttempt(client, lead, goal, 'rejected', 'ad_user_data was not granted.');
    return json({ ignored: true, reason: 'User-data consent was not granted.' }, 202);
  }

  const adIdentifiers = Object.fromEntries(
    (['gclid', 'gbraid', 'wbraid'] as const).flatMap((key) =>
      lead.attribution?.[key] ? [[key, lead.attribution[key]]] : [],
    ),
  );
  if (!Object.keys(adIdentifiers).length) {
    await appendAttempt(client, lead, goal, 'rejected', 'No Google click identifier was saved.');
    return json({ ignored: true, reason: 'No eligible click identifier.' }, 202);
  }
  if (!goal.timestamp || !goal.conversionActionId) {
    await appendAttempt(client, lead, goal, 'rejected', 'Goal timestamp or conversion action ID is missing.');
    return json({ error: 'Offline conversion goal is not configured.' }, 503);
  }

  const customerId = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? '492-149-3013').replaceAll('-', '');
  const loginCustomerId = (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? customerId).replaceAll('-', '');
  const validateOnly = process.env.GOOGLE_OFFLINE_IMPORTS_ENABLED !== 'true';
  const transactionId = `${lead._id}:${goal.key}`;

  try {
    const response = await fetch('https://datamanager.googleapis.com/v1/events:ingest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await accessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinations: [
          {
            operatingAccount: { accountType: 'GOOGLE_ADS', accountId: customerId },
            loginAccount: { accountType: 'GOOGLE_ADS', accountId: loginCustomerId },
            productDestinationId: goal.conversionActionId,
          },
        ],
        encoding: 'HEX',
        events: [
          {
            adIdentifiers,
            eventTimestamp: goal.timestamp,
            transactionId,
            eventSource: 'WEB',
          },
        ],
        consent: {
          adUserData: 'CONSENT_GRANTED',
          adPersonalization:
            lead.attribution?.consentSnapshot?.adPersonalization === 'granted'
              ? 'CONSENT_GRANTED'
              : 'CONSENT_DENIED',
        },
        validateOnly,
      }),
    });
    const responseBody = (await response.json()) as {
      requestId?: string;
      error?: { message?: string };
    };
    if (!response.ok) {
      const detail = responseBody.error?.message ?? `Google returned ${response.status}.`;
      await appendAttempt(client, lead, goal, 'retried', detail);
      return json({ error: 'Google rejected the conversion request.' }, 502);
    }

    const now = new Date().toISOString();
    if (validateOnly) {
      await appendAttempt(client, lead, goal, 'validated', 'Google validation-only request passed.', responseBody.requestId);
    } else {
      await client
        .patch(lead._id)
        .ifRevisionId(lead._rev)
        .set({
          [`offlineConversions.${goal.uploadedField}`]: now,
          'offlineConversions.lastError': '',
        })
        .commit();
      await appendAttempt(client, lead, goal, 'accepted', 'Google accepted the conversion request.', responseBody.requestId);
    }
    return json({ accepted: true, validateOnly, requestId: responseBody.requestId, transactionId });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Offline conversion upload failed.';
    await appendAttempt(client, lead, goal, 'retried', detail);
    return json({ error: 'Offline conversion upload failed.' }, 502);
  }
};
