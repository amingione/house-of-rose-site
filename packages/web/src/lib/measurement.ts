export type ConsentSignal = 'granted' | 'denied';

export interface ConsentStateV1 {
  schemaVersion: 1;
  policyVersion: '2026-07-24';
  analytics_storage: ConsentSignal;
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
  source: 'banner' | 'preferences' | 'gpc';
  recordedAt: string;
  expiresAt: string;
}

export interface AttributionContext {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landingPage: string;
  referrer?: string;
  consentSnapshot: ConsentStateV1;
}

export interface RetailItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  index?: number;
  item_list_id?: string;
  item_list_name?: string;
}

type EcommerceEventName =
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info';

export type MeasurementEvent =
  | {
      event: 'page_view';
      page_path: string;
      page_location: string;
      page_title: string;
    }
  | {
      event: EcommerceEventName;
      ecommerce: {
        currency: 'USD';
        value?: number;
        items: RetailItem[];
        shipping_tier?: string;
        payment_type?: string;
      };
    }
  | {
      event: 'purchase';
      ecommerce: {
        transaction_id: string;
        currency: 'USD';
        value: number;
        tax: number;
        shipping: number;
        discount?: number;
        items: RetailItem[];
      };
    }
  | {
      event: 'generate_lead';
      event_id: string;
    }
  | {
      event: 'phone_click' | 'sms_click' | 'booking_click';
      link_location: string;
      service_slug?: string;
      booking_mode?: 'direct' | 'consultation' | 'phone';
      cta_location?: string;
    }
  | {
      event: 'consent_update';
      consent: Pick<
        ConsentStateV1,
        'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization' | 'policyVersion'
      >;
    };

export interface GoogleAccountTargets {
  /**
   * PENDING. House of Rose has no live Google Ads account — the onboarding flow
   * was never completed. Verified accounts on ambermingione@gmail.com (2026-07-28):
   *   230-991-0049  Amber MG            manager / MCC → GOOGLE_ADS_LOGIN_CUSTOMER_ID
   *   803-936-8488  FAS Motorsports
   *   704-392-4923  (cancelled)
   * The previous literal '492-149-3013' matched none of these. Pin a literal here
   * once the House of Rose account exists; until then offline imports fail closed
   * on an unset GOOGLE_ADS_CUSTOMER_ID.
   */
  googleAdsCustomerId?: string;
  /** Verified 2026-07-28 in account 203932451. */
  ga4PropertyId: '534881520';
  /** Verified 2026-07-28 on data stream 14603824376 — data flowing. */
  ga4MeasurementId: 'G-QBDHB89WTR';
  gtmContainerId?: `GTM-${string}`;
  merchantCenterId?: string;
}

interface MeasurementWindow extends Window {
  dataLayer: Array<Record<string, unknown> | IArguments>;
  gtag: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  oaiq?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  _fbq?: unknown;
  __horMeasurementConfig?: {
    ahrefsKey?: string;
    metaPixelId?: string;
    openAIAdsPixelId?: string;
    gtmContainerId?: string;
    gtmMeasurementPath?: string;
  };
  __horLoadedScripts?: Set<string>;
  __horAhrefsInitialized?: boolean;
  __horOpenAIAdsInitialized?: boolean;
  __horLastPageView?: string;
  __horLastMetaPageView?: string;
  __horGtmInitialized?: boolean;
}

interface OpenAIAdsContent {
  id?: string;
  name?: string;
  content_type?: 'page' | 'product';
  quantity?: number;
  amount?: number;
  currency?: 'USD';
}

interface OpenAIAdsEvent {
  name:
    | 'page_viewed'
    | 'contents_viewed'
    | 'items_added'
    | 'checkout_started'
    | 'order_created'
    | 'lead_created';
  data:
    | {
        type: 'contents';
        amount?: number;
        currency?: 'USD';
        contents?: OpenAIAdsContent[];
      }
    | {
        type: 'customer_action';
      };
  eventId?: string;
}

const CONSENT_STORAGE_KEY = 'hor.consent.v1';
const ATTRIBUTION_STORAGE_KEY = 'hor.attribution.v1';
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;
const MAX_ATTRIBUTION_LENGTH = 300;
const attributionKeys = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const browser = (): MeasurementWindow => window as unknown as MeasurementWindow;

