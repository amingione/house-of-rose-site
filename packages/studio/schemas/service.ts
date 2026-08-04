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
      name: 'bookingMode',
      title: 'Booking Action',
      type: 'string',
      options: {
        list: [
          { title: 'Book this exact service', value: 'direct' },
          { title: 'Schedule the matching consultation', value: 'consultation' },
          { title: 'Call to discuss', value: 'phone' },
        ],
        layout: 'radio',
      },
      initialValue: 'phone',
      description:
        'Controls the public call to action. Never point a service at a merely similar GlossGenius listing.',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { status?: string } | undefined;
          return document?.status === 'live' || document?.status === 'actual-menu'
            ? value || 'Live and actual-menu services require a booking action.'
            : true;
        }),
    }),
    defineField({
      name: 'bookingUrl',
      title: 'GlossGenius Direct Booking Link',
      type: 'url',
      description:
        'For direct or consultation actions, use https://houseofrose.glossgenius.com/book?service_token=… Leave empty when the booking action is phone.',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as {
            bookingMode?: 'direct' | 'consultation' | 'phone';
          } | undefined;
          const mode = document?.bookingMode;

          if (mode === 'phone') {
            return value ? 'Phone actions must not include a GlossGenius URL.' : true;
          }
          if ((mode === 'direct' || mode === 'consultation') && !value) {
            return 'Direct and consultation actions require a verified GlossGenius URL.';
          }
          if (!value) return true;

          try {
            const url = new URL(value);
            return url.protocol === 'https:' &&
              url.hostname === 'houseofrose.glossgenius.com' &&
              url.pathname === '/book' &&
              Boolean(url.searchParams.get('service_token')?.trim())
              ? true
              : 'Use the active House of Rose /book URL with a service_token.';
          } catch {
            return 'Enter a valid GlossGenius booking URL.';
          }
        }),
    }),
    defineField({
      name: 'bookingVerifiedAt',
      title: 'Booking Link Verified',
      type: 'date',
      description: 'Date this booking action was checked against the live GlossGenius catalog.',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { status?: string } | undefined;
          return document?.status === 'live' || document?.status === 'actual-menu'
            ? value || 'Verify the booking action before publishing this service.'
            : true;
        }),
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
      name: 'evidenceMedia',
      title: 'Treatment Evidence Media',
      type: 'array',
      description:
        'Approved device and manufacturer-supplied before/after imagery. Public before/after media is hidden unless usage approval and subject publication consent are both confirmed.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Device', value: 'device' },
                  { title: 'Before & After', value: 'before-after' },
                ],
                layout: 'radio',
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: false },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (R) => R.required(),
                }),
              ],
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'title',
              title: 'Client-Facing Title',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Client-Facing Caption',
              type: 'text',
              rows: 3,
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'sourceCredit',
              title: 'Source Credit',
              type: 'string',
              description:
                'Use a manufacturer or publication credit. Do not enter House of Rose provider names.',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'sourceUrl',
              title: 'Source URL',
              type: 'url',
            }),
            defineField({
              name: 'usageApproved',
              title: 'Public Usage Approved',
              type: 'boolean',
              initialValue: false,
              description:
                'Confirm that House of Rose has permission to publish this asset.',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'consentConfirmed',
              title: 'Before/After Publication Consent Confirmed',
              type: 'boolean',
              initialValue: false,
              hidden: ({ parent }) => parent?.kind !== 'before-after',
              description:
                'For before/after media only: confirm the source supplied the image for marketing use and subject publication consent is documented.',
              validation: (R) =>
                R.custom((value, context) =>
                  context.parent && (context.parent as { kind?: string }).kind === 'before-after' && value !== true
                    ? 'Before/after media requires confirmed publication consent.'
                    : true,
                ),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'sourceCredit',
              media: 'image',
            },
          },
        },
      ],
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'researchReferences',
      title: 'Published Research',
      type: 'array',
      description:
        'Plain-language summaries of applicable cosmetic-use studies. State the study design and limitations; never describe a study as proof or a guarantee.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Study Title',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'journal',
              title: 'Journal',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'year',
              title: 'Publication Year',
              type: 'number',
              validation: (R) => R.required().integer().min(2000).max(2100),
            }),
            defineField({
              name: 'studyType',
              title: 'Study Type',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'summary',
              title: 'What It Suggests',
              type: 'text',
              rows: 3,
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'limitations',
              title: 'Important Limitations',
              type: 'text',
              rows: 3,
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'url',
              title: 'Published Source URL',
              type: 'url',
              validation: (R) =>
                R.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              journal: 'journal',
              year: 'year',
            },
            prepare: ({ title, journal, year }) => ({
              title,
              subtitle: [journal, year].filter(Boolean).join(' · '),
            }),
          },
        },
      ],
      validation: (R) => R.max(6),
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
      initialValue: 'proposed',
      options: {
        list: [
          { title: 'Live', value: 'live' },
          { title: 'Proposed', value: 'proposed' },
          { title: 'Parked', value: 'parked' },
          { title: 'Actual Menu', value: 'actual-menu' },
          { title: 'Duplicate', value: 'duplicate' },
        ],
      },
      validation: (R) => R.required(),
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
    defineField({
      name: 'serviceKey',
      title: 'Immutable Google Service Key',
      type: 'string',
      description: 'Stable operations key. Do not change after Google setup.',
      readOnly: ({ document }) => Boolean(document?._createdAt && document?.serviceKey),
      validation: (R) => R.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: 'lowercase kebab-case' }),
    }),
    defineField({
      name: 'googleBusinessProfile',
      title: 'Google Business Profile',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Include in GBP Manifest', type: 'boolean', initialValue: false }),
        defineField({ name: 'categoryId', title: 'Google Service Category / Group ID', type: 'string' }),
        defineField({ name: 'displayName', title: 'Approved Display Name', type: 'string', validation: (R) => R.max(140) }),
        defineField({ name: 'description', title: 'Approved GBP Description', type: 'text', rows: 4, validation: (R) => R.max(300) }),
        defineField({
          name: 'priceMode',
          title: 'Price Mode',
          type: 'string',
          readOnly: true,
          initialValue: 'none',
          options: { list: [{ title: 'No price', value: 'none' }] },
        }),
        defineField({
          name: 'reconciliationStatus',
          title: 'Reconciliation Status',
          type: 'string',
          options: {
            list: [
              { title: 'Draft', value: 'draft' },
              { title: 'Reviewed', value: 'reviewed' },
              { title: 'Matches GBP', value: 'matched' },
              { title: 'Needs Update', value: 'needs-update' },
            ],
          },
          initialValue: 'draft',
        }),
      ],
    }),
    defineField({
      name: 'googleAds',
      title: 'Google Ads',
      type: 'object',
      fields: [
        defineField({ name: 'eligible', title: 'Eligible for Search Ads', type: 'boolean', initialValue: false }),
        defineField({ name: 'campaignKey', title: 'Campaign Key', type: 'string' }),
        defineField({ name: 'adGroupKey', title: 'Ad Group Key', type: 'string' }),
        defineField({
          name: 'policyClass',
          title: 'Policy Class',
          type: 'string',
          options: {
            list: [
              { title: 'Standard Aesthetics', value: 'standard-aesthetics' },
              { title: 'Advanced Provider-Led', value: 'advanced-provider-led' },
              { title: 'Injectables — Restricted Review', value: 'injectables-review' },
              { title: 'Not Eligible', value: 'not-eligible' },
            ],
          },
        }),
        defineField({ name: 'landingPage', title: 'Ads Landing Page', type: 'url' }),
        defineField({
          name: 'conversionGoalKey',
          title: 'Primary Conversion Goal',
          type: 'string',
          options: {
            list: [
              { title: 'Generate Lead', value: 'generate_lead' },
              { title: 'Consultation Booked', value: 'consultation_booked' },
            ],
          },
          initialValue: 'generate_lead',
        }),
        defineField({
          name: 'reviewState',
          title: 'Ads Review State',
          type: 'string',
          options: {
            list: [
              { title: 'Draft', value: 'draft' },
              { title: 'Approved', value: 'approved' },
              { title: 'Blocked', value: 'blocked' },
            ],
          },
          initialValue: 'draft',
        }),
      ],
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRank', by: [{ field: 'orderRank', direction: 'asc' }] },
    { title: 'Title A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'collection.title', media: 'image' },
  },
});
