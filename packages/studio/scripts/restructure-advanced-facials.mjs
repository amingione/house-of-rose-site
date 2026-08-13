/**
 * Consolidate the public Advanced Facials collection around two real starting
 * treatments, with the former combo/protocol pages represented as provider-led
 * customizations instead of standalone website services.
 *
 * Sources:
 * - Owner direction, 2026-07-31
 * - CLAUDE.md (verify-first, plain technical names, provider-led candidacy)
 * - docs/internal_only/pricing/ALL-SERVICES-PRICING.MD §6
 * - docs/internal_only/COMPLIANCE-COPY-RULES.md
 *
 * Dry run:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/restructure-advanced-facials.mjs
 *
 * Apply:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/restructure-advanced-facials.mjs --apply
 */

import { createReadStream } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

throw new Error(
  'Archived by the 2026-08-13 voice reset. Rewrite and review the collection copy and service-status plan before use.',
);

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken =
  process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_TOKEN;
const token = shouldApply ? writeToken : readToken;

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset.');
}

if (shouldApply && !writeToken) {
  throw new Error(
    'Applying this migration requires a Sanity user session or SANITY_API_WRITE_TOKEN.',
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'published',
});
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const collectionId = 'collection-advanced-facials';
const glo2FacialId = '0e5554bd-f58d-4dbe-be0a-972ad9a27a0e';
const bioRePeelId = '3cca74b8-9626-4ed7-aaab-3c31bcac8ad8';

const parkedServices = [
  { id: 'service-glo2-procell-md', slug: 'glo2facial-procell-md' },
  { id: 'service-glo2-procell-pro', slug: 'glo2facial-procell-pro' },
  { id: 'service-glo2-prf', slug: 'glo2facial-prf' },
  { id: 'service-glowtox-facial', slug: 'glowtox-facial' },
  {
    id: 'f651c9cc-5570-41cb-91fd-2f010ea18ce2',
    slug: 'biorepeel-advanced-acne-scarring',
  },
  { id: '52ac5d64-74cb-43fb-b67e-166fdb136a95', slug: 'biorepeel-gold-spot-treatment' },
  { id: 'ff20c655-afa0-4955-8548-d88552e960ea', slug: 'biorepeel-body' },
];

const imageSpecs = [
  {
    key: 'hero',
    filename: 'actual-reception-1400.webp',
    path: resolve(
      repoRoot,
      'packages/web/public/images/optimized/actual-reception-1400.webp',
    ),
    alt: 'Advanced facial consultation at House of Rose Aesthetics in Punta Gorda',
  },
  {
    key: 'glo2facial',
    filename: 'glo2facial-company-600.webp',
    path: resolve(
      repoRoot,
      'packages/web/public/images/optimized/glo2facial-company-600.webp',
    ),
    alt: 'Glo2Facial manufacturer treatment overview',
  },
  {
    key: 'biorepeel',
    filename: 'biorepeel-products-800.webp',
    path: resolve(
      repoRoot,
      'packages/web/public/images/optimized/biorepeel-products-800.webp',
    ),
    alt: 'BioRePeel face and body products',
  },
];

const current = await client.fetch(
  `{
    "collection": *[_id == $collectionId][0]{
      _id,
      title,
      presentation,
      headline,
      "featured": featuredServices[]{ "service": service->slug.current }
    },
    "services": *[_id in $serviceIds] | order(title asc){
      _id,
      title,
      "slug": slug.current,
      status
    }
  }`,
  {
    collectionId,
    serviceIds: parkedServices.map(({ id }) => id),
  },
);

const plan = {
  apply: shouldApply,
  collection: {
    id: collectionId,
    presentation: 'editorial',
    publicStartingTreatments: ['glo2facial', 'biorepeel'],
    customizations: [
      'Dermaplaning + LED',
      'Procell microchanneling',
      'Topical PRF',
      'Targeted peel options',
    ],
  },
  parkPublicServicePages: parkedServices.map(({ slug }) => slug),
  current,
};

console.log(JSON.stringify(plan, null, 2));

if (!shouldApply) {
  console.log('\nDry run only. Re-run with --apply to publish these Sanity changes.');
  process.exit(0);
}

const imageRefs = {};

for (const spec of imageSpecs) {
  const existingAssetId = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename: spec.filename },
  );
  const asset = existingAssetId
    ? { _id: existingAssetId }
    : await client.assets.upload('image', createReadStream(spec.path), {
        filename: spec.filename,
        contentType: 'image/webp',
      });

  imageRefs[spec.key] = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: spec.alt,
  };
}

const collectionPatch = {
  presentation: 'editorial',
  headline: 'Advanced facials, customized to your skin',
  description:
    'Advanced facials at House of Rose in Punta Gorda begin with two core treatments—Glo2Facial and BioRePeel—then are customized around your skin, goals, timing, and candidacy.',
  intro:
    'At House of Rose, you do not choose from a maze of preset combinations. We begin with your skin, goals, timing, and candidacy—then customize the facial with the modalities that make sense for you.',
  image: imageRefs.hero,
  featuredServices: [
    {
      _type: 'object',
      _key: 'glo2facial',
      service: { _type: 'reference', _ref: glo2FacialId },
      image: imageRefs.glo2facial,
      summary:
        'Oxygenation, exfoliation, and infusion for visible radiance and hydration with little interruption to your day.',
      linkLabel: 'Explore Glo2Facial',
    },
    {
      _type: 'object',
      _key: 'biorepeel',
      service: { _type: 'reference', _ref: bioRePeelId },
      image: imageRefs.biorepeel,
      summary:
        'A minimal-downtime resurfacing peel selected for visible tone, texture, and clarity.',
      linkLabel: 'Explore BioRePeel',
    },
  ],
  customizationTitle: 'How can your facial be customized?',
  customizationIntro:
    'These are not separate facial packages. Your provider recommends only what fits your skin and treatment plan.',
  customizations: [
    {
      _type: 'object',
      _key: 'dermaplaning-led',
      title: 'Dermaplaning + LED',
      description: 'Surface prep and calming light support.',
    },
    {
      _type: 'object',
      _key: 'procell',
      title: 'Procell microchanneling',
      description: 'A corrective option considered when visible texture is the priority.',
    },
    {
      _type: 'object',
      _key: 'topical-prf',
      title: 'Topical PRF',
      description: 'A provider-selected adjunct to an appropriate needling treatment.',
    },
    {
      _type: 'object',
      _key: 'targeted-peel',
      title: 'Targeted peel options',
      description: 'Selected by skin, treatment area, and candidacy.',
    },
  ],
  closingTitle: 'Not sure where to start?',
  closingBody:
    'Call House of Rose and tell us what you want to improve. We will help you choose a sensible next step.',
};

let transaction = client.transaction().patch(collectionId, { set: collectionPatch });

for (const { id } of parkedServices) {
  transaction = transaction.patch(id, { set: { status: 'parked' } });
}

const result = await transaction.commit({ autoGenerateArrayKeys: true });

const verification = await client.fetch(
  `{
    "collection": *[_id == $collectionId][0]{
      _id,
      presentation,
      headline,
      description,
      "featured": featuredServices[]{ "service": service->slug.current },
      "customizations": customizations[].title
    },
    "parkedServices": *[_id in $serviceIds] | order(slug.current asc){
      "slug": slug.current,
      status
    }
  }`,
  {
    collectionId,
    serviceIds: parkedServices.map(({ id }) => id),
  },
);

console.log(
  JSON.stringify(
    {
      transactionId: result.transactionId,
      verification,
    },
    null,
    2,
  ),
);
