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
for Aundrea Pedigo's **non-medical** line (makeup artistry + permanent jewelry), which today only surfaces
on her provider bio (`/about/providers/aundrea/`) and in the internal GlossGenius pricing sheet. Framing it
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

**If/when this gets built for real**, recommended implementation:
- One new Sanity document type, `eventPage` (slug-based, not four singletons) with `kind: hub | bridal |
  birthday | collaborate` — reuses one schema instead of four near-duplicates, consistent with
  `content-modeling-best-practices`.
- Routes: `packages/web/src/pages/events/index.astro` + `packages/web/src/pages/events/[slug].astro`,
  mirroring the `experience.astro` / `skin-analysis.astro` Sanity-singleton-with-fallback pattern already
  in use.
- JSON-LD: `Service`/`Offer` on Bridal + Birthday (referencing Aundrea as a `Person`/provider), plain
  `WebPage` or `ContactPage` on Collaborate.
- Trailing-slash convention (`/events/bridal/`, not `/events/bridal`) per the site's URL rule.

## What's grounded in real sources vs. proposed

**Grounded (cited):**
- Aundrea's role, bio, and "non-medical services" framing — `/about/providers/aundrea/` (live site) and
  `provider` schema.
- Bridal Makeup: 2 hr, **$175** — `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD` (single,
  unconflicted figure).
- Everyday Makeup: 25 min, **$85** — same source.
- Permanent Jewelry: **$65** flat line in GlossGenius — same source, but flagged (see below).
- Voice, palette, typography, CTA language — Creative System Books 2–4.

**Flagged — do not publish as-is:**
1. 🟡 **"Event Makeup" has two conflicting GlossGenius prices ($150 vs. $85 under different group names)**
   — the pricing doc calls this an uncleaned GlossGenius duplicate. The Birthday Events mockup shows
   "Price on request" instead of guessing. Needs Amber's resolution before either page ships.
2. 🟡 **Permanent Jewelry may have per-material/length tiers** (gold-filled / sterling / solid gold) per an
   older price-list PDF referenced in the same doc, but GlossGenius currently shows one flat $65 line. Both
   mockups show "Starting at $65" with a confirmation flag rather than asserting tiers that may not be live.
3. 🟡 **On-location vs. in-suite-only is undocumented.** Bridal and Birthday mockups default to in-suite;
   flagged inline so this isn't silently decided by omission.
4. 🟡 **Trial runs, lead time, and group minimums are undocumented.** Marked `Draft` in the Bridal FAQ and
   Birthday jewelry-bar section rather than invented.
5. 🟠 **Collaborate With Us is entirely new territory** — no referral, commission, or preferred-vendor
   program exists today. The page proposes four collaboration shapes (bookings, styled shoots, on-site
   jewelry activations, referral relationships) as a framework for Amber to approve, cut, or price — not as
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
   catalog is three line items (Everyday Makeup, Event Makeup, Permanent Jewelry). Inventing a kids'-party
   catalog to match the reference's density would violate Rule #0. Instead, the three real services were
   restructured into three packages (**Just the Glam** / **Birthday Celebration**, featured / **Jewelry Bar
   Only**) plus a thin, honest add-ons grid (extra guest makeup, upgrade to Event Makeup, extra jewelry
   piece) — same merchandising energy, real inventory only.

CTAs read "Request this package" / "Add to request," not "Add to cart" — GlossGenius currently shows
**Booking option: No** for all four Aundrea line items, and the real Stripe/Shippo checkout is unrelated to
services. Cart-style language would claim a checkout capability that doesn't exist yet.

## Suggested next step

Review the four mockups, resolve the flags above (especially the Event Makeup price conflict — that's a
GlossGenius data-hygiene issue independent of this project), then say the word and this gets built as real
Astro routes + a Sanity `eventPage` schema, wired into nav, sitemap, and JSON-LD like every other page type
on the site.
