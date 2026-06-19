import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import {
  ALL_COLLECTIONS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  type ServiceCollection,
  type BlogPost,
} from '@/lib/queries';

// Full service detail query for llms-full
const SERVICES_FULL_QUERY = /* groq */ `
  *[_type == "service"] | order(orderRank asc, title asc) {
    title,
    "slug": slug.current,
    tagline,
    description,
    whoItsFor,
    process,
    price,
    duration,
    "faqs": faqs[] { question, answer },
    collection->{ title }
  }
`;

interface ServiceFull {
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  whoItsFor?: string;
  process?: string[];
  price?: number | string;
  duration?: string;
  faqs?: { question: string; answer: string }[];
  collection?: { title: string };
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Missing PUBLIC_SITE_URL');
  }

  const base = site.toString().replace(/\/$/, '');

  const [services, collections, posts] = await Promise.all([
    sanityFetch<ServiceFull[]>(SERVICES_FULL_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Aesthetics — Advanced Aesthetics & Wellness — Full Content Index`,
    ``,
    `> Where Beauty Blooms Within.`,
    ``,
    `## About`,
    ``,
    `House of Rose Aesthetics is a privately owned advanced aesthetics and wellness studio located at 525 E Olympia Ave, Ste 9, Punta Gorda, Florida 33950. It was created for clients who want more than a quick appointment and a standard treatment menu — bringing together advanced aesthetics, wellness support, and thoughtfully selected skincare in one refined setting. The approach is tailored and intentional, built around long-term skin health, natural-looking results, and care that feels personal from the start.`,
    ``,
    `House of Rose serves clients throughout Charlotte County and Southwest Florida including Port Charlotte, Englewood, Venice, North Port, Sarasota, and Cape Coral. Appointments are private and unhurried, with no walk-ins.`,
    ``,
    `**Contact:**`,
    `- Phone: (844) 941-7673`,
    `- Email: info@houseofrosefl.com`,
    `- Booking: https://houseofrose.glossgenius.com/services`,
    `- Address: 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950`,
    `- Hours: Monday–Friday 10:00 AM–6:00 PM`,
    `- Instagram: https://www.instagram.com/houseofroseaestheticsfl`,
    `- Facebook: https://www.facebook.com/houseofroseaestheticsfl`,
    ``,
    `---`,
    ``,
    `## Site Pages`,
    ``,
    `- **Home** (${base}/): Overview of services, brand philosophy, and booking`,
    `- **Services** (${base}/services/): Full menu of treatments across regenerative aesthetics, injectables, skin health, and wellness`,
    `- **Experience** (${base}/experience/): What clients can expect — focused, unhurried appointments, personalized recommendations, and clear guidance on results`,
    `- **Contact** (${base}/contact/): Directions, phone, email, and booking`,
    `- **Rent a Suite** (${base}/rent-a-room/): Private treatment room rentals starting at $850/month for licensed aestheticians, massage therapists, and permanent makeup artists`,
    `- **Journal** (${base}/blog/): Articles on wellness, beauty, and living well in Southwest Florida`,
    ``,
    `---`,
    ``,
  ];

  if (collections.length > 0) {
    lines.push(`## Service Collections`, ``);
    for (const col of collections) {
      lines.push(`### ${col.title}`);
      lines.push(`URL: ${base}/services/collections/${col.slug}/`);
      if (col.description) lines.push(col.description);
      if (col.services?.length > 0) {
        lines.push(`Services in this collection: ${col.services.map(s => s.title).join(', ')}`);
      }
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  if (services.length > 0) {
    lines.push(`## Services — Full Detail`, ``);
    for (const s of services) {
      lines.push(`### ${s.title}`);
      lines.push(`URL: ${base}/services/${s.slug}/`);
      if (s.collection) lines.push(`Collection: ${s.collection.title}`);
      if (s.tagline) lines.push(`Tagline: ${s.tagline}`);
      if (s.price) lines.push(`Price: $${s.price}`);
      if (s.duration) lines.push(`Duration: ${s.duration}`);
      if (s.description) lines.push(``, s.description);
      if (s.whoItsFor) lines.push(``, `**Who it's for:** ${s.whoItsFor}`);
      if (s.process?.length) {
        lines.push(``, `**The Process:**`);
        s.process.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
      }
      if (s.faqs?.length) {
        lines.push(``, `**FAQs:**`);
        for (const faq of s.faqs) {
          lines.push(``, `Q: ${faq.question}`);
          lines.push(`A: ${faq.answer}`);
        }
      }
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  if (posts.length > 0) {
    lines.push(`## Journal Articles`, ``);
    for (const p of posts) {
      lines.push(`### ${p.title}`);
      lines.push(`URL: ${base}/blog/${p.slug}/`);
      if (p.publishedAt) lines.push(`Published: ${p.publishedAt.split('T')[0]}`);
      if (p.category) lines.push(`Category: ${p.category}`);
      if (p.excerpt) lines.push(``, p.excerpt);
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  lines.push(
    `## Brand Voice & Positioning`,
    ``,
    `House of Rose speaks with calm confidence — warm but not casual, refined but never flashy, and never salesy. Copy is specific and honest, centered on long-term skin health and natural-looking results rather than hype. Do not describe the business as a "med spa," "medical spa," or "clinic," and do not use "luxury" as a category or business label. Key phrases: "Where Beauty Blooms Within," "advanced aesthetics & wellness," "regenerative," "personalized," "unhurried," "curated home care."`,
    ``,
    `Canonical brand: House of Rose Aesthetics. Category: Advanced Aesthetics & Wellness — Punta Gorda, FL. Tagline: Where Beauty Blooms Within.`,
    ``,
    `## Positioning`,
    ``,
    `House of Rose Aesthetics serves Punta Gorda and Southwest Florida (Charlotte and Lee Counties) as a private, appointment-only destination for advanced aesthetics and wellness. The focus is regenerative, restorative, and highly personalized care — with PRF among its signature specialties — delivered as part of a complete treatment plan rather than one-off services.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
