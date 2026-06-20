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
      description: 'Question-shaped, e.g. "How Much Does PRF Microneedling Cost in Punta Gorda?"',
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
      title: 'Direct Answer',
      type: 'text',
      rows: 3,
      description: 'Answer-first paragraph — lead with the price range in plain language.',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'priceLow', title: 'Price — Low', type: 'number', description: 'Low end of the typical range (USD).' }),
    defineField({ name: 'priceHigh', title: 'Price — High', type: 'number', description: 'High end of the typical range (USD).' }),
    defineField({
      name: 'priceUnit',
      title: 'Price Unit',
      type: 'string',
      options: {
        list: [
          { title: 'Per session', value: 'per session' },
          { title: 'Per area', value: 'per area' },
          { title: 'Per unit', value: 'per unit' },
          { title: 'Per program', value: 'per program' },
        ],
      },
      initialValue: 'per session',
    }),
    defineField({
      name: 'costFactors',
      title: 'What Affects the Cost',
      type: 'array',
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
      description: 'The honest variables that move the price (areas treated, sessions, add-ons, etc.).',
    }),
    defineField({ name: 'whatsIncluded', title: "What's Included", type: 'text', rows: 4 }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }] }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      validation: (R) => R.max(3),
    }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'treatment.title' },
  },
});
