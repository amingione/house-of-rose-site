// TEMP migration (delete after): "Procell"/"ProCell" -> "procell" across all live
// Sanity docs, preserving the company name "Procell Therapies" (owner decision).
// Dry-run by default; APPLY=1 writes + publishes live.
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const ROOT = '/Users/ambermingione/LocalStorm/Workspace/DevProjects/GitHub/house-of-rose-site';
const parseEnv = (p) => {
  try {
    return Object.fromEntries(
      readFileSync(p, 'utf8')
        .split('\n')
        .filter((l) => l && !l.startsWith('#') && l.includes('='))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
        }),
    );
  } catch {
    return {};
  }
};
const webEnv = parseEnv(`${ROOT}/packages/web/.env.local`);
const rootEnv = parseEnv(`${ROOT}/.env.local`);
// Candidate write tokens (dedup, keep order: web first, then root)
const candidates = [
  ['web.SANITY_API_WRITE_TOKEN', webEnv.SANITY_API_WRITE_TOKEN],
  ['root.SANITY_API_WRITE_TOKEN', rootEnv.SANITY_API_WRITE_TOKEN],
  ['web.SANITY_ACCESS_TOKEN', webEnv.SANITY_ACCESS_TOKEN],
  ['root.SANITY_ACCESS_TOKEN', rootEnv.SANITY_ACCESS_TOKEN],
].filter(([, v], i, a) => v && a.findIndex(([, w]) => w === v) === i);

const mkClient = (token) =>
  createClient({ projectId: '4e7axyi7', dataset: 'production', apiVersion: '2025-04-26', token, useCdn: false, perspective: 'raw' });

let client = null;
for (const [name, token] of candidates) {
  try {
    const c = mkClient(token);
    await c.fetch('*[_type=="siteSettings"][0]._id'); // trivial authed read
    // confirm write scope with a no-op transaction on a throwaway (dry check via mutate with returnDocuments won't write); skip — read auth is enough signal
    client = c;
    console.log(`Using token: ${name}`);
    break;
  } catch (e) {
    console.log(`Token ${name}: FAILED (${e?.response?.body?.error || e.message})`);
  }
}
if (!client) throw new Error('No working Sanity token found in either .env.local');

const APPLY = process.env.APPLY === '1';

// Lowercase the brand word, but keep the company name "Procell Therapies".
// Structural fields (slugs, _id, _ref, _type, _key) are lowercase already, so a
// capital-P match never reaches them.
const fixString = (s) => s.replace(/Pro[Cc]ell( Therapies)?/g, (m, ther) => (ther ? m : 'procell'));

let diffs = [];
const walk = (val, path) => {
  if (typeof val === 'string') {
    const next = fixString(val);
    if (next !== val) diffs.push({ path, before: val, after: next });
    return next;
  }
  if (Array.isArray(val)) return val.map((v, i) => walk(v, `${path}[${i}]`));
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = k.startsWith('_') || k === 'current' ? v : walk(v, path ? `${path}.${k}` : k);
    return out;
  }
  return val;
};

// Exclude drafts-of-releases (versions.**) and ALL system docs (_.**, e.g. _.schemas.*)
const all = await client.fetch('*[!(_id in path("versions.**")) && !(_id in path("_.**"))]');
const targets = all
  .filter((d) => !d._id.startsWith('_.') && d._type !== 'system.schema' && !d._type.startsWith('sanity.'))
  .filter((d) => JSON.stringify(d).match(/Pro[Cc]ell/));
console.log(`Scanned ${all.length} docs; ${targets.length} contain the brand word.\n`);

const tx = client.transaction();
let docsChanged = 0;
const trunc = (s) => (s.length > 90 ? s.slice(0, 90) + '…' : s);
for (const doc of targets) {
  diffs = [];
  const fixed = walk(doc, '');
  if (!diffs.length) continue; // only "Procell Therapies" -> unchanged
  docsChanged++;
  console.log(`• [${doc._type}] ${doc._id}  (${diffs.length} change(s))`);
  for (const d of diffs) console.log(`    ${d.path}: "${trunc(d.before)}"  ->  "${trunc(d.after)}"`);
  tx.createOrReplace(fixed);
}

console.log(`\n${docsChanged} doc(s) would change.`);
if (!APPLY) console.log('DRY RUN — no writes. Re-run with APPLY=1 to publish live.');
else {
  const res = await tx.commit();
  console.log(`APPLIED — committed ${res.results.length} mutation(s) live.`);
}
