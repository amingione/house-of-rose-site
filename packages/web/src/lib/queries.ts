// ─── GROQ Fragments ──────────────────────────────────────────────────────────

const IMAGE_FIELDS = /* groq */ `
  "image": select(
    defined(image.asset) => image {
      asset->{ url, metadata { dimensions } },
      alt
    },
    null
  )
`;

const RETIRED_COMPARISON_SLUGS = [
  'prf-microchanneling-vs-microneedling',
  'prf-injections-vs-ez-gel',
  'Procell-serum-vs-prf',
  'Procell-vs-topical-prf',
  'procell-serum-vs-prf',
  'procell-vs-topical-prf',
  'topical-prf-vs-prf-injections',
] as const;
const RETIRED_COMPARISON_SLUGS_GROQ = JSON.stringify(RETIRED_COMPARISON_SLUGS);

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

export interface SupportPage {
  _id?: string;
  seoTitle?: string;
  seoDescription?: string;
  heroTitle?: string;
  heroDescription?: string;
  contactHeading?: string;
  contactIntro?: string;
  callTitle?: string;
  callBody?: string;
  callCta?: string;
  emailTitle?: string;
  emailBody?: string;
  emailCta?: string;
  bookingTitle?: string;
  bookingBody?: string;
  bookingCta?: string;
  faqHeading?: string;
  faqIntro?: string;
  faqs?: FAQ[];
  ctaHeading?: string;
  ctaBody?: string;
  ctaText?: string;
}

export const SUPPORT_PAGE_QUERY = /* groq */ `
  *[_type == "supportPage" && _id == "supportPage"][0] {
    _id,
    seoTitle, seoDescription,
    heroTitle, heroDescription,
    contactHeading, contactIntro,
    callTitle, callBody, callCta,
    emailTitle, emailBody, emailCta,
    bookingTitle, bookingBody, bookingCta,
    faqHeading, faqIntro,
    faqs[]{ _key, question, answer },
    ctaHeading, ctaBody, ctaText
  }
`;

export interface TermsSection {
  _key: string;
  heading: string;
  body: string;
}

export interface TermsOfService {
  _id?: string;
  seoTitle?: string;
  seoDescription?: string;
  pageTitle?: string;
  effectiveDate?: string;
  intro?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  sections?: TermsSection[];
}

export const TERMS_OF_SERVICE_QUERY = /* groq */ `
  *[_type == "termsOfService" && _id == "termsOfService"][0] {
    _id,
    seoTitle,
    seoDescription,
    pageTitle,
    effectiveDate,
    intro,
    shippingPolicy,
    returnPolicy,
    sections[]{ _key, heading, body }
  }
`;

export type ServiceKind = 'hub' | 'treatment' | 'standalone';

export interface TreatmentArea {
  _key: string;
  area: string;
  focus: string;
}

export type EvidenceMediaKind = 'device' | 'before-after';

export interface EvidenceMedia {
  _key: string;
  kind: EvidenceMediaKind;
  image: SanityImage;
  title: string;
  caption: string;
  sourceCredit: string;
  sourceUrl?: string;
  usageApproved: boolean;
  consentConfirmed?: boolean;
}

export interface ResearchReference {
  _key: string;
  title: string;
  journal: string;
  year: number;
  studyType: string;
  summary: string;
  limitations: string;
  url: string;
}

export interface ServiceConcern {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
}

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
  bookingUrl?: string;
  description?: string;
  whoItsFor?: string;
  concerns?: ServiceConcern[];
  benefits?: string[];
  treatmentAreas?: TreatmentArea[];
  process?: string[];
  faqs?: FAQ[];
  image?: SanityImage;
  gallery?: SanityImage[];
  evidenceMedia?: EvidenceMedia[];
  researchReferences?: ResearchReference[];
  collection?: { title: string; slug: string };
  relatedServices?: Service[];
  comparisons?: ServiceComparison[];
  _updatedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

