// TEMP migration (delete after): "Procell"/"ProCell" -> "procell" across all live
// Sanity docs, preserving the company name "Procell Therapies" (owner decision).
// Dry-run by default; APPLY=1 writes + publishes live.
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const ROOT = '/Users/ambermingione/LocalStorm/Workspace/DevProjects/GitHub/house-of-rose-site';
const env = Object.fromEntries(
  readFileSync(`${ROOT}/.env.local`, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    }),
);
const token = env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error('SANITY_API_WRITE_TOKEN not found in .env.local');

const client = createClient({
  projectId: '4e7axyi7',
  dataset: 'production',
  apiVersion: '2025-04-26',
  token,
  useCdn: false,
});

const APPLY = process.env.APPLY === '1';

// Lowercase the brand word, but keep the company name "Procell Therapies".
// Structural fields (slugs, _id, _ref, _type, _key) are lowercase already, so a
// capital-P match never reaches them.
const fixString = (s) => s.replace(/Pro[Cc]ell( Therapies)?/g, (m, ther) => (ther ? m : 'procell'));

let changedStrings = 0;
const walk = (val) => {
  if (typeof val === 'string') {
    const next = fixString(val);
    if (next !== val) changedStrings++;
    return next;
  }
  if (Array.isArray(val)) return val.map(walk);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = k.startsWith('_') || k === 'current' ? v : walk(v);
    return out;
  }
  return val;
};

const all = await client.fetch('*[!(_id in path("versions.**"))]');
const targets = all.filter((d) => JSON.stringify(d).match(/Pro[Cc]ell/));
console.log(`Scanned ${all.length} docs; ${targets.length} contain the brand word.\n`);

const tx = client.transaction();
let docsChanged = 0;
for (const doc of targets) {
  changedStrings = 0;
  const fixed = walk(doc);
  if (JSON.stringify(fixed) === JSON.stringify(doc)) continue; // only "Procell Therapies" -> unchanged
  docsChanged++;
  console.log(`• [${doc._type}] ${doc._id}`);
  if (doc.title && fixed.title !== doc.title) console.log(`    title: "${doc.title}"  ->  "${fixed.title}"`);
  console.log(`    (${changedStrings} string field(s) changed)`);
  tx.createOrReplace(fixed);
}

console.log(`\n${docsChanged} doc(s) would change.`);
if (!APPLY) console.log('DRY RUN — no writes. Re-run with APPLY=1 to publish live.');
else {
  const res = await tx.commit();
  console.log(`APPLIED — committed ${res.results.length} mutation(s) live.`);
}
