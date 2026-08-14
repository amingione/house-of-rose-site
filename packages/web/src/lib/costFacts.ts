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
    answer: 'As of August 6, 2026, Botox at House of Rose in Punta Gorda is $14 per unit.',
    menuHeading: 'Botox is priced by the unit.',
    faqHeading: 'What $14 per unit means.',
    verifiedAt: VERIFIED_AT,
    context: 'Botox and Daxxify are separate neurotoxin listings. Both are priced at $14 per product-specific unit, but a unit of one product is not equivalent to a unit of the other.',
    faqs: [
      {
        question: 'How much is Botox at House of Rose?',
        answer: 'As of August 6, 2026, Botox at House of Rose in Punta Gorda is $14 per unit.',
      },
      {
        question: 'Is $14 the total price for a Botox appointment?',
        answer: 'No. $14 is the published price per unit. The total reflects the number of Botox units provided.',
      },
      {
        question: 'Is Daxxify included in the Botox price?',
        answer: 'No. Botox and Daxxify have separate listings. Each is priced at $14 per product-specific unit, and the matching rate does not establish the same dose or total price.',
      },
    ],
    items: [
      { name: 'Botox', price: '$14 per unit', duration: '30 minutes' },
    ],
  },
  'prf-microneedling-cost-punta-gorda': {
    display: '$595',
    summary: 'Topical PRF microneedling is listed at $595.',
    answer: 'As of August 6, 2026, topical PRF microneedling at House of Rose in Punta Gorda is $595.',
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
    summary: 'Dermal filler products range from $650 to $850, depending on the product.',
    answer: 'As of August 6, 2026, dermal filler prices at House of Rose in Punta Gorda range from $650 to $850.',
    menuHeading: 'Five products make up the range.',
    faqHeading: 'Products, range, and consultation.',
    verifiedAt: VERIFIED_AT,
    context: 'Five Juvéderm and RHA filler products make up the range. A consultation has its own price.',
    faqs: [
      {
        question: 'What is the published dermal filler price range?',
        answer: 'As of August 6, 2026, dermal filler prices at House of Rose in Punta Gorda range from $650 to $850.',
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
    summary: 'Forma pricing ranges from $600 to $3,000 because each treatment area has its own listed price.',
    answer: 'As of August 6, 2026, Forma prices at House of Rose in Punta Gorda range from $600 to $3,000.',
    menuHeading: 'The treatment area sets the listed price.',
    faqHeading: 'How treatment area changes the price.',
    verifiedAt: VERIFIED_AT,
    context: 'The range spans separately priced treatment areas; it is not one variable price for the same appointment. Forma + Lumecca has its own bundle price.',
    faqs: [
      {
        question: 'What is the published Forma price range?',
        answer: 'As of August 6, 2026, Forma prices at House of Rose in Punta Gorda range from $600 to $3,000.',
      },
      {
        question: 'Why do Forma prices vary by treatment area?',
        answer: 'Each listed area has its own price. Eyes and nasolabial folds are $600; neck and jawline are $1,500; face is $2,000; and face and neck are $3,000.',
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
    summary: 'Lumecca Peak IPL pricing ranges from $250 to $2,600 across treatment areas and single- or three-session options.',
    answer: 'As of August 6, 2026, Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600.',
    menuHeading: 'Area and series determine the listing.',
    faqHeading: 'How to read the $250–$2,600 range.',
    verifiedAt: VERIFIED_AT,
    context: 'Treatment area and single- or three-session selection account for the range. It is not one appointment with a negotiable price.',
    faqs: [
      {
        question: 'What is the published price range for Lumecca Peak IPL?',
        answer: 'As of August 6, 2026, Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600.',
      },
      {
        question: 'What does the Lumecca price range represent?',
        answer: 'The $250 to $2,600 range spans single-session and three-session listings for legs, full face, chest, neck, face and neck, face neck and chest, spot treatment, and hands.',
      },
      {
        question: 'Is $2,600 the price for every Lumecca appointment?',
        answer: 'No. $2,600 is the upper end of the area and series listings, not a flat price for every appointment.',
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
    answer: 'As of August 6, 2026, a standalone BioRePeel at House of Rose in Punta Gorda is $250. A series of three is $699.',
    menuHeading: 'One treatment or a series of three.',
    faqHeading: 'Standalone and series pricing.',
    verifiedAt: VERIFIED_AT,
    context: 'One appointment and the series of three are priced separately.',
    faqs: [
      {
        question: 'How much is BioRePeel at House of Rose?',
        answer: 'As of August 6, 2026, a standalone BioRePeel at House of Rose in Punta Gorda is $250. A series of three is $699.',
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
    summary: 'Procell Pro is $300, and Procell MD is $400.',
    answer: 'As of August 6, 2026, Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD.',
    menuHeading: 'Pro and MD have their own prices.',
    faqHeading: 'Pro, MD, and topical PRF.',
    verifiedAt: VERIFIED_AT,
    context: 'Topical PRF microneedling is a separate $595 listing and is not included in this two-option range.',
    faqs: [
      {
        question: 'What are the published Procell microneedling prices?',
        answer: 'As of August 6, 2026, Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD.',
      },
      {
        question: 'Does the $300 to $400 range include topical PRF?',
        answer: 'No. PRF Microneedling — Consultation is a separate 60-minute listing priced at $595.',
      },
      {
        question: 'Is Procell Microchanneling a separate service?',
        answer: 'No. Procell is the device used for the Microneedling service; Procell Microchanneling is not a separate public service.',
      },
    ],
    items: [
      { name: 'Procell Therapies — Pro', price: '$300', duration: '55 minutes' },
      { name: 'Procell Therapies — MD', price: '$400', duration: '55 minutes' },
    ],
  },
  'morpheus8-cost-punta-gorda': {
    display: 'Single treatments from $500',
    summary: 'Morpheus8 Burst single treatments range from $500 to $1,250 by area. Three-treatment prices range from $1,300 to $3,500 for the five listed Burst areas.',
    answer: 'As of August 14, 2026, House of Rose lists Morpheus8 Burst single treatments from $500 to $1,250 and three-treatment prices from $1,300 to $3,500, depending on the area.',
    menuHeading: 'Single and three-treatment prices by area.',
    faqHeading: 'Areas, single treatments, and series pricing.',
    verifiedAt: '2026-08-14',
    context: 'The separate $1,799 Morpheus8 + Lumecca price covers two total treatments and is not a standalone Morpheus8 price.',
    faqs: [
      {
        question: 'What does one Morpheus8 Burst treatment cost?',
        answer: 'Single-treatment prices are $1,200 for Full Face, $1,250 for Face & Neck, $500 for Scars, $500 for Chest, and $700 for Stretch Marks.',
      },
      {
        question: 'What do three Morpheus8 Burst treatments cost?',
        answer: 'Three-treatment prices are $3,000 for Full Face, $3,500 for Face & Neck, $1,300 for Scars, $1,300 for Chest, and $1,700 for Stretch Marks.',
      },
      {
        question: 'Does the $1,799 price represent Morpheus8 alone?',
        answer: 'No. $1,799 is the published Morpheus8 + Lumecca bundle price for two total treatments.',
      },
    ],
    items: [
      ...MORPHEUS8_PRICING.burst.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
      })),
      {
        name: MORPHEUS8_PRICING.bundle.name,
        price: `${formatMorpheus8Price(MORPHEUS8_PRICING.bundle.priceUsd)} · ${MORPHEUS8_PRICING.bundle.treatmentCount} total treatments`,
      },
    ],
  },
};

export const getVerifiedCostFact = (slug: string): VerifiedCostFact | undefined =>
  VERIFIED_COST_FACTS[slug];
import {
  formatMorpheus8Price,
  MORPHEUS8_PRICING,
} from '@/lib/morpheus8Pricing';
