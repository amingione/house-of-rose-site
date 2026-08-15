import type { BookingMode } from './booking';
import {
  TREATMENT_PAGE_FIELDS,
  type TreatmentPageFields,
  type TreatmentProviderAttribution,
} from './treatmentQueries';
import { REVIEWED_PUBLIC_COMPARISON_SLUGS } from './publicComparisonContent';
import { REVIEWED_PUBLIC_COLLECTION_SLUGS } from './publicCollectionContent';
import { RETIRED_PUBLIC_CONCERN_SLUGS } from './publicConcernContent';
import {
  RETIRED_COST_GUIDE_SLUGS,
  REVIEWED_PUBLIC_COST_GUIDE_SLUGS,
} from './publicCostGuideContent';
import { REVIEWED_PUBLIC_LOCAL_AREA_SLUGS } from './publicLocalAreaContent';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from './publicServiceContent';
import { VERIFIED_TREATMENT_PACKAGE_SLUGS } from './publicTreatmentPackageContent';

export { REVIEWED_PUBLIC_COLLECTION_SLUGS } from './publicCollectionContent';
export { REVIEWED_PUBLIC_COST_GUIDE_SLUGS } from './publicCostGuideContent';

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
  'microchanneling-vs-microneedling',
  'prf-microchanneling-vs-microneedling',
  'prf-injections-vs-ez-gel',
  'Procell-serum-vs-prf',
  'Procell-vs-topical-prf',
  'procell-serum-vs-prf',
  'procell-vs-topical-prf',
  'topical-prf-vs-prf-injections',
] as const;
const RETIRED_COMPARISON_SLUGS_GROQ = JSON.stringify(RETIRED_COMPARISON_SLUGS);
const REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ = JSON.stringify(REVIEWED_PUBLIC_COMPARISON_SLUGS);

const RETIRED_COST_GUIDE_SLUGS_GROQ = JSON.stringify(RETIRED_COST_GUIDE_SLUGS);
const REVIEWED_PUBLIC_COST_GUIDE_SLUGS_GROQ = JSON.stringify(REVIEWED_PUBLIC_COST_GUIDE_SLUGS);

// Published Sanity records that are not verified as current GlossGenius offerings.
// Keep them available for reconciliation without exposing them as public services.
const UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ = JSON.stringify(UNAVAILABLE_PUBLIC_SERVICE_SLUGS);

// Concern routes retired at the edge must not be emitted again from dereferenced
// service records. The source reference remains in Sanity for reconciliation.
const RETIRED_PUBLIC_CONCERN_SLUGS_GROQ = JSON.stringify(RETIRED_PUBLIC_CONCERN_SLUGS);

const REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ = JSON.stringify(REVIEWED_PUBLIC_COLLECTION_SLUGS);

// A package is public only when its package price is represented in the
// current GlossGenius-backed menu. Other published Sanity records remain
// available for reconciliation without advertising unsupported offerings.
const VERIFIED_TREATMENT_PACKAGE_SLUGS_GROQ = JSON.stringify(VERIFIED_TREATMENT_PACKAGE_SLUGS);

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

export interface PrivacySection {
  _key: string;
  heading: string;
  body: string;
}

export interface PrivacyPolicy {
  _id?: string;
  seoTitle?: string;
  seoDescription?: string;
  pageTitle?: string;
  intro?: string;
  sections?: PrivacySection[];
}

