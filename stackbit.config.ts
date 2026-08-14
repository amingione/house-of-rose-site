import path from 'node:path';
import { readFileSync } from 'node:fs';

import { defineStackbitConfig } from '@stackbit/types';
import { SanityContentSource } from '@stackbit/cms-sanity';

import { REVIEWED_PUBLIC_COMPARISON_SLUGS } from './packages/web/src/lib/publicComparisonContent';
import { isReviewedPublicBlogSlug } from './packages/web/src/lib/publicBlogContent';
import { REVIEWED_PUBLIC_COLLECTION_SLUGS } from './packages/web/src/lib/publicCollectionContent';
import { RETIRED_PUBLIC_CONCERN_SLUGS } from './packages/web/src/lib/publicConcernContent';
import {
  RETIRED_COST_GUIDE_SLUGS,
  REVIEWED_PUBLIC_COST_GUIDE_SLUGS,
} from './packages/web/src/lib/publicCostGuideContent';
import { REVIEWED_PUBLIC_LOCAL_AREA_SLUGS } from './packages/web/src/lib/publicLocalAreaContent';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from './packages/web/src/lib/publicServiceContent';
import { VERIFIED_TREATMENT_PACKAGE_SLUGS } from './packages/web/src/lib/publicTreatmentPackageContent';

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

const PUBLIC_SHOP_ENABLED = process.env.PUBLIC_SHOP_ENABLED === 'true';
const REVIEWED_PUBLIC_COMPARISON_SLUG_SET = new Set<string>(
  REVIEWED_PUBLIC_COMPARISON_SLUGS,
);
const REVIEWED_PUBLIC_COLLECTION_SLUG_SET = new Set<string>(
  REVIEWED_PUBLIC_COLLECTION_SLUGS,
);
const RETIRED_PUBLIC_CONCERN_SLUG_SET = new Set<string>(RETIRED_PUBLIC_CONCERN_SLUGS);
const REVIEWED_PUBLIC_COST_GUIDE_SLUG_SET = new Set<string>(
  REVIEWED_PUBLIC_COST_GUIDE_SLUGS,
);
const RETIRED_COST_GUIDE_SLUG_SET = new Set<string>(RETIRED_COST_GUIDE_SLUGS);
const REVIEWED_PUBLIC_LOCAL_AREA_SLUG_SET = new Set<string>(
  REVIEWED_PUBLIC_LOCAL_AREA_SLUGS,
);
const UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET = new Set<string>(
  UNAVAILABLE_PUBLIC_SERVICE_SLUGS,
);
const VERIFIED_TREATMENT_PACKAGE_SLUG_SET = new Set<string>(
  VERIFIED_TREATMENT_PACKAGE_SLUGS,
);
const PUBLIC_SERVICE_STATUS_SET = new Set(['live', 'actual-menu']);

function documentStringField(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): string | undefined {
  const field = document?.fields[fieldName];
  if (!field || typeof field !== 'object' || !('value' in field)) return undefined;
  return typeof field.value === 'string' ? field.value : undefined;
}

function documentBooleanField(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): boolean | undefined {
  const field = document?.fields[fieldName];
  if (!field || typeof field !== 'object' || !('value' in field)) return undefined;
  return typeof field.value === 'boolean' ? field.value : undefined;
}

function documentHasNonEmptyList(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): boolean {
  const field = document?.fields[fieldName];
  if (!field || typeof field !== 'object') return false;

  if ('items' in field && Array.isArray(field.items)) return field.items.length > 0;
  if ('value' in field && Array.isArray(field.value)) return field.value.length > 0;
  return false;
}

function documentReferenceIds(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): string[] {
  const field = document?.fields[fieldName];
  if (!field || typeof field !== 'object' || !('items' in field) || !Array.isArray(field.items)) {
    return [];
  }
  return field.items.flatMap((item) => {
    if (
      !item ||
      typeof item !== 'object' ||
      !('type' in item) ||
      item.type !== 'reference' ||
      !('refType' in item) ||
      item.refType !== 'document' ||
      !('refId' in item) ||
      typeof item.refId !== 'string' ||
      !item.refId
    ) {
      return [];
    }
    return [item.refId];
  });
}

function documentHasAssetReference(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): boolean {
  const field = document?.fields[fieldName];
  return Boolean(
    field &&
      typeof field === 'object' &&
      'type' in field &&
      field.type === 'reference' &&
      'refType' in field &&
      field.refType === 'asset' &&
      'refId' in field &&
      typeof field.refId === 'string' &&
      field.refId,
  );
}

