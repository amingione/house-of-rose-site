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
 * Reality research brief. Current menu names mirror the August 6, 2026
 * GlossGenius reconciliation in ALL-SERVICES-PRICING.MD. `priceUsd` figures
 * are retained here for internal/GlossGenius paste-ready use only — per the
 * 2026-08-20 binding rule in CLAUDE.md, House of Rose pricing is never
 * public, so no public renderer may read `priceUsd` or print a dollar
 * amount. Outcome timelines, product protocols, and unsupported medical
 * claims are omitted.
 */
export const FACE_REALITY_PROGRAM = {
  packageSlug: 'face-reality-12-week-program',
  metaDescription:
    'House of Rose offers a 60-minute Acne Bootcamp Consultation and a 12-week Face Reality program. Ask about current pricing when you book.',
  duration: '12 weeks',
  cadence: 'In-studio visits every two weeks',
  summary:
    'The Face Reality Acne Program is a 12-week esthetics program for the appearance of recurring breakouts. It combines in-studio visits every two weeks with a home-care plan that is reviewed as the skin responds.',
  programOnly:
    'Acne Bootcamp brings in-studio visits and daily home care together across one 12-week program.',
  provider:
    'Amber Mingione, Licensed Esthetician and Face Reality Certified Acne Specialist, provides the Acne Bootcamp Consultation, complete 12-week program, and current Face Reality peel appointments.',
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
      duration: '60 minutes',
      priceUsd: 899,
      note: 'The complete program; not sold as individual program visits.',
    },
    {
      name: 'Face Reality Acne Peel #1',
      duration: '50 minutes',
      priceUsd: 135,
      note: '',
    },
    {
      name: 'Face Reality Acne Peel #2',
      duration: '45 minutes',
      priceUsd: 155,
      note: '',
    },
    {
      name: 'Face Reality Bright Skin Peel',
      duration: '45 minutes',
      priceUsd: 165,
      note: '',
    },
    {
      name: 'Face Reality Acne Back Peel',
      duration: '10 minutes',
      priceUsd: 205,
      note: '',
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
    heading: 'Start with a consultation, then decide about the complete 12 weeks.',
    whatItIs:
      'House of Rose offers a 60-minute Acne Bootcamp Consultation, the complete 12-week Acne Bootcamp program, and four Face Reality peel appointments. The consultation begins the program conversation; the peels can be arranged with the staff outside Acne Bootcamp.',
    whyTheStructureMatters:
      'The 60-minute consultation covers what is happening now, the separately purchased home care, and whether you want to continue into the complete 12-week program. Face Reality peel appointments can also be arranged separately from Acne Bootcamp.',
    distinctions: [
      {
        label: 'The consultation',
        text: 'The first appointment is a 60-minute consultation. You can book it directly; ask about current pricing when you book.',
      },
      {
        label: 'The complete program',
        text: 'The complete program runs for 12 weeks, with in-studio visits every two weeks and daily home care between visits. Ask about current pricing when you book.',
      },
      {
        label: 'Face Reality peels',
        text: 'Four Face Reality peels are arranged through House of Rose: Acne Peel #1, Acne Peel #2, Bright Skin Peel, and Acne Back Peel, each priced separately.',
      },
    ],
    faqs: [
      {
        question: 'Is the Acne Bootcamp Consultation the complete program?',
        answer:
          'No. The 60-minute consultation is a separate, directly bookable appointment. The complete 12-week program includes its in-studio visits; home-care products are an additional purchase. Ask about current pricing when you book.',
      },
      {
        question: 'Who provides the Face Reality Acne Program?',
        answer: FACE_REALITY_PROGRAM.provider,
      },
      {
        question: 'Can I arrange a Face Reality peel without buying Acne Bootcamp?',
        answer:
          'Yes. House of Rose offers four Face Reality peel appointments outside the program. Online booking is unavailable for those appointments, so contact the practice to arrange one.',
      },
      {
        question: 'Does the Face Reality program replace medical acne care?',
        answer:
          'No. This is a non-prescription esthetics program for the appearance of recurring breakouts. Deep, painful, widespread, or actively scarring breakouts need medical evaluation first.',
      },
    ],
    menuHeading: 'Consultation, 12-week program, and Face Reality peels',
    menuIntro: 'Book the consultation directly. The complete program and all four Face Reality peels are separately listed; the peels are arranged with House of Rose because online booking is unavailable. Ask about current pricing when you book.',
    menuOrder: [0, 1, 2, 3, 4, 5],
  },
  'acne-bootcamp': {
    slug: 'acne-bootcamp',
    title: 'Acne Bootcamp',
    heading: 'What the complete 12 weeks include.',
    whatItIs:
      'Acne Bootcamp is the 12-week Face Reality program at House of Rose. In-studio visits take place every two weeks, with daily home care between visits.',
    whyTheStructureMatters:
      'Acne Bootcamp carries the in-studio visits and home-care plan across the full 12 weeks.',
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
          'No. Acne Bootcamp is one complete 12-week program. Begin with the directly bookable 60-minute consultation; ask about current pricing when you book.',
      },
      {
        question: 'Who provides Acne Bootcamp at House of Rose?',
        answer: FACE_REALITY_PROGRAM.provider,
      },
      {
        question: 'Does the program replace medical acne care?',
        answer:
          'No. This is a non-prescription esthetics program. Deep, painful, widespread, or actively scarring breakouts need medical evaluation first.',
      },
    ],
    menuHeading: 'The 12-week program and consultation',
    menuIntro: 'The complete program includes in-studio visits every two weeks across 12 weeks. Home-care products are an additional purchase; begin with the directly bookable 60-minute consultation. Ask about current pricing when you book.',
    menuOrder: [1, 0],
  },
} as const satisfies Readonly<Record<FaceRealityServiceSlug, FaceRealityServiceEducation>>;

export const isFaceRealityServiceSlug = (slug: string): slug is FaceRealityServiceSlug =>
  slug === 'face-reality-acne-program' || slug === 'acne-bootcamp';

export const getFaceRealityServiceEducation = (
  slug: string,
): FaceRealityServiceEducation | undefined =>
  isFaceRealityServiceSlug(slug) ? FACE_REALITY_SERVICE_EDUCATION[slug] : undefined;
