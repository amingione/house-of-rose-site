/**
 * Treatment-page projection + types.
 *
 * Kept in its own module so `queries.ts` (38 KB) takes a two-line change:
 *
 *   import { TREATMENT_PAGE_FIELDS } from './treatmentQueries';
 *   // ...inside SERVICE_BY_SLUG_QUERY, before the closing brace:
 *   ${TREATMENT_PAGE_FIELDS}
 *
 * and `Service` extends `TreatmentPageFields`.
 */

export const TREATMENT_PAGE_FIELDS = /* groq */ `
  downtime {
    level,
    summary,
    returnToMakeup,
    returnToExercise,
    timeline[] { _key, window, expectation }
  },
  aftercare {
    intro,
    firstDay,
    firstWeek,
    avoid,
    ongoing
  },
  providerScope {
    performedBy,
    medicalDirection,
    credentialPoints,
    consultRequired,
    disclaimer
  },
  priceRange {
    minPrice,
    maxPrice,
    unit,
    note
  },
  whyQualified
`;

export type DowntimeLevel = 'none' | 'minimal' | 'moderate' | 'significant';
export type PerformedBy = 'rn' | 'esthetician' | 'either';
export type PriceUnit = 'session' | 'unit' | 'syringe' | 'area' | 'month' | 'program';

export interface DowntimeMilestone {
  _key: string;
  window: string;
  expectation: string;
}

export interface TreatmentDowntime {
  level: DowntimeLevel;
  summary: string;
  returnToMakeup?: string;
  returnToExercise?: string;
  timeline?: DowntimeMilestone[];
}

export interface TreatmentAftercare {
  intro?: string;
  firstDay?: string[];
  firstWeek?: string[];
  avoid?: string[];
  ongoing?: string[];
}

export interface TreatmentProviderScope {
  performedBy: PerformedBy;
  medicalDirection?: boolean;
  credentialPoints: string[];
  consultRequired?: boolean;
  disclaimer: string;
}

export interface TreatmentPriceRange {
  minPrice: number;
  maxPrice?: number;
  unit: PriceUnit;
  note?: string;
}

/** Mixed into the existing `Service` interface in queries.ts. */
export interface TreatmentPageFields {
  downtime?: TreatmentDowntime;
  aftercare?: TreatmentAftercare;
  providerScope?: TreatmentProviderScope;
  priceRange?: TreatmentPriceRange;
  whyQualified?: string[];
}

// ─── Display helpers ──────────────────────────────────────────────────────────

const DOWNTIME_LABELS: Record<DowntimeLevel, string> = {
  none: 'No downtime',
  minimal: 'Minimal downtime',
  moderate: 'Moderate downtime',
  significant: 'Planned downtime',
};

export function downtimeLabel(level: DowntimeLevel): string {
  return DOWNTIME_LABELS[level];
}

const PERFORMED_BY_LABELS: Record<PerformedBy, string> = {
  rn: 'Registered nurse',
  esthetician: 'Licensed esthetician',
  either: 'Registered nurse or licensed esthetician',
};

export function performedByLabel(performedBy: PerformedBy): string {
  return PERFORMED_BY_LABELS[performedBy];
}

const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  session: 'per session',
  unit: 'per unit',
  syringe: 'per syringe',
  area: 'per area',
  month: 'per month',
  program: 'program',
};

export function formatPriceRange(range: TreatmentPriceRange): string {
  const unit = PRICE_UNIT_LABELS[range.unit];
  const money = (n: number) =>
    Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : `$${n.toFixed(2)}`;

  if (range.maxPrice != null && range.maxPrice !== range.minPrice) {
    return `${money(range.minPrice)}–${money(range.maxPrice)} ${unit}`;
  }
  return `From ${money(range.minPrice)} ${unit}`;
}

