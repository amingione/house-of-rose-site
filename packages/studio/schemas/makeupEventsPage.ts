import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Professional Makeup — Events page
 * (/services/professional-makeup/events). Group/event bookings for weddings and
 * other occasions where multiple people need makeup simultaneously. Three
 * booking options: in-house individual block times, in-house spa rental (the
 * "Pre-Party Package"), and travel to your venue. Funnels back to the
 * Professional Makeup hub.
 *
 * Pricing renders as placeholders until confirmed. Booking is call (GBP
 * convention). See docs/internal_only/COMPLIANCE-COPY-RULES.md — no discount language.
 */
export const makeupEventsPage = defineType({
  name: 'makeupEventsPage',
  title: 'Makeup Events Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro' },
    { name: 'options', title: 'Booking Options' },
    { name: 'trialRun', title: 'Trial Run' },
    { name: 'booking', title: 'How to Book' },
    { name: 'links', title: 'Related Links' },
    { name: 'faq', title: 'FAQs' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    // Hero
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    // Intro
    defineField({ name: 'introKicker', title: 'Kicker', type: 'string', group: 'intro' }),
    defineField({ name: 'introHeading', title: 'Heading', type: 'text', rows: 2, group: 'intro' }),
    defineField({ name: 'introBody', title: 'Body', type: 'text', rows: 5, group: 'intro' }),

    // Booking options
    defineField({ name: 'optionsKicker', title: 'Kicker', type: 'string', group: 'options' }),
    defineField({ name: 'optionsHeading', title: 'Heading', type: 'text', rows: 2, group: 'options' }),
    defineField({
      name: 'bookingOptions',
      title: 'Booking Options',
      type: 'array',
      group: 'options',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
            defineField({ name: 'includes', title: 'Includes', type: 'array', of: [{ type: 'string' }] }),
            defineField({ name: 'bestFor', title: 'Best For', type: 'string' }),
            defineField({ name: 'priceLabel', title: 'Price Label', type: 'string', description: 'Placeholder until confirmed, e.g. "From $XXX" or "From $XXX + travel".' }),
          ],
          preview: { select: { title: 'name', subtitle: 'bestFor' } },
        },
      ],
    }),

    // Trial run module
    defineField({ name: 'trialRunHeading', title: 'Heading', type: 'string', group: 'trialRun' }),
    defineField({ name: 'trialRunBody', title: 'Body', type: 'text', rows: 5, group: 'trialRun' }),

    // How to book
    defineField({ name: 'bookingHeading', title: 'Heading', type: 'text', rows: 2, group: 'booking' }),
    defineField({ name: 'bookingBody', title: 'Body', type: 'text', rows: 4, group: 'booking' }),

    // Related links
    defineField({
      name: 'relatedLinks',
      title: 'Related Links',
      type: 'array',
      group: 'links',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'href', title: 'Href', type: 'string', validation: (R) => R.required(), description: 'Inner-page links MUST end with a trailing slash.' }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),

    // FAQs
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faq',
      of: [{ type: 'faq' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Makeup Events Page Content' }) },
});
