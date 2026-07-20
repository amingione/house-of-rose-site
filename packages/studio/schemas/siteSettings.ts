import { defineField, defineType } from 'sanity';

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
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short brand phrase shown in footer and meta',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Default meta description for SEO',
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
      title: 'Booking Email',
      type: 'string',
      description: 'Used as the mailto: link on Book Now buttons',
    }),
    defineField({
      name: 'aiSearchFaqHeading',
      title: 'Essentials FAQ — Heading',
      type: 'string',
      description: 'Heading for the “at a glance” FAQ section on /faq/ (e.g. “The Essentials”).',
    }),
    defineField({
      name: 'aiSearchFaqIntro',
      title: 'Essentials FAQ — Intro',
      type: 'text',
      rows: 2,
      description: 'Short introduction shown above the Essentials FAQ answers.',
    }),
    defineField({
      name: 'aiSearchFaqs',
      title: 'Essentials FAQ — Questions',
      type: 'array',
      of: [{ type: 'faq' }],
      description: 'Direct, plain-language answers used on /faq/, in FAQPage JSON-LD, and in the site’s text feeds.',
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
});
