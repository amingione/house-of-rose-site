# House of Rose — Agent Rules

## This is an Astro + Sanity project

NOT Next.js. NOT React. NOT Medusa. NOT Vendure.

Read `CLAUDE.md` before any work.

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
