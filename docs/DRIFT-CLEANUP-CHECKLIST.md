# Drift-Cleanup Checklist — House of Rose

**Updated:** 2026-08-13 · **Source of truth:** current owner direction + `CLAUDE.md` (repo root) +
Sanity `siteSettings` + `docs/GOOGLE-BUSINESS-PROFILE.md` (NAP/GBP facts). The Creative System is
archival for voice during the active reset; cross-check any historical fact against its current owner
document and use only the still-approved visual standards.
**Purpose:** eliminate outdated information and stop drift back to earlier versions of the brand.

## Current canon (enforce this)

- **NAP:** House of Rose Aesthetics · 525 E Olympia Ave, **Unit 9**, Punta Gorda, FL **33950** ·
  **(941) 400-0165** / `+19414000165` · **info@houseofrosefl.com**. The separate toll-free
  **(844) 941-7673** / `+18449417673` remains the advertising and online-support line, not public NAP.
  _Never:_ ZIP `33982`, toll-free typo `…7376`, "Ste/Suite". `book@houseofrosefl.com` is a confirmed live
  alias, but use it only for rental/booking `mailto:` links—not public NAP.
- **Hours / opening:** Mon–Fri **9:00 AM–5:00 PM** · Sat–Sun closed · opened **June 15, 2026**.
- **Social:** Instagram `house.of.rose.aesthetics` · Facebook `https://www.facebook.com/hofraesthetics`.
- **GBP service area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch,
  Burnt Store Marina, Punta Gorda Isles.
- **GBP categories — 3 live** (verified against the profile 2026-08-01): `Medical spa` primary;
  `Facial spa` and `Skin care clinic` secondary. `Health and beauty shop` and
  `Vitamin & supplements store` are **NOT on the profile** — older docs listed them as live and were
  wrong. → **Stale = any doc asserting a five-category stack is live.**
- **Visit policy:** keep the GBP planning attribute **Appointment not required** while the current policy
  is active. State the details only in the direct visit FAQ or when a customer asks; do not repeat them as
  general marketing copy.
- **Phone SMS:** not enabled while Grasshopper verification is pending. Use call, email, contact-form,
  and services-menu CTAs; do not advertise texting as an active channel.
- **GlossGenius:** `https://houseofrose.glossgenius.com/services` is the services/menu link, not a primary
  online-booking-button CTA.
- **Lead descriptor — `Medical Aesthetics Practice`** (current reset rule in `AGENTS.md` / `CLAUDE.md`).
  "Advanced aesthetics & wellness" is demoted to supporting/SEO phrasing.
  → **Stale = any doc that instructs "lead with advanced aesthetics & wellness studio."**
- **Med spa — ON, "allow, don't lead":** "med spa / medical spa" is allowed in meta, GBP, SEO, and
  supporting copy; **never deny being a med spa**; "day spa" is off-limits. → **Stale = any "we are NOT
  a med spa" denial, or "med spa" used as the lead brand descriptor.**
- **Retired language — banned** (current reset rule in `AGENTS.md` / `CLAUDE.md`): luxury / luxe / **premium** / boutique as
  self-description, glow, radiance, timeless beauty, flawless, ageless, pamper, indulge, treat yourself,
  reveal your beauty, best version of yourself, turn back time, instant transformation, pain-free,
  blanket "no downtime," guaranteed results. → **Stale = any of these in live copy or as an AI instruction.**
- **Memberships — REMOVED (2026-07-07):** House of Rose does **not** do memberships. No memberships,
  **Rose Pass, Rose Circle, Rose Rewards, Rose Method,** or `/plans`. All retired. →
  **Stale = anything presenting any of them as a current offering.**
- **Botanical names — dead:** Lily, Iris, Hydrangea, Magnolia, Porcelain Petal, Gilded Lily, Lumière,
  Camellia Peel, Clarity Session. Use plain, searchable names.
- **Advanced Skin Imaging & Analysis is an optional paid appointment.** Keep its current
  `/skin-analysis/` route and navigation availability. It may be useful when a client is unsure where
  to begin or wants a visual baseline; do not make it a mandatory front door, funnel, prerequisite,
  or prescribed homepage hero CTA.
