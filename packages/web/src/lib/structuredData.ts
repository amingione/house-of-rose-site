/**
 * Typed JSON-LD builders for House of Rose.
 *
 * Every content page MUST emit structured data through these helpers — never hand-roll
 * schema objects inside `.astro` files. See docs/SEO-AEO-PLAYBOOK.md §4 for the contract.
 *
 * Canonical NAP lives in Sanity `siteSettings`; LOCAL_BUSINESS below mirrors it for build-time
 * JSON-LD. If business facts change, update both.
 */

import type { FAQ } from '@/lib/queries';

// ─── Canonical business facts (NAP) — single source for JSON-LD ────────────────

export const LOCAL_BUSINESS = {
  name: 'House of Rose Aesthetics',
  legalName: 'House of Rose Aesthetics',
  telephone: '+18449417673',
  streetAddress: '525 E Olympia Ave, Unit 9',
  addressLocality: 'Punta Gorda',
  addressRegion: 'FL',
  postalCode: '33950',
  addressCountry: 'US',
  latitude: 26.9298,
  longitude: -82.0454,
  geoRadiusMeters: 50000,
} as const;

export const BUSINESS_PROFILES = [
  'https://www.instagram.com/houseofrosefl/',
  'https://www.facebook.com/people/House-Of-Rose-Aesthetics/',
] as const;

export const BUSINESS_URLS = {
  booking: 'https://houseofrose.glossgenius.com/services',
  map: 'https://maps.google.com/?q=525+E+Olympia+Ave+Unit+9+Punta+Gorda+FL+33950',
} as const;

export type JsonLd = Record<string, unknown>;

// ─── Shared graph fragments ────────────────────────────────────────────────────

function providerNode(siteUrl: string): JsonLd {
  const baseUrl = new URL('/', siteUrl).toString();
  return {
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${baseUrl}#business`,
    name: LOCAL_BUSINESS.name,
    alternateName: 'House of Rose',
    url: baseUrl,
    telephone: LOCAL_BUSINESS.telephone,
    sameAs: [...BUSINESS_PROFILES],
    address: {
      '@type': 'PostalAddress',
      streetAddress: LOCAL_BUSINESS.streetAddress,
      addressLocality: LOCAL_BUSINESS.addressLocality,
      addressRegion: LOCAL_BUSINESS.addressRegion,
      postalCode: LOCAL_BUSINESS.postalCode,
      addressCountry: LOCAL_BUSINESS.addressCountry,
    },
  };
}

function websiteNode(siteUrl: string): JsonLd {
  const baseUrl = new URL('/', siteUrl).toString();
  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: LOCAL_BUSINESS.name,
    alternateName: 'House of Rose',
    inLanguage: 'en-US',
    publisher: { '@id': `${baseUrl}#business` },
  };
}

function areaServedNode(): JsonLd {
  return {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: String(LOCAL_BUSINESS.latitude),
      longitude: String(LOCAL_BUSINESS.longitude),
    },
    geoRadius: String(LOCAL_BUSINESS.geoRadiusMeters),
  };
}

// ─── Builders ──────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL. */
  item: string;
}

export interface SiteEntityGraphInput {
  url: string;
  name: string;
  description: string;
  image: string;
  imageAlt?: string;
  email?: string;
}

/**
 * Shared entity graph emitted by BaseLayout on every standard page. Stable
 * `@id` references connect the local business, its website, and the current
 * webpage so crawlers can consolidate identity signals across the site.
 */
