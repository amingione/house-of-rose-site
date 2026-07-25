/**
 * Google catalog migration.
 *
 * Default: read-only dry run, prints a reconciliation summary.
 * Ledger:  npm run google:catalog:migrate -- --write-ledger
 * Apply:   npm run google:catalog:migrate -- --apply
 *
 * This script intentionally never marks a product Merchant-eligible. It assigns
 * stable internal keys and policy review states; eligibility still requires
 * inventory, image, price, identifiers, authorization, and human evidence.
 */
import { createClient } from '@sanity/client';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apply = process.argv.includes('--apply');
const writeLedger = process.argv.includes('--write-ledger');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const ledgerPath = path.resolve(scriptDir, '../migrations/google-product-sku-ledger.json');
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is required.');
if (apply && !token) throw new Error('SANITY_API_WRITE_TOKEN is required with --apply.');

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
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
      _id, title, description, brand, sku, gtin, mpn, price, category, inStock,
      inventoryQuantity, availability, merchantStatus, policyClass,
      brandRef, campaignTier, priceBand, replenishmentClass
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
  if (/spf|sunscreen/.test(text)) return { merchantStatus: 'reviewRequired', policyClass: 'spf-review', exclusionReason: 'SPF product requires Google policy and label review.' };
  if (/acne|benzoyl|salicylic|resorcinol|sulfur/.test(text)) return { merchantStatus: 'reviewRequired', policyClass: 'otc-review', exclusionReason: 'OTC/acne product requires Google policy and label review.' };
  return { merchantStatus: 'reviewRequired', policyClass: 'standard-retail', exclusionReason: 'Requires identifiers, inventory, images, authorization, and human approval.' };
};
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
      condition: 'new',
      campaignTier: product.campaignTier ?? 'long-tail',
      priceBand: product.priceBand ?? priceBand(product.price),
      replenishmentClass: product.replenishmentClass ?? 'replenishment',
      ...policy,
    },
    unset: [],
  };
});

for (const patch of patches) {
  const assigned = ledger.assignments[patch.id];
  if (assigned) patch.set.sku = assigned;
}
const newAssignments = Object.fromEntries(patches.map((patch) => [patch.id, patch.set.sku]));
const missingFromLedger = patches.filter((patch) => !ledger.assignments[patch.id]);

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
  reviewRequired: patches.filter((patch) => patch.set.merchantStatus === 'reviewRequired').length,
  eligible: 0,
  ledgerPath,
  ledgerEntries: Object.keys(newAssignments).length,
  missingFromLedger: missingFromLedger.length,
  wroteLedger: writeLedger,
  sample: patches.slice(0, 10),
};

if (apply) {
  let transaction = client.transaction();
  for (const patch of patches) transaction = transaction.patch(patch.id, { set: patch.set });
  await transaction.commit();
}

console.log(JSON.stringify(summary, null, 2));
