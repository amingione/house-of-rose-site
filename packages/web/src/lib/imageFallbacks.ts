// Fallbacks must be a verified House of Rose photograph, a real treatment result,
// or an appropriate manufacturer/device asset. Never reintroduce generic models or
// generated treatment scenes here: this module feeds cards, heroes, social images,
// local service collections, packages, and optional image fields across the site.
const ACTUAL_RECEPTION_IMAGE = '/images/optimized/actual-reception-1400-light.webp';
const ACTUAL_WELCOME_IMAGE = '/images/optimized/actual-welcome-1400.webp';
const ACTUAL_IV_SUITE_IMAGE = '/images/optimized/actual-iv-suite-1400.webp';
const ACTUAL_STOREFRONT_IMAGE = '/images/optimized/actual-storefront-1000.webp';
const ACTUAL_FACIAL_SUITE_IMAGE = '/images/optimized/actual-facial-suite-1400.webp';
const ACTUAL_MICRONEEDLING_ROOM_IMAGE = '/images/optimized/actual-microneedling-room-1400.webp';
const ACTUAL_MORPHEUS8_ROOM_IMAGE = '/images/optimized/actual-morpheus8-room-1400-light.webp';
const GLO2_COMPANY_IMAGE = '/images/optimized/glo2facial-company-600.webp';
const GLO2_RESULT_IMAGE = '/images/optimized/glo2facial-before-after-1400.webp';
const PROCELL_HOUSE_IMAGE = '/images/optimized/procell-house-of-rose-800.webp';
const BIOREPEEL_PRODUCT_IMAGE = '/images/optimized/biorepeel-products-800.webp';

// Treatment-specific assets that already live in labeled folders under
// public/images. Each folder name is the service it documents, so these are
// the accurate card and hero images for services that previously fell back to
// the generic facial suite.
const DERMAPLANING_IMAGE = '/images/optimized/dermaplaning-hero-1400.webp';
const DERMAL_FILLERS_IMAGE = '/images/optimized/dermal-fillers-800.webp';
const BOTOX_IMAGE = '/images/fillers-botox/botox-house-of-rose-aesthetics.webp';
const INJECTABLES_CONSULT_IMAGE = '/images/editorial/home/injectables-consultation.webp';
const PRF_RESULT_IMAGE = '/images/optimized/prf-undereyes-ezgel-1400.webp';
const ADVANCED_FACIAL_CONSULT_IMAGE =
  '/images/editorial/advanced-facials/advanced-facials-consultation.webp';
const GLO2_TREATMENT_IMAGE = '/images/editorial/advanced-facials/glo2facial-treatment.webp';
const BIOREPEEL_TREATMENT_IMAGE = '/images/editorial/advanced-facials/biorepeel-treatment.webp';
const MAKEUP_RESULT_IMAGE =
  '/images/optimized/makeup-jane-iredale-stephanie-1400.webp';
const MORPHEUS8_BODY_IMAGE = '/images/optimized/morpheus8-burst-deep-body-1400.webp';
const IV_HYDRATION_EDITORIAL_IMAGE = '/images/editorial/home/wellness-iv-hydration.webp';

// Face Reality brand assets (from docs/Face Reality — Branded Assets 2026).
// Amber is a Face Reality Certified Acne Specialist, so the acne-program pages
// lead with genuine Face Reality imagery rather than generic studio stock.
// Declared here because the card and hero maps below both reference it.
const FACE_REALITY_SYSTEM_IMAGE = '/images/face-reality/clear-skin-system.webp';
const INMODE_DEVICE_IMAGES: Record<string, string> = {
  morpheus8: ACTUAL_MORPHEUS8_ROOM_IMAGE,
  'morpheus8-body': ACTUAL_MORPHEUS8_ROOM_IMAGE,
  'lumecca-peak-ipl': '/images/optimized/lumecca-device-800.webp',
  'forma-rf-facial': '/images/inmode/Forma-handpiece-space.png',
};

