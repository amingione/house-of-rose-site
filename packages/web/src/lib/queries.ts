// ─── GROQ Fragments ──────────────────────────────────────────────────────────

const IMAGE_FIELDS = /* groq */ `
  "image": image {
    asset->{ url, metadata { dimensions } },
    alt
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SanityImage {
  asset: { url: string; metadata: { dimensions: { width: number; height: number } } };
  alt?: string;
}

export interface FAQ {
  _key?: string;
  question: string;
  answer: string;
}

export type ServiceKind = 'hub' | 'treatment' | 'standalone';

export interface Service {
  _id: string;
  title: string;
  slug: string;
  kind?: ServiceKind;
  parentService?: { title: string; slug: string };
  treatments?: Service[];
  tagline?: string;
  duration?: string;
  price?: number | string;
  description?: string;
  whoItsFor?: string;
  process?: string[];
  faqs?: FAQ[];
  image?: SanityImage;
  collection?: { title: string; slug: string };
  relatedServices?: Service[];
  _updatedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface SitemapService {
  _id: string;
  title: string;
  slug: string;
  kind?: ServiceKind;
  parentService?: { title: string; slug: string };
  _updatedAt?: string;
}

export interface Concern {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  image?: SanityImage;
  treatments?: Service[];
  seo?: { metaTitle?: string; metaDescription?: string };
}

export interface ServiceCollection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: SanityImage;
  services: Service[];
}

export type ProductBrand = 'procell' | 'glymed' | 'skin-script' | 'face-reality' | 'house-of-rose';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  brand?: ProductBrand;
  size?: string;
  category?: string;
  inStock?: boolean;
  description?: string;
  price?: number;
  image?: SanityImage;
}

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  description?: string;
  logo?: SanityImage;
  socialImage?: SanityImage;
  email?: string;
  phone?: string;
  address?: string;
  instagramHandle?: string;
  bookingEmail?: string;
}

export interface PortableTextBlock {
  _type: 'block' | 'image';
  [key: string]: unknown;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category?: string;
  excerpt?: string;
  featuredImage?: SanityImage;
  body?: PortableTextBlock[];
  relatedService?: { title: string; slug: string; tagline?: string };
  seo?: { metaTitle?: string; metaDescription?: string };
  estimatedReadingTime?: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author?: string;
  role?: string;
  backgroundImage?: SanityImage;
  featured?: boolean;
}

export interface Standard {
  _key?: string;
  title: string;
  description: string;
}

export interface JourneyStep {
  _key?: string;
  step: string;
  title: string;
  description: string;
}

export interface ExperienceContent {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  storyHeading?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyImage?: SanityImage;
  standards?: Standard[];
  journeySteps?: JourneyStep[];
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    description,
    ${IMAGE_FIELDS},
    email,
    phone,
    address,
    instagramHandle,
    bookingEmail
  }
`;

export const ALL_SERVICES_QUERY = /* groq */ `
  *[_type == "service" && (kind != "treatment" || !defined(kind))] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    tagline,
    duration,
    price,
    _updatedAt,
    ${IMAGE_FIELDS},
    collection->{ title, "slug": slug.current },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_SITEMAP_SERVICES_QUERY = /* groq */ `
  *[_type == "service" && defined(slug.current)] | order(coalesce(parentService->title, title) asc, kind asc, orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    _updatedAt,
    "parentService": parentService->{ title, "slug": slug.current }
  }
`;

export const SERVICE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    kind,
    "parentService": parentService->{ title, "slug": slug.current },
    "treatments": *[_type == "service" && parentService._ref == ^._id] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      price,
      duration,
      ${IMAGE_FIELDS}
    },
    tagline,
    price,
    duration,
    description,
    whoItsFor,
    process,
    _updatedAt,
    faqs[] {
      _key,
      question,
      answer
    },
    "seo": seo { metaTitle, metaDescription },
    ${IMAGE_FIELDS},
    collection->{ title, "slug": slug.current },
    "relatedServices": relatedServices[]-> {
      _id,
      title,
      "slug": slug.current,
      tagline,
      ${IMAGE_FIELDS}
    }
  }
`;

