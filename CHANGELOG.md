# Changelog

All notable site-elevation work is logged here, newest first. See
`docs/prompts/site-elevation/` for the phased program and `docs/research/` for audit artifacts.

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
