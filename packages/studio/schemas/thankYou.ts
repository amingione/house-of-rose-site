import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Thank You page (/thank-you) — migrated from hardcoded
 * thank-you.astro so all copy is editable in the Studio + Netlify Visual
 * Editor. Utility/confirmation page shown after a lead is submitted; it stays
 * noindex in the template. The two CTA links (Back to Home / Book Online) keep
 * their hardcoded hrefs — only the button labels are editable here.
 */
export const thankYou = defineType({
  name: 'thankYou',
  title: 'Thank You Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'cta', title: 'Buttons' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),

    // ── Content ──
    defineField({ name: 'kicker', title: 'Kicker', type: 'string', group: 'content', description: 'Small uppercase label above the heading.' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({ name: 'paragraph1', title: 'Paragraph 1', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'paragraph2', title: 'Paragraph 2', type: 'text', rows: 3, group: 'content' }),

    // ── Buttons ──
    defineField({ name: 'ctaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'cta', description: 'Back to Home button label.' }),
    defineField({ name: 'ctaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'cta', description: 'Book Online button label.' }),
  ],
  preview: { prepare: () => ({ title: 'Thank You Page Content' }) },
});
