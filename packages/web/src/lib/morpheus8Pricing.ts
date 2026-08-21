export interface Morpheus8PriceItem {
  readonly name: string;
  readonly singlePriceUsd?: number;
  readonly seriesOfThreePriceUsd: number;
  readonly note?: string;
}

export interface Morpheus8PackageRangeItem {
  readonly name: string;
  readonly minimumPriceUsd: number;
  readonly maximumPriceUsd: number;
  readonly treatmentCount: number;
}

/**
 * House of Rose Morpheus8 pricing confirmed by the owner on 2026-08-14 from:
 * packages/web/docs/inmode/Optimas Max Pricing.pdf, page 2.
 *
 * The exact Resurfacing and Prime single/series prices below are also retained
 * in the canonical pricing ledger. Approximate add-on recommendations from the
 * PDF remain unpublished because they are not exact House of Rose menu prices.
 *
 * INTERNAL-ONLY PRICING DATA (binding 2026-08-20, see CLAUDE.md "Public website
 * pricing is NEVER permitted"): the numeric prices in `MORPHEUS8_PRICING` and
 * the `formatMorpheus8Price` helper below are for internal ops / GlossGenius
 * paste-ready doc generation only. No file under `packages/web/src/pages/**`
 * or a public component may call `formatMorpheus8Price` or otherwise render
 * these numbers as a dollar amount. Public consumers read only `name` and
 * structural notes (single vs. series, package size) from this module.
 */
export const MORPHEUS8_PRICING = {
  verifiedAt: 'August 14, 2026',
  burst: [
    { name: 'Full Face', singlePriceUsd: 1200, seriesOfThreePriceUsd: 3000 },
    { name: 'Face & Neck', singlePriceUsd: 1250, seriesOfThreePriceUsd: 3500 },
    { name: 'Scars', singlePriceUsd: 500, seriesOfThreePriceUsd: 1300 },
    { name: 'Chest', singlePriceUsd: 500, seriesOfThreePriceUsd: 1300 },
    { name: 'Stretch Marks', singlePriceUsd: 700, seriesOfThreePriceUsd: 1700 },
  ],
  burstPackageRanges: [
    {
      name: 'Morpheus8 Burst — Hyperhidrosis',
      minimumPriceUsd: 2200,
      maximumPriceUsd: 2400,
      treatmentCount: 3,
    },
  ],
  burstDeep: [
    {
      name: 'Morpheus8 Burst Deep — Small Area',
      seriesOfThreePriceUsd: 3500,
      note: '4 × 10-inch area · Series of 3',
    },
    {
      name: 'Morpheus8 Burst Deep — Large Area',
      seriesOfThreePriceUsd: 4500,
      note: '8 × 11-inch area · Series of 3',
    },
  ],
  resurfacing: [
    { name: 'Morpheus8 Resurfacing — Full Face', singlePriceUsd: 750, seriesOfThreePriceUsd: 2000 },
    { name: 'Morpheus8 Resurfacing — Face & Neck', singlePriceUsd: 950, seriesOfThreePriceUsd: 2700 },
  ],
  prime: [
    { name: 'Morpheus8 Prime — Eyes & Mouth', singlePriceUsd: 1000, seriesOfThreePriceUsd: 2200 },
    { name: 'Morpheus8 Prime — Around the Eyes', singlePriceUsd: 450, seriesOfThreePriceUsd: 1200 },
    { name: 'Morpheus8 Prime — Around the Mouth', singlePriceUsd: 450, seriesOfThreePriceUsd: 1200 },
  ],
  bundle: {
    name: 'Morpheus8 + Lumecca Bundle',
    priceUsd: 1799,
    treatmentCount: 2,
  },
} as const satisfies {
  readonly verifiedAt: string;
  readonly burst: readonly Morpheus8PriceItem[];
  readonly burstPackageRanges: readonly Morpheus8PackageRangeItem[];
  readonly burstDeep: readonly Morpheus8PriceItem[];
  readonly resurfacing: readonly Morpheus8PriceItem[];
  readonly prime: readonly Morpheus8PriceItem[];
  readonly bundle: {
    readonly name: string;
    readonly priceUsd: number;
    readonly treatmentCount: number;
  };
};

export const formatMorpheus8Price = (amountUsd: number): string =>
  `$${amountUsd.toLocaleString('en-US')}`;
