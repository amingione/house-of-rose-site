import { createClient } from '@sanity/client';

const THANK_YOU_PATH = '/thank-you/';

// ─── Lead notification (Zapier Catch Hook → Gmail) ────────────────────────────
// The function POSTs each new lead to a Zapier Catch Hook; a 2-step Zap
// (Webhooks "Catch Hook" → Gmail "Send Email") delivers the alert. This reuses
// the Gmail account already connected in Zapier — no Gmail credentials live here.
// Best-effort: a failure must never block a lead from being saved.
const NOTIFY_TO_DEFAULT = 'info@houseofrosefl.com';

type SubmissionType = 'contact' | 'suiteRental';

interface LeadSubmissionDocument {
  _type: 'leadSubmission';
  submittedAt: string;
  submissionType: SubmissionType;
  status: 'new';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  smsConsent?: {
    informational: boolean;
    marketing: boolean;
    declined: boolean;
  };
  suiteRental?: {
    specialty?: string;
    licenseNumber?: string;
    businessName?: string;
    yearsExperience?: string;
    insuranceAcknowledgement: boolean;
  };
  source: {
    formName: string;
    page?: string;
    userAgent?: string;
  };
}

const getValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

const getChecked = (formData: FormData, key: string): boolean => getValue(formData, key) === 'yes';

const redirect = (request: Request, path: string, status = 303): Response =>
  Response.redirect(new URL(path, request.url), status);

const renderResponse = (message: string, status: number): Response =>
  new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

const getSubmissionType = (formName: string): SubmissionType | null => {
  if (formName === 'contact') {
    return 'contact';
  }

  if (formName === 'suite-rental-application') {
    return 'suiteRental';
  }

  return null;
};

