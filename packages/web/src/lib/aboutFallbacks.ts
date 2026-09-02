import type { PublicProviderProfile } from '@/lib/queries';
import { getPublicProviderDigitalCardPath } from '@/lib/publicProviderContent';

/**
 * Reviewed local About copy and build-safe image fallbacks. Sanity remains the
 * source for the active image fields only; a missing singleton falls back to
 * these local assets without changing the public information architecture.
 */
export const ABOUT_PAGE_FALLBACK = {
  _id: 'aboutPage',
  indexHeading: 'About House of Rose',
  indexIntro:
    'Learn how House of Rose Aesthetics approaches medical aesthetics and meet the people responsible for each part of the client experience.',
  indexImageUrl: '/images/optimized/actual-reception-1400-light.webp',
  indexImageAlt: 'Reception and consultation area at House of Rose Aesthetics in Punta Gorda',
  hraHeading: 'House of Rose Aesthetics',
  hraIntro:
    'A medical aesthetics practice offering distinct services for skin, movement, volume, body concerns, hydration, and wellness.',
  hraParagraphs: [
    'House of Rose brings skin care, injectable services, IV hydration, and medical weight management together at one Punta Gorda practice.',
    'Diana Morrison, RN, and Amber Mingione, Licensed Esthetician, have distinct responsibilities within a small team. Each profile names the services that person currently provides.',
  ],
  hraImageUrl: '/images/optimized/actual-reception-1400-light.webp',
  hraImageAlt: 'House of Rose Aesthetics reception in Punta Gorda, Florida',
  providersHeading: 'Meet the House of Rose team',
  providersIntro:
    'Each profile names the person’s licence type and the services they currently provide at House of Rose Aesthetics.',
  indexSeo: {
    metaTitle: 'About House of Rose Aesthetics | Punta Gorda, FL',
    metaDescription:
      'Meet the named practitioners behind medical, skin, facial, waxing, and makeup services at House of Rose in Punta Gorda.',
  },
  hraSeo: {
    metaTitle: 'House of Rose Aesthetics | About Our Punta Gorda Practice',
    metaDescription:
      'House of Rose brings injectables, IV hydration, weight management, skin treatments, facials, waxing, and makeup to Punta Gorda.',
  },
  providersSeo: {
    metaTitle: 'House of Rose Providers | Punta Gorda, FL',
    metaDescription:
      'Meet the House of Rose team, with each practitioner’s licence type and current medical, skin, facial, waxing, and makeup work.',
  },
};

