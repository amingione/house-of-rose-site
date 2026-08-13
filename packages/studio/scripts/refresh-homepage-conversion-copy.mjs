/** Archived: the copy in this migration belongs to the rejected pre-reset voice. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { createClient } from '@sanity/client';

throw new Error('Archived by the 2026-08-13 voice reset. Do not republish this homepage copy.');

const APPLY = process.argv.includes('--apply');
const INCLUDE_DRAFT = process.argv.includes('--include-draft');
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;
if (APPLY && !token) throw new Error('SANITY_API_WRITE_TOKEN is required with --apply.');

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token,
  useCdn: false,
});

const copy = {
  seoTitle: 'House of Rose Aesthetics | Medical Aesthetics Punta Gorda',
  seoDescription:
    'House of Rose Aesthetics is a Punta Gorda medical aesthetics practice offering individualized skin, injectable, facial, IV hydration, and wellness care.',
  heroKicker: 'Medical Aesthetics Practice',
  heroTitle: 'Medical Aesthetics.\nThoughtfully Practiced.',
  heroSubtitle: 'Punta Gorda, Florida',
  heroDescription:
    'Individualized facial, body, skin, injectable, and wellness care planned through consultation, assessment, clinical judgment, and long-term follow-through.',
  heroCtaPrimaryText: 'Explore services',
  heroCtaSecondaryText: 'Start with a consultation',
  aboutKicker: 'About House of Rose Aesthetics',
  aboutHeading: 'Medical aesthetics, thoughtfully practiced.',
  aboutPara1:
    'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, built around individualized treatment planning and long-term care.',
  aboutPara2:
    'Consultation and assessment guide the service, preparation, recovery, aftercare, and maintenance recommendations that belong in your plan.',
  aboutPara3: 'Located in Punta Gorda, House of Rose serves Charlotte County and Southwest Florida.',
  approachKicker: 'How care is planned',
  approachHeading: 'A clear plan before a procedure.',
  approachPara1:
    'The right next step depends on the concern, treatment area, candidacy, timing, and recovery you can reasonably plan for.',
  approachPara2:
    'Services are considered in context so the reason for a recommendation—and what comes afterward—stays clear.',
  approachClosing:
    'The purpose is clarity: what is being considered, why it fits, and what comes afterward.',
  servicesKicker: 'Explore care',
  servicesHeading: 'Start with what you want to understand.',
  servicesIntro:
    'Learn how each category is approached, then compare specific services, candidacy, and the next step for booking.',
  servicesCtaText: 'View all services',
  serviceGroups: [
    {
      _key: 'sg1',
      name: 'Skin Renewal & Device Treatments',
      description:
        'Explore microneedling, PRF, BioRePeel, radiofrequency, and IPL options by concern and recovery preference.',
      imagePath: '/images/optimized/procell-house-of-rose-800.webp',
    },
    {
      _key: 'sg2',
      name: 'Injectables & Structural Enhancements',
      description:
        'Learn about neurotoxins, dermal fillers, PRF under-eye options, and EZ Gel through a consultation-led approach.',
      imagePath: '/images/optimized/actual-reception-1400.webp',
    },
    {
      _key: 'sg3',
      name: 'Skin Health & Corrective Care',
      description:
        'Start with Face Reality acne care, Glo2Facial, dermaplaning, and guidance based on what your skin is showing today.',
      imagePath: '/images/optimized/glo2facial-company-600.webp',
    },
    {
      _key: 'sg4',
      name: 'Wellness & Performance Support',
      description:
        'Review IV hydration and provider-guided weight-management services that may support a broader care plan.',
      imagePath: '/images/optimized/actual-iv-suite-1400.webp',
    },
  ],
  scanKicker: 'Advanced skin imaging',
  scanHeading: 'See what your skin is showing today.',
  scanPara1:
    'A skin analysis can support a closer look at visible texture, hydration, pores, pigmentation, fine lines, and sun exposure.',
  scanPara2:
    'We review the images in plain language and connect what we see to the goals you share. The analysis supports—not replaces—professional assessment and clinical judgment.',
  scanQuote: 'Bring your questions. The purpose is a clearer place to start.',
  scanCtaPrimaryText: 'See what to expect',
  scanCtaSecondaryText: 'Start a consultation',
  expKicker: 'The practice',
  expHeading: 'Inside House of Rose.',
  expPara1: 'These are the actual treatment rooms and storefront at 525 E Olympia Avenue in Punta Gorda.',
  localKicker: 'Punta Gorda',
  localHeading: 'Medical aesthetics close to home.',
  localPara1:
    'House of Rose serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, Punta Gorda Isles, and the surrounding Southwest Florida area.',
  localPara2:
    'Explore the service pages when you know what you are considering, or begin with a conversation when you do not.',
  finalHeading: 'Begin with a clear conversation.',
  finalPara:
    'Tell us what you are considering, and we will help you identify the service or consultation that makes sense to explore next.',
  finalCtaText: 'Start a consultation',
};

const targetIds = INCLUDE_DRAFT ? ['homepage', 'drafts.homepage'] : ['homepage'];
const documents = await client.fetch('*[_id in $targetIds]', { targetIds });
if (!documents.some((document) => document._id === 'homepage')) {
  throw new Error('Published homepage singleton is missing.');
}

const changedFields = Object.keys(copy).filter((field) =>
  documents.some((document) => !isDeepStrictEqual(document[field], copy[field])),
);
console.log(`${changedFields.length} homepage field(s) require refresh.`);
console.log(changedFields.map((field) => `- ${field}`).join('\n'));
if (!APPLY) {
  console.log('Dry run only. Re-run with --apply after review.');
  process.exit(0);
}

const backupDirectory = resolve('.sanity', 'homepage-refresh');
mkdirSync(backupDirectory, { recursive: true });
const backupPath = resolve(backupDirectory, 'rollback-2026-08-04.json');
writeFileSync(backupPath, `${JSON.stringify(documents, null, 2)}\n`, { flag: 'wx' });

let transaction = client.transaction();
for (const document of documents) {
  transaction = transaction.patch(document._id, (patch) => patch.set(copy));
}
await transaction.commit();
console.log(`Updated ${documents.length} homepage document(s).`);
console.log(`Rollback snapshot: ${backupPath}`);
