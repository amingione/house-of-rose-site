import { defineField, defineType } from 'sanity';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../../web/src/lib/publicServiceContent';

import { validatePublicCopy } from './validation/publicCopy';

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
      title: 'Internal Title',
      type: 'string',
      description: 'Identifies and orders this record in Studio. Public headings use the City field.',
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
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'Verified community served from the single Punta Gorda practice. This becomes public page and structured-data text.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      initialValue: 'Charlotte County, FL',
      description: 'Verified public region label. Do not use this field to imply another House of Rose location.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'intro',
      title: 'Intro (not published)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Legacy source field. The public introduction is generated from the verified practice address and City field.',
    }),
    defineField({
      name: 'whyLocal',
      title: 'Location Facts (not published)',
      type: 'text',
      rows: 5,
      readOnly: true,
      description: 'Legacy source field. The current public area page does not publish this CMS section.',
    }),
    defineField({
      name: 'servedServices',
      title: 'Featured Services',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
          options: {
            filter:
              'status in ["live", "actual-menu"] && defined(slug.current) && !(slug.current in $unavailableSlugs)',
            filterParams: { unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS },
          },
        },
      ],
      description: 'Services to highlight for this area (each links to its canonical hub).',
    }),
    defineField({
      name: 'neighborhoods',
      title: 'Neighborhoods / Nearby',
      type: 'array',
      of: [{ type: 'string', validation: (R) => R.custom(validatePublicCopy) }],
      description: 'Verified nearby communities shown on the public page. They describe travel to the Punta Gorda practice, not additional locations.',
    }),
    defineField({ name: 'faqs', title: 'FAQs (not published)', type: 'array', of: [{ type: 'faq' }], readOnly: true, description: 'Legacy source field. Public area FAQs and FAQPage schema are generated together from verified practice facts.' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (R) => R.custom(validatePublicCopy) })],
    }),
    defineField({ name: 'orderRank', title: 'Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO (not published)', type: 'seo', readOnly: true, description: 'Legacy source field. Public metadata is generated from City and the verified Punta Gorda practice location.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'city', media: 'image' } },
});
