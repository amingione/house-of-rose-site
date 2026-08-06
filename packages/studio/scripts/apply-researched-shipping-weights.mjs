/**
 * Apply source-backed retail-item shipping weights to the Sanity product catalog.
 *
 * Dry run: npm run google:catalog:weights
 * Apply:   npm run google:catalog:weights:apply
 *
 * The committed evidence ledger is deliberately reviewed input. This script does
 * not scrape, infer from net contents, overwrite an existing weight, or mark a
 * product Merchant-eligible.
 */
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apply = process.argv.includes('--apply');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const evidencePath = path.resolve(
  scriptDir,
  '../migrations/product-shipping-weight-evidence.json',
);
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

const evidence = JSON.parse(await readFile(evidencePath, 'utf8'));
const records = Array.isArray(evidence.records) ? evidence.records : [];
const gramsPerPound = evidence.conversion?.gramsPerPound;
const trustedHosts = new Set([
  'api.glymedplus.com',
  'glymedplus.com',
  'www.glymedplus.com',
  'facerealityskincare.com',
  'www.facerealityskincare.com',
]);
const round6 = (value) => Math.round(value * 1_000_000) / 1_000_000;

const ledgerIssues = [];
const seenIds = new Set();
for (const record of records) {
  if (!record.productId || seenIds.has(record.productId)) {
    ledgerIssues.push(`${record.productId || '(missing id)'}: missing or duplicate productId`);
  }
  seenIds.add(record.productId);
  if (!record.sku || !record.title || !record.brand || !record.manufacturerSku) {
    ledgerIssues.push(`${record.productId}: incomplete catalog match fields`);
  }
  if (!(record.weightLb > 0) || record.weightLb > 70) {
    ledgerIssues.push(`${record.productId}: weightLb must be greater than 0 and no more than 70`);
  }
  if (!(record.sourceValue > 0) || !['g', 'lb'].includes(record.sourceUnit)) {
    ledgerIssues.push(`${record.productId}: invalid source weight/value unit`);
  }
  if (!record.verifiedAt || Number.isNaN(Date.parse(record.verifiedAt))) {
    ledgerIssues.push(`${record.productId}: invalid verifiedAt`);
  }
  for (const field of ['sourceUrl', 'sourceDataUrl']) {
    try {
      const url = new URL(record[field]);
      if (url.protocol !== 'https:' || !trustedHosts.has(url.hostname)) {
        ledgerIssues.push(`${record.productId}: untrusted ${field} host`);
      }
    } catch {
      ledgerIssues.push(`${record.productId}: invalid ${field}`);
    }
  }
  const expectedWeight = record.sourceUnit === 'lb'
    ? record.sourceValue
    : round6(record.sourceValue / gramsPerPound);
  if (round6(record.weightLb) !== round6(expectedWeight)) {
    ledgerIssues.push(`${record.productId}: weight conversion does not match source value`);
  }
}

if (evidence.version !== 1 || gramsPerPound !== 453.59237 || records.length === 0) {
  ledgerIssues.push('Unsupported or empty shipping-weight evidence ledger.');
}
if (ledgerIssues.length > 0) {
  throw new Error(`Evidence ledger validation failed:\n${ledgerIssues.join('\n')}`);
}

const ids = records.map((record) => record.productId);
const products = await client.fetch(
  `*[_type == "product" && _id in $ids]{
    _id, _rev, title, size, brand, sku, weightLb, shippingWeightEvidence,
    mpn, identifierExists
  }`,
  { ids },
);
const productById = new Map(products.map((product) => [product._id, product]));
const conflicts = [];
const patches = [];

for (const record of records) {
  const product = productById.get(record.productId);
  if (!product) {
    conflicts.push(`${record.productId}: product does not exist`);
    continue;
  }
  for (const field of ['sku', 'title', 'size', 'brand']) {
    if ((product[field] ?? '') !== (record[field] ?? '')) {
      conflicts.push(
        `${record.productId}: ${field} changed (ledger=${JSON.stringify(record[field])}, ` +
        `Sanity=${JSON.stringify(product[field])})`,
      );
    }
  }
  if (typeof product.weightLb === 'number' && product.weightLb !== record.weightLb) {
    conflicts.push(
      `${record.productId}: refusing to overwrite existing ${product.weightLb} lb with ` +
      `${record.weightLb} lb`,
    );
  }
  if (product.mpn && product.mpn !== record.manufacturerSku) {
    conflicts.push(
      `${record.productId}: existing MPN ${product.mpn} conflicts with ${record.manufacturerSku}`,
    );
  }
  if (product.identifierExists === false) {
    conflicts.push(`${record.productId}: identifierExists is false but manufacturer SKU was verified`);
  }
  patches.push({
    product,
    record,
    set: {
      weightLb: record.weightLb,
      mpn: product.mpn ?? record.manufacturerSku,
      identifierExists: true,
      shippingWeightEvidence: {
        _type: 'shippingWeightEvidence',
        sourceType: record.sourceType,
        sourceUrl: record.sourceUrl,
        sourceDataUrl: record.sourceDataUrl,
        manufacturerSku: record.manufacturerSku,
        sourceValue: record.sourceValue,
        sourceUnit: record.sourceUnit,
        verifiedAt: record.verifiedAt,
        matchBasis: record.matchBasis,
        note: record.note,
      },
    },
  });
}

if (conflicts.length > 0) {
  throw new Error(`Catalog/evidence reconciliation failed:\n${conflicts.join('\n')}`);
}

const alreadyCurrent = patches.filter(({ product, record }) =>
  product.weightLb === record.weightLb &&
  product.mpn === record.manufacturerSku &&
  product.identifierExists === true &&
  product.shippingWeightEvidence?.sourceUrl === record.sourceUrl &&
  product.shippingWeightEvidence?.verifiedAt === record.verifiedAt
).length;

if (apply && patches.length > alreadyCurrent) {
  let transaction = client.transaction();
  for (const { product, set } of patches) {
    transaction = transaction.patch(product._id, (patch) =>
      patch.ifRevisionId(product._rev).set(set),
    );
  }
  await transaction.commit();
}

const readback = await client.fetch(`{
  "totalProducts": count(*[_type == "product"]),
  "withWeight": count(*[_type == "product" && weightLb > 0]),
  "withWeightEvidence": count(*[_type == "product" && defined(shippingWeightEvidence.sourceUrl)]),
  "withIdentifierDecision": count(*[_type == "product" && defined(identifierExists)]),
  "withMpn": count(*[_type == "product" && defined(mpn)]),
  "evidenceSetMatched": count(*[_type == "product" && _id in $ids && weightLb > 0 &&
    defined(shippingWeightEvidence.sourceUrl) && identifierExists == true && defined(mpn)])
}`, { ids });

console.log(JSON.stringify({
  mode: apply ? 'apply' : 'dry-run',
  evidencePath,
  evidenceRecords: records.length,
  byBrand: Object.fromEntries(
    [...new Set(records.map((record) => record.brand))]
      .sort()
      .map((brand) => [brand, records.filter((record) => record.brand === brand).length]),
  ),
  alreadyCurrent,
  toApply: patches.length - alreadyCurrent,
  manufacturerIdentifiersToSet: patches.filter(({ product }) => !product.mpn).length,
  readback,
  note: 'No merchantStatus values were changed.',
}, null, 2));
