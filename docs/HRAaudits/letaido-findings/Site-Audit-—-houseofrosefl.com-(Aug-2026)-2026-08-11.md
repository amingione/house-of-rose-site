# Site Audit — houseofrosefl.com (Aug 2026)

# Site Audit — [houseofrosefl.com](https://houseofrosefl.com)

**Crawl:** 2026-08-03 · 331 pages crawled · **Health score 98.2** (+1.3 vs 2026-07-27) · 0 broken pages · 4 redirects · 2 blocked\
 Source: Ahrefs Site Audit, project `Houseofrosefl` (verified, GSC-linked). Chat: [[3fc555a5]]

The site is technically healthy. Nothing is on fire — 0 broken pages, 0 4XX on internal pages. The remaining issues are content-quality and discoverability gaps concentrated in `/shop/`.

## Priority list

Score = importance (Critical 3 / Warning 2 / Notice 1) × pages × leverage (template 3 / config 2 / per-page 1).

### Critical

| Issue                     | Pages      | Strategy                                                                                                                  | Score      |
| ------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Image file size too large | 9          | template — compress/convert 5 self-hosted `/images/*.webp` and `.png`; 3 are Sanity CDN URLs fixable with `?w=&q=` params | 81         |

Files: `hor-exterior.webp`, `hor-lobby.webp`, `hor-skin-studio.webp`, `welcome-house-of-rose.webp`, two before/after makeup PNGs, three Sanity CDN images. Largest impact on Core Web Vitals / LCP on the homepage.

### Warning

| Issue                                  | Pages      | Strategy                                         | Score      |
| -------------------------------------- | ---------- | ------------------------------------------------ | ---------- |
| Meta description too short (indexable) | 121        | template — almost all are `/shop/` product pages | 726        |
| Meta description too long (indexable)  | 11         | per-page                                         | 22         |
| Missing alt text                       | 11         | per-page                                         | 22         |
| Page has links to redirect             | 4          | per-page                                         | 8          |
| 3XX redirect                           | 4          | config                                           | 16         |
| Noindex page                           | 1          | investigate                                      | 2          |

**Meta descriptions** are the single biggest lever: 121 indexable pages under 110 characters, nearly all `/shop/` product pages (`glymed-beta-gel`, `ultra-hydro-gel`, `atraxi-peptide`, …) plus a few service pages (`/services/facial-waxing/`, `/services/lash-tint/`, `/services/collections/waxing/`). One template change on the product page type — auto-generate from product name + key benefit + brand — fixes most of them.

**Links to redirect** — 5 internal links hitting a 301/302 instead of the final URL:

* `/services/prf-injections/` and `/services/prf/` → `/concerns/hair-thinning/` (301)
* `/services/forma-rf-facial/` (×2) and `/services/lumecca-peak-ipl/` → `doi.org` citation links (302, external, safe to leave)

### Notice

| Issue                                                  | Pages        | Strategy                                            | Score      |
| ------------------------------------------------------ | ------------ | --------------------------------------------------- | ---------- |
| Indexable page not in sitemap                          | 165          | config — `/shop/` pages missing from sitemap.xml    | 330        |
| Page has only one dofollow internal link (indexable)   | 142          | template — add cross-links / related-product blocks | 426        |
| Structured data — schema.org validation error          | 124          | template                                            | 248        |
| Structured data — Google rich results validation error | 124          | template                                            | 248        |
| Pages to submit to IndexNow                            | 276          | config                                              | 552        |
| Pages have high AI content levels (indexable)          | 4            | investigate                                         | 4          |
| External 4XX                                           | 1 (10 links) | config                                              | 2          |
| External 3XX / HTTP→HTTPS / redirect chain             | 6            | config                                              | —          |

**Sitemap gap (165 pages)** — the entire `/shop/` catalog is indexable but absent from the sitemap. Cheap config fix, meaningful discovery win.

**Thin internal linking (142 pages)** — most product pages have exactly one incoming dofollow link. A "related products" or "shop by concern" block would fix the whole class at once.

**Structured data errors on 124 pages** — likely one malformed schema block in the product template. Fixing the template fixes all 124, and it gates rich-result eligibility (price, availability, ratings in SERP).

**External 4XX** — 10 pages link "View Services" to `https://houseofrose.glossgenius.com/services`, which returns **403** to the crawler. Sources include `/services/dermal-fillers/`, `/services/biorepeel/`, `/cost/botox-cost-punta-gorda/`, `/support/`. Likely bot-blocking by GlossGenius rather than a real dead link — worth verifying in a browser, but probably a false positive.

**High AI content level** — flagged on `/services/body-waxing/`, `/services/soft-glam-event-makeup/`, `/services/glp-1-weight-management/`, and the homepage. Not a penalty signal by itself; worth a human editing pass for voice and specificity.

## Recommended order

1. **Meta descriptions on** `/shop/` — template fix, 121 pages, directly affects CTR.
2. **Add** `/shop/`** to sitemap.xml** — 165 pages, config change, one file.
3. **Fix product-page structured data** — one template, 124 pages, unlocks rich results.
4. **Compress the 9 oversized images** — Core Web Vitals, homepage LCP.
5. **Internal-linking block on product pages** — 142 pages, medium effort.
6. Small cleanup: 5 internal redirect links, 11 missing alt texts, 11 long meta descriptions.

## Context caveat

Both `houseofrosefl.com` and competitor `fibbaestheticslaserwellness.com` show zero organic traffic in Ahrefs — normal for a local med spa where discovery runs through Google Maps / local pack. These technical fixes improve the foundation, but **Google Business Profile and local citations remain the higher-leverage lever** for actual patient acquisition.
