/**
 * Public IV menu facts verified against the canonical 2026-08-06
 * GlossGenius-backed menu in ALL-SERVICES-PRICING.MD.
 *
 * Per-bag ingredients and copy live in `ivDripContent.ts` (source: the
 * practice's IV bag reference under docs/GOVERNANCE/internal_only/services/Diana/).
 * Per the 2026-08-20 binding rule in CLAUDE.md, House of Rose pricing is never public —
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
