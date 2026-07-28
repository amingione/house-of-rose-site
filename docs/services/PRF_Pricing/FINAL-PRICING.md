# House of Rose — Final Pricing Decisions

**Decided:** 2026-07-20 · **Authority:** Amber gave final pricing say for this pass.
**Scope:** the services covered by the new copy decks (PRF injectables, microneedling/Procell, neurotoxin + filler, Face Reality acne).

## The pricing philosophy applied here

House of Rose is a premium, private regenerative specialist in an affluent, older SW-Florida
market (Punta Gorda / Charlotte County). Pricing follows three rules:

1. **Price to the real market, not to round numbers** — every figure below is checked against verified
   competitor and regional data (repo comps + live web, July 2026).
2. **Premium, never cheap; specialist, never discount** — sit at or above the market floor for our
   category, never chase the low end, and never use "deal/% off" framing.
3. **Don't move a price without cause** — where a number is already market-correct, it holds. Only
   genuinely mispriced items change. (This is why most of the menu is unchanged and one flagship moved.)

## Decision summary

| Service | **FINAL** | Prior | Market band (July 2026) | Call |
|---|---|---|---|---|
| **PRF Under-Eye Rejuvenation** | **$550** single · **$1,485** series of 3 | $495 / $1,350 | FL $350–$1,000/session; typical $500–$800 (Afrooz FL PRF $800) | **RAISE** |
| **PRF Facial Rejuvenation (1 area)** | **$650** single · **$1,750** series of 3 | $595 / $1,650 | Same PRF band; larger area than under-eye | **RAISE** |
| Neurotoxin — Botox | **$14 / unit** | $14/unit | FL $11–$20/unit; affluent metros higher | HOLD |
| Neurotoxin — Daxxify | **$14 / unit** | $14/unit | $12–$25/unit; premium/longer-lasting | HOLD (see note) |
| Filler — Juvéderm Ultra XC | **from $650** /syringe | $650 | FL $550–$950; RHA $700–$900 | HOLD |
| Filler — Juvéderm Voluma XC | **from $850** /syringe | $850 | Structural/premium tier, in-band | HOLD |
| Filler — RHA 1 / 2 / 3 | **$650 / $700 / $800** /syringe | same | RHA runs high end $700–$900 | HOLD |
| Microneedling — Corrective (face) | **from $295** · series 3 $795 · series 6 $1,415 | $295 | Bare needling $175–$195 local; SkinPen $375 | HOLD |
| Procell Microchanneling — Pro (face) | **from $299** · series of 4 $1,099 | $299 | Verified Procell single $300–$375; 4-pack $1,050–$1,225 | HOLD |
| Procell Microchanneling — MD (face) | **from $349** · series of 4 $1,099 | $349 | Mid-market (≈ ÉLAN $375 / 90-min Procell $350) | HOLD |
| Topical PRF boost | **+$175** face · **+$200** body | same | With-PRF needling tier $350–$500 (our PRF Skin Renewal $450) | HOLD |
| Face Reality — Acne Bootcamp (12 wk) | **$899** program | $899 | Bootcamp ~$865 (Original Glam); +products $150–$300 | HOLD |
| Face Reality — Acne Peel (single) | **from $139** | $139 | Single acne treatments $85–$195 | HOLD (now market-validated) |
| Face Reality — Back Treatment | **from $159** · series 3 $429 · series 6 $765 | $159 | In-band for body acne single | HOLD |
| Face Reality — Back/Chest add-on | **+$95** | +$95 | Reasonable body extension | HOLD |

## The one real change: PRF (the flagship)

House of Rose's entire strategic position is *regenerative specialist* — PRF is the differentiator, not a
side item. Pricing the flagship at $495 put it at the low-mid of the Florida PRF band ($350–$1,000), below
where comparable FL med spas sell it (Afrooz FL charges $800 for PRF; $500–$800 is typical). A specialist
that prices its signature treatment below the generalist competition undercuts the very positioning the
brand is built on.

- **PRF Under-Eye → $550 single / $1,485 series of 3.** Confidently premium, still an easy "yes" for a
  studio building its flagship reputation — well below the $800 top so it doesn't create sticker shock
  before the reviews and before/afters exist. The series carries a genuine ~10% bundled value (framed as
  investment, never discount).
