# PHASE 4 — New Informational Pages + Sanity Seeding

> **Historical task inventory — do not execute as a prompt.** It does not authorize new pages, schema
> deployment, Sanity writes, or broad content generation.

Historical goal: map proven knowledge gaps to an existing canonical page type. A gap is not evidence
that a new URL is needed; current search intent, source support, and internal-link value must justify it.

## Step 1 — Gap matrix

From `docs/internal_only/research/_index.md` + `_site-inventory.md`, build the coverage matrix: for each
topic × page type (service, cost, comparison, local, results, concern, guide), mark
exists / thin / missing. Prioritize by decision value:

1. **Comparisons** (highest leverage — this is where "which is best for me" lives):
   PRF topical with microneedling · Glo2Facial vs
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
- Schema deployment and external content writes require current explicit authorization. A historical
  gap matrix is not approval to create or publish a page.

## Step 3 — Write & seed

- Use research briefs as factual evidence, not as the only writing input or a voice template. Make the
  page purpose clear early, keep entities and local facts accurate, and include FAQs or contextual links
  only when they add real decision value.
- Do not seed Sanity from this pack. If a currently authorized task requires a draft, use the approved
  workflow and exact current scope; local implementation and review come before any external write.
- Every authorized new page: `data-sb-*` annotations, JSON-LD via builders, trailing-slash links, and
  enough meaningful inbound context to avoid an orphan. Do not create an arbitrary link-count quota.
- If drafts are explicitly authorized, record each route and every unresolved price, provider, or
  clinical fact that must be verified before publication.

## Deliverables

- Coverage matrix (`docs/internal_only/research/_coverage-matrix.md`)
- Any authorized schema or route change validated locally, with unpublished content handled safely
- No Sanity draft, publish, or deploy unless separately authorized in the current task
- `CONTENT-MODEL-MAP.md`, `CLAUDE.md` routes, `stackbit.config.ts`, sitemap all updated
