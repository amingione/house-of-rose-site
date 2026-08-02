# Professional Makeup — Build Plan

> **Status:** Plan for review. No repo files touched yet.
> **Owner:** Amber · **Provider:** Aundrea Pedigo (makeup) · **Also referenced:** Amber (makeup by x amber)
> **Binding docs inherited:** `docs/SEO-AEO-PLAYBOOK.md`, `docs/CONTENT-MODEL-MAP.md`, `docs/internal_only/COMPLIANCE-COPY-RULES.md`, root `CLAUDE.md`.
> **Decisions locked (from you):** ① Nested routes + new Sanity schemas · ② Plan-first, then build · ③ Placeholder pricing (no fake numbers ship).

---

## 1. Why this needs new architecture (the one real constraint)

The current `/services/[slug].astro` route is **flat**. Even a `kind: 'hub'` service with `treatment` children renders every page at `/services/{slug}/` — the parent/child link shows up only in the breadcrumb, never in the URL. So the nested URLs you specified — `/services/professional-makeup/jane-iredale/` and `/services/professional-makeup/events/` — **cannot** be produced by the existing service router.

**Approach (your pick):** create a real nested route folder `packages/web/src/pages/services/professional-makeup/` with dedicated `.astro` pages, each backed by a **new Sanity singleton schema** so it stays click-to-edit in Studio and honors the "Sanity owns everything" law. This mirrors how the other Sanity-backed singleton pages (contact, support, skin-analysis, etc.) already work.

This keeps the hub/treatment `service` model intact for clinical treatments and gives Professional Makeup its own small, purpose-built content model.

---

## 2. Page map & URL architecture

All inner-page URLs carry the **required trailing slash** (per `CLAUDE.md` URL rule).

| # | URL | Route file (new) | Sanity backing (new) | Page type (AEO) | Purpose |
|---|-----|------------------|----------------------|-----------------|---------|
| 1 | `/services/professional-makeup/` | `services/professional-makeup/index.astro` | `professionalMakeupPage` (singleton) | Service hub | Landing: intro to makeup services, Skin-First philosophy, event vs. general use, links to all sub-pages. The canonical home for the topic. |
| 2 | `/services/professional-makeup/jane-iredale/` | `services/professional-makeup/jane-iredale.astro` | `janeIredalePage` (singleton) + reuse `brandProfile` | Brand feature | Who Jane Iredale is, makeup + skincare + supplements, benefits, why we use it post-treatment & for events, and the "this-for-that" daily-routine swap guide. Leads into #1/#3. |
| 3 | `/services/professional-makeup/events/` | `services/professional-makeup/events.astro` | `makeupEventsPage` (singleton) | Service (sub) | Group/event bookings: the three booking options (in-house block times, in-house spa rental party package, travel). |
| 4 | `/results/jane-iredale-*` (2 case studies) | *(existing)* `results/[slug].astro` | existing `caseStudy` docs (Stephanie, Jaclyn) | Before/after proof | Consent-backed before/afters using your product-swap tables. Links back to #1 and #2. |

**Deferred sub-pages (Phase 4, listed here so the graph is designed for them):**

| Candidate URL | Type | Notes |
|---|---|---|
| `/services/professional-makeup/bridal/` | Service (sub) | Wedding/bridal deep-dive if you want it split from `/events/`. |
| `/cost/professional-makeup/` | Cost guide | "What affects the cost of professional makeup" — ranges + factors, once pricing is set. |
| `/faq/` (aggregate) | FAQ hub | Makeup FAQs already aggregate here via each page's `faqs[]`. No new page needed. |

> **Trial run** is **not** its own page. It's a prominent, repeated module on `/events/` and the landing page: *"A trial run is booked as a separate session at the same price as your event application — strongly recommended for weddings and photography so we can coordinate color, match and swatch-test foundation, and lock the look in advance."*

---

## 3. New Sanity schemas (fields)

Registered in `packages/studio/schemas/index.ts` under the **Singletons** block (`__experimental_actions: ['update','publish']`), following the `roseCirclePage` pattern (grouped fields, `seoTitle`/`seoDescription`, kicker/heading/body triads).

