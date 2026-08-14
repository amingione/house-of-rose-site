# Site Audit — Current Source Reconciliation

**Original Ahrefs crawl:** 2026-08-03 · **Current source review:** 2026-08-14

The original crawl measured a previously deployed catalog. It is useful historical evidence, but its
product-page counts are not the current implementation queue. Repository state, the active feature
gates, a fresh build, and route-level verification decide whether a source change is warranted.

## Storefront state

The public shop, cart, checkout entry point, merchant feed, and shop discovery links are temporarily
disabled unless `PUBLIC_SHOP_ENABLED=true` at build time. `packages/web/netlify.toml` also forces
`/shop/*`, `/cart/*`, and `/checkout/*` to 404 while that gate is off.

Consequences:

- Product URLs from the old crawl are not currently indexable public routes.
- They must not be added to the sitemap or Merchant Center feed while the storefront is disabled.
- Old product metadata, structured-data, and internal-link counts are not current source defects.
- Enabling the storefront is an explicit launch decision, not a template cleanup inferred from a
  historical crawl.

The product, checkout, shipping, and order source remains in the repository so it can be validated
before an approved launch. That dormant source must still follow the current factual-copy and direct-
action rules; it is not permission to publish generated benefits, rotating CTA phrases, or generic
search text.

## Current public-build evidence

The current verification stack covers the active public build:

- `npm run build:web` generates the static site from the current feature flags and reviewed content.
- `npm run verify:public-dist` validates JSON-LD parsing and entity IDs, internal anchors, retired-route
  absence, current metadata ceilings, reviewed service facts, and the 200 KB delivery budget for every
  locally referenced public image.
- `npm run verify:visibility` checks the current indexable/noindex plan across emitted HTML.
- `npm run guard:drift` blocks retired routes, programs, wrong NAP, and prohibited source facts.
- `npm run ve:check` verifies click-to-edit coverage for Sanity-backed public content.

These gates replace the old assumptions that a fixed set of oversized images, missing alt fields,
malformed product schemas, or orphaned product pages remains active. A fresh failing route or test is
required before changing current source.

## Storefront re-enable acceptance

When Amber explicitly restores `PUBLIC_SHOP_ENABLED=true`, run a new launch audit against that exact
build rather than reviving the August crawl counts. The acceptance review must cover:

- intended product routes in the sitemap and Merchant Center feed;
- unique, factual metadata based on reviewed product records rather than one repeated benefit formula;
- valid Product schema with accurate price, availability, brand, and canonical URL;
- useful catalog and related-product navigation without manufacturing product claims;
- image delivery size and alt text for the assets the enabled build actually references;
- cart, Stripe Elements, live Shippo rate, order, confirmation, and email contracts;
- the temporary edge 404 rules removed in the same approved launch change.

No historical product count defines the expected launch inventory. The enabled Sanity records and the
same build's generated routes are the authority.

## Remaining non-source work

Google Business Profile review, GSC reconnection, and Ahrefs Bot Analytics are authenticated external
tasks. Deployment parity also requires an authorized deploy followed by the repository's deployment
verifiers. None of those gaps is corrected by inventing a website edit or changing the external board
without permission.

## Authoritative evidence

- Storefront flag: `packages/web/src/lib/features.ts`
- Edge gate: `packages/web/netlify.toml`
- Shop and checkout law: `CLAUDE.md` and `docs/CHECKOUT.md`
- Sitemap/feed gates: `packages/web/src/pages/sitemap.xml.ts` and
  `packages/web/src/pages/feeds/google-merchant.xml.ts`
- Public route contracts: `scripts/public-integrity.test.mjs`
- Visibility contract: `scripts/verify-visibility-plan.mjs`

The historical crawl should be rerun after an approved deploy or storefront launch. Until then, it is
not a substitute for present-source evidence.
