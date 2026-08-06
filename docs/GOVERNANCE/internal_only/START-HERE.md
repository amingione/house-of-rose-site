# House of Rose — Where To Look (start here)

**Purpose:** one map so "which folder has the real answer" never has to be re-figured-out. If a doc
isn't listed below as canonical, treat it as either research/staging or dead — don't draft from it.
Built 2026-08-01 during the full local + Notion cleanup pass; keep this updated when you add or retire a doc.

---

## 1. Brand voice, positioning, visual identity, marketing, client-facing copy → **House of Rose Creative System v1.0**

**Canonical and binding, issued 2026-07-30.** Wired into `CLAUDE.md` (Rule #0 verification order + its own
section) and `AGENTS.md` on 2026-08-01, so every agent inherits it. **It outranks every older brand doc
here, in Notion, and in the vault.** It does *not* outrank statute (`compliance/`) or operational fact
(pricing, provider lanes, service names). Lives in two mirrored places — same content, pick whichever's convenient:

- **Local:** `docs/House_of_Rose_Creative_System/` — 7 numbered .docx files + `House_of_Rose_Creative_System_MASTER.md` (the one to paste from) + `.pdf` reference copy.
- **Notion:** House of Rose HQ → 7 pages (Creative Bible, Brand Voice & Copy Standards, Social & Profile Bios, Visual Standards, AI Creative Rules & Prompt Library, Marketing System, Content Approval Checklist) + `00_README_House_of_Rose_Creative_System`.

Which book answers what: **1** positioning/vocabulary/retired language · **2** voice, writing rules,
claim tiers, copy templates · **3** canonical business info, approved bios, GBP/FB/IG/directory/website
copy · **4** photography, video, color, type, visual blacklist · **5** the AI context block + prompt
library + AI may/may-not · **6** Meta, Google Ads, GBP, SEO, landing pages, measurement · **7** the
publish preflight.

Category language: **Medical Aesthetics Practice** (lead descriptor). "Medical spa" is allowed in meta/GBP/SEO, never denied. Retired: luxury, premium, boutique, guest, physician-informed, pamper, glow/radiance, memberships, flowery service names. Full retired-language list is in the Creative Bible §12 and Brand Voice & Copy Standards §4.

⚠️ **The descriptor sweep is not done.** Published copy (`llms-full.txt.ts` most urgently, plus
`llms.txt.ts`, `queries.ts`, Sanity, GBP, campaign copy) still leads with "advanced aesthetics &
wellness studio." Tracked as P0 in `docs/DRIFT-CLEANUP-CHECKLIST.md` — needs Amber's go-ahead.

**Do not draft brand voice from:** any Notion page prefixed `ARCHIVED - DO NOT USE`, or `docs/GOOGLE-BUSINESS-PROFILE.md`'s older example copy (flagged inline, not deleted).

## 2. Compliance / legal claim language → `docs/internal_only/COMPLIANCE-COPY-RULES.md`

