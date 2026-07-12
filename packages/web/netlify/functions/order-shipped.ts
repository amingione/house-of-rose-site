import { sanity, json } from './_lib/cart';
import { sendOrderShipped, type EmailOrder } from './_lib/email';

/**
 * POST /.netlify/functions/order-shipped   (Sanity webhook → us)
 *
 * Sends the "your order is on its way" email WITH tracking. Triggered when Amber flips
 * an order to `shipped` in the Studio — i.e. when the parcel actually leaves.
 *
 * Deliberately not fired from stripe-webhook: that buys the Shippo label seconds after
 * payment, while the box is still on the counter. Emailing a tracking number that won't
 * scan for a day or two teaches customers to ignore our email. Label printed ≠ shipped.
 *
 * Idempotent: sets `shippedEmailSentAt` and refuses to send twice, because Sanity
 * webhooks retry and nobody wants three "it shipped!" emails.
 *
 * Configure in Sanity (Manage → API → Webhooks):
 *   URL      https://houseofrosefl.com/.netlify/functions/order-shipped
 *   Trigger  on update, filter: _type == "order" && status == "shipped"
 *   Projection: { _id }
 *   Secret   → SANITY_WEBHOOK_SECRET (sent as the `sanity-webhook-secret` header)
 */

interface ShippedOrder extends Partial<EmailOrder> {
  _id: string;
  status?: string;
  shippedEmailSentAt?: string;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Without this, anyone who finds the URL can spam customers with shipping emails.
  const expected = process.env.SANITY_WEBHOOK_SECRET;
  if (!expected || request.headers.get('sanity-webhook-secret') !== expected) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = (await request.json()) as { _id?: string };
    const orderId = body._id;
    if (!orderId) return json({ error: 'Missing _id' }, 400);

    // Re-read the order server-side. Never trust the webhook payload for content.
    const order = await sanity.fetch<ShippedOrder | null>(
      /* groq */ `*[_type == "order" && _id == $id][0]{
        _id, status, orderNumber, email, name, items, subtotal, shippingCost, total,
        shippingMethod, shippingAddress, trackingNumber, trackingUrl, shippedEmailSentAt
      }`,
      { id: orderId },
    );

    if (!order) return json({ error: 'Order not found' }, 404);
    if (order.status !== 'shipped') {
      return json({ skipped: 'Order is not marked shipped.' });
    }
    if (order.shippedEmailSentAt) {
      // Sanity retries webhooks; don't email the customer twice.
      return json({ skipped: 'Shipping email already sent.' });
    }
    if (!order.email) return json({ error: 'Order has no email' }, 422);

    const sent = await sendOrderShipped({
      orderNumber: order.orderNumber ?? 'your order',
      email: order.email,
      name: order.name,
      items: order.items ?? [],
      subtotal: order.subtotal ?? 0,
      shippingCost: order.shippingCost ?? 0,
      total: order.total ?? 0,
      shippingMethod: order.shippingMethod,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
    });

    if (!sent) {
      // Let Sanity retry — the send failed, and we haven't marked it sent.
      return json({ error: 'Email send failed' }, 502);
    }

    await sanity
      .patch(orderId)
      .set({ shippedEmailSentAt: new Date().toISOString() })
      .commit();

    return json({ sent: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('[order-shipped]', error);
    return json({ error: 'Something went wrong.' }, 500);
  }
}
