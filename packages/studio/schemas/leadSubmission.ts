import { defineField, defineType } from 'sanity';

export const leadSubmission = defineType({
  name: 'leadSubmission',
  title: 'Lead Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'submissionType',
      title: 'Submission Type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Suite Rental Application', value: 'suiteRental' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Booked', value: 'booked' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'smsConsent',
      title: 'SMS Consent',
      type: 'object',
      fields: [
        defineField({
          name: 'informational',
          title: 'Informational',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'marketing',
          title: 'Marketing',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'declined',
          title: 'Declined SMS',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'suiteRental',
      title: 'Suite Rental Details',
      type: 'object',
      fields: [
        defineField({ name: 'specialty', title: 'Specialty', type: 'string' }),
        defineField({ name: 'licenseNumber', title: 'License / Certification #', type: 'string' }),
        defineField({ name: 'businessName', title: 'Business Name', type: 'string' }),
        defineField({ name: 'yearsExperience', title: 'Years of Experience', type: 'string' }),
        defineField({
          name: 'insuranceAcknowledgement',
          title: 'Insurance Acknowledged',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'object',
      fields: [
        defineField({ name: 'formName', title: 'Form Name', type: 'string' }),
        defineField({ name: 'page', title: 'Page', type: 'string' }),
        defineField({ name: 'userAgent', title: 'User Agent', type: 'string' }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      submittedAt: 'submittedAt',
      submissionType: 'submissionType',
    },
    prepare({ title, subtitle, submittedAt, submissionType }) {
      const submitted = submittedAt ? new Date(submittedAt).toLocaleString() : 'No date';
      return {
        title,
        subtitle: `${submissionType ?? 'lead'} - ${subtitle ?? 'no email'} - ${submitted}`,
      };
    },
  },
});
