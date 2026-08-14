import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';
import { getFollowUpDueAt, safePathOrUrl, safeText } from './_lib/lead';
import { sendLeadAcknowledgement, sendLeadNotification, type LeadEmail } from './_lib/email';
import {
  createLeadMeasurementReceipt,
  hashMeasurementReceipt,
} from './_lib/measurement-receipt';

const THANK_YOU_PATH = '/thank-you/';
const SMS_DISCLOSURE_VERSION = 'grasshopper-toll-free-2026-07-26';
const SMS_TERMS_URL = 'https://houseofrosefl.com/privacy-policy/';

type SubmissionType = 'contact' | 'consultation' | 'suiteRental' | 'skinAnalysis';

const FORM_RETURN_PATHS: Record<SubmissionType, string> = {
  contact: '/contact/#contact-form-heading',
  consultation: '/consultation/#consultation',
  suiteRental: '/rent-a-room/#apply',
  skinAnalysis: '/skin-analysis/#consultation',
};

interface LeadSubmissionDocument {
  _id: string;
  _type: 'leadSubmission';
  submittedAt: string;
  submissionType: SubmissionType;
  status: 'new';
  followUpDueAt: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  serviceInterest?: string;
  smsConsent?: {
    informational: boolean;
    marketing: boolean;
    declined: boolean;
    recordedAt: string;
    disclosureVersion: string;
    method: 'website-form';
    termsUrl: string;
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
  attribution?: {
    landingPage?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    openAIAds?: {
      oppref?: string;
      obref?: string;
    };
    consentSnapshot?: {
      schemaVersion: 1;
      policyVersion: string;
      analyticsStorage: 'granted' | 'denied';
      adStorage: 'granted' | 'denied';
      adUserData: 'granted' | 'denied';
      adPersonalization: 'granted' | 'denied';
      recordedAt: string;
    };
  };
  measurementReceiptHash?: string;
  measurementReceiptExpiresAt?: string;
}

type MeasurementConsentSnapshot = NonNullable<
  NonNullable<LeadSubmissionDocument['attribution']>['consentSnapshot']
>;

const getValue = (formData: FormData, key: string, maxLength = 500): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? safeText(value, maxLength) : '';
};

const getChecked = (formData: FormData, key: string): boolean => getValue(formData, key) === 'yes';

const getConsentSnapshot = (formData: FormData): MeasurementConsentSnapshot | undefined => {
  const raw = getValue(formData, 'consent-snapshot', 1500);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const signal = (key: string): 'granted' | 'denied' =>
      parsed[key] === 'granted' ? 'granted' : 'denied';
    return {
      schemaVersion: 1,
      policyVersion: safeText(String(parsed.policyVersion ?? ''), 40) || 'unknown',
      analyticsStorage: signal('analytics_storage'),
      adStorage: signal('ad_storage'),
      adUserData: signal('ad_user_data'),
      adPersonalization: signal('ad_personalization'),
      recordedAt: safeText(String(parsed.recordedAt ?? ''), 60) || new Date().toISOString(),
    };
  } catch {
    return undefined;
  }
};

const getRawCookieValue = (request: Request, name: string): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;

  for (const segment of cookieHeader.split(';')) {
    const separator = segment.indexOf('=');
    if (separator < 0 || segment.slice(0, separator).trim() !== name) continue;
    const value = segment.slice(separator + 1).trim();
    return value && value.length <= 2048 ? value : undefined;
  }

  return undefined;
};