export const PRIVACY_POLICY_QUERY = /* groq */ `
  *[_type == "privacyPolicy" && _id == "privacyPolicy"][0] {
    _id,
    seoTitle,
    seoDescription,
    pageTitle,
    intro,
    sections[]{ _key, heading, body }
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

export interface Service extends TreatmentPageFields {
  _id: string;
  title: string;
  slug: string;
  kind?: ServiceKind;
  provider?: TreatmentProviderAttribution;
  parentService?: { title: string; slug: string };
  treatments?: Service[];
  tagline?: string;
  duration?: string;
  price?: number | string;
  bookingMode?: BookingMode;
  bookingUrl?: string;
  bookingVerifiedAt?: string;
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
  contextualServices?: Service[];
  costGuides?: CostGuide[];
  comparisons?: ServiceComparison[];
  _updatedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
}

/** A comparison that contextually references a service as either option. */
export interface ServiceComparison {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
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
  comparisons?: ServiceComparison[];
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
  merchantStatus?: 'eligible' | 'incomplete' | 'excluded';
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
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagramHandle?: string;
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
  relatedService?: ServiceRef;
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

// ─── Queries ─────────────────────────────────────────────────────────────────

const COMPARISON_ROUTEABLE_OPTIONS = /* groq */ `
  optionA.service->status in ["live", "actual-menu"] &&
  defined(optionA.service->slug.current) &&
  !(optionA.service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
  optionB.service->status in ["live", "actual-menu"] &&
  defined(optionB.service->slug.current) &&
  !(optionB.service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
`;

const PUBLIC_PROVIDER_PREDICATE = /* groq */ `
  showOnWebsite == true &&
  defined(slug.current) &&
  coalesce(publicRole, roleCredential, "") != "" &&
  coalesce(summary, "") != "" &&
  count(biography) > 0 &&
  count(serviceFocus) > 0
`;

export const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    description,
    email,
    phone,
    address,
    instagramHandle
  }
`;

export const ALL_SERVICES_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) && (kind != "treatment" || !defined(kind))] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    tagline,
    duration,
    price,
    bookingMode,
    bookingUrl,
    bookingVerifiedAt,
    _updatedAt,
    ${IMAGE_FIELDS},
    "collection": select(
      defined(collection->slug.current) &&
      collection->slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ} =>
        collection->{ title, "slug": slug.current }
    ),
    "seo": seo { metaTitle, metaDescription }
  }
`;

/**
 * Child treatments that merit a direct entry in the compact public inventory.
 * Keep this explicit so the services directory can remain hub-led without
 * dropping a newly approved canonical treatment from llms.txt.
 */
export const LLMS_FEATURED_TREATMENTS_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && slug.current in ["prf-under-eyes"] && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    duration,
    price,
    bookingMode,
    bookingUrl,
    bookingVerifiedAt,
    _updatedAt
  }
`;

