import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createLeadMeasurementReceipt,
  verifyLeadMeasurementReceipt,
} from '../../packages/web/netlify/functions/_lib/measurement-receipt';
import {
  createConsentState,
  getConsent,
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

test('GPC overrides stored advertising grants when consent is read', () => {
  const localStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const gpcDescriptor = Object.getOwnPropertyDescriptor(globalThis.navigator, 'globalPrivacyControl');
  const stored = createConsentState(
    {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
    'preferences',
    false,
    new Date('2026-08-14T12:00:00.000Z'),
  );

  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: { getItem: () => JSON.stringify(stored) },
    });
    Object.defineProperty(globalThis.navigator, 'globalPrivacyControl', {
      configurable: true,
      value: true,
    });

    const effective = getConsent();
    assert.equal(effective.analytics_storage, 'granted');
    assert.equal(effective.ad_storage, 'denied');
    assert.equal(effective.ad_user_data, 'denied');
    assert.equal(effective.ad_personalization, 'denied');
    assert.equal(effective.source, 'gpc');
    assert.equal(effective.recordedAt, stored.recordedAt);
    assert.equal(effective.expiresAt, stored.expiresAt);
  } finally {
    if (localStorageDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', localStorageDescriptor);
    } else {
      delete (globalThis as { localStorage?: unknown }).localStorage;
    }
    if (gpcDescriptor) {
      Object.defineProperty(globalThis.navigator, 'globalPrivacyControl', gpcDescriptor);
    } else {
      delete (globalThis.navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl;
    }
  }
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
    identifierExists: true,
    mpn: 'GLY-DAILY-CLEANSER',
    merchantStatus: 'eligible',
    merchantDestinations: ['free-listings'],
    shippable: true,
    weightLb: 0.5,
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
  assert.equal(transformed.identifierExists, true);
  assert.equal(transformed.shippingWeight, '0.5 lb');
  assert.deepEqual(transformed.excludedDestinations, ['Shopping_ads']);
});

test('Merchant transformer refuses eligible products without verified retail-item weight', () => {
  const product: Product = {
    _id: 'product-2',
    title: 'Daily Moisturizer',
    slug: 'daily-moisturizer',
    brand: 'glymed',
    sku: 'HOR-GLY-0002',
    price: 5800,
    identifierExists: true,
    mpn: 'GLY-DAILY-MOISTURIZER',
    merchantStatus: 'eligible',
    merchantDestinations: ['free-listings', 'shopping-ads'],
    shippable: true,
    image: {
      asset: {
        url: 'https://cdn.sanity.io/images/example/moisturizer.jpg',
        metadata: { dimensions: { width: 1200, height: 1200 } },
      },
    },
  };
  assert.throws(
    () => toGoogleProduct(product, 'https://houseofrosefl.com/'),
    /verified retail-item shipping weight/,
  );
});

test('Merchant transformer requires verified identifiers for branded manufacturer products', () => {
  const product: Product = {
    _id: 'product-3',
    title: 'Daily Serum',
    slug: 'daily-serum',
    brand: 'glymed',
    sku: 'HOR-GLY-0003',
    price: 7200,
    identifierExists: true,
    merchantStatus: 'eligible',
    merchantDestinations: ['free-listings', 'shopping-ads'],
    shippable: true,
    weightLb: 0.4,
    image: {
      asset: {
        url: 'https://cdn.sanity.io/images/example/serum.jpg',
        metadata: { dimensions: { width: 1200, height: 1200 } },
      },
    },
  };
  assert.throws(
    () => toGoogleProduct(product, 'https://houseofrosefl.com/'),
    /verified GTIN or MPN/,
  );
});
