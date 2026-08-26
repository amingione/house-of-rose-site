/**
 * Legacy service slugs retained as an explicit denylist after the Sanity
 * service model was retired. No current treatment/service documents live in
 * Sanity. Keep these slugs unavailable so backups, archives, stale links, or
 * non-service references cannot regenerate public routes.
 */
export const UNAVAILABLE_PUBLIC_SERVICE_SLUGS = [
  'microneedling-body',
  'neck-decollete-extension',
  'ez-gel-bio-filler',
  'glo2facial-prf',
  'glo2facial-procell-md',
  'glo2facial-procell-pro',
  'prf-fibrin-veil',
  'wellness',
  // Retired from the website entirely 2026-08-25 (Amber). The URL is also a
  // forced 404 in netlify.toml so search engines drop it.
  'permanent-jewelry',
] as const;
