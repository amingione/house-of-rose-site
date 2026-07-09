import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Professional Makeup landing/hub page
 * (/services/professional-makeup). This is the canonical home for the makeup
 * topic: the Skin-First philosophy, what we offer (event vs. general/lesson
 * application), the trial-run module, and the funnels into the Jane Iredale
 * feature page (/services/professional-makeup/jane-iredale) and the group/event
 * bookings page (/services/professional-makeup/events).
 *
 * NOT a med-spa/medical page — customer-facing brand + service copy only.
 * Provider: Aundrea Pedigo (makeup). Pricing renders as placeholders until set.
 */
export const professionalMakeupPage = defineType({
  name: 'professionalMakeupPage',
  title: 'Professional Makeup Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'philosophy', title: 'Skin-First Philosophy' },
    { name: 'services', title: 'What We Offer' },
    { name: 'useCases', title: 'Event vs. Everyday' },
    { name: 'trialRun', title: 'Trial Run' },
    { name: 'provider', title: 'Provider' },
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

    // Skin-First philosophy
    defineField({ name: 'philosophyKicker', title: 'Kicker', type: 'string', group: 'philosophy' }),
    defineField({ name: 'philosophyHeading', title: 'Heading', type: 'text', rows: 2, group: 'philosophy' }),
    defineField({ name: 'philosophyBody', title: 'Body', type: 'text', rows: 6, group: 'philosophy' }),

    // What we offer
    defineField({ name: 'servicesKicker', title: 'Kicker', type: 'string', group: 'services' }),
    defineField({ name: 'servicesHeading', title: 'Heading', type: 'text', rows: 2, group: 'services' }),
    defineField({ name: 'servicesIntro', title: 'Intro', type: 'text', rows: 3, group: 'services' }),
    defineField({
      name: 'services',
      title: 'Service Types',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'blurb', title: 'Blurb', type: 'text', rows: 3 }),
            defineField({ name: 'bestFor', title: 'Best For', type: 'string', description: 'e.g. "Prom, weddings, photography, any special outing"' }),
            defineField({ name: 'priceLabel', title: 'Price Label', type: 'string', description: 'Placeholder until confirmed, e.g. "From $XXX".' }),
          ],
          preview: { select: { title: 'name', subtitle: 'bestFor' } },
        },
      ],
    }),

    // Event vs. everyday use cases
    defineField({ name: 'useCasesKicker', title: 'Kicker', type: 'string', group: 'useCases' }),
    defineField({ name: 'useCasesHeading', title: 'Heading', type: 'text', rows: 2, group: 'useCases' }),
    defineField({
      name: 'useCases',
      title: 'Use Cases',
      type: 'array',
      group: 'useCases',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        },
      ],
    }),

    // Trial run module
    defineField({ name: 'trialRunHeading', title: 'Heading', type: 'string', group: 'trialRun' }),
    defineField({ name: 'trialRunBody', title: 'Body', type: 'text', rows: 5, group: 'trialRun', description: 'Trial run is a separate session at the same price as the event application; strongly recommended for weddings & photography.' }),

    // Provider
    defineField({ name: 'providerKicker', title: 'Kicker', type: 'string', group: 'provider' }),
    defineField({ name: 'providerHeading', title: 'Heading', type: 'string', group: 'provider' }),
    defineField({ name: 'providerBody', title: 'Body', type: 'text', rows: 4, group: 'provider' }),
    defineField({ name: 'provider', title: 'Provider', type: 'reference', to: [{ type: 'provider' }], group: 'provider' }),

    // Related links (funnel)
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
            defineField({ name: 'href', title: 'Href', type: 'string', validation: (R) => R.required(), description: 'Inner-page links MUST end with a trailing slash (e.g. /services/professional-makeup/events/).' }),
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
      description: 'Question-shaped entries — power FAQPage JSON-LD and the aggregated /faq hub.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Professional Makeup Page Content' }) },
});
