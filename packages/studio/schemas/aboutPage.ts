import { defineField, defineType } from 'sanity';

/**
 * Singleton content source for the public About hierarchy:
 * /about/, /about/hra/, and /about/providers/.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Section',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'index', title: 'About Index' },
    { name: 'hra', title: 'HRA' },
    { name: 'providers', title: 'Providers' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'indexHeading', title: 'Index Heading', type: 'string', group: 'index' }),
    defineField({ name: 'indexIntro', title: 'Index Introduction', type: 'text', rows: 4, group: 'index' }),
    defineField({
      name: 'indexImage',
      title: 'Index Image',
      type: 'image',
      options: { hotspot: true },
      group: 'index',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    defineField({ name: 'hraHeading', title: 'HRA Heading', type: 'string', group: 'hra' }),
    defineField({ name: 'hraIntro', title: 'HRA Introduction', type: 'text', rows: 3, group: 'hra' }),
    defineField({
      name: 'hraParagraphs',
      title: 'HRA Body',
      type: 'array',
      group: 'hra',
      of: [{ type: 'text', rows: 5 }],
      validation: (R) => R.max(6),
    }),
    defineField({
      name: 'hraImage',
      title: 'HRA Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hra',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    defineField({ name: 'providersHeading', title: 'Providers Heading', type: 'string', group: 'providers' }),
    defineField({ name: 'providersIntro', title: 'Providers Introduction', type: 'text', rows: 4, group: 'providers' }),

    defineField({ name: 'indexSeo', title: 'About Index SEO', type: 'seo', group: 'seo' }),
    defineField({ name: 'hraSeo', title: 'HRA Page SEO', type: 'seo', group: 'seo' }),
    defineField({ name: 'providersSeo', title: 'Providers Page SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'About Section' }),
  },
});
