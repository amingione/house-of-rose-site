/** Shared treatment types and display helpers used by the local Astro service catalog. */

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
  disclaimer: string;
}

/** Public provider identity stored with a local service record. */
export interface TreatmentProviderAttribution {
  _id: string;
  publicName?: string;
  profileSlug?: string | null;
  profileImagePath?: string;
  profileImageAlt?: string;
}

export interface TreatmentPriceRange {
  minPrice: number;
  maxPrice?: number;
  unit: PriceUnit;
  note?: string;
}

/** Optional local treatment-page fields. */
export interface TreatmentPageFields {
  providerScope?: TreatmentProviderScope;
  priceRange?: TreatmentPriceRange;
  whyQualified?: string[];
}

// ─── Display helpers ──────────────────────────────────────────────────────────

const DOWNTIME_LABELS: Record<DowntimeLevel, string> = {
  none: 'None listed',
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

export interface VerifiedProviderIdentity {
  publicName: string;
  profileSlug?: string;
}

const REVIEWED_PROVIDER_IDENTITIES: Readonly<
  Record<string, VerifiedProviderIdentity & { performedBy: Exclude<PerformedBy, 'either'> }>
> = {
  'provider-diana': {
    publicName: 'Diana Morrison, RN',
    profileSlug: 'diana',
    performedBy: 'rn',
  },
  'provider-amber': {
    publicName: 'Amber Mingione, Licensed Esthetician',
    profileSlug: 'amber',
    performedBy: 'esthetician',
  },
  'provider-brandy': {
    publicName: 'Brandy Case, Licensed Esthetician',
    profileSlug: 'brandy',
    performedBy: 'esthetician',
  },
};

/**
 * Returns a named provider only when the identity and licence type agree with
 * the service scope. Exact reviewed House of Rose identities cover the known
 * partial Sanity records; unfamiliar providers must carry a licence-bearing
 * public name before they can replace the safe generic scope label.
 */
export function verifiedProviderIdentity(
  provider: TreatmentProviderAttribution | undefined,
  performedBy: PerformedBy,
): VerifiedProviderIdentity | undefined {
  if (!provider || performedBy === 'either') return undefined;

  const reviewed = REVIEWED_PROVIDER_IDENTITIES[provider._id];
  if (reviewed?.performedBy === performedBy) {
    return { publicName: reviewed.publicName, profileSlug: reviewed.profileSlug };
  }

  const publicName = provider?.publicName?.trim();
  const hasMatchingLicence = performedBy === 'rn'
    ? /,\s*RN$/i.test(publicName ?? '')
    : /,\s*(?:Licensed\s+)?Esthetician$/i.test(publicName ?? '');

  return publicName && hasMatchingLicence
    ? { publicName, profileSlug: provider.profileSlug ?? undefined }
    : undefined;
}

const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  session: 'per session',
  unit: 'per unit',
  syringe: 'per syringe',
  area: 'per area',
  month: 'per month',
  program: 'program',
};

// House of Rose pricing is never public (binding 2026-08-20, see CLAUDE.md
// "Public website pricing is NEVER permitted"). No public renderer calls this
// helper — `PriceRangeBlock.astro` was hardened to never format `priceRange`
// as a dollar amount. Retained only for potential internal/admin tooling;
// do not wire it into any file under `packages/web/src/pages/**`.
export function formatPriceRange(range: TreatmentPriceRange): string {
  const unit = PRICE_UNIT_LABELS[range.unit];
  const money = (n: number) =>
    Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : `$${n.toFixed(2)}`;

  if (range.maxPrice != null && range.maxPrice !== range.minPrice) {
    return `${money(range.minPrice)}–${money(range.maxPrice)} ${unit}`;
  }
  return `${money(range.minPrice)} ${unit}`;
}
