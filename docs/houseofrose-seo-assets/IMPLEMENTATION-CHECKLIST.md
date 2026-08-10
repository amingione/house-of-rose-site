# House of Rose — SEO Implementation Checklist

Work top to bottom. Each item is a discrete task; check it off as you go.
Assets referenced live in this `houseofrose-seo-assets/` folder. Full rationale is in `houseofrosefl-seo-strategy.md`.

---

## Phase 0 — Foundations (do first, ~half a day)

- [ ] Copy `src/config/business.ts` into the repo and **fill every `TODO`** (address, phone in E.164, exact geo coords, hours, and `sameAs` profile URLs). Keep these identical to Google Business Profile / Yelp / Facebook.
- [ ] Copy the 4 components from `src/components/seo/` into the repo.
- [ ] Add to your **base layout `<head>`**:
  - [ ] `<SchemaMedicalBusiness />` (once, site-wide)
  - [ ] `<link rel="canonical" href={Astro.url.href} />`
- [ ] Confirm `/services/` is in the **main navigation** (strongest discovery signal).
- [ ] Remove the live `/memberships/` page and add a **301 redirect** → `/services/` (you don't offer memberships).
- [ ] Deploy, then in GSC **Request Indexing** for `/services/` and the homepage.

## Phase 1 — Google Business Profile & reviews (parallel, ongoing)

- [ ] Claim/complete Google Business Profile: primary category **Medical spa**; add secondary categories; list all services; add real photos; set hours.
- [ ] Verify NAP is identical on Yelp, Facebook, Apple Maps, Bing Places, healthgrades.
- [ ] Stand up a **review-request routine** (text/email after each visit); reply to every review.
- [ ] Embed a Google Map + full NAP in the site footer.

## Phase 2 — Ship the service pages (build & deploy)

> Each page: have your **medical director review clinical claims**, and **replace illustrative pricing** with real numbers, before publishing. Validate at search.google.com/test/rich-results after deploy.

- [ ] `services/morpheus8.astro` — Morpheus8 (flagship) ⭐
- [ ] `services/lip-fillers.astro` — Lip fillers
- [ ] `services/iv-hydration-therapy.astro` — IV hydration therapy
- [ ] `services/microneedling.astro` — Microneedling
- [ ] `services/prp-microneedling.astro` — PRP microneedling
- [ ] `services/prf.astro` — PRF
- [ ] `services/microchanneling.astro` — Microchanneling
- [ ] `services/biorepeel.astro` — BioRePeel
- [ ] `services/botox.astro` — Botox / Dysport / Xeomin / Sculptra
- [ ] (existing) confirm `services/dermal-fillers/`, `services/facials/`, `services/skin-analysis/` follow the same template (title, FAQ + schema, before/afters, provider bio)
- [ ] For each page: add real **before/after photos** + **provider bio** (E-E-A-T).
- [ ] Set every title to `{Service} in {City}, FL | House of Rose Aesthetics`.
- [ ] After deploy: **Request Indexing** for each in GSC.

## Phase 3 — Location pages

- [ ] `areas/fort-myers.astro` — priority (biggest search volume)
- [ ] `areas/cape-coral.astro`
- [ ] `areas/port-charlotte.astro`
- [ ] Strengthen existing `areas/punta-gorda/` to match the template.
- [ ] Cross-link: each location page → all services; each service page → nearest location page(s).
- [ ] ⚠️ Never claim a physical address you don't have — the Fort Myers/Cape Coral pages are written as honest "serving" pages. Keep it that way.

## Phase 4 — Content that feeds AI Overviews (2–4 / month)

- [ ] `blog/morpheus8-vs-microneedling.astro` ✅ (built)
- [ ] `blog/prf-vs-prp.astro` ✅ (built)
- [ ] `blog/morpheus8-cost-southwest-florida.astro` ✅ (built)
- [ ] `blog/botox-vs-dysport-vs-xeomin.astro` ✅ (built)
- [ ] `blog/is-morpheus8-worth-it.astro` ✅ (built)
- [ ] `blog/lip-filler-cost-southwest-florida.astro` ✅ (built)
- [ ] Next up (same template — direct answer + table + FAQ schema):
  - [ ] "PRF Under-Eye Treatment: What to Expect"
  - [ ] "IV Therapy Benefits & Cost in Southwest Florida"
  - [ ] "Microchanneling vs Microneedling"
  - [ ] "BioRePeel vs Chemical Peel"
- [ ] Every post: link to its matching service page(s); add `BlogPosting` + `FAQPage` schema.

## Phase 5 — Technical polish

- [ ] Keep the XML sitemap **lean** — only index-worthy pages (no thin product SKUs).
- [ ] Verify all new service/location/blog URLs appear in the sitemap.
- [ ] Confirm no stray `noindex` on service pages.
- [ ] Keep IndexNow on deploy (Bing/Copilot) — remember it does **not** reach Google; use GSC Request Indexing for Google.

## Phase 6 — Authority & links (ongoing)

- [ ] List on device-maker "find a provider" directories: InMode/Morpheus8, BioRePeel, Biote (if applicable).
- [ ] Pursue 3–5 local backlinks / "best of SWFL" features.
- [ ] Keep publishing content + collecting reviews.

---

## Track monthly (see strategy §13)
- GSC: non-brand clicks, impressions, avg position per target keyword; indexed-page count.
- Local pack rank for "{service} {city}" + "{service} near me" from Punta Gorda and Fort Myers.
- GBP: views, calls, direction requests, bookings; review count & rating.
- Ahrefs (recheck ~60 days): organic keyword count should climb from 0; watch DR.
- AI visibility: ask ChatGPT / Perplexity / Google "best med spa in {city} for {service}" and check if you're named.

## Priority order if you can only do a little at a time
1. Phase 0 (foundations) + Phase 1 (GBP/reviews) — biggest, fastest wins.
2. Morpheus8, lip fillers, IV therapy, Botox pages (highest value/lowest difficulty).
3. Fort Myers location page.
4. The 3 built articles, then the rest of the service pages.
5. Cape Coral + Port Charlotte + more content.
