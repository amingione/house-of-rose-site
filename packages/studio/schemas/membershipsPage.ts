import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Memberships page (/memberships) — migrated from hardcoded
 * memberships.astro so all marketing copy is editable in the Studio + Netlify
 * Visual Editor. This models the PAGE's own copy only.
 *
 * NOTE: This is separate from the `membership` document type (lane memberships)
 * and the MembershipTiers component. The three Rose Circle tier cards on this
 * page are page-specific marketing content, so they live here as an array.
 */
export const membershipsPage = defineType({
  name: 'membershipsPage',
  title: 'Memberships Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'idea', title: 'The Idea' },
    { name: 'tiers', title: 'The Three Tiers' },
    { name: 'pathway', title: 'The Pathway' },
    { name: 'plansTeaser', title: 'Plans Teaser' },
    { name: 'finalCta', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'hero' }),

    // ── The Idea ──
    defineField({ name: 'ideaKicker', title: 'Kicker', type: 'string', group: 'idea' }),
    defineField({ name: 'ideaHeading', title: 'Heading', type: 'text', rows: 2, group: 'idea' }),
    defineField({ name: 'ideaBody', title: 'Body', type: 'text', rows: 4, group: 'idea' }),

    // ── The Three Tiers ──
    defineField({ name: 'tiersKicker', title: 'Kicker', type: 'string', group: 'tiers' }),
    defineField({ name: 'tiersHeading', title: 'Heading', type: 'string', group: 'tiers' }),
    defineField({
      name: 'tiers',
      title: 'Tiers',
      type: 'array',
      group: 'tiers',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'french', title: 'French Subtitle', type: 'string', description: 'e.g. "In full bloom" — optional.' }),
            defineField({ name: 'price', title: 'Price (monthly, number only)', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'tagline', title: 'Tagline', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'builtFor', title: 'Built For', type: 'text', rows: 3, validation: (R) => R.required() }),
            defineField({ name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
            defineField({ name: 'featured', title: 'Featured (Most Loved)', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'name', subtitle: 'tagline' } },
        },
      ],
      validation: (R) => R.max(6),
    }),
    defineField({ name: 'tiersFootnote', title: 'Footnote', type: 'text', rows: 4, group: 'tiers' }),

    // ── The Pathway ──
    defineField({ name: 'pathwayKicker', title: 'Kicker', type: 'string', group: 'pathway' }),
    defineField({ name: 'pathwayHeading', title: 'Heading', type: 'string', group: 'pathway' }),
    defineField({
      name: 'pathway',
      title: 'Pathway Steps',
      type: 'array',
      group: 'pathway',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'step', subtitle: 'body' } },
        },
      ],
      validation: (R) => R.max(6),
    }),

    // ── Plans Teaser ──
    defineField({ name: 'teaserKicker', title: 'Kicker', type: 'string', group: 'plansTeaser' }),
    defineField({ name: 'teaserHeading', title: 'Heading', type: 'text', rows: 2, group: 'plansTeaser' }),
    defineField({ name: 'teaserBody', title: 'Body', type: 'text', rows: 4, group: 'plansTeaser' }),
    defineField({ name: 'teaserCtaText', title: 'CTA Text', type: 'string', group: 'plansTeaser' }),

    // ── Final CTA ──
    defineField({ name: 'finalKicker', title: 'Kicker', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalHeading', title: 'Heading', type: 'text', rows: 2, group: 'finalCta' }),
    defineField({ name: 'finalBody', title: 'Body', type: 'text', rows: 3, group: 'finalCta' }),
    defineField({ name: 'finalCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'finalCta' }),
  ],
  preview: { prepare: () => ({ title: 'Memberships Page Content' }) },
});
