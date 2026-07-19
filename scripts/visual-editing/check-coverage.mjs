#!/usr/bin/env node
/**
 * Visual Editing — coverage checker.
 *
 * Fails (exit 1) when a Sanity-backed Astro page/component renders content
 * WITHOUT inline click-to-edit annotations (`data-sb-*` / the helpers in
 * src/lib/visualEditing.ts). This is what keeps click-to-edit coverage at 100%:
 * any new Sanity-backed page or component must be annotated or explicitly
 * allow-listed, or the commit / CI fails.
 *
 * Run:  node scripts/visual-editing/check-coverage.mjs [--json]
 * Wired into:  npm run ve:check  +  the pre-commit hook.
 *
 * Detection heuristics (no build needed):
 *  - "Sanity-backed" = file pulls Sanity data: imports from lib/queries, uses
 *    sanityFetch / sanityClient, or references a *_QUERY constant.
 *  - "Annotated"      = file uses data-sb-object-id / data-sb-field-path, or any
 *    helper from lib/visualEditing (sbObjectId / sbFieldPath / sbObjectField /
 *    sbFieldPathParts), or — for components — forwards an `sb`/`data-sb-*` prop.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WEB_SRC = path.join(ROOT, 'packages/web/src');
const PAGES_DIR = path.join(WEB_SRC, 'pages');
const COMPONENTS_DIR = path.join(WEB_SRC, 'components');

/**
 * Files that are Sanity-backed but intentionally NOT inline-annotated, with a
 * reason. Keep this list short and justified — it is the only sanctioned escape
 * hatch. Paths are relative to packages/web/src.
 */
const ALLOWLIST = new Map([
  [
    'pages/shop.astro',
    'Fetch-and-delegate only — every Sanity field it loads (product, promotion, shopBrand) is rendered and annotated by PromoBanner / TopSellers / CategoryNav / BrandSpotlight / ProductCard. Its own copy is hardcoded.',
  ],
  [
    'components/Header.astro',
    'Navigation chrome only — reads NAV_COLLECTIONS_QUERY to build the Services mega-menu links (collection + service titles/slugs). These are navigational anchors, not editable page copy; the underlying titles are edited on their own service/collection docs.',
  ],
  ['pages/sitemap.astro', 'Link index only — no editable copy rendered.'],
  ['pages/sitemap.xml.ts', 'Non-Astro route (XML sitemap).'],
  ['pages/llms.txt.ts', 'Non-Astro route (text endpoint).'],
  ['pages/llms-full.txt.ts', 'Non-Astro route (text endpoint).'],
]);

const SANITY_SIGNAL = /\bsanityFetch\b|\bsanityClient\b|from\s+["'](?:\.\.?\/)*lib\/queries["']|[A-Z][A-Z0-9_]*_QUERY\b|sanity:client/;
const ANNOTATION_SIGNAL = /data-sb-object-id|data-sb-field-path|\bsbObjectId\b|\bsbFieldPath\b|\bsbFieldPathParts\b|\bsbObjectField\b/;

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(astro|ts)$/.test(entry)) out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(WEB_SRC, file).split(path.sep).join('/');
}

const violations = [];
const annotated = [];
const skipped = [];

for (const file of [...walk(PAGES_DIR), ...walk(COMPONENTS_DIR)]) {
  const relPath = rel(file);
  const src = readFileSync(file, 'utf8');

  if (!SANITY_SIGNAL.test(src)) continue; // not Sanity-backed → not our concern

  if (ALLOWLIST.has(relPath)) {
    skipped.push({ file: relPath, reason: ALLOWLIST.get(relPath) });
    continue;
  }

  if (ANNOTATION_SIGNAL.test(src)) annotated.push(relPath);
  else violations.push(relPath);
}

const asJson = process.argv.includes('--json');
if (asJson) {
  console.log(JSON.stringify({ annotated, violations, skipped }, null, 2));
} else {
  console.log('\n🎨 Visual Editing — click-to-edit coverage\n');
  console.log(`   ✅ annotated:        ${annotated.length}`);
  console.log(`   ⚪ allow-listed:     ${skipped.length}`);
  console.log(`   ❌ missing:          ${violations.length}\n`);
  if (skipped.length) {
    for (const s of skipped) console.log(`   ⚪ ${s.file} — ${s.reason}`);
    console.log('');
  }
  if (violations.length) {
    console.log('   The following Sanity-backed files have NO inline annotations:');
    for (const v of violations) console.log(`      ❌ ${v}`);
    console.log('\n   Fix: annotate with helpers from "@/lib/visualEditing"');
    console.log('        (sbObjectId / sbFieldPath), or add to ALLOWLIST with a reason.');
    console.log('   Scaffold a pre-annotated file:  npm run ve:new\n');
  } else {
    console.log('   All Sanity-backed pages & components are wired for click-to-edit. ✨\n');
  }
}

process.exit(violations.length ? 1 : 0);
