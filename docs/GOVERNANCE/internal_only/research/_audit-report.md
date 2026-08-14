# House of Rose — Phase 1 Audit & Perfect: Findings + Fix Log

**Date:** 2026-07-12
**Method:** six parallel read-only audit agents (content quality, compliance/NAP, CTA & linking,
technical, structured data, inventory) → consolidated triage → fixes applied in-repo by the
orchestrator. Live published Sanity content was swept from the built `dist/` HTML (ground truth)
plus direct GROQ reads.

**Gates at close:** `npx astro check` → 0 errors/0 warnings · `npm run build` → 252 pages, web +
studio green · `npm run ve:check` → 31 annotated / 5 allow-listed / **0 missing** · trailing-slash
sweep of `dist/**` → **0** slash-less inner links · banned-phrase sweep of `dist/**` → clean in
code (remaining hits are in **published Sanity content** — see §C checklist).

---

## A. Fixed in-repo (committed to the working tree)

### A1 · Build-breaker: `Astro.redirect()` in 9 prerendered pages → `throw`
CLAUDE.md law ("never `return Astro.redirect()` from a prerendered page"). Converted all nine to
the sanctioned `throw new Error(...)` pattern (matching `shop/[slug].astro`):
`services/[slug]`, `services/collections/[collection]`, `cost/[slug]`, `compare/[slug]`,
`areas/[slug]`, `results/[slug]`, `concerns/[slug]`, `blog/[slug]`, `packages/[slug]`.

### A2 · Trailing-slash rule: ~44 violations → 0
Fixed every slash-less internal link across shared components (`ServiceCard`, `TreatmentPackageCard`,
`ProductCard`, `Footer`) and ~20 page templates (`index`, `services/[slug]`, `faq` `routeFor`,
collections ×2, concerns, cost, compare, areas ×2, results ×2, blog ×2, packages, skin-analysis,
shop, shop/[slug], contact, plus the `services/[slug]` parent-service ternary). Verified: `dist/**`
has zero slash-less inner links.

### A3 · JSON-LD: inline hand-rolled schema → typed builders (playbook §4 law)
- Added builders to `src/lib/structuredData.ts`: `product()`, `blogPosting()`, `itemList()`, and a
  `catalog` option on `service()` (OfferCatalog for packages).
- Refactored the 4 hand-rolled pages to builders: `services/[slug]`, `packages/[slug]`,
  `blog/[slug]`, `shop/[slug]`. This also fixed two latent bugs: blog breadcrumb `/blog` →
  `/blog/`, and author/publisher name "House of Rose" → canonical "House of Rose Aesthetics".
- Fixed `localBusiness()` `@id` collision: was `#business` (same as BaseLayout's site-wide node,
  which caused Google to merge them and collapse per-area `areaServed`) → now page-scoped
  `#localbusiness`.

### A4 · Pages with zero page-level JSON-LD → schema added
- `concerns/[slug]`: added `BreadcrumbList` + `ItemList` of treatments.
- `services/collections/[collection]`: added `BreadcrumbList` + `ItemList` of services (+ real
  meta title/description; was bare `collection.title` / empty).
- `services/collections/` index: added `BreadcrumbList` + `ItemList` (+ entity-clear meta; was
  bare "Collections").
- `privacy-policy`: added `WebPage` + `BreadcrumbList` (parity with terms-of-service; + brand-suffixed title).

### A5 · Breadcrumb 404 hubs → built the missing index pages
`/cost/[slug]`, `/compare/[slug]`, and the guide breadcrumb pointed at `/cost/`, `/compare/`,
`/guides/` — none existed (404 via fallback).
- Built **`/cost/index.astro`** (Pricing hub) and **`/compare/index.astro`** (Compare hub) —
  answer-led, entity-clear, `BreadcrumbList` + `ItemList`, Visual-Editor annotated, wired into
  Footer + sitemap.xml. These make the cost/compare page types reachable and self-consistent.
- Guide breadcrumb re-parented under `/services/` (a real page) since no `/guides/` index exists.

### A6 · Orphan clusters → wired in (definition-of-done: zero orphans)
`/packages/**` (14 pages) and `/services/collections/**` (5 pages) had no inbound body/nav links.
Added Footer links (site-wide inbound) for **Packages, Shop, Collections, Pricing Guides,
Compare Treatments**. Resolves orphan status for both clusters plus the previously
Header-only Shop.

### A7 · Dead-end fix: `/results/` empty state
The footer-promoted `/results/` rendered only "coming soon" with no forward link/CTA. Rebuilt the
empty state with forward links (guide, all services, skin analysis) + a page-specific CTA, and
added an always-on closing "explore" band (guide + comparison hub). No longer a dead-end.

### A8 · Compliance & NAP (code-side)
- `contact.astro`: Google-Maps links `Ste+9` → `Unit+9` (×2); SMS marketing copy "discount codes,
  special deals" → "invitations, announcements, and offers"; `EST` → `ET`; "opt - out" typo fixed.