export const ALL_COLLECTIONS_QUERY = /* groq */ `
  *[_type == "serviceCollection"] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${IMAGE_FIELDS},
    "services": *[_type == "service" && references(^._id)] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      duration,
      price,
      ${IMAGE_FIELDS}
    }
  }
`;

export const COLLECTION_BY_SLUG_QUERY = /* groq */ `
  *[_type == "serviceCollection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    ${IMAGE_FIELDS},
    "services": *[_type == "service" && references(^._id)] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      duration,
      price,
      ${IMAGE_FIELDS}
    }
  }
`;

export const ALL_PRODUCTS_QUERY = /* groq */ `
  *[_type == "product"] | order(brand asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    brand,
    size,
    category,
    inStock,
    description,
    price,
    ${IMAGE_FIELDS}
  }
`;

export const PRODUCT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    price,
    ${IMAGE_FIELDS}
  }
`;

export const ALL_CONCERNS_QUERY = /* groq */ `
  *[_type == "concern"] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS}
  }
`;

export const CONCERN_BY_SLUG_QUERY = /* groq */ `
  *[_type == "concern" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription },
    "treatments": *[_type == "service" && references(^._id)] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      price,
      duration,
      ${IMAGE_FIELDS}
    }
  }
`;

export const ALL_CONCERN_SLUGS_QUERY = /* groq */ `
  *[_type == "concern" && defined(slug.current)]{ "slug": slug.current }
`;

// Slug arrays for Astro getStaticPaths()
export const ALL_SERVICE_SLUGS_QUERY = /* groq */ `
  *[_type == "service" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_COLLECTION_SLUGS_QUERY = /* groq */ `
  *[_type == "serviceCollection" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_PRODUCT_SLUGS_QUERY = /* groq */ `
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    "featuredImage": featuredImage {
      asset->{ url, metadata { dimensions } },
      alt
    },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }
`;

export const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    "featuredImage": featuredImage {
      asset->{ url, metadata { dimensions } },
      alt
    },
    body,
    "relatedService": relatedService->{ title, "slug": slug.current, tagline },
    "seo": seo { metaTitle, metaDescription },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }
`;

export const ALL_BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt)]{ "slug": slug.current }
`;

export const FEATURED_TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial" && featured == true] | order(_createdAt desc) {
    _id,
    quote,
    author,
    role,
    "backgroundImage": backgroundImage {
      asset->{ url, metadata { dimensions } },
      alt
    }
  }
`;

export const EXPERIENCE_CONTENT_QUERY = /* groq */ `
  *[_type == "experienceContent"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    storyHeading,
    storyParagraph1,
    storyParagraph2,
    "storyImage": storyImage {
      asset->{ url, metadata { dimensions } },
      alt
    },
    standards[] {
      _key,
      title,
      description
    },
    journeySteps[] {
      _key,
      step,
      title,
      description
    }
  }
`;

// ─── Brand & Growth — mirrors Notion service system ──────────────────────────

export type ProviderLane =
  | 'advanced-aesthetics'
  | 'injectables-medical'
  | 'wellness'
  | 'classic-facials'
  | 'beauty-enhancements';

export interface Provider {
  _id: string;
  title: string;
  fullName?: string;
  lane?: ProviderLane;
  roleCredential?: string;
  scopeOfPractice?: string;
}

export interface BrandPillar {
  name: string;
  meaning?: string;
}

export interface BrandProfile {
  title: string;
  angle: string;
  idealClient?: string;
  differentiators?: string[];
  pillars?: BrandPillar[];
  voiceTraits?: string[];
  taglines?: string[];
}

export type PackageType = 'series' | 'journey' | 'combo';
export type PackageStatus = 'live' | 'proposed' | 'parked';

