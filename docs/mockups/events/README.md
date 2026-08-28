# Events — Page Tree Plan &amp; Mockups

Status: **Draft for Amber's review.** Nothing here is built into the Astro site or Sanity yet — these are
static HTML mockups (`index.html`, `bridal.html`, `birthday.html`, `collaborate.html`) that reference real
site assets in `assets/` (the actual `hr-logo-gold.webp`, `actual-welcome-1400.webp`, `actual-reception-1400.webp`).
Open any file in a browser; they link to each other.

**Revision note (v2):** the first pass was built from the Creative System's prose palette description
(Bone/Walnut/Limestone as a *light* theme) and invented header/footer/hero markup — it didn't resemble the
live site at all. Rebuilt against the actual implemented design system: `packages/web/src/styles/global.css`,
`packages/web/tailwind.config.ts`, and the real `Header.astro` / `Footer.astro` / `Hero.astro` / `ServiceCard.astro`
components. The real site is a **dark canvas** throughout (`bone`/`charcoal` tokens are near-black, `ivory`
is the light text color — the palette was flipped dark-over-light at some point and the Creative System doc's
prose never caught up), fixed/blurred header, bottom-anchored full-bleed hero with a walnut scrim, olive-fill
primary buttons (`btn-gold` is misleadingly named — it's olive `#5F624D`), and gold (`#E2D3B2`) as the text/
kicker accent, not a fill color. These mockups now match that system directly rather than re-deriving it from
the written brand guide.

## Why this page tree

`Events` is new — it doesn't exist anywhere in the site, Sanity schemas, or `docs/`. It's the natural home
for Aundrea Pedigo's **non-medical** makeup artistry, which today surfaces on her provider bio
(`/about/providers/aundrea/`) and in the internal GlossGenius pricing sheet. Framing it
as "Events" — Bridal / Birthday / Collaborate — turns a provider footnote into its own acquisition channel,
without touching the medical-aesthetics nav, voice, or claim rules that govern the rest of the site.

## Proposed site tree

```
/events/                → hub — introduces the non-medical line, links to Aundrea's bio + all 3 subpages
/events/bridal/         → Bridal Events
/events/birthday/       → Birthday Events
/events/collaborate/    → Collaborate With Us (B2B: planners, photographers, venues, boutiques)
```

**Nav placement:** add `Events` as a top-level primary-nav item (mocked active in the header) and to the
footer's `Explore` column, plus a link out from `/about/providers/aundrea/`. Kept off the homepage hero —
the homepage leads with "Medical Aesthetics Practice" per the Creative System, and Events is deliberately a
separate, clearly-labeled non-medical line, not a hero CTA competing with it.

**If/when this is approved for implementation**, the mockup does not authorize a new schema or route.
First map each approved page to one of the seven canonical types in `docs/SEO-AEO-PLAYBOOK.md` and
`docs/CONTENT-MODEL-MAP.md`, then use that type's documented route, structured-data, sitemap, and
internal-linking contract. A genuinely new type requires owner approval and updates to both binding
documents before implementation.

## What's grounded in real sources vs. proposed

**Grounded (cited):**
- Aundrea's role, bio, and "non-medical services" framing — `/about/providers/aundrea/` (live site) and
  `provider` schema.
- Bridal Makeup: 2 hr, **$175** — `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD` (single,
  unconflicted figure).
- Event Makeup: 1 hr 30 min, **$85** with a **$40 deposit** — owner-confirmed 2026-08-25.
- Everyday Makeup: 1 hr, **$35** with a **$30 deposit** — same source.
- Palette and typography — the implemented site tokens and components plus Creative System Book 4's
  visual standards. The mockup's voice and CTA language are unapproved; current user direction and the
  binding voice-reset rules govern any future build.

**Flagged — do not publish as-is:**
1. 🟡 **On-location vs. in-suite-only is undocumented.** Bridal and Birthday mockups default to in-suite;
   flagged inline so this isn't silently decided by omission.
2. 🟡 **Trial runs, lead time, and group minimums are undocumented.** Marked `Draft` in the Bridal FAQ
   rather than invented.
3. 🟠 **Collaborate With Us is entirely new territory** — no referral, commission, or preferred-vendor
   program exists today. The page proposes three collaboration shapes (bookings, styled shoots, and
   referral relationships) as a framework for Amber to approve, cut, or price — not as
   an existing offer.

## Birthday Events — merchandising pattern (v3)

`birthday.html` was restructured around a product/package-catalog pattern referencing
[Little Princess Spa's birthday-parties category page](https://www.littleprincessspa.com/fortmyers/product-category/birthday-parties/)
and a dark package-tier card pattern (checklist features, one highlighted tier, price-forward cards). Two
things were deliberately **not** carried over from the reference:

1. **Visual style.** Little Princess Spa's pink/glitter/Canva aesthetic is directly on the Creative System's
   visual blacklist (Book 4 §15 — glitter, pink/champagne gradients, "random Canva templates"). Rebuilt the
   same package-card + add-on-grid *structure* inside House of Rose's real dark/olive/gold system instead —
   closer, structurally, to the dark SEO-package-card pattern than to the pink reference.
2. **Content.** Little Princess Spa sells children's party entertainment: character appearances, slime/patch
   crafts, candy buffets, cake, balloon walls, photo booths. House of Rose has none of that — Aundrea's real
   catalog is three line items (Everyday Makeup, Event Makeup, and Bridal Makeup). Inventing a kids'-party
   catalog to match the reference's density would violate Rule #0. Instead, the birthday page uses the two
   relevant services as two packages (**Just the Glam** / **Birthday Celebration**, featured) plus a thin,
   honest add-ons grid (extra guest makeup and an upgrade to Event Makeup) — same merchandising energy,
   real inventory only.

CTAs read "Request this package" / "Add to request," not "Add to cart" — GlossGenius currently shows
**Booking option: No** for the reviewed Aundrea line items, and the real Stripe/Shippo checkout is unrelated to
services. Cart-style language would claim a checkout capability that doesn't exist yet.

## Suggested next step

Review the four mockups, resolve the remaining flags above, then map each approved idea to an existing
canonical page type before implementation. If no current type fits, obtain owner approval and update the
binding page-type and content-model documents before creating a schema or route.
