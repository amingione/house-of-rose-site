import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Jane Iredale brand feature page
 * (/services/professional-makeup/jane-iredale). Introduces the brand (makeup,
 * skincare, supplements), why House of Rose uses it — including post-treatment
 * suitability and event-grade performance — and a "this-for-that" daily-routine
 * swap guide. Funnels into the Professional Makeup hub and Events pages.
 *
 * COMPLIANCE: Jane Iredale is "THE SKINCARE MAKEUP" (mineral). Describe benefits
 * neutrally. Never say "treats/cures acne" (use "breakout-prone / problem skin"),
 * never "FDA-approved" or "clinically proven". Supplements are the Advanced
 * Nutrition Programme distributed by Jane Iredale — if referenced, carry the
 * dietary-supplement disclaimer. See docs/internal_only/COMPLIANCE-COPY-RULES.md.
 */
export const janeIredalePage = defineType({
  name: 'janeIredalePage',
  title: 'Jane Iredale Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Who They Are' },
    { name: 'pillars', title: 'Makeup · Skincare · Supplements' },
    { name: 'benefits', title: 'Benefits' },
    { name: 'whyUs', title: 'Why We Use It' },
    { name: 'swaps', title: 'This-for-That Swaps' },
    { name: 'looks', title: 'Get the Look' },
    { name: 'cta', title: 'CTA / Links' },
    { name: 'faq', title: 'FAQs' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    // Hero
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    // Who they are
    defineField({ name: 'introKicker', title: 'Kicker', type: 'string', group: 'intro' }),
    defineField({ name: 'introHeading', title: 'Heading', type: 'text', rows: 2, group: 'intro' }),
    defineField({ name: 'introBody', title: 'Body', type: 'text', rows: 6, group: 'intro' }),

    // Three pillars
    defineField({ name: 'pillarsHeading', title: 'Heading', type: 'string', group: 'pillars' }),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      group: 'pillars',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required(), description: 'Makeup / Skincare / Supplements' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
            defineField({ name: 'examples', title: 'Example Products', type: 'array', of: [{ type: 'string' }] }),
          ],
          preview: { select: { title: 'name', subtitle: 'body' } },
        },
      ],
      validation: (R) => R.max(3),
    }),

    // Benefits
    defineField({ name: 'benefitsHeading', title: 'Heading', type: 'string', group: 'benefits' }),
    defineField({ name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }], group: 'benefits' }),

    // Why we use it
    defineField({ name: 'whyUsKicker', title: 'Kicker', type: 'string', group: 'whyUs' }),
    defineField({ name: 'whyUsHeading', title: 'Heading', type: 'text', rows: 2, group: 'whyUs' }),
    defineField({ name: 'whyUsBody', title: 'Body', type: 'text', rows: 6, group: 'whyUs', description: 'Post-treatment suitability (non-comedogenic, mineral SPF), event-grade performance, artist-chosen.' }),

    // This-for-that swaps
    defineField({ name: 'swapsKicker', title: 'Kicker', type: 'string', group: 'swaps' }),
    defineField({ name: 'swapsHeading', title: 'Heading', type: 'text', rows: 2, group: 'swaps' }),
    defineField({ name: 'swapsIntro', title: 'Intro', type: 'text', rows: 4, group: 'swaps' }),
    defineField({
      name: 'swaps',
      title: 'Swaps',
      type: 'array',
      group: 'swaps',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'category', title: 'Routine Step', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'conventional', title: 'Conventional Product', type: 'string' }),
            defineField({ name: 'swap', title: 'Jane Iredale Swap', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: { select: { title: 'category', subtitle: 'swap' } },
        },
      ],
    }),

    // Get the look (anonymized signature looks — no client PII/photos w/o consent)
    defineField({ name: 'looksKicker', title: 'Kicker', type: 'string', group: 'looks' }),
    defineField({ name: 'looksHeading', title: 'Heading', type: 'text', rows: 2, group: 'looks' }),
    defineField({ name: 'looksIntro', title: 'Intro', type: 'text', rows: 3, group: 'looks' }),
    defineField({
      name: 'looks',
      title: 'Signature Looks',
      type: 'array',
      group: 'looks',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Look Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
            defineField({
              name: 'steps',
              title: 'Product Breakdown',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'step', title: 'Step', type: 'string', validation: (R) => R.required() }),
                    defineField({ name: 'product', title: 'Jane Iredale Product', type: 'string' }),
                    defineField({ name: 'shade', title: 'Shade / Note', type: 'string' }),
                  ],
                  preview: { select: { title: 'step', subtitle: 'product' } },
                },
              ],
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'summary' } },
        },
      ],
    }),

    // CTA / links
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaBody', title: 'CTA Body', type: 'text', rows: 3, group: 'cta' }),
    defineField({
      name: 'relatedLinks',
      title: 'Related Links',
      type: 'array',
      group: 'cta',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'href', title: 'Href', type: 'string', validation: (R) => R.required(), description: 'Inner-page links MUST end with a trailing slash.' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),

    // Supplement disclaimer (rendered verbatim if supplements referenced)
    defineField({ name: 'supplementDisclaimer', title: 'Supplement Disclaimer', type: 'text', rows: 2, group: 'cta', description: 'FDA/FTC dietary-supplement disclaimer. Render verbatim wherever supplements are mentioned.' }),

    // FAQs
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [{ type: 'faq' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Jane Iredale Page Content' }) },
});
