const REGENERATIVE_EDITORIAL_IMAGE = '/images/editorial/home/regenerative-skin-treatments.webp';
const INJECTABLES_EDITORIAL_IMAGE = '/images/editorial/home/injectables-consultation.webp';
const SKIN_HEALTH_EDITORIAL_IMAGE = '/images/editorial/home/skin-health-analysis.webp';
const WELLNESS_EDITORIAL_IMAGE = '/images/editorial/home/wellness-iv-hydration.webp';

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
  'face-reality-acne-program': SKIN_HEALTH_EDITORIAL_IMAGE,
  'acne-bootcamp': SKIN_HEALTH_EDITORIAL_IMAGE,
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
