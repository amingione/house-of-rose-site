import { defineField, defineType } from 'sanity';

/**
 * Singleton for Experience page content
 */
export const experienceContent = defineType({
  name: 'experienceContent',
  title: 'Experience Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (suspended)',
      type: 'string',
      readOnly: true,
      description: 'The public Experience page uses reviewed local copy during the voice reset.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle (suspended)',
      type: 'string',
      readOnly: true,
      description: 'The public Experience page uses reviewed local copy during the voice reset.',
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story Heading (suspended)',
      type: 'string',
      readOnly: true,
      description: 'The public Experience page uses reviewed local copy during the voice reset.',
    }),
    defineField({
      name: 'storyParagraph1',
      title: 'Story Paragraph 1 (suspended)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Not currently published. The public page uses reviewed local copy.',
    }),
    defineField({
      name: 'storyParagraph2',
      title: 'Story Paragraph 2 (suspended)',
      type: 'text',
      rows: 3,
      readOnly: true,
      description: 'Not currently published. The public page uses reviewed local copy.',
    }),
    defineField({
      name: 'storyImage',
      title: 'Story Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'standards',
      title: 'Practice Copy (suspended)',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      description: 'Not currently published. Retained only until the reviewed page model is finalized.',
      validation: (R) => R.max(4),
    }),
    defineField({
      name: 'journeySteps',
      title: 'Visit Steps (suspended)',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step Number', type: 'string', description: 'e.g., "01"', validation: (R) => R.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (R) => R.required() }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'step' },
            prepare({ title, subtitle }) {
              return {
                title: `${subtitle} - ${title}`,
              };
            },
          },
        },
      ],
      description: 'Not currently published. Do not use a process timeline as default brand copy.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Experience Page Content',
      };
    },
  },
});
