# Service Page Architecture

**Created:** 2026-08-10 · **Market:** US · Source: [[seo-content/content-gap-analysis/local-competitor-pass]]

This report preserves the August 2026 keyword evidence and records the current route decisions it informed. The repository's current page-type map, verified service menu, and route gates govern implementation when they differ from the point-in-time crawl.

## The model, in one line

**One canonical page per verified current service, with entity-first titles and geographic intent handled by the `localArea` page type.** Search demand can prioritize reviewed work; it cannot add an unoffered service, equate two branded systems, or override the repository's page-type architecture.

The competitor examples below support the value of substantive service pages; they are not templates to copy one-for-one:

* Skin Spot Laser Club: `/dermal-fillers/` → "derma fillers near me" #5 · `/virtue-rf/` → "virtue rf microneedling near me" #9
* Sweet Spot MediSpa: `/sculptra/` → "sculptra fort myers" #4 · `/body-contouring/` → "body contouring fort myers" #3

## Tier 1 — Money pages (build/fix first)

Ranked by volume × commercial intent. These are the pages that should carry internal authority.

| Target URL                      | Primary keyword       | Vol        | KD         | CPC        | Status                                  |
| ------------------------------- | --------------------- | ---------- | ---------- | ---------- | --------------------------------------- |
| `/services/prf-under-eyes/`     | prf under eyes        | 11,000     | **0**      | $1.70      | Canonical reviewed service route             |
| `/services/injectables/`        | botox near me         | 85,000     | 40         | $5.00      | Canonical neurotoxin service route           |
| `/services/morpheus8/`          | morpheus8             | 54,000     | **1**      | $0.70      | Exists — biggest vol×KD ratio on site   |
| `/compare/daxxify-vs-botox/`    | daxxify vs botox      | 8,200      | **0**      | $2.50      | Reviewed comparison with current inbound links |
| `/services/waxing/`             | waxing near me        | 87,000     | **1**      | $2.00      | Canonical hub for facial and body waxing     |
| `/services/microneedling/`      | microneedling near me | 26,000     | 45         | $1.80      | Canonical reviewed service route             |
| `/services/dermaplaning/`       | dermaplaning near me  | 16,000     | **0**      | $1.40      | Exists                                  |
| `/services/glo2facial/`         | glo2 facial           | 1,400      | —          | —          | One canonical Glo2Facial route               |

**Note on** `botox near me`** (KD 40) vs** `lip filler near me`** (KD 0):** the filler terms were dramatically easier than Botox in this dataset. The current `/services/dermal-fillers/` route already preserves the supported filler distinction without creating an unverified lip-filler service.

## Tier 2 — Strong secondary pages

| Target URL                                 | Primary keyword             | Vol        | KD         |
| ------------------------------------------ | --------------------------- | ---------- | ---------- |
| `/services/dermal-fillers/`                | dermal fillers near me      | 3,700      | 0          |
| `/services/rf-microneedling/` → Morpheus8  | rf microneedling            | 21,000     | 0          |
| `/services/glp-1-weight-management/`       | medical weight loss near me | 3,700      | 5          |
| `/services/lumecca-peak-ipl/`              | ipl photofacial             | 4,900      | 1          |
| `/services/biorepeel/`                     | biorepeel                   | 5,100      | 0          |
| `/services/morpheus8-body/`                | morpheus8 body              | 600        | 0          |

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

## Architecture decisions

### 1. Collections are navigation

`/services/collections/` currently holds 12 URLs, several of which duplicate a service page's target (`microchanneling-microneedling` vs `/services/microneedling/`; two separate `injectables-*` collections).

Current implementation keeps collection detail routes navigational and `noindex,follow`; canonical service routes carry the substantive reviewed education.

### 2. Cost guides are a separate canonical page type

The repository defines cost guides as one of its seven canonical page types. Keep a guide only when it adds verified pricing context and links to its related service; do not retire the whole page type from keyword-volume data alone.

### 3. Waxing has a canonical service hub

`/services/waxing/` is the substantive hub for the verified facial- and body-waxing menus. `/services/facial-waxing/` and `/services/body-waxing/` own their exact current areas, prices, durations, and booking modes.

### 4. Glo2Facial has one canonical route

`/services/glo2facial/` is the only canonical public route. The three retired variants redirect to it. Glo2Facial must remain identified as the Geneo system described in the reviewed service facts; search volume does not permit retargeting it to a different branded treatment.

## Service-page requirements

- Keep the treatment entity clear in the H1, title, and opening without forcing one repeated headline or section formula.
- Use verified menu, provider, recovery, and evidence facts; omit unresolved or unavailable details.
- Put local-service-area depth on `localArea` pages rather than inserting geographic modifiers into service-page titles or slugs.
- Link useful concerns, comparisons, costs, and provider profiles without creating orphan or duplicate routes.
- Emit the applicable typed JSON-LD through `src/lib/structuredData.ts`; publish FAQ schema only when substantive visible FAQs exist.
- Use real consented results only. An absent asset is not permission to fabricate one.

## The honest caveat

Every interior page on this site has **0 referring domains**, and the domain has 0 organic keywords. This architecture makes the site *able* to rank — it does not by itself make it rank. Local pack presence (GBP, citations, review velocity) is still the dominant factor for a Punta Gorda med spa, and none of it shows up in Ahrefs. Treat this as necessary groundwork running in parallel with the GBP work, not as a substitute for it.

Parent: [[seo-content]] · Related: [[seo-content/prf-content-briefs]] · [[seo-content/content-gap-analysis/local-competitor-pass]] · [[seo-content/cannibalization-audit]]
