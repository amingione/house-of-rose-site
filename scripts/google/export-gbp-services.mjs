/**
 * Generates review-only Google Business Profile service manifests.
 * No API writes are performed.
 */
import { createClient } from '@sanity/client';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is required.');

const operationsDir =
  process.env.GOOGLE_OPERATIONS_DIR ??
  '/Users/ambermingione/LocalStorm/Workspace/Google-Operations';
const outputDir = path.join(operationsDir, 'evidence', 'gbp');
const client = createClient({ projectId, dataset, apiVersion, useCdn: false });
let services;
try {
  services = await client.fetch(`*[
    _type == "service" &&
    googleBusinessProfile.enabled == true &&
    status in ["live", "actual-menu"]
  ] | order(serviceKey asc) {
    _id, serviceKey, "slug": slug.current,
    "categoryId": googleBusinessProfile.categoryId,
    "displayName": googleBusinessProfile.displayName,
    "description": googleBusinessProfile.description,
    "priceMode": googleBusinessProfile.priceMode,
    "reconciliationStatus": googleBusinessProfile.reconciliationStatus
  }`);
} catch (error) {
  console.error(`GBP service read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}

const invalid = services.filter((service) =>
  !service.serviceKey ||
  !service.displayName ||
  !service.description ||
  service.description.length > 300 ||
  service.priceMode !== 'none'
);
if (invalid.length) {
  console.error(JSON.stringify({ error: 'GBP manifest validation failed.', invalid }, null, 2));
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 10);
const jsonPath = path.join(outputDir, `gbp-services-${stamp}.json`);
const csvPath = path.join(outputDir, `gbp-services-${stamp}.csv`);
const csvEscape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = [
  ['service_key', 'category_id', 'display_name', 'description', 'price_mode', 'reconciliation_status', 'landing_page'],
  ...services.map((service) => [
    service.serviceKey,
    service.categoryId,
    service.displayName,
    service.description,
    'none',
    service.reconciliationStatus,
    `https://houseofrosefl.com/services/${service.slug}/`,
  ]),
].map((row) => row.map(csvEscape).join(',')).join('\n');

await mkdir(outputDir, { recursive: true });
await Promise.all([
  writeFile(jsonPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), services }, null, 2)}\n`),
  writeFile(csvPath, `${csv}\n`),
]);
console.log(JSON.stringify({ services: services.length, jsonPath, csvPath }, null, 2));
