/**
 * Resolve the canonical base URL (no trailing slash) for build-time routes
 * that emit absolute URLs (sitemap, llms.txt, llms-full.txt).
 *
 * `site` comes from Astro config (`PUBLIC_SITE_URL`). When it is unset the
 * build fails immediately so misconfiguration is caught in CI rather than
 * silently shipping production absolute URLs from the wrong host.
 */
export function resolveBaseUrl(site: URL | undefined, context: string): string {
  if (!site) {
    throw new Error(
      `[${context}] PUBLIC_SITE_URL is not set. ` +
        `Set the environment variable so absolute URLs are correct for this deploy environment.`
    );
  }

  return site.toString().replace(/\/$/, '');
}
