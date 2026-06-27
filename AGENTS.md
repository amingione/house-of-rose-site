# House of Rose — Agent Rules

## This is an Astro + Sanity project

NOT Next.js. NOT React. NOT Medusa. NOT Vendure.

Read `CLAUDE.md` before any work.

## Marketing / SEO / AEO — MANDATORY when touching customer-facing content

This site is built for **Answer Engine Optimization** (AI Overviews, ChatGPT/Perplexity) +
local authority, not just keyword SEO. Before creating or editing any public page or content
document, read:

- `docs/SEO-AEO-PLAYBOOK.md` — the strategy, the 7 page types, writing rules, the publish checklist.
- `docs/CONTENT-MODEL-MAP.md` — page type → Sanity doc type → route → JSON-LD → GROQ query.
- `docs/COMPLIANCE-COPY-RULES.md` — the binding approved-vs-avoid copy rules (FL med-spa context;
  no reverse-aging / guarantees / stem-cell / cure-disease / Groupon / unsupported exosome-peptide claims).

Hard rules (inherited by every task):
1. Every content page is one of the **7 canonical page types** — never invent ad-hoc page shapes.
2. Every new content page **MUST ship valid JSON-LD** via `src/lib/structuredData.ts`
   (never hand-roll schema objects in pages).
3. **Answer-first, entity-clear, locally grounded** copy (Punta Gorda / Charlotte County / SW FL).
4. Use real NAP only (canonical in `siteSettings` + `structuredData.ts`) — invent nothing.
5. No orphan pages: wire internal links + `sitemap.xml.ts` + `llms.txt.ts`.
6. New page-type doc types: shared `seo` + `faq` objects, registered in `schemas/index.ts`,
   listed under the Marketing / SEO group in `structure.ts`.
7. **Compliance is non-negotiable** — never call House of Rose a "med spa"; no guarantees,
   reverse-aging, stem-cell, cure/treat-disease, Groupon/discount, or unsupported exosome/peptide
   claims. Follow `docs/COMPLIANCE-COPY-RULES.md` on every customer-facing surface.

## Framework Rules
- Pages are `.astro` files — use Astro component syntax
- Layouts extend `src/layouts/BaseLayout.astro`
- All data fetching happens in the component front-matter (the `---` block)
- Use `sanityFetch<T>()` from `src/lib/sanity.ts` for all GROQ queries
- GROQ queries are defined in `src/lib/queries.ts` — add new ones there, don't inline them in pages
- `output: 'static'` — `getStaticPaths()` is required for dynamic routes

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