- **AI framing — RETIRED (2026-08-06):** the service is **Advanced Skin Imaging & Analysis**. We lead
  with the multi-spectrum imaging (standard / cross-polarized / UV), not the AI. → **Stale = "AI Skin
  Analysis," "AI-assisted," "AI skin scanner," "AI scan," "AI-powered" anywhere in client-facing copy,
  Sanity content, ad units, or an AI instruction.** The device's manufacturer name — **M17 AI Skin
  Analyzer** — is factually correct and may stay in *internal* device references; it is not the service
  name and never appears in public copy. The URL `/skin-analysis/` is unchanged (no 301 needed).

## Done (history — no action)

- **Membership teardown:** deleted all 13 `membership` docs + `membershipsPage`/`roseCirclePage`
  singletons; removed the `memberships`/`rose-circle`/`plans` pages, nav links, `MembershipTiers`,
  membership types/queries, and the `membership`/`membershipsPage`/`roseCirclePage` schemas + homepage
  `circle` section; retired `/memberships/*`, `/rose-circle/*`, and `/plans/*` with forced `404`
  responses; build
  verified (75 pages, exit 0). `CLAUDE.md` rewritten to reflect the removal.
- **Med-spa rule reversed** in `CLAUDE.md`, `COMPLIANCE-COPY-RULES.md`, `GOOGLE-BUSINESS-PROFILE.md`,
  `AGENTS.md` ("allow, don't lead").
- **AI Skin Analysis** lead-capture form added + homepage scan-section copy strengthened.

---

## Open — the real remaining drift

### ✅ DONE 2026-08-01 · Lead-descriptor sweep — `Medical Aesthetics Practice`
The current reset rules make **`Medical Aesthetics Practice`** the lead public descriptor.
Swept across governing docs, shipping source, campaign copy, and internal briefs. Verified: **zero
occurrences remain** outside deliberate "this is retired" annotations and the grep-guard list.

- [x] `llms-full.txt.ts`, `llms.txt.ts`, `queries.ts` — shipping source (committed in `dd3f291`).
- [x] Sanity — **verified clean**; the descriptor does not appear in any published document.
- [x] `docs/GOOGLE-BUSINESS-PROFILE.md` — brand-law line + Q&A seed.
- [x] Campaign kit — `meta-ad-copy.md`, `organic-captions.md`, `google-search-ads.csv`,
  `on-site-video-shot-list.md`, `README.md`. **"Private" removed too** because it was inaccurate.
- [x] Internal briefs — `research/{professional-makeup,waxing}.md`; unsupported
  Hydrodermabrasion, standalone Enzyme Facial, and generic Light Peel briefs were removed rather than
  retained as future service instructions.
  `services/makeup/PROFESSIONAL-MAKEUP-BUILD-PLAN.md`, `services/PRF_Pricing/{README,homepage-regenerative-repositioning}.md`,
  `pricing/PROFESSIONAL-MAKEUP-PRICING-COMP.md`.
- [x] Studio schema field examples + site copy that taught retired language.

### ✅ DONE 2026-08-13 · § 456.062 campaign-source cleanup
The Q3 acquisition kit formerly advertised a free consultation without the required disclosure. The
offer and all price implications are now removed from the current campaign source. The same pass also
removed the rejected process-heavy voice, the unsupported `private` framing, recurring walk-in copy,
the retired `/services/microchanneling/` destination, and a suggested text-message response while SMS
is disabled.

- [x] `copy/google-search-ads.csv` — rebuilt around verified service distinctions, current routes, NAP,
  and direct CTAs; no free-service or price claim.
- [x] `copy/organic-captions.md` — rebuilt as a factual platform bank with verified provider identity.
- [x] `production/on-site-video-shot-list.md` — scripts now show the real practice, imaging modes, and
  service differences; no free-service end card.
