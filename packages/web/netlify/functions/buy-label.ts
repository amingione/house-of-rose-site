import { sanity, json } from './_lib/cart';
import { buyLabel, getRate, getRates, dollarsToCents, type ShippoAddress } from './_lib/shippo';

/**
 * POST /.netlify/functions/buy-label   (Sanity webhook → us)
 *
 * Buys the shipping label — ON DEMAND. Fires when Amber ticks `buyLabel` on a paid order
 * in the Studio. Nothing buys postage automatically.
 *
 * WHY NOT AUTOMATICALLY ON PAYMENT: buying a label spends real money the instant a card
 * clears, before a human has looked at anything. A fraudulent card that later charges
 * back costs us the goods AND the postage. `inStock` is hand-maintained and goes stale.
 * Stripe validates an address's FORMAT, not its deliverability. An under-entered
 * `weightLb` yields a label USPS quietly bills us an adjustment for. Every one of those
 * is cheaper to catch before we've paid the carrier — and deferring costs us nothing.
 *
 * THE COST OF DEFERRING — rate expiry: Shippo rate objects go stale (roughly a week), so
 * the rate the customer paid against may no longer be purchasable. We re-quote the same
 * carrier + service and buy that instead. Any difference between what they paid and what
 * the postage actually cost is recorded in `labelCost` for us to see; we absorb it rather
 * than re-charging a customer for our own delay.
 *
 * Idempotent: refuses to buy if `shippoTransactionId` already exists. Sanity retries
 * webhooks, and buying two labels means paying twice.
 *
 * Sanity webhook (Manage → API → Webhooks):
 *   URL      https://houseofrosefl.com/.netlify/functions/buy-label
 *   Trigger  on update, filter: _type == "order" && buyLabel == true && !defined(shippoTransactionId)
 *   Projection: { _id }
 *   Secret   → SANITY_WEBHOOK_SECRET
 */

interface OrderRow {
  _id: string;
  status?: string;
  buyLabel?: boolean;
  shippoRateId?: string;
  shippoTransactionId?: string;
  shippingCost?: number;
  shippingMethod?: string;
  name?: string;
  email?: string;
  phone?: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  items?: Array<{ product?: { _ref?: string }; quantity?: number }>;
}

const DEFAULT_WEIGHT_LB = 0.25;
const PACKAGING_WEIGHT_LB = 0.2;

/** Recompute the parcel weight from Sanity, in case we must re-quote. */
async function weightFor(order: OrderRow): Promise<number> {
  const ids = (order.items ?? []).map((i) => i.product?._ref).filter((id): id is string => Boolean(id));
  if (ids.length === 0) return 1;

  const rows = await sanity.fetch<Array<{ _id: string; weightLb: number | null; shippable: boolean | null }>>(
    /* groq */ `*[_type == "product" && _id in $ids]{ _id, weightLb, shippable }`,
    { ids },
  );
  const byId = new Map(rows.map((r) => [r._id, r]));

  const contents = (order.items ?? []).reduce((sum, item) => {
    const p = item.product?._ref ? byId.get(item.product._ref) : undefined;
    if (!p || p.shippable === false) return sum;
    return sum + (p.weightLb ?? DEFAULT_WEIGHT_LB) * (item.quantity ?? 1);
  }, 0);

  return contents + PACKAGING_WEIGHT_LB;
}