export const ALL_SITEMAP_SERVICES_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})] | order(coalesce(parentService->title, title) asc, kind asc, orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    kind,
    _updatedAt,
    "parentService": select(
      parentService->kind == "hub" &&
      parentService->status in ["live", "actual-menu"] &&
      defined(parentService->slug.current) &&
      !(parentService->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
      => parentService->{ title, "slug": slug.current }
    )
  }
`;

export const SERVICE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && slug.current == $slug && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})][0] {
    _id,
    title,
    "slug": slug.current,
    kind,
    "provider": provider->{
      _id,
      publicName,
      "profileSlug": select(${PUBLIC_PROVIDER_PREDICATE} => slug.current),
      profileImagePath,
      "profileImageAlt": profileImage.alt
    },
    "parentService": select(
      parentService->kind == "hub" &&
      parentService->status in ["live", "actual-menu"] &&
      defined(parentService->slug.current) &&
      !(parentService->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
      => parentService->{ title, "slug": slug.current }
    ),
    "treatments": *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) && parentService._ref == ^._id] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      price,
      duration,
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
      ${IMAGE_FIELDS}
    },
    tagline,
    price,
    duration,
    bookingMode,
    bookingUrl,
    bookingVerifiedAt,
    description,
    whoItsFor,
    "concerns": concerns[
      @->status == "live" &&
      defined(@->slug.current) &&
      !(@->slug.current in ${RETIRED_PUBLIC_CONCERN_SLUGS_GROQ})
    ]->{
      _id,
      title,
      "slug": slug.current,
      intro
    },
    benefits,
    process,
    _updatedAt,
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
    "collection": select(
      defined(collection->slug.current) &&
      collection->slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ} =>
        collection->{ title, "slug": slug.current }
    ),
    "relatedServices": relatedServices[@->status in ["live", "actual-menu"] && defined(@->slug.current) && !(@->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})]->{
      _id,
      title,
      "slug": slug.current,
      tagline,
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
      ${IMAGE_FIELDS}
    },
    "contextualServices": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      defined(slug.current) &&
      !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
      _id != ^._id &&
      defined(^.collection._ref) &&
      collection._ref == ^.collection._ref
    ] | order(orderRank asc, title asc) [0...6] {
      _id,
      title,
      "slug": slug.current,
      tagline,
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
      ${IMAGE_FIELDS}
    },
    "costGuides": *[
      _type == "costGuide" &&
      defined(slug.current) &&
      !(slug.current in ${RETIRED_COST_GUIDE_SLUGS_GROQ}) &&
      treatment._ref == ^._id
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current
    },
    "comparisons": *[
      _type == "comparison" &&
      status == "live" &&
      defined(slug.current) &&
      slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
      !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
      ${COMPARISON_ROUTEABLE_OPTIONS} &&
      (optionA.service._ref == ^._id || optionB.service._ref == ^._id)
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      intro
    },
    ${TREATMENT_PAGE_FIELDS}
  }
`;

export const ALL_COLLECTIONS_QUERY = /* groq */ `
  *[_type == "serviceCollection" && defined(slug.current) && slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ}] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    ${IMAGE_FIELDS},
    "services": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      defined(slug.current) &&
      !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
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
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
      ${IMAGE_FIELDS}
    }
  }
`;

/**
 * Lightweight variant of ALL_COLLECTIONS_QUERY for the header mega-menu:
 * titles + slugs only (no images/descriptions) so the nav stays cheap to build.
 */
export const NAV_COLLECTIONS_QUERY = /* groq */ `
  *[_type == "serviceCollection" && defined(slug.current) && slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ}] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    "services": *[
      _type == "service" &&
      status in ["live", "actual-menu"] &&
      defined(slug.current) &&
      !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
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
  *[_type == "serviceCollection" && slug.current == $slug && slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ}][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    presentation,
    headline,
    intro,
    featuredServices[!(service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})] {
      _key,
      summary,
      linkLabel,
      "service": service->{
        _id,
        title,
        "slug": slug.current,
        tagline,
        duration,
        bookingMode,
        bookingUrl,
        bookingVerifiedAt,
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
      defined(slug.current) &&
      !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
      (kind != "treatment" || !defined(kind)) &&
      references(^._id)
    ] | order(orderRank asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      tagline,
      duration,
      price,
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
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
  *[_type == "concern" && status == "live" && defined(slug.current) && !(slug.current in ${RETIRED_PUBLIC_CONCERN_SLUGS_GROQ})] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS}
  }
`;

export const CONCERN_BY_SLUG_QUERY = /* groq */ `
  *[_type == "concern" && status == "live" && slug.current == $slug && !(slug.current in ${RETIRED_PUBLIC_CONCERN_SLUGS_GROQ})][0] {
    _id,
    title,
    "slug": slug.current,
    intro,
    ${IMAGE_FIELDS},
    "seo": seo { metaTitle, metaDescription },
    "treatments": *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) && ^._id in concerns[]._ref] | order(orderRank asc, title asc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      tagline,
      price,
      duration,
      bookingMode,
      bookingUrl,
      bookingVerifiedAt,
      ${IMAGE_FIELDS}
    },
    "comparisons": *[
      _type == "comparison" &&
      status == "live" &&
      defined(slug.current) &&
      slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
      !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
      (
        (
          optionA.service->status in ["live", "actual-menu"] &&
          !(optionA.service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
          ^._id in optionA.service->concerns[]._ref
        ) ||
        (
          optionB.service->status in ["live", "actual-menu"] &&
          !(optionB.service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) &&
          ^._id in optionB.service->concerns[]._ref
        )
      )
    ] | order(orderRank asc, title asc) [0...3] {
      _id,
      title,
      "slug": slug.current
    }
  }
`;

export const ALL_CONCERN_SLUGS_QUERY = /* groq */ `
  *[_type == "concern" && status == "live" && defined(slug.current) && !(slug.current in ${RETIRED_PUBLIC_CONCERN_SLUGS_GROQ})]{ "slug": slug.current }
`;

// Slug arrays for Astro getStaticPaths()
export const ALL_SERVICE_SLUGS_QUERY = /* groq */ `
  *[_type == "service" && status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})]{ "slug": slug.current }
`;

export const ALL_COLLECTION_SLUGS_QUERY = /* groq */ `
  *[_type == "serviceCollection" && defined(slug.current) && slug.current in ${REVIEWED_PUBLIC_COLLECTION_SLUGS_GROQ}]{ "slug": slug.current }
`;

export const ALL_PRODUCT_SLUGS_QUERY = /* groq */ `
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`;

export const ALL_BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(publishedAt) && defined(slug.current) && count(body) > 0] | order(publishedAt desc) {
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
  *[_type == "blogPost" && slug.current == $slug && defined(publishedAt) && count(body) > 0][0] {
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
    "relatedService": select(
      relatedService->status in ["live", "actual-menu"] &&
      defined(relatedService->slug.current) &&
      !(relatedService->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) =>
        relatedService->{ title, "slug": slug.current, tagline, bookingMode, bookingUrl, bookingVerifiedAt }
    ),
    "seo": seo { metaTitle, metaDescription },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180)
  }
