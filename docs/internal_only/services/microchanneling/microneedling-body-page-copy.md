# Staged Page Copy — Body Microneedling for Stretch Marks & Scars

**Status:** staged for Sanity publish — not yet written to the live `service` document.
**Live slug (do not change):** `microneedling-body` → `/services/microneedling-body/`
**Sanity note:** this page's title/tagline/description/FAQs are 100% Sanity-driven (see
`packages/web/src/pages/services/[slug].astro`) — there is no local template fallback for
individual services. This file is the staged copy for whoever pushes the Sanity edit next
(API quota was maxed at the time this was drafted).

**Verified against:** `docs/internal_only/pricing/advanced-facials-master-menu.md:104` (name/price/duration),
`docs/internal_only/research/MICRONEEDLING/microneedling.md` (protocol, candidacy, series logic), `docs/internal_only/research/_pricing-catalog.md:112`
(price cross-check). Price and duration below match the live pricing docs — do not round or
"clean up" the $325/60–90min figures without re-checking those sources first.

**Naming decision (2026-07-23):** Amber approved renaming this service from the prior
"Microneedling — Body" convention (used by every other body treatment: Procell Microchanneling
— Body, BioRePeel — Body) to a benefit-forward name. This is a deliberate exception, not a
site-wide naming pattern change — don't propagate this em-dash-free style to other body services
without asking again.

---

## Service Name
**Body Microneedling for Stretch Marks & Scars**

*(Pricing menu / GlossGenius / staff docs can keep referring to it as "Microneedling — Body" —
that's the internal/commerce name. This is the public-facing service page title only.)*

## Page H1
Body Microneedling in Punta Gorda, FL

## Price / Duration (unchanged — verified)
From **$325 per zone** · **60–90 minutes**

## Full Website Description

```markdown
## Body Microneedling in Punta Gorda, FL
**Smoother-looking skin starts beneath the surface.**

Your body deserves the same advanced skin care as your face. Body microneedling at House of
Rose Aesthetics is a customized collagen-renewal treatment designed to soften the appearance of
stretch marks, improve the look and feel of fully healed scars, and smooth uneven body texture
over time.

Using a professional precision device, we create controlled microchannels at a depth selected
for your skin, treatment area, and goals. This activates the skin's natural renewal response and
supports new collagen and elastin production. As the skin gradually remodels, treated areas can
appear smoother, firmer, and more refined.

### Benefits of Body Microneedling
- Softens the appearance of stretch marks
- Improves the visible texture of fully healed scars
- Smooths rough or uneven-looking skin
- Supports firmer, more resilient-looking skin
- Encourages gradual collagen remodeling
- Provides a customized, non-surgical treatment option

Common treatment zones include the abdomen, hips, thighs, buttocks, arms, back, and other
approved body areas. Every treatment begins with a private consultation to confirm candidacy and
customize the treatment depth, pattern, and recommended series for your skin.

Because body skin is thicker and remodels more slowly than facial skin, a series of treatments
is often recommended for meaningful visible improvement — the provider dials the exact count to
your skin and goals during consultation. Microneedling does not erase stretch marks or scars,
but it may help them appear softer, smoother, and less noticeable. Results and recovery vary.

**Ready to take your body-care routine beyond topical products? Book your Body Microneedling
consultation at House of Rose Aesthetics in Punta Gorda, serving Port Charlotte, Charlotte
County, and Southwest Florida.**
```

## Short Booking-Menu Description

```markdown
Target stretch marks, fully healed scars, and uneven body texture with customized body
microneedling. Controlled microchannels support natural collagen and elastin production, helping
treated skin look smoother, firmer, and more refined over time. Common zones include the
abdomen, hips, thighs, buttocks, arms, and back. Priced per zone. Consultation required; a series
is typically recommended.
```

## SEO Settings

| Element | Copy |
|---|---|
| **Page H1** | Body Microneedling in Punta Gorda, FL |
| **SEO Title** | Body Microneedling Punta Gorda \| Stretch Marks & Scars |
| **Meta Description** | Improve the look of stretch marks, scars and uneven texture with customized body microneedling at House of Rose Aesthetics in Punta Gorda, FL. |
| **Primary Keyword** | body microneedling Punta Gorda |
| **Supporting Keywords** | microneedling for stretch marks Punta Gorda; microneedling for scars Punta Gorda; body skin texture treatment; body microneedling near Port Charlotte |
| **Image Alt Text** | Body microneedling treatment for stretch marks at House of Rose Aesthetics in Punta Gorda, Florida |
| **URL** | `/services/microneedling-body/` — **existing, live, indexed slug. Do not change to a new URL.** |

## FAQs

### Can body microneedling remove stretch marks?
Body microneedling cannot completely remove stretch marks. It is designed to support collagen
remodeling so the marks may gradually appear smoother, softer, and less noticeable.

### How many treatments will I need?
Body concerns typically require a planned series rather than a single treatment. Your provider
will recommend the number and timing of appointments based on the treatment area, age of the
marks or scar, skin response, and desired outcome.

### What should I expect after treatment?
Temporary redness, warmth, tightness, tenderness, dryness, or light flaking may occur. Recovery
depends on the treatment area, selected depth, and individual skin response, and written
aftercare will be provided.

### What body areas can be treated?
Common areas include the abdomen, hips, thighs, buttocks, arms, back, and other approved areas
affected by stretch marks or fully healed scar texture. Candidacy is confirmed during
consultation.

## Optional Topical PRF Enhancement

```markdown
Ask whether a Topical PRF Enhancement is appropriate for your treatment plan. For eligible
clients, PRF is prepared from a small sample of your own blood and applied to the skin's surface
during the selected microneedling protocol. Candidacy is required.
```

PRF here is described as **topical only** — never injected — which matches Amber's lane
(esthetician + RN assistant, PRF topical only, no injections). Avoid "FDA-approved for stretch
marks," "permanent," "painless," "zero downtime," or "erase" — FDA clearance depends on the exact
device/indication, and outcomes aren't guaranteed.

## Not carried over from the original draft

- **New URL `/services/body-microneedling-punta-gorda/`** — dropped. The live/indexed slug is
  `microneedling-body`; changing it would break the current URL. The `-punta-gorda` suffix
  pattern belongs to cost guides (e.g. `/cost/microneedling-cost-punta-gorda/`), not service
  pages.
- **"Book Body Microneedling" button copy** — dropped for now. The booking CTA ("Book Online" /
  "Reserve Your Experience" kicker) is shared markup in `[slug].astro` used by every service
  page — changing it here would change it site-wide. Flag separately if a per-service CTA label
  is wanted; that's a template change, not a content edit.
