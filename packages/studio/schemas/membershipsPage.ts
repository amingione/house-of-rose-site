import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Rose Circle page (/memberships). This page is intentionally
 * provider-lane based and consultation-first. Public tier pricing and preset
 * package selection do not belong here.
 */
export const membershipsPage = defineType({
  name: 'membershipsPage',
  title: 'Memberships Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'idea', title: 'The Idea' },
    { name: 'commitment', title: '6-Month Commitment' },
    { name: 'lanes', title: 'Provider Lanes' },
    { name: 'scanner', title: 'AI Skin Scanner' },
    { name: 'pathway', title: 'The Pathway' },
    { name: 'methodTeaser', title: 'Rose Method Teaser' },
    { name: 'finalCta', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'hero' }),

    defineField({ name: 'ideaKicker', title: 'Kicker', type: 'string', group: 'idea' }),
    defineField({ name: 'ideaHeading', title: 'Heading', type: 'text', rows: 2, group: 'idea' }),
    defineField({ name: 'ideaBody', title: 'Body', type: 'text', rows: 4, group: 'idea' }),

    defineField({ name: 'commitmentKicker', title: 'Kicker', type: 'string', group: 'commitment' }),
    defineField({ name: 'commitmentHeading', title: 'Heading', type: 'text', rows: 2, group: 'commitment' }),
    defineField({ name: 'commitmentBody', title: 'Body', type: 'text', rows: 5, group: 'commitment' }),

    defineField({ name: 'lanesKicker', title: 'Kicker', type: 'string', group: 'lanes' }),
    defineField({ name: 'lanesHeading', title: 'Heading', type: 'text', rows: 2, group: 'lanes' }),
    defineField({ name: 'lanesIntro', title: 'Intro', type: 'text', rows: 4, group: 'lanes' }),
    defineField({
      name: 'lanes',
      title: 'Provider Lanes',
      type: 'array',
      group: 'lanes',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Lane Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'provider', title: 'Provider', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (R) => R.required() }),
            defineField({ name: 'includes', title: 'Includes', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name', subtitle: 'provider' } },
        },
      ],
      validation: (R) => R.max(8),
    }),

    defineField({ name: 'scannerKicker', title: 'Kicker', type: 'string', group: 'scanner' }),
    defineField({ name: 'scannerHeading', title: 'Heading', type: 'text', rows: 2, group: 'scanner' }),
    defineField({ name: 'scannerBody', title: 'Body', type: 'text', rows: 4, group: 'scanner' }),
    defineField({ name: 'scannerPoints', title: 'Scanner Points', type: 'array', of: [{ type: 'string' }], group: 'scanner' }),

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

    defineField({ name: 'teaserKicker', title: 'Kicker', type: 'string', group: 'methodTeaser' }),
    defineField({ name: 'teaserHeading', title: 'Heading', type: 'text', rows: 2, group: 'methodTeaser' }),
    defineField({ name: 'teaserBody', title: 'Body', type: 'text', rows: 4, group: 'methodTeaser' }),
    defineField({ name: 'teaserCtaText', title: 'CTA Text', type: 'string', group: 'methodTeaser' }),

    defineField({ name: 'finalKicker', title: 'Kicker', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalHeading', title: 'Heading', type: 'text', rows: 2, group: 'finalCta' }),
    defineField({ name: 'finalBody', title: 'Body', type: 'text', rows: 3, group: 'finalCta' }),
    defineField({ name: 'finalCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'finalCta' }),
  ],
  preview: { prepare: () => ({ title: 'Memberships Page Content' }) },
});