`;

export const ALL_BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && count(body) > 0]{ "slug": slug.current }
`;

export interface AboutPageContent {
  _id?: string;
  indexImageUrl?: string;
  indexImageAlt?: string;
  hraImageUrl?: string;
  hraImageAlt?: string;
}

export const ABOUT_PAGE_QUERY = /* groq */ `
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    _id,
    "indexImageUrl": indexImage.asset->url,
    "indexImageAlt": indexImage.alt,
    "hraImageUrl": hraImage.asset->url,
    "hraImageAlt": hraImage.alt
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

export interface PublicProviderProfile {
  _id: string;
  slug: string;
  publicName: string;
  publicRole: string;
  summary: string;
  biography: string[];
  serviceFocus: string[];
  imageUrl?: string;
  imageAlt?: string;
  digitalCardPath?: string;
  listingOrder: number;
  medicallyDirected?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
}

const PUBLIC_PROVIDER_FIELDS = /* groq */ `
  _id,
  "slug": slug.current,
  "publicName": coalesce(publicName, fullName, title),
  "publicRole": coalesce(publicRole, roleCredential),
  summary,
  biography,
  serviceFocus,
  "imageUrl": coalesce(profileImage.asset->url, profileImagePath),
  "imageAlt": profileImage.alt,
  digitalCardPath,
  "listingOrder": coalesce(listingOrder, 100),
  medicallyDirected,
  seo { metaTitle, metaDescription }
`;

export const PUBLIC_PROVIDERS_QUERY = /* groq */ `
  *[_type == "provider" && ${PUBLIC_PROVIDER_PREDICATE}]
    | order(listingOrder asc, publicName asc) {
      ${PUBLIC_PROVIDER_FIELDS}
    }
`;

export const PUBLIC_PROVIDER_BY_SLUG_QUERY = /* groq */ `
  *[_type == "provider" && slug.current == $slug && ${PUBLIC_PROVIDER_PREDICATE}][0] {
    ${PUBLIC_PROVIDER_FIELDS}
  }
`;

export type PackageType = 'series' | 'journey' | 'combo';
export type PackageStatus = 'live' | 'proposed' | 'parked';

export interface PackageServiceRef {
  _id: string;
  title: string;
  slug: string;
}

export interface TreatmentPackage {
  _id: string;
  title: string;
  slug: string;
  type?: PackageType;
  status?: PackageStatus;
  servicesIncluded?: PackageServiceRef[];
  cadence?: string;
  image?: SanityImage;
}

const PACKAGE_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  type,
  status,
  "servicesIncluded": servicesIncluded[
    @->status in ["live", "actual-menu"] &&
    defined(@->slug.current) &&
    !(@->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
  ]->{ _id, title, "slug": slug.current },
  cadence,
  ${IMAGE_FIELDS}
`;

const PACKAGE_HAS_ROUTEABLE_SERVICE = /* groq */ `
  count(servicesIncluded[
    @->status in ["live", "actual-menu"] &&
    defined(@->slug.current) &&
    !(@->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
  ]) > 0
`;

export const ALL_TREATMENT_PACKAGES_QUERY = /* groq */ `
  *[
    _type == "treatmentPackage" &&
    status == "live" &&
    slug.current in ${VERIFIED_TREATMENT_PACKAGE_SLUGS_GROQ} &&
    ${PACKAGE_HAS_ROUTEABLE_SERVICE}
  ] | order(orderRank asc, _createdAt desc) {
    ${PACKAGE_FIELDS}
  }
`;

