import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isVerifiedGlossGeniusBookingUrl,
  resolveServiceBooking,
} from '../../packages/web/src/lib/booking.ts';

const DIRECT_URL =
  'https://houseofrose.glossgenius.com/book?service_token=verified-token';
const CURRENT_DIRECT_URL =
  'https://houseofrose.glossgenius.com/services?service_token=verified-token';

test('accepts both active GlossGenius service-booking routes', () => {
  assert.equal(isVerifiedGlossGeniusBookingUrl(DIRECT_URL), true);
  assert.equal(isVerifiedGlossGeniusBookingUrl(CURRENT_DIRECT_URL), true);
  assert.equal(
    isVerifiedGlossGeniusBookingUrl(
      'https://houseofrosefl.glossgenius.com/book?service_token=verified-token',
    ),
    false,
  );
  assert.equal(
    isVerifiedGlossGeniusBookingUrl('https://houseofrose.glossgenius.com/services'),
    false,
  );
  assert.equal(
    isVerifiedGlossGeniusBookingUrl('https://houseofrose.glossgenius.com/book'),
    false,
  );
});

test('resolves a direct service with exact analytics metadata', () => {
  const action = resolveServiceBooking(
    { slug: 'biorepeel', bookingMode: 'direct', bookingUrl: CURRENT_DIRECT_URL },
    'service_hero',
  );

  assert.equal(action.href, CURRENT_DIRECT_URL);
  assert.match(action.label, /\b(?:book|reserve|schedule)\b/i);
  assert.equal(action.mode, 'direct');
  assert.equal(action.target, '_blank');
  assert.deepEqual(action.analytics, {
    'data-booking-service': 'biorepeel',
    'data-booking-mode': 'direct',
    'data-cta-location': 'service_hero',
  });
});

test('uses an explicit action-oriented consultation label', () => {
  const action = resolveServiceBooking(
    { slug: 'dermal-fillers', bookingMode: 'consultation', bookingUrl: DIRECT_URL },
    'service_inline',
  );

  assert.match(action.label, /\b(?:book|request|schedule)\b/i);
  assert.match(action.label, /\bconsultation\b/i);
  assert.equal(action.mode, 'consultation');
});

test('falls back to phone when a service is ambiguous or its URL is invalid', () => {
  const missing = resolveServiceBooking(
    { slug: 'forma-rf', bookingMode: 'phone' },
    'service_hero',
  );
  const invalidConsultation = resolveServiceBooking(
    {
      slug: 'unknown-treatment',
      bookingMode: 'consultation',
      bookingUrl: 'https://houseofrose.glossgenius.com/services',
    },
    'service_inline',
  );

  for (const action of [missing, invalidConsultation]) {
    assert.equal(action.href, 'tel:+19414000165');
    assert.match(action.label, /\bcall\b/i);
    assert.equal(action.mode, 'phone');
    assert.equal(action.external, false);
  }
  assert.equal(invalidConsultation.analytics['data-booking-mode'], 'phone');
});
