import { createClient } from '@sanity/client';
import { toCanonicalProduct } from '../../../src/lib/productContract';

/**
 * Server-side cart resolution.
 *
 * THE RULE: the browser sends `{ productId, quantity }` and nothing else. Prices,
 * weights, and shippability are always re-read from Sanity here. A client can never
 * assert an amount, so there is no "tampered cart" attack surface and no Stripe
 * Price mirror to drift out of sync with Sanity.
 */

export interface RequestedItem {
  productId: string;
  quantity: number;
}

export interface ResolvedItem {
  productId: string;
  sku: string;
  title: string;
  slug: string;
  quantity: number;
  unitPrice: number; // cents, from Sanity
  lineTotal: number; // cents
  weightLb: number;
  shippable: boolean;
  taxCode?: string;
}

export interface ResolvedCart {
  items: ResolvedItem[];
  subtotal: number; // cents
  totalWeightLb: number;
  requiresShipping: boolean;
}

// Pounds everywhere — matches how Amber has always entered weights, and Shippo is told
// `mass_unit: 'lb'`. Mixing units here is how a shipping quote goes silently wrong.
const DEFAULT_WEIGHT_LB = 0.25; // ~4 oz packed — a typical serum
/** Box + packing material. Under-quoting shipping comes straight out of margin. */
const PACKAGING_WEIGHT_LB = 0.2;
const MAX_QUANTITY_PER_ITEM = 20;

export const sanity = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface SanityProductRow {
  _id: string;
  title: string;
  slug: string;
  price: number | null;
  inStock: boolean | null;
  inventoryQuantity: number | null;
  availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder' | null;
  shippable: boolean | null;
  weightLb: number | null;
  sku: string | null;
  stripeTaxCode: string | null;
}

export class CartError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'CartError';
  }
}

export function parseItems(input: unknown): RequestedItem[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new CartError('Your cart is empty.');
  }
  return input.map((raw) => {
    const item = raw as Partial<RequestedItem>;
    if (typeof item.productId !== 'string' || !item.productId) {
      throw new CartError('Malformed cart item.');
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw new CartError(`Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}.`);
    }
    return { productId: item.productId, quantity };
  });
}

export async function resolveCart(requested: RequestedItem[]): Promise<ResolvedCart> {
  const ids = [...new Set(requested.map((i) => i.productId))];

  const rows = await sanity.fetch<SanityProductRow[]>(
    /* groq */ `*[_type == "product" && _id in $ids]{
      _id, title, "slug": slug.current, price, inStock, inventoryQuantity,
      availability, shippable, weightLb, sku, stripeTaxCode
    }`,
    { ids },
  );

  const byId = new Map(rows.map((r) => [r._id, r]));

  const items: ResolvedItem[] = requested.map((req) => {
    const product = byId.get(req.productId);
    if (!product) {
      throw new CartError('One of the items in your cart is no longer available.');
    }
    if (
      product.inStock === false ||
      product.availability === 'out_of_stock' ||
      (typeof product.inventoryQuantity === 'number' && product.inventoryQuantity < req.quantity)
    ) {
      throw new CartError(`${product.title} is out of stock.`);
    }
    if (typeof product.price !== 'number' || product.price <= 0) {
      // A product with no price isn't buyable online (call-to-order item).
      throw new CartError(`${product.title} isn't available for online purchase.`);
    }

    const canonical = toCanonicalProduct(product);

    return {
      productId: product._id,
      sku: canonical.itemId,
      title: product.title,
      slug: product.slug,
      quantity: req.quantity,
      unitPrice: product.price,
      lineTotal: product.price * req.quantity,
      weightLb: canonical.shippable ? (canonical.shippingWeightLb ?? DEFAULT_WEIGHT_LB) : 0,
      shippable: canonical.shippable,
      taxCode: product.stripeTaxCode ?? undefined,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const requiresShipping = items.some((i) => i.shippable);
  const contentsWeight = items.reduce((w, i) => w + i.weightLb * i.quantity, 0);

  return {
    items,
    subtotal,
    requiresShipping,
    totalWeightLb: requiresShipping ? contentsWeight + PACKAGING_WEIGHT_LB : 0,
  };
}

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const fail = (error: unknown): Response => {
  if (error instanceof CartError) {
    return json({ error: error.message }, error.status);
  }
  // Never leak internals to the browser — log for us, generic message for them.
  console.error('[checkout]', error);
  return json({ error: 'Something went wrong. Please try again.' }, 500);
};
