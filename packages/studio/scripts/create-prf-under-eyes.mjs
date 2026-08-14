#!/usr/bin/env node

import { createClient } from '@sanity/client';

const PROJECT_ID = '4e7axyi7';
const DATASET = 'production';
const API_VERSION = '2025-02-19';
const SERVICE_ID = 'service-prf-under-eyes';
const PARENT_SERVICE_ID = 'c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b';
const PARENT_SERVICE_SLUG = 'prf';
const PUBLIC_SERVICE_STATUSES = new Set(['live', 'actual-menu']);

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const print = args.has('--print');

const document = {
  _id: SERVICE_ID,
  _type: 'service',
  title: 'PRF Under Eyes',
  slug: { _type: 'slug', current: 'prf-under-eyes' },
  collection: { _type: 'reference', _ref: '16b4ca79-a320-4bd8-be88-f69952169f17' },
  kind: 'treatment',
  parentService: { _type: 'reference', _ref: PARENT_SERVICE_ID },
  concerns: [
    { _key: 'dark-circles', _type: 'reference', _ref: '6b793d2e-1932-4b07-b1b7-82a48108c716' },
    { _key: 'volume-loss', _type: 'reference', _ref: 'concern-volume-loss' },
  ],
  bookingMode: 'consultation',
  bookingUrl:
    'https://houseofrose.glossgenius.com/book?service_token=1000f-7a950500-c694-4a9c-9a25-f98fd4e72e6c',
  bookingVerifiedAt: '2026-08-13',
  relatedServices: [
    {
      _key: 'prf-injections',
      _type: 'reference',
      _ref: 'adf66d59-5dcd-4f95-8282-681dafc97d89',
    },
  ],
  orderRank: 131,
  category: 'injectables-bio-fillers',
  provider: { _type: 'reference', _ref: 'provider-diana' },
  providerScope: {
    _type: 'treatmentProviderScope',
    performedBy: 'rn',
    medicalDirection: true,
    credentialPoints: ['Registered nurse (RN)'],
    disclaimer: 'Individual outcomes vary.',
  },
  status: 'actual-menu',
  pricingModel: 'per-session',
  rackPrice: '$495',
  pricingNotes: 'Current House of Rose price: $495. Verified against GlossGenius on 2026-08-13.',
  serviceKey: 'prf-under-eyes',
  googleBusinessProfile: {
    enabled: false,
    priceMode: 'none',
    reconciliationStatus: 'draft',
  },
};

if (print) {
  console.log(JSON.stringify({ action: 'print', document }, null, 2));
  process.exit(0);
}

const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const existing = await client.fetch(
  '*[_type == "service" && slug.current == $slug][0]{_id,_rev,title,status}',
  { slug: document.slug.current },
);

if (existing && apply) {
  if (!token) throw new Error('A Sanity write token is required for --apply.');
  const patched = await client.patch(existing._id).unset(['price']).commit({ visibility: 'sync' });
  console.log(JSON.stringify({ action: 'reconciled', document: { _id: patched._id, _rev: patched._rev, title: patched.title, status: patched.status } }, null, 2));
  process.exit(0);
}

if (existing) {
  console.log(JSON.stringify({ action: 'exists', document: existing }, null, 2));
  process.exit(0);
}

const parentService = await client.fetch(
  '*[_type == "service" && _id == $id][0]{_id,"slug":slug.current,status,kind}',
  { id: PARENT_SERVICE_ID },
);

if (
  !parentService ||
  parentService.slug !== PARENT_SERVICE_SLUG ||
  parentService.kind !== 'hub' ||
  !PUBLIC_SERVICE_STATUSES.has(parentService.status)
) {
  throw new Error(
    `Refusing to create ${document.slug.current}: ${PARENT_SERVICE_ID} is not the public ${PARENT_SERVICE_SLUG} service hub.`,
  );
}

if (!apply) {
  console.log(JSON.stringify({ action: 'validate', parentService, document }, null, 2));
  process.exit(0);
}

if (!token) throw new Error('A Sanity write token is required for --apply.');

const created = await client.create(document);
console.log(
  JSON.stringify(
    {
      action: 'created',
      document: {
        _id: created._id,
        _rev: created._rev,
        title: created.title,
        slug: created.slug?.current,
        status: created.status,
      },
    },
    null,
    2,
  ),
);
