import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Privacy Policy page (/privacy-policy) — migrated from the
 * hardcoded privacy-policy.astro so all legal copy is editable in the Studio +
 * Netlify Visual Editor.
 *
 * The body is modeled as an array of `{ heading, body }` sections (plain text)
 * for the easiest possible editing. The page's data-request <form> stays in the
 * template and is NOT modeled here. Bullet/number prefixes live inside the body
 * text (rendered with `whitespace-pre-line`), so list items remain editable as
 * plain paragraphs.
 */
export const privacyPolicy = defineType({
  name: 'privacyPolicy',
  title: 'Privacy Policy',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),

    // ── Page-level content ──
    defineField({ name: 'pageTitle', title: 'Page Title', type: 'string', group: 'content' }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'string',
      group: 'content',
      description: 'Optional — e.g. "Updated June 2026". Shown above the intro if set.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Lead paragraph shown under the title.',
    }),

    // ── Body sections ──
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 6,
              validation: (R) => R.required(),
              description: 'Plain text. Use new lines for list items (include any "•" or "1." prefix).',
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'body' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Privacy Policy Content' }) },
});
