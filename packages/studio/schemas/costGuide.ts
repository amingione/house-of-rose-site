import { defineField, defineType } from 'sanity';

/**
 * Cost Guide — AEO page type #2 ("How much does ___ cost?").
 * Route: /cost/[slug]. JSON-LD: FAQPage + BreadcrumbList + Article.
 * See docs/CONTENT-MODEL-MAP.md.
 */
export const costGuide = defineType({
  name: 'costGuide',
  title: 'Cost Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name the service and cost intent plainly. A natural client question is welcome, but the title does not need to follow one fixed formula.',
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
      name: 'treatment',
      title: 'Treatment',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'The canonical service hub this cost guide is about.',
    }),
    defineField({
      name: 'answer',
      title: 'Direct Answer (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. Public cost copy and matching structured data come from the reviewed cost-facts overlay in the website code.',
    }),
    defineField({ name: 'priceLow', title: 'Price — Low (not published)', type: 'number', readOnly: true, description: 'Legacy source field. Current public prices come from the reviewed cost-facts overlay.' }),
    defineField({ name: 'priceHigh', title: 'Price — High (not published)', type: 'number', readOnly: true, description: 'Legacy source field. Current public prices come from the reviewed cost-facts overlay.' }),
    defineField({
      name: 'priceUnit',
      title: 'Price Unit (not published)',
      type: 'string',
      readOnly: true,
      description: 'Legacy source field. Current public price units come from the reviewed cost-facts overlay.',
      options: {
        list: [
          { title: 'Per session', value: 'per session' },
          { title: 'Per area', value: 'per area' },
          { title: 'Per unit', value: 'per unit' },
          { title: 'Per program', value: 'per program' },
        ],
      },
    }),
    defineField({
      name: 'costFactors',
      title: 'What Affects the Cost (not published)',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'factor', title: 'Factor', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'effect', title: 'Effect on Cost', type: 'text', rows: 2, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'factor', subtitle: 'effect' } },
        },
      ],
      description: 'Legacy source field. The current public cost page does not publish this CMS section.',
    }),
    defineField({ name: 'whatsIncluded', title: "What's Included (not published)", type: 'text', rows: 4, readOnly: true, description: 'Legacy source field. The current public cost page does not publish this CMS section.' }),
    defineField({ name: 'faqs', title: 'FAQs (not published)', type: 'array', of: [{ type: 'faq' }], readOnly: true, description: 'Legacy source field. Public cost FAQs and FAQPage schema come from the same reviewed cost-facts overlay.' }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services (not published)',
      type: 'array',
      readOnly: true,
      description: 'Legacy source field. The public page links the canonical treatment and reviewed comparisons instead.',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'treatment.title' },
  },
});
