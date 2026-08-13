import { defineField, defineType } from 'sanity';

/**
 * Treatment Package — mirrors the Notion "HOUSE OF ROSE: Packages & Series" database.
 * Operational fields (Type, Status, Provider, Services Included, Founding/Rack pricing,
 * Cadence) match Notion; legacy website-copy fields remain for source compatibility
 * while their public voice is under review.
 */
export const treatmentPackage = defineType({
  name: 'treatmentPackage',
  title: 'Package / Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Package',
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
          { title: 'Series', value: 'series' },
          { title: 'Program', value: 'journey' },
          { title: 'Combo / Add-On Bundle', value: 'combo' },
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
          { title: 'Parked', value: 'parked' },
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
      name: 'servicesIncluded',
      title: 'Services Included',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      description: 'The Service documents this package contains (mirrors Notion "Services Included").',
    }),
    defineField({
      name: 'whatsIncluded',
      title: "What's Included",
      type: 'text',
      rows: 3,
      description: 'Plain-language summary of what the package contains.',
    }),
    defineField({
      name: 'cadence',
      title: 'Timing',
      type: 'text',
      rows: 2,
      description: 'Verified public timing or spacing only. Omit when the current booking source does not support it.',
    }),
    defineField({
      name: 'rackPrice',
      title: 'Rack Price',
      type: 'string',
      description: 'Standard published rate (free text — supports ranges).',
    }),
    // ─── Website copy under review ────────────────────────────────────────────
    defineField({
      name: 'outcome',
      title: 'Public Summary (review)',
      type: 'text',
      rows: 2,
      description: 'Stored source copy. Not currently rendered until voice and claims are approved.',
    }),
    defineField({
      name: 'positioning',
      title: 'Display Notes (review)',
      type: 'text',
      rows: 2,
      description: 'Internal display notes only. Do not draft a positioning angle or public sales line here.',
    }),
    defineField({
      name: 'candidacyNote',
      title: 'Suitability Note (review)',
      type: 'string',
      description: 'Use only when a package-specific suitability fact is necessary. No default boilerplate.',
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
    select: { title: 'title', subtitle: 'type', media: 'image' },
  },
});
