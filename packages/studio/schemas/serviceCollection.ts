import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

export const serviceCollection = defineType({
  name: 'serviceCollection',
  title: 'Service Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Public category name. Use the verified service grouping, not a campaign line.',
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
      name: 'description',
      title: 'Description (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. Current category introductions come from the reviewed website content.',
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
      title: 'Page Presentation (not published)',
      type: 'string',
      initialValue: 'catalog',
      readOnly: true,
      description: 'Legacy presentation setting retained with stored records. It does not change the current public category page.',
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
      title: 'Editorial Headline (not published)',
      type: 'string',
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish this headline.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'intro',
      title: 'Editorial Introduction (not published)',
      type: 'text',
      rows: 4,
      readOnly: true,
      description: 'Legacy source field. The current public category page uses reviewed website content instead.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services (not published)',
      type: 'array',
      readOnly: true,
      description: 'Legacy editorial selection retained with stored records. The public page lists current linked services instead.',
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
      title: 'Customization Section Title (not published)',
      type: 'string',
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish a customization section.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'customizationIntro',
      title: 'Customization Section Note (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish a customization section.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'customizations',
      title: 'Customization Options (not published)',
      type: 'array',
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish these options.',
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
      title: 'Closing CTA Title (not published)',
      type: 'string',
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish this CTA.',
      hidden: ({ document }) => document?.presentation !== 'editorial',
    }),
    defineField({
      name: 'closingBody',
      title: 'Closing CTA Body (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. The current public category page does not publish this CTA.',
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
