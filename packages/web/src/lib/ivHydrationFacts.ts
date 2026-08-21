/**
 * Public IV menu facts verified against the canonical 2026-08-06
 * GlossGenius-backed menu in ALL-SERVICES-PRICING.MD.
 *
 * Formulations and add-ons are intentionally absent: the canonical menu does
 * not verify their ingredients or current bookability. Per the 2026-08-20
 * binding rule in CLAUDE.md, House of Rose pricing is never public —
 * `price` below is retained for internal/GlossGenius paste-ready use only
 * and must never be read by a public renderer or formatted with a "$".
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

export const IV_HYDRATION_EDUCATION = {
  heading: `Six IV appointments, each with its own price.`,
  introduction:
    `House of Rose offers one 30-minute base IV and ${fortyFiveMinuteIvs.length} 45-minute base IVs, each priced separately. Ask about current pricing when you book.`,
  provider:
    'Diana Morrison, RN provides IV hydration under written physician protocol and medical direction.',
  shorterOption:
    `${hydrationIv.name} is the 30-minute option.`,
  longerOptions:
    `The other ${fortyFiveMinuteIvs.length} base options are 45-minute appointments, each priced separately.`,
  formulation:
    'If ingredients or add-ons are part of your decision, call House of Rose before booking. The six appointment names alone do not identify a complete formulation.',
} as const;

export const IV_HYDRATION_CATEGORY_OVERVIEW = {
  heading: 'IV means intravenous.',
  lead: `Intravenous means that fluid is administered through a vein. At House of Rose, IV drip appointments are offered as IV Hydration Therapy, with ${VERIFIED_IV_MENU.length} named base options.`,
  detail: `${IV_HYDRATION_EDUCATION.shorterOption} ${IV_HYDRATION_EDUCATION.longerOptions}`,
} as const;

export const IV_HYDRATION_FAQS = [
  {
    question: 'Which IV hydration options does House of Rose offer?',
    answer:
      "House of Rose offers Hydration IV, Immunity IV, Recovery IV, Beauty Glow IV, Reboot (Hangover Recovery) IV, and Myers' Cocktail IV.",
  },
  {
    question: 'What does IV mean in IV hydration?',
    answer:
      'IV means intravenous: fluid is administered through a vein. House of Rose calls the service IV Hydration Therapy.',
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
