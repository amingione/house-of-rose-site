const REGENERATIVE_EDITORIAL_IMAGE = '/images/editorial/home/regenerative-skin-treatments.webp';
const INJECTABLES_EDITORIAL_IMAGE = '/images/editorial/home/injectables-consultation.webp';
const SKIN_HEALTH_EDITORIAL_IMAGE = '/images/editorial/home/skin-health-analysis.webp';
const WELLNESS_EDITORIAL_IMAGE = '/images/editorial/home/wellness-iv-hydration.webp';
const MICROCHANNELING_BANNER_IMAGE = '/images/banner/microchanneling/new-microchanneling.webp';
const INMODE_DEVICE_IMAGES: Record<string, string> = {
  morpheus8: '/images/inmode/Morpheus8-Burst.png',
  'lumecca-peak-ipl': '/images/inmode/Lumecca-Peak.png',
  'forma-rf-facial': '/images/inmode/Forma-handpiece-space.png',
};

const INMODE_EVIDENCE_IMAGES: Record<string, string> = {
  'morpheus8-device': '/images/inmode/Morpheus8-Burst.png',
  'morpheus8-face-example':
    '/images/inmode/EsmeMedspa_Morpheus8_BeforeAfter_4Treatments_Front-TM.jpg',
  'morpheus8-abdomen-example':
    '/images/inmode/NB_M8B_BeforeAfter_24Weeks_Abd_Zoomed-TM.jpg',
  'morpheus8-buttocks-example':
    '/images/inmode/Morpheus8-Burst-Deep-Before-and-After-Buttocks.png',
  'lumecca-device': '/images/inmode/Lumecca-Peak.png',
  'lumecca-face-example':
    '/images/inmode/Lumecca-Peak-Before-and-After.png',
  'forma-device': '/images/inmode/Forma-handpiece-space.png',
  'forma-profile-example': '/images/inmode/HO1_Forma_Website.jpg',
  'forma-front-example': '/images/inmode/HO2_Forma_Website.jpg',
};

// Face Reality brand assets (from docs/Face Reality — Branded Assets 2026).
// Amber is a Face Reality Certified Acne Specialist, so the acne-program pages
// lead with genuine Face Reality imagery rather than generic studio stock.
const FACE_REALITY_SYSTEM_IMAGE = '/images/face-reality/clear-skin-system.webp';

export const DEFAULT_SERVICE_IMAGE = SKIN_HEALTH_EDITORIAL_IMAGE;
export const DEFAULT_COLLECTION_IMAGE = '/images/hor-skin-studio.webp';
export const DEFAULT_PACKAGE_IMAGE = '/images/hor-lobby.webp';
export const DEFAULT_PRODUCT_IMAGE = '/images/banner/background/background-rose.webp';
export const DEFAULT_JOURNAL_IMAGE = '/images/banner/background/background-rose.webp';
export const DEFAULT_AREA_IMAGE = '/images/hor-exterior.webp';

