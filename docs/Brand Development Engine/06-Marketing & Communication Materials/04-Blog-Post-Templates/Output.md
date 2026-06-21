# Blog / Resource Templates — House of Rose Aesthetics
*Generated via 06/04 · 2026-06-21 · answer-first structures for local authority + AEO. Maps to Sanity + JSON-LD.*

## Article structures
1. **Cost guide** (`costGuide`): answer-first ("In Punta Gorda, [service] typically starts from
   $X…") → what affects price → what's included at House of Rose → FAQ → CTA. JSON-LD: Article + FAQ.
2. **How-to / process:** answer-first → step-by-step (the Rose Method or a treatment journey) →
   aftercare → CTA. JSON-LD: HowTo (where valid) + Article.
3. **Comparison** (`comparison`): answer-first verdict → side-by-side (e.g., PRF vs filler) → who each
   suits → "talk to a provider" → CTA. JSON-LD: Article.
4. **FAQ hub / explainer:** grouped answer-first Q&A → CTA. JSON-LD: FAQPage.

## Answer-first style rule
First sentence answers the title. Then context. Locally grounded (Punta Gorda / Charlotte County).
No fluff intros.

## Writing style guide
Voice: confident, warm, specific. Length: 700–1,400 words. Sentence case headings. Internal links:
≥2 services + 1 related guide + FAQ + Book. "From $X" pricing. Compliance: designed-to language,
defer to providers, individual results. One clear CTA.

## Sanity / JSON-LD mapping
Body → Portable Text; `seo` (title/desc/og); `faq[]` where used; structured data via
`structuredData.ts` builders (never inline). Slug patterns: `/cost/[slug]`, `/compare/[slug]`,
`/areas/[slug]`, `/blog/[slug]`.

*Tagline anchor: "Where beauty blooms within."*
