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
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'serviceCollection' }],
      description: 'Which collection does this service belong to?',
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
      title: 'Parent Service (hub)',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'For treatments: the canonical hub this protocol belongs to (the certification that defines it).',
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
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first within a collection',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 }),
      ],
      options: { collapsed: true },
    }),
    // ─── Catalog & pricing (mirrors Notion "HOUSE OF ROSE: Services") ─────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
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
    defineField({ name: 'foundingPrice', title: 'Founding Price', type: 'string' }),
    defineField({ name: 'rackPrice', title: 'Rack Price', type: 'string' }),
    defineField({ name: 'memberPrice', title: 'Member Price', type: 'string' }),
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
