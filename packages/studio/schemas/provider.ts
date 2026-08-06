import { defineField, defineType } from 'sanity';

/**
 * Provider — mirrors the Notion "HOUSE OF ROSE: Providers" database.
 * Chain: Provider → Service → Package/Series.
 */
export const provider = defineType({
  name: 'provider',
  title: 'Provider',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Provider',
      type: 'string',
      description: 'Display name (e.g. Amber, Diana, Brandy).',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Public Profile Slug',
      type: 'slug',
      options: { source: 'fullName', maxLength: 80 },
      description: 'Used at /about/providers/[slug]/.',
    }),
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'lane',
      title: 'Lane',
      type: 'string',
      options: {
        list: [
          { title: 'Advanced Aesthetics', value: 'advanced-aesthetics' },
          { title: 'Injectables & Medical', value: 'injectables-medical' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Classic Facials', value: 'classic-facials' },
          { title: 'Beauty & Enhancements', value: 'beauty-enhancements' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'roleCredential',
      title: 'Role / Credential',
      type: 'string',
    }),
    defineField({
      name: 'scopeOfPractice',
      title: 'Scope of Practice',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'productionStatus',
      title: 'Production Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Production', value: 'in-production' },
          { title: 'Room Rental — Own Pricing', value: 'room-rental' },
          { title: 'Parked', value: 'parked' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-production',
    }),
    defineField({
      name: 'showOnWebsite',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: false,
      description: 'Publishes this provider in the About directory and creates a public profile route.',
    }),
    defineField({
      name: 'listingOrder',
      title: 'Listing Order',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'publicName',
      title: 'Public Name + Credential',
      type: 'string',
      description: 'Include the applicable license type beside a healthcare practitioner’s name, e.g. Diana Morrison, RN.',
    }),
    defineField({
      name: 'publicRole',
      title: 'Public Role',
      type: 'string',
      description: 'Use only verified roles and credentials.',
    }),
    defineField({
      name: 'summary',
      title: 'Directory Summary',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'biography',
      title: 'Website Biography',
      type: 'array',
      of: [{ type: 'text', rows: 5 }],
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'serviceFocus',
      title: 'Public Service Focus',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Public service labels only. Do not describe internal provider lanes.',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'profileImagePath',
      title: 'Static Profile Image Path',
      type: 'string',
      description: 'Optional existing web asset, e.g. /images/providers/Diana.webp.',
    }),
    defineField({
      name: 'digitalCardPath',
      title: 'Digital Card Path',
      type: 'string',
      description: 'Optional trailing-slash URL for an existing tap-to-share card.',
    }),
    defineField({
      name: 'medicallyDirected',
      title: 'Show Medical Director Attribution',
      type: 'boolean',
      initialValue: false,
      description: 'Enable when the public profile describes medically directed services.',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'roleCredential' },
  },
});
