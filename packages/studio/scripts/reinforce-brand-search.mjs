#!/usr/bin/env node

/**
 * Targeted GSC opportunity patch.
 *
 * - Reinforces the canonical House of Rose Aesthetics entity on the homepage.
 * - Improves Punta Gorda and Port Charlotte local pages with links to verified
 *   services already offered by the practice.
 * - Tightens metadata for the supported page-two opportunities.
 * - Aligns the Sanity site description and AI-search entity answers.
 *
 * Bellafill, Dysport, and hormone/BHRT targeting are intentionally excluded:
 * current operational sources do not support them as live House of Rose services.
 * Dry-run by default; pass --apply to commit the published documents and any
 * existing drafts so Studio edits do not reintroduce stale copy later.
 */

import { createClient } from '@sanity/client';

const apply = process.argv.includes('--apply');
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token = process.env.SANITY_API_WRITE_TOKEN
  ?? process.env.SANITY_AUTH_TOKEN
  ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) {
  throw new Error('Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET.');
}
if (apply && !token) {
  throw new Error('Applying this patch requires SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN.');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'published',
});

const refs = (...ids) => ids.map((id, index) => ({
  _key: `gsc-${index + 1}`,
  _type: 'reference',
  _ref: id,
}));

const serviceIds = {
  dermalFillers: '46fb011c-6d0c-4667-83e4-81c7d87a3feb',
  neurotoxins: '7bd92dc1-9ced-42bd-a195-e9fa4628a848',
  ivHydration: '99566c9c-8033-4df6-b5a3-ac5de5d2d886',
  glp1: '6e204a23-77a2-48a9-8381-878974cb92e4',
  prf: 'c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b',
  microchanneling: '2f050dfe-7ec7-459c-b3d6-f895a53805e8',
  glo2Facial: '0e5554bd-f58d-4dbe-be0a-972ad9a27a0e',
  dermaplaning: 'e8b38f03-900f-4ec5-9246-07cc1b65ed11',
};

const featuredServices = refs(
  serviceIds.dermalFillers,
  serviceIds.neurotoxins,
  serviceIds.ivHydration,
  serviceIds.glp1,
  serviceIds.prf,
  serviceIds.microchanneling,
  serviceIds.glo2Facial,
  serviceIds.dermaplaning,
);

