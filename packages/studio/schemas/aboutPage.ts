import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

/**
 * Singleton image source for the public About hierarchy. Reviewed website
 * content currently owns the copy and metadata for /about/, /about/hra/, and
 * /about/providers/; legacy text fields remain source-compatible below.
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
    { name: 'seo', title: 'SEO (not published)' },
  ],
  fields: [
    defineField({ name: 'indexHeading', title: 'Index Heading (not published)', type: 'string', group: 'index', readOnly: true, description: 'Legacy source field. The current About index uses reviewed website copy.' }),
    defineField({ name: 'indexIntro', title: 'Index Introduction (not published)', type: 'text', rows: 4, group: 'index', readOnly: true, description: 'Legacy source field. The current About index uses reviewed website copy.' }),
    defineField({
      name: 'indexImage',
      title: 'Index Image',
      type: 'image',
      options: { hotspot: true },
      group: 'index',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (R) => R.custom(validatePublicCopy) })],
    }),

    defineField({ name: 'hraHeading', title: 'HRA Heading (not published)', type: 'string', group: 'hra', readOnly: true, description: 'Legacy source field. The current HRA page uses reviewed website copy.' }),
    defineField({ name: 'hraIntro', title: 'HRA Introduction (not published)', type: 'text', rows: 3, group: 'hra', readOnly: true, description: 'Legacy source field. The current HRA page uses reviewed website copy.' }),
    defineField({
      name: 'hraParagraphs',
      title: 'HRA Body (not published)',
      type: 'array',
      group: 'hra',
      readOnly: true,
      description: 'Legacy source field. The current HRA page uses reviewed website copy and does not publish these paragraphs.',
      of: [{ type: 'text', rows: 5 }],
      validation: (R) => R.max(6),
    }),
    defineField({
      name: 'hraImage',
      title: 'HRA Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hra',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (R) => R.custom(validatePublicCopy) })],
    }),

    defineField({ name: 'providersHeading', title: 'Providers Heading (not published)', type: 'string', group: 'providers', readOnly: true, description: 'Legacy source field. The provider directory uses reviewed website copy.' }),
    defineField({ name: 'providersIntro', title: 'Providers Introduction (not published)', type: 'text', rows: 4, group: 'providers', readOnly: true, description: 'Legacy source field. The provider directory uses reviewed website copy.' }),

    defineField({ name: 'indexSeo', title: 'About Index SEO (not published)', type: 'seo', group: 'seo', readOnly: true, description: 'Legacy source field. Current About index metadata comes from the reviewed website content.' }),
    defineField({ name: 'hraSeo', title: 'HRA Page SEO (not published)', type: 'seo', group: 'seo', readOnly: true, description: 'Legacy source field. Current HRA metadata comes from the reviewed website content.' }),
    defineField({ name: 'providersSeo', title: 'Providers Page SEO (not published)', type: 'seo', group: 'seo', readOnly: true, description: 'Legacy source field. Current provider-directory metadata comes from the reviewed website content.' }),
  ],
  preview: {
    prepare: () => ({ title: 'About Section' }),
  },
});
