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
          { title: 'General Consultation', value: 'consultation' },
          { title: 'AI Skin Analysis', value: 'skinAnalysis' },
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
          { title: 'Qualified', value: 'qualified' },
          { title: 'Consultation Booked', value: 'consultationBooked' },
          { title: 'Completed Booking', value: 'completed' },
          { title: 'Booked (Legacy)', value: 'booked' },
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
      name: 'serviceInterest',
      title: 'Service Interest',
      type: 'string',
      description: 'The consultation, service family, or operational request selected on the form.',
    }),
    defineField({
      name: 'owner',
      title: 'Lead Owner',
      type: 'string',
      description: 'Team member responsible for the next action.',
    }),
    defineField({ name: 'followUpDueAt', title: 'Follow-Up Due', type: 'datetime' }),
    defineField({ name: 'firstContactedAt', title: 'First Contacted', type: 'datetime' }),
    defineField({ name: 'qualifiedAt', title: 'Qualified At', type: 'datetime' }),
    defineField({ name: 'bookedAt', title: 'Consultation Booked At', type: 'datetime' }),
    defineField({ name: 'completedAt', title: 'Completed Booking At', type: 'datetime' }),
    defineField({
      name: 'bookingNotes',
      title: 'Booking Reconciliation Notes',
      type: 'text',
      rows: 3,
      description: 'Record the matching GlossGenius appointment or the reason the lead was closed. Do not paste sensitive clinical details.',
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
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'object',
      fields: [
        defineField({ name: 'landingPage', title: 'Landing Page', type: 'string' }),
        defineField({ name: 'referrer', title: 'Referrer', type: 'string' }),
        defineField({ name: 'utmSource', title: 'UTM Source', type: 'string' }),
        defineField({ name: 'utmMedium', title: 'UTM Medium', type: 'string' }),
        defineField({ name: 'utmCampaign', title: 'UTM Campaign', type: 'string' }),
        defineField({ name: 'utmTerm', title: 'UTM Term', type: 'string' }),
        defineField({ name: 'utmContent', title: 'UTM Content', type: 'string' }),
      ],
    }),
    defineField({ name: 'internalNotificationSent', title: 'Internal Notification Sent', type: 'boolean', readOnly: true }),
    defineField({ name: 'acknowledgementSent', title: 'Client Acknowledgement Sent', type: 'boolean', readOnly: true }),
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
