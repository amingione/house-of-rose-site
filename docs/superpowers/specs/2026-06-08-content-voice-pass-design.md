# House of Rose Aesthetics — Content & Voice Pass (Design Spec)

**Date:** 2026-06-08
**Status:** Draft for user review
**Owner:** Amber Mingione
**Repo:** `house-of-rose-site` (Astro + Sanity monorepo)
**Sanity:** project `4e7axyi7`, dataset `production`

---

## 1. Background & Problem

The live site advertises a **generic, partly false** service menu (IV/hormone/GLP-1/"wellness protocols") in generic "AI med-spa template" voice. The source of that content was LaunchWell agency *benchmark research*, not the real business. The real service `.md` files were empty stubs; the real menu, prices, and brand voice live in Amber's Notion (House of Rose HQ) and in her drafted homepage copy.

This spec covers **content correction in the real brand voice** — not a UI redesign. The earlier "luxury redesign" is explicitly rejected and out of scope.

## 2. Decomposition (this spec = sub-project 1 of 3)

| # | Sub-project | Status |
|---|---|---|
| **1** | **Content & Voice Pass** | **This spec** |
| 2 | Shop / commerce (Sanity → Shopify-headless *or* Square+Sanity) | Separate spec/plan, later |
| 3 | Permanent jewelry marketing & display strategy | Parallel research, non-blocking |

## 3. Goals

- Replace all false/generic site content with the **real** service menu in Amber's voice.
- Establish brand voice + naming consistently across all pages.
- Add the pages the real business needs: **Skin Analysis**, **Memberships**, **Providers/Team**.
- Wire **Book Online** CTAs to the existing **GlossGenius** scheduler.
- Keep everything within the existing Astro page structure + Sanity content model.

## Non-Goals

- No UI/visual redesign (no full-bleed/sticky-header rebuild).
- No commerce engine (Shop is a teaser page linking out; real store = sub-project 2).
- No new booking system (GlossGenius already live).
- No public pricing on the site.
- No permanent-jewelry service pages in the main nav (boutique/impulse feature only).

## 4. Brand Frame (rules every page obeys)