### 3.1 `professionalMakeupPage` (landing)
- **SEO:** `seoTitle`, `seoDescription`
- **Hero:** `heroKicker`, `heroTitle`, `heroDescription`, `heroCtaPrimaryText`
- **Skin-First philosophy:** `philosophyKicker`, `philosophyHeading`, `philosophyBody` (seed from `Skin First Philosophy.md`)
- **What we do:** `servicesIntro` + `services[]` (object: `name`, `blurb`, `bestFor`) — e.g. Event Makeup (prom/wedding/photography), General/Lesson application
- **Event use vs. daily use:** `useCasesHeading`, `useCases[]` (object: `title`, `body`)
- **Trial-run module:** `trialRunHeading`, `trialRunBody` (the same-price/recommended messaging)
- **Provider block:** `provider` → reference `provider` (Aundrea)
- **Cross-links:** `relatedLinks[]` (object: `label`, `href`) — to Jane Iredale, Events, before/afters
- **FAQs:** `faqs[]` (shared `faq` object) → powers `FAQPage` JSON-LD
- **Hero image:** `image` (hotspot + `alt`)

### 3.2 `janeIredalePage` (brand feature)
- **SEO:** `seoTitle`, `seoDescription`
- **Hero:** `heroKicker`, `heroTitle`, `heroDescription`
- **Who they are:** `brandIntroHeading`, `brandIntroBody`
- **Three pillars:** `pillars[]` (object: `name` ∈ Makeup / Skincare / Supplements, `body`)
- **Benefits:** `benefits[]` (string) — mineral, breathable, non-comedogenic, photographs well, skin-loving
- **Why we use it:** `whyUsHeading`, `whyUsBody` — post-treatment safe (after facials/microchanneling/PRF), event-grade, artist-chosen
- **This-for-that swap guide:** `swapIntro` + `swaps[]` (object: `category`, `conventionalProduct`, `janeIredaleSwap`, `note`) — the daily-routine swaps
- **Featured looks:** `caseStudies[]` → references to the two `caseStudy` docs
- **CTA into services:** `ctaHeading`, `ctaBody`, `relatedLinks[]`
- **Hero image:** `image` (hotspot + `alt`)
- *(Optional reuse)* pull brand voice/differentiators from an existing `brandProfile` doc named "Jane Iredale" via reference, if you'd rather manage the brand angle centrally.

### 3.3 `makeupEventsPage` (group/event bookings)
- **SEO:** `seoTitle`, `seoDescription`
- **Hero:** `heroKicker`, `heroTitle`, `heroDescription`
- **Intro:** `introHeading`, `introBody` (weddings + multi-person simultaneous prep)
- **Booking options:** `bookingOptions[]` (object: `name`, `summary`, `includes[]` (string), `priceLabel` *(placeholder)*, `bestFor`) — seeded with the three:
  1. **In-House — Individual Block Times** — party member travels to us at a set time.
  2. **In-House — Spa Rental (The Pre-Party Package)** — whole party rents the spa as a private hosted event; includes Hors d'oeuvres/pastries & mimosas **+ a complimentary "Party Planner Infusion" IV Hydration Therapy session per attendee getting makeup**.
  3. **Travel** — House of Rose travels to your venue and works on your schedule.
- **Trial-run module:** `trialRunHeading`, `trialRunBody`
- **How to book:** `bookingCtaHeading`, `bookingCtaBody` (call CTA — GBP convention)
- **FAQs:** `faqs[]` → `FAQPage`
- **Hero image:** `image`

> The IV Hydration cross-reference ("Party Planner Infusion") should link to the relevant IV/wellness service so the perk is reachable — flag: confirm the destination URL.

---

## 4. Frontend wiring (per new route file)

