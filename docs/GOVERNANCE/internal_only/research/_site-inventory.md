# House of Rose — Phase-1 Site Inventory

**Date:** 2026-07-12
**Scope:** every file in `packages/web/src/pages/**`, every schema in `packages/studio/schemas/**`, sitemap/llms feeds, Netlify functions, and `packages/web/netlify.toml`.
**Method:** every page file was read in full; data sources traced to `packages/web/src/lib/queries.ts`; JSON-LD traced to `packages/web/src/lib/structuredData.ts` / `SchemaMarkup.astro`.

**Baseline:** `BaseLayout.astro` emits `siteEntityGraph()` (HealthAndBeautyBusiness + WebSite + WebPage + primary ImageObject `@graph`) on **every** page that uses it. "JSON-LD: none" below means *no page-level schema beyond that baseline*. The three digital-card pages (`/amber/`, `/diana/`, `/brandy/`) do **not** use BaseLayout and get no entity graph.

---

## 1. Route inventory

Legend: **GG** = GlossGenius booking (`https://houseofrose.glossgenius.com/services`) · **tel** = `tel:+18449417673` · **sms** = `sms:+18449417673` · ⚠️ = anomaly detailed in §7.

### 1.1 Core pages

| # | Route | Source file | Data source (doc type · query) | JSON-LD (page-level) | CTAs | Outbound internal body links |
|---|-------|-------------|-------------------------------|----------------------|------|------------------------------|
| 1 | `/` | `index.astro` | `homepage` singleton · `HOMEPAGE_QUERY` (+ hardcoded fallbacks) | none | "Book Your Skin Analysis" → `/skin-analysis` ⚠️no-slash · "Explore Services" → `/services` ⚠️ · "View All Services" → `/services` ⚠️ · "Learn About Advanced Skin Imaging" → `/skin-analysis` ⚠️ · "Book Your Scan" → GG · "Shop Skincare" → `/shop` ⚠️ · "Book Online" → GG · "Contact Us" → `/contact` ⚠️ · "Start Your Consultation" → GG | `/services`, `/skin-analysis`, `/shop`, `/contact` — **all without trailing slash** ⚠️ |
| 2 | `/services/` | `services/index.astro` | `service` · `ALL_SERVICES_QUERY` | none | tel button · "Book Online" → GG · "Read the Guide →" | `/services/[slug]` via `ServiceCard`, `/guides/microchanneling-prf/` ✅ |
| 3 | `/services/[slug]/` | `services/[slug].astro` | `service` · `SERVICE_BY_SLUG_QUERY` + `ALL_SERVICE_SLUGS_QUERY` | **Inline hand-rolled** `Service`/`BreadcrumbList`/`FAQPage` ⚠️ | tel · "Book Online" → GG · card links | back-link → parent/`/services` ⚠️, hub treatments ⚠️, related ⚠️. `Astro.redirect('/services',307)` on miss ⚠️ |
| 4 | `/services/collections/` | `services/collections/index.astro` | `serviceCollection` · `ALL_COLLECTIONS_QUERY` | none | "View Collection" ⚠️ | collection pages, `/services/{slug}` chips ⚠️ |
| 5 | `/services/collections/[collection]/` | `services/collections/[collection].astro` | `serviceCollection` · `COLLECTION_BY_SLUG_QUERY` + `ALL_COLLECTION_SLUGS_QUERY` | none | service cards | "← All Collections" ⚠️, `/services/{slug}` ⚠️. `Astro.redirect` ⚠️ |
| 6 | `/shop/jane-iredale/` | `shop/jane-iredale.astro` | `janeIredalePage` · `JANE_IREDALE_PAGE_QUERY` | `brand()`+`breadcrumbList()`+`faqPage()` ✅ | tel · "Shop All Products" | `/shop/`, `/services/` ✅ |
| 9 | `/experience/` | `experience.astro` | `experienceContent` · `EXPERIENCE_CONTENT_QUERY` | none | tel · GG | **No internal body links** ⚠️ |
| 10 | `/faq/` | `faq.astro` | aggregates service/costGuide/comparison/localArea FAQs · `FAQ_AGGREGATE_QUERY` | `faqPage()`+`breadcrumbList()` ✅ | tel · "Book a Consult" → GG | "View page →" → services/cost/compare/areas — all ⚠️no-slash (`routeFor`) |
| 11 | `/support/` | `support.astro` | `supportPage` · `SUPPORT_PAGE_QUERY` | `faqPage()`+`breadcrumbList()` ✅ | tel · mailto info@ · GG · "Contact House of Rose" → `/contact/` ✅ | `/contact/` |
| 12 | `/contact/` | `contact.astro` | `contactPage` · **inline GROQ in page** ⚠️ | none | tel · "Schedule Now" → GG · maps · form · "Get Directions" | `/privacy-policy` ×2 ⚠️. ⚠️ **Maps URLs use `Ste+9`** — NAP drift |
| 13 | `/skin-analysis/` | `skin-analysis.astro` | `skinAnalysis` · **inline GROQ in page** ⚠️ | `service()`+`breadcrumbList()`+`faqPage()` ✅ | "Book Your Scan" → GG · "View Services" ⚠️ · form · "Review the services menu" → GG | `/services` ⚠️, concern chips `/concerns/{slug}` ×6 ⚠️ |
| 14 | `/rent-a-room/` | `rent-a-room.astro` | `rentARoom` · **inline GROQ in page** ⚠️ | none | "Apply Now" → `#apply` · form · tel · "Email Us" → mailto | **No internal body links** (anchors only) ⚠️ |

