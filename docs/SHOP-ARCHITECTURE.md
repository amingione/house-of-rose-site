# Shop Architecture

How `/shop` and `/shop/[slug]` work, what's Sanity-editable vs. code, and the
one hard rule for CTA copy. Written 2026-07-11 when the shop was rebuilt with
promotions, categories, top sellers, and per-brand storefronts.

## The hard rule: never name the checkout platform

Checkout runs through GlossGenius (see `BUSINESS_URLS.booking` in
`structuredData.ts` for the service-booking equivalent), but **no
customer-facing copy anywhere on the site should say "GlossGenius," "buy on
[platform]," or anything that surfaces the platform by name.** Clients don't
care what runs checkout — every button should read like it came from House of
Rose. This is enforced by convention, not code: `ctaLabel` fields are free
text specifically so editors aren't tempted to reach for a generic "Buy Now"
default. See `packages/web/src/lib/shopCta.ts` for the fallback phrase pools
used when an editor leaves `ctaLabel` blank.

## Content model

| Schema | Purpose | Repeatable? |
|---|---|---|
| `product` | A retail item. `purchaseUrl` (external checkout link), `ctaLabel` (custom button text), `badge` (ribbon tag), `isFeatured` (Top Sellers rail) | Yes |
| `promotion` | A sale/announcement banner. Links internal (a promo page, a product, or a `/shop#brandKey` anchor) or external (checkout). Date-windowed and brand/category-scoped, both optional | Yes |
| `shopBrand` | Per-carried-brand storefront copy (ProCell, GlyMed+, Skin Script, Face Reality, House of Rose) — story, logo, hero image, CTA. **Not** the same as `brandProfile`, which is House of Rose's own brand-voice/strategy document | Yes |

If a brand has products but no `shopBrand` document yet, `shop.astro` falls
back to hardcoded intro copy (`FALLBACK_BRAND_COPY`) so the page never looks
broken while content is being backfilled in Studio.

## Page structure (`/shop`)

1. Hero
2. `PromoBanner` — active promotions only (`active == true` and within any
   configured date window), ordered by `orderRank`
3. `TopSellers` — products flagged `isFeatured`
4. `CategoryNav` — client-side filter pills, built from whatever categories
   are actually present in the fetched products (no hardcoded category list)
5. `BrandSpotlight` × 5 — one per carried brand, in a fixed display order
   (`BRAND_ORDER` in `shop.astro`), each anchored by `id={brandKey}` so promos
   and external links can deep-link to a section
6. Face Reality 12-Week Program callout, ordering options, phone CTA (unchanged
   from the original shop page)

`/shop/[slug]` is a full product detail page — built from the previously
unused `PRODUCT_BY_SLUG_QUERY`. It's the "tell me more" destination for
products without a `purchaseUrl` yet, and doubles as a real page (`Product`
JSON-LD, related products from the same brand) once checkout links exist.

## Swup (page transitions)

`@swup/astro` is wired in `astro.config.ts` with `theme: false` — the built-in
fade/slide/overlay themes were swapped for a custom, slower fade+lift defined
in `global.css` (`.transition-fade`, applied to `<main id="main-content">` in
`BaseLayout.astro`) to match the site's pace instead of a generic SPA snap.
`preload: { hover: true, visible: true }` prefetches links on hover and as
they scroll into view. `reloadScripts` defaults to `true`, which is why
`CategoryNav`'s filter script re-initializes correctly after a swup
navigation — it re-runs on `swup:enable` in addition to first load.

This is sitewide (any internal link benefits), not shop-specific — swup
replaces the `main` container on every navigation.

## Scroll reveal

`@polgubau/astro-reveal` — zero JS in production unless a `data-reveal`
attribute is present on the page. Imported once in `BaseLayout.astro`
(styles + init script). Components use `data-reveal="bottom|left|right|scale"`
plus `data-stagger="Nms"` on a parent wrapper for sequenced entrances. Respects
`prefers-reduced-motion` automatically.

## What's still manual

- Real GlossGenius checkout URLs (`product.purchaseUrl`, `shopBrand.externalUrl`)
  don't exist yet — GlossGenius has no live `/shop` or `/gift-cards` page for
  House of Rose as of this writing. Until an editor sets `purchaseUrl`,
  products link to their own `/shop/[slug]` detail page instead of external
  checkout (see `ProductCard.astro` and `shopCta.ts` — this switch is
  automatic, not something to configure).
- `promotion` and `shopBrand` documents don't exist in the dataset yet either.
  The page degrades gracefully (no promo banner shown, brand fallback copy
  used) until an editor creates them in Studio.
