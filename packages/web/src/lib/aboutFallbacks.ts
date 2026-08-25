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
      'Meet the named practitioners behind medical, skin, facial, waxing, and makeup appointments at House of Rose in Punta Gorda.',
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
    publicRole: 'Registered Nurse · Aesthetic Injector',
    summary:
      'Diana Morrison, RN, provides the injectable, IV hydration, and medical weight-management services at House of Rose Aesthetics.',
    biography: [
      'Her injectable work includes Botox and Daxxify for movement-related lines, hyaluronic-acid dermal fillers for selected areas of lost volume, and the current injectable PRF appointments.',
      'She also provides IV hydration and the GLP-1 weight-management program. These services are performed under written physician protocol and medical direction.',
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
        'Diana Morrison, RN provides neurotoxin, dermal filler, injectable PRF, IV hydration, and GLP-1 appointments at House of Rose in Punta Gorda.',
    },
  },
  {
    _id: 'provider-amber',
    slug: 'amber',
    publicName: 'Amber Mingione, Licensed Esthetician',
    publicRole: 'Licensed Esthetician · Medical Assistant · Certified Phlebotomist',
    summary:
      'Amber Mingione, Licensed Esthetician, focuses on skin-surface, texture, and selected device services.',
    biography: [
      'She provides Microneedling with the Procell Therapies device, Glo2Facial, and dermaplaning. In her appointments, BioRePeel is used only as an add-on to an eligible advanced service.',
      'When PRF is part of her work, it is applied topically during eligible Microneedling. Diana Morrison, RN provides the injectable PRF appointments.',
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
    publicName: 'Brandy, Licensed Esthetician',
    publicRole: 'Licensed Esthetician',
    summary:
      'Brandy is a Licensed Esthetician providing facials, standalone BioRePeel, and facial waxing at House of Rose Aesthetics.',
    biography: [
      'Her current work includes facials, standalone peels, and facial waxing. Standalone BioRePeel is booked with Brandy, Licensed Esthetician; Amber Mingione, Licensed Esthetician uses BioRePeel only as an add-on to an eligible advanced service.',
      'Facial waxing is booked separately for brows, the upper lip, and the chin, including a distinct brow shape, trim, and wax appointment.',
    ],
    serviceFocus: ['Facials', 'Standalone BioRePeel', 'Facial waxing'],
    imageUrl: '/images/providers/brandy-profile-1122.webp',
    imageAlt: 'Brandy, Licensed Esthetician at House of Rose Aesthetics',
    digitalCardPath: getPublicProviderDigitalCardPath('brandy'),
    listingOrder: 30,
    seo: {
      metaTitle: 'Brandy, Licensed Esthetician | House of Rose',
      metaDescription:
        'Brandy, Licensed Esthetician provides facials, standalone BioRePeel, and facial waxing at House of Rose in Punta Gorda.',
    },
  },
  {
    _id: 'provider-aundrea',
    slug: 'aundrea',
    publicName: 'Aundrea Pedigo, Licensed Esthetician',
    publicRole: 'Licensed Esthetician · Makeup Artist',
    summary:
      'Aundrea Pedigo, Licensed Esthetician, provides professional makeup artistry at House of Rose Aesthetics.',
    biography: [
      'Her makeup work covers bridal appointments, events and celebrations, photo shoots, and everyday wear, ranging from soft daytime makeup to full glam.',
      'A bridal appointment runs longer than an event appointment because it is built around the schedule of the day. Makeup artistry is a non-medical service.',
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