// Ownership structure ("Co-Owner"/"Owner") is private — never public-facing (binding, 2026-08-13).
// Do not add it back into publicRole, summary, or seo below. See CLAUDE.md "Providers & Team".
export const PROVIDER_PROFILE_FALLBACKS: PublicProviderProfile[] = [
  {
    _id: 'provider-diana',
    slug: 'diana',
    publicName: 'Diana Morrison, RN',
    displayName: 'Diana Morrison, RN',
    publicRole: 'Registered Nurse · Aesthetic Injector',
    summary:
      'Diana Morrison, RN, provides the injectable, IV hydration, and medical weight-management services at House of Rose Aesthetics.',
    biography: [
      'After nearly two decades in aesthetic medicine, Diana has learned that great injectable results aren’t created by following trends — they’re created by understanding the face.',
      'As an advanced aesthetic injector with more than 17 years of experience, Diana has spent her career refining the balance between clinical precision and artistic judgment. Having trained and worked alongside some of the most respected names in aesthetic medicine throughout Los Angeles and Miami, she developed an approach centered on one principle: every face deserves its own treatment plan. No templates. No overfilled features. No chasing trends. Just thoughtful, individualized care designed to enhance what already makes each person unique.',
      'Over the course of her career, Diana has performed thousands of injectable treatments, giving her an experienced eye for facial anatomy, balance, and the subtle details that separate good results from exceptional ones. After building a trusted reputation in Downey, California, she relocated to Southwest Florida, bringing her experience, advanced techniques, and treatment philosophy to Punta Gorda. House of Rose Aesthetics was founded on the belief that patients throughout Charlotte County deserve access to the same level of expertise often associated with larger metropolitan practices.',
      'While Diana is highly experienced with neuromodulators and dermal fillers, her philosophy extends well beyond traditional injectables. She is a strong advocate for incorporating Platelet-Rich Fibrin (PRF) into comprehensive treatment plans, using the body’s own regenerative biology to stimulate collagen production and improve skin quality in areas where fillers and neurotoxins may not be the ideal solution. Rather than relying on a single treatment, she believes the best outcomes come from combining advanced injectable techniques with regenerative medicine.',
      'For Diana, aesthetic medicine has never been about changing someone’s face. It’s about understanding it. Through careful facial assessment, years of experience, and an unwavering commitment to patient safety, she develops personalized treatment plans that respect each patient’s natural anatomy while helping them look refreshed, confident, and unmistakably themselves.',
    ],
    serviceFocus: ['Neuromodulators', 'Dermal fillers', 'Injectable PRF', 'PRF Bio-Filler', 'IV hydration', 'GLP-1 weight management'],
    imageUrl: '/images/providers/diana-profile-1122.webp',
    imageAlt: 'Diana Morrison, RN, at House of Rose Aesthetics',
    digitalCardPath: getPublicProviderDigitalCardPath('diana'),
    listingOrder: 10,
    medicallyDirected: true,
    seo: {
      metaTitle: 'Diana Morrison, RN | House of Rose Aesthetics',
      metaDescription:
        'Diana Morrison, RN provides neurotoxin, dermal filler, injectable PRF, IV hydration, and GLP-1 services at House of Rose in Punta Gorda.',
    },
  },
  {
    _id: 'provider-amber',
    slug: 'amber',
    publicName: 'Amber Mingione, Licensed Esthetician',
    displayName: 'Amber Mingione',
    publicRole: 'Licensed Esthetician · Medical Assistant · Certified Phlebotomist',
    summary:
      'Amber Mingione, Licensed Esthetician, focuses on skin-surface, texture, and selected device services.',
    biography: [
      'Amber has never believed “good enough” is where progress stops. Whether she’s refining treatment protocols, researching regenerative medicine, or reimagining the patient experience, she’s always asking the same question: how can this be even better?',
      'That mindset has shaped every step of her career. A Medical Assistant and certified Phlebotomist with more than eight years of experience in medical aesthetics, Amber has dedicated her career to advancing regenerative skin rejuvenation through science, innovation, and continual refinement.',
      'Her passion for regenerative aesthetics began with a fascination for the body’s ability to heal itself. The biology of wound healing, collagen remodeling, and cellular regeneration quickly became more than an area of study — it became the foundation of how she approaches patient care. Rather than masking the visible signs of aging, Amber believes the most meaningful results come from supporting the skin’s natural ability to repair, rebuild, and regenerate.',
      'Over the years she has devoted countless hours to advanced education, university studies, clinical research, and collaboration with her medical director to refine protocols involving Procell Microchanneling, Platelet-Rich Plasma (PRP), and Platelet-Rich Fibrin (PRF). She is continually evaluating new techniques, technologies, and evidence to improve treatment outcomes, believing that even the best protocols can always become better.',
      'Today, Amber specializes in advanced regenerative treatments designed to stimulate collagen production, improve skin quality, and support long-term skin health using the body’s own biologic healing mechanisms. Every treatment plan is customized, combining precision microchanneling with regenerative biologics and carefully selected skincare to maximize the skin’s healing response while delivering natural-looking, progressive results.',
      'For Amber, regenerative aesthetics isn’t simply about improving the way skin looks today — it’s about changing how it functions for years to come. She believes exceptional results are achieved through individualized treatment planning, evidence-based care, and an unwavering commitment to continual improvement, helping every patient build healthier, stronger, and more resilient skin over time.',
    ],
    serviceFocus: ['Microneedling with the Procell Therapies device', 'Topical PRF', 'Glo2Facial', 'Dermaplaning', 'BioRePeel add-on'],
    imageUrl: '/images/providers/amber-profile-1122.webp',
    imageAlt: 'Amber Mingione, Licensed Esthetician, at House of Rose Aesthetics',
    digitalCardPath: getPublicProviderDigitalCardPath('amber'),
    listingOrder: 20,
    medicallyDirected: true,
    seo: {
      metaTitle: 'Amber Mingione, Licensed Esthetician | House of Rose',
      metaDescription:
        'Amber Mingione, Licensed Esthetician provides Procell Microneedling, topical PRF, Glo2Facial, and dermaplaning at House of Rose in Punta Gorda.',
    },
  },
  {
    _id: 'provider-brandy',
    slug: 'brandy',
    publicName: 'Brandy Case, Licensed Esthetician',
    displayName: 'Brandy Case',
    publicRole: 'Licensed Esthetician',
    summary:
      'Brandy Case, Licensed Esthetician, provides facials, BioRePeel, and facial waxing at House of Rose Aesthetics.',
    biography: [
      'Brandy has never believed skincare needs to be more complicated than it is. In an industry full of trends, miracle claims, and products promising impossible results, she has always come back to one simple question: does it actually work?',
      'That philosophy has shaped the way she practices esthetics from the very beginning. She isn’t interested in recommending a treatment because it’s popular, or selling products because they’re the latest thing. She’s interested in helping people achieve healthier skin through treatments that make sense, produce real results, and fit the individual sitting in her treatment room.',
      'As a Licensed Esthetician at House of Rose Aesthetics, Brandy provides customized facial treatments, professional skin maintenance, and facial waxing. Her approach is thoughtful, practical, and personalized, balancing proven treatment techniques with realistic expectations to create healthy, lasting improvements rather than temporary fixes.',
      'Quiet by nature but quick with a perfectly timed remark, Brandy has a way of making people feel comfortable without ever forcing the conversation. She listens first, speaks honestly, and believes patients deserve straightforward recommendations they can trust. It’s an approach that has earned the confidence of patients who appreciate substance over salesmanship.',
      'For Brandy, healthy skin isn’t about perfection. It’s about consistency, good habits, and treatments that genuinely make a difference.',
    ],
    serviceFocus: ['Facials', 'BioRePeel', 'Facial waxing'],
    imageUrl: '/images/providers/brandy-profile-1122.webp',
    imageAlt: 'Brandy Case, Licensed Esthetician, at House of Rose Aesthetics',
    digitalCardPath: getPublicProviderDigitalCardPath('brandy'),
    listingOrder: 30,
    seo: {
      metaTitle: 'Brandy Case, Licensed Esthetician | House of Rose',
      metaDescription:
        'Brandy Case, Licensed Esthetician provides facials, BioRePeel, and facial waxing at House of Rose in Punta Gorda.',
    },
  },
  {
    _id: 'provider-aundrea',
    slug: 'aundrea',
    publicName: 'Aundrea Pedigo, Licensed Esthetician',
    displayName: 'Aundrea Pedigo',
    publicRole: 'Licensed Esthetician · Makeup Artist',
    summary:
      'Aundrea Pedigo, Licensed Esthetician, provides professional makeup artistry at House of Rose Aesthetics.',
    biography: [
      'Some people wear makeup. Aundrea lives it.',
      'Long before she ever stepped into a classroom for professional training, she was the one everyone knew would end up with a makeup brush in her hand. What started as a childhood obsession turned into a career built on creativity, technical skill, and an eye for bringing out what makes each person unique.',
      'Aundrea doesn’t believe every client should leave looking the same. She loves the versatility of makeup — creating soft, effortless glam for one client, then turning around and building a bold, full-glam look for the next. She sees every face as a blank canvas and every appointment as an opportunity to create something completely individual.',
      'Her personality is just as memorable as her artistry. She’s energetic, unapologetically herself, and the kind of person who can have an entire room laughing without even trying. She brings confidence, creativity, and a little bit of chaos in the best possible way, making every appointment feel less like a service and more like spending time with someone you’ve known for years.',
      'Aundrea provides professional makeup artistry for weddings, special events, photo shoots, and celebrations, ranging from soft daytime makeup to full glam. Bridal makeup is built around the schedule and demands of the day. Makeup artistry is a non-medical service.',
      'For Aundrea, makeup has never been about hiding who you are. It’s about turning up the volume on the confidence that’s already there.',
    ],
    serviceFocus: ['Bridal makeup', 'Event makeup', 'Everyday makeup'],
    imageUrl: '/images/providers/aundrea-profile-1122.webp',
    imageAlt: 'Aundrea Pedigo, Licensed Esthetician, at House of Rose Aesthetics',
    digitalCardPath: getPublicProviderDigitalCardPath('aundrea'),
    listingOrder: 40,
    seo: {
      metaTitle: 'Aundrea Pedigo, Licensed Esthetician | House of Rose',
      metaDescription:
        'Aundrea Pedigo, Licensed Esthetician provides bridal, event, and everyday makeup at House of Rose in Punta Gorda; makeup artistry is a non-medical service.',
    },
  },
];

