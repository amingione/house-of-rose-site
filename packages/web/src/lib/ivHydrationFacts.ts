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
