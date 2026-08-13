import type { JsonLd } from './structuredData';
import type {
  TreatmentAftercare,
  TreatmentPriceRange,
} from './treatmentQueries';

/**
 * Treatment-specific structured data.
 *
 * The existing `service()` builder emits the bookable service. This builder
 * adds only treatment facts that map directly to MedicalProcedure properties;
 * it does not synthesize preparation, provider, recovery, or specialty claims.
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
  aftercare?: TreatmentAftercare;
}

/** Schema.org expects MedicalProcedure.followup to be Text. */
function followupText(aftercare?: TreatmentAftercare): string | undefined {
  if (!aftercare) return undefined;
  const steps = [
    ...(aftercare.firstDay ?? []),
    ...(aftercare.firstWeek ?? []),
  ];
  if (steps.length === 0) return undefined;
  return steps.join(' ');
}

export function medicalProcedure(input: MedicalProcedureInput): JsonLd {
  const followup = followupText(input.aftercare);

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${input.url}#procedure`,
    name: input.name,
    ...(input.description && { description: input.description }),
    url: input.url,
    ...(input.image && { image: input.image }),
    procedureType: `https://schema.org/${input.procedureType ?? 'NoninvasiveProcedure'}`,
    ...(input.bodyLocation?.length && { bodyLocation: input.bodyLocation }),
    ...(followup && { followup }),
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
    seller: { '@id': `${new URL('/', input.url).toString()}#business` },
  };
}
