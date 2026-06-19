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
  useCdn: true,
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
