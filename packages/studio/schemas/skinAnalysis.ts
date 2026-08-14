import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Advanced Skin Imaging & Analysis page (/skin-analysis) — migrated from the
 * hardcoded skin-analysis.astro. The current public route uses a reviewed local
 * sequence and concern-link set rather than the legacy fields below. Retain those
 * fields for source compatibility, but do not present them as active authoring.
 */
export const skinAnalysis = defineType({
  name: 'skinAnalysis',
  title: 'Advanced Skin Imaging & Analysis Page (not published)',
  type: 'document',
  readOnly: true,
  description: 'Stored for source compatibility. The current /skin-analysis/ route uses reviewed website content.',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero (not published)' },
    { name: 'whatItIs', title: 'What It Is (not published)' },
    { name: 'howItWorks', title: 'How It Works (not published)' },
    { name: 'lookAt', title: 'What We Look At (not published)' },
    { name: 'whyItMatters', title: 'Why It Matters (not published)' },
    { name: 'toPlan', title: 'From Analysis to Plan (not published)' },
    { name: 'faq', title: 'FAQ (not published)' },
    { name: 'cta', title: 'Final CTA (not published)' },
    { name: 'seo', title: 'SEO (not published)' },
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
    defineField({ name: 'howKicker', title: 'Kicker', type: 'string', group: 'howItWorks', hidden: true }),
    defineField({ name: 'howHeading', title: 'Heading', type: 'string', group: 'howItWorks', hidden: true }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'howItWorks',
      hidden: true,
      description: 'Legacy source field. The reviewed public page does not publish this numbered process sequence.',
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
    defineField({ name: 'planKicker', title: 'Kicker', type: 'string', group: 'toPlan', hidden: true }),
    defineField({ name: 'planHeading', title: 'Heading', type: 'string', group: 'toPlan', hidden: true }),
    defineField({ name: 'planPara', title: 'Paragraph', type: 'text', rows: 3, group: 'toPlan', hidden: true }),
    defineField({
      name: 'concernLinks',
      title: 'Concern Links',
      type: 'array',
      group: 'toPlan',
      hidden: true,
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
  preview: { prepare: () => ({ title: 'Advanced Skin Imaging & Analysis Page Content (not published)' }) },
});
