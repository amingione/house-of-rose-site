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
 * Everything here is additive and optional at the schema level. A block belongs
 * on a public page only when House of Rose has reviewed, service-specific facts
 * for it; an empty template is not evidence and must not become generic copy.
 */
export const treatmentPageFields = [
  defineField({
    name: 'downtime',
    title: 'Downtime (not published)',
    type: 'treatmentDowntime',
    readOnly: true,
    description: 'Stored for source compatibility and clinical review. The current public service page does not publish this field.',
  }),
  defineField({
    name: 'aftercare',
    title: 'Aftercare (not published)',
    type: 'treatmentAftercare',
    readOnly: true,
    description: 'Stored for source compatibility and clinical review. The current public service page does not publish this field.',
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
    title: 'Practice / Equipment Facts (review)',
    type: 'array',
    of: [{ type: 'string' }],
    description:
      'Specific, checkable device, credential, protocol, or setting facts. Do not write comparative quality claims or generic trust language.',
    validation: (R) => R.max(5),
  }),
];
