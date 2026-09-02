# PRF Content Architecture — Reviewed Current Routes

**Original keyword study:** 2026-08-10 · **Current route review:** 2026-08-14

The original brief treated search demand as permission to create routes and clinical copy. That is
not the publication rule. Keyword data can prioritize a reviewed page, but it cannot establish a
service, price, provider, protocol, duration, result timeline, treatment comparison, or candidacy
claim.

The current implementation has four distinct public roles. These routes are generated, internally
linked, and covered by the public-integrity suite.

## Current public PRF routes

### `/services/prf/` — topical and injectable overview

This is a substantive decision hub, not a links-only directory. It distinguishes:

- PRF Microneedling: PRF is applied at the skin surface during a 60-minute, $595 consultation with
  Amber Mingione, Licensed Esthetician.
- PRF Under-Eye: a $495 injectable consultation with Diana Morrison, RN; the appointment length is
  confirmed by phone because the reviewed sources do not resolve it consistently.
- PRF Bio-Filler: a 45-minute, $899 injectable consultation with Diana Morrison, RN.

The hub links to both provider profiles and the relevant treatment details. It does not equate PRF
Bio-Filler with another preparation name while the canonical pricing ledger still records that as an
open naming question.

### `/services/prf-injections/` — injectable PRF

This route owns the distinction between PRF Under-Eye and PRF Bio-Filler. Diana Morrison, RN provides
both injectable consultations under written physician protocol and medical direction. It also states
that topical PRF during eligible Microneedling is a different appointment.

### `/services/microneedling/` — Procell and topical PRF

This route owns the Procell Therapies consultation and topical PRF Microneedling distinction. Amber
Mingione, Licensed Esthetician provides these appointments. The public copy must not imply that the
device injects PRF or that Amber performs injectable PRF.

### `/services/prf-under-eyes/` — under-eye detail

This route exists and publishes the reviewed $495 price, Diana Morrison, RN attribution, medical-
direction boundary, topical-versus-injectable distinction, outcome-variance statement, and FAQ. It
does not publish an unresolved duration or link to retired package or comparison routes.

## Retired-route contract

Legacy PRF service, comparison, cost, and package URLs remain one-hop redirects in
`packages/web/netlify.toml`. They are absent from generated discovery surfaces and must not be revived
as link targets or new content assignments. The canonical destinations are the four routes above.

## Content requirements

- Start from the concrete topical-versus-injectable distinction or the exact appointment the reader
  is considering; do not force one headline, answer-box, section count, word count, or FAQ count.
- Use the canonical GlossGenius-backed prices and durations. Omit a duration when the reviewed sources
  conflict.
- Name Amber Mingione, Licensed Esthetician and Diana Morrison, RN only with their verified roles.
- Keep injectable services under the established medical-direction boundary and retain individual-
  outcome variance language.
- Use entity-first service titles. Geographic depth belongs on `localArea` pages; NAP and service-area
  facts may support the service page without turning its H1 into a geo-keyword template.
- Publish only reviewed mechanism, comparison, recovery, candidacy, and outcome statements. Keyword
  volume is not clinical evidence.
- Use real client results only after written website-publication permission is recorded. A missing
  image is not permission to fabricate or substitute a before-and-after.
- Emit typed schema through `src/lib/structuredData.ts`, and publish FAQ schema only for substantive
  questions visible on the page.

## Authoritative implementation evidence

- Prices and appointment names: `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD`
- Reviewed page models: `packages/web/src/lib/skinRenewalServiceEducation.ts`
- Under-eye facts: `packages/web/src/lib/prfUnderEyesFacts.ts`
- Under-eye renderer: `packages/web/src/components/treatment/PrfUnderEyesOverview.astro`
- Redirects: `packages/web/netlify.toml`
- Route and content contracts: `scripts/public-integrity.test.mjs`

The August 2026 search volumes remain useful as prioritization evidence. They do not override these
facts, routes, or publication boundaries.
