import { defineField, defineType } from 'sanity';

/**
 * Testimonial/Quote for display throughout the site
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
      description: 'The testimonial text',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Name of the person (optional, can be anonymous)',
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'Optional role or context (e.g., "Client since 2024")',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional background image for quote sections',
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show this testimonial on the homepage',
    }),
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'author',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? `"${title.slice(0, 60)}..."` : 'Untitled testimonial',
        subtitle: subtitle ?? 'Anonymous',
      };
    },
  },
});
