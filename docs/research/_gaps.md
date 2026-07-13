# House of Rose — Phase 2 Consolidated Gap & Contradiction Log

**Date:** 2026-07-13

**Purpose.** The single reconciliation checklist for Amber, aggregated from all 22 research briefs (§8/§10/§11/Sources and every "GAP"/"flag" callout). Each conflict has a recommended source-of-truth. Governing rule from the briefs: **local docs (`docs/services/**`, canonical master menus) are pricing truth; Sanity is corrected to match; web research is never a price source.** All URLs use trailing slashes.

> ⚠️ **Read Section 8 first if you are cleaning up membership references.** The membership teardown was **reversed on 2026-07-13** — briefs that flagged membership content "to remove" are now flagging **assets to rebuild**. Do not delete membership content.

---

## 1. Pricing drift (local docs vs Sanity vs live)

Source-of-truth default = **local master menu / local pricing docs**; correct Sanity to match. "Pending" = no local source exists yet, so the provider must supply a number before publish.

| Item | Local-doc value | Sanity value | Recommended source of truth / fix |
|---|---|---|---|
| PRF microneedling (topical, Amber) | Corrective + topical PRF (face) = **$470**; PRF upgrade **+$175 face / +$200 body**; `prf-microneedling` service reads **From $425** | Cost guide `prf-microneedling-cost-punta-gorda` = **$599–$850/session** + names stale **"Membership"** as a cost factor | **Local menu.** The $599–$850 range spans the whole PRF hub up to the injectable `prf-injections` (From $599) and overstates the topical floor. Rewrite the cost guide to the topical band; reconcile the "$425 PRF facial" vs "+$175 upgrade" framing. (Membership factor — see §8, now a rebuild hook, not a delete.) |
| Dermal fillers | Juvéderm Ultra XC **From $650**, Voluma XC $850, RHA 1 $650 / RHA 2 $700 / RHA 3 $800 (per syringe) | `dermal-fillers` = **From $700** + SEO "from $700/syringe"; tagline lists phantom **"Restylane"** | **Local.** Update Sanity entry price to **From $650** (Ultra XC / RHA 1 floor). Remove "Restylane" until Diana confirms she carries it (menu is Juvéderm + RHA only) — see §6. |
| IV hydration | Hydration IV **$100** (30 min); Immunity $175, Recovery/Beauty Glow/Reboot $185, Myers' $190; add-ons $25–$100 | `iv-hydration-therapy` = **From $129** | **Local.** Update Sanity to **From $100**. |
| GLP-1 | **Semaglutide from $225/mo**, **Tirzepatide from $325/mo** | `glp-1-weight-management` = **From $349/month** | **Local.** $349 contradicts both local figures and is stale. Correct to **From $225/month** (semaglutide floor). Sourcing (brand vs compounded) undocumented — pending Diana; do not state brand/compounded. |
| PRF injections (Diana) | PRF Under-Eye **$495** single ($1,350 series of 3); PRF Facial **$595** single ($1,650 series of 3) | `prf-injections` = **From $599** | **Local.** Update Sanity to $495 under-eye / $595 facial. |
| EZ-Gel bio-filler | **No local source** — EZ-Gel absent from the local consolidated menu entirely | `ez-gel-bio-filler` = **From $699** | **Pending Diana.** $699 is unanchored — do not treat as verified; Diana must confirm the investment. |
| Dermaplaning | Standalone **From $135** (master menu / competitor-analysis); Dermaplane Prep add-on **+$45** (master menu) vs **+$55** (competitor-analysis) | `dermaplaning` = **From $135** (matches); GBP service catalog shows **From $95** | **Local $135** is the Sanity/menu truth; the **$95 GBP** figure is stale drift — update GBP. Reconcile the internal **$45 vs $55** add-on conflict (both are local docs). |
| BioRePeel (standalone + variants) | Master menu lists BioRePeel face **only as a +$65 add-on** to needling (no standalone line); Body **$325/zone** (series $875/$1,560); Advanced Acne-Scarring = hand-built $360 combo | `biorepeel` **From $295** (standalone); `biorepeel-advanced-acne-scarring` **From $450**; `biorepeel-body` **From $325/zone** (75 min); `biorepeel-gold-spot-treatment` **From $395** (no local price) | **Reconcile — critical.** Decide whether BioRePeel face is a standalone (**$295**) or add-on-only (**+$65**) — Sanity and menu disagree. Confirm Advanced Acne-Scarring at **$450** vs the $360 hand-built combo. Gold-Spot $395 is Sanity-only (no local price). Body duration differs (45 min local vs 75 min Sanity). |
| Neurotoxins | **$14/unit** (Botox and Daxxify); per-unit, not per-area | `injectables` = **price null**; copy names phantom **"Dysport"** | **Local.** Publish **$14/unit** on `injectables` (or split Botox/Daxxify). Remove "Dysport" (not on Diana's menu) — see §6. Keep per-unit (no per-area ranges, to preserve anatomy-dependency). |
| GlowTox / Micro-Tox | GlossGenius listing **$475**; legacy master menu **$425** plus a series | No Sanity service, but Amber's prior public card attributed it to an esthetics lane | **Clinical hold.** Do not market as microchanneling with topical Daxxify or as a PRF/needling package. Diana, RN and the medical director must approve a separate injectable SOP, consent, scope/workflow, and one price before a draft service is created. |
| Face Reality acne peel | **Absent from master menu §9** (not listed) | `acne-peel` = **From $139** | **Reconcile.** $139 lives in Sanity but has no local anchor — add it to the master menu or confirm/adjust. (Bootcamp **$899** and Back Treatment **From $159** are consistent local+Sanity.) |
| Permanent jewelry | Sanity is source of truth: **From $45**; competitor doc lists **14k gold-filled bracelet $95**, sterling $75, solid-gold tiers $285–$795+ | `permanent-jewelry` = **From $45** | **Sanity "From $45"** leads. The **$95+** competitor/"Forever Rose" numbers are an unconfirmed strategic proposal — mark all per-metal/tier/charm/event pricing **pending Aundrea**; do not present as live. |
| Jane Iredale / professional makeup | **Local-only** (build-plan + pricing comp): Everyday **From $85**, Event **From $150/face**, Trial $150, Private lesson **From $175**, In-house block $150/pp, Spa Rental $175/pp (4-guest min), Travel $150/pp + travel fee (4-guest min) | **No Sanity price docs for makeup** | **Local.** Publish from local build-plan. **Note: private lesson is deliberately set at $175** (regional comps $350–$400) — flagged so it is NOT "corrected" upward. |
| Waxing | Full local rack (face $15–$70; body $28–$85; combos to $160); **Brazilian series "Buy 5, Get 1"** | `facial-waxing` From $15, `body-waxing` From $28 | **Local.** Brazilian series price **not set in Sanity — needs confirmation**. (See §6 for "Rosé wax" naming and §3 for missing collection.) |
| invisiClear Spot Patches (retail) | ~$12 typical for hydrocolloid patches | Sanity = **$125** | **Likely data error** — verify; $125 is implausible for spot patches. |
| Skin Script retail | — | **41 of 52 products have `price: null`** | Backfill prices or mark back-bar-only. Null-price products cannot be sold via native cart and won't render a valid `Product` JSON-LD offer. |

---

## 2. Empty / stub local docs named as a "primary" source

These files are named as the primary/assigned source doc for a topic but are 0-byte or research-stub only. They must be authored (or the brief re-pointed to the real source) before that topic's copy is trustworthy.

| File | Topic it was assigned to | State |
|---|---|---|
| `docs/services/microchanneling/PRF.md` | Topical PRF / microchanneling / microneedling / ProCell | **0 bytes (empty)** — flagged by prf-topical, microneedling, microchanneling, procell briefs |
| `docs/services/facials/biorepeel.md` | BioRePeel | **Research-prompt stub, no pricing** |
| `docs/services/facials/dermaplaning.md` | Dermaplaning | **0 bytes (empty)** |
| `docs/services/facials/glo2facialxGeneo.md` | Glo2Facial | **0 bytes (empty)** |
| `docs/services/facials/hydrodermabrasion.md` | Hydrodermabrasion | **0 bytes (empty)** |
| `docs/services/tox/daxxify.md` | Neurotoxins (Daxxify) | **Empty stub — headers only, no content** |
| `docs/services/filler/dermalfillers.md` | Dermal fillers | **0 bytes (empty)** |
| `docs/services/filler/PRF_ez-gel.md` | EZ-Gel bio-filler | **0 bytes (empty)** |

_(Deprecated-but-intentional, not a gap: `docs/services/pricing/advanced-facials-pricing.md` is a stub that correctly redirects to the master menu.)_

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
| **5 missing `shopBrand` docs** | GlyMed+, Skin Script, Face Reality, ProCell, House of Rose — shop runs on hardcoded `FALLBACK_BRAND_COPY`; 0 `shopBrand` docs exist. Highest-value/lowest-effort win. |
| **3 unpopulated makeup singletons** | `professionalMakeupPage`, `janeIredalePage`, `makeupEventsPage` — **empty in Sanity, render from `.astro` fallback**, despite CLAUDE.md claiming "deployed + seeded." Must be populated. |
| **Empty / unpriced packages** | `dermaplaning-package-of-4` (unpriced; local $340), `face-reality-12-week-program` (title only, no price/services), all **3 wax packages** incl. `brazilian-wax-pass` (unpriced — see §8), `biorepeel-series-of-4` (empty), Glo2Facial series (`glo2facial-series-of-3` $499 / `glo2facial-series-of-6` $885 — don't exist), ProCell Series of 3/6 (don't exist). |
| **Add-on upgrade pricing absent from Sanity services** | Topical PRF (+$175/+$200), Glo2Facial finish (+$95), Dermaplane prep (+$45), LED (+$35), BioRePeel (+$65), Neck & Décolleté (+$95) — priced in the master menu but not reflected on Sanity service docs. |
| **ProCell MD not a distinct Sanity service** | Sanity has one `microchanneling` "From $250" (= Pro single); MD ($325) should be split out. |
| **Merchandising levers unused** | 0 `promotion` docs, 0 `isFeatured` products (no Top Sellers rail), 0 `purchaseUrl` on products. |

---

## 4. Package framework drift

The master menu and Sanity use **different series cadences and names** — must be reconciled to one framework before packages are published.

| Framework | Where it lives | Naming |
|---|---|---|
| **Series of 3 ("Renewal", ~10% value) / Series of 6 ("Full Correction", ~20% value)** | `advanced-facials-master-menu.md` (all Amber-lane pricing) | Renewal / Full Correction |
| **Series of 4** | Sanity packages (`prf-microneedling-series-of-4`, `procell-microchanneling-series-of-4`, `biorepeel-series-of-4`, `dermaplaning-package-of-4`) | "Series of 4" / "Package of 4" |

**Recommended fix:** pick ONE cadence + naming. The master menu's Series of 3 / Series of 6 (Renewal / Full Correction) is the canonical, priced framework; the Sanity "Series of 4" packages are unpriced/empty and off-framework. Reconcile the count (3/6 vs 4) and the names before Phase 4 builds package pages. PRF series also appears as "Series of 3 $1,200 / Series of 4 $1,550" in the House PRF PDF — a third variant to fold in.

---

## 5. Lane / provider drift

| Item | Drift | Recommended fix |
|---|---|---|
| `provider-brooke` roleCredential | Omits **makeup** and **waxing** — Aundrea's actual lanes | Add makeup + waxing (and permanent jewelry) to the credential. Display name is **Aundrea Pedigo** always (never "Brooke"/"Morrison"); Sanity ref stays `provider-brooke`. |
| `aundrea.vcf` | Adds **Lashes** and **Ear-Piercing** services + an **individual email** not in her documented lane/NAP | Confirm with Aundrea whether Lashes / Ear-Piercing are offered; only `info@houseofrosefl.com` is canonical — verify any individual mailbox before it ships. |
| "PRF Skin Renewal" provider | Confirmed **Amber** (topical, during microchanneling/microneedling) | Keep attributed to Amber; keep topical-only language. |
| Topical vs injectable PRF blur | Recurring risk across PRF surfaces | Hard line: **Amber = topical PRF only, never injected** (advanced facials); **Diana, RN = injectable PRF / EZ-Gel / PRF scalp**. Never let a device "inject/deliver PRF into skin"; never present topical as delivering an injectable study's outcome. |
| PRF-for-hair | prf-injections brief flags **do not present PRF-for-hair as a bookable HoR service** (hair restoration removed from consolidated menu); stale PDFs still list it | Do not list PRF hair restoration on `/concerns/hair-thinning/` as bookable. |
| Micro-Tox / GlowTox | Legacy material incorrectly combines needling with Daxxify | **Clinical hold.** Keep it out of Amber's lane and out of needling/PRF packages. A separate Diana, RN injectable workflow requires medical-director approval and pricing reconciliation before it is surfaced. |
| Brandy facial waxing vs Aundrea body waxing | Brandy offers **facial** waxing only; body/general waxing stays Aundrea's | Keep lane split explicit on waxing pages. |
| "Party Planner Infusion IV" (makeup Spa Rental) | Hosted-event-only perk — never à la carte | Never sell/link as a standalone IV; no standalone price. |

---

## 6. Naming-law flags

Botanical/flowery/invented names are dead (Lily/Iris/Hydrangea/Porcelain Petal/Gilded Lily, etc.). Flags found in current content:

| Flag | Where | Recommended fix |
|---|---|---|
| **"Rosé wax"** ("our signature Rosé wax") | Sanity `body-waxing` tagline | **No such product exists** — local docs specify **hard wax** only. Correct to plain "hard wax" language. |
| **"Forever Rose"** ("The Forever Rose") | Competitor/strategy doc title for permanent jewelry | **Retired botanical name — must never appear** in live copy. The doc is an unconfirmed strategic proposal. |
| **"Bridal Bloom" / "Rose Circle" wrappers** | Permanent-jewelry competitor doc packaging | Botanical/membership wrappers around jewelry event packages. See §8 — the Rose Circle wrapper is now a **membership rebuild hook**, not automatically dead; "Bridal Bloom" botanical framing is retired. Naming-law status of "Rose Circle"/"Rose Pass" is **pending owner decision** (§8). |
| **"Porcelain Petal"** | Dermaplaning competitor-analysis doc | Confirmed retired; use the plain technical name ("Dermaplaning") only. |

---

## 7. Compliance flags

Retail products keep their **accurate manufacturer names** (buyers must identify the SKU) — but **House of Rose's surrounding copy** (descriptions, category headers, brand blurbs, meta) must never adopt the banned framing, and manufacturer efficacy claims are never imported.

| Flag | Detail | Rule |
|---|---|---|
| **GlyMed+ banned-term product names** | "Age Defying Masque," "Anti-Aging Exfoliant Masque," "Age Delay Cream," **"Firming Serum with Phyto-Stem Cells"** | Keep names as-is; **never build a claim on them.** No "anti-aging / age-defying / reverse aging," and **never "stem cell"** in our copy. |
| **Skin Script "Ageless" product names** | "Ageless Skin Moisturizer," "Ageless Skin Hydrating Serum," "Ageless Lip Treatment" | Keep names; our copy avoids "ageless / age-reversal" framing. |
| **Face Reality manufacturer claims** | "Clinically Proven Clear Skin Method™," "visible results in 8 weeks," **"90% success rate,"** grades of acne it "treats" | **Do not import as HoR claims.** Say "supports clearer-looking skin," "part of a guided acne program"; never "treats/cures/heals/clears acne." (Amber is a **Face Reality Certified Acne Specialist** — that credential is citable; the outcome claims are not.) |
| **ProCell "stem cell"-adjacent marketing** | Manufacturer references mesenchymal/BM stem-cell literature, "conditioned medium," DNA repair | Use only the literal ingredient statement (growth factors, cytokines, DNA-repair enzymes, HA; bio-engineered/recombinant; no cells/DNA/blood). Never "stem cell," never "delivered deep into the skin." |
| **invisiClear Spot Patches price** | Sanity $125 vs ~$12 typical | Likely a data error — verify (also in §1). |
| **AI skin analysis** | Must not "diagnose," "detect disease/skin cancer/melanoma," claim "medical-grade/clinical diagnosis," or cite a specific metric count / FDA-approval | Say "helps us see/evaluate," "supports personalized recommendations," "evidence-based first step." |
| **Needling / device language** | FDA: microneedling devices are **not** authorized to deliver cosmetics or blood products into skin | Never "injects/delivers PRF into the skin," never "FDA-approved PRF microneedling." |
| **Cross-cutting banned phrases** | "anti-aging / reverse aging / age-defying / turn back the clock," "erases/removes/eliminates," "permanent," "guaranteed," "clinically proven," "FDA-approved" (procedures), "day spa," discount language, naming the checkout platform | Applies to every surface; pricing is always "investment / from / starting at." |

---

## 8. ⚠️ MEMBERSHIPS — POLICY REVERSED 2026-07-13

**CRITICAL FRAMING.** The owner has decided to **REINSTATE memberships**, reversing the 2026-07-07 teardown. Therefore every "stale membership reference — remove" flag the briefs raised is **no longer a delete-me error** — it is now a **REBUILD hook or reusable, prior-approved content**. The items below are listed as **ASSETS to reconcile into the membership rebuild**, not content to delete.

> **Note:** The membership rebuild is being handled as a **separate workstream started 2026-07-13** — do **not** treat any membership content as dead, and do **not** instruct anyone to strip it. **Naming-law status of "Rose Circle" / "Rose Pass" is pending owner decision** (they were retired only because they belonged to the old membership system; the reinstatement may revive them).

| Membership asset (found in briefs) | Where it lives | Reconcile as |
|---|---|---|
| **"Membership" cost factor** in the PRF cost guide | `costGuide` `prf-microneedling-cost-punta-gorda` (factors list) | A live pricing-factor hook — keep and wire to the rebuilt membership tiers rather than deleting. |
| **"Monthly membership" line** | `docs/services/facials/packagesAdd-ons.md` (dermaplaning cadence context) | Prior-approved membership cadence copy — reusable for the rebuild. |
| **Diana v2 PDF member-unit pricing** — Rose / Rose Gold / Black Rose tiers | Diana injectables v2 PDF: per-unit member rates (~$13.50 / $13 / $12.50 per unit for tox) | The member-tier pricing scaffold for the injectable membership — reconcile into the rebuild (not "purge," despite the brief's wording). |
| **Dermal-filler member pricing** | Diana v2 PDF (Rose/Rose Gold/Black Rose filler discounts) | Filler member-tier scaffold — reconcile into the rebuild. |
| **Permanent-jewelry "Rose Circle" / "Bridal Bloom" wrappers** | Permanent-jewelry competitor/strategy doc | "Rose Circle" is a membership wrapper — a rebuild hook (naming pending §6/§8). "Bridal Bloom" botanical framing stays retired per naming law. |
| **`brazilian-wax-pass` package** | Sanity wax package (unpriced) + waxing brief's "Buy 5, Get 1" | Was reframed as a prepaid "series" during teardown; with memberships back, decide whether it becomes a **wax pass / membership** again or stays a prepaid series. Owner decision — do not force it to "series." |

**Do NOT** instruct anyone to remove membership content. All of the above feeds the reinstatement workstream.

---

_Cross-reference: the topic → brief → target-page matrix and the de-duplicated new-page list live in the sibling `_index.md`._
