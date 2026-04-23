import { ServiceDetail, SiteContent } from "@/lib/types";

export type ServiceCollection = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  heroImage: string;
  heroImagePosition: string;
  heroAlt: string;
  ctaLine: string;
  serviceSlugs: string[];
};

export type ResolvedServiceCollection = ServiceCollection & {
  services: ServiceDetail[];
};

const COLLECTIONS: ServiceCollection[] = [
  {
    slug: "facial-artistry",
    name: "Facial Artistry",
    headline: "Expression-preserving enhancements for women who prefer polish over obvious change.",
    description:
      "Focused on structure, balance, and finish, this collection combines injectable planning and beauty detail work to keep your features looking rested, elegant, and unmistakably you.",
    heroImage: "/generated/injectables-editorial.png",
    heroImagePosition: "center center",
    heroAlt: "Editorial treatment setting for facial artistry services",
    ctaLine: "Begin with a facial harmony consultation and leave with a treatment map that respects your features.",
    serviceSlugs: ["injectables", "permanent-makeup", "permanent-jewelry"],
  },
  {
    slug: "skin-regeneration",
    name: "Skin Regeneration",
    headline: "Collagen-forward protocols designed to elevate skin quality with clinical precision.",
    description:
      "For clients prioritizing tone, texture, luminosity, and long-term skin vitality, these regenerative services are built to improve the surface and support healthier-looking skin over time.",
    heroImage: "/generated/skin-renewal-editorial.png",
    heroImagePosition: "center center",
    heroAlt: "Luxury skin renewal treatment room",
    ctaLine: "Explore regenerative options that align with your timeline, sensitivity, and lifestyle.",
    serviceSlugs: ["procell-microchanneling", "prp-rejuvenation"],
  },
  {
    slug: "wellness-restoration",
    name: "Wellness Restoration",
    headline: "Provider-guided wellness support in an environment that feels restorative, not transactional.",
    description:
      "This collection pairs medically informed oversight with boutique hospitality, giving you a structured and private path for wellness goals and recovery support.",
    heroImage: "/generated/hydration-wellness-editorial.png",
    heroImagePosition: "center center",
    heroAlt: "Hydration and wellness lounge atmosphere",
    ctaLine: "Plan a personalized wellness path with clear guidance and concierge-style follow-through.",
    serviceSlugs: ["glp-1-wellness", "hydration-therapy"],
  },
];

function resolveServices(content: SiteContent, slugs: string[]) {
  return slugs
    .map((slug) => content.services.find((service) => service.slug === slug))
    .filter((service): service is ServiceDetail => Boolean(service));
}

export function getServiceCollections(content: SiteContent): ResolvedServiceCollection[] {
  return COLLECTIONS.map((collection) => ({
    ...collection,
    services: resolveServices(content, collection.serviceSlugs),
  })).filter((collection) => collection.services.length > 0);
}

export function getServiceCollectionBySlug(content: SiteContent, slug: string) {
  return getServiceCollections(content).find((collection) => collection.slug === slug);
}

export function getCollectionsForService(content: SiteContent, serviceSlug: string) {
  return getServiceCollections(content).filter((collection) =>
    collection.services.some((service) => service.slug === serviceSlug),
  );
}
