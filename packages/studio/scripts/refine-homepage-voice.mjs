/** Replace the repetitive homepage copy with the approved editorial direction. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { createClient } from '@sanity/client';

const APPLY = process.argv.includes('--apply');
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (APPLY && !token) {
  throw new Error('SANITY_API_WRITE_TOKEN is required with --apply.');
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token,
  useCdn: false,
});

const copy = {
  seoTitle: 'House of Rose | Medical Aesthetics in Punta Gorda',
  seoDescription:
    'Explore skin treatments, injectables, facials, body treatments, IV hydration, wellness services, and professional skincare at House of Rose in Punta Gorda.',
  heroKicker: 'House of Rose Aesthetics',
  heroTitle: 'Medical Aesthetics.\nThoughtfully Practiced.',
  heroSubtitle: 'Punta Gorda, Florida',
  heroDescription:
    'Skin health, injectables, facial and body treatments, IV hydration, and wellness care—considered in the context of candidacy, timing, recovery, and the degree of change you actually want.',
  heroCtaPrimaryText: 'Book an appointment',
  heroCtaSecondaryText: 'View services',
  servicesKicker: 'A considered range',
  servicesHeading: 'Different treatments. One standard of judgment.',
  servicesIntro:
    'Corrective work, maintenance care, and wellness services can belong in the same practice without being treated as interchangeable. Each has its own indication, obligations, and place in a longer view.',
  scanHeading: 'A more detailed view of the skin.',
  scanPara1:
    'Multi-spectrum imaging adds context around texture, hydration, pores, pigmentation, fine lines, and visible sun exposure before treatment is considered.',
  scanCtaPrimaryText: 'Review skin analysis',
  aboutKicker: 'House of Rose',
  aboutHeading: 'Independent by design. Accountable in practice.',
  aboutPara1:
    'House of Rose was designed for focused, personal care without the pace of a high-volume treatment floor. The rooms feel collected and residential; the work remains organized, documented, and clinically grounded.',
  aboutPara2:
    'Recommendations come with a rationale. So do preparation, limitations, downtime, aftercare, and the point at which reassessment makes more sense than simply adding another procedure.',
  approachKicker: 'What the standard requires',
  approachHeading: 'A recommendation should survive a harder question: why this, for you, now?',
  approachPara1:
    'The answer may involve treatment history, candidacy, timing, tolerance for downtime, and the desired degree of change. A device name alone is not an answer.',
  approachClosing: 'More treatment is not the standard. Better judgment is.',
  expKicker: 'Inside House of Rose',
  expHeading: 'The rooms are considered. The care has to be more than that.',
  expPara1:
    'A beautiful environment can make an appointment more comfortable; it cannot substitute for sound decisions, precise communication, or responsible follow-through.',
  expPara2:
    'These are the actual House of Rose spaces—photographed as they are, because the practice should be recognizable before you walk through the door.',
  localKicker: 'Visit',
  localHeading: 'A focused practice in Southwest Florida.',
  localPara1:
    'Open Monday through Friday, 9 AM–5 PM. Walk-ins are welcome when the schedule allows; an appointment reserves your time.',
  finalHeading: 'Book directly—or bring us the decision you are still working through.',
  finalPara:
    'Reserve a known service through the booking menu. If the choice depends on candidacy, timing, or competing priorities, send an inquiry or call us.',
  finalCtaText: 'Book a service',
};

const documents = await client.fetch('*[_id in ["homepage", "drafts.homepage"]]');
const published = documents.find((document) => document._id === 'homepage');

if (!published) {
  throw new Error('Published homepage singleton is missing.');
}

const changedFields = Object.keys(copy).filter((field) =>
  documents.some((document) => !isDeepStrictEqual(document[field], copy[field])),
);

console.log(`${changedFields.length} homepage field(s) require refinement.`);
console.log(changedFields.map((field) => `- ${field}`).join('\n'));

if (!APPLY) {
  console.log('Dry run only. Re-run with --apply after review.');
  process.exit(0);
}

const backupDirectory = resolve('.sanity', 'homepage-voice');
const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const backupPath = resolve(backupDirectory, `rollback-${timestamp}.json`);
mkdirSync(backupDirectory, { recursive: true });
writeFileSync(backupPath, `${JSON.stringify(documents, null, 2)}\n`, { flag: 'wx' });

let transaction = client.transaction();
for (const document of documents) {
  transaction = transaction.patch(document._id, (patch) => patch.set(copy));
}
await transaction.commit();

console.log(`Updated ${documents.length} homepage document(s).`);
console.log(`Rollback snapshot: ${backupPath}`);
