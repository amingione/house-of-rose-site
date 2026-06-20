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