export const TREATMENT_PACKAGE_BY_SLUG_QUERY = /* groq */ `
  *[
    _type == "treatmentPackage" &&
    status == "live" &&
    slug.current == $slug &&
    slug.current in ${VERIFIED_TREATMENT_PACKAGE_SLUGS_GROQ} &&
    ${PACKAGE_HAS_ROUTEABLE_SERVICE}
  ][0] {
    ${PACKAGE_FIELDS}
  }
`;

export const ALL_TREATMENT_PACKAGE_SLUGS_QUERY = /* groq */ `
  *[
    _type == "treatmentPackage" &&
    status == "live" &&
    defined(slug.current) &&
    slug.current in ${VERIFIED_TREATMENT_PACKAGE_SLUGS_GROQ} &&
    ${PACKAGE_HAS_ROUTEABLE_SERVICE}
  ]{ "slug": slug.current }
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
  bookingMode?: BookingMode;
  bookingUrl?: string;
  bookingVerifiedAt?: string;
}

export interface CostGuide {
  _id: string;
  title: string;
  slug: string;
  treatment?: ServiceRef;
  comparisons?: ServiceComparison[];
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
  _id, title, "slug": slug.current, tagline, price, duration, bookingMode, bookingUrl, bookingVerifiedAt
`;

// ── Cost guides ──────────────────────────────────────────────────────────────
const COST_GUIDE_ROUTEABLE_TREATMENT = /* groq */ `
  treatment->status in ["live", "actual-menu"] &&
  defined(treatment->slug.current) &&
  !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
`;

export const ALL_COST_GUIDES_QUERY = /* groq */ `
  *[_type == "costGuide" && defined(slug.current) && slug.current in ${REVIEWED_PUBLIC_COST_GUIDE_SLUGS_GROQ} && !(slug.current in ${RETIRED_COST_GUIDE_SLUGS_GROQ}) && ${COST_GUIDE_ROUTEABLE_TREATMENT}] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, _updatedAt,
    "treatment": select(
      treatment->status in ["live", "actual-menu"] &&
      defined(treatment->slug.current) &&
      !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
      => treatment->{ ${SERVICE_REF_FIELDS} }
    ),
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const COST_GUIDE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "costGuide" && slug.current == $slug && slug.current in ${REVIEWED_PUBLIC_COST_GUIDE_SLUGS_GROQ} && !(slug.current in ${RETIRED_COST_GUIDE_SLUGS_GROQ}) && ${COST_GUIDE_ROUTEABLE_TREATMENT}][0] {
    _id, title, "slug": slug.current, _updatedAt,
    "treatment": select(
      treatment->status in ["live", "actual-menu"] &&
      defined(treatment->slug.current) &&
      !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
      => treatment->{ ${SERVICE_REF_FIELDS} }
    ),
    "comparisons": *[
      _type == "comparison" &&
      status == "live" &&
      defined(slug.current) &&
      slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
      !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
      defined(^.treatment._ref) &&
      (optionA.service._ref == ^.treatment._ref || optionB.service._ref == ^.treatment._ref)
    ] | order(orderRank asc, title asc) [0...2] {
      _id, title, "slug": slug.current, intro
    },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_COST_GUIDE_SLUGS_QUERY = /* groq */ `
  *[_type == "costGuide" && defined(slug.current) && slug.current in ${REVIEWED_PUBLIC_COST_GUIDE_SLUGS_GROQ} && !(slug.current in ${RETIRED_COST_GUIDE_SLUGS_GROQ}) && ${COST_GUIDE_ROUTEABLE_TREATMENT}]{ "slug": slug.current }
`;

// ── Comparisons ──────────────────────────────────────────────────────────────
const COMPARISON_OPTION_FIELDS = /* groq */ `
  label, summary, bestFor,
  "service": select(
    service->status in ["live", "actual-menu"] &&
    defined(service->slug.current) &&
    !(service->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
    => service->{ ${SERVICE_REF_FIELDS} }
  )
`;

export const ALL_COMPARISONS_QUERY = /* groq */ `
  *[
    _type == "comparison" &&
    status == "live" &&
    slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
    !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
    ${COMPARISON_ROUTEABLE_OPTIONS}
  ] | order(orderRank asc, title asc) {
    _id, title, "slug": slug.current, intro, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const COMPARISON_BY_SLUG_QUERY = /* groq */ `
  *[
    _type == "comparison" &&
    status == "live" &&
    slug.current == $slug &&
    slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
    !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
    ${COMPARISON_ROUTEABLE_OPTIONS}
  ][0] {
    _id, title, "slug": slug.current, intro, verdict, _updatedAt,
    "optionA": optionA{ ${COMPARISON_OPTION_FIELDS} },
    "optionB": optionB{ ${COMPARISON_OPTION_FIELDS} },
    rows[]{ _key, attribute, valueA, valueB },
    faqs[]{ _key, question, answer },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_COMPARISON_SLUGS_QUERY = /* groq */ `
  *[
    _type == "comparison" &&
    status == "live" &&
    defined(slug.current) &&
    slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} &&
    !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ}) &&
    ${COMPARISON_ROUTEABLE_OPTIONS}
  ]{ "slug": slug.current }
