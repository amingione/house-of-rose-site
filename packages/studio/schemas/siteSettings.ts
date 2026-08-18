import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

export function validatePublicPhone(value?: string): true | string {
  const trimmed = value?.trim();
  if (!trimmed) return true;
  if (!/^[\d\s()+.-]+$/.test(trimmed)) {
    return 'Enter a US phone number using digits and conventional phone punctuation.';
  }

  const digits = trimmed.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
    ? true
    : 'Enter a 10-digit US phone number, optionally prefixed with 1.';
}

export function validatePublicAddress(value?: string): true | string {
  const normalized = value
    ?.trim()
    .replace(/\s*[\r\n]+\s*/g, ', ')
    .replace(/[\t ]+/g, ' ');
  if (!normalized) return true;

  return /^.+,\s*[^,]+,\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?$/i.test(normalized)
    ? true
    : 'Enter a street address, city, two-letter state, and ZIP code.';
}

export function validateInstagramHandle(value?: string): true | string {
  const trimmed = value?.trim();
  if (!trimmed) return true;

  return /^[A-Za-z0-9_](?:[A-Za-z0-9_]|\.(?!\.)){0,28}[A-Za-z0-9_]$/.test(trimmed) ||
    /^[A-Za-z0-9_]$/.test(trimmed)
    ? true
    : 'Enter a valid Instagram handle without @, spaces, a URL, or leading, trailing, or consecutive periods.';
}

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
      title: 'Logo (not published)',
      type: 'image',
      options: { hotspot: true },
      readOnly: true,
      description: 'Stored for source compatibility. The current website entity graph uses the reviewed local monogram asset.',
    }),
    defineField({
      name: 'socialImage',
      title: 'Default Social Share Image (not published)',
      type: 'image',
      options: { hotspot: true },
      readOnly: true,
      description: 'Stored for source compatibility. The current website uses its reviewed local social-share cover.',
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
      title: 'Primary Public Phone',
      type: 'string',
      description: 'Primary local business phone used in canonical NAP, structured data, area guidance, and AI feeds.',
      validation: (R) => R.custom(validatePublicPhone),
    }),
    defineField({
      name: 'supportPhone',
      title: 'Toll-Free Advertising & Online Support Phone',
      type: 'string',
      description: 'Separate toll-free line for advertising, carrier-required SMS disclosures, and online/order support. This is not the primary public NAP.',
      validation: (R) => R.custom(validatePublicPhone),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
      description: 'Public street address used in sitewide structured data, area guidance, and AI feeds.',
      validation: (R) => R.custom(validatePublicAddress),
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ symbol',
      validation: (R) => R.custom(validateInstagramHandle),
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Contact Email for Inquiries (not published)',
      type: 'string',
      readOnly: true,
      description: 'Stored for source compatibility. Public booking and room-rental email links use the deployment-owned PUBLIC_BOOKING_EMAIL value.',
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
