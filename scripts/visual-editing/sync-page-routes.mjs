#!/usr/bin/env node
/**
 * Visual Editing — PAGE_ROUTES ↔ routes ↔ Sanity types consistency check.
 *
 * `stackbit.config.ts` maps Sanity *document types* → URL templates (PAGE_ROUTES).
 * This script keeps that map honest by cross-referencing it against:
 *   1. the GROQ queries (which type each *_BY_SLUG_QUERY targets), and
 *   2. the actual dynamic Astro routes (pages/**​/[slug].astro etc.).
 *
 * It reports (and with --fix, can stub) any drift:
 *   - a detail route exists for a Sanity type but the type is missing from PAGE_ROUTES
 *   - a PAGE_ROUTES entry has no matching dynamic route file
 *
 * Run:  node scripts/visual-editing/sync-page-routes.mjs [--json] [--fix]
 * Wired into:  npm run ve:sync  +  the pre-commit hook.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CONFIG = path.join(ROOT, 'stackbit.config.ts');
const QUERIES = path.join(ROOT, 'packages/web/src/lib/queries.ts');
const PAGES_DIR = path.join(ROOT, 'packages/web/src/pages');

const fix = process.argv.includes('--fix');
const asJson = process.argv.includes('--json');

// 1. Map each *_QUERY constant → the Sanity type it targets.
const queriesSrc = readFileSync(QUERIES, 'utf8');
const queryType = new Map();
for (const m of queriesSrc.matchAll(/export const ([A-Z0-9_]+_QUERY)\s*=\s*\/\*\s*groq\s*\*\/\s*`([\s\S]*?)`/g)) {
  const [, name, body] = m;
  const single = body.match(/_type\s*==\s*"([^"]+)"/);
  if (single) queryType.set(name, single[1]);
}

// 2. Parse PAGE_ROUTES from stackbit.config.ts.
const configSrc = readFileSync(CONFIG, 'utf8');
const routesBlock = configSrc.match(/const PAGE_ROUTES[^{]*\{([\s\S]*?)\n\};/);
const pageRoutes = new Map();
if (routesBlock) {
  for (const m of routesBlock[1].matchAll(/(\w+)\s*:\s*'([^']+)'/g)) pageRoutes.set(m[1], m[2]);
}

// 3. Find dynamic detail routes and the Sanity type each renders.
function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (e.endsWith('.astro')) out.push(full);
  }
  return out;
}
function routeFromFile(file) {
  // pages/cost/[slug].astro -> /cost/{slug}; [collection] -> {slug}
  let rel = path.relative(PAGES_DIR, file).replace(/\.astro$/, '');
  rel = rel.replace(/index$/, '').replace(/\/$/, '');
  rel = rel.replace(/\[[^\]]+\]/g, '{slug}');
  return '/' + rel;
}

const detailTypeToRoute = new Map();
for (const file of walk(PAGES_DIR)) {
  if (!/\[[^\]]+\]\.astro$/.test(file)) continue; // dynamic routes only
  const src = readFileSync(file, 'utf8');
  // which *_BY_SLUG_QUERY (or *_QUERY) does this page use?
  const used = [...src.matchAll(/([A-Z0-9_]+_QUERY)\b/g)].map((m) => m[1]);
  const slugQuery = used.find((q) => queryType.has(q) && /BY_SLUG|BY_/.test(q)) || used.find((q) => queryType.has(q));
  if (!slugQuery) continue;
  const type = queryType.get(slugQuery);
  if (type) detailTypeToRoute.set(type, routeFromFile(file));
}

// 4. Diff.
const missingFromConfig = []; // type has a detail route but not in PAGE_ROUTES
for (const [type, route] of detailTypeToRoute) {
  if (!pageRoutes.has(type)) missingFromConfig.push({ type, route });
}
const missingRouteFile = []; // PAGE_ROUTES entry with no dynamic route file
for (const type of pageRoutes.keys()) {
  if (!detailTypeToRoute.has(type)) missingRouteFile.push(type);
}

if (asJson) {
  console.log(JSON.stringify({ pageRoutes: [...pageRoutes], detailTypeToRoute: [...detailTypeToRoute], missingFromConfig, missingRouteFile }, null, 2));
} else {
  console.log('\n🗺️  Visual Editing — PAGE_ROUTES sync\n');
  console.log(`   PAGE_ROUTES entries: ${pageRoutes.size} · detail routes found: ${detailTypeToRoute.size}`);
  if (missingFromConfig.length) {
    console.log('\n   ❌ Detail routes whose Sanity type is missing from PAGE_ROUTES:');
    for (const { type, route } of missingFromConfig) console.log(`      ${type} → ${route}`);
  }
  if (missingRouteFile.length) {
    console.log('\n   ⚠️  PAGE_ROUTES entries with no matching dynamic route file (ok if intentional):');
    for (const t of missingRouteFile) console.log(`      ${t} → ${pageRoutes.get(t)}`);
  }
  if (!missingFromConfig.length && !missingRouteFile.length) console.log('\n   In sync. ✨');
  console.log('');
}

if (fix && missingFromConfig.length) {
  let newBlock = routesBlock[1];
  const insert = missingFromConfig.map(({ type, route }) => `  ${type}: '${route}',`).join('\n');
  newBlock = newBlock.replace(/\n*$/, '') + '\n' + insert + '\n';
  const updated = configSrc.replace(routesBlock[1], newBlock);
  writeFileSync(CONFIG, updated);
  console.log(`   ✍️  Added ${missingFromConfig.length} route(s) to PAGE_ROUTES in stackbit.config.ts.\n`);
}

// Only hard-fail on the actionable drift (type with a route but no config entry).
process.exit(missingFromConfig.length && !fix ? 1 : 0);
