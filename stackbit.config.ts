import path from 'node:path';
import { readFileSync } from 'node:fs';

import { defineStackbitConfig } from '@stackbit/types';
import { SanityContentSource } from '@stackbit/cms-sanity';

/**
 * House of Rose — Netlify Visual Editor configuration.
 *
 * WHY this exists
 * ----------------
 * Sanity remains the single source of truth (see CLAUDE.md "Architecture Law").
 * Netlify Visual Editor (formerly Stackbit) sits *on top of* Sanity to provide
 * click-to-edit / side-by-side visual editing against the live Astro preview.
 * It adds NO second content source — `@stackbit/cms-sanity` simply teaches the
 * editor how to read/write the existing `4e7axyi7` Sanity project.
 *
 * It is a DEV-ONLY tool: `@stackbit/types` + `@stackbit/cms-sanity` are
 * devDependencies and are never imported by the Astro site, so the static
 * `output: 'static'` build is untouched.
 *
 * HOW env vars are resolved
 * -------------------------
 * Visual Editor auto-loads a root `.env`. To avoid duplicating secrets that
 * already live in the project's gitignored `.env.local`, we eagerly load
 * `.env.local` then `.env` (first definition wins) before reading config.
 */

// Stackbit's config loader injects `__dirname` (repo root).
const ROOT = __dirname;

/** Minimal dotenv loader (mirrors scripts/run-with-env.mjs) — first wins. */
function loadEnvFile(file: string): void {
  let contents: string;
  try {
    contents = readFileSync(path.join(ROOT, file), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(eq + 1).trim();
    const quote = value.at(0);
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[stackbit.config] Missing required env var "${name}". ` +
        `Add it to .env.local (local) or the Visual Editor project env (cloud).`,
    );
  }
  return value;
}

/**
 * Sanity document type -> public route. Mirrors packages/web/src/pages.
 * `{slug}` is substituted from each document's `slug.current`.
 * Keep in sync with CLAUDE.md "Routes" table.
 */
const PAGE_ROUTES: Record<string, string> = {
  service: '/services/{slug}',
  serviceCollection: '/services/collections/{slug}',
  concern: '/concerns/{slug}',
  costGuide: '/cost/{slug}',
  comparison: '/compare/{slug}',
  localArea: '/areas/{slug}',
  caseStudy: '/results/{slug}',
  blogPost: '/blog/{slug}',
  treatmentPackage: '/packages/{slug}',
};

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  // Match the repo's engines.node (">=22.12") so the cloud editor container
  // installs with the same Node major as local dev.
  nodeVersion: '22',

  // Run the existing env-aware Astro dev server inside the Visual Editor
  // container. We reuse scripts/run-with-env.mjs so PUBLIC_SANITY_* load exactly
  // as in normal `npm run dev:web`. `--root packages/web` targets the storefront
  // package from the monorepo root.
  devCommand:
    'node scripts/run-with-env.mjs node_modules/.bin/astro dev --root packages/web --port {PORT} --hostname 127.0.0.1',

  // Vite/Astro compatibility inside the editor container.
  experimental: {
    ssg: {
      name: 'Astro',
      logPatterns: {
        up: ['is ready', 'astro'],
      },
      passthrough: ['/vite-hmr/**'],
    },
  },

  contentSources: [
    new SanityContentSource({
      rootPath: path.resolve(ROOT, 'packages/web'),
      studioPath: path.resolve(ROOT, 'packages/studio'),
      studioUrl: process.env.SANITY_STUDIO_URL ?? 'https://studio.houseofrosefl.com',
      projectId: requireEnv('SANITY_PROJECT_ID'),
      token: requireEnv('SANITY_ACCESS_TOKEN'),
      dataset: process.env.SANITY_DATASET ?? 'production',
    }),
  ],

  // Sanity CSI infers documents as `data` models; promote the page-backed
  // document types to `page` and give each its URL template. Visual Editor uses
  // these `urlPath`s to auto-generate the sitemap and Page Editor — substituting
  // `{slug}` from each document's slug field — so no custom siteMap is needed.
  modelExtensions: Object.entries(PAGE_ROUTES).map(([name, urlPath]) => ({
    name,
    type: 'page' as const,
    urlPath,
  })),
});