export function siteEntityGraph(input: SiteEntityGraphInput, siteUrl: string): JsonLd {
  const baseUrl = new URL('/', siteUrl).toString();
  const pageUrl = new URL(input.url, baseUrl).toString();
  const business = {
    ...providerNode(baseUrl),
    description:
      'Private, appointment-only advanced aesthetics and wellness studio in Punta Gorda, Florida.',
    ...(input.email && { email: input.email }),
    // Google wants an actual logo here, not a social card. `og.png` is the
    // 1200x630 share image; the square monogram is the real mark.
    logo: {
      '@type': 'ImageObject',
      '@id': `${baseUrl}#logo`,
      url: new URL('/logos/hr-monogram-2026/monogram-gold-512.png', baseUrl).toString(),
      contentUrl: new URL('/logos/hr-monogram-2026/monogram-gold-512.png', baseUrl).toString(),
      width: 512,
      height: 512,
      caption: LOCAL_BUSINESS.name,
    },
    image: { '@id': `${baseUrl}#logo` },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: LOCAL_BUSINESS.latitude,
      longitude: LOCAL_BUSINESS.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: '$$',
    areaServed: [
      'Punta Gorda',
      'Port Charlotte',
      'Englewood',
      'Venice',
      'North Port',
      'Sarasota',
      'Cape Coral',
      'Charlotte County',
      'Southwest Florida',
    ].map((name) => ({ '@type': 'Place', name })),
    hasMap: BUSINESS_URLS.map,
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card',
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: BUSINESS_URLS.booking,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'Reservation', name: 'Aesthetics consultation or appointment' },
    },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      websiteNode(baseUrl),
      {
        '@type': 'ImageObject',
        '@id': `${pageUrl}#primaryimage`,
        url: input.image,
        contentUrl: input.image,
        caption: input.imageAlt ?? input.name,
        representativeOfPage: true,
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: input.name,
        description: input.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}#website` },
        about: { '@id': `${baseUrl}#business` },
        primaryImageOfPage: { '@id': `${pageUrl}#primaryimage` },
      },
    ],
  };
}

export interface PersonProfileInput {
  name: string;
  jobTitle: string;
  url: string;
  email?: string;
  telephone?: string;
  image?: string;
  knowsAbout?: string[];
}

/** Person entity for provider profile and digital-card pages. */
export function personProfile(input: PersonProfileInput, siteUrl: string): JsonLd {
  const baseUrl = new URL('/', siteUrl).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${input.url}#person`,
    name: input.name,
    jobTitle: input.jobTitle,
    url: input.url,
    mainEntityOfPage: { '@type': 'ProfilePage', '@id': `${input.url}#webpage`, url: input.url },
    worksFor: { '@id': `${baseUrl}#business` },
    ...(input.email && { email: input.email }),
    ...(input.telephone && { telephone: input.telephone }),
    ...(input.image && { image: input.image }),
    ...(input.knowsAbout?.length && { knowsAbout: input.knowsAbout }),
  };
}

export function breadcrumbList(items: BreadcrumbItem[]): JsonLd {
  const pageUrl = items.at(-1)?.item;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    ...(pageUrl && { '@id': `${pageUrl}#breadcrumb` }),
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  url: string;
}

/** Generic page entity for legal and utility pages that do not fit a richer page schema. */
export function webPage(input: WebPageInput, siteUrl: string): JsonLd {
  const baseUrl = new URL('/', siteUrl).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${baseUrl}#website` },
    about: { '@id': `${baseUrl}#business` },
  };
}

export function faqPage(faqs: Pick<FAQ, 'question' | 'answer'>[]): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export function article(input: ArticleInput, siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    ...(input.description && { description: input.description }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    ...(input.image && { image: input.image }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    author: providerNode(siteUrl),
    publisher: providerNode(siteUrl),
  };
}

export interface ServiceInput {
  name: string;
  description?: string;
  url: string;
  image?: string;
  serviceType?: string;
  /** Minimum price in USD, if known. */
  minPrice?: number | null;
  /** For packages: the included services, rendered as an OfferCatalog. */
  catalog?: { name: string; items: string[] };
}

export function service(input: ServiceInput, siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.url}#service`,
    name: input.name,
    description: input.description ?? '',
    provider: providerNode(siteUrl),
    url: input.url,
    ...(input.image && { image: input.image }),
    serviceType: input.serviceType ?? input.name,
    ...(input.minPrice != null && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: input.minPrice,
          priceCurrency: 'USD',
        },
      },
    }),
    ...(input.catalog && input.catalog.items.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: input.catalog.name,
        itemListElement: input.catalog.items.map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name },
        })),
      },
    }),
    areaServed: areaServedNode(),
  };
}

/**
 * LocalBusiness node for local-authority (/areas) pages. Uses a page-scoped `@id`
 * (`#localbusiness`) rather than the global `#business` so Google does NOT merge it
 * with BaseLayout's site-wide business node — that merge collapsed the per-area
 * `areaServed` into the global service-area array. This node asserts the business's
 * presence *for this specific city*.
 */
