#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const PROJECT_ID = '4e7axyi7';
const DATASET = 'production';
const API_VERSION = '2025-08-15';
const LEGACY_ID = 'hor.comparison.daxxify-vs-botox';
const CANONICAL_ID = 'comparison-daxxify-vs-botox';

const apply = process.argv.includes('--apply');
const cliAuth = process.argv.includes('--cli-auth');
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;
const client = cliAuth
  ? getCliClient({ apiVersion: API_VERSION }).withConfig({
      projectId: PROJECT_ID,
      dataset: DATASET,
      useCdn: false,
    })
  : createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token,
      useCdn: false,
    });

const state = await client.fetch(
  `{
    "legacy": *[_id == $legacyId][0]{_id,_rev,title,status,"slug":slug.current},
    "canonical": *[_id == $canonicalId][0]{_id,_rev,title,status,"slug":slug.current}
  }`,
  { legacyId: LEGACY_ID, canonicalId: CANONICAL_ID },
);

if (!state.legacy) throw new Error(`Legacy comparison ${LEGACY_ID} was not found.`);
if (!state.canonical || state.canonical.status !== 'live' || state.canonical.slug !== 'daxxify-vs-botox') {
  throw new Error('The reviewed canonical Daxxify vs. Botox comparison is not live.');
}

const set = {
  title: 'Archived pre-reset Daxxify vs. Botox',
  slug: { _type: 'slug', current: 'archived-daxxify-vs-botox-pre-reset' },
  status: 'parked',
  intro: `Superseded by ${CANONICAL_ID}.`,
};
const unset = ['optionA', 'optionB', 'rows', 'verdict', 'faqs', 'seo'];

if (!apply) {
  console.log(JSON.stringify({ action: 'validate', state, patch: { set, unset } }, null, 2));
  process.exit(0);
}
if (!cliAuth && !token) throw new Error('A Sanity write token is required for --apply.');

const result = await client.patch(LEGACY_ID).set(set).unset(unset).commit({ visibility: 'sync' });
console.log(JSON.stringify({
  action: 'applied',
  document: {
    _id: result._id,
    _rev: result._rev,
    title: result.title,
    slug: result.slug?.current,
    status: result.status,
    intro: result.intro,
    removedFields: unset,
  },
}, null, 2));
