import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

export const concern = defineType({
  name: 'concern',
  title: 'Concern',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Public Status',
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
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Public concern-guide name. Use a specific, recognizable concern rather than a campaign phrase.',
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
      name: 'intro',
      title: 'Intro (not published)',
      type: 'text',
      rows: 4,
      readOnly: true,
      description: 'Legacy source field. Public concern guidance comes from the reviewed website education for each guide.',
    }),
    defineField({
      name: 'image',
      title: 'Image (not published)',
      type: 'image',
      options: { hotspot: true },
      readOnly: true,
      description: 'Legacy source asset retained with the record. Current concern pages do not render a concern image.',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'seo',
      title: 'SEO (not published)',
      type: 'seo',
      readOnly: true,
      description: 'Legacy source field. Current concern metadata is generated from the public title and reviewed website education.',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
});
