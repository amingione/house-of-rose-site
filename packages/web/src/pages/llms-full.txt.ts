import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { resolveBaseUrl } from '@/lib/siteUrl';
import {
  ALL_BLOG_POSTS_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_CONCERNS_QUERY,
  ALL_COST_GUIDES_QUERY,
  ALL_LOCAL_AREAS_QUERY,
  ALL_TREATMENT_PACKAGES_QUERY,
  type BlogPost,
  type Comparison,
  type Concern,
  type CostGuide,
  type LocalArea,
  type TreatmentPackage,
} from '@/lib/queries';
import { PROVIDER_PROFILE_FALLBACKS } from '@/lib/aboutFallbacks';
import { getVerifiedCostFact } from '@/lib/costFacts';
import { getVerifiedServiceDuration } from '@/lib/serviceFacts';
import { getServiceCardSummary } from '@/lib/serviceCardContent';
import { getServiceEducation } from '@/lib/serviceEducation';
import { IV_HYDRATION_FAQS, VERIFIED_IV_MENU } from '@/lib/ivHydrationFacts';
import { PRF_UNDER_EYES_FAQS, PRF_UNDER_EYES_LISTING } from '@/lib/prfUnderEyesFacts';
import { getPublicBlogTitle, isReviewedPublicBlogSlug } from '@/lib/publicBlogContent';
import {
  filterReviewedPublicComparisons,
  getPublicComparisonContent,
} from '@/lib/publicComparisonContent';

// During the voice reset, this feed exposes reviewed route inventories and
// factual service education. Unreviewed long-form Sanity prose stays withheld.
const SERVICES_FULL_QUERY = /* groq */ `
  *[
    _type == "service" &&
    status in ["live", "actual-menu"] &&
    defined(slug.current) &&
    !(slug.current in [
      "microneedling-body",
      "neck-decollete-extension",
      "ez-gel-bio-filler",
      "glo2facial-prf",
      "glo2facial-procell-md",
      "glo2facial-procell-pro",
      "prf-fibrin-veil",
      "wellness"
    ])
  ] | order(orderRank asc, title asc) {
    title,
    "slug": slug.current,
    collection->{ title }
  }
`;

interface ServiceFull {
  title: string;
  slug: string;
  collection?: { title: string };
}

const NON_PUBLIC_SERVICE_SLUGS = new Set([
  'microneedling-body',
  'neck-decollete-extension',
  'ez-gel-bio-filler',
  'glo2facial-prf',
  'glo2facial-procell-md',
  'glo2facial-procell-pro',
  'prf-fibrin-veil',
  'wellness',
]);

