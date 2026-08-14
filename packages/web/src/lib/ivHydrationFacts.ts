/**
 * Public IV menu facts verified against the canonical 2026-08-06
 * GlossGenius-backed menu in ALL-SERVICES-PRICING.MD.
 *
 * Formulations and add-ons are intentionally absent: the canonical menu does
 * not verify their ingredients or current bookability.
 */
export interface VerifiedIvMenuItem {
  name: string;
  durationMinutes: number;
  price: number;
}

export const VERIFIED_IV_MENU_DATE = '2026-08-06';

export const VERIFIED_IV_MENU = [
  { name: 'Hydration IV', durationMinutes: 30, price: 99 },
  { name: 'Immunity IV', durationMinutes: 45, price: 160 },
  { name: 'Recovery IV', durationMinutes: 45, price: 175 },
  { name: 'Beauty Glow IV', durationMinutes: 45, price: 170 },
  { name: 'Reboot (Hangover Recovery) IV', durationMinutes: 45, price: 165 },
  { name: "Myers' Cocktail IV", durationMinutes: 45, price: 185 },
] as const satisfies readonly VerifiedIvMenuItem[];

const hydrationIv = VERIFIED_IV_MENU[0];
const fortyFiveMinuteIvs = VERIFIED_IV_MENU.slice(1);
const fortyFiveMinutePrices = fortyFiveMinuteIvs.map(({ price }) => price);

export const IV_HYDRATION_EDUCATION = {
  heading: `Six IV options from $${Math.min(...VERIFIED_IV_MENU.map(({ price }) => price))}, with 30- or 45-minute appointments.`,
  introduction:
    `House of Rose offers one 30-minute base IV and ${fortyFiveMinuteIvs.length} 45-minute base IVs. Published prices run from $${Math.min(...VERIFIED_IV_MENU.map(({ price }) => price))} to $${Math.max(...VERIFIED_IV_MENU.map(({ price }) => price))}.`,
  provider:
    'Diana Morrison, RN provides IV hydration under written physician protocol and medical direction.',
  shorterOption:
    `${hydrationIv.name} is the 30-minute option at $${hydrationIv.price}.`,
  longerOptions:
    `The other ${fortyFiveMinuteIvs.length} base options are 45-minute appointments priced from $${Math.min(...fortyFiveMinutePrices)} to $${Math.max(...fortyFiveMinutePrices)}.`,
  formulation:
    'Call House of Rose to confirm current formulations and available add-ons. The appointment names do not provide a complete ingredient list.',
} as const;

export const IV_HYDRATION_CATEGORY_OVERVIEW = {
  heading: 'At House of Rose, an IV drip is IV Hydration Therapy.',
  lead: `IV stands for intravenous: fluid is administered through a vein. House of Rose offers ${VERIFIED_IV_MENU.length} named base options.`,
  detail: `Use the table to compare each appointment by name, time, and price. ${IV_HYDRATION_EDUCATION.formulation}`,
} as const;

export const IV_HYDRATION_FAQS = [
  {
    question: 'Which IV hydration options does House of Rose offer?',
    answer:
      "The House of Rose menu lists Hydration IV, Immunity IV, Recovery IV, Beauty Glow IV, Reboot (Hangover Recovery) IV, and Myers' Cocktail IV.",
  },
  {
    question: 'Do I need to choose an IV option before I call?',
    answer:
      'No. Use the table to compare the six appointment names, times, and prices. Call House of Rose if you want to ask about the current formulation or available add-ons before choosing an option.',
  },
  {
    question: 'Which IV option is 30 minutes?',
    answer: `${IV_HYDRATION_EDUCATION.shorterOption} ${IV_HYDRATION_EDUCATION.longerOptions}`,
  },
  {
    question: 'How do I confirm the ingredients or available add-ons?',
    answer: IV_HYDRATION_EDUCATION.formulation,
  },
  {
    question: 'Who provides IV hydration at House of Rose?',
    answer:
      'IV hydration is provided by Diana Morrison, RN under written physician protocol and medical direction. Medical Director: Joshua Shaw, MD · FL Lic. ME136232.',
  },
] as const;
