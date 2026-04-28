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

export interface Service {
  _id: string;
  title: string;
  slug: string;
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

export interface ServiceCollection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: SanityImage;
  services: Service[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
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
  *[_type == "service"] | order(orderRank asc, title asc) {
    _id,
    title,
    "slug": slug.current,
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
    tagline,
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
  *[_type == "product"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
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
