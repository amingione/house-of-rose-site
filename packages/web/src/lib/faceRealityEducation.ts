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
  metaDescription:
    'House of Rose offers a separate $99, 60-minute Acne Bootcamp Consultation and an $899 12-week Face Reality program with visits every two weeks.',
  duration: '12 weeks',
  cadence: 'In-studio visits every two weeks',
  summary:
    'The Face Reality Acne Program is a 12-week esthetics program for the appearance of recurring breakouts. It combines in-studio visits every two weeks with a home-care plan that is reviewed as the skin responds.',
  programOnly:
    'Acne Bootcamp brings in-studio visits and daily home care into one 12-week program. The two parts are designed to be followed together rather than booked as unrelated facials.',
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
      note: 'Book this appointment before beginning the complete program.',
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
    heading: 'The consultation is one appointment. Acne Bootcamp is the full 12 weeks.',
    whatItIs:
      'House of Rose offers a 60-minute Acne Bootcamp Consultation and a complete 12-week Acne Bootcamp program. The consultation is the first appointment; the program combines visits every two weeks with daily home care.',
    whyTheStructureMatters:
      'The consultation gives you and the esthetician time to discuss what is happening now, the home-care purchase, and whether you want to continue into the 12-week program.',
    distinctions: [
      {
        label: 'The consultation',
        text: 'The first appointment is a 60-minute consultation at $99. You can book it directly.',
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
          'No. The 60-minute consultation is $99. The complete 12-week program is $899 and includes its in-studio visits; home-care products are purchased separately.',
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
    menuHeading: 'The consultation and the 12-week program',
    menuIntro: 'These are separate purchases: a directly bookable $99 consultation and the complete $899 program if you decide to continue.',
    menuOrder: [0, 1],
  },
  'acne-bootcamp': {
    slug: 'acne-bootcamp',
    title: 'Acne Bootcamp',
    heading: 'What the complete 12 weeks include.',
    whatItIs:
      'Acne Bootcamp is the 12-week Face Reality program at House of Rose. In-studio visits take place every two weeks, with daily home care between visits.',
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
          'No. Acne Bootcamp is one complete 12-week program. The required 60-minute consultation is booked separately for $99.',
      },
      {
        question: 'Does the program replace medical acne care?',
        answer:
          'No. This is a non-prescription esthetics program. Deep, painful, widespread, or actively scarring breakouts need medical evaluation first.',
      },
    ],
    menuHeading: 'The complete program and its separate consultation',
    menuIntro: 'The $899 program runs for 12 weeks with in-studio visits every two weeks. Home-care products are purchased separately, as is the directly bookable $99, 60-minute consultation.',
    menuOrder: [1, 0],
  },
} as const satisfies Readonly<Record<FaceRealityServiceSlug, FaceRealityServiceEducation>>;

export const isFaceRealityServiceSlug = (slug: string): slug is FaceRealityServiceSlug =>
  slug === 'face-reality-acne-program' || slug === 'acne-bootcamp';

export const getFaceRealityServiceEducation = (
  slug: string,
): FaceRealityServiceEducation | undefined =>
  isFaceRealityServiceSlug(slug) ? FACE_REALITY_SERVICE_EDUCATION[slug] : undefined;