const isLocalMeasurementHost = (): boolean => {
  const hostname = location.hostname.toLowerCase();
  return hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1' || hostname === '::1';
};

const sanitize = (value: string | null | undefined): string | undefined => {
  const cleaned = value
    ? [...value.trim()]
        .filter((character) => {
          const codePoint = character.codePointAt(0) ?? 0;
          return codePoint >= 32 && codePoint !== 127;
        })
        .join('')
        .slice(0, MAX_ATTRIBUTION_LENGTH)
    : undefined;
  return cleaned || undefined;
};

export const createConsentState = (
  input: Pick<ConsentStateV1, 'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization'>,
  source: ConsentStateV1['source'],
  gpc: boolean,
  now = new Date(),
): ConsentStateV1 => {
  return {
    schemaVersion: 1,
    policyVersion: '2026-07-24',
    analytics_storage: input.analytics_storage,
    ad_storage: gpc ? 'denied' : input.ad_storage,
    ad_user_data: gpc ? 'denied' : input.ad_user_data,
    ad_personalization: gpc ? 'denied' : input.ad_personalization,
    source: gpc ? 'gpc' : source,
    recordedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CONSENT_DURATION_MS).toISOString(),
  };
};

const deniedConsent = (source: ConsentStateV1['source'] = 'banner'): ConsentStateV1 =>
  createConsentState(
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
    source,
    source === 'gpc',
  );

const isConsentState = (value: unknown): value is ConsentStateV1 => {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ConsentStateV1>;
  return (
    state.schemaVersion === 1 &&
    state.policyVersion === '2026-07-24' &&
    ['granted', 'denied'].includes(state.analytics_storage ?? '') &&
    ['granted', 'denied'].includes(state.ad_storage ?? '') &&
    ['granted', 'denied'].includes(state.ad_user_data ?? '') &&
    ['granted', 'denied'].includes(state.ad_personalization ?? '') &&
    typeof state.expiresAt === 'string' &&
    Date.parse(state.expiresAt) > Date.now()
  );
};

export const getConsent = (): ConsentStateV1 => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? 'null');
    if (isConsentState(parsed)) return parsed;
  } catch {
    // Invalid or unavailable storage falls back to denied.
  }
  return deniedConsent(navigator.globalPrivacyControl ? 'gpc' : 'banner');
};

export const hasStoredConsent = (): boolean => {
  try {
    return isConsentState(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? 'null') as unknown);
  } catch {
    return false;
  }
};

const loadScript = (id: string, src: string): void => {
  const w = browser();
  w.__horLoadedScripts ??= new Set<string>();
  if (w.__horLoadedScripts.has(id) || document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.append(script);
  w.__horLoadedScripts.add(id);
};

const loadGoogleTagManager = (consent: ConsentStateV1): void => {
  const w = browser();
  const containerId = w.__horMeasurementConfig?.gtmContainerId;
  const measurementPath = w.__horMeasurementConfig?.gtmMeasurementPath;
  const hasMeasurementConsent =
    consent.analytics_storage === 'granted' || consent.ad_storage === 'granted';
  if (
    isLocalMeasurementHost() ||
    !hasMeasurementConsent ||
    w.__horGtmInitialized ||
    !containerId ||
    !/^GTM-[A-Z0-9]+$/.test(containerId) ||
    !measurementPath ||
    !/^\/[A-Za-z0-9_-]+\/$/.test(measurementPath)
  ) return;

  w.__horGtmInitialized = true;
  w.dataLayer ??= [];
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  loadScript('hor-google-tag-manager', `${measurementPath}?id=${encodeURIComponent(containerId)}`);
};

export const loadAhrefs = (consent: ConsentStateV1): void => {
  const w = browser();
  const key = w.__horMeasurementConfig?.ahrefsKey;
  if (
    isLocalMeasurementHost() ||
    consent.analytics_storage !== 'granted' ||
    !key ||
    w.__horAhrefsInitialized
  ) return;

  const id = 'hor-ahrefs-analytics';
  const existingScript =
    document.getElementById(id) ??
    document.querySelector<HTMLScriptElement>('script[src^="https://analytics.ahrefs.com/analytics.js"]');
  if (existingScript) {
    w.__horAhrefsInitialized = true;
    return;
  }

  // Dev HMR can re-run component modules while the same Window (and Ahrefs
  // runtime) survives. Mark the vendor initialized before insertion so
  // concurrent/replayed lifecycle hooks cannot append analytics.js twice.
  w.__horAhrefsInitialized = true;
  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://analytics.ahrefs.com/analytics.js';
  script.dataset.key = key;
  script.async = true;
  document.head.append(script);
};

export const loadMeta = (consent: ConsentStateV1): void => {
  const pixelId = browser().__horMeasurementConfig?.metaPixelId;
  if (consent.ad_storage !== 'granted' || consent.ad_personalization !== 'granted' || !pixelId) return;
  const w = browser();
  if (!w.fbq) {
    const queue = ((...args: unknown[]) => {
      if ('callMethod' in queue && typeof queue.callMethod === 'function') {
        queue.callMethod(...args);
      } else {
        queue.queue.push(args);
      }
    }) as MeasurementWindow['fbq'] & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[][];
      loaded: boolean;
      version: string;
    };
    queue.queue = [];
    queue.loaded = true;
    queue.version = '2.0';
    w.fbq = queue;
    w._fbq = queue;
    loadScript('hor-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', pixelId);
  }
  const pageKey = `${location.pathname}${location.search}`;
  if (w.__horLastMetaPageView !== pageKey) {
    w.__horLastMetaPageView = pageKey;
    w.fbq?.('track', 'PageView');
  }
};

