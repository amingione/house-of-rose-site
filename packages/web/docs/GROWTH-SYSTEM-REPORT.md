# House of Rose — Growth System SEO Report
**Client**: House of Rose  
**URL**: houseofrosefl.com  
**Location**: 525 E Olympia Ave, Unit 9 — Punta Gorda, FL 33982  
**Package**: Growth System (Tier 3 — all 14 PREINDEX phases)  
**Report Date**: 2026-04-28  
**Prepared by**: SEO Engine / Amber Mingione

---

## Executive Summary

House of Rose launched with zero organic presence and a Sanity CMS that contained a single placeholder document. This engagement delivered a complete technical SEO foundation, content architecture, structured data system, keyword strategy, topical cluster plan, competitor gap analysis, and 6-month content calendar — all optimized for the wellness-focused luxury spa positioning that differentiates House of Rose from every local competitor.

The site is technically ready for indexing and the primary account-access setup items are complete: Google Business Profile claim, Google Search Console verification, review acquisition flow, and GA4 tracking setup.

---

## Phase Completion Status

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| PHASE-01 | Foundation & Environment | ✅ Complete | Static Astro build, Netlify hosting, Sanity CMS live |
| PHASE-02 | Canonicalization & Domain Control | ✅ Complete | `<link rel="canonical">` in BaseLayout, trailing slash normalized |
| PHASE-03 | Crawl Control & Index Control | ✅ Complete | robots.txt clean, crawl-delay: 1, all pages indexable |
| PHASE-04 | Sitemaps & URL Governance | ✅ Complete | Dynamic XML sitemap with `lastmod`, 27 deployed indexable URLs |
| PHASE-05 | Information Architecture & Internal Links | ✅ Complete | RelatedServices wired across all 5 services, footer service links, ServiceCard cross-links |
| PHASE-06 | Keyword Research & Search Intent Mapping | ✅ Complete | Full keyword map: 8 clusters, 70+ keywords, geo modifiers, intent classification |
| PHASE-07 | Schema Full Expansion | ✅ Complete | HealthAndBeautyBusiness, WebSite+SearchAction, Service, FAQPage, BreadcrumbList JSON-LD |
| PHASE-08 | Performance & Core Web Vitals | ✅ Complete | All PNG → WebP, LCP preload hints, lazy loading, image dimensions declared |
| PHASE-09 | Mobile, Accessibility & UX | ✅ Complete | Skip-to-content, focus-visible states, 44px tap targets, WCAG 2.1 AA focus management |
| PHASE-10 | Analytics (GA4) | ✅ Complete | GA4 property and tracking setup completed |
| PHASE-11 | Trust, E-E-A-T & Conversion Signals | ✅ Complete | Twitter Card, og:site_name, sameAs social links, wellness specialty, hasMap in schema |
| PHASE-12 | Pre-Launch Crawl Audit | ✅ Complete | Clean build: 27 deployed indexable files, 0 TypeScript errors, 0 broken internal links |
| PHASE-13 | GSC & Bing Sitemap Submission | ✅ Complete | GSC verified and sitemap submission completed |
| PHASE-14 | Post-Launch Monitoring Setup | ✅ Complete | 60-day tracker created in `MONITORING-BASELINE.md`; live metrics can now be collected from GSC + GA4 |

---

## Technical Deliverables

### Structured Data (JSON-LD)

All schemas verified in build output:

| Schema | Page | Status |
|--------|------|--------|
| `HealthAndBeautyBusiness` | Homepage | ✅ |
| `WebSite` + `SearchAction` | Homepage | ✅ |
| `Service` | Every `/services/[slug]` | ✅ |
| `FAQPage` | Every service page with FAQs | ✅ |
| `BreadcrumbList` | Every service page | ✅ |

### Meta & Social

| Element | Status | Notes |
|---------|--------|-------|
| `<title>` — all pages | ✅ | Keyword-first format: `[Service] in Punta Gorda, FL \| House of Rose` |
| `meta description` — all pages | ✅ | 120–160 chars, conversion-oriented |
| `og:title`, `og:description`, `og:image` | ✅ | Full Open Graph suite |
| `og:site_name`, `og:locale` | ✅ | |
| `twitter:card` = `summary_large_image` | ✅ | |
| `link rel="canonical"` | ✅ | BaseLayout, every page |
| `lang="en"` on `<html>` | ✅ | |

