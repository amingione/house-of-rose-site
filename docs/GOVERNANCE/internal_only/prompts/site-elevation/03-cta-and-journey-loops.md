# PHASE 3 — CTA Differentiation & Journey Loops

Prepend `00-MASTER-PROMPT.md`. Requires Phase 2 briefs (`docs/internal_only/research/`). Goal: no two
pages feel the same, and every page loops the reader forward.

## The CTA doctrine

1. **One booking CTA max per page**, phrased for that page's moment of intent —
   "Book a PRF consult with Diana", "Start with advanced skin imaging", never a bare
   "Book now"/"Call us".
2. **Every page ends with a "Where to next" block** of 2–4 *contextual* links drawn from
   the brief's Journey Links section. Labels are specific and curiosity-driven:
   - "PRF or Procell? See the honest comparison →"
   - "What actually moves the price of microchanneling →"
   - "Not sure where to start? Let the skin analysis decide →"
   - "See real results from this protocol →"
3. **No label reused anywhere on the site.** Build
   `packages/web/src/lib/journeys.ts` — a typed registry (strict interfaces, no `any`) of
   journey edges: `{ from, to, label, intent }`. All "Where to next" blocks render from it.
   A build-time check (extend `scripts/visual-editing/` pattern or new
   `scripts/check-journeys.mjs`) fails on duplicate labels, dead-end pages, non-trailing-slash
   targets, and links to retired routes.

## The loop map

Implement the canonical journey so every entry point flows:

```
concern (/concerns/) → treatment (/services/) → comparison (/compare/) →
cost (/cost/) → results (/results/) → book (contextual CTA)
        ↘ guide (/guides/) ↗        ↘ provider card ↗       ↘ related treatment ↺
```

- Treatment pages cross-link adjacent treatments *through comparisons*, not bare lists.
- Cost guides link back to the treatment and sideways to the cheaper/adjacent alternative.
- Results pages link to the exact protocol used and its cost guide.
- Shop/product pages link to the treatments they support ("used after microchanneling →")
  and treatments link to their retail follow-through.
- IV hydration is woven in as the cross-sell edge from advanced facials and injectables
  ("why hydration status changes your results →").

## Component work

- Build a `WhereToNext.astro` component (annotated for visual editing) consuming
  `journeys.ts`; distinct visual treatment from the booking CTA so the hierarchy reads:
  learn-more paths first, booking second.
- Vary section composition per page type so templates don't feel cloned — but keep the
  design system (`docs/COLOR-CONTRAST.md`, brand stylesheet) intact. Pure Astro; no React
  islands unless interactivity is truly required.

## Deliverables

- `journeys.ts` + `WhereToNext.astro` + check script wired into `npm run build`/CI
- Every existing content page migrated to the doctrine
- `docs/JOURNEY-MAP.md` — the loop map, edge registry rationale, and how to add edges