export function localBusiness(input: { url: string; areaName?: string; image?: string }): JsonLd {
  const baseUrl = new URL('/', input.url).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${input.url}#localbusiness`,
    name: LOCAL_BUSINESS.name,
    alternateName: 'House of Rose',
    url: baseUrl,
    telephone: LOCAL_BUSINESS.telephone,
    sameAs: [...BUSINESS_PROFILES],
    ...(input.image && { image: input.image }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: LOCAL_BUSINESS.streetAddress,
      addressLocality: LOCAL_BUSINESS.addressLocality,
      addressRegion: LOCAL_BUSINESS.addressRegion,
      postalCode: LOCAL_BUSINESS.postalCode,
      addressCountry: LOCAL_BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: LOCAL_BUSINESS.latitude,
      longitude: LOCAL_BUSINESS.longitude,
    },
    areaServed: input.areaName ?? `${LOCAL_BUSINESS.addressLocality}, ${LOCAL_BUSINESS.addressRegion}`,
    hasMap: BUSINESS_URLS.map,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  };
}

export interface ImageObjectInput {
  contentUrl: string;
  caption?: string;
  /** Absolute URL of the page the image lives on. */
  url?: string;
}

export function imageObject(input: ImageObjectInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: input.contentUrl,
    ...(input.caption && { caption: input.caption }),
    ...(input.url && { url: input.url }),
    creator: { '@id': `${new URL('/', input.url ?? input.contentUrl).toString()}#business` },
  };
}

export interface BrandInput {
  /** Brand name, e.g. "jane iredale". */
  name: string;
  description?: string;
  /** Absolute URL of the page featuring the brand. */
  url?: string;
  /** Brand's own website, e.g. https://janeiredale.com/ */
  sameAs?: string;
  slogan?: string;
  logo?: string;
}

/**
 * Brand node for brand-feature pages (e.g. the Jane Iredale page). Emitted
 * alongside a BreadcrumbList (+ FAQPage when FAQs exist). Keep claims neutral —
 * no efficacy or medical assertions belong in structured data either.
 */
export function brand(input: BrandInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.url && { url: input.url }),
    ...(input.slogan && { slogan: input.slogan }),
    ...(input.logo && { logo: input.logo }),
    ...(input.sameAs && { sameAs: [input.sameAs] }),
  };
}

export interface ProductInput {
  name: string;
  description?: string;
  /** Absolute URL of the product page. */
  url: string;
  image?: string;
  brand?: string;
  /** Price in USD dollars, if known. */
  price?: number | null;
  inStock?: boolean;
  /** External purchase URL (escape hatch); defaults to the product page URL. */
  offerUrl?: string;
}

/**
 * Product node for shop detail pages. An `Offer` is emitted whenever a price is
 * known OR an external purchase URL exists (so call-to-order products with a
 * `purchaseUrl` still carry an offer). Price is USD dollars.
 */
export function product(input: ProductInput): JsonLd {
  const hasOffer = input.price != null || Boolean(input.offerUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${input.url}#product`,
    name: input.name,
    ...(input.description && { description: input.description }),
    url: input.url,
    ...(input.image && { image: input.image }),
    ...(input.brand && { brand: { '@type': 'Brand', name: input.brand } }),
    ...(hasOffer && {
      offers: {
        '@type': 'Offer',
        url: input.offerUrl ?? input.url,
        availability:
          input.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        ...(input.price != null && { priceCurrency: 'USD', price: input.price.toFixed(2) }),
      },
    }),
  };
}

export interface BlogPostingInput {
  headline: string;
  description?: string;
  /** Absolute URL of the post. */
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  readingTimeMinutes?: number;
}

/** BlogPosting node for journal articles. Author/publisher resolve to the canonical business. */
export function blogPosting(input: BlogPostingInput, siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.url}#article`,
    headline: input.headline,
    ...(input.description && { description: input.description }),
    url: input.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${input.url}#webpage` },
    ...(input.image && { image: input.image }),
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.readingTimeMinutes && { timeRequired: `PT${input.readingTimeMinutes}M` }),
    author: providerNode(siteUrl),
    publisher: providerNode(siteUrl),
  };
}

export interface ItemListEntry {
  name: string;
  /** Absolute URL. */
  url: string;
}

/** Ordered ItemList — for hub/index pages that link out to a set of pages (concerns, collections). */
export function itemList(entries: ItemListEntry[], name?: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(name && { name }),
    itemListElement: entries.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: entry.url,
    })),
  };
}
