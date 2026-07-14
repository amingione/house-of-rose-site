# House of Rose — Authoritative Service-Price Catalog

**Date:** 2026-07-13
**Purpose:** The single authoritative price input for (a) membership-tier pricing derivation and (b) Phase-4 Sanity price reconciliation.
**Truth rule (corrected by owner 2026-07-13):** **GlossGenius is the true system of record** for services + pricing — that's where House of Rose services are actually sold and paid for. The local docs (`docs/services/**`, incl. the `*_GlossGenius_Import.csv`) are the **staging/import source** for GlossGenius, and **Sanity is a display/content middle-man** that feeds service collections + briefs to the marketing website — Sanity is **not** the commerce truth. So the figures below (local docs, with the Sanity snapshot as a proxy) are working truth for derivation, but **every price must ultimately be confirmed against the live GlossGenius menu.** Never the web, never invented. Where local and Sanity disagree, local (the GlossGenius import) wins and the drift is flagged; Sanity-only figures are unsourced until confirmed in GlossGenius.

**Sources used**
- `docs/services/Diana/Diana_services/Diana_Pricing_Menu_Consolidated.md` (+ its `Diana_Pricing_GlossGenius_Import.csv`, identical figures) — injectables, PRF injections, IV menu + add-ons, GLP-1.
- `docs/services/pricing/advanced-facials-master-menu.md` (dated 2026-07-10) — Amber's advanced facials, series framework, add-ons. `advanced-facials-pricing.md` is **DEPRECATED** (do not use).
- `docs/services/waxing/face.md` · `docs/services/waxing/body.md` — per-zone wax + combos.
- `docs/services/pricing/PROFESSIONAL-MAKEUP-PRICING-COMP.md` — makeup rate card.
- `docs/services/facials/faceRealityAcneProgram.md` + master-menu acne rows — Face Reality program, acne peel, back treatment.
- `docs/research/permanent-jewelry.md` — permanent jewelry ("From $45"; metal tiers pending).
- Sanity published snapshot: `scratchpad/phase2/sanity-published-snapshot.json`.
- `docs/GOOGLE-BUSINESS-PROFILE.md` — treated as a **stale/aspirational draft only** (uses removed membership language, Osmosis/Sculptra/BHRT, GLP-1 $499); referenced **only** for the noted dermaplaning $95 conflict.

**Drift legend:** ✅ = local matches Sanity · ⚠️ = mismatch (local wins; note explains) · 🟥 = Sanity-only, **no local source** · — = not in Sanity.

---

## 0. GlossGenius LIVE CATALOG — SOURCE OF TRUTH (added 2026-07-13)

`docs/glossgenius_catalog.csv` (owner-provided). **This supersedes the local-doc / Sanity tables in
§1–§11 wherever they differ** — and they differ a lot. GlossGenius is where services are actually sold.

### 0.1 Full live GG price list

