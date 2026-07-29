import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildOpenAIAdsApiEvent,
  hashOpenAIAdsEmail,
  sanitizeOpenAIAdsSourceUrl,
  type OpenAIAdsNetlifyContext,
} from '../../packages/web/netlify/functions/_lib/server/openai-ads';

test('source URLs keep only a trusted HTTP(S) origin and pathname', () => {
  assert.equal(
    sanitizeOpenAIAdsSourceUrl(
      'https://houseofrosefl.com/order-confirmed/?payment_intent=secret#receipt',
      'https://houseofrosefl.com/.netlify/functions/verify-purchase',
      '/order-confirmed/',
      new URL('https://houseofrosefl.com/'),
    ),
    'https://houseofrosefl.com/order-confirmed/',
  );
});

test('untrusted and non-HTTP source URLs fall back to the configured canonical site', () => {
  for (const sourceUrl of ['https://attacker.example/checkout/', 'javascript:alert(1)']) {
    assert.equal(
      sanitizeOpenAIAdsSourceUrl(
        sourceUrl,
        'https://houseofrosefl.com/.netlify/functions/verify-purchase',
        '/order-confirmed/',
        new URL('https://houseofrosefl.com/'),
      ),
      'https://houseofrosefl.com/order-confirmed/',
    );
  }
});

test('CAPI events use documented fields, opaque attribution cookies, and hashed email', () => {
  const cookies = new Map([
    ['__oppref', 'opaque-oppref-value'],
    ['__obref', 'opaque-obref-value'],
  ]);
  const context: OpenAIAdsNetlifyContext = {
    cookies: { get: (name) => cookies.get(name) },
    geo: {
      city: 'Punta Gorda',
      country: { code: 'us' },
      postalCode: '33950',
    },
    ip: '203.0.113.8',
    waitUntil: () => {},
  };
  const event = buildOpenAIAdsApiEvent(
    {
      id: 'HOR-TEST-1',
      type: 'order_created',
      request: new Request('https://houseofrosefl.com/.netlify/functions/verify-purchase', {
        headers: { 'User-Agent': 'House-of-Rose-test' },
      }),
      sourceUrl: 'https://houseofrosefl.com/order-confirmed/?ignored=1',
      fallbackPath: '/order-confirmed/',
      email: ' CLIENT@Example.com ',
      consent: {
        adStorage: 'granted',
        adUserData: 'granted',
        adPersonalization: 'denied',
      },
      data: {
        type: 'contents',
        amount: 2599,
        currency: 'USD',
        contents: [{
          id: 'sku-1',
          name: 'Test product',
          content_type: 'product',
          quantity: 1,
          amount: 2599,
          currency: 'USD',
        }],
      },
    },
    context,
    1_773_892_800_000,
  );

  assert.equal(event.id, 'HOR-TEST-1');
  assert.equal(event.type, 'order_created');
  assert.equal(event.timestamp_ms, 1_773_892_800_000);
  assert.equal(event.source_url, 'https://houseofrosefl.com/order-confirmed/');
  assert.equal(event.action_source, 'web');
  assert.equal(event.oppref, 'opaque-oppref-value');
  assert.equal(event.user?.obref, 'opaque-obref-value');
  assert.equal(event.user?.email_sha256, hashOpenAIAdsEmail('client@example.com'));
  assert.equal(event.opt_out, true);
  assert.equal(event.data.type, 'contents');
  assert.equal('event_name' in event, false);
  assert.equal('event_time_epoch_ms' in event, false);
  assert.equal('event_source_url' in event, false);
  assert.equal('event_data' in event, false);
});
