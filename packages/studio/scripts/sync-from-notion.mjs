// Notion → Sanity sync.
// Pulls the four "HOUSE OF ROSE" databases (Providers, Services, Packages & Series,
// Memberships & Plans) and upserts them into Sanity. Notion is the source of truth.
//
// Run:  node scripts/run-with-env.mjs npm run sync:notion -w packages/studio
//   (or from packages/studio with env already set:  node scripts/sync-from-notion.mjs)
//
// Auth:
//   - Sanity: local Sanity CLI token (~/.config/sanity/config.json), same as patch-launch-fixes.mjs.
//   - Notion: NOTION_TOKEN env var — an internal integration token. Create one at
//     https://www.notion.so/my-integrations, then "Connect" each of the four databases to it.
//
// Behavior:
//   - Deterministic _ids (hor.<type>.<notionId>) so re-runs UPSERT, never duplicate.
//   - Notion-owned fields are overwritten on every run; website-only fields
//     (service.description/image/faqs, package.outcome/positioning/image, etc.) are
//     preserved via createIfNotExists + patch.set of only the synced fields.
//   - Pass --dry to preview without writing.

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// ── Config ───────────────────────────────────────────────────────────────────
const DRY = process.argv.includes('--dry');
const NOTION_VERSION = '2022-06-28';
const NOTION_TOKEN = process.env.NOTION_TOKEN;

const DB = {
  providers: 'eaa5357336514d0797ae70023787d1e9',
  services: '3785676de39980d9b479c6394810b46b',
  packages: 'b4b4abad2f5e4727bb610c36940353bc',
  memberships: '5cf1a29e2d3742e58869aab0c99d7ccd',
};

if (!NOTION_TOKEN) {
  console.error('Missing NOTION_TOKEN. Add it to .env.local (internal integration token).');
  process.exit(1);
}

// ── Sanity auth ───────────────────────────────────────────────────────────────
// Prefer an env token (CI / GitHub Actions); fall back to the local Sanity CLI
// login (~/.config/sanity/config.json), same pattern as patch-launch-fixes.mjs.
function resolveSanityToken() {
  const envToken =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_AUTH_TOKEN ||
    process.env.SANITY_TOKEN;
  if (envToken) return envToken;
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8'));
    return cfg.authToken;
  } catch {
    return undefined;
  }
}
const token = resolveSanityToken();
if (!token) {
  console.error(
    'No Sanity token. Set SANITY_API_WRITE_TOKEN (CI) or run `sanity login` (local).',
  );
  process.exit(1);
}
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
if (!projectId || !dataset) {
  console.error('Missing Sanity projectId/dataset env (PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET).');
  process.exit(1);
}

