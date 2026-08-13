/** Replace the homepage experience copy with the owner-directed restrained voice. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { createClient } from '@sanity/client';

const APPLY = process.argv.includes('--apply');
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (APPLY && !token) {
  throw new Error('SANITY_API_WRITE_TOKEN is required with --apply.');
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token,
  useCdn: false,
});

const copy = {
  expKicker: 'The practice',
  expHeading: 'Inside House of Rose.',
  expPara1: 'These are the actual treatment rooms and storefront at 525 E Olympia Avenue in Punta Gorda.',
};

const fieldsToUnset = ['expPara2'];

const documents = await client.fetch('*[_id in ["homepage", "drafts.homepage"]]');
const published = documents.find((document) => document._id === 'homepage');

if (!published) {
  throw new Error('Published homepage singleton is missing.');
}

const changedFields = Object.keys(copy).filter((field) =>
  documents.some((document) => !isDeepStrictEqual(document[field], copy[field])),
);
const populatedRemovedFields = fieldsToUnset.filter((field) =>
  documents.some((document) => document[field] !== undefined),
);

console.log(`${changedFields.length + populatedRemovedFields.length} homepage field(s) require refinement.`);
console.log([...changedFields, ...populatedRemovedFields].map((field) => `- ${field}`).join('\n'));

if (!APPLY) {
  console.log('Dry run only. Re-run with --apply after review.');
  process.exit(0);
}

const backupDirectory = resolve('.sanity', 'homepage-voice');
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const backupPath = resolve(backupDirectory, `rollback-${timestamp}.json`);
mkdirSync(backupDirectory, { recursive: true });
writeFileSync(backupPath, `${JSON.stringify(documents, null, 2)}\n`, { flag: 'wx' });

let transaction = client.transaction();
for (const document of documents) {
  transaction = transaction.patch(document._id, (patch) => patch.set(copy).unset(fieldsToUnset));
}
await transaction.commit();

console.log(`Updated ${documents.length} homepage document(s).`);
console.log(`Rollback snapshot: ${backupPath}`);
