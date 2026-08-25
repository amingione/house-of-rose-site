# Service page redesign — PRF pilot

Status: approved for implementation planning
Date: 2026-08-25
Pilot service: `/services/prf/` (Platelet-Rich Fibrin)

## Context

House of Rose's current `/services/[slug].astro` template lists services and their
child "Treatments" as plain card grids. Amber wants service pages to sell the
treatment, not catalog it: explain what the treatment is, explain its benefits,
show real before/afters, and interlink the different ways a treatment is
delivered through persuasive, humanized prose — never a robotic listing of
internal appointment names (e.g. `"Dermaplaning — Facial (standalone)"`, found
live in `dermaplaningEducation.ts:17`, is the pattern to avoid).

The site already has most of the underlying skeleton this needs: a
`kind: 'hub' | 'treatment' | 'standalone'` model in `serviceCatalog.ts` with
parent → children relationships, an existing `ServiceEducation` content system,
and verified PRF facts/menu content in `skinRenewalServiceEducation.ts`. This is
a restructuring and content-depth problem, not a data-model-from-scratch problem.

PRF is the pilot because it is already a `kind: 'hub'` with two real children
(`prf-under-eyes`, `prf-injections`) and because verified source material already
exists:
- `docs/GOVERNANCE/internal_only/research/PRF/prf-topical.md`
- `docs/GOVERNANCE/internal_only/research/PRF/prf-injections-ezgel.md`
- `docs/GOVERNANCE/internal_only/research/_prf-source-library.md`
- `docs/GOVERNANCE/internal_only/services/Diana/PRF_Treatment_Guide_House_of_Rose.pdf`
- `docs/GOVERNANCE/internal_only/services/Diana/PRF_Brochure_House_of_Rose.pdf`
- `docs/GOVERNANCE/internal_only/services/Diana/PRF_Pricing_House_of_Rose.pdf`
- `docs/GOVERNANCE/internal_only/services/Diana/House_of_Rose_Injectable_PRF_Pricing.pdf`
- `packages/web/public/images/before-after/PRF/prf-undereyes-ezgel.png`

## Goals

1. Rebuild the PRF hub page (`/services/prf/`) as a persuasive, benefit-led page
   that explains the treatment, explains its benefits, shows a real before/after,
   and interlinks its delivery methods (microneedling, PRF Bio-Filler, PRF
   Under-Eye) as hover-underlined links embedded in prose — not a bare card grid
   as the only presentation.
2. Add a floating, persistent "Book Now" element to every `/services/[slug]/`
   page (not just PRF) that resolves to the most specific verified GlossGenius
   booking surface for that exact page.
3. Remove two redundant top-level tiles from `/services/` by correcting a data
   mismatch (`injectables`, `dermal-fillers` already have the right `parentSlug`
   but the wrong `kind`).
4. Establish the reusable content shapes (benefits list, inline delivery-link
   prose) that later pilots (Microneedling, etc.) will reuse — without building
   those later pilots now.

## Non-goals (explicitly deferred)

- Rewriting every other service page. Only PRF ships fully today; the template
  and content-shape changes are reusable, but no other page's copy changes.
- Microneedling's cross-collection "delivery mesh" (Procell, Morpheus8,
  Morpheus8 Resurfacing, stretch marks, acne scars). That needs a relationship
  type that crosses `collectionSlug` boundaries and is real design work on its
  own — next pilot's problem, not this one.
- Consolidating InMode (Morpheus8/Forma/Lumecca) or Facials-collection majors
  (BioRePeel/Glo2Facial/Dermaplaning/Microneedling) into fewer top-level items.
  Amber confirmed these should stay separate; only the `injectables` /
  `dermal-fillers` kind mismatch gets fixed.
- Fixing `dermaplaningEducation.ts`'s `"(standalone)"` / `"(Add-On)"` naming.
  Confirmed as a known example of the pattern to avoid, deferred to a separate
  cleanup pass.
- A GlossGenius category-scoped booking URL. Not verified to exist; the floating
  button falls back to the existing general GlossGenius menu instead (see
  below).

## Design

### 1. PRF hub page section order