const loadOpenAIAds = (consent: ConsentStateV1): void => {
  const w = browser();
  const pixelId = w.__horMeasurementConfig?.openAIAdsPixelId;
  if (consent.ad_storage !== 'granted' || !pixelId) {
    w.oaiq?.('consent', false);
    return;
  }

  if (!w.oaiq) {
    const queue = ((...args: unknown[]) => {
      queue.q?.push(args);
    }) as NonNullable<MeasurementWindow['oaiq']>;
    queue.q = [];
    w.oaiq = queue;
  }

  w.oaiq('consent', true);
  if (!w.__horOpenAIAdsInitialized) {
    w.__horOpenAIAdsInitialized = true;
    loadScript('hor-openai-ads-pixel', 'https://bzrcdn.openai.com/sdk/oaiq.min.js');
    w.oaiq('init', { pixelId });
  }
};

const toMinorUnits = (value: number | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.round(value * 100))
    : undefined;

const toOpenAIAdsContents = (items: RetailItem[]): OpenAIAdsContent[] =>
  items.map((item) => ({
    id: item.item_id || undefined,
    name: item.item_name || undefined,
    content_type: 'product',
    quantity:
      typeof item.quantity === 'number' && Number.isFinite(item.quantity)
        ? Math.max(1, Math.round(item.quantity))
        : undefined,
    amount: toMinorUnits(item.price),
    currency: typeof item.price === 'number' ? 'USD' : undefined,
  }));

const toOpenAIAdsEvent = (event: MeasurementEvent): OpenAIAdsEvent | undefined => {
  if (event.event === 'page_view') {
    return {
      name: 'page_viewed',
      data: {
        type: 'contents',
        contents: [{
          id: event.page_path.split('?')[0] || '/',
          name: event.page_title,
          content_type: 'page',
        }],
      },
    };
  }

  if (event.event === 'view_item_list' || event.event === 'view_item') {
    return {
      name: 'contents_viewed',
      data: {
        type: 'contents',
        amount: toMinorUnits(event.ecommerce.value),
        ...(typeof event.ecommerce.value === 'number' ? { currency: 'USD' as const } : {}),
        contents: toOpenAIAdsContents(event.ecommerce.items),
      },
    };
  }

  if (event.event === 'add_to_cart') {
    return {
      name: 'items_added',
      data: {
        type: 'contents',
        amount: toMinorUnits(event.ecommerce.value),
        ...(typeof event.ecommerce.value === 'number' ? { currency: 'USD' as const } : {}),
        contents: toOpenAIAdsContents(event.ecommerce.items),
      },
    };
  }

  if (event.event === 'begin_checkout') {
    return {
      name: 'checkout_started',
      data: {
        type: 'contents',
        amount: toMinorUnits(event.ecommerce.value),
        ...(typeof event.ecommerce.value === 'number' ? { currency: 'USD' as const } : {}),
        contents: toOpenAIAdsContents(event.ecommerce.items),
      },
    };
  }

  if (event.event === 'purchase') {
    return {
      name: 'order_created',
      data: {
        type: 'contents',
        amount: toMinorUnits(event.ecommerce.value),
        currency: 'USD',
        contents: toOpenAIAdsContents(event.ecommerce.items),
      },
      eventId: event.ecommerce.transaction_id,
    };
  }

  if (event.event === 'generate_lead') {
    return {
      name: 'lead_created',
      data: { type: 'customer_action' },
      eventId: event.event_id,
    };
  }

  return undefined;
};

