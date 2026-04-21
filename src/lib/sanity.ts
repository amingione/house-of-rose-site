import { defaultSiteContent } from "@/lib/content/default-content";
import { SiteContent } from "@/lib/types";

const SANITY_QUERY = `{
  "siteSettings": *[_type == "siteSettings"][0]{
    brandName,
    city,
    state,
    hero,
    about,
    contact,
    seo
  },
  "services": *[_type == "service"] | order(_createdAt asc){
    _id,
    name,
    title,
    description,
    highlight,
    promise,
    details,
    benefits,
    idealFor,
    approach,
    results,
    consultationNote,
    duration,
    downtime,
    "slug": slug.current,
    "heroImage": coalesce(heroImage.asset->url, mainImage.asset->url),
    heroImagePosition,
    heroAlt
  },
  "testimonials": *[_type == "testimonial"] | order(_createdAt desc)[0...6]{
    _id,
    quote,
    author,
    treatment
  },
  "faqs": *[_type == "faq"] | order(_createdAt asc){
    _id,
    question,
    answer
  }
}`;

type SanityPayload = {
  result?: {
    siteSettings?: Partial<SiteContent>;
    services?: Array<Record<string, unknown>>;
    testimonials?: Array<Record<string, unknown>>;
    faqs?: Array<Record<string, unknown>>;
  };
};

const sanityEnvConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET,
);

function asNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const parsed = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function mergeSiteContent(payload?: SanityPayload["result"]): SiteContent {
  if (!payload) {
    return defaultSiteContent;
  }

  const settings = payload.siteSettings ?? {};
  const services = (payload.services ?? []).map((service, index) => {
    const fallback = defaultSiteContent.services[index] ?? defaultSiteContent.services[0];

    return {
      id: asNonEmptyString(service._id, fallback.id),
      slug: asNonEmptyString(service.slug, fallback.slug),
      name: asNonEmptyString(service.name ?? service.title, fallback.name),
      description: asNonEmptyString(service.description, fallback.description),
      highlight: asNonEmptyString(service.highlight, fallback.highlight),
      promise: asNonEmptyString(service.promise, fallback.promise),
      details: asNonEmptyString(service.details, fallback.details),
      benefits: asStringArray(service.benefits, fallback.benefits),
      idealFor: asStringArray(service.idealFor, fallback.idealFor),
      approach: asStringArray(service.approach, fallback.approach),
      results: asStringArray(service.results, fallback.results),
      consultationNote: asNonEmptyString(
        service.consultationNote,
        fallback.consultationNote,
      ),
      duration: asNonEmptyString(service.duration, fallback.duration),
      downtime: asNonEmptyString(service.downtime, fallback.downtime),
      heroImage: asNonEmptyString(service.heroImage, fallback.heroImage),
      heroImagePosition: asNonEmptyString(
        service.heroImagePosition,
        fallback.heroImagePosition,
      ),
      heroAlt: asNonEmptyString(service.heroAlt, fallback.heroAlt),
    };
  });

  const testimonials = (payload.testimonials ?? []).map((item, index) => {
    const fallback =
      defaultSiteContent.testimonials[index] ?? defaultSiteContent.testimonials[0];

    return {
      id: asNonEmptyString(item._id, fallback.id),
      quote: asNonEmptyString(item.quote, fallback.quote),
      author: asNonEmptyString(item.author, fallback.author),
      treatment: asNonEmptyString(item.treatment, fallback.treatment),
    };
  });

  const faqs = (payload.faqs ?? []).map((item, index) => {
    const fallback = defaultSiteContent.faqs[index] ?? defaultSiteContent.faqs[0];

    return {
      id: asNonEmptyString(item._id, fallback.id),
      question: asNonEmptyString(item.question, fallback.question),
      answer: asNonEmptyString(item.answer, fallback.answer),
    };
  });

  return {
    ...defaultSiteContent,
    brandName: asNonEmptyString(settings.brandName, defaultSiteContent.brandName),
    city: asNonEmptyString(settings.city, defaultSiteContent.city),
    state: asNonEmptyString(settings.state, defaultSiteContent.state),
    hero: {
      ...defaultSiteContent.hero,
      ...(settings.hero ?? {}),
      secondaryDescription: asNonEmptyString(
        (settings.hero as Record<string, unknown> | undefined)?.secondaryDescription,
        defaultSiteContent.hero.secondaryDescription,
      ),
    },
    services: services.length > 0 ? services : defaultSiteContent.services,
    about: {
      ...defaultSiteContent.about,
      ...(settings.about ?? {}),
      credentials: asStringArray(
        (settings.about as Record<string, unknown> | undefined)?.credentials,
        defaultSiteContent.about.credentials,
      ),
    },
    testimonials:
      testimonials.length > 0 ? testimonials : defaultSiteContent.testimonials,
    faqs: faqs.length > 0 ? faqs : defaultSiteContent.faqs,
    contact: {
      ...defaultSiteContent.contact,
      ...(settings.contact ?? {}),
    },
    seo: {
      ...defaultSiteContent.seo,
      ...(settings.seo ?? {}),
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!sanityEnvConfigured) {
    return defaultSiteContent;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

  if (!projectId || !dataset) {
    return defaultSiteContent;
  }

  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );
  endpoint.searchParams.set("query", SANITY_QUERY);
  endpoint.searchParams.set("perspective", "published");

  const token = process.env.SANITY_API_READ_TOKEN;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return defaultSiteContent;
    }

    const payload = (await response.json()) as SanityPayload;
    return mergeSiteContent(payload.result);
  } catch {
    return defaultSiteContent;
  }
}

export function getServiceBySlug(content: SiteContent, slug: string) {
  return content.services.find((service) => service.slug === slug);
}
