# House of Rose — Content Model Map

> The wiring table behind `docs/SEO-AEO-PLAYBOOK.md`. For each of the 7 AEO page types this maps:
> **Sanity document type → Astro route → required JSON-LD → GROQ query → Studio location.**
> When an agent is asked to "add a cost page", "add a comparison", "add a city page", or "add a
> before/after", this file is the single source of truth for *where everything goes*. Follow it
> exactly — do not inline GROQ in pages, do not hand-roll JSON-LD, do not invent routes.
>
> **This file covers wiring only — not words.** During the voice reset, use Amber's latest approved
> direction plus verified facts and binding compliance rules. The Creative System's prior voice,
> vocabulary, bios, and templates are archival and must not be used as a tonal model.

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

### 1. Service page — *what it is / verified decision support for the search intent*
- **Doc type:** `service` (`kind`: `hub` | `treatment` | `standalone`)
- **Route:** `/services/[slug]` (+ `/services`, `/services/collections/[collection]`)
- **JSON-LD:** `Service` + `BreadcrumbList` + `FAQPage` (when `faqs` present)
- **GROQ:** `SERVICE_BY_SLUG_QUERY`, `ALL_SERVICES_QUERY`, `ALL_SERVICE_SLUGS_QUERY`
- **Status:** ✅ existing

### 2. Pricing page
- **Doc type:** `costGuide`
- **Route:** `/cost/[slug]` (e.g. `prf-treatment-cost`)
- **Public content:** `treatment` (ref → service) plus the reviewed cost-facts overlay in website code;
  publish the verified current amount or range and its menu context
- **Legacy source fields:** `priceLow`/`priceHigh`/`priceUnit`, `costFactors[]`, `whatsIncluded`, and
  `faqs[]` remain stored but are read-only in Studio and are not public copy authority
- **JSON-LD:** `BreadcrumbList` + `Article` + `FAQPage` when reviewed `faqs` are published
- **GROQ:** `ALL_COST_GUIDES_QUERY`, `COST_GUIDE_BY_SLUG_QUERY`, `ALL_COST_GUIDE_SLUGS_QUERY`

### 3. FAQ page
- **Doc type:** none — the current route uses one reviewed local set rather than aggregating every
  CMS question into a generic page
- **Route:** `/faq`
- **JSON-LD:** `FAQPage`
- **GROQ:** none while the reviewed local set is in effect

### 4. Comparison page — *A vs B*
- **Doc type:** `comparison`
- **Route:** `/compare/[slug]` (e.g. `daxxify-vs-botox`)
- **Active CMS inputs:** `slug`, `status`, `optionA.service`, `optionB.service`, and `orderRank` establish
  route eligibility, live service relationships, and ordering; public comparison prose comes from the
  reviewed website overlay
- **Legacy source fields:** `intro`, option labels/summaries/distinctions, `rows[]`, `verdict`, `faqs[]`,
  and `seo` remain stored but are read-only in Studio and are not public copy authority
- **JSON-LD:** `BreadcrumbList` + `Article` + `FAQPage` when reviewed `faqs` are published
- **GROQ:** `ALL_COMPARISONS_QUERY`, `COMPARISON_BY_SLUG_QUERY`, `ALL_COMPARISON_SLUGS_QUERY`

### 5. Local authority page — *treatment in {city}*
- **Doc type:** `localArea`
- **Route:** `/areas/[slug]` (+ `/areas` index) (e.g. `punta-gorda`, `port-charlotte`)
- **Active CMS inputs:** `slug`, `city`, `region`, `servedServices[]`, `neighborhoods[]`, `image`, and
  `orderRank`; the website constrains routes to its reviewed area inventory and generates public location
  copy, FAQs, and metadata from verified practice and area facts
- **Legacy source fields:** `intro`, `whyLocal`, `faqs[]`, and `seo` remain stored but are read-only in
  Studio and are not public copy authority
- **JSON-LD:** `LocalBusiness` (with `areaServed`) + `BreadcrumbList` + `FAQPage` when reviewed `faqs` are published
- **GROQ:** `ALL_LOCAL_AREAS_QUERY`, `LOCAL_AREA_BY_SLUG_QUERY`, `ALL_LOCAL_AREA_SLUGS_QUERY`

### 6. Before/after / proof page
- **Doc type:** `caseStudy`
- **Route:** `/results/[slug]` (+ `/results` index)
- **Key fields:** `treatment` (ref → service), `concern` (ref), `beforeImage`, `afterImage`,
  `clientProfile`, `protocol`, `timeframe`, `outcome`, `consentGiven` (bool, gate publishing)
- **JSON-LD:** `ImageObject` (before + after) + `BreadcrumbList`
- **GROQ:** `ALL_CASE_STUDIES_QUERY`, `CASE_STUDY_BY_SLUG_QUERY`, `ALL_CASE_STUDY_SLUGS_QUERY`
- **Rule:** never publish a case study with `consentGiven != true`.

### 7. Appointment information
- **Doc type:** `service.process[]` (per treatment) + `experienceContent.journeySteps`
- **Route:** lives on `/services/[slug]` and `/experience`
- **JSON-LD:** inherited from the Service page
- **Status:** ✅ existing
- **Voice boundary:** the legacy field name remains for source compatibility. Use it only for verified,
  useful visit details; it is not a requirement to narrate a sequence on every service or use process
  language as brand positioning.

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

## Supporting identity pages (outside the 7 intent-led AEO types)

About and provider profiles support entity clarity and local trust but are not new service-intent page types.

| Surface | Sanity source | Route | JSON-LD | GROQ |
| --- | --- | --- | --- | --- |
| About index + practice story | `aboutPage` singleton | `/about/`, `/about/hra/` | `WebPage` + `BreadcrumbList` | `ABOUT_PAGE_QUERY` |
| Provider directory | `provider` documents | `/about/providers/` | `CollectionPage` + `ItemList` + `BreadcrumbList` | `PUBLIC_PROVIDERS_QUERY` |
| Provider profile | `provider` document | `/about/providers/[slug]/` | `Person` / `ProfilePage` + `BreadcrumbList` | `PUBLIC_PROVIDERS_QUERY`, `PUBLIC_PROVIDER_BY_SLUG_QUERY` |

These pages use the same trailing-slash, internal-linking, sitemap, and `llms.txt` rules as the seven canonical page types. Existing `/amber/`, `/diana/`, and `/brandy/` routes remain standalone tap-to-share cards rather than canonical biography pages.

## Canonical business facts (NAP) — single source

Authoritative values live in Sanity `siteSettings` and are mirrored in
`src/lib/structuredData.ts` (`LOCAL_BUSINESS`). Never hardcode divergent values.

- **Name:** House of Rose Aesthetics
- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950
- **Phone:** (844) 941-7673 · **Geo:** 26.9298, −82.0454
- **Booking:** https://houseofrose.glossgenius.com/services
- **Service area:** Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch,
  Burnt Store Marina, Punta Gorda Isles — Charlotte County & SW Florida