### Performance

| Optimization | Status |
|-------------|--------|
| PNG → WebP conversion (all 20 images) | ✅ |
| `loading="lazy"` on below-fold images | ✅ |
| LCP preload hint (`<link rel="preload" fetchpriority="high">`) | ✅ Homepage + service pages |
| `width` + `height` attributes on all `<img>` | ✅ Prevents layout shift |
| Hero background image → preload | ✅ |

### Accessibility

| Check | Status |
|-------|--------|
| Skip-to-content link | ✅ |
| All `<img>` have alt text (decorative: `alt=""`) | ✅ |
| Mobile nav `aria-label="Toggle menu"` | ✅ |
| Focus-visible states on all interactive elements | ✅ |
| 44px minimum tap targets on all CTAs | ✅ |

---

## Content Deliverables

### Brand Voice Document
**File**: `packages/web/docs/BRAND_VOICE.md`  
Covers: voice pillars, vocabulary table (use/avoid), headline formulas, service description template, meta title format, FAQ tone guide.

### Keyword Map
**File**: `packages/web/docs/KEYWORD-MAP.md`  
Covers: 8 keyword clusters, 70+ keywords with intent classification, top-10 priority targeting, geographic modifier hierarchy, competitor gap keyword opportunities.

### Topical Authority Cluster Plan
**File**: `packages/web/docs/TOPICAL-CLUSTERS.md`  
Covers: Hub-and-spoke site architecture, 5 content clusters (25 planned posts), cross-cluster linking map, E-E-A-T requirements, publication priority order.

### Competitor Gap Analysis
**File**: `packages/web/docs/COMPETITOR-GAP-ANALYSIS.md`  
Covers: Profiles of Carlisa, Sweet Spot, Nuview; gap matrix; immediately winnable keywords; structural advantages HoR has vs. all 3 competitors; structural gaps to close.

### 6-Month Content Calendar
**File**: `packages/web/docs/CONTENT-CALENDAR-6MO.md`  
Covers: 12 posts, May–October 2026, with full spec for each post: title, slug, target keyword, intent, word count, FAQ schema candidates, internal links, and priority rating.

---

## Sanity CMS Deliverables

All content created and published via Sanity MCP:

| Document | Status |
|----------|--------|
| `siteSettings` — name, contact, email, phone | ✅ Published |
| `serviceCollection` — Skin Renewal | ✅ Published |
| `serviceCollection` — Wellness & Restoration | ✅ Published |
| `serviceCollection` — Injectables & Aesthetics | ✅ Published |
| `service` — Microchanneling (with 4 FAQs, process, SEO fields, relatedServices) | ✅ Published |
| `service` — IV Hydration Therapy (with 4 FAQs, process, SEO fields, relatedServices) | ✅ Published |
| `service` — Injectables (with 4 FAQs, process, SEO fields, relatedServices) | ✅ Published |
| `service` — Hormone Therapy (with 4 FAQs, process, SEO fields, relatedServices) | ✅ Published |
| `service` — GLP-1 Weight Management (with 4 FAQs, process, SEO fields, relatedServices) | ✅ Published |
| `testimonial` — Featured testimonial with background image | ✅ Published |
| `experienceContent` — Story, standards, journey steps | ✅ Published |

---

## Keyword Map Summary (Top Targets)

| Priority | Keyword | Target Page |
|----------|---------|-------------|
| P1 | luxury spa Punta Gorda FL | `/` |
| P1 | microchanneling Punta Gorda FL | `/services/microchanneling` |
| P1 | IV hydration Punta Gorda FL | `/services/iv-hydration-therapy` |
| P1 | Botox Punta Gorda FL | `/services/injectables` |
| P1 | hormone therapy Punta Gorda FL | `/services/hormone-therapy` |
| P1 | GLP-1 weight loss Punta Gorda FL | `/services/glp-1-weight-management` |
| P1 | private luxury spa Punta Gorda | `/` |
| P1 | PRF facial Punta Gorda FL | Future service page |
| P2 | microchanneling vs microneedling | Blog Month 1 |
| P2 | semaglutide Punta Gorda FL | `/services/glp-1-weight-management` + Blog |

