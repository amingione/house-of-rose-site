import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_SERVICES_QUERY,
  ALL_BLOG_POSTS_QUERY,
  ALL_COLLECTIONS_QUERY,
  ALL_COST_GUIDES_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  AI_SEARCH_FAQ_QUERY,
  type Service,
  type BlogPost,
  type ServiceCollection,
  type CostGuide,
  type Comparison,
  type LocalArea,
  type AiSearchFaqSection,
} from '@/lib/queries';

export const GET: APIRoute = async ({ site }) => {
  const base = resolveBaseUrl(site, 'llms.txt');

  const [services, posts, collections, costGuides, comparisons, localAreas, aiSearchFaq] = await Promise.all([
    sanityFetch<Service[]>(ALL_SERVICES_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<ServiceCollection[]>(ALL_COLLECTIONS_QUERY),
    sanityFetch<CostGuide[]>(ALL_COST_GUIDES_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<AiSearchFaqSection | null>(AI_SEARCH_FAQ_QUERY),
  ]);

  const lines: string[] = [
    `# House of Rose Aesthetics`,
    ``,
    `> Where Beauty Blooms Within. House of Rose is an advanced aesthetics and wellness studio in Punta Gorda, Florida, offering PRF, procell, microchanneling, injectables, advanced facials, IV hydration, provider-guided weight management, and professional home care. Walk-ins are welcome; appointments are recommended to reserve a time.`,
    ``,
    `House of Rose is located at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. Phone: (844) 941-7673. Email: info@houseofrosefl.com. Serving Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Home](${base}/): House of Rose Aesthetics — advanced aesthetics & wellness in Punta Gorda, FL`,
    `- [Services](${base}/services/): Full menu across regenerative aesthetics, injectables, skin health, and wellness`,
    `- [Consultation](${base}/consultation/): Explore regenerative skin treatments, targeted modalities, skin maintenance, IV hydration, and provider-guided weight support`,
    `- [AI Skin Analysis](${base}/skin-analysis/): In-studio AI-assisted imaging for pigmentation, texture, pores, fine lines, hydration cues, visible sun exposure, and treatment planning`,
    `- [Treatment Series & Packages](${base}/packages/): Verified series and consultation-led treatment pathways`,
    `- [Experience](${base}/experience/): What to expect before, during, and after an unhurried visit`,
    `- [Contact](${base}/contact/): Book a consultation or reach out`,
    `- [Rent a Suite](${base}/rent-a-room/): Private treatment room rentals for licensed aestheticians and wellness professionals`,
    `- [Journal](${base}/blog/): Expert insights on wellness, beauty, and living well in Southwest Florida`,
    `- [FAQ](${base}/faq/): Answers about treatments, pricing, and what to expect`,
    `- [Support](${base}/support/): Help with appointments, booking, directions, and contacting the studio`,
    `- [Terms of Service](${base}/terms-of-service/): Terms for website use, appointments, communications, and online product orders`,
    `- [Shipping Policy](${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- [Return Policy](${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- [Areas We Serve](${base}/areas/): Punta Gorda, Port Charlotte & Southwest Florida`,
    `- [Results](${base}/results/): Before & after outcomes, shared with client consent`,
    `- [Sitemap](${base}/sitemap/): HTML index of public pages across services, concerns, packages, guides, locations, and resources`,
    ``,
  ];

  if (aiSearchFaq?.faqs?.length) {
    lines.push(`## Frequently Asked Questions`, ``);
    for (const faq of aiSearchFaq.faqs) {
      lines.push(`### ${faq.question}`, ``, faq.answer, ``);
    }
  }

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
      const desc = s.tagline ? ` — ${s.tagline.replace(/[.!?]+$/, '')}` : '';
      // `service.price` is editor-authored free text (e.g. "From $45", "Consultation required")
      // — print it verbatim so we never emit a mangled "$From $45".
      const price = s.price ? ` ${s.price}.` : '';
      lines.push(`- [${s.title}](${base}/services/${s.slug}/)${desc}.${price}`);
    }
    lines.push(``);
  }

  if (costGuides.length > 0) {
    lines.push(`## Pricing Guides`, ``);
    for (const c of costGuides) {
      const range = c.priceLow != null && c.priceHigh != null ? ` Typical range $${c.priceLow}–$${c.priceHigh}${c.priceUnit ? ` ${c.priceUnit}` : ''}.` : '';
      lines.push(`- [${c.title}](${base}/cost/${c.slug}/).${range}`);
    }
    lines.push(``);
  }

  if (comparisons.length > 0) {
    lines.push(`## Treatment Comparisons`, ``);
    for (const c of comparisons) {
      lines.push(`- [${c.title}](${base}/compare/${c.slug}/)${c.intro ? ` — ${c.intro}` : ''}`);
    }
    lines.push(``);
  }

  if (localAreas.length > 0) {
    lines.push(`## Areas Served`, ``);
    for (const a of localAreas) {
      lines.push(`- [${a.title}](${base}/areas/${a.slug}/)${a.intro ? ` — ${a.intro}` : ''}`);
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
    `- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950`,
    `- **Phone:** (844) 941-7673`,
    `- **Email:** info@houseofrosefl.com`,
    `- **Booking:** https://houseofrose.glossgenius.com/book`,
    `- **Services:** https://houseofrose.glossgenius.com/services`,
    `- **Hours:** Monday–Friday 9:00 AM–5:00 PM`,
    `- **Opened:** June 15, 2026`,
    `- **Instagram:** @house.of.rose.aesthetics`,
    `- **Facebook:** https://www.facebook.com/profile.php?id=61590233534310`,
    `- **Service Area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, Punta Gorda Isles`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
