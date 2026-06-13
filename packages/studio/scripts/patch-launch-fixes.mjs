// One-off launch fixes. Run: node scripts/patch-launch-fixes.mjs
// Uses the local Sanity CLI auth token (~/.config/sanity/config.json) with @sanity/client.
// 1. Correct NAP ZIP (33982 -> 33950) so Site Settings matches canonical NAP + homepage schema
// 2. Remove "med spas" from Margaret H. testimonial per brand positioning rule
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@sanity/client';

const cfg = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8'));
const token = cfg.authToken;
if (!token) { console.error('No authToken in Sanity CLI config'); process.exit(1); }

const client = createClient({
  projectId: '4e7axyi7',
  dataset: 'production',
  apiVersion: '2025-04-26',
  token,
  useCdn: false,
});

const run = async () => {
  const s = await client
    .patch('siteSettings')
    .set({ address: '525 E Olympia Ave, Unit 9\nPunta Gorda, FL 33950' })
    .commit();
  console.log('OK siteSettings.address ->', s.address.replace('\n', ' '));

  const t = await client
    .patch('bd71157a-9b4f-4316-bae3-4162c948aaa7')
    .set({
      quote:
        'I came in skeptical. I had been to other places and always felt like I was being upsold or rushed. House of Rose was different from the first consultation. They listened, explained what they were actually recommending and why, and the results have been exactly what we discussed. I trust them completely.',
    })
    .commit();
  console.log('OK testimonial', t._id, '-> med spa removed');
};

run().then(() => { console.log('All launch fixes applied.'); process.exit(0); })
  .catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
