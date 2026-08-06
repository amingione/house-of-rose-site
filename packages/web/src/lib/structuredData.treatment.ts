import {
  BUSINESS_SERVICE_AREAS,
  LOCAL_BUSINESS,
  type JsonLd,
} from './structuredData';
import type {
  TreatmentAftercare,
  TreatmentDowntime,
  TreatmentPriceRange,
  TreatmentProviderScope,
} from './treatmentQueries';

/**
 * Treatment-specific structured data.
 *
 * The existing `service()` builder emits a generic `Service` node with a
 * `minPrice` only. For a treatment page that is under-specified: Google's
 * local-intent surfaces respond to `MedicalProcedure` (procedure type,
 * preparation, followup) and to an `Offer` carrying a real low/high range.
 *
 * These are emitted *alongside* the existing Service + BreadcrumbList + FAQPage
 * nodes, not instead of them. Page-scoped `@id` values keep Google from merging
 * the treatment node with BaseLayout's site-wide business node.
 */

export interface MedicalProcedureInput {
  name: string;
  description?: string;
  url: string;
  image?: string;
  /** How the procedure is delivered. Maps to schema.org MedicalProcedureType. */
  procedureType?: 'NoninvasiveProcedure' | 'PercutaneousProcedure';
  bodyLocation?: string[];
  downtime?: TreatmentDowntime;
  aftercare?: TreatmentAftercare;
  providerScope?: TreatmentProviderScope;
  priceRange?: TreatmentPriceRange;
  bookingUrl?: string;
}

function areaNodes(): JsonLd[] {
  return BUSINESS_SERVICE_AREAS.map((name) => ({ '@type': 'Place', name }));
}

/** Aftercare rendered as a followup instruction, which is the field Google reads. */
function followupNode(aftercare?: TreatmentAftercare): JsonLd | undefined {
  if (!aftercare) return undefined;
  const steps = [
    ...(aftercare.firstDay ?? []),
    ...(aftercare.firstWeek ?? []),
  ];
  if (steps.length === 0) return undefined;
  return {
    '@type': 'MedicalEntity',
    name: 'Aftercare',
    description: steps.join(' '),
  };
}

function preparationNode(providerScope?: TreatmentProviderScope): string | undefined {
  if (!providerScope) return undefined;
  return providerScope.consultRequired === false
    ? undefined
    : 'A consultation is completed before treatment to confirm candidacy.';
}

export function medicalProcedure(input: MedicalProcedureInput, siteUrl: string): JsonLd {
  const followup = followupNode(input.aftercare);
  const preparation = preparationNode(input.providerScope);

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${input.url}#procedure`,
    name: input.name,
    ...(input.description && { description: input.description }),
    url: input.url,
    ...(input.image && { image: input.image }),
    procedureType: {
      '@type': 'MedicalProcedureType',
      name: input.procedureType ?? 'NoninvasiveProcedure',
    },
    ...(input.bodyLocation?.length && { bodyLocation: input.bodyLocation }),
    ...(preparation && { preparation }),
    ...(followup && { followup }),
    ...(input.downtime && {
      // No first-class downtime property exists; expected-recovery text belongs
      // in howPerformed so it is at least machine-readable rather than dropped.
      howPerformed: input.downtime.summary,
    }),
    performer: {
      '@type': 'MedicalBusiness',
      '@id': `${siteUrl}#business`,
      name: LOCAL_BUSINESS.name,
    },
    availableService: {
      '@type': 'MedicalTherapy',
      name: input.name,
    },
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: 'Dermatology',
    },
    areaServed: areaNodes(),
  };
}

/**
 * Offer node carrying a genuine low/high range. Google discards `Offer` without
 * a price, and shows a range when `lowPrice`/`highPrice` are both present.
 *
 * `bookingUrl` must already be a *verified* GlossGenius booking URL — pass it
 * through `isVerifiedGlossGeniusBookingUrl()` at the call site first, the same
 * way `serviceJsonLd()`'s `offerUrl` is computed in `[slug].astro`. An
 * unverified or missing URL simply omits `url` rather than inventing one:
 * there is no generic `/book` route on GlossGenius, only per-service tokens.
 */
export function treatmentOffer(
  input: { url: string; name: string; priceRange: TreatmentPriceRange; bookingUrl?: string },
): JsonLd {
  const { priceRange } = input;
  const hasRange = priceRange.maxPrice != null && priceRange.maxPrice !== priceRange.minPrice;

  return {
    '@context': 'https://schema.org',
    '@type': hasRange ? 'AggregateOffer' : 'Offer',
    '@id': `${input.url}#offer`,
    name: input.name,
    priceCurrency: 'USD',
    ...(hasRange
      ? { lowPrice: priceRange.minPrice, highPrice: priceRange.maxPrice }
      : { price: priceRange.minPrice }),
    availability: 'https://schema.org/InStock',
    ...(input.bookingUrl && { url: input.bookingUrl }),
    seller: {
      '@type': 'MedicalBusiness',
      name: LOCAL_BUSINESS.name,
    },
  };
}
