import { defineField, defineType } from 'sanity';

/**
 * Treatment Package — mirrors the Notion "HOUSE OF ROSE: Packages & Series" database.
 * Operational fields (Type, Status, Provider, Services Included, Founding/Rack pricing,
 * Cadence) match Notion; marketing fields (outcome, positioning, candidacyNote, image)
 * are website-only enrichment.
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
          { title: 'Journey', value: 'journey' },
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
      title: 'Cadence',
      type: 'text',
      rows: 2,
      description: 'Experience-level timing/sequencing; clinical specifics defer to the provider.',
    }),
    defineField({
      name: 'foundingPrice',
      title: 'Founding Price',
      type: 'string',
      description: 'Intro / founding-member rate (free text — supports ranges).',
    }),
    defineField({
      name: 'rackPrice',
      title: 'Rack Price',
      type: 'string',
      description: 'Standard published rate (free text — supports ranges).',
    }),
    // ─── Website-only marketing enrichment ───────────────────────────────────
    defineField({
      name: 'outcome',
      title: 'Ideal Outcome (website)',
      type: 'text',
      rows: 2,
      description: 'Responsible, non-guaranteeing language. The visible/emotional result.',
    }),
    defineField({
      name: 'positioning',
      title: 'Premium Positioning Angle (website)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'candidacyNote',
      title: 'Candidacy Note (website)',
      type: 'string',
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
    select: { title: 'title', subtitle: 'type', media: 'image' },
  },
});
