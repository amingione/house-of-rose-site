import { defineField, defineType } from 'sanity';

/**
 * Membership / Plan — mirrors the Notion "HOUSE OF ROSE: Memberships & Plans" database.
 * Each document is a single tier / plan / rider, grouped internally by Lane (Advanced
 * Aesthetics / Injectables & Medical / Wellness / Beauty & Enhancements / House Collective /
 * Cross-Category) — the same plain-English taxonomy as `provider.ts`, not flower codenames.
 * The public /memberships page (packages/web/src/pages/memberships.astro) groups by
 * `membershipGroup` instead — Rose Pass, IV Hydration Membership, and Rose Collagen Bank —
 * since those are the site's actual recurring membership products (distinct from the Rose
 * Circle client affiliation at /rose-circle, which is not a membership).
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
      description: 'Matches the provider lane taxonomy (see provider.ts) for internal consistency.',
      options: {
        list: [
          { title: 'Advanced Aesthetics', value: 'advanced-aesthetics' },
          { title: 'Injectables & Medical', value: 'injectables-medical' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Beauty & Enhancements', value: 'beauty-enhancements' },
          { title: 'House Collective', value: 'house-collective' },
          { title: 'Cross-Category / Regenerative', value: 'cross-category' },
        ],
      },
    }),
    defineField({
      name: 'membershipGroup',
      title: 'Public Group (/memberships page)',
      type: 'string',
      description: 'Which section of the public /memberships page this plan is grouped under. Leave blank to keep it out of that page.',
      options: {
        list: [
          { title: 'Rose Pass (Wax Membership)', value: 'rose-pass' },
          { title: 'IV Hydration Membership', value: 'iv-hydration' },
          { title: 'Basic Facials Membership', value: 'basic-facials' },
          { title: 'Advanced Facials Membership', value: 'advanced-facials' },
          { title: 'Rose Collagen Bank', value: 'collagen-bank' },
        ],
        layout: 'radio',
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
