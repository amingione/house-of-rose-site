# GlossGenius catalog and booking handoff — 2026-08-04

Status: internal working document. Do not paste or publish until the verification and clinical-review items below are complete.

Active catalog: `https://houseofrose.glossgenius.com/services`  
Verified booking pattern: `https://houseofrose.glossgenius.com/book?service_token=<token>`  
Retired/invalid host: `houseofrosefl.glossgenius.com`

## Draft

### Sanity-to-GlossGenius booking map

The reconciliation script checked 43 live service and option tokens on 2026-08-04. A verified exact or consultation match receives a preselected booking URL. Anything missing, combined, or ambiguous intentionally resolves to the practice phone instead of a similar appointment.

| Sanity service slug | Current GlossGenius listing | Mode | Verified token | Status or unresolved mismatch |
|---|---|---|---|---|
| `acne-bootcamp` | Acne Bootcamp Consultation | consultation | `1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf` | Verified live 2026-08-04 |
| `biorepeel` | BioRePeel® Cl3 Rejuvenation | direct | `1000f-7694890a-1554-4ddb-8d7e-587064960791` | Verified live 2026-08-04 |
| `biorepeel-advanced-acne-scarring` | — | phone | — | No exact live listing |
| `biorepeel-body` | — | phone | — | No exact live listing |
| `biorepeel-gold-spot-treatment` | — | phone | — | No exact live listing |
| `dermal-fillers` | Dermal Filler \| Consultation | consultation | `1000f-4e97c315-226e-49bd-9e80-790109db8339` | Verified live 2026-08-04 |
| `dermaplaning` | Dermaplaning \| Facial | direct | `1000f-885f1677-f592-448c-a9de-31f9f4576822` | Verified live 2026-08-04 |
| `ez-gel-bio-filler` | PRF Bio-Filler \| Consultation | consultation | `1000f-7844820f-4f7c-4986-b907-6f4600b43e92` | Verified live 2026-08-04 |
| `face-reality-acne-program` | Acne Bootcamp Consultation | consultation | `1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf` | Verified live 2026-08-04 |
| `facial-waxing` | Facial Waxing | direct | `1000f-5e8fc55d-9118-49d2-8d24-2e05df90e851` | Verified live 2026-08-04 |
| `forma-rf-facial` | — | phone | — | Forma RF is absent from the live catalog |
| `glp-1-weight-management` | GLP-1 Consultation | consultation | `1000f-129199ce-d7c0-42f4-827f-7dcbdbd523dc` | Verified live 2026-08-04 |
| `glo2facial` | Glo2Facial \| Oxygen Infusion | direct | `1000f-9649fdf8-0e26-436e-aebf-c19b27addce4` | Verified live 2026-08-04 |
| `glo2facial-prf` | — | phone | — | No exact combination listing |
| `glo2facial-procell-md` | — | phone | — | No exact combination listing |
| `glo2facial-procell-pro` | — | phone | — | No exact combination listing |
| `iv-hydration-therapy` | — | phone | — | Website hub represents several distinct IV listings |
| `injectables-bio-fillers` | — | phone | — | Website hub represents several consultation paths |
| `lumecca-peak-ipl` | Lumecca Peak IPL \| Consultation | consultation | `1000f-de667c29-dbef-47e6-9022-418389aefa71` | Verified live 2026-08-04 |
| `microneedling` | — | phone | — | Hub represents several protocols |
| `morpheus8-body` | Morpheous8 RF Body \| Consultation | consultation | `1000f-bd506885-7ad3-4a15-ab5a-90a8bd082db4` | Verified token; listing spelling needs correction |
| `morpheus8` | Morpheous8 RF \| Consultation | consultation | `1000f-6156b30d-84a3-4d71-8d9d-6ee81fea44de` | Verified token; listing spelling needs correction |
| `neck-decollete-extension` | — | phone | — | No exact live listing |
| `injectables` | Neuromodulator \| Consultation | consultation | `1000f-b6105dd4-6519-4e8a-a986-f6313666f8ee` | Verified live option token 2026-08-04 |
| `prf-body-treatments` | PRF Body Treatments \| Consultation | consultation | `1000f-196da797-f093-4242-a5df-767d198f7a34` | Verified live 2026-08-04 |
| `prf-fibrin-veil` | — | phone | — | No exact live listing |
| `prf-injections` | — | phone | — | Page represents multiple PRF consultation paths |
| `prf` | — | phone | — | Hub represents several PRF services |
| `microneedling-corrective` | — | phone | — | No exact SkinPen listing |
| `microneedling-body` | — | phone | — | No exact SkinPen body listing |
| `prf-microneedling` | PRF Microneedling \| Consultation | consultation | `1000f-ad1f8f2c-7475-4776-b6d9-c8d5e9bff604` | Verified live 2026-08-04 |
| `microchanneling` | Procell Therapies \| Consultation | consultation | `1000f-5b4391bb-3d43-40f3-910d-144cf0e46192` | Verified live option token 2026-08-04 |
| `procell-microchanneling-body` | Procell Therapies \| Consultation | consultation | `1000f-5b4391bb-3d43-40f3-910d-144cf0e46192` | Same consultation is the verified shared entry point |

