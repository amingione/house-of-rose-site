import { defineField, defineType } from 'sanity';

const THANK_YOU_COPY_NOTICE = 'Legacy source field. The current /thank-you/ route uses reviewed website content instead.';

/**
 * Source-compatible singleton for the noindex lead-confirmation page. The
 * current route owns its reviewed confirmation copy and fixed destinations.
 */
export const thankYou = defineType({
  name: 'thankYou',
  title: 'Thank You Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'content', title: 'Content (not published)' },
    { name: 'cta', title: 'Buttons (not published)' },
    { name: 'seo', title: 'SEO (not published)' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title (not published)', type: 'string', group: 'seo', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
    defineField({ name: 'seoDescription', title: 'SEO Description (not published)', type: 'text', rows: 2, group: 'seo', readOnly: true, description: THANK_YOU_COPY_NOTICE }),

    // ── Content ──
    defineField({ name: 'kicker', title: 'Kicker (not published)', type: 'string', group: 'content', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
    defineField({ name: 'heading', title: 'Heading (not published)', type: 'string', group: 'content', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
    defineField({ name: 'paragraph1', title: 'Paragraph 1 (not published)', type: 'text', rows: 3, group: 'content', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
    defineField({ name: 'paragraph2', title: 'Paragraph 2 (not published)', type: 'text', rows: 3, group: 'content', readOnly: true, description: THANK_YOU_COPY_NOTICE }),

    // ── Buttons ──
    defineField({ name: 'ctaPrimaryText', title: 'Primary CTA Text (not published)', type: 'string', group: 'cta', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
    defineField({ name: 'ctaSecondaryText', title: 'Secondary CTA Text (not published)', type: 'string', group: 'cta', readOnly: true, description: THANK_YOU_COPY_NOTICE }),
  ],
  preview: { prepare: () => ({ title: 'Thank You Page Content' }) },
});
