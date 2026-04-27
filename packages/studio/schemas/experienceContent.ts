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
      title: 'Hero Title',
      type: 'string',
      initialValue: 'The Experience',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      initialValue: 'What to Expect',
    }),
    defineField({
      name: 'storyHeading',
      title: 'Story Heading',
      type: 'string',
      initialValue: 'Built for those who expect more.',
    }),
    defineField({
      name: 'storyParagraph1',
      title: 'Story Paragraph 1',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'storyParagraph2',
      title: 'Story Paragraph 2',
      type: 'text',
      rows: 3,
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
      title: 'Standards',
      type: 'array',
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
      description: 'The House of Rose Standard items (3 recommended)',
      validation: (R) => R.max(4),
    }),
    defineField({
      name: 'journeySteps',
      title: 'Guest Journey Steps',
      type: 'array',
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
      description: 'Timeline steps from inquiry to ongoing care (5 recommended)',
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
