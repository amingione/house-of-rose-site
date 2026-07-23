> ⚠️ **PRICING IN THIS DOC IS SUPERSEDED (2026-07-23).** GlossGenius is commerce truth; the live menu is `docs/services/ALL-SERVICES-PRICING.MD`. Amber ruled: GLP-1 = GG $225/$325 · IVs = GG prices · GlowTox approved & live · memberships/Rose Circle deleted everywhere. Structure/taxonomy content below remains valid reference.

# Sanity `serviceCollection` Restructure — DRAFT for Amber

**Date:** 2026-07-13 · **Status:** draft spec for approval — **no Sanity docs changed yet** (writes are gated;
this is the plan to apply once you approve). **Basis:** the live GlossGenius catalog + provider column
(`glossgenius_catalog.numbers`) + your inline sheet notes + `_service-taxonomy.md`.

**Design decision:** the website's collections should **mirror the GlossGenius categories** so the booking
system and the site agree (a client sees the same groups both places). Below is that mirrored set, the
services in each (with provider + real GG price + `kind`), and a migration table for the current 31 Sanity services.

---

## 1. Current state → target

**Current (4 collections):** Skin Renewal · Injectables & Aesthetics · Wellness & Restoration · Beauty & Enhancements.
**Target (mirror GG):** the collections below. Empty GG categories (Hormone Therapy, Injections) are held as
"coming" and not built yet.

---

## 2. Target collections + their services (GG truth)

### A. Advanced Facials — *Amber* (`advanced-facials`)
Merges GG's "Advanced Facials" + "Microchanneling & Microneedling" + "Skin Renewal" (all Amber, per your
taxonomy which treats advanced facials as the microneedling/microchanneling lane).

| Service | Provider | GG price | kind | In GG? |
|---|---|---|---|---|
| Glo2Facial | Amber | $195 | treatment | ✅ |
| Glo2Facial + ProCell MD | Amber | $475 | treatment | ✅ |
| Glo2Facial + ProCell Pro | Amber | $525 | treatment | ✅ |
| Glo2Facial + PRF | Amber | $595 | treatment | ✅ |
| GlowTox Facial | Amber | $475 | treatment | ✅ |
| ProCell MD Microchanneling | Amber | $349 | treatment | ✅ |
| PRF Skin Renewal (3 options) | Amber | $450 | treatment | ✅ |
| BioRePeel Blue (Face) + Gold body/spot | Amber | 🟥 you'll add | treatment | not yet |
| ProCell PRO / MD — Body · PRF Topical Body | Amber | 🟥 you'll add (per zone) | treatment | not yet |

*Modular add-ons (see §5): Dermaplane prep, Glo2Facial prep, LED — attach to any of the above.*

### B. Facials — *Brandy & Aundrea* (`facials`)
The 9-facial basic ladder, **provider now confirmed from your sheet:**

| Facial | Provider | GG price | kind |
|---|---|---|---|
| Signature Rose Facial | Aundrea | $80 | treatment |
| Luxe Rose Facial | Aundrea | $120 | treatment |
| Royal Rose Facial | Aundrea | $170 | treatment |
| Lunch Time Glow | Brandy | $100 | treatment |
| Signature Facial | Brandy | $120 | treatment |
| Skin Reset Facial | Brandy | $140 | treatment |
| Mommy & Me Facial | Brandy | $150 | treatment |
| Sculpt & Lift Facial | Brandy | $180 | treatment |
| Luxury Facial | Brandy | $200 | treatment |

### C. Face Reality Acne Program — *Amber* (`face-reality-acne-program`)
Per your correction: **one $899, 12-week program — NOT sold as single facials/peels.** Your sheet says "Acne
Bootcamp should be a SERVICE, not a category." So: **one service** (`acne-bootcamp`, $899, program). **Remove**
the standalone `acne-peel` and `back-treatment` services. This program needs its **own page cluster** (see §6),
so it stays its own hub rather than being buried in Facials.

**Diana = 6 collections** (the canonical split from `ALL-SERVICES-PRICING.MD`; prices = final reconciled from
`Diana_Pricing_Reconciliation.xlsx`, which run **higher than current GG** — GG must be updated to match):

### D1. Tox — *Diana* (`tox`)
Botox $14/unit · Daxxify $14/unit.

### D2. Dermal Filler — *Diana* (`dermal-filler`)
Juvéderm Ultra XC $650 · Voluma XC $850 · RHA 1 $650 · RHA 2 $700 · RHA 3 $800 (per syringe). *(Remove phantom "Restylane".)*

