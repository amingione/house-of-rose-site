export type InjectableServiceSlug = 'injectables' | 'dermal-fillers';

export type InjectablePriceQualifier = 'per unit';

export interface InjectableProductPrice {
  readonly amountUsd: number;
  readonly qualifier?: InjectablePriceQualifier;
}

export interface InjectableProductFact {
  readonly name: string;
  readonly durationMinutes: number;
  readonly price: InjectableProductPrice;
}

export interface InjectableConsultationFact {
  readonly name: string;
  readonly durationMinutes: number;
  readonly priceUsd: number;
}

export interface InjectableServiceEducation {
  readonly slug: InjectableServiceSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly pricingSummary: string;
  readonly bookingGuidance?: string;
  readonly consultation?: InjectableConsultationFact;
  readonly provider: {
    readonly publicName: string;
    readonly profilePath: string;
    readonly statement: string;
  };
  readonly faqs: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly links: readonly {
    readonly href: string;
    readonly label: string;
  }[];
  readonly products: readonly InjectableProductFact[];
}

/**
 * Public, fact-only overview data for the two current injectable service pages.
 *
 * Product names, appointment lengths, and prices mirror the August 6, 2026
 * GlossGenius reconciliation in ALL-SERVICES-PRICING.MD. The summaries use the
 * current public service identities and intentionally omit treatment process,
 * candidacy, product selection, and outcome claims.
 */
export const INJECTABLE_SERVICE_EDUCATION = {
  injectables: {
    slug: 'injectables',
    title: 'Neurotoxin Injections',
    whatItIs: 'House of Rose offers Botox and Daxxify for expression lines created by facial movement.',
    whereItFits: 'The clearest clue is what happens when you frown, raise your brows, or squint: a movement-related line appears or becomes deeper.',
    pricingSummary: 'Both products are priced at $14 per unit.',
    consultation: {
      name: 'Neuromodulator Consultation',
      durationMinutes: 20,
      priceUsd: 50,
    },
    provider: {
      publicName: 'Diana Morrison, RN',
      profilePath: '/about/providers/diana/',
      statement: 'Neurotoxin consultations and appointments are provided by Diana Morrison, RN under medical direction.',
    },
    faqs: [
      {
        question: 'Is $14 per unit the complete appointment price?',
        answer: 'No. $14 is the rate for each unit of Botox or Daxxify, not a flat appointment total. The appointment total depends on the number of units administered.',
      },
      {
        question: 'Are Botox and Daxxify units interchangeable?',
        answer: 'No. The units are specific to each product and cannot be compared or converted between Botox and Daxxify.',
      },
      {
        question: 'What is useful to describe when I ask about a line?',
        answer: 'Say whether the line appears or becomes deeper with expression. If what you notice is a change in volume at the lips, cheeks, or folds, the Dermal Fillers consultation addresses that different concern.',
      },
    ],
    links: [
      {
        href: '/compare/daxxify-vs-botox/',
        label: 'Compare Daxxify and Botox',
      },
      {
        href: '/services/dermal-fillers/',
        label: 'Explore Dermal Fillers',
      },
      {
        href: '/about/providers/diana/',
        label: 'Meet Diana Morrison, RN',
      },
    ],
    products: [
      {
        name: 'Botox',
        durationMinutes: 30,
        price: { amountUsd: 14, qualifier: 'per unit' },
      },
      {
        name: 'Daxxify',
        durationMinutes: 60,
        price: { amountUsd: 14, qualifier: 'per unit' },
      },
    ],
  },
  'dermal-fillers': {
    slug: 'dermal-fillers',
    title: 'Dermal Fillers',
    whatItIs: 'House of Rose offers five manufactured hyaluronic-acid gels from Juvéderm and RHA for selected areas of lost facial volume.',
    whereItFits: 'Those areas are the lips, cheeks, and folds. The five products have different published prices and appointment lengths, while the consultation gives you one place to begin.',
    pricingSummary: 'The five dermal filler products range from $650 to $850.',
    consultation: {
      name: 'Dermal Filler Consultation',
      durationMinutes: 60,
      priceUsd: 300,
    },
    bookingGuidance:
      'Request the 60-minute, $300 Dermal Filler Consultation and describe where you have noticed a change in volume—lips, cheeks, or folds. You are not expected to arrive with a product name.',
    provider: {
      publicName: 'Diana Morrison, RN',
      profilePath: '/about/providers/diana/',
      statement: 'Dermal filler consultations and appointments are provided by Diana Morrison, RN under medical direction.',
    },
    faqs: [
      {
        question: 'Are all five House of Rose fillers made with hyaluronic acid?',
        answer: 'Yes. Juvéderm Ultra XC, Juvéderm Voluma XC, RHA 1, RHA 2, and RHA 3 are manufactured hyaluronic-acid gels.',
      },
      {
        question: 'How are dermal fillers different from Botox or Daxxify?',
        answer: 'Dermal fillers are used here for selected areas of lost volume in the lips, cheeks, and folds. Botox and Daxxify address lines related to facial movement.',
      },
      {
        question: 'Why are five products shown if booking begins with a consultation?',
        answer: 'Each product has its own price and appointment length. The Dermal Filler Consultation is 60 minutes at $300, so you can begin with the area you want to discuss rather than a product name.',
      },
    ],
    links: [
      {
        href: '/services/injectables/',
        label: 'Explore Neurotoxin Injections',
      },
      {
        href: '/about/providers/diana/',
        label: 'Meet Diana Morrison, RN',
      },
    ],
    products: [
      {
        name: 'Juvéderm Ultra XC',
        durationMinutes: 30,
        price: { amountUsd: 700 },
      },
      {
        name: 'Juvéderm Voluma XC',
        durationMinutes: 45,
        price: { amountUsd: 850 },
      },
      {
        name: 'RHA 1',
        durationMinutes: 40,
        price: { amountUsd: 650 },
      },
      {
        name: 'RHA 2',
        durationMinutes: 30,
        price: { amountUsd: 700 },
      },
      {
        name: 'RHA 3',
        durationMinutes: 40,
        price: { amountUsd: 800 },
      },
    ],
  },
} as const satisfies Readonly<Record<InjectableServiceSlug, InjectableServiceEducation>>;

export const getInjectableServiceEducation = (
  slug: string,
): InjectableServiceEducation | undefined =>
  slug === 'injectables' || slug === 'dermal-fillers'
    ? INJECTABLE_SERVICE_EDUCATION[slug]
    : undefined;
