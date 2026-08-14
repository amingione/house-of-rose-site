import { defineField, defineType } from 'sanity';

/**
 * Comparison — AEO page type #4 ("A vs B").
 * Route: /compare/[slug]. JSON-LD: FAQPage + BreadcrumbList + Article.
 * See docs/CONTENT-MODEL-MAP.md.
 */
const optionFields = (label: string) => [
  defineField({ name: 'label', title: `${label} — Label (not published)`, type: 'string', readOnly: true, description: 'Legacy source field. The reviewed website overlay supplies the public label.' }),
  defineField({ name: 'summary', title: `${label} — Summary (not published)`, type: 'text', rows: 3, readOnly: true, description: 'Legacy source field. The reviewed website overlay supplies the public overview.' }),
  defineField({
    name: 'bestFor',
    title: `${label} — Verified Distinction (not published)`,
    type: 'text',
    rows: 2,
    readOnly: true,
    description: 'Legacy source field. The reviewed website overlay supplies the public distinction.',
  }),
  defineField({
    name: 'service',
    title: `${label} — Service`,
    type: 'reference',
    to: [{ type: 'service' }],
    options: {
      filter: 'status in ["live", "actual-menu"] && defined(slug.current)',
    },
  }),
];

export const comparison = defineType({
  name: 'comparison',
  title: 'Comparison',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Identifies this record in Studio. The reviewed website overlay supplies the public title.',
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
      description: 'Live makes the record eligible for routing; it cannot publish without a matching reviewed website overlay.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. The reviewed website overlay supplies the public introduction.',
    }),
    defineField({ name: 'optionA', title: 'Option A', type: 'object', fields: optionFields('Option A') }),
    defineField({ name: 'optionB', title: 'Option B', type: 'object', fields: optionFields('Option B') }),
    defineField({
      name: 'rows',
      title: 'Comparison Rows (not published)',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'attribute', title: 'Attribute', type: 'string' }),
            defineField({ name: 'valueA', title: 'Option A', type: 'string' }),
            defineField({ name: 'valueB', title: 'Option B', type: 'string' }),
          ],
          preview: { select: { title: 'attribute', subtitle: 'valueA' } },
        },
      ],
      description: 'Legacy source field. The reviewed website overlay supplies the public comparison table.',
    }),
    defineField({
      name: 'verdict',
      title: 'Summary (not published)',
      type: 'text',
      rows: 4,
      readOnly: true,
      description: 'Legacy source field. The reviewed website overlay supplies the public summary.',
    }),
    defineField({ name: 'faqs', title: 'FAQs (not published)', type: 'array', of: [{ type: 'faq' }], readOnly: true, description: 'Legacy source field. Public FAQs and FAQPage schema come from the reviewed website overlay.' }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO (not published)', type: 'seo', readOnly: true, description: 'Legacy source field. The reviewed website overlay supplies current public metadata.' }),
  ],
  preview: { select: { title: 'title' } },
});
