import Stripe from 'stripe';
import { sanity } from './_lib/cart';
import { sendOrderConfirmation, type EmailOrder } from './_lib/email';

/** Shape of the `order` doc we read back after patching it paid. */
type SanityOrder = Partial<EmailOrder> & { _id: string };

/**
 * POST /.netlify/functions/stripe-webhook   (Stripe → us)
 *
 * Fires after the customer pays. Two jobs, in this order:
 *   1. Mark the Sanity order `paid`.
 *   2. Email the customer their confirmation.
 *
 * It does NOT buy a shipping label. Spending real postage the moment a card clears means
 * paying before anyone has looked at the order — see the comment at step 3. Amber ticks
 * `buyLabel` in the Studio when she's ready, which fires buy-label.ts.
 *
 * The email is best-effort: it logs and moves on rather than throwing, because a failed
 * receipt must never fail a captured payment.
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
    const order = await sanity
      .patch(orderId)
      .set({ status: 'paid' })
      .commit<SanityOrder>();

    // 2. Receipt. Best-effort — a failed email must never fail a captured payment.
    await sendOrderConfirmation({
      orderNumber: order.orderNumber ?? 'your order',
      email: order.email ?? '',
      name: order.name,
      items: order.items ?? [],
      subtotal: order.subtotal ?? 0,
      shippingCost: order.shippingCost ?? 0,
      total: order.total ?? 0,
      shippingMethod: order.shippingMethod,
      shippingAddress: order.shippingAddress,
    });

    // 3. NO LABEL IS BOUGHT HERE — on purpose.
    //
    // Buying postage the instant a card clears means spending real money before anyone
    // has looked at the order. A fraudulent card that later charges back leaves us out
    // the goods AND the postage; `inStock` in Sanity is hand-maintained and can be stale;
    // Stripe validates an address's FORMAT, not its deliverability; and an under-entered
    // weightLb produces a label USPS bills us for later, silently. All of that is cheaper
    // to catch before we've paid the carrier.
    //
    // So the order sits at `paid` with its Shippo rate id stored, and Amber ticks
    // `buyLabel` in the Studio when she's ready — see buy-label.ts.
    return new Response('ok', { status: 200 });
  } catch (error) {
    // Sanity itself is down — let Stripe retry, the write is idempotent.
    console.error('[stripe-webhook] order update failed', error);
    return new Response('Order update failed', { status: 500 });
  }
}
