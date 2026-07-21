import { defineField, defineType } from 'sanity';

/**
 * Comparison — AEO page type #4 ("A vs B").
 * Route: /compare/[slug]. JSON-LD: FAQPage + BreadcrumbList + Article.
 * See docs/CONTENT-MODEL-MAP.md.
 */
const optionFields = (label: string) => [
  defineField({ name: 'label', title: `${label} — Label`, type: 'string', validation: (R) => R.required() }),
  defineField({ name: 'summary', title: `${label} — Summary`, type: 'text', rows: 3 }),
  defineField({ name: 'bestFor', title: `${label} — Best For`, type: 'text', rows: 2 }),
  defineField({ name: 'service', title: `${label} — Service`, type: 'reference', to: [{ type: 'service' }] }),
];

export const comparison = defineType({
  name: 'comparison',
  title: 'Comparison',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "PRF Microchanneling vs Microneedling: Which Is Right for You?"',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'parked',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Parked', value: 'parked' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Direct Answer / Intro',
      type: 'text',
      rows: 3,
      description: 'Answer-first: state the short version of who should pick which, then explain.',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'optionA', title: 'Option A', type: 'object', fields: optionFields('Option A') }),
    defineField({ name: 'optionB', title: 'Option B', type: 'object', fields: optionFields('Option B') }),
    defineField({
      name: 'rows',
      title: 'Comparison Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'attribute', title: 'Attribute', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'valueA', title: 'Option A', type: 'string' }),
            defineField({ name: 'valueB', title: 'Option B', type: 'string' }),
          ],
          preview: { select: { title: 'attribute', subtitle: 'valueA' } },
        },
      ],
      description: 'Attribute-by-attribute comparison (downtime, results timeline, cost, etc.).',
    }),
    defineField({ name: 'verdict', title: 'The Verdict', type: 'text', rows: 4 }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }] }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title' } },
});
