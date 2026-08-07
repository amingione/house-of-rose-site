// Fallbacks must be a verified House of Rose photograph, a real treatment result,
// or an appropriate manufacturer/device asset. Never reintroduce generic models or
// generated treatment scenes here: this module feeds cards, heroes, social images,
// collections, packages, and empty Sanity image fields across the site.
const ACTUAL_RECEPTION_IMAGE = '/images/optimized/actual-reception-1400.webp';
const ACTUAL_WELCOME_IMAGE = '/images/optimized/actual-welcome-1400.webp';
const ACTUAL_IV_SUITE_IMAGE = '/images/optimized/actual-iv-suite-1400.webp';
const ACTUAL_STOREFRONT_IMAGE = '/images/optimized/actual-storefront-1000.webp';
const GLO2_COMPANY_IMAGE = '/images/optimized/glo2facial-company-600.webp';
const GLO2_RESULT_IMAGE = '/images/optimized/glo2facial-before-after-1400.webp';
const PROCELL_HOUSE_IMAGE = '/images/optimized/procell-house-of-rose-800.webp';
const BIOREPEEL_PRODUCT_IMAGE = '/images/optimized/biorepeel-products-800.webp';
const DERMAL_FILLER_IMAGE = '/images/optimized/dermal-fillers-800.webp';
const INMODE_DEVICE_IMAGES: Record<string, string> = {
  morpheus8: '/images/optimized/morpheus8-device-800.webp',
  'morpheus8-body': '/images/inmode/Morpheus8-Burst-Deep-body.png',
  'lumecca-peak-ipl': '/images/optimized/lumecca-device-800.webp',
  'forma-rf-facial': '/images/inmode/Forma-handpiece-space.png',
};

const INMODE_EVIDENCE_IMAGES: Record<string, string> = {
  'morpheus8-device': '/images/inmode/Morpheus8-Burst.png',
  'lumecca-device': '/images/inmode/Lumecca-Peak.png',
  'lumecca-face-example':
    '/images/inmode/Lumecca-Peak-Before-and-After.png',
  'forma-device': '/images/inmode/Forma-handpiece-space.png',
};

// Face Reality brand assets (from docs/Face Reality — Branded Assets 2026).
// Amber is a Face Reality Certified Acne Specialist, so the acne-program pages
// lead with genuine Face Reality imagery rather than generic studio stock.
const FACE_REALITY_SYSTEM_IMAGE = '/images/face-reality/clear-skin-system.webp';

export const DEFAULT_SERVICE_IMAGE = ACTUAL_RECEPTION_IMAGE;
export const DEFAULT_COLLECTION_IMAGE = ACTUAL_RECEPTION_IMAGE;
export const DEFAULT_PACKAGE_IMAGE = ACTUAL_WELCOME_IMAGE;
export const DEFAULT_PRODUCT_IMAGE = '/images/houseOfRoseAesthetics.webp';
export const DEFAULT_JOURNAL_IMAGE = ACTUAL_WELCOME_IMAGE;
export const DEFAULT_AREA_IMAGE = ACTUAL_STOREFRONT_IMAGE;