| GG Category | Service | Duration | GG price |
|---|---|---|---|
| **Facials** (Brandy) | Signature Rose Facial | 30m | $80 |
| Facials | Lunch Time Glow | 30m | $100 |
| Facials | Luxe Rose Facial | 1h | $120 |
| Facials | Signature Facial | 45m | $120 |
| Facials | Skin Reset Facial | 50m | $140 |
| Facials | Mommy & Me Facial | 1h | $150 |
| Facials | Royal Rose Facial | 1h30 | $170 |
| Facials | Sculpt & Lift Facial | 1h | $180 |
| Facials | Luxury Facial | 1h15 | $200 |
| **Advanced Facials** (Amber) | Glo2Facial | 1h | **$195** |
| Advanced Facials | Glo2Facial + ProCell MD | 1h30 | $475 |
| Advanced Facials | Glo2Facial + ProCell Pro | 1h30 | $525 |
| Advanced Facials | Glo2Facial + PRF | 1h30 | $595 |
| Advanced Facials | GlowTox Facial | 1h | $475 |
| **Microchanneling & Microneedling** | ProCell MD Microchanneling | 45m | $349 |
| **Skin Renewal** | PRF Skin Renewal | 1h | $450 (3 options) |
| **Injectables & Bio-Fillers** | Daxxify · Botox | 20m | $14/unit |
| Injectables | Juvéderm Ultra XC | 30m | $650 |
| Injectables | Juvéderm Voluma XC | 45m | $850 |
| Injectables | RHA 1 / RHA 2 / RHA 3 | 30–45m | $650 / $700 / $800 |
| Injectables | PRF Under-Eye Rejuvenation | 45m | $495 (2 options) |
| Injectables | PRF Facial Rejuvenation (1 Area) | 1h | $595 (2 options) |
| **Wellness & Restoration** | Hydration IV | 30m | $100 |
| Wellness | Immunity IV | 45m | $175 |
| Wellness | Recovery / Beauty Glow / Reboot IV | 45m | $185 each |
| Wellness | Myers' Cocktail IV | 45m | $190 |
| Wellness | Add-ons: Vit C / B12 / Biotin / Magnesium | 10m | $25 each |
| Wellness | Add-ons: Glutathione / NAD+ | 10m | $35 / $100 |
| Wellness | Semaglutide / Tirzepatide | 15m | $225 / $325 per month |
| **Waxing** (Aundrea) | Chin / Lip | 10m | $10 each |
| Waxing | Eyebrow Wax Only | 10m | $15 |
| Waxing | Underarm / Eyebrow Shape,Trim&Wax | 15m | $20 each |
| Waxing | Bikini Line | 20m | $30 |
| Waxing | Full Arm | 30m | $35 |
| Waxing | Chest | 20m | $40 |
| Waxing | Back | 30m | $50 |
| Waxing | Full Leg | 45m | $65 |
| **Makeup** (Aundrea) | Everyday Makeup | 25m | $30 |
| Makeup | Soft Glam / Event Makeup | 45m | $80 |
| Makeup | Full Glam / Bridal Makeup | 2h | $175 |
| **Lash Services** (Aundrea) | Lash Tint / Lash Lift / Lift & Tint Combo | 20–60m | $25 / $65 / $85 |
| **Permanent Jewelry** | Permanent Jewelry | 20m | $65 |
| **Enhancements & Add-ons** | Lip / Chin | 10m | $7 each |

**Empty in GG:** Acne Bootcamp (0 services), Injections (0), Hormone Therapy (0). **Memberships: none created. Packages: none created.** Resource: "Injection Room."

### 0.2 Major GG-vs-CMS divergences (Amber must resolve — affects the whole catalog, not just memberships)

- **On the website/Sanity but NOT bookable in GlossGenius:** BioRePeel (×4 Sanity services), corrective
  microneedling, microneedling/PRF **body** treatments, the ProCell **Pro-vs-MD standalone tiers** ($250/$349),
  **carboxy** facial, **dermaplaning** (add-on only per Amber, not a GG service), and the **Face Reality Acne
  Bootcamp / acne-peel / back-treatment** ($899/$139/$159 — the GG "Acne Bootcamp" category has 0 services).
