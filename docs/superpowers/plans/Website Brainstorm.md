House of Rose Luxury Website Redesign Spec
Date: 2026-04-23
Status: Draft for user review
Owner: Frontend (fas-cms-fresh)

1. Objective
Redesign the website to deliver a luxury, image-led experience aligned with the referenced Framer style direction, while preserving existing system authority boundaries:

Medusa remains commerce authority (pricing/package signals)
Sanity remains content authority (descriptions, marketing copy)
Frontend remains UI/presentation authority only
2. Scope
In scope (v1)
Home page (/)
Services Hub (/services)
One detail page per service (/services/[slug])
About/Experience page (/experience)
Contact conversion blocks (home + footer reuse)
Sticky shrinking header behavior on all pages
Full responsive behavior for mobile/tablet/desktop
Out of scope
New commerce logic in frontend
Stripe or Shippo direct integrations
Sanity schema redesign
New service creation workflow changes
3. Visual Direction
3.1 Chosen direction
Desktop composition style: Option A (editorial luxury, open composition)
Mobile header style: Option B header treatment (cleaner mobile rendering)
Color palette: black + gold aligned with House of Rose brand
3.2 Hard visual rules
Major media surfaces are edge-to-edge where specified (no framed first-view look)
No rounded corners on hero/major sections and storytelling image blocks
No border/outline card treatment for primary storytelling sections
Typography and spacing must avoid nav overlap at all desktop widths
Mobile layouts must be crop-safe and readable across small screens
4. Header Behavior Specification
Header appears on all pages and uses two states:

Top-over-hero state
Transparent/glass appearance
Sits over hero image
Larger vertical size
Scrolled state
Solid background matching site canvas tone
Shrinks by approximately 16-20% (height/padding/logo/nav scale)
Remains sticky
Transition must be smooth and seamless (no visual jump)
Navigation behavior
Desktop: Home, Services, Experience, Contact + primary CTA
Medium widths: reduce nav density and spacing to prevent overlap
Mobile: compact bar with brand + menu trigger
5. Information Architecture
5.1 Home (/)
Full viewport hero (edge-to-edge)
Split section: text/value proposition + accent image
Full-bleed image section with overlay text
Service preview section linking into service pages
Experience teaser linking to /experience
Contact conversion block (book/phone/email)
5.2 Services Hub (/services)
Full-bleed hero intro
Service index (one item per service with concise summary)
“How to choose” 3-step orientation block
Final consultation CTA
5.3 Service Detail (/services/[slug])
Service-specific hero
“What it is / who it is for” section
Results/process section
FAQ mini-section (2-4 key items)
Related services links
Final conversion CTA
5.4 Experience (/experience)
Hero + brand narrative
Studio philosophy and care standard
Guest journey timeline
Final CTA
5.5 Contact model
Primary contact conversion on Home
Repeated contact access via footer on all pages
No separate /contact route in v1 (can be added in a follow-up iteration if requested)
6. Responsive Design Requirements
6.1 Breakpoint expectations
Mobile: 320-767 px
Tablet: 768-1023 px
Desktop: 1024+ px
6.2 Mobile requirements
No horizontal overflow
Hero remains full-width with safe text zone
Header transitions correctly between transparent and solid states
Navigation uses compact mobile pattern (non-overlapping)
Accent images are chosen and cropped to remain visually complete in narrow viewports
6.3 Desktop/tablet requirements
Desktop nav must never overlap or wrap into unreadable collisions
Full-bleed sections maintain continuity without faux card framing
Section rhythm matches luxury editorial spacing (generous but controlled)
7. Data and Authority Boundaries
Pricing/package signals continue to come from Medusa via existing frontend Medusa adapter
Service copy, descriptions, highlights, and FAQs continue to come from Sanity fallback/content model
Frontend does not compute commerce logic; renders only returned content/signals
No direct Stripe/Shippo usage in frontend
8. Error Handling and Fallback Behavior
If content fields are missing, fallback content must preserve layout integrity
If Medusa package signal is unavailable, UI displays non-breaking fallback messaging
Header behavior degrades gracefully if JS fails (remains usable/static)
Images must retain acceptable layout via object-fit and focal positioning
9. Testing and Acceptance Criteria
9.1 Functional acceptance
All v1 pages exist and are linked from site navigation or section CTAs
Sticky shrinking header behavior works on Home, Services, Service Detail, Experience
Transparent-over-hero to solid transition is visible and smooth
One page exists for each service slug in content source
9.2 Responsive acceptance
Mobile (320/375/430 widths): no overlap in header or section text
Tablet (768/820/1024 widths): section transitions remain visually coherent
Desktop (1280/1440 widths): full visual hierarchy matches approved direction
9.3 Visual acceptance
No rounded corners on major hero/full-bleed storytelling surfaces
No bordered/outlined card look for primary narrative sections
Full-bleed sections touch viewport edges as specified
Visual language reflects black/gold luxury palette and reference-inspired rhythm
10. Delivery Notes
Implementation should be done by patching existing page structure and styles, not architectural redesign. Existing route framework and content sourcing should be reused and tightened to this spec.