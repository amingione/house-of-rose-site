import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_SITEMAP_SERVICES_QUERY,
  ALL_BLOG_POSTS_QUERY,
  ALL_CONCERNS_QUERY,
  ALL_COST_GUIDES_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  ALL_CASE_STUDIES_QUERY,
  ALL_TREATMENT_PACKAGES_QUERY,
  PUBLIC_PROVIDERS_QUERY,
  type SitemapService,
  type BlogPost,
  type Concern,
  type CostGuide,
  type Comparison,
  type LocalArea,
  type CaseStudy,
  type TreatmentPackage,
  type PublicProviderProfile,
} from '@/lib/queries';
import { resolvePublicProviderProfiles } from '@/lib/aboutFallbacks';
import { isReviewedPublicBlogSlug } from '@/lib/publicBlogContent';
import { filterReviewedPublicComparisons } from '@/lib/publicComparisonContent';
import { SHOP_ENABLED } from '@/lib/features';

interface SitemapPage {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = resolveBaseUrl(site, 'sitemap.xml');

  const [serviceSlugs, blogPosts, concerns, costGuides, comparisons, localAreas, caseStudies, packages, sanityProviders] = await Promise.all([
    sanityFetch<SitemapService[]>(ALL_SITEMAP_SERVICES_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<Concern[]>(ALL_CONCERNS_QUERY),
    sanityFetch<CostGuide[]>(ALL_COST_GUIDES_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<CaseStudy[]>(ALL_CASE_STUDIES_QUERY),
    sanityFetch<TreatmentPackage[]>(ALL_TREATMENT_PACKAGES_QUERY),
    sanityFetch<PublicProviderProfile[]>(PUBLIC_PROVIDERS_QUERY),
  ]);
  const providers = resolvePublicProviderProfiles(sanityProviders);

  const shopPages = SHOP_ENABLED
    ? [
        { loc: `${baseUrl}/shop/jane-iredale/`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${baseUrl}/shop/`, priority: '0.6', changefreq: 'monthly' },
      ]
    : [];

  // Static pages — all use trailing-slash canonical URLs
  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/services/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/concerns/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/about/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/about/hra/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/about/providers/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/consultation/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/experience/`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/faq/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/support/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/cost/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/compare/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/areas/`, priority: '0.7', changefreq: 'monthly' },
    ...(caseStudies.length > 0
      ? [{ loc: `${baseUrl}/results/`, priority: '0.7', changefreq: 'monthly' }]
      : []),
    { loc: `${baseUrl}/packages/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/skin-analysis/`, priority: '0.7', changefreq: 'monthly' },
    ...shopPages,
    { loc: `${baseUrl}/sitemap/`, priority: '0.5', changefreq: 'weekly' },
    { loc: `${baseUrl}/contact/`, priority: '0.7', changefreq: 'yearly' },
    { loc: `${baseUrl}/rent-a-room/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy-policy/`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/terms-of-service/`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/shipping-policy/`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/return-policy/`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Service pages — include hub, standalone, and treatment pages.
  const servicePages = serviceSlugs.map((service) => ({
    loc: `${baseUrl}/services/${service.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: service._updatedAt?.split('T')[0],
  }));

  // Blog post pages
  const blogPages = blogPosts.filter((post) => isReviewedPublicBlogSlug(post.slug)).map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.publishedAt?.split('T')[0],
  }));

  // Concern pages
  const concernPages = concerns.map((concern) => ({
    loc: `${baseUrl}/concerns/${concern.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  // Package pages
  const packagePages = packages.map((pkg) => ({
    loc: `${baseUrl}/packages/${pkg.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  // AEO page types
  const costPages = costGuides.map((c) => ({ loc: `${baseUrl}/cost/${c.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: c._updatedAt?.split('T')[0] }));
  const comparePages = filterReviewedPublicComparisons(comparisons).map((c) => ({ loc: `${baseUrl}/compare/${c.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: c._updatedAt?.split('T')[0] }));
  const areaPages = localAreas.map((a) => ({ loc: `${baseUrl}/areas/${a.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: a._updatedAt?.split('T')[0] }));
  const resultPages = caseStudies.map((cs) => ({ loc: `${baseUrl}/results/${cs.slug}/`, priority: '0.6', changefreq: 'monthly', lastmod: cs._updatedAt?.split('T')[0] }));
  const providerPages = providers.map((provider) => ({
    loc: `${baseUrl}/about/providers/${provider.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  // Keep the XML sitemap focused on high-value hubs and editorial pages.
  // Product detail pages are intentionally omitted so the catalog does not
  // crowd out the service architecture when the shop is enabled.
  const allPages: SitemapPage[] = [
    ...staticPages,
    ...servicePages,
    ...concernPages,
    ...packagePages,
    ...blogPages,
    ...costPages,
    ...comparePages,
    ...areaPages,
    ...resultPages,
    ...providerPages,
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
${page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>\n` : ''}    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
