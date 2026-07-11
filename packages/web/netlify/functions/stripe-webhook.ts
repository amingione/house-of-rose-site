import Stripe from 'stripe';
import { sanity } from './_lib/cart';
import { buyLabel } from './_lib/shippo';

/**
 * POST /.netlify/functions/stripe-webhook   (Stripe → us)
 *
 * Fires after the customer pays. Two jobs, in this order:
 *   1. Mark the Sanity order `paid`.
 *   2. Buy the Shippo label for the rate they chose.
 *
 * Ordering matters. If step 2 throws, the money is ALREADY captured — we must never
 * lose the order. So the order is marked paid first, and a label failure is recorded
 * on `fulfillmentError` for Amber to handle by hand. A 500 here would make Stripe
 * retry and risk buying a second label, so we swallow fulfilment errors and return
 * 200 once the order is safely marked paid.
 *
 * Signature verification is mandatory — without it anyone who finds this URL can mark
 * orders paid and make us buy labels.
 */

// No pinned apiVersion — use the account default so an SDK bump can't fight a
// hardcoded version string.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // Must use the RAW body — a parsed/re-serialised body will not verify.
    const raw = await request.text();
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret);
  } catch (error) {
    console.error('[stripe-webhook] signature verification failed', error);
    return new Response('Invalid signature', { status: 400 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = intent.metadata?.sanityOrderId;

  if (!orderId) {
    // Not one of ours (or a legacy intent) — ack so Stripe stops retrying.
    return new Response('ok', { status: 200 });
  }

  try {
    if (event.type === 'payment_intent.payment_failed') {
      await sanity.patch(orderId).set({ status: 'failed' }).commit();
      return new Response('ok', { status: 200 });
    }

    if (event.type !== 'payment_intent.succeeded') {
      return new Response('ok', { status: 200 });
    }

    // 1. Money is in. Record that first, unconditionally.
    await sanity.patch(orderId).set({ status: 'paid' }).commit();

    // 2. Fulfilment. Best-effort — never let this un-record a paid order.
    const rateId = intent.metadata?.shippoRateId;
    if (!rateId) {
      return new Response('ok', { status: 200 }); // in-studio pickup, nothing to ship
    }

    try {
      const label = await buyLabel(rateId);

      if (label.status !== 'SUCCESS') {
        throw new Error(
          label.messages?.map((m) => m.text).join('; ') ?? `Shippo status ${label.status}`,
        );
      }

      await sanity
        .patch(orderId)
        .set({
          status: 'shipped',
          shippoTransactionId: label.object_id,
          labelUrl: label.label_url ?? undefined,
          trackingNumber: label.tracking_number ?? undefined,
          trackingUrl: label.tracking_url_provider ?? undefined,
        })
        .commit();
    } catch (labelError) {
      // Paid but unlabelled. Surface it loudly in the Studio rather than 500-ing,
      // which would make Stripe retry and potentially buy a duplicate label.
      console.error('[stripe-webhook] label purchase failed', labelError);
      await sanity
        .patch(orderId)
        .set({
          fulfillmentError: `Payment captured but label purchase failed: ${
            labelError instanceof Error ? labelError.message : String(labelError)
          }. Buy this label manually in Shippo.`,
        })
        .commit();
    }

    return new Response('ok', { status: 200 });
  } catch (error) {
    // Sanity itself is down — let Stripe retry, the write is idempotent.
    console.error('[stripe-webhook] order update failed', error);
    return new Response('Order update failed', { status: 500 });
  }
}
