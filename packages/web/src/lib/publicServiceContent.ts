/**
 * Published Sanity service records that are not verified as current
 * GlossGenius offerings.
 *
 * Keep the records available for reconciliation without generating public
 * service routes or Visual Editor page entries.
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
