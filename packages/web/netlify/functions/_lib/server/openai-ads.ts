import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

// Server-only OpenAI Ads Conversions API transport for Netlify Functions.
export type OpenAIAdsEventType = 'lead_created' | 'order_created';

export interface OpenAIAdsContent {
  id: string;
  name: string;
  content_type: 'product';
  quantity?: number;
  amount?: number;
  currency?: 'USD';
}

export interface OpenAIAdsEventData {
  type: 'contents' | 'customer_action';
  amount?: number;
  currency?: 'USD';
  contents?: OpenAIAdsContent[];
}

export interface OpenAIAdsMeasurementConsent {
  adStorage?: string;
  adUserData?: string;
  adPersonalization?: string;
}

interface NetlifyCookieStore {
  get(name: string): string | undefined;
}

interface NetlifyGeo {
  city?: string;
  country?: {
    code?: string;
  };
  postalCode?: string;
}

export interface OpenAIAdsNetlifyContext {
  cookies?: NetlifyCookieStore;
  geo?: NetlifyGeo;
  ip?: string;
  waitUntil(promise: Promise<unknown>): void;
}

export interface OpenAIAdsConversionInput {
  id: string;
  type: OpenAIAdsEventType;
  data: OpenAIAdsEventData;
  consent: OpenAIAdsMeasurementConsent;
  request: Request;
  sourceUrl?: string;
  fallbackPath: `/${string}`;
  email?: string;
  timestampMs?: number;
}

interface OpenAIAdsUser {
  obref?: string;
  email_sha256?: string;
  country?: string;
  city?: string;
  zip_code?: string;
  ip_address?: string;
  user_agent?: string;
}

interface OpenAIAdsApiEvent {
  id: string;
  type: OpenAIAdsEventType;
  timestamp_ms: number;
  oppref?: string;
  source_url: string;
  action_source: 'web';
  user?: OpenAIAdsUser;
  opt_out?: boolean;
  data: OpenAIAdsEventData;
}

const DEFAULT_SITE_ORIGIN = 'https://houseofrosefl.com/';
const OPENAI_ADS_ENDPOINT = 'https://bzr.openai.com/v1/events';
const OPENAI_ADS_TIMEOUT_MS = 2_000;

const nonBlank = (value: string | undefined, maxLength: number): string | undefined => {
  const cleaned = value?.trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
};

const getConfiguredSiteUrl = (): URL => {
  try {
    const configured = new URL(process.env.PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN);
    if (configured.protocol === 'http:' || configured.protocol === 'https:') return configured;
  } catch {
    // Fall through to the canonical production origin.
  }
  return new URL(DEFAULT_SITE_ORIGIN);
};

const originAndPath = (url: URL): string => `${url.origin}${url.pathname}`;

export const sanitizeOpenAIAdsSourceUrl = (
  browserSourceUrl: string | undefined,
  requestUrl: string,
  fallbackPath: `/${string}`,
  configuredSiteUrl = getConfiguredSiteUrl(),
): string => {
  let requestOrigin: string | undefined;
  try {
    const request = new URL(requestUrl);
    if (request.protocol === 'http:' || request.protocol === 'https:') requestOrigin = request.origin;
  } catch {
    requestOrigin = undefined;
  }

  if (browserSourceUrl) {
    try {
      const candidate = new URL(browserSourceUrl);
      const trustedOrigins = new Set([configuredSiteUrl.origin, requestOrigin].filter(Boolean));
      if (
        (candidate.protocol === 'http:' || candidate.protocol === 'https:') &&
        trustedOrigins.has(candidate.origin)
      ) {
        return originAndPath(candidate);
      }
    } catch {
      // Use the canonical fallback below.
    }
  }

  return originAndPath(new URL(fallbackPath, configuredSiteUrl));
};

export const hashOpenAIAdsEmail = (email: string | undefined): string | undefined => {
  const normalized = nonBlank(email, 254)?.toLowerCase();
  return normalized
    ? createHash('sha256').update(normalized, 'utf8').digest('hex')
    : undefined;
};

