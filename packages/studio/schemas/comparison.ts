import { defineField, defineType } from 'sanity';

/**
 * Comparison — AEO page type #4 ("A vs B").
 * Route: /compare/[slug]. JSON-LD: FAQPage + BreadcrumbList + Article.
 * See docs/CONTENT-MODEL-MAP.md.
 */
const optionFields = (label: string) => [
  defineField({ name: 'label', title: `${label} — Label`, type: 'string', validation: (R) => R.required() }),
  defineField({ name: 'summary', title: `${label} — Summary`, type: 'text', rows: 3 }),
  defineField({
    name: 'bestFor',
    title: `${label} — Verified Distinction (review)`,
    type: 'text',
    rows: 2,
    description: 'State a sourced treatment role, area, or concern. Do not choose for the client or invent candidacy criteria.',
  }),
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
      description: 'Use the two treatment or service names in a factual “A vs B” title.',
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
      description: 'Answer-first: state the primary verified difference. Do not prescribe a choice or repeat consultation boilerplate.',
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
      description: 'Sourced differences only, such as modality, treatment area, verified duration, or reviewed recovery facts.',
    }),
    defineField({
      name: 'verdict',
      title: 'Summary (review)',
      type: 'text',
      rows: 4,
      description: 'Restate the verified distinction without declaring a winner or choosing for the client.',
    }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }] }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title' } },
});
