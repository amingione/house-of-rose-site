/**
 * Shop CTA copy — deliberately varied, deliberately not Sanity-schema-required.
 *
 * Editors can always override with a custom `ctaLabel` on a product or shop
 * brand. When they don't, we pick a category/brand-appropriate phrase from a
 * pool instead of repeating one generic string sitewide. Selection is a
 * deterministic hash of the item's own id/key, so the same product always
 * gets the same phrase across a build (stable, not flickering randomness)
 * while different products land on different phrases.
 *
 * Hard rule: never reference the checkout platform by name here. Clients
 * don't care what runs checkout — the button just needs to feel like House
 * of Rose, not a plugin.
 */

import type { Product, ProductCategory, ShopBrand } from './queries';

/** Simple, stable string hash — good enough to spread picks across a pool. */
function stableIndex(seed: string, poolLength: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % poolLength;
}

function pick(seed: string, pool: string[]): string {
  return pool[stableIndex(seed, pool.length)];
}

const CATEGORY_CTA_POOLS: Record<ProductCategory | 'default', string[]> = {
  skincare: ['Shop the Routine', 'Add to Cart', 'Get Yours', 'Take It Home', 'Shop This'],
  candles: ['Light It Up', 'Bring It Home', 'Shop the Scent', 'Add to Cart'],
  'gift-cards': ['Give the Gift', 'Send a Gift Card', 'Gift It', 'Treat Someone'],
  accessories: ['Shop This', 'Add to Cart', 'Get Yours'],
  other: ['Shop This', 'Add to Cart', 'Get Yours'],
  default: ['Shop This', 'Add to Cart', 'Get Yours'],
};

const LEARN_MORE_POOL = ['Learn More', 'See Details', 'Read More', 'Discover More', 'Take a Closer Look'];

const BRAND_CTA_POOL = ['Shop {brand}', 'Explore the Line', 'See the Collection', 'Browse {brand}', 'Discover {brand}'];

/**
 * Purchase CTA for a product we DON'T sell ourselves — i.e. the button is a link
 * that navigates out to `purchaseUrl`. A varied, evocative phrase is right here,
 * because the button really does take you somewhere to shop.
 */
export function getProductPurchaseCta(product: Pick<Product, '_id' | 'ctaLabel' | 'category'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  const pool = CATEGORY_CTA_POOLS[product.category ?? 'default'] ?? CATEGORY_CTA_POOLS.default;
  return pick(product._id, pool);
}

/**
 * CTA for the native ADD-TO-CART button.
 *
 * Deliberately NOT the varied pool above. That pool exists for links that navigate
 * ("Shop the Routine", "Take It Home") — language which, on a button that silently
 * drops one item into a cart, promises a destination it never delivers. Clicking
 * "Shop the Routine" and getting a cart drawer reads as "nothing happened".
 *
 * A button must say what it does. Editors can still override per product with
 * `ctaLabel` if they want their own voice — but the default states the action.
 */
export function getAddToCartCta(product: Pick<Product, 'ctaLabel'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  return 'Add to Cart';
}

/**
 * "Tell me more" CTA for a product card — used when there's no purchaseUrl
 * yet and the card should link to the internal product detail page instead.
 */
export function getProductLearnMoreCta(product: Pick<Product, '_id' | 'ctaLabel'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  return pick(product._id, LEARN_MORE_POOL);
}

/** Shop-this-brand CTA — used on brand spotlight blocks. */
export function getBrandCta(brand: Pick<ShopBrand, '_id' | 'ctaLabel' | 'title'>): string {
  if (brand.ctaLabel?.trim()) return brand.ctaLabel.trim();
  return pick(brand._id, BRAND_CTA_POOL).replace('{brand}', brand.title);
}
