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

const option = (label, summary) => ({
  label,
  summary,
  service: { _type: 'reference', _ref: INJECTABLES_SERVICE_ID },
});

const row = (_key, attribute, valueA, valueB) => ({
  _key,
  _type: 'comparisonRow',
  attribute,
  valueA,
  valueB,
});

const faq = (_key, question, answer) => ({
  _key,
  _type: 'faq',
  question,
  answer,
});

const sourceDocument = {
  _id: COMPARISON_ID,
  _type: 'comparison',
  title: 'Daxxify vs. Botox',
  slug: { _type: 'slug', current: 'daxxify-vs-botox' },
  status: 'live',
  intro:
    'Daxxify and Botox are two botulinum toxin type A products on the House of Rose Neurotoxin Injections menu. Each is listed at $14 per unit, but their unit systems cannot be compared or converted.',
  optionA: option(
    'Daxxify',
    'DaxibotulinumtoxinA-lanm with the 35-amino-acid RTP004 peptide excipient. The current House of Rose menu lists Daxxify at $14 per unit and 60 minutes.',
  ),
  optionB: option(
    'Botox',
    'OnabotulinumtoxinA in a formulation that includes human albumin. The current House of Rose menu lists Botox at $14 per unit and 30 minutes.',
  ),
  rows: [
    row('active-product', 'Active product', 'Daxxify · daxibotulinumtoxinA-lanm', 'Botox · onabotulinumtoxinA'),
    row(
      'formulation',
      'Formulation distinction',
      'Includes the 35-amino-acid RTP004 peptide excipient',
      'Includes human albumin and sodium chloride',
    ),
    row(
      'current-price',
      'Current House of Rose price',
      '$14 per Daxxify unit; units are not convertible to Botox units',
      '$14 per Botox unit',
    ),
    row('appointment-length', 'Current appointment length', '60 minutes', '30 minutes'),
    row(
      'published-duration',
      'Published glabellar-line duration evidence',
      'Median 24.0 and 23.9 weeks maintaining none-or-mild severity at maximum frown in two phase 3 trials',
      'Median 120 days among day-30 responders at maximum contraction in a pooled analysis',
    ),
  ],
  faqs: [
    faq(
      'units',
      'Are Daxxify and Botox units interchangeable?',
      'No. The prescribing information for both products states that their potency units are product-specific and cannot be compared or converted between botulinum toxin products.',
    ),
    faq(
      'same-price',
      'Does the same $14-per-unit price mean the total price is the same?',
      'No. House of Rose lists both products at $14 per unit, but the units are not equivalent. The per-unit prices do not create a dose-conversion table or establish the same total treatment price.',
    ),
    faq(
      'duration',
      'Does Daxxify last longer than Botox?',
      'Separate glabellar-line studies reported different duration endpoints for the two products, but they were not a direct head-to-head trial. The published figures should be read as product-specific study results, and individual duration varies.',
    ),
  ],
  verdict:
    'The price per unit is the same on the current House of Rose menu, but the products, unit systems, formulations, and published duration evidence are not the same. The cited duration studies were separate—not a direct head-to-head comparison—and individual outcomes vary.',
  orderRank: 20,
  seo: {
    _type: 'seo',
    metaTitle: 'Daxxify vs. Botox | House of Rose Aesthetics',
    metaDescription:
      'Compare Daxxify and Botox by formulation, current House of Rose pricing, appointment length, unit limitations, and published duration evidence.',
  },
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
