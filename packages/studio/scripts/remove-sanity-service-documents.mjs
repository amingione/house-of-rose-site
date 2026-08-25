import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCliClient } from 'sanity/cli';

const APPLY = process.argv.includes('--apply');
const client = getCliClient({ apiVersion: '2025-04-26' }).withConfig({
  perspective: 'raw',
  useCdn: false,
});

const serviceDocuments = await client.fetch(
  `*[_type in ["service", "serviceCollection"]] | order(_type asc, _id asc)`,
);
const serviceIds = serviceDocuments.map(({ _id }) => _id);

const legacyFieldsByType = {
  blogPost: ['relatedService'],
  comparison: ['optionA.service', 'optionB.service'],
  costGuide: ['treatment', 'relatedServices'],
  localArea: ['servedServices'],
  treatmentPackage: ['servicesIncluded'],
  caseStudy: ['treatment'],
};

const referringDocuments = serviceIds.length
  ? await client.fetch(
      `*[references($serviceIds)] | order(_type asc, _id asc)`,
      { serviceIds },
    )
  : [];

const unsupportedReferences = referringDocuments.filter(
  ({ _type }) =>
    !['service', 'serviceCollection'].includes(_type) &&
    !Object.hasOwn(legacyFieldsByType, _type),
);

const summary = {
  apply: APPLY,
  serviceDocuments: serviceDocuments.map(({ _id, _type, title }) => ({ _id, _type, title })),
  referringDocuments: referringDocuments.map(({ _id, _type, title }) => ({ _id, _type, title })),
  unsupportedReferences: unsupportedReferences.map(({ _id, _type, title }) => ({ _id, _type, title })),
};

console.log(JSON.stringify(summary, null, 2));

if (!APPLY) {
  console.log('\nDry run only. Re-run through `sanity exec --with-user-token -- --apply` to back up and remove these documents.');
  process.exit(0);
}

if (unsupportedReferences.length) {
  throw new Error('Refusing to delete service documents because unsupported references still exist.');
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, '../../..');
const backupDirectory = resolve(repoRoot, '..', 'house-of-rose-site-backups');
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const backupPath = resolve(backupDirectory, `sanity-services-${timestamp}.json`);

await mkdir(backupDirectory, { recursive: true });
await writeFile(
  backupPath,
  `${JSON.stringify({
    exportedAt: new Date().toISOString(),
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    serviceDocuments,
    referringDocuments,
  }, null, 2)}\n`,
  'utf8',
);

let transaction = client.transaction();
for (const document of referringDocuments.filter(({ _type }) => Object.hasOwn(legacyFieldsByType, _type))) {
  transaction = transaction.patch(document._id, {
    unset: legacyFieldsByType[document._type],
  });
}
for (const id of serviceIds) transaction = transaction.delete(id);

await transaction.commit({ visibility: 'sync' });

const remainingServiceCount = await client.fetch(
  `count(*[_type in ["service", "serviceCollection"]])`,
);
const remainingReferences = serviceIds.length
  ? await client.fetch(`count(*[references($serviceIds)])`, { serviceIds })
  : 0;

if (remainingServiceCount !== 0 || remainingReferences !== 0) {
  throw new Error(
    `Cleanup verification failed: ${remainingServiceCount} service documents and ${remainingReferences} references remain.`,
  );
}

console.log(JSON.stringify({
  backupPath,
  deletedDocuments: serviceIds.length,
  cleanedReferringDocuments: referringDocuments.length,
  remainingServiceCount,
  remainingReferences,
}, null, 2));
