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
    title: 'Downtime',
    type: 'treatmentDowntime',
    description: 'Use only for reviewed, service-specific recovery information. Do not fill this field with a generic estimate.',
  }),
  defineField({
    name: 'aftercare',
    title: 'Aftercare',
    type: 'treatmentAftercare',
    description: 'Use only for reviewed instructions tied to this exact service. Do not infer a standard protocol.',
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