// The services directory is stricter than a treatment-page hero. A card image
// must identify the actual device, product, or result at a glance; an empty
// treatment room is omitted instead of being repeated beside unrelated services.
// Every entry below resolves to a labeled folder under public/images whose name
// matches the service it documents.
const SERVICE_CARD_IMAGES: Record<string, string> = {
  inmode: '/images/optimized/hor-skin-studio-1400.webp',
  morpheus8: '/images/inmode/morpheus8-burst-device.webp',
  'morpheus8-body': MORPHEUS8_BODY_IMAGE,
  'lumecca-peak-ipl': '/images/inmode/lumecca-peak-device.webp',
  'forma-rf-facial': '/images/inmode/Forma-handpiece-space.png',
  'iv-hydration-therapy': ACTUAL_IV_SUITE_IMAGE,
  // Advanced skin services — device, product, or result photography.
  microneedling: PROCELL_HOUSE_IMAGE,
  'prf-microneedling': PROCELL_HOUSE_IMAGE,
  glo2facial: GLO2_COMPANY_IMAGE,
  'glo2facial-prf': GLO2_COMPANY_IMAGE,
  'glo2facial-procell-md': PROCELL_HOUSE_IMAGE,
  'glo2facial-procell-pro': PROCELL_HOUSE_IMAGE,
  biorepeel: BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-body': BIOREPEEL_PRODUCT_IMAGE,
  dermaplaning: DERMAPLANING_IMAGE,
  facials: ADVANCED_FACIAL_CONSULT_IMAGE,
  'radiance-and-renewal-facial': ADVANCED_FACIAL_CONSULT_IMAGE,
  // Acne program — Face Reality branded system photography.
  'face-reality-acne-program': FACE_REALITY_SYSTEM_IMAGE,
  'acne-bootcamp': FACE_REALITY_SYSTEM_IMAGE,
  // Injectables and regenerative — Diana's lane.
  injectables: BOTOX_IMAGE,
  'injectables-bio-fillers': INJECTABLES_CONSULT_IMAGE,
  'dermal-fillers': DERMAL_FILLERS_IMAGE,
  prf: PRF_RESULT_IMAGE,
  'prf-injections': PRF_RESULT_IMAGE,
  'prf-under-eyes': PRF_RESULT_IMAGE,
  // Makeup artistry — Aundrea's lane.
  makeup: MAKEUP_RESULT_IMAGE,
  'bridal-makeup': MAKEUP_RESULT_IMAGE,
  'event-makeup': MAKEUP_RESULT_IMAGE,
  'everyday-makeup': MAKEUP_RESULT_IMAGE,
};

const INMODE_EVIDENCE_IMAGES: Record<string, string> = {
  'morpheus8-device': '/images/inmode/morpheus8-burst-device.webp',
  'lumecca-device': '/images/inmode/lumecca-peak-device.webp',
  'lumecca-face-example':
    '/images/inmode/lumecca-peak-before-after.webp',
  'forma-device': '/images/inmode/Forma-handpiece-space.png',
};

export const DEFAULT_SERVICE_IMAGE = ACTUAL_RECEPTION_IMAGE;
export const DEFAULT_COLLECTION_IMAGE = ACTUAL_RECEPTION_IMAGE;
export const DEFAULT_PACKAGE_IMAGE = ACTUAL_WELCOME_IMAGE;
export const DEFAULT_PRODUCT_IMAGE = '/images/houseOfRoseAesthetics.webp';
export const DEFAULT_JOURNAL_IMAGE = ACTUAL_WELCOME_IMAGE;
export const DEFAULT_AREA_IMAGE = ACTUAL_STOREFRONT_IMAGE;

