# House of Rose — Pricing Source-of-Truth Reconciliation
**Date:** 2026-07-23 · **Scope:** GlossGenius (live) · Sanity `production` · Notion HQ · house-of-rose-site docs · Obsidian vault · HoR-ops

---

## 1. The verdict: what the source of truth actually is

The truth chain was already defined (CLAUDE.md Rule #0) — the problem is the anchor file was missing and nobody enforced the chain:

| Layer | Role | State found today |
|---|---|---|
| **GlossGenius** | Commerce truth — what's bookable & at what price | ✅ Live, 59 services / 14 categories. Fresh CSV export in repo (7/22) matches the live site. |
| **`docs/services/ALL-SERVICES-PRICING.MD`** | Staging mirror of GG | 🟥 **DID NOT EXIST.** Referenced as "the live menu" by CLAUDE.md and by `_service-taxonomy.md` / `_sanity-collection-restructure.md`, but the file is nowhere in the repo, Obsidian, or HoR-ops. **Created today** from the verified GG catalog. |
| **Sanity** | Display | Mostly aligned with GG on priced services; carries extra not-in-GG services + 3 conflicts (below). |
| **Notion HQ → Services DB** | Strategy: competitor pricing, status, pricing notes | Healthy structure (26 rows, Status legend), but several `Pricing Notes` are stale *proposals* that read like truth. |

Everything else (Obsidian pricing folders, HoR-ops treatment-menu.html, PRF_Pricing/, competitor analyses) is **research or duplicate** — none of it is a menu.

---

## 2. Active pricing conflicts (decisions needed — nothing changed without you)

| # | Service | GlossGenius (live) | Sanity | Notion / docs | Call needed |
|---|---|---|---|---|---|
| C1 | **Semaglutide / Tirzepatide** | $225+ / $325+ | "From $225/month" | Taxonomy final: **$279/$379** (pending COGS) · Notion: "Diana actual **$349/$549**" | **Four different answers.** Which is Diana's real current price? Then align GG → file → Sanity. |
| C2 | **IV Therapy (6 drips)** | $100–$190 (old) | From $125 (reconciled) | Taxonomy reconciled **up** to $125–$199 | Sanity already shows the reconciled prices but **GG was never updated** — clients can book cheaper than the site implies. Push GG up, or revert Sanity down. |
| C3 | **BioRePeel** | Not in GG at all | **4 standalone services under Amber, $295–$450** | Notion: "add on only to micro" · taxonomy: standalone base option Amber will add to GG (add-on figures on file: Gold spot +$45 face / +$95 body) | The two strategy sources disagree AND the Sanity pages advertise prices that aren't bookable anywhere. Either add BioRePeel to GG at the Sanity prices, or unpublish the 4 pages until it's bookable. |
| C4 | **GlowTox Facial** | $475 live, bookable | $475 under Amber / Advanced Facials | Taxonomy: **clinical-review hold** — do not market as Amber needling combo until Diana + medical director approve | It's being sold while flagged for review. Confirm the workflow is approved, or pull it from GG + Sanity. |
| C5 | **Botox** | $14/unit | From $14/unit | Notion: Diana's own menu $13.50/u ($12 member — member framing itself is dead) | Minor. Confirm $14 with Diana; scrub the "member rate" note from Notion. |
| C6 | **Permanent Jewelry** | $65 | "From $60" | Taxonomy tiers ($60–$95) are proposal-only | Fix Sanity to $65 (or "From $65"). |
| C7 | **Dermaplaning** | Not in GG | Standalone "From $135" | Notion: "add on only" · restructure plan: add-on +$45 | Sanity sells it standalone; the decision on file says add-on. Pick one, reflect it in GG. |
| C8 | **Acne standalone services** | Not in GG | `acne-peel` $139 + `back-treatment` $159 still published (+1 draft) | Decision on file: **program only ($899)** — remove standalones | Remove the two Sanity services (the restructure plan already called this). |
| C9 | **ProCell** | $349 (one line) | $349 ✅ | Notion note still shows the old **$399/$299 founding proposal** | Sanity/GG agree. Clean the stale Notion note — "founding" = discount framing, dead. |

## 3. Dead concepts found alive (Rule #0 violations — recommend immediate purge)

- **"The Rose Circle" membership copy is in the PUBLISHED Sanity homepage document** (`circleKicker/Heading/Para1-2` + CTA fields, "member rates", "6-month client affiliation"). The frontend doesn't render these fields today, so nothing is visible — but the dead concept is sitting in live data waiting to be re-wired. **Purge the fields from the homepage doc + schema.**
- Obsidian `_HoR-Archive/08-Memberships & The Rose Circle/` — archived, fine, but the flyer PDF keeps surfacing in searches. Move to `.trash` or delete.
- HoR-ops `library/back-to-school-special.html` — "special" discount framing, dead. Delete or rename/reframe.
- Notion GLP-1 / IV / Botox notes carry "member rate" and "founding" figures — scrub while fixing C1/C2/C5/C9.

## 4. Why homepage categories "bring up EVERYTHING" (root cause, confirmed in code)

Two separate taxonomies exist and neither is wired to the other:

1. **Homepage `serviceGroups`** (Sanity homepage doc) = 4 marketing groups — *Advanced Skin Treatments · Injectables & Structural Enhancements · Skin Health & Corrective Care · Wellness & Performance Support*. Each card is just `{name, description, image}` — **no link field**. In `index.astro` line 177 every card is hard-coded `href="/services/"`.
2. **`/services/` (services/index.astro)** renders `ALL_SERVICES_QUERY` as one flat numbered list of all ~45 published services — **zero grouping, zero filtering**. So every homepage card lands on the same page showing lashes and basic facials next to injectables.
3. The 12 real `serviceCollection`s (and the existing `/services/collections/[collection]/` route) are fully built and correctly populated — **they're just never linked from the homepage or used to group the index.**

**Fix (small, no schema migration required to start):**
- **F1** — Add a `collections` (array of refs) or `link` field to the homepage `serviceGroups` object; point the 4 cards at collection pages. Mapping: Advanced Skin Treatments → Advanced Facials + Microchanneling & Microneedling + Skin Renewal · Injectables & Structural Enhancements → Injectables & Bio-Fillers · Skin Health & Corrective Care → Facials + Acne Bootcamp + Enhancements & Add-ons · Wellness & Performance Support → Wellness & Restoration (+ Permanent Jewelry/Waxing/Lashes/Makeup under a "Beauty" strip or their own cards).
- **F2** — Rebuild `services/index.astro` to render **grouped by collection** with anchor IDs, so `/services/#advanced-skin-treatments` deep-links work even before F1 ships.
- **F3** — Stop listing the null-priced "hub" services (Wellness, Injectables & Bio-Fillers hub, Microchanneling hub, PRF hub) inside the flat list — they're landing pages, not services, and they double the noise.

## 5. Duplicates & scatter — consolidation map

| Keep (canonical) | Kill / archive (duplicate or stale) |
|---|---|
| `docs/services/ALL-SERVICES-PRICING.MD` *(created today)* | Obsidian `05-SERVICES/advanced-facials-master-menu.md`, `Services.md`, `services_detailed.md`, `advanced-facials-price-list.pdf`, `glossgenius_catalog.pdf` · HoR-ops `library/treatment-menu.html` |
| `docs/services/glossgenius_catalog.csv` (GG export) | — refresh on every GG change |
| `docs/services/PRF_Pricing/` (repo) | Obsidian `prf pricing/` — byte-for-byte overlap (FINAL-PRICING.md, README, 4 treatment briefs, trust-and-proof) |
| `docs/services/Diana/` (repo) | Obsidian `Diana_services/` duplicates (Treatment_Menu_v2, Injectable_PRF_Pricing) |
| Notion Services DB (strategy layer) | Notion stale twins: 2× CONTENT_CHECKLIST · 2× BUSINESS-PROFILE-GBP · 2× BRAND_VOICE · 2× README (June 5/7 pairs) — keep the newer of each |
| `docs/research/_pricing-catalog.md` (competitor research) | Obsidian `Artifacts/Punta Gorda Luxury Pricing & Service Strategy.md`, `01_INBOX/competitor_analysis/*` → archive after cross-check |

## 6. The unfinished July 13 restructure

`docs/research/_sanity-collection-restructure.md` + `_service-taxonomy.md` (2026-07-13) already contain the approved-pending plan: 12 canonical collections, migration table for every service, Diana's 6-way split, add-on policy, Face Reality page cluster. The collections themselves were created in Sanity ✅ — but the remaining steps never ran: remove `acne-peel`/`back-treatment` (C8), the BioRePeel lane fix (C3), homepage wiring (F1), GG IV reprice (C2), GLP-1 decision (C1). **Nothing new needs inventing — finish that plan.**

---

## 7. Execution queue (on your go)
1. Commit `ALL-SERVICES-PRICING.MD` + this report to the repo (`docs/`).
2. F2 grouped `/services/` page + F3 hub cleanup (code-only, no content risk).
3. F1 homepage group → collection links (tiny schema add + 4 doc edits).
4. Purge Rose Circle fields from homepage doc + schema.
5. Sanity corrections: C6 ($65 jewelry), C8 (remove 2 acne standalones), C3 (unpublish 4 standalone BioRePeels).
6. Your calls first: C1 GLP-1 price, C2 IV direction, C4 GlowTox status, C7 dermaplaning model.
7. Notion scrub: stale proposal notes (C9), member-rate remnants, duplicate pages.
8. Obsidian/HoR-ops dedupe per §5 (moves to `_to_delete/`, nothing hard-deleted).

---

## RESOLUTION LOG — Amber's rulings, executed 2026-07-23 (same day)

| Item | Ruling | Executed |
|---|---|---|
| C1 GLP-1 | **GG wins: $225/$325** | Sanity already matched; taxonomy/Notion notes superseded ✅ |
| C2 IVs | **GG wins** | Sanity IV Hydration lowered "From $125" → "From $100", published ✅ |
| C4 GlowTox | **Approved — not under review** | Stays live at $475 in GG + Sanity; hold flags removed from docs ✅ |
| C6 Jewelry | $65 | Published "From $65" ✅ |
| C8 Acne standalones | Delete | `acne-peel` + `back-treatment` unpublished AND drafts discarded ✅ |
| Rose Circle / Rose Method / memberships | **Delete everything** | All 6 circle* fields removed from Sanity homepage (published + draft); no schema/frontend/package references found; Obsidian membership archive moved to `_to_delete/` ✅ |
| Contradicting pricing docs | Delete | Moved to `_to_delete/` in Obsidian (prf pricing/, Diana_services/, 05-SERVICES stale menus, Punta Gorda pricing strategy) and HoR-ops (treatment-menu.html, back-to-school-special.html). Superseded banners added to `docs/research/_service-taxonomy.md`, `_sanity-collection-restructure.md`, `_pricing-catalog.md` ✅ |
| GG ↔ Sanity parity | Must always match | Full pass done — every service present in both now shows the same price ✅ |
| Book Now buttons | Must reach the right GG target | All site booking CTAs unified `…/services` → `…/book` (GG's actual booking flow); NEW per-service `bookingUrl` field added to the service schema + `[slug].astro` + query. GG does not expose public per-service URLs — Amber pastes each service's Booking Link (GG Dashboard → Settings → Booking Links) into Sanity Studio and the site uses it automatically ✅ |
