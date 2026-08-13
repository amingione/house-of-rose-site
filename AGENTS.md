# House of Rose — Agent Rules

## This is an Astro + Sanity project

NOT Next.js. NOT React. NOT Medusa. NOT Vendure.

Read `CLAUDE.md` before any work.

## 📕 Brand, marketing & client-facing content — the Creative System is the source of truth

> **VOICE RESET IN EFFECT — 2026-08-13.** Amber explicitly rejected the current
> Claude-developed brand voice. Until she approves a replacement, do **not** use the
> Creative System, `BRAND_MEMORY.md`, current website copy, or prior AI-authored brand
> documents as a tonal model or as evidence of her taste. They may still be used for
> verified business facts, service facts, medical/compliance boundaries, NAP, consent,
> provider credentials, and operational constraints. New public copy must remain factual
> and compliant, but it must not imitate the current clinical/institutional cadence.
> Draft voice work requires Amber's approval before broad website or Sanity rollout.

**`docs/House_of_Rose_Creative_System/House_of_Rose_Creative_System_MASTER.md`** — House of Rose
Creative System **v1.0 (issued 2026-07-30)**. Seven books in one file: Creative Bible, Brand Voice &
Copy Standards, Social & Profile Bios, Visual Standards, AI Creative Rules & Prompt Library, Marketing
System, Content Approval Checklist. The `.docx`/`.pdf` siblings are the same content styled for Notion
and print — not a second version.

