import { defineField } from 'sanity';

/**
 * The treatment-page fields that `service` was missing.
 *
 * Spread into `service.fields` so the diff on that 500-line file stays one line:
 *
 *   import { treatmentPageFields } from './objects/treatmentPageFields';
 *   // ...
 *   fields: [
 *     // ...existing fields, unchanged
 *     ...treatmentPageFields,
 *   ],
 *
 * Everything here is additive and optional at the schema level, so no existing
 * document is invalidated. Completeness is enforced at build time instead —
 * see `packages/studio/scripts/verify-treatment-pages.mjs`, which fails the build
 * when a service with `status: "live"` is missing a required block.
 */
export const treatmentPageFields = [
  defineField({
    name: 'downtime',
    title: 'Downtime',
    type: 'treatmentDowntime',
    description: 'Recovery expectation. Required for every live treatment.',
  }),
  defineField({
    name: 'aftercare',
    title: 'Aftercare',
    type: 'treatmentAftercare',
    description: 'Client-facing aftercare. Required for every live treatment.',
  }),
  defineField({
    name: 'providerScope',
    title: 'Provider Qualifications',
    type: 'treatmentProviderScope',
    description:
      'Licensure and delegation for this treatment. Never contains a staff or owner name.',
  }),
  defineField({
    name: 'priceRange',
    title: 'Price Range',
    type: 'treatmentPriceRange',
    hidden: true,
    description:
      'DO NOT SET. Prices are never displayed on the website (pricing-confidentiality decision 2026-07-24, reaffirmed by Amber 2026-08-11) — the build verifier fails on any live service carrying this field or a free-text price. GlossGenius is commerce truth; record figures in the internal pricingNotes field, which never renders.',
  }),
  defineField({
    name: 'whyQualified',
    title: 'Why House of Rose',
    type: 'array',
    of: [{ type: 'string' }],
    description:
      'Specific, checkable reasons this practice is the right place for this treatment. Device, certification, protocol, setting. No generic trust language — "attention to detail" and "steady hands" are rejected on review.',
    validation: (R) => R.max(5),
  }),
];
