import { defineField, defineType } from 'sanity';

export const membership = defineType({
  name: 'membership',
  title: 'Membership',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Program Name',
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
      name: 'promise',
      title: 'Program Promise',
      type: 'string',
      description: 'The exclusive, value-led promise of the program.',
    }),
    defineField({
      name: 'tiers',
      title: 'Tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Tier Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'clientLogic', title: "Who It's For", type: 'string' }),
            defineField({
              name: 'price',
              title: 'Monthly Price (USD)',
              type: 'number',
              validation: (R) => R.min(0),
            }),
            defineField({
              name: 'benefits',
              title: 'Benefits',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'clientLogic' } },
        },
      ],
      validation: (R) => R.min(2).max(3),
    }),
    defineField({
      name: 'upgradePathway',
      title: 'Upgrade / Pathway Logic',
      type: 'text',
      rows: 2,
      description: 'One-time service → signature series → membership → higher tier, and what triggers each step.',
    }),
    defineField({
      name: 'retentionLogic',
      title: 'Retention Logic',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'promise' },
  },
});
