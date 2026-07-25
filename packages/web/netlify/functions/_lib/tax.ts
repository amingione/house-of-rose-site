import Stripe from 'stripe';
import type { ResolvedCart } from './cart';
import { CartError } from './cart';

export interface CheckoutAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface TaxResult {
  calculationId: string;
  taxAmount: number;
  amountTotal: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function calculateTax(
  cart: ResolvedCart,
  address: CheckoutAddress | undefined,
  shippingCost: number,
): Promise<TaxResult> {
  if (process.env.STRIPE_TAX_ENABLED !== 'true') {
    throw new CartError('Tax calculation is not configured. Please call to complete this order.', 503);
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new CartError('Secure checkout is not configured.', 503);
  }
  if (!address?.country || !address.postal_code) {
    throw new CartError('A complete address is required to calculate tax.');
  }

  const calculation = await stripe.tax.calculations.create({
    currency: 'usd',
    customer_details: {
      address_source: 'shipping',
      address: {
        line1: address.line1 ?? '',
        line2: address.line2,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country.toUpperCase(),
      },
    },
    line_items: cart.items.map((item) => ({
      amount: item.lineTotal,
      quantity: item.quantity,
      reference: item.sku,
      tax_behavior: 'exclusive',
      ...(item.taxCode ? { tax_code: item.taxCode } : {}),
    })),
    ...(shippingCost > 0
      ? {
          shipping_cost: {
            amount: shippingCost,
            tax_behavior: 'exclusive' as const,
            ...(process.env.STRIPE_SHIPPING_TAX_CODE
              ? { tax_code: process.env.STRIPE_SHIPPING_TAX_CODE }
              : {}),
          },
        }
      : {}),
  });

  if (!calculation.id) throw new CartError('Tax could not be calculated. Please try again.', 502);
  return {
    calculationId: calculation.id,
    taxAmount: calculation.tax_amount_exclusive,
    amountTotal: calculation.amount_total,
  };
}