/** A comparison that contextually references a service as either option. */
export interface ServiceComparison {
  _id: string;
  title: string;
  slug: string;
  intro: string;
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
  presentation?: 'catalog' | 'editorial';
  headline?: string;
  intro?: string;
  featuredServices?: {
    _key: string;
    service: Service;
    image?: SanityImage;
    summary?: string;
    linkLabel?: string;
  }[];
  customizationTitle?: string;
  customizationIntro?: string;
  customizations?: {
    _key: string;
    title: string;
    description: string;
  }[];
  closingTitle?: string;
  closingBody?: string;
  services: Service[];
}

export type ProductBrand = 'procell' | 'glymed' | 'skin-script' | 'face-reality' | 'house-of-rose';

export type ProductCategory = 'skincare' | 'candles' | 'gift-cards' | 'accessories' | 'other';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  brand?: ProductBrand;
  brandName?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  identifierExists?: boolean;
  size?: string;
  category?: ProductCategory;
  inStock?: boolean;
  inventoryQuantity?: number;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
  availabilityDate?: string;
  condition?: 'new' | 'refurbished' | 'used';
  shippable?: boolean;
  weightLb?: number;
  variantGroupId?: string;
  variantAttributes?: {
    color?: string;
    size?: string;
    scent?: string;
    material?: string;
  };
  merchantStatus?: 'eligible' | 'reviewRequired' | 'excluded';
  policyClass?: string;
  merchantDestinations?: string[];
  productTypePath?: string;
  googleProductCategoryId?: string;
  campaignTier?: string;
  retailCategory?: string;
  priceBand?: string;
  replenishmentClass?: string;
  description?: string;
  price?: number;
  purchaseUrl?: string;
  ctaLabel?: string;
  badge?: string;
  isFeatured?: boolean;
  image?: SanityImage;
  additionalImages?: SanityImage[];
  relatedProducts?: Product[];
}

export type PromotionLinkType = 'internal' | 'external';

export interface Promotion {
  _id: string;
  headline: string;
  teaser?: string;
  ctaLabel: string;
  linkType: PromotionLinkType;
  internalPath?: string;
  externalUrl?: string;
  scopeBrand?: ProductBrand;
  scopeCategory?: ProductCategory;
  image?: SanityImage;
}

export interface ShopBrand {
  _id: string;
  title: string;
  brandKey: ProductBrand;
  tagline?: string;
  story?: string;
  ctaLabel?: string;
  externalUrl?: string;
  logo?: string;
  heroImage?: SanityImage;
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
  *[_type == "service" && status in ["live", "actual-menu"] && (kind != "treatment" || !defined(kind))] | order(orderRank asc, title asc) {
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
  *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current)] | order(coalesce(parentService->title, title) asc, kind asc, orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    _updatedAt,
    "parentService": parentService->{ title, "slug": slug.current }
  }
`;

export const SERVICE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    kind,
    "parentService": parentService->{ title, "slug": slug.current },
    "treatments": *[_type == "service" && status in ["live", "actual-menu"] && parentService._ref == ^._id] | order(orderRank asc, title asc) {
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
    bookingUrl,
    description,
    whoItsFor,
    "concerns": concerns[]->{
      _id,
      title,
      "slug": slug.current,
      intro
    },
    benefits,
    treatmentAreas[] {
      _key,
      area,
      focus
    },
    process,
    _updatedAt,
    faqs[] {
      _key,
      question,
      answer
    },
    "seo": seo { metaTitle, metaDescription },
    ${IMAGE_FIELDS},
    "gallery": gallery[] { asset->{ url, metadata { dimensions } }, alt },
    "evidenceMedia": evidenceMedia[
      usageApproved == true &&
      (kind != "before-after" || consentConfirmed == true)
    ] {
      _key,
      kind,
      "image": image {
        asset->{ url, metadata { dimensions } },
        alt
      },
      title,
      caption,
      sourceCredit,
      sourceUrl,
      usageApproved,
      consentConfirmed
    },
    researchReferences[] {
      _key,
      title,
      journal,
      year,
      studyType,
      summary,
      limitations,
      url
    },
    collection->{ title, "slug": slug.current },
    "relatedServices": relatedServices[@->status in ["live", "actual-menu"]]->{
      _id,
      title,
      "slug": slug.current,
      tagline,
      ${IMAGE_FIELDS}
    },
    "comparisons": *[
      _type == "comparison" &&
      status == "live" &&
      defined(slug.current) &&
      !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
      (optionA.service._ref == ^._id || optionB.service._ref == ^._id)
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      intro
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
    "services": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      (kind != "treatment" || !defined(kind)) &&
      references(^._id)
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      kind,
      tagline,
      duration,
      price,
      ${IMAGE_FIELDS}
    }
  }
`;

