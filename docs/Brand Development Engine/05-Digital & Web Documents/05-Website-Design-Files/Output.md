# Website Design Files (spec) — House of Rose Aesthetics
*Generated via 05/05 · 2026-06-21 · desktop + mobile, built on the design system (02-07). Astro + Tailwind.*

## Global
- Tokens: `hor.*` colors, Cormorant/Montserrat/EB Garamond, 8px spacing, 96px+ section padding,
  hairline borders over shadows.
- Header: wordmark left · nav (Services, Plans, Memberships, Experience, Results, About, Contact) ·
  Book Now (burgundy). Mobile: monogram + drawer.
- Footer: monogram-repeat bg, NAP, booking email, social line-icons, tagline.

## Page comps (desktop + mobile)
1. **Home** — hero (eyebrow + H1 + sub + CTA + warm image), lanes grid (5 cards), Rose Method strip,
   trust strip, proof, closing CTA.
2. **Services hub** — collection cards; **Service page** — answer-first hero, experience, outcome,
   "From $X" PriceTag, FAQ accordion, related/compare, sticky Book CTA (mobile).
3. **Plans / Memberships** — tier cards, comparison, FAQ, CTA.
4. **Experience / About** — editorial long-form, image+text alternating, story pillars.
5. **Results** — gallery of consented case studies (caseStudy cards).
6. **Cost / Compare / Areas** — AEO templates: answer-first intro, structured body, JSON-LD.
7. **Contact / Book** — form (ivory fields, gold focus), map, NAP, hours.

## Components used
Button, SectionHeading (eyebrow+H), ServiceCard, PriceTag (enforces "From $X"), Testimonial,
Accordion (FAQ), Header, Footer, Form, Badge, Divider (gold + rose tick).

## Interaction & a11y
Gold focus rings; 44px tap targets; hover lifts card border to gold; reduced-motion respected;
semantic headings; alt text; WCAG AA contrast.

## Build notes
Pure Astro components in `packages/web/src/components/`; data via GROQ at build; static output. A
`/styleguide` route to document states.

*Tagline anchor: "Where beauty blooms within."*
