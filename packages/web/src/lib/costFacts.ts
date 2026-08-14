import { DEVICE_SERVICE_EDUCATION } from '@/lib/deviceServiceEducation';
import {
  formatMorpheus8Price,
  MORPHEUS8_PRICING,
} from '@/lib/morpheus8Pricing';

export interface VerifiedCostFaq {
  question: string;
  answer: string;
}

export interface VerifiedCostFact {
  display: string;
  metaDescription: string;
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
    metaDescription: 'Botox at House of Rose is $14 per product-specific unit. Learn why the total varies and how Daxxify units differ in Punta Gorda.',
    summary: 'Botox is priced at $14 per unit. The total reflects the number of units provided.',
    answer: 'As of August 6, 2026, Botox at House of Rose in Punta Gorda is $14 per unit.',
    menuHeading: 'Botox is priced by the unit.',
    faqHeading: 'What $14 per unit means.',
    verifiedAt: VERIFIED_AT,
    context: 'Botox and Daxxify are different neurotoxin products. Both are priced at $14 per product-specific unit, but a unit of one product is not equivalent to a unit of the other.',
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
        answer: 'No. Botox and Daxxify are different products. Each is priced at $14 per product-specific unit, and the matching rate does not establish the same dose or total price.',
      },
    ],
    items: [
      { name: 'Botox', price: '$14 per unit', duration: '30 minutes' },
    ],
  },
  'prf-microneedling-cost-punta-gorda': {
    display: '$595',
    metaDescription: 'Topical PRF Microneedling at House of Rose is $595 for 60 minutes. See why it is separate from injectable PRF appointments in Punta Gorda.',
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
    metaDescription: 'Dermal fillers at House of Rose in Punta Gorda range from $650 to $850 across five products. The separate 60-minute Dermal Filler Consultation is $300.',
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
    metaDescription: 'Forma at House of Rose ranges from $600 to $3,000 across six facial and five Forma Plus body areas, plus a $2,599 Lumecca bundle.',
    summary: 'Forma has six facial-area prices from $600 to $3,000. Forma Plus has five body-area prices from $1,500 to $2,000.',
    answer: 'As of August 6, 2026, Forma and Forma Plus prices at House of Rose in Punta Gorda range from $600 to $3,000 across eleven treatment areas.',
    menuHeading: 'Forma and Forma Plus pricing by area.',
    faqHeading: 'Face, body, and bundle prices.',
    verifiedAt: VERIFIED_AT,
    context: 'Forma covers six facial areas. Forma Plus covers five body areas. The Forma + Lumecca Bundle has its own $2,599 price.',
    faqs: [
      {
        question: 'What is the published Forma price range?',
        answer: 'As of August 6, 2026, Forma facial-area prices range from $600 to $3,000. Forma Plus body-area prices range from $1,500 to $2,000.',
      },
      {
        question: 'Which body areas have Forma Plus prices?',
        answer: 'Forma Plus is $2,000 for the abdomen, arms, or inner-outer thighs; $1,750 for the lower back; and $1,500 for the knees.',
      },
      {
        question: 'Is the Forma + Lumecca bundle part of the Forma area range?',
        answer: 'No. Forma + Lumecca is a separate bundle listing priced at $2,599.',
      },
    ],
    items: [
      ...DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.areaPrices.map((item) => ({
        name: `Forma — ${item.name}`,
        price: formatMorpheus8Price(item.priceUsd),
      })),
      ...DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.formaPlusAreaPrices.map((item) => ({
        name: `Forma Plus — ${item.name}`,
        price: formatMorpheus8Price(item.priceUsd),
      })),
      {
        name: DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.bundle.name,
        price: formatMorpheus8Price(DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.bundle.priceUsd),
      },
    ],
  },
  'ipl-photofacial-cost-punta-gorda': {
    display: '$250–$2,600',
    metaDescription: 'Lumecca Peak IPL at House of Rose in Punta Gorda ranges from $250 to $2,600 by treatment area and single- or three-session selection across eight areas.',
    summary: 'Lumecca Peak IPL pricing ranges from $250 to $2,600 across treatment areas and single- or three-session options.',
    answer: 'As of August 6, 2026, Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600.',
    menuHeading: 'Eight areas, each with one-session and three-session prices.',
    faqHeading: 'Why the range runs from $250 to $2,600.',
    verifiedAt: VERIFIED_AT,
    context: 'Spot Treatment is $250 for one session. Face, Neck & Chest is $2,600 for three. The $50 Lumecca Peak IPL Consultation is a separate appointment.',
    faqs: [
      {
        question: 'What is the published price range for Lumecca Peak IPL?',
        answer: 'As of August 6, 2026, Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600.',
      },
      {
        question: 'What does the Lumecca price range represent?',
        answer: 'Each of the eight areas has a one-session and a three-session price: legs, full face, chest, neck, face and neck, face neck and chest, spot treatment, and hands.',
      },
      {
        question: 'Is $2,600 the price for every Lumecca appointment?',
        answer: '$2,600 is the three-session Face, Neck & Chest price. Single-session prices range from $250 to $950; the other three-session prices range from $800 to $2,400.',
      },
    ],
    items: [
      {
        name: DEVICE_SERVICE_EDUCATION['lumecca-peak-ipl'].menu.consultation.name,
        price: formatMorpheus8Price(DEVICE_SERVICE_EDUCATION['lumecca-peak-ipl'].menu.consultation.priceUsd),
      },
      ...DEVICE_SERVICE_EDUCATION['lumecca-peak-ipl'].menu.singleAndSeriesPrices.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
      })),
    ],
  },
  'biorepeel-cost-punta-gorda': {
    display: '$250–$699',
    metaDescription: 'BioRePeel at House of Rose ranges from $250 to $699 across five face, body, acne-scarring, and gold spot appointments in Punta Gorda.',
    summary: 'Five BioRePeel appointments range from $250 to $699, with different prices for the face, body, acne-scarring, and gold spot options.',
    answer: 'As of August 6, 2026, five BioRePeel appointments at House of Rose in Punta Gorda range from $250 to $699.',
    menuHeading: 'Five BioRePeel appointments.',
    faqHeading: 'Prices and booking paths for all five options.',
    verifiedAt: VERIFIED_AT,
    context: 'The standalone face treatment and Series of 3 can be booked directly. Gold Body, Advanced Acne Scarring, and the Duo Gold Spot Upgrade are arranged with House of Rose.',
    faqs: [
      {
        question: 'How much is BioRePeel at House of Rose?',
        answer: 'As of August 6, 2026, the standalone face treatment is $250, the Series of 3 is $699, Gold Body is $325, Advanced Acne Scarring is $450, and the Duo Gold Spot Upgrade is $395.',
      },
      {
        question: 'Which BioRePeel appointments can I book directly?',
        answer: 'The $250 standalone face treatment and $699 Series of 3 can be booked directly. Call House of Rose to discuss Gold Body, Advanced Acne Scarring, or the Duo Gold Spot Upgrade.',
      },
      {
        question: 'What do the BioRePeel appointment times represent?',
        answer: 'The standalone face treatment is 45 minutes and the Series of 3 has a 50-minute appointment listing. Gold Body is 45 minutes, Advanced Acne Scarring is 75 minutes, and the Duo Gold Spot Upgrade is 60 minutes.',
      },
    ],
    items: [
      { name: 'BioRePeel Cl3 Rejuvenation', price: '$250', duration: '45 minutes' },
      { name: 'BioRePeel Cl3 Rejuvenation — Series of 3', price: '$699', duration: '50 minutes' },
      { name: 'BioRePeel Gold — Body', price: '$325', duration: '45 minutes' },
      { name: 'BioRePeel Advanced — Acne Scarring', price: '$450', duration: '75 minutes' },
      { name: 'BioRePeel Duo — Gold Spot Upgrade', price: '$395', duration: '60 minutes' },
    ],
  },
  'microneedling-cost-punta-gorda': {
    display: '$300–$400',
    metaDescription: 'Procell Microneedling at House of Rose is $300 for Pro and $400 for MD. A $50 consultation and separate $595 topical PRF appointment are listed in Punta Gorda.',
    summary: 'Procell Pro is $300, and Procell MD is $400.',
    answer: 'As of August 6, 2026, Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD.',
    menuHeading: 'Four Microneedling appointments and prices.',
    faqHeading: 'Pro, MD, consultation, and topical PRF.',
    verifiedAt: VERIFIED_AT,
    context: 'Pro and MD can be booked directly. The $50 Procell consultation and $595 topical PRF option are separate 60-minute consultation listings.',
    faqs: [
      {
        question: 'What are the published Procell microneedling prices?',
        answer: 'As of August 6, 2026, Procell microneedling at House of Rose in Punta Gorda is $300 for Pro and $400 for MD.',
      },
      {
        question: 'How much is a Procell Microneedling consultation?',
        answer: 'The 60-minute Procell Therapies Consultation is $50. Pro and MD can also be booked directly.',
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
      { name: 'Procell Therapies — Consultation', price: '$50', duration: '60 minutes' },
      { name: 'Procell Therapies — Pro', price: '$300', duration: '55 minutes' },
      { name: 'Procell Therapies — MD', price: '$400', duration: '55 minutes' },
      { name: 'PRF Microneedling — Consultation', price: '$595', duration: '60 minutes' },
    ],
  },
  'morpheus8-cost-punta-gorda': {
    display: '$450–$4,500',
    metaDescription: 'Morpheus8 at House of Rose in Punta Gorda runs from $450 single treatments to $4,500 body packages, with Burst, Resurfacing, Prime and bundle prices.',
    summary: 'Morpheus8 prices depend on the applicator, treatment area, and whether the listing is one treatment or a series of three. Published prices run from $450 to $4,500.',
    answer: 'As of August 14, 2026, House of Rose lists Morpheus8 single treatments from $450 to $1,250. Three-treatment prices and packages run from $1,200 to $4,500, depending on the applicator and area.',
    menuHeading: 'Every published Morpheus8 price, separated by applicator and area.',
    faqHeading: 'Burst, Resurfacing, Prime, and Burst Deep pricing.',
    verifiedAt: '2026-08-14',
    context: 'Burst, Resurfacing, and Prime have area-specific single and series-of-three prices. Hyperhidrosis and Burst Deep are three-treatment packages. The $1,799 Morpheus8 + Lumecca bundle covers two total treatments.',
    faqs: [
      {
        question: 'What is the lowest published Morpheus8 single-treatment price?',
        answer: 'Morpheus8 Prime Around the Eyes and Around the Mouth are each $450 for one treatment. Other published single-treatment prices range from $500 to $1,250 by applicator and area.',
      },
      {
        question: 'Which Morpheus8 prices are packages of three?',
        answer: 'Hyperhidrosis is $2,200–$2,400 for a package of three. Burst Deep body packages are $3,500 for a 4 × 10-inch area and $4,500 for an 8 × 11-inch area.',
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
      ...MORPHEUS8_PRICING.burstPackageRanges.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.minimumPriceUsd)}–${formatMorpheus8Price(item.maximumPriceUsd)} · package of ${item.treatmentCount}`,
      })),
      ...MORPHEUS8_PRICING.resurfacing.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
      })),
      ...MORPHEUS8_PRICING.prime.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
      })),
      ...MORPHEUS8_PRICING.burstDeep.map((item) => ({
        name: item.name,
        price: `${formatMorpheus8Price(item.seriesOfThreePriceUsd)} · ${item.note}`,
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
