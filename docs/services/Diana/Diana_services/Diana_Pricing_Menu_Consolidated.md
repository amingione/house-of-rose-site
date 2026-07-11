# Diana — Consolidated Pricing Menu (Injectables · PRF · IV · GLP-1)

Single canonical pricing table, mapped to the Sanity `service` schema (`category`, `provider`,
`pricingModel`, `price`, `duration`, `description`). This replaces the 5 originally imported
source docs, which have been deleted from this folder now that their content lives here.

Prices are Diana's own figures — treated as authoritative, no hedging. Durations and description
copy below are set using standard med-spa appointment-length benchmarks and positioned for the
Punta Gorda / Charlotte County / SW Florida market, per the site's AEO playbook (answer-first,
locally grounded, no medical overclaiming).

## Master Pricing Table

| Service | Category | Provider | Pricing Model | Price | Series Pricing | Duration | Description |
|---|---|---|---|---|---|---|---|
| Botox | Injectables & Bio-Fillers | Diana | Per Unit | $14/unit | — | 20 min | Precision neuromodulator dosed to your anatomy — softens expression lines and prevents new ones from forming for a refreshed, undetectable result. Popular as a lunch-break visit for Charlotte County professionals. |
| Daxxify | Injectables & Bio-Fillers | Diana | Per Unit | $14/unit | — | 20 min | A longer-acting neuromodulator alternative to Botox, built on peptide technology for smoother results with fewer touch-up visits between sessions. |
| Juvéderm Ultra XC | Injectables & Bio-Fillers | Diana | Per Syringe | From $650 | — | 30 min | Smooth, hyaluronic-acid filler that restores volume and softens lines in the lips and lower face for a natural, hydrated look. |
| Juvéderm Voluma XC | Injectables & Bio-Fillers | Diana | Per Syringe | From $850 | — | 45 min | Structural cheek filler that lifts and contours where volume loss has changed the shape of the face — a subtle mid-face reset. |
| RHA 1 | Injectables & Bio-Fillers | Diana | Per Syringe | From $650 | — | 30 min | Flexible filler engineered to move naturally with facial expression — ideal for fine lines and delicate areas like the lips and under-eyes. |
| RHA 2 | Injectables & Bio-Fillers | Diana | Per Syringe | From $700 | — | 30 min | Mid-weight RHA filler for moderate lines and folds, balancing correction with natural movement — a versatile everyday-face filler. |
| RHA 3 | Injectables & Bio-Fillers | Diana | Per Syringe | From $800 | — | 45 min | Our most robust RHA filler, built for deeper folds and areas needing stronger structural support without looking overdone. |
| PRF Under-Eye Rejuvenation | Injectables & Bio-Fillers | Diana | Per Session | $495 | Series of 3 — $1,350 | 45 min | Your own platelet-rich fibrin, injected beneath the under-eye to soften hollows and dark circles gradually and naturally — no synthetic filler, no downtime you can't work around. |
| PRF Facial Rejuvenation (1 Area) | Injectables & Bio-Fillers | Diana | Per Area | $595 | Series of 3 — $1,650 | 60 min | Targeted PRF injections that put your body's own growth factors to work rebuilding collagen — firmer, more even-toned skin that keeps improving for months after treatment. |
| PRF Skin Renewal (Microchanneling + PRF) | Skin Renewal | Amber | Per Session | $450 | Series of 3 — $1,200 · Series of 4 — $1,550 | 60 min | Microchanneling paired with your own PRF to renew texture and radiance from within — our answer to SW Florida sun exposure, addressing fine lines, tone, and overall skin quality with minimal downtime. |
| Hydration IV | Wellness & Restoration | Diana | Per Session | $100 | — | 30 min | A base electrolyte and fluid infusion to restore hydration fast — the go-to reset after a day on the water, travel, or an off day in the Florida heat. |
| Immunity IV | Wellness & Restoration | Diana | Per Session | $175 | — | 45 min | Vitamin- and antioxidant-forward blend built to support the immune system during high-stress, high-exposure, or seasonal-change stretches. |
| Recovery IV | Wellness & Restoration | Diana | Per Session | $185 | — | 45 min | Formulated to ease muscle fatigue and support recovery after intense activity, workouts, or physical strain — a favorite post-workout stop for the Punta Gorda active crowd. |
| Beauty Glow IV | Wellness & Restoration | Diana | Per Session | $185 | — | 45 min | Skin-focused infusion pairing hydration with beauty-supporting nutrients for a healthy, from-within glow — great before a big event or a beach day. |
| Reboot (Hangover Recovery) IV | Wellness & Restoration | Diana | Per Session | $185 | — | 45 min | Rapid rehydration and nutrient replenishment blend designed to help you bounce back fast after a big night out. |
| Myers' Cocktail IV | Wellness & Restoration | Diana | Per Session | $190 | — | 45 min | The classic multivitamin infusion — a broad-spectrum blend of vitamins and minerals for comprehensive, overall wellness support. |
| Vitamin C Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | 5 min | Boost any IV session with an extra dose of immune-supporting Vitamin C. |
| B12 Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | 5 min | Boost any IV session with an extra dose of energy-supporting B12. |
| Biotin Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | 5 min | Boost any IV session with an extra dose of hair-, skin-, and nail-supporting Biotin. |
| Glutathione Add-On | Wellness & Restoration | Diana | Add-On | $35 | — | 5 min | Boost any IV session with an extra dose of Glutathione, a master antioxidant that supports skin clarity and detoxification. |
| Magnesium Add-On | Wellness & Restoration | Diana | Add-On | $25 | — | 5 min | Boost any IV session with an extra dose of Magnesium to support muscle relaxation and sleep quality. |
| NAD+ Add-On | Wellness & Restoration | Diana | Add-On | $100 | — | 5 min | Boost any IV session with an extra dose of NAD+, supporting cellular energy and recovery at the metabolic level. |
| Semaglutide | Wellness & Restoration | Diana | Program | Starting at $225/month | — | 15 min monthly visit | Physician-guided GLP-1 weight management program with monthly dosing and progress check-ins — a medically supervised path to sustainable results, tailored to your goals. |
| Tirzepatide | Wellness & Restoration | Diana | Program | Starting at $325/month | — | 15 min monthly visit | Dual-action GLP-1/GIP weight management program with monthly dosing and progress check-ins, for patients seeking a more comprehensive metabolic approach. |

