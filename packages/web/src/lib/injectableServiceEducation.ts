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

export interface InjectableServiceEducation {
  readonly slug: InjectableServiceSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly pricingSummary: string;
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
    whatItIs: 'Botox and Daxxify are the two neurotoxin products on the current House of Rose menu. Both are listed for expression lines formed by facial movement.',
    whereItFits: 'That includes lines that appear or deepen when you frown, raise your brows, or squint.',
    pricingSummary: 'Botox and Daxxify are each $14 per unit.',
    provider: {
      publicName: 'Diana Morrison, RN',
      profilePath: '/about/providers/diana/',
      statement: 'Diana Morrison, RN provides the current injectable services under medical direction.',
    },
    faqs: [
      {
        question: 'Are Botox and Daxxify units interchangeable?',
        answer: 'No. The units are specific to each product and cannot be compared or converted between Botox and Daxxify.',
      },
      {
        question: 'Which page should I use for a line caused by facial movement?',
        answer: 'Start with Neurotoxin Injections when the line appears or deepens with expression. The Dermal Fillers page covers lost volume in selected lip, cheek, and fold areas.',
      },
    ],
    links: [
      {
        href: '/compare/daxxify-vs-botox/',
        label: 'Compare Daxxify and Botox',
      },
      {
        href: '/services/dermal-fillers/',
        label: 'Review Dermal Fillers',
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
    whatItIs: 'The current House of Rose menu contains five hyaluronic-acid dermal fillers from Juvéderm and RHA.',
    whereItFits: 'They are listed for lost facial volume in selected lip, cheek, and fold areas.',
    pricingSummary: 'Current dermal filler products range from $650 to $850.',
    provider: {
      publicName: 'Diana Morrison, RN',
      profilePath: '/about/providers/diana/',
      statement: 'Diana Morrison, RN provides the current injectable services under medical direction.',
    },
    faqs: [
      {
        question: 'Are the current dermal fillers made with hyaluronic acid?',
        answer: 'Yes. All five current House of Rose filler listings are hyaluronic-acid gels from the Juvéderm and RHA product families.',
      },
      {
        question: 'How are dermal fillers different from Botox or Daxxify?',
        answer: 'House of Rose lists dermal fillers for lost volume in selected lip, cheek, and fold areas. Botox and Daxxify are listed for lines formed by facial movement.',
      },
    ],
    links: [
      {
        href: '/services/injectables/',
        label: 'Review Neurotoxin Injections',
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