### 1.2 Shop & checkout

| # | Route | Source file | Data source | JSON-LD | CTAs | Outbound internal body links |
|---|-------|-------------|-------------|---------|------|------------------------------|
| 15 | `/shop/` | `shop.astro` | `product`+`promotion`+`shopBrand` · `ALL_PRODUCTS_QUERY`,`ALL_PROMOTIONS_QUERY`,`ALL_SHOP_BRANDS_QUERY` | none | "Call to Order" → tel; component CTAs | `/services/face-reality-acne-program` ⚠️; product cards → `/shop/{slug}` |
| 16 | `/shop/[slug]/` | `shop/[slug].astro` | `product` · `PRODUCT_BY_SLUG_QUERY` + `ALL_PRODUCT_SLUGS_QUERY` | **Inline hand-rolled** `Product`+`Offer` ⚠️ | Add-to-cart / external purchaseUrl / tel | "← Back to Shop" ⚠️; related cards. ✅ **throws** on miss (sanctioned) |
| 17 | `/checkout/` | `checkout.astro` | static cart + Stripe Elements; `shipping-rates`+`create-payment-intent` fns | none (`noindex`) | "Pay {total}" · "Browse the Shop" → `/shop/` ✅ | `/shop/`; return_url → `/order-confirmed/` |
| 18 | `/order-confirmed/` | `order-confirmed.astro` | static (Stripe.js verify; clears cart) | none (`noindex`) | "Continue Shopping" → `/shop/` · "Contact Us" → `/contact/` · "Try Again" → `/checkout/` · tel | `/shop/`,`/contact/`,`/checkout/` ✅ |
| 19 | `/thank-you/` | `thank-you.astro` | `thankYou` · **inline GROQ in page** ⚠️ | none (`noindex nofollow`) | "Back to Home" → `/` · GG | `/` |

### 1.3 AEO / marketing page types