function toShippoAddress(order: OrderRow): ShippoAddress {
  const a = order.shippingAddress;
  if (!a?.line1 || !a.city || !a.state || !a.postalCode) {
    throw new Error('Order has no usable shipping address.');
  }
  return {
    name: a.name ?? order.name ?? 'Customer',
    street1: a.line1,
    street2: a.line2,
    city: a.city,
    state: a.state,
    zip: a.postalCode,
    country: 'US',
    phone: order.phone,
    email: order.email,
  };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const expected = process.env.SANITY_WEBHOOK_SECRET;
  if (!expected || request.headers.get('sanity-webhook-secret') !== expected) {
    // Without this, anyone who finds the URL can make us buy postage.
    return json({ error: 'Unauthorized' }, 401);
  }

  let orderId: string | undefined;

  try {
    const body = (await request.json()) as { _id?: string };
    orderId = body._id;
    if (!orderId) return json({ error: 'Missing _id' }, 400);

    const order = await sanity.fetch<OrderRow | null>(
      /* groq */ `*[_type == "order" && _id == $id][0]{
        _id, status, buyLabel, shippoRateId, shippoTransactionId, shippingCost, shippingMethod,
        name, email, phone, shippingAddress, items[]{ product, quantity }
      }`,
      { id: orderId },
    );

    if (!order) return json({ error: 'Order not found' }, 404);
    if (!order.buyLabel) return json({ skipped: 'buyLabel is not set.' });

    // Idempotency: Sanity retries webhooks, and a second label means paying twice.
    if (order.shippoTransactionId) {
      return json({ skipped: 'Label already purchased.' });
    }

    // Never buy postage for an order that isn't actually paid for.
    if (order.status !== 'paid' && order.status !== 'readyToShip') {
      return json({ error: `Refusing to buy a label for an order with status "${order.status}".` }, 409);
    }

    // ── Get a purchasable rate ──
    // Try the one the customer paid against; if Shippo has expired it, re-quote the same
    // service. We eat any price difference rather than re-charging for our own delay.
    let rateId = order.shippoRateId;
    let requoted = false;

    if (rateId) {
      try {
        await getRate(rateId); // still alive?
      } catch {
        rateId = undefined;
      }
    }

    if (!rateId) {
      const rates = await getRates(toShippoAddress(order), await weightFor(order));
      // Prefer the same carrier + service the customer chose; fall back to cheapest.
      const same = order.shippingMethod
        ? rates.find((r) => `${r.provider} ${r.servicelevel.name}` === order.shippingMethod)
        : undefined;
      const chosen = same ?? rates[0];
      if (!chosen) throw new Error('Shippo returned no rates for this address.');
      rateId = chosen.object_id;
      requoted = true;
    }

    // ── Buy it. This spends money. ──
    const label = await buyLabel(rateId);
    if (label.status !== 'SUCCESS') {
      throw new Error(label.messages?.map((m) => m.text).join('; ') ?? `Shippo status ${label.status}`);
    }

    const rate = await getRate(rateId).catch(() => null);
    const labelCost = rate ? dollarsToCents(rate.amount) : undefined;

    await sanity
      .patch(orderId)
      .set({
        status: 'readyToShip',
        shippoTransactionId: label.object_id,
        shippoRateId: rateId,
        labelUrl: label.label_url ?? undefined,
        trackingNumber: label.tracking_number ?? undefined,
        trackingUrl: label.tracking_url_provider ?? undefined,
        ...(labelCost !== undefined ? { labelCost } : {}),
        ...(requoted
          ? {
              fulfillmentError:
                `The original rate had expired, so the label was re-quoted.` +
                (labelCost !== undefined && order.shippingCost !== undefined
                  ? ` Client paid $${(order.shippingCost / 100).toFixed(2)}, postage cost $${(labelCost / 100).toFixed(2)}.`
                  : ''),
            }
          : { fulfillmentError: undefined }),
      })
      .commit();

    return json({ bought: true, requoted, labelUrl: label.label_url, tracking: label.tracking_number });
  } catch (error) {
    console.error('[buy-label]', error);

    // Surface the failure in the Studio and untick the box, so Amber can fix the address
    // (or the weight) and try again rather than wondering why no label appeared.
    if (orderId) {
      await sanity
        .patch(orderId)
        .set({
          buyLabel: false,
          fulfillmentError: `Label purchase failed: ${
            error instanceof Error ? error.message : String(error)
          }. Nothing was charged for postage. Fix the issue and tick "Purchase shipping label" again.`,
        })
        .commit()
        .catch(() => undefined);
    }

    return json({ error: 'Label purchase failed.' }, 500);
  }
}