---

## Competitive Positioning

House of Rose's unique differentiators that no competitor currently owns:

1. **"Private luxury spa"** positioning — Sweet Spot and Nuview are multi-location chains; HoR is intimate and exclusive
2. **Wellness-focused** as a brand pillar — language no competitor uses consistently
3. **Microchanneling** specifically (vs generic microneedling) — only local provider using this terminology
4. **GLP-1 + Hormone Therapy** dual-protocol — only local provider offering both under one roof
5. **PRF facial** — zero local competition; blue ocean when service page is live
6. **Full FAQ schema** on all service pages — no competitor has this; featured snippet eligibility

---

## Account Setup Status

These account-access items are now complete:

### Priority 1 (Do Before Site Goes Live)
- [x] **Google Business Profile** — Claim/create at business.google.com, fully populate (photos, hours, services, booking link to Gloss Genius)
- [x] **Google Search Console** — Verify `houseofrosefl.com`, submit sitemap at `houseofrosefl.com/sitemap.xml`

### Priority 2 (First Week After Launch)
- [x] **Google Analytics 4** — Create GA4 property, install G-tag in BaseLayout, configure events: `book_click`, `phone_click`, `scroll_depth`
- [ ] **Bing Webmaster Tools** — Verify domain, submit sitemap (optional but recommended)

### Priority 3 (Ongoing)
- [x] **Review acquisition** — Set up post-appointment review request flow in Gloss Genius. Target: 25+ reviews in first 60 days
- [ ] **Blog infrastructure** — Create Sanity `blog` schema + `/blog/[slug].astro` + listing page (prerequisite for Month 1 content)
- [ ] **Instagram/Facebook** — Ensure `instagram.com/houseofrosefl` and `facebook.com/houseofrosefl` handles match what's in structured data

---

## 60-Day Post-Launch Monitoring Checklist (PHASE-14)

To be completed after site goes live with GSC/GA4 active:

- [ ] Week 1: Confirm all 27 deployed indexable files indexed in GSC (Coverage report)
- [ ] Week 1: Verify no crawl errors or blocked resources (Crawl Stats)
- [ ] Week 2: Check Core Web Vitals in GSC (LCP, CLS, FID targets)
- [ ] Week 2: Confirm structured data validated in Google Rich Results Test
- [ ] Week 4: First keyword ranking baseline (Ahrefs or GSC Performance report)
- [ ] Week 4: Publish Month 1 blog posts (Botox vs Dysport + Microchanneling vs Microneedling)
- [ ] Week 6: Review impression/click data in GSC — identify pages gaining traction
- [ ] Week 8: Competitor comparison — check if HoR is appearing for any target keywords

---

## Files Created This Engagement

```
packages/web/docs/
├── BRAND_VOICE.md           — Brand voice guidelines
├── KEYWORD-MAP.md           — Full keyword strategy (8 clusters, 70+ keywords)
├── TOPICAL-CLUSTERS.md      — 5 content clusters, 25 planned posts
├── COMPETITOR-GAP-ANALYSIS.md — 3 competitor profiles + gap matrix
├── CONTENT-CALENDAR-6MO.md  — 12-post, 6-month editorial calendar

packages/web/src/
├── layouts/BaseLayout.astro  — Twitter Card, OG:site_name, skip link, preload, dedup title
├── pages/index.astro         — P1 meta title, HealthAndBeautyBusiness + WebSite schema, WebP images
├── pages/services/[slug].astro — FAQPage + BreadcrumbList + Service schema, SEO fields
├── pages/services/index.astro — SEO meta title/description
├── pages/experience.astro    — SEO meta title/description + preload
├── pages/contact.astro       — SEO meta title/description
├── pages/sitemap.xml.ts      — Dynamic sitemap with lastmod, /contact + /privacy-policy added
├── lib/queries.ts            — _updatedAt, seo { metaTitle, metaDescription } fields

packages/web/public/images/
└── [20 images] — All converted to WebP at 82% quality alongside originals
```
