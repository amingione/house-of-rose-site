import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export default async (request: Request): Promise<Response> => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const rawBody = await request.text();
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? '';
  if (!secret || !isValidSignature(rawBody, signature, secret)) {
    return json({ error: 'Invalid webhook signature.' }, 401);
  }

  const buildHookUrl = process.env.NETLIFY_COMMERCE_BUILD_HOOK_URL;
  if (!buildHookUrl?.startsWith('https://api.netlify.com/build_hooks/')) {
    return json({ error: 'Commerce build hook is not configured.' }, 503);
  }

  let payload: { _id?: unknown; merchantStatus?: unknown };
  try {
    payload = JSON.parse(rawBody) as { _id?: unknown; merchantStatus?: unknown };
  } catch {
    return json({ error: 'Invalid webhook body.' }, 400);
  }
  if (
    typeof payload._id !== 'string' ||
    payload.merchantStatus !== 'eligible'
  ) {
    return json({ ignored: true }, 202);
  }

  const response = await fetch(buildHookUrl, { method: 'POST' });
  if (!response.ok) return json({ error: 'Netlify rejected the build request.' }, 502);
  return json({
    accepted: true,
    productId: payload._id,
    webhookDelivery: request.headers.get('idempotency-key'),
  });
};
