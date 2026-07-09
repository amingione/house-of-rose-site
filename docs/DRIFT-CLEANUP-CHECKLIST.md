# Drift-Cleanup Checklist — House of Rose

**Generated:** 2026-07-06 · **Source of truth:** `CLAUDE.md` (repo root) + Sanity `siteSettings`
**Purpose:** eliminate outdated information and stop drift back to earlier versions of the brand.

## ⚠️ Positioning update (2026-07-06) — read first

Two rules were just **corrected**. Older docs reflect the *previous* stance and are now the stale content:

1. **Med spa is now ON — "allow, don't lead."** House of Rose *is* a med spa (GBP primary category
   `Medical spa`). Lead in prose with **"advanced aesthetics & wellness studio,"** but "med spa /
   medical spa" is **permitted** in meta, GBP, SEO, and supporting copy, and **we never deny being a
   med spa.** Only **"day spa"** stays off-limits. → **Stale = any copy that says "we are NOT a med
   spa" or bans the word outright.**
2. **Botanical names must go.** Lily, Iris, Hydrangea, Magnolia, Porcelain Petal, Gilded Lily,
   Lumière, Camellia Peel, Clarity Session, etc. are **dead** but are **currently live in meta +
   Sanity** — that live state *is* the drift to remove. Survivors: **Rose Circle, Rose Method,
   Rose Pass.**
3. **Program definitions (per Amber):** **The Rose Circle** = the membership program members belong
   to when they buy a monthly membership (holds Rose Rewards + member pricing). **The Rose Method** =
   the custom-plan building process (consult → AI skin analysis → home-care + treatment plan) — **not
   a membership;** custom-plan clients enjoy *some* member perks while on their plan, not the full set.
4. **Retired — never list as current:** Rose Collagen Bank, House Collective.

**Canon docs already updated to reflect #1, #3, #4:** `CLAUDE.md`, `docs/COMPLIANCE-COPY-RULES.md`,
`docs/GOOGLE-BUSINESS-PROFILE.md`, `AGENTS.md`. Everything below is the *remaining* content to fix.

### Tags
- **FIX** — true drift; change or delete.
- **VERIFY** — needs a live check (usually Sanity) before acting.
- **LEAVE** — legitimate reference (competitor/industry research, SEO keyword data). Not drift.

---

## P0 — Remove botanical names from everything public (live drift)

- [x] **DONE (2026-07-06) — Sanity membership slugs scrubbed + published.** The botanical drift in
  Sanity lived in the membership **URL slugs** (titles were already clean). Renamed the 5 live docs:
  `lily-essentials → advanced-facials-membership`, `iris-i → injectables-membership`,
  `smooth-ritual-brazilian/brow-lip/total-body → rose-pass-brazilian/brow-lip/total-body`. Also
  re-slugged the dormant duplicate `advanced-facials-membership` (brainstorm) → `…-legacy` to avoid a
  build collision. Verified: **0 botanical slugs remain**; all 8 live memberships have clean slugs.
- [x] **VERIFIED clean — services, treatmentPackages, serviceCollections.** No botanical names in
  titles, slugs, or signature fields. The "Porcelain Petal / Gilded Lily / Camellia Peel / Lumière /
  Clarity Session" names from `_Sanity Migration Plan.md` are **already gone** from live content.
- [x] **VERIFIED — Rose Collagen Bank is already dark.** `status: brainstorm`, no `membershipGroup`,
  so it does **not** render on `/memberships/`. Effectively retired already; no unpublish needed.
- [ ] **FIX (meta/SEO): scrub botanical names from title/description/OG + JSON-LD** on any page that
  still carries them (they hurt AEO — nobody searches "porcelain petal near me").
- [ ] **FIX (repo docs presenting them as current naming):**
  - `docs/SITE-NOTION-RECONCILIATION.md` — already documents the *decision* to drop them, but keep it
    consistent with "botanical names are gone from all public surfaces."
  - `docs/competitor_analysis/compass_artifact_…ee299b72….md` — lists "live signature packages as sold
    today" using **Gilded Lily / Camellia Peel** + old pricing. Mark as **research, not current naming**
    (or annotate) so it isn't pulled as live.

---

## P0 — Purge the "we are NOT a med spa" denials (now stale)

