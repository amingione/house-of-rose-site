import { defineField, defineType } from 'sanity';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../../web/src/lib/publicServiceContent';
import { validatePublicCopy } from './validation/publicCopy';

/**
 * Case Study — AEO page type #6 (before/after proof).
 * Route: /results/[slug] (+ /results index). JSON-LD: ImageObject (before+after) + BreadcrumbList.
 * RULE: never publish with consentGiven != true. See docs/CONTENT-MODEL-MAP.md.
 */
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study (Before/After)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name the treatment and documented subject specifically. Do not turn the case into a promotional result headline.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'consentGiven',
      title: 'Client Consent Given',
      type: 'boolean',
      initialValue: false,
      description: 'REQUIRED to publish. Do not display before/after photos without written consent.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'treatment',
      title: 'Treatment',
      type: 'reference',
      to: [{ type: 'service' }],
      options: {
        filter:
          'status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in $unavailableSlugs)',
        filterParams: { unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS },
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'concern', title: 'Concern', type: 'reference', to: [{ type: 'concern' }] }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.custom(validatePublicCopy),
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.custom(validatePublicCopy),
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'clientProfile',
      title: 'Client Profile',
      type: 'string',
      description: 'De-identified facts that help interpret the case. Include no PII and omit demographics that are not relevant.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'protocol',
      title: 'Protocol',
      type: 'text',
      rows: 3,
      description: 'Record the verified services, session count, and any concurrent products or add-ons that contributed. Include enough context to interpret the photographs; do not narrate a generic treatment process.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'timeframe',
      title: 'Timeframe',
      type: 'string',
      description: 'State the documented interval and session count, such as “12 weeks · 3 sessions.”',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'text',
      rows: 5,
      description: 'Describe only the observable documented change and any context needed to understand it. Do not promise repeatability, overstate causation, or reduce the case to a generic benefit line.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'timeframe', media: 'afterImage' },
  },
});
