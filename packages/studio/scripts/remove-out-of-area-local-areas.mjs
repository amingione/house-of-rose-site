/**
 * Removes `localArea` records for communities outside the verified service area.
 *
 * The verified service-area names are Punta Gorda, Port Charlotte, Charlotte
 * Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles
 * (docs/GOOGLE-BUSINESS-PROFILE.md). That doc also states plainly: do not add
 * Fort Myers, Sarasota, North Port, or Englewood because a keyword tool reports
 * demand there. The records below are the leftovers of exactly that expansion —
 * they carry the superseded "Advanced Aesthetics Near" descriptor and target
 * counties the ads account already negative-keywords.
 *
 * Dry run:  sanity exec --with-user-token scripts/remove-out-of-area-local-areas.mjs
 * Apply:    sanity exec --with-user-token scripts/remove-out-of-area-local-areas.mjs -- --apply
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCliClient } from 'sanity/cli';

const APPLY = process.argv.includes('--apply');
const client = getCliClient({ apiVersion: '2025-04-26' }).withConfig({
  perspective: 'raw',
  useCdn: false,
});

/** Verified service area. Anything else is expansion drift, not inventory. */
const RETIRED_AREA_SLUGS = ['englewood', 'fort-myers', 'north-port', 'sarasota', 'venice'];

const areaDocuments = await client.fetch(
  `*[_type == "localArea" && slug.current in $slugs] | order(_id asc)`,
  { slugs: RETIRED_AREA_SLUGS },
);
const areaIds = areaDocuments.map(({ _id }) => _id);

// Drafts carry the same slug, so collect both the published and draft IDs.
const deletableIds = areaIds.flatMap((id) =>
  id.startsWith('drafts.') ? [id] : [id, `drafts.${id}`],
);

const referringDocuments = areaIds.length
  ? await client.fetch(`*[references($areaIds)] | order(_type asc, _id asc)`, { areaIds })
  : [];

console.log(JSON.stringify({
  apply: APPLY,
  areaDocuments: areaDocuments.map(({ _id, slug, city, title }) => ({
    _id,
    slug: slug?.current,
    city,
    title,
  })),
  referringDocuments: referringDocuments.map(({ _id, _type, title }) => ({ _id, _type, title })),
}, null, 2));

if (!APPLY) {
  console.log('\nDry run only. Re-run with `-- --apply` to back up and remove these documents.');
  process.exit(0);
}

if (referringDocuments.length) {
  throw new Error('Refusing to delete local-area documents because inbound references still exist.');
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, '../../..');
const backupDirectory = resolve(repoRoot, '..', 'house-of-rose-site-backups');
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const backupPath = resolve(backupDirectory, `sanity-local-areas-${timestamp}.json`);

await mkdir(backupDirectory, { recursive: true });
await writeFile(
  backupPath,
  `${JSON.stringify({
    exportedAt: new Date().toISOString(),
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    areaDocuments,
  }, null, 2)}\n`,
  'utf8',
);

let transaction = client.transaction();
for (const id of deletableIds) transaction = transaction.delete(id);
await transaction.commit({ visibility: 'sync' });

const remainingCount = await client.fetch(
  `count(*[_type == "localArea" && slug.current in $slugs])`,
  { slugs: RETIRED_AREA_SLUGS },
);

if (remainingCount !== 0) {
  throw new Error(`Cleanup verification failed: ${remainingCount} out-of-area documents remain.`);
}

console.log(JSON.stringify({ backupPath, deletedDocuments: areaIds.length, remainingCount }, null, 2));