function documentReferenceId(
  document: { fields: Record<string, unknown> } | undefined,
  fieldName: string,
): string | undefined {
  const field = document?.fields[fieldName];
  if (
    !field ||
    typeof field !== 'object' ||
    !('type' in field) ||
    field.type !== 'reference' ||
    !('refType' in field) ||
    field.refType !== 'document' ||
    !('refId' in field)
  ) {
    return undefined;
  }
  return typeof field.refId === 'string' && field.refId ? field.refId : undefined;
}

function documentNestedReferenceId(
  document: { fields: Record<string, unknown> } | undefined,
  objectFieldName: string,
  referenceFieldName: string,
): string | undefined {
  const objectField = document?.fields[objectFieldName];
  if (
    !objectField ||
    typeof objectField !== 'object' ||
    !('type' in objectField) ||
    objectField.type !== 'object' ||
    !('fields' in objectField) ||
    !objectField.fields ||
    typeof objectField.fields !== 'object' ||
    Array.isArray(objectField.fields)
  ) {
    return undefined;
  }
  return documentReferenceId(
    { fields: objectField.fields as Record<string, unknown> },
    referenceFieldName,
  );
}

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
  ...(PUBLIC_SHOP_ENABLED ? { product: '/shop/{slug}' } : {}),
  provider: '/about/providers/{slug}',
};

/**
 * Singleton document type -> fixed public route (no `{slug}` — one document
 * per type). Without an entry here, Visual Editor has no `urlPath` to build
 * the sitemap/page-picker entry from, so these pages are invisible in the
 * editor's page navigator even though they're fully Sanity-backed and
 * click-to-edit annotated. Keep in sync with CLAUDE.md "Routes" table.
 */
const SINGLETON_PAGE_ROUTES: Record<string, string> = {
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
  rentARoom: '/rent-a-room',
  ...(PUBLIC_SHOP_ENABLED ? { janeIredalePage: '/shop/jane-iredale' } : {}),
  aboutPage: '/about',
};
const SINGLETON_PAGE_MODEL_SET = new Set(Object.keys(SINGLETON_PAGE_ROUTES));

const SANITY_PROJECT_ID = requireEnv(['SANITY_PROJECT_ID', 'PUBLIC_SANITY_PROJECT_ID']);
const SANITY_DATASET =
  process.env.SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';
