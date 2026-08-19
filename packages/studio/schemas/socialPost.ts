import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

import { lintCaption } from './validation/lintCaption';
import { CONTENT_PILLAR_OPTIONS, DEVICE_OPTIONS } from './socialAsset';

const PLATFORM_OPTIONS = [
  { title: 'Instagram', value: 'instagram' },
  { title: 'Facebook', value: 'facebook' },
  { title: 'TikTok', value: 'tiktok' },
] as const;

const STATUS_OPTIONS = [
  { title: 'Draft', value: 'draft' },
  { title: 'Compliance Review', value: 'compliance' },
  { title: 'Ready to Post', value: 'ready' },
] as const;

type ConsentSnapshot = {
  clientInFrame?: boolean;
  consent?: { signedAt?: string; revoked?: boolean; expiresAt?: string };
};

type AssetReference = {
  _ref: string;
};

export const socialPost = defineType({
  name: 'socialPost',
  title: 'Social Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'platforms',
      title: 'Platforms',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [...PLATFORM_OPTIONS] },
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'assets',
      title: 'Assets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'socialAsset' }] }],
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'device',
      title: 'Device / Treatment',
      type: 'string',
      options: { list: [...DEVICE_OPTIONS] },
    }),
    defineField({
      name: 'contentPillar',
      title: 'Content Pillar',
      type: 'string',
      options: { list: [...CONTENT_PILLAR_OPTIONS] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'captionDraft',
      title: 'Caption Draft (structured from voice note)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'captionFinal',
      title: 'Caption Final',
      description: 'This is what gets copy-pasted into Meta Business Suite.',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [...STATUS_OPTIONS], layout: 'radio' },
      initialValue: 'draft',
      validation: (R) =>
        R.required().custom(async (status, context) => {
          if (status !== 'ready') return true;

          const caption = (context.document?.captionFinal as string | undefined) ?? '';
          const lint = lintCaption(caption);
          if (!lint.passed) {
            return `Caption failed the voice check: ${lint.violations.map((v) => v.message).join('; ')}`;
          }

          const assetRefs = (context.document?.assets as AssetReference[] | undefined) ?? [];
          if (assetRefs.length === 0) return true;

          const client = context.getClient({ apiVersion: '2025-04-26' });
          const assets = await client.fetch<ConsentSnapshot[]>(
            `*[_id in $ids]{clientInFrame, consent}`,
            { ids: assetRefs.map((ref) => ref._ref) },
          );

          for (const asset of assets) {
            if (!asset.clientInFrame) continue;
            if (!asset.consent?.signedAt) return 'One or more assets are missing signed consent';
            if (asset.consent.revoked) return 'One or more assets have revoked consent';
            if (asset.consent.expiresAt && new Date(asset.consent.expiresAt) < new Date()) {
              return 'One or more assets have expired consent';
            }
          }

          return true;
        }),
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Intended Post Date (manual — Meta Business Suite)',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', platforms: 'platforms' },
    prepare({ title, status, platforms }) {
      const platformList = Array.isArray(platforms) ? platforms.join(', ') : '';
      return { title, subtitle: `${status} · ${platformList}` };
    },
  },
});