`;

// ── Local areas ──────────────────────────────────────────────────────────────
const CANONICAL_LOCAL_AREA_SLUGS_GROQ = JSON.stringify(REVIEWED_PUBLIC_LOCAL_AREA_SLUGS);

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
    "servedServices": servedServices[
      @->status in ["live", "actual-menu"] &&
      defined(@->slug.current) &&
      !(@->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
    ]->{ ${SERVICE_REF_FIELDS} },
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
  *[
    _type == "caseStudy" &&
    consentGiven == true &&
    defined(slug.current) &&
    defined(beforeImage.asset) &&
    defined(afterImage.asset) &&
    treatment->status in ["live", "actual-menu"] &&
    defined(treatment->slug.current) &&
    !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
  ] | order(orderRank asc, _createdAt desc) {
    _id, title, "slug": slug.current, clientProfile, timeframe, _updatedAt,
    "treatment": select(
      treatment->status in ["live", "actual-menu"] &&
      defined(treatment->slug.current) &&
      !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) =>
        treatment->{ ${SERVICE_REF_FIELDS} }
    ),
    "afterImage": afterImage { asset->{ url, metadata { dimensions } }, alt },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const CASE_STUDY_BY_SLUG_QUERY = /* groq */ `
  *[
    _type == "caseStudy" &&
    slug.current == $slug &&
    consentGiven == true &&
    defined(beforeImage.asset) &&
    defined(afterImage.asset) &&
    treatment->status in ["live", "actual-menu"] &&
    defined(treatment->slug.current) &&
    !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
  ][0] {
    _id, title, "slug": slug.current, consentGiven, clientProfile, protocol, timeframe, outcome, _updatedAt,
    "treatment": select(
      treatment->status in ["live", "actual-menu"] &&
      defined(treatment->slug.current) &&
      !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ}) =>
        treatment->{ ${SERVICE_REF_FIELDS} }
    ),
    "concern": select(
      concern->status == "live" &&
      defined(concern->slug.current) &&
      !(concern->slug.current in ${RETIRED_PUBLIC_CONCERN_SLUGS_GROQ}) =>
        concern->{ title, "slug": slug.current }
    ),
    "beforeImage": beforeImage { asset->{ url, metadata { dimensions } }, alt },
    "afterImage": afterImage { asset->{ url, metadata { dimensions } }, alt },
    "seo": seo { metaTitle, metaDescription }
  }
`;

export const ALL_CASE_STUDY_SLUGS_QUERY = /* groq */ `
  *[
    _type == "caseStudy" &&
    consentGiven == true &&
    defined(slug.current) &&
    defined(beforeImage.asset) &&
    defined(afterImage.asset) &&
    treatment->status in ["live", "actual-menu"] &&
    defined(treatment->slug.current) &&
    !(treatment->slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})
  ]{ "slug": slug.current }
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
  *[
    (
      (_type == "service" && status in ["live", "actual-menu"] && !(slug.current in ${UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ})) ||
      (_type == "costGuide" && !(slug.current in ${RETIRED_COST_GUIDE_SLUGS_GROQ})) ||
      (_type == "comparison" && status == "live" && slug.current in ${REVIEWED_PUBLIC_COMPARISON_SLUGS_GROQ} && !(slug.current in ${RETIRED_COMPARISON_SLUGS_GROQ})) ||
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

// ── Jane Iredale product education — /shop/jane-iredale/ ─────────────────────

export interface LinkRef {
  _key?: string;
  label: string;
  description?: string;
  href: string;
}

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
