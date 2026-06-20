import { defineField, defineType } from 'sanity';

/**
 * Membership / Plan — mirrors the Notion "HOUSE OF ROSE: Memberships & Plans" database.
 * Each document is a single tier / plan / rider, grouped by Lane (Lily / Iris / Hydrangea /
 * Magnolia / House Collective / Cross-Lane). The website memberships page may group these
 * by lane at render time.
 */
export const membership = defineType({
  name: 'membership',
  title: 'Membership / Plan',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Plan',
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
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Membership Tier', value: 'membership-tier' },
          { title: 'Regenerative Plan', value: 'regenerative-plan' },
          { title: 'Wellness Rider', value: 'wellness-rider' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'lane',
      title: 'Lane',
      type: 'string',
      options: {
        list: [
          { title: 'Lily — Advanced Aesthetics', value: 'lily' },
          { title: 'Iris — Injectables', value: 'iris' },
          { title: 'Hydrangea — Wellness', value: 'hydrangea' },
          { title: 'Magnolia — Waxing & Beauty', value: 'magnolia' },
          { title: 'House Collective', value: 'house-collective' },
          { title: 'Cross-Lane / Regenerative', value: 'cross-lane' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Proposed', value: 'proposed' },
          { title: 'Brainstorm', value: 'brainstorm' },
        ],
        layout: 'radio',
      },
      initialValue: 'proposed',
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'reference',
      to: [{ type: 'provider' }],
    }),
    defineField({
      name: 'monthlyPrice',
      title: 'Monthly Price',
      type: 'string',
      description: 'Free text — supports ranges and notes.',
    }),
    defineField({
      name: 'whatsIncluded',
      title: "What's Included",
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'perks',
      title: 'Perks',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'linkedServices',
      title: 'Linked Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'linkedPackages',
      title: 'Linked Packages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatmentPackage' }] }],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first within a lane',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'lane' },
  },
});
