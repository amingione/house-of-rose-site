import { defineField, defineType } from 'sanity';
import { validatePublicCopy } from './validation/publicCopy';

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
      description: 'Live makes the record eligible for publication; the website also requires a verified package slug before it can generate a public route.',
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
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
          options: {
            filter: 'status in ["live", "actual-menu"] && defined(slug.current)',
          },
        },
      ],
      description: 'The public, routeable Service documents this package contains (mirrors Notion "Services Included").',
    }),
    defineField({
      name: 'whatsIncluded',
      title: "What's Included (not published)",
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. Public package contents come from the Services Included references and reviewed package overlay.',
    }),
    defineField({
      name: 'cadence',
      title: 'Timing',
      type: 'text',
      rows: 2,
      description: 'Verified public timing or spacing only. Omit when the current booking source does not support it.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'rackPrice',
      title: 'Rack Price',
      type: 'string',
      description: 'Standard published rate (free text — supports ranges).',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    // ─── Website copy under review ────────────────────────────────────────────
    defineField({
      name: 'outcome',
      title: 'Public Summary (not published)',
      type: 'text',
      rows: 2,
      readOnly: true,
      description: 'Legacy source field. The current public package pages do not render this copy.',
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
      title: 'Suitability Note (not published)',
      type: 'string',
      readOnly: true,
      description: 'Legacy source field. The current public package pages do not render a generic suitability section.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.custom(validatePublicCopy),
        }),
      ],
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
