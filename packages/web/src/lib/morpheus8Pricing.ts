export interface Morpheus8PriceItem {
  readonly name: string;
  readonly singlePriceUsd?: number;
  readonly seriesOfThreePriceUsd: number;
  readonly note?: string;
}

/**
 * House of Rose Morpheus8 pricing confirmed by the owner on 2026-08-14 from:
 * packages/web/docs/inmode/Optimas Max Pricing.pdf, page 2.
 *
 * The PDF also contains Resurfacing and Prime modality/add-on pricing. Those
 * rows are retained in the canonical pricing ledger, but are not presented as
 * standalone public services until their booking names and routes are settled.
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
  bundle: {
    name: 'Morpheus8 + Lumecca Bundle',
    priceUsd: 1799,
    treatmentCount: 2,
  },
} as const satisfies {
  readonly verifiedAt: string;
  readonly burst: readonly Morpheus8PriceItem[];
  readonly burstDeep: readonly Morpheus8PriceItem[];
  readonly bundle: {
    readonly name: string;
    readonly priceUsd: number;
    readonly treatmentCount: number;
  };
};

export const formatMorpheus8Price = (amountUsd: number): string =>
  `$${amountUsd.toLocaleString('en-US')}`;
