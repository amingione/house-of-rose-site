# Tasks

## Active
- [ ] **[Areas] Additional local pages** - punta gorda +15 miles
- [ ] **[Service SEO] Enhance Wellness — GLP-1 + IV Hydration** - long-form SEO + FAQs + local; medical-compliant. - google gets no brand names that are mmedical like BOTOX
- [ ] **[SEO] Quarterly meta + content refresh** - re-tune against Google Search Console performance.
- [ ] **[Content] Seasonal campaign content** - SW Florida "summer-safe / no-downtime peel" angle; event-season injectables.
- [ ] **[Service SEO] Enhance remaining body / variant / hub pages** - microchanneling-body, microneedling-body, topical PRF, PRF body, PRF fibrin veil, EZ Gel, neck & décolleté, dermaplaning, Glo2Facial base, Acne Bootcamp, AI Skin Analysis.
- [ ] **[Voice] Provider-name audit across ALL service descriptions** - sweep every service for "Amber / Diana / Brandy / Aundrea" in customer copy and neutralize to role-only.
- [ ] **[Interlinking] Wire `relatedServices` refs + cross-links everywhere** - connect services ↔ compare ↔ concerns ↔ areas ↔ cost so nothing is orphaned.
- [ ] **[Research] Keyword + local-comp research for the next clusters** - parallel Ahrefs agents for facials / wellness / lashes / makeup / waxing (add Semrush once units are restored).
- [ ] **[Schema] Structured-data verification pass** - validate Service, FAQPage, LocalBusiness, BreadcrumbList, Article JSON-LD on every new page type.
- [ ] **[QA] Crawl all new URLs for health** - 200 status, trailing-slash + canonical, meta present, no orphans, no leftover prices or provider-lane language.
- [ ] **[Ops] Submit updated sitemap + request indexing in Google Search Console** - for all new /compare, /areas, /cost, /concerns pages.
  - [ ] add these services to sanity

## Waiting On
- [x] **[Decision] AI Skin Analysis — keep "Complimentary" visible or strip it?** - Amber's call.
  - [x] its $65.00 - then if they go through with a treatment plan it is applied to their plan
- [x] **[Ops] Fix the Pro / MD price inversion in GlossGenius** - Pro $525 above MD $475 (looks backwards). Internal booking system. Amber.
- [x] **[Ops] Top up Semrush API units (optional)** - for deeper keyword research. https://www.semrush.com/mcp-access
  - [ ] no
- [x] **[Content] GlowTox real before/after gallery** - once real client photos exist (with release); build a `/results` case study.
  - [ ] generate w/gpt

## Someday
- [ ] **[Content] Before/after case studies for hero treatments** - as real client photos accumulate.
- [ ] **[Service SEO] Enhance Makeup — everyday, soft glam, full glam / bridal** - SEO + FAQs; bridal/event + travel angle.
  - [ ] add services to gloss genous
- [ ] **[Cost] Expand cost guides to secondary services** - once the hero guides prove out.
- [ ] **[Service SEO] Enhance Lashes — lift, lift+tint, tint** - SEO + FAQs + near-me local.

## Done
- [x] **~~** - [Cost] `/cost` hero guides built + published (7 total), all dollar-free** — created microneedling, BioRePeel, Botox, dermal fillers, PRF injections; rewrote the 2 existing (Procell, topical-PRF) to strip `$349/$450` figures + the "Amber/Diana" provider names + unset all price fields. Hero copy aligned to value framing. All 7 treatment links point to live service pages. FAQ + Article schema.~~ (2026-07-25)**
- [x] **~~** - [Concerns] `/concerns` pages built + treatments mapped** — created 3 missing concerns (hyperpigmentation, active acne, volume loss); fixed 2 empty pages (dark-circles, hair-thinning was parked); strengthened thin pages (aging, volume-loss); wired service→concern references across 16 services; built the missing `/concerns` hub index. All 9 target concerns covered + mapped, published.~~ (2026-07-25)**
- [x] **~~** - [Deploy] All /compare + /areas pages verified rendering LIVE on apex** — root-caused: Netlify build was reading Sanity token-less (only 1 comparison visible); fixed by wiring `SANITY_API_READ_TOKEN` through the Sanity client + `astro.config.ts` define. Confirmed all 9 comparisons + 7 areas + detail articles live on `houseofrosefl.com`. (Earlier "only 1" reads were WebFetch's 15-min cache.)~~ (2026-07-25)**
- [x] **~~** - [Compare] Created "PRF vs PRP" comparison** (`/compare/prf-vs-prp`)~~ (2026-07-25)**
- [x] **~~** - [Compare] Created "Daxxify vs Botox" comparison** (`/compare/daxxify-vs-botox`)~~ (2026-07-25)**
- [x] **~~** - [Compare] Rewrote the 4 parked PRF/Procell comparisons** — stripped provider-lane rows + names + hedge voice, set live~~ (2026-07-25)**
- [x] **~~** - [Areas] Created Englewood, Fort Myers, and Sarasota area pages**~~ (2026-07-25)**
- [x] **~~** - Walk-in policy corrected across the site + binding rule in CLAUDE.md**~~ (2026-07-24)**
- [x] **~~** - Two-menu architecture rule (Sanity vs GlossGenius) in CLAUDE.md**~~ (2026-07-24)**
- [x] **~~** - Pricing removed from all 49 services + customer-facing metas**~~ (2026-07-24)**
- [x] **~~** - Flagship service descriptions rewritten to sell**~~ (2026-07-24)**
- [x] **~~** - GlowTox researched, upsold, published + illustrative before/after graphic**~~ (2026-07-24)**
- [x] **~~** - GlossGenius booking menu — 44 paste-ready blurbs delivered**~~ (2026-07-24)**
- [x] **~~** - Priority-cluster SEO: Procell, SkinPen, BioRePeel, Botox, Fillers, PRF**~~ (2026-07-24)**
- [x] **~~** - /compare: botox-vs-filler + biorepeel-vs-microneedling created; microchanneling-vs-microneedling fixed**~~ (2026-07-24)**
- [x] **~~** - /areas: North Port + Venice created; Port Charlotte + Punta Gorda fixed**~~ (2026-07-24)**
- [x] **~~** - Root-caused CDN build lag; set SANITY_USE_CDN=false**~~ (2026-07-24)**