**Read the relevant book BEFORE writing or editing anything a customer will see** — website copy, Sanity
content, service descriptions, meta titles/descriptions, ads, captions, bios, email, image or video
prompts. **It outranks every older brand doc in this repo, in Notion, and in the Obsidian vault** — it
explicitly replaces the earlier "luxury med spa / boutique spa / beauty destination" framing. It does
**not** outrank statute (`docs/internal_only/compliance/`) or operational fact (pricing, provider lanes,
service names — see `CLAUDE.md` Rule #0).

Enforced on every content task:

1. **Category language is "Medical Aesthetics Practice"** — the lead public descriptor. `Medical spa`
   stays the GBP platform category and is fine in meta/SEO/supporting copy; never denied, never the lead.
   "Advanced aesthetics & wellness studio" is now supporting language only, not the lead.
2. **Retired language is banned** (Book 1 §12) — luxury/luxe/premium as self-description, boutique as
   category, glow, radiance, timeless beauty, flawless, ageless, pamper, indulge, treat yourself,
   best version of yourself, turn back time, instant transformation, pain-free, "no downtime" (unless
   true for that exact procedure and reviewed), guaranteed results.
3. **Controlled-use words are rationed** — skin rejuvenation, evidence-based, advanced, personalized,
   customized, restore, confidence. Accurate, necessary, and never repeated across a page.
4. **AI may not** invent a protocol, infer provider scope, fill a gap with a "typical" assumption, write
   a guarantee, fabricate before/after imagery, reviews or credentials, or claim "FDA approved,"
   "clinically proven," "pain-free," or "no downtime" without approved support (Book 5 §3).
5. **Label output** as Draft / Facts requiring verification / Claims requiring clinical approval /
   Assets still needed (Book 5 §3), and **run the Book 7 §1 Fast Preflight before anything publishes.**
6. **Visuals follow Book 4** — real House of Rose environment, real skin and hands, accurate equipment.
   The visual blacklist (no perfect AI models, flowers as spa shorthand, splashes, glitter, gold foil,
   pink gradients, soft-focus glamour, blue LED rooms, cursive) is binding on generated imagery too.

## Marketing / SEO / AEO — MANDATORY when touching customer-facing content

This site is built for **Answer Engine Optimization** (AI Overviews, ChatGPT/Perplexity) +
local authority, not just keyword SEO. Before creating or editing any public page or content
document, read:

- **Creative System Book 6 (Marketing System)** — marketing strategy, funnel, Meta + Google Ads
  structure, GBP, SEO principles, landing-page rules, measurement. **Wins on strategy.**
- `docs/SEO-AEO-PLAYBOOK.md` — the 7 page types, writing rules, the publish checklist. **Wins on this
  repo's page types and structured data.**
- `docs/CONTENT-MODEL-MAP.md` — page type → Sanity doc type → route → JSON-LD → GROQ query.
- `docs/internal_only/COMPLIANCE-COPY-RULES.md` — the binding approved-vs-avoid copy rules (FL med-spa context;
  no reverse-aging / guarantees / stem-cell / cure-disease / Groupon / unsupported exosome-peptide claims).
- `docs/internal_only/compliance/` — the statutory layer. **Wins over all of the above where they touch.**
- `docs/internal_only/START-HERE.md` — the "which folder holds the real answer" map.

Hard rules (inherited by every task):
1. Every content page is one of the **7 canonical page types** — never invent ad-hoc page shapes.
2. Every new content page **MUST ship valid JSON-LD** via `src/lib/structuredData.ts`
   (never hand-roll schema objects in pages).
3. **Answer-first, entity-clear, locally grounded** copy (Punta Gorda / Charlotte County / SW FL).
4. Use real NAP only (canonical in `siteSettings` + `structuredData.ts`) — invent nothing.
5. No orphan pages: wire internal links + `sitemap.xml.ts` + `llms.txt.ts`.
6. New page-type doc types: shared `seo` + `faq` objects, registered in `schemas/index.ts`,
   listed under the Marketing / SEO group in `structure.ts`.
7. **Compliance is non-negotiable** — "med spa / medical spa" is **allowed but never leads** (never deny
   being one, avoid "day spa"); the lead descriptor is **"Medical Aesthetics Practice"** per the Creative
   System. No guarantees, reverse-aging, stem-cell, cure/treat-disease, Groupon/discount, or unsupported
   exosome/peptide claims. Follow `docs/internal_only/COMPLIANCE-COPY-RULES.md` on every customer-facing
   surface, and `docs/internal_only/compliance/` wherever statute applies.

## Framework Rules
- Pages are `.astro` files — use Astro component syntax
- Layouts extend `src/layouts/BaseLayout.astro`
- All data fetching happens in the component front-matter (the `---` block)
- Use `sanityFetch<T>()` from `src/lib/sanity.ts` for all GROQ queries
- GROQ queries are defined in `src/lib/queries.ts` — add new ones there, don't inline them in pages
- `output: 'static'` — `getStaticPaths()` is required for dynamic routes
- **URLs use trailing slashes** — Astro `directory` build format; inner pages live at `/path/` (e.g. `/services/`, `/services/prf/`, `/experience/`). Never write or link an inner-page URL without the trailing slash — it relies on a redirect and breaks (same issue as FAS Motorsports). Root domain is slash-optional. Canonical NAP + this rule live in `CLAUDE.md`.

## TypeScript Rules
- Strict mode — no `any`
- All Sanity response types are defined in `src/lib/queries.ts` alongside their queries
- Use `import type` for type-only imports

## Sanity Rules
- Schemas live in `packages/studio/schemas/`
- Studio structure is in `packages/studio/structure.ts`
- `siteSettings` is a singleton — document ID is `'siteSettings'`
- Never call Medusa, Vendure, Stripe, or Shippo from this project

## File Placement
```
packages/web/src/
  pages/          ← Astro routes
  layouts/        ← BaseLayout.astro and variants
  components/     ← Reusable Astro components
  lib/
    sanity.ts     ← client, urlFor, sanityFetch
    queries.ts    ← all GROQ queries + TypeScript types
  styles/
    global.css    ← Tailwind directives + base layer

packages/studio/
  schemas/        ← one file per content type
  structure.ts    ← Studio sidebar structure
  sanity.config.ts
```

## Never Do
- Import from Medusa, Vendure, Shippo, or FAS-specific libs
- Use `any` types
- Add React state/effects to pages (add a component island only if interactivity is required)
- Commit `.env.local` or `.env`
- Draft brand copy, ad copy, or an image prompt from a doc that predates **2026-07-30** without checking
  it against the Creative System first — most of the older material carries the retired luxury/boutique
  positioning. Anything in Notion prefixed `ARCHIVED - DO NOT USE` is off-limits entirely.
- Invent a service, device, ingredient, protocol, credential, downtime figure, review, or testimonial —
  ask for source material instead (Creative System Book 5 §3).

---

## Read before touching anything (this is not advisory)

Line 7 above already says *"Read `CLAUDE.md` before any work."* It is routinely skipped because the
task looks self-contained. It never is.

Minimum read set before any customer-facing or compliance-adjacent work:

| File | Why |
|---|---|
| `CLAUDE.md` | Entity structure, medical direction, NAP, statutory copy rules |
| `docs/SEO-AEO-PLAYBOOK.md` | The 7 page types + the JSON-LD contract per type |
| `docs/CONTENT-MODEL-MAP.md` | page type → doc type → route → JSON-LD → query |
| `docs/internal_only/services/ALL-SERVICES-PRICING.MD` | The only prices that exist |

If a rule is stated in one of these, **follow it as written**. Do not re-derive it, do not reason around
it, do not upgrade it into an open question.

## Scope of practice is settled. Stop raising it.

**A medical director is on file: `Joshua Shaw, MD · FL Lic. ME136232`, via Guardian Medical Direction.**
Aesthetics runs on a § 464.012(3) written physician protocol.

Consequences that follow, and are not up for re-litigation:

- **Microneedling and microchanneling are performed here under that protocol.** Rule 61G5-18.00015
  conditions on delegation; the delegation exists. Do not cite the rule as a blocker, do not mark a
  treatment "pending scope review," and do not withhold provider copy over it.
- Esthetician-delivered-under-medical-direction is a real, correct configuration. It is the
  `esthetics-medical` scope preset. Use it.
- If a genuine scope question ever arises, it goes in **one line** to Amber. It does not become a schema
  field, a build gate, or a spec document.

**Anti-pattern this replaces:** inventing a `PENDING_AMBER` state, wiring a verifier to block publish on
it, and writing a spec doc explaining the dilemma. That is three artefacts of pure drift generated from
one wrong assumption.

## Practitioner names: required, not forbidden

The instinct to strip all names from public copy is **backwards**.

- **§ 456.072(1)(t):** wherever a practitioner is named, the **licence type** must appear. `MD` / `DO` /
  `APRN` / `RN`.
- "Aesthetic Injector," "Injector," "Provider," "Skin Specialist" are job titles and **satisfy nothing**.
- Advertising credential is `Diana Morrison, RN` — she is an RN, **not** an APRN.
- Canonical attribution line, verbatim, on medically directed services:
  `Medical Director: Joshua Shaw, MD · FL Lic. ME136232`

Never imply the medical director performs treatments, is on site, or holds a dermatology specialty — his
NPI taxonomy is **Surgery**, and R. 64B8-11.001(2)(a) and (2)(k) are violated by implication alone.

Never write **dermatologist**, **skin doctor**, or **dermatology specialist** in copy — including in a
referral sentence. Bidding the keyword is fine; the word in copy is not.

## Geo pages are `localArea`. They are not service pages.

A request for *"PRF Microneedling in Punta Gorda"* or *"IV Hydration in Charlotte County"* is a
**`localArea` doc at `/areas/[slug]`**. This is worked example #1 in `SEO-AEO-PLAYBOOK.md` §2.

Do not put a geo modifier in a service page H1, title tag, or slug as a substitute. Do not invent a
`localSeo` field on `service`. The page type exists; extend it or use it.

The general form of this error: **re-deriving an architectural decision the repo already documented, and
landing somewhere different.** Check the page-type table first. If a request doesn't fit a type, extend
that type's schema — never bypass it.

## Do not create parallel documents

The 2026-07-23 pricing reconciliation existed because contradicting docs had multiplied. Do not repeat
it.

- **Update the doc that already owns the topic.** Architecture → `CLAUDE.md` / `CONTENT-MODEL-MAP.md`.
  Prices → `docs/internal_only/services/ALL-SERVICES-PRICING.MD`. Nothing else.
- A new `.md` is justified only when no existing doc covers the subject. "I want to explain my reasoning"
  is not a subject.
- Never write a doc whose main content is open questions, TBDs, or a decision matrix for Amber. Apply
  what is known and produce working output. If something is genuinely unknown, ask in chat — not in a
  committed file.

## Standing product rules

- **GlossGenius is commerce truth.** Prices flow GG → `ALL-SERVICES-PRICING.MD` → Sanity. Never invent a
  price; never publish one that isn't in GG.
- **Memberships are permanently dead.** Rose Circle, Rose Method, member rates, plans, tiers. Deleted
  2026-07-23. Never rebuild, never reference.
- **No discount or "special" framing.** Bundles and programs only.
- Every results claim carries a variance line — R. 64B8-11.001.
- Banned copy: `pamper`, `indulge`, `amazing`, `attention to detail`, `steady hand`, `exosome`,
  `stem cell`, `guaranteed`, `cure`, `reverse-aging`, `Groupon`, `dermatologist`. No exclamation points.
- **URLs use trailing slashes.** `/services/prf-microneedling/`.

## Working style

- Amber dictates by voice. Read for intent, not literal phrasing.
- Apply available knowledge and produce a working output. Placeholders, TBDs, and "awaiting your
  decision" states are a failure mode, not diligence.
- Generic copy is rejected on sight. Every claim must be specific and checkable.
- Direct logs. Explain the *why* of the logic and the *how* of the implementation. Skip preamble.