Skin Analysis & Consultation is also verified independently for `/skin-analysis/` with token `1000f-ad93f96c-64b0-4a51-959b-4301ca28039c`.

### Paste-ready label and description revisions

These revisions remove the retired spa language found in the current catalog and make the first sentence answer what the appointment is. Deposit statements are intentionally bracketed until the amount and application are verified.

#### Neuromodulator | Consultation

Meet with a qualified medical provider to discuss facial movement, expression lines, your goals, and whether neuromodulator treatment may be appropriate. The provider will review options, limitations, potential risks, follow-up, and current pricing before treatment. `[Verify: $50 deposit is applied to the treatment total.]`

Option labels: `Consultation`; `2-Week Check-In`.

#### PRF Under-Eye | Consultation

Meet with a provider to discuss under-eye concerns and whether PRF may be appropriate. The visit includes an assessment, a review of limitations and expected course, and current pricing before treatment. `[Verify: $100 deposit and whether the displayed $495 is a consultation or treatment price.]`

#### Hydration IV

An IV hydration appointment using the practice’s current hydration formulation. A medical provider reviews health history and eligibility before administration and explains the ingredients, risks, and aftercare. `[Verify formulation, provider lane, duration, and $99 price.]`

#### Vitamin & Antioxidant IV

An IV appointment using the practice’s current vitamin and antioxidant formulation. A medical provider reviews health history and eligibility before administration and explains the ingredients, risks, and aftercare. `[Proposed replacement for “Immunity IV”; verify formulation, duration, and $160 price.]`

#### Post-Activity IV Hydration

An IV hydration appointment intended for clients asking about hydration after physical activity. A medical provider reviews health history and eligibility before administration and explains the ingredients, risks, and aftercare. `[Proposed replacement for “Recovery IV”; verify formulation, duration, and $175 price.]`

#### Skin Support IV Hydration

An IV hydration appointment using the practice’s current skin-support formulation. A medical provider reviews health history and eligibility before administration and explains the ingredients, limitations, risks, and aftercare. `[Proposed replacement for “Beauty Glow IV”; verify the name, formulation, duration, and $170 price.]`

#### After-Event IV Hydration

An IV hydration appointment for clients seeking post-event hydration. A medical provider reviews health history and eligibility before administration and explains the ingredients, limitations, risks, and aftercare. `[Proposed replacement for “Reboot (Hangover Recovery) IV”; verify formulation, duration, and $165 price.]`

#### Myers’ Cocktail IV

An IV appointment using the practice’s current Myers’ Cocktail formulation. A medical provider reviews health history and eligibility before administration and explains the ingredients, limitations, risks, and aftercare. `[Verify formulation, duration, and $185 price.]`

#### Morpheus8 RF Body | Consultation

Meet with a provider to discuss body texture or laxity concerns and whether Morpheus8 RF microneedling may be appropriate. The consultation covers candidacy, treatment areas, preparation, recovery, series planning, and current pricing. `[Correct “Morpheous8” to “Morpheus8”; verify $2,500 display price.]`

#### PRF Bio-Filler | Consultation

Meet with a provider to discuss volume-related concerns and whether a PRF-derived gel treatment may be appropriate. The consultation covers how the material is prepared, candidacy, limitations, potential risks, expected course, and current pricing. `[Verify $899 display price and terminology for the prepared material.]`

#### Morpheus8 RF | Consultation

Meet with a provider to discuss texture, scarring, pore appearance, or laxity concerns and whether Morpheus8 RF microneedling may be appropriate. The consultation covers candidacy, treatment depth, preparation, recovery, series planning, and current pricing. `[Correct “Morpheous8” to “Morpheus8”; verify $2,500 display price.]`

#### Lumecca Peak IPL | Consultation

Meet with a provider to discuss visible pigment or vascular concerns and whether Lumecca Peak IPL may be appropriate. The consultation covers candidacy, treatment area, preparation, recovery, limitations, and current pricing. `[Verify $50 deposit or consultation price.]`