The word "med spa" is fine in most files (keyword tables, competitor research — see LEAVE). What's
stale is any line that **denies** being a med spa or **forbids** the term for House of Rose:

- [ ] **FIX: `05-SERVICES/Botox Microneedling Facial.md:82`** — reframe "your medical spa menu" only
  if it undersells; med-spa wording is now allowed, so this is likely **LEAVE** (self-describing as a
  med-spa menu is now on-brand). Confirm tone.
- [ ] **REVIEW: `01_INBOX/Guidelines/HofR brand voice creation prompt.md` (70, 683)** — "never feel
  like a discount med spa." The "discount" part is still valid (premium positioning); the blanket
  anti-"med spa" framing is stale. Soften so it bans *cheap/discount* feel, not the med-spa category.
- [ ] **VERIFY (Notion): the "med spa" SEO/profile pages are now assets, not errors.** Pages titled
  "Medical Spa Services in Punta Gorda" ("Profile", "NOTION-SEO-PROFILE", "notion SEO Profile") and
  "The 2026 Strategic Branding Portfolio… Modern Medical Spa" were flagged as drift in v1 — under the
  new rule they're **acceptable for SEO/meta.** Just ensure brand *prose* still leads with "advanced
  aesthetics & wellness studio." Reclassify from FIX → keep.

---

## P0 — Wrong NAP (always drift, unaffected by positioning change)

- [ ] **FIX: `03_PLANS/HofR Mockups/HofR-operations site setup/SETUP-INSTRUCTIONS.md:125`** —
  "House of Rose **Medical Aesthetics** · … FL **33982**" → name = "House of Rose Aesthetics", ZIP = **33950**.
- [ ] **FIX: `01_INBOX/competitor_analysis/GROWTH-SYSTEM-REPORT.md`** — wrong ZIP **33982** (lines 14 &
  nearby) → **33950**. *(Its "med spa" positioning line + keyword rows are now fine under the new rule.)*

---

## P0 — Retired programs still listed as current

- [ ] **OK: `CLAUDE.md`** — already marks "Rose Collagen Bank & House Collective = retired" (line 30)
  and notes the hub features Injectables (lines 116–117). No fix needed. _(v1 flagged a contradiction
  here — retracted.)_
- [ ] **FIX: `08-Memberships…/Collagen Banking offer.md`** — file title still "Collagen Banking
  Program." Content is a grand-opening Daxxify promo → retitle (e.g. "Grand-Opening Daxxify Offer").
- [ ] **DONE: `docs/COMPLIANCE-COPY-RULES.md`** — Collagen Bank removed from the membership list
  (updated 2026-07-06).
- [ ] **ARCHIVE after Sanity scrub: `08-Memberships…/_Membership Options — Master Overview.md` &
  `_Sanity Migration Plan.md`** — migration worklists (old→new columns). Not drift, but archive once the
  scrub is done so the "old" columns aren't mistaken for current offerings.

---

## P1 — Findings surfaced during the Sanity scrub (not botanical)

- [x] **DONE (2026-07-06): removed the vestigial "Rose Pass" draft doc** (`95305d0a…`). It had no
  price and would have rendered as a blank 4th card. The Rose Pass wax pass is correct: section header
  comes from the `membershipsPage` singleton + 3 priced tiers (Brow & Lip $25, Brazilian $59, Total
  Body $99), all live, provider = Aundrea.
- [x] **DONE (2026-07-06): fixed provider public name.** `provider-brooke.title` was "Brooke"
  (renders publicly) → set to **"Aundrea"** (`fullName` already "Aundrea Pedigo"). Matches the
  first-name convention used by Amber/Diana/Brandy and the canon "display name = Aundrea, never Brooke."
- [x] **DONE (2026-07-06): fixed Rose Pass copy.** `membershipsPage.rosePassBody` had conflated the
  wax perks with "Rose Rewards." Reworded so **Rose Rewards = cash-back points** and the wax perks
  (discounted add-on waxing, retail savings, birthday treatment) read as membership benefits.
- [ ] **OPEN — VERIFY: three plan docs marked "internal — do not publish" may still render on `/plans`.**
  `The Regeneration/Renewal/Restoration Plan` are `status: brainstorm` but `type == regenerative-plan`,
  and `PLANS_QUERY` filters only on `type` (no status filter). Their `whatsIncluded` says "Internal
  provider reference only. Do not publish." Either add a status filter to the query or change their
  type so they don't leak onto the public plans page.