const buildUser = (
  input: OpenAIAdsConversionInput,
  context: OpenAIAdsNetlifyContext,
): OpenAIAdsUser | undefined => {
  if (input.consent.adUserData !== 'granted') return undefined;

  const obref = context.cookies?.get('__obref');
  const country = nonBlank(context.geo?.country?.code, 2)?.toUpperCase();
  const ipAddress = context.ip && isIP(context.ip) ? context.ip : undefined;
  const user: OpenAIAdsUser = {
    ...(obref?.trim() ? { obref } : {}),
    email_sha256: hashOpenAIAdsEmail(input.email),
    country,
    city: nonBlank(context.geo?.city, 128),
    zip_code: nonBlank(context.geo?.postalCode, 32),
    ip_address: ipAddress,
    user_agent: nonBlank(input.request.headers.get('user-agent') ?? undefined, 1024),
  };

  return Object.values(user).some(Boolean) ? user : undefined;
};

export const buildOpenAIAdsApiEvent = (
  input: OpenAIAdsConversionInput,
  context: OpenAIAdsNetlifyContext,
  currentTimeMs = Date.now(),
): OpenAIAdsApiEvent => {
  const oppref = context.cookies?.get('__oppref');
  const user = buildUser(input, context);
  const minimumTimestamp = currentTimeMs - 7 * 24 * 60 * 60 * 1000;
  const maximumTimestamp = currentTimeMs + 10 * 60 * 1000;
  const requestedTimestamp = input.timestampMs;
  const timestampMs =
    typeof requestedTimestamp === 'number' &&
    Number.isFinite(requestedTimestamp) &&
    requestedTimestamp >= minimumTimestamp &&
    requestedTimestamp <= maximumTimestamp
      ? Math.round(requestedTimestamp)
      : currentTimeMs;
  return {
    id: input.id,
    type: input.type,
    timestamp_ms: timestampMs,
    ...(oppref?.trim() ? { oppref } : {}),
    source_url: sanitizeOpenAIAdsSourceUrl(
      input.sourceUrl,
      input.request.url,
      input.fallbackPath,
    ),
    action_source: 'web',
    ...(user ? { user } : {}),
    ...(input.consent.adPersonalization === 'granted' ? {} : { opt_out: true }),
    data: input.data,
  };
};

const sendOpenAIAdsConversion = async (
  input: OpenAIAdsConversionInput,
  context: OpenAIAdsNetlifyContext,
): Promise<void> => {
  const pixelId = process.env.PUBLIC_OPENAI_ADS_PIXEL_ID?.trim();
  const apiKey = process.env.OPENAI_ADS_CONVERSIONS_API_KEY?.trim();
  if (!pixelId || !apiKey || input.consent.adStorage !== 'granted') return;

  const event = buildOpenAIAdsApiEvent(input, context);
  const response = await fetch(`${OPENAI_ADS_ENDPOINT}?pid=${encodeURIComponent(pixelId)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      validate_only: process.env.OPENAI_ADS_VALIDATE_ONLY === 'true',
      events: [event],
    }),
    signal: AbortSignal.timeout(OPENAI_ADS_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`OpenAI Ads CAPI returned HTTP ${response.status}.`);
  }
};

export const scheduleOpenAIAdsConversion = (
  context: OpenAIAdsNetlifyContext,
  createInput: () => OpenAIAdsConversionInput,
): void => {
  try {
    const task = Promise.resolve()
      .then(createInput)
      .then((input) => sendOpenAIAdsConversion(input, context))
      .catch(() => {
        // Keep conversion delivery separate from the verified lead/order response.
        console.warn('[openai-ads] Conversion delivery failed.');
      });
    context.waitUntil(task);
  } catch {
    // A missing platform context must never affect the core conversion flow.
    console.warn('[openai-ads] Conversion delivery could not be scheduled.');
  }
};