const redirect = (request: Request, path: string, status = 303): Response =>
  Response.redirect(new URL(path, request.url), status);

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderResponse = (
  message: string,
  status: number,
  returnPath = '/contact/',
): Response =>
  new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Request Not Sent | House of Rose Aesthetics</title>
    <style>
      body { margin: 0; background: #fbf6f0; color: #2a2421; font-family: Arial, sans-serif; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 2rem; box-sizing: border-box; }
      section { width: min(38rem, 100%); border: 1px solid #ead1cc; background: rgba(255,255,255,.72); padding: clamp(1.5rem, 5vw, 2.5rem); box-sizing: border-box; }
      h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(2rem, 7vw, 3rem); font-weight: 400; line-height: 1.1; }
      p { margin: 1rem 0 0; line-height: 1.65; color: #514843; }
      a { display: inline-block; margin-top: 1.5rem; border: 1px solid #7b303c; padding: .85rem 1rem; color: #7b303c; font-size: .75rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; text-underline-offset: .3em; }
      a:focus-visible { outline: 2px solid #7b303c; outline-offset: 4px; }
    </style>
  </head>
  <body>
    <main>
      <section aria-labelledby="response-title">
        <h1 id="response-title">Your request was not sent.</h1>
        <p>${escapeHtml(message)}</p>
        <a href="${escapeHtml(returnPath)}">Return to the form</a>
      </section>
    </main>
  </body>
</html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  );

const getSubmissionType = (formName: string): SubmissionType | null => {
  if (formName === 'contact') {
    return 'contact';
  }

  if (formName === 'suite-rental-application') {
    return 'suiteRental';
  }

  if (formName === 'skin-analysis') {
    return 'skinAnalysis';
  }

  if (formName === 'general-consultation') {
    return 'consultation';
  }

  return null;
};

const buildDocument = (
  formData: FormData,
  request: Request,
  submissionType: SubmissionType,
  formName: string,
): LeadSubmissionDocument => {
  const submittedAt = new Date().toISOString();
  const consentSnapshot = getConsentSnapshot(formData);
  const openAIAds =
    consentSnapshot?.adStorage === 'granted'
      ? {
          oppref: getRawCookieValue(request, '__oppref'),
          ...(consentSnapshot.adUserData === 'granted'
            ? { obref: getRawCookieValue(request, '__obref') }
            : {}),
        }
      : undefined;
  const document: LeadSubmissionDocument = {
    _id: `lead-${randomUUID()}`,
    _type: 'leadSubmission',
    submittedAt,
    submissionType,
    status: 'new',
    followUpDueAt: getFollowUpDueAt(new Date()),
    name: getValue(formData, 'name', 120),
    email: getValue(formData, 'email', 254).toLowerCase(),
    phone: getValue(formData, 'phone', 40) || undefined,
    message: getValue(formData, 'message', 4000) || undefined,
    serviceInterest: getValue(formData, 'service-interest', 160) || undefined,
    source: {
      formName,
      page: safePathOrUrl(getValue(formData, 'source-page', 1000) || request.headers.get('referer') || '') || undefined,
      userAgent: safeText(request.headers.get('user-agent') || '', 500) || undefined,
    },
    attribution: {
      landingPage: safePathOrUrl(getValue(formData, 'landing-page', 1000)) || undefined,
      referrer: safePathOrUrl(getValue(formData, 'referrer', 1000)) || undefined,
      utmSource: getValue(formData, 'utm_source', 160) || undefined,
      utmMedium: getValue(formData, 'utm_medium', 160) || undefined,
      utmCampaign: getValue(formData, 'utm_campaign', 200) || undefined,
      utmTerm: getValue(formData, 'utm_term', 200) || undefined,
      utmContent: getValue(formData, 'utm_content', 200) || undefined,
      gclid: getValue(formData, 'gclid', 300) || undefined,
      gbraid: getValue(formData, 'gbraid', 300) || undefined,
      wbraid: getValue(formData, 'wbraid', 300) || undefined,
      ...(openAIAds && Object.values(openAIAds).some(Boolean) ? { openAIAds } : {}),
      consentSnapshot,
    },
  };

  if (submissionType === 'contact') {
    document.smsConsent = {
      informational: getChecked(formData, 'consent-informational'),
      marketing: getChecked(formData, 'consent-marketing'),
      declined: getChecked(formData, 'consent-none'),
      recordedAt: submittedAt,
      disclosureVersion: SMS_DISCLOSURE_VERSION,
      method: 'website-form',
      termsUrl: SMS_TERMS_URL,
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

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') {
    return renderResponse('Use a website form to send your request.', 405);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return renderResponse('The submitted form could not be read. Please return and try again.', 400);
  }
  const formName = getValue(formData, 'form-name');
  const submissionType = getSubmissionType(formName);
  const returnPath = submissionType ? FORM_RETURN_PATHS[submissionType] : '/contact/';

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !apiVersion || !token) {
    console.error('[lead-submit] Missing Sanity write configuration.');
    return renderResponse('The form is temporarily unavailable. Please try again later.', 500, returnPath);
  }

  if (getValue(formData, 'bot-field')) {
    return redirect(request, THANK_YOU_PATH);
  }

  if (!submissionType) {
    return renderResponse('This form could not be recognized. Please return and try again.', 400, returnPath);
  }

  const document = buildDocument(formData, request, submissionType, formName);
  const measurementSecret = process.env.LEAD_MEASUREMENT_SECRET;
  let measurementReceipt: string | undefined;
  if (measurementSecret) {
    const expiresAt = Date.now() + 30 * 60 * 1000;
    measurementReceipt = createLeadMeasurementReceipt(
      {
        version: 1,
        leadId: document._id,
        nonce: randomUUID(),
        expiresAt,
      },
      measurementSecret,
    );
    document.measurementReceiptHash = hashMeasurementReceipt(measurementReceipt);
    document.measurementReceiptExpiresAt = new Date(expiresAt).toISOString();
  }

  if (!document.name || !document.email) {
    return renderResponse('Name and email are required.', 400, returnPath);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.email)) {
    return renderResponse('A valid email is required.', 400, returnPath);
  }

  if ((submissionType === 'contact' || submissionType === 'consultation') && !document.phone) {
    return renderResponse('Phone is required.', 400, returnPath);
  }

  if (submissionType === 'contact') {
    const smsConsent = document.smsConsent;
    const hasPositiveConsent = Boolean(smsConsent?.informational || smsConsent?.marketing);
    if (!smsConsent || (!hasPositiveConsent && !smsConsent.declined)) {
      return renderResponse('Choose at least one text-message consent option, including “No” if you decline.', 400, returnPath);
    }
    if (hasPositiveConsent && smsConsent.declined) {
      return renderResponse('Text-message consent choices conflict. Choose consent or decline.', 400, returnPath);
    }
  }

  if (submissionType === 'suiteRental' && (!document.phone || !document.message || !document.suiteRental?.specialty || !document.suiteRental.yearsExperience || !document.suiteRental.insuranceAcknowledgement)) {
    return renderResponse('Required suite application fields are missing.', 400, returnPath);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  try {
    const created = await client.create(document);
    const emailLead: LeadEmail = {
      name: document.name,
      email: document.email,
      phone: document.phone,
      submissionType: document.submissionType,
      serviceInterest: document.serviceInterest,
      message: document.message,
      page: document.source.page,
      landingPage: document.attribution?.landingPage,
      utmSource: document.attribution?.utmSource,
      utmMedium: document.attribution?.utmMedium,
      utmCampaign: document.attribution?.utmCampaign,
      smsConsent: document.smsConsent
        ? [
            document.smsConsent.informational ? 'Informational' : '',
            document.smsConsent.marketing ? 'Marketing' : '',
            document.smsConsent.declined ? 'Declined all SMS' : '',
          ].filter(Boolean).join(' + ')
        : undefined,
    };

    const [internalNotificationSent, acknowledgementSent] = await Promise.all([
      sendLeadNotification(emailLead),
      sendLeadAcknowledgement(emailLead),
    ]);

    await client
      .patch(created._id)
      .set({ internalNotificationSent, acknowledgementSent })
      .commit()
      .catch((error: unknown) => console.error('[lead-submit] Email status patch failed:', error));
  } catch (error) {
    console.error('[lead-submit] Sanity create failed:', error);
    return renderResponse('Your submission could not be saved. Please try again.', 502, returnPath);
  }

  return redirect(
    request,
    measurementReceipt
      ? `${THANK_YOU_PATH}?receipt=${encodeURIComponent(measurementReceipt)}`
      : THANK_YOU_PATH,
  );
};
