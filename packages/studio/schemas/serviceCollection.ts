import { defineField, defineType } from 'sanity';

export const serviceCollection = defineType({
  name: 'serviceCollection',
  title: 'Service Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'presentation',
      title: 'Page Presentation',
      type: 'string',
      initialValue: 'catalog',
      options: {
        list: [
          { title: 'Catalog', value: 'catalog' },
          { title: 'Editorial (review)', value: 'editorial' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Editorial Headline (review)',
      type: 'string',
      description: 'Use only a factual collection distinction; avoid campaign or aspirational language.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'intro',
      title: 'Editorial Introduction (review)',
      type: 'text',
      rows: 4,
      description: 'Explain the verified services in this collection without a customer profile or recommendation script.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services',
      type: 'array',
      hidden: ({ document }) => document?.presentation !== 'editorial',
      validation: (R) => R.max(3),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'service',
              title: 'Service',
              type: 'reference',
              to: [{ type: 'service' }],
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'image',
              title: 'Editorial Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (R) => R.required(),
                }),
              ],
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              rows: 3,
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'linkLabel',
              title: 'Link Label',
              type: 'string',
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: {
              title: 'service.title',
              subtitle: 'summary',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'customizationTitle',
      title: 'Customization Section Title',
      type: 'string',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'customizationIntro',
      title: 'Customization Section Note',
      type: 'text',
      rows: 3,
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'customizations',
      title: 'Customization Options',
      type: 'array',
      hidden: ({ document }) => document?.presentation !== 'editorial',
      validation: (R) => R.max(6),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),
    defineField({
      name: 'closingTitle',
      title: 'Closing CTA Title',
      type: 'string',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'closingBody',
      title: 'Closing CTA Body',
      type: 'text',
      rows: 3,
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
});