#### Dermal Filler | Consultation

Meet with a qualified medical provider to discuss facial volume, proportion, or lip-contour goals and whether hyaluronic acid filler may be appropriate. The provider will review facial anatomy, product options, limitations, potential risks, aftercare, and current pricing before treatment. `[Verify $300 display price.]`

#### Skin Analysis & Consultation

In-studio imaging provides a closer look at visible skin patterns before treatment planning. Your provider reviews the images with you, explains their limits, and discusses possible next steps; the analysis supports the consultation and is not a medical diagnosis. `[Verify device capabilities, $65 price, and image-retention policy.]`

#### PRF Body Treatments | Consultation

Meet with a provider to discuss body texture, scarring, or laxity concerns and whether a PRF-supported treatment plan may be appropriate. The consultation covers the proposed devices and materials, candidacy, treatment areas, preparation, recovery, series planning, and current pricing. `[Verify protocol components, $150 deposit, and $3,500 display price.]`

#### GLP-1 Consultation

A qualified medical provider reviews health history, current medications, previous weight-management efforts, goals, and whether GLP-1 treatment may be appropriate. The visit includes potential benefits and risks, possible side effects, monitoring, testing that may be required, and follow-up expectations. Scheduling does not guarantee that medication will be prescribed. `[Verify provider lane and $25 consultation price.]`

#### Glo2Facial | Oxygen Infusion

Glo2Facial is a multi-step facial designed to cleanse, exfoliate, and hydrate the skin. Your provider selects the appropriate treatment options after reviewing your skin and explains what to expect during and after the appointment. `[Verify device steps, contraindications, duration, and $225 price.]`

#### BioRePeel® Cl3

BioRePeel Cl3 is a professional peel used to address concerns such as uneven tone, texture, congestion, and the appearance of fine lines. Your provider reviews candidacy, preparation, expected peeling or recovery, aftercare, and whether a series is appropriate. `[Proposed shorter label; verify formulation/35% TCA statement, downtime language, $250 single session, $699 series, and $50 deposit.]`

Option labels: `BioRePeel® Cl3 — Single Session`; `BioRePeel® Cl3 — Series of 3`.

#### Microchanneling + Topical Neuromodulator

This appointment combines controlled microchanneling with a provider-selected topical neuromodulator protocol. Candidacy, product use, scope, risks, aftercare, and expected recovery must be reviewed before booking. `[Proposed replacement for “GlowTox Facial”; clinical and compliance approval required before publishing; verify $475 price.]`

#### ProCell Therapies | Consultation

Meet with a provider to discuss texture, scarring, fine-line, or sun-exposure concerns and whether ProCell microchanneling may be appropriate. The consultation covers the serum used, candidacy, preparation, recovery, aftercare, series planning, and current pricing. `[Verify product terminology, $50 deposit, $300 Pro and $400 MD options.]`

Option labels: `Consultation`; `ProCell Pro`; `ProCell MD`.

#### PRF Microneedling | Consultation

Meet with a provider to discuss whether microneedling with topically applied PRF may be appropriate for your concerns. The consultation covers the selected device, how PRF is prepared and used, candidacy, preparation, recovery, aftercare, and current pricing. `[Verify $100 deposit and $595 display price.]`

#### CO2Lift Carboxy Facial

This facial uses the practice’s current CO2Lift carboxy protocol. Your provider reviews your skin, explains how the product is used, and discusses candidacy, limitations, expected recovery, and aftercare. `[Verify product name, indications, combination uses, “no downtime” claim, duration, and $175 price.]`

#### Acne Bootcamp Consultation

Start with an acne consultation led by a Face Reality Certified Acne Expert. The visit reviews visible concerns, relevant history, current products, program expectations, home care, follow-up, and current pricing. `[Verify certification, program scope, and $99 consultation price.]`

#### Dermaplaning Facial

This facial combines dermaplaning with the practice’s current facial protocol to remove surface buildup and fine vellus hair. Your provider reviews candidacy, preparation, aftercare, and whether an add-on or standalone appointment fits your plan. `[Verify duration, $135 facial price, and $45 add-on price.]`

Option labels: `Dermaplaning Facial`; `Dermaplaning Add-On`.

#### Parent & Child Facial

A paired facial appointment for a parent or guardian and child, with each service adjusted to the participant’s age and skin needs. `[Proposed replacement for “Mommy & Me”; verify minimum age, guardian-consent process, products, duration, and $150 price.]`

#### Signature Facial

A 45-minute facial focused on cleansing, hydration, and routine skin maintenance. Your provider reviews your skin and adjusts the service within the approved protocol. `[Verify duration, protocol, and $120 price.]`

