import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_SERVICES_QUERY,
  LLMS_FEATURED_TREATMENTS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  ALL_COST_GUIDES_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  ALL_CASE_STUDIES_QUERY,
  type Service,
  type BlogPost,
  type CostGuide,
  type Comparison,
  type LocalArea,
  type CaseStudy,
} from '@/lib/queries';
import { PROVIDER_PROFILE_FALLBACKS } from '@/lib/aboutFallbacks';
import { getVerifiedCostFact } from '@/lib/costFacts';
import { getPublicBlogTitle, isReviewedPublicBlogSlug } from '@/lib/publicBlogContent';
import {
  filterReviewedPublicComparisons,
  getPublicComparisonContent,
} from '@/lib/publicComparisonContent';

const NON_PUBLIC_SERVICE_SLUGS = new Set([
  'microneedling-body',
  'neck-decollete-extension',
  'ez-gel-bio-filler',
]);

export const GET: APIRoute = async ({ site }) => {
  const base = resolveBaseUrl(site, 'llms.txt');

  const [services, featuredTreatments, posts, costGuides, comparisons, localAreas, caseStudies] = await Promise.all([
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<Service[]>(LLMS_FEATURED_TREATMENTS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<CostGuide[]>(ALL_COST_GUIDES_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<CaseStudy[]>(ALL_CASE_STUDIES_QUERY),
  ]);
  const providers = PROVIDER_PROFILE_FALLBACKS;
  const publicServices = [...services, ...featuredTreatments]
    .filter((service) => !NON_PUBLIC_SERVICE_SLUGS.has(service.slug))
    .filter((service, index, allServices) => allServices.findIndex(({ slug }) => slug === service.slug) === index);
  const publicPosts = posts.filter((post) => isReviewedPublicBlogSlug(post.slug));
  const publicComparisons = filterReviewedPublicComparisons(comparisons);

  const lines: string[] = [
    `# House of Rose Aesthetics`,
    ``,
    `> House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, offering skin treatments, Microneedling, PRF, injectables, IV hydration, wellness services, and professional home care.`,
    ``,
    `House of Rose is located at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. Phone: (844) 941-7673. Email: info@houseofrosefl.com. Serving Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Home](${base}/): House of Rose Aesthetics — a medical aesthetics practice in Punta Gorda, FL`,
    `- [Services](${base}/services/): Current skin, injectable, body, IV hydration, and wellness services`,
    `- [About](${base}/about/): House of Rose Aesthetics and the people behind the practice`,
    `- [House of Rose Aesthetics](${base}/about/hra/): About the Punta Gorda practice`,
    `- [Providers](${base}/about/providers/): Verified roles, service focus, and individual team profiles`,
    `- [Consultation](${base}/consultation/): Information about current skin, injectable, IV hydration, and wellness services`,
    `- [Skin Imaging & Analysis](${base}/skin-analysis/): In-studio multi-spectrum images used for a closer look before choosing a skin service`,
    `- [Treatment Series & Packages](${base}/packages/): Current package pages and their included services`,
    `- [Experience](${base}/experience/): Actual storefront, treatment rooms, providers, and visit information`,
    `- [Contact](${base}/contact/): Book a consultation or reach out`,
    `- [Rent a Suite](${base}/rent-a-room/): Treatment room rental information for eligible licensed professionals`,
    `- [Journal](${base}/blog/): Reviewed treatment articles with linked sources and clearly stated limitations`,
    `- [FAQ](${base}/faq/): Answers about treatments, pricing, and what to expect`,
    `- [Support](${base}/support/): Help with appointments, booking, directions, and contacting the studio`,
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
      lines.push(`- [${a.title}](${base}/areas/${a.slug}/)`);
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
    `- **Name:** House of Rose Aesthetics`,
    `- **Category:** Medical Aesthetics Practice`,
    `- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950`,
    `- **Phone:** (844) 941-7673`,
    `- **Email:** info@houseofrosefl.com`,
    `- **Services menu:** https://houseofrose.glossgenius.com/services`,
    `- **Hours:** Monday–Friday 9:00 AM–5:00 PM`,
    `- **Opened:** June 15, 2026`,
    `- **Instagram:** @house.of.rose.aesthetics`,
    `- **Facebook:** https://www.facebook.com/hofraesthetics`,
    `- **Service Area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, Punta Gorda Isles`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