const SERVICE_IMAGES: Record<string, string> = {
  injectables: ACTUAL_RECEPTION_IMAGE,
  'dermal-fillers': DERMAL_FILLER_IMAGE,
  'ez-gel-bio-filler': ACTUAL_RECEPTION_IMAGE,
  'injectables-bio-fillers': DERMAL_FILLER_IMAGE,
  'prf-injections': ACTUAL_RECEPTION_IMAGE,
  'iv-hydration-therapy': ACTUAL_IV_SUITE_IMAGE,
  'glp-1-weight-management': ACTUAL_RECEPTION_IMAGE,
  wellness: ACTUAL_IV_SUITE_IMAGE,
  'body-waxing': ACTUAL_WELCOME_IMAGE,
  'facial-waxing': ACTUAL_WELCOME_IMAGE,
  dermaplaning: ACTUAL_WELCOME_IMAGE,
  'face-reality-acne-program': FACE_REALITY_SYSTEM_IMAGE,
  'acne-bootcamp': FACE_REALITY_SYSTEM_IMAGE,
  'face-reality-acne-treatment': FACE_REALITY_SYSTEM_IMAGE,
  'acne-peel': FACE_REALITY_SYSTEM_IMAGE,
  glo2facial: GLO2_COMPANY_IMAGE,
  'glo2facial-prf': GLO2_COMPANY_IMAGE,
  'glo2facial-procell-md': PROCELL_HOUSE_IMAGE,
  'glo2facial-procell-pro': PROCELL_HOUSE_IMAGE,
  'back-treatment': ACTUAL_WELCOME_IMAGE,
  'lightstim-led-therapy': ACTUAL_WELCOME_IMAGE,
  prf: ACTUAL_RECEPTION_IMAGE,
  'prf-fibrin-veil': ACTUAL_RECEPTION_IMAGE,
  'prf-microneedling': PROCELL_HOUSE_IMAGE,
  microneedling: PROCELL_HOUSE_IMAGE,
  'microneedling-body': PROCELL_HOUSE_IMAGE,
  'prf-body-treatments': ACTUAL_RECEPTION_IMAGE,
  morpheus8: INMODE_DEVICE_IMAGES.morpheus8,
  'morpheus8-body': '/images/inmode/Morpheus8-Burst-Deep-body.png',
  'lumecca-peak-ipl': INMODE_DEVICE_IMAGES['lumecca-peak-ipl'],
  'forma-rf-facial': INMODE_DEVICE_IMAGES['forma-rf-facial'],
  biorepeel: BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-body': BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-advanced-acne-scarring': BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-gold-spot-treatment': BIOREPEEL_PRODUCT_IMAGE,
  'neck-decollete-extension': ACTUAL_WELCOME_IMAGE,
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

/** A deliberately selected real-practice, treatment, or accurate device image. */
export const getCuratedServiceImage = (slug: string): string | undefined =>
  SERVICE_IMAGES[slug];

/**
 * Describe what the curated asset actually shows. Some assets are manufacturer
 * product photographs rather than treatment photography taken at House of Rose.
 */
export const getCuratedServiceImageAlt = (slug: string): string => {
  if (slug === 'glo2facial' || slug === 'glo2facial-prf') {
    return 'Glo2Facial company treatment overview showing the handpiece and treatment steps';
  }
  if (slug.startsWith('glo2facial-procell') || slug.includes('microneedling')) {
    return 'Procell Therapies products photographed at House of Rose Aesthetics';
  }
  if (slug === 'morpheus8') return 'Morpheus8 Burst RF microneedling handpiece';
  if (slug === 'morpheus8-body') return 'Morpheus8 Burst Deep body treatment handpiece';
  if (slug === 'lumecca-peak-ipl') return 'Lumecca Peak IPL treatment handpiece';
  if (slug === 'forma-rf-facial') return 'Forma radiofrequency facial handpiece';
  if (slug.startsWith('biorepeel')) return 'BioRePeelCl3 professional peel vials';
  if (slug === 'dermal-fillers' || slug === 'injectables-bio-fillers') {
    return 'Dermal filler product information';
  }
  if (slug.includes('acne')) return 'Face Reality Clear Skin System products';
  if (slug === 'iv-hydration-therapy' || slug === 'wellness') {
    return 'IV hydration treatment suite inside House of Rose Aesthetics';
  }
  if (['body-waxing', 'facial-waxing', 'dermaplaning', 'neck-decollete-extension', 'back-treatment', 'lightstim-led-therapy'].includes(slug)) {
    return 'Welcome area inside House of Rose Aesthetics';
  }
  return 'Reception area inside House of Rose Aesthetics';
};

const CONTAINED_SERVICE_IMAGES = new Set([
  'morpheus8',
  'morpheus8-body',
  'lumecca-peak-ipl',
  'forma-rf-facial',
]);

/** Transparent manufacturer handpieces need breathing room instead of an object-cover crop. */
export const serviceImageUsesContain = (slug: string): boolean =>
  CONTAINED_SERVICE_IMAGES.has(slug);

export const getInModeDeviceImage = (slug: string): string | undefined =>
  INMODE_DEVICE_IMAGES[slug];

export const getInModeEvidenceImage = (key: string): string | undefined =>
  INMODE_EVIDENCE_IMAGES[key];

export const getCollectionFallbackImage = (slug: string): string => {
  const value = slug.toLowerCase();
  if (value.includes('microchannel') || value.includes('microneedl')) {
    return PROCELL_HOUSE_IMAGE;
  }
  if (value.includes('inject')) return ACTUAL_RECEPTION_IMAGE;
  if (value.includes('wellness') || value.includes('iv')) return ACTUAL_IV_SUITE_IMAGE;
  if (value.includes('acne')) return FACE_REALITY_SYSTEM_IMAGE;
  if (value.includes('skin') || value.includes('facial')) return ACTUAL_WELCOME_IMAGE;
  return DEFAULT_COLLECTION_IMAGE;
};

export interface ClinicalResultImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
  glo2facial: [
    {
      src: GLO2_RESULT_IMAGE,
      alt: 'House of Rose Glo2Facial before-and-after photographs',
      width: 1400,
      height: 1050,
    },
  ],
};

/** Clinical before/after proof gallery for a service, or [] when none applies. */
export const getServiceResultImages = (slug: string): ClinicalResultImage[] =>
  SERVICE_RESULTS[slug] ?? [];
