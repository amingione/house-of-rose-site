/**
 * Cost-guide routes backed by reviewed public cost facts.
 *
 * Other Sanity records remain available for reconciliation without becoming
 * generated routes or Visual Editor page entries.
 */
export const REVIEWED_PUBLIC_COST_GUIDE_SLUGS = [
  'biorepeel-cost-punta-gorda',
  'botox-cost-punta-gorda',
  'dermal-fillers-cost-punta-gorda',
  'forma-cost-punta-gorda',
  'ipl-photofacial-cost-punta-gorda',
  'microneedling-cost-punta-gorda',
  'morpheus8-cost-punta-gorda',
] as const;

/** Historical cost routes that must remain unavailable even if a record persists. */
export const RETIRED_COST_GUIDE_SLUGS = [
  'procell-microchanneling-cost-punta-gorda',
  'prf-injections-cost-punta-gorda',
  'prf-microneedling-cost-punta-gorda',
] as const;
