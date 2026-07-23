# House of Rose — Working Memory

## ⚠️ Rule #0 — Verify before you assert or change (binding on EVERY task)
Anything that has to be **factually correct** — pricing, series counts, service names, descriptions,
provider lanes, hours, NAP, protocols — must be **checked against the real sources before I state or
change it**, and I do not invent, round, or "make it consistent" from memory.

**Verification order (do all that apply, in this order):**
1. **Existing local docs** — `docs/services/**` (incl. GlossGenius import CSVs), `docs/research/**`
   (treatment briefs + `_pricing-catalog.md`, `_gaps.md`), `docs/competitor_analysis/**`.
2. **Notion** — the House of Rose HQ workspace (service pages carry `Competitor Pricing`, `Pricing
   Notes`, protocol, and provider fields). Search + fetch the specific page.
3. **Confirm with research** — the clinical/manufacturer/market fact (protocol, comp price, label
   claim). If no comp/source exists locally or in Notion, **research the web for our area** and cite it.

**Then:**
- **Cite the source** for any number/claim I set (which doc/Notion page/URL it came from).
- **Do NOT normalize across everything. This is the #1 recurring failure.** Different services, providers,
  and platforms legitimately differ — and that difference is usually *correct*, not drift to be "fixed":
  - **By protocol:** ProCell = series of **4** (manufacturer min 4, 6+ scarring); BioRePeel = **4** (mfr 4–6);
    Glo2Facial = **3/6**; microneedling = **3–6**. Series length is per-treatment, never one house count.
  - **By provider lane:** the *same treatment* can have *different models* per provider. BioRePeel = **add-on
    only** for Amber (advanced lane, +$65 onto microchanneling) but a **standalone** for Brandy (facials &
    peels lane). Two primary models, both correct. Always ask "whose lane?" before assuming one model.
  - **By platform:** GlossGenius (commerce truth) ≠ Sanity (display) ≠ local docs (staging) ≠ Notion (HQ).
    They are *allowed* to differ; reconcile toward the right source-of-truth per the truth rule, don't
    flatten them to look identical.
  Before "fixing" an inconsistency, find out **why** it exists. If I can't explain the why, I don't change it.
- **Don't treat stale/retired material as current, and don't preserve it "for reference."** Two things
  are permanently dead unless Amber explicitly revives them: **memberships** (no memberships of any kind)
  and **invented/flowery "signature" service names** (use plain technical names only). Also dead: any
  "special/discount" framing. If I find any of these in a doc, **delete it — don't annotate it**, because
  a note that names the dead thing just gets referenced and reintroduced. Historical artifacts are not
  the menu; the live menu is `docs/services/ALL-SERVICES-PRICING.MD` + GlossGenius + Notion.
- **When I find something actually incorrect** (drift, a stale price, a wrong name, a dead concept treated
  as live, a provider-lane error), **clean it up** — correct it, cite the fix, flag the conflict — rather
  than leaving it or silently overwriting the reason it existed.
- Where sources genuinely disagree and it's a real business call, **surface it and ask** — don't pick
  one and steamroll.

_Origin: 2026-07-17 — repeated failure across one session: (1) changed ProCell series to fit a pattern
without checking why 4 existed (ProCell protocol); (2) invented a BioRePeel "standalone vs add-on"
conflict that was really an Amber-vs-Brandy provider split; (3) surfaced dead botanical names +
memberships as if live. Core issue = **forcing one canonical pattern onto everything instead of letting
provider / protocol / platform differences stand.** Don't repeat this._

---

## Business
House of Rose is a luxury spa & wellness brand.
This is a **completely separate business from FAS Motorsports** — no shared infrastructure, no Medusa, no Vendure.

---

## Canonical Business Facts (NAP — never drift; source of truth = Sanity `siteSettings`)
- **Name:** House of Rose Aesthetics
- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950 — _"Unit 9" (never Ste/Suite); ZIP 33950 (never 33982)_
- **Phone:** (844) 941-7673 — spells **ROSE**; E.164 `+18449417673`; **never `7376`**
- **Email:** info@houseofrosefl.com — _`book@…` was never a real address; do not use it anywhere_
- **Hours:** Mon–Fri 9:00 AM–5:00 PM · Sat–Sun closed
- **Web/social:** https://houseofrosefl.com · IG `houseofrosefl` · FB `House-Of-Rose-Aesthetics` · opening July 9, 2026
- **GBP primary category:** `Medical spa`. **Med-spa positioning is ON — "allow, don't lead":** lead in prose with "advanced aesthetics & wellness," but "med spa / medical spa" is permitted in meta, GBP, SEO, and supporting copy where it aids discovery, and we **never deny being a med spa**. Still avoid "day spa" (undersells). _(This reverses the earlier "never say med spa" rule.)_
- **GBP CTA:** call/text (no online-booking button).