export interface ProviderProfileVoiceOverlay {
  summary: string;
  biography: string[];
  metaDescription?: string;
}

/**
 * Temporary voice-reset layer for the known provider slugs. The fallback holds
 * the reviewed public identity, credentials, and service facts; Sanity remains
 * the source for real provider imagery and any future provider profiles.
 */
export function getProviderProfileVoiceOverlay(slug: string): ProviderProfileVoiceOverlay | undefined {
  const fallback = PROVIDER_PROFILE_FALLBACKS.find((profile) => profile.slug === slug);
  if (!fallback) return undefined;

  return {
    summary: fallback.summary,
    biography: fallback.biography,
    metaDescription: fallback.seo?.metaDescription,
  };
}

/**
 * Overlay reviewed public provider facts without losing current Sanity imagery.
 * Known fallback profiles remain public even when a partial Sanity record is
 * missing its website fields; additional future Sanity profiles pass through.
 */
export function resolvePublicProviderProfiles(
  sanityProviders: PublicProviderProfile[],
): PublicProviderProfile[] {
  const sanityBySlug = new Map(sanityProviders.map((provider) => [provider.slug, provider]));
  const reviewedSlugs = new Set(PROVIDER_PROFILE_FALLBACKS.map((provider) => provider.slug));

  const reviewedProfiles = PROVIDER_PROFILE_FALLBACKS.map((fallback) => {
    const sanityProvider = sanityBySlug.get(fallback.slug);
    if (!sanityProvider) return fallback;

    return {
      ...sanityProvider,
      ...fallback,
      _id: sanityProvider._id,
      imageUrl: sanityProvider.imageUrl ?? fallback.imageUrl,
      imageAlt: fallback.imageAlt ?? sanityProvider.imageAlt,
    };
  });

  return [
    ...reviewedProfiles,
    ...sanityProviders.filter((provider) => !reviewedSlugs.has(provider.slug)),
  ].sort((left, right) => left.listingOrder - right.listingOrder || left.publicName.localeCompare(right.publicName));
}