const dispatchOpenAIAdsMeasurement = (event: MeasurementEvent): void => {
  try {
    const consent = getConsent();
    if (consent.ad_storage !== 'granted') return;
    loadOpenAIAds(consent);
    const measurement = toOpenAIAdsEvent(event);
    const oaiq = browser().oaiq;
    if (!measurement || !oaiq) return;

    const options = {
      ...(measurement.eventId ? { event_id: measurement.eventId } : {}),
      ...(consent.ad_personalization === 'granted' ? {} : { opt_out: true }),
    };
    if (Object.keys(options).length) {
      oaiq('measure', measurement.name, measurement.data, options);
    } else {
      oaiq('measure', measurement.name, measurement.data);
    }
  } catch {
    // Measurement is best-effort and must never affect the user flow.
  }
};

const trackCurrentOpenAIAdsPageView = (): void => {
  dispatchOpenAIAdsMeasurement({
    event: 'page_view',
    page_path: `${location.pathname}${location.search}`,
    page_location: location.href,
    page_title: document.title,
  });
};

export const updateOpenAIAdsUser = async (input: {
  email?: string;
  emailSha256?: string;
}): Promise<void> => {
  try {
    const consent = getConsent();
    if (consent.ad_storage !== 'granted' || consent.ad_user_data !== 'granted') return;
    loadOpenAIAds(consent);

    let emailSha256 = input.emailSha256?.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(emailSha256 ?? '')) {
      const email = input.email?.trim().toLowerCase();
      if (!email) return;
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email));
      emailSha256 = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    browser().oaiq?.('init', {
      user: {
        email_sha256: emailSha256,
      },
    });
  } catch {
    // User matching is optional and must never block the conversion.
  }
};

const capturePostHogMeasurement = (event: MeasurementEvent): void => {
  switch (event.event) {
    case 'select_item':
    case 'add_to_cart':
    case 'remove_from_cart':
    case 'view_cart':
    case 'begin_checkout':
    case 'add_shipping_info':
    case 'add_payment_info':
    case 'purchase':
    case 'generate_lead':
    case 'phone_click':
    case 'sms_click':
    case 'booking_click': {
      const { event: eventName, ...properties } = event;
      window.posthog?.capture(eventName, properties);
      break;
    }
    default:
      // PostHog autocapture covers pageviews; consent state is not a conversion action.
      break;
  }
};

export const dispatchMeasurement = (event: MeasurementEvent): void => {
  const w = browser();
  w.dataLayer ??= [];
  w.dataLayer.push(event);
  capturePostHogMeasurement(event);
  dispatchOpenAIAdsMeasurement(event);
};

export const applyConsent = (
  input: Pick<ConsentStateV1, 'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization'>,
  source: ConsentStateV1['source'],
): ConsentStateV1 => {
  const previous = getConsent();
  const now = new Date();
  const gpc = navigator.globalPrivacyControl === true;
  const consent = createConsentState(input, source, gpc, now);
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  attachAttributionToLeadForms();
  browser().gtag('consent', 'update', {
    analytics_storage: consent.analytics_storage,
    ad_storage: consent.ad_storage,
    ad_user_data: consent.ad_user_data,
    ad_personalization: consent.ad_personalization,
  });
  dispatchMeasurement({
    event: 'consent_update',
    consent: {
      analytics_storage: consent.analytics_storage,
      ad_storage: consent.ad_storage,
      ad_user_data: consent.ad_user_data,
      ad_personalization: consent.ad_personalization,
      policyVersion: consent.policyVersion,
    },
  });
  loadAhrefs(consent);
  loadGoogleTagManager(consent);
  loadMeta(consent);
  loadOpenAIAds(consent);
  if (previous.ad_storage !== 'granted' && consent.ad_storage === 'granted') {
    trackCurrentOpenAIAdsPageView();
  }
  window.dispatchEvent(new CustomEvent('hor:consent-updated', { detail: consent }));
  const revokedVendorConsent =
    (previous.analytics_storage === 'granted' && consent.analytics_storage === 'denied') ||
    (
      (previous.ad_storage === 'granted' || previous.ad_personalization === 'granted') &&
      (consent.ad_storage === 'denied' || consent.ad_personalization === 'denied')
    );
  if (revokedVendorConsent) {
    // Non-Google scripts cannot reliably be unloaded. A clean reload ensures they
    // are absent for all future collection after a visitor withdraws permission.
    window.setTimeout(() => window.location.reload(), 50);
  }
  return consent;
};

