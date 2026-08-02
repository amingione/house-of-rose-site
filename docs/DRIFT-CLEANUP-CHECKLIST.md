# Drift-Cleanup Checklist — House of Rose

**Updated:** 2026-08-01 · **Source of truth:** `docs/House_of_Rose_Creative_System/` (brand voice,
positioning, approved copy, visual direction) + `CLAUDE.md` (repo root) + Sanity `siteSettings` +
`docs/GOOGLE-BUSINESS-PROFILE.md` (NAP/GBP facts)
**Purpose:** eliminate outdated information and stop drift back to earlier versions of the brand.

## Current canon (enforce this)

- **NAP:** House of Rose Aesthetics · 525 E Olympia Ave, **Unit 9**, Punta Gorda, FL **33950** ·
  **(844) 941-7673** / `+18449417673` · **info@houseofrosefl.com**.
  _Never:_ ZIP `33982`, phone `…7376`, "Ste/Suite". `book@houseofrosefl.com` is a confirmed live
  alias, but use it only for rental/booking `mailto:` links—not public NAP.
- **Hours / opening:** Mon–Fri **9:00 AM–5:00 PM** · Sat–Sun closed · opened **June 15, 2026**.
- **Social:** Instagram `house.of.rose.aesthetics` · Facebook `https://www.facebook.com/hofraesthetics`.
- **GBP service area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch,
  Burnt Store Marina, Punta Gorda Isles.
- **GBP categories — 3 live** (verified against the profile 2026-08-01): `Medical spa` primary;
  `Facial spa` and `Skin care clinic` secondary. `Health and beauty shop` and
  `Vitamin & supplements store` are **NOT on the profile** — older docs listed them as live and were
  wrong. → **Stale = any doc asserting a five-category stack is live.**
  _(Exception: `structuredData.ts`'s `BUSINESS_CATEGORIES` legitimately keeps all five — it is a
  JSON-LD `keywords` list describing real offerings, not a GBP mirror. Do not sync it.)_
- **Visit policy:** walk-ins welcome; appointments recommended to reserve a time. GBP planning attribute:
  **Appointment not required**.
- **Phone SMS:** not enabled while Grasshopper verification is pending. Use call, email, contact-form,
  walk-in, and services-menu CTAs; do not advertise texting as an active channel.
- **GlossGenius:** `https://houseofrose.glossgenius.com/services` is the services/menu link, not a primary
  online-booking-button CTA.
- **Lead descriptor — `Medical Aesthetics Practice`** (Creative System v1.0, Book 1 §2 / Book 3 §1,
  binding 2026-08-01). "Advanced aesthetics & wellness" is demoted to supporting/SEO phrasing.
  → **Stale = any doc that instructs "lead with advanced aesthetics & wellness studio."**
  ⚠️ **The published sweep is NOT done** — see the open item at the bottom of this file.
- **Med spa — ON, "allow, don't lead":** "med spa / medical spa" is allowed in meta, GBP, SEO, and
  supporting copy; **never deny being a med spa**; "day spa" is off-limits. → **Stale = any "we are NOT
  a med spa" denial, or "med spa" used as the lead brand descriptor.**
- **Retired language — banned** (Creative System Book 1 §12): luxury / luxe / **premium** / boutique as
  self-description, glow, radiance, timeless beauty, flawless, ageless, pamper, indulge, treat yourself,
  reveal your beauty, best version of yourself, turn back time, instant transformation, pain-free,
  blanket "no downtime," guaranteed results. → **Stale = any of these in live copy or as an AI instruction.**
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
  `circle` section; retired `/memberships/*`, `/rose-circle/*`, and `/plans/*` with forced `404`
  responses; build
  verified (75 pages, exit 0). `CLAUDE.md` rewritten to reflect the removal.
- **Med-spa rule reversed** in `CLAUDE.md`, `COMPLIANCE-COPY-RULES.md`, `GOOGLE-BUSINESS-PROFILE.md`,
  `AGENTS.md` ("allow, don't lead").
