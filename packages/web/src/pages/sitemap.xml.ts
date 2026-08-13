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

  const now = new Date().toISOString().split('T')[0];

  const shopPages = SHOP_ENABLED
    ? [
        { loc: `${baseUrl}/shop/jane-iredale/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
        { loc: `${baseUrl}/shop/`, priority: '0.6', changefreq: 'monthly', lastmod: now },
      ]
    : [];

  // Static pages — all use trailing-slash canonical URLs
  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/services/`, priority: '0.9', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/concerns/`, priority: '0.8', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/about/`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/about/hra/`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/about/providers/`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/consultation/`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/blog/`, priority: '0.8', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/experience/`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/faq/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/support/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/cost/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/compare/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/areas/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    ...(caseStudies.length > 0
      ? [{ loc: `${baseUrl}/results/`, priority: '0.7', changefreq: 'monthly', lastmod: now }]
      : []),
    { loc: `${baseUrl}/packages/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/skin-analysis/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    ...shopPages,
    { loc: `${baseUrl}/sitemap/`, priority: '0.5', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/contact/`, priority: '0.7', changefreq: 'yearly', lastmod: now },
    { loc: `${baseUrl}/rent-a-room/`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/privacy-policy/`, priority: '0.3', changefreq: 'yearly', lastmod: now },
    { loc: `${baseUrl}/terms-of-service/`, priority: '0.3', changefreq: 'yearly', lastmod: now },
    { loc: `${baseUrl}/shipping-policy/`, priority: '0.3', changefreq: 'yearly', lastmod: now },
    { loc: `${baseUrl}/return-policy/`, priority: '0.3', changefreq: 'yearly', lastmod: now },
  ];

  // Service pages — include hub, standalone, and treatment pages.
  const servicePages = serviceSlugs.map((service) => ({
    loc: `${baseUrl}/services/${service.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: service._updatedAt ? service._updatedAt.split('T')[0] : now,
  }));

  // Blog post pages
  const blogPages = blogPosts.filter((post) => isReviewedPublicBlogSlug(post.slug)).map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.publishedAt ? post.publishedAt.split('T')[0] : now,
  }));

  // Collection details are navigation-only and noindex. Keep only the category
  // index in XML; canonical service pages carry the search intent.
  const collectionIndexPage = { loc: `${baseUrl}/services/collections/`, priority: '0.7', changefreq: 'monthly', lastmod: now };

  // Concern pages
  const concernPages = concerns.map((concern) => ({
    loc: `${baseUrl}/concerns/${concern.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: now,
  }));

  // Package pages
  const packagePages = packages.map((pkg) => ({
    loc: `${baseUrl}/packages/${pkg.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: now,
  }));

  // AEO page types
  const costPages = costGuides.map((c) => ({ loc: `${baseUrl}/cost/${c.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: c._updatedAt ? c._updatedAt.split('T')[0] : now }));
  const comparePages = filterReviewedPublicComparisons(comparisons).map((c) => ({ loc: `${baseUrl}/compare/${c.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: c._updatedAt ? c._updatedAt.split('T')[0] : now }));
  const areaPages = localAreas.map((a) => ({ loc: `${baseUrl}/areas/${a.slug}/`, priority: '0.7', changefreq: 'monthly', lastmod: a._updatedAt ? a._updatedAt.split('T')[0] : now }));
  const resultPages = caseStudies.map((cs) => ({ loc: `${baseUrl}/results/${cs.slug}/`, priority: '0.6', changefreq: 'monthly', lastmod: cs._updatedAt ? cs._updatedAt.split('T')[0] : now }));
  const providerPages = providers.map((provider) => ({
    loc: `${baseUrl}/about/providers/${provider.slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: now,
  }));

  // Keep the XML sitemap focused on high-value hubs and editorial pages.
  // Product detail pages are intentionally omitted so the catalog does not
  // crowd out the service architecture when the shop is enabled.
  const allPages = [
    ...staticPages,
    ...servicePages,
    collectionIndexPage,
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
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
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
