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
