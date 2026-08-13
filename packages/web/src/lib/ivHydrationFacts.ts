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

export const VERIFIED_IV_MENU: readonly VerifiedIvMenuItem[] = [
  { name: 'Hydration IV', durationMinutes: 30, price: 99 },
  { name: 'Immunity IV', durationMinutes: 45, price: 160 },
  { name: 'Recovery IV', durationMinutes: 45, price: 175 },
  { name: 'Beauty Glow IV', durationMinutes: 45, price: 170 },
  { name: 'Reboot (Hangover Recovery) IV', durationMinutes: 45, price: 165 },
  { name: "Myers' Cocktail IV", durationMinutes: 45, price: 185 },
];

export const IV_HYDRATION_CATEGORY_OVERVIEW = {
  heading: 'At House of Rose, an IV drip is IV Hydration Therapy.',
  lead: 'IV stands for intravenous: fluid is administered through a vein. The current House of Rose service has six base options.',
  detail: 'An option name is not an ingredient list. Use the table below to compare verified names, appointment lengths, and prices; call the practice if the formulation is part of your decision.',
} as const;

export const IV_HYDRATION_FAQS = [
  {
    question: 'Which IV hydration options are currently listed?',
    answer:
      "The current House of Rose menu lists Hydration IV, Immunity IV, Recovery IV, Beauty Glow IV, Reboot (Hangover Recovery) IV, and Myers' Cocktail IV. Formulations and add-ons are not published here because the current booking export does not verify them.",
  },
  {
    question: 'How long is an IV hydration appointment?',
    answer:
      'The current menu lists Hydration IV at 30 minutes. The other five base options are listed at 45 minutes.',
  },
  {
    question: 'Who provides IV hydration at House of Rose?',
    answer:
      'IV hydration is provided by Diana Morrison, RN under written physician protocol and medical direction. Medical Director: Joshua Shaw, MD · FL Lic. ME136232.',
  },
] as const;
