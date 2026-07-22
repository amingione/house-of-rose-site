import { defineField, defineType } from 'sanity';

/** Singleton legal content for /terms-of-service/. */
export const termsOfService = defineType({
  name: 'termsOfService',
  title: 'Terms of Service',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),
    defineField({ name: 'pageTitle', title: 'Page Title', type: 'string', group: 'content' }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'string',
      group: 'content',
      description: 'Displayed beneath the title, for example “Effective July 11, 2026.”',
    }),
    defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 4, group: 'content' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 8,
              validation: (rule) => rule.required(),
              description: 'Plain text. Use new lines for list items and include any bullet or number prefixes.',
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'body' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Terms of Service Content' }) },
});
