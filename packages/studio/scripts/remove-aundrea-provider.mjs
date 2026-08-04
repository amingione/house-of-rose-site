/**
 * Removes the departed provider and her exclusive services from Sanity.
 *
 * Facial Waxing remains active because Brandy also provides it. The script
 * transfers that internal provider reference to Brandy and removes departed-
 * provider wording from the published and draft descriptions.
 *
 * Dry run:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/remove-aundrea-provider.mjs
 * Apply:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/remove-aundrea-provider.mjs --apply
 */

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) throw new Error('Missing Sanity project ID or dataset.');
if (shouldApply && !token) throw new Error('Applying this migration requires a Sanity write token.');

const { createClient } = await import('@sanity/client');
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
});

const exclusiveServiceIds = [
  '50100023-c062-42a8-afc3-4a4beca2556b', // Permanent Jewelry
  'service-body-waxing',
  'service-everyday-makeup',
  'service-full-glam-bridal-makeup',
  'service-lash-lift',
  'service-lash-lift-tint',
  'service-lash-tint',
  'service-luxe-rose-facial',
  'service-royal-rose-facial',
  'service-signature-rose-facial',
  'service-soft-glam-event-makeup',
];

const exclusivePackageIds = [
  'package-bikini-underarms-combo',
  'package-brazilian-wax-pass',
  'package-full-body-smooth-combo',
];

const retiredContentIds = [
  'provider-brooke',
  'professionalMakeupPage',
  'makeupEventsPage',
  'collection-makeup',
  'collection-lash-services',
  'eb25ca1e-0a89-4270-b33f-b5b4e597898b',
];

const baseDeleteIds = [...exclusiveServiceIds, ...exclusivePackageIds, ...retiredContentIds];
const deleteIds = [...new Set(baseDeleteIds.flatMap((id) => [id, `drafts.${id}`]))];
const deleteIdSet = new Set(deleteIds);
const facialWaxingIds = ['service-facial-waxing', 'drafts.service-facial-waxing'];
const patchCandidateIds = [
  ...facialWaxingIds,
  'homepage',
  'drafts.homepage',
  'siteSettings',
  'drafts.siteSettings',
  '5ae70d4c-c42e-4824-881e-b6bb4157de7f',
  'drafts.5ae70d4c-c42e-4824-881e-b6bb4157de7f',
];

const allCandidateIds = [...deleteIds, ...patchCandidateIds];
const documents = await client.fetch('*[_id in $ids]', { ids: allCandidateIds });
const byId = new Map(documents.map((document) => [document._id, document]));

function collectReferences(value, path = '', output = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectReferences(item, `${path}[${index}]`, output));
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  if (value._type === 'reference' && typeof value._ref === 'string') {
    output.push({ path, ref: value._ref });
  }
  for (const [key, item] of Object.entries(value)) {
    collectReferences(item, path ? `${path}.${key}` : key, output);
  }
  return output;
}

const allDocuments = await client.fetch('*[_id != "_.schemas.house-of-rose"]');
const exclusiveReferenceIds = new Set([...exclusiveServiceIds, ...exclusivePackageIds, 'provider-brooke']);
const allowedPatchedIds = new Set(facialWaxingIds);
const unexpectedReferences = [];

for (const document of allDocuments) {
  if (deleteIdSet.has(document._id) || allowedPatchedIds.has(document._id)) continue;
  for (const reference of collectReferences(document)) {
    if (exclusiveReferenceIds.has(reference.ref)) {
      unexpectedReferences.push({
        documentId: document._id,
        documentType: document._type,
        path: reference.path,
        ref: reference.ref,
      });
    }
  }
}

if (unexpectedReferences.length > 0) {
  throw new Error(
    `Refusing to delete documents with unexpected references:\n${JSON.stringify(unexpectedReferences, null, 2)}`,
  );
}

function cleanFacialWaxingDescription(description) {
  if (typeof description !== 'string') return description;
  return description
    .replace(/, and it is offered by both Aundrea Pedigo and Brandy\./gi, '.')
    .replace(/, and it is offered by both your artist and your provider\./gi, '.');
}

