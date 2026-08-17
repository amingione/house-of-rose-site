/**
 * Shop controls say what they do. Editors may supply a factual override, but
 * defaults do not rotate through marketing phrases or imply a different action.
 */

import type { Product, ShopBrand } from './queries';

/**
 * Purchase CTA for a product we do not sell through the native cart. The link
 * navigates to the product's configured purchase destination.
 */
export function getProductPurchaseCta(product: Pick<Product, '_id' | 'ctaLabel' | 'category'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  return 'Shop this product';
}

/**
 * CTA for the native ADD-TO-CART button.
 *
 * A button must say what it does. Editors can still override per product with
 * `ctaLabel`; otherwise the default states the action.
 */
export function getAddToCartCta(product: Pick<Product, 'ctaLabel'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  return 'Add to Cart';
}

/** Detail-link label for a product that has no external purchase URL. */
export function getProductLearnMoreCta(product: Pick<Product, '_id' | 'ctaLabel'>): string {
  if (product.ctaLabel?.trim()) return product.ctaLabel.trim();
  return 'View product details';
}

/** Shop-this-brand CTA — used on brand spotlight blocks. */
export function getBrandCta(brand: Pick<ShopBrand, '_id' | 'ctaLabel' | 'title'>): string {
  if (brand.ctaLabel?.trim()) return brand.ctaLabel.trim();
  return `Shop ${brand.title}`;
}
