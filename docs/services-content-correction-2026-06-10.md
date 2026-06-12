# Services Content Correction — 2026-06-10

## Why
Live Sanity production carried 15 service docs, ~half not actually offered (Event Makeup, Facial Waxing, Lash Extensions, Lash Lift & Tint, Permanent Makeup, HydraFacial, Hormone Therapy, generic Facials) while core offerings (PRF, BioRePeel, Glo2Facial, Face Reality, EZ Gel) were missing. Source of truth: `House of Rose/03-Services/00-MASTER-treatment-menu-pricing.md` + Notion Services DB.

## Code changes (commit + deploy required)
- `packages/studio/schemas/service.ts` — added `price` (string, "From $X") + `duration` fields
- `packages/web/src/lib/queries.ts` — `SERVICE_BY_SLUG_QUERY` now selects `price`, `duration`
- `packages/web/src/pages/services/[slug].astro` — renders price · duration under H1; adds schema.org `offers.priceSpecification.minPrice` when price parses numeric

## Content changes (already live in Sanity production, project 4e7axyi7)
- **Deleted (8):** event-makeup, facial-waxing, lash-extensions, lash-lift-tint, permanent-makeup, hydrafacial, hormone-therapy, facials (Brandy is a room renter — out of production)
- **Updated (7):** microchanneling → ProCell Microchanneling ($399) · chemical-peels → BioRePeel, slug `biorepeel` ($295) · dermaplaning ($135) · injectables → Botox & Neurotoxins (consult-only pricing) · iv-hydration-therapy → IV Hydration Lounge ($129) · glp-1-weight-management ($349/mo) · permanent-jewelry ($45)
- **Created (8):** prf-microneedling ($650) · glo2facial ($199) · face-reality-acne-program ($139) · lightstim-led-therapy ($65) · dermal-fillers ($700) · prf-injections ($599) · ez-gel-bio-filler ($699) · prf-hair-restoration ($799)
- Collections: Skin Renewal (Amber, 7) · Injectables & Aesthetics (Diana, 5) · Wellness & Restoration (Diana, 2) · Beauty & Enhancements (Brooke, 1)
- Pricing posture: rack "From $X"; no per-unit toxin pricing online (per Membership Pricing Plan)
- PRF scope split enforced: topical PRF (esthetician) vs PRF injections/EZ Gel (RN)

## Follow-ups
1. `git add -A && git commit` the three code files, push → Netlify deploys frontend
2. Trigger a Netlify rebuild of the web package — site is static; new content won't show until rebuild
3. Run `npx sanity@latest schema deploy` from `packages/studio` to re-sync the Content Lake schema with Studio source (MCP deployed a matching copy as interim)
4. New service docs need images in Studio (8 created without)
5. Old slug `chemical-peels` now 404s (renamed to `biorepeel`) — add a redirect in netlify.toml if it had traffic

## Addendum (same day)
- Fixed duplicate booking CTA on service detail pages: merged "CTA Section" + "Contact CTA" in `[slug].astro` into a single `#book` section (service-specific headline, kicker, phone/booking buttons, address).

