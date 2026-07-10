import { defineField, defineType } from 'sanity';

/**
 * Singleton for the Home page (/) — migrated from hardcoded index.astro so all
 * copy is editable in the Studio + Netlify Visual Editor. Section feature/
 * background images stay as static asset paths in the template; the 4 service
 * group cards keep an editable `imagePath` string.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Home Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'approach', title: 'Approach' },
    { name: 'services', title: 'Services' },
    { name: 'scan', title: 'AI Skin Analysis' },
    { name: 'homecare', title: 'Home Care' },
    { name: 'experience', title: 'Experience' },
    { name: 'local', title: 'Local' },
    { name: 'finalCta', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── SEO ──
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),

    // ── Hero ──
    defineField({ name: 'heroKicker', title: 'Kicker', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Title', type: 'text', rows: 2, group: 'hero', description: 'Use a line break for the second (spaced) line.' }),
    defineField({ name: 'heroSubtitle', title: 'Subtitle', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Description', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'hero' }),

    // ── About ──
    defineField({ name: 'aboutKicker', title: 'Kicker', type: 'string', group: 'about' }),
    defineField({ name: 'aboutHeading', title: 'Heading', type: 'string', group: 'about' }),
    defineField({ name: 'aboutPara1', title: 'Paragraph 1', type: 'text', rows: 3, group: 'about' }),
    defineField({ name: 'aboutPara2', title: 'Paragraph 2', type: 'text', rows: 4, group: 'about' }),
    defineField({ name: 'aboutPara3', title: 'Paragraph 3', type: 'text', rows: 3, group: 'about' }),

    // ── Approach ──
    defineField({ name: 'approachKicker', title: 'Kicker', type: 'string', group: 'approach' }),
    defineField({ name: 'approachHeading', title: 'Heading', type: 'string', group: 'approach' }),
    defineField({ name: 'approachPara1', title: 'Paragraph 1', type: 'text', rows: 3, group: 'approach' }),
    defineField({ name: 'approachPara2', title: 'Paragraph 2', type: 'text', rows: 4, group: 'approach' }),
    defineField({ name: 'approachClosing', title: 'Closing Line', type: 'text', rows: 2, group: 'approach' }),

    // ── Services ──
    defineField({ name: 'servicesKicker', title: 'Kicker', type: 'string', group: 'services' }),
    defineField({ name: 'servicesHeading', title: 'Heading', type: 'string', group: 'services' }),
    defineField({ name: 'servicesIntro', title: 'Intro', type: 'text', rows: 3, group: 'services' }),
    defineField({
      name: 'serviceGroups',
      title: 'Service Groups (4 pillars)',
      type: 'array',
      group: 'services',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (R) => R.required() }),
            defineField({ name: 'imagePath', title: 'Image Path', type: 'string', description: 'e.g. /images/new-facials.png' }),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        },
      ],
      validation: (R) => R.max(6),
    }),
    defineField({ name: 'servicesCtaText', title: 'CTA Text', type: 'string', group: 'services' }),

    // ── AI Skin Analysis ──
    defineField({ name: 'scanKicker', title: 'Kicker', type: 'string', group: 'scan' }),
    defineField({ name: 'scanHeading', title: 'Heading', type: 'string', group: 'scan' }),
    defineField({ name: 'scanPara1', title: 'Paragraph 1', type: 'text', rows: 3, group: 'scan' }),
    defineField({ name: 'scanPara2', title: 'Paragraph 2', type: 'text', rows: 3, group: 'scan' }),
    defineField({ name: 'scanQuote', title: 'Quote Line', type: 'text', rows: 2, group: 'scan' }),
    defineField({ name: 'scanCtaPrimaryText', title: 'Primary CTA Text', type: 'string', group: 'scan' }),
    defineField({ name: 'scanCtaSecondaryText', title: 'Secondary CTA Text', type: 'string', group: 'scan' }),

    // ── Home Care ──
    defineField({ name: 'careKicker', title: 'Kicker', type: 'string', group: 'homecare' }),
    defineField({ name: 'careHeading', title: 'Heading', type: 'string', group: 'homecare' }),
    defineField({ name: 'carePara1', title: 'Paragraph 1', type: 'text', rows: 4, group: 'homecare' }),
    defineField({ name: 'carePara2', title: 'Paragraph 2', type: 'text', rows: 3, group: 'homecare' }),
    defineField({ name: 'careCtaText', title: 'CTA Text', type: 'string', group: 'homecare' }),

    // ── Experience ──
    defineField({ name: 'expKicker', title: 'Kicker', type: 'string', group: 'experience' }),
    defineField({ name: 'expHeading', title: 'Heading', type: 'string', group: 'experience' }),
    defineField({ name: 'expPara1', title: 'Paragraph 1', type: 'text', rows: 4, group: 'experience' }),
    defineField({ name: 'expPara2', title: 'Paragraph 2', type: 'text', rows: 2, group: 'experience' }),

    // ── Local ──
    defineField({ name: 'localKicker', title: 'Kicker', type: 'string', group: 'local' }),
    defineField({ name: 'localHeading', title: 'Heading', type: 'string', group: 'local' }),
    defineField({ name: 'localPara1', title: 'Paragraph 1', type: 'text', rows: 3, group: 'local' }),
    defineField({ name: 'localPara2', title: 'Paragraph 2', type: 'text', rows: 3, group: 'local' }),

    // ── Final CTA ──
    defineField({ name: 'finalHeading', title: 'Heading', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalPara', title: 'Paragraph', type: 'text', rows: 3, group: 'finalCta' }),
    defineField({ name: 'finalCtaText', title: 'CTA Text', type: 'string', group: 'finalCta' }),
    defineField({ name: 'finalAddressLine', title: 'Address / Hours Line', type: 'text', rows: 2, group: 'finalCta' }),
  ],
  preview: { prepare: () => ({ title: 'Home Page Content' }) },
});