---

## P1 — Stale duplicate repo (high drift trap)

- [ ] **FIX: Remove `house-of-rose-site/.claude/worktrees/memberships-repositioned/`.** Full second
  copy of the repo — its own `CLAUDE.md`, `AGENTS.md`, `docs/` (all pre-correction). Confirm the branch
  is merged, then `git worktree remove`. Otherwise old canon gets read as current.

---

## P1 — Notion consolidation (biggest surface)

- [ ] **CONSOLIDATE canonical-fact duplicates:** "Business-Profile", **two** "BUSINESS-PROFILE-GBP",
  "Canonical Business Profile", "NAP-CANONICAL". Keep **one** (mirroring the updated `CLAUDE.md`),
  archive the rest, link the survivor from the workspace top.
- [ ] **FIX: "Services" page (Jun 20)** — still describes "Lily / Iris / Hydrangea membership lanes."
  Rewrite to per-provider lanes (Advanced Facials, Injectables, IV Hydration, Basic Facials, Rose Pass)
  and drop botanical names.
- [ ] **VERIFY: any Notion page listing Rose Collagen Bank / House Collective** as current → mark retired.
- [ ] **LEAVE (already correct):** "House of Rose HQ", "The Rose Method™" (Jul 4). Use as the model.

---

## VERIFY — Rose Circle vs Rose Method definitions (align the docs)

Some docs conflate the two. Reconcile all to Amber's definitions (§3 above):

- [ ] `docs/COMPLIANCE-COPY-RULES.md` §1 previously called Rose Circle "the direct client affiliation…
  not a membership." Updated 2026-07-06 to "the program members belong to when they hold a monthly
  membership." Confirm this matches how `/rose-circle/` vs `/memberships/` are presented on the site.
- [ ] `CLAUDE.md` §Membership model still says "The Rose Circle … NOT a membership. It holds the
  memberships." This is compatible (members join a lane membership → belong to the Circle), but confirm
  the wording reads the way you intend, since your latest phrasing leans "Rose Circle = the membership
  members are part of."

---

## LEAVE — legitimate references (do NOT scrub)

- **Compliance/governance docs** (they now document the *new* med-spa rule): `docs/COMPLIANCE-COPY-RULES.md`,
  `docs/GOOGLE-BUSINESS-PROFILE.md`, `AGENTS.md`, `docs/services/PROFESSIONAL-MAKEUP-BUILD-PLAN.md`,
  `docs/superpowers/specs/2026-06-08-content-voice-pass-design.md`.
- **Competitor / industry / market research** (refers to the industry or rivals):
  `docs/competitor_analysis/*`, `marketing/pricing-research/compass_artifact_*`,
  `01_INBOX/competitor_analysis/*`, `07-Market Insight/Local Google Search.md`,
  `Artifacts/Punta Gorda Luxury Pricing & Service Strategy.md`.
- **SEO keyword tables** ("med spa near me / punta gorda" are real search terms):
  `01_INBOX/Guidelines/recommended-keywords.md`, `executive-report.md`, `README.md`.
- **The Daily briefs** — "med spa" only in AMA regulation news quotes.
- **Archive dumps** `House of Rose/Artifacts/Brand Development Engine/` + `.trash/Brand Development
  Engine 2/` — old positioning, but move the live `Artifacts/` copy out of the searchable tree so its
  wrong NAP (7376 / 33982 / book@) and botanical names aren't retrieved as current.

---

## Suggested execution order

1. **Sanity botanical scrub** (P0) — protects the live site.
2. **Meta/JSON-LD botanical scrub** (P0).
3. **CLAUDE.md Collagen Bank line + Collagen file retitle**, wrong-NAP fixes.
4. **Remove stale worktree.**
5. **Notion consolidation** (one canonical page) + drop botanical from "Services."
6. **Reconcile Rose Circle / Rose Method wording**, then archive the migration worklists.

> Governance idea: add a `grep` guard for the still-banned strings (`33982`, `7376`, `book@`,
> `Gilded Lily`, `Porcelain Petal`, `Camellia Peel`, `Lumière`, `Collagen Bank`, `House Collective`,
> `day spa`) to auto-catch regressions — mirrors the FAS Motorsports drift discipline. Note: **"med
> spa" is no longer a banned string.**
