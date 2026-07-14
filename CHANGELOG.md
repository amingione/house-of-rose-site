# Changelog

All notable site-elevation work is logged here, newest first. See
`docs/prompts/site-elevation/` for the phased program and `docs/research/` for audit artifacts.

## 2026-07-13 — Sanity catalog reconciled to GlossGenius (live-data changes)

Published directly to Sanity (buffered from the live static site until this rebuild):
- **Price reconciliation (6 services):** Glo2Facial $185→**$195**, Dermal Fillers $700→**$650**, PRF Injections
  $599→**$495**, IV Hydration $129→**$125**, GLP-1 $349→**$279/mo**, Botox blank→**$14/unit** (+ fixed the
  price stated in each SEO meta). GLP-1 pending Diana's COGS confirmation.
- **Collection restructure → GlossGenius's 12 categories:** created 7 new collections (Facials, Advanced
  Facials, Microchanneling & Microneedling, Lash Services, Makeup, Enhancements & Add-ons, Acne Bootcamp),
  renamed Injectables & Aesthetics→**Injectables & Bio-Fillers** and Beauty & Enhancements→**Permanent Jewelry**;
  reassigned all 30 services + set providers (old catch-all "Skin Renewal" 19→5).
- **Created 15 missing GG services** with content: the 9 basic facials (Aundrea/Brandy), 3 lash services, 3 makeup.
- **Added `AI Skin Analysis` service** (the evidence-based first step) — full content, Complimentary, in Advanced
  Facials (Amber); compliance-clean (guides a plan, does not diagnose). Coexists with the `/skin-analysis/` singleton page.
- **Removed** standalone Acne Peel + Back Treatment (Face Reality is the $899 program only; unpublished).
- Working files: `docs/research/sanity-services.csv`, `sanity-collections.csv`, `_sanity-collection-restructure.md`.

Still open: the advanced-facial combos + GlowTox (Diana/med-director review) not yet added; makeup `service`
docs coexist with the professional-makeup singleton pages (consolidate later); 3/6-session + acne packages → `treatmentPackage`.

## 2026-07-13 — Go-live prep: memberships REVERTED (deferred), coming-soon → live

Owner deferred memberships to launch the site. Reverted all membership shipping code (deleted
`membership.ts` + `memberships.astro`; removed the schema registration + Studio sidebar entry,
`ALL_MEMBERSHIPS_QUERY`/`Membership` type, Footer link, sitemap + llms entries; restored the
`/memberships/*` `/rose-circle/*` `/plans/*` → `/` 301 redirects). `CLAUDE.md` + compliance doc now
mark memberships **deferred**. Research preserved in `docs/research/memberships*.md`. Flipped
`netlify.toml` `[context.production.environment]` `PUBLIC_COMING_SOON` **true → false** (launch switch;
takes effect on the next production deploy). Gates: `npm run build` web 251 pages + studio green ·
`ve:check` 31 annotated / 0 missing · `/memberships/` absent from `dist`.

**⚠️ Content caveat for launch:** live Sanity prices/services are drifted from the GlossGenius truth
(see `_pricing-catalog.md` §0, `_gaps.md`) — the site will show stale prices/services until Sanity is
reconciled in Studio (separate from code).

## 2026-07-13 — Memberships reinstated (owner decision) [SUPERSEDED — reverted, see entry above]

Owner reversed the 2026-07-07 membership teardown ("bring them back"). Rebuilt the framework
on branch `feat/reinstate-memberships` — **drafts only, nothing published live** (site is also
still coming-soon). Default model: a flat **monthly investment that banks as rollover studio
credit** + perks (compliance-clean "member credit / investment," never "% off / deal").

**Gates:** `npm run build` → web 252 pages (memberships page emitted) + studio green ·
`ve:check` → 32 annotated / 0 missing · new page's `dist` links trailing-slash clean ·
banned-phrase sweep clean (reworded a negated "discount" mention).

### Added / changed
- **Schema:** `packages/studio/schemas/membership.ts` (banked-credit + perks model, `status`
  draft/active, owner-set pricing) — registered in `schemas/index.ts`, added to Studio sidebar.
- **Page:** `packages/web/src/pages/memberships.astro` — Sanity-first (`ALL_MEMBERSHIPS_QUERY`,
  active-only) with on-brand fallback tiers, **no invented prices**, visual-editing annotated,
  journey links (skin-analysis / services / packages) + one call/text CTA.
- **Wiring:** Footer link, `sitemap.xml`, `llms.txt` all include `/memberships/`.
- **Redirects (`netlify.toml`):** removed `/memberships/*→/`; `/rose-circle/*` + `/plans/*`
  now 301 → `/memberships/`.
- **Docs:** `CLAUDE.md` membership section flipped (REMOVED → REINSTATED, status + pending items);
  `docs/COMPLIANCE-COPY-RULES.md` gained the binding membership-framing rule;
  `docs/research/memberships.md` = reinstatement brief + owner decision checklist.
