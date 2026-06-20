import { defineField, defineType } from 'sanity';

/**
 * Shared FAQ object — reused across AEO page-type documents.
 * Question-shaped entries power FAQPage JSON-LD and AI Overview extraction.
 */
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'Phrase as the question a client actually asks.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      description: 'Answer-first: lead with the direct answer, then support it.',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
});
