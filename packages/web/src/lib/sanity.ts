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

/**
 * CDN vs live API — decided 2026-07-23 after the `plan_limit_reached` build outage.
 *
 * The plan's "API requests" quota (uncached api.sanity.io) was exhausted mid-cycle
 * (see docs/SANITY-API-USAGE-AUDIT.md), which hard-failed Netlify builds. CDN
 * requests (apicdn.sanity.io) draw from a separate, much larger quota, so builds
 * now default to the CDN and keep deploying even when the live-API quota is gone.
 *
 * History: useCdn was previously forced to false because freshly published docs
 * (packages, memberships, plans) didn't appear in webhook-triggered rebuilds until
 * the CDN cache expired. If a build ever ships stale content again, redeploy a few
 * minutes after publishing — or force a fresh-data build with SANITY_USE_CDN=false
 * (Netlify env var or `SANITY_USE_CDN=false npm run build`) instead of reverting
 * this default.
 */
const useCdn = import.meta.env.SANITY_USE_CDN !== 'false';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION,
  useCdn,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Type-safe GROQ fetch helper.
 * Use for all data fetching at build time (SSG) or in Astro component front-matter.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
