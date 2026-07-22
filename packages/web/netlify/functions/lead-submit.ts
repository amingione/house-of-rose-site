import { createClient } from '@sanity/client';
import { getFollowUpDueAt, safePathOrUrl, safeText } from './_lib/lead';
import { sendLeadAcknowledgement, sendLeadNotification, type LeadEmail } from './_lib/email';

const THANK_YOU_PATH = '/thank-you/';

type SubmissionType = 'contact' | 'suiteRental' | 'skinAnalysis';

interface LeadSubmissionDocument {
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
  };
}

const getValue = (formData: FormData, key: string, maxLength = 500): string => {
  const value = formData.get(key);
  return typeof value === 'string' ? safeText(value, maxLength) : '';
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

  if (formName === 'skin-analysis') {
    return 'skinAnalysis';
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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.email)) {
    return renderResponse('A valid email is required.', 400);
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
    return renderResponse('Your submission could not be saved. Please try again.', 502);
  }

  return redirect(request, `${THANK_YOU_PATH}?lead=${submissionType}`);
};