- **In GlossGenius but thin/absent on the site:** the 9-service **basic-facial ladder** ($80–$200), **Lash
  services** (tint/lift/combo — a whole lane the site doesn't cover), and the **combo advanced facials**
  (Glo2 + ProCell MD/Pro/PRF).
- **Price corrections (GG wins over BOTH local docs and Sanity):** Glo2Facial **$195** (local said $185);
  waxing is cheaper across the board (Underarm **$20** vs local $28; no **Brazilian** at all); makeup far cheaper
  (Everyday **$30** vs local $85; Event **$80** vs local $150); permanent jewelry **$65** flat (not "From $45");
  ProCell microchanneling is a single **$349** line — now RESOLVED as the **MD** tier; **Pro $250** must be added to GG as the entry tier (see §10a).
- **Confirmed drifts where GG validates the LOCAL docs and proves SANITY wrong:** IV $100 (Sanity $129),
  fillers from $650 (Sanity $700), PRF injections $495/$595 (Sanity $599), GLP-1 $225/$325 (Sanity $349),
  ProCell body/microchanneling $349. → Sanity service prices should be corrected to GG in Phase 4.

> **Bottom line:** treat §0 as truth. The §1–§11 tables below are the *local-docs/Sanity view* and are retained
> only to show what each system currently holds and where it drifts from GlossGenius.

---

## 1. Amber — Advanced Facials  _(local-docs view — see §0 for GG truth)_

| Service | Authoritative price (local) | Unit | Duration | Sanity value | Drift? | Source doc |
|---|---|---|---|---|---|---|
| Glo2Facial (gateway) | $185 | per session | 60 min | From $185 | ✅ | master-menu §1 |
| Glo2Facial — Series of 3 | $499 | series (3) | — | — (not priced) | — series absent in Sanity | master-menu §1 |
| Glo2Facial — Series of 6 | $885 | series (6) | — | — | — | master-menu §1 |
| ProCell Microchanneling — Pro (face) | $250 | per session | 60–75 min | From $250 | ✅ | master-menu §2 |
| ProCell Microchanneling — MD (face) | **$349** | per session | 60–75 min | (single `microchanneling` line = From $250) | ⚠️ Sanity lists only one "From $250" line; **MD tier ($349) must be published separately** | GlossGenius (live) — see §10a |
| Microneedling — Corrective (face) | $295 | per session | 60–75 min | From $295 | ✅ | master-menu §3 |
| GlowTox Facial | $475 in GlossGenius; $425 in legacy menu | per session | 60 min | — (not in Sanity) | **Clinical and price reconciliation required.** Do not describe it as topical Daxxify, a microchanneling treatment, or a needling add-on. | GlossGenius catalog + legacy master menu §4 |
| ProCell Microchanneling — Body | $349 | per zone | 60–75 min | From $349 per zone | ✅ | master-menu §6 |
| Microneedling — Body | $325 | per zone | 60–90 min | From $325 per zone | ✅ | master-menu §6 |
| Microneedling + BioRePeel — Body | $325 | per zone | 45 min | `biorepeel-body` From $325 per zone | ✅ | master-menu §6 |
| **Microneedling + BioRePeel (face) — standalone** | **no standalone single-session price in local docs** (master menu prices it only as a **+$65 add-on**) | — | 45 min | `biorepeel` **From $295** | 🟥 Sanity face price $295 has **no local source** — master menu only defines BioRePeel face as a +$65 upgrade | master-menu §5 |
| (THIS IS AN ADD ON ONLY - BRANDY CAN OFFER THIS AS A FACIAL BUT AMBER ONLY OFFERS AS A TREATMENT PREP ADD ON STEP) Dermaplaning — standalone | **no canonical local price** | per session | 50 min | From $135 | 🟥/⚠️ Sanity $135; GBP draft says $95 — **unresolved conflict, no master-menu source**. Amber must set. | Sanity + GBP §4B |
| PRF Skin Renewal (MicroNEEDLING + Topical PRF) | $450 | per session | 60 min | — (see packages) | — Amber's lane; topical PRF | Diana consolidated (provider = Amber) |

**Add-ons / upgrades (add to any needling treatment)** — master-menu §5:

| Upgrade | Price | Unit | Sanity | Drift? |
|---|---|---|---|---|
| Topical PRF (face) | +$175 | add-on | — | — |
| Topical PRF (body) | +$200 | add-on | — | — |
| Glo2Facial Finish | +$95 | add-on | `neck-decollete-extension` is separate; finish not a Sanity doc | — |
| LightStim LED Therapy | +$35 (add-on) | add-on | `lightstim-led-therapy` **From $65** (standalone) | ⚠️ $35 = add-on price; NOT OFFERED AS A STANDALONE TREATMENT ADD ON ONLY |
| Dermaplane Prep | +$45 | add-on | — | — |
| BioRePeel Blue (face) | +$85 | add-on | (see BioRePeel face row above) | — |
| BioRePeel Gold (face spot treat) | +$45 | add-on | (see BioRePeel face row above) | — |
| BioRePeel GOLD (BODY) | +$95 | add-on | (see BioRePeel face row above) | — |
| Neck & Décolleté Extension | +$95 | add-on | `neck-decollete-extension` +$95 | ✅ |

---

## 2. Brandy — Basic Facials  ⚠️ ENTIRE LANE UNPRICED

| Service | Authoritative price | Unit | Duration | Sanity | Drift? | Source |
|---|---|---|---|---|---|---|
| Enzyme exfoliation / basic facial | **NONE** | — | ~30–60 min (pending) | — none | 🟥 no local price, no Sanity service | `docs/research/hydrodermabrasion.md` §pending |
| Hydrodermabrasion | **NONE** | — | ~30–60 min (pending) | — none | 🟥 explicitly "no HoR price source exists"; do not borrow Glo2Facial/dermaplaning | `docs/research/hydrodermabrasion.md` |
| Light peels (maintenance) | **NONE** | — | — | — none | 🟥 unbuilt lane | — |
| Facial waxing (Brandy also offers) | see §3 (Aundrea's rate card) | per zone | — | see §3 | — | waxing/face.md |

> **BLOCKER:** Brandy's basic-facial lane is entirely unpriced and unbuilt in Sanity. **No basic-facials membership tier can be built** until Brandy/Amber set enzyme, hydrodermabrasion, and light-peel prices and they are entered in Sanity.

---

## 3. Aundrea — Waxing (per zone)

**Face** — `docs/services/waxing/face.md` · **Body** — `docs/services/waxing/body.md`. Sanity carries only two rolled-up hub prices: `facial-waxing` "From $15" and `body-waxing` "From $28".

| Zone | Authoritative price (local) | Unit | Sanity | Drift? | Source |
|---|---|---|---|---|---|
| **Face** | | | `facial-waxing` From $15 | ✅ (from-price = lip/chin $15) | face.md |
| Brows (mapped & shaped) | $25 | per zone | — | — | face.md |
| Upper Lip | $15 | per zone | — | — | face.md |
| Chin | $15 | per zone | — | — | face.md |
| Cheeks · Sideburns · Neck | $18 | per zone | — | — | face.md |
| Nose | $18 | per zone | — | — | face.md |
| Ears | $18 | per zone | — | — | face.md |
| Brow + Lip Combo | $35 | combo | — | — | face.md |
| Full Face — 9 zones | $70 | combo | — | — | face.md |
| **Body** | | | `body-waxing` From $28 | ✅ (from-price = underarms $28) | body.md |
| Underarms | $28 | per zone | — | — | body.md |
| Half Arms | $42 | per zone | — | — | body.md |
| Full Arms | $50 | per zone | — | — | body.md |
| Lower Legs | $48 | per zone | — | — | body.md |
| Full Legs | $85 | per zone | — | — | body.md |
| Stomach | $35 | per zone | — | — | body.md |
| Back | $70 | per zone | — | — | body.md |
| Chest | $60 | per zone | — | — | body.md |
| Feet & Toes | $30 | per zone | — | — | body.md |
| Bikini Line | $45 | per zone | — | — | body.md |
| Bikini Full | $55 | per zone | — | — | body.md |
| **Brazilian** | **$65** | per zone | — | — | body.md |
| Bikini Full + Underarms (combo) | $85 | combo | pkg `bikini-underarms-combo` (unpriced) | ⚠️ Sanity package empty | body.md |
| Full Legs + Brazilian + Underarms (combo) | $160 | combo | pkg `full-body-smooth-combo` (unpriced) | ⚠️ Sanity package empty | body.md |

---

## 4. Aundrea — Permanent Jewelry & Makeup

**Permanent Jewelry** — `docs/research/permanent-jewelry.md`:

| Service | Authoritative price | Unit | Duration | Sanity | Drift? | Source |
|---|---|---|---|---|---|---|
| Permanent Jewelry (base) | From $45 | per piece | 15–30 min | `permanent-jewelry` From $45 | ✅ | permanent-jewelry.md §8 |
| Metal tiers (sterling / 14k gold-filled / solid gold) | **PENDING AUNDREA** — no confirmed tier table | per piece | — | — | 🟥 competitor proposal ($75/$95/$285–795) is a retired-name draft that contradicts "From $45"; do NOT use | permanent-jewelry.md §8 |
| Charms / connectors / re-weld | PENDING AUNDREA | add-on | — | — | 🟥 confirmed-at-booking | permanent-jewelry.md §8 |

**Professional Makeup (Jane Iredale, no airbrush upcharge)** — `PROFESSIONAL-MAKEUP-PRICING-COMP.md`. Not published as Sanity `service` docs (makeup lives in singleton hub pages):

| Service | Authoritative price | Unit | Sanity | Drift? | Source |
|---|---|---|---|---|---|
| Event Makeup (per face) | From $150 | per face | — (singleton page, no `service`) | — | makeup comp §rate card |
| Trial Run | $150 (same as event) | per session | — | — | makeup comp §rate card |
| Everyday / General Application | From $85 | per face | — | — | makeup comp §rate card |
| Event — In-House Individual Block Time | From $150 | per person | — | — | makeup comp §rate card |
| Event — Spa Rental (Pre-Party Package) | From $175 / person · 4-guest min | per person | — | — | makeup comp §rate card |
| Event — Travel | From $150 / person + travel fee · 4-guest min | per person | — | — | makeup comp §rate card |

---

## 5. Diana — Injectables

`Diana_Pricing_Menu_Consolidated.md`. Sanity publishes rolled-up hub prices only (`injectables` no price; `dermal-fillers` From $700; `prf-injections` From $599).

| Service | Authoritative price (local) | Unit | Duration | Sanity value | Drift? | Source |
|---|---|---|---|---|---|---|
| Botox | $14/unit | per unit | 20 min | `injectables` price null | ⚠️ Sanity hub carries no unit price (consult-only stance); local = $14/unit | Diana consolidated |
| Daxxify | $14/unit | per unit | 20 min | — | — | Diana consolidated |
| Juvéderm Ultra XC | From $650 | per syringe | 30 min | `dermal-fillers` From $700 | ⚠️ Sanity from-price $700; local lowest filler = $650 (Ultra XC / RHA 1) | Diana consolidated |
| Juvéderm Voluma XC | From $850 | per syringe | 45 min | (rolled into dermal-fillers) | ⚠️ | Diana consolidated |
| RHA 1 | From $650 | per syringe | 30 min | (rolled) | ⚠️ | Diana consolidated |
| RHA 2 | From $700 | per syringe | 30 min | (rolled) | ✅ ($700 matches Sanity from-price) | Diana consolidated |
| RHA 3 | From $800 | per syringe | 45 min | (rolled) | ⚠️ | Diana consolidated |
| PRF Under-Eye Rejuvenation | $495 | per session | 45 min | `prf-injections` From $599 | ⚠️ Sanity from-price $599; local under-eye single = $495 | Diana consolidated |
| PRF Facial Rejuvenation (1 area) | $595 | per area | 60 min | (rolled into prf-injections) | ⚠️ local $595 vs Sanity $599 | Diana consolidated |
| **EZ-Gel Bio-Filler** | **NONE** | per session | 75 min | `ez-gel-bio-filler` **From $699** | 🟥 Sanity-only $699 — **no local source anywhere**; Diana must confirm | Sanity snapshot |
| PRF Body Treatments | (see Amber §1 topical / Diana lane) | per zone | 90 min | `prf-body-treatments` From $475 per zone | 🟥 Sanity $475 per zone has no matching local injectable-PRF body figure | Sanity snapshot |

> Note: Sanity also has `prf-microneedling` "From $425" (hub) and `microchanneling` "From $250" (hub) — Amber's lane; see §1. The published `prf-injections` "From $599" from-price does not match any single local PRF figure ($495 or $595), so **local wins and $599 is drift**.

---

## 6. Diana — IV & Wellness

`Diana_Pricing_Menu_Consolidated.md`. Sanity publishes one rolled-up hub: `iv-hydration-therapy` "From $129".

| Service | Authoritative price (local) | Unit | Duration | Sanity | Drift? | Source |
|---|---|---|---|---|---|---|
| Hydration IV | $100 | per session | 30 min | `iv-hydration-therapy` From $129 | ⚠️ Sanity from-price $129; local base IV = $100 | Diana consolidated |
| Immunity IV | $175 | per session | 45 min | (rolled) | ⚠️ | Diana consolidated |
| Recovery IV | $185 | per session | 45 min | (rolled) | ⚠️ | Diana consolidated |
| Beauty Glow IV | $185 | per session | 45 min | (rolled) | ⚠️ | Diana consolidated |
| Reboot (Hangover) IV | $185 | per session | 45 min | (rolled) | ⚠️ | Diana consolidated |
| Myers' Cocktail IV | $190 | per session | 45 min | (rolled) | ⚠️ | Diana consolidated |
| Vitamin C Add-On | $25 | add-on | 5 min | — | — | Diana consolidated |
| B12 Add-On | $25 | add-on | 5 min | — | — | Diana consolidated |
| Biotin Add-On | $25 | add-on | 5 min | — | — | Diana consolidated |
| Glutathione Add-On | $35 | add-on | 5 min | — | — | Diana consolidated |
| Magnesium Add-On | $25 | add-on | 5 min | — | — | Diana consolidated |
| NAD+ Add-On | $100 | add-on | 5 min | — | — | Diana consolidated |

> Sanity IV from-price $129 has **no matching local figure** (local base = $100). Local wins; $129 is drift.

---

## 7. Diana — GLP-1

`Diana_Pricing_Menu_Consolidated.md`. Sanity: `glp-1-weight-management` "From $349/month".

| Service | Authoritative price (local) | Unit | Duration | Sanity | Drift? | Source |
|---|---|---|---|---|---|---|
| Semaglutide | Starting at $225/month | per month | 15-min monthly visit | From $349/month | ⚠️ Sanity from-price $349; local start = $225 | Diana consolidated |
| Tirzepatide | Starting at $325/month | per month | 15-min monthly visit | (rolled into GLP-1 hub) | ⚠️ local $325 vs Sanity from-price $349 | Diana consolidated |

> Sanity $349/month matches **neither** local program ($225 semaglutide / $325 tirzepatide). Local wins; $349 is drift. GBP draft's "$499/month" is dead/stale — ignore.

---

## 8. Face Reality Acne (Amber)

`faceRealityAcneProgram.md` + master-menu §7. Amber is the certified Face Reality specialist.

| Service | Authoritative price (local) | Unit | Duration | Sanity | Drift? | Source |
|---|---|---|---|---|---|---|
| Acne Bootcamp — 12-Week Program | $899 | program (sold as program only) | 12 wks · biweekly | `acne-bootcamp` "$899 program" | ✅ | faceRealityAcneProgram.md + master-menu §7 |
| Acne Peel (single session) | From $139 | per session | 60 min | `acne-peel` "From $139" | ✅ | Sanity + master-menu framing |
| Back Treatment — Acne & Texture | from $159 | per session | 60 min | `back-treatment` "From $159" | ✅ | master-menu §6 + Sanity |
| Back/Chest Acne Add-On (to Bootcamp) | +$95 | add-on | — | — | — | master-menu §7 |

> Note: master menu §6 also lists "Back Treatment — Acne & Texture" with Series-of-3 $429 / Series-of-6 $765 — see §9.

---

## 9. Series / Package Prices (already defined)

**Amber — advanced facials** (master-menu §1–3, §6):

| Base treatment | Single | Series of 3 ("Renewal", ~10%) | Series of 6 ("Full Correction", ~20%) |
|---|---|---|---|
| Glo2Facial | $185 | $499 | $885 |
| ProCell Microchanneling — Pro | $250 | $675 | $1,200 |
| ProCell Microchanneling — MD | **$349** | **$940** | **$1,675** |
| Microneedling — Corrective | $295 | $795 | $1,415 |
| Micro-Tox / GlowTox | Pending clinical approval and final pricing | — | — |
| ProCell Microchanneling — Body | $349 | $940 | $1,675 |
| Microneedling — Body | $325 | $875 | $1,560 |
| BioRePeel — Body | $325 | $875 | $1,560 |
| Back Treatment — Acne & Texture | from $159 | $429 | $765 |

**Amber — PRF Skin Renewal (Micro + topical PRF)** (Diana consolidated, provider = Amber): $450 single · **Series of 3 $1,200** · Series of 4 $1,550.

**Diana — PRF injections** (Diana consolidated):

| Treatment | Single | Series of 3 |
|---|---|---|
| PRF Under-Eye Rejuvenation | $495 | **$1,350** |
| PRF Facial Rejuvenation (1 area) | $595 | **$1,650** |

**Sanity `package` docs — ALL empty / unpriced** (`price: null`, no included services): `bikini-underarms-combo`, `biorepeel-series-of-4`, `brazilian-wax-pass` (Buy 5 Get 1), `bridal-prep-package`, `dermaplaning-package-of-4`, `face-reality-12-week-program`, `full-body-smooth-combo`, `led-series-of-6`, `prf-microchanneling-journey`, `prf-microneedling-series-of-4`, `prf-under-eye-series-of-3`, `procell-microchanneling-series-of-4`, `the-revival-series`. **All "Series of 4" packages are empty and unpriced** — the local docs define Series-of-3 and Series-of-6, NOT Series-of-4 (except the Amber PRF Skin Renewal Series-of-4 $1,550). These Sanity packages need prices back-filled from §9 in Phase 4.

---

## 10. UNPRICED / GAP LIST (membership blockers)

Every service a membership might bundle that has **no authoritative local price**:

| Gap | Status | Membership impact |
|---|---|---|
| **Brandy's ENTIRE basic-facial lane** — enzyme exfoliation, hydrodermabrasion, light peels | 🟥 No local price, no Sanity service, lane unbuilt. "Do not borrow Glo2Facial/dermaplaning" (research note). | **BLOCKS any Basic-Facials membership tier.** Cannot price a Brandy monthly benefit at all. |
| **Carboxy facial** (Amber's lane, topical) | 🟥 "PENDING AMBER — NO LOCAL SOURCE." Explicitly: do not invent/infer; no Sanity service. | Cannot be bundled or used as an anchor until Amber prices it. |
| **EZ-Gel Bio-Filler** | 🟥 Sanity-only "From $699"; no local source anywhere. | Any tier referencing EZ-Gel rests on an unvalidated number — confirm with Diana first. |
| **Dermaplaning (standalone)** | ⚠️/🟥 Sanity $135 vs GBP draft $95; **no master-menu canonical single-session price** (only +$45 prep add-on). | Common membership add-on — the base price is **unresolved**; pick $135 or $95 before bundling. Amber to reconcile. |
| **BioRePeel face (standalone)** | 🟥 Sanity "From $295" has no local source (master menu = +$65 add-on only). | Confirm the $295 face price before using in a tier. |
| **Skin analysis** | ❓ Not priced in any pricing doc; research repeatedly frames it as part of a consult/Glo2Facial visit ("get a skin analysis"). **Likely complimentary — CONFIRM with Amber.** No Sanity `service`. | If complimentary, safe to include as a member perk at $0; confirm so it isn't mis-costed. |
| **Permanent-jewelry metal tiers** | 🟥 Only "From $45" base is confirmed; sterling/gold-filled/solid-gold tier table is "pending Aundrea" (competitor draft contradicts the base). | A jewelry membership can anchor on "From $45" but cannot itemize metal tiers yet. |
| **LED standalone vs add-on** | ⚠️ $35 (add-on, master menu) vs $65 (Sanity standalone `lightstim-led-therapy`) | Not a true conflict (different units) but pick the right one per bundle context. |

---

## 11. "Typical monthly service" per lane — membership anchors

The most common single service a member would realistically use each month, and its authoritative price — the number each membership tier should be derived from.

| Lane | Typical monthly service | Anchor price (local) | Notes |
|---|---|---|---|
| **Amber — Advanced Facials** | Glo2Facial (the gateway / everyone's monthly glow) | **$185** | Cleanest, most-used entry; series math already exists ($499/3, $885/6). Mid-tier alt anchor: ProCell Pro $250. |
| **Amber — Face Reality Acne** | Acne Peel (single session) | **From $139** | Program is a one-time $899 bootcamp, not monthly; the recurring member visit = the acne peel. |
| **Brandy — Basic Facials** | Hydrodermabrasion / basic maintenance facial | **UN-PRICEABLE** | 🟥 No price exists. Anchor cannot be set — blocks the tier. |
| **Aundrea — Waxing** | Brazilian | **$65** | The classic monthly wax; consistent 4–6 wk rebook cadence stated in body.md. |
| **Aundrea — Permanent Jewelry** | Single welded piece | **From $45** | Base-only; metal tiers pending. Better as a retail/event lane than a monthly membership. |
| **Aundrea — Makeup** | Everyday / General Application | **From $85** | Event makeup ($150) is occasional; the everyday look is the repeatable one (still not a natural "monthly" category). |
| **Diana — Injectables** | Botox | **$14/unit** (typical 20–40 units ≈ $280–560/visit; touch-ups ~quarterly, not monthly) | Injectables recur quarterly, not monthly — a "prepaid units" or per-visit member benefit fits better than a monthly anchor. |
| **Diana — IV & Wellness** | A wellness drip (Beauty Glow / Recovery / Reboot / Immunity band) | **$185** | $185 is the dominant IV price point (4 of 6 drips); base Hydration $100 is the floor. |
| **Diana — GLP-1** | Monthly program (Semaglutide) | **$225/month** (Tirzepatide $325/month) | Already a monthly program — its own subscription; the $225 semaglutide start is the natural anchor. |

**Un-priceable lanes right now:** Brandy — Basic Facials (entire lane, hard blocker). Partially blocked: Permanent-jewelry tiers, carboxy, EZ-Gel, standalone dermaplaning, and BioRePeel face — the lane *anchors* exist for jewelry/dermaplaning but the itemized/standalone numbers need Amber/Aundrea/Diana confirmation before a tier can itemize them.

---

## §10a — ProCell face price: RESOLVED (2026-07-14)

**Decision: MD face = $349. Pro face = $250. $325 is retired from the ProCell face menu.**

The catalog previously carried MD face at both **$349** (live in GlossGenius) and **$325** (local series
table). GlossGenius wins, per the truth rule at the top of this file — and independently, $349 is the
better number:

- **No legacy clients.** House of Rose opened 2026-07-09; there is no one to grandfather and no
  "price increase" to absorb. This is the only free moment to set the number.
- **MD uses the costlier serum than Pro.** The tier gap must reflect input cost or the upsell has no logic.
- **$24 is not a decision variable in this market.** Punta Gorda: median age 66.3, ~53.5% aged 65+,
  median household income $85,779. The barrier to booking microchanneling here is *trust*, not price —
  which is what the free AI Skin Analysis funnel exists to solve. Cutting to $325 would surrender margin
  for zero expected conversion lift.
- **Pro holds at $250** because it is the published from-price anchor (`microchanneling` hub = "From $250")
  across Sanity and the marketing site. Never move a from-price without cause. The resulting **$99 Pro→MD
  gap** is wide enough to make MD read as a real upgrade — and MD is where the margin is.

**Resolved grid**

| Treatment | Single | 3-series (~10%) | 6-series (~20%) |
|---|---|---|---|
| ProCell Microchanneling — Pro (face) | $250 | $675 | $1,200 |
| ProCell Microchanneling — MD (face) | **$349** | **$940** | **$1,675** |
| ProCell Microchanneling — Body (per zone) | $349 | $940 | $1,675 |

MD-face and Body now share the same series math, collapsing the ProCell grid from three price ladders
to two. **$325 remains valid only for Microneedling — Body and BioRePeel — Body** (and, unrelated,
Tirzepatide/month) — removing it from the ProCell face menu eliminates one of the round-number
collisions that generated the drift in the first place.

**Actions**
- [ ] **GlossGenius:** MD $349 is already correct — no change. **Add ProCell Microchanneling — Pro (face) $250.**
- [ ] **Sanity:** keep `microchanneling` hub at "From $250"; publish the **MD $349** tier as its own line.
- [ ] **`docs/services/ALL-SERVICES-PRICING.MD`:** updated 2026-07-14 (MD $349 | $940 | $1,675).