## Logo refresh (2026-06-10)
New HR monogram logo set deployed from vault `House of Rose/HOUSE OF ROSE LOGO/`:
- New asset package: `public/logos/hr-monogram-2026/` — gold/white/black monogram (512px webp+png), wordmark-1200.png, favicons (16/32/48/192 + .ico), apple-touch-icon (charcoal bg), og.png (1200×630, monogram on charcoal), source SVG
- `Header.astro` → gold monogram webp; sized h-14/md:h-16 (square mark vs old wide logo's h-20/md:h-32)
- `BaseLayout.astro` → new favicons, apple-touch-icon, og:image/twitter:image
- `blog/[slug].astro` → publisher JSON-LD logo
- Old packages (`HofR-1024`, `HofR-512`, `*-logo-package`) left in place; safe to delete after the new set is verified live

## Prompt-vault pass continuation (2026-06-10)
- `index.astro` — four homepage pillar descriptions corrected to actual services (removed RF microneedling + hydrodermabrasion/facials; added EZ Gel, PRF hair restoration, Face Reality, Glo2Facial, GLP-1, permanent jewelry)
- `blog/index.astro` + `services/index.astro` — meta descriptions no longer advertise hormone therapy
- `memberships.astro` — REBUILT to the lane-tiered architecture (Amber's decision 6/10): The Lily Membership (inclusion model, Idea D: Essentials $149 / Signature $299 ⭐ / Regenerative $499, with "valued at" lines), The Iris Membership (banked: $99/$199/$299, injectables-scoped), Hydrangea Wellness Add-On ($89 rider / $109 standalone), House Collective copy, snowbird pause + roll-forward policies. Typed interfaces (MembershipTier, MembershipLane), no `any`.
- NOTE: web build cannot run in this sandbox (platform-specific rollup binary); page verified structurally + frontmatter typechecked. Run `npm run build` locally before deploy.
- Added PRF Body Treatments service (slug `prf-body-treatments`, From $525/zone, Skin Renewal) — body work was only a buried mention; now a dedicated page, cross-linked with PRF Microneedling. Homepage pillar 1 copy mentions face & body / scars & stretch marks.
- Header scroll fix: `.stuck` class was toggled by Header.astro's scroll handler but had NO css — header stayed transparent on scroll and the monogram floated/clipped over content. Added `#header.stuck` styles to `global.css` (solid charcoal @ 92% + blur + gold hairline border, monogram shrinks to 40px). Combined with the earlier h-14/md:h-16 logo sizing in Header.astro.

## IA v1 — Services/Treatments split + Concern pages (2026-06-10, per brainstorm)
Spec: vault `03-Services/services-ia-v1.md`. Service = the question a client googles (hub/education); Treatment = priced bookable protocol under ONE canonical hub; Concern = cross-cut router page. Existing slugs unchanged (zero redirects); hubs are new pages above them.

**Schema** (`service.ts` + new `concern.ts`, registered in index.ts, deployed to Content Lake): service.kind (hub/treatment/standalone), service.parentService (ref), service.concerns (refs).

**Content (live):** 6 hubs — PRF (5 treatments incl. renamed "PRF Skin Texture & Tightening"), Microchanneling & Microneedling (comparison content, 1 child), BioRePeel (3 new advanced protocols: Advanced Acne Scarring MN-combo $395 PROPOSED, Gold Spot Treatment $345 PROPOSED, Body $375/zone PROPOSED), Face Reality (3 new: Clarity Bootcamp $899, Acne Peel $139, Back Treatment $159 PROPOSED), Injectables & Bio-Fillers, Wellness. 4 standalone (Dermaplaning, Glo2, LightStim, Permanent Jewelry). 6 concerns published; coverage: acne-scarring 9, fine-lines 6, sun-damage 3, stretch-marks 2, dark-circles 1, hair-thinning 1. Zero orphan treatments (verified by GROQ).

**Frontend:** queries.ts (kind/parentService/treatments on Service, Concern type + queries, top-level list excludes treatments) · [slug].astro (breadcrumb to parent hub, "Choose your protocol" grid on hubs, BreadcrumbList JSON-LD includes hub level) · NEW pages/concerns/[slug].astro.

⚠️ New prices marked PROPOSED above were set by Claude from protocol positioning — Amber to confirm. Run `npm run build` locally + `npx sanity schema deploy` from packages/studio before deploy. New hub/treatment docs need images.
- Gold spot treatment repriced + reframed per Amber: "BioRePeel Duo — Gold Spot Upgrade", From $395 (was $345). Rationale: two advanced formula bottles opened per client (blue full-face + gold targeted) — must always price above the base blue face peel ($295). Process step 2 now "Full blue BioRePeel across the face" (no longer optional).
- Advanced Acne Scarring protocol repriced $395 → $450 per Amber, validated by market check (FL microneedling $200–$700, peels $150–$800, combination sessions $600–$1,500 at MD practices; buying the pieces separately locally ≈ $625). BioRePeel ladder now: blue $295 → Duo gold-spot $395 → Body $375/zone → Advanced MN-combo $450.
- Glo2Facial repriced $199 → $225 rack ($179 founding) per Amber, after market review: national $200–$300, SSLC Cape Coral $159 member/$199 non-member, no Punta Gorda competitor. $199 had matched SSLC's walk-in rate exactly; $225 restores premium spacing in the menu ladder.
- PRF Body repriced AREA-BASED per Amber (was $525/zone — under-priced vs face despite higher labor/consumables): small $650 / medium $850 / large $1,050, mirroring the face ladder; series of 3 at $1,750/$2,250/$2,695. New FAQ explains cost parity honestly.
- Compliance language sweep: all "RN-administered/RN-run" marketing copy → "administered by our registered nurse under physician medical direction" (Injectables hub, Botox, PRF injections, IV Lounge, Wellness hub + metas). Rationale: highlighting the RN without the physician layer can imply independent practice; new phrasing is stronger AND safer. Confirm exact wording with healthcare counsel.
- REVISED same day per Amber: ALL provider-credential language removed from public marketing copy entirely (Sanity: Injectables hub, Botox, PRF injections, dermal fillers, EZ Gel, IV Lounge, Wellness hub + metas/process steps; web: homepage pillar 2, memberships Iris intro). Credentials live in consult/intake only. Program descriptors ("medically supervised") retained.
- Prompt-vault pass: skin-analysis page audited against the AI Scanner prompt (already compliant — professional tool framing, photo-privacy FAQ). Added "From Analysis to Plan" section bridging analysis results to the six /concerns/* router pages.

## Shop launch (2026-06-10, prompt-vault #7 + #8)
- Schema: product gains `brand` (procell/glymed/skin-script/face-reality/house-of-rose) + `size`; deployed to Content Lake (NOTE: full-schema redeploy via MCP is blocked by pre-existing duplicate-"media" validation errors in legacy types — field creation works regardless; resolve when running `npx sanity schema deploy` locally).
- Content: 28 products published from OFFICIAL price lists — ProCell aftercare ×6 (SRPs from ROI doc: MD Step 1 $150 / Step 2 $160 / Trial Set $310; PRO $65/$80/$75), GlyMed+ ×11 (May 2026 retail list), Skin Script ×11 (2026 SRP list). Face Reality = program-only note (provider policy), no listings.
- Frontend: NEW `pages/shop.astro` — brand-grouped grid with curation intros, Face Reality program note, "How to Order" (in studio / reserve & pick up / we'll ship) + call-to-order CTA + bundle/member preferred-pricing line. `ALL_PRODUCTS_QUERY` + Product interface extended (brand/size/category/inStock/description). Homepage `SHOP_URL` now `/shop`.
- Follow-ups: product images in Studio (28 created without); consider Shop in header nav; per-product purchaseUrl when online checkout (Square/GlossGenius) is chosen.
