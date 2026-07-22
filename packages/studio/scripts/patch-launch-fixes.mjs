// One-off launch fixes. Run: node scripts/patch-launch-fixes.mjs
// Uses the local Sanity CLI auth token (~/.config/sanity/config.json) with @sanity/client.
// 1. Correct NAP ZIP (33982 -> 33950) so Site Settings matches canonical NAP + homepage schema
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@sanity/client';

const cfg = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8'));
const token = cfg.authToken;
if (!token) { console.error('No authToken in Sanity CLI config'); process.exit(1); }

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION;

if (!projectId) { console.error('Missing SANITY_STUDIO_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID'); process.exit(1); }
if (!dataset) { console.error('Missing SANITY_STUDIO_DATASET or PUBLIC_SANITY_DATASET'); process.exit(1); }
if (!apiVersion) { console.error('Missing SANITY_API_VERSION or PUBLIC_SANITY_API_VERSION'); process.exit(1); }

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const run = async () => {
  const s = await client
    .patch('siteSettings')
    .set({ address: '525 E Olympia Ave, Unit 9\nPunta Gorda, FL 33950' })
    .commit();
  console.log('OK siteSettings.address ->', s.address.replace('\n', ' '));

};

run().then(() => { console.log('All launch fixes applied.'); process.exit(0); })
  .catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
