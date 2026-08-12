# Service Page Architecture

**Created:** 2026-08-10 · **Market:** US · Source: [[seo-content/content-gap-analysis/local-competitor-pass]]

The full target-URL map for houseofrosefl.com, built on the finding that local med spas rank via **service pages on "near me" terms**, not blog content. Current state: 201 live pages, 39 under `/services/`, 0 organic keywords.

## The model, in one line

**One page per treatment, targeting** `[treatment] near me`**, with location in the copy and schema — not in the title.** Punta Gorda geo-terms have ~0 search volume; the "near me" variants total 447,400/mo and resolve through the local pack.

Both ranking local competitors do exactly this and nothing else:

* Skin Spot Laser Club: `/dermal-fillers/` → "derma fillers near me" #5 · `/virtue-rf/` → "virtue rf microneedling near me" #9
* Sweet Spot MediSpa: `/sculptra/` → "sculptra fort myers" #4 · `/body-contouring/` → "body contouring fort myers" #3

## Tier 1 — Money pages (build/fix first)

Ranked by volume × commercial intent. These are the pages that should carry internal authority.

| Target URL                      | Primary keyword       | Vol        | KD         | CPC        | Status                                  |
| ------------------------------- | --------------------- | ---------- | ---------- | ---------- | --------------------------------------- |
| `/services/prf-under-eyes/`     | prf under eyes        | 11,000     | **0**      | $1.70      | ⚠️ **MISSING — build it**               |
| `/services/injectables/`        | botox near me         | 85,000     | 40         | $5.00      | Exists — needs "near me" targeting      |
| `/services/morpheus8/`          | morpheus8             | 54,000     | **1**      | $0.70      | Exists — biggest vol×KD ratio on site   |
| `/compare/daxxify-vs-botox/`    | daxxify vs botox      | 8,200      | **0**      | $2.50      | Exists — needs internal links           |
| `/services/collections/waxing/` | waxing near me        | 87,000     | **1**      | $2.00      | ⚠️ Collection, should be a service page |
| `/services/facials/`            | facial near me        | 77,000     | 18         | $1.20      | Two collections — merge                 |
| `/services/lash-lift/`          | lash lift             | 66,000     | **0**      | $0.35      | Exists                                  |
| `/services/microneedling/`      | microneedling near me | 26,000     | 45         | $1.80      | Exists — resolve vs collection          |
| `/services/dermaplaning/`       | dermaplaning near me  | 16,000     | **0**      | $1.40      | Exists                                  |
| `/services/glo2facial/`         | hydrafacial near me   | 26,000     | **0**      | $1.60      | 4 variants — collapse to 1              |

**Note on** `botox near me`** (KD 40) vs** `lip filler near me`** (KD 0):** the filler terms are dramatically easier than Botox. `dermal fillers near me` (3,700, KD 0) and `lip filler near me` (27,000, KD 0) deserve their own page split out from `/services/injectables/`.

## Tier 2 — Strong secondary pages

| Target URL                                 | Primary keyword             | Vol        | KD         |
| ------------------------------------------ | --------------------------- | ---------- | ---------- |
| `/services/dermal-fillers/`                | lip filler near me          | 27,000     | 0          |
| `/services/brazilian-wax/`                 | brazilian wax near me       | 51,000     | 21         |
| `/services/lash-lift-tint/`                | lash lift and tint          | 26,000     | 0          |
| `/services/rf-microneedling/` → Morpheus8  | rf microneedling            | 21,000     | 0          |
| `/services/chemical-peels/`                | chemical peel near me       | 11,000     | 0          |
| `/services/glp-1-weight-management/`       | medical weight loss near me | 3,700      | 5          |
| `/services/lumecca-peak-ipl/`              | ipl photofacial             | 4,900      | 1          |
| `/services/collections/permanent-jewelry/` | permanent jewelry near me   | 14,000     | 17         |
| `/services/biorepeel/`                     | biorepeel                   | 5,100      | 0          |
| `/services/procell-microchanneling/`       | procell microchanneling     | 3,800      | 1          |
| `/services/morpheus8-body/`                | morpheus8 body              | 600        | 0          |
| `/services/full-glam-bridal-makeup/`       | makeup artist near me       | 13,000     | 0          |

`makeup artist near me` at 13,000/mo KD 0 is an overlooked asset — the bridal/event makeup pages have real search demand behind them.

## Tier 3 — Concern pages (keep, they work)

The `/concerns/` tree is well-built and does not cannibalize the service pages. It maps problems → treatments:

| URL                                                                      | Supporting keyword             | Vol        | KD         |
| ------------------------------------------------------------------------ | ------------------------------ | ---------- | ---------- |
| `/concerns/ingrown-hair/`                                                | ingrown hair treatment         | 14,000     | 52         |
| `/concerns/sun-damage/`                                                  | sun damage treatment           | 400        | 15         |
| `/concerns/active-acne/`                                                 | acne facial near me            | 1,900      | 0          |
| `/concerns/stretch-marks/`                                               | stretch mark treatment near me | 250        | 0          |
| `/concerns/aging/`, `/concerns/fine-lines-laxity/`, `/concerns/texture/` | route to services              | —          | —          |