const SANITY_SOURCE_PROJECT_ID = `${SANITY_PROJECT_ID}:${SANITY_DATASET}`;
const SANITY_STUDIO_URL =
  process.env.SANITY_STUDIO_URL ?? 'https://studio.houseofrosefl.com';

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
      directRoutes: {
        'socket.io': 'socket.io',
      },
      passthrough: ['/vite-hmr/**'],
    },
  },

  contentSources: [
    new SanityContentSource({
      rootPath: path.resolve(ROOT, 'packages/web'),
      studioPath: path.resolve(ROOT, 'packages/studio'),
      studioUrl: SANITY_STUDIO_URL,
      projectId: SANITY_PROJECT_ID,
      token: requireEnv(['SANITY_ACCESS_TOKEN', 'SANITY_API_WRITE_TOKEN']),
      dataset: SANITY_DATASET,
    }),
  ],

  // Persistent editor shortcuts for the content and tools used most often.
  // Relative links navigate inside the preview; absolute links open a new tab.
  sidebarButtons: [
    {
      label: 'Site Settings',
      type: 'document',
      icon: 'tools',
      documentId: 'siteSettings',
      srcType: 'sanity',
      srcProjectId: SANITY_SOURCE_PROJECT_ID,
    },
    {
      label: 'Skin Analysis Page',
      type: 'link',
      icon: 'insights',
      url: '/skin-analysis',
    },
    {
      label: 'Sanity Studio',
      type: 'link',
      icon: 'external-link',
      url: SANITY_STUDIO_URL,
    },
    {
      label: 'Netlify Project',
      type: 'link',
      icon: 'external-link',
      url: 'https://app.netlify.com/projects/house-of-rose-web',
    },
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

  // Model extensions keep reviewed content editable as pages, but records that
  // fail the corresponding public route gate must not appear in the Visual
  // Editor sitemap/page picker.
  transformSitemap: ({ sitemap, getDocumentById }) => sitemap.filter((entry) => {
    if (!('document' in entry)) return true;
    if (SINGLETON_PAGE_MODEL_SET.has(entry.document.modelName)) {
      const canonicalId = entry.document.id.replace(/^drafts\./, '');
      return canonicalId === entry.document.modelName;
    }
    if (
      ![
        'comparison',
        'blogPost',
        'caseStudy',
        'concern',
        'localArea',
        'service',
        'serviceCollection',
        'costGuide',
        'treatmentPackage',
        'provider',
      ].includes(entry.document.modelName)
    ) {
      return true;
    }

    const document = getDocumentById({
      id: entry.document.id,
      srcType: entry.document.srcType,
      srcProjectId: entry.document.srcProjectId,
    });
    const slug = documentStringField(document, 'slug');

    if (entry.document.modelName === 'blogPost') {
      const publishedAt = documentStringField(document, 'publishedAt');
      return Boolean(slug && publishedAt && isReviewedPublicBlogSlug(slug));
    }

    if (entry.document.modelName === 'caseStudy') {
      const treatmentId = documentReferenceId(document, 'treatment');
      const treatment = treatmentId
        ? getDocumentById({
            id: treatmentId,
            srcType: entry.document.srcType,
            srcProjectId: entry.document.srcProjectId,
          })
        : undefined;
      const treatmentSlug = documentStringField(treatment, 'slug');
      const treatmentStatus = documentStringField(treatment, 'status');
      return Boolean(
        slug &&
          documentBooleanField(document, 'consentGiven') === true &&
          documentHasAssetReference(document, 'beforeImage') &&
          documentHasAssetReference(document, 'afterImage') &&
          treatmentSlug &&
          treatmentStatus &&
          PUBLIC_SERVICE_STATUS_SET.has(treatmentStatus) &&
          !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET.has(treatmentSlug),
      );
    }

    if (entry.document.modelName === 'concern') {
      const status = documentStringField(document, 'status');
      return Boolean(slug && status === 'live' && !RETIRED_PUBLIC_CONCERN_SLUG_SET.has(slug));
    }

    if (entry.document.modelName === 'localArea') {
      return Boolean(slug && REVIEWED_PUBLIC_LOCAL_AREA_SLUG_SET.has(slug));
    }

    if (entry.document.modelName === 'service') {
      const status = documentStringField(document, 'status');
      return Boolean(
        slug &&
          status &&
          PUBLIC_SERVICE_STATUS_SET.has(status) &&
          !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET.has(slug),
      );
    }

    if (entry.document.modelName === 'serviceCollection') {
      return Boolean(slug && REVIEWED_PUBLIC_COLLECTION_SLUG_SET.has(slug));
    }

    if (entry.document.modelName === 'costGuide') {
      return Boolean(
        slug &&
          REVIEWED_PUBLIC_COST_GUIDE_SLUG_SET.has(slug) &&
          !RETIRED_COST_GUIDE_SLUG_SET.has(slug),
      );
    }

    if (entry.document.modelName === 'treatmentPackage') {
      const status = documentStringField(document, 'status');
      const hasRouteableService = documentReferenceIds(document, 'servicesIncluded').some(
        (serviceId) => {
          const service = getDocumentById({
            id: serviceId,
            srcType: entry.document.srcType,
            srcProjectId: entry.document.srcProjectId,
          });
          const serviceSlug = documentStringField(service, 'slug');
          const serviceStatus = documentStringField(service, 'status');
          return Boolean(
            serviceSlug &&
              serviceStatus &&
              PUBLIC_SERVICE_STATUS_SET.has(serviceStatus) &&
              !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET.has(serviceSlug),
          );
        },
      );
      return Boolean(
        slug &&
          status === 'live' &&
          VERIFIED_TREATMENT_PACKAGE_SLUG_SET.has(slug) &&
          hasRouteableService,
      );
    }

    if (entry.document.modelName === 'provider') {
      const publicRole =
        documentStringField(document, 'publicRole') ||
        documentStringField(document, 'roleCredential');
      return Boolean(
        slug &&
          documentBooleanField(document, 'showOnWebsite') === true &&
          publicRole?.trim() &&
          documentStringField(document, 'summary')?.trim() &&
          documentHasNonEmptyList(document, 'biography') &&
          documentHasNonEmptyList(document, 'serviceFocus'),
      );
    }

    const status = documentStringField(document, 'status');
    const comparisonServiceIds = ['optionA', 'optionB'].map((optionName) =>
      documentNestedReferenceId(document, optionName, 'service'),
    );
    const comparisonServicesRouteable = comparisonServiceIds.every((serviceId) => {
      if (!serviceId) return false;
      const service = getDocumentById({
        id: serviceId,
        srcType: entry.document.srcType,
        srcProjectId: entry.document.srcProjectId,
      });
      const serviceSlug = documentStringField(service, 'slug');
      const serviceStatus = documentStringField(service, 'status');
      return Boolean(
        serviceSlug &&
          serviceStatus &&
          PUBLIC_SERVICE_STATUS_SET.has(serviceStatus) &&
          !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET.has(serviceSlug),
      );
    });
    return Boolean(
      status === 'live' &&
        slug &&
        REVIEWED_PUBLIC_COMPARISON_SLUG_SET.has(slug) &&
        comparisonServicesRouteable,
    );
  }),
});
