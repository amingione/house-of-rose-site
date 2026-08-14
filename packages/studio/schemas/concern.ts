import { defineField, defineType } from 'sanity';

export const concern = defineType({
  name: 'concern',
  title: 'Concern',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Public Status',
      type: 'string',
      initialValue: 'live',
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
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      description: 'Opening context for what the client may be seeing or feeling. Be specific and useful without forcing the same question-and-answer pattern onto every concern.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
});