export interface PackageServiceRef {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
}

export interface TreatmentPackage {
  _id: string;
  title: string;
  slug: string;
  type?: PackageType;
  status?: PackageStatus;
  provider?: { title: string; lane?: ProviderLane };
  servicesIncluded?: PackageServiceRef[];
  whatsIncluded?: string;
  cadence?: string;
  foundingPrice?: string;
  rackPrice?: string;
  outcome?: string;
  positioning?: string;
  candidacyNote?: string;
  image?: SanityImage;
}

export type MembershipType = 'membership-tier' | 'regenerative-plan' | 'wellness-rider';
export type MembershipLane =
  | 'advanced-aesthetics'
  | 'injectables-medical'
  | 'wellness'
  | 'beauty-enhancements'
  | 'house-collective'
  | 'cross-category';
export type MembershipGroup = 'rose-pass' | 'iv-hydration' | 'basic-facials' | 'advanced-facials' | 'injectables' | 'collagen-bank';

export interface Membership {
  _id: string;
  title: string;
  slug: string;
  type?: MembershipType;
  lane?: MembershipLane;
  membershipGroup?: MembershipGroup;
  status?: 'live' | 'proposed' | 'brainstorm';
  provider?: { title: string };
  monthlyPrice?: string;
  whatsIncluded?: string;
  perks?: string;
  linkedServices?: { _id: string; title: string; slug: string }[];
  linkedPackages?: { _id: string; title: string; slug: string }[];
}

export const BRAND_PROFILE_QUERY = /* groq */ `
  *[_type == "brandProfile"] | order(_updatedAt desc)[0] {
    title,
    angle,
    idealClient,
    differentiators,
    pillars[] { name, meaning },
    voiceTraits,
    taglines
  }
`;

const PACKAGE_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  type,
  status,
  "provider": provider->{ title, lane },
  "servicesIncluded": servicesIncluded[]->{ _id, title, "slug": slug.current, tagline },
  whatsIncluded,
  cadence,
  foundingPrice,
  rackPrice,
  outcome,
  positioning,
  candidacyNote,
  ${IMAGE_FIELDS}
`;

export const ALL_TREATMENT_PACKAGES_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && status != "parked"] | order(orderRank asc, _createdAt desc) {
    ${PACKAGE_FIELDS}
  }
`;

export const TREATMENT_PACKAGE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && slug.current == $slug][0] {
    ${PACKAGE_FIELDS}
  }
`;

export const ALL_TREATMENT_PACKAGE_SLUGS_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_MEMBERSHIPS_QUERY = /* groq */ `
  *[_type == "membership"] | order(orderRank asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    type,
    lane,
    membershipGroup,
    status,
    "provider": provider->{ title },
    monthlyPrice,
    whatsIncluded,
    perks,
    "linkedServices": linkedServices[]->{ _id, title, "slug": slug.current },
    "linkedPackages": linkedPackages[]->{ _id, title, "slug": slug.current }
  }
`;

// Live memberships grouped for the public /memberships page (Rose Pass, IV Hydration
// Membership, Rose Collagen Bank). Excludes anything without a membershipGroup or not live.
export const PUBLIC_MEMBERSHIPS_QUERY = /* groq */ `
  *[_type == "membership" && status == "live" && defined(membershipGroup)] | order(orderRank asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    membershipGroup,
    monthlyPrice,
    whatsIncluded,
    perks
  }
`;

export const ALL_MEMBERSHIP_SLUGS_QUERY = /* groq */ `
  *[_type == "membership" && defined(slug.current)]{ "slug": slug.current }
