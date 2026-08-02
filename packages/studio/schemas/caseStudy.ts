import { defineField, defineType } from 'sanity';

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
      description: 'e.g. "PRF Microneedling — Texture & Skin Quality, 3 Sessions".',
      validation: (R) => R.required(),
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
    defineField({ name: 'treatment', title: 'Treatment', type: 'reference', to: [{ type: 'service' }], validation: (R) => R.required() }),
    defineField({ name: 'concern', title: 'Concern', type: 'reference', to: [{ type: 'concern' }] }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      validation: (R) => R.required(),
    }),
    defineField({ name: 'clientProfile', title: 'Client Profile', type: 'string', description: 'De-identified, e.g. "Woman, 40s, sun damage". No PII.' }),
    defineField({ name: 'protocol', title: 'Protocol', type: 'text', rows: 3, description: 'What was done — sessions, products, add-ons.' }),
    defineField({ name: 'timeframe', title: 'Timeframe', type: 'string', description: 'e.g. "12 weeks, 3 sessions".' }),
    defineField({ name: 'outcome', title: 'Outcome', type: 'text', rows: 3, description: 'Honest result — no guarantees, no medical claims.' }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'timeframe', media: 'afterImage' },
  },
});
