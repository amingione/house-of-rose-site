import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { ALL_SERVICES_QUERY, ALL_BLOG_POSTS_QUERY, type Service, type BlogPost } from '@/lib/queries';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://houseofrosefl.com';

  const [services, blogPosts] = await Promise.all([
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
  ]);

  const now = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { loc: baseUrl, priority: '1.0', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/experience`, priority: '0.8', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'yearly', lastmod: now },
    { loc: `${baseUrl}/rent-a-room`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/privacy-policy`, priority: '0.3', changefreq: 'yearly', lastmod: now },
  ];

  // Service pages
  const servicePages = services.map((service) => ({
    loc: `${baseUrl}/services/${service.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: service._updatedAt ? service._updatedAt.split('T')[0] : now,
  }));

  // Blog post pages
  const blogPages = blogPosts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.publishedAt ? post.publishedAt.split('T')[0] : now,
  }));

  // Combine all pages
  const allPages = [...staticPages, ...servicePages, ...blogPages];

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
