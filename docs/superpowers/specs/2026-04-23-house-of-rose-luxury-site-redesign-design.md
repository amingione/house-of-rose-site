# House of Rose Luxury Website Redesign Spec

Date: 2026-04-23
Status: Implemented and verified
Owner: Frontend (fas-cms-fresh)

## 1. Objective

Redesign the website to deliver a luxury, image-led experience aligned with the referenced Framer style direction, while preserving existing system authority boundaries:

- Medusa remains commerce authority (pricing/package signals)
- Sanity remains content authority (descriptions, marketing copy)
- Frontend remains UI/presentation authority only

## 2. Scope

### In scope (v1)

1. Home page (`/`)
2. Services Hub (`/services`)
3. One detail page per service (`/services/[slug]`)
4. About/Experience page (`/experience`)
5. Contact conversion blocks (home + footer reuse)
6. Sticky shrinking header behavior on all pages
7. Full responsive behavior for mobile/tablet/desktop

### Out of scope

1. New commerce logic in frontend
2. Stripe or Shippo direct integrations
3. Sanity schema redesign
4. New service creation workflow changes

## 3. Visual Direction

### 3.1 Chosen direction

- Desktop composition style: Option A (editorial luxury, open composition)
- Mobile header style: Option B header treatment (cleaner mobile rendering)
- Color palette: black + gold aligned with House of Rose brand

### 3.2 Hard visual rules

1. Major media surfaces are edge-to-edge where specified (no framed first-view look)
2. No rounded corners on hero/major sections and storytelling image blocks
3. No border/outline card treatment for primary storytelling sections
4. Typography and spacing must avoid nav overlap at all desktop widths
5. Mobile layouts must be crop-safe and readable across small screens

## 4. Header Behavior Specification

Header appears on all pages and uses two states:

1. **Top-over-hero state**
- Transparent/glass appearance
- Sits over hero image
- Larger vertical size

2. **Scrolled state**
- Solid background matching site canvas tone
- Shrinks by approximately 16-20% (height/padding/logo/nav scale)
- Remains sticky
- Transition must be smooth and seamless (no visual jump)

### Navigation behavior

- Desktop: Home, Services, Experience, Contact + primary CTA
- Medium widths: reduce nav density and spacing to prevent overlap
- Mobile: compact bar with brand + menu trigger

## 5. Information Architecture

### 5.1 Home (`/`)

1. Full viewport hero (edge-to-edge)
2. Split section: text/value proposition + accent image
3. Full-bleed image section with overlay text
4. Service preview section linking into service pages
5. Experience teaser linking to `/experience`
6. Contact conversion block (book/phone/email)

### 5.2 Services Hub (`/services`)

1. Full-bleed hero intro
2. Service index (one item per service with concise summary)
3. “How to choose” 3-step orientation block
4. Final consultation CTA

### 5.3 Service Detail (`/services/[slug]`)

1. Service-specific hero
2. “What it is / who it is for” section
3. Results/process section
4. FAQ mini-section (2-4 key items)
5. Related services links
6. Final conversion CTA

### 5.4 Experience (`/experience`)

1. Hero + brand narrative
2. Studio philosophy and care standard
3. Guest journey timeline
4. Final CTA

### 5.5 Contact model

- Primary contact conversion on Home
- Repeated contact access via footer on all pages
- No separate `/contact` route in v1 (can be added in a follow-up iteration if requested)

## 6. Responsive Design Requirements

### 6.1 Breakpoint expectations

- Mobile: 320-767 px
- Tablet: 768-1023 px
- Desktop: 1024+ px

### 6.2 Mobile requirements

1. No horizontal overflow
2. Hero remains full-width with safe text zone
3. Header transitions correctly between transparent and solid states
4. Navigation uses compact mobile pattern (non-overlapping)
5. Accent images are chosen and cropped to remain visually complete in narrow viewports

### 6.3 Desktop/tablet requirements

1. Desktop nav must never overlap or wrap into unreadable collisions
2. Full-bleed sections maintain continuity without faux card framing
3. Section rhythm matches luxury editorial spacing (generous but controlled)

## 7. Data and Authority Boundaries

1. Pricing/package signals continue to come from Medusa via existing frontend Medusa adapter
2. Service copy, descriptions, highlights, and FAQs continue to come from Sanity fallback/content model
3. Frontend does not compute commerce logic; renders only returned content/signals
4. No direct Stripe/Shippo usage in frontend

## 8. Error Handling and Fallback Behavior

1. If content fields are missing, fallback content must preserve layout integrity
2. If Medusa package signal is unavailable, UI displays non-breaking fallback messaging
3. Header behavior degrades gracefully if JS fails (remains usable/static)
4. Images must retain acceptable layout via object-fit and focal positioning

## 9. Testing and Acceptance Criteria

### 9.1 Functional acceptance

1. All v1 pages exist and are linked from site navigation or section CTAs
2. Sticky shrinking header behavior works on Home, Services, Service Detail, Experience
3. Transparent-over-hero to solid transition is visible and smooth
4. One page exists for each service slug in content source

### 9.2 Responsive acceptance

1. Mobile (320/375/430 widths): no overlap in header or section text
2. Tablet (768/820/1024 widths): section transitions remain visually coherent
3. Desktop (1280/1440 widths): full visual hierarchy matches approved direction

### 9.3 Visual acceptance

1. No rounded corners on major hero/full-bleed storytelling surfaces
2. No bordered/outlined card look for primary narrative sections
3. Full-bleed sections touch viewport edges as specified
4. Visual language reflects black/gold luxury palette and reference-inspired rhythm

## 10. Delivery Notes

Implementation should be done by patching existing page structure and styles, not architectural redesign. Existing route framework and content sourcing should be reused and tightened to this spec.

## 11. Implementation Status

- [x] Home page (`/`) implemented
- [x] Services hub (`/services`) implemented
- [x] Service detail pages (`/services/[slug]`) implemented
- [x] Experience page (`/experience`) implemented
- [x] Contact conversion blocks shipped on home and footer surfaces
- [x] Sticky shrinking header behavior shipped across core pages
- [x] Responsive spot checks covered for mobile and desktop layouts
- [x] Final verification completed with `npm run lint`, `npm run build`, and `npm run test:e2e`