**Each concern page should link down to 2-4 service pages.** That is their job — capture problem-aware search, route to treatment.

## Structural fixes required

### 1. Collections are competing with service pages

`/services/collections/` currently holds 12 URLs, several of which duplicate a service page's target (`microchanneling-microneedling` vs `/services/microneedling/`; two separate `injectables-*` collections).

**Fix:** collections become **navigational only** — a list of links, no keyword-targeted body copy, or `noindex`. They route; they do not rank.

### 2. The `/cost/` folder should not exist

All 8 cost pages target `[treatment] cost punta gorda` — a pattern with ~0 volume. But the national terms are real: `microneedling cost` 5,600, `morpheus8 cost` 3,200.

**Fix:** 301 each cost page into a **pricing section on its matching service page**. Keep the content, lose the URL. One exception worth testing: `/cost/morpheus8-cost-punta-gorda/` → retarget as `morpheus8 cost` (3,200, KD 0) without the geo suffix, if it has substantive unique content.

### 3. Waxing is a collection but should be a service page

`waxing near me` is 87,000/mo at **KD 1** — one of the best volume-to-difficulty ratios available, and it feeds the European Wax Center membership model. It currently lives at `/services/collections/waxing/` with `/services/facial-waxing/` beside it.

**Fix:** build `/services/waxing/` as a real service page targeting `waxing near me`, with `/services/brazilian-wax/` (51,000) split out beneath it.

### 4. Missing: a membership page

European Wax Center's engine is the Wax Pass, and Skin Spot Laser Club already ranks #8 for "laser hair removal membership" with `/unlimited-laser-hair/`.

**Fix:** build `/memberships/` targeting `waxing membership` (150, KD 0) + `wax pass` (300, KD 0) + `laser hair removal membership` (100, KD 0). Low volume, but it is a proven local structure and a retention mechanism, not just a ranking play.

### 5. Glo2Facial has 4 near-identical URLs

`/services/glo2facial/`, `-prf/`, `-procell-md/`, `-procell-pro/` all target "glo2facial" (1,400).

**Fix:** one page, add-ons as tiers/options on it. 301 the three variants. Target `hydrafacial near me` (26,000, KD 0) as the head term — Glo2Facial is the branded device; hydrafacial is what people search.

## Page template — every service page

1. **H1:** `[Treatment] in Punta Gorda` (body copy carries the "near me" intent; H1 stays human)
2. **Title tag:** `[Treatment] Near Me | Punta Gorda & Port Charlotte | House of Rose`
3. Opening 100 words: what it is, what it does, who it's for
4. **H2: What is [treatment]?**
5. **H2: What it treats** — link to matching `/concerns/` pages
6. **H2: What to expect** — step by step, honest downtime
7. **H2: Results** — real before/after photos, consented
8. **H2: Pricing** — real numbers (absorbs the retired `/cost/` page)
9. **H2: Who performs it** — named provider + photo (the "named-provider intimacy" differentiator)
10. **H2: FAQ** — 5-8 questions, FAQPage schema
11. **CTA** + NAP block: address, phone, hours, service-area names
12. **Schema:** MedicalProcedure + FAQPage + LocalBusiness

## Priority sequence

1. **Google Business Profile first.** 447,400 monthly "near me" searches resolve in the local pack. No page change competes with this.
2. **Build** `/services/prf-under-eyes/` — 11,000/mo, KD 0, missing today. See [[seo-content/prf-content-briefs]].
3. **Run the PRF consolidation** — 10 URLs → 4. Biggest signal dilution on the site.
4. **Fix collections vs service pages** — strip or noindex competing collection copy.
5. **Retire** `/cost/` — 301 into service-page pricing sections.
6. **Build** `/services/waxing/` — 87,000/mo at KD 1, currently only a collection.
7. **Point internal links at** `/compare/daxxify-vs-botox/` — 8,200/mo, KD 0, no authority behind it today.
8. **Build** `/memberships/` — copy the Wax Pass model.
9. **Collapse Glo2Facial** 4 → 1, retarget to `hydrafacial near me`.
10. Then the blog gaps from [[seo-content/content-gap-analysis]].

## The honest caveat

Every interior page on this site has **0 referring domains**, and the domain has 0 organic keywords. This architecture makes the site *able* to rank — it does not by itself make it rank. Local pack presence (GBP, citations, review velocity) is still the dominant factor for a Punta Gorda med spa, and none of it shows up in Ahrefs. Treat this as necessary groundwork running in parallel with the GBP work, not as a substitute for it.

Parent: [[seo-content]] · Related: [[seo-content/prf-content-briefs]] · [[seo-content/content-gap-analysis/local-competitor-pass]] · [[seo-content/cannibalization-audit]]