/**
 * Lightweight variant of ALL_COLLECTIONS_QUERY for the header mega-menu:
 * titles + slugs only (no images/descriptions) so the nav stays cheap to build.
 */
export const NAV_COLLECTIONS_QUERY = /* groq */ `
  *[_type == "serviceCollection"] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "services": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      (kind != "treatment" || !defined(kind)) &&
      references(^._id)
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current
    }
  }
`;

export interface NavCollection {
  _id: string;
  title: string;
  slug: string;
  services: { _id: string; title: string; slug: string }[];
}

export const COLLECTION_BY_SLUG_QUERY = /* groq */ `
  *[_type == "serviceCollection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    presentation,
    headline,
    intro,
    featuredServices[] {
      _key,
      summary,
      linkLabel,
      "service": service->{
        _id,
        title,
        "slug": slug.current,
        tagline,
        duration,
        ${IMAGE_FIELDS}
      },
      "image": image {
        asset->{ url, metadata { dimensions } },
        alt
      }
    },
    customizationTitle,
    customizationIntro,
    customizations[] {
      _key,
      title,
      description
    },
    closingTitle,
    closingBody,
    ${IMAGE_FIELDS},
    "services": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      (kind != "treatment" || !defined(kind)) &&
      references(^._id)
    ] | order(orderRank asc, title asc) {
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
    "brand": coalesce(brandRef->brandKey, brand),
    "brandName": coalesce(brandRef->manufacturerName, brandRef->title),
    sku, gtin, mpn, identifierExists,
    size,
    category,
    inStock, inventoryQuantity, availability, availabilityDate, condition,
    shippable, weightLb, variantGroupId, variantAttributes,
    merchantStatus, policyClass, merchantDestinations, productTypePath,
    googleProductCategoryId, campaignTier, retailCategory, priceBand, replenishmentClass,
    description,
    price,
    purchaseUrl,
    ctaLabel,
    badge,
    isFeatured,
    ${IMAGE_FIELDS},
    "additionalImages": additionalImages[]{ asset->{ url, metadata { dimensions } }, alt }
  }
`;

export const PRODUCT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tagline,
    "brand": coalesce(brandRef->brandKey, brand),
    "brandName": coalesce(brandRef->manufacturerName, brandRef->title),
    sku, gtin, mpn, identifierExists,
    size,
    category,
    inStock, inventoryQuantity, availability, availabilityDate, condition,
    shippable, weightLb, variantGroupId, variantAttributes,
    merchantStatus, policyClass, merchantDestinations, productTypePath,
    googleProductCategoryId, campaignTier, retailCategory, priceBand, replenishmentClass,
    description,
    price,
    purchaseUrl,
    ctaLabel,
    badge,
    isFeatured,
    ${IMAGE_FIELDS},
    "additionalImages": additionalImages[]{ asset->{ url, metadata { dimensions } }, alt },
    "relatedProducts": *[_type == "product" && coalesce(brandRef._ref, brand) == coalesce(^.brandRef._ref, ^.brand) && slug.current != ^.slug.current] | order(title asc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      tagline,
      "brand": coalesce(brandRef->brandKey, brand),
      "brandName": coalesce(brandRef->manufacturerName, brandRef->title),
      sku,
      inventoryQuantity,
      availability,
      price,
      badge,
      ${IMAGE_FIELDS}
    }
  }
