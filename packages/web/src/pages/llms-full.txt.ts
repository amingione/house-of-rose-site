import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import { alignPublicChannelCopy } from '@/lib/publicCopy';
import {
  ALL_COLLECTIONS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  AI_SEARCH_FAQ_QUERY,
  type ServiceCollection,
  type BlogPost,
  type AiSearchFaqSection,
} from '@/lib/queries';

// Full service detail query for llms-full
const SERVICES_FULL_QUERY = /* groq */ `
  *[_type == "service" && status == "live"] | order(orderRank asc, title asc) {
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
  const base = resolveBaseUrl(site, 'llms-full.txt');

  const [services, collections, posts, aiSearchFaq] = await Promise.all([
    sanityFetch<ServiceFull[]>(SERVICES_FULL_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<AiSearchFaqSection | null>(AI_SEARCH_FAQ_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Aesthetics — Advanced Aesthetics & Wellness — Full Content Index`,
    ``,
    `> Where Beauty Blooms Within.`,
    ``,
    `## About`,
    ``,
    `House of Rose Aesthetics is a privately owned advanced aesthetics and wellness studio at 525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33950. The studio brings advanced skin treatments, injectables, wellness support, and professional skincare together in one place. Clients can ask questions, compare options, and choose care with long-term skin health and natural-looking results in mind.`,
    ``,
    `House of Rose serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. Visits are private and unhurried, and walk-ins are welcome — waxing and facials always accept walk-ins, and other services (including injectables) are fit in whenever the schedule allows. Call (844) 941-7673 to book ahead.`,
    ``,
    `**Contact:**`,
    `- Phone: (844) 941-7673`,
    `- Email: info@houseofrosefl.com`,
    `- Services menu: https://houseofrose.glossgenius.com/services`,
    `- Address: 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950`,
    `- Hours: Monday–Friday 9:00 AM–5:00 PM`,
    `- Opened: June 15, 2026`,
    `- Instagram: https://www.instagram.com/house.of.rose.aesthetics/`,
    `- Facebook: https://www.facebook.com/hofraesthetics`,
    ``,
    `---`,
    ``,
    `## Site Pages`,
    ``,
    `- **Home** (${base}/): Overview of services, brand philosophy, and booking`,
    `- **Services** (${base}/services/): Full menu of treatments across regenerative aesthetics, injectables, skin health, and wellness`,
    `- **Consultation** (${base}/consultation/): An overview of regenerative skin renewal, targeted face and body modalities, skin maintenance, IV hydration, and provider-guided weight support`,
    `- **AI Skin Analysis** (${base}/skin-analysis/): In-studio AI-assisted imaging for pigmentation, texture, pores, fine lines, hydration cues, sun damage, and evidence-led treatment planning`,
    `- **Treatment Series & Packages** (${base}/packages/): Verified treatment series and compatible service combinations`,
    `- **Experience** (${base}/experience/): What clients can expect before, during, and after an unhurried visit`,
    `- **Contact** (${base}/contact/): Directions, phone, email, and booking`,
    `- **Rent a Suite** (${base}/rent-a-room/): Private treatment room rentals starting at $850/month for licensed aestheticians, massage therapists, and permanent makeup artists`,
    `- **Journal** (${base}/blog/): Articles on wellness, beauty, and living well in Southwest Florida`,
    `- **Shipping Policy** (${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- **Return Policy** (${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- **Sitemap** (${base}/sitemap/): HTML index of public pages across services, concerns, packages, guides, locations, and resources`,
    ``,
    `---`,
    ``,
  ];

  if (aiSearchFaq?.faqs?.length) {
    lines.push(`## Frequently Asked Questions`, ``);
    if (aiSearchFaq.intro) lines.push(alignPublicChannelCopy(aiSearchFaq.intro), ``);
    for (const faq of aiSearchFaq.faqs) {
      lines.push(`### ${alignPublicChannelCopy(faq.question)}`, ``, alignPublicChannelCopy(faq.answer), ``);
    }
    lines.push(`---`, ``);
  }

  if (collections.length > 0) {
    lines.push(`## Service Collections`, ``);
    for (const col of collections) {
      lines.push(`### ${col.title}`);
      lines.push(`URL: ${base}/services/collections/${col.slug}/`);
      if (col.description) lines.push(alignPublicChannelCopy(col.description));
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
      if (s.tagline) lines.push(`Tagline: ${alignPublicChannelCopy(s.tagline)}`);
      if (s.price) lines.push(`Price: ${s.price}`);
      if (s.duration) lines.push(`Duration: ${s.duration}`);
      if (s.description) lines.push(``, alignPublicChannelCopy(s.description));
      if (s.whoItsFor) lines.push(``, `**Who it's for:** ${alignPublicChannelCopy(s.whoItsFor)}`);
      if (s.process?.length) {
        lines.push(``, `**The Process:**`);
        s.process.forEach((step, i) => lines.push(`${i + 1}. ${alignPublicChannelCopy(step)}`));
      }
      if (s.faqs?.length) {
        lines.push(``, `**FAQs:**`);
        for (const faq of s.faqs) {
          lines.push(``, `Q: ${alignPublicChannelCopy(faq.question)}`);
          lines.push(`A: ${alignPublicChannelCopy(faq.answer)}`);
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
    `House of Rose speaks like a warm, knowledgeable professional: clear, calm, specific, and easy to understand. Copy should explain what a service is, why someone might consider it, and what to expect without hype or guarantees. Lead with "advanced aesthetics & wellness studio." "Med spa" and "medical spa" are acceptable supporting terms in meta, SEO, and discovery contexts because the Google Business Profile category is Medical spa, but they are not the lead brand description. Do not use "luxury" as a business category.`,
    ``,
    `Canonical brand: House of Rose Aesthetics. Category: Advanced Aesthetics & Wellness — Punta Gorda, FL. Tagline: Where Beauty Blooms Within.`,
    ``,
    `## Positioning`,
    ``,
    `House of Rose Aesthetics serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. PRF is one of the studio's core services, alongside advanced skin treatments, injectables, facials, and wellness support. Walk-ins are welcome; appointments are recommended to reserve a time.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
