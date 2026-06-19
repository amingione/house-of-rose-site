import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { ALL_SERVICES_QUERY, ALL_BLOG_POSTS_QUERY, ALL_COLLECTIONS_QUERY, type Service, type BlogPost, type ServiceCollection } from '@/lib/queries';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Missing PUBLIC_SITE_URL');
  }

  const base = site.toString().replace(/\/$/, '');

  const [services, posts, collections] = await Promise.all([
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Aesthetics`,
    ``,
    `> Where Beauty Blooms Within. A private, appointment-only studio for advanced aesthetics and wellness in Punta Gorda, Florida — offering regenerative treatments (PRF, Procell, microchanneling), injectables, advanced facials and skin health, IV hydration, GLP-1 support, and curated home care.`,
    ``,
    `House of Rose is located at 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950. Phone: (844) 941-7673. Email: info@houseofrosefl.com. Serving Charlotte County and Southwest Florida including Port Charlotte, Englewood, Venice, Sarasota, and Cape Coral.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Home](${base}/): House of Rose Aesthetics — advanced aesthetics & wellness in Punta Gorda, FL`,
    `- [Services](${base}/services/): Full menu across regenerative aesthetics, injectables, skin health, and wellness`,
    `- [Experience](${base}/experience/): What to expect — focused, unhurried visits and personalized recommendations`,
    `- [Contact](${base}/contact/): Book a consultation or reach out`,
    `- [Rent a Suite](${base}/rent-a-room/): Private treatment room rentals for licensed aestheticians and wellness professionals`,
    `- [Journal](${base}/blog/): Expert insights on wellness, beauty, and living well in Southwest Florida`,
    ``,
  ];

  if (collections.length > 0) {
    lines.push(`## Service Collections`, ``);
    for (const col of collections) {
      lines.push(`- [${col.title}](${base}/services/collections/${col.slug}/): ${col.description ?? col.title}`);
    }
    lines.push(``);
  }

  if (services.length > 0) {
    lines.push(`## Services`, ``);
    for (const s of services) {
      const desc = s.tagline ? ` — ${s.tagline}` : '';
      const price = s.price ? ` Starting at $${s.price}.` : '';
      lines.push(`- [${s.title}](${base}/services/${s.slug}/)${desc}.${price}`);
    }
    lines.push(``);
  }

  if (posts.length > 0) {
    lines.push(`## Journal Articles`, ``);
    for (const p of posts) {
      const desc = p.excerpt ? ` — ${p.excerpt}` : '';
      lines.push(`- [${p.title}](${base}/blog/${p.slug}/)${desc}`);
    }
    lines.push(``);
  }

  lines.push(
    `## Business Details`,
    ``,
    `- **Name:** House of Rose Aesthetics`,
    `- **Slogan:** Where Beauty Blooms Within`,
    `- **Address:** 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950`,
    `- **Phone:** (844) 941-7673`,
    `- **Email:** info@houseofrosefl.com`,
    `- **Booking:** https://houseofrose.glossgenius.com/services`,
    `- **Hours:** Monday–Friday 10:00 AM–6:00 PM`,
    `- **Instagram:** @houseofrosefl`,
    `- **Facebook:** @houseofrosefl`,
    `- **Service Area:** Punta Gorda, Port Charlotte, Englewood, Venice, North Port, Sarasota, Cape Coral — Charlotte County & Southwest Florida`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
