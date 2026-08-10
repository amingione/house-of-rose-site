# House of Rose — SEO assets (Astro)

Drop these into your Astro repo. Suggested paths shown at the top of each file.

## Files

| File | Put it at | Purpose |
|---|---|---|
| `src/config/business.ts` | same | Single source of truth for NAP, hours, socials, geo. Every schema reads from here. **Fill in the `TODO` values.** |
| `src/components/seo/SchemaMedicalBusiness.astro` | same | Site-wide LocalBusiness/MedicalBusiness JSON-LD. Put once in your base layout `<head>`. |
| `src/components/seo/SchemaService.astro` | same | Per-service `Service` + `MedicalProcedure` JSON-LD. One per service page. |
| `src/components/seo/SchemaFAQ.astro` | same | `FAQPage` JSON-LD from a `{q, a}` array. Feeds AI Overviews / PAA. |
| `src/components/seo/SchemaBreadcrumb.astro` | same | `BreadcrumbList` JSON-LD. |
| `src/components/seo/BeforeAfterGallery.astro` | same | Before/after gallery that emits `ImageObject` JSON-LD. Use your own consented photos. |
| `src/pages/services/morpheus8.astro` | same | Complete, wired-up flagship page (content + FAQ + schema). |
| `src/pages/services/lip-fillers.astro` | same | Lip fillers page (KD 0). |
| `src/pages/services/iv-hydration-therapy.astro` | same | IV hydration therapy page (KD 3). |
| `src/pages/services/microchanneling.astro` | same | Microchanneling page (KD 0). |
| `src/pages/services/biorepeel.astro` | same | BioRePeel page (KD 0). |
| `src/pages/services/prp-microneedling.astro` | same | PRP microneedling / "vampire facial" page (KD 4). |
| `src/pages/services/prf.astro` | same | PRF page — under-eye, skin & hair (KD 0). |
| `src/pages/services/microneedling.astro` | same | Microneedling page (win local "microneedling fort myers", KD 0). |
| `src/pages/services/botox.astro` | same | Botox / Dysport / Xeomin / Sculptra page — bundles the KD-0 "fort myers" injectable adjacencies. |
| `src/pages/services/dermal-fillers.astro` | same | Dermal fillers page (+ Sculptra); shows example `BeforeAfterGallery` usage. |
| `src/pages/services/facials.astro` | same | Facials hub (Glo2Facial, dermaplaning, BioRePeel, microchanneling). No HydraFacial. |
| `src/pages/services/skin-analysis.astro` | same | Skin analysis / consultation — the funnel entry page. |
| `src/pages/areas/fort-myers.astro` | same | Fort Myers service-area page ("med spa fort myers"). Honest "serving" page — no fake address. |
| `src/pages/areas/cape-coral.astro` | same | Cape Coral service-area page ("med spa cape coral"). Honest "serving" page. |
| `src/pages/areas/port-charlotte.astro` | same | Port Charlotte page — your immediate neighbor; easiest local market to own. |
| `src/pages/blog/morpheus8-vs-microneedling.astro` | same | Comparison article (BlogPosting + FAQ schema) → Morpheus8 & microneedling pages. |
| `src/pages/blog/prf-vs-prp.astro` | same | Comparison article → PRF & PRP microneedling pages. |
| `src/pages/blog/morpheus8-cost-southwest-florida.astro` | same | Cost-guide article (AI-Overview target) → Morpheus8 page. |
| `src/pages/blog/botox-vs-dysport-vs-xeomin.astro` | same | Comparison article → Botox page. |
| `src/pages/blog/is-morpheus8-worth-it.astro` | same | "Is it worth it" article → Morpheus8 page + cost/vs articles. |
| `src/pages/blog/lip-filler-cost-southwest-florida.astro` | same | Lip filler cost article → lip fillers page. |
| `IMPLEMENTATION-CHECKLIST.md` | repo root or /docs | Ordered, checkbox build plan across all assets. **Start here to execute.** |
| `content/morpheus8.md` | anywhere | Raw Morpheus8 copy + FAQ, if you'd rather manage it in Sanity. |

> ⚠️ **Accuracy:** these pages cover only services House of Rose actually offers. HydraFacial and Brazilian wax were removed from the strategy because you don't provide them — don't add pages or keywords for services you don't perform.

## Setup order

1. Edit `src/config/business.ts` — fill every `TODO` (address, phone, hours, geo coords, social URLs, Google Business Profile URL).
2. Add `<SchemaMedicalBusiness />` and `<link rel="canonical" href={Astro.url.href} />` to your base layout's `<head>`.
3. Use `morpheus8.astro` as the template for every other service page.

## Notes
- All JSON-LD validates against schema.org. Test with the **Rich Results Test** (search.google.com/test/rich-results) and Schema Markup Validator (validator.schema.org) after deploy.
- `MedicalBusiness` is the schema.org type closest to a med spa. We add `additionalType` for "MedicalSpa" as a hint.
- Keep NAP **identical** here, on Google Business Profile, Yelp, Facebook, Apple Maps — entity consistency is what makes AI assistants confident enough to recommend you.
- Don't invent an `aggregateRating` — only include it once you have real, on-site reviews, or Google may flag it. It's wired to render only when populated.
