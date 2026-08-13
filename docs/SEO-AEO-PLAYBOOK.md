# House of Rose — SEO / AEO Playbook

> **This is binding infrastructure.** Every agent that creates or edits customer-facing
> content for this site MUST follow this playbook. It is referenced from `AGENTS.md` and
> `CLAUDE.md` so it is inherited automatically by any task. When you add information to the
> site, you are not "writing a page" — you are populating a **page type** that already has a
> defined content model, route, and structured-data contract (see `docs/CONTENT-MODEL-MAP.md`).
>
> **Voice reset in effect.** The Creative System's prior voice, bios, copy templates, and campaign
> strategy are archival and do not govern new writing. Use Amber's latest approved direction, verified
> facts, and binding compliance rules. This playbook continues to own page types, AEO structure,
> internal linking, and structured-data contracts.

---

## 1. Why this exists (the strategic shift)

Google's Search has moved from *"rank for a keyword → get a click"* to **AI-powered answer
surfaces** (AI Overviews, AI Mode) plus ChatGPT/Perplexity-style discovery. AI Overviews fire
hardest on **question-style queries**, and the sources they cite often differ from the classic
"blue link" organic rankings. Translation: being keyword-optimized is no longer enough — pages
must be **answer-led, entity-clear, locally grounded, and source-worthy**.

House of Rose is a **Medical Aesthetics Practice** in **Punta Gorda, FL** serving
Charlotte County and Southwest Florida. Visit-policy details belong in the direct FAQ and current
platform settings, not recurring marketing copy. The content strategy targets two jobs at once:

1. **AEO (Answer Engine Optimization)** — be the source an AI cites when someone asks
   *"How much does PRF microneedling cost?"* or *"What's the best facial before an event?"*
2. **Local authority** — own the *"… in Punta Gorda / Port Charlotte / SW Florida"* modifier.

### Old SEO → New SEO / AEO

| Old SEO | New SEO / AEO (what we build) |
| --- | --- |
| Keyword pages | Answer-led service hubs |
| Generic blogs | Expert, locally grounded content |
| Meta titles | Structured data + entity clarity |
| Traffic reports | Lead quality + visibility reporting |
| "More content" | Better source-worthiness |

---

## 2. The 7 page types (the canonical framework)

Every new intent-led treatment/SEO page uses one of these seven types. Each maps to a Sanity document
type, an Astro route, and a required JSON-LD contract — all defined in
`docs/CONTENT-MODEL-MAP.md`. **Do not invent ad-hoc page shapes.** If a request doesn't fit a
type, extend the type's schema, don't bypass it. Identity, legal, booking, and utility routes remain
supporting page types documented in the map.

1. **Service page** — what the treatment is and the verified details that answer its search intent;
   process, candidacy, and FAQs appear only when relevant.
   → `service` doc, `/services/[slug]`. Hubs answer the question a client googles;
   treatments are the priced, bookable protocols beneath them.
2. **Pricing / "what affects cost" page** — honest cost ranges and the factors that move them.
   → `costGuide` doc, `/cost/[slug]`. Targets *"how much does ___ cost"* queries.
3. **FAQ page** — concentrated question→answer pairs.
   → aggregated at `/faq` (+ every service/cost/comparison page ships its own `faqs`).
4. **Comparison page** — *"A vs B"* decisions framed neutrally and expertly.
   → `comparison` doc, `/compare/[slug]`. E.g. *Procell Pro vs MD*.
5. **Local authority page** — locally grounded information for a city/area.
   → `localArea` doc, `/areas/[slug]`. E.g. *PRF Microneedling in Punta Gorda*.
6. **Before/after / proof page** — real outcomes, protocol, timeframe (with consent).
   → `caseStudy` doc, `/results/[slug]` (+ `/results` index).
7. **Process page** — what the visit/treatment journey actually looks like.
   → `service.process[]` + the journey on `/experience`.

### Aesthetics page targets (worked examples)

These are the kinds of pages this framework is built to produce — slugs are illustrative:

```
PRF Microneedling in Punta Gorda          → localArea  → /areas/prf-microneedling-punta-gorda
Procell Pro vs MD                         → comparison → /compare/procell-pro-vs-md
How Much Does PRF Treatment Cost?         → costGuide  → /cost/prf-treatment-cost
Best Facial for Dull Skin Before an Event → blogPost / service hub (answer-led)
Dermaplaning + Glo2Facial Package         → treatmentPackage → /packages/[slug]
```

---

## 3. AEO writing rules (apply to every page)

