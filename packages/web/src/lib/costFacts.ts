import { DEVICE_SERVICE_EDUCATION } from '@/lib/deviceServiceEducation';
import { MORPHEUS8_PRICING } from '@/lib/morpheus8Pricing';

export interface VerifiedCostFaq {
  question: string;
  answer: string;
}

export interface VerifiedCostFact {
  /**
   * Optional short structural label (e.g. "Priced per unit"). Never a dollar
   * amount — House of Rose pricing is never published on the public website.
   * When omitted, the /cost/ index falls back to a generic "contact for
   * current pricing" line, which is the safe default.
   */
  display?: string;
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
    duration?: string;
  }[];
}

const VERIFIED_AT = '2026-08-06';

// Binding as of 2026-08-20: House of Rose pricing is never published on the
// public website — no service page, cost guide, comparison, FAQ, meta
// description, JSON-LD, or AI feed may render a dollar amount. Every entry
// below explains what determines the price (per unit, per area, single vs.
// series, standalone vs. provider-arranged) without stating the amount, and
// every CTA points to booking or a consultation for current pricing. See
// CLAUDE.md "Public website pricing is NEVER permitted."
const VERIFIED_COST_FACTS: Readonly<Record<string, VerifiedCostFact>> = {
  'botox-cost-punta-gorda': {
    metaDescription: 'Botox and Daxxify at House of Rose in Punta Gorda are priced per product-specific unit, not as a flat appointment fee. Ask about current pricing when you book.',
    summary: 'Botox and Daxxify are priced per unit. Ask about current pricing when you book.',
    answer: 'Botox and Daxxify at House of Rose in Punta Gorda are priced per product-specific unit. Contact House of Rose for current pricing.',
    menuHeading: 'Botox, Daxxify, and the consultation.',
    faqHeading: 'What the per-unit structure means.',
    verifiedAt: VERIFIED_AT,
    context: 'A 20-minute Neuromodulator Consultation is a separate appointment. Botox and Daxxify are both priced per product-specific unit, but their units cannot be compared or converted.',
    faqs: [
      {
        question: 'How much is Botox at House of Rose?',
        answer: 'Botox is priced per unit, and the appointment total depends on how many units are used. Contact House of Rose for current pricing.',
      },
      {
        question: 'Is the per-unit rate the total price for a Botox appointment?',
        answer: 'No. The per-unit rate is not a flat appointment total. The total reflects the number of Botox units provided.',
      },
      {
        question: 'How much is a neuromodulator consultation?',
        answer: 'The 20-minute Neuromodulator Consultation is its own separately priced appointment. Botox or Daxxify treatment is priced separately by the number of product-specific units provided.',
      },
      {
        question: 'Is Daxxify priced the same as Botox?',
        answer: 'Botox and Daxxify are different products, each priced per product-specific unit. A matching per-unit rate does not establish the same dose or total price.',
      },
    ],
    items: [
      { name: 'Neuromodulator Consultation', duration: '20 minutes' },
      { name: 'Botox', duration: '30 minutes' },
      { name: 'Daxxify', duration: '60 minutes' },
    ],
  },
  'prf-microneedling-cost-punta-gorda': {
    metaDescription: 'Topical PRF Microneedling at House of Rose has its own 60-minute listing, separate from injectable PRF in Punta Gorda. Ask about current pricing.',
    summary: 'Topical PRF microneedling has its own appointment listing. Ask about current pricing when you book.',
    answer: 'Topical PRF microneedling at House of Rose in Punta Gorda is its own 60-minute appointment listing. Contact House of Rose for current pricing.',
    menuHeading: 'Topical PRF has its own listing.',
    faqHeading: 'The topical PRF appointment.',
    verifiedAt: VERIFIED_AT,
    context: 'This is the topical PRF service used with microneedling. It is separate from injectable PRF.',
    items: [
      { name: 'PRF Microneedling — Consultation', duration: '60 minutes' },
    ],
  },
  'dermal-fillers-cost-punta-gorda': {
    metaDescription: 'Dermal fillers at House of Rose in Punta Gorda are five hyaluronic-acid products, each with its own price. Ask about current pricing when you book.',
    summary: 'Five dermal filler products make up the menu, each with its own price. Ask about current pricing when you book.',
    answer: 'Dermal filler prices at House of Rose in Punta Gorda vary by product across five options. Contact House of Rose for current pricing.',
    menuHeading: 'Five products make up the menu.',
    faqHeading: 'Products and consultation.',
    verifiedAt: VERIFIED_AT,
    context: 'Five Juvéderm and RHA filler products make up the menu. A consultation has its own separate listing.',
    faqs: [
      {
        question: 'What determines the dermal filler price?',
        answer: 'The product you choose. Five separate listings — RHA 1, RHA 2, Juvéderm Ultra XC, RHA 3, and Juvéderm Voluma XC — each carry their own price. Contact House of Rose for current pricing.',
      },
      {
        question: 'Why do dermal filler prices vary?',
        answer: 'The variation comes from five separate product listings: RHA 1, RHA 2, Juvéderm Ultra XC, RHA 3, and Juvéderm Voluma XC.',
      },
      {
        question: 'Is a dermal filler consultation included in a product price?',
        answer: 'No. Dermal Filler Consultation is a separate 60-minute listing.',
      },
    ],
    items: [
      { name: 'Juvéderm Ultra XC', duration: '30 minutes' },
      { name: 'Juvéderm Voluma XC', duration: '45 minutes' },
      { name: 'RHA 1', duration: '40 minutes' },
      { name: 'RHA 2', duration: '30 minutes' },
      { name: 'RHA 3', duration: '40 minutes' },
      { name: 'Dermal Filler Consultation', duration: '60 minutes' },
    ],
  },
  'forma-cost-punta-gorda': {
    metaDescription: 'Forma at House of Rose in Punta Gorda prices by treatment area across six facial and five Forma Plus areas. Ask about current pricing when you book.',
    summary: 'Forma prices by treatment area, and so does Forma Plus. Ask about current pricing when you book.',
    answer: 'Forma at House of Rose in Punta Gorda prices by treatment area, across eleven Forma and Forma Plus areas. Contact House of Rose for current pricing.',
    menuHeading: 'Forma and Forma Plus areas.',
    faqHeading: 'Face, body, and bundle structure.',
    verifiedAt: VERIFIED_AT,
    context: 'Forma covers six facial areas. Forma Plus covers five body areas. The Forma + Lumecca Bundle is its own separate listing.',
    faqs: [
      {
        question: 'What determines the Forma price?',
        answer: 'The treatment area. Forma prices by six facial areas; Forma Plus prices by five body areas. Contact House of Rose for current pricing.',
      },
      {
        question: 'Which body areas does Forma Plus cover?',
        answer: 'Forma Plus covers the abdomen, arms, inner-outer thighs, lower back, and knees, each with its own price.',
      },
      {
        question: 'Is the Forma + Lumecca bundle part of the Forma area menu?',
        answer: 'No. Forma + Lumecca is a separate bundle listing.',
      },
    ],
    items: [
      ...DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.areaPrices.map((item) => ({
        name: `Forma — ${item.name}`,
      })),
      ...DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.formaPlusAreaPrices.map((item) => ({
        name: `Forma Plus — ${item.name}`,
      })),
      {
        name: DEVICE_SERVICE_EDUCATION['forma-rf-facial'].menu.bundle.name,
      },
    ],
  },
  'ipl-photofacial-cost-punta-gorda': {
    metaDescription: 'Lumecca Peak IPL at House of Rose prices by treatment area and single- or three-session choice across eight areas. Ask about current pricing when you book.',
    summary: 'Lumecca Peak IPL prices by treatment area and session count. Ask about current pricing when you book.',
    answer: 'Lumecca prices at House of Rose in Punta Gorda vary by treatment area and single- or three-session selection. Contact House of Rose for current pricing.',
    menuHeading: 'Eight areas, each with one-session and three-session pricing.',
    faqHeading: 'Why pricing varies by area and session count.',
    verifiedAt: VERIFIED_AT,
    context: 'Each of the eight areas has its own single-session and three-session price. The Lumecca Peak IPL Consultation is a separate appointment.',
    faqs: [
      {
        question: 'What determines the Lumecca Peak IPL price?',
        answer: 'The treatment area and whether you choose a single session or a series of three. Contact House of Rose for current pricing.',
      },
      {
        question: 'What does the Lumecca area list represent?',
        answer: 'Each of the eight areas has a one-session and a three-session price: legs, full face, chest, neck, face and neck, face neck and chest, spot treatment, and hands.',
      },
      {
        question: 'Is one Lumecca price the same for every appointment?',
        answer: 'No. Single-session and three-session prices vary by treatment area. Contact House of Rose for current pricing on a specific area.',
      },
    ],
    items: [
      {
        name: DEVICE_SERVICE_EDUCATION['lumecca-peak-ipl'].menu.consultation.name,
      },
      ...DEVICE_SERVICE_EDUCATION['lumecca-peak-ipl'].menu.singleAndSeriesPrices.map((item) => ({
        name: `${item.name} — single session or series of 3`,
      })),
    ],
  },
  'biorepeel-cost-punta-gorda': {
    metaDescription: 'BioRePeel at House of Rose spans five face, body, and acne-scarring appointments in Punta Gorda, each priced separately. Ask about current pricing.',
    summary: 'Five BioRePeel appointments make up the menu, each priced separately. Ask about current pricing when you book.',
    answer: 'Five BioRePeel appointments at House of Rose in Punta Gorda are priced separately by appointment. Contact House of Rose for current pricing.',
    menuHeading: 'Five BioRePeel appointments.',
    faqHeading: 'Booking paths for all five options.',
    verifiedAt: VERIFIED_AT,
    context: 'The standalone face treatment and Series of 3 can be booked directly. Gold Body, Advanced Acne Scarring, and the Duo Gold Spot Upgrade are arranged with House of Rose.',
    faqs: [
      {
        question: 'How much is BioRePeel at House of Rose?',
        answer: 'BioRePeel pricing depends on the appointment: standalone face treatment, Series of 3, Gold Body, Advanced Acne Scarring, or the Duo Gold Spot Upgrade. Contact House of Rose for current pricing.',
      },
      {
        question: 'Which BioRePeel appointments can I book directly?',
        answer: 'The standalone face treatment and Series of 3 can be booked directly. Call House of Rose to discuss Gold Body, Advanced Acne Scarring, or the Duo Gold Spot Upgrade.',
      },
      {
        question: 'What do the BioRePeel appointment times represent?',
        answer: 'The standalone face treatment is 45 minutes and the Series of 3 has a 50-minute appointment listing. Gold Body is 45 minutes, Advanced Acne Scarring is 75 minutes, and the Duo Gold Spot Upgrade is 60 minutes.',
      },
    ],
    items: [
      { name: 'BioRePeel Cl3 Rejuvenation', duration: '45 minutes' },
      { name: 'BioRePeel Cl3 Rejuvenation — Series of 3', duration: '50 minutes' },
      { name: 'BioRePeel Gold — Body', duration: '45 minutes' },
      { name: 'BioRePeel Advanced — Acne Scarring', duration: '75 minutes' },
      { name: 'BioRePeel Duo — Gold Spot Upgrade', duration: '60 minutes' },
    ],
  },
  'microneedling-cost-punta-gorda': {
    metaDescription: 'Procell Microneedling at House of Rose offers Pro and MD tiers plus a separate consultation in Punta Gorda. Ask about current pricing when you book.',
    summary: 'Procell Pro and Procell MD are priced separately. Ask about current pricing when you book.',
    answer: 'Procell microneedling at House of Rose in Punta Gorda is priced separately by Pro and MD tier. Contact House of Rose for current pricing.',
    menuHeading: 'Four Microneedling appointments.',
    faqHeading: 'Pro, MD, consultation, and topical PRF.',
    verifiedAt: VERIFIED_AT,
    context: 'Pro and MD can be booked directly. The Procell consultation and the topical PRF option are separate 60-minute consultation listings.',
    faqs: [
      {
        question: 'What are the Procell microneedling appointment options?',
        answer: 'Procell microneedling at House of Rose is offered as Pro or MD, each priced separately. Contact House of Rose for current pricing.',
      },
      {
        question: 'How much is a Procell Microneedling consultation?',
        answer: 'The 60-minute Procell Therapies Consultation is its own separately priced appointment. Pro and MD can also be booked directly.',
      },
      {
        question: 'Does the Pro or MD price include topical PRF?',
        answer: 'No. PRF Microneedling — Consultation is a separate 60-minute listing.',
      },
      {
        question: 'Is Procell Microchanneling a separate service?',
        answer: 'No. Procell is the device used for the Microneedling service; Procell Microchanneling is not a separate public service.',
      },
    ],
    items: [
      { name: 'Procell Therapies — Consultation', duration: '60 minutes' },
      { name: 'Procell Therapies — Pro', duration: '55 minutes' },
      { name: 'Procell Therapies — MD', duration: '55 minutes' },
      { name: 'PRF Microneedling — Consultation', duration: '60 minutes' },
    ],
  },
  'morpheus8-cost-punta-gorda': {
    metaDescription: 'Morpheus8 at House of Rose prices by applicator, area, and single vs. series selection, with Burst, Resurfacing, and Prime. Ask about current pricing.',
    summary: 'Morpheus8 pricing depends on the applicator, treatment area, and treatment count. Ask about current pricing when you book.',
    answer: 'Morpheus8 at House of Rose in Punta Gorda prices by applicator, treatment area, and whether the appointment is a single treatment or a series of three. Contact House of Rose for current pricing.',
    menuHeading: 'Morpheus8 by applicator and area.',
    faqHeading: 'Burst, Resurfacing, Prime, and Burst Deep structure.',
    verifiedAt: '2026-08-14',
    context: 'Burst, Resurfacing, and Prime have area-specific single and series-of-three pricing. Hyperhidrosis and Burst Deep are three-treatment packages. The Morpheus8 + Lumecca bundle covers two total treatments and has its own separate listing.',
    faqs: [
      {
        question: 'What determines the Morpheus8 price?',
        answer: 'The applicator (Burst, Resurfacing, or Prime), the treatment area, and whether the appointment is a single treatment or a series of three. Contact House of Rose for current pricing.',
      },
      {
        question: 'Which Morpheus8 appointments are packages of three?',
        answer: 'Hyperhidrosis is a package of three. Burst Deep body packages are also priced as a series of three, by area size.',
      },
      {
        question: 'Does the Morpheus8 + Lumecca bundle represent Morpheus8 alone?',
        answer: 'No. The bundle is a separate listing covering two total treatments.',
      },
    ],
    items: [
      ...MORPHEUS8_PRICING.burst.map((item) => ({
        name: `${item.name} — single or series of 3`,
      })),
      ...MORPHEUS8_PRICING.burstPackageRanges.map((item) => ({
        name: `${item.name} — package of ${item.treatmentCount}`,
      })),
      ...MORPHEUS8_PRICING.resurfacing.map((item) => ({
        name: `${item.name} — single or series of 3`,
      })),
      ...MORPHEUS8_PRICING.prime.map((item) => ({
        name: `${item.name} — single or series of 3`,
      })),
      ...MORPHEUS8_PRICING.burstDeep.map((item) => ({
        name: `${item.name} — ${item.note}`,
      })),
      {
        name: `${MORPHEUS8_PRICING.bundle.name} — ${MORPHEUS8_PRICING.bundle.treatmentCount} total treatments`,
      },
    ],
  },
};

export const getVerifiedCostFact = (slug: string): VerifiedCostFact | undefined =>
  VERIFIED_COST_FACTS[slug];
