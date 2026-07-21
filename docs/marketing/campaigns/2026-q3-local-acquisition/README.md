# House of Rose — Q3 Local Client Acquisition Kit

This package turns the 30-day acquisition plan into publish-ready campaign inputs for House of Rose Aesthetics in Punta Gorda, Florida. It is built for a new local audience and leads with the real studio, a consultation-first experience, and provider judgment rather than discounts or exaggerated outcomes.

## Campaign anchor

- **Goal:** qualified consultation requests and booked appointments.
- **Audience:** adults 35+ within 20 miles of 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950.
- **Core message:** see the studio, understand the options, and begin with a clear plan.
- **Luxury angle:** private, appointment-only care with hospitality-grade attention and restrained recommendations.
- **Primary CTA:** Begin with a complimentary skin consultation.
- **Paid destinations:** `/skin-analysis/`, `/services/injectables/`, `/services/glo2facial/`, and `/services/microchanneling/`.

## Launch package

- [`copy/meta-ad-copy.md`](copy/meta-ad-copy.md) — 12 complete Meta ad combinations.
- [`copy/google-search-ads.csv`](copy/google-search-ads.csv) — three responsive-search ad banks.
- [`copy/organic-captions.md`](copy/organic-captions.md) — Google Business Profile, Instagram/Facebook, Nextdoor, and YouTube Shorts copy.
- [`operations/media-buy-setup.md`](operations/media-buy-setup.md) — exact campaign, audience, budget, keyword, negative-keyword, and UTM setup.
- [`operations/measurement-runbook.md`](operations/measurement-runbook.md) — lead definitions, response workflow, optimization rules, and acceptance tests.
- [`operations/performance-tracker.csv`](operations/performance-tracker.csv) — daily reporting template.
- [`production/on-site-video-shot-list.md`](production/on-site-video-shot-list.md) — the real-footage capture plan and three provider scripts.
- `exports/` — generated separately by `scripts/marketing/render-local-acquisition-assets.mjs` into the durable creative output directory.

## Creative routes

| ID | Route | Hook | Source truth | Landing page |
| --- | --- | --- | --- | --- |
| 01 | Local proof | You've passed it. Now come inside. | Real exterior | `/skin-analysis/` |
| 02 | Consultation | See your skin first. | Real welcome area | `/skin-analysis/` |
| 03 | Studio experience | A private appointment. A clear plan. | Real studio arrival and exterior | `/skin-analysis/` |
| 04 | Advanced skin | Skin quality, planned. | House of Rose ProCell product photograph | `/services/microchanneling/` |
| 05 | Injectables | Injectables, with restraint. | Real injectables room | `/services/injectables/` |
| 06 | Provider voice | Meet the person behind the plan. | Supplied Diana, RN portrait | `/services/injectables/` |

## Source and compliance record

- The exterior, welcome-area, studio-arrival, product, and treatment-room images are used without changing the identity or architecture of the studio.
- The provider portrait is composed without facial retouching or synthetic alteration.
- The supplied Glo2Facial before/after image is not included in paid creative. It may be considered only after written consent is recorded and the platform placement is reviewed.
- The existing text-heavy Botox room composite is used only as a crop source for the real treatment room; its old claims and embedded ad copy are excluded.
- No synthetic clients, testimonials, skin results, certifications, prices, or urgency claims are used.
- Final treatment recommendations and candidacy are confirmed by the licensed provider. Individual outcomes vary, and not every client is a candidate for every service.

## Verified business facts

- **Name:** House of Rose Aesthetics
- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950
- **Phone:** (844) 941-7673
- **Hours:** Monday–Friday, 9:00 AM–5:00 PM; weekends closed
- **Phase-one services:** AI-assisted skin consultation, Glo2Facial, ProCell microchanneling, Botox, Daxxify, and dermal fillers.

Business facts and current service names were checked against `CLAUDE.md`, `docs/research/_pricing-catalog.md`, and the current service routes. Prices are intentionally omitted from the ads because display and commerce sources still contain differences that must not be flattened.

## Publishing boundary

This kit prepares the creative, copy, URLs, measurement conventions, and upload settings. It does not activate advertising spend, publish to social accounts, or deploy the website. Those external actions require the owner to review the final platform previews and explicitly authorize launch.
