# Design System / Component Library — House of Rose Aesthetics
*Generated via 02-Visual/07 · 2026-06-21 · for the Astro + Tailwind stack. Aligned to color (02-02) + type (02-03).*

The component layer that turns the visual system into a buildable UI kit. Maps 1:1 to Astro
components + Tailwind tokens; editorial, airy, fashion-house — never clinical.

## Foundations (tokens)
- **Color:** `hor.*` tokens (see Color Palette 02-02).
- **Type:** `font-display` (Cormorant), `font-body` (EB Garamond), `font-ui` (Montserrat).
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px. Generous section padding (96+ on desktop).
- **Radius:** 2px (sharp/editorial) for cards/inputs; pill for primary buttons only if desired —
  default to subtle 2px. **Shadows:** minimal; prefer hairline gold/ink borders over drop shadows.
- **Breakpoints:** Tailwind defaults (sm 640 / md 768 / lg 1024 / xl 1280).

## Core components (variants + states)
- **Button** — Primary (burgundy/ivory), Secondary (ivory/ink + gold border), Ghost (text + gold
  underline). States: default / hover (deepen) / focus (gold ring) / disabled (greige).
- **Eyebrow + Heading block** — Montserrat tracked eyebrow over Cormorant H. Used atop every section.
- **Card** — service / package / membership: image, eyebrow, title, 1-line outcome, "From $X", CTA.
  Hairline border, hover lifts border to gold.
- **Price tag** — always renders "From $X" / range; never a bare number (enforced in the component).
- **Nav / Header** — wordmark left, lanes nav, "Book Now" primary CTA (burgundy). Mobile: monogram +
  drawer.
- **Footer** — monogram, NAP, booking email, social line-icons, tagline, monogram-repeat pattern bg.
- **Forms / Inputs** — ivory field, ink text, gold focus ring; lead-capture + booking.
- **Testimonial / Quote** — italic Cormorant pull-quote, gold rule, attribution (consent-based).
- **Section dividers** — gold hairline + rose tick (from Pattern library).
- **Badge** — "Licensed providers," "CARE-certified," "Member" — Montserrat caps, small.

## Accessibility
WCAG AA contrast (Ink/Ivory, Ivory/Burgundy, Gold for large/decorative only); visible gold focus
rings; 44px min tap targets; semantic headings; alt text on imagery.

## Mapping to the repo
Build as Astro components in `packages/web/src/components/` (Button.astro, SectionHeading.astro,
ServiceCard.astro, PriceTag.astro, Header.astro, Footer.astro…), styled with the `hor.*` Tailwind
tokens. Keep pure-Astro (no React islands) per project law unless interactivity requires it.

## To-do
- [ ] Stand up the token config + base components; document states in Storybook or a `/styleguide` route.

*Tagline anchor: "Where beauty blooms within."*