- **Pending Amber:** final tier names/prices/perks, single-vs-per-lane, revive "Rose Circle/Rose
  Pass" names?, recurring-billing rail (Stripe subscriptions vs GlossGenius). Sanity draft-seed of
  the 3 tiers was blocked by the write-permission classifier — Amber to authorize/seed, or publish
  from the page fallbacks.
- **GlossGenius reconciliation (2026-07-13):** Amber provided the live GG catalog
  (`docs/glossgenius_catalog.csv`) — the true system of record. It diverges heavily from local docs + Sanity.
  Added §0 (GG truth + divergence log) to `docs/research/_pricing-catalog.md` and rebuilt
  `memberships-pricing.md` on GG anchors: **basic-facials blocker RESOLVED** (GG prices a 9-facial ladder
  $80–$200); Glo2Facial is **$195** (not $185); **no Brazilian / no series / no memberships** in GG (retired
  those anchors). Recommended **"Facial of the Month"** tiers = real GG prices (Essential $80–$100 · Signature
  $120 · Advanced/Glo2 $195) + IV $185/mo. **Flagged for Amber:** many site-marketed services (BioRePeel,
  corrective microneedling, carboxy, Face Reality bootcamp, ProCell Pro/MD tiers, body treatments) are **not
  bookable in GlossGenius** — GG-vs-website menu reconciliation is a catalog-wide decision. Memory saved:
  GlossGenius = source of truth, Sanity = display middle-man.
- **Canonical service taxonomy (2026-07-13):** Amber provided her intended categorization
  (`Obsidian/…/05-SERVICES/Services.md`) → captured as `docs/research/_service-taxonomy.md`: 12 categories by
  provider (Tox · Dermal Filler · IV Hydration · Wellness & Restoration · Weight Management [Diana]; Advanced
  Facials [Amber, modular microneedling/microchanneling + prep add-ons]; Waxing · Lashes · Permanent Jewelry ·
  Professional Makeup [Aundrea]; Basic Facials [Brandy + Aundrea]), each priced against GG with gaps flagged.
  Clarifies the site isn't aspirational — Amber's advanced-facial + body services are **intended, just not yet
  in GG**. Open items for Amber: assign the 9 GG facials to Brandy vs Aundrea; add the missing advanced/body
  services to GG; confirm carboxy + Face Reality acne (in neither GG nor the taxonomy) are dropped or pending.
  Phase 4: rebuild Sanity `serviceCollection`s to these 12 categories.
- **Diana final prices + 12th category + real membership tiers (2026-07-13):** owner supplied
  `ALL-SERVICES-PRICING.MD` (canonical) + `Diana_Pricing_Reconciliation.xlsx` (recommended-final column).
  Identified the missing 12th category — **PRF Treatments** (Diana's injectable PRF, split out from Dermal
  Filler). Diana now = 6 collections (Tox · Dermal Filler · PRF Treatments · IV Hydration · Wellness Add-Ons ·
  Weight Management), resolving the granularity decision. Applied **final reconciled prices** (higher than GG →
  GG must be updated): IVs $125/$185/$195/$199/$195/$199; Semaglutide **$279**/Tirzepatide **$379** (confirm
  COGS); PRF series $1,295/$1,595; new NAD+ IV 250/500mg $325/$550, Toradol/Zofran $35 (pending Diana);
  permanent-jewelry material tiers ($60–$95). **Membership:** facials tier shelved ("not ready"); Diana's menus
  surfaced the **real tiers — Essentials $99 / Radiance $199 / Luxe $299** to replace the placeholders. Updated
  `_service-taxonomy.md`, `_sanity-collection-restructure.md`, `memberships-pricing.md`.
- **Collection restructure draft + provider data (2026-07-13):** parsed `glossgenius_catalog.numbers` (via
  `numbers-parser`) for the authoritative **provider column** — Aundrea = the 3 "Rose" facials, Brandy = the
  other 6; facial waxing = Aundrea+Brandy, body waxing = Aundrea. Wrote `docs/research/_sanity-collection-restructure.md`:
  target collections mirror the live GG categories, a full migration table for the current 31 services (incl.
  **remove `acne-peel`/`back-treatment`** — Face Reality is a $899 program only; **reprice Sanity to GG**;
  Glo2/GlowTox/combos confirmed as Amber's advanced facials), the one open decision (Diana's lane = 2 GG groups
  vs 5 Obsidian splits), add-on categorization, and the Face Reality page-cluster scope. No Sanity docs changed
  (writes gated) — applies as drafts on approval.
- **Membership pricing research (2026-07-13, extensive):** two parallel agents →
  `docs/research/_pricing-catalog.md` (authoritative per-lane service prices, local-docs = truth,
  drift reconciled) + `docs/research/memberships-economics.md` (banked-credit model, FL Stat. § 501.95
  no-expiry-on-paid-credit constraint, billing-rail options — structure only, no invented prices) →
  synthesized `docs/research/memberships-pricing.md`: **every recommended fee derived from a real menu
  anchor** (Wax $65/mo = one Brazilian; Signature $147.50/mo = the studio's own Series-of-6 committed
  rate; IV $185/mo = one wellness drip), with conservative/standard/premium scenarios. **Hard blocker
  flagged:** Brandy's basic-facials lane is unpriced, so no basic-facial tier can be finalized until
  those services get prices.

