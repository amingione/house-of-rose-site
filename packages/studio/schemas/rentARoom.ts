import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Rent a Suite page (/rent-a-room) — migrated from hardcoded
 * rent-a-room.astro so all marketing copy is editable in the Studio + Netlify
 * Visual Editor. The Netlify application <form> and its <style> block stay in
 * the template (not content) and are intentionally NOT modeled here.
 */
export const rentARoom = defineType({
  name: 'rentARoom',
  title: 'Rent a Suite Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'perks', title: "What's Included" },
    { name: 'specs', title: 'Room Specs' },
    { name: 'cta', title: 'CTA Aside' },
    { name: 'candidates', title: "Who We're Looking For" },
    { name: 'apply', title: 'Apply Section' },
    { name: 'bottomCta', title: 'Bottom CTA Bar' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'hero' }),

    // ── What's Included ──
    defineField({ name: 'perksKicker', title: 'Kicker', type: 'string', group: 'perks' }),
    defineField({ name: 'perksHeading', title: 'Heading', type: 'string', group: 'perks' }),
    defineField({ name: 'perksIntro', title: 'Intro', type: 'text', rows: 2, group: 'perks' }),
    defineField({
      name: 'perks',
      title: 'Perks',
      type: 'array',
      group: 'perks',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'kicker', title: 'Kicker', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'kicker' } },
        },
      ],
      validation: (R) => R.max(8),
    }),

    // ── Room Specs ──
    defineField({ name: 'specsKicker', title: 'Kicker', type: 'string', group: 'specs' }),
    defineField({ name: 'specsHeading', title: 'Heading', type: 'string', group: 'specs' }),
    defineField({
      name: 'roomSpecs',
      title: 'Room Specifications',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
      validation: (R) => R.max(12),
    }),

    // ── CTA Aside ──
    defineField({ name: 'ctaKicker', title: 'Kicker', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaHeading', title: 'Heading', type: 'text', rows: 2, group: 'cta', description: 'Use a line break for the second line.' }),
    defineField({ name: 'ctaBody', title: 'Body', type: 'text', rows: 3, group: 'cta' }),
    defineField({ name: 'ctaButtonText', title: 'Button Text', type: 'string', group: 'cta' }),

    // ── Who We're Looking For ──
    defineField({ name: 'candidatesKicker', title: 'Kicker', type: 'string', group: 'candidates' }),
    defineField({ name: 'candidatesHeading', title: 'Heading', type: 'string', group: 'candidates' }),
    defineField({ name: 'candidatesIntro', title: 'Intro', type: 'text', rows: 2, group: 'candidates' }),
    defineField({
      name: 'candidates',
      title: 'Ideal Candidates',
      type: 'array',
      group: 'candidates',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Number', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'number' } },
        },
      ],
      validation: (R) => R.max(6),
    }),

    // ── Apply Section ──
    defineField({ name: 'applyKicker', title: 'Kicker', type: 'string', group: 'apply' }),
    defineField({ name: 'applyHeading', title: 'Heading', type: 'string', group: 'apply' }),
    defineField({ name: 'applyIntro', title: 'Intro', type: 'text', rows: 2, group: 'apply' }),

    // ── Bottom CTA Bar ──
    defineField({ name: 'bottomCtaKicker', title: 'Kicker', type: 'string', group: 'bottomCta' }),
    defineField({ name: 'bottomCtaText', title: 'Text', type: 'text', rows: 2, group: 'bottomCta' }),
  ],
  preview: { prepare: () => ({ title: 'Rent a Suite Page Content' }) },
});
