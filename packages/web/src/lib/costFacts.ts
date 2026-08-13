export interface VerifiedCostFaq {
  question: string;
  answer: string;
}

export interface VerifiedCostFact {
  display: string;
  summary: string;
  answer: string;
  menuHeading: string;
  faqHeading: string;
  verifiedAt: string;
  context?: string;
  faqs?: readonly VerifiedCostFaq[];
  items?: readonly {
    name: string;
    price: string;
    duration?: string;
  }[];
}

const VERIFIED_AT = '2026-08-06';

const VERIFIED_COST_FACTS: Readonly<Record<string, VerifiedCostFact>> = {
  'botox-cost-punta-gorda': {
    display: '$14 per unit',
    summary: 'Botox is priced at $14 per unit. The total reflects the number of units provided.',
    answer: 'Botox at House of Rose in Punta Gorda is $14 per unit. Price verified August 6, 2026.',
    menuHeading: 'Botox is priced by the unit.',
    faqHeading: 'What $14 per unit means.',
    verifiedAt: VERIFIED_AT,
    context: 'Botox and Daxxify are separate neurotoxin listings. This guide covers the current Botox price.',
    faqs: [
      {
        question: 'How much is Botox at House of Rose?',
        answer: 'Botox at House of Rose in Punta Gorda is $14 per unit. Price verified August 6, 2026.',
      },
      {
        question: 'Is $14 the total price for a Botox appointment?',
        answer: 'No. $14 is the published price per unit. The total reflects the number of Botox units provided.',
      },
      {
        question: 'Does this Botox guide include Daxxify pricing?',
        answer: 'No. Botox and Daxxify are separate current menu listings, although both are priced at $14 per unit.',
      },
    ],
    items: [
      { name: 'Botox', price: '$14 per unit', duration: '30 minutes' },
    ],
  },
  'prf-microneedling-cost-punta-gorda': {
    display: '$595',
    summary: 'Topical PRF microneedling is listed at $595.',
    answer: 'Topical PRF microneedling at House of Rose in Punta Gorda is $595. Price verified August 6, 2026.',
    menuHeading: 'Topical PRF has its own listing.',
    faqHeading: 'The topical PRF price.',
    verifiedAt: VERIFIED_AT,
    context: 'This is the topical PRF service used with microneedling. It is separate from injectable PRF.',
    items: [
      { name: 'PRF Microneedling — Consultation', price: '$595', duration: '60 minutes' },
    ],
  },
  'dermal-fillers-cost-punta-gorda': {
    display: '$650–$850',
    summary: 'Current dermal filler products range from $650 to $850, depending on the product.',
    answer: 'Dermal filler prices at House of Rose in Punta Gorda range from $650 to $850. Prices verified August 6, 2026.',
    menuHeading: 'Five products make up the range.',
    faqHeading: 'Products, range, and consultation.',
    verifiedAt: VERIFIED_AT,
    context: 'The current menu lists five Juvéderm and RHA filler products. A consultation is listed separately.',
    faqs: [
      {
        question: 'What is the published dermal filler price range?',
        answer: 'Dermal filler prices at House of Rose in Punta Gorda range from $650 to $850. Prices verified August 6, 2026.',
      },
      {
        question: 'Why do dermal filler prices range from $650 to $850?',
        answer: 'The range comes from five separate product listings: RHA 1, RHA 2, Juvéderm Ultra XC, RHA 3, and Juvéderm Voluma XC.',
      },
      {
        question: 'Is a dermal filler consultation included in that range?',
        answer: 'No. Dermal Filler Consultation is a separate 60-minute listing priced at $300.',
      },
    ],
    items: [
      { name: 'Juvéderm Ultra XC', price: '$700', duration: '30 minutes' },
      { name: 'Juvéderm Voluma XC', price: '$850', duration: '45 minutes' },
      { name: 'RHA 1', price: '$650', duration: '40 minutes' },
      { name: 'RHA 2', price: '$700', duration: '30 minutes' },
      { name: 'RHA 3', price: '$800', duration: '40 minutes' },
      { name: 'Dermal Filler Consultation', price: '$300', duration: '60 minutes' },
    ],
  },
  'forma-cost-punta-gorda': {
    display: '$600–$3,000',
    summary: 'Forma pricing ranges from $600 to $3,000 because the current menu is organized by treatment area.',
    answer: 'Forma prices at House of Rose in Punta Gorda range from $600 to $3,000. Prices verified August 6, 2026.',
    menuHeading: 'The treatment area sets the listed price.',
    faqHeading: 'How the area menu is priced.',
    verifiedAt: VERIFIED_AT,
    context: 'The published range is an area menu, not one variable price for the same appointment. Forma + Lumecca is a separate bundle listing.',
    faqs: [
      {
        question: 'What is the published Forma price range?',
        answer: 'Forma prices at House of Rose in Punta Gorda range from $600 to $3,000. Prices verified August 6, 2026.',
      },
      {
        question: 'Why do Forma prices vary by treatment area?',
        answer: 'The current menu assigns a published price to each listed area. Eyes and nasolabial folds are $600; neck and jawline are $1,500; face is $2,000; and face and neck are $3,000.',
      },
      {
        question: 'Is the Forma + Lumecca bundle part of the Forma area range?',
        answer: 'No. Forma + Lumecca is a separate bundle listing priced at $2,599.',
      },
    ],
    items: [
      { name: 'Face', price: '$2,000' },
      { name: 'Neck', price: '$1,500' },
      { name: 'Face & Neck', price: '$3,000' },
      { name: 'Eyes', price: '$600' },
      { name: 'Jawline', price: '$1,500' },
      { name: 'Nasolabial Folds', price: '$600' },
      { name: 'Forma + Lumecca Bundle', price: '$2,599' },
    ],
  },
  'ipl-photofacial-cost-punta-gorda': {
    display: '$250–$2,600',
    summary: 'Lumecca Peak IPL pricing ranges from $250 to $2,600 across the current area and series menu.',
    answer: 'Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600. Prices verified August 6, 2026.',
    menuHeading: 'Area and series determine the listing.',
    faqHeading: 'How to read the $250–$2,600 range.',
    verifiedAt: VERIFIED_AT,
    context: 'The current menu varies by treatment area and by single-session or three-session listing. The range should not be read as one appointment with a negotiable price.',
    faqs: [
      {
        question: 'What is the published price range for Lumecca Peak IPL?',
        answer: 'Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600. Prices verified August 6, 2026.',
      },
      {
        question: 'What does the Lumecca price range represent?',
        answer: 'The $250 to $2,600 range spans single-session and three-session listings for legs, full face, chest, neck, face and neck, face neck and chest, spot treatment, and hands.',
      },
      {
        question: 'Is $2,600 the price for every Lumecca appointment?',
        answer: 'No. $2,600 is the upper end of the current area and series menu, not a flat price for every appointment.',
      },
    ],
    items: [
      {
        name: 'Legs · Full Face · Chest · Neck · Face & Neck · Face, Neck & Chest · Spot · Hands',
        price: 'Single and three-session listings · $250–$2,600 overall',
      },
    ],
  },
  'biorepeel-cost-punta-gorda': {
    display: '$250',
    summary: 'Standalone BioRePeel is $250. A separate series of three is listed at $699.',
    answer: 'A standalone BioRePeel at House of Rose in Punta Gorda is $250. A separate series of three is $699. Prices verified August 6, 2026.',
    menuHeading: 'One treatment or a series of three.',
    faqHeading: 'Standalone and series pricing.',
    verifiedAt: VERIFIED_AT,
    context: 'Standalone treatment and series pricing are separate current menu listings.',
    faqs: [
      {
        question: 'How much is BioRePeel at House of Rose?',
        answer: 'A standalone BioRePeel at House of Rose in Punta Gorda is $250. A separate series of three is $699. Prices verified August 6, 2026.',
      },
      {
        question: 'What is the difference between the standalone and series prices?',
        answer: 'The $250 listing is one 45-minute BioRePeel. The separate $699 series listing shows a 50-minute appointment duration.',
      },
    ],
    items: [
      { name: 'BioRePeel Cl3 Rejuvenation', price: '$250', duration: '45 minutes' },
      { name: 'BioRePeel Cl3 — Series of 3', price: '$699', duration: '50 minutes' },
    ],
  },
  'microneedling-cost-punta-gorda': {
    display: '$300–$400',
    summary: 'The current Procell microneedling menu lists Pro at $300 and MD at $400.',
    answer: 'Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD. Prices verified August 6, 2026.',
    menuHeading: 'Pro and MD are separate menu options.',
    faqHeading: 'Pro, MD, and topical PRF.',
    verifiedAt: VERIFIED_AT,
    context: 'Topical PRF microneedling is a separate $595 listing and is not included in this two-option range.',
    faqs: [
      {
        question: 'What are the published Procell microneedling prices?',
        answer: 'Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD. Prices verified August 6, 2026.',
      },
      {
        question: 'Does the $300 to $400 range include topical PRF?',
        answer: 'No. PRF Microneedling — Consultation is a separate 60-minute listing priced at $595.',
      },
      {
        question: 'Is Procell Microchanneling a separate service?',
        answer: 'No. Procell is the device used for the current Microneedling service; Procell Microchanneling is not a separate public service.',
      },
    ],
    items: [
      { name: 'Procell Therapies — Pro', price: '$300', duration: '55 minutes' },
      { name: 'Procell Therapies — MD', price: '$400', duration: '55 minutes' },
    ],
  },
  'morpheus8-cost-punta-gorda': {
    display: 'No standalone price published',
    summary: 'A standalone Morpheus8 price is not published in the current menu. The Morpheus8 + Lumecca bundle is listed at $1,799.',
    answer: 'House of Rose does not publish a standalone Morpheus8 price in the current menu. A Morpheus8 + Lumecca bundle is listed at $1,799. Menu checked August 6, 2026.',
    menuHeading: 'Only the combination price is published.',
    faqHeading: 'What is—and is not—priced.',
    verifiedAt: VERIFIED_AT,
    context: 'A bundle price is not evidence of a standalone Morpheus8 price, so this guide keeps the distinction explicit.',
    faqs: [
      {
        question: 'Is a standalone Morpheus8 price published?',
        answer: 'No. House of Rose does not publish a standalone Morpheus8 price in the current menu. Menu checked August 6, 2026.',
      },
      {
        question: 'Does the $1,799 bundle price represent Morpheus8 alone?',
        answer: 'No. $1,799 is the published price for the Morpheus8 + Lumecca Bundle, not a standalone Morpheus8 price.',
      },
    ],
    items: [
      { name: 'Morpheus8 + Lumecca Bundle', price: '$1,799' },
    ],
  },
};

export const getVerifiedCostFact = (slug: string): VerifiedCostFact | undefined =>
  VERIFIED_COST_FACTS[slug];
