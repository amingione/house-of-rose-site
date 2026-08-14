import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Verified public business name used in default metadata and the site entity graph.',
      validation: (R) => R.required().custom(validatePublicCopy),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (not published)',
      type: 'string',
      readOnly: true,
      description: 'Retained for source compatibility; current public chrome and metadata do not use a CMS tagline.',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Public default metadata for routes without a page-specific description. Use factual practice context; useful detail is welcome.',
      validation: (R) => R.custom(validatePublicCopy),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socialImage',
      title: 'Default Social Share Image',
      type: 'image',
      options: { hotspot: true },
      description: '1200×630px recommended',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Public business email emitted in the sitewide entity graph.',
      validation: (R) => R.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ symbol',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Contact Email for Inquiries',
      type: 'string',
      description: 'Used for room-rental and other email inquiry links',
    }),
    defineField({
      name: 'aiSearchFaqHeading',
      title: 'Essentials FAQ — Heading (suspended)',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Legacy source retained for compatibility; not published by the current website or feeds.',
    }),
    defineField({
      name: 'aiSearchFaqIntro',
      title: 'Essentials FAQ — Intro (suspended)',
      type: 'text',
      rows: 2,
      readOnly: true,
      hidden: true,
      description: 'Legacy source retained for compatibility; not published by the current website or feeds.',
    }),
    defineField({
      name: 'aiSearchFaqs',
      title: 'Essentials FAQ — Questions (suspended)',
      type: 'array',
      of: [{ type: 'faq' }],
      readOnly: true,
      hidden: true,
      description: 'Legacy source retained for compatibility; not published to /faq/, JSON-LD, or text feeds.',
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
});