#### Skin Reset Facial

A 50-minute facial for clients asking about congestion or acne-prone skin. The appointment includes the practice’s approved cleansing, exfoliation, and calming steps after a provider reviews your skin. `[Verify protocol, candidacy, and $140 price.]`

#### Firming Peptide Facial

A facial using the practice’s approved enzyme and peptide-mask protocol. Your provider reviews your skin, explains the steps, and discusses candidacy, expected recovery, and aftercare. `[Proposed replacement for “Sculpt & Lift”; verify protocol, “zero downtime” claim, duration, $180 price, and $50 deposit.]`

#### Enzyme + Peel Facial

A facial combining cleansing, enzyme exfoliation, and a provider-selected professional peel. Your provider reviews candidacy, preparation, expected peeling or recovery, aftercare, and whether the service fits your current plan. `[Proposed replacement for “Radiance & Renewal”; verify protocol, duration, $200 price, and $50 deposit.]`

#### Facial Waxing

Facial waxing is available for selected areas after a brief skin and product-use check. Choose the exact area when booking, or call if you are unsure which option applies. `[Verify contraindication screening and prices.]`

Option labels: `Chin`; `Upper Lip`; `Eyebrow Wax`; `Eyebrow Shape, Trim & Wax`.

## Facts requiring verification

- Confirm every price, deposit, duration, cancellation rule, and whether a displayed amount is a consultation fee, deposit, starting price, or full treatment price.
- Confirm provider lane and scope for neuromodulators, filler, PRF, IV hydration, GLP-1 care, IPL, RF microneedling, ProCell, peels, and the proposed topical-neuromodulator service.
- Correct `Morpheous8` to the device’s verified spelling, `Morpheus8`, in both live entries.
- Verify that the Skin Analysis device measures each property currently claimed and confirm retention/privacy practices for captured images.
- Verify all IV formulation names and ingredients before approving benefit-oriented labels. The website correctly keeps the IV hub on phone fallback because no single catalog listing represents it.
- Resolve whether PRF Under-Eye, PRF Bio-Filler, PRF Body, PRF Microneedling, and Morpheus8 consultation prices represent deposits or treatment totals.
- Confirm the minimum age, consent process, and product protocol for the Parent & Child Facial.
- Decide whether Forma RF should receive a new exact catalog listing. Until then, the website calls the practice.
- Decide whether the BioRePeel body, acne-scarring, spot, Glo2 + PRF, Glo2 + ProCell, fibrin veil, SkinPen, and neck/décolleté pages should receive exact catalog entries. Until then, each calls the practice.

## Claims requiring clinical approval

- All efficacy, mechanism, collagen, pigmentation, vascular, scar, laxity, pore, hydration, immune, recovery, and tissue-regeneration statements.
- Every preparation, downtime, recovery, aftercare, series, maintenance, side-effect, and candidacy statement.
- Use of `no downtime`, `zero downtime`, `instant`, `accelerates healing`, `prevents new lines`, `below the surface`, `boosts collagen`, `cellular`, or comparable claims in the current catalog. These are omitted from the drafts unless a reviewer specifically approves them for the exact service.
- The clinical accuracy and provider scope of Microchanneling + Topical Neuromodulator before that listing remains public.
- IV naming and any implication that an infusion supports immunity, recovery, skin appearance, hangover recovery, or general wellness.
- GLP-1 eligibility, medication, lab, monitoring, side-effect, and outcome language.

Clinical reviewer: ____________________  
Review date: ____________________  
Protocol/source versions: ____________________

## Assets still needed

No new asset is required to correct the text catalog. If GlossGenius service imagery is added later, use only approved real House of Rose environment, provider, equipment, product, or treatment-detail photography with the required consent. Do not use generated patients, generic spa flowers, gold foil, pink gradients, blue LED rooms, or fabricated before-and-after imagery.

## Fast preflight status

- Medical Aesthetics Practice positioning: pass for the website rebuild; not applicable to every short catalog entry.
- Accurate service, provider, device, price, date, and availability: pending human verification above.
- Clinical claims reviewed: pending.
- Reader is not diagnosed, shamed, or promised a result: pass in the draft copy.
- Controlled and retired language removed: pass in the draft copy; current live GlossGenius copy still fails until manually replaced.
- Call-to-action destinations work: verified for the mapped tokens on 2026-08-04; manual preselection confirmation remains required before release.
- Platform checks: pending manual GlossGenius entry and final review.

Stop rule: do not paste or publish the draft descriptions until all bracketed facts and clinical claims have been reviewed. GlossGenius was not modified automatically.
