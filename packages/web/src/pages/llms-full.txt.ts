import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import { alignPublicChannelCopy } from '@/lib/publicCopy';
import {
  ALL_COLLECTIONS_QUERY,
  ALL_BLOG_POSTS_QUERY,
  AI_SEARCH_FAQ_QUERY,
  PUBLIC_PROVIDERS_QUERY,
  type ServiceCollection,
  type BlogPost,
  type AiSearchFaqSection,
  type PublicProviderProfile,
} from '@/lib/queries';
import { PROVIDER_PROFILE_FALLBACKS } from '@/lib/aboutFallbacks';

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

  const [services, collections, posts, aiSearchFaq, sanityProviders] = await Promise.all([
    sanityFetch<ServiceFull[]>(SERVICES_FULL_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<AiSearchFaqSection | null>(AI_SEARCH_FAQ_QUERY),
    sanityFetch<PublicProviderProfile[]>(PUBLIC_PROVIDERS_QUERY),
  ]);
  const providers = sanityProviders.length > 0 ? sanityProviders : PROVIDER_PROFILE_FALLBACKS;

  const lines: string[] = [
    `# House of Rose Aesthetics — Medical Aesthetics Practice — Full Content Index`,
    ``,
    `> Medical Aesthetics. Thoughtfully Practiced.`,
    ``,
    `## About`,
    ``,
    `House of Rose Aesthetics is a medical aesthetics practice at 525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33950. The practice provides individualized facial, body, skin, injectable, wellness, and maintenance care through consultation, assessment, and treatment planning. Patients can ask questions, compare appropriate options, and choose care with preparation, aftercare, and natural-looking goals in mind.`,
    ``,
    `House of Rose serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. Call (844) 941-7673 for help choosing a service or arranging a visit.`,
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
    `- **About** (${base}/about/): House of Rose Aesthetics and the people behind the practice`,
    `- **House of Rose Aesthetics** (${base}/about/hra/): The practice method, standards, and Punta Gorda location`,
    `- **Providers** (${base}/about/providers/): Verified roles, service focus, and individual team profiles`,
    `- **Consultation** (${base}/consultation/): An overview of regenerative skin renewal, targeted face and body modalities, skin maintenance, IV hydration, and provider-guided weight support`,
    `- **Advanced Skin Imaging & Analysis** (${base}/skin-analysis/): In-studio multi-spectrum imaging for pigmentation, texture, pores, fine lines, hydration cues, sun damage, and evidence-led treatment planning`,
    `- **Treatment Series & Packages** (${base}/packages/): Verified treatment series and compatible service combinations`,
    `- **Experience** (${base}/experience/): What clients can expect before, during, and after an unhurried visit`,
    `- **Contact** (${base}/contact/): Directions, phone, email, and booking`,
    `- **Rent a Suite** (${base}/rent-a-room/): Private treatment room rentals starting at $850/month for licensed aestheticians, massage therapists, and permanent makeup artists`,
    `- **Journal** (${base}/blog/): Articles about aesthetics, skincare, wellness, and treatment decisions in Southwest Florida`,
    `- **Shipping Policy** (${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- **Return Policy** (${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- **Sitemap** (${base}/sitemap/): HTML index of public pages across services, concerns, packages, guides, locations, and resources`,
    ``,
    `---`,
    ``,
  ];

  if (providers.length > 0) {
    lines.push(`## Providers`, ``);
    for (const provider of providers) {
      lines.push(`### ${provider.publicName}`);
      lines.push(`URL: ${base}/about/providers/${provider.slug}/`);
      lines.push(`Role: ${provider.publicRole}`, ``, provider.summary, ``);
      for (const paragraph of provider.biography) lines.push(paragraph, ``);
      if (provider.serviceFocus.length > 0) lines.push(`Service focus: ${provider.serviceFocus.join(', ')}`, ``);
      if (provider.medicallyDirected) lines.push(`Medical Director: Joshua Shaw, MD · FL Lic. ME136232`, ``);
    }
    lines.push(`---`, ``);
  }

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
    `House of Rose speaks like a capable medical aesthetics practice with time to explain its reasoning: clear, restrained, specific, and human. Copy should explain what a service is, how candidacy is evaluated, and what preparation, recovery, aftercare, or maintenance may involve without hype or guarantees. Lead with "Medical Aesthetics Practice." "Med spa" and "medical spa" are acceptable supporting terms in metadata, SEO, and discovery contexts because the Google Business Profile category is Medical spa, but they are not the lead brand description.`,
    ``,
    `Canonical brand: House of Rose Aesthetics. Common brand variants: House of Rose and Rose Aesthetics. Category: Medical Aesthetics Practice. Signature line: Medical Aesthetics. Thoughtfully Practiced.`,
    ``,
    `## Positioning`,
    ``,
    `House of Rose Aesthetics serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. PRF is one of the practice's core services, alongside skin procedures, injectables, facials, and wellness support.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