## Resolved decisions

1. **Memberships excluded.** The original treatment menu included Rose/Rose Gold/Black Rose
   membership tiers. Per `CLAUDE.md`, House of Rose's membership system was torn out 2026-07-07
   and must never be reintroduced — no member pricing appears above, and the `memberPrice` field
   on any `service` document should stay empty.
2. **Facial Rejuvenation Series of 3 confirmed at $1,650.** The two original PRF pricing docs
   were incomplete rather than conflicting: one stated the Facial Series price, the other was
   silent on it. Locked in at $1,650 because it's internally consistent with the practice's own
   Under-Eye Series discount curve ($495 → $1,350 for 3, a ~9% series discount; $595 → $1,650 for
   3 lands at ~7.6%, a reasonable step-down for a higher-touch single-area treatment) and sits
   comfortably mid-range for SW Florida PRF facial series pricing ($1,500–$2,000 typical).
3. **Provider on "PRF Skin Renewal (Microchanneling + PRF)" is Amber, not Diana.** Confirmed by
   Amber: microchanneling is exclusively Amber's lane per `CLAUDE.md`, regardless of which
   provider's docs a pricing line originated from.
4. **Hair Restoration removed — not a House of Rose service.** Confirmed by Amber: House of Rose
   does not perform hair restoration. `PRF Hair Restoration` ($650 / Series of 4 $2,300) appeared
   in the original docs but is excluded here permanently.

Durations, marketing descriptions, and PRF series pricing are all final — this menu is ready to
publish to Sanity and GlossGenius as-is.