## Providers & Team (memory — never re-ask)
- **Amber** — esthetician + RN assistant. Lane: **Advanced Facials** (microchanneling, microneedling, Glo2Facial, PRF topical, ProCell MD/Pro, BioRePeel, dermaplaning, carboxy). PRF **topical only, no injections**. **BioRePeel for Amber is an ADD-ON ONLY (+$65) to an advanced service (microchanneling/microneedling) — she does NOT do standalone BioRePeel.** Standalone BioRePeel is Brandy's.
- **Diana** (RN) — Lane: **Injectables** (tox/filler/PRF injections), **IV Hydration**, and the **GLP-1** program.
- **Brandy** — Lane: **Basic Facials & Peels** (relaxing/maintenance: enzyme exfoliation, hydrodermabrasion, light peels). Rents a room; **offers facial waxing** (general/body waxing is Aundrea's lane). **Brandy owns STANDALONE BioRePeel** (facial + standalone series of 4) — the standalone peel is hers, not Amber's.
- **Brooke = Aundrea Pedigo** — _same person_ (also uses the last name "Morrison"). Lane: **Waxing** + permanent jewelry. Sanity ref is `provider-brooke`; **display name = Aundrea**.

## Memberships — NOT OFFERED
House of Rose does **not** offer memberships. None exist, none are in the site or Studio, none are
planned. `/memberships/*`, `/rose-circle/*`, `/plans/*` all 301 → `/`. **Never add membership UI,
schema, tiers, or "member rate" framing anywhere.** (GLP-1 is a normal **service** — Diana — not a
membership.)

- **Naming law:** service names are **plain, technical, searchable only** — no invented, flowery, or
  "signature" names, and no membership-style program names.

## Checkout — Stripe Elements + Shippo (see `docs/CHECKOUT.md`, binding)
- **GlossGenius CANNOT sell products online** (no online store — their docs say so). It is
  booking + in-person POS only. It is **not** the checkout. Retail runs on **Stripe Elements
  + Shippo** on our own `/checkout` page, with **Sanity as the price source of truth**.
- **The browser never names a price.** It sends `{productId, quantity}`; the server re-reads
  prices from Sanity and the shipping rate from Shippo. No Stripe Product/Price mirror exists.
- **Live shipping rates**, not a zone table: the Address Element drives a real Shippo quote.
  Hosted Stripe Checkout can't do this (static `shipping_options`) — that's why we use Elements.
- **Never `return Astro.redirect()` from a prerendered page** — it stops Astro emitting the
  sibling index chunk and breaks the build (`Cannot find module dist/pages/shop.astro.mjs`).
- **Emails via Resend**: confirmation on payment (`stripe-webhook`), tracking when Amber marks
  the order `shipped` in the Studio (Sanity webhook → `order-shipped`).
- **Labels are NEVER auto-bought.** Payment does not spend postage — a chargeback would cost us
  the goods AND the label, stock can be stale, addresses can be typo'd, weights can be wrong.
  Amber ticks `buyLabel` on a paid order → `buy-label.ts` (idempotent; re-quotes if the Shippo
  rate expired; records real `labelCost` vs what the client paid).
- **The cart is cleared on `/order-confirmed/`**, never after `confirmPayment()` (that redirects
  away, so code after it never runs — the customer would return to a full cart).
- **Weights are in POUNDS** (`weightLb`, Shippo `mass_unit: 'lb'`) — never ounces. Set it on
  heavy products or shipping under-charges. `purchaseUrl` is now the escape hatch, not the
  default. Orders land in Sanity as `order` docs; check `fulfillmentError`.

## URL rule — trailing slash REQUIRED on inner pages
Astro's default `build.format` is `directory` and `site` resolves to `https://houseofrosefl.com/`, so every inner page lives at its **trailing-slash** URL (`/services/`, `/experience/`, `/services/prf/`, `/privacy-policy/`). Writing an inner-page URL **without** the slash relies on a redirect and can break — the same failure seen on FAS Motorsports. Root domain (`houseofrosefl.com`) is slash-optional. **Rule: every absolute or internal link to an inner page ends in `/`.**

---

## Repo: house-of-rose-site
**Monorepo** at `~/LocalStorm/Workspace/DevProjects/house_of_rose/house-of-rose-site/`

| Package | Path | Purpose |
|---------|------|---------|
| `@house-of-rose/web` | `packages/web/` | Astro static site — customer-facing storefront |
| `@house-of-rose/studio` | `packages/studio/` | Sanity Studio v3 — content & product management |

---

## Architecture Law (Never Break)
- **Sanity owns everything**: services, products, site settings, content, images
- **No Medusa** — this is a spa, not a high-volume e-commerce store
- **No Vendure** — unrelated to FAS Motorsports ecosystem
- **Astro is static (`output: 'static'`)** — all data fetched at build time via GROQ
- **No React islands for now** — pure Astro components unless interactivity is explicitly needed

---

## Sanity Project
| Key | Value |
|-----|-------|
| Project ID | `4e7axyi7` |
| Dataset | `production` |
| API Version | `2025-04-26` |
| Studio URL (local) | `http://localhost:3333` |
| Studio URL (production) | `https://studio.houseofrosefl.com` |
| Organization | Amber (`ouLdbVxnh`) |

**CORS origins registered on project 4e7axyi7:**
- `http://localhost:3000` (auto-added at project creation)
- `http://localhost:3333` (local Studio dev server)
- `https://studio.houseofrosefl.com` (production Studio)

---

## Tech Stack
- **Framework**: Astro v5 (static output)
- **Styling**: Tailwind CSS v3 + `@tailwindcss/typography`
- **CMS**: Sanity v3 + GROQ
- **Language**: TypeScript (strict, no `any`)
- **Hosting**: Netlify — storefront at `houseofrosefl.com`, Studio at `studio.houseofrosefl.com`
- **Visual editing**: Netlify Visual Editor (Stackbit) over Sanity — see below

---

## Visual Editing (Netlify Visual Editor)
Click-to-edit / side-by-side editing sits **on top of** Sanity — **not** a second CMS,
and Astro stays `output: 'static'`. Full runbook: `docs/VISUAL-EDITING.md`.

- **Config**: `stackbit.config.ts` (repo root) — Sanity content source + `PAGE_ROUTES`
  map (keep in sync with the Routes table below) + Astro `custom` SSG dev command.
- **Dev deps only**: `@stackbit/cli`, `@stackbit/cms-sanity`, `@stackbit/types`
  (never imported by site code — production build untouched).
- **Run locally**: `npm run dev:visual` (editor on `:3000`; Astro preview on a
  Stackbit-assigned port injected via the `{PORT}` placeholder in `devCommand`).
  The editor origin `http://localhost:3000` is already in the Sanity CORS list —
  don't pass `--port` to `stackbit dev` (it moves the editor off that origin and
  breaks Sanity reads/writes via CORS).