// Dependency-free Sanity write via the HTTP mutate API (works in any Node context,
// including the Netlify build — no @sanity/client install needed).
const MUTATE_URL = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
async function sanityMutate(mutations) {
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    throw new Error(`Sanity mutate -> ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const clean = (id) => String(id).replace(/-/g, '');
const idFor = (type, notionId) => `hor.${type}.${clean(notionId)}`;
const keyFor = (ref) => ref.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96) || 'untitled';
}

const map = (table) => (value) => (value == null ? undefined : table[value]);

const laneProvider = map({
  'Advanced Aesthetics': 'advanced-aesthetics',
  'Injectables & Medical': 'injectables-medical',
  Wellness: 'wellness',
  'Classic Facials': 'classic-facials',
  'Beauty & Enhancements': 'beauty-enhancements',
});
const productionStatus = map({
  'In Production': 'in-production',
  'Room Rental — Own Pricing': 'room-rental',
  Parked: 'parked',
});
const serviceCategory = map({
  'Skin Renewal': 'skin-renewal',
  'Injectables & Bio-Fillers': 'injectables-bio-fillers',
  'Wellness & Restoration': 'wellness-restoration',
  'Beauty & Enhancements': 'beauty-enhancements',
  'Retail / Home Care': 'retail-home-care',
});
const serviceStatus = map({
  Live: 'live',
  Proposed: 'proposed',
  Parked: 'parked',
  'Actual Menu': 'actual-menu',
  Duplicate: 'duplicate',
});
const pricingModel = map({
  'Per Session': 'per-session',
  'Per Unit': 'per-unit',
  'Per Area': 'per-area',
  Program: 'program',
  'Add-On': 'add-on',
  Consult: 'consult',
  'Per Item': 'per-item',
});
const packageType = map({ Series: 'series', Journey: 'journey', 'Combo / Add-On Bundle': 'combo' });
const packageStatus = map({ Live: 'live', Proposed: 'proposed', Parked: 'parked' });
const membershipType = map({
  'Membership Tier': 'membership-tier',
  'Regenerative Plan': 'regenerative-plan',
  'Wellness Rider': 'wellness-rider',
});
const membershipLane = map({
  'Lily — Advanced Aesthetics': 'lily',
  'Iris — Injectables': 'iris',
  'Hydrangea — Wellness': 'hydrangea',
  'Magnolia — Waxing & Beauty': 'magnolia',
  'House Collective': 'house-collective',
  'Cross-Lane / Regenerative': 'cross-lane',
});
const membershipStatus = map({ Live: 'live', Proposed: 'proposed', Brainstorm: 'brainstorm' });

// ── Notion property extractors ────────────────────────────────────────────────
const P = (page) => page.properties ?? {};
const title = (page, name) => (P(page)[name]?.title ?? []).map((t) => t.plain_text).join('').trim();
const text = (page, name) => {
  const v = (P(page)[name]?.rich_text ?? []).map((t) => t.plain_text).join('').trim();
  return v || undefined;
};
const select = (page, name) => P(page)[name]?.select?.name;
const relIds = (page, name) => (P(page)[name]?.relation ?? []).map((r) => r.id);
const refs = (type, ids) =>
  ids.map((id) => ({ _type: 'reference', _ref: idFor(type, id), _key: keyFor(idFor(type, id)) }));
const firstRef = (type, ids) => (ids.length ? { _type: 'reference', _ref: idFor(type, ids[0]) } : undefined);

// Drop undefined keys so patch.set doesn't clobber with null.
const defined = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

// ── Notion fetch (paginated) ──────────────────────────────────────────────────
async function queryDatabase(databaseId) {
  const results = [];
  let cursor;
  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 }),
    });
    if (!res.ok) {
      throw new Error(`Notion ${databaseId} -> ${res.status} ${await res.text()}`);
    }
    const json = await res.json();
    results.push(...json.results);
    cursor = json.has_more ? json.next_cursor : undefined;
  } while (cursor);
  return results;
}

// ── Mappers: Notion page -> { _id, _type, create, sync } ──────────────────────
// `create` = minimal doc for createIfNotExists; `sync` = Notion-owned fields to set each run.
function mapProvider(page) {
  const t = title(page, 'Provider') || 'Untitled Provider';
  const _id = idFor('provider', page.id);
  return {
    _id,
    _type: 'provider',
    create: { _id, _type: 'provider', title: t },
    sync: defined({
      title: t,
      fullName: text(page, 'Full Name'),
      lane: laneProvider(select(page, 'Lane')),
      roleCredential: text(page, 'Role / Credential'),
      scopeOfPractice: text(page, 'Scope of Practice'),
      productionStatus: productionStatus(select(page, 'Production Status')),
    }),
  };
}

function mapService(page) {
  const t = title(page, 'Services') || 'Untitled Service';
  const _id = idFor('service', page.id);
  return {
    _id,
    _type: 'service',
    slug: slugify(t),
    create: { _id, _type: 'service', title: t, slug: { _type: 'slug', current: slugify(t) } },
    // Catalog/pricing fields only — website-owned fields (description, image, faqs, process) are left alone.
    sync: defined({
      title: t,
      signatureName: text(page, 'Signature Name'),
      duration: text(page, 'Duration'),
      category: serviceCategory(select(page, 'Category')),
      status: serviceStatus(select(page, 'Status')),
      pricingModel: pricingModel(select(page, 'Pricing Model')),
      foundingPrice: text(page, 'Founding Price'),
      rackPrice: text(page, 'Rack Price'),
      memberPrice: text(page, 'Member Price'),
      pricingNotes: text(page, 'Pricing Notes'),
      competitorPricing: text(page, 'Competitor Pricing'),
      provider: firstRef('provider', relIds(page, 'Provider')),
    }),
  };
}

function mapPackage(page) {
  const t = title(page, 'Package') || 'Untitled Package';
  const _id = idFor('treatmentPackage', page.id);
  const services = refs('service', relIds(page, 'Services Included'));
  return {
    _id,
    _type: 'treatmentPackage',
    slug: slugify(t),
    create: { _id, _type: 'treatmentPackage', title: t, slug: { _type: 'slug', current: slugify(t) } },
    sync: defined({
      title: t,
      type: packageType(select(page, 'Type')),
      status: packageStatus(select(page, 'Status')),
      whatsIncluded: text(page, "What's Included"),
      cadence: text(page, 'Cadence'),
      foundingPrice: text(page, 'Founding Price'),
      rackPrice: text(page, 'Rack Price'),
      provider: firstRef('provider', relIds(page, 'Provider')),
      servicesIncluded: services.length ? services : undefined,
    }),
  };
}

function mapMembership(page) {
  const t = title(page, 'Plan') || 'Untitled Plan';
  const _id = idFor('membership', page.id);
  const linkedServices = refs('service', relIds(page, 'Linked Services'));
  const linkedPackages = refs('treatmentPackage', relIds(page, 'Linked Packages'));
  return {
    _id,
    _type: 'membership',
    slug: slugify(t),
    create: { _id, _type: 'membership', title: t, slug: { _type: 'slug', current: slugify(t) } },
    sync: defined({
      title: t,
      type: membershipType(select(page, 'Type')),
      lane: membershipLane(select(page, 'Lane')),
      status: membershipStatus(select(page, 'Status')),
      monthlyPrice: text(page, 'Monthly Price'),
      whatsIncluded: text(page, "What's Included"),
      perks: text(page, 'Perks'),
      provider: firstRef('provider', relIds(page, 'Provider')),
      linkedServices: linkedServices.length ? linkedServices : undefined,
      linkedPackages: linkedPackages.length ? linkedPackages : undefined,
    }),
  };
}

// ── Upsert ────────────────────────────────────────────────────────────────────
function mutationsFor(doc) {
  const patch =
    doc.slug != null
      ? { id: doc._id, setIfMissing: { slug: { _type: 'slug', current: doc.slug } }, set: doc.sync }
      : { id: doc._id, set: doc.sync };
  return [{ createIfNotExists: doc.create }, { patch }];
}

async function upsert(label, pages, mapper) {
  const docs = pages.map(mapper);
  if (DRY) {
    for (const doc of docs) console.log(`  [dry] ${doc._type} ${doc._id}  ${doc.sync.title ?? ''}`);
    console.log(`✓ ${label}: ${docs.length} (dry)`);
    return;
  }
  // Batch to keep each request small (each doc = 2 mutations).
  const BATCH = 40;
  let ok = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const slice = docs.slice(i, i + BATCH);
    const mutations = slice.flatMap(mutationsFor);
    await sanityMutate(mutations);
    ok += slice.length;
  }
  console.log(`✓ ${label}: ${ok}/${docs.length}`);
}

// ── Run (dependency order so references resolve to existing docs) ──────────────
async function main() {
  console.log(`Notion → Sanity sync${DRY ? ' (dry run)' : ''}  [${projectId}/${dataset}]`);
  const [providers, services, packages, memberships] = await Promise.all([
    queryDatabase(DB.providers),
    queryDatabase(DB.services),
    queryDatabase(DB.packages),
    queryDatabase(DB.memberships),
  ]);
  console.log(
    `Fetched — providers:${providers.length} services:${services.length} packages:${packages.length} memberships:${memberships.length}`,
  );
  await upsert('Providers', providers, mapProvider);
  await upsert('Services', services, mapService);
  await upsert('Packages & Series', packages, mapPackage);
  await upsert('Memberships & Plans', memberships, mapMembership);
  console.log('Done.');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
