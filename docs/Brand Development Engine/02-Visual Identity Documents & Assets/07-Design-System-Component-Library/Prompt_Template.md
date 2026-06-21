# Prompt Template — Design System / Component Library
*House of Rose Aesthetics · 02 Visual Identity · run with an AI execution agent (and a designer/dev).*

## ROLE
You are a design-systems lead. You translate brand identity into reusable digital UI components and
tokens so the website and digital products stay consistent and on-brand.

## GOAL
Produce a **Design System / Component Library** spec for House of Rose Aesthetics: design tokens and
core components (buttons, forms, cards, nav, etc.) with variants and states — expressing the brand
digitally and feeding the website build.

## BRAND CONTEXT (inherit — do not contradict)
- House of Rose Aesthetics · Punta Gorda, FL · by appointment. Tagline: **"Where beauty blooms within."**
- Category: **Advanced Aesthetics** — never medical / med spa / boutique / luxury self-label.
- A **full destination** — the system serves every service lane + membership + booking.
- **Energy → visual:** fresh, modern, radiant + bold, iconic; **fashion-house elegance** with
  rose/bloom warmth. Generous whitespace, editorial layout, refined motion — **never clinical,
  never a flat dark "coffin."**
- Pull from the Color Palette + Typography + Logo specs in this phase. (Full brief:
  `../01-Strategy & Foundation Documents/00-HoR-Brand-Context.md`.)
- Tech note (House of Rose site): Astro + Tailwind + Sanity — tokens should map cleanly to that
  stack where relevant.

## INPUT (fill before running)
- Final color palette + typography tokens (from docs 02 & 03):
- Components the site/products need (buttons, forms, cards, nav, membership tiers, service cards…):
- Accessibility target (WCAG AA):

## INSTRUCTIONS (think step by step)
1. Define **design tokens**: color, typography, spacing scale, radius, shadow, motion.
2. Define **core components** (button, input/form, card, nav/header, footer, service/membership
   card, badge, modal) with variants and states (default, hover, focus, disabled, error).
3. Specify layout primitives (grid, container widths, breakpoints) and spacing rhythm.
4. Bake in accessibility (contrast, focus states, tap targets, motion-reduce).
5. Note how tokens map to the brand specs and (where relevant) Tailwind/Astro.

## OUTPUT FORMAT
### Design tokens
### Core components (variants & states)
### Layout & spacing system
### Accessibility standards
### Token → brand/stack mapping

## QUALITY CONTROL (self-check before finishing)
- [ ] Tokens trace to the real palette/typography/logo specs.
- [ ] Components cover the full destination's UI needs with states.
- [ ] Editorial, elevated, fashion-house — never clinical or coffin-dark.
- [ ] Accessible (WCAG AA); maps cleanly to the site stack.
- [ ] ANTI-GENERIC: if the system could skin any spa site, refine until unmistakably House of Rose.
