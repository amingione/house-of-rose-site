# Retail Product Records — Dormant Storefront Boundaries

**Reviewed:** 2026-08-14

**Status:** retained implementation research only. The storefront is opt-in and remains disabled unless
`PUBLIC_SHOP_ENABLED=true`, and Netlify currently returns forced 404 responses for `/shop/`,
`/checkout/`, and `/order-confirmed/` routes.

**Purpose:** prevent stored product records and old merchandising ideas from being mistaken for current
inventory, public copy, treatment guidance, or an approved sales plan.

## Current answer

House of Rose has retained product, brand, cart, checkout, shipping, and order-management source code.
That retained implementation does not establish that a product is currently stocked, available for
pickup, available for shipping, appropriate after a treatment, or approved for public promotion.

No public page should link to the disabled storefront. Do not describe House of Rose as currently
carrying a line merely because Sanity contains product records or the product schema recognizes a brand
key.

## Commerce truth while the shop is disabled

Service and retail facts use different authorities:

- **Service appointments:** GlossGenius is commerce truth, mirrored in
  `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD` before public use.
- **Retail products after an approved storefront restoration:** Sanity owns the product title, price in
  cents, availability, sellable quantity, shipping data, images, identifiers, and checkout inputs.
- **Current stock while the storefront is disabled:** confirm directly with House of Rose. A stored
  product document is not proof of current stock or a public offer.

Do not copy service-price rules onto products, and do not use an old product document to override the
current service ledger.

## Retained data is not a catalog claim

The product schema retains legacy brand keys for Procell Therapies, GlyMed+, Skin Script, Face Reality,
and House of Rose. These keys explain stored data and renderer grouping; they do not prove that every
line or item is currently offered.

Product names that belong to a manufacturer must remain accurate if a product is reviewed for sale.
House of Rose copy around the name may not adopt unsupported age-reversal, stem-cell, disease-treatment,
clinical-proof, or guaranteed-result claims. Never invent a compliant-sounding substitute name that
could prevent a buyer from identifying the actual product.

The Face Reality service and package pages establish that home-care products are purchased separately
from the $99 consultation and the $899 complete 12-week program. They do not establish a take-home
product list, included product value, product protocol, or public shop inventory.

## No automatic treatment-to-product pathway

A treatment appointment does not create a product recommendation. Do not teach writers or editors to:

- route every treatment into a retail purchase;
- rank brands as entry, premium, corrective, accessible, stronger, or better;
- prescribe a starter product, trial set, kit, regimen, strength, sequence, or product ladder;
- claim that a product preserves, extends, completes, or determines a treatment result;
- claim post-treatment timing or suitability without support for that exact product and procedure;
- turn a service, concern, provider profile, FAQ, or package into a storefront funnel; or
- create a comparison, concern, service, or guide route from dormant product research.

If a client asks about home care, current instructions come from the appropriate licensed professional
for that client and visit. Public copy may state only a reviewed product function, current price and
availability, and supported use boundary. It may not reconstruct a protocol from manufacturer marketing
or older research.

## Requirements before any storefront restoration

Storefront restoration is one coordinated release, not a copy toggle. It requires all of the following:

1. Amber explicitly approves the storefront returning.
2. `PUBLIC_SHOP_ENABLED=true`, Visual Editor route exposure, navigation, sitemap, merchant feed, and the
   Netlify forced-404 rules are reconciled in the same release.
3. Every publishable product is re-audited in Sanity for its exact title, slug, canonical brand,
   immutable SKU, verified GTIN/MPN decision, price, availability, inventory quantity, net content,
   primary image and alt text, shippable status, and shipping weight where relevant.
4. Product descriptions, taglines, badges, brand stories, promotions, and metadata receive current
   factual, claims, voice, and accessibility review. Old stored prose is not grandfathered in.
5. Checkout revalidates price and inventory server-side; shipping remains based on current Shippo
   quotes; payment never auto-purchases a label.
6. A fresh end-to-end test covers cart, payment, order creation, confirmation email, stock handling,
   shipping, fulfillment, consent, analytics, structured data, and recovery from failure.

Do not publish a partial catalog merely because a route builds or a product has a price.

## Copy and compliance boundaries after restoration

Place safeguards where the content creates the need:

- State a verified price directly; do not replace it with value-tier or prestige language.
- Use appearance language only when describing a supported visible effect.
- Put individual-variation language beside a material result claim, not on every product card.
- Address suitability where copy gives use guidance; do not turn every product listing into a candidacy
  disclaimer.
- Keep prescription, contraindication, and treatment-timing questions with the appropriate licensed
  professional.
- Do not advertise a free, discounted, or credited service through product merchandising.
- Do not publish a review, testimonial, before-and-after claim, manufacturer statistic, or clinical
  superlative without the required evidence and consent.

## Route boundary

While the storefront flag is off, `/shop/`, `/shop/[slug]/`, `/shop/jane-iredale/`, `/checkout/`, and
`/order-confirmed/` are not public journey guidance. Do not add internal links to them or create adjacent
retail routes.

When restoration is approved, use the existing product, brand, cart, checkout, and order architecture.
Do not create a parallel storefront, move product checkout to GlossGenius, or duplicate product prices
in a research brief.

## Source hierarchy

1. `CLAUDE.md` — current storefront status and checkout law.
2. `packages/web/src/lib/features.ts` and `packages/web/netlify.toml` — executable visibility and forced
   route behavior.
3. `packages/studio/schemas/product.ts` — retained product fields and merchant-publication requirements.
4. `packages/web/src/lib/productContract.ts`, checkout functions, and `docs/CHECKOUT.md` — price,
   inventory, measurement, shipping, and order contracts.
5. `docs/SHOP-ARCHITECTURE.md` — retained implementation map; current executable behavior wins where the
   document is stale.
6. A fresh owner-confirmed Sanity inventory audit — required before any product or brand is described as
   currently available.

Manufacturer sites and old Sanity prose may support a narrowly reviewed product fact. They do not set
House of Rose inventory, provider instructions, route strategy, voice, or client pathways.
