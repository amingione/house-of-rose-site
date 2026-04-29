import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import {
  ALL_COLLECTIONS_QUERY,
  SITE_SETTINGS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  type ServiceCollection,
  type SiteSettings,
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
  const base = (site?.toString() ?? 'https://houseofrosefl.com').replace(/\/$/, '');

  const [settings, services, collections, posts] = await Promise.all([
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
    sanityFetch<ServiceFull[]>(SERVICES_FULL_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Luxury Spa & Wellness — Full Content Index`,
    ``,
    `> Where beauty blooms within.`,
    ``,
    `## About`,
    ``,
    `House of Rose Luxury Spa & Wellness is a private luxury spa & wellness sanctuary located at 525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33982. The business was founded on the conviction that spa and wellness should feel like a private luxury experience — every treatment is results-driven, every protocol personalized, every visit unhurried.`,
    ``,
    `House of Rose serves clients throughout Charlotte County and Southwest Florida including Port Charlotte, Englewood, Venice, North Port, Sarasota, and Cape Coral. The business offers a private, appointment-based experience with no walk-ins.`,
    ``,
    `**Contact:**`,
    `- Phone: (844) 941-7673`,
    `- Email: book@houseofrosefl.com`,
    `- Booking: https://houseofrose.glossgenius.com/services`,
    `- Address: 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33982`,
    `- Hours: Monday–Friday 9:00 AM–5:00 PM`,
    `- Instagram: @houseofrosefl`,
    `- Facebook: @houseofrosefl`,
    ``,
    `---`,
    ``,
    `## Site Pages`,
    ``,
    `- **Home** (${base}/): Overview of services, brand philosophy, and booking`,
    `- **Services** (${base}/services/): Full menu of all luxury spa & wellness treatments`,
    `- **Experience** (${base}/experience/): What clients can expect — private consultations, personalized protocols, unhurried appointments`,
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
    `House of Rose speaks with quiet confidence — never sterile, never over-promotional. The brand voice is warm but understated, luxurious but accessible. Key phrases: "where beauty blooms within," "luxury spa & wellness," "private luxury experience," "results-driven," "personalized protocol," "unhurried visit."`,
    ``,
    `Canonical brand: House of Rose Luxury Spa & Wellness. Tagline: Where Beauty Blooms Within.`,
    ``,
    `## Competitive Context`,
    ``,
    `House of Rose occupies the luxury tier of the Charlotte County, FL spa market — above value-tier providers (C's wellness spa, Port Charlotte) and positioned as a premium private alternative to mid-tier competitors (Sweet Spot, Spago Day Spa). The brand's direct competitor is Skin Sanctuary Spa (6230 Scott St, Punta Gorda), 2025 Best of Charlotte winner.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
