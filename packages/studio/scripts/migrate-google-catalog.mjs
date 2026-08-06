/**
 * Google catalog migration.
 *
 * Default: read-only dry run, prints a reconciliation summary.
 * Ledger:  npm run google:catalog:migrate -- --write-ledger
 * Apply:   npm run google:catalog:migrate -- --apply
 *
 * This script intentionally never marks a product Merchant-eligible. It assigns
 * stable internal keys and an incomplete-data state; the activation migration
 * separately verifies every factual feed requirement.
 */
import { createClient } from '@sanity/client';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apply = process.argv.includes('--apply');
const writeLedger = process.argv.includes('--write-ledger');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ledgerPath = path.resolve(scriptDir, '../migrations/google-product-sku-ledger.json');
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  '4e7axyi7';
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.PUBLIC_SANITY_DATASET ??
  'production';
const apiVersion =
  process.env.SANITY_API_VERSION ??
  process.env.PUBLIC_SANITY_API_VERSION ??
  '2025-04-26';
const token =
  process.env.SANITY_API_WRITE_TOKEN ??
  process.env.SANITY_AUTH_TOKEN ??
  process.env.SANITY_TOKEN;

const client = apply && !token
  ? (await import('sanity/cli')).getCliClient({ apiVersion })
  : createClient({ projectId, dataset, apiVersion, token, useCdn: false });
