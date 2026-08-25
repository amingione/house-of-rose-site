import { defineField, defineType } from 'sanity';
import { SERVICE_OPTIONS } from '../../web/src/lib/serviceCatalog';
import { validatePublicCopy } from './validation/publicCopy';

export const validateBlogPortableText = (value: unknown): true | string => {
  if (!value || typeof value !== 'object' || !('children' in value)) return true;

  const { children } = value as { children?: unknown };
  if (!Array.isArray(children)) return true;

  const text = children
    .map((child) => {
      if (!child || typeof child !== 'object' || !('text' in child)) return '';
      const childText = (child as { text?: unknown }).text;
      return typeof childText === 'string' ? childText : '';
    })
    .join('');

  return validatePublicCopy(text);
};

export const PUBLIC_BLOG_CATEGORIES = [
  'Skin Rejuvenation',
  'IV Hydration',
  'Provider-Guided Weight Management',
  'Injectables',
  'Wellness',
  'Local Guide',
] as const;

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required().max(100).custom(validatePublicCopy),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: PUBLIC_BLOG_CATEGORIES.map((value) => ({ title: value, value })),
      },
      validation: (R) => R.custom(validatePublicCopy).valid(...PUBLIC_BLOG_CATEGORIES),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Listing summary and fallback metadata. Name the article’s specific subject naturally; do not reduce it to a generic benefit line.',
      validation: (R) => R.max(200).custom(validatePublicCopy),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (R) => R.custom(validatePublicCopy),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'Write a substantive, source-backed article in a natural voice. Use sections that help the reader; do not force a consultation, candidacy, process, or answer-first template.',
      validation: (R) => R.required().min(1),
      of: [
        {
          type: 'block',
          validation: (R) => R.custom(validateBlogPortableText),
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({ name: 'href', type: 'url', title: 'URL' }),
                  defineField({ name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: false }),
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (R) => R.custom(validatePublicCopy),
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string', validation: (R) => R.custom(validatePublicCopy) }),
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedServiceSlug',
      title: 'Related Service',
      type: 'string',
      options: { list: SERVICE_OPTIONS },
      description: 'Link to a service page for the CTA at the bottom of this post',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    { title: 'Newest First', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', publishedAt: 'publishedAt', media: 'featuredImage', category: 'category' },
    prepare({ title, publishedAt, media, category }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unpublished';
      return { title, subtitle: `${date}${category ? ` · ${category}` : ''}`, media };
    },
  },
});