export const parseAttributionParameters = (
  incoming: URLSearchParams,
): Partial<Pick<AttributionContext, (typeof attributionKeys)[number]>> =>
  Object.fromEntries(
    attributionKeys.flatMap((key) => {
      const value = sanitize(incoming.get(key));
      return value ? [[key, value]] : [];
    }),
  );

export const captureAttribution = (): AttributionContext => {
  const incoming = new URLSearchParams(location.search);
  let stored: Partial<AttributionContext> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '{}') as Partial<AttributionContext>;
  } catch {
    stored = {};
  }

  Object.assign(stored, parseAttributionParameters(incoming));
  stored.landingPage ??= sanitize(`${location.pathname}${location.search}`) ?? location.pathname;
  stored.referrer ??= sanitize(document.referrer);

  const context: AttributionContext = {
    ...stored,
    landingPage: stored.landingPage ?? location.pathname,
    consentSnapshot: getConsent(),
  };
  sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(context));
  return context;
};

export const attachAttributionToLeadForms = (): void => {
  const attribution = captureAttribution();
  const values: Record<string, string | undefined> = {
    gclid: attribution.gclid,
    gbraid: attribution.gbraid,
    wbraid: attribution.wbraid,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    'landing-page': attribution.landingPage,
    referrer: attribution.referrer,
    'consent-snapshot': JSON.stringify(attribution.consentSnapshot),
  };
  for (const form of document.querySelectorAll<HTMLFormElement>(
    'form[action="/.netlify/functions/lead-submit"]',
  )) {
    for (const [name, value] of Object.entries(values)) {
      if (!value) continue;
      let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.append(input);
      }
      input.value = value;
    }

    // Mirror this submission into Netlify Forms so it also appears in the Netlify
    // dashboard. Additive only — the native POST to lead-submit (Sanity CRM, owner
    // + client emails, conversion receipt, thank-you redirect) is untouched. The
    // keepalive fetch completes even as the page navigates away.
    if (!form.dataset.netlifyMirror) {
      form.dataset.netlifyMirror = '1';
      form.addEventListener('submit', () => {
        try {
          const entries: string[][] = [];
          for (const [key, val] of new FormData(form)) entries.push([key, String(val)]);
          void fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(entries).toString(),
            keepalive: true,
          }).catch(() => {});
        } catch {
          /* best-effort mirror; never blocks the native submission */
        }
      });
    }
  }
};

export const trackPageView = (): void => {
  const w = browser();
  const key = `${location.pathname}${location.search}|${document.title}`;
  if (w.__horLastPageView === key) return;
  w.__horLastPageView = key;
  dispatchMeasurement({
    event: 'page_view',
    page_path: `${location.pathname}${location.search}`,
    page_location: location.href,
    page_title: document.title,
  });
};

export const initializeConsentAwareVendors = (): void => {
  const consent = getConsent();
  browser().gtag('consent', 'update', {
    analytics_storage: consent.analytics_storage,
    ad_storage: consent.ad_storage,
    ad_user_data: consent.ad_user_data,
    ad_personalization: consent.ad_personalization,
  });
  loadAhrefs(consent);
  loadGoogleTagManager(consent);
  loadMeta(consent);
  loadOpenAIAds(consent);
};

declare global {
  interface Navigator {
    readonly globalPrivacyControl?: boolean;
  }
}