let ledger = { version: 1, generatedAt: null, assignments: {} };
try {
  ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
} catch {
  // The first reviewed dry run creates the committed ledger.
}
let products;
let brands;
try {
  [products, brands] = await Promise.all([
    client.fetch(`*[_type == "product"] | order(_id asc){
      _id, title, slug, description, brand, sku, gtin, mpn, identifierExists,
      price, image, category, inStock, shippable, weightLb, condition,
      inventoryQuantity, availability, merchantStatus, policyClass,
      merchantDestinations, productTypePath, googleProductCategoryId,
      exclusionReason, brandRef, campaignTier, priceBand, replenishmentClass
    }`),
    client.fetch(`*[_type == "shopBrand"]{ _id, brandKey, title, manufacturerName }`),
  ]);
} catch (error) {
  console.error(`Catalog read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}

const normalizeBrand = (value) => value === 'Procell' ? 'procell' : value;
const brandCodes = {
  procell: 'PRO',
  glymed: 'GLY',
  'skin-script': 'SS',
  'face-reality': 'FR',
  'house-of-rose': 'HOR',
};
const brandByKey = new Map(brands.map((brand) => [normalizeBrand(brand.brandKey), brand]));
const counters = new Map();
for (const product of products) {
  const match = /^HOR-([A-Z]+)-(\d+)$/.exec(product.sku ?? '');
  if (match) counters.set(match[1], Math.max(counters.get(match[1]) ?? 0, Number(match[2])));
}
for (const sku of Object.values(ledger.assignments)) {
  const match = /^HOR-([A-Z]+)-(\d+)$/.exec(String(sku));
  if (match) counters.set(match[1], Math.max(counters.get(match[1]) ?? 0, Number(match[2])));
}
const nextSku = (brand) => {
  const code = brandCodes[brand] ?? 'GEN';
  const next = (counters.get(code) ?? 0) + 1;
  counters.set(code, next);
  return `HOR-${code}-${String(next).padStart(4, '0')}`;
};
const classify = (product) => {
  const text = `${product.title ?? ''} ${product.description ?? ''}`.toLowerCase();
  if (/\bcbd\b|cannabidiol/.test(text)) return { merchantStatus: 'excluded', policyClass: 'cbd-prohibited', exclusionReason: 'CBD is excluded from Google Merchant.' };
  if (product.category === 'gift-cards') return { merchantStatus: 'excluded', policyClass: 'service-like', exclusionReason: 'Gift-card or service-like item is outside the physical retail launch.' };
  if (product.merchantStatus === 'eligible') {
    return {
      merchantStatus: 'eligible',
      policyClass: product.policyClass ?? 'standard-retail',
      exclusionReason: undefined,
    };
  }
  if (product.merchantStatus === 'excluded') {
    return {
      merchantStatus: 'excluded',
      policyClass: product.policyClass ?? 'other',
      exclusionReason: product.exclusionReason ?? 'Explicitly excluded from Google Merchant.',
    };
  }
  if (/spf|sunscreen/.test(text)) {
    return {
      merchantStatus: 'incomplete',
      policyClass: 'spf-product',
      exclusionReason: 'Complete the required Merchant product fields before activation.',
    };
  }
  if (/acne|benzoyl|salicylic|resorcinol|sulfur/.test(text)) {
    return {
      merchantStatus: 'incomplete',
      policyClass: 'otc-product',
      exclusionReason: 'Complete the required Merchant product fields before activation.',
    };
  }
  return {
    merchantStatus: 'incomplete',
    policyClass: 'standard-retail',
    exclusionReason: 'Complete the required Merchant product fields before activation.',
  };
};
const productTypePath = (category) => ({
  skincare: 'Beauty & Personal Care > Cosmetics > Skin Care',
  candles: 'Home & Garden > Decor > Home Fragrances > Candles',
  accessories: 'Beauty & Personal Care > Cosmetics > Cosmetic Tools',
  other: 'Beauty & Personal Care',
}[category]);
const priceBand = (cents) => {
  if (typeof cents !== 'number') return undefined;
  if (cents < 2500) return 'under-25';
  if (cents < 5000) return '25-49';
  if (cents < 10000) return '50-99';
  return '100-plus';
};

const patches = products.map((product) => {
  const brandKey = normalizeBrand(product.brand);
  const brand = brandByKey.get(brandKey);
  const policy = classify(product);
  return {
    id: product._id,
    set: {
      sku: product.sku ?? nextSku(brandKey),
      ...(brand ? { brandRef: { _type: 'reference', _ref: brand._id } } : {}),
      brand: brandKey,
      availability: product.availability ?? (product.inStock === false ? 'out_of_stock' : 'in_stock'),
      shippable: product.shippable ?? product.category !== 'gift-cards',
      condition: product.condition ?? 'new',
      merchantDestinations: product.merchantDestinations ?? ['free-listings', 'shopping-ads'],
      ...(product.productTypePath || !productTypePath(product.category)
        ? {}
        : { productTypePath: productTypePath(product.category) }),
      campaignTier: product.campaignTier ?? 'long-tail',
      priceBand: product.priceBand ?? priceBand(product.price),
      replenishmentClass: product.replenishmentClass ?? 'replenishment',
      ...policy,
    },
    unset: policy.merchantStatus === 'eligible' ? ['exclusionReason'] : [],
  };
});

for (const patch of patches) {
  const assigned = ledger.assignments[patch.id];
  if (assigned) patch.set.sku = assigned;
}
const newAssignments = Object.fromEntries(patches.map((patch) => [patch.id, patch.set.sku]));
const missingFromLedger = patches.filter((patch) => !ledger.assignments[patch.id]);

const readiness = products.map((product) => {
  const patch = patches.find((candidate) => candidate.id === product._id);
  const merged = { ...product, ...patch?.set };
  const missing = [];
  if (!merged.title) missing.push('title');
  if (!merged.slug?.current) missing.push('slug');
  if (typeof merged.price !== 'number' || merged.price <= 0) missing.push('price');
  if (!merged.image?.asset?._ref) missing.push('image');
  if (!merged.brandRef?._ref && !merged.brand) missing.push('brand');
  if (!merged.sku) missing.push('sku');
  if (merged.shippable !== true) missing.push('shippable');
  if (typeof merged.weightLb !== 'number' || merged.weightLb <= 0) missing.push('shipping_weight');
  if (!merged.availability) missing.push('availability');
  if (typeof merged.identifierExists !== 'boolean') missing.push('identifier_decision');
  else if (merged.identifierExists && !merged.gtin && !merged.mpn) missing.push('gtin_or_mpn');
  if (!Array.isArray(merged.merchantDestinations) || merged.merchantDestinations.length === 0) {
    missing.push('merchant_destinations');
  }
  return { id: product._id, title: product.title, sku: merged.sku, missing };
});
const missingFieldCounts = Object.fromEntries(
  [...new Set(readiness.flatMap((product) => product.missing))]
    .sort()
    .map((field) => [field, readiness.filter((product) => product.missing.includes(field)).length]),
);

if (apply && missingFromLedger.length) {
  throw new Error(
    `${missingFromLedger.length} products are missing from the committed SKU ledger. Run --write-ledger, review, and commit it before --apply.`,
  );
}

if (writeLedger) {
  await mkdir(path.dirname(ledgerPath), { recursive: true });
  await writeFile(
    ledgerPath,
    `${JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      assignments: newAssignments,
    }, null, 2)}\n`,
  );
}

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  products: patches.length,
  brandsResolved: patches.filter((patch) => patch.set.brandRef).length,
  excluded: patches.filter((patch) => patch.set.merchantStatus === 'excluded').length,
  incomplete: patches.filter((patch) => patch.set.merchantStatus === 'incomplete').length,
  eligible: patches.filter((patch) => patch.set.merchantStatus === 'eligible').length,
  feedReadyAfterSafeMigration: readiness.filter((product) => product.missing.length === 0).length,
  missingFieldCounts,
  ledgerPath,
  ledgerEntries: Object.keys(newAssignments).length,
  missingFromLedger: missingFromLedger.length,
  wroteLedger: writeLedger,
  sample: patches.slice(0, 10),
};

if (apply) {
  let transaction = client.transaction();
  for (const patch of patches) {
    transaction = transaction.patch(patch.id, {
      set: patch.set,
      ...(patch.unset.length > 0 ? { unset: patch.unset } : {}),
    });
  }
  await transaction.commit();
}

console.log(JSON.stringify(summary, null, 2));
