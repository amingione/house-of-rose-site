import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLeadMeasurementReceipt,
  verifyLeadMeasurementReceipt,
} from '../../packages/web/netlify/functions/_lib/measurement-receipt';
import {
  createConsentState,
  parseAttributionParameters,
} from '../../packages/web/src/lib/measurement';
import {
  effectiveAvailability,
  toGoogleProduct,
} from '../../packages/web/src/lib/googleProduct';
import type { Product } from '../../packages/web/src/lib/queries';

test('GPC forces every advertising signal denied without changing analytics choice', () => {
  const state = createConsentState(
    {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
    'preferences',
    true,
    new Date('2026-07-24T12:00:00.000Z'),
  );
  assert.equal(state.analytics_storage, 'granted');
  assert.equal(state.ad_storage, 'denied');
  assert.equal(state.ad_user_data, 'denied');
  assert.equal(state.ad_personalization, 'denied');
  assert.equal(state.source, 'gpc');
  assert.equal(state.expiresAt, '2027-01-20T12:00:00.000Z');
});

test('attribution parser allowlists and bounds click/campaign values', () => {
  const parsed = parseAttributionParameters(
    new URLSearchParams({
      gclid: `  ${'a'.repeat(400)}\u0000`,
      utm_source: 'google',
      email: 'must-not-appear@example.com',
    }),
  );
  assert.equal(parsed.gclid?.length, 300);
  assert.equal(parsed.utm_source, 'google');
  assert.equal('email' in parsed, false);
});

test('lead measurement receipts reject expiration and tampering', () => {
  const secret = 'test-only-secret';
  const valid = createLeadMeasurementReceipt(
    { version: 1, leadId: 'lead-1', nonce: 'one', expiresAt: Date.now() + 60_000 },
    secret,
  );
  assert.equal(verifyLeadMeasurementReceipt(valid, secret)?.leadId, 'lead-1');
  assert.equal(verifyLeadMeasurementReceipt(`${valid}x`, secret), null);

  const expired = createLeadMeasurementReceipt(
    { version: 1, leadId: 'lead-1', nonce: 'two', expiresAt: Date.now() - 1 },
    secret,
  );
  assert.equal(verifyLeadMeasurementReceipt(expired, secret), null);
});

test('Merchant transformer preserves the canonical SKU and inventory availability', () => {
  const product: Product = {
    _id: 'product-1',
    title: 'Daily Cleanser',
    slug: 'daily-cleanser',
    brand: 'glymed',
    brandName: 'GlyMed+',
    sku: 'HOR-GLY-0001',
    price: 4200,
    inventoryQuantity: 0,
    availability: 'in_stock',
    identifierExists: false,
    merchantStatus: 'eligible',
    image: {
      asset: {
        url: 'https://cdn.sanity.io/images/example/product.jpg',
        metadata: { dimensions: { width: 1200, height: 1200 } },
      },
    },
  };
  assert.equal(effectiveAvailability(product), 'out_of_stock');
  const transformed = toGoogleProduct(product, 'https://houseofrosefl.com/');
  assert.equal(transformed.id, product.sku);
  assert.equal(transformed.link, 'https://houseofrosefl.com/shop/daily-cleanser/');
  assert.equal(transformed.identifierExists, false);
});
