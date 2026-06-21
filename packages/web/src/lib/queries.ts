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
  question: string;
  answer: string;
}

export type ServiceKind = 'hub' | 'treatment' | 'standalone';

export interface Service {
  _id: string;
  title: string;
  /** Branded botanical name (e.g. "The Gilded Lily"); `title` holds the technical name. */
  signatureName?: string;
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
  title: string;
  description: string;
}

export interface JourneyStep {
  step: string;
  title: string;
  description: string;
}

export interface ExperienceContent {
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
    signatureName,
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
    signatureName,
    "slug": slug.current,
    kind,
    "parentService": parentService->{ title, "slug": slug.current },
    "treatments": *[_type == "service" && parentService._ref == ^._id] | order(orderRank asc, title asc) {
      _id,
      title,
      signatureName,
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
      title,
      description
    },
    journeySteps[] {
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
  | 'lily'
  | 'iris'
  | 'hydrangea'
  | 'magnolia'
  | 'house-collective'
  | 'cross-lane';

export interface Membership {
  _id: string;
  title: string;
  slug: string;
  type?: MembershipType;
  lane?: MembershipLane;
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
    status,
    "provider": provider->{ title },
    monthlyPrice,
    whatsIncluded,
    perks,
    "linkedServices": linkedServices[]->{ _id, title, "slug": slug.current },
    "linkedPackages": linkedPackages[]->{ _id, title, "slug": slug.current }
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
    whatsIncluded, costFactors[]{ factor, effect }, faqs[]{ question, answer }, _updatedAt,
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
    rows[]{ attribute, valueA, valueB },
    faqs[]{ question, answer },
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
    faqs[]{ question, answer },
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
  source: string;
  slug: string;
  type: 'service' | 'costGuide' | 'comparison' | 'localArea';
  faqs: FAQ[];
}

export const FAQ_AGGREGATE_QUERY = /* groq */ `
  *[_type in ["service", "costGuide", "comparison", "localArea"] && count(faqs) > 0]
    | order(_type asc, title asc) {
      "source": title,
      "slug": slug.current,
      "type": _type,
      faqs[]{ question, answer }
    }
`;
