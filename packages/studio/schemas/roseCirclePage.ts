import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Rose Circle page (/rose-circle). The Rose Circle is not a
 * membership — it is the direct client affiliation with House of Rose that
 * unlocks the fully immersive, provider-guided experience. This page is
 * customer-facing brand copy: it outlines the Rose Method's four phases and
 * the intent behind each, not an internal provider/lane roster. Actual
 * recurring memberships (Rose Pass, IV Hydration Membership, Collagen Bank)
 * live on the separate /memberships page.
 */
export const roseCirclePage = defineType({
  name: 'roseCirclePage',
  title: 'Rose Circle Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'idea', title: 'The Idea' },
    { name: 'start', title: 'How It Begins' },
    { name: 'phases', title: 'The Four Phases' },
    { name: 'commitment', title: 'The Commitment' },
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
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero', description: 'Single hero CTA by design — booking is already covered by the persistent header "Book Now" button.' }),

    defineField({ name: 'ideaKicker', title: 'Kicker', type: 'string', group: 'idea' }),
    defineField({ name: 'ideaHeading', title: 'Heading', type: 'text', rows: 2, group: 'idea', description: 'The brand’s core differentiator line — lead with it.' }),
    defineField({ name: 'ideaBody', title: 'Body', type: 'text', rows: 4, group: 'idea' }),

    defineField({ name: 'startKicker', title: 'Kicker', type: 'string', group: 'start' }),
    defineField({ name: 'startHeading', title: 'Heading', type: 'text', rows: 2, group: 'start' }),
    defineField({ name: 'startBody', title: 'Body', type: 'text', rows: 4, group: 'start' }),

    defineField({ name: 'phasesKicker', title: 'Kicker', type: 'string', group: 'phases' }),
    defineField({ name: 'phasesHeading', title: 'Heading', type: 'text', rows: 2, group: 'phases' }),
    defineField({ name: 'phasesIntro', title: 'Intro', type: 'text', rows: 4, group: 'phases' }),
    defineField({
      name: 'phases',
      title: 'The Four Phases',
      type: 'array',
      group: 'phases',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Phase Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'intent', title: 'Intent (why this phase exists)', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'name', subtitle: 'intent' } },
        },
      ],
      validation: (R) => R.max(4),
    }),

    defineField({ name: 'commitmentKicker', title: 'Kicker', type: 'string', group: 'commitment' }),
    defineField({ name: 'commitmentHeading', title: 'Heading', type: 'text', rows: 2, group: 'commitment' }),
    defineField({ name: 'commitmentBody', title: 'Body', type: 'text', rows: 5, group: 'commitment' }),

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
  preview: { prepare: () => ({ title: 'Rose Circle Page Content' }) },
});
