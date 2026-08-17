import { defineField, defineType } from 'sanity';

const SUPPORT_COPY_NOTICE = 'Legacy source field. The current /support/ route uses reviewed website content instead.';

/** Singleton content for the customer-support FAQ page at /support/. */
export const supportPage = defineType({
  name: 'supportPage',
  title: 'Support Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero (not published)' },
    { name: 'contact', title: 'Contact Options (not published)' },
    { name: 'faq', title: 'FAQs (not published)' },
    { name: 'cta', title: 'Final CTA (not published)' },
    { name: 'seo', title: 'SEO (not published)' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title (not published)', type: 'string', group: 'seo', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'seoDescription', title: 'SEO Description (not published)', type: 'text', rows: 3, group: 'seo', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'heroTitle', title: 'Title (not published)', type: 'string', group: 'hero', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'heroDescription', title: 'Description (not published)', type: 'text', rows: 3, group: 'hero', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'contactHeading', title: 'Heading (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'contactIntro', title: 'Introduction (not published)', type: 'text', rows: 3, group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'callTitle', title: 'Call — Title (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'callBody', title: 'Call — Description (not published)', type: 'text', rows: 2, group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'callCta', title: 'Call — Link Text (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'emailTitle', title: 'Email — Title (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'emailBody', title: 'Email — Description (not published)', type: 'text', rows: 2, group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'emailCta', title: 'Email — Link Text (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'bookingTitle', title: 'Booking — Title (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'bookingBody', title: 'Booking — Description (not published)', type: 'text', rows: 2, group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'bookingCta', title: 'Booking — Link Text (not published)', type: 'string', group: 'contact', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'faqHeading', title: 'FAQ Heading (not published)', type: 'string', group: 'faq', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'faqIntro', title: 'FAQ Introduction (not published)', type: 'text', rows: 2, group: 'faq', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({
      name: 'faqs',
      title: 'FAQs (not published)',
      type: 'array',
      group: 'faq',
      readOnly: true,
      description: SUPPORT_COPY_NOTICE,
      of: [{ type: 'faq' }],
      validation: (rule) => rule.max(20),
    }),
    defineField({ name: 'ctaHeading', title: 'Heading (not published)', type: 'string', group: 'cta', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'ctaBody', title: 'Description (not published)', type: 'text', rows: 2, group: 'cta', readOnly: true, description: SUPPORT_COPY_NOTICE }),
    defineField({ name: 'ctaText', title: 'Button Text (not published)', type: 'string', group: 'cta', readOnly: true, description: SUPPORT_COPY_NOTICE }),
  ],
  preview: { prepare: () => ({ title: 'Support Page Content' }) },
});
