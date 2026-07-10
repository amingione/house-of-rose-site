import { createClient } from '@sanity/client';

const THANK_YOU_PATH = '/thank-you/';

type SubmissionType = 'contact' | 'suiteRental' | 'skinAnalysis';

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

  return redirect(request, THANK_YOU_PATH);
};
