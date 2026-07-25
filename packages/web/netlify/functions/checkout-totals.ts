import { parseItems, resolveCart, fail, json, CartError } from './_lib/cart';
import { getRate, dollarsToCents } from './_lib/shippo';
import { calculateTax, type CheckoutAddress } from './_lib/tax';

interface TotalsRequest {
  items?: unknown;
  shippingRateId?: unknown;
  address?: CheckoutAddress;
}

const stringValue = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = (await request.json()) as TotalsRequest;
    const cart = await resolveCart(parseItems(body.items));
    let shipping = 0;
    if (cart.requiresShipping) {
      const rateId = stringValue(body.shippingRateId);
      if (!rateId) throw new CartError('Choose a shipping method.');
      shipping = dollarsToCents((await getRate(rateId)).amount);
    }
    const tax = await calculateTax(cart, body.address, shipping);
    return json({
      subtotal: cart.subtotal,
      shipping,
      tax: tax.taxAmount,
      total: tax.amountTotal,
    });
  } catch (error) {
    return fail(error);
  }
}
