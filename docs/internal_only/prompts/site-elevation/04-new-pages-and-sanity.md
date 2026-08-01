# PHASE 4 — New Informational Pages + Sanity Seeding

Prepend `00-MASTER-PROMPT.md`. Requires Phase 2 briefs and Phase 3 journey infrastructure.
Goal: fill every knowledge gap with pages of the **7 canonical types** — never ad-hoc
shapes. If content doesn't fit a type, extend the type's schema.

## Step 1 — Gap matrix

From `docs/internal_only/research/_index.md` + `_site-inventory.md`, build the coverage matrix: for each
topic × page type (service, cost, comparison, local, results, concern, guide), mark
exists / thin / missing. Prioritize by decision value:

1. **Comparisons** (highest leverage — this is where "which is best for me" lives):
   PRF topical vs Procell microchanneling vs microneedling · Glo2Facial vs
   hydrodermabrasion · BioRePeel vs light peels · Daxxify vs other neurotoxins ·
   PRF EZ-Gel vs dermal filler · IV hydration vs oral supplementation ·
   basic facial vs advanced facial (who needs which)
2. **Cost guides** for every advanced treatment lacking one (ranges from local docs only)
3. **Concern pages** (`/concerns/`) for every concern surfaced in the briefs' concern
   mapping — each routing to its treatment options *with* the "which is right for me" logic
4. **Guides** (`/guides/`) for deep educational pieces (e.g. "How PRF is drawn, spun, and
   used", "The Face Reality acne program, week by week") — model on the existing
   `guides/microchanneling-prf.astro` but Sanity-backed
5. **Local authority** pages for the highest-value treatment × area combos

## Step 2 — Schema & routes

- Reuse existing doc types (`service`, `costGuide`, `comparison`, `concern`, `localArea`,
  `caseStudy`, `blogPost`, `treatmentPackage`) before inventing anything.
- If a guide doc type is needed, define it in `packages/studio/schemas/` with `seo` + `faq`
  objects, register it, add the route with `npm run ve:new`, add JSON-LD builder in
  `structuredData.ts` (Article/FAQPage as appropriate), update `CONTENT-MODEL-MAP.md` and
  the routes table in `CLAUDE.md`, and keep `stackbit.config.ts` PAGE_ROUTES in sync.
- Deploy schema changes (studio deploy flow) before seeding content that uses them.

## Step 3 — Write & seed

- Author content **from the Phase 2 briefs only** — answer-first, entity-clear, locally
  grounded, compliance-clean, FAQ blocks included, unique closing "Where to next" edges
  registered in `journeys.ts`.
- Seed via a typed script (`scripts/seed-elevation.ts`, `@sanity/client`,
  `SANITY_API_WRITE_TOKEN` from `.env.local`) creating **drafts only**. Idempotent:
  deterministic `_id`s, re-runnable without duplication.
- Every new page: `data-sb-*` annotations, JSON-LD via builders, trailing-slash links,
  registered journey edges (no orphans — at least two inbound edges each).
- Emit `docs/internal_only/research/_publish-checklist.md`: each draft with its route, a one-line summary,
  and anything Amber must verify (especially prices and provider attribution) before
  publishing.

## Deliverables

- Coverage matrix (`docs/internal_only/research/_coverage-matrix.md`)
- New/extended schemas deployed; routes live with fallback rendering for unpublished drafts
  handled gracefully (page builds even if draft unpublished — hide, don't crash)
- Seed script + drafts in Sanity + publish checklist
- `CONTENT-MODEL-MAP.md`, `CLAUDE.md` routes, `stackbit.config.ts`, sitemap all updated