const SERVICE_IMAGES: Record<string, string> = {
  injectables: INJECTABLES_EDITORIAL_IMAGE,
  'dermal-fillers': INJECTABLES_EDITORIAL_IMAGE,
  'ez-gel-bio-filler': INJECTABLES_EDITORIAL_IMAGE,
  'injectables-bio-fillers': INJECTABLES_EDITORIAL_IMAGE,
  'prf-injections': INJECTABLES_EDITORIAL_IMAGE,
  'iv-hydration-therapy': WELLNESS_EDITORIAL_IMAGE,
  'glp-1-weight-management': WELLNESS_EDITORIAL_IMAGE,
  wellness: WELLNESS_EDITORIAL_IMAGE,
  'body-waxing': SKIN_HEALTH_EDITORIAL_IMAGE,
  'facial-waxing': SKIN_HEALTH_EDITORIAL_IMAGE,
  dermaplaning: SKIN_HEALTH_EDITORIAL_IMAGE,
  'face-reality-acne-program': FACE_REALITY_SYSTEM_IMAGE,
  'acne-bootcamp': FACE_REALITY_SYSTEM_IMAGE,
  'face-reality-acne-treatment': FACE_REALITY_SYSTEM_IMAGE,
  'acne-peel': SKIN_HEALTH_EDITORIAL_IMAGE,
  glo2facial: SKIN_HEALTH_EDITORIAL_IMAGE,
  'back-treatment': SKIN_HEALTH_EDITORIAL_IMAGE,
  'lightstim-led-therapy': SKIN_HEALTH_EDITORIAL_IMAGE,
  prf: REGENERATIVE_EDITORIAL_IMAGE,
  'prf-microneedling': REGENERATIVE_EDITORIAL_IMAGE,
  microchanneling: REGENERATIVE_EDITORIAL_IMAGE,
  microneedling: REGENERATIVE_EDITORIAL_IMAGE,
  'microneedling-corrective': REGENERATIVE_EDITORIAL_IMAGE,
  'microneedling-body': REGENERATIVE_EDITORIAL_IMAGE,
  'prf-body-treatments': REGENERATIVE_EDITORIAL_IMAGE,
  'procell-microchanneling-body': REGENERATIVE_EDITORIAL_IMAGE,
  morpheus8: INMODE_DEVICE_IMAGES.morpheus8,
  'lumecca-peak-ipl': INMODE_DEVICE_IMAGES['lumecca-peak-ipl'],
  'forma-rf-facial': INMODE_DEVICE_IMAGES['forma-rf-facial'],
  biorepeel: REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-body': REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-advanced-acne-scarring': REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-gold-spot-treatment': REGENERATIVE_EDITORIAL_IMAGE,
  'neck-decollete-extension': '/images/hor-skin-studio.webp',
  'permanent-jewelry': '/images/banner/background/background-rose.webp',
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

export const getInModeDeviceImage = (slug: string): string | undefined =>
  INMODE_DEVICE_IMAGES[slug];

export const getInModeEvidenceImage = (key: string): string | undefined =>
  INMODE_EVIDENCE_IMAGES[key];

export const getCollectionFallbackImage = (slug: string): string => {
  const value = slug.toLowerCase();
  if (value.includes('microchannel') || value.includes('microneedl')) {
    return MICROCHANNELING_BANNER_IMAGE;
  }
  if (value.includes('inject')) return INJECTABLES_EDITORIAL_IMAGE;
  if (value.includes('wellness') || value.includes('iv')) return WELLNESS_EDITORIAL_IMAGE;
  if (value.includes('skin') || value.includes('facial')) return SKIN_HEALTH_EDITORIAL_IMAGE;
  return DEFAULT_COLLECTION_IMAGE;
};

export interface ClinicalResultImage {
  src: string;
  alt: string;
}

/**
 * Face Reality Clear Skin Method clinical before/after images (unretouched,
 * Week 1 → Week 16), shown as a proof band on the acne-program pages. These are
 * self-contained branded graphics with captions baked in, so they render in a
 * gallery — never behind the hero scrim. Source: docs/Face Reality/Branded Assets.
 */
const FACE_REALITY_CLINICAL_RESULTS: ClinicalResultImage[] = [1, 2, 3, 4, 5].map((n) => ({
  src: `/images/face-reality/clinical-results-${String(n).padStart(2, '0')}.webp`,
  alt: `Face Reality Clear Skin Method clinical results — acne before (Week 1) and after (Week 16), case ${n}`,
}));

// InMode clinical before/after imagery. These are manufacturer / InMode-network
// examples (watermarked to the treating provider), NOT House of Rose clients — so
// they are ALWAYS shown with the illustrative credit below and never implied to be
// our own results. Swap in genuine consented House of Rose photos when available.
const INMODE_ILLUSTRATIVE_CREDIT =
  'Clinical images courtesy of InMode — illustrative of typical treatment goals, not House of Rose clients. Individual results vary.';

const MORPHEUS8_FACE_RESULTS: ClinicalResultImage[] = [
  {
    src: '/images/inmode/EsmeMedspa_Morpheus8_BeforeAfter_4Treatments_Front-TM.jpg',
    alt: 'Morpheus8 RF microneedling before and after over four treatments — illustrative clinical result',
  },
];

const MORPHEUS8_BODY_RESULTS: ClinicalResultImage[] = [
  {
    src: '/images/inmode/NB_M8B_BeforeAfter_24Weeks_Abd_Zoomed-TM.jpg',
    alt: 'Morpheus8 Body before and after on the abdomen at 24 weeks — illustrative clinical result',
  },
  {
    src: '/images/inmode/Morpheus8-Burst-Deep-Before-and-After-Buttocks.png',
    alt: 'Morpheus8 Body Burst Deep before and after on the buttocks — illustrative clinical result',
  },
];

const FORMA_RESULTS: ClinicalResultImage[] = [
  {
    src: '/images/inmode/Forma-Before-and-After.png',
    alt: 'Forma RF skin tightening before and after on the jawline and neck — illustrative clinical result',
  },
];

const LUMECCA_RESULTS: ClinicalResultImage[] = [
  {
    src: '/images/inmode/Lumecca-Peak-Before-and-After.png',
    alt: 'Lumecca Peak IPL photofacial before and after clearing sun spots and pigmentation — illustrative clinical result',
  },
];

const SERVICE_RESULTS: Record<string, ClinicalResultImage[]> = {
  'acne-bootcamp': FACE_REALITY_CLINICAL_RESULTS,
  'face-reality-acne-program': FACE_REALITY_CLINICAL_RESULTS,
  'face-reality-acne-treatment': FACE_REALITY_CLINICAL_RESULTS,
  morpheus8: MORPHEUS8_FACE_RESULTS,
  'morpheus8-body': MORPHEUS8_BODY_RESULTS,
  'forma-rf-facial': FORMA_RESULTS,
  'lumecca-peak-ipl': LUMECCA_RESULTS,
};

export interface ServiceResultMeta {
  heading: string;
  intro: string;
  credit: string;
}

const FACE_REALITY_RESULT_META: ServiceResultMeta = {
  heading: 'The Face Reality Clear Skin Method',
  intro:
    'Unretouched Week 1 to Week 16 results from the Face Reality clinical study — the same customized professional and home-care method used in-studio. Individual results vary with adherence to protocol.',
  credit: 'Images © Face Reality Skincare · Clear Skin Method™ clinical study',
};

const SERVICE_RESULT_META: Record<string, ServiceResultMeta> = {
  'acne-bootcamp': FACE_REALITY_RESULT_META,
  'face-reality-acne-program': FACE_REALITY_RESULT_META,
  'face-reality-acne-treatment': FACE_REALITY_RESULT_META,
  morpheus8: {
    heading: 'What Morpheus8 Can Do',
    intro:
      'Illustrative Morpheus8 RF microneedling results — tighter, smoother, more refined skin built over a treatment series. Your own plan and candidacy are confirmed at consultation.',
    credit: INMODE_ILLUSTRATIVE_CREDIT,
  },
  'morpheus8-body': {
    heading: 'What Morpheus8 Body Can Do',
    intro:
      'Illustrative Morpheus8 Body results — firmer, tighter skin on the abdomen and body, a popular non-surgical option after major weight loss. Individual results vary.',
    credit: INMODE_ILLUSTRATIVE_CREDIT,
  },
  'forma-rf-facial': {
    heading: 'What Forma Can Do',
    intro:
      'Illustrative Forma RF results — a firmer, more lifted jawline and neck with no downtime. Your own plan is confirmed at consultation.',
    credit: INMODE_ILLUSTRATIVE_CREDIT,
  },
  'lumecca-peak-ipl': {
    heading: 'What Lumecca IPL Can Do',
    intro:
      'Illustrative Lumecca Peak IPL results — clearer, more even tone with sun spots and pigmentation visibly reduced, often in just a few sessions. Individual results vary.',
    credit: INMODE_ILLUSTRATIVE_CREDIT,
  },
};

/** Clinical before/after proof gallery for a service, or [] when none applies. */
export const getServiceResultImages = (slug: string): ClinicalResultImage[] =>
  SERVICE_RESULTS[slug] ?? [];

/** Heading/intro/credit for the results band, or undefined when the service has none. */
export const getServiceResultMeta = (slug: string): ServiceResultMeta | undefined =>
  SERVICE_RESULT_META[slug];