const buildDocument = (
  formData: FormData,
  request: Request,
  submissionType: SubmissionType,
  formName: string,
): LeadSubmissionDocument => {
  const document: LeadSubmissionDocument = {
    _type: 'leadSubmission',
    submittedAt: new Date().toISOString(),
    submissionType,
    status: 'new',
    name: getValue(formData, 'name'),
    email: getValue(formData, 'email'),
    phone: getValue(formData, 'phone') || undefined,
    message: getValue(formData, 'message') || undefined,
    source: {
      formName,
      page: getValue(formData, 'source-page') || request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    },
  };

  if (submissionType === 'contact') {
    document.smsConsent = {
      informational: getChecked(formData, 'consent-informational'),
      marketing: getChecked(formData, 'consent-marketing'),
      declined: getChecked(formData, 'consent-none'),
    };
  }

  if (submissionType === 'suiteRental') {
    document.suiteRental = {
      specialty: getValue(formData, 'specialty') || undefined,
      licenseNumber: getValue(formData, 'license-number') || undefined,
      businessName: getValue(formData, 'business-name') || undefined,
      yearsExperience: getValue(formData, 'years-experience') || undefined,
      insuranceAcknowledgement: getChecked(formData, 'insurance-acknowledgement'),
    };
  }

  return document;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

interface NotificationEmail {
  subject: string;
  text: string;
  html: string;
}

const buildNotificationEmail = (doc: LeadSubmissionDocument): NotificationEmail => {
  const typeLabel = doc.submissionType === 'suiteRental' ? 'Suite rental application' : 'Contact / booking enquiry';

  const rows: Array<[string, string | undefined]> = [
    ['Type', typeLabel],
    ['Name', doc.name],
    ['Email', doc.email],
    ['Phone', doc.phone],
    ['Message', doc.message],
    ['Submitted', doc.submittedAt],
    ['Page', doc.source.page],
  ];

  if (doc.smsConsent) {
    const consent = doc.smsConsent.declined
      ? 'Declined'
      : [doc.smsConsent.informational ? 'Informational' : null, doc.smsConsent.marketing ? 'Marketing' : null]
          .filter(Boolean)
          .join(', ') || 'None selected';
    rows.push(['SMS consent', consent]);
  }

  if (doc.suiteRental) {
    rows.push(
      ['Specialty', doc.suiteRental.specialty],
      ['License #', doc.suiteRental.licenseNumber],
      ['Business', doc.suiteRental.businessName],
      ['Experience', doc.suiteRental.yearsExperience],
      ['Insurance ack.', doc.suiteRental.insuranceAcknowledgement ? 'Yes' : 'No'],
    );
  }

  const present = rows.filter((r): r is [string, string] => Boolean(r[1]));

  const text = [`New ${typeLabel.toLowerCase()}`, '', ...present.map(([k, v]) => `${k}: ${v}`)].join('\n');

  const html = `<h2>New ${escapeHtml(typeLabel.toLowerCase())}</h2>
${present
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v).replaceAll('\n', '<br />')}</p>`)
    .join('\n')}`;

  return { subject: `New lead: ${doc.name} — ${typeLabel}`, text, html };
};

/**
 * Notify about a new lead by POSTing to a Zapier Catch Hook (which sends the
 * Gmail). Best-effort — logs and swallows any error so the lead-capture flow is
 * never interrupted by notification problems. The payload is flat and includes a
 * ready-made subject/body so the Gmail step in the Zap can map fields directly.
 */
const sendLeadNotification = async (doc: LeadSubmissionDocument): Promise<void> => {
  const hookUrl = process.env.LEAD_NOTIFY_ZAP_HOOK_URL;
  if (!hookUrl) {
    console.warn('[lead-submit] LEAD_NOTIFY_ZAP_HOOK_URL not set — skipping lead notification.');
    return;
  }

  const notifyTo = process.env.LEAD_NOTIFY_TO ?? process.env.PUBLIC_BOOKING_EMAIL ?? NOTIFY_TO_DEFAULT;
  const { subject, text, html } = buildNotificationEmail(doc);

  const payload = {
    // Routing / message (map these in the Zap's Gmail step)
    notifyTo,
    replyTo: doc.email,
    subject,
    bodyText: text,
    bodyHtml: html,
    // Raw lead fields (available individually if you prefer custom mapping)
    submissionType: doc.submissionType,
    name: doc.name,
    email: doc.email,
    phone: doc.phone ?? '',
    message: doc.message ?? '',
    page: doc.source.page ?? '',
    submittedAt: doc.submittedAt,
    smsConsent: doc.smsConsent ?? null,
    suiteRental: doc.suiteRental ?? null,
  };

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '(unreadable)');
      console.error(`[lead-submit] Zapier hook failed ${response.status}: ${errorBody}`);
    }
  } catch (error) {
    console.error('[lead-submit] Zapier hook threw:', error);
  }
};

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return renderResponse('Method Not Allowed', 405);
  }

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !apiVersion || !token) {
    console.error('[lead-submit] Missing Sanity write configuration.');
    return renderResponse('Lead collection is not configured yet.', 500);
  }

  const formData = await request.formData();

  if (getValue(formData, 'bot-field')) {
    return redirect(request, THANK_YOU_PATH);
  }

  const formName = getValue(formData, 'form-name');
  const submissionType = getSubmissionType(formName);

  if (!submissionType) {
    return renderResponse('Unknown form submission.', 400);
  }

  const document = buildDocument(formData, request, submissionType, formName);

  if (!document.name || !document.email) {
    return renderResponse('Name and email are required.', 400);
  }

  if (submissionType === 'contact' && !document.phone) {
    return renderResponse('Phone is required.', 400);
  }

  if (submissionType === 'suiteRental' && (!document.phone || !document.message || !document.suiteRental?.specialty || !document.suiteRental.yearsExperience || !document.suiteRental.insuranceAcknowledgement)) {
    return renderResponse('Required suite application fields are missing.', 400);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  try {
    await client.create(document);
  } catch (error) {
    console.error('[lead-submit] Sanity create failed:', error);
    return renderResponse('Your submission could not be saved. Please try again.', 502);
  }

  // Best-effort notification — the lead is already saved, so we never fail the
  // request if the email send has trouble.
  await sendLeadNotification(document);

  return redirect(request, THANK_YOU_PATH);
};