- **Name:** House of Rose Aesthetics. Remove "Luxury Spa & Wellness"; minimize "med spa" → prefer **"advanced aesthetics."**
- **Taglines:** "Where Beauty Blooms Within" · "Advanced Aesthetics & Wellness · Punta Gorda, Florida"
- **Positioning:** full-service advanced aesthetics; **PRF/regenerative is a signature specialty, NOT the whole brand** (balanced, per Amber's homepage draft — this overrides the earlier "PRF-only / appointment-only" framing).
- **Audience:** affluent, 30–65 (primarily women, not exclusively); natural-looking results, longevity/restoration, skin health, subtle refinement, privacy, premium care.
- **CTA model:** primary **Book Online** (GlossGenius); warm secondary **Contact/consult**. Not gated "appointment-only."

### Voice (canonical = Amber's homepage draft + `packages/web/docs/BRAND_VOICE.md`)
Warm, calm, plain-spoken luxury. Second-person ("your skin"). Anti-hype — pushes against salesy med-spa tropes. Premium through restraint, not adjectives. Where the existing BRAND_VOICE.md register is punchier than Amber's draft, **Amber's draft wins** and BRAND_VOICE.md is updated to match (see §4.1).

### Compliance (enforced by `claims-linter` hook + `claims-compliance-reviewer`)
Approved framing: "supports," "may improve," "designed to support," "results vary." Prohibited: efficacy guarantees, cure language, age-reversal claims, and monetary figures in public copy. See BRAND_VOICE.md "Never Use" for the full prohibited list. Every public line must pass the claims-linter hook before publish.

### 4.1 BRAND_VOICE.md reconciliation (part of this sub-project)
`packages/web/docs/BRAND_VOICE.md` is the hook-enforced source of truth but is partially stale. Update it to current direction:
- **Keep:** voice pillars (calm authority, results-honest), the vocabulary swaps, the full "Never Use" list, and the service/FAQ/meta templates — all as defined in BRAND_VOICE.md.
- **Change:** brand name → "House of Rose **Aesthetics**" (remove "Luxury Spa & Wellness"); remove hormone-therapy references (not a real service); audience → 30–65; soften the headline register toward Amber's warmer homepage voice; update example headlines that reference non-real services.
- Tagline "Where Beauty Blooms Within" is grandfathered (approved use of "beauty"); avoid "beauty" as a standalone noun elsewhere.

## 5. Information Architecture

**Nav:** About · Services · Skin Analysis · Memberships · Shop · Contact · **Book Online**

| Page | Source / Notes |
|---|---|
| **Home** | Amber's 10-section draft, largely as written |
| **Services hub** | 4 need-based groups, naturally flowing; **no provider names** (routing is internal) |
| **Service detail ×N** | Per service/program; mine Notion rows for source |
| **Skin Analysis** *(new)* | In-office scanner; markets the tech (no app integration) |
| **Memberships** *(new)* | GLOW/ELITE/VIP **reframed to home voice — DRAFT FOR APPROVAL before publish** |
| **Providers / Team** *(new)* | The experts, branded language; trust, not a menu |
| **Experience** | Philosophy, unhurried care, guest journey |
| **Shop** | Teaser page; links out until sub-project 2 |

## 6. Service Taxonomy (4 groups, need-based)

Provider assignment stays **internal** (client calls/books; team routes by fit, avoiding overlap until staffed for overflow). No provider labels on public service listings.

1. **Regenerative Aesthetics** *(signature)* — ProCell microchanneling/microneedling; PRF microchanneling/microneedling; PRF + ProCell stacked; Osmosis; and injectable regenerative (PRF under-eye / full-face / EZ Gel / hair restoration).
2. **Injectables & Advanced Treatments** — Botox/Dysport/Daxxify; dermal fillers (RHA, Restylane, Juvederm); RF microneedling; BioRePeel; peels.
3. **Facials & Skin Health** — Basic Facial; Facial + Peel; Hydrodermabrasion (NOT "hydrofacial"); Dermaplane; Mommy & Me; Face Reality Acne Program.
4. **Wellness & Ongoing Care** — IV Hydration; GLP-1 weight-loss programs; memberships; treatment plans.

**Boutique feature (off main nav):** Permanent Jewelry (necklace/bracelet/anklet/belly chain) — display/impulse; copy + merchandising from sub-project 3.

**Signature spotlights** (featured above the flat menu): ProCell + PRF stacked · Osmosis + ProCell signature facial · Face Reality Acne Bootcamp.

### Critical distinction (do not conflate)
- **Injectable PRF / EZ Gel** (Diana, RN — in-skin, medical): under-eye, full-face, lip, hair restoration.
- **Topical PRF + ProCell microchanneling** (Amber, medical aesthetician + phlebotomist — surface/channels).
These are different treatments and different scopes of practice. Copy must keep them distinct.

### Catalog notes
- "Dermaplane" and "dermaplaning" are duplicate Notion rows → merge to one.
- "RF microneedling" and "BioRePeel" appear in homepage copy but not yet as Notion catalog rows → confirm/add as services.

## 7. Per-Page Content Specs

### Home
Ship Amber's drafted 10 sections (Hero → Brand Positioning → Signature Approach → Services Overview → Skin Analysis → Memberships → Home Care/Shop → Experience → Local/Trust → Final CTA). Use her meta title/description. Primary CTA "Book Online" → GlossGenius.

### Services hub
Intro in voice → 4 group cards (names + descriptions from homepage draft) → link to detail pages → consult CTA. No "how to choose by provider."

### Service detail (template)
Use the project `service-page` skill for **structure + Service/MedicalBusiness JSON-LD**, but apply THIS spec's *balanced* voice (not PRF-led) where they differ. Sections: what it is · who it's for · what to expect · FAQ (2–4) · related · Book Online CTA. Source each from its Notion row (cost/competitor/Drive); flag thin-source services before drafting.

### Skin Analysis
Market the in-office analysis tech per homepage Section 5. CTA: "Learn About Skin Analysis" → consult/Book Online.

### Memberships  ⚠️ APPROVAL GATE
Real tiers: GLOW / ELITE / VIP (three banked-credit membership levels; full terms held internally / in GlossGenius — not shown publicly). Reframe to the homepage's skin-health-continuity voice. **Draft the reframed copy and send to Amber for approval BEFORE changing or publishing.** Do not alter live membership terms without sign-off.

### Providers / Team
Branded bios for the 4 providers (Diana RN, Amber medical aesthetician + phlebotomist, Brandy aesthetician, Brooke permanent jewelry). Trust/expertise framing; no per-service price/menu. Compliance-clean credentials language.

### Experience
Homepage Section 8 expanded: calm, unhurried, informed-consent tone.

### Footer / Shop teaser
Footer = repeated contact + Book Online on all pages. Shop = single teaser page (curated home care narrative) linking out until commerce ships.

## 8. Sanity Content Model

Reuse existing schemas where possible (service, testimonial, experienceContent, siteSettings). Add fields/singletons as needed for: service groups/categories, Skin Analysis page, Memberships, Providers. Confirm schema gaps during planning; deploy schema before content entry. (Schema changes, if any, are small and additive.)

## 9. Dependencies & Open Items

- GlossGenius booking URL (for CTA wiring) — Amber to provide exact link.
- Confirm RF microneedling + BioRePeel as catalog services.
- Real imagery (providers + treatments) — Amber to supply; placeholders acceptable for first pass.
- Membership reframe copy → Amber approval gate.

## 10. Acceptance Criteria

- All false services (IV-as-headline, hormone therapy, generic "wellness protocols" framing) removed; real menu live.
- Every page reads in the canonical voice; passes the claims-linter hook.
- Naming consistent: "House of Rose Aesthetics," "advanced aesthetics."
- 4 service groups + detail pages populated from real Notion source; PRF types kept distinct.
- Skin Analysis, Memberships (approved copy), Providers pages exist and are linked in nav.
- Book Online CTAs resolve to GlossGenius.
- No public prices. No jewelry in main services nav. No commerce engine.
- `npm run build` + `npm run lint` green.

## 11. Out of Scope (recap)

Visual redesign · commerce/Shop engine (sub-project 2) · jewelry marketing research (sub-project 3) · SEO activation (backlogged until live).