`;

export const MERCHANT_PRODUCTS_QUERY = /* groq */ `
  *[_type == "product" && merchantStatus == "eligible"] | order(sku asc) {
    _id, title, "slug": slug.current, description, tagline, price,
    "brand": coalesce(brandRef->brandKey, brand),
    "brandName": coalesce(brandRef->manufacturerName, brandRef->title),
    sku, gtin, mpn, identifierExists, condition,
    inventoryQuantity, availability, availabilityDate, shippable, weightLb,
    variantGroupId, variantAttributes,
    merchantStatus, policyClass, merchantDestinations, productTypePath,
    googleProductCategoryId, campaignTier, retailCategory, priceBand, replenishmentClass,
    ${IMAGE_FIELDS},
    "additionalImages": additionalImages[]{ asset->{ url, metadata { dimensions } }, alt }
  }
`;

export const ALL_PROMOTIONS_QUERY = /* groq */ `
  *[_type == "promotion" && active == true
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(orderRank asc) {
    _id,
    headline,
    teaser,
    ctaLabel,
    linkType,
    internalPath,
    externalUrl,
    scopeBrand,
    scopeCategory,
    ${IMAGE_FIELDS}
  }
`;

export const ALL_SHOP_BRANDS_QUERY = /* groq */ `
  *[_type == "shopBrand"] | order(orderRank asc, title asc) {
    _id,
    title,
    brandKey,
    tagline,
    story,
    ctaLabel,
    externalUrl,
    "logo": logo.asset->url,
    "heroImage": heroImage {
      asset->{ url, metadata { dimensions } },
      alt
    }
  }
`;

export const ALL_CONCERNS_QUERY = /* groq */ `
  *[_type == "concern" && status != "parked"] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS}
  }
`;

export const CONCERN_BY_SLUG_QUERY = /* groq */ `
  *[_type == "concern" && status != "parked" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription },
    "treatments": *[_type == "service" && status in ["live", "actual-menu"] && references(^._id)] | order(orderRank asc, title asc) {
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
  *[_type == "concern" && status != "parked" && defined(slug.current)]{ "slug": slug.current }
`;

// Slug arrays for Astro getStaticPaths()
export const ALL_SERVICE_SLUGS_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current)]{ "slug": slug.current }
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
  rackPrice?: string;
  outcome?: string;
  positioning?: string;
  candidacyNote?: string;
  image?: SanityImage;
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
  rackPrice,
  outcome,
  positioning,
  candidacyNote,
  ${IMAGE_FIELDS}
`;

export const ALL_TREATMENT_PACKAGES_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && status == "live"] | order(orderRank asc, _createdAt desc) {
    ${PACKAGE_FIELDS}
  }
`;

export const TREATMENT_PACKAGE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && status == "live" && slug.current == $slug][0] {
    ${PACKAGE_FIELDS}
  }
`;

