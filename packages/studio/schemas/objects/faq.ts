import { defineField, defineType } from 'sanity';
import { validatePublicCopy } from '../validation/publicCopy';

/**
 * Shared FAQ object — reused across AEO page-type documents when a real client
 * question is clearer than covering the same fact in ordinary page copy.
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
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      description: 'Give the useful answer promptly, then add the context the client needs. Do not force every answer into the same sentence pattern.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
});
