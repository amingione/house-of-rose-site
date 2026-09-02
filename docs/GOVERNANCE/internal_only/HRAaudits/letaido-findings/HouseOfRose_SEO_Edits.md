# House of Rose SEO observations — current-source reconciliation

The original August 2026 draft mixed a small, stale GSC sample with assumed metadata, unsupported services, retired routes, and copy written before the House of Rose voice reset. It is not a paste-ready edit list.

## What the historical data can still tell us

The earlier export recorded impressions for the House of Rose name and Procell Microchanneling. That establishes search interest during the sampled period. It does not prove that a specific title, H1, phrase, or route caused the observed position or click-through rate, and it does not establish current performance because GSC stopped syncing on 2026-06-25.

Use a fresh production URL, current Search Console data, and the generated metadata before diagnosing a click-through problem. Never label an assumed title or description as the current value.

## Current implementation

### Homepage

The homepage is the practice-identity route. It leads with House of Rose as a Medical Aesthetics Practice in Punta Gorda and connects visitors to the current service, provider, consultation, and visit-planning paths.

Do not force a keyword list into the title or description, and do not require every page to repeat a homepage anchor in its body. The shared header, breadcrumbs where appropriate, and footer already provide consistent navigation; contextual links should answer the visitor's next question.

### Microneedling

The canonical route is `/services/microneedling/`. It identifies Procell Microneedling, distinguishes the Pro and MD topical-serum options from topical PRF, publishes the verified appointment choices, names Amber Mingione, Licensed Esthetician, and links her provider profile.

The service H1 remains entity-first. Geographic intent belongs to the `localArea` page type, not a geo-loaded service H1 or a duplicate city service page. Search-query wording can inform factual supporting copy only when it accurately describes the current service.

## Unsupported query handling

An impression for a service name does not mean House of Rose offers it. Dysport, Bellafill, facelift surgery, massage, hormone therapy, HGH therapy, laser hair removal, and Clear + Brilliant are not authorized additions to homepage metadata or service pages merely because they appeared in a query export.

When a search term does not map to current commerce truth:

1. Do not add the term to public copy as an implied service.
2. Do not create a route or redirect destination for it.
3. Confirm current inventory with GlossGenius and the canonical pricing ledger before any content work.
4. Keep medical-direction and provider-scope attribution accurate for the service that actually exists.

## Valid implementation sequence

1. Reconnect current GSC data and compare the exact production URL, query, impressions, clicks, and date range.
2. Inspect the generated title, description, canonical, H1, structured data, sitemap entry, and contextual internal links for that route.
3. Determine whether the page answers the visitor's decision with verified facts. Do not substitute keyword repetition or a generic booking command for a missing answer.
4. Use the documented page type: service facts on `/services/[slug]/`, geographic trip-planning on `/areas/[slug]/`, and research intent in a reviewed concern, comparison, cost, or journal page.
5. Re-measure after deployment. A proposed wording change is not evidence of ranking or click-through improvement.

This reconciliation preserves the historical observations without treating old estimates, assumed metadata, or adjacent service queries as public-copy instructions.
