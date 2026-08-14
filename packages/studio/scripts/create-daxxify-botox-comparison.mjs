#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const PROJECT_ID = '4e7axyi7';
const DATASET = 'production';
const API_VERSION = '2025-04-26';
const COMPARISON_ID = 'comparison-daxxify-vs-botox';
const INJECTABLES_SERVICE_ID = '7bd92dc1-9ced-42bd-a195-e9fa4628a848';

const apply = process.argv.includes('--apply');
const documentOnly = process.argv.includes('--document-only');
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

const option = () => ({
  service: { _type: 'reference', _ref: INJECTABLES_SERVICE_ID },
});

const sourceDocument = {
  _id: COMPARISON_ID,
  _type: 'comparison',
  title: 'Daxxify vs. Botox',
  slug: { _type: 'slug', current: 'daxxify-vs-botox' },
  status: 'live',
  optionA: option(),
  optionB: option(),
  orderRank: 20,
};

const current = await client.fetch(
  `{
    "service": *[_id == $serviceId][0]{_id,title,"slug":slug.current,status,bookingVerifiedAt,"concerns":concerns[]->_id},
    "comparison": *[_id == $comparisonId][0]{_id,_rev,title,status}
  }`,
  { serviceId: INJECTABLES_SERVICE_ID, comparisonId: COMPARISON_ID },
);

if (!current.service || !['live', 'actual-menu'].includes(current.service.status)) {
  throw new Error('The canonical Neurotoxin Injections service is missing or not public.');
}

const document = current.comparison && current.comparison._id !== COMPARISON_ID
  ? { ...sourceDocument, _id: current.comparison._id }
  : sourceDocument;

if (documentOnly) {
  console.log(JSON.stringify(document, null, 2));
  process.exit(0);
}

if (!apply) {
  console.log(JSON.stringify({ action: 'validate', current, document }, null, 2));
  process.exit(0);
}
if (!cliAuth && !token) throw new Error('A Sanity write token is required for --apply.');
if (current.comparison) {
  throw new Error(`Comparison already exists as ${current.comparison._id}; review it in Studio instead of replacing it.`);
}

const result = await client.create(document, { visibility: 'sync' });
const verified = await client.fetch(
  `*[_id == $id][0]{
    _id,_rev,title,"slug":slug.current,status,intro,orderRank,
    "optionA": optionA{label,"service":service->{_id,title,"slug":slug.current}},
    "optionB": optionB{label,"service":service->{_id,title,"slug":slug.current}},
    rows[]{_key,attribute,valueA,valueB},seo
  }`,
  { id: result._id },
);

console.log(JSON.stringify({ action: 'applied', document: verified }, null, 2));