export const GET: APIRoute = async ({ site }) => {
  const base = resolveBaseUrl(site, 'llms-full.txt');

  const [services, posts, concerns, costGuides, comparisons, localAreas, packages] = await Promise.all([
    sanityFetch<ServiceFull[]>(SERVICES_FULL_QUERY),
    sanityFetch<BlogPost[]>(ALL_BLOG_POSTS_QUERY),
    sanityFetch<Concern[]>(ALL_CONCERNS_QUERY),
    sanityFetch<CostGuide[]>(ALL_COST_GUIDES_QUERY),
    sanityFetch<Comparison[]>(ALL_COMPARISONS_QUERY),
    sanityFetch<LocalArea[]>(ALL_LOCAL_AREAS_QUERY),
    sanityFetch<TreatmentPackage[]>(ALL_TREATMENT_PACKAGES_QUERY),
  ]);
  const providers = PROVIDER_PROFILE_FALLBACKS;
  const publicServices = services.filter((service) => !NON_PUBLIC_SERVICE_SLUGS.has(service.slug));
  const publicPosts = posts.filter((post) => isReviewedPublicBlogSlug(post.slug));
  const publicComparisons = filterReviewedPublicComparisons(comparisons);

  const lines: string[] = [
    `# House of Rose Aesthetics — Medical Aesthetics Practice — Full Content Index`,
    ``,
    `> Medical aesthetics in Punta Gorda, Florida.`,
    ``,
    `## About`,
    ``,
    `House of Rose Aesthetics is a medical aesthetics practice at 525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33950. Services include skin treatments, injectables, body treatments, IV hydration, wellness care, and professional home care.`,
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
    `- **Home** (${base}/): Overview of the practice, current services, and booking`,
    `- **Services** (${base}/services/): Canonical directory for skin, injectable, body, IV hydration, weight-management, waxing, makeup, and permanent-jewelry appointments`,
    `- **About** (${base}/about/): House of Rose Aesthetics and the people behind the practice`,
    `- **House of Rose Aesthetics** (${base}/about/hra/): About the practice and its Punta Gorda location`,
    `- **Providers** (${base}/about/providers/): Licence types, service focus, and individual team profiles`,
    `- **Consultation** (${base}/consultation/): Request a conversation about a concern or treatment options; submitting the form does not reserve a time`,
    `- **Skin Imaging & Analysis** (${base}/skin-analysis/): In-studio multi-spectrum images used for a closer look before choosing a skin service`,
    `- **Treatment Series & Packages** (${base}/packages/): The current Face Reality 12-week program and its separately booked consultation`,
    `- **Experience** (${base}/experience/): Actual storefront, treatment rooms, providers, and visit information`,
    `- **Contact** (${base}/contact/): Directions, phone, email, response timing, appointment questions, and the general inquiry form`,
    `- **Rent a Suite** (${base}/rent-a-room/): Treatment room rental information for eligible licensed professionals`,
    `- **Journal** (${base}/blog/): Reviewed treatment articles with linked sources and clearly stated limitations`,
    `- **FAQ** (${base}/faq/): Answers about treatments, pricing, and what to expect`,
    `- **Support** (${base}/support/): Appointment changes, after-visit questions, directions, practice hours, and emergency guidance`,
    `- **Terms of Service** (${base}/terms-of-service/): Terms for website use, appointments, communications, and online product orders`,
    `- **Shipping Policy** (${base}/shipping-policy/): Contiguous U.S. shipping timing and carrier-rate details`,
    `- **Return Policy** (${base}/return-policy/): Eligibility, reporting windows, return shipping, and refund timing`,
    `- **Areas We Serve** (${base}/areas/): Punta Gorda, Port Charlotte & Southwest Florida`,
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
      lines.push(`Role: ${provider.publicRole}`, ``);
      if (provider.serviceFocus.length > 0) lines.push(`Service focus: ${provider.serviceFocus.join(', ')}`, ``);
      if (provider.medicallyDirected) lines.push(`Medical Director: Joshua Shaw, MD · FL Lic. ME136232`, ``);
    }
    lines.push(`---`, ``);
  }

  if (publicServices.length > 0) {
    lines.push(`## Services`, ``);
    for (const s of publicServices) {
      const education = getServiceEducation(s.slug);
      const cardSummary = getServiceCardSummary(s.slug);
      lines.push(`### ${s.title}`);
      lines.push(`URL: ${base}/services/${s.slug}/`);
      if (s.collection) lines.push(`Collection: ${s.collection.title}`);
      const duration = getVerifiedServiceDuration(s.slug);
      if (duration) lines.push(`Duration: ${duration}`);

      if (education) {
        lines.push(``, `Overview:`);
        for (const paragraph of education.paragraphs) lines.push(paragraph);

        if (education.distinctions && education.distinctions.length > 0) {
          lines.push(``, `Key details:`);
          for (const distinction of education.distinctions) {
            lines.push(`- **${distinction.label}:** ${distinction.text}`);
          }
        }

        if (education.menu) {
          lines.push(``, `House of Rose menu (prices shown as of ${education.menu.verifiedAt}):`);
          if (education.menu.intro) lines.push(education.menu.intro);
          for (const item of education.menu.items) {
            const appointmentFacts = [item.price, item.duration].filter(Boolean).join(' · ');
            const itemNote = item.note ? ` ${item.note}` : '';
            lines.push(`- ${item.name}${appointmentFacts ? ` — ${appointmentFacts}` : ''}.${itemNote}`);
          }
        }

        if (education.faqs && education.faqs.length > 0) {
          lines.push(``, `Common questions:`);
          for (const faq of education.faqs) {
            lines.push(`- **${faq.question}** ${faq.answer}`);
          }
        }
      } else if (cardSummary) {
        lines.push(`Summary: ${cardSummary}`);
      }

      if (s.slug === 'iv-hydration-therapy') {
        lines.push(``, `IV hydration menu:`);
        for (const item of VERIFIED_IV_MENU) {
          lines.push(`- ${item.name} — $${item.price} · ${item.durationMinutes} minutes.`);
        }
        lines.push(``, `Current IV questions:`);
        for (const faq of IV_HYDRATION_FAQS) {
          lines.push(`- **${faq.question}** ${faq.answer}`);
        }
      }

      if (s.slug === 'prf-under-eyes') {
        lines.push(
          ``,
          `Appointment price: ${PRF_UNDER_EYES_LISTING.name} — ${PRF_UNDER_EYES_LISTING.price}.`,
          `Call House of Rose to confirm how much time to allow for the appointment.`,
          ``,
          `Common questions:`,
        );
        for (const faq of PRF_UNDER_EYES_FAQS) {
          lines.push(`- **${faq.question}** ${faq.answer}`);
        }
      }
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  if (concerns.length > 0) {
    lines.push(`## Concern Guides`, ``);
    for (const concern of concerns) {
      lines.push(`- [${concern.title}](${base}/concerns/${concern.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (costGuides.length > 0) {
    lines.push(`## Pricing Guides`, ``);
    for (const guide of costGuides) {
      const fact = getVerifiedCostFact(guide.slug);
      lines.push(`- [${guide.title}](${base}/cost/${guide.slug}/)${fact ? ` — ${fact.answer}` : ''}`);
    }
    lines.push(``, `---`, ``);
  }

  if (publicComparisons.length > 0) {
    lines.push(`## Treatment Comparisons`, ``);
    for (const comparison of publicComparisons) {
      lines.push(`- [${getPublicComparisonContent(comparison.slug)!.title}](${base}/compare/${comparison.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (localAreas.length > 0) {
    lines.push(`## Areas Served`, ``);
    for (const area of localAreas) {
      lines.push(`- [${area.title}](${base}/areas/${area.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (packages.length > 0) {
    lines.push(`## Treatment Series & Packages`, ``);
    for (const treatmentPackage of packages) {
      lines.push(`- [${treatmentPackage.title}](${base}/packages/${treatmentPackage.slug}/)`);
    }
    lines.push(``, `---`, ``);
  }

  if (publicPosts.length > 0) {
    lines.push(`## Journal Articles`, ``);
    for (const p of publicPosts) {
      lines.push(`### ${getPublicBlogTitle(p)}`);
      lines.push(`URL: ${base}/blog/${p.slug}/`);
      if (p.publishedAt) lines.push(`Published: ${p.publishedAt.split('T')[0]}`);
      if (p.category) lines.push(`Category: ${p.category}`);
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  lines.push(
    `## Identity & Public Facts`,
    ``,
    `House of Rose Aesthetics is the canonical business name. The lead public category is "Medical Aesthetics Practice." "Med spa" and "medical spa" are acceptable supporting terms in metadata, SEO, and discovery contexts because the Google Business Profile category is Medical spa.`,
    ``,
    `Common brand variants: House of Rose and Rose Aesthetics. Address: 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. Phone: (844) 941-7673.`,
    ``,
    `## Service Scope`,
    ``,
    `House of Rose Aesthetics serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles. The public service inventory includes skin procedures, PRF, injectables, facials, IV hydration, and wellness services.`,
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
