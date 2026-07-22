import { parseItems, resolveCart, fail, json, CartError } from './_lib/cart';
import { getRates, dollarsToCents, type ShippoAddress } from './_lib/shippo';

/**
 * POST /.netlify/functions/shipping-rates
 *
 * Called from /checkout the moment Stripe's Address Element reports a complete
 * shipping address. Returns LIVE carrier rates for this exact cart to this exact
 * address — no zone table, no guessing.
 *
 * Body:  { items: [{ productId, quantity }], address: {...} }
 * Reply: { rates: [{ id, label, amount, estimatedDays }], requiresShipping, subtotal }
 *
 * Rate `id` is a Shippo rate object_id. The client hands it back to
 * create-payment-intent, which re-fetches it server-side — the browser never gets
 * to name a shipping price either.
 */

interface RatesRequest {
  items?: unknown;
  address?: Partial<ShippoAddress> & { postal_code?: string; line1?: string; line2?: string };
}

function parseAddress(input: RatesRequest['address']): ShippoAddress {
  if (!input) throw new CartError('A shipping address is required.');

  // Accept Stripe's Address Element shape (line1/postal_code) or Shippo's (street1/zip).
  const street1 = input.street1 ?? input.line1;
  const zip = input.zip ?? input.postal_code;
  const { name, city, state, country } = input;

  if (!street1 || !city || !state || !zip) {
    throw new CartError('That shipping address looks incomplete.');
  }
  if ((country ?? 'US') !== 'US') {
    // Face Reality (and most of our lines) aren't authorised for sale outside the US.
    throw new CartError('We currently only ship within the United States.');
  }

  return {
    name: name ?? 'Customer',
    street1,
    street2: input.street2 ?? input.line2,
    city,
    state,
    zip,
    country: 'US',
  };
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = (await request.json()) as RatesRequest;
    const cart = await resolveCart(parseItems(body.items));

    // Everything in the cart is in-studio-only — skip the carrier round-trip.
    if (!cart.requiresShipping) {
      return json({ requiresShipping: false, rates: [], subtotal: cart.subtotal });
    }

    const rates = await getRates(parseAddress(body.address), cart.totalWeightLb);

    return json({
      requiresShipping: true,
      subtotal: cart.subtotal,
      rates: rates.map((r) => ({
        id: r.object_id,
        label: `${r.provider} ${r.servicelevel.name}`,
        amount: dollarsToCents(r.amount),
        estimatedDays: r.estimated_days,
      })),
    });
  } catch (error) {
    return fail(error);
  }
}
