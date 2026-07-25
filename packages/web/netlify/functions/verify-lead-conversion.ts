import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';
import {
  hashMeasurementReceipt,
  verifyLeadMeasurementReceipt,
} from './_lib/measurement-receipt';

interface LeadMeasurementRecord {
  _id: string;
  _rev: string;
  measurementReceiptHash?: string;
  measurementReceiptExpiresAt?: string;
  measurementReceiptUsedAt?: string;
  measurementEventId?: string;
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const secret = process.env.LEAD_MEASUREMENT_SECRET;
  if (!projectId || !dataset || !apiVersion || !token || !secret) {
    return json({ error: 'Conversion verification is not configured.' }, 503);
  }

  let receipt: string;
  try {
    const body = (await request.json()) as { receipt?: unknown };
    receipt = typeof body.receipt === 'string' ? body.receipt.trim() : '';
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const payload = verifyLeadMeasurementReceipt(receipt, secret);
  if (!payload) return json({ error: 'Receipt is invalid or expired.' }, 400);

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
  const lead = await client.fetch<LeadMeasurementRecord | null>(
    `*[_type == "leadSubmission" && _id == $id][0]{
      _id, _rev, measurementReceiptHash, measurementReceiptExpiresAt,
      measurementReceiptUsedAt, measurementEventId
    }`,
    { id: payload.leadId },
  );
  if (!lead || lead.measurementReceiptHash !== hashMeasurementReceipt(receipt)) {
    return json({ error: 'Receipt does not match a saved lead.' }, 404);
  }
  if (
    lead.measurementReceiptUsedAt ||
    !lead.measurementReceiptExpiresAt ||
    Date.parse(lead.measurementReceiptExpiresAt) <= Date.now()
  ) {
    return json({ error: 'Receipt has already been used or expired.' }, 409);
  }

  const eventId = lead.measurementEventId ?? randomUUID();
  try {
    await client
      .patch(lead._id)
      .ifRevisionId(lead._rev)
      .set({
        measurementReceiptUsedAt: new Date().toISOString(),
        measurementEventId: eventId,
      })
      .unset(['measurementReceiptHash'])
      .commit();
  } catch {
    return json({ error: 'Receipt was already consumed.' }, 409);
  }

  return json({ event: 'generate_lead', eventId });
};