const patches = [
  {
    id: 'siteSettings',
    set: {
      description: 'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, serving Charlotte County and Southwest Florida.',
      'aiSearchFaqs[_key=="ai-what-is-house-of-rose"].answer': 'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, serving Charlotte County and Southwest Florida. Care is planned through consultation, assessment, clinical judgment, and long-term follow-through. Walk-ins are welcome, and appointments are recommended to reserve a time.',
      'aiSearchFaqs[_key=="ai-where-is-house-of-rose"].answer': 'House of Rose Aesthetics is located at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. The practice serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.',
      'aiSearchFaqs[_key=="ai-book-consultation"].answer': 'Call (844) 941-7673 to reserve a time, or review the service menu at https://houseofrose.glossgenius.com/services. Walk-ins are welcome; appointments are recommended for guaranteed timing.',
      'aiSearchFaqs[_key=="ai-house-of-rose-difference"].answer': 'House of Rose is a Punta Gorda medical aesthetics practice built around consultation, assessment, individualized planning, clear education, preparation, aftercare, and long-term follow-through rather than a one-size-fits-all menu.',
    },
  },
  {
    id: 'homepage',
    set: {
      seoTitle: 'House of Rose Aesthetics | Medical Aesthetics Punta Gorda',
      seoDescription: 'House of Rose Aesthetics is a Punta Gorda medical aesthetics practice offering individualized skin, injectable, facial, IV hydration, and wellness care.',
      heroKicker: 'Medical Aesthetics Practice',
      heroTitle: 'HOUSE OF ROSE\nAESTHETICS',
      heroSubtitle: 'PUNTA GORDA, FL',
      heroDescription: 'Individualized facial, body, skin, injectable, and wellness care planned through consultation, assessment, clinical judgment, and long-term follow-through.',
      aboutKicker: 'About House of Rose Aesthetics',
      aboutHeading: 'Medical aesthetics, thoughtfully practiced.',
      aboutPara1: 'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda, Florida, built around individualized treatment planning and long-term care.',
      aboutPara2: 'Medical aesthetics is not one-size-fits-all. Consultation and assessment guide the service, preparation, recovery, aftercare, and maintenance recommendations that belong in your plan.',
      aboutPara3: 'Located in Punta Gorda, House of Rose serves Charlotte County and Southwest Florida.',
    },
  },
  {
    id: '650ac40d-be26-4c0d-a865-cca1acf2e491',
    set: {
      title: 'Medical Aesthetics in Punta Gorda, FL',
      intro: 'House of Rose Aesthetics is a medical aesthetics practice in Punta Gorda offering consultation-led dermal and lip filler, Botox and Daxxify, IV hydration, GLP-1 weight management, regenerative skin procedures, and facial care for Charlotte County and Southwest Florida.',
      whyLocal: 'House of Rose is located at 525 E Olympia Ave, Unit 9 in Punta Gorda. Care begins with consultation, assessment, or screening appropriate to the service, followed by clear preparation, recovery, aftercare, and maintenance guidance when relevant.',
      servedServices: featuredServices,
      faqs: [
        {
          _key: 'location',
          _type: 'faq',
          question: 'Where is House of Rose Aesthetics in Punta Gorda?',
          answer: 'House of Rose Aesthetics is at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. Walk-ins are welcome based on service and provider availability; appointments are recommended to reserve a time.',
        },
        {
          _key: 'services',
          _type: 'faq',
          question: 'What medical aesthetics services are available in Punta Gorda?',
          answer: 'Current services include dermal and lip filler, Botox and Daxxify, IV hydration, provider-guided GLP-1 weight management, PRF, procell microchanneling, Glo2Facial, dermaplaning, and other facial, body, skin, injectable, and wellness care.',
        },
        {
          _key: 'start',
          _type: 'faq',
          question: 'Where should I start if I am unsure which service fits?',
          answer: 'Begin with a consultation or advanced skin imaging. House of Rose reviews your goals, relevant history, timing, recovery preferences, and candidacy before recommending a next step.',
        },
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Medical Aesthetics in Punta Gorda, FL',
        metaDescription: 'Medical aesthetics in Punta Gorda at House of Rose: dermal and lip filler, Botox and Daxxify, IV hydration, GLP-1 care, skin procedures, and facials.',
      },
    },
  },
  {
    id: 'hor-area-port-charlotte',
    set: {
      title: 'Medical Aesthetics Near Port Charlotte, FL',
      intro: 'House of Rose Aesthetics serves Port Charlotte from its medical aesthetics practice in neighboring Punta Gorda. Current services include consultation-led lip and dermal filler, Botox and Daxxify, IV hydration, GLP-1 weight management, regenerative skin procedures, and facial care.',
      whyLocal: 'House of Rose is located at 525 E Olympia Ave, Unit 9 in Punta Gorda and serves patients from Port Charlotte and across Charlotte County. Each plan begins with consultation, assessment, or screening appropriate to the service, with preparation and aftercare explained before treatment.',
      servedServices: featuredServices,
      faqs: [
        {
          _key: 'location',
          _type: 'faq',
          question: 'Is House of Rose located in Port Charlotte?',
          answer: 'House of Rose is located at 525 E Olympia Ave, Unit 9 in Punta Gorda and serves patients who travel from Port Charlotte and surrounding Charlotte County communities.',
        },
        {
          _key: 'lip-filler',
          _type: 'faq',
          question: 'Where can I find lip augmentation near Port Charlotte?',
          answer: 'House of Rose offers consultation-led lip filler at its Punta Gorda practice for patients from Port Charlotte. A licensed provider reviews facial balance, goals, history, candidacy, preparation, and aftercare before recommending a filler plan.',
        },
        {
          _key: 'schedule',
          _type: 'faq',
          question: 'How do I plan a visit from Port Charlotte?',
          answer: 'Review the current services menu or call (844) 941-7673 to reserve a time. Walk-ins are accepted based on service and provider availability, and appointments are recommended for medical or time-sensitive services.',
        },
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Lip Filler Near Port Charlotte, FL',
        metaDescription: 'Lip filler, Botox, IV hydration, GLP-1 care, skin procedures, and facials near Port Charlotte at House of Rose Aesthetics in Punta Gorda.',
      },
    },
  },
  {
    id: serviceIds.dermalFillers,
    set: {
      seo: {
        _type: 'seo',
        metaTitle: 'Lip Filler in Punta Gorda & Port Charlotte',
        metaDescription: 'Lip filler and dermal fillers for Punta Gorda and Port Charlotte, planned through consultation at House of Rose Aesthetics.',
      },
    },
  },
  {
    id: serviceIds.neurotoxins,
    set: {
      seo: {
        _type: 'seo',
        metaTitle: 'Botox & Daxxify in Punta Gorda',
        metaDescription: 'Botox and Daxxify neurotoxin consultations in Punta Gorda, serving Port Charlotte and Charlotte County.',
      },
    },
  },
  {
    id: serviceIds.ivHydration,
    set: {
      seo: {
        _type: 'seo',
        metaTitle: 'IV Therapy in Punta Gorda, FL',
        metaDescription: 'IV therapy in Punta Gorda with screening, current options, and provider guidance at House of Rose Aesthetics.',
      },
    },
  },
  {
    id: serviceIds.glp1,
    set: {
      seo: {
        _type: 'seo',
        metaTitle: 'GLP-1 Weight Management in Punta Gorda',
        metaDescription: 'Provider-guided GLP-1 weight management in Punta Gorda with semaglutide and tirzepatide options after candidacy screening.',
      },
    },
  },
];

const ids = patches.map(({ id }) => id);
const existingDocuments = await client.fetch(
  '*[_id in $ids || _id in $draftIds]{_id,_type}',
  { ids, draftIds: ids.map((id) => `drafts.${id}`) },
);
const existingIds = new Set(existingDocuments.map(({ _id }) => _id));

for (const { id } of patches) {
  if (!existingIds.has(id)) throw new Error(`Expected published document ${id} was not found.`);
}

console.log(`${apply ? 'Applying' : 'Dry run:'} ${patches.length} targeted document patches.`);
for (const { id, set } of patches) {
  const draftId = `drafts.${id}`;
  console.log(`- ${id}: ${Object.keys(set).join(', ')}`);
  if (existingIds.has(draftId)) console.log(`  + existing draft ${draftId}`);
}

if (!apply) {
  console.log('No mutations sent. Re-run with --apply to commit.');
  process.exit(0);
}

let transaction = client.transaction();
for (const { id, set } of patches) {
  transaction = transaction.patch(id, { set });
  const draftId = `drafts.${id}`;
  if (existingIds.has(draftId)) transaction = transaction.patch(draftId, { set });
}

const result = await transaction.commit({ visibility: 'sync' });
console.log(`Committed transaction ${result.transactionId}.`);
