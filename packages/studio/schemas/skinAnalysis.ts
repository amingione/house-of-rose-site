import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Advanced Skin Imaging & Analysis page (/skin-analysis) — migrated from the
 * hardcoded skin-analysis.astro so all copy is editable in the Studio + Netlify
 * Visual Editor. Section background/feature images stay as static asset paths in
 * the template. The concern-link slugs are fixed routes and stay in the template;
 * only their labels are editable here.
 */
export const skinAnalysis = defineType({
  name: 'skinAnalysis',
  title: 'Advanced Skin Imaging & Analysis Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'whatItIs', title: 'What It Is' },
    { name: 'howItWorks', title: 'How It Works' },
    { name: 'lookAt', title: 'What We Look At' },
    { name: 'whyItMatters', title: 'Why It Matters' },
    { name: 'toPlan', title: 'From Analysis to Plan' },
    { name: 'faq', title: 'FAQ' },
    { name: 'cta', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'text', rows: 2, group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'hero' }),

    // ── What It Is ──
    defineField({ name: 'whatKicker', title: 'Kicker', type: 'string', group: 'whatItIs' }),
    defineField({ name: 'whatHeading', title: 'Heading', type: 'string', group: 'whatItIs' }),
    defineField({ name: 'whatPara1', title: 'Paragraph 1', type: 'text', rows: 4, group: 'whatItIs' }),
    defineField({ name: 'whatPara2', title: 'Paragraph 2', type: 'text', rows: 4, group: 'whatItIs' }),

    // ── How It Works ──
    defineField({ name: 'howKicker', title: 'Kicker', type: 'string', group: 'howItWorks' }),
    defineField({ name: 'howHeading', title: 'Heading', type: 'string', group: 'howItWorks' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'howItWorks',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'n', title: 'Number', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        },
      ],
      validation: (R) => R.max(6),
    }),

    // ── What We Look At ──
    defineField({ name: 'lookKicker', title: 'Kicker', type: 'string', group: 'lookAt' }),
    defineField({ name: 'lookHeading', title: 'Heading', type: 'string', group: 'lookAt' }),
    defineField({ name: 'lookPara', title: 'Paragraph', type: 'text', rows: 3, group: 'lookAt' }),
    defineField({
      name: 'looksAt',
      title: 'Markers',
      type: 'array',
      group: 'lookAt',
      of: [{ type: 'string' }],
      validation: (R) => R.max(8),
    }),

    // ── Why It Matters ──
    defineField({ name: 'whyKicker', title: 'Kicker', type: 'string', group: 'whyItMatters' }),
    defineField({ name: 'whyHeading', title: 'Heading', type: 'string', group: 'whyItMatters' }),
    defineField({ name: 'whyPara', title: 'Paragraph', type: 'text', rows: 4, group: 'whyItMatters' }),

    // ── From Analysis to Plan ──
    defineField({ name: 'planKicker', title: 'Kicker', type: 'string', group: 'toPlan' }),
    defineField({ name: 'planHeading', title: 'Heading', type: 'string', group: 'toPlan' }),
    defineField({ name: 'planPara', title: 'Paragraph', type: 'text', rows: 3, group: 'toPlan' }),
    defineField({
      name: 'concernLinks',
      title: 'Concern Links',
      type: 'array',
      group: 'toPlan',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'slug', title: 'Slug', type: 'string', description: 'e.g. fine-lines-laxity → links to /concerns/<slug>', validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'slug' } },
        },
      ],
      validation: (R) => R.max(12),
    }),

    // ── FAQ ──
    defineField({ name: 'faqKicker', title: 'Kicker', type: 'string', group: 'faq' }),
    defineField({ name: 'faqHeading', title: 'Heading', type: 'string', group: 'faq' }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'q', subtitle: 'a' } },
        },
      ],
      validation: (R) => R.max(20),
    }),

    // ── Final CTA ──
    defineField({ name: 'ctaKicker', title: 'Kicker', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaHeading', title: 'Heading', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaPara', title: 'Paragraph', type: 'text', rows: 3, group: 'cta' }),
    defineField({ name: 'ctaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Advanced Skin Imaging & Analysis Page Content' }) },
});
