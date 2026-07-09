import { defineField, defineType } from 'sanity';

/**
 * Singleton for the public Memberships page (/memberships) — the site's actual
 * recurring membership products: Rose Pass (wax membership), IV Hydration
 * Membership, and the Rose Collagen Bank. This is distinct from the Rose
 * Circle (/rose-circle, see `roseCirclePage`), which is not a membership — it
 * is the fully immersive, provider-guided client affiliation.
 *
 * This document only holds page copy (hero/intro/section framing/final CTA).
 * The actual plan cards under each group are `membership` documents tagged
 * with a matching `membershipGroup` and rendered via MembershipTiers.astro.
 */
export const membershipsPage = defineType({
  name: 'membershipsPage',
  title: 'Memberships Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'intro', title: 'Intro' },
    { name: 'rosePass', title: 'Rose Pass' },
    { name: 'ivHydration', title: 'IV Hydration Membership' },
    { name: 'basicFacials', title: 'Basic Facials Membership' },
    { name: 'advancedFacials', title: 'Advanced Facials Membership' },
    { name: 'injectables', title: 'Injectables Membership' },
    { name: 'collagenBank', title: 'Collagen Bank (retired)' },
    { name: 'finalCta', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 3, group: 'seo' }),

    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero', description: 'Single hero CTA by design — booking is already covered by the persistent header "Book Now" button.' }),

    defineField({ name: 'introKicker', title: 'Kicker', type: 'string', group: 'intro' }),
    defineField({ name: 'introHeading', title: 'Heading', type: 'text', rows: 2, group: 'intro' }),
    defineField({ name: 'introBody', title: 'Body', type: 'text', rows: 4, group: 'intro' }),

    defineField({ name: 'rosePassKicker', title: 'Kicker', type: 'string', group: 'rosePass' }),
    defineField({ name: 'rosePassHeading', title: 'Heading', type: 'text', rows: 2, group: 'rosePass' }),
    defineField({ name: 'rosePassBody', title: 'Body', type: 'text', rows: 4, group: 'rosePass' }),

    defineField({ name: 'ivHydrationKicker', title: 'Kicker', type: 'string', group: 'ivHydration' }),
    defineField({ name: 'ivHydrationHeading', title: 'Heading', type: 'text', rows: 2, group: 'ivHydration' }),
    defineField({ name: 'ivHydrationBody', title: 'Body', type: 'text', rows: 4, group: 'ivHydration' }),

    defineField({ name: 'basicFacialsKicker', title: 'Kicker', type: 'string', group: 'basicFacials' }),
    defineField({ name: 'basicFacialsHeading', title: 'Heading', type: 'text', rows: 2, group: 'basicFacials' }),
    defineField({ name: 'basicFacialsBody', title: 'Body', type: 'text', rows: 4, group: 'basicFacials' }),

    defineField({ name: 'advancedFacialsKicker', title: 'Kicker', type: 'string', group: 'advancedFacials' }),
    defineField({ name: 'advancedFacialsHeading', title: 'Heading', type: 'text', rows: 2, group: 'advancedFacials' }),
    defineField({ name: 'advancedFacialsBody', title: 'Body', type: 'text', rows: 4, group: 'advancedFacials' }),

    defineField({ name: 'injectablesKicker', title: 'Kicker', type: 'string', group: 'injectables' }),
    defineField({ name: 'injectablesHeading', title: 'Heading', type: 'text', rows: 2, group: 'injectables' }),
    defineField({ name: 'injectablesBody', title: 'Body', type: 'text', rows: 4, group: 'injectables' }),

    defineField({ name: 'collagenBankKicker', title: 'Kicker', type: 'string', group: 'collagenBank' }),
    defineField({ name: 'collagenBankHeading', title: 'Heading', type: 'text', rows: 2, group: 'collagenBank' }),
    defineField({ name: 'collagenBankBody', title: 'Body', type: 'text', rows: 4, group: 'collagenBank' }),

    defineField({ name: 'finalKicker', title: 'Kicker', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalHeading', title: 'Heading', type: 'text', rows: 2, group: 'finalCta' }),
    defineField({ name: 'finalBody', title: 'Body', type: 'text', rows: 3, group: 'finalCta' }),
    defineField({ name: 'finalCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'finalCta' }),
  ],
  preview: { prepare: () => ({ title: 'Memberships Page Content' }) },
});
