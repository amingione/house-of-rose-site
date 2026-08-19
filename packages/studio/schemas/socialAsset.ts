import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const DEVICE_OPTIONS = [
  { title: 'Procell Microchanneling', value: 'procell' },
  { title: 'Morpheus8', value: 'morpheus8' },
  { title: 'Lumecca Peak (IPL)', value: 'lumecca' },
  { title: 'Forma', value: 'forma' },
  { title: 'PRF', value: 'prf' },
  { title: 'Face Reality Acne Program', value: 'faceReality' },
  { title: 'IV Therapy', value: 'ivTherapy' },
  { title: 'General / Room', value: 'general' },
] as const;

export const CONTENT_PILLAR_OPTIONS = [
  { title: 'Education', value: 'education' },
  { title: 'Results / Before-After', value: 'results' },
  { title: 'Behind the Scenes', value: 'behindTheScenes' },
  { title: 'Practitioner Credibility', value: 'credibility' },
  { title: 'Client Story', value: 'clientStory' },
  { title: 'Myth-Busting', value: 'mythBusting' },
  { title: 'Seasonal', value: 'seasonal' },
] as const;

type ConsentFields = {
  signedAt?: string;
  expiresAt?: string;
  revoked?: boolean;
  documentFile?: unknown;
};

export const socialAsset = defineType({
  name: 'socialAsset',
  title: 'Social Asset',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Photo', value: 'photo' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      hidden: ({ document }) => document?.mediaType !== 'photo',
      validation: (R) =>
        R.custom((value, context) => {
          if (context.document?.mediaType === 'photo' && !value) {
            return 'Photo is required for mediaType "photo"';
          }
          return true;
        }),
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      description: 'Raw clip only. Do not use for the final published video — export elsewhere.',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ document }) => document?.mediaType !== 'video',
      validation: (R) =>
        R.custom((value, context) => {
          if (context.document?.mediaType === 'video' && !value) {
            return 'Video file is required for mediaType "video"';
          }
          return true;
        }),
    }),
    defineField({
      name: 'device',
      title: 'Device / Treatment',
      type: 'string',
      options: { list: [...DEVICE_OPTIONS] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'contentPillar',
      title: 'Content Pillar',
      type: 'string',
      options: { list: [...CONTENT_PILLAR_OPTIONS] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'capturedAt',
      title: 'Captured At',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'clientInFrame',
      title: 'Client Identifiable in Frame',
      description: "True if a client's face or other identifying feature appears in this asset.",
      type: 'boolean',
      initialValue: false,
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'consent',
      title: 'Marketing Consent',
      type: 'object',
      hidden: ({ document }) => !document?.clientInFrame,
      fields: [
        defineField({ name: 'signedAt', title: 'Signed At', type: 'datetime' }),
        defineField({ name: 'expiresAt', title: 'Expires At', type: 'datetime' }),
        defineField({ name: 'revoked', title: 'Revoked', type: 'boolean', initialValue: false }),
        defineField({
          name: 'documentFile',
          title: 'Signed Authorization (PDF)',
          type: 'file',
          options: { accept: 'application/pdf' },
        }),
      ],
      validation: (R) =>
        R.custom((value, context) => {
          if (!context.document?.clientInFrame) return true;

          const consent = value as ConsentFields | undefined;
          if (!consent?.signedAt || !consent.documentFile) {
            return 'A signed authorization is required when a client is identifiable in frame';
          }
          if (consent.revoked) {
            return 'Consent has been revoked — this asset cannot be used';
          }
          if (consent.expiresAt && new Date(consent.expiresAt) < new Date()) {
            return 'Consent has expired — renew before use';
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: 'title', device: 'device', media: 'photo' },
    prepare({ title, device, media }) {
      return { title, subtitle: device, media };
    },
  },
});
