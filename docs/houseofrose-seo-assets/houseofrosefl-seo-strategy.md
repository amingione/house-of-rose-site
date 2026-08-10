# House of Rose Aesthetics — SEO & AI-Visibility Strategy

**Goal:** Rank #1 across Charlotte County & Lee County, FL for the core service menu, and become the med spa that AI assistants (Google AI Overviews, ChatGPT, Perplexity, Gemini) recommend.

**Prepared:** August 1, 2026
**Property:** `sc-domain:houseofrosefl.com` (Astro site, Netlify, Sanity CMS)
**Data sources:** Google Search Console, Ahrefs (Keywords Explorer, SERP Overview, Site Explorer), live SERP inspection.

---

## 1. Executive summary

Three things are true right now, and they define the whole strategy:

1. **You're a brand-new site with a clean slate.** Ahrefs shows `houseofrosefl.com` with **0 tracked organic keywords and 0 organic traffic** — you're not yet in the competitive index. GSC shows real early traction (169 clicks / 90 days, growing since ~June 21) driven almost entirely by **brand searches**. Everything from here is upside.

2. **Your competitors are weak, and the keywords are easy.** The med spas ranking for your target terms have **Domain Ratings of 8–49** — and the two that also serve Punta Gorda (Face It Botox Bar at DR 12, Sweet Spot MediSpa at DR 8) are genuinely beatable. Most of your service keywords have a **Keyword Difficulty of 0–5**. This is a soft market.

3. **The search volume is in Lee County, not Charlotte County.** "med spa punta gorda" and "med spa port charlotte" show **~0 monthly searches** in Ahrefs. "med spa fort myers," "botox fort myers," "morpheus8 fort myers," "microneedling fort myers" all have real, winnable volume. **To grow, you must compete in Fort Myers & Cape Coral (Lee County), not just your home turf.**

**The plan in one line:** Fix the indexing foundation → build one strong, schema-rich page per service → geo-target Fort Myers + Cape Coral + Punta Gorda/Port Charlotte with dedicated location pages → publish cost/comparison content that feeds AI Overviews and People-Also-Ask → win Google Business Profile + reviews for the local pack.

---

## 2. Where you stand today (baseline)

| Metric | Value | Source |
|---|---|---|
| Organic clicks (90d) | 169 | GSC |
| Impressions (90d) | 1,422 | GSC |
| Avg CTR | 11.9% (strong) | GSC |
| Avg position | 23.0 (page 2–3) | GSC |
| Ahrefs organic keywords | **0** | Ahrefs |
| Ahrefs organic traffic | **0** | Ahrefs |
| Trend | Impressions took off ~June 21, still elevated | GSC |

**Interpretation:** Great CTR means your titles/brand convert when shown. Position ~23 and 0 Ahrefs keywords mean you simply aren't on page 1 for non-brand terms *yet*. The job is pure offense — there's nothing to defend.

✅ **Already fixed (per your update):** `/services/` force-crawl requested, and the 200+ shop-product SKUs that were diluting crawl budget have been cleaned up. Those were the two biggest technical blockers — good.

---

## 3. The market reality: geography & demand

Your instinct to target **Charlotte County + Lee County** is right, but the two counties need different tactics because demand is wildly different.

| County | Key cities | Search demand | Competition | Strategy |
|---|---|---|---|---|
| **Charlotte** (home) | Punta Gorda, Port Charlotte | **Very low** (near-zero volume for "med spa punta gorda", "botox punta gorda" ≈ 20/mo) | Very weak | **Own it easily.** Low volume but low effort — you should be #1 here fast. Wins here are about the *local pack* + brand, not search volume. |
| **Lee** (growth) | Fort Myers, Cape Coral, Bonita Springs, Estero | **Real volume** ("botox fort myers" 200, "morpheus8 fort myers" 300, "microneedling fort myers" 400, "med spa fort myers" 200) | Beatable (DR 8–49) | **This is where the traffic is.** Requires dedicated Fort Myers / Cape Coral pages and content. This is your real growth engine. |

