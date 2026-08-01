# PHASE 1 — Audit & Perfect Everything Already Built

Prepend `00-MASTER-PROMPT.md`. Goal: everything that already exists becomes flawless before
anything new is added.

## Step 1 — Re-inventory (don't trust the tables)

The routes table in `CLAUDE.md` is stale. Walk `packages/web/src/pages/**` and
`packages/studio/schemas/**` and build the real inventory — it includes at least: `blog/`,
`concerns/[slug]`, `guides/`, `packages/` (`treatmentPackage`), `checkout`, `skin-analysis`,
plus everything in the CLAUDE.md table. Emit `docs/internal_only/research/_site-inventory.md`: every
route, its data source (Sanity doc type or static), its JSON-LD, its CTAs, and its outbound
internal links.

## Step 2 — Parallel audit agents

Launch subagents in parallel, one per area, each returning findings as
`P0 broken · P1 wrong · P2 weak · P3 polish`:

1. **Content quality** — every page vs the AEO rules: answer-first opening? entity-clear?
   locally grounded? honest pricing? thin sections? placeholder/fallback copy still live?
2. **Compliance** — grep every page + Sanity-seeded copy against
   `docs/internal_only/COMPLIANCE-COPY-RULES.md` §2 banned phrases; flag membership/retired-brand-term
   ("Rose Pass", "Rose Circle", "Rose Rewards", "Rose Method") and botanical-name leakage;
   verify NAP everywhere (phone digits, Unit 9, 33950, info@).
3. **CTA & linking** — count CTA label reuse across pages; list pages that dead-end (no
   forward journey link); list orphan pages (nothing links in); list non-trailing-slash
   inner links.
4. **Technical** — TS strict violations, `any`, inline JSON-LD, GROQ outside `queries.ts`,
   missing `data-sb-*` annotations, images without dimensions/alt, `Astro.redirect` in
   prerendered pages, accessibility (heading order, contrast per `docs/COLOR-CONTRAST.md`,
   focus states, ARIA on interactive components).
5. **Structured data** — every content page against its JSON-LD contract in
   `CONTENT-MODEL-MAP.md`; validate `LOCAL_BUSINESS` mirrors `siteSettings`.

## Step 3 — Fix

Fix all P0/P1 directly. Fix P2 where it doesn't collide with Phases 3–4 (leave CTA-label
rewrites for Phase 3 unless broken). Batch P3 into a final polish commit.

## Deliverables

- `docs/internal_only/research/_site-inventory.md`
- `docs/internal_only/research/_audit-report.md` (findings + what was fixed vs deferred-to-phase)
- All fixes committed; definition-of-done checks pass.