`;

// Regenerative Plans — the cross-lane, multi-month programs (Renewal → Regeneration →
// Restoration). Surfaced on their own /plans page, separate from the monthly lane memberships.
export const REGENERATIVE_PLANS_QUERY = /* groq */ `
  *[_type == "membership" && type == "regenerative-plan"] | order(orderRank asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    monthlyPrice,
    whatsIncluded,
    perks,
    "provider": provider->{ title },
    "linkedServices": linkedServices[]->{ _id, title, "slug": slug.current },
    "linkedPackages": linkedPackages[]->{ _id, title, "slug": slug.current }
  }
`;

// ─── Marketing / SEO / AEO page types — see docs/CONTENT-MODEL-MAP.md ─────────

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
}

export interface ServiceRef {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  price?: number | string;
  duration?: string;
}

// 2. Cost guide — /cost/[slug]
export interface CostFactor {
  _key?: string;
  factor: string;
  effect: string;
}

export interface CostGuide {
  _id: string;
  title: string;
  slug: string;
  treatment?: ServiceRef;
  answer: string;
  priceLow?: number;
  priceHigh?: number;
  priceUnit?: string;
  costFactors?: CostFactor[];
  whatsIncluded?: string;
  faqs?: FAQ[];
  relatedServices?: ServiceRef[];
  _updatedAt?: string;
  seo?: SeoMeta;
}

// 4. Comparison — /compare/[slug]
export interface ComparisonOption {
  label: string;
  summary?: string;
  bestFor?: string;
  service?: ServiceRef;
}

export interface ComparisonRow {
  _key?: string;
  attribute: string;
  valueA?: string;
  valueB?: string;
}

export interface Comparison {
  _id: string;
  title: string;
  slug: string;
  intro: string;
  optionA?: ComparisonOption;
  optionB?: ComparisonOption;
  rows?: ComparisonRow[];
  verdict?: string;
  faqs?: FAQ[];
  _updatedAt?: string;
  seo?: SeoMeta;
}

// 5. Local area — /areas/[slug]
export interface LocalArea {
  _id: string;
  title: string;
  slug: string;
  city: string;
  region?: string;
  intro: string;
  whyLocal?: string;
  servedServices?: ServiceRef[];
  neighborhoods?: string[];
  faqs?: FAQ[];
  image?: SanityImage;
  _updatedAt?: string;
  seo?: SeoMeta;
}

// 6. Case study (before/after) — /results/[slug]
export interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  consentGiven?: boolean;
  treatment?: ServiceRef;
  concern?: { title: string; slug: string };
  beforeImage?: SanityImage;
  afterImage?: SanityImage;
  clientProfile?: string;
  protocol?: string;
  timeframe?: string;
  outcome?: string;
  _updatedAt?: string;
  seo?: SeoMeta;
}

const SERVICE_REF_FIELDS = /* groq */ `
  _id, title, "slug": slug.current, tagline, price, duration
`;

// ── Cost guides ──────────────────────────────────────────────────────────────
export const ALL_COST_GUIDES_QUERY = /* groq */ `
  *[_type == "costGuide"] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, answer, priceLow, priceHigh, priceUnit, _updatedAt,
    "treatment": treatment->{ ${SERVICE_REF_FIELDS} },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const COST_GUIDE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "costGuide" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, answer, priceLow, priceHigh, priceUnit,
    whatsIncluded, costFactors[]{ _key, factor, effect }, faqs[]{ _key, question, answer }, _updatedAt,
    "treatment": treatment->{ ${SERVICE_REF_FIELDS} },
    "relatedServices": relatedServices[]->{ ${SERVICE_REF_FIELDS} },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_COST_GUIDE_SLUGS_QUERY = /* groq */ `
  *[_type == "costGuide" && defined(slug.current)]{ "slug": slug.current }
`;

// ── Comparisons ──────────────────────────────────────────────────────────────
const COMPARISON_OPTION_FIELDS = /* groq */ `
  label, summary, bestFor, "service": service->{ ${SERVICE_REF_FIELDS} }
`;

