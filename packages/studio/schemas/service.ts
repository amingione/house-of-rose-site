import { defineField, defineType } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
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
      name: 'collection',
      title: 'Collection (website grouping page)',
      type: 'reference',
      to: [{ type: 'serviceCollection' }],
      description: 'Controls where this service appears on the SITE — which /services/collections/ hub page it\'s listed under (e.g. "Facials"). Not the same as Category below, which is internal pricing/reporting only and is never shown to customers.',
    }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Hub (service family — education page with child treatments)', value: 'hub' },
          { title: 'Treatment (bookable protocol under a hub)', value: 'treatment' },
          { title: 'Standalone (single service, no children)', value: 'standalone' },
        ],
        layout: 'radio',
      },
      initialValue: 'standalone',
      description: 'Hub = the question a client googles. Treatment = a priced, bookable protocol.',
    }),
    defineField({
      name: 'parentService',
      title: 'Parent Service (hub — not the same as Collection)',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'For treatments only: the specific hub SERVICE this protocol belongs under (e.g. "Microneedling — Corrective" under the "Microneedling" hub). This is a service-to-service link, separate from Collection above (which links to a serviceCollection grouping page).',
      hidden: ({ document }) => document?.kind !== 'treatment',
    }),
    defineField({
      name: 'concerns',
      title: 'Concerns',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'concern' }] }],
      description: 'Client concerns this treatment addresses (powers /concerns/* router pages).',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-liner shown on cards and listings',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Starting-at price shown on the site (e.g., "From $399"). Leave empty for consult-only services.',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'GlossGenius Booking Link',
      type: 'url',
      description: 'Per-service booking link from GlossGenius (Settings → Booking Links). Site falls back to houseofrose.glossgenius.com/book when empty.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Typical appointment length (e.g., "60–90 minutes")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      description: 'Full description shown on the service detail page ("What It Is")',
    }),
    defineField({
      name: 'whoItsFor',
      title: 'Who It\'s For',
      type: 'text',
      rows: 3,
      description: 'Target audience and ideal candidates for this service',
    }),
    defineField({
      name: 'benefits',
      title: 'Client Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short, client-facing benefits shown as scannable cards on the service page.',
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'treatmentAreas',
      title: 'Treatment Areas',
      type: 'array',
      description: 'Areas that may be considered and the visible concerns addressed there.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'area',
              title: 'Area',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'focus',
              title: 'Appearance Focus',
              type: 'text',
              rows: 2,
              description: 'Describe appearance goals without making a disease-treatment or guaranteed-result claim.',
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: 'area', subtitle: 'focus' },
          },
        },
      ],
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'process',
      title: 'The Process',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Step-by-step process list (e.g., "Skin cleanse and prep")',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
          },
        },
      ],
      description: 'Common questions about this service',
    }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      description: 'Services to show in the "Related Services" section',
      validation: (R) => R.max(3),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional supporting photos shown alongside the primary image (e.g. detail/product shots).',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first within a collection',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    // ─── Catalog & pricing (mirrors Notion "HOUSE OF ROSE: Services") ─────────
    defineField({
      name: 'category',
      title: 'Category (internal pricing/reporting only)',
      type: 'string',
      description: 'Internal bucket for pricing and reporting — NEVER shown on the website. Does not affect where the service appears on the site; that\'s controlled by Collection above.',
      options: {
        list: [
          { title: 'Skin Renewal', value: 'skin-renewal' },
          { title: 'Injectables & Bio-Fillers', value: 'injectables-bio-fillers' },
          { title: 'Wellness & Restoration', value: 'wellness-restoration' },
          { title: 'Beauty & Enhancements', value: 'beauty-enhancements' },
          { title: 'Retail / Home Care', value: 'retail-home-care' },
        ],
      },
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'reference',
      to: [{ type: 'provider' }],
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
          { title: 'Actual Menu', value: 'actual-menu' },
          { title: 'Duplicate', value: 'duplicate' },
        ],
      },
    }),
    defineField({
      name: 'pricingModel',
      title: 'Pricing Model',
      type: 'string',
      options: {
        list: [
          { title: 'Per Session', value: 'per-session' },
          { title: 'Per Unit', value: 'per-unit' },
          { title: 'Per Area', value: 'per-area' },
          { title: 'Program', value: 'program' },
          { title: 'Add-On', value: 'add-on' },
          { title: 'Consult', value: 'consult' },
          { title: 'Per Item', value: 'per-item' },
        ],
      },
    }),
    defineField({ name: 'rackPrice', title: 'Rack Price', type: 'string' }),
    defineField({ name: 'pricingNotes', title: 'Pricing Notes', type: 'text', rows: 3 }),
    defineField({ name: 'competitorPricing', title: 'Competitor Pricing', type: 'text', rows: 3 }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'collection.title', media: 'image' },
  },
});