- [x] `README.md` — stale legal blocker and nonexistent `meta-ad-copy.md` reference removed; package is
  explicitly a working campaign requiring final owner/platform review.
- [x] Retired Q3 acquisition asset/video renderers — removed because their embedded frames contained
  the rejected offer and voice; the campaign cannot regenerate media from obsolete copy.
- [x] Unverified PRF brochure sources, renderers, print files, and brochure-only assets — removed so
  proposed treatment combinations cannot be regenerated or mistaken for approved client material.
- [x] `/skin-analysis/` remains clean in current rendered output.

### 🟡 P1 · Retired vocabulary + illegal service names in PUBLISHED Sanity copy — NEEDS AMBER
Audited 2026-08-01 across 61 published docs: **23 service documents carry 68 retired-term instances**
(`glow`×36, `radiance/radiant`×8, `luxury`×4, `no downtime`×9, `indulge`×3, `premium`×2, `flawless`×1).
This is the site's core sales copy — **not swept, because it needs judgment per service, not find-replace.**

Three separate problems, in order of cost to fix:

1. **Service NAMES break the naming law** (`CLAUDE.md`: plain, technical, searchable only — no invented,
   flowery, or "signature" names): `Luxury Facial`, `Signature Facial`, `Lunch Time Glow`,
   `Glowtox Facial`.
2. **The slugs contain the retired words** — `/services/luxury-facial/`, `/services/lunch-time-glow/`,
   `/services/glowtox-facial/`. Renaming changes URLs → needs 301s in `netlify.toml`, and costs whatever
   ranking those pages hold. **Do not rename without deciding the redirect plan.**
3. **Body copy** — "lit-from-within glow" (the exact retired phrase), "walk out glowing," etc.

⚠️ **The 9 `no downtime` instances need clinical review, not a copy edit.** Current rules permit
the phrase only when it is true for that exact procedure and reviewed. It is plausibly accurate for Glo2Facial
and doubtful for Lumecca IPL and BioRePeel. **Ask the provider per service.**

### P0 · Wrong NAP (always drift)
- [x] **DONE (2026-07-07)** `03_PLANS/HofR Mockups/…/SETUP-INSTRUCTIONS.md:125` — fixed to
  "House of Rose Aesthetics · 525 E Olympia Ave, Unit 9 · Punta Gorda, FL **33950**".
- [x] **DONE (2026-07-07)** `01_INBOX/competitor_analysis/GROWTH-SYSTEM-REPORT.md:14` — ZIP → **33950**.

### P0 · Stale "not a med spa" denials
- [ ] `01_INBOX/Guidelines/HofR brand voice creation prompt.md` (~70, ~683) — archive it; do not
  revise it into a current voice prompt. Preserve the discount prohibition in current governance only.
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
- [x] `docs/GOVERNANCE/internal_only/compliance/COMPLIANCE-COPY-RULES.md` names retired membership
  terms only to prohibit them; those compliance references are intentional and must not be scrubbed.
- [ ] Review `docs/VISUAL-EDITING.md` and `docs/GOOGLE-BUSINESS-PROFILE.md` separately for any language
  that presents a retired membership as current.

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

**Retired brand language — grep these too** (current reset rules; banned as pillars, hooks, or AI
instructions, *not* in competitor/keyword research):

`luxury` · `luxe` · `premium` (self-description) · `boutique` · `glow` · `glowing` · `radiance` ·
`radiant` · `timeless beauty` · `flawless` · `ageless` · `pamper` · `indulge` · `treat yourself` ·
`reveal your beauty` · `best version of yourself` · `turn back time` · `instant transformation` ·
`pain-free` · blanket `no downtime` · `guaranteed results` ·
`lead with "advanced aesthetics & wellness studio"` (superseded — lead is `Medical Aesthetics Practice`)

> **"med spa" is NOT banned** (allowed, don't lead). **`book@houseofrosefl.com` is also not banned;**
> it is a live alias restricted to rental/booking `mailto:` links. **Deploy note:** the teardown + skin-analysis
> changes are staged locally / in Sanity — they need a `git push` + Netlify rebuild to go live.