## 2026-07-13 — Phase 2: Parallel treatment research

22 parallel research agents → one deep brief per treatment/service/product line in
`docs/research/`, plus the `_index.md` (topic→brief→target-pages matrix, de-duplicated new-page
demand) and `_gaps.md` (consolidated contradictions for Amber). These briefs are the sole content
input for Phases 3–4.

**Briefs (22):** prf-topical · microneedling · microchanneling · procell · glo2facial · biorepeel ·
dermaplaning · carboxy-therapy · neurotoxins · dermal-fillers · prf-injections-ezgel · iv-hydration
(+ routine-IV case) · glp-1 · enzyme-exfoliation · hydrodermabrasion · light-peels · waxing ·
permanent-jewelry · professional-makeup · ai-skin-analysis · face-reality-acne-program · product-lines.

**Biggest cross-cutting gaps (see `_gaps.md`):** Sanity prices lag local docs on nearly every priced
service (GLP-1 $349→$225, IV $129→$100, fillers $700→$650, PRF injections $599→$495/$595) + phantom
brands (Restylane, Dysport); two whole lanes unbuilt in Sanity (Brandy's basic facials; Amber's
carboxy) + empty makeup singletons + 0 `shopBrand` docs; ~15 near-duplicate "glow/texture/dullness"
concern slugs to collapse to 2–3; package cadence drift (master menu "Series of 3/6" vs Sanity empty
"Series of 4"). Several empty/stub local docs named as "primary" sources. Membership references in
older docs are reframed as **rebuild assets**, not deletions (per the reinstatement above).

## 2026-07-12 — Phase 1: Audit & Perfect

Full read-only audit (6 parallel agents) + fixes across content, compliance, CTAs/linking,
technical, and structured data. Artifacts: `docs/research/_site-inventory.md`,
`docs/research/_audit-report.md`, `docs/research/_prf-source-library.md`.

**Gates:** `astro check` 0/0/0 · `npm run build` 252 pages (web + studio green) ·
`ve:check` 0 missing · `dist/**` trailing-slash sweep clean · banned-phrase sweep clean in code.

### Fixed
- **Build-breaker law:** converted `return Astro.redirect()` → `throw` in 9 prerendered pages
  (services/collections/cost/compare/areas/results/concerns/blog/packages `[slug]`).
- **Trailing-slash law:** ~44 slash-less internal links → 0, across 4 shared components + ~20
  templates (incl. `faq` `routeFor`, `services/[slug]` parent-service ternary).
- **JSON-LD law:** removed all 4 hand-rolled inline schemas; added `product()`, `blogPosting()`,
  `itemList()` builders + `service()` `catalog` option; fixed `localBusiness()` `@id` collision;
  fixed blog breadcrumb slash + "House of Rose" → "House of Rose Aesthetics".
- **JSON-LD coverage:** added schema to `concerns/[slug]`, both collections pages, `privacy-policy`
  (were emitting none).
- **Orphans → 0:** wired `/packages/**` + `/services/collections/**` into the Footer (Packages,
  Shop, Collections, Pricing Guides, Compare Treatments).
- **Dead-end:** rebuilt `/results/` empty state with forward links + contextual CTA.
- **NAP/compliance (code):** `Ste+9`→`Unit+9` map links; removed llms med-spa denial; fixed mangled
  `$From $45` prices; SMS/rent-a-room/privacy "discount/guaranteed/No-utilities" wording; www→non-www
  cards; `EST`→`ET`; opt-out typo.
- **A11y:** mobile-menu `aria-expanded`/`aria-controls`; checkout error `role="alert"`.
- **Content P0:** `services/[slug]` "Details coming soon." fallback → tagline.

### Added
- `/cost/` (Pricing hub) and `/compare/` (Compare hub) index pages — remove breadcrumb 404s, make
  the cost/compare page types reachable; wired into Footer + `sitemap.xml`.
- `sitemap.xml`: professional-makeup trio + all shop product pages + the two new hubs.

### Follow-ups for Amber (see `docs/research/_audit-report.md` §C)
- Publish 5 Sanity content fixes (rentARoom ×3, privacyPolicy, punta-gorda area FAQ) — banned
  "guaranteed"/"discount" wording + "Ste 9"→"Unit 9" NAP drift in published content.
- Decide on retail product names carrying §2 terms (manufacturer names: Age-Defying / Anti-Aging /
  Age Delay / Phyto Stem Cells).
- Confirm "Glass Skin Micro-Tox" provider lane on Amber's card (reads as Diana's injectables lane).
- Deferred to Phase 3: CTA de-duplication + cross-template journey loops.
