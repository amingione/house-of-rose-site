/**
 * Review-only CSV fallback for Google Ads click-based offline conversions.
 * Contains click identifiers and goal data only—never lead identity or service details.
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
const outputDir = path.join(operationsDir, 'evidence', 'offline-conversions');
const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

let rows;
try {
  rows = await client.fetch(`*[
    _type == "leadSubmission" &&
    attribution.consentSnapshot.adUserData == "granted" &&
    defined(attribution.gclid) &&
    status in ["qualified", "consultationBooked", "completed"]
  ] | order(_id asc) {
    _id, status, qualifiedAt, bookedAt, completedAt,
    "clickId": attribution.gclid,
    offlineConversions{
      qualifiedUploadedAt, consultationBookedUploadedAt, completedBookingUploadedAt
    }
  }`);
} catch (error) {
  console.error(`Offline conversion read failed: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}

const goalFor = (lead) => {
  if (lead.status === 'qualified' && !lead.offlineConversions?.qualifiedUploadedAt) {
    return ['qualified_lead', process.env.GOOGLE_ADS_QUALIFIED_LEAD_ACTION_NAME, lead.qualifiedAt];
  }
  if (
    lead.status === 'consultationBooked' &&
    !lead.offlineConversions?.consultationBookedUploadedAt
  ) {
    return [
      'consultation_booked',
      process.env.GOOGLE_ADS_CONSULTATION_BOOKED_ACTION_NAME,
      lead.bookedAt,
    ];
  }
  if (lead.status === 'completed' && !lead.offlineConversions?.completedBookingUploadedAt) {
    return [
      'completed_booking',
      process.env.GOOGLE_ADS_COMPLETED_BOOKING_ACTION_NAME,
      lead.completedAt,
    ];
  }
  return null;
};

const csvRows = rows.flatMap((lead) => {
  const goal = goalFor(lead);
  if (!goal || !goal[1] || !goal[2]) return [];
  return [[lead.clickId, goal[1], goal[2], '', '', `${lead._id}:${goal[0]}`]];
});
const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = [
  ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency', 'Order ID'],
  ...csvRows,
].map((row) => row.map(escape).join(',')).join('\n');

await mkdir(outputDir, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z');
const outputPath = path.join(outputDir, `google-ads-offline-${stamp}.csv`);
await writeFile(outputPath, `${csv}\n`, 'utf8');
console.log(JSON.stringify({ rows: csvRows.length, outputPath }, null, 2));
