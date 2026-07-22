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

/**
 * Return the first non-empty value among `names`, or throw listing all of them.
 *
 * The Netlify Visual Editor cloud container only exposes the storefront's
 * `PUBLIC_SANITY_*` build vars (and the server-side `SANITY_API_WRITE_TOKEN`) —
 * NOT the editor-specific `SANITY_PROJECT_ID` / `SANITY_ACCESS_TOKEN` names used
 * locally. Accepting both keeps local dev and the cloud editor working off the
 * same project without duplicating env vars.
 */
function requireEnv(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(
    `[stackbit.config] Missing required env var. Set one of: ${names.join(', ')}. ` +
      `Add it to .env.local (local) or the Visual Editor project env (cloud).`,
  );
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
  product: '/shop/{slug}',
};

/**
 * Singleton document type -> fixed public route (no `{slug}` — one document
 * per type). Without an entry here, Visual Editor has no `urlPath` to build
 * the sitemap/page-picker entry from, so these pages are invisible in the
 * editor's page navigator even though they're fully Sanity-backed and
 * click-to-edit annotated. Keep in sync with CLAUDE.md "Routes" table.
 */
const SINGLETON_PAGE_ROUTES: Record<string, string> = {
  homepage: '/',
  contactPage: '/contact',
  supportPage: '/support',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
  rentARoom: '/rent-a-room',
  skinAnalysis: '/skin-analysis',
  thankYou: '/thank-you',
  experienceContent: '/experience',
  professionalMakeupPage: '/services/professional-makeup',
  janeIredalePage: '/services/professional-makeup/jane-iredale',
  makeupEventsPage: '/services/professional-makeup/events',
};

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  // Match the repo's engines.node (">=22.12") so the cloud editor container
  // installs with the same Node major as local dev.
  nodeVersion: '22',

  // Run the env-aware Astro dev server inside the Visual Editor container.
  // We `cd packages/web` FIRST so Astro's cwd is the web package: `@astrojs/
  // tailwind` resolves `tailwind.config` relative to the process cwd, so
  // launching from the repo root (`astro --root packages/web`) leaves Tailwind's
  // `content` empty → every class (e.g. `bg-charcoal`) "does not exist" → HTTP
  // 500 on every page and a preview that never connects. run-with-env loads the
  // repo-root .env.local regardless of cwd (it anchors to its own location), so
  // PUBLIC_SANITY_* still resolve. Astro is invoked directly (not via `npm run`)
  // so Stackbit can track the process and detect readiness. {PORT} is the port
  // Stackbit assigns and forwards its preview to.
  devCommand:
    'cd packages/web && node ../../scripts/run-with-env.mjs ../../node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1',

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
      projectId: requireEnv(['SANITY_PROJECT_ID', 'PUBLIC_SANITY_PROJECT_ID']),
      token: requireEnv(['SANITY_ACCESS_TOKEN', 'SANITY_API_WRITE_TOKEN']),
      dataset:
        process.env.SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production',
    }),
  ],

  // Sanity CSI infers documents as `data` models; promote the page-backed
  // document types to `page` and give each its URL template. Visual Editor uses
  // these `urlPath`s to auto-generate the sitemap and Page Editor — substituting
  // `{slug}` from each document's slug field (or using the fixed singleton
  // route as-is) — so no custom siteMap function is needed.
  modelExtensions: Object.entries({ ...PAGE_ROUTES, ...SINGLETON_PAGE_ROUTES }).map(
    ([name, urlPath]) => ({
      name,
      type: 'page' as const,
      urlPath,
    }),
  ),
});