- **Env** (add to `.env.local`, auto-loaded by `stackbit.config.ts`):
  `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_STUDIO_URL`, `SANITY_ACCESS_TOKEN`
  (Editor token, read+write, for two-way sync).
- **Inline edit**: all Sanity-backed pages + shared components are annotated via
  `packages/web/src/lib/visualEditing.ts` (`data-sb-*` helpers). Arrays use the
  numeric **index** (`faqs.0.question`), refs are rescoped with their own `_id`.
- **Automation** (`scripts/visual-editing/`): `npm run ve:check` (coverage gate),
  `ve:sync` (PAGE_ROUTES drift), `ve:new` (scaffold pre-annotated page/component +
  auto-register route). A `prepare`-installed pre-commit hook blocks un-annotated
  Sanity-backed files. Allow-list lives in `check-coverage.mjs`.
- **Formerly-hardcoded pages now Sanity-backed singletons** (deployed + seeded):
  `homepage`, `contactPage`, `supportPage`, `privacyPolicy`, `termsOfService`, `rentARoom`, `skinAnalysis`, `thankYou` — each
  edited under Studio → **Pages** (or **Home Page**), rendered with Sanity-first + hardcoded
  fallbacks, fully click-to-edit. Forms (contact, rent-a-room) and JSON-LD were left untouched.
  _(The `roseCirclePage` and `membershipsPage` singletons were deleted in the 2026-07-07 membership teardown.)_

---

## Netlify Sites

