import { defineField, defineType } from 'sanity';

/**
 * Retail brand storefront copy — the story block shown on /shop for each
 * carried line (Procell, GlyMed+, Skin Script, Face Reality, House of Rose).
 *
 * Distinct from `brandProfile` (House of Rose's own brand-voice/strategy doc).
 * This is product-line marketing copy, editable without a code change.
 */
export const shopBrand = defineType({
  name: 'shopBrand',
  title: 'Shop Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Brand Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'brandKey',
      title: 'Brand Key',
      type: 'string',
      description: 'Must match the "Brand" value used on Product documents.',
      options: {
        list: [
          { title: 'Procell Therapies', value: 'Procell' },
          { title: 'GlyMed+', value: 'glymed' },
          { title: 'Skin Script', value: 'skin-script' },
          { title: 'Face Reality', value: 'face-reality' },
          { title: 'House of Rose', value: 'house-of-rose' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-liner under the brand name.',
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'text',
      rows: 5,
      description: 'The paragraph introducing this brand — why we carry it, who it\'s for.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero / Spotlight Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Shop Brand CTA Text',
      type: 'string',
      description: 'Free text — e.g. "Shop Procell", "Explore the Line", "See the Collection". No platform names.',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Direct Shop URL',
      type: 'url',
      description: 'Optional — link straight to this brand\'s checkout page once available. If blank, the CTA scrolls to this brand\'s section on /shop.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Lower numbers show first on /shop.',
    }),
  ],
  orderings: [
    { title: 'Manual Order', name: 'orderRankAsc', by: [{ field: 'orderRank', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'logo' },
  },
});
