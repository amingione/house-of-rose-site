export type FaceRealityServiceSlug = 'face-reality-acne-program' | 'acne-bootcamp';

export interface FaceRealityMenuItem {
  readonly name: string;
  readonly duration: string;
  readonly priceUsd: number;
  readonly note: string;
}

export interface FaceRealityFaq {
  readonly question: string;
  readonly answer: string;
}

export interface FaceRealityServiceEducation {
  readonly slug: FaceRealityServiceSlug;
  readonly title: string;
  readonly heading: string;
  readonly whatItIs: string;
  readonly whyTheStructureMatters: string;
  readonly distinctions: readonly {
    readonly label: string;
    readonly text: string;
  }[];
  readonly faqs: readonly FaceRealityFaq[];
  readonly menuHeading: string;
  readonly menuIntro: string;
  readonly menuOrder: readonly number[];
}

/**
 * Reviewed public facts for the current Face Reality program.
 *
 * Program structure and provider certification come from the complete Face
 * Reality research brief. Prices and current menu names mirror the August 6,
 * 2026 GlossGenius reconciliation in ALL-SERVICES-PRICING.MD. Outcome
 * timelines, product protocols, and unsupported medical claims are omitted.
 */
export const FACE_REALITY_PROGRAM = {
  packageSlug: 'face-reality-12-week-program',
  duration: '12 weeks',
  cadence: 'In-studio visits every two weeks',
  summary:
    'The Face Reality Acne Program is a 12-week esthetics program for the appearance of recurring breakouts. It combines in-studio visits every two weeks with a home-care plan that is reviewed as the skin responds.',
  programOnly:
    'The current Acne Bootcamp is sold as one complete program rather than as a series of unrelated facials. Daily home care and the in-studio visits are two parts of the same program.',
  provider:
    'The program is provided by a licensed esthetician who is a Face Reality Certified Acne Specialist.',
  medicalBoundary:
    'This is a non-prescription esthetics program. Deep, painful, widespread, or actively scarring breakouts need medical evaluation before an esthetics program is considered.',
  packagePriceUsd: 899,
  consultationPriceUsd: 99,
  menuVerifiedAt: 'August 6, 2026',
  menu: [
    {
      name: 'Acne Bootcamp Consultation',
      duration: '60 minutes',
      priceUsd: 99,
      note: 'The current directly bookable starting point.',
    },
    {
      name: 'Acne Bootcamp — 12-Week Program',
      duration: '12 weeks',
      priceUsd: 899,
      note: 'The complete program; not sold as individual program visits.',
    },
  ] satisfies readonly FaceRealityMenuItem[],
  packageDetails: [
    'In-studio visits every two weeks across the 12-week program.',
    'Professional exfoliation and extractions selected for that visit.',
    'A home-care plan reviewed and adjusted during the program.',
  ] as const,
} as const;

export const FACE_REALITY_SERVICE_EDUCATION = {
  'face-reality-acne-program': {
    slug: 'face-reality-acne-program',
    title: 'Face Reality Acne Program',
    heading: 'The consultation and the complete program, explained together.',
    whatItIs:
      'House of Rose lists two Face Reality appointments: a directly bookable Acne Bootcamp Consultation and the complete 12-week Acne Bootcamp program.',
    whyTheStructureMatters:
      'Use this overview to see how the starting consultation, in-studio visits, and daily home care connect before opening the full program page.',
    distinctions: [
      {
        label: 'The starting consultation',
        text: 'The current menu lists a 60-minute consultation at $99. This is the directly bookable entry point.',
      },
      {
        label: 'The complete program',
        text: 'The complete program is $899 and runs for 12 weeks, with in-studio visits every two weeks and daily home care between visits.',
      },
    ],
    faqs: [
      {
        question: 'Is the Acne Bootcamp Consultation the complete program?',
        answer:
          'No. The current menu lists the 60-minute consultation at $99 and the complete 12-week program at $899 as two separate entries.',
      },
      {
        question: 'Who provides the Face Reality Acne Program?',
        answer: FACE_REALITY_PROGRAM.provider,
      },
      {
        question: 'Does the Face Reality program replace medical acne care?',
        answer:
          'No. This is a non-prescription esthetics program for the appearance of recurring breakouts. Deep, painful, widespread, or actively scarring breakouts need medical evaluation first.',
      },
    ],
    menuHeading: 'Two current Face Reality entries',
    menuIntro: 'The consultation is the directly bookable starting point; the program is the complete 12-week service.',
    menuOrder: [0, 1],
  },
  'acne-bootcamp': {
    slug: 'acne-bootcamp',
    title: 'Acne Bootcamp',
    heading: 'What the complete 12 weeks include.',
    whatItIs:
      'Acne Bootcamp is the current 12-week Face Reality program at House of Rose. In-studio visits take place every two weeks, with daily home care between visits.',
    whyTheStructureMatters:
      'This is one complete program rather than a group of unrelated facials. The work continues between appointments through the home-care plan.',
    distinctions: [
      {
        label: 'During in-studio visits',
        text: 'Visits take place every two weeks. Professional exfoliation and extractions are selected for that visit.',
      },
      {
        label: 'Between visits',
        text: 'Daily home care continues between appointments, and the home-care plan is reviewed during the 12 weeks.',
      },
    ],
    faqs: [
      {
        question: 'What is included in the 12-week Face Reality program?',
        answer:
          'The program combines in-studio visits every two weeks with a home-care plan reviewed during the 12 weeks. Professional exfoliation and extractions are selected for the visit. Home-care products are chosen separately after consultation.',
      },
      {
        question: 'Is Acne Bootcamp a single facial?',
        answer:
          'No. Acne Bootcamp is sold as one complete 12-week program. The consultation is a separate, directly bookable starting point on the current menu.',
      },
      {
        question: 'Does the program replace medical acne care?',
        answer:
          'No. This is a non-prescription esthetics program. Deep, painful, widespread, or actively scarring breakouts need medical evaluation first.',
      },
    ],
    menuHeading: 'The complete program and its starting consultation',
    menuIntro: 'The program is shown first here; the consultation remains the directly bookable starting point.',
    menuOrder: [1, 0],
  },
} as const satisfies Readonly<Record<FaceRealityServiceSlug, FaceRealityServiceEducation>>;

export const isFaceRealityServiceSlug = (slug: string): slug is FaceRealityServiceSlug =>
  slug === 'face-reality-acne-program' || slug === 'acne-bootcamp';

export const getFaceRealityServiceEducation = (
  slug: string,
): FaceRealityServiceEducation | undefined =>
  isFaceRealityServiceSlug(slug) ? FACE_REALITY_SERVICE_EDUCATION[slug] : undefined;
