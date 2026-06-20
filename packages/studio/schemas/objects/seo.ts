import { defineField, defineType } from 'sanity';

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
      description: 'Answer-led, ≤ ~60 chars. Falls back to the document title.',
      validation: (R) => R.max(70).warning('Keep under ~60 characters for full SERP display.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'Direct answer to the page question, ≤ ~155 chars.',
      validation: (R) => R.max(170).warning('Keep under ~155 characters.'),
    }),
  ],
});
