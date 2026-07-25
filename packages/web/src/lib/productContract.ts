export type CanonicalAvailability = 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';

export interface ProductContractSource {
  _id: string;
  title: string;
  sku?: string | null;
  price?: number | null;
  brand?: string | null;
  brandName?: string | null;
  category?: string | null;
  inStock?: boolean | null;
  inventoryQuantity?: number | null;
  availability?: CanonicalAvailability | null;
  shippable?: boolean | null;
  weightLb?: number | null;
}

export interface CanonicalProduct {
  productId: string;
  itemId: string;
  itemName: string;
  brand?: string;
  category?: string;
  unitPriceCents?: number;
  availability: CanonicalAvailability;
  inventoryQuantity?: number;
  shippable: boolean;
  shippingWeightLb?: number;
  purchasable: boolean;
}

/**
 * The identity/price/availability contract shared by pages, JSON-LD, cart/order
 * snapshots, measurement events, and the Merchant transformer.
 */
export const toCanonicalProduct = (source: ProductContractSource): CanonicalProduct => {
  const availability: CanonicalAvailability =
    typeof source.inventoryQuantity === 'number' && source.inventoryQuantity <= 0
      ? 'out_of_stock'
      : source.availability ?? (source.inStock === false ? 'out_of_stock' : 'in_stock');
  const unitPriceCents =
    typeof source.price === 'number' && Number.isFinite(source.price)
      ? source.price
      : undefined;
  return {
    productId: source._id,
    itemId: source.sku?.trim() || source._id,
    itemName: source.title,
    brand: source.brandName?.trim() || source.brand?.trim() || undefined,
    category: source.category ?? undefined,
    unitPriceCents,
    availability,
    inventoryQuantity: source.inventoryQuantity ?? undefined,
    shippable: source.shippable !== false,
    shippingWeightLb: source.weightLb ?? undefined,
    purchasable:
      typeof unitPriceCents === 'number' &&
      unitPriceCents > 0 &&
      availability === 'in_stock' &&
      (typeof source.inventoryQuantity !== 'number' || source.inventoryQuantity > 0),
  };
};
