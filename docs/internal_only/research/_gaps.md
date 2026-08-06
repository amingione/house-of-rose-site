# House of Rose — Phase 2 Consolidated Gap & Contradiction Log

**Date:** 2026-07-13

**Purpose.** The single reconciliation checklist for Amber, aggregated from the research briefs and every "GAP"/"flag" callout. Each conflict has a recommended source-of-truth. Governing rule from the briefs: **local docs (`docs/internal_only/services/**`, canonical master menus) are pricing truth; Sanity is corrected to match; web research is never a price source.** All URLs use trailing slashes.

> **Memberships: not offered. None exist and none are planned. Do not add membership content, tiers, or "member rate" framing anywhere.**

---

## 1. Pricing drift (local docs vs Sanity vs live)

Source-of-truth default = **local master menu / local pricing docs**; correct Sanity to match. "Pending" = no local source exists yet, so the provider must supply a number before publish.

| Item | Local-doc value | Sanity value | Recommended source of truth / fix |
|---|---|---|---|
| PRF microneedling (topical, Amber) | Corrective + topical PRF (face) = **$470**; PRF upgrade **+$175 face / +$200 body**; `prf-microneedling` service reads **From $425** | Cost guide `prf-microneedling-cost-punta-gorda` = **$599–$850/session** | **Local menu.** The $599–$850 range spans the whole PRF hub up to the injectable `prf-injections` (From $599) and overstates the topical floor. Rewrite the cost guide to the topical band; reconcile the "$425 PRF facial" vs "+$175 upgrade" framing. Remove the stale "Membership" cost-factor line from the cost guide (no memberships). |
| Dermal fillers | Juvéderm Ultra XC **From $650**, Voluma XC $850, RHA 1 $650 / RHA 2 $700 / RHA 3 $800 (per syringe) | `dermal-fillers` = **From $700** + SEO "from $700/syringe"; tagline lists phantom **"Restylane"** | **Local.** Update Sanity entry price to **From $650** (Ultra XC / RHA 1 floor). Remove "Restylane" until Diana confirms she carries it (menu is Juvéderm + RHA only) — see §6. |
| IV hydration | Hydration IV **$100** (30 min); Immunity $175, Recovery/Beauty Glow/Reboot $185, Myers' $190; add-ons $25–$100 | `iv-hydration-therapy` = **From $129** | **Local.** Update Sanity to **From $100**. |
| GLP-1 | **Semaglutide from $225/mo**, **Tirzepatide from $325/mo** | `glp-1-weight-management` = **From $349/month** | **Local.** $349 contradicts both local figures and is stale. Correct to **From $225/month** (semaglutide floor). Sourcing (brand vs compounded) undocumented — pending Diana; do not state brand/compounded. |
| PRF injections (Diana) | PRF Under-Eye **$495** single ($1,350 series of 3); PRF Facial **$595** single ($1,650 series of 3) | `prf-injections` = **From $599** | **Local.** Update Sanity to $495 under-eye / $595 facial. |
| EZ-Gel bio-filler | **No local source** — EZ-Gel absent from the local consolidated menu entirely | `ez-gel-bio-filler` = **From $699** | **Pending Diana.** $699 is unanchored — do not treat as verified; Diana must confirm the investment. |
| Dermaplaning | Standalone **From $135** (master menu / competitor-analysis); Dermaplane Prep add-on **+$45** (master menu) vs **+$55** (competitor-analysis) | `dermaplaning` = **From $135** (matches); GBP service catalog shows **From $95** | **Local $135** is the Sanity/menu truth; the **$95 GBP** figure is stale drift — update GBP. Reconcile the internal **$45 vs $55** add-on conflict (both are local docs). |
| BioRePeel (standalone + variants) | Master menu lists BioRePeel face **only as a +$65 add-on** to needling (no standalone line); Body **$325/zone** (series $875/$1,560); Advanced Acne-Scarring = hand-built $360 combo | `biorepeel` **From $295** (standalone); `biorepeel-advanced-acne-scarring` **From $450**; `biorepeel-body` **From $325/zone** (75 min); `biorepeel-gold-spot-treatment` **From $395** (no local price) | **RESOLVED (provider split):** BioRePeel face standalone **$295** = **Brandy** (facials & peels lane); the **+$65 add-on** to an advanced service = **Amber**. Both correct — not a conflict. Still confirm: Advanced Acne-Scarring **$450** vs the $360 hand-built combo; Gold-Spot $395 is Sanity-only (no local price); Body duration differs (45 min local vs 75 min Sanity). |
| Neurotoxins | **$14/unit** (Botox and Daxxify); per-unit, not per-area | `injectables` = **price null**; copy names phantom **"Dysport"** | **Local.** Publish **$14/unit** on `injectables` (or split Botox/Daxxify). Remove "Dysport" (not on Diana's menu) — see §6. Keep per-unit (no per-area ranges, to preserve anatomy-dependency). |
| GlowTox / Micro-Tox | GlossGenius listing **$475**; legacy master menu **$425** plus a series | No Sanity service, but Amber's prior public card attributed it to an esthetics lane | **Clinical hold.** Do not market as microchanneling with topical Daxxify or as a PRF/needling package. Diana, RN and the medical director must approve a separate injectable SOP, consent, scope/workflow, and one price before a draft service is created. |
| Face Reality acne peel | **Absent from master menu §9** (not listed) | `acne-peel` = **From $139** | **Reconcile.** $139 lives in Sanity but has no local anchor — add it to the master menu or confirm/adjust. (Bootcamp **$899** and Back Treatment **From $159** are consistent local+Sanity.) |
| Jane Iredale products | Product line retained; individual inventory and pricing not yet represented by Sanity `product` docs | `/shop/jane-iredale/` is product education only | Backfill verified inventory and pricing in Sanity before enabling checkout. |
| Facial waxing | Local face rack in `services/waxing/face.md` | `facial-waxing` | Retained under Brandy; all departed-provider records were removed 2026-08-04. |
| invisiClear Spot Patches (retail) | ~$12 typical for hydrocolloid patches | Sanity = **$125** | **Likely data error** — verify; $125 is implausible for spot patches. |
| Skin Script retail | — | **41 of 52 products have `price: null`** | Backfill prices or mark back-bar-only. Null-price products cannot be sold via native cart and won't render a valid `Product` JSON-LD offer. |

---

## 2. Empty / stub local docs named as a "primary" source

These files are named as the primary/assigned source doc for a topic but are 0-byte or research-stub only. They must be authored (or the brief re-pointed to the real source) before that topic's copy is trustworthy.

| File | Topic it was assigned to | State |
|---|---|---|
| `docs/internal_only/services/microchanneling/PRF.md` | Topical PRF / microchanneling / microneedling / Procell | **0 bytes (empty)** — flagged by prf-topical, microneedling, microchanneling, Procell briefs |
| `docs/internal_only/services/facials/biorepeel.md` | BioRePeel | **Research-prompt stub, no pricing** |
| `docs/internal_only/services/facials/dermaplaning.md` | Dermaplaning | **0 bytes (empty)** |
| `docs/internal_only/services/facials/glo2facialxGeneo.md` | Glo2Facial | **0 bytes (empty)** |
| `docs/internal_only/services/facials/hydrodermabrasion.md` | Hydrodermabrasion | **0 bytes (empty)** |
| `docs/internal_only/services/Diana/tox/daxxify.md` | Neurotoxins (Daxxify) | **Empty stub — headers only, no content** |
| `docs/internal_only/services/Diana/filler/dermalfillers.md` | Dermal fillers | **0 bytes (empty)** |
| `docs/internal_only/services/Diana/filler/PRF_ez-gel.md` | EZ-Gel bio-filler | **0 bytes (empty)** |

_(Deprecated-but-intentional, not a gap: `docs/internal_only/pricing/advanced-facials-pricing.md` is a stub that correctly redirects to the master menu.)_

---

## 3. Missing Sanity content

Services/content present in local pricing/lane docs (or required by a brief) but **not** in published Sanity.

| Missing item | Detail / brief |
|---|---|
| **Carboxy facial** (Amber) | No Sanity `service`; no local pricing doc either — pending Amber. |
| **Hydrodermabrasion** (Brandy) | No Sanity `service`; local doc is 0 bytes; no pricing source. |
| **Enzyme exfoliation facial** (Brandy) | No Sanity `service`; only appears as a dermaplaning add-on. |
| **Light / superficial peels** (Brandy) | No Sanity `service`. |
| **Whole Brandy basic-facial lane** | Enzyme, hydrodermabrasion, light peels, Classic Facial, Mommy & Me — **entirely unbuilt in Sanity** ("Parked" in Notion, correctly excluded until launched). Requires a lane launch decision + pricing before any of it goes live. |
| **Skin analysis as a `service`** | Exists only as the `/skin-analysis/` singleton, not a first-class `service` doc (decision needed for service listing + JSON-LD). |
| **Neurotoxins as a priced service** | `injectables` exists but is price-null / carries phantom Dysport — not yet a real service surface. |
| **Jane Iredale `shopBrand`** | 0 retail product docs; exists only as a makeup service line. Would be the 6th `brand` if stocked. |
| **5 missing `shopBrand` docs** | GlyMed+, Skin Script, Face Reality, Procell, House of Rose — shop runs on hardcoded `FALLBACK_BRAND_COPY`; 0 `shopBrand` docs exist. Highest-value/lowest-effort win. |
| **3 unpopulated makeup singletons** | `professionalMakeupPage`, `janeIredalePage`, `makeupEventsPage` — **empty in Sanity, render from `.astro` fallback**, despite CLAUDE.md claiming "deployed + seeded." Must be populated. |
| **Empty / unpriced packages** | `dermaplaning-package-of-4` (unpriced; local $340), `face-reality-12-week-program` (title only, no price/services), all **3 wax packages** incl. `brazilian-wax-pass` (unpriced — see §8), `biorepeel-series-of-4` (empty), Glo2Facial series (`glo2facial-series-of-3` $499 / `glo2facial-series-of-6` $885 — don't exist), Procell Series of 3/6 (don't exist). |
| **Add-on upgrade pricing absent from Sanity services** | Topical PRF (+$175/+$200), Glo2Facial finish (+$95), Dermaplane prep (+$45), LED (+$35), BioRePeel (+$65), Neck & Décolleté (+$95) — priced in the master menu but not reflected on Sanity service docs. |
| **Procell MD not a distinct Sanity service** | Sanity has one `microchanneling` "From $250" (= Pro single); MD ($325) should be split out. |
| **Merchandising levers unused** | 0 `promotion` docs, 0 `isFeatured` products (no Top Sellers rail), 0 `purchaseUrl` on products. |

---

## 4. Package framework drift

The master menu and Sanity use **different series cadences and names** — must be reconciled to one framework before packages are published.

| Framework | Where it lives | Naming |
|---|---|---|
| **Series of 3 ("Renewal", ~10% value) / Series of 6 ("Full Correction", ~20% value)** | `advanced-facials-master-menu.md` (all Amber-lane pricing) | Renewal / Full Correction |
| **Series of 4** | Sanity packages (`prf-microneedling-series-of-4`, `Procell-microchanneling-series-of-4`, `biorepeel-series-of-4`, `dermaplaning-package-of-4`) | "Series of 4" / "Package of 4" |

**Corrected fix (2026-07-17) — do NOT pick ONE cadence.** The earlier advice ("pick ONE cadence, 3/6 is canonical, series-of-4 is off-framework") was **wrong** — it flattened distinct clinical protocols into one retail pattern. Series length is **per-treatment, per manufacturer protocol**:

- **Procell microchanneling → Series of 4** (min 4 tx ~4 wks apart, 6+ scarring — Procell protocol; `docs/internal_only/services/PRF/`).
- **BioRePeel → Series of 4** (manufacturer: 4–6 sessions every 7–10 days, maintenance q2–3mo — [BioRePeelCl3 protocol](https://biorepeelcl3spain.com/wp-content/uploads/2019/12/Protocol-of-use-BioRePeelCl3.pdf); confirmed 2026-07-17). Notion Live page + master menu already price series-of-4 ($1,050).
- **PRF Skin Renewal → Series of 3 or 4** ($1,200 / $1,550 — GlossGenius import CSV, PRF PDF).
- **Glo2Facial → Series of 3 / 6** (OxyGeneo study ran 6 weekly; $499 / $885).
- **Microneedling — Corrective → 3–6** (acne scars 5–8, stretch/surgical 6–8 — consent doc, StatPearls).

The "Series of 3 / 6 (Renewal / Full Correction)" labels are a **generic retail wrapper**, not a clinical mandate. What still needs doing before Phase 4: **back-fill the empty Sanity `*-series-of-4` packages with prices/included services** (they're empty, not wrong), and keep each treatment on its own documented count. Reconcile *names* (a treatment can be "Series of 4" and still be marketed with a value label), not the *counts*.

---

## 5. Lane / provider drift

| Item | Drift | Recommended fix |
|---|---|---|
| "PRF Skin Renewal" provider | Confirmed **Amber** (topical, during eligible Microneedling) | Keep attributed to Amber; keep topical-only language. |
| Topical vs injectable PRF blur | Recurring risk across PRF surfaces | Hard line: **Amber = topical PRF only, never injected** (advanced facials); **Diana, RN = injectable PRF / EZ-Gel / PRF scalp**. Never let a device "inject/deliver PRF into skin"; never present topical as delivering an injectable study's outcome. |
| PRF-for-hair | prf-injections brief flags **do not present PRF-for-hair as a bookable HoR service** (hair restoration removed from consolidated menu); stale PDFs still list it | Do not list PRF hair restoration on `/concerns/hair-thinning/` as bookable. |
| Micro-Tox / GlowTox | Legacy material incorrectly combines needling with Daxxify | **Clinical hold.** Keep it out of Amber's lane and out of needling/PRF packages. A separate Diana, RN injectable workflow requires medical-director approval and pricing reconciliation before it is surfaced. |

---

## 6. Naming-law flags

**Service names are plain / technical only** — no invented, flowery, or "signature" names. Fix any that appear in live content:

| Flag | Where | Recommended fix |
|---|---|---|
| **"Rosé wax"** ("our signature Rosé wax") | Sanity `body-waxing` tagline | **No such product exists** — local docs specify **hard wax** only. Correct to plain "hard wax" language. |
| Any invented/"signature" service name | anywhere in live copy | Replace with the plain, searchable technical name (e.g., "Dermaplaning," "BioRePeel," "Glo2Facial"). |

---

## 7. Compliance flags

Retail products keep their **accurate manufacturer names** (buyers must identify the SKU) — but **House of Rose's surrounding copy** (descriptions, category headers, brand blurbs, meta) must never adopt the banned framing, and manufacturer efficacy claims are never imported.

| Flag | Detail | Rule |
|---|---|---|
| **GlyMed+ banned-term product names** | "Age Defying Masque," "Anti-Aging Exfoliant Masque," "Age Delay Cream," **"Firming Serum with Phyto-Stem Cells"** | Keep names as-is; **never build a claim on them.** No "anti-aging / age-defying / reverse aging," and **never "stem cell"** in our copy. |
| **Skin Script "Ageless" product names** | "Ageless Skin Moisturizer," "Ageless Skin Hydrating Serum," "Ageless Lip Treatment" | Keep names; our copy avoids "ageless / age-reversal" framing. |
| **Face Reality manufacturer claims** | "Clinically Proven Clear Skin Method™," "visible results in 8 weeks," **"90% success rate,"** grades of acne it "treats" | **Do not import as HoR claims.** Say "supports clearer-looking skin," "part of a guided acne program"; never "treats/cures/heals/clears acne." (Amber is a **Face Reality Certified Acne Specialist** — that credential is citable; the outcome claims are not.) |
| **Procell "stem cell"-adjacent marketing** | Manufacturer references mesenchymal/BM stem-cell literature, "conditioned medium," DNA repair | Use only the literal ingredient statement (growth factors, cytokines, DNA-repair enzymes, HA; bio-engineered/recombinant; no cells/DNA/blood). Never "stem cell," never "delivered deep into the skin." |
| **invisiClear Spot Patches price** | Sanity $125 vs ~$12 typical | Likely a data error — verify (also in §1). |
| **Advanced skin imaging** | Must not "diagnose," "detect disease/skin cancer/melanoma," claim "medical-grade/clinical diagnosis," or cite a specific metric count / FDA-approval | Say "helps us see/evaluate," "supports personalized recommendations," "evidence-based first step." |
| **Needling / device language** | FDA: microneedling devices are **not** authorized to deliver cosmetics or blood products into skin | Never "injects/delivers PRF into the skin," never "FDA-approved PRF microneedling." |
| **Cross-cutting banned phrases** | "anti-aging / reverse aging / age-defying / turn back the clock," "erases/removes/eliminates," "permanent," "guaranteed," "clinically proven," "FDA-approved" (procedures), "day spa," discount language, naming the checkout platform | Applies to every surface; pricing is always "investment / from / starting at." |

---

## 8. Memberships — not offered

House of Rose does **not** offer memberships. None exist, none are in the site or Studio, and none are planned. `/memberships/`, `/rose-circle/`, and `/plans/` all return forced `404` responses so search engines remove the historical URLs. Do not add membership tiers, "member rate" pricing, or membership framing to any brief, page, or schema. If a brief or Sanity doc still references a membership cost-factor or tier, **remove it** (e.g., the stale "Membership" factor in the PRF cost guide, and any "monthly membership" line in `packagesAdd-ons.md`).

---

_Cross-reference: the topic → brief → target-page matrix and the de-duplicated new-page list live in the sibling `_index.md`._
