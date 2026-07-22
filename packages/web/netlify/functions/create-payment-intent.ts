import Stripe from 'stripe';
import { parseItems, resolveCart, sanity, fail, json, CartError } from './_lib/cart';
import { getRate, dollarsToCents } from './_lib/shippo';

/**
 * POST /.netlify/functions/create-payment-intent
 *
 * The money step. Everything that determines the amount is recomputed here:
 *   - line prices  → re-read from Sanity by product _id
 *   - shipping     → re-read from Shippo by rate id
 * The browser contributes only ids and quantities, so the total is not forgeable.
 *
 * Writes a `pending` order to Sanity FIRST, then creates the PaymentIntent carrying
 * only that order's _id in metadata (Stripe metadata caps at ~500 chars/value — far
 * too small for a real line-item cart). The webhook picks the order back up by id.
 *
 * Body:  { items, shippingRateId?, address, email, name, phone? }
 * Reply: { clientSecret, orderId, orderNumber, amount, subtotal, shipping }
 */

// No pinned apiVersion — use the account default so an SDK bump can't fight a
// hardcoded version string.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

interface IntentRequest {
  items?: unknown;
  shippingRateId?: unknown;
  email?: unknown;
  name?: unknown;
  phone?: unknown;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

/** HOR-1042 — sequential-ish and human-quotable, without a counter to race on. */
async function nextOrderNumber(): Promise<string> {
  const count = await sanity.fetch<number>(`count(*[_type == "order"])`);
  return `HOR-${1000 + (count ?? 0) + 1}`;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = (await request.json()) as IntentRequest;

    const email = str(body.email);
    if (!email) throw new CartError('An email address is required for your receipt.');

    const cart = await resolveCart(parseItems(body.items));

    // ── Shipping: authoritative amount comes from Shippo, not the client ──
    let shippingCost = 0;
    let shippingMethod: string | undefined;
    const shippingRateId = str(body.shippingRateId);

    if (cart.requiresShipping) {
      if (!shippingRateId) throw new CartError('Please choose a shipping method.');
      const rate = await getRate(shippingRateId);
      shippingCost = dollarsToCents(rate.amount);
      shippingMethod = `${rate.provider} ${rate.servicelevel.name}`;
    }

    const total = cart.subtotal + shippingCost;
    if (total <= 0) throw new CartError('That cart totals nothing.');

    // ── Persist the order BEFORE charging, so the webhook has something to find ──
    const orderNumber = await nextOrderNumber();
    const order = await sanity.create({
      _type: 'order',
      orderNumber,
      status: 'pending',
      placedAt: new Date().toISOString(),
      email,
      name: str(body.name),
      phone: str(body.phone),
      items: cart.items.map((i) => ({
        _key: i.productId,
        _type: 'orderItem',
        product: { _type: 'reference', _ref: i.productId },
        title: i.title,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal: cart.subtotal,
      shippingCost,
      tax: 0,
      total,
      shippingAddress: {
        name: str(body.name),
        line1: body.address?.line1,
        line2: body.address?.line2,
        city: body.address?.city,
        state: body.address?.state,
        postalCode: body.address?.postal_code,
        country: body.address?.country ?? 'US',
      },
      shippingMethod,
      shippoRateId: shippingRateId,
    });

    const intent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      receipt_email: email,
      description: `House of Rose ${orderNumber}`,
      automatic_payment_methods: { enabled: true },
      // Only ids — the durable record lives in Sanity.
      metadata: {
        sanityOrderId: order._id,
        orderNumber,
        shippoRateId: shippingRateId ?? '',
      },
      shipping: cart.requiresShipping
        ? {
            name: str(body.name) ?? 'Customer',
            phone: str(body.phone),
            address: {
              line1: body.address?.line1 ?? '',
              line2: body.address?.line2,
              city: body.address?.city,
              state: body.address?.state,
              postal_code: body.address?.postal_code,
              country: body.address?.country ?? 'US',
            },
          }
        : undefined,
    });

    await sanity.patch(order._id).set({ stripePaymentIntentId: intent.id }).commit();

    return json({
      clientSecret: intent.client_secret,
      orderId: order._id,
      orderNumber,
      amount: total,
      subtotal: cart.subtotal,
      shipping: shippingCost,
    });
  } catch (error) {
    return fail(error);
  }
}