### D3. PRF Treatments — *Diana* (`prf-treatments`) ← **the 12th category I'd folded under Dermal Filler**
PRF Under-Eye Rejuvenation $495 (series-3 $1,295, pending) · PRF Facial Rejuvenation 1 Area $595 (series-3 $1,595, pending).

### D4. IV Hydration Therapy — *Diana* (`iv-hydration-therapy`)
Hydration **$125** · Immunity **$185** · Recovery **$195** · Beauty Glow **$199** · Reboot **$195** · Myers' **$199**.

### D5. Wellness & Restoration Add-Ons — *Diana* (`wellness-restoration`)
Vitamin C ✅/B12/Biotin/Magnesium $25 · Glutathione $35 · NAD+ Add-On $100 · Toradol $35 (new) · Zofran $35 (new).
Plus **NAD+ IV Therapy** (dedicated, new): 250mg $325 · 500mg $550 — pending Diana.

### D6. Weight Management — *Diana* (`weight-management`)
Semaglutide **$279/mo** · Tirzepatide **$379/mo** (confirm vs supplier COGS).

### F. Waxing — *Aundrea & Brandy* (`waxing`)
Facial waxes (Chin $10 · Lip $10 · Eyebrow Wax $15 · Eyebrow Shape/Trim/Wax $20) = **Aundrea & Brandy**.
Body waxes (Underarm $20 · Bikini Line $30 · Full Arm $35 · Chest $40 · Back $50 · Full Leg $65) = **Aundrea**.

### G. Lash Services — *Aundrea* (`lash-services`) — **NEW lane, not on site yet**
Lash Tint $25 · Lash Lift $65 · Lash Lift & Tint $85.

### H. Makeup — *Aundrea* (`makeup`)
Everyday $30 · Soft Glam/Event $80 · Full Glam/Bridal $175. *(Today lives in singleton pages; GG has them as services.)*

### I. Permanent Jewelry — *Aundrea* (`permanent-jewelry`)
Permanent Jewelry $65 (one line today; per-piece types — belly chain/necklace/anklet/bracelet + charm —
**pending your research; leave as one line for now**).

### J. Enhancements & Add-ons (`enhancements-add-ons`)
GG "Enhancements & Add-ons": Lip $7 · Chin $7 (confirm what these are — filler top-off? small wax?), plus the
treatment prep add-ons in §5.

### (Held, not built) Hormone Therapy · Injections — *Diana*, 0 services in GG (BHRT / injections coming).

---

## 3. Migration table — current 31 Sanity services → action

| Current service slug | Action | New collection | Note |
|---|---|---|---|
| `glo2facial` | keep + reprice $185→**$195** | Advanced Facials | |
| `microchanneling` / `microchanneling-microneedling` | reconcile → **ProCell MD Microchanneling $349** | Advanced Facials | GG has ONE microchanneling line; collapse the Pro/MD/hub variants |
| `prf` / `prf-microneedling` / `prf-body-treatments` | reconcile → **PRF Skin Renewal $450** + Glo2+PRF $595 | Advanced Facials | GG topical-PRF = PRF Skin Renewal; body not in GG yet |
| `procell-microchanneling-body` / `microneedling-body` / `microneedling-corrective` | hold as 🟥 "you'll add to GG" | Advanced Facials | body + corrective not in GG yet |
| `biorepeel` / `biorepeel-advanced-acne-scarring` / `biorepeel-body` / `biorepeel-gold-spot-treatment` | hold as 🟥 "you'll add to GG" | Advanced Facials | BioRePeel not in GG yet |
| `neck-decollete-extension` / `lightstim-led-therapy` | → **add-ons** (not standalone) | Enhancements & Add-ons | LED is add-on-only |
| `dermaplaning` | → **add-on** (Dermaplane prep) | Enhancements & Add-ons | add-on only per you; Brandy may offer as a facial |
| `acne-bootcamp` | keep = **the $899 program** | Face Reality Acne Program | the only Face Reality service |
| `acne-peel` | **REMOVE** | — | not sold standalone |
| `back-treatment` | **REMOVE** | — | not sold standalone |
| `face-reality-acne-program` | keep as the hub | Face Reality Acne Program | see §6 page cluster |
| `injectables` / `injectables-bio-fillers` | split → Botox + Daxxify $14/unit | **Tox** | was null/consult |
| `dermal-fillers` | split into Juvéderm/RHA lines; **$650 floor** | **Dermal Filler** | phantom "Restylane" removed |
| `prf-injections` | reprice → **$495/$595** (+ series $1,295/$1,595 pending) | **PRF Treatments** | the new 12th collection |
| `ez-gel-bio-filler` | 🟥 confirm — **not in GG, no local source** | PRF Treatments | $699 was Sanity-only; confirm or drop |
| `iv-hydration-therapy` | split into 6 IVs; reprice to **final** ($125/$185/$195/$199/$195/$199) | **IV Hydration Therapy** | reconciled UP from GG; + Vitamin C |
| `wellness` | becomes the add-ons collection | **Wellness & Restoration Add-Ons** | + NAD+ IV 250/500mg (new) |
| `glp-1-weight-management` | keep; reprice → **$279/$379** | **Weight Management** | confirm vs supplier COGS |
| `facial-waxing` / `body-waxing` | expand to per-zone; fix "Rosé wax" copy | Waxing | GG per-zone prices |
| `permanent-jewelry` | keep $65; piece types pending | Permanent Jewelry | |
| **(none exist)** the 9 basic facials | **CREATE NEW** | Facials | Brandy/Aundrea per §2B |
| **(none exist)** Lash Tint/Lift/Combo | **CREATE NEW** | Lash Services | |
| **(none exist)** 3 makeup services | **CREATE NEW** (or link singletons) | Makeup | |

