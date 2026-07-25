import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { parseItems, resolveCart, sanity, fail, json, CartError } from './_lib/cart';
import { getRate, dollarsToCents } from './_lib/shippo';
import { calculateTax, type CheckoutAddress } from './_lib/tax';

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
  address?: CheckoutAddress;
  attribution?: unknown;
  consentSnapshot?: unknown;
}

const str = (value: unknown, maxLength = 300): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const sanitized = [...value.trim()]
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 32 && codePoint !== 127;
    })
    .join('')
    .slice(0, maxLength);
  return sanitized || undefined;
};

const cleanAttribution = (value: unknown): Record<string, string> | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const source = value as Record<string, unknown>;
  const allowed = ['gclid', 'gbraid', 'wbraid', 'utmSource', 'utmMedium', 'utmCampaign', 'landingPage'] as const;
  const result = Object.fromEntries(
    allowed.flatMap((key) => {
      const cleaned = str(source[key], 300);
      return cleaned ? [[key, cleaned]] : [];
    }),
  );
  return Object.keys(result).length ? result : undefined;
};

const cleanConsent = (value: unknown): Record<string, string | number> | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const source = value as Record<string, unknown>;
  const signal = (key: string): 'granted' | 'denied' =>
    source[key] === 'granted' ? 'granted' : 'denied';
  return {
    schemaVersion: 1,
    policyVersion: str(source.policyVersion, 40) ?? 'unknown',
    analytics_storage: signal('analytics_storage'),
    ad_storage: signal('ad_storage'),
    ad_user_data: signal('ad_user_data'),
    ad_personalization: signal('ad_personalization'),
    recordedAt: str(source.recordedAt, 60) ?? new Date().toISOString(),
  };
};

/** Unique, immutable, and still easy to quote to support. */
const nextOrderNumber = (): string =>
  `HOR-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

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

    const taxResult = await calculateTax(cart, body.address, shippingCost);
    const total = taxResult.amountTotal;
    if (total <= 0) throw new CartError('That cart totals nothing.');

    // ── Persist the order BEFORE charging, so the webhook has something to find ──
    const orderNumber = nextOrderNumber();
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
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      subtotal: cart.subtotal,
      shippingCost,
      tax: taxResult.taxAmount,
      total,
      stripeTaxCalculationId: taxResult.calculationId,
      attribution: cleanAttribution(body.attribution),
      measurementConsent: cleanConsent(body.consentSnapshot),
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
        taxCalculationId: taxResult.calculationId,
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
      tax: taxResult.taxAmount,
    });
  } catch (error) {
    return fail(error);
  }
}
