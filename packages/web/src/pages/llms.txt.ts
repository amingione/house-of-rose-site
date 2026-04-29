import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { ALL_SERVICES_QUERY, ALL_BLOG_POSTS_QUERY, ALL_COLLECTIONS_QUERY, type Service, type BlogPost, type ServiceCollection } from '@/lib/queries';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://houseofrosefl.com').replace(/\/$/, '');

  const [services, posts, collections] = await Promise.all([
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Luxury Spa & Wellness`,
    ``,
    `> Where beauty blooms within. A private luxury spa & wellness sanctuary in Punta Gorda, Florida offering microchanneling, IV hydration, injectables, hormone therapy, GLP-1 treatments, facials, lash extensions, waxing, permanent makeup, and professional event makeup.`,
    ``,
    `House of Rose is located at 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950. Phone: (844) 941-7673. Email: book@houseofrosefl.com. Serving Charlotte County and Southwest Florida including Port Charlotte, Englewood, Venice, Sarasota, and Cape Coral.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Home](${base}/): House of Rose Luxury Spa & Wellness — where beauty blooms within`,
    `- [Services](${base}/services/): Full menu of luxury spa & wellness treatments`,
    `- [Experience](${base}/experience/): What to expect — private consultations, unhurried visits, personalized protocols`,
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
    `- **Name:** House of Rose Luxury Spa & Wellness`,
    `- **Slogan:** Where beauty blooms within`,
    `- **Address:** 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950`,
    `- **Phone:** (844) 941-7673`,
    `- **Email:** book@houseofrosefl.com`,
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