---

## 4. Diana granularity — RESOLVED (6-way split)

Settled by `ALL-SERVICES-PRICING.MD`: Diana is **6 collections** — Tox · Dermal Filler · **PRF Treatments** ·
IV Hydration Therapy · Wellness & Restoration Add-Ons · Weight Management (see §2 D1–D6). That makes the full
count **12 canonical collections** (Basic Facials · Advanced Facials · the 6 Diana · Waxing · Lashes · Permanent
Jewelry · Professional Makeup), plus **Face Reality Acne Program** as a standalone program page (not a booking
category) and add-ons homed on their parent services. GlossGenius itself groups Diana as 2 categories, so **GG
will need to be re-grouped to these 6** (or keep GG's 2 for booking while the site shows 6 — Amber's call, but
the site/collections follow the canonical 6).

---

## 5. Add-ons — categorize, don't lose (you said pricing already exists)

These are add-ons, not standalone services. Confirm/settle prices (local master menu had these; reconcile to GG):
| Add-on | Local-doc price | Attaches to |
|---|---|---|
| Dermaplane prep | +$45 | any Advanced Facial |
| Glo2Facial prep (RF + illuminate pod + ultrasound w/ serum) | +$95 (as "Glo2 Finish") | any needling treatment |
| LED | +$35 | any facial/needling |
| BioRePeel Gold spot (face) / Gold (body) | +$45 / +$95 | BioRePeel / needling |
| Enhancements: Lip / Chin | $7 each (GG) | — confirm what these are |

→ Home them in the **Enhancements & Add-ons** collection with `pricingModel: add-on`. If any price isn't in a
local doc, I'll flag it for you rather than invent it.

---

## 6. Face Reality — the program build you asked for (separate workstream)

Not a collection change — a page cluster. You want: **About Face Reality · Products & Prescription products ·
Acne Bootcamp 12-week outline (how it works + what's included) · FAQ.** That's a hub + sub-pages (like the
professional-makeup cluster). I'll scope it as its own build after the collection restructure is approved; the
existing `docs/research/face-reality-acne-program.md` brief covers the clinical content (compliance-clean:
"appearance of breakouts," never "treats acne").

---

## 7. Schema notes (small)

- `service.category` enum currently has 5 values (skin-renewal / injectables-bio-fillers / wellness-restoration /
  beauty-enhancements / retail-home-care). To mirror GG it should gain: `advanced-facials`, `facials`,
  `face-reality-acne-program`, `waxing`, `lash-services`, `makeup`, `permanent-jewelry`, `enhancements-add-ons`.
  (Or drop the enum and rely purely on `serviceCollection` references — cleaner.)
- `service.provider` (ref) already exists — populate every service with its GG provider.
- `service.status` has `actual-menu` — use it to mark GG-confirmed services vs `proposed` (BioRePeel/body you'll add).
- **Packages:** your sheet says create the **3- and 6-treatment bundles** as packages — that's the existing
  `treatmentPackage` type; the empty Sanity packages get priced from the master-menu Series-of-3/6 once the base
  services are set.

---

## 8. Next step
Approve the collection set (and the §4 Diana decision), and I'll apply it in Sanity **as drafts** (create the new
collections, create the 9 basic facials + lash services, reassign every service's collection + provider, reprice
to GG, and remove `acne-peel`/`back-treatment`) — then hand you a publish checklist. Nothing goes live until you publish.
