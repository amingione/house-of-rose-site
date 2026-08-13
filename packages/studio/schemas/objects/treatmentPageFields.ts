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
    description:
      'Structured mirror of the GlossGenius price. Powers the Offer node in JSON-LD. The existing free-text `price` field still drives the hero line.',
  }),
  defineField({
    name: 'whyQualified',
    title: 'Practice / Equipment Facts (review)',
    type: 'array',
    of: [{ type: 'string' }],
    description:
      'Specific, checkable device, credential, protocol, or setting facts. Do not write comparative quality claims or generic trust language.',
    validation: (R) => R.max(5),
  }),
];
