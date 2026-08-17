import { defineField, defineType } from 'sanity';

import { validatePublicCopy } from './validation/publicCopy';

export function validateTermsPublicCopy(value: string | undefined): true | string {
  const complianceAwareCopy = value
    ?.replace(/\bno result is guaranteed\b/gi, 'individual outcomes vary')
    .replace(/\bnot guaranteed\b/gi, 'not assured');

  return validatePublicCopy(complianceAwareCopy);
}

const TERMS_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function validateTermsEffectiveDate(value: string | undefined): true | string {
  const publicCopyResult = validateTermsPublicCopy(value);
  if (publicCopyResult !== true) return publicCopyResult;

  const trimmed = value?.trim();
  if (!trimmed) return true;

  const match = trimmed.match(
    /^Effective (January|February|March|April|May|June|July|August|September|October|November|December) ([1-9]|[12]\d|3[01]), (\d{4})\.?$/,
  );
  if (!match) {
    return 'Use the displayed legal-date format “Effective Month D, YYYY”.';
  }

  const [, monthName, dayText, yearText] = match;
  const monthIndex = TERMS_MONTHS.indexOf(monthName as (typeof TERMS_MONTHS)[number]);
  const day = Number(dayText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, monthIndex, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === monthIndex && date.getUTCDate() === day
    ? true
    : 'Enter a real calendar date.';
}

/** Singleton legal content for /terms-of-service/. */
export const termsOfService = defineType({
  name: 'termsOfService',
  title: 'Terms of Service',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo', validation: (R) => R.custom(validateTermsPublicCopy) }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo', validation: (R) => R.custom(validateTermsPublicCopy) }),
    defineField({ name: 'pageTitle', title: 'Page Title', type: 'string', group: 'content', validation: (R) => R.custom(validateTermsPublicCopy) }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'string',
      group: 'content',
      description: 'Displayed beneath the title, for example “Effective July 11, 2026.”',
      validation: (R) => R.custom(validateTermsEffectiveDate),
    }),
    defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 4, group: 'content', validation: (R) => R.custom(validateTermsPublicCopy) }),
    defineField({
      name: 'shippingPolicy',
      title: 'Shipping Policy',
      type: 'text',
      rows: 8,
      group: 'content',
      description: 'Canonical policy projected at /shipping-policy/.',
      validation: (R) => R.custom(validateTermsPublicCopy),
    }),
    defineField({
      name: 'returnPolicy',
      title: 'Return Policy',
      type: 'text',
      rows: 8,
      group: 'content',
      description: 'Canonical policy projected at /return-policy/.',
      validation: (R) => R.custom(validateTermsPublicCopy),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required().custom(validateTermsPublicCopy) }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 8,
              validation: (rule) => rule.required().custom(validateTermsPublicCopy),
              description: 'Plain text. Use new lines for list items and include any bullet or number prefixes.',
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'body' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Terms of Service Content' }) },
});
