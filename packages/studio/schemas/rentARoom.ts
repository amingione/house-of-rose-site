import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

const RENTAL_COPY_NOTICE = 'Legacy source field. The current /rent-a-room/ route uses reviewed website content instead.';

/**
 * Singleton source for the currently published room specifications. Reviewed
 * website content owns the rest of /rent-a-room/; legacy copy remains stored
 * below for source compatibility. The application form stays in the template.
 */
export const rentARoom = defineType({
  name: 'rentARoom',
  title: 'Rent a Suite Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero (not published)' },
    { name: 'perks', title: "What's Included (not published)" },
    { name: 'specs', title: 'Room Specifications' },
    { name: 'cta', title: 'CTA Aside (not published)' },
    { name: 'candidates', title: "Who We're Looking For (not published)" },
    { name: 'apply', title: 'Apply Section (not published)' },
    { name: 'bottomCta', title: 'Bottom CTA Bar (not published)' },
    { name: 'seo', title: 'SEO (not published)' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title (not published)', type: 'string', group: 'seo', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'seoDescription', title: 'SEO Description (not published)', type: 'text', rows: 3, group: 'seo', readOnly: true, description: RENTAL_COPY_NOTICE }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker (not published)', type: 'string', group: 'hero', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'heroTitle', title: 'Title (not published)', type: 'string', group: 'hero', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'heroDescription', title: 'Description (not published)', type: 'text', rows: 3, group: 'hero', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text (not published)', type: 'string', group: 'hero', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text (not published)', type: 'string', group: 'hero', readOnly: true, description: RENTAL_COPY_NOTICE }),

    // ── What's Included ──
    defineField({ name: 'perksKicker', title: 'Kicker (not published)', type: 'string', group: 'perks', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'perksHeading', title: 'Heading (not published)', type: 'string', group: 'perks', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'perksIntro', title: 'Intro (not published)', type: 'text', rows: 2, group: 'perks', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({
      name: 'perks',
      title: 'Perks (not published)',
      type: 'array',
      group: 'perks',
      readOnly: true,
      description: RENTAL_COPY_NOTICE,
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
    defineField({ name: 'specsKicker', title: 'Kicker (not published)', type: 'string', group: 'specs', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'specsHeading', title: 'Heading (not published)', type: 'string', group: 'specs', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({
      name: 'roomSpecs',
      title: 'Published Room Specifications',
      type: 'array',
      group: 'specs',
      description: 'Verified current room, rate, and renter-requirement facts shown on the public page.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required().custom(validatePublicCopy) }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (R) => R.required().custom(validatePublicCopy) }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
      validation: (R) => R.max(12),
    }),

    // ── CTA Aside ──
    defineField({ name: 'ctaKicker', title: 'Kicker (not published)', type: 'string', group: 'cta', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'ctaHeading', title: 'Heading (not published)', type: 'text', rows: 2, group: 'cta', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'ctaBody', title: 'Body (not published)', type: 'text', rows: 3, group: 'cta', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'ctaButtonText', title: 'Button Text (not published)', type: 'string', group: 'cta', readOnly: true, description: RENTAL_COPY_NOTICE }),

    // ── Who We're Looking For ──
    defineField({ name: 'candidatesKicker', title: 'Kicker (not published)', type: 'string', group: 'candidates', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'candidatesHeading', title: 'Heading (not published)', type: 'string', group: 'candidates', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'candidatesIntro', title: 'Intro (not published)', type: 'text', rows: 2, group: 'candidates', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({
      name: 'candidates',
      title: 'Ideal Candidates (not published)',
      type: 'array',
      group: 'candidates',
      readOnly: true,
      description: RENTAL_COPY_NOTICE,
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
    defineField({ name: 'applyKicker', title: 'Kicker (not published)', type: 'string', group: 'apply', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'applyHeading', title: 'Heading (not published)', type: 'string', group: 'apply', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'applyIntro', title: 'Intro (not published)', type: 'text', rows: 2, group: 'apply', readOnly: true, description: RENTAL_COPY_NOTICE }),

    // ── Bottom CTA Bar ──
    defineField({ name: 'bottomCtaKicker', title: 'Kicker (not published)', type: 'string', group: 'bottomCta', readOnly: true, description: RENTAL_COPY_NOTICE }),
    defineField({ name: 'bottomCtaText', title: 'Text (not published)', type: 'text', rows: 2, group: 'bottomCta', readOnly: true, description: RENTAL_COPY_NOTICE }),
  ],
  preview: { prepare: () => ({ title: 'Rent a Suite Page Content' }) },
});