- **PRF Facial (1 area) → $650 single / $1,750 series of 3.** Keeps a clean $100 ladder above under-eye
  (larger area, longer visit).

Everything else already sits correctly in its market and holds. Raising the tox/filler/microneedling lines
without cause would violate the studio's own pricing discipline and isn't supported by the data.

## Note for Diana (Daxxify unit-count, clinical — not a price change)

Botox and Daxxify are both **$14/unit**, and Daxxify's value story is *longevity* (fewer visits/year), not
a lower per-unit rate. One clinical caveat to be aware of when quoting: Daxxify's FDA glabellar dose (~40
units) is higher than Botox's (~20 units), so at an equal per-unit price a Daxxify treatment can total more
per visit. That's a dosing/consult conversation, not a menu change — flagging so quotes are set with eyes
open. If per-visit parity ever becomes a goal, that's Diana's SOP call, not a marketing one.

## What to update where (source-of-truth sync)

**GlossGenius (commerce truth — do first):**
- PRF Under-Eye Rejuvenation: **$495 → $550** (and the series-of-3 option → **$1,485**).
- PRF Facial Rejuvenation (1 area): **$595 → $650** (series-of-3 → **$1,750**).
- Everything else already matches — confirm Procell Pro $299 / MD $349 are live, and add the Acne
  Bootcamp/Peel/Back-Treatment services (the GG "Acne Bootcamp" category currently has 0 services).

**Sanity (display — correct drift on wire-in):**
- `prf-injections`: "From $599" → **From $550**.
- `dermal-fillers`: "From $700" → **From $650**; remove phantom "Restylane" tagline.
- `injectables`: null → **$14/unit**; remove phantom "Dysport" tagline.
- `acne-peel` From $139, `back-treatment` From $159, `acne-bootcamp` $899 — confirm (match).
- Procell `microchanneling` "From $250" → **From $299** (and the empty `*-series-of-4` packages → $1,099).

**Master menu (`advanced-facials-master-menu.md`, 2026-07-10 — stale):**
- Update Procell to $299/$349 + Series of 4 $1,099, and PRF under-eye/facial to the new $550/$650, so the
  older doc stops disagreeing with the live menu.

## Sources (July 2026 market verification)

Internal comps: `docs/research/_pricing-catalog.md`, `docs/staff/pricing/ALL-SERVICES-PRICING.MD`,
`docs/competitor_analysis/Punta-Gordas-regenerative-aesthetics-studio.md`.

Live web (July 2026):
- Botox FL/unit — [Aurelia Med Spa 2026 FL guide](https://aureliamed.com/blog/how-much-does-botox-cost-in-florida/), [Skin Secrets](https://skinsecrets.com/average-cost-of-botox-in-fl/), [Kent V. Hasen MD, Naples](https://www.drhasen.com/blog/how-much-does-botox-cost-in-naples-fl/)
- Daxxify/unit — [Nectar Aesthetics](https://www.nectaraesthetics.com/daxxify/daxxify-vs-botox-cost), [RELUXE Med Spa](https://reluxemedspa.com/cost/daxxify), [Portrait](https://www.portraitcare.com/post/daxxify-cost-per-unit-how-to-save-money-on-premium-injectables)
- Filler/syringe FL — [CostInsightHub 2026 Juvéderm](https://costinsighthub.com/us/health/how-much-does-juvederm-cost), [DermaTouch RN](https://www.dermatouchrn.com/how-much-is-a-syringe-of-juvederm/)
- PRF under-eye — [Afrooz Med Spa (FL) price list](https://www.drpaulafrooz.com/medspa/treatment-price-list/), [Fox Valley Plastic Surgery](https://www.fvpsurgery.com/medi-spa/prf-for-under-eyes/), [Beverly Hills RN](https://beverlyhillsrn.com/prp-under-eye-treatment/), [BHRC 2026 pricing](https://www.bhrcenter.com/med-spa-blog/platelet-rich-plasma-prf-therapy-cost-in-west-hollywood-2026-pricing-guide/)
- Face Reality acne — [Original Glam Bootcamp](https://www.originalglamdenver.com/facereality), [Eric M. Joseph MD](https://www.ericmjoseph.com/face-reality-acne-boot-camp)
