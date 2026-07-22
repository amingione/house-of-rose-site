# House of Rose — Website Copy Decks

Client-facing copy drafts for the site-elevation pass Amber requested (2026-07-20), built from the
competitive review. **Markdown-first by design:** review and edit here, then these seed Sanity drafts
and wire into the Astro routes. Nothing is live until Amber approves and it's wired in.

Every fact is verified against local source-of-truth docs per **CLAUDE.md Rule #0**, and every page
follows `docs/SEO-AEO-PLAYBOOK.md` (answer-first, entity-clear, locally grounded) and
`docs/staff/COMPLIANCE-COPY-RULES.md`.

## What's here

| File | Track | Provider | Page types produced |
|---|---|---|---|
| `homepage-regenerative-repositioning.md` | Reposition the front page around the regenerative *method* | — | homepage singleton |
| `trust-and-proof-assets.md` | Credentials, safety, candidacy, before/after framework | All | team/experience + `/results/` + reusable blocks |
| `treatment-prf-under-eye.md` | PRF under-eye rejuvenation | Diana, RN | service hub + cost + comparison |
| `treatment-microneedling-mature-skin.md` | Microneedling for mature/aging skin | Amber | service hub + cost + comparison |
| `treatment-natural-looking-injectables.md` | Natural-looking Botox & filler | Diana, RN | service hub + cost + comparison |
| `treatment-face-reality-acne.md` | Face Reality acne program | Amber | service hub + cost + comparison |

## What was deliberately excluded (per Amber's "exclude entirely" call)

The competitive review leaned on ideas that violate binding rules or clinical holds. None were built,
and none were echoed in softened form:

- **Memberships / "Snowbird" plans** — House of Rose offers no memberships. No member/loyalty/tier framing anywhere.
- **"Signature / Regenerative Eye Renewal / Collagen Renewal Plan" names** — naming law is plain, technical, searchable only.
- **PRF hair restoration** — removed from the menu; not bookable (`_gaps.md` §5). No page, no mention.
- **EZ-Gel price** — Sanity's $699 is unanchored/pending Diana; no price stated.
- **GlowTox / Micro-Tox** — clinical hold; kept out of all injectable/facial copy.
- **Discount/"deal" framing** — off-brand; pricing is always "investment / from / starting at."

## Pricing source-of-truth (what each page publishes)

| Service | Published price | Source |
|---|---|---|
| PRF Under-Eye | **$550 / series of 3 $1,485** (raised from $495 per market) | `FINAL-PRICING.md` — FL PRF band $350–$1,000; flagship was underpriced |
| Microneedling (corrective, face) | from $295 | `advanced-facials-master-menu.md` |
| ProCell microchanneling | from $299 (Pro) / $349 (MD) · series of 4 $1,099 | `ALL-SERVICES-PRICING.MD` (live, anchor-corrected 2026-07-17) |
| Topical PRF boost | +$175 face | `advanced-facials-master-menu.md` |
| Botox / Daxxify | $14/unit | `neurotoxins.md` §8 + `ALL-SERVICES-PRICING.MD` |
| Filler | Ultra XC/RHA 1 from $650; RHA 2 $700; RHA 3 $800; Voluma $850 | `dermal-fillers.md` §8 (⚠ Sanity "$700" is drift) |
| Acne Bootcamp | $899 program | `ALL-SERVICES-PRICING.MD` |
| Acne Peel / Back Treatment | from $139 / from $159 | Market-validated (single acne treatments run $85–$195) — see `FINAL-PRICING.md` |

## CTA variation

Every callout across all decks uses a **different** CTA — no repeated "Book Now." Each deck's
"Review & build notes" lists its CTAs; the full set (34, all unique) was swept for duplicates. Rule of
thumb kept while writing: injectables/PRF = call-or-text (consultation-first, no online booking);
esthetics = book-or-call; trust/homepage get their own bank ("See your skin first," "Meet the team," etc.).

## Compliance guardrails baked into every page

- Lead descriptor "advanced aesthetics & wellness studio"; "med spa" only in meta/SEO (allow, don't lead).
- No "cures/treats/heals + condition," no "reverse aging/anti-aging/permanent/guaranteed."
- Provider authority + real candidacy + individual-outcomes language present wherever a treatment is sold.
- Topical PRF (Amber) vs injectable PRF (Diana, RN) never blurred.
- Before/after only with written consent (`caseStudy.consentGiven == true`).

## Open items for Amber (confirm before publishing)

1. **Provider credential wording** — Amber's exact license/title; whether to name the medical director; Brandy's public name + whether her lane is launched; Aundrea's Lashes/Ear-Piercing (`_gaps.md` §5).
2. **ProCell series/price** — resolved to the live menu: Pro $299 / MD $349, **Series of 4 $1,099** (ProCell protocol, not the house 3/6 wrapper). The older master menu's $250/$325 and 3/6 framing are stale. Confirm Sanity `microchanneling` + `*-series-of-4` packages carry $299/$349/$1,099 on wire-in.
3. **Acne consult fee** — no documented paid-consult fee (only a $50 late/no-show policy fee); confirm intent.
4. **Final pricing is set** — see `FINAL-PRICING.md` for every number, the market rationale, and the exact GlossGenius + Sanity updates required (the one real change is PRF: raise to $550/$1,485; all else confirmed at current values). Acne Peel $139 is now market-validated (single acne treatments run $85–$195), so the earlier "Sanity-only" flag is resolved.

## Wire-in sequence (after Amber approves the copy)

1. Fix the flagged Sanity price/brand drift first (so pages read from correct data).
2. Seed `service` / `costGuide` / `comparison` drafts in Sanity (Studio → Pages), pasting the approved copy.
3. Confirm/extend routes (`/services/[slug]`, `/cost/[slug]`, `/compare/[slug]`) — most templates already exist.
4. Emit JSON-LD via `src/lib/structuredData.ts` (never hand-rolled). Add internal links both directions (playbook §5); no orphans.
5. Run `npm run ve:check` and the per-page publish checklist (playbook §6) before publishing.
