import { defineField, defineType } from 'sanity';

export const brandProfile = defineType({
  name: 'brandProfile',
  title: 'Brand Profile (archival)',
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
      title: 'Brand Angle (archival)',
      type: 'string',
      description: 'Archived positioning field. Do not use as a source for public copy during the voice reset.',
      validation: (R) => R.required().max(180),
    }),
    defineField({
      name: 'idealClient',
      title: 'Ideal Client (archival)',
      type: 'text',
      rows: 3,
      description: 'Archived positioning field. Do not write an aspirational customer profile.',
    }),
    defineField({
      name: 'differentiators',
      title: 'Differentiators (archival)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.min(3).max(5),
    }),
    defineField({
      name: 'pillars',
      title: 'Brand Pillars (archival)',
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
      title: 'Voice Traits (archival)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'taglines',
      title: 'Tagline Options (archival)',
      type: 'array',
      description: 'Archived options. Public voice work requires Amber’s review before reuse.',
      of: [{ type: 'string' }],
      validation: (R) => R.max(5),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'angle' },
  },
});
