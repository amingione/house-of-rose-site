/**
 * Concern routes retired at the edge and excluded from public discovery.
 *
 * Their Sanity records remain available for reconciliation without becoming
 * generated routes or Visual Editor page entries.
 */
export const RETIRED_PUBLIC_CONCERN_SLUGS = [
  'hair-thinning',
  'enlarged-pores',
  'ingrown-hair',
] as const;
