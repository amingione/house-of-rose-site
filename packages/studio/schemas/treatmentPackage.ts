import { defineField, defineType } from 'sanity';

export const treatmentPackage = defineType({
  name: 'treatmentPackage',
  title: 'Treatment Package',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Package Name',
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
      name: 'outcome',
      title: 'Ideal Outcome',
      type: 'text',
      rows: 2,
      description: 'Responsible, non-guaranteeing language. The visible/emotional result.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'services',
      title: 'Included Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Service', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'rationale',
              title: 'Why It Belongs',
              type: 'string',
              description: 'One line on the role it plays toward the outcome.',
            }),
            defineField({
              name: 'service',
              title: 'Linked Service (optional)',
              type: 'reference',
              to: [{ type: 'service' }],
              description: 'Optionally link to the canonical service document.',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'rationale' } },
        },
      ],
      validation: (R) => R.min(2),
    }),
    defineField({
      name: 'cadence',
      title: 'Sequencing / Cadence',
      type: 'text',
      rows: 2,
      description: 'Experience-level guidance only; clinical specifics defer to the provider.',
    }),
    defineField({
      name: 'positioning',
      title: 'Premium Positioning Angle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'candidacyNote',
      title: 'Candidacy Note',
      type: 'string',
      description: 'Final combinations confirmed by the licensed provider based on candidacy and contraindications.',
      initialValue:
        'Final treatment combinations are confirmed by your licensed provider based on candidacy, contraindications, and local regulations.',
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
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Name A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'outcome', media: 'image' },
  },
});
