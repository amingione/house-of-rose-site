import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_BLOG_POSTS_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_CONCERNS_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  ALL_TREATMENT_PACKAGES_QUERY,
  ALL_CASE_STUDIES_QUERY,
  PUBLIC_PROVIDERS_QUERY,
  SITE_SETTINGS_QUERY,
  type BlogPost,
  type Comparison,
  type Concern,
  type LocalArea,
  type TreatmentPackage,
  type CaseStudy,
  type PublicProviderProfile,
  type SiteSettings,
} from '@/lib/queries';
import { PUBLIC_SERVICES } from '@/lib/serviceCatalog';
import { resolvePublicProviderProfiles } from '@/lib/aboutFallbacks';
import { getServiceCardSummary } from '@/lib/serviceCardContent';
import { getPublicBlogTitle, isReviewedPublicBlogSlug } from '@/lib/publicBlogContent';
import {
  filterReviewedPublicComparisons,
  getPublicComparisonContent,
} from '@/lib/publicComparisonContent';
import { resolvePublicSiteFacts } from '@/lib/publicSiteFacts';

export const GET: APIRoute = async ({ site }) => {
  const base = resolveBaseUrl(site, 'llms-full.txt');

  const [settings, posts, concerns, comparisons, localAreas, packages, caseStudies, sanityProviders] = await Promise.all([
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<Concern[]>(ALL_CONCERNS_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<TreatmentPackage[]>(ALL_TREATMENT_PACKAGES_QUERY),
    sanityFetch<CaseStudy[]>(ALL_CASE_STUDIES_QUERY),
    sanityFetch<PublicProviderProfile[]>(PUBLIC_PROVIDERS_QUERY),
  ]);
  const services = [...PUBLIC_SERVICES];
  const siteFacts = resolvePublicSiteFacts(settings);
  const providers = resolvePublicProviderProfiles(sanityProviders);
  const publicPosts = posts.filter((post) => isReviewedPublicBlogSlug(post.slug));
  const publicComparisons = filterReviewedPublicComparisons(comparisons);

  const lines: string[] = [
    `# ${siteFacts.siteName} — Medical Aesthetics Practice`,
    ``,
    `> Medical aesthetics in Punta Gorda, Florida.`,
    ``,
    `## About`,
    ``,
    `${siteFacts.siteName} is a medical aesthetics practice at ${siteFacts.addressWithExpandedRegion}. Services include skin treatments, injectables, body treatments, IV hydration, wellness care, and professional home care.`,
    ``,
    `${siteFacts.shortName} serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. Call ${siteFacts.phone} with questions about a service.`,
    ``,
    `**Contact:**`,
    `- Phone: ${siteFacts.phone}`,
    `- Email: ${siteFacts.email}`,
    `- Address: ${siteFacts.address}`,
    `- Hours: Monday–Friday 9:00 AM–5:00 PM`,
    `- Opened: June 15, 2026`,
    `- Instagram: ${siteFacts.instagramUrl}`,
    `- Facebook: https://www.facebook.com/hofraesthetics`,
    ``,
    `---`,
    ``,
    `## House of Rose Information`,
    ``,
    `- **Home** (${base}/): Overview of the practice, providers, services, and location`,
    `- **Services** (${base}/services/): Information about skin, injectable, body, IV hydration, weight-management, waxing, and makeup treatments`,
    `- **About** (${base}/about/): ${siteFacts.siteName} and the people behind the practice`,
    `- **${siteFacts.siteName}** (${base}/about/hra/): About the practice and its Punta Gorda location`,
    `- **Providers** (${base}/about/providers/): Licence types, service focus, and individual team profiles`,
    `- **Consultation** (${base}/consultation/): Discuss a concern, treatment, provider, timing, recovery, or cost question`,
    `- **Skin Imaging & Analysis** (${base}/skin-analysis/): In-studio multi-spectrum images used for a closer look before choosing a skin service`,
    `- **Treatment Series & Packages** (${base}/packages/): The current Face Reality 12-week program and how its in-studio and home-care parts work together`,
    `- **Experience** (${base}/experience/): Actual storefront, treatment rooms, providers, and visit information`,
    `- **Contact** (${base}/contact/): Directions, phone, email, response timing, appointment questions, and the general inquiry form`,
    `- **Rent a Suite** (${base}/rent-a-room/): Treatment room rental information for eligible licensed professionals`,
    `- **Journal** (${base}/blog/): Reviewed treatment articles with linked sources and clearly stated limitations`,
    `- **FAQ** (${base}/faq/): Answers about treatments, pricing, and what to expect`,
    `- **Support** (${base}/support/): Appointment changes, after-visit questions, directions, practice hours, and emergency guidance`,
    `- **Terms of Service** (${base}/terms-of-service/): Terms for website use, appointments, communications, and online product orders`,
    `- **Shipping Policy** (${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- **Return Policy** (${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- **Areas We Serve** (${base}/areas/): Punta Gorda, Port Charlotte & Southwest Florida`,
    ...(caseStudies.length > 0
      ? [`- **Results** (${base}/results/): Consented before-and-after cases`]
      : []),
    `- **Sitemap** (${base}/sitemap/): Find treatments, concerns, programs, locations, and practice resources`,
    ``,
    `---`,
    ``,
  ];

  if (providers.length > 0) {
    lines.push(`## Providers`, ``);
    for (const provider of providers) {
      lines.push(`### ${provider.publicName}`);
      lines.push(`URL: ${base}/about/providers/${provider.slug}/`);
      lines.push(`Role: ${provider.publicRole}`, ``);
      if (provider.serviceFocus.length > 0) lines.push(`Service focus: ${provider.serviceFocus.join(', ')}`, ``);
      if (provider.medicallyDirected) lines.push(`Medical Director: Joshua Shaw, MD · FL Lic. ME136232`, ``);
    }
    lines.push(`---`, ``);
  }

  if (services.length > 0) {
    lines.push(`## Services`, ``);
    for (const s of services) {
      const cardSummary = getServiceCardSummary(s.slug);
      lines.push(`### ${s.title}`);
      lines.push(`URL: ${base}/services/${s.slug}/`);
      if (s.collection) lines.push(`Collection: ${s.collection.title}`);
      if (cardSummary) lines.push(`Summary: ${cardSummary}`);

      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  if (concerns.length > 0) {
    lines.push(`## Concern Guides`, ``);
    for (const concern of concerns) {
      lines.push(`- [${concern.title}](${base}/concerns/${concern.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (publicComparisons.length > 0) {
    lines.push(`## Treatment Comparisons`, ``);
    for (const comparison of publicComparisons) {
      lines.push(`- [${getPublicComparisonContent(comparison.slug)!.title}](${base}/compare/${comparison.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (localAreas.length > 0) {
    lines.push(`## Areas Served`, ``);
    for (const area of localAreas) {
      lines.push(`- [${area.city}](${base}/areas/${area.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (packages.length > 0) {
    lines.push(`## Treatment Series & Packages`, ``);
    for (const treatmentPackage of packages) {
      lines.push(`- [${treatmentPackage.title}](${base}/packages/${treatmentPackage.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (caseStudies.length > 0) {
    lines.push(`## Results`, ``);
    for (const study of caseStudies) {
      lines.push(`- [${study.title}](${base}/results/${study.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (publicPosts.length > 0) {
    lines.push(`## Journal Articles`, ``);
    for (const p of publicPosts) {
      lines.push(`### ${getPublicBlogTitle(p)}`);
      lines.push(`URL: ${base}/blog/${p.slug}/`);
      if (p.publishedAt) lines.push(`Date: ${p.publishedAt.split('T')[0]}`);
      if (p.category) lines.push(`Category: ${p.category}`);
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  lines.push(
    `## Identity & Public Facts`,
    ``,
    `${siteFacts.siteName} is the canonical business name. The lead public category is "Medical Aesthetics Practice." "Med spa" and "medical spa" are acceptable supporting terms in metadata, SEO, and discovery contexts because the Google Business Profile category is Medical spa.`,
    ``,
    `Common brand variants: House of Rose and Rose Aesthetics. Address: ${siteFacts.address}. Phone: ${siteFacts.phone}.`,
    ``,
    `## Service Scope`,
    ``,
    `${siteFacts.siteName} serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. The public service inventory includes skin procedures, PRF, injectables, facials, IV hydration, and wellness services.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
