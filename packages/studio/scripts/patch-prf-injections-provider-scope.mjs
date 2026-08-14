#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { getCliClient } from 'sanity/cli';

const PROJECT_ID = '4e7axyi7';
const DATASET = 'production';
const API_VERSION = '2025-08-15';
const SERVICE_ID = 'adf66d59-5dcd-4f95-8282-681dafc97d89';
const DIANA_PROVIDER_ID = 'provider-diana';

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

const providerScope = {
  _type: 'treatmentProviderScope',
  performedBy: 'rn',
  medicalDirection: true,
  credentialPoints: ['Registered nurse (RN)'],
  consultRequired: true,
  disclaimer: 'Individual outcomes vary.',
};

const current = await client.fetch(
  `*[_id == $id][0]{
    _id,_rev,title,"slug":slug.current,status,
    "providerId":provider._ref,providerScope
  }`,
  { id: SERVICE_ID },
);

if (!current || current.slug !== 'prf-injections' || !['live', 'actual-menu'].includes(current.status)) {
  throw new Error('The canonical public PRF Injections service was not found.');
}
if (current.providerId !== DIANA_PROVIDER_ID) {
  throw new Error(`PRF Injections provider is ${current.providerId ?? 'unset'}, not ${DIANA_PROVIDER_ID}.`);
}

if (!apply) {
  console.log(JSON.stringify({ action: 'validate', current, patch: { providerScope } }, null, 2));
  process.exit(0);
}
if (!cliAuth && !token) throw new Error('A Sanity write token is required for --apply.');

const result = await client.patch(SERVICE_ID).set({ providerScope }).commit({ visibility: 'sync' });
console.log(JSON.stringify({
  action: 'applied',
  document: {
    _id: result._id,
    _rev: result._rev,
    title: result.title,
    slug: result.slug?.current,
    provider: result.provider,
    providerScope: result.providerScope,
  },
}, null, 2));
