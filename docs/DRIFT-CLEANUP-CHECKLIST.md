# Drift-Cleanup Checklist — House of Rose

**Updated:** 2026-07-07 · **Source of truth:** `CLAUDE.md` (repo root) + Sanity `siteSettings`
**Purpose:** eliminate outdated information and stop drift back to earlier versions of the brand.

## Current canon (enforce this)

- **NAP:** House of Rose Aesthetics · 525 E Olympia Ave, **Unit 9**, Punta Gorda, FL **33950** ·
  **(844) 941-7673** / `+18449417673` · **info@houseofrosefl.com**.
  _Never:_ ZIP `33982`, phone `…7376`, `book@…`, "Ste/Suite".
- **Med spa — ON, "allow, don't lead":** lead in prose with "advanced aesthetics & wellness studio";
  "med spa / medical spa" is allowed in meta, GBP, SEO, and supporting copy; **never deny being a med
  spa**; only "day spa" is off-limits. → **Stale = any "we are NOT a med spa" denial.**
- **Memberships — REMOVED (2026-07-07):** House of Rose does **not** do memberships. No memberships,
  **Rose Pass, Rose Circle, Rose Rewards, Rose Method,** or `/plans`. All retired. →
  **Stale = anything presenting any of them as a current offering.**
- **Botanical names — dead:** Lily, Iris, Hydrangea, Magnolia, Porcelain Petal, Gilded Lily, Lumière,
  Camellia Peel, Clarity Session. Use plain, searchable names.
- **AI Skin Analysis = the client draw-in** — hero CTA + main-nav item + lead-capture form on
  `/skin-analysis/`. Keep and feature it.

## Done (history — no action)

- **Membership teardown:** deleted all 13 `membership` docs + `membershipsPage`/`roseCirclePage`
  singletons; removed the `memberships`/`rose-circle`/`plans` pages, nav links, `MembershipTiers`,
  membership types/queries, and the `membership`/`membershipsPage`/`roseCirclePage` schemas + homepage
  `circle` section; added `/memberships/*` `/rose-circle/*` `/plans/*` → `/` (301) redirects; build
  verified (75 pages, exit 0). `CLAUDE.md` rewritten to reflect the removal.
- **Med-spa rule reversed** in `CLAUDE.md`, `COMPLIANCE-COPY-RULES.md`, `GOOGLE-BUSINESS-PROFILE.md`,
  `AGENTS.md` ("allow, don't lead").
- **Provider public name** `provider-brooke` "Brooke" → **"Aundrea"**.
- **AI Skin Analysis** lead-capture form added + homepage scan-section copy strengthened.

---

## Open — the real remaining drift

### P0 · Wrong NAP (always drift)
- [x] **DONE (2026-07-07)** `03_PLANS/HofR Mockups/…/SETUP-INSTRUCTIONS.md:125` — fixed to
  "House of Rose Aesthetics · 525 E Olympia Ave, Unit 9 · Punta Gorda, FL **33950**".
- [x] **DONE (2026-07-07)** `01_INBOX/competitor_analysis/GROWTH-SYSTEM-REPORT.md:14` — ZIP → **33950**.

### P0 · Stale "not a med spa" denials
- [ ] `01_INBOX/Guidelines/HofR brand voice creation prompt.md` (~70, ~683) — soften the blanket
  anti-"med spa" framing to anti-**discount** (premium positioning is still valid; the med-spa ban is not).
- [ ] Any other vault/Notion line that explicitly **denies** being a med spa.

### P1 · Botanical names still in copy
- [ ] Notion **"Services"** page — remove botanical names **and** membership language (both retired).
- [ ] `docs/competitor_analysis/compass_artifact_…ee299b72….md` — annotate the "live packages" list
  (Gilded Lily / Camellia Peel + old pricing) as **research, not current naming**.
- [ ] Spot-check page `meta`/JSON-LD for any leftover botanical names. _(Sanity `service` /
  `treatmentPackage` / `serviceCollection` content was verified clean.)_

### P1 · Stale duplicate repo (high drift trap)
- [ ] Remove `house-of-rose-site/.claude/worktrees/memberships-repositioned/` — a full second copy of
  the repo (own `CLAUDE.md`/`AGENTS.md`/`docs/`), now doubly stale (pre-teardown). Merge if needed,
  then `git worktree remove`.

### P1 · Notion consolidation
- [ ] Merge the duplicate canonical-fact pages — "Business-Profile", **two** "BUSINESS-PROFILE-GBP",
  "Canonical Business Profile", "NAP-CANONICAL" → keep **one** mirroring `CLAUDE.md`; archive the rest.
- [ ] Scrub **membership / Rose Circle / Rose Rewards / Rose Method / Rose Pass** from all Notion pages
  (retired). "House of Rose HQ" and "The Rose Method™" pages need updating too.

### P1 · Secondary docs still describing the membership model
- [ ] `docs/COMPLIANCE-COPY-RULES.md` §1, `docs/SITE-NOTION-RECONCILIATION.md`,
  `docs/VISUAL-EDITING.md`, `docs/GOOGLE-BUSINESS-PROFILE.md` — remove Rose Circle / membership /
  Rose Method framing (they don't affect the build, but they're drift bait).

### P2 · Archive / quarantine (low risk if isolated)
- [ ] `08-Memberships…/Collagen Banking offer.md` (vault) — retitle or delete (dead program name).
- [ ] `08-Memberships…/_Membership Options — Master Overview.md` & `_Sanity Migration Plan.md` —
  archive (memberships gone; kept only as history).
- [ ] Move `House of Rose/Artifacts/Brand Development Engine/` out of the searchable tree — carries
  wrong NAP (`7376` / `33982` / `book@`) and botanical names.

---

## LEAVE — legitimate references (do NOT scrub)

- **Competitor / industry / market research** — refers to the industry or rivals, not House of Rose:
  `docs/competitor_analysis/*`, `marketing/pricing-research/*`, `01_INBOX/competitor_analysis/*`,
  `07-Market Insight/Local Google Search.md`, `Artifacts/Punta Gorda Luxury Pricing & Service Strategy.md`.
- **SEO keyword tables** — "med spa near me / punta gorda" are real search terms:
  `01_INBOX/Guidelines/recommended-keywords.md`, `executive-report.md`, `README.md`.
- **The Daily briefs** — "med spa" only in AMA regulation news quotes.

---

## Governance — grep guard for regressions

Auto-flag these **banned "current-offering" strings** (mirrors FAS drift discipline):

`33982` · `7376` · `book@` · `day spa` · `Gilded Lily` · `Porcelain Petal` · `Camellia Peel` ·
`Lumière` · `Clarity Session` · `Collagen Bank` · `House Collective` · `membership` · `Rose Circle` ·
`Rose Rewards` · `Rose Method` · `Rose Pass`

> **"med spa" is NOT banned** (allowed, don't lead). **Deploy note:** the teardown + skin-analysis
> changes are staged locally / in Sanity — they need a `git push` + Netlify rebuild to go live.