| Site | Netlify Name | Site ID | Custom Domain | Config |
|------|-------------|---------|---------------|--------|
| Storefront | `house-of-rose-web` | `0de4617d-5ba1-4e80-b59e-4900b540f5c0` | `houseofrosefl.com` | Base dir: `packages/web` → uses `packages/web/netlify.toml` |
| Studio | `house-of-rose-studio` | `44c4d348-8afd-4c0d-adb2-f8f9b7ffde15` | `studio.houseofrosefl.com` | No base dir → uses root `netlify.toml` |

**Netlify env vars set on `house-of-rose-web` (builds scope):**
- `PUBLIC_SANITY_PROJECT_ID` = `4e7axyi7`
- `PUBLIC_SANITY_DATASET` = `production`
- `PUBLIC_SANITY_API_VERSION` = `2025-04-26`
- `SANITY_API_WRITE_TOKEN` = (secret — server-side lead submission writes, do not commit)
- `PUBLIC_SITE_URL` = `https://houseofrosefl.com`
- `PUBLIC_BOOKING_EMAIL` = `info@houseofrosefl.com`
- `PUBLIC_MAPBOX_ACCESS_TOKEN` = browser-safe public token (production value is URL-restricted to `houseofrosefl.com`)

**Netlify UI configuration:**
- **Studio site**: No base directory needed (uses root `netlify.toml`)
- **Web site**: Must set Base directory to `packages/web` in Site settings → Build & deploy → Base directory
- Both sites: Connect GitHub repo (`house-of-rose-site`) and configure custom domains

---

