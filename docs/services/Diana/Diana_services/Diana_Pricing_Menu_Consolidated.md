# Diana — Consolidated Pricing Menu (Injectables · PRF · IV · GLP-1)

Single canonical pricing table, mapped to the Sanity `service` schema (`category`, `provider`,
`pricingModel`, `price`, `duration`, `description`). This replaces the 5 originally imported
source docs, which have been deleted from this folder now that their content lives here.

## Master Pricing Table

| Service | Category | Provider | Pricing Model | Price | Series Pricing | Duration | Description |
|---|---|---|---|---|---|---|---|
| Botox | Injectables & Bio-Fillers | Diana | Per Unit | $14/unit | — | Est. 15–30 min — confirm | Precision neuromodulator treatment that softens expression lines and prevents new ones from forming, dosed to your anatomy for a refreshed, natural result. |
| Daxxify | Injectables & Bio-Fillers | Diana | Per Unit | $14/unit | — | Est. 15–30 min — confirm | A longer-acting neuromodulator alternative to Botox, formulated for smoother lines with fewer touch-up visits between sessions. |
| Juvéderm Ultra XC | Injectables & Bio-Fillers | Diana | Per Syringe | From $650 | — | Est. 30–45 min — confirm | Smooth, hyaluronic-acid filler that restores volume and softens lines in the lips and lower face for a natural, hydrated look. |
| Juvéderm Voluma XC | Injectables & Bio-Fillers | Diana | Per Syringe | From $850 | — | Est. 30–45 min — confirm | Structural filler built for the cheeks, designed to lift and contour where volume loss has changed the shape of the face. |
| RHA 1 | Injectables & Bio-Fillers | Diana | Per Syringe | From $650 | — | Est. 30–45 min — confirm | Flexible filler engineered to move naturally with facial expression — ideal for fine lines and delicate areas. |
| RHA 2 | Injectables & Bio-Fillers | Diana | Per Syringe | From $700 | — | Est. 30–45 min — confirm | Mid-weight RHA filler for moderate lines and folds, balancing correction with natural movement. |
| RHA 3 | Injectables & Bio-Fillers | Diana | Per Syringe | From $800 | — | Est. 30–45 min — confirm | Our most robust RHA filler, for deeper folds and areas needing stronger structural support. |
| PRF Under-Eye Rejuvenation | Injectables & Bio-Fillers | Diana | Per Session | $495 | Series of 3 — $1,350 | 45–60 min | Your own platelet-rich fibrin, injected beneath the under-eye to soften hollows and dark circles gradually and naturally — no synthetic filler. |
| PRF Facial Rejuvenation (1 Area) | Injectables & Bio-Fillers | Diana | Per Area | $595 | Series of 3 — $1,650 | 45–60 min | Targeted PRF injections that stimulate your body's own collagen production for firmer, more even-toned skin in the treatment area. |
| PRF Skin Renewal (Microchanneling + PRF) | Skin Renewal | Amber | Per Session | $450 | Series of 3 — $1,200 · Series of 4 — $1,550 | 45–60 min | Microchanneling paired with your own PRF to renew skin texture and radiance from within, addressing fine lines, tone, and overall skin quality with minimal downtime. |
| Hydration IV | Wellness & Restoration | Diana | Per Session | $100 | — | Est. 30–45 min — confirm | A base electrolyte and fluid infusion to restore hydration fast — a simple reset after travel, illness, or an off day. |
| Immunity IV | Wellness & Restoration | Diana | Per Session | $175 | — | Est. 30–45 min — confirm | Vitamin- and antioxidant-forward blend built to support the immune system during high-stress or high-exposure stretches. |
| Recovery IV | Wellness & Restoration | Diana | Per Session | $185 | — | Est. 30–45 min — confirm | Formulated to ease muscle fatigue and support recovery after intense activity or physical strain. |
| Beauty Glow IV | Wellness & Restoration | Diana | Per Session | $185 | — | Est. 30–45 min — confirm | Skin-focused infusion combining hydration with beauty-supporting nutrients for a healthy, from-within glow. |
| Reboot (Hangover Recovery) IV | Wellness & Restoration | Diana | Per Session | $185 | — | Est. 30–45 min — confirm | Rehydration and nutrient replenishment blend designed to help you bounce back fast. |
| Myers' Cocktail IV | Wellness & Restoration | Diana | Per Session | $190 | — | Est. 30–45 min — confirm | The classic multivitamin infusion — a broad-spectrum blend of vitamins and minerals for overall wellness support. |
| Vitamin C Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | ~5 min | Boost any IV session with an extra dose of Vitamin C. |
| B12 Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | ~5 min | Boost any IV session with an extra dose of B12. |
| Biotin Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | ~5 min | Boost any IV session with an extra dose of Biotin. |
| Glutathione Add-On | Wellness & Restoration | Diana | Add-On | $35 | — | ~5 min | Boost any IV session with an extra dose of Glutathione. |
| Magnesium Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | ~5 min | Boost any IV session with an extra dose of Magnesium. |
| NAD+ Add-On | Wellness & Restoration | Diana | Add-On | $100 | — | ~5 min | Boost any IV session with an extra dose of NAD+. |
| Semaglutide | Wellness & Restoration | Diana | Program | Starting at $225/month | — | Est. 15–20 min monthly visit — confirm | Physician-guided GLP-1 weight management program with monthly dosing and progress check-ins, tailored to your goals. |
| Tirzepatide | Wellness & Restoration | Diana | Program | Starting at $325/month | — | Est. 15–20 min monthly visit — confirm | Dual-action GLP-1/GIP weight management program with monthly dosing and progress check-ins, tailored to your goals. |

## Open flags before publishing to Sanity or GlossGenius

1. **Memberships excluded.** The original treatment menu included Rose/Rose Gold/Black Rose
   membership tiers. Per `CLAUDE.md`, House of Rose's membership system was torn out 2026-07-07
   and must never be reintroduced — no member pricing appears above, and the `memberPrice` field
   on any `service` document should stay empty.
2. **PRF series pricing partially unconfirmed.** The two original PRF pricing docs disagreed:
   one had no Skin Renewal line but included a Facial Series (3) at $1,650; the other had the
   Skin Renewal line ($450 / $1,200 / $1,550) but no Facial Series. Both are merged into the
   table above — confirm with Diana that the Facial Series ($1,650) and Skin Renewal series
   pricing are both still current.
3. **Provider on "PRF Skin Renewal (Microchanneling + PRF)" is Amber, not Diana.** Confirmed by
   Amber: microchanneling is exclusively Amber's lane per `CLAUDE.md`, regardless of which
   provider's docs a pricing line originated from.
4. **Durations are mostly estimates.** Only PRF durations (45–60 min) are sourced directly from
   the original PRF Brochure. Everything marked "Est. — confirm" is an industry-standard guess,
   not extracted fact — get Diana's sign-off before setting GlossGenius booking slot lengths.
5. **Hair Restoration removed — not a House of Rose service.** Confirmed by Amber: House of Rose
   does not perform hair restoration. `PRF Hair Restoration` ($650 / Series of 4 $2,300) appeared
   in the original docs but is excluded here permanently.