Replaces the current section order for `slug === 'prf'` only (other pages using
`[slug].astro` are unaffected except where a change below is template-wide, i.e.
#2 and #3).

1. **Hero** — unchanged (title, tagline, primary Book CTA, hero image).
2. **What it is** — existing `ServiceEducation` paragraphs
   (`whatItIs` / `whereItFits` from `skinRenewalServiceEducation.ts`'s `'prf'`
   entry), reviewed and rewritten for persuasive, humanized tone per the
   Public-Facing Copy Law already binding in `CLAUDE.md`. No new component.
3. **Benefits** (new) — a short, honest, benefit-led list distinct from "what it
   is." Sourced from the PRF research docs and treatment guide/brochure listed
   above; not invented. New optional field on `ServiceEducationContent` (see
   Data model changes).
4. **Delivered a few ways** (new) — one short intro paragraph naming the three
   verified delivery paths, each rendered as an inline, hover-underlined link:
   - "microneedling" → `/services/microneedling/`
   - "PRF Bio-Filler" (lips, lines, wrinkles) → `/services/prf-injections/`
   - "injectable PRF under the eyes" → `/services/prf-under-eyes/`

   Followed immediately by the **existing** "Treatments" card grid (unchanged
   markup) for the two owned children, so there's still a clean click-through
   with its own booking button per card.
5. **Before & after** (new for PRF) — reuse the existing `TreatmentEvidence`
   component and `evidenceMedia` field (already defined on `Service` /
   `EvidenceMedia` in `serviceCatalog.ts`, already rendered by
   `[slug].astro`). Add one `evidenceMedia` entry to the `'prf'`
   `ServiceRecord` pointing at
   `images/before-after/PRF/prf-undereyes-ezgel.png`, **only if** its
   source/consent can be verified from the research docs (`usageApproved` and,
   for `kind: 'before-after'`, `consentConfirmed` must both be true per the
   existing `TreatmentEvidence` filter — this is a real gate, not a formality).
   If consent can't be verified, this section is skipped for now rather than
   published with an unverified image, and that gets flagged back to Amber.
6. Provider/scope, related services, comparisons, FAQ, final CTA — unchanged.

### 2. New content shapes on `ServiceEducationContent`

`packages/web/src/lib/serviceEducation.ts` gets two new optional fields:

```ts
export interface ServiceEducationContent {
  // ...existing fields unchanged...
  benefits?: readonly {
    label: string;
    text: string;
  }[];
  deliveryIntro?: {
    heading?: string;
    /**
     * Rendered as one flowing paragraph. Plain strings render as text;
     * objects render as inline, hover-underlined links. Keeps prose authored
     * as data (safe, no HTML strings) while still reading as one sentence.
     */
    segments: readonly (string | { label: string; href: string })[];
  };
}
```

`ServiceEducation.astro` gets two new conditional blocks for these fields,
styled consistently with the existing `distinctions` and `menu` blocks
(gold-metal hairline dividers, serif headings, same type scale). The
`deliveryIntro` link style: gold-tinted underline that only appears on
`:hover`/`:focus-visible` — gold stays an intentional accent used sparingly
elsewhere in the site, not a decorative default, and this link style follows
that same restraint.

`skinRenewalServiceEducation.ts`'s `'prf'` entry gains `benefits` and
`deliveryIntro` data; `serviceEducation.ts`'s PRF branch passes them through.

### 3. Floating Book Now button

New component: `packages/web/src/components/FloatingBookButton.astro`.
Included once in `[slug].astro`, rendered on every service page (hub,
treatment, and standalone alike). Appears after the hero is scrolled past
(simple `IntersectionObserver` or scroll-threshold toggle, no new client
framework — matches "no React islands" / static-Astro convention).

New resolver in `packages/web/src/lib/booking.ts`:

```ts
export const resolveFloatingBookingHref = (
  service: ServiceBookingSource,
): { href: string; external: boolean } =>
  isVerifiedGlossGeniusBookingUrl(service.bookingUrl)
    ? { href: service.bookingUrl as string, external: true }
    : { href: GLOSSGENIUS_SERVICES_URL, external: true };
```

This intentionally differs from `resolveServiceBooking()`: the existing
resolver falls back to "Call to discuss" when there's no verified URL, which is
right for the hero/final CTA (those already offer a phone path via the
secondary button). The floating button's whole purpose is a fast, always-GlossGenius
path while scrolling, so it never falls back to phone — on a hub page like PRF
(no `bookingUrl` of its own) it goes to the general GlossGenius menu instead,
where the category groups its own listings.

### 4. Directory thinning (data-only fix)

In `packages/web/src/lib/serviceCatalog.ts`'s `SERVICE_RECORDS`:
- `injectables` (Neurotoxin Injections): `kind: 'standalone'` → `kind: 'treatment'`
- `dermal-fillers`: `kind: 'standalone'` → `kind: 'treatment'`

Both already carry `parentSlug: 'injectables-bio-fillers'` and already render
inside that hub's "Treatments" section (that logic keys off `parentSlug`, not
`kind`). `PUBLIC_DIRECTORY_SERVICES` already filters out `kind: 'treatment'`,
so this removes their duplicate top-level tiles from `/services/` with no
other code change. Verified via `grep` that `service.kind` is not consumed
anywhere else in the codebase besides this one filter.

## Content verification requirements (Rule #0)

Before writing final PRF copy:
- Cross-check `whatItIs` / `whereItFits` / benefits claims against
  `research/PRF/prf-topical.md`, `research/PRF/prf-injections-ezgel.md`, and
  the Diana PDFs listed above — cite which source backs each claim.
- Verify the before/after image's consent/usage status before adding it to
  `evidenceMedia`. If unconfirmed, skip the section rather than guess.
- No pricing renders anywhere on the page (existing binding rule; the page
  already suppresses `displayServicePrice`/`reviewedPriceRange` — no change
  needed there, just don't reintroduce it).
- No "(standalone)" / "(add-on)" style internal labels in new copy.
- Run `scripts/public-integrity.test.mjs` after the build to confirm no
  dollar amounts leaked onto the page.

## Testing / verification plan

- `npm run build` (or `npm run dev:web` + manual check) — PRF page renders all
  six sections, floating button appears after hero scroll, hover-underline
  works on the three delivery links, before/after image renders only if
  consent was confirmed.
- `/services/` directory — confirm `injectables` and `dermal-fillers` tiles no
  longer appear at top level, and still appear correctly inside the
  Injectables & Bio-Fillers hub page's "Treatments" section.
- `scripts/public-integrity.test.mjs` and
  `scripts/treatment-price-publication-contract.test.ts` — must still pass.
- Existing Stackbit/visual-editing coverage gate (`npm run ve:check`) — new
  `FloatingBookButton.astro` and any newly-annotated fields should not need
  visual-editing annotation (this is Astro-catalog content, not
  Sanity-backed), but confirm the coverage gate doesn't flag the new component
  incorrectly.
