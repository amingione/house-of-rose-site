# Website Structure & Sitemap — House of Rose Aesthetics
*Generated via 05/01 · 2026-06-21 · maps to existing Astro routes + Sanity types + AEO page model.*

## Sitemap (tree)
```
/                          Home — full destination, all lanes, social proof, CTA
/services                  All services (grouped by lane/collection)
  /services/collections                 All collections (lanes)
  /services/collections/[collection]    One lane (Skin, Regeneration, Injectables, Wellness, Beauty)
  /services/[slug]                       One service (Service page type)
/plans                     Regeneration Plans (Rose Method programs)
/memberships               Membership tiers
/experience               The space, philosophy, what a visit feels like
/results                  Before/after proof hub  → /results/[slug] (case studies)
/cost/[slug]              Cost guides (AEO)        e.g. /cost/microchanneling
/compare/[slug]           Comparisons (AEO)        e.g. /compare/prf-vs-filler
/areas · /areas/[slug]    Local authority (Punta Gorda, Port Charlotte, Charlotte County…)
/faq                      FAQ hub (FAQPage JSON-LD)
/about                    Story, founder, standard
/contact                  NAP, map, booking, hours
/book                     Booking / consultation request (lead capture)
/privacy · /terms         Legal
```

## Page-type → Sanity / route mapping
| Page type (AEO) | Route | Sanity type |
|---|---|---|
| Service | `/services/[slug]` | `service` |
| Cost guide | `/cost/[slug]` | `costGuide` |
| Comparison | `/compare/[slug]` | `comparison` |
| Local area | `/areas/[slug]` | `localArea` |
| Before/after | `/results/[slug]` | `caseStudy` |
| FAQ | `/faq` | `faq` (aggregated) |
| Process | `/plans`, `/experience` | `membership` / static |

## Internal-linking & conversion paths
- Every Service links to: related lane, relevant Cost guide, a Comparison, FAQ, and **Book Now**.
- Home → lanes → service → consultation → plan/membership (the LTV path).
- No orphan pages; each AEO page links up to its hub and across to a sibling.
- Persistent CTAs: **Book Now** (burgundy) in header/footer + section CTAs.

*Tagline anchor: "Where beauty blooms within."*