| # | Route | Source file | Data source | JSON-LD | CTAs | Outbound internal body links |
|---|-------|-------------|-------------|---------|------|------------------------------|
| 20 | `/cost/[slug]/` | `cost/[slug].astro` | `costGuide` · `COST_GUIDE_BY_SLUG_QUERY` + `ALL_COST_GUIDE_SLUGS_QUERY` | `breadcrumbList()`+`article()`+`faqPage()` ✅ | tel · GG | "← Explore {treatment}" → `/services/{slug}` ⚠️. ⚠️ Breadcrumb cites `/cost/` — no index. `Astro.redirect` ⚠️ |
| 21 | `/compare/[slug]/` | `compare/[slug].astro` | `comparison` · `COMPARISON_BY_SLUG_QUERY` + `ALL_COMPARISON_SLUGS_QUERY` | `breadcrumbList()`+`article()`+`faqPage()` ✅ | tel · "Book a Consult" → GG | "View {service}" ⚠️. ⚠️ Breadcrumb cites `/compare/` — no index. `Astro.redirect` ⚠️ |
| 22 | `/areas/` | `areas/index.astro` | `localArea` · `ALL_LOCAL_AREAS_QUERY` | `breadcrumbList()` ✅ | cards | `/areas/{slug}` ⚠️ |
| 23 | `/areas/[slug]/` | `areas/[slug].astro` | `localArea` · `LOCAL_AREA_BY_SLUG_QUERY` + `ALL_LOCAL_AREA_SLUGS_QUERY` | `localBusiness()`+`breadcrumbList()`+`faqPage()` ✅ | tel · GG | served services ⚠️. `Astro.redirect` ⚠️ |
| 24 | `/results/` | `results/index.astro` | `caseStudy` · `ALL_CASE_STUDIES_QUERY` (consent-gated) | `breadcrumbList()` ✅ | cards | `/results/{slug}` ⚠️. **Empty state = dead-end** ⚠️ |
| 25 | `/results/[slug]/` | `results/[slug].astro` | `caseStudy` · `CASE_STUDY_BY_SLUG_QUERY` + `ALL_CASE_STUDY_SLUGS_QUERY` (double consent gate) | `breadcrumbList()`+`imageObject()`×2 ✅ | tel · "Book a Consult" → GG | "← All Results" ⚠️, "← Explore {treatment}" ⚠️. `Astro.redirect` ⚠️ |
| 26 | `/concerns/[slug]/` | `concerns/[slug].astro` | `concern` · `CONCERN_BY_SLUG_QUERY` + `ALL_CONCERN_SLUGS_QUERY` | **none — zero page-level JSON-LD** ⚠️ | tel · GG | "← All Services" ⚠️, treatment cards ⚠️. `Astro.redirect` ⚠️. **No `/concerns/` index** ⚠️ |
| 27 | `/blog/` | `blog/index.astro` | `blogPost` · `ALL_BLOG_POSTS_QUERY` | none | "Read" cards · "Book a Consultation" → GG | `/blog/{slug}` ⚠️ |
| 28 | `/blog/[slug]/` | `blog/[slug].astro` | `blogPost` · `BLOG_POST_BY_SLUG_QUERY` + `ALL_BLOG_POST_SLUGS_QUERY` | **Inline hand-rolled** `BlogPosting`+`BreadcrumbList` ⚠️ (`/blog` no-slash) | "Learn More" → `/services/{slug}` ⚠️ · GG | `/blog` ⚠️, `/services/{slug}` ⚠️. `Astro.redirect` ⚠️ |
| 29 | `/packages/` | `packages/index.astro` | `treatmentPackage` · `ALL_TREATMENT_PACKAGES_QUERY` | none | tel · GG | package cards → `/packages/{slug}`. **ORPHAN cluster** ⚠️ |
| 30 | `/packages/[slug]/` | `packages/[slug].astro` | `treatmentPackage` · `TREATMENT_PACKAGE_BY_SLUG_QUERY` + `ALL_TREATMENT_PACKAGE_SLUGS_QUERY` | **Inline hand-rolled** `Service`+`OfferCatalog`+`BreadcrumbList` ⚠️ | tel · GG | "← All Packages" ⚠️, included services ⚠️. `Astro.redirect` ⚠️ |
| 31 | `/guides/microchanneling-prf/` | `guides/microchanneling-prf.astro` | **static/hardcoded** (from `docs/GOVERNANCE/internal_only/services/microchanneling/`) | `breadcrumbList()`+`article()`+`faqPage()` ✅ | tel · sms · GG · "Compare the two →" | Richest link page, all ✅ trailing-slash. ⚠️ Breadcrumb cites `/guides/` — no index |

### 1.4 Legal, cards & utilities

| # | Route | Source file | Data source | JSON-LD | CTAs | Outbound internal body links |
|---|-------|-------------|-------------|---------|------|------------------------------|
| 32 | `/privacy-policy/` | `privacy-policy.astro` | `privacyPolicy` · **inline GROQ** ⚠️ | **none** ⚠️ (terms sibling ships webPage) | form | none ⚠️ |
| 33 | `/terms-of-service/` | `terms-of-service.astro` | `termsOfService` · `TERMS_OF_SERVICE_QUERY` | `webPage()`+`breadcrumbList()` ✅ | none | **No internal body links** ⚠️ |
| 34 | `/amber/` | `amber.astro` | static (own head, no BaseLayout) | `personProfile()` ✅ | "+ Save My Contact" → `/amber.vcf` · tel · maps | none (card). Not in sitemap; **not noindexed** ⚠️ |
| 35 | `/diana/` | `diana.astro` | static | `personProfile()` ✅ | vcf · tel | same ⚠️ |
| 36 | `/brandy/` | `brandy.astro` | static | `personProfile()` ✅ | vcf · tel | same ⚠️ |
| 37 | `/sitemap/` | `sitemap.astro` | HTML sitemap — 9 doc-type queries | `breadcrumbList()` ✅ | n/a | Nearly every route, all ✅. ⚠️ Missing support/makeup-trio/guide/products |
| 38 | `/sitemap.xml` | `sitemap.xml.ts` | see §3 | n/a | n/a | n/a |
| 39 | `/llms.txt` · `/llms-full.txt` | `llms.txt.ts` · `llms-full.txt.ts` | see §3 | n/a | n/a | n/a |