export const ALL_COMPARISONS_QUERY = /* groq */ `
  *[_type == "comparison"] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, intro, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const COMPARISON_BY_SLUG_QUERY = /* groq */ `
  *[_type == "comparison" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, intro, verdict, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    rows[]{ _key, attribute, valueA, valueB },
    faqs[]{ _key, question, answer },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_COMPARISON_SLUGS_QUERY = /* groq */ `
  *[_type == "comparison" && defined(slug.current)]{ "slug": slug.current }
`;

// ── Local areas ──────────────────────────────────────────────────────────────
export const ALL_LOCAL_AREAS_QUERY = /* groq */ `
  *[_type == "localArea"] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, city, region, intro, _updatedAt,
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const LOCAL_AREA_BY_SLUG_QUERY = /* groq */ `
  *[_type == "localArea" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, city, region, intro, whyLocal, neighborhoods, _updatedAt,
    "servedServices": servedServices[]->{ ${SERVICE_REF_FIELDS} },
    faqs[]{ _key, question, answer },
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_LOCAL_AREA_SLUGS_QUERY = /* groq */ `
  *[_type == "localArea" && defined(slug.current)]{ "slug": slug.current }
`;

// ── Case studies (consent-gated) ─────────────────────────────────────────────
export const ALL_CASE_STUDIES_QUERY = /* groq */ `
  *[_type == "caseStudy" && consentGiven == true] | order(orderRank asc, _createdAt desc) {
    _id, title, "slug": slug.current, clientProfile, timeframe, _updatedAt,
    "treatment": treatment->{ ${SERVICE_REF_FIELDS} },
    "afterImage": afterImage { asset->{ url, metadata { dimensions } }, alt },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const CASE_STUDY_BY_SLUG_QUERY = /* groq */ `
  *[_type == "caseStudy" && slug.current == $slug && consentGiven == true][0] {
    _id, title, "slug": slug.current, consentGiven, clientProfile, protocol, timeframe, outcome, _updatedAt,
    "treatment": treatment->{ ${SERVICE_REF_FIELDS} },
    "concern": concern->{ title, "slug": slug.current },
    "beforeImage": beforeImage { asset->{ url, metadata { dimensions } }, alt },
    "afterImage": afterImage { asset->{ url, metadata { dimensions } }, alt },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_CASE_STUDY_SLUGS_QUERY = /* groq */ `
  *[_type == "caseStudy" && consentGiven == true && defined(slug.current)]{ "slug": slug.current }
`;

// ── FAQ aggregate — /faq ─────────────────────────────────────────────────────
export interface FaqGroup {
  _id: string;
  source: string;
  slug: string;
  type: 'service' | 'costGuide' | 'comparison' | 'localArea';
  faqs: FAQ[];
}

export const FAQ_AGGREGATE_QUERY = /* groq */ `
  *[_type in ["service", "costGuide", "comparison", "localArea"] && count(faqs) > 0]
    | order(_type asc, title asc) {
      _id,
      "source": title,
      "slug": slug.current,
      "type": _type,
      faqs[]{ _key, question, answer }
    }
`;

// ── Home page (singleton) — migrated from hardcoded index.astro ──────────────
export interface HomeServiceGroup {
  _key?: string;
  name: string;
  description: string;
  imagePath?: string;
}

export interface HomePage {
  _id: string;
  seoTitle?: string;
  seoDescription?: string;
  heroKicker?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroCtaPrimaryText?: string;
  heroCtaSecondaryText?: string;
  aboutKicker?: string;
  aboutHeading?: string;
  aboutPara1?: string;
  aboutPara2?: string;
  aboutPara3?: string;
  approachKicker?: string;
  approachHeading?: string;
  approachPara1?: string;
  approachPara2?: string;
  approachClosing?: string;
  servicesKicker?: string;
  servicesHeading?: string;
  servicesIntro?: string;
  serviceGroups?: HomeServiceGroup[];
  servicesCtaText?: string;
  scanKicker?: string;
  scanHeading?: string;
  scanPara1?: string;
  scanPara2?: string;
  scanQuote?: string;
  scanCtaPrimaryText?: string;
  scanCtaSecondaryText?: string;
  circleKicker?: string;
  circleHeading?: string;
  circlePara1?: string;
  circlePara2?: string;
  circleCtaPrimaryText?: string;
  circleCtaSecondaryText?: string;
  careKicker?: string;
  careHeading?: string;
  carePara1?: string;
  carePara2?: string;
  careCtaText?: string;
  expKicker?: string;
  expHeading?: string;
  expPara1?: string;
  expPara2?: string;
  localKicker?: string;
  localHeading?: string;
  localPara1?: string;
  localPara2?: string;
  finalHeading?: string;
  finalPara?: string;
  finalCtaText?: string;
  finalAddressLine?: string;
}

export const HOMEPAGE_QUERY = /* groq */ `
  *[_type == "homepage"][0]{
    _id,
    seoTitle, seoDescription,
    heroKicker, heroTitle, heroSubtitle, heroDescription, heroCtaPrimaryText, heroCtaSecondaryText,
    aboutKicker, aboutHeading, aboutPara1, aboutPara2, aboutPara3,
    approachKicker, approachHeading, approachPara1, approachPara2, approachClosing,
    servicesKicker, servicesHeading, servicesIntro,
    serviceGroups[]{ _key, name, description, imagePath },
    servicesCtaText,
    scanKicker, scanHeading, scanPara1, scanPara2, scanQuote, scanCtaPrimaryText, scanCtaSecondaryText,
    circleKicker, circleHeading, circlePara1, circlePara2, circleCtaPrimaryText, circleCtaSecondaryText,
    careKicker, careHeading, carePara1, carePara2, careCtaText,
    expKicker, expHeading, expPara1, expPara2,
    localKicker, localHeading, localPara1, localPara2,
    finalHeading, finalPara, finalCtaText, finalAddressLine
  }
`;

// ── Professional Makeup (nested singletons) — /services/professional-makeup/* ──
// See docs/services/PROFESSIONAL-MAKEUP-BUILD-PLAN.md. Provider: Aundrea Pedigo.

export interface LinkRef {
  _key?: string;
  label: string;
  description?: string;
  href: string;
}

export interface MakeupServiceType {
  _key?: string;
  name: string;
  blurb?: string;
  bestFor?: string;
  priceLabel?: string;
}

export interface MakeupUseCase {
  _key?: string;
  title: string;
  body?: string;
}

export interface ProfessionalMakeupPage {
  _id: string;
  seoTitle?: string;
  seoDescription?: string;
  heroKicker?: string;
  heroTitle?: string;
  heroDescription?: string;
  image?: SanityImage;
  philosophyKicker?: string;
  philosophyHeading?: string;
  philosophyBody?: string;
  servicesKicker?: string;
  servicesHeading?: string;
  servicesIntro?: string;
  services?: MakeupServiceType[];
  useCasesKicker?: string;
  useCasesHeading?: string;
  useCases?: MakeupUseCase[];
  trialRunHeading?: string;
  trialRunBody?: string;
  providerKicker?: string;
  providerHeading?: string;
  providerBody?: string;
  provider?: { title: string; roleCredential?: string };
  relatedLinks?: LinkRef[];
  faqs?: FAQ[];
}

export const PROFESSIONAL_MAKEUP_PAGE_QUERY = /* groq */ `
  *[_type == "professionalMakeupPage"][0]{
    _id, seoTitle, seoDescription,
    heroKicker, heroTitle, heroDescription,
    ${IMAGE_FIELDS},
    philosophyKicker, philosophyHeading, philosophyBody,
    servicesKicker, servicesHeading, servicesIntro,
    services[]{ _key, name, blurb, bestFor, priceLabel },
    useCasesKicker, useCasesHeading,
    useCases[]{ _key, title, body },
    trialRunHeading, trialRunBody,
    providerKicker, providerHeading, providerBody,
    "provider": provider->{ title, roleCredential },
    relatedLinks[]{ _key, label, description, href },
    faqs[]{ _key, question, answer }
  }
`;

export interface JaneIredalePillar {
  _key?: string;
  name: string;
  body?: string;
  examples?: string[];
}

export interface JaneIredaleSwap {
  _key?: string;
  category: string;
  conventional?: string;
  swap: string;
  note?: string;
}

export interface LookStep {
  _key?: string;
  step: string;
  product?: string;
  shade?: string;
}

export interface SignatureLook {
  _key?: string;
  name: string;
  summary?: string;
  steps?: LookStep[];
}

export interface JaneIredalePage {
  _id: string;
  seoTitle?: string;
  seoDescription?: string;
  heroKicker?: string;
  heroTitle?: string;
  heroDescription?: string;
  image?: SanityImage;
  introKicker?: string;
  introHeading?: string;
  introBody?: string;
  pillarsHeading?: string;
  pillars?: JaneIredalePillar[];
  benefitsHeading?: string;
  benefits?: string[];
  whyUsKicker?: string;
  whyUsHeading?: string;
  whyUsBody?: string;
  swapsKicker?: string;
  swapsHeading?: string;
  swapsIntro?: string;
  swaps?: JaneIredaleSwap[];
  looksKicker?: string;
  looksHeading?: string;
  looksIntro?: string;
  looks?: SignatureLook[];
  ctaHeading?: string;
  ctaBody?: string;
  relatedLinks?: LinkRef[];
  supplementDisclaimer?: string;
  faqs?: FAQ[];
}

export const JANE_IREDALE_PAGE_QUERY = /* groq */ `
  *[_type == "janeIredalePage"][0]{
    _id, seoTitle, seoDescription,
    heroKicker, heroTitle, heroDescription,
    ${IMAGE_FIELDS},
    introKicker, introHeading, introBody,
    pillarsHeading,
    pillars[]{ _key, name, body, examples },
    benefitsHeading, benefits,
    whyUsKicker, whyUsHeading, whyUsBody,
    swapsKicker, swapsHeading, swapsIntro,
    swaps[]{ _key, category, conventional, swap, note },
    looksKicker, looksHeading, looksIntro,
    looks[]{ _key, name, summary, steps[]{ _key, step, product, shade } },
    ctaHeading, ctaBody,
    relatedLinks[]{ _key, label, description, href },
    supplementDisclaimer,
    faqs[]{ _key, question, answer }
  }
`;

export interface MakeupBookingOption {
  _key?: string;
  name: string;
  summary?: string;
  includes?: string[];
  bestFor?: string;
  priceLabel?: string;
}

export interface MakeupEventsPage {
  _id: string;
  seoTitle?: string;
  seoDescription?: string;
  heroKicker?: string;
  heroTitle?: string;
  heroDescription?: string;
  image?: SanityImage;
  introKicker?: string;
  introHeading?: string;
  introBody?: string;
  optionsKicker?: string;
  optionsHeading?: string;
  bookingOptions?: MakeupBookingOption[];
  trialRunHeading?: string;
  trialRunBody?: string;
  bookingHeading?: string;
  bookingBody?: string;
  relatedLinks?: LinkRef[];
  faqs?: FAQ[];
}

export const MAKEUP_EVENTS_PAGE_QUERY = /* groq */ `
  *[_type == "makeupEventsPage"][0]{
    _id, seoTitle, seoDescription,
    heroKicker, heroTitle, heroDescription,
    ${IMAGE_FIELDS},
    introKicker, introHeading, introBody,
    optionsKicker, optionsHeading,
    bookingOptions[]{ _key, name, summary, includes, bestFor, priceLabel },
    trialRunHeading, trialRunBody,
    bookingHeading, bookingBody,
    relatedLinks[]{ _key, label, description, href },
    faqs[]{ _key, question, answer }
  }
`;
