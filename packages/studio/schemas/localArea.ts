import { defineField, defineType } from 'sanity';

/**
 * Local Area — AEO page type #5 (local authority, "treatment in {city}").
 * Route: /areas/[slug]. JSON-LD: LocalBusiness (areaServed) + BreadcrumbList + FAQPage.
 * See docs/CONTENT-MODEL-MAP.md.
 */
export const localArea = defineType({
  name: 'localArea',
  title: 'Local Area',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Advanced Aesthetics in Port Charlotte, FL" or "PRF Microneedling in Punta Gorda".',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'region', title: 'Region', type: 'string', initialValue: 'Charlotte County, FL' }),
    defineField({
      name: 'intro',
      title: 'Intro / Direct Answer',
      type: 'text',
      rows: 3,
      description: 'Answer-first: who we serve in this area and what for, in plain language.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'whyLocal',
      title: 'Why House of Rose Here',
      type: 'text',
      rows: 5,
      description: 'Local expertise/authority signals — proximity, who travels to us, area-specific notes.',
    }),
    defineField({
      name: 'servedServices',
      title: 'Featured Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      description: 'Services to highlight for this area (each links to its canonical hub).',
    }),
    defineField({
      name: 'neighborhoods',
      title: 'Neighborhoods / Nearby',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Nearby neighborhoods or towns served from this location.',
    }),
    defineField({ name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }] }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'city', media: 'image' } },
});
