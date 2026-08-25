#!/usr/bin/env node

import { getCliClient } from 'sanity/cli';

const SERVICE_ID = 'service-sculpt-and-lift-facial';
const OLD_TITLE = 'Sculpt & Lift Facial';
const OLD_SLUG = 'sculpt-and-lift-facial';
const NEW_TITLE = 'Radiance & Renewal Facial';
const NEW_SLUG = 'radiance-and-renewal-facial';
const BOOKING_URL =
  'https://houseofrose.glossgenius.com/book?service_token=1000f-26e5732c-ec4a-4c65-a0c8-75af7bd6d9b0';

const apply = process.argv.includes('--apply');
const client = getCliClient({ apiVersion: '2025-04-26' });

const current = await client.fetch(
  '*[_id == $id][0]{_id,_rev,title,"slug":slug.current,status}',
  { id: SERVICE_ID },
);

if (!current) {
  throw new Error(`Missing Sanity service ${SERVICE_ID}.`);
}

if (current.title === NEW_TITLE && current.slug === NEW_SLUG) {
  console.log(JSON.stringify({ action: 'already-renamed', document: current }, null, 2));
  process.exit(0);
}

if (
  current.title !== OLD_TITLE ||
  current.slug !== OLD_SLUG ||
  current.status !== 'parked'
) {
  throw new Error(`Refusing to patch unexpected record: ${JSON.stringify(current)}`);
}

const set = {
  title: NEW_TITLE,
  slug: { _type: 'slug', current: NEW_SLUG },
  duration: '1 hour 15 minutes',
  description:
    'Radiance & Renewal Facial is a 75-minute facial provided by Brandy Case, Licensed Esthetician. The appointment combines a double cleanse and enzyme exfoliation with a professional chemical peel.',
  process: ['Double cleanse', 'Enzyme exfoliation', 'Professional chemical peel'],
  price: '$200',
  rackPrice: '$200',
  pricingModel: 'per-session',
  pricingNotes:
    'Verified in the live GlossGenius account on 2026-08-25: fixed $200, 75 minutes, online booking enabled, and Brandy Case assigned.',
  bookingMode: 'direct',
  bookingUrl: BOOKING_URL,
  bookingVerifiedAt: '2026-08-25',
  category: 'skin-renewal',
  provider: { _type: 'reference', _ref: 'provider-brandy' },
  status: 'parked',
};

const unset = ['tagline', 'whoItsFor', 'faqs', 'competitorPricing'];

if (!apply) {
  console.log(
    JSON.stringify({ action: 'validate', document: current, patch: { set, unset } }, null, 2),
  );
  process.exit(0);
}

const updated = await client
  .patch(SERVICE_ID)
  .ifRevisionId(current._rev)
  .set(set)
  .unset(unset)
  .commit({ visibility: 'sync' });

console.log(
  JSON.stringify(
    {
      action: 'renamed',
      document: {
        _id: updated._id,
        _rev: updated._rev,
        title: updated.title,
        slug: updated.slug?.current,
        status: updated.status,
        duration: updated.duration,
        bookingMode: updated.bookingMode,
        bookingVerifiedAt: updated.bookingVerifiedAt,
      },
    },
    null,
    2,
  ),
);
