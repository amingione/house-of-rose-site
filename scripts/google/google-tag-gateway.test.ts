import assert from 'node:assert/strict';
import test from 'node:test';
import {
  config,
  forwardGoogleTagGatewayRequest,
  GOOGLE_TAG_GATEWAY_ORIGIN,
  GOOGLE_TAG_MANAGER_CONTAINER_ID,
} from '../../packages/web/netlify/edge-functions/google-tag-gateway';

test('gateway forwards the original path, query, cookies, method, and body to the fixed origin', async () => {
  let forwardedRequest: Request | undefined;
  let forwardedBody = '';
  const request = new Request('https://houseofrosefl.com/metrics/g/collect?v=2&tid=G-QBDHB89WTR', {
    method: 'POST',
    headers: {
      cookie: 'measurement_session=abc123',
      'content-type': 'text/plain',
    },
    body: 'event=generate_lead',
  });

  const response = await forwardGoogleTagGatewayRequest(
    request,
    {
      geo: {
        country: { code: 'us', name: 'United States' },
        subdivision: { code: 'US-FL', name: 'Florida' },
      },
    },
    {
      containerId: GOOGLE_TAG_MANAGER_CONTAINER_ID,
      fetcher: async (incoming) => {
        forwardedRequest = incoming;
        forwardedBody = await incoming.text();
        return new Response('accepted', {
          status: 202,
          headers: { 'x-google-response': 'forwarded' },
        });
      },
    },
  );

  assert.ok(forwardedRequest);
  assert.equal(
    forwardedRequest.url,
    `${GOOGLE_TAG_GATEWAY_ORIGIN}/metrics/g/collect?v=2&tid=G-QBDHB89WTR`,
  );
  assert.equal(forwardedRequest.method, 'POST');
  assert.equal(forwardedRequest.headers.get('cookie'), 'measurement_session=abc123');
  assert.equal(forwardedRequest.headers.get('x-gtg-tag-id'), null);
  assert.equal(forwardedRequest.headers.get('x-forwarded-country'), 'US');
  assert.equal(forwardedRequest.headers.get('x-forwarded-region'), 'FL');
  assert.equal(forwardedBody, 'event=generate_lead');
  assert.equal(response.status, 202);
  assert.equal(response.headers.get('x-google-response'), 'forwarded');
  assert.equal(await response.text(), 'accepted');
});

test('gateway returns 503 without contacting Google when the configured container does not match', async () => {
  let fetchCalled = false;
  const response = await forwardGoogleTagGatewayRequest(
    new Request('https://houseofrosefl.com/metrics/healthy'),
    { geo: { country: undefined, subdivision: undefined } },
    {
      containerId: 'GTM-WRONG',
      fetcher: async () => {
        fetchCalled = true;
        return new Response('unexpected');
      },
    },
  );

  assert.equal(fetchCalled, false);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('gateway returns a safe 502 response when the fixed upstream is unavailable', async () => {
  const response = await forwardGoogleTagGatewayRequest(
    new Request('https://houseofrosefl.com/metrics/healthy'),
    {
      geo: {
        country: { code: 'US', name: 'United States' },
        subdivision: { code: 'FL', name: 'Florida' },
      },
    },
    {
      containerId: GOOGLE_TAG_MANAGER_CONTAINER_ID,
      fetcher: async () => {
        throw new Error('upstream detail must not leak');
      },
    },
  );

  assert.equal(response.status, 502);
  assert.equal(await response.text(), 'Google tag gateway is unavailable.');
});

test('edge function claims both the root measurement path and all descendants', () => {
  assert.deepEqual(config.path, ['/metrics', '/metrics/*']);
});
