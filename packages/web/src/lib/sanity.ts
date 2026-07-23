import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

if (!import.meta.env.SSR) {
  throw new Error('src/lib/sanity.ts is server-only and must not be imported from browser code.');
}

if (import.meta.env.PUBLIC_SANITY_API_READ_TOKEN) {
  throw new Error('SANITY_API_READ_TOKEN must not use the PUBLIC_ prefix.');
}

if (import.meta.env.PUBLIC_SANITY_API_WRITE_TOKEN) {
  throw new Error('SANITY_API_WRITE_TOKEN must not use the PUBLIC_ prefix.');
}

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  // Static site — all GROQ runs at build time, so fetch fresh (non-CDN) data on every
  // build. useCdn:true served a stale snapshot and newly published docs (packages,
  // memberships, plans) failed to appear until the CDN cache expired.
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Build-time query dedup cache.
 *
 * Why: the 2026-07 Sanity usage audit (docs/SANITY-API-USAGE-AUDIT.md) showed each
 * production build firing ~1,000–1,800 API requests because every page independently
 * re-fetches the same global queries (SITE_SETTINGS_QUERY, ALL_SERVICES_QUERY,
 * ALL_COLLECTIONS_QUERY, …). A static build is one Node process and one snapshot of
 * content, so an identical query+params pair can only ever return the same result —
 * fetch it once and share the promise.
 *
 * Caching the *promise* (not the resolved value) also collapses concurrent duplicate
 * requests when Astro renders pages in parallel.
 *
 * Dev is deliberately uncached: `astro dev` and the Netlify Visual Editor need fresh
 * content on every request so edits appear live.
 */
const buildQueryCache = new Map<string, Promise<unknown>>();

function cacheKey(query: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${JSON.stringify(params[k])}`)
    .join('&');
  return `${query}::${sortedParams}`;
}

/**
 * Type-safe GROQ fetch helper.
 * Use for all data fetching at build time (SSG) or in Astro component front-matter.
 * In production builds, identical query+params calls are deduplicated to a single
 * API request for the lifetime of the build process.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (import.meta.env.DEV) {
    return sanityClient.fetch<T>(query, params);
  }

  const key = cacheKey(query, params);
  let pending = buildQueryCache.get(key);
  if (!pending) {
    pending = sanityClient.fetch<T>(query, params);
    buildQueryCache.set(key, pending);
  }
  return pending as Promise<T>;
}
