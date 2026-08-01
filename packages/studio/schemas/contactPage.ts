import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Contact page (/contact) — migrated from hardcoded
 * contact.astro so all marketing copy is editable in the Studio + Netlify
 * Visual Editor. The lead-capture <form>, its inputs, hidden fields, and the
 * SMS-consent block are intentionally NOT modeled — only the presentational
 * copy around the form (hero, contact-detail labels/values, section intros,
 * and map headings). Links/hrefs stay static in the template.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'contactInfo', title: 'Contact Info' },
    { name: 'form', title: 'Form Intro' },
    { name: 'map', title: 'Map' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 3, group: 'hero' }),

    // ── Contact Info (3 presentational columns around the contact details) ──
    defineField({ name: 'phoneLabel', title: 'Phone — Label', type: 'string', group: 'contactInfo' }),
    defineField({ name: 'phoneNumber', title: 'Phone — Display Number', type: 'string', group: 'contactInfo', description: 'Presentational text only — the tel: link target is set in the template.' }),
    defineField({ name: 'phoneHours', title: 'Phone — Hours Line', type: 'string', group: 'contactInfo' }),

    defineField({ name: 'bookLabel', title: 'View Services — Label', type: 'string', group: 'contactInfo' }),
    defineField({ name: 'bookLinkText', title: 'View Services — Link Text', type: 'string', group: 'contactInfo' }),
    defineField({ name: 'bookNote', title: 'View Services — Note Line', type: 'string', group: 'contactInfo' }),

    defineField({ name: 'visitLabel', title: 'Visit — Label', type: 'string', group: 'contactInfo' }),
    defineField({ name: 'addressLine1', title: 'Visit — Address Line 1', type: 'string', group: 'contactInfo' }),
    defineField({ name: 'addressLine2', title: 'Visit — Address Line 2', type: 'string', group: 'contactInfo' }),

    // ── Form Intro (copy above the lead form — NOT the form fields) ──
    defineField({ name: 'formKicker', title: 'Kicker', type: 'string', group: 'form' }),
    defineField({ name: 'formHeading', title: 'Heading', type: 'string', group: 'form' }),
    defineField({ name: 'formIntro', title: 'Intro', type: 'text', rows: 2, group: 'form' }),

    // ── Map / Directions ──
    defineField({ name: 'mapKicker', title: 'Kicker', type: 'string', group: 'map' }),
    defineField({ name: 'mapHeading', title: 'Heading', type: 'string', group: 'map' }),
    defineField({ name: 'mapCtaText', title: 'Directions CTA Text', type: 'string', group: 'map' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page Content' }) },
});
