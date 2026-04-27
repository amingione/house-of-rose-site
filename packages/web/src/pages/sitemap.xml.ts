import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { ALL_SERVICES_QUERY, type Service } from '@/lib/queries';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://houseofrosefl.com';

  // Fetch all services from Sanity
  const services = await sanityFetch<Service[]>(ALL_SERVICES_QUERY);

  // Static pages
  const staticPages = [
    { loc: baseUrl, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/services`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/experience`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy-policy`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Service pages
  const servicePages = services.map((service) => ({
    loc: `${baseUrl}/services/${service.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  // Combine all pages
  const allPages = [...staticPages, ...servicePages];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
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
