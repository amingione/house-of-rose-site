import { defineField, defineType } from 'sanity';
import { validatePublicCopy } from '../validation/publicCopy';

/**
 * Shared SEO object — reused across AEO page-type documents.
 * See docs/SEO-AEO-PLAYBOOK.md §4 for the structured-data contract.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsed: true, collapsible: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Name the page and its primary entity naturally, ≤ ~60 chars. Falls back to the document title.',
      validation: (R) => [
        R.max(60).warning('Keep at or under 60 characters for full SERP display.'),
        R.custom(validatePublicCopy),
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Describe the page’s specific, verified value naturally, ≤ ~155 chars. Do not force a question-and-answer formula.',
      validation: (R) => [
        R.max(160).warning('Keep at or under 160 characters.'),
        R.custom(validatePublicCopy),
      ],
    }),
  ],
});