- **Provider public name** `provider-brooke` "Brooke" → **"Aundrea"**.
- **AI Skin Analysis** lead-capture form added + homepage scan-section copy strengthened.

---

## Open — the real remaining drift

### ✅ DONE 2026-08-01 · Lead-descriptor sweep — `Medical Aesthetics Practice`
The Creative System (v1.0, 2026-07-30) makes **`Medical Aesthetics Practice`** the lead public descriptor.
Swept across governing docs, shipping source, campaign copy, and internal briefs. Verified: **zero
occurrences remain** outside deliberate "this is retired" annotations and the grep-guard list.

- [x] `llms-full.txt.ts`, `llms.txt.ts`, `queries.ts` — shipping source (committed in `dd3f291`).
- [x] Sanity — **verified clean**; the descriptor does not appear in any published document.
- [x] `docs/GOOGLE-BUSINESS-PROFILE.md` — brand-law line + Q&A seed.
- [x] Campaign kit — `meta-ad-copy.md`, `organic-captions.md`, `google-search-ads.csv`,
  `on-site-video-shot-list.md`, `README.md`. **"Private" removed too** — it contradicts the walk-in policy.
- [x] Internal briefs — `research/{professional-makeup,hydrodermabrasion,waxing,_audit-report}.md`,
  `services/makeup/PROFESSIONAL-MAKEUP-BUILD-PLAN.md`, `services/PRF_Pricing/{README,homepage-regenerative-repositioning}.md`,
  `pricing/PROFESSIONAL-MAKEUP-PRICING-COMP.md`.
- [x] Studio schema field examples + site copy that taught retired language.

### 🛑 P0 · § 456.062 — the Q3 campaign kit cannot publish as written
Every ad unit in `docs/marketing/campaigns/2026-q3-local-acquisition/` advertised a **"complimentary"**
consultation with **no 72-hour disclosure in the ad unit**. `copy/google-search-ads.csv` was formatted for
direct upload with "Complimentary Consultation" as a headline.