---

## 2. Studio schema inventory (`packages/studio/schemas/`) — 31 types, all registered in `index.ts`

`objects/seo`, `objects/faq` (shared) · `siteSettings` (BaseLayout→every page) · singletons: `homepage`,`thankYou`,`skinAnalysis`,`contactPage`,`supportPage`,`termsOfService`,`privacyPolicy`,`rentARoom`,`janeIredalePage`,`experienceContent` · content types: `serviceCollection`,`service`,`concern`,`product`,`promotion`,`shopBrand`,`blogPost`,`treatmentPackage`,`costGuide`,`comparison`,`localArea`,`caseStudy` · operational (studio-only): `leadSubmission`,`order` · reference-only: `provider` · **dead code: `brandProfile`** (`BRAND_PROFILE_QUERY` defined, never imported by a page).

---

## 3. Generated feeds — coverage

**sitemap.xml** includes core + Jane Iredale products + dynamic services/blog/collections/concerns/packages/cost/compare/areas/results (all trailing-slash). Product detail pages and digital cards remain intentionally excluded. Correctly excludes noindex checkout flow.

**llms.txt** ⚠️ missing: shop(+products), guide, makeup trio, concerns, individual packages/results, privacy; `ALL_SERVICES_QUERY` excludes `kind=="treatment"` so treatment pages absent.

**llms-full.txt** ⚠️ missing faq/support/areas/results/cost/compare/concerns/guides/shop/makeup. **Content drift**: Brand-Voice block says *"Do not describe the business as a 'med spa'…"* — contradicts current allow-don't-lead rule; served to answer engines.

---

## 4. Netlify functions (`packages/web/netlify/functions/`)

`lead-submit.ts` (leadSubmission writes → /thank-you/) · `privacy-contact.ts` (Resend email) · `shipping-rates.ts` (Shippo quote) · `create-payment-intent.ts` (server-recomputes money + order doc) · `stripe-webhook.ts` (paid + confirmation email) · `buy-label.ts` (on-demand Shippo label) · `order-shipped.ts` (tracking email) · `_lib/cart.ts` (server cart) · `_lib/email.ts` (Resend) · `_lib/shippo.ts` (Shippo REST).

---

## 5. `packages/web/netlify.toml` — redirects

5 renamed package slugs → new slugs (301); `/memberships/*`, `/rose-circle/*`, and `/plans/*` → `/404.html` (forced 404, permanent teardown); `/* → /404.html` (404). Headers: security + immutable `/_astro/*` + vcards inline. `PUBLIC_COMING_SOON=true` prod only.

---

## 6. GROQ usage

**Dead:** `BRAND_PROFILE_QUERY`. **Inline GROQ living in pages** ⚠️ (violates "GROQ lives in queries.ts"): `contact.astro`, `skin-analysis.astro`, `rent-a-room.astro`, `privacy-policy.astro`, `thank-you.astro`, `llms-full.txt.ts` (`SERVICES_FULL_QUERY`).

---

## 7. Gaps & anomalies (summary — see `_audit-report.md` for the fix log)

1. **CLAUDE.md routes table missing ~16 live routes** (blog, packages, concerns, checkout flow, guide, legal, sitemap/llms feeds).
2. **Forbidden `Astro.redirect()` in 9 prerendered routes** (services/[slug], collections/[collection], cost, compare, areas, results, concerns, blog, packages) — latent build-breaker.
3. **Hand-rolled inline JSON-LD** in services/[slug], blog/[slug], packages/[slug], shop/[slug] (no `product()`/`blogPosting()` builder yet).
4. **Pages with no page-level JSON-LD** that should have some: concerns/[slug] (worst), collections index+child, privacy-policy.
5. **Trailing-slash violations ~44** across shared components + templates.
6. **NAP drift** "Ste 9" in contact.astro maps links.
7. **Stale med-spa denial** in llms-full.txt.ts served to answer engines.
8. **Feed gaps** (sitemap.xml/HTML sitemap/llms) — makeup trio, shop products, guide, etc.
9. **Breadcrumbs cite non-existent hubs** `/cost/`,`/compare/`,`/guides/` (404).
10. **Orphan clusters**: `/packages/**` (14) and `/services/collections/**` (5) — no inbound body/nav links.
11. **Dead-ends**: /experience/, /rent-a-room/, /results/ (empty), /blog/ (empty), /contact/.
12. **Dead code / loose ends**: `brandProfile`+`BRAND_PROFILE_QUERY`; digital cards indexable but absent from sitemap (policy needed); 5 singletons keep GROQ inline.
