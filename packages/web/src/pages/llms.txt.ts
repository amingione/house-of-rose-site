import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_SERVICES_QUERY,
  LLMS_FEATURED_TREATMENTS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  ALL_CONCERNS_QUERY,
  ALL_COST_GUIDES_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  ALL_CASE_STUDIES_QUERY,
  SITE_SETTINGS_QUERY,
  type Service,
  type BlogPost,
  type Concern,
  type CostGuide,
  type Comparison,
  type LocalArea,
  type CaseStudy,
  type SiteSettings,
} from '@/lib/queries';
import { PROVIDER_PROFILE_FALLBACKS } from '@/lib/aboutFallbacks';
import { getVerifiedCostFact } from '@/lib/costFacts';
import { getPublicBlogTitle, isReviewedPublicBlogSlug } from '@/lib/publicBlogContent';
import {
  filterReviewedPublicComparisons,
  getPublicComparisonContent,
} from '@/lib/publicComparisonContent';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '@/lib/publicServiceContent';
import { resolvePublicSiteFacts } from '@/lib/publicSiteFacts';

const UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET = new Set<string>(UNAVAILABLE_PUBLIC_SERVICE_SLUGS);

export const GET: APIRoute = async ({ site }) => {
  const base = resolveBaseUrl(site, 'llms.txt');

  const [settings, services, featuredTreatments, posts, concerns, costGuides, comparisons, localAreas, caseStudies] = await Promise.all([
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<Service[]>(LLMS_FEATURED_TREATMENTS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<Concern[]>(ALL_CONCERNS_QUERY),
    sanityFetch<CostGuide[]>(ALL_COST_GUIDES_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<CaseStudy[]>(ALL_CASE_STUDIES_QUERY),
  ]);
  const siteFacts = resolvePublicSiteFacts(settings);
  const providers = PROVIDER_PROFILE_FALLBACKS;
  const publicServices = [...services, ...featuredTreatments]
    .filter((service) => !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET.has(service.slug))
    .filter((service, index, allServices) => allServices.findIndex(({ slug }) => slug === service.slug) === index);
  const publicPosts = posts.filter((post) => isReviewedPublicBlogSlug(post.slug));
  const publicComparisons = filterReviewedPublicComparisons(comparisons);

  const lines: string[] = [
    `# ${siteFacts.siteName}`,
    ``,
    `> ${siteFacts.siteName} is a medical aesthetics practice in Punta Gorda, Florida, offering skin treatments, Microneedling, PRF, injectables, IV hydration, wellness services, and professional home care.`,
    ``,
    `${siteFacts.shortName} is located at ${siteFacts.address}. Phone: ${siteFacts.phone}. Email: ${siteFacts.email}. Serving Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Home](${base}/): ${siteFacts.siteName} — a medical aesthetics practice in Punta Gorda, FL`,
    `- [Services](${base}/services/): Canonical directory for skin, injectable, body, IV hydration, weight-management, waxing, makeup, and permanent-jewelry appointments`,
    `- [Concern Guides](${base}/concerns/): Observable skin, pigment, texture, movement, and volume questions connected to current services`,
    `- [About](${base}/about/): ${siteFacts.siteName} and the people behind the practice`,
    `- [${siteFacts.siteName}](${base}/about/hra/): About the Punta Gorda practice`,
    `- [Providers](${base}/about/providers/): Licence types, service focus, and individual team profiles`,
    `- [Consultation](${base}/consultation/): Request a conversation about a concern or treatment options; submitting the form does not reserve a time`,
    `- [Skin Imaging & Analysis](${base}/skin-analysis/): In-studio multi-spectrum images used for a closer look before choosing a skin service`,
    `- [Treatment Series & Packages](${base}/packages/): The current Face Reality 12-week program and its separately booked consultation`,
    `- [Experience](${base}/experience/): Actual storefront, treatment rooms, providers, and visit information`,
    `- [Contact](${base}/contact/): Directions, phone, email, response timing, appointment questions, and the general inquiry form`,
    `- [Rent a Suite](${base}/rent-a-room/): Treatment room rental information for eligible licensed professionals`,
    `- [Journal](${base}/blog/): Reviewed treatment articles with linked sources and clearly stated limitations`,
    `- [FAQ](${base}/faq/): Answers about treatments, pricing, and what to expect`,
    `- [Support](${base}/support/): Appointment changes, after-visit questions, directions, practice hours, and emergency guidance`,
    `- [Terms of Service](${base}/terms-of-service/): Terms for website use, appointments, communications, and online product orders`,
    `- [Shipping Policy](${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- [Return Policy](${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- [Areas We Serve](${base}/areas/): Punta Gorda, Port Charlotte & Southwest Florida`,
    ...(caseStudies.length > 0
      ? [`- [Results](${base}/results/): Consented before-and-after cases`]
      : []),
    `- [Sitemap](${base}/sitemap/): HTML index of public pages across services, concerns, packages, guides, locations, and resources`,
    ``,
  ];

  if (providers.length > 0) {
    lines.push(`## Providers`, ``);
    for (const provider of providers) {
      const focus = provider.serviceFocus.length > 0 ? ` Service focus: ${provider.serviceFocus.join(', ')}.` : '';
      lines.push(`- [${provider.publicName}](${base}/about/providers/${provider.slug}/): ${provider.publicRole}.${focus}`);
    }
    lines.push(`- Medical Director: Joshua Shaw, MD · FL Lic. ME136232`);
    lines.push(``);
  }

  if (publicServices.length > 0) {
    lines.push(`## Services`, ``);
    for (const s of publicServices) {
      lines.push(`- [${s.title}](${base}/services/${s.slug}/).`);
    }
    lines.push(``);
  }

  if (costGuides.length > 0) {
    lines.push(`## Pricing Guides`, ``);
    for (const c of costGuides) {
      const fact = getVerifiedCostFact(c.slug);
      const price = fact ? ` ${fact.answer}` : '';
      lines.push(`- [${c.title}](${base}/cost/${c.slug}/).${price}`);
    }
    lines.push(``);
  }

  if (concerns.length > 0) {
    lines.push(`## Concern Guides`, ``);
    for (const concern of concerns) {
      lines.push(`- [${concern.title}](${base}/concerns/${concern.slug}/)`);
    }
    lines.push(``);
  }

  if (publicComparisons.length > 0) {
    lines.push(`## Treatment Comparisons`, ``);
    for (const c of publicComparisons) {
      lines.push(`- [${getPublicComparisonContent(c.slug)!.title}](${base}/compare/${c.slug}/)`);
    }
    lines.push(``);
  }

  if (localAreas.length > 0) {
    lines.push(`## Areas Served`, ``);
    for (const a of localAreas) {
      lines.push(`- [${a.city}](${base}/areas/${a.slug}/)`);
    }
    lines.push(``);
  }

  if (publicPosts.length > 0) {
    lines.push(`## Journal Articles`, ``);
    for (const p of publicPosts) {
      lines.push(`- [${getPublicBlogTitle(p)}](${base}/blog/${p.slug}/)`);
    }
    lines.push(``);
  }

  lines.push(
    `## Business Details`,
    ``,
    `- **Name:** ${siteFacts.siteName}`,
    `- **Category:** Medical Aesthetics Practice`,
    `- **Address:** ${siteFacts.address}`,
    `- **Phone:** ${siteFacts.phone}`,
    `- **Email:** ${siteFacts.email}`,
    `- **Services menu:** https://houseofrose.glossgenius.com/services`,
    `- **Hours:** Monday–Friday 9:00 AM–5:00 PM`,
    `- **Opened:** June 15, 2026`,
    `- **Instagram:** @${siteFacts.instagramHandle}`,
    `- **Facebook:** https://www.facebook.com/hofraesthetics`,
    `- **Service Area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, Punta Gorda Isles`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