⚠️ **Reality check:** Fort Myers is ~35–50 minutes from Punta Gorda. Ranking there only pays off if you're willing to attract Lee County clients (or highlight that you serve them). If that's not realistic, concentrate on Charlotte County + the "near me" national-volume terms (which resolve to the searcher's location anyway).

---

## 4. Competitor landscape

Pulled from live SERPs for your target keywords. **DR = Domain Rating (0–100 backlink strength); Traffic = est. monthly organic visits.**

| Competitor | Domain | DR | Est. traffic | Footprint | How they rank | How you beat them |
|---|---|---:|---:|---|---|---|
| **Face It Botox Bar** ⭐ | faceitbotoxbar.com | 12 | ~441 | Fort Myers, Estero, **Punta Gorda** | Keyword-stuffed **homepage** ranks for botox/dysport/lip/xeomin; strong **blog** ("Moxi vs Halo", "what is Moxi laser") | Build **dedicated per-service pages** (they don't have them) — beats a stuffed homepage. Match their blog. |
| **Sweet Spot MediSpa** ⭐ | sweetspotmedispa.com | 8 | ~177 | Fort Myers, **Punta Gorda** | Homepage + some service pages; has a Punta Gorda location page (underperforming) | Lowest DR of the set — outbuild them on content depth + reviews + schema. |
| **VIO Med Spa** | viomedspa.com | 47 | ~111 | Fort Myers (franchise) | Strong domain, dedicated Fort Myers landing page | Franchise = generic content. Beat with local specificity, real before/afters, provider bios. |
| **Dermani Medspa** | dermanimedspa.com | 49 | — | Lee County (franchise) | Strongest domain in the set; per-service + per-city pages | Hardest to outrank on authority — target the services/cities they cover thinly. |
| **Azul Beauty** | azulbeauty.com | 26 | ~113 | Fort Myers, Cape Coral, Bonita | #1 for "morpheus8 fort myers"; good service pages | Directly contest Morpheus8 & microneedling with deeper, more local pages. |
| **The Blonde Injector** | theblondeinjector.com | 14 | ~209 | Fort Myers | Homepage ranks "med spa fort myers"; some service pages | Comparable strength — winnable head-to-head with better structure. |
| **The Laser Lounge Spa** | thelaserloungespa.com | 28 | ~132 | Fort Myers | Franchise, laser-focused | Contest on injectables/facials/Morpheus8 where they're thinner. |
| **Garramone Aesthetics** | garramone.com | 26 | ~44 | Fort Myers | Surgeon-led med spa, service pages | Beatable on non-surgical services. |
| **Dr. Hasen** | drhasen.com | 21 | ~22 | Naples & Fort Myers | Plastic surgery + med spa | Naples-focused; weak on Fort Myers-specific pages. |
| **Directories** | yelp.com (DR 94), facebook.com (DR 100) | — | — | Everywhere | Occupy SERP slots you can't outrank | **Get listed & optimized** on both — they *are* part of the local SERP. |

**The single most important takeaway:** Your two closest geographic rivals — Face It Botox Bar (DR 12) and Sweet Spot MediSpa (DR 8) — are **weaker than a well-built new site can become in a few months.** And Face It's ranking strategy (one stuffed homepage) is exactly what a set of dedicated, well-structured service pages beats. You have a real, near-term shot at #1 in Charlotte County and a strong shot in Fort Myers.

---

## 5. Keyword master list (by service)

US search volume + **Keyword Difficulty (KD, 0–100)**. CPC shows commercial value (what advertisers pay per click — high CPC = high-value client). **Priority = volume × winnability × your service focus.**

### 🟢 Tier 1 — Easy wins, build these pages first (KD 0–5, real volume)

| Keyword | Volume/mo | KD | CPC | Why |
|---|---:|---:|---:|---|
| **morpheus8** | 54,000 | 5 | $0.70 | Flagship device term, very low KD |
| **lip fillers** | 27,000 | 0 | $1.70 | High intent, zero difficulty |
| **iv therapy near me** | 47,000 | 3 | $2.50 | Massive "near me" volume, easy |
| **biorepeel** | 5,100 | 0 | $0.80 | You offer it; competitors barely do |
| **microchanneling** | 6,100 | 0 | $0.90 | Niche, zero competition |
| **prp microneedling** | 4,000 | 4 | $1.00 | Ties to your PRF/PRP focus |
| **morpheus8 near me** | 2,700 | 0 | $2.00 | Local-intent, zero difficulty |
| **iv hydration therapy** | 3,000 | 27 | $1.30 | Your exact service name |
| **prf facial** | 250 | 0 | $1.50 | Low volume but you specialize here |

### 🟡 Tier 2 — High value, moderate effort (bigger brands present)

| Keyword | Volume/mo | KD | CPC | Note |
|---|---:|---:|---:|---|
| **facials near me** | 109,000 | 18 | $1.30 | Huge; target with facials hub (Glo2Facial, etc.) + GBP |
| **botox near me** | 83,000 | 21 | $5.00 | Highest CPC = highest-value clients |
| **dermaplaning** | 88,000 | 30 | $0.08 | High-volume facial service you offer |
| **skin analysis** | 3,100 | 35 | $0.70 | Consultation funnel entry |

### 🔴 Tier 3 — Hard national terms (win the *local* version instead)

| Keyword | Volume/mo | KD | Strategy |
|---|---:|---:|---|
| botox | 172,000 | 87 | Don't chase national — win "botox fort myers/cape coral/punta gorda" |
| microneedling | 223,000 | 61 | Same — go local + "morpheus8 microneedling" |
| dermal fillers | 31,000 | 77 | Same — win "dermal fillers fort myers" (KD 0) |

### 📍 Local money terms (Fort Myers has volume; all KD 0–5 unless noted)

| Keyword | Volume/mo | KD |
|---|---:|---:|
| microneedling fort myers | 400 | 0 |
| morpheus8 fort myers | 300 | 0 |
| where can i get botox near me | 300 | 0 |
| botox fort myers | 200 | 0 |
| med spa fort myers | 200 | 4 |
| medspa fort myers | 150 | 21 |
| lip filler fort myers | 150 | 0 |
| iv therapy fort myers | 150 | 23 |
| dysport fort myers | 100 | 0 |
| xeomin fort myers | 90 | 0 |
| sculptra fort myers | 80 | 0 |
| med spa cape coral | 80 | 30 |
| lip fillers fort myers | 70 | 0 |
| injectables fort myers | 70 | 0 |
| botox cape coral | 60 | 39 |
| dermal fillers fort myers | 20 | 0 |
| botox punta gorda | 20 | low |
| med spa punta gorda / port charlotte | ~0 | — |

> **Insight:** Notice the near-zero-competition adjacencies your competitors already win — **dysport, xeomin, sculptra** (all "fort myers", all KD 0). If you offer these injectables, add them; they're free rankings.

---

## 6. Site architecture: the page plan

Google (and AI models) rank **specific pages for specific intents.** Face It Botox Bar ranks off one stuffed homepage — you win by giving every service its own authoritative page, then layering location pages on top.

### A. One dedicated page per core service (your 13 targets)

Each of these should be a real, deep page under `/services/…` — indexed, linked from the `/services/` hub AND the main nav:

- `/services/prf/` — PRF (Platelet-Rich Fibrin) — face, under-eyes, hair
- `/services/prp-microneedling/` — PRP / PRP microneedling
- `/services/microneedling/` — Microneedling
- `/services/morpheus8/` — Morpheus8 (RF microneedling) ← **flagship, KD 5**
- `/services/microchanneling/` — Microchanneling
- `/services/biorepeel/` — BioRePeel
- `/services/facials/` — Facials (hub; link Glo2Facial, dermaplaning, etc.)
- `/services/skin-analysis/` — Skin analysis / consultation
- `/services/botox/` — Botox / neuromodulators (add Dysport, Xeomin)
- `/services/dermal-fillers/` — Dermal fillers
- `/services/lip-fillers/` — Lip fillers ← **KD 0, high value**
- `/services/iv-hydration-therapy/` — IV hydration therapy ← **"near me" 47k/mo**
- `/services/waxing/` — Face & body waxing

### B. Location pages (the geo-grid)

Create a location page per city you'll serve, each linking to the services:

- `/areas/punta-gorda/` ✅ (exists — strengthen it)
- `/areas/port-charlotte/`
- `/areas/fort-myers/` ← **priority: this is where the volume is**
- `/areas/cape-coral/`
- (optional) `/areas/estero/`, `/areas/bonita-springs/`

### C. Service × City pages (the winning move for local #1)

The pages that actually rank #1 locally are **service + city** combinations. Build these for your **highest-value service × highest-volume city** intersections first:

- `/services/morpheus8/` + Fort Myers content, or a dedicated `/morpheus8-fort-myers/`
- Botox / lip fillers / microneedling / IV therapy each × Fort Myers, then Cape Coral

> Don't spin up 13 × 6 = 78 thin pages. Build the ~10 highest-value service×city pages with genuine, unique content. Thin doorway pages get ignored (or penalized).

---

## 7. On-page blueprint (use on every service page)

A repeatable template that beats the local competition and earns AI citations:

1. **Title tag:** `{Service} in {City}, FL | House of Rose Aesthetics` (e.g. "Morpheus8 in Fort Myers, FL | House of Rose Aesthetics")
2. **H1:** matches the service + location intent.
3. **Above the fold:** what it is, who it's for, primary CTA (Book a consultation).
4. **Substantive body (600–1,200 words):** benefits, how it works, what to expect, downtime, pricing guidance, areas treated.
5. **Answer the People-Also-Ask questions directly** (see §8) — short, clear Q&A blocks. This is what AI Overviews lift.
6. **Real before/after gallery** (your own photos — unique media is a ranking + trust signal AI and Google both reward).
7. **Provider bio + credentials** (E-E-A-T: experience, expertise, authority, trust — critical for medical/YMYL topics).
8. **Reviews/testimonials** for that service.
9. **Structured data (JSON-LD):** `MedicalBusiness`/`MedicalClinic` + `Service` + `FAQPage` + `Review`/`AggregateRating` + `BreadcrumbList`. Astro tip: add a reusable `<SchemaService />` component and inject per page.
10. **Self-referencing canonical** (`<link rel="canonical" href={Astro.url.href}>` in your base layout — currently missing).
11. **Internal links:** to related services + the relevant location page + the `/services/` hub.

---

## 8. Winning "AI recommendations" (AI Overviews, ChatGPT, Perplexity, Gemini)

Every target SERP we inspected is **saturated with AI Overviews and People-Also-Ask blocks** — e.g. "How much is Botox in Fort Myers?", "How much does Morpheus8 cost in Florida?", "Is Morpheus 8 really worth it?", "Is 40 too old for microneedling?". Whoever answers these clearly gets pulled into the AI answer and the PAA box. Here's how to become the cited source:

**How LLMs pick who to recommend for local services:**
- They read **well-structured, factual, question-answering content** (clear headings, direct answers, FAQ schema).
- They lean on **third-party corroboration**: Google Business Profile, Yelp, healthgrades, RealSelf, consistent NAP (Name/Address/Phone), and **volume + recency of reviews**.
- They favor **entities they can disambiguate** — a clear, consistent brand identity ("House of Rose Aesthetics, Punta Gorda, FL") across the web.

**Action list:**
1. **Add an FAQ section to every service page** answering the exact PAA questions (cost, pain, downtime, "is it worth it", "how many sessions"). Mark up with `FAQPage` JSON-LD. This is the highest-ROI AI move.
2. **Publish cost & comparison content** (see §10) — AI Overviews love "how much does X cost in {area}" and "X vs Y".
3. **Nail entity consistency:** identical NAP + brand name on the site, Google Business Profile, Yelp, Facebook, Apple Maps, healthgrades, Bing Places. Add `Organization`/`MedicalBusiness` schema with `sameAs` links to all your profiles.
4. **Reviews are AI fuel:** systematically request Google reviews after every visit (competitors like Face It lean on this). Reply to all of them.
5. **Get cited by local/industry sites:** local press, "best med spa in SWFL" roundups, device manufacturer "find a provider" directories (InMode/Morpheus8, HydraFacial, BioRePeel, Biote). These are strong AI + SEO signals.
6. **Keep IndexNow** (you already deploy it) — it feeds Bing, which powers **Copilot and partially ChatGPT search.** (Note: it does *not* feed Google.)

---

## 9. Local SEO — the local pack & Google Business Profile

For "{service} near me" and "{service} {city}" searches, the **map/local pack** sits above organic results. This is often the single biggest driver of med-spa bookings.

- **Google Business Profile:** complete every field; primary category **"Medical spa"**; add secondary categories (Skin care clinic, Facial spa, etc.); list every service; post weekly; upload real photos; collect + respond to reviews continuously.
- **Consistent citations** across Yelp, Facebook, Apple Maps, Bing Places, healthgrades, and med-spa directories.
- **Embed a Google Map** + full NAP in your site footer and on location pages.
- If you serve multiple cities without a physical location in each, use **service-area** settings honestly — don't fake addresses (it gets penalized).

---

## 10. Content plan (feeds organic + PAA + AI Overviews)

Face It Botox Bar's best non-homepage traffic comes from **informational/comparison blog posts** ("what is Moxi laser" #1 for a 1,100/mo term; "Moxi vs Halo"). Copy the pattern for *your* services:

**Cost articles** (AI Overview magnets):
- "How Much Does Morpheus8 Cost in Fort Myers / SWFL?"
- "Botox Pricing in Punta Gorda & Fort Myers: What to Expect"
- "IV Therapy Cost in Southwest Florida"

**Comparison articles:**
- "Morpheus8 vs Microneedling: Which Is Right for You?"
- "PRF vs PRP: What's the Difference?"
- "Dysport vs Botox vs Xeomin"
- "BioRePeel vs Chemical Peel"

**"Is it worth it / what to expect" articles:**
- "Is Morpheus8 Worth It? Results, Downtime & Reviews"
- "Microneedling After 40: What to Know"
- "PRF Under-Eye Treatment: Before & After, What to Expect"

Each answers real PAA questions, uses `FAQPage`/`Article` schema, and internally links to the matching service page.

---

## 11. Technical foundation

| Item | Status | Action |
|---|---|---|
| `/services/` crawl | ✅ Force-crawl requested | Confirm it's in the **main nav** (strongest discovery signal) |
| Shop SKU bloat | ✅ Fixed | Keep sitemap lean; only index pages worth ranking |
| `/memberships/` | ⚠️ You don't offer it | **Remove the live page + 301 redirect** to `/services/` or home |
| Self-referencing canonical | ❌ Missing | Add `<link rel="canonical" href={Astro.url.href}>` to base layout |
| Structured data (JSON-LD) | Add | `MedicalBusiness` + `Service` + `FAQPage` + `Review` (reusable Astro components) |
| XML sitemap | Lean it | Only index-worthy URLs; verify all service + location pages are listed |
| IndexNow on deploy | ✅ Working | Great for Bing/Copilot; remember it does **not** reach Google — use GSC "Request Indexing" for Google |
| Core Web Vitals | No field data yet | Not a concern until traffic grows; Astro static output is already fast |
| Internal linking | Build | Homepage → `/services/` → each service; services ↔ location pages |

---

## 12. Prioritized 90-day roadmap

**Weeks 1–2 — Foundation & quick wins**
- Confirm `/services/` is in the main nav; Request Indexing for it + all service pages in GSC.
- Remove/redirect `/memberships/`.
- Add self-referencing canonical + `MedicalBusiness`/`Organization` schema sitewide.
- Fully optimize Google Business Profile; start a review-request routine.
- Fix titles on all existing service pages to `{Service} in {City}, FL | House of Rose Aesthetics`.

**Weeks 3–6 — Build the Tier 1 service pages**
- Flesh out dedicated pages for **Morpheus8, lip fillers, facials (Glo2Facial), IV therapy, microneedling, PRF/PRP, BioRePeel, microchanneling** using the §7 template + FAQ schema.
- Add before/after galleries + provider bios.
- Ensure Botox page covers Dysport + Xeomin + Sculptra (free adjacent rankings).

**Weeks 5–8 — Geo layer**
- Build `/areas/fort-myers/` and `/areas/cape-coral/` (real content, not thin).
- Strengthen `/areas/punta-gorda/`; add `/areas/port-charlotte/`.
- Create your top ~6 service×city pages (Morpheus8 / Botox / lip fillers / IV therapy × Fort Myers, then Cape Coral).

**Weeks 6–12 — Content & authority**
- Publish 2–4 cost/comparison/"is it worth it" articles per month (§10).
- Build citations (Yelp, Apple Maps, Bing, healthgrades, device-maker directories).
- Pursue 3–5 local backlinks / "best of SWFL" features.
- Keep the review engine running.

---

## 13. Track these KPIs (monthly)

- **GSC:** non-brand clicks, impressions, avg position for each target keyword; indexed-page count.
- **Local pack:** ranking for "{service} {city}" and "{service} near me" from a Punta Gorda and a Fort Myers location.
- **GBP:** views, calls, direction requests, bookings; review count + avg rating.
- **Ahrefs (revisit in ~60 days):** you should see your organic keyword count climb from 0 as pages get indexed and ranked; track DR as backlinks grow.
- **AI visibility:** periodically ask ChatGPT/Perplexity/Google "best med spa in Punta Gorda / Fort Myers for {service}" and see whether you're named; watch for your pages appearing in AI Overviews for cost/comparison queries.

---

### Bottom line
You're entering a **soft market with weak, low-DR competitors and 0–5 difficulty keywords**, from a clean, fast Astro site with growing traction. Charlotte County is yours to take almost immediately; Fort Myers/Lee County is a very winnable growth market if you commit dedicated pages and content to it. Fix the foundation, build one strong page per service, layer geo + FAQ/schema content on top, and win Google Business Profile + reviews — and #1 rankings plus AI recommendations are realistically within a 3–6 month horizon.

*Monetary values (CPC) shown in USD. Keyword volume & difficulty from Ahrefs (US); local demand and competitor rankings from live SERP data, Aug 1, 2026.*
