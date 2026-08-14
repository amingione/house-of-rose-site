import { defineField, defineType } from 'sanity';
import { validatePublicCopy } from './validation/publicCopy';

/**
 * Shop promotion / sale banner.
 * Fully editorial — no hardcoded CTA copy or link targets in code. A promo can
 * point either at an internal page (a promo/education page, a category anchor
 * on /shop, or a specific product detail page) or straight out to checkout.
 * Never reference the checkout platform by name in customer-facing copy.
 */
export const promotion = defineType({
  name: 'promotion',
  title: 'Shop Promotion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For the Studio list only — not shown on the site.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Name the product or inventory update plainly. Do not add urgency, a discount, or a generic benefit line.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser Copy',
      type: 'text',
      rows: 3,
      description: 'Add specific, verified product context that helps a client understand the item or restock. Avoid a generic sales line.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Use a short action that makes the destination clear. Do not mention a checkout platform.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal page (promo copy, product, or category on this site)', value: 'internal' },
          { title: 'External (checkout / booking)', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'internalPath',
      title: 'Internal Path',
      type: 'string',
      description: 'e.g. "/shop/vitamin-c-serum" or "/shop#Procell". Only used when Link Type is Internal.',
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Only used when Link Type is External.',
      hidden: ({ parent }) => parent?.linkType !== 'external',
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
      name: 'scopeBrand',
      title: 'Scope to Brand',
      type: 'string',
      description: 'Optional — only surface this promo alongside a specific brand\'s products.',
      options: {
        list: [
          { title: 'Procell Therapies', value: 'procell' },
          { title: 'GlyMed+', value: 'glymed' },
          { title: 'Skin Script', value: 'skin-script' },
          { title: 'Face Reality', value: 'face-reality' },
          { title: 'House of Rose', value: 'house-of-rose' },
        ],
      },
    }),
    defineField({
      name: 'scopeCategory',
      title: 'Scope to Category',
      type: 'string',
      description: 'Optional — only surface this promo alongside a specific product category.',
      options: {
        list: [
          { title: 'Skincare', value: 'skincare' },
          { title: 'Candles & Aromatherapy', value: 'candles' },
          { title: 'Gift Cards', value: 'gift-cards' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off instead of deleting to pause a promo.',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      description: 'Optional — promo only shows on/after this date.',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Optional — promo stops showing after this date.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Lower numbers show first.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRankAsc', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'headline', subtitle: 'teaser', media: 'image' },
  },
});