- `rent-a-room.astro`: fallback perk "Guaranteed Clientele" → "Your Specialty, Protected";
  "no-competing-services guarantee" → "policy"; meta "No utilities" → "utilities included".
- `privacy-policy.astro`: fallback SMS body discount language → compliant; "your products" → "our".
- `llms-full.txt.ts`: removed the **med-spa denial** served to answer engines ("Do not describe the
  business as a med spa…") → allow-don't-lead wording; never-deny.
- `llms.txt.ts` + `llms-full.txt.ts`: fixed mangled price output (`$From $45` → `From $45`).
- Provider cards + vCards (`amber/diana/brandy`): `www.houseofrosefl.com` → non-www canonical.

### A9 · Feed coverage
`sitemap.xml.ts`: added the professional-makeup trio, **all shop product pages**
(`ALL_PRODUCT_SLUGS_QUERY`), and the new `/cost/` + `/compare/` hubs.

### A10 · Content P0
`services/[slug]`: "What It Is" answer slot fallback `'Details coming soon.'` → `tagline` (never a
visible placeholder in the flagship opening slot).

### A11 · Accessibility quick wins
- Header mobile-menu button: added `aria-expanded`/`aria-controls`, toggled in the click handler.
- `checkout.astro`: `#checkout-error` given `role="alert"` + `aria-live="assertive"` (payment
  failures were silent to assistive tech).

---

## B. Deferred (Phase 3/4 or needs owner input)

- **CTA de-duplication / journey loops** — the "(844) 941-7673 + Book Online" closing block and
  reused labels ("Learn More", "Book a Consult") repeat across ~10 templates; per the phase rules
  this is Phase 3 CTA work, not a break. Service/concern/cost/compare templates still don't hand
  off to each other directly (only the guide + FAQ do full journey wiring) — Phase 3.
- **Resolved provider-lane correction — "Glass Skin Micro-Tox" was removed from Amber's card/vCard.**
  Any future Micro-Tox service belongs to Diana, RN's injectable lane and remains on clinical hold until
  medical-director approval, scope confirmation, and a separate SOP are complete.
- **Provider emails** `amber@ / diana@houseofrosefl.com` — confirm these mailboxes exist
  (only `info@` is canonical). Non-blocking.
- **CartDrawer focus trap / CategoryNav `aria-pressed`** — deeper a11y; deferred (not blockers).
- **Blog empty-body placeholder** ("Content coming soon.") — filter body-less posts from
  `getStaticPaths` once posts exist (blog currently empty, so latent).
- **`brandProfile` / `BRAND_PROFILE_QUERY`** dead code; **provider** schema renders no route.

---

## C. Sanity content review checklist for Amber (published-content fixes)

These live in **published Sanity content**, so code fallbacks don't change what renders. A draft
patch was attempted but Sanity writes are permission-gated in this session — **apply these in
Studio (or a write-enabled session), then publish.** Production is in coming-soon mode, so there's
runway before they're public.

| Doc | Field | Change |
| --- | --- | --- |
| `rentARoom` (singleton) | `perks[_key=="p1"].title` | "Guaranteed Clientele" → **"Your Specialty, Protected"** (§2 "guaranteed") |
| `rentARoom` | `ctaBody` | "…no-competing-services **guarantee**." → "…no-competing-services **policy**." |
| `rentARoom` | `roomSpecs[_key=="s7"].value` | "525 E Olympia Ave, **Ste 9** — …" → "…**Unit 9** — …" (NAP) |
| `privacyPolicy` (singleton) | `sections[_key=="s4"].body` (sentence 1) | Remove "promotional offers or **discounts**, any promotion of **your** products/services" → "along with invitations, announcements, and offers about **our** products and services." |
| `localArea` `650ac40d-…` (Punta Gorda) | `faqs[_key=="q1"].answer` | "525 E Olympia Ave, **Ste 9**, …" → "…**Unit 9**, …" (also renders on `/faq/`) |

**Owner decision — retail product names containing §2 terms** (manufacturer names, not our claims):
`Age-Defying Masque`, `Anti-Aging Exfoliant Masque`, `Age Delay Cream`, `Firming Serum with Phyto
Stem Cells`, and similar. These are the products' real names (GlyMed+, Skin Script). Decide: keep
accurate manufacturer names (standard retail practice) or add compliant display labels. Not changed
unilaterally — renaming would misidentify the product for buyers.

**Optional:** `localArea` Punta Gorda `intro` leads with the retired "a private advanced aesthetics and wellness studio where walk-ins are welcome." → rewrite to lead with "a medical aesthetics practice". NOTE: "private" also contradicts the walk-in policy.
Med-spa is permitted for local SEO/discovery, but the rule prefers leading with "advanced aesthetics
& wellness studio." Soften only if desired — not a hard violation.

**Clean (swept, nothing found):** service / costGuide / comparison / localArea / homepage / blog
description fields — no reverse-aging / anti-aging / guarantee / day-spa / stem-cell claims. No
`book@`, `7376`, `33982`, or stale 10–6 hours anywhere. `terms-of-service` "guaranteed" is negated
disclaimer usage ("not guaranteed", "no result is guaranteed") — compliant.
