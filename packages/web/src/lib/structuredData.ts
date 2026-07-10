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

type JsonLd = Record<string, unknown>;

/** Serialize one or more JSON-LD objects for `set:html` on a <script type="application/ld+json">. */
export function jsonLd(data: JsonLd): string {
  return JSON.stringify(data);
}

// ─── Shared graph fragments ────────────────────────────────────────────────────

function providerNode(siteUrl: string): JsonLd {
  return {
    '@type': 'HealthAndBeautyBusiness',
    name: LOCAL_BUSINESS.name,
    url: siteUrl,
    telephone: LOCAL_BUSINESS.telephone,
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

export function breadcrumbList(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
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
}

export function service(input: ServiceInput, siteUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
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
    areaServed: areaServedNode(),
  };
}

/** LocalBusiness node for local-authority (/areas) pages. */
export function localBusiness(input: { url: string; areaName?: string; image?: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: LOCAL_BUSINESS.name,
    url: input.url,
    telephone: LOCAL_BUSINESS.telephone,
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
    creator: { '@type': 'Organization', name: LOCAL_BUSINESS.name },
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
