import { defineField, defineType } from 'sanity';

export const brandProfile = defineType({
  name: 'brandProfile',
  title: 'Brand Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Brand Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'angle',
      title: 'Brand Angle',
      type: 'string',
      description: 'One sharp sentence on the lane this brand owns.',
      validation: (R) => R.required().max(180),
    }),
    defineField({
      name: 'idealClient',
      title: 'Ideal Client',
      type: 'text',
      rows: 3,
      description: 'Who she is, what she values, what she seeks, what she rejects.',
    }),
    defineField({
      name: 'differentiators',
      title: 'Differentiators',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(3).max(5),
    }),
    defineField({
      name: 'pillars',
      title: 'Brand Pillars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'meaning', title: 'Meaning', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'meaning' } },
        },
      ],
      validation: (R) => R.min(3).max(4),
    }),
    defineField({
      name: 'voiceTraits',
      title: 'Signature Voice Traits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'taglines',
      title: 'Tagline Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.max(5),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'angle' },
  },
});
