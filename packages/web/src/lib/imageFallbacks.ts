export const DEFAULT_SERVICE_IMAGE = '/images/house-of-rose/space/facial-room-floral-square.webp';
export const DEFAULT_COLLECTION_IMAGE = '/images/house-of-rose/space/skin-studio-wide.webp';
export const DEFAULT_PACKAGE_IMAGE = '/images/house-of-rose/space/luxury-reception-lobby-hero.webp';
export const DEFAULT_PRODUCT_IMAGE = '/images/house-of-rose/space/shop-product-gift-flatlay-square.webp';
export const DEFAULT_JOURNAL_IMAGE = '/images/house-of-rose/space/brand-art-rose-hero.webp';
export const DEFAULT_AREA_IMAGE = '/images/hor-exterior.webp';

const SERVICE_IMAGES: Record<string, string> = {
  injectables: '/images/house-of-rose/space/injectables-suite-editorial-hero.webp',
  'dermal-fillers': '/images/house-of-rose/space/injectables-suite-editorial-hero.webp',
  'ez-gel-bio-filler': '/images/house-of-rose/space/injectables-suite-editorial-hero.webp',
  'injectables-bio-fillers': '/images/house-of-rose/space/injectables-suite-editorial-hero.webp',
  'prf-injections': '/images/house-of-rose/space/injectables-suite-editorial-hero.webp',
  'iv-hydration-therapy': '/images/house-of-rose/space/iv-hydration-recliner-hero.webp',
  'glp-1-weight-management': '/images/house-of-rose/space/iv-hydration-recliner-hero.webp',
  wellness: '/images/house-of-rose/space/iv-hydration-recliner-hero.webp',
  'body-waxing': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'facial-waxing': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  dermaplaning: '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'face-reality-acne-program': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'acne-bootcamp': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'acne-peel': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  glo2facial: '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'back-treatment': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  'lightstim-led-therapy': '/images/house-of-rose/space/basic-facials-waxing-room-tile.webp',
  prf: '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'prf-microneedling': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  microchanneling: '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'microchanneling-microneedling': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'microneedling-corrective': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'microneedling-body': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'prf-body-treatments': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'procell-microchanneling-body': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  biorepeel: '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'biorepeel-body': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'biorepeel-advanced-acne-scarring': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'biorepeel-gold-spot-treatment': '/images/house-of-rose/space/advanced-facials-treatment-tile.webp',
  'neck-decollete-extension': '/images/house-of-rose/space/treatment-room-soft-square.webp',
  'permanent-jewelry': '/images/house-of-rose/square/mirror-console-square.webp',
};

export const getServiceFallbackImage = (slug: string): string =>
  SERVICE_IMAGES[slug] ?? DEFAULT_SERVICE_IMAGE;

export const getCollectionFallbackImage = (slug: string): string => {
  const value = slug.toLowerCase();
  if (value.includes('inject')) return '/images/house-of-rose/space/injectables-suite-editorial-hero.webp';
  if (value.includes('wellness') || value.includes('iv')) return '/images/house-of-rose/space/iv-hydration-recliner-wide.webp';
  if (value.includes('skin') || value.includes('facial')) return '/images/house-of-rose/space/advanced-facials-treatment-tile.webp';
  return DEFAULT_COLLECTION_IMAGE;
};
