const REGENERATIVE_EDITORIAL_IMAGE = '/images/editorial/home/regenerative-skin-treatments.webp';
const INJECTABLES_EDITORIAL_IMAGE = '/images/editorial/home/injectables-consultation.webp';
const SKIN_HEALTH_EDITORIAL_IMAGE = '/images/editorial/home/skin-health-analysis.webp';
const WELLNESS_EDITORIAL_IMAGE = '/images/editorial/home/wellness-iv-hydration.webp';

// Face Reality brand assets (from docs/Face Reality — Branded Assets 2026).
// Amber is a Face Reality Certified Acne Specialist, so the acne-program pages
// lead with genuine Face Reality imagery rather than generic studio stock.
const FACE_REALITY_SYSTEM_IMAGE = '/images/face-reality/clear-skin-system.webp';

export const DEFAULT_SERVICE_IMAGE = SKIN_HEALTH_EDITORIAL_IMAGE;
export const DEFAULT_COLLECTION_IMAGE = '/images/house-of-rose/space/skin-studio-wide.webp';
export const DEFAULT_PACKAGE_IMAGE = '/images/house-of-rose/space/luxury-reception-lobby-hero.webp';
export const DEFAULT_PRODUCT_IMAGE = '/images/house-of-rose/space/shop-product-gift-flatlay-square.webp';
export const DEFAULT_JOURNAL_IMAGE = '/images/house-of-rose/space/brand-art-rose-hero.webp';
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
  'microchanneling-microneedling': REGENERATIVE_EDITORIAL_IMAGE,
  'microneedling-corrective': REGENERATIVE_EDITORIAL_IMAGE,
  'microneedling-body': REGENERATIVE_EDITORIAL_IMAGE,
  'prf-body-treatments': REGENERATIVE_EDITORIAL_IMAGE,
  'procell-microchanneling-body': REGENERATIVE_EDITORIAL_IMAGE,
  biorepeel: REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-body': REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-advanced-acne-scarring': REGENERATIVE_EDITORIAL_IMAGE,
  'biorepeel-gold-spot-treatment': REGENERATIVE_EDITORIAL_IMAGE,
  'neck-decollete-extension': '/images/house-of-rose/space/treatment-room-soft-square.webp',
  'permanent-jewelry': '/images/house-of-rose/square/mirror-console-square.webp',
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

export const getCollectionFallbackImage = (slug: string): string => {
  const value = slug.toLowerCase();
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
