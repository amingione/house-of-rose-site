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
  indexImageUrl: '/images/optimized/actual-reception-1400.webp',
  indexImageAlt: 'Reception and consultation area at House of Rose Aesthetics in Punta Gorda',
  hraHeading: 'House of Rose Aesthetics',
  hraIntro:
    'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, built around individualized treatment planning and long-term care.',
  hraParagraphs: [
    'Medical aesthetics is not a one-size-fits-all service. The same concern can require a different approach depending on skin condition, treatment history, health information, timing, tolerance for downtime, and the patient’s desired degree of change. Our process is designed to evaluate those factors before a medical procedure is recommended.',
    'Services include regenerative therapies, radiofrequency and laser technologies, neurotoxins, dermal fillers, IV hydration, medical-grade skincare, customized facial treatments, and ongoing maintenance care. Each service has a different role. A treatment plan may include preparation, a procedure series, temporary downtime, home care, reassessment, or a maintenance schedule.',
    'House of Rose was designed to support focused, personal care without operating like a high-volume treatment floor. The environment is considered, but the standard of practice is defined by consultation, clear education, responsible treatment selection, documentation, aftercare, and follow-through.',
    'Our goal is not to change every feature or follow every trend. It is to help patients make informed decisions and pursue healthy-looking, natural-looking improvement through a plan that is appropriate for them.',
  ],
  hraImageUrl: '/images/optimized/actual-reception-1400.webp',
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
      'House of Rose Aesthetics is a Punta Gorda medical aesthetics practice built around consultation, assessment, treatment planning, and follow-through.',
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
    summary:
      'Diana Morrison, RN, is Co-Owner of House of Rose Aesthetics and an aesthetic injector with more than 17 years of experience in medical aesthetics.',
    biography: [
      'Diana’s approach begins with facial assessment. Treatment plans are built around anatomy, movement, proportion, treatment history, and the degree of change a patient wants, rather than a standard template.',
      'Her experience includes work alongside aesthetic professionals in Los Angeles and Miami before she relocated to Southwest Florida and co-founded House of Rose in Punta Gorda.',
      'Her work includes neuromodulators, dermal fillers, injectable PRF, IV hydration, and provider-guided weight management. She reviews candidacy, alternatives, preparation, and aftercare before making a recommendation.',
      'Diana’s goal is balanced, natural-looking improvement that respects each patient’s features.',
    ],
    serviceFocus: ['Neuromodulators', 'Dermal fillers', 'Injectable PRF', 'IV hydration', 'Provider-guided weight management'],
    imageUrl: '/images/providers/Diana.webp',
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
    summary:
      'Amber Mingione is Co-Owner of House of Rose Aesthetics, a Licensed Esthetician, Medical Assistant, and Certified Phlebotomist with more than 8 years of experience in medical aesthetics.',
    biography: [
      'Amber approaches skin care through continual study of wound healing, collagen remodeling, and the way skin responds over time. That interest informs how she plans advanced facial and needling appointments.',
      'Her current work includes microneedling with the Procell Therapies device, Procell Microchanneling, Glo2Facial, dermaplaning, carboxy treatments, and topical PRF used during an appropriate needling appointment.',
      'PRF in Amber’s practice is topical only. She does not perform PRF injections; injectable PRF is evaluated and performed separately by Diana Morrison, RN.',
      'Amber uses consultation, preparation, written aftercare, and reassessment to keep each recommendation connected to the client’s skin, timing, and long-term plan.',
    ],
    serviceFocus: ['Microneedling', 'Procell Microchanneling', 'Topical PRF', 'Glo2Facial', 'Dermaplaning'],
    imageUrl: '/images/providers/amber.webp',
    imageAlt: 'Amber Mingione at House of Rose Aesthetics',
    digitalCardPath: '/amber/',
    listingOrder: 20,
    medicallyDirected: true,
    seo: {
      metaTitle: 'Amber Mingione | House of Rose Aesthetics',
      metaDescription:
        'Meet Amber Mingione, Licensed Esthetician and Co-Owner of House of Rose Aesthetics in Punta Gorda, Florida.',
    },
  },
  {
    _id: 'provider-brandy',
    slug: 'brandy',
    publicName: 'Brandy, Licensed Esthetician',
    publicRole: 'Licensed Esthetician',
    summary:
      'Brandy is a Licensed Esthetician at House of Rose Aesthetics focused on facial treatments, skin maintenance, peels, and facial waxing.',
    biography: [
      'Brandy keeps skin care practical. She looks past trends and exaggerated promises to recommend treatments that make sense for the person in front of her.',
      'Her work includes customized facial treatments, professional skin maintenance, peels, hydrodermabrasion, and facial waxing. Recommendations are based on current skin condition, tolerance, home care, and maintenance goals.',
      'Quiet by nature and direct in conversation, Brandy listens first and gives straightforward guidance without turning the appointment into a sales pitch.',
      'For Brandy, healthy-looking skin is built through consistency, useful home habits, and treatments selected for a clear reason.',
    ],
    serviceFocus: ['Facial treatments', 'Professional peels', 'Hydrodermabrasion', 'Facial waxing'],
    imageUrl: '/images/providers/Brandy.PNG',
    imageAlt: 'Brandy, Licensed Esthetician at House of Rose Aesthetics',
    digitalCardPath: '/brandy/',
    listingOrder: 30,
    seo: {
      metaTitle: 'Brandy | House of Rose Aesthetics',
      metaDescription:
        'Meet Brandy, Licensed Esthetician at House of Rose Aesthetics in Punta Gorda, focused on facials, peels, maintenance, and waxing.',
    },
  },
  {
    _id: 'provider-aundrea',
    slug: 'aundrea',
    publicName: 'Aundrea',
    publicRole: 'Makeup Artist · Permanent Jewelry Artist',
    summary:
      'Aundrea provides professional makeup artistry and permanent jewelry at House of Rose Aesthetics, with each appointment shaped around the person and occasion.',
    biography: [
      'Aundrea approaches makeup as individual work, not a repeatable template. She adapts the finish, from soft event makeup to full glam, to the person, occasion, and way the client wants to look.',
      'Her work includes makeup for weddings, special events, photo shoots, and celebrations, along with permanent jewelry.',
      'She brings an energetic, direct personality to the appointment and keeps the process collaborative from the first reference image to the finished look.',
      'For Aundrea, makeup is not about hiding a face. It is about making intentional choices that still feel like the person wearing it.',
    ],
    serviceFocus: ['Wedding makeup', 'Special-event makeup', 'Photo-shoot makeup', 'Permanent jewelry'],
    listingOrder: 40,
    seo: {
      metaTitle: 'Aundrea | House of Rose Aesthetics',
      metaDescription:
        'Meet Aundrea, makeup and permanent jewelry artist at House of Rose Aesthetics in Punta Gorda, Florida.',
    },
  },
];