function cleanHomepageGroups(groups) {
  if (!Array.isArray(groups)) return groups;
  return groups.map((group) => ({
    ...group,
    description:
      typeof group.description === 'string'
        ? group.description.replace(/,? permanent jewelry,?/gi, ',').replace(/, and/gi, ' and')
        : group.description,
  }));
}

function cleanServiceFaqs(faqs) {
  if (!Array.isArray(faqs)) return faqs;
  return faqs.map((faq) => ({
    ...faq,
    answer:
      typeof faq.answer === 'string'
        ? faq.answer.replace(
            /facial and body waxing, lash services, permanent jewelry, and professional makeup/gi,
            'facial waxing, and Jane Iredale products',
          )
        : faq.answer,
  }));
}

const summary = {
  mode: shouldApply ? 'apply' : 'dry-run',
  dataset,
  delete: documents
    .filter((document) => deleteIdSet.has(document._id))
    .map((document) => ({ _id: document._id, _type: document._type, title: document.title })),
  transferFacialWaxing: facialWaxingIds.filter((id) => byId.has(id)),
  patchHomepage: ['homepage', 'drafts.homepage'].filter((id) => byId.has(id)),
  patchSiteSettings: ['siteSettings', 'drafts.siteSettings'].filter((id) => byId.has(id)),
  patchWaxingCollection: [
    '5ae70d4c-c42e-4824-881e-b6bb4157de7f',
    'drafts.5ae70d4c-c42e-4824-881e-b6bb4157de7f',
  ].filter((id) => byId.has(id)),
};

console.log(JSON.stringify(summary, null, 2));

if (!shouldApply) {
  console.log('\nDry run only. Add --apply to update Sanity.');
  process.exit(0);
}

let transaction = client.transaction();

for (const id of facialWaxingIds) {
  const document = byId.get(id);
  if (!document) continue;
  transaction = transaction.patch(id, {
    set: {
      provider: { _type: 'reference', _ref: 'provider-brandy' },
      description: cleanFacialWaxingDescription(document.description),
    },
  });
}

for (const id of ['homepage', 'drafts.homepage']) {
  const document = byId.get(id);
  if (!document?.serviceGroups) continue;
  transaction = transaction.patch(id, {
    set: { serviceGroups: cleanHomepageGroups(document.serviceGroups) },
  });
}

for (const id of ['siteSettings', 'drafts.siteSettings']) {
  const document = byId.get(id);
  if (!document?.aiSearchFaqs) continue;
  transaction = transaction.patch(id, {
    set: { aiSearchFaqs: cleanServiceFaqs(document.aiSearchFaqs) },
  });
}

for (const id of [
  '5ae70d4c-c42e-4824-881e-b6bb4157de7f',
  'drafts.5ae70d4c-c42e-4824-881e-b6bb4157de7f',
]) {
  if (!byId.has(id)) continue;
  transaction = transaction.patch(id, {
    set: {
      description: 'Facial waxing with hard wax, clear preparation guidance, and walk-in availability.',
    },
  });
}

for (const id of deleteIds) {
  if (byId.has(id)) transaction = transaction.delete(id);
}

await transaction.commit();

const remainingRetired = await client.fetch(
  '*[_id in $ids]{_id,_type,title}',
  { ids: deleteIds },
);
if (remainingRetired.length > 0) {
  throw new Error(`Retired documents remain after migration: ${JSON.stringify(remainingRetired)}`);
}

const transferredFacialWaxing = await client.fetch(
  '*[_id in $ids]{_id,"provider":provider._ref,description}',
  { ids: facialWaxingIds },
);
const invalidFacialWaxing = transferredFacialWaxing.filter(
  (document) =>
    document.provider !== 'provider-brandy' || /Aundrea|Brooke|Pedigo/i.test(document.description ?? ''),
);
if (invalidFacialWaxing.length > 0) {
  throw new Error(`Facial Waxing transfer did not verify: ${JSON.stringify(invalidFacialWaxing)}`);
}

console.log('Departed provider and exclusive services removed successfully.');
