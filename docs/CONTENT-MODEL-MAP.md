# House of Rose — Content Model Map

> The wiring table behind `docs/SEO-AEO-PLAYBOOK.md`. For each of the 7 AEO page types this maps:
> **Sanity document type → Astro route → required JSON-LD → GROQ query → Studio location.**
> When an agent is asked to "add a cost page", "add a comparison", "add a city page", or "add a
> before/after", this file is the single source of truth for *where everything goes*. Follow it
> exactly — do not inline GROQ in pages, do not hand-roll JSON-LD, do not invent routes.

## File responsibilities (recap of AGENTS.md)

| Concern | Location |
| --- | --- |
| Sanity schemas | `packages/studio/schemas/*.ts` (registered in `schemas/index.ts`) |
| Shared schema objects | `packages/studio/schemas/objects/*.ts` (`seo`, `faq`) |
| Studio sidebar | `packages/studio/structure.ts` |
| GROQ queries + TS types | `packages/web/src/lib/queries.ts` |
| Structured-data builders | `packages/web/src/lib/structuredData.ts` |
| Sanity client / image / fetch | `packages/web/src/lib/sanity.ts` |
| Routes | `packages/web/src/pages/**` |
| Sitemap / llms.txt | `packages/web/src/pages/sitemap.xml.ts`, `llms.txt.ts` |

---

## The 7 page types → full wiring

### 1. Service page — *what it is / who it's for / process / FAQs*
- **Doc type:** `service` (`kind`: `hub` | `treatment` | `standalone`)
- **Route:** `/services/[slug]` (+ `/services`, `/services/collections/[collection]`)
- **JSON-LD:** `Service` + `BreadcrumbList` + `FAQPage` (when `faqs` present)
- **GROQ:** `SERVICE_BY_SLUG_QUERY`, `ALL_SERVICES_QUERY`, `ALL_SERVICE_SLUGS_QUERY`
- **Status:** ✅ existing

### 2. Pricing / "what affects cost" page
- **Doc type:** `costGuide`
- **Route:** `/cost/[slug]` (e.g. `prf-treatment-cost`)
- **Key fields:** `treatment` (ref → service), `priceLow`/`priceHigh`/`priceUnit`,
  `costFactors[]` (factor + effect), `whatsIncluded`, `faqs[]`, `seo`
- **JSON-LD:** `FAQPage` + `BreadcrumbList` + `Article`
- **GROQ:** `ALL_COST_GUIDES_QUERY`, `COST_GUIDE_BY_SLUG_QUERY`, `ALL_COST_GUIDE_SLUGS_QUERY`

### 3. FAQ page
- **Doc type:** none new — aggregates `faqs[]` from `service` + `costGuide` + `comparison`
- **Route:** `/faq`
- **JSON-LD:** `FAQPage`
- **GROQ:** `FAQ_AGGREGATE_QUERY`

### 4. Comparison page — *A vs B*
- **Doc type:** `comparison`
- **Route:** `/compare/[slug]` (e.g. `prf-microchanneling-vs-microneedling`)
- **Key fields:** `optionA`/`optionB` (label, summary, bestFor, service ref),
  `rows[]` (attribute, valueA, valueB), `verdict`, `faqs[]`, `seo`
- **JSON-LD:** `FAQPage` + `BreadcrumbList` + `Article`
- **GROQ:** `ALL_COMPARISONS_QUERY`, `COMPARISON_BY_SLUG_QUERY`, `ALL_COMPARISON_SLUGS_QUERY`

### 5. Local authority page — *treatment in {city}*
- **Doc type:** `localArea`
- **Route:** `/areas/[slug]` (+ `/areas` index) (e.g. `punta-gorda`, `port-charlotte`)
- **Key fields:** `city`, `region`, `intro`, `whyLocal`, `servedServices[]` (refs),
  `neighborhoods[]`, `faqs[]`, `seo`
- **JSON-LD:** `LocalBusiness` (with `areaServed`) + `BreadcrumbList` + `FAQPage`
- **GROQ:** `ALL_LOCAL_AREAS_QUERY`, `LOCAL_AREA_BY_SLUG_QUERY`, `ALL_LOCAL_AREA_SLUGS_QUERY`

### 6. Before/after / proof page
- **Doc type:** `caseStudy`
- **Route:** `/results/[slug]` (+ `/results` index)
- **Key fields:** `treatment` (ref → service), `concern` (ref), `beforeImage`, `afterImage`,
  `clientProfile`, `protocol`, `timeframe`, `outcome`, `consentGiven` (bool, gate publishing)
- **JSON-LD:** `ImageObject` (before + after) + `BreadcrumbList`
- **GROQ:** `ALL_CASE_STUDIES_QUERY`, `CASE_STUDY_BY_SLUG_QUERY`, `ALL_CASE_STUDY_SLUGS_QUERY`
- **Rule:** never publish a case study with `consentGiven != true`.

### 7. Process page
- **Doc type:** `service.process[]` (per treatment) + `experienceContent.journeySteps`
- **Route:** lives on `/services/[slug]` and `/experience`
- **JSON-LD:** inherited from the Service page
- **Status:** ✅ existing

---

## Adding a new page type (rare)

If a genuinely new type is needed, keep the contract intact:

1. Schema in `schemas/<type>.ts` using shared `seo` + `faq` objects; register in `index.ts`.
2. Add a Studio sidebar entry under the **Marketing / SEO** group in `structure.ts`.
3. Add TS type + GROQ (`ALL_*`, `*_BY_SLUG`, `ALL_*_SLUGS`) in `queries.ts`.
4. Add a structured-data builder in `structuredData.ts` (never inline JSON-LD).
5. Build the route(s); ship required JSON-LD; set `seo` meta.
6. Wire into `sitemap.xml.ts`, `llms.txt.ts`, and footer/internal links.
7. Document it here and in the playbook.

## Canonical business facts (NAP) — single source

Authoritative values live in Sanity `siteSettings` and are mirrored in
`src/lib/structuredData.ts` (`LOCAL_BUSINESS`). Never hardcode divergent values.

- **Name:** House of Rose Aesthetics (House of Rose Luxury Spa & Wellness)
- **Address:** 525 E Olympia Ave, Ste 9, Punta Gorda, FL 33950
- **Phone:** (844) 941-7376 · **Geo:** 26.9298, −82.0454
- **Booking:** https://houseofrose.glossgenius.com/services
- **Service area:** Punta Gorda, Port Charlotte, Englewood, Venice, North Port, Sarasota,
  Cape Coral — Charlotte County & SW Florida
