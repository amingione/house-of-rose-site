/**
 * Activate products that have every factual field required by the Google feed.
 *
 * Dry run: npm run google:catalog:activate
 * Apply:   npm run google:catalog:activate:apply
 *
 * Partnership authorization is handled at the catalog level, so product type
 * is not an internal approval gate. Complete records become eligible; records
 * with missing facts become incomplete and get an exact missing-data reason.
 */
import { createClient } from '@sanity/client';

const apply = process.argv.includes('--apply');
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

const products = await client.fetch(`*[_type == "product"] | order(_id asc){
  _id, _rev, title, slug, description, tagline, price, image, brand, brandRef,
  sku, gtin, mpn, identifierExists, shippable, weightLb, shippingWeightEvidence,
  availability, availabilityDate, merchantDestinations, merchantStatus,
  policyClass, exclusionReason
}`);

const policyClassMap = {
  'otc-review': 'otc-product',
  'spf-review': 'spf-product',
  'other-review': 'other',
};

const missingFields = (product) => {
  const missing = [];
  if (!product.title) missing.push('title');
  if (!product.slug?.current) missing.push('slug');
  if (typeof product.price !== 'number' || product.price <= 0) missing.push('price');
  if (!product.image?.asset?._ref) missing.push('image');
  if (!product.brandRef?._ref && !product.brand) missing.push('brand');
  if (!product.sku) missing.push('sku');
  if (product.shippable !== true) missing.push('shippable');
  if (typeof product.weightLb !== 'number' || product.weightLb <= 0) {
    missing.push('shipping_weight');
  }
  if (!product.shippingWeightEvidence?.sourceUrl) {
    missing.push('shipping_weight_evidence');
  }
  if (!product.availability) missing.push('availability');
  if (
    ['preorder', 'backorder'].includes(product.availability) &&
    !product.availabilityDate
  ) {
    missing.push('availability_date');
  }
  if (typeof product.identifierExists !== 'boolean') {
    missing.push('identifier_decision');
  } else if (product.identifierExists && !product.gtin && !product.mpn) {
    missing.push('gtin_or_mpn');
  } else if (!product.identifierExists && (product.gtin || product.mpn)) {
    missing.push('identifier_conflict');
  }
  if (
    !Array.isArray(product.merchantDestinations) ||
    product.merchantDestinations.length === 0
  ) {
    missing.push('merchant_destinations');
  }
  return missing;
};

const decisions = products.map((product) => {
  const missing = missingFields(product);
  const merchantStatus = missing.length === 0 ? 'eligible' : 'incomplete';
  const policyClass = policyClassMap[product.policyClass] ?? product.policyClass ?? 'other';
  const exclusionReason = missing.length === 0
    ? undefined
    : `Missing required product data: ${missing.join(', ')}`;
  return { product, missing, merchantStatus, policyClass, exclusionReason };
});

const changed = decisions.filter(({ product, merchantStatus, policyClass, exclusionReason }) =>
  product.merchantStatus !== merchantStatus ||
  product.policyClass !== policyClass ||
  (product.exclusionReason ?? undefined) !== exclusionReason
);

if (apply && changed.length > 0) {
  let transaction = client.transaction();
  for (const decision of changed) {
    transaction = transaction.patch(decision.product._id, (patch) => {
      let next = patch
        .ifRevisionId(decision.product._rev)
        .set({
          merchantStatus: decision.merchantStatus,
          policyClass: decision.policyClass,
        });
      next = decision.exclusionReason
        ? next.set({ exclusionReason: decision.exclusionReason })
        : next.unset(['exclusionReason']);
      return next;
    });
  }
  await transaction.commit();
}

const readback = apply
  ? await client.fetch(`{
      "total": count(*[_type == "product"]),
      "eligible": count(*[_type == "product" && merchantStatus == "eligible"]),
      "incomplete": count(*[_type == "product" && merchantStatus == "incomplete"]),
      "legacyReviewRequired": count(*[_type == "product" && merchantStatus == "reviewRequired"]),
      "excluded": count(*[_type == "product" && merchantStatus == "excluded"])
    }`)
  : undefined;

const missingFieldCounts = Object.fromEntries(
  [...new Set(decisions.flatMap((decision) => decision.missing))]
    .sort()
    .map((field) => [
      field,
      decisions.filter((decision) => decision.missing.includes(field)).length,
    ]),
);

console.log(JSON.stringify({
  mode: apply ? 'apply' : 'dry-run',
  total: decisions.length,
  eligible: decisions.filter((decision) => decision.merchantStatus === 'eligible').length,
  incomplete: decisions.filter((decision) => decision.merchantStatus === 'incomplete').length,
  changed: changed.length,
  missingFieldCounts,
  readback,
  incompleteProducts: decisions
    .filter((decision) => decision.missing.length > 0)
    .map((decision) => ({
      id: decision.product._id,
      sku: decision.product.sku,
      title: decision.product.title,
      missing: decision.missing,
    })),
}, null, 2));
