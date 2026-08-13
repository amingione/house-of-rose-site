import type { AboutPageContent, PublicProviderProfile } from '@/lib/queries';

/**
 * Build-safe fallbacks for the About launch. Sanity remains primary; these
 * values mirror the seed script so a missing/cold singleton cannot remove the
 * public information architecture during a static build.
 */
export const ABOUT_PAGE_FALLBACK: Required<
  Pick<
    AboutPageContent,
    | '_id'
    | 'indexHeading'
    | 'indexIntro'
    | 'indexImageUrl'
    | 'indexImageAlt'
    | 'hraHeading'
    | 'hraIntro'
    | 'hraParagraphs'
    | 'hraImageUrl'
    | 'hraImageAlt'
    | 'providersHeading'
    | 'providersIntro'
  >
> & Pick<AboutPageContent, 'indexSeo' | 'hraSeo' | 'providersSeo'> = {
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
    'Skin texture, pigment, muscle movement, and volume change are not interchangeable concerns. Each service category has a different role.',
    'Every recommendation should have a clear reason to be there. Sometimes the right answer is no treatment at all.',
  ],
  hraImageUrl: '/images/optimized/actual-reception-1400-light.webp',
  hraImageAlt: 'House of Rose Aesthetics reception in Punta Gorda, Florida',
  providersHeading: 'Meet the House of Rose team',
  providersIntro:
    'Each profile explains the person’s verified role, current service focus, and approach to care or artistry at House of Rose Aesthetics.',
  indexSeo: {
    metaTitle: 'About House of Rose Aesthetics | Punta Gorda, FL',
    metaDescription:
      'Learn about House of Rose Aesthetics, a Punta Gorda medical aesthetics practice, and meet the team behind the practice.',
  },
  hraSeo: {
    metaTitle: 'House of Rose Aesthetics | About Our Punta Gorda Practice',
    metaDescription:
      'Read how House of Rose distinguishes skin, injectable, body, IV hydration, and wellness services at its Punta Gorda practice.',
  },
  providersSeo: {
    metaTitle: 'House of Rose Providers | Punta Gorda, FL',
    metaDescription:
      'Meet the House of Rose Aesthetics team in Punta Gorda and learn each provider’s verified role, focus, and approach.',
  },
};

export const PROVIDER_PROFILE_FALLBACKS: PublicProviderProfile[] = [
  {
    _id: 'provider-diana',
    slug: 'diana',
    publicName: 'Diana Morrison, RN',
    publicRole: 'Registered Nurse · Co-Owner · Aesthetic Injector',
    summary: 'Diana Morrison, RN, is a Co-Owner of House of Rose Aesthetics.',
    biography: [
      'Her current work includes neuromodulators, dermal fillers, injectable PRF, PRF Bio-Filler, IV hydration, and GLP-1 weight management.',
    ],
    serviceFocus: ['Neuromodulators', 'Dermal fillers', 'Injectable PRF', 'PRF Bio-Filler', 'IV hydration', 'GLP-1 weight management'],
    imageUrl: '/images/providers/diana-profile-1122.webp',
    imageAlt: 'Diana Morrison, RN, at House of Rose Aesthetics',
    digitalCardPath: '/diana/',
    listingOrder: 10,
    medicallyDirected: true,
    seo: {
      metaTitle: 'Diana Morrison, RN | House of Rose Aesthetics',
      metaDescription:
        'Meet Diana Morrison, RN, Co-Owner and aesthetic injector at House of Rose Aesthetics in Punta Gorda, Florida.',
    },
  },
  {
    _id: 'provider-amber',
    slug: 'amber',
    publicName: 'Amber Mingione, Licensed Esthetician',
    publicRole: 'Licensed Esthetician · Medical Assistant · Certified Phlebotomist · Co-Owner',
    summary: 'Amber Mingione, Licensed Esthetician, is a Co-Owner of House of Rose Aesthetics.',
    biography: [
      'Her current work includes Microneedling with the Procell Therapies device, Glo2Facial, dermaplaning, and topical PRF used during eligible Microneedling.',
      'PRF in Amber’s work is topical only. She does not perform PRF injections; injectable PRF is performed separately by Diana Morrison, RN.',
    ],
    serviceFocus: ['Microneedling with the Procell Therapies device', 'Topical PRF', 'Glo2Facial', 'Dermaplaning'],
    imageUrl: '/images/providers/amber-profile-1122.webp',
    imageAlt: 'Amber Mingione, Licensed Esthetician, at House of Rose Aesthetics',
    digitalCardPath: '/amber/',
    listingOrder: 20,
    medicallyDirected: true,
    seo: {
      metaTitle: 'Amber Mingione, Licensed Esthetician | House of Rose',
      metaDescription:
        'Meet Amber Mingione, Licensed Esthetician and Co-Owner of House of Rose Aesthetics in Punta Gorda, Florida.',
    },
  },
  {
    _id: 'provider-brandy',
    slug: 'brandy',
    publicName: 'Brandy, Licensed Esthetician',
    publicRole: 'Licensed Esthetician',
    summary: 'Brandy is a Licensed Esthetician at House of Rose Aesthetics.',
    biography: [
      'Her current work includes facials, standalone BioRePeel, and facial waxing.',
    ],
    serviceFocus: ['Facials', 'Standalone BioRePeel', 'Facial waxing'],
    imageUrl: '/images/providers/brandy-profile-1122.webp',
    imageAlt: 'Brandy, Licensed Esthetician at House of Rose Aesthetics',
    digitalCardPath: '/brandy/',
    listingOrder: 30,
    seo: {
      metaTitle: 'Brandy, Licensed Esthetician | House of Rose',
      metaDescription:
        'Meet Brandy, Licensed Esthetician at House of Rose Aesthetics in Punta Gorda, Florida.',
    },
  },
  {
    _id: 'provider-aundrea',
    slug: 'aundrea',
    publicName: 'Aundrea Pedigo, Esthetician',
    publicRole: 'Licensed Esthetician · Makeup Artist · Permanent Jewelry Artist',
    summary:
      'Aundrea Pedigo, Esthetician, provides professional makeup artistry and permanent jewelry at House of Rose Aesthetics.',
    biography: [
      'Aundrea Pedigo, Esthetician, provides makeup for weddings, special events, photo shoots, and celebrations, with finishes ranging from soft event makeup to full glam.',
      'She also provides permanent jewelry.',
    ],
    serviceFocus: ['Wedding makeup', 'Special-event makeup', 'Photo-shoot makeup', 'Permanent jewelry'],
    imageAlt: 'Aundrea Pedigo, Licensed Esthetician, at House of Rose Aesthetics',
    listingOrder: 40,
    seo: {
      metaTitle: 'Aundrea Pedigo, Esthetician | House of Rose',
      metaDescription:
        'Meet Aundrea Pedigo, Esthetician, makeup artist, and permanent jewelry artist at House of Rose in Punta Gorda, Florida.',
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