Each `.astro` page mirrors `rose-circle.astro`:
1. `import BaseLayout`, `sanityFetch`, `urlFor`, visual-editing helpers (`sbObjectId`, `sbFieldPath`).
2. Inline `interface` + GROQ query for its singleton (or add to `queries.ts` — see §5).
3. Render Sanity-first with sensible hardcoded fallbacks seeded from the source notes.
4. Emit JSON-LD via the typed builders in `src/lib/structuredData.ts` (never hand-rolled — see §6).
5. Wrap editable regions in `sbObjectId(doc._id)` / `sbFieldPath(...)` so `npm run ve:check` stays at 0 missing.

**Also update:**
- `packages/web/src/lib/queries.ts` — export the three queries + TS interfaces (co-located with the other singleton queries).
- `stackbit.config.ts` `PAGE_ROUTES` — add `professionalMakeupPage: '/services/professional-makeup'`, `janeIredalePage: '/services/professional-makeup/jane-iredale'`, `makeupEventsPage: '/services/professional-makeup/events'` (keep in sync with the Routes table in `CLAUDE.md`).
- `packages/web/src/scripts/visual-editing/check-coverage.mjs` allow-list if needed.
- **Footer + `/services/index.astro`** — add a "Professional Makeup" entry so nothing is an orphan.
- `sitemap` + `llms.txt` — generated; confirm new singletons are picked up (they route via `PAGE_ROUTES`).
- Update `CLAUDE.md` Routes table with the three new rows.

---

## 5. `queries.ts` additions
Three `*_QUERY` consts + matching interfaces, e.g. `PROFESSIONAL_MAKEUP_PAGE_QUERY`, `JANE_IREDALE_PAGE_QUERY`, `MAKEUP_EVENTS_PAGE_QUERY`. Case-study references resolved inline (`caseStudies[]->{ title, "slug": slug.current, ... }`). Provider resolved via `provider->{ title, roleCredential }`.

---

## 6. Structured-data contract (non-negotiable — §4 of the playbook)

| Page | Required JSON-LD | Builder(s) in `structuredData.ts` |
|---|---|---|
| Landing `/professional-makeup/` | `Service` + `BreadcrumbList` + `FAQPage` | `service()`, `breadcrumbList()`, `faqPage()` |
| Jane Iredale feature | `BreadcrumbList` (+ `FAQPage` if FAQs) + **`Brand`/`Product` (NEW builder)** | `breadcrumbList()`, + add `brand()` / `product()` builder |
| Events | `Service` + `BreadcrumbList` + `FAQPage` | `service()`, `breadcrumbList()`, `faqPage()` |
| Case studies | `ImageObject` (before+after) + `BreadcrumbList` | `imageObject()`, `breadcrumbList()` *(already exist)* |

**Small builder additions proposed** (typed, in `structuredData.ts`): `brand()` (schema.org `Brand`) and optionally `product()` for the Jane Iredale page — so we don't hand-roll. All reuse `LOCAL_BUSINESS` NAP. Breadcrumbs must reflect the **nested** path (Home → Services → Professional Makeup → {page}).

---

## 7. Before/after handling (Stephanie & Jaclyn)

Both source notes are full product-swap breakdowns with images referenced in the vault:
- `makeupbyxamber-jane-iredale-stephanie.png` (Stephanie — by Amber)
- `before-after-makeupxaundrea-kiara.png` / `before-after-makeupxAundrea.png` (Jaclyn/Kiara — by Aundrea)

**Plan:** create two `caseStudy` docs (existing schema), move the PNGs into `packages/web/public/images/` (or upload as Sanity assets), render the product tables as an on-page "Get the look" breakdown, and gate on `consentGiven == true` (compliance §3). Each links back to `/services/professional-makeup/` and `/services/professional-makeup/jane-iredale/`.

> **Consent flag:** before/afters only ship with recorded client consent. Confirm Stephanie & Jaclyn/Kiara have signed model/consent releases.

---

## 8. Compliance & voice guardrails (from `COMPLIANCE-COPY-RULES.md`)

Makeup is lower-risk than clinical copy, but rules still apply:
- **Lead descriptor is "Medical Aesthetics Practice."** _(This line previously read "**Never** call House
  of Rose a 'med spa'" — that rule is **dead twice over**: "med spa" is now allowed as supporting/SEO
  language and is the GBP primary category, and the studio descriptor it recommended has itself been
  superseded. Allow "med spa," never lead with it, never deny it.)_
