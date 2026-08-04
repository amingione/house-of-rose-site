/**
 * Reconcile public Sanity services with verified GlossGenius booking actions.
 *
 * Dry run (default):
 *   node scripts/run-with-env.mjs node packages/studio/scripts/reconcile-glossgenius-booking.mjs
 * Apply after reviewing the dry run:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/reconcile-glossgenius-booking.mjs --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@sanity/client';
import {
  BOOKING_VERIFIED_AT,
  GLOSSGENIUS_BOOKING_MAP,
  bookingUrlFor,
} from './glossgenius-booking-map.mjs';

const APPLY = process.argv.includes('--apply');
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7';
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (APPLY && !token) {
  throw new Error('SANITY_API_WRITE_TOKEN is required with --apply.');
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const fetchLiveGlossGeniusTokens = async () => {
  const response = await fetch('https://houseofrose.glossgenius.com/services');
  if (!response.ok) throw new Error(`GlossGenius catalog returned ${response.status}.`);
  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (!match) throw new Error('GlossGenius catalog did not expose its service data.');
  const data = JSON.parse(match[1]);
  const users = data?.props?.serverContext?.publicUser?.users;
  if (!Array.isArray(users)) throw new Error('GlossGenius catalog service list was missing.');

  const tokens = new Set();
  for (const user of users) {
    for (const service of Array.isArray(user.services) ? user.services : []) {
      if (typeof service.token === 'string') tokens.add(service.token);
      for (const option of Array.isArray(service.options) ? service.options : []) {
        if (typeof option.token === 'string') tokens.add(option.token);
      }
    }
  }
  return tokens;
};

const liveTokens = await fetchLiveGlossGeniusTokens();
for (const entry of GLOSSGENIUS_BOOKING_MAP) {
  if (entry.token && !liveTokens.has(entry.token)) {
    throw new Error(`GlossGenius token is no longer live: ${entry.slug} (${entry.token}).`);
  }
}

const ids = GLOSSGENIUS_BOOKING_MAP.flatMap((entry) => [entry.id, `drafts.${entry.id}`]);
const documents = await client.fetch(
  '*[_type == "service" && _id in $ids]{_id,"publishedId":string::split(_id,"drafts.")[-1],title,"slug":slug.current,bookingMode,bookingUrl,bookingVerifiedAt}',
  { ids },
);
const byPublishedId = new Map();
for (const document of documents) {
  const rows = byPublishedId.get(document.publishedId) ?? [];
  rows.push(document);
  byPublishedId.set(document.publishedId, rows);
}

const rollback = [];
const changes = [];
for (const entry of GLOSSGENIUS_BOOKING_MAP) {
  const matchingDocuments = byPublishedId.get(entry.id) ?? [];
  const published = matchingDocuments.find((document) => document._id === entry.id);
  if (!published) throw new Error(`Published Sanity service is missing: ${entry.id} (${entry.slug}).`);
  if (published.slug !== entry.slug) {
    throw new Error(`Slug mismatch for ${entry.id}: expected ${entry.slug}, found ${published.slug}.`);
  }

  const next = {
    bookingMode: entry.mode,
    bookingUrl: bookingUrlFor(entry),
    bookingVerifiedAt: BOOKING_VERIFIED_AT,
  };
  for (const document of matchingDocuments) {
    rollback.push({
      _id: document._id,
      bookingMode: document.bookingMode ?? null,
      bookingUrl: document.bookingUrl ?? null,
      bookingVerifiedAt: document.bookingVerifiedAt ?? null,
    });
    if (
      document.bookingMode !== next.bookingMode ||
      (document.bookingUrl ?? undefined) !== next.bookingUrl ||
      document.bookingVerifiedAt !== next.bookingVerifiedAt
    ) {
      changes.push({ document, entry, next });
    }
  }
}

console.log(`Verified ${liveTokens.size} live GlossGenius tokens.`);
console.log(`${changes.length} Sanity document change(s) required.`);
for (const { document, next } of changes) {
  console.log(`- ${document._id}: ${next.bookingMode}${next.bookingUrl ? ` → ${next.bookingUrl}` : ''}`);
}

if (!APPLY) {
  console.log('Dry run only. Re-run with --apply to patch the verified fields.');
  process.exit(0);
}

const backupDirectory = resolve('.sanity', 'booking-reconciliation');
mkdirSync(backupDirectory, { recursive: true });
const rollbackPath = resolve(backupDirectory, `rollback-${BOOKING_VERIFIED_AT}.json`);
writeFileSync(rollbackPath, `${JSON.stringify(rollback, null, 2)}\n`, { flag: 'wx' });

let transaction = client.transaction();
for (const { document, next } of changes) {
  transaction = transaction.patch(document._id, (patch) => {
    const configured = patch.set({
      bookingMode: next.bookingMode,
      bookingVerifiedAt: next.bookingVerifiedAt,
    });
    return next.bookingUrl
      ? configured.set({ bookingUrl: next.bookingUrl })
      : configured.unset(['bookingUrl']);
  });
}
if (changes.length > 0) await transaction.commit();

console.log(`Applied ${changes.length} change(s).`);
console.log(`Rollback manifest: ${rollbackPath}`);
