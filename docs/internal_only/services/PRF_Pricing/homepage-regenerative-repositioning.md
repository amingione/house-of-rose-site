# Copy Deck — Homepage Regenerative Repositioning

**Status:** Draft for Amber's review · **Target:** `homepage` singleton (Sanity) rendered by `packages/web/src/pages/index.astro`
**The move:** the competitive review's core finding is that "natural results" and "personalized" aren't yet ownable — every med spa says them. What House of Rose can own is a **method**: measured skin analysis → regenerative treatments → conservative, natural-looking work. This deck pulls that method to the front of the homepage. The full menu (injectables, facials, wellness, waxing, jewelry, shop) stays — it just stops sharing top billing with the thing that actually differentiates.

> "Allow, don't lead" on med spa stays intact: lead prose = "Medical Aesthetics Practice"; "med spa" lives in meta/SEO. No membership, no flowery/"signature" names, no discount language. NAP is canonical.

---

## What changes vs. what stays

**Leads now (top of page):** the regenerative method — skin analysis as the smart first step, then regenerative treatments (PRF, collagen induction) and conservative injectables, tied together as a *plan*.
**Stays, demoted below the fold:** the full services grid, curated home care/shop, local-authority section, providers, final CTA. Nothing is removed — the breadth is still there for people who want it; it just no longer competes with the differentiator on the first screen.
**Untouched:** NAP, hours, JSON-LD, forms, the Advanced Skin Imaging section's substance (it moves *up*, it doesn't change what it is).

---

## Hero (choose one direction)

### Current (for reference)
- Kicker: "Refined Aesthetics. Natural Results"
- Title: "HOUSE OF ROSE AESTHETICS"
- Sub: "PUNTA GORDA, FL"
- Description: "Precision-driven treatments, regenerative techniques, and personalized care designed to enhance your natural features—not change them…"

### Option A — method-forward (recommended)
- **Kicker:** Regenerative Aesthetics · Punta Gorda
- **Title:** HOUSE OF ROSE\nAESTHETICS
- **Sub:** PUNTA GORDA, FL
- **Description:** Advanced aesthetics built on a simple idea: see your skin clearly, then treat it with regenerative care that works with your own biology — PRF, collagen-building treatments, and conservative injectables that keep you looking like you. We start with analysis, not a sales pitch, and build a plan that earns each step.
- **Primary CTA:** See your skin first *(→ /skin-analysis/)*
- **Secondary CTA:** Explore regenerative care *(→ /services/)*

### Option B — outcome-forward
- **Kicker:** Regenerative Skin & Natural Results
- **Title:** HOUSE OF ROSE\nAESTHETICS
- **Sub:** PUNTA GORDA, FL
- **Description:** Results that still look like you — because we lead with regenerative treatments and measured skin analysis rather than the biggest possible menu. Fewer, better-chosen treatments, planned around your skin and your timeline.
- **Primary CTA:** Read your skin, then plan *(→ /skin-analysis/)*
- **Secondary CTA:** Meet your providers *(→ /experience/)*

**Recommendation:** Option A. It states the method (see → treat → natural) in one breath, which is the ownable position, and keeps "regenerative" as the lead noun.

---

## Proposed first-screen order

1. **Hero** (above) — regenerative method + natural results.
2. **The smart first step — Advanced Skin Imaging** (moved up from mid-page). This is the differentiator's entry point, so it should be the first thing after the hero.
3. **Why regenerative** — the PRF / collagen-induction focus, framed as a philosophy of doing less, better.
4. **Full menu** — the existing services grid (injectables, facials, wellness, waxing, jewelry). Present, complete, second.
5. **Your providers** — the small, named, credentialed team (trust asset).
6. **Punta Gorda / local** — existing local section.
7. **Curated home care / shop** — existing.
8. **Final CTA** — existing, refreshed.

---

## Section copy

### 2 · The smart first step (Advanced Skin Imaging — moves up)
**Kicker:** Start With Your Skin
**H2:** See your skin before you treat it
**Body:**
Most places sell you a treatment and hope it fits. We do it the other way around. Your first step is a skin analysis that reads what's actually happening — texture, tone, hydration, the early signs of aging — so the plan we build is answering your skin, not a script. It's evidence, not a pitch, and there's no pressure and no commitment attached to it.
**CTA:** Book your skin analysis *(→ /skin-analysis/)*

### 3 · Why regenerative
**Kicker:** Our Approach
**H2:** Treatments that work with your biology, not against it
**Body:**
Regenerative care means prompting your skin to do its own repair rather than masking the surface. PRF made from your own blood. Microneedling that rebuilds your own collagen. Injectables dosed to soften, not to freeze. It's a deliberately smaller, sharper menu — fewer treatments, chosen well and sequenced for results that build over time and still look like you. Skin changes through timing, consistency, and structure; we plan for that.
**CTA:** How the method works *(→ /experience/)*

### 4 · The full menu (existing grid — reframed intro)
**Kicker:** Services
**H2:** Everything your skin might need, under one roof
**Body:**
Beyond the regenerative core, House of Rose offers neurotoxin and filler with a registered nurse, advanced and maintenance facials, IV hydration and wellness support, facial waxing, and professional home care. Whatever you start with, it's planned by a provider who'll tell you what you *don't* need too.
**CTA:** Browse all services *(→ /services/)*

### 5 · Your providers (trust asset — new on homepage)
**Kicker:** Who Treats You
**H2:** A small team, each in their lane
**Body:**
You'll be treated by a named provider working within a defined specialty — Diana Morrison, RN for injectables and injectable PRF; Amber for advanced facials, topical PRF, and the Face Reality acne program; Brandy for facials, peels, and facial waxing. Advanced and injectable work is done under medical-director oversight. It's care with a face on it, not a rotating counter.
**CTA:** Meet the team *(→ /experience/)*

### 8 · Final CTA (refresh)
**H2:** Start where it makes sense — with your skin
**Body:**
Book a skin analysis, ask us a question, or come in for a consultation. No pressure, no upsell you didn't ask for — just a clear read on what your skin needs and a plan that respects it.
**Primary CTA:** Begin with a skin analysis *(→ /skin-analysis/)*
**Secondary CTA:** Call (844) 941-7673 *(→ tel)*

---

## Review & build notes (not for the page)

**Field mapping (homepage singleton):** `heroKicker`, `heroTitle`, `heroSubtitle`, `heroDescription`, plus the section kickers/H2s (`scanKicker`, `servicesKicker`, `aboutKicker`, `localKicker`, `careKicker`). The re-order is a section-sequence change in `index.astro` + the singleton — coordinate with the Visual Editing annotations (`data-sb-*`) so click-to-edit still maps.

**Compliance:** "Medical Aesthetics Practice" leads; "med spa" only in meta/SEO. "regenerative," "skin longevity," "natural-looking results," "a plan, not a punch card" are all on the approved palette. Avoided: "reverse aging," "anti-aging," "guaranteed," membership/"member," discount, "day spa."

**Distinct CTAs introduced (differ from all treatment/trust decks):** "See your skin first" · "Explore regenerative care" · "Read your skin, then plan" · "Meet your providers" · "Book your skin analysis" · "How the method works" · "Browse all services" · "Meet the team" · "Begin with a skin analysis." (Note: "Start with a skin analysis" already exists in the live nav — the homepage variants above are intentionally worded differently to avoid duplication.)

**Do not touch on wire-in:** NAP, hours, JSON-LD builders, contact/rent-a-room forms. Repositioning is copy + section order only.