- Jane Iredale skincare/supplements: describe ingredients/benefits **neutrally**; no "treats/cures acne/rosacea," no "clinically proven" unless citing a real clearance. Use "helps improve the look of," "supports," "designed to."
- Before/afters: "individual results vary"; consent-backed only.
- Pricing language: "investment / from / starting at" — never "deal/discount/% off."
- Trial run framed as *recommended for coordination*, never upsell pressure.
- AEO writing rules: **answer-first** opening sentence, named entities ("Jane Iredale mineral foundation," "Punta Gorda"), **question-shaped H2s** that map to FAQ schema.

---

## 9. Pricing (set from the SW FL comp — see `PROFESSIONAL-MAKEUP-PRICING-COMP.md`)

Live numbers, premium-positioned at bridal-median / upper-event, below the Naples $250+ ceiling. All render as "From $…" and stay editable in Sanity.
- **Event Makeup:** From **$150** / face.
- **Trial run:** rendered as *"same price as your event application"* ($150) — separate session, per market norm.
- **Everyday / General Application:** From **$85**; **Private lesson** from **$175**.
- **Event options:** In-house block times **From $150/person** · Spa Rental Pre-Party Package **From $175/person, 4-guest min** (hosted extras + complimentary Party Planner Infusion IV — hosted-event special only, no standalone IV link/price) · Travel **From $150/person + travel fee, 4-guest min**.

---

## 10. Internal-linking web (no orphans)

```
                 /services/  ──┐
Footer ──────────►             ├──► /services/professional-makeup/  (HUB, canonical)
                               │        ├──► /services/professional-makeup/jane-iredale/
                               │        ├──► /services/professional-makeup/events/  ──► IV Hydration perk page
                               │        └──► /results/{stephanie}, /results/{jaclyn}
/jane-iredale/ ◄──────────────►┘   (feature links back to hub + events + before/afters)
before/afters ──► hub + jane-iredale (canonical service home)
```
Hub links out to feature, events, and proof; every sub-page links back to the hub. Feature page is the funnel into services (your stated goal).

---

## 11. Build sequence (once you approve)

1. **Schemas** — add 3 singletons + `brand()`/`product()` structured-data builders; register in `index.ts`; `deploy_schema`.
2. **Seed docs** — create the 3 singleton docs + 2 `caseStudy` docs in Sanity (seeded from the source notes), placeholder prices.
3. **Routes** — build the 3 nested `.astro` pages + queries + JSON-LD + visual-editing annotations.
4. **Wire-in** — `PAGE_ROUTES`, footer, `/services` index, `CLAUDE.md` Routes table; move/upload before/after images.
5. **Verify** — `npm run build`, `npm run ve:check` (0 missing), validate JSON-LD, confirm trailing-slash links, spot-check nested breadcrumbs. (Verification step per house rules.)
6. **Push** — via Desktop Commander `git push origin main` (Keychain).

**Phase 4 (optional, later):** `/cost/professional-makeup/`, bridal split, deeper FAQ sub-topics.

---

## 12. Open questions before I build

1. **Provider on record for the pages** — landing/events attributed to **Aundrea Pedigo**; Jane Iredale before/after "Stephanie" is by **Amber**. Confirm both are credited, or should everything read as House of Rose?
2. **IV Hydration link target** — the "Party Planner Infusion" perk: which existing IV/wellness page should it link to? (Or create a stub?)
3. **Consent** — signed model/consent releases on file for Stephanie and Jaclyn/Kiara before/afters?
4. **Jane Iredale brand angle** — manage centrally via a `brandProfile` doc, or keep all copy inside the `janeIredalePage` singleton? (Recommend the singleton for page copy, optionally referencing a `brandProfile` for reusable brand voice.)
5. **Booking mechanism** — GBP convention is call (no online booking button). `rose-circle.astro` references a GlossGenius URL. For makeup/events, call CTA only, or include the GlossGenius link too?
6. **Travel fee model** — flat fee, mileage, or "quoted at booking"? (affects the `priceLabel` wording.)
