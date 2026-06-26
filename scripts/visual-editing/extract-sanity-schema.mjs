/**
 * extract-sanity-schema.mjs
 * --------------------------
 * Dev-only bridge for Netlify Visual Editor (Stackbit) + Sanity 6.
 *
 * WHY this exists
 * ---------------
 * `@stackbit/cms-sanity@0.2.93` (the latest published release) extracts the
 * Studio schema by monkey-patching a Sanity v3 internal CLI file:
 *   packages/studio/node_modules/sanity/lib/_internal/cli/threads/getGraphQLAPIs.js
 * Sanity 6 removed that internal CLI surface entirely (the CLI now lives in the
 * separate `@sanity/cli` package), so the connector throws
 * "Could not find Sanity file: ...getGraphQLAPIs.js" and `stackbit dev` never
 * starts. There is no newer connector to upgrade to.
 *
 * This script reproduces the ONE thing the connector needed from that file: the
 * Studio's authored `schema.types`. It bundles `packages/studio/schemas/index.ts`
 * with esbuild (Sanity + React kept external so the real installed copies load),
 * imports it in Node, and writes the authored types to
 *   packages/studio/.stackbit/sanity-schema.json
 * in the exact shape the connector's `fetchSchema()` returns:
 *   { projectId, dataset, title, models }
 *
 * A companion patch (`patches/@stackbit+cms-sanity+*.patch`) teaches the
 * connector's `fetchSchema()` to read this file when it exists. `npm run
 * dev:visual` runs this script first.
 *
 * This is DEV-ONLY: it never runs in the Astro `output: 'static'` build.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { build } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STUDIO = path.join(ROOT, 'packages/studio');
const ENTRY = path.join(STUDIO, 'schemas/index.ts');
const OUT_DIR = path.join(STUDIO, '.stackbit');
const OUT_JSON = path.join(OUT_DIR, 'sanity-schema.json');

// Stable, public Studio identifiers (mirror packages/studio/sanity.config.ts).
const PROJECT_ID =
  process.env.SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7';
const DATASET = process.env.SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';
const TITLE = 'House of Rose';

async function main() {
  // Bundle the schema index to a single ESM module. Keep Sanity/React external
  // so Node loads the real installed packages (defineType/defineField are pure
  // helpers); bundling everything else (the local ./schemas/*.ts) resolves the
  // relative imports for us.
  const result = await build({
    entryPoints: [ENTRY],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
    external: [
      'sanity',
      'sanity/*',
      '@sanity/*',
      'react',
      'react-dom',
      'react-is',
      'styled-components',
    ],
  });

  const code = result.outputFiles[0].text;

  // Write the bundle inside the Studio dir so its `import 'sanity'` resolves via
  // the Studio's module graph (hoisted to the repo root node_modules).
  await mkdir(OUT_DIR, { recursive: true });
  const tmp = path.join(OUT_DIR, `__schema-bundle-${process.pid}.mjs`);
  await writeFile(tmp, code, 'utf8');

  let schemaTypes;
  try {
    const mod = await import(pathToFileURL(tmp).href);
    schemaTypes = mod.schemaTypes;
  } finally {
    await rm(tmp, { force: true });
  }

  if (!Array.isArray(schemaTypes) || schemaTypes.length === 0) {
    throw new Error('extract-sanity-schema: `schemaTypes` export was empty or not an array.');
  }

  // JSON round-trip drops functions (validation/preview.prepare/hidden). That is
  // fine for the Visual Editor's content model — it needs field shapes, not
  // runtime rules.
  const models = JSON.parse(JSON.stringify(schemaTypes));

  const payload = { projectId: PROJECT_ID, dataset: DATASET, title: TITLE, models };
  await writeFile(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  // eslint-disable-next-line no-console
  console.log(
    `[extract-sanity-schema] wrote ${models.length} models -> ${path.relative(ROOT, OUT_JSON)}`,
  );
}

// `--soft` (used from the `prepare` lifecycle) never blocks an install/build:
// a failed extraction just means the Visual Editor won't have a fresh schema.
// `npm run dev:visual` runs WITHOUT --soft so local errors surface immediately.
const SOFT = process.argv.includes('--soft');

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[extract-sanity-schema] FAILED:', err?.stack || err);
  if (SOFT) {
    console.warn('[extract-sanity-schema] --soft: continuing despite failure.');
    process.exit(0);
  }
  process.exit(1);
});