export const ALL_TREATMENT_PACKAGE_SLUGS_QUERY = /* groq */ `
  *[_type == "treatmentPackage" && status == "live" && defined(slug.current)]{ "slug": slug.current }
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
  *[_type == "comparison" && status == "live" && !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ})] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, intro, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const COMPARISON_BY_SLUG_QUERY = /* groq */ `
  *[_type == "comparison" && status == "live" && slug.current == $slug && !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ})][0] {
    _id, title, "slug": slug.current, intro, verdict, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    rows[]{ _key, attribute, valueA, valueB },
    faqs[]{ _key, question, answer },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_COMPARISON_SLUGS_QUERY = /* groq */ `
  *[_type == "comparison" && status == "live" && defined(slug.current) && !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ})]{ "slug": slug.current }
`;

// ── Local areas ──────────────────────────────────────────────────────────────
const CANONICAL_LOCAL_AREA_SLUGS = [
  'punta-gorda',
  'port-charlotte',
  'charlotte-harbor',
  'babcock-ranch',
  'burnt-store-marina',
  'punta-gorda-isles',
] as const;
const CANONICAL_LOCAL_AREA_SLUGS_GROQ = JSON.stringify(CANONICAL_LOCAL_AREA_SLUGS);

export const ALL_LOCAL_AREAS_QUERY = /* groq */ `
  *[_type == "localArea" && slug.current in ${CANONICAL_LOCAL_AREA_SLUGS_GROQ}] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, city, region, intro, _updatedAt,
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const LOCAL_AREA_BY_SLUG_QUERY = /* groq */ `
  *[_type == "localArea" && slug.current == $slug && slug.current in ${CANONICAL_LOCAL_AREA_SLUGS_GROQ}][0] {
    _id, title, "slug": slug.current, city, region, intro, whyLocal, neighborhoods, _updatedAt,
    "servedServices": servedServices[]->{ ${SERVICE_REF_FIELDS} },
    faqs[]{ _key, question, answer },
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_LOCAL_AREA_SLUGS_QUERY = /* groq */ `
  *[_type == "localArea" && defined(slug.current) && slug.current in ${CANONICAL_LOCAL_AREA_SLUGS_GROQ}]{ "slug": slug.current }
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
export interface AiSearchFaqSection {
  _id: string;
  heading?: string;
  intro?: string;
  faqs?: FAQ[];
}

const CANONICAL_AI_FAQ_ANSWERS = {
  whatIsHouseOfRose:
    'House of Rose Aesthetics is an advanced aesthetics and wellness studio and medical spa in Punta Gorda, Florida. The studio brings personalized skin, aesthetic, and wellness services together in a calm, unhurried setting for clients across Charlotte County and Southwest Florida. Walk-ins are welcome, and appointments are recommended to reserve a time.',
  location:
    'House of Rose Aesthetics is located at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. The studio serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.',
  booking:
    'Call (844) 941-7673 to reserve a time, or review the service menu at https://houseofrose.glossgenius.com/services. Walk-ins are welcome; appointments are recommended for guaranteed timing.',
} as const;

// These three answers contain canonical business facts. Keep the Sanity-authored
// questions/order, but prevent a stale CMS value from republishing wrong visit,
// location, or service-area information.
export const AI_SEARCH_FAQ_QUERY = /* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    _id,
    "heading": aiSearchFaqHeading,
    "intro": aiSearchFaqIntro,
    "faqs": aiSearchFaqs[]{
      _key,
      question,
      "answer": select(
        _key == "ai-what-is-house-of-rose" => ${JSON.stringify(CANONICAL_AI_FAQ_ANSWERS.whatIsHouseOfRose)},
        _key == "ai-where-is-house-of-rose" => ${JSON.stringify(CANONICAL_AI_FAQ_ANSWERS.location)},
        _key == "ai-book-consultation" => ${JSON.stringify(CANONICAL_AI_FAQ_ANSWERS.booking)},
        answer
      )
    }
  }
`;

export interface FaqGroup {
  _id: string;
  source: string;
  slug: string;
  type: 'service' | 'costGuide' | 'comparison' | 'localArea';
  faqs: FAQ[];
}

export const FAQ_AGGREGATE_QUERY = /* groq */ `
  *[
    (
      (_type == "service" && status in ["live", "actual-menu"]) ||
      _type == "costGuide" ||
      (_type == "comparison" && status == "live" && !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ})) ||
      (_type == "localArea" && slug.current in ${CANONICAL_LOCAL_AREA_SLUGS_GROQ})
    ) &&
    count(faqs) > 0
  ]
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
    careKicker, careHeading, carePara1, carePara2, careCtaText,
    expKicker, expHeading, expPara1, expPara2,
    localKicker, localHeading, localPara1, localPara2,
    finalHeading, finalPara, finalCtaText, finalAddressLine
  }
`;

// ── Professional Makeup (nested singletons) — /services/professional-makeup/* ──
// See docs/internal_only/services/makeup/PROFESSIONAL-MAKEUP-BUILD-PLAN.md. Provider: Aundrea Pedigo.

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
