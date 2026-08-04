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
  ],
  preview: {
    select: { title: 'title', subtitle: 'roleCredential' },
  },
});
