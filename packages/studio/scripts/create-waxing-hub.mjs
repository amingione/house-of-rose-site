#!/usr/bin/env node

import { createClient } from '@sanity/client';

const PROJECT_ID = '4e7axyi7';
const DATASET = 'production';
const API_VERSION = '2025-04-26';
const HUB_ID = 'service-waxing';
const COLLECTION_ID = '5ae70d4c-c42e-4824-881e-b6bb4157de7f';
const BODY_WAXING_ID = '8f3a3755-2633-4bfc-9b04-41696ffba1e1';
const FACIAL_WAXING_ID = 'service-facial-waxing';

const apply = process.argv.includes('--apply');
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const hub = {
  _id: HUB_ID,
  _type: 'service',
  title: 'Waxing',
  slug: { _type: 'slug', current: 'waxing' },
  collection: { _type: 'reference', _ref: COLLECTION_ID },
  kind: 'hub',
  bookingMode: 'phone',
  bookingVerifiedAt: '2026-08-13',
  orderRank: 59,
  category: 'beauty-enhancements',
  status: 'live',
  serviceKey: 'waxing',
  googleBusinessProfile: {
    enabled: false,
    priceMode: 'none',
    reconciliationStatus: 'draft',
  },
};

const current = await client.fetch(
  `{
    "hub": *[_type == "service" && slug.current == "waxing"][0]{_id,title,status},
    "collection": *[_id == $collectionId][0]{_id,title,"slug":slug.current},
    "children": *[_id in [$bodyId, $facialId]] | order(_id asc){_id,title,"slug":slug.current,status,kind,parentService}
  }`,
  { collectionId: COLLECTION_ID, bodyId: BODY_WAXING_ID, facialId: FACIAL_WAXING_ID },
);

if (current.hub && current.hub._id !== HUB_ID) {
  throw new Error(`Waxing slug is already owned by ${current.hub._id}; refusing to create a parallel service.`);
}
if (current.collection?._id !== COLLECTION_ID || current.children?.length !== 2) {
  throw new Error('The verified Waxing collection or its two current child services are missing.');
}

if (!apply) {
  console.log(JSON.stringify({ action: 'validate', hub, current }, null, 2));
  process.exit(0);
}
if (!token) throw new Error('A Sanity write token is required for --apply.');

const parentService = { _type: 'reference', _ref: HUB_ID };
const transaction = client
  .transaction()
  .createIfNotExists(hub)
  .patch(HUB_ID, { unset: ['provider'] })
  .patch(BODY_WAXING_ID, { set: { kind: 'treatment', parentService } })
  .patch(FACIAL_WAXING_ID, { set: { kind: 'treatment', parentService } });

const result = await transaction.commit({ visibility: 'sync' });
const verified = await client.fetch(
  `*[_id == $hubId][0]{
    _id,_rev,title,"slug":slug.current,status,kind,bookingMode,provider,
    "children": *[_type == "service" && parentService._ref == ^._id] | order(orderRank asc){_id,title,"slug":slug.current,status,kind}
  }`,
  { hubId: HUB_ID },
);

console.log(JSON.stringify({ action: 'applied', transactionId: result.transactionId, document: verified }, null, 2));
