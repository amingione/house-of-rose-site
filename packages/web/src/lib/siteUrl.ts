const FALLBACK_SITE_URL = 'https://houseofrosefl.com/';

/**
 * Resolve the canonical base URL (no trailing slash) for build-time routes
 * that emit absolute URLs (sitemap, llms.txt, llms-full.txt).
 *
 * `site` comes from Astro config (`PUBLIC_SITE_URL`). When it is unset — e.g. a
 * local build or a staging deploy missing the env var — we fall back to the
 * production URL but emit a warning so the misconfiguration is visible in build
 * and CI logs instead of silently shipping production URLs from the wrong host.
 */
export function resolveBaseUrl(site: URL | undefined, context: string): string {
  if (!site) {
    console.warn(
      `[${context}] PUBLIC_SITE_URL is not set — falling back to ${FALLBACK_SITE_URL}. ` +
        `Absolute URLs will point at production regardless of the current deploy environment.`
    );
  }

  return (site?.toString() ?? FALLBACK_SITE_URL).replace(/\/$/, '');
}