1. **Answer first.** The first 1–2 sentences must directly answer the page's core question in
   plain language. Lead with the answer, then support it. AI extractors and skimming humans both
   reward this.
2. **Entity clarity.** Name the treatment, the brand, the body area, the city explicitly. Avoid
   pronouns and vague references ("this treatment") where a named entity ("PRF microneedling")
   belongs. This is how machines disambiguate what the page is *about*.
3. **Local grounding.** Reference Punta Gorda / Charlotte County / SW Florida where it's true and
   useful. Use the real NAP (name, address, phone) — never invent details. Canonical NAP lives in
   `siteSettings` and is mirrored in `src/lib/structuredData.ts`.
4. **Source-worthiness over volume.** One specific, verified, consent-backed page beats ten thin
   ones. Include a mechanism, candidacy, contraindication, or timeframe only when it answers the
   page intent and the fact is supported. Do not turn clinical process into the default voice.
5. **Honest pricing.** Cost pages give ranges and the factors that move them. Don't fabricate exact
   prices; pull from the service's pricing fields or state "consultation required."
6. **Question-shaped headings.** Use `<h2>`/`<h3>` phrased as the questions people ask. These map
   cleanly to FAQ schema and AI Overview extraction.
7. **No medical overclaiming.** Aesthetics, not medicine. Avoid guaranteeing outcomes or making
   treatment-of-disease claims. "May help," "is designed to," "many clients see" — not "cures."
8. **One canonical home per topic.** A topic lives on exactly one hub. Comparison/cost/local pages
   link *to* the canonical service hub; they don't duplicate it.

---

## 4. Structured-data contract (non-negotiable)

**Every new intent-led treatment/SEO page MUST ship valid JSON-LD.** Use the typed builders in
`src/lib/structuredData.ts` — do not hand-roll schema objects in pages. Minimum per type:

| Page type | Required JSON-LD |
| --- | --- |
| Service | `Service` + `BreadcrumbList` + `FAQPage` (if FAQs) |
| Cost guide | `FAQPage` + `BreadcrumbList` (+ `Article`) |
| FAQ | `FAQPage` |
| Comparison | `FAQPage` + `BreadcrumbList` (+ `Article`) |
| Local area | `LocalBusiness` (via `areaServed`) + `BreadcrumbList` (+ `FAQPage`) |
| Before/after | `ImageObject` (before+after) + `BreadcrumbList` |
| Process | inherited from the Service page it lives on |

Every page also inherits canonical URL and Open Graph tags from `BaseLayout.astro`.
Always set a meaningful `title` + `description` (prefer the doc's `seo.metaTitle` /
`seo.metaDescription`, fall back to tagline/intro).

---

## 5. Internal linking rules

AEO rewards a tight topical graph. When you publish a page, wire it in both directions:

- **Cost / comparison / local / case-study pages → link to the canonical service hub.**
- **Service hubs → link out to** their cost guide, relevant comparisons, the local pages they
  serve, and proof (case studies) when available.
- Keep new hubs reachable from the footer and present in `sitemap.xml` and `llms.txt`
  (both are generated — see the wiring in `CONTENT-MODEL-MAP.md`).
- Never create an orphan page (no inbound links). If nothing links to it, it doesn't ship.

---

## 6. Per-page publish checklist

Before considering any content page "done", confirm:

- [ ] It is one of the 7 canonical page types (correct Sanity doc type + route).
- [ ] First sentence answers the page's core question directly.
- [ ] Named entities (treatment, brand, body area, city) are explicit.
- [ ] Locally grounded with real NAP where relevant — nothing invented.
- [ ] Required JSON-LD is emitted via `structuredData.ts` and validates.
- [ ] `seo.metaTitle` (≤ ~60 chars) and `seo.metaDescription` (≤ ~155 chars) set.
- [ ] Question-shaped `h2`/`h3`s; FAQs present where the type calls for them.
- [ ] Linked to its canonical service hub and reachable (footer / sitemap / llms.txt).
- [ ] No medical overclaiming; pricing honest; consent recorded for any before/after.

---

## 7. Reporting (what "good" means)

We measure **visibility + lead quality**, not raw traffic:

- AI Overview / assistant citations and brand mentions for our target questions.
- Rankings for question + local-modifier queries (e.g. *"prf microneedling punta gorda"*).
- Qualified consultation requests (lead submissions), not just sessions.

Tooling available in this workspace: Google Search Console, Ahrefs (incl. Brand Radar for AI
mentions), and Semrush. Use them to pick the next page to build and to confirm pages are getting
cited — not just clicked.