const SERVICE_IMAGES: Record<string, string> = {
  inmode: '/images/optimized/hor-skin-studio-1400.webp',
  injectables: BOTOX_IMAGE,
  'dermal-fillers': DERMAL_FILLERS_IMAGE,
  'ez-gel-bio-filler': PRF_RESULT_IMAGE,
  'injectables-bio-fillers': INJECTABLES_CONSULT_IMAGE,
  'prf-injections': PRF_RESULT_IMAGE,
  'prf-under-eyes': PRF_RESULT_IMAGE,
  'iv-hydration-therapy': ACTUAL_IV_SUITE_IMAGE,
  'glp-1-weight-management': ACTUAL_RECEPTION_IMAGE,
  wellness: IV_HYDRATION_EDITORIAL_IMAGE,
  'body-waxing': ACTUAL_FACIAL_SUITE_IMAGE,
  'facial-waxing': ACTUAL_FACIAL_SUITE_IMAGE,
  waxing: ACTUAL_FACIAL_SUITE_IMAGE,
  dermaplaning: DERMAPLANING_IMAGE,
  facials: ADVANCED_FACIAL_CONSULT_IMAGE,
  'radiance-and-renewal-facial': ADVANCED_FACIAL_CONSULT_IMAGE,
  makeup: MAKEUP_RESULT_IMAGE,
  'bridal-makeup': MAKEUP_RESULT_IMAGE,
  'event-makeup': MAKEUP_RESULT_IMAGE,
  'everyday-makeup': MAKEUP_RESULT_IMAGE,
  'face-reality-acne-program': FACE_REALITY_SYSTEM_IMAGE,
  'acne-bootcamp': FACE_REALITY_SYSTEM_IMAGE,
  'face-reality-acne-treatment': FACE_REALITY_SYSTEM_IMAGE,
  'acne-peel': FACE_REALITY_SYSTEM_IMAGE,
  glo2facial: GLO2_TREATMENT_IMAGE,
  'glo2facial-prf': GLO2_TREATMENT_IMAGE,
  'glo2facial-procell-md': PROCELL_HOUSE_IMAGE,
  'glo2facial-procell-pro': PROCELL_HOUSE_IMAGE,
  'back-treatment': ACTUAL_FACIAL_SUITE_IMAGE,
  'lightstim-led-therapy': ACTUAL_FACIAL_SUITE_IMAGE,
  prf: PRF_RESULT_IMAGE,
  'prf-fibrin-veil': PRF_RESULT_IMAGE,
  'prf-microneedling': PROCELL_HOUSE_IMAGE,
  microneedling: PROCELL_HOUSE_IMAGE,
  'microneedling-body': ACTUAL_MICRONEEDLING_ROOM_IMAGE,
  'prf-body-treatments': ACTUAL_FACIAL_SUITE_IMAGE,
  morpheus8: INMODE_DEVICE_IMAGES.morpheus8,
  'morpheus8-body': INMODE_DEVICE_IMAGES['morpheus8-body'],
  'lumecca-peak-ipl': INMODE_DEVICE_IMAGES['lumecca-peak-ipl'],
  'forma-rf-facial': INMODE_DEVICE_IMAGES['forma-rf-facial'],
  biorepeel: BIOREPEEL_TREATMENT_IMAGE,
  'biorepeel-body': BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-advanced-acne-scarring': BIOREPEEL_PRODUCT_IMAGE,
  'biorepeel-gold-spot-treatment': BIOREPEEL_PRODUCT_IMAGE,
  'neck-decollete-extension': ACTUAL_FACIAL_SUITE_IMAGE,
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

// ACTUAL_FACIAL_SUITE_IMAGE is mapped to over a dozen unrelated services above —
// it's real House of Rose photography, but it documents nothing treatment-specific.
// Fine as a hero background (every page needs some image), not fine as a "curated"
// card photo: showing the same empty room for dermaplaning, PRF, and waxing side by
// side reads as filler, not documentation. Card contexts should show no photo at all
// rather than imply this generic room is specific to the treatment.
const GENERIC_FILLER_IMAGES = new Set<string>([ACTUAL_FACIAL_SUITE_IMAGE]);

/** A deliberately selected real-practice, treatment, or accurate device image. */
export const getCuratedServiceImage = (slug: string): string | undefined => {
  const image = SERVICE_IMAGES[slug];
  return image && !GENERIC_FILLER_IMAGES.has(image) ? image : undefined;
};

/**
 * Describe what the curated asset actually shows. Some assets are manufacturer
 * product photographs rather than treatment photography taken at House of Rose.
 */
export const getCuratedServiceImageAlt = (slug: string): string => {
  if (slug === 'inmode') {
    return 'The skin treatment studio inside House of Rose Aesthetics';
  }
  if (slug === 'glo2facial' || slug === 'glo2facial-prf') {
    return 'Glo2Facial company treatment overview showing the handpiece and treatment steps';
  }
  if (slug.startsWith('glo2facial-procell')) {
    return 'Procell Therapies products photographed at House of Rose Aesthetics';
  }
  if (slug === 'prf-microneedling' || slug === 'microneedling' || slug === 'microneedling-body') {
    return 'The microneedling treatment room inside House of Rose Aesthetics';
  }
  if (slug === 'morpheus8' || slug === 'morpheus8-body') {
    return 'The Morpheus8 treatment room inside House of Rose Aesthetics';
  }
  if (slug === 'lumecca-peak-ipl') return 'Lumecca Peak IPL treatment handpiece';
  if (slug === 'forma-rf-facial') return 'Forma radiofrequency facial handpiece';
  if (slug.startsWith('biorepeel')) return 'BioRePeelCl3 professional peel vials';
  if (slug.includes('acne')) return 'Face Reality Clear Skin System products';
  if (slug === 'iv-hydration-therapy' || slug === 'wellness') {
    return 'IV hydration treatment suite inside House of Rose Aesthetics';
  }
  if (
    [
      'injectables',
      'dermal-fillers',
      'ez-gel-bio-filler',
      'injectables-bio-fillers',
      'prf-injections',
      'prf-under-eyes',
      'prf',
      'prf-fibrin-veil',
      'prf-body-treatments',
      'body-waxing',
      'facial-waxing',
      'waxing',
      'dermaplaning',
      'neck-decollete-extension',
      'back-treatment',
      'lightstim-led-therapy',
    ].includes(slug)
  ) {
    return 'A treatment suite inside House of Rose Aesthetics';
  }
  return 'Reception area inside House of Rose Aesthetics';
};

const CONTAINED_SERVICE_IMAGES = new Set([
  'lumecca-peak-ipl',
  'forma-rf-facial',
]);

/** Transparent manufacturer handpieces need breathing room instead of an object-cover crop. */
export const serviceImageUsesContain = (slug: string): boolean =>
  CONTAINED_SERVICE_IMAGES.has(slug);

// Device renders and product/packaging graphics sit on their own background and
// lose their subject under an object-cover square crop. Treatment and result
// photography is cropped normally.
const CONTAINED_SERVICE_CARD_IMAGES = new Set([
  'morpheus8',
  'morpheus8-body',
  'lumecca-peak-ipl',
  'forma-rf-facial',
  'biorepeel',
  'biorepeel-body',
  'face-reality-acne-program',
  'acne-bootcamp',
  'glo2facial',
  'glo2facial-prf',
  'glo2facial-procell-md',
  'glo2facial-procell-pro',
  'microneedling',
  'prf-microneedling',
]);

/** Exact device or real-practice image approved for the services directory. */
export const getServiceCardImage = (slug: string): string | undefined =>
  SERVICE_CARD_IMAGES[slug];

// Every slug in SERVICE_CARD_IMAGES needs a real description here. An image
// mapped without alt text ships an empty alt attribute, which reads to a screen
// reader as an unlabeled image rather than a decorative one.
const SERVICE_CARD_IMAGE_ALTS: Record<string, string> = {
  inmode: 'The skin treatment studio inside House of Rose Aesthetics',
  morpheus8: 'Morpheus8 Burst RF microneedling handpiece',
  'morpheus8-body': 'Morpheus8 Burst deep body radiofrequency microneedling applicator',
  'lumecca-peak-ipl': 'Lumecca Peak IPL handpiece',
  'forma-rf-facial': 'Forma radiofrequency handpiece',
  'iv-hydration-therapy': 'IV hydration suite inside House of Rose Aesthetics',
  microneedling: 'Procell Therapies microchanneling products at House of Rose Aesthetics',
  'prf-microneedling': 'Procell Therapies microchanneling products at House of Rose Aesthetics',
  glo2facial: 'Glo2Facial treatment overview showing the handpiece and treatment steps',
  'glo2facial-prf': 'Glo2Facial treatment overview showing the handpiece and treatment steps',
  'glo2facial-procell-md': 'Procell Therapies products photographed at House of Rose Aesthetics',
  'glo2facial-procell-pro': 'Procell Therapies products photographed at House of Rose Aesthetics',
  biorepeel: 'BioRePeelCl3 professional peel vials',
  'biorepeel-body': 'BioRePeelCl3 professional peel vials',
  dermaplaning: 'Dermaplaning treatment at House of Rose Aesthetics',
  facials: 'An advanced facial consultation at House of Rose Aesthetics',
  'radiance-and-renewal-facial': 'An advanced facial consultation at House of Rose Aesthetics',
  'face-reality-acne-program': 'Face Reality Clear Skin System products',
  'acne-bootcamp': 'Face Reality Clear Skin System products',
  injectables: 'Neurotoxin injectable treatment at House of Rose Aesthetics',
  'injectables-bio-fillers': 'An injectables consultation at House of Rose Aesthetics',
  'dermal-fillers': 'Dermal filler treatment at House of Rose Aesthetics',
  prf: 'PRF under-eye treatment result at House of Rose Aesthetics',
  'prf-injections': 'PRF under-eye treatment result at House of Rose Aesthetics',
  'prf-under-eyes': 'PRF under-eye treatment result at House of Rose Aesthetics',
  makeup: 'Professional makeup application by Aundrea at House of Rose Aesthetics',
  'bridal-makeup': 'Bridal makeup application by Aundrea at House of Rose Aesthetics',
  'event-makeup': 'Event makeup application by Aundrea at House of Rose Aesthetics',
  'everyday-makeup': 'Everyday makeup application by Aundrea at House of Rose Aesthetics',
};

export const getServiceCardImageAlt = (slug: string): string =>
  SERVICE_CARD_IMAGE_ALTS[slug] ?? '';

export const serviceCardImageUsesContain = (slug: string): boolean =>
  CONTAINED_SERVICE_CARD_IMAGES.has(slug);

export const getInModeDeviceImage = (slug: string): string | undefined =>
  INMODE_DEVICE_IMAGES[slug];

export const getInModeEvidenceImage = (key: string): string | undefined =>
  INMODE_EVIDENCE_IMAGES[key];

export const getCollectionFallbackImage = (slug: string): string => {
  const value = slug.toLowerCase();
  if (value.includes('microchannel') || value.includes('microneedl')) {
    return ACTUAL_MICRONEEDLING_ROOM_IMAGE;
  }
  if (value.includes('inject') || value.includes('prf')) return ACTUAL_FACIAL_SUITE_IMAGE;
  if (value.includes('wellness') || value.includes('iv')) return ACTUAL_IV_SUITE_IMAGE;
  if (value.includes('acne')) return FACE_REALITY_SYSTEM_IMAGE;
  if (value.includes('skin') || value.includes('facial') || value.includes('wax')) {
    return ACTUAL_FACIAL_SUITE_IMAGE;
  }
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
