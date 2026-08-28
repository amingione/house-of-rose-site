export interface HeroBanner {
  src: string;
  alt: string;
  position: string;
  width: number;
  height: number;
}

const CLEAN_BANNER_ROOT = '/images/banner/background';

const banner = (
  filename: string,
  width: number,
  height: number,
  position = 'center',
): HeroBanner => ({
  src: `${CLEAN_BANNER_ROOT}/${filename}`,
  // These low-detail backgrounds establish atmosphere; the page heading carries
  // the meaning, so repeating decorative objects to screen readers adds noise.
  alt: '',
  position,
  width,
  height,
});

/**
 * Wordless, low-detail banner art reserved for broad orientation pages.
 * Treatment, provider, results, and practice-detail pages continue to use
 * accurate photography where the image itself is useful evidence.
 */
export const HERO_BANNERS = {
  '/about/': banner('hr-br-6.webp', 912, 610),
  '/about/hra/': banner('hr-br-4.webp', 924, 610),
  '/areas/': banner('hr-br-6.webp', 912, 610),
  '/services/': banner('hr-br-1.webp', 922, 606),
  '/services/inmode/': banner('hr-br-7.webp', 898, 576),
  '/services/lumecca-peak-ipl/': banner('hr-br-2.webp', 918, 606),
  '/services/glp-1-weight-management/': banner('hr-br-6.webp', 912, 610),
  '/consultation/': banner('HR-background.webp', 918, 606),
  '/contact/': banner('hr-br-2.webp', 918, 606),
  '/experience/': banner('hr-br-3.webp', 920, 612),
  '/blog/': banner('hr-br-4.webp', 924, 610),
  '/packages/': banner('hr-br-5.webp', 908, 596),
  '/shop/': banner('hr-br-6.webp', 912, 610),
  '/shop/jane-iredale/': banner('hr-br-1.webp', 922, 606),
  '/skin-analysis/': banner('hr-br-4.webp', 924, 610),
  '/rent-a-room/': banner('HR-background.webp', 918, 606),
} as const satisfies Readonly<Record<string, HeroBanner>>;

export type HeroBannerRoute = keyof typeof HERO_BANNERS;

export const getHeroBanner = (route: HeroBannerRoute): HeroBanner => HERO_BANNERS[route];

const SERVICE_BANNERS: Readonly<Record<string, HeroBanner>> = {
  'injectables-bio-fillers': banner('hr-br-6.webp', 912, 610),
  'bridal-makeup': banner('hr-br-1.webp', 922, 606),
  injectables: banner('hr-br-2.webp', 918, 606),
  'dermal-fillers': banner('hr-br-3.webp', 920, 612),
  'event-makeup': banner('hr-br-5.webp', 908, 596),
  biorepeel: banner('hr-br-4.webp', 924, 610),
  'everyday-makeup': banner('HR-background.webp', 918, 606),
  glo2facial: banner('hr-br-5.webp', 908, 596),
  dermaplaning: banner('hr-br-3.webp', 920, 612),
  'face-reality-acne-program': banner('hr-br-2.webp', 918, 606),
  'acne-bootcamp': banner('hr-br-1.webp', 922, 606),
  waxing: banner('HR-background.webp', 918, 606),
  'facial-waxing': banner('hr-br-6.webp', 912, 610),
  'body-waxing': banner('hr-br-5.webp', 908, 596),
  microneedling: banner('hr-br-4.webp', 924, 610),
  'morpheus8-body': banner('hr-br-6.webp', 912, 610),
  prf: banner('hr-br-3.webp', 920, 612),
  'prf-under-eyes': banner('hr-br-1.webp', 922, 606),
  'prf-injections': banner('hr-br-2.webp', 918, 606),
};

/** Clean, centrally controlled top art for the standard service renderer. */
export const getServiceHeroBanner = (serviceSlug: string): HeroBanner =>
  SERVICE_BANNERS[serviceSlug] ?? HERO_BANNERS['/services/'];

const AREA_BANNERS: Readonly<Record<string, HeroBanner>> = {
  'punta-gorda': banner('hr-br-6.webp', 912, 610),
  'babcock-ranch': banner('hr-br-1.webp', 922, 606),
  'burnt-store-marina': banner('hr-br-2.webp', 918, 606),
  'charlotte-harbor': banner('hr-br-3.webp', 920, 612),
  'port-charlotte': banner('hr-br-5.webp', 908, 596),
  'punta-gorda-isles': banner('HR-background.webp', 918, 606),
};

/** Clean local-page art rotated by community to avoid a cloned geo-page header. */
export const getAreaHeroBanner = (areaSlug: string): HeroBanner =>
  AREA_BANNERS[areaSlug] ?? HERO_BANNERS['/areas/'];

export const DIGITAL_CARD_BACKGROUND = `${CLEAN_BANNER_ROOT}/HR-background.webp`;
