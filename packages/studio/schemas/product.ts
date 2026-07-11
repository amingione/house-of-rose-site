import { defineField, defineType } from 'sanity';

/**
 * Retail product (skincare, candles, gift cards, etc.)
 * Sanity is the single source of truth — no Medusa, no external commerce.
 * For booking/purchasing, link out to a booking URL or email.
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          { title: 'ProCell Therapies', value: 'procell' },
          { title: 'GlyMed+', value: 'glymed' },
          { title: 'Skin Script', value: 'skin-script' },
          { title: 'Face Reality', value: 'face-reality' },
          { title: 'House of Rose', value: 'house-of-rose' },
        ],
      },
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g. "30ml", "6.75 oz", "Set of 5 pairs"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'price',
      title: 'Price (cents)',
      type: 'number',
      description: 'Store in cents, e.g. 4500 = $45.00',
      validation: (R) => R.min(0),
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
      name: 'category',
      title: 'Category',
      type: 'string',
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
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'purchaseUrl',
      title: 'Purchase / Booking URL',
      type: 'url',
      description: 'External link (booking system, Square, etc.) if not selling directly through the site',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Shop Button Text',
      type: 'string',
      description:
        'Custom copy for this product\'s shop button, e.g. "Shop the Set", "Add to Routine", "Restock Now". ' +
        'Never reference the checkout platform by name — clients don\'t need to know. Leave blank to use a ' +
        'category-appropriate default.',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional ribbon/tag on the product card — free text, e.g. "Bestseller", "New", "Back in Stock", "Limited". Leave blank for none.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured (Top Sellers)',
      type: 'boolean',
      description: 'Show this product in the Top Sellers rail on the shop page.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
});