Voice + claims rules (what you can't say, what to say instead). For statutory/paid-ad/toll-free rules, `docs/internal_only/compliance/` wins if the two conflict — start at `docs/internal_only/compliance/README.md`.

## 3. Pricing → `docs/internal_only/services/ALL-SERVICES-PRICING.MD` — ⚠️ SEE CONFLICT BELOW

This is the file `CLAUDE.md` and `docs/PRICING-RECONCILIATION-2026-07-23.md` both name as canonical (mirrors GlossGenius, the actual commerce truth). **However:** `docs/internal_only/pricing/ALL-SERVICES-PRICING.MD` — a different, newer, more detailed file with the *same name* in a sibling folder — was last edited today and was not reconciled into the canonical file. **These two files currently disagree and one needs to be retired into the other. This needs your call — see the summary message for the exact question.**

Everything else in `docs/internal_only/pricing/` (`GG-PRICE-FINALIZE.md`, `advanced-facials-master-menu.md`, `PROFESSIONAL-MAKEUP-PRICING-COMP.md`) is legitimate working/reference material, not menus — keep.

## 4. Treatment research (facts, protocol, compliance-vetted copy) → `docs/internal_only/research/`

One file per treatment (`biorepeel.md`, `dermaplaning.md`, `neurotoxins.md`, etc.) — these are the deep, current, compliance-reviewed briefs. `docs/internal_only/services/facials/*.md` used to duplicate a few of these as empty/near-empty stubs; they now just point back to research/ (fixed 2026-08-01).

Files prefixed `_` (`_gaps.md`, `_index.md`, `_pricing-catalog.md`, `_service-taxonomy.md`, `_sanity-collection-restructure.md`, `_site-inventory.md`) are the meta/tracking layer for the site-elevation project — `_gaps.md` in particular is the live punch list of unresolved conflicts.

## 5. Provider-specific service/pricing detail → `docs/internal_only/services/<Provider>/`

`Diana/`, `PRF_Pricing/`, `microchanneling/`, `waxing/`, `makeup/`, `facials/` — organized final-ish copy per lane. `glossgenius_catalog.csv` is the raw GG export (refresh whenever GG changes).

## 6. NAP, hours, GBP categories/attributes → `CLAUDE.md` (repo root) + `docs/GOOGLE-BUSINESS-PROFILE.md` + Notion `BUSINESS-PROFILE-GBP`

✅ **Resolved 2026-08-01** (Amber supplied the live profile). The earlier claim that
`docs/GOOGLE-BUSINESS-PROFILE.md` §3 disagreed with the Creative System's approved GBP description was a
**false alarm** — §3, Creative System Book 3 §3, and the live Google description are **byte-identical
(731 chars)**. Also settled: **opened June 15, 2026** (Google confirms it), and **Google chat cannot be
connected** — Google killed the feature on 2024-07-31.

⚠️ **Still open:** the live profile carries **3 categories**, not the 5 every doc claimed. `Health and
beauty shop` and `Vitamin & supplements store` are missing, which strands the GLP-1/B-12/IV service items
that `GOOGLE-BUSINESS-PROFILE.md` §4B files under the latter. Amber's call.

## 7. What's already been cleaned up / what's still open → `docs/DRIFT-CLEANUP-CHECKLIST.md`

The running regression list (banned terms, walk-in policy, membership teardown, Notion duplicates). Check this before re-flagging something as "found a problem" — it may already be tracked.

## 8. SEO/AEO strategy → `docs/SEO-AEO-PLAYBOOK.md` + `docs/CONTENT-MODEL-MAP.md`

## 9. Checkout/commerce architecture → `docs/CHECKOUT.md` · Shop → `docs/SHOP-ARCHITECTURE.md` · Visual editing → `docs/VISUAL-EDITING.md`

## 10. Vendor reference material (not brand copy) → `docs/marketing/Face Reality/`

Face Reality's own protocol docs, SDS sheets, product images, client handouts — supplier material, not House of Rose voice. Leave as-is; don't draft brand copy from it.

---

## Archived 2026-08-01 (do not use, kept only as history)

**Notion:**
- `ARCHIVED - DO NOT USE - BRAND_VOICE` and `ARCHIVED - DO NOT USE - BRAND VOICE` (duplicate twins, both pre-Creative-System)
- `ARCHIVED - DO NOT USE - BUSINESS-PROFILE-GBP (April draft)`
- `Canonical Business Profile`, `Business-Profile`, `NAP-CANONICAL` — already self-marked superseded/archived before this pass
- The surviving `BUSINESS-PROFILE-GBP` (July 28 live-facts page) was trimmed — ~400 lines of superseded draft content (Rose Method™, member rates, wrong hours) removed, keeping only the live snapshot

**Local:**
- `docs/House_of_Rose_Creative_System/House_of_Rose_Creative_System_v1.0.zip` — deleted (redundant with the extracted files sitting next to it)
- 60 stray `.DS_Store` files — deleted
- `docs/internal_only/services/facials/dermaplaning.md`, `hydrodermabrasion.md`, `biorepeel.md`, `faceRealityAcneProgram.md` — were empty/near-empty stubs, now point to their research/ equivalent
- Retired-language fixes: `docs/GOOGLE-BUSINESS-PROFILE.md` ("luxury play," "boutique," "guests," rose emoji), `docs/internal_only/COMPLIANCE-COPY-RULES.md` ("premium positioning"), `docs/marketing/campaigns/2026-q3-local-acquisition/README.md` ("Luxury angle")

**Obsidian vault (`House of Rose/`):**
- `07-Market Insight/branding Guidelines/HofR brand voice creation prompt.md` — marked archived (built on the retired "luxury boutique, appointment-only, premium" positioning)
- `Brand Development Engine/` (wrong NAP, botanical names) — already moved to `.trash/` in an earlier pass, confirmed still there

## Still open — needs Amber, not further automated cleanup

1. **The two `ALL-SERVICES-PRICING.MD` files disagree** (§3 above) — pick a winner.
2. **`docs/GOOGLE-BUSINESS-PROFILE.md` §3 vs. the Creative System's approved GBP description disagree** — confirm what's actually live on Google.
3. Obsidian vault still has scattered older pricing/reference files outside this repo (e.g. `0_TASKS/Diana_Pricing_Reconciliation.numbers`) and `HoR-ops/docs/PRF-LIBRARY.md` sits outside both — worth a follow-up pass once #1 is resolved, so there's one pricing answer to point everything at instead of three.
4. 2 duplicate `GROWTH-SYSTEM-REPORT` Notion pages (Jun 5 / Aug 1) both still use "physician-informed luxury med spa positioning" language — not yet reconciled against the Creative System (lower priority: point-in-time reports, not active guidance).
