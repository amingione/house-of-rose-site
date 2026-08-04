const REGENERATIVE_EDITORIAL_IMAGE = '/images/editorial/home/regenerative-skin-treatments.webp';
const INJECTABLES_EDITORIAL_IMAGE = '/images/editorial/home/injectables-consultation.webp';
const SKIN_HEALTH_EDITORIAL_IMAGE = '/images/editorial/home/skin-health-analysis.webp';
const WELLNESS_EDITORIAL_IMAGE = '/images/editorial/home/wellness-iv-hydration.webp';
const MICROCHANNELING_BANNER_IMAGE = '/images/banner/microchanneling/new-microchanneling.webp';
const BIOREPEEL_TREATMENT_IMAGE = '/images/editorial/advanced-facials/biorepeel-treatment.webp';
const INMODE_DEVICE_IMAGES: Record<string, string> = {
  morpheus8: '/images/optimized/morpheus8-device-800.webp',
  'lumecca-peak-ipl': '/images/optimized/lumecca-device-800.webp',
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
export const DEFAULT_COLLECTION_IMAGE = '/images/optimized/hor-skin-studio-800.webp';
export const DEFAULT_PACKAGE_IMAGE = '/images/optimized/hor-lobby-800.webp';
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
  biorepeel: BIOREPEEL_TREATMENT_IMAGE,
  'biorepeel-body': BIOREPEEL_TREATMENT_IMAGE,
  'biorepeel-advanced-acne-scarring': BIOREPEEL_TREATMENT_IMAGE,
  'biorepeel-gold-spot-treatment': BIOREPEEL_TREATMENT_IMAGE,
  'neck-decollete-extension': '/images/optimized/hor-skin-studio-800.webp',
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

/** A deliberately selected real-practice, treatment, or accurate device image. */
export const getCuratedServiceImage = (slug: string): string | undefined =>
  SERVICE_IMAGES[slug];

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

const SERVICE_RESULTS: Record<string, ClinicalResultImage[]> = {
  'acne-bootcamp': FACE_REALITY_CLINICAL_RESULTS,
  'face-reality-acne-program': FACE_REALITY_CLINICAL_RESULTS,
  'face-reality-acne-treatment': FACE_REALITY_CLINICAL_RESULTS,
};

/** Clinical before/after proof gallery for a service, or [] when none applies. */
export const getServiceResultImages = (slug: string): ClinicalResultImage[] =>
  SERVICE_RESULTS[slug] ?? [];