- [x] `google-search-ads.csv` — the word removed (RSA headlines can't carry the block); now advertises the
  consultation with no price claim, which takes it outside § 456.062.
- [x] `on-site-video-shot-list.md` — same fix.
- [ ] **`meta-ad-copy.md` (4 units), `organic-captions.md` (5 units), `README.md` CTA still say
  "complimentary."** Amber must either obtain the approved disclosure copy + counsel sign-off, or drop
  the word. **Statutory text must not be improvised** — see `CLAUDE.md`.
- [ ] `/skin-analysis/` on the live site has the same exposure wherever it says "complimentary."

### 🟡 P1 · Retired vocabulary + illegal service names in PUBLISHED Sanity copy — NEEDS AMBER
Audited 2026-08-01 across 61 published docs: **23 service documents carry 68 retired-term instances**
(`glow`×36, `radiance/radiant`×8, `luxury`×4, `no downtime`×9, `indulge`×3, `premium`×2, `flawless`×1).
This is the site's core sales copy — **not swept, because it needs judgment per service, not find-replace.**

Three separate problems, in order of cost to fix:

1. **Service NAMES break the naming law** (`CLAUDE.md`: plain, technical, searchable only — no invented,
   flowery, or "signature" names): `Luxury Facial`, `Royal Rose Facial`, `Luxe Rose Facial`,
   `Signature Rose Facial`, `Signature Facial`, `Lunch Time Glow`, `Glowtox Facial`.
2. **The slugs contain the retired words** — `/services/luxury-facial/`, `/services/lunch-time-glow/`,
   `/services/glowtox-facial/`. Renaming changes URLs → needs 301s in `netlify.toml`, and costs whatever
   ranking those pages hold. **Do not rename without deciding the redirect plan.**
3. **Body copy** — "lit-from-within glow" (the exact retired phrase), "walk out glowing," etc.

⚠️ **The 9 `no downtime` instances need clinical review, not a copy edit.** The Creative System permits
the phrase when it is true for that exact procedure and reviewed. It is plausibly accurate for Glo2Facial
and lash tint, and doubtful for Lumecca IPL and BioRePeel. **Ask the provider per service.**

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
- [x] **DONE (2026-07-17)** `docs/competitor_analysis/compass_artifact_…ee299b72….md` — deleted the
  botanical "recommended menu / packages / launch" sections entirely (kept only the plain-named
  competitor landscape §1–3).
- [ ] Spot-check page `meta`/JSON-LD for any leftover botanical names. _(Sanity `service` /
  `treatmentPackage` / `serviceCollection` content was verified clean.)_

> **This file is the single home for the banned-term blocklist below.** Elsewhere, delete dead terms
> rather than re-listing them — the only place they should appear is the regression guard here.

### P1 · Stale duplicate repo (high drift trap)
- [x] **DONE (verified 2026-07-17)** `.claude/worktrees/memberships-repositioned/` is gone — `git
  worktree list` shows only `main`, no `.git/worktrees/` registration, and `.claude/worktrees/` holds
  only an empty `.gitkeep`. No stale copy remains.

### P1 · Notion consolidation
- [ ] Merge the duplicate canonical-fact pages — "Business-Profile", **two** "BUSINESS-PROFILE-GBP",
  "Canonical Business Profile", "NAP-CANONICAL" → keep **one** mirroring `CLAUDE.md`; archive the rest.
- [ ] Scrub **membership / Rose Circle / Rose Rewards / Rose Method / Rose Pass** from all Notion pages
  (retired). "House of Rose HQ" and "The Rose Method™" pages need updating too.

### P1 · Secondary docs still describing the membership model
- [ ] `docs/internal_only/COMPLIANCE-COPY-RULES.md` §1, `docs/VISUAL-EDITING.md`, `docs/GOOGLE-BUSINESS-PROFILE.md` — remove Rose Circle / membership /
  Rose Method framing (they don't affect the build, but they're drift bait).

### P2 · Archive / quarantine (low risk if isolated)
- [ ] `08-Memberships…/Collagen Banking offer.md` (vault) — retitle or delete (dead program name).
- [ ] `08-Memberships…/_Membership Options — Master Overview.md` & `_Sanity Migration Plan.md` —
  archive (memberships gone; kept only as history).
- [ ] Move `House of Rose/Artifacts/Brand Development Engine/` out of the searchable tree — carries
  wrong NAP (`7376` / `33982`) and botanical names. Review any `book@` reference by context; the alias
  itself is valid, but it is not the public NAP email.

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

`33982` · `7376` · public-NAP use of `book@` · `day spa` · `Gilded Lily` · `Porcelain Petal` · `Camellia Peel` ·
`Lumière` · `Clarity Session` · `Collagen Bank` · `House Collective` · `membership` · `Rose Circle` ·
`Rose Rewards` · `Rose Method` · `Rose Pass` · `appointment-only` · `walk-ins not offered` ·
old IG `houseofrosefl` · old Facebook vanity URL · opening `July 9, 2026`

**Retired brand language — grep these too** (Creative System Book 1 §12; banned as pillars, hooks, or AI
instructions, *not* in competitor/keyword research):

`luxury` · `luxe` · `premium` (self-description) · `boutique` · `glow` · `glowing` · `radiance` ·
`radiant` · `timeless beauty` · `flawless` · `ageless` · `pamper` · `indulge` · `treat yourself` ·
`reveal your beauty` · `best version of yourself` · `turn back time` · `instant transformation` ·
`pain-free` · blanket `no downtime` · `guaranteed results` ·
`lead with "advanced aesthetics & wellness studio"` (superseded — lead is `Medical Aesthetics Practice`)

> **"med spa" is NOT banned** (allowed, don't lead). **`book@houseofrosefl.com` is also not banned;**
> it is a live alias restricted to rental/booking `mailto:` links. **Deploy note:** the teardown + skin-analysis
> changes are staged locally / in Sanity — they need a `git push` + Netlify rebuild to go live.