## Schemas (packages/studio/schemas/)
| Schema | Description |
|--------|-------------|
| `siteSettings` | Singleton — site name, tagline, contact, social |
| `serviceCollection` | Groups of related services (e.g. "Facials", "Body") |
| `service` | Individual treatment — title, duration, price, image |
| `product` | Retail product — skincare, candles, gift cards. Includes `purchaseUrl` (external checkout link), `ctaLabel` (free-text shop button copy), `badge` (ribbon tag), `isFeatured` (Top Sellers rail) |
| `promotion` | Shop sale/promo banner — editorial headline/teaser/CTA, links internal (promo page, product, or `/shop#brand` anchor) or external (checkout). Active/date-window controlled |
| `shopBrand` | Retail brand storefront copy (ProCell, GlyMed+, Skin Script, Face Reality, House of Rose) — story, logo, hero image, CTA. Distinct from `brandProfile` (House of Rose's own brand-voice/strategy doc) |

---

## Routes (packages/web/src/pages/)
| Route | File | Data Source |
|-------|------|-------------|
| `/` | `index.astro` | All services + collections |
| `/services` | `services/index.astro` | All services |
| `/services/[slug]` | `services/[slug].astro` | Single service by slug |
| `/services/collections` | `services/collections/index.astro` | All collections |
| `/services/collections/[collection]` | `services/collections/[collection].astro` | Single collection |
| `/services/professional-makeup` | `services/professional-makeup/index.astro` | Professional Makeup hub singleton (`professionalMakeupPage`) — landing for makeup services; provider Aundrea Pedigo. NOT a `service` doc (avoids slug collision with `/services/[slug]`). |
| `/services/professional-makeup/jane-iredale` | `services/professional-makeup/jane-iredale.astro` | Jane Iredale brand feature singleton (`janeIredalePage`) — makeup/skincare/supplements, benefits, post-treatment use, this-for-that swap guide, Get-the-Look. |
| `/services/professional-makeup/events` | `services/professional-makeup/events.astro` | Makeup group/event bookings singleton (`makeupEventsPage`) — in-house block times, spa rental "Pre-Party Package", travel. |
| `/experience` | `experience.astro` | Static |
| `/cost/[slug]` | `cost/[slug].astro` | Cost guide by slug (`costGuide`) |
| `/compare/[slug]` | `compare/[slug].astro` | Comparison by slug (`comparison`) |
| `/areas` · `/areas/[slug]` | `areas/...` | Local authority pages (`localArea`) |
| `/results` · `/results/[slug]` | `results/...` | Before/after proof (`caseStudy`) |
| `/faq` | `faq.astro` | Aggregated FAQ hub (FAQPage JSON-LD) |
| `/support` | `support.astro` | Customer support singleton (`supportPage`) — appointments, booking, contact options, and support FAQs (FAQPage JSON-LD) |
| `/terms-of-service` | `terms-of-service.astro` | Legal terms singleton (`termsOfService`) — website use, appointments, communications, and online product orders (WebPage JSON-LD) |
| `/shop` | `shop.astro` | Product catalog — promotions (`promotion`), category filter, top sellers, brand-grouped grid (`shopBrand` + `product`). See `docs/SHOP-ARCHITECTURE.md`. |
| `/shop/[slug]` | `shop/[slug].astro` | Single product detail page (`product`) — checkout CTA when `purchaseUrl` is set, related products from the same brand. `Product` JSON-LD. |
| `/amber` | `amber.astro` | Static — Amber's tap-to-share digital business card (self-contained black/gold card, no Header/Footer, `Person` JSON-LD; downloads `public/amber.vcf`) |
| `/diana` | `diana.astro` | Static — Diana Morrison, RN tap-to-share card (mirrors `/amber/`; `Person` JSON-LD; downloads `public/diana.vcf`) |
| `/aundrea` | `aundrea.astro` | Static — Aundrea Pedigo tap-to-share card (mirrors `/amber/`; `Person` JSON-LD; downloads `public/aundrea.vcf`) |

---

## Marketing / SEO / AEO Infrastructure

This site is engineered for **Answer Engine Optimization** (AI Overviews, ChatGPT/Perplexity) +
local authority — see `docs/SEO-AEO-PLAYBOOK.md` and `docs/CONTENT-MODEL-MAP.md`. These are
**binding** and inherited by every content task (also referenced from `AGENTS.md`).

- **7 canonical page types**: Service, Cost guide, FAQ, Comparison, Local area, Before/after, Process.
- **Every content page ships JSON-LD** via `src/lib/structuredData.ts` (typed builders — never inline).
- **AEO content rules**: answer-first, entity-clear, locally grounded (Punta Gorda / Charlotte
  County / SW FL), honest pricing, no medical overclaiming, no orphan pages.
- **AEO doc types**: `costGuide`, `comparison`, `localArea`, `caseStudy` (+ shared `seo`, `faq`
  objects). Canonical NAP lives in `siteSettings`, mirrored in `structuredData.ts` (`LOCAL_BUSINESS`).

### Site Elevation Prompt Pack
`docs/prompts/site-elevation/` — phased Claude Code prompts (Fable 5, high effort) for the
full-site elevation program: audit/perfect → parallel treatment research → CTA
differentiation + journey loops → new pages + Sanity draft seeding → QA gates. Start every
phase session with `00-MASTER-PROMPT.md`; see the pack's `README.md`. Research briefs live
in `docs/research/`; source-of-truth for treatment facts/pricing is `docs/services/**`.

---

## Local Dev
```zsh
# Install (run from repo root)
npm install

# Astro frontend
npm run dev:web        # → http://localhost:4321

# Sanity Studio
npm run dev:studio     # → http://localhost:3333

# Build both
npm run build
```

---

## Env Vars
Local: `packages/web/.env.local` (gitignored — already populated with Sanity tokens)
Production: set in Netlify dashboard

| Variable | Used By | Notes |
|----------|---------|-------|
| `PUBLIC_SANITY_PROJECT_ID` | web | `4e7axyi7` |
| `PUBLIC_SANITY_DATASET` | web | `production` |
| `PUBLIC_SANITY_API_VERSION` | web | `2025-04-26` |
| `SANITY_API_WRITE_TOKEN` | web functions | Server-only — creates lead submissions, never expose to browser |
| `PUBLIC_SITE_URL` | web | Canonical URL for meta/og |
| `PUBLIC_BOOKING_EMAIL` | web | Used on Book Now `mailto:` links |
| `PUBLIC_MAPBOX_ACCESS_TOKEN` | web | Browser-safe `pk.` token for the contact map, address search, and directions; production token is URL-restricted |

---

## Git Push Protocol
Use Desktop Commander (`mcp__Desktop_Commander__start_process`) to run `git push` — it executes as `ambermin` with Keychain access.

```zsh
cd ~/LocalStorm/Workspace/DevProjects/house_of_rose/house-of-rose-site && git push origin main
```

---

## Preferences
- Strict TypeScript — no `any`, use interfaces + generics
- GROQ queries live in `packages/web/src/lib/queries.ts`
- Sanity client/helpers live in `packages/web/src/lib/sanity.ts`
- Create files in place — don't just output code blocks
- Explain the *why* and *how*, skip pleasantries
