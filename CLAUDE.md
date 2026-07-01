# House of Rose — Working Memory

## Business
House of Rose is a luxury spa & wellness brand.
This is a **completely separate business from FAS Motorsports** — no shared infrastructure, no Medusa, no Vendure.

---

## Canonical Business Facts (NAP — never drift; source of truth = Sanity `siteSettings`)
- **Name:** House of Rose Aesthetics
- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950 — _"Unit 9" (never Ste/Suite); ZIP 33950 (never 33982)_
- **Phone:** (844) 941-7673 — spells **ROSE**; E.164 `+18449417673`; **never `7376`**
- **Email:** info@houseofrosefl.com — _`book@…` was never a real address; do not use it anywhere_
- **Hours:** Mon–Fri 10:00 AM–6:00 PM · Sat–Sun closed
- **Web/social:** https://houseofrosefl.com · IG `houseofrosefl` · FB `House-Of-Rose-Aesthetics` · opened June 15, 2026
- **GBP primary category:** `Medical spa` (backend ranking field only). **In customer-facing prose always "advanced aesthetics & wellness studio" — never "med spa / medical spa / day spa".**
- **GBP CTA:** call/text (no online-booking button).

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
  `homepage`, `membershipsPage`, `contactPage`, `privacyPolicy`, `rentARoom`,
  `skinAnalysis`, `thankYou` — each edited under Studio → **Pages** (or **Home Page**),
  rendered with Sanity-first + hardcoded fallbacks, fully click-to-edit. Forms
  (contact, rent-a-room) and JSON-LD were left untouched. Every site page is now
  inline-editable (`ve:check` = 0 missing).

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
| `product` | Retail product — skincare, candles, gift cards |

---

## Routes (packages/web/src/pages/)
| Route | File | Data Source |
|-------|------|-------------|
| `/` | `index.astro` | All services + collections |
| `/services` | `services/index.astro` | All services |
| `/services/[slug]` | `services/[slug].astro` | Single service by slug |
| `/services/collections` | `services/collections/index.astro` | All collections |
| `/services/collections/[collection]` | `services/collections/[collection].astro` | Single collection |
| `/experience` | `experience.astro` | Static |
| `/cost/[slug]` | `cost/[slug].astro` | Cost guide by slug (`costGuide`) |
| `/compare/[slug]` | `compare/[slug].astro` | Comparison by slug (`comparison`) |
| `/areas` · `/areas/[slug]` | `areas/...` | Local authority pages (`localArea`) |
| `/results` · `/results/[slug]` | `results/...` | Before/after proof (`caseStudy`) |
| `/faq` | `faq.astro` | Aggregated FAQ hub (FAQPage JSON-LD) |
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
