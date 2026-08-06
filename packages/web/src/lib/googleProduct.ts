import type { Product } from './queries';
import { toCanonicalProduct } from './productContract';

export type GoogleAvailability = 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
export type GoogleExcludedDestination = 'Shopping_ads' | 'Free_listings';

export interface GoogleProduct {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImageLinks: string[];
  availability: GoogleAvailability;
  availabilityDate?: string;
  price: string;
  brand: string;
  gtin?: string;
  mpn?: string;
  identifierExists: boolean;
  condition: 'new' | 'refurbished' | 'used';
  productType?: string;
  googleProductCategory?: string;
  itemGroupId?: string;
  color?: string;
  size?: string;
  material?: string;
  shippingWeight: string;
  excludedDestinations: GoogleExcludedDestination[];
  customLabel0?: string;
  customLabel1?: string;
  customLabel2?: string;
  customLabel3?: string;
  customLabel4?: string;
}

const brandFallback: Record<string, string> = {
  procell: 'Procell Therapies',
  glymed: 'GlyMed+',
  'skin-script': 'Skin Script',
  'face-reality': 'Face Reality',
  'house-of-rose': 'House of Rose',
};

const internalDestinations = new Set(['free-listings', 'shopping-ads']);

const excludedDestinations = (destinations: string[]): GoogleExcludedDestination[] => {
  const unknown = destinations.filter((destination) => !internalDestinations.has(destination));
  if (unknown.length > 0) throw new Error(`Unknown Merchant destination: ${unknown.join(', ')}.`);
  const excluded: GoogleExcludedDestination[] = [];
  if (!destinations.includes('shopping-ads')) excluded.push('Shopping_ads');
  if (!destinations.includes('free-listings')) excluded.push('Free_listings');
  return excluded;
};

export const effectiveAvailability = (product: Product): GoogleAvailability => {
  return toCanonicalProduct(product).availability;
};

export function toGoogleProduct(product: Product, siteUrl: string): GoogleProduct {
  const canonical = toCanonicalProduct(product);
  if (!product.sku) throw new Error(`${product.title} is missing sku.`);
  if (!product.slug) throw new Error(`${product.sku} is missing slug.`);
  if (typeof product.price !== 'number' || product.price <= 0) {
    throw new Error(`${product.sku} is missing a valid price.`);
  }
  if (!product.image?.asset.url) throw new Error(`${product.sku} is missing a primary image.`);
  const brand = product.brandName ?? (product.brand ? brandFallback[product.brand] : undefined);
  if (!brand) throw new Error(`${product.sku} is missing a canonical brand.`);
  if (product.shippable !== true) {
    throw new Error(`${product.sku} must be explicitly marked shippable before Merchant submission.`);
  }
  if (
    typeof canonical.shippingWeightLb !== 'number' ||
    !Number.isFinite(canonical.shippingWeightLb) ||
    canonical.shippingWeightLb <= 0
  ) {
    throw new Error(`${product.sku} is missing a verified retail-item shipping weight.`);
  }
  if (typeof product.identifierExists !== 'boolean') {
    throw new Error(`${product.sku} is missing an explicit manufacturer identifier decision.`);
  }
  if (product.identifierExists && !product.gtin && !product.mpn) {
    throw new Error(`${product.sku} needs a verified GTIN or MPN.`);
  }
  if (!product.identifierExists && (product.gtin || product.mpn)) {
    throw new Error(`${product.sku} cannot declare identifier_exists=no while GTIN/MPN is present.`);
  }
  if (
    (canonical.availability === 'preorder' || canonical.availability === 'backorder') &&
    !product.availabilityDate
  ) {
    throw new Error(`${product.sku} needs availabilityDate for ${canonical.availability}.`);
  }
  const merchantDestinations = product.merchantDestinations ?? [];
  if (merchantDestinations.length === 0) {
    throw new Error(`${product.sku} needs at least one Merchant destination.`);
  }

  return {
    id: canonical.itemId,
    title: product.title.slice(0, 150),
    description: (product.description ?? product.tagline ?? product.title).slice(0, 5000),
    link: new URL(`/shop/${product.slug}/`, siteUrl).toString(),
    imageLink: product.image.asset.url,
    additionalImageLinks: (product.additionalImages ?? []).map((image) => image.asset.url),
    availability: canonical.availability,
    availabilityDate: product.availabilityDate,
    price: `${(product.price / 100).toFixed(2)} USD`,
    brand,
    gtin: product.gtin,
    mpn: product.mpn,
    identifierExists: product.identifierExists,
    condition: product.condition ?? 'new',
    productType: product.productTypePath,
    googleProductCategory: product.googleProductCategoryId,
    itemGroupId: product.variantGroupId,
    color: product.variantAttributes?.color,
    size: product.variantAttributes?.size,
    material: product.variantAttributes?.material,
    shippingWeight: `${canonical.shippingWeightLb} lb`,
    excludedDestinations: excludedDestinations(merchantDestinations),
    customLabel0: product.campaignTier,
    customLabel1: product.brand,
    customLabel2: product.retailCategory,
    customLabel3: product.priceBand,
    customLabel4: product.replenishmentClass,
  };
}
