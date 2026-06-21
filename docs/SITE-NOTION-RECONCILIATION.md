# Site ↔ Notion Reconciliation Review
*2026-06-21 · Notion = source of truth · Sanity (`4e7axyi7`/production) = CMS feeding houseofrosefl.com · Brand standard = v1.0 (Advanced Aesthetics, full destination, "Where beauty blooms within").*

## ✅ P0 EXECUTED (2026-06-21) — pending deploy
- **Signature names LIVE in Sanity** for 7 services: The Porcelain Petal (Dermaplaning), The Lumière
  (Glo2Facial), The Camellia Peel (BioRePeel), The Gilded Lily (PRF Skin Texture), The Clarity Session
  (Face Reality), The Evergreen (PRF Under-Eye), Forever Rose (Permanent Jewelry).
- **Frontend wired** to lead with the signature name + technical name as subtitle: `queries.ts`
  (interface + `ALL_SERVICES_QUERY` + `SERVICE_BY_SLUG_QUERY`), `ServiceCard.astro`,
  `services/index.astro`, `services/[slug].astro`.
- **Off-brand syringe imagery detached** (reversible): Injectables collection hero (syringe flat-lay)
  + Botox service (gloved hand + syringe).
- **Deploy needed:** static site rebuilds at build time — push the repo changes / trigger a Netlify
  build to see it live. Remaining charcoal-toned (non-syringe) images left in place pending the
  dark-theme decision (see note below).

> **Bigger imagery finding:** the whole site runs on a **dark charcoal theme** (`charcoal`,
> `text-white`), which is the real source of the "coffin" feel — more than any single photo. A true
> on-brand pass = re-theme to the warm ivory/greige/burgundy v1.0 palette + a founding photo shoot.

*Original review below — P1/P2 items not yet actioned.*

## TL;DR
The site is **well-populated and largely aligned** with Notion — 28 services, 14 memberships, 4 providers, ~26 products, and pricing mostly already in "From $X" form. The gaps are **consistency, not coverage** — and there is **one brand-critical issue**: the live imagery is the old "luxury medical / clinical / syringe" direction that v1.0 explicitly retired.

---

## P0 — Brand-critical (fix first)

### 1. Live imagery contradicts the v1.0 brand
10 of 14 image assets in Sanity are the **old direction** — filenames/alt text read *"Luxury-medical-aesthetics,"* *"dark charcoal,"* *"gloved provider's hand holding a fine syringe,"* *"clinical setting."* This is exactly the **clinical / coffin / self-proclaimed-luxury / syringe-hero** look the Photography guide (02-04) and Positioning keystone forbid, and it skews injectable-led rather than full-house.
**Action:** replace with warm, editorial, natural-light imagery (ivory/greige/burgundy, all five lanes, no syringe heroes). Until a founding shoot exists, pull only frames that pass the Photography Do/Don't. *This is the single biggest gap between the site and v1.0.*

### 2. Signature (botanical) naming layer is missing on the site
Notion source of truth names services as **botanical signatures** with the technical name as subtitle — *The Porcelain Petal* (Dermaplaning), *The Lumière* (Glo2Facial), *The Gilded Lily* (PRF Microchanneling), *The Camellia Peel* (BioRePeel), *The Clarity Session*. Sanity uses the **generic technical names** only ("Glo2Facial by Geneo," "BioRePeel," "Dermaplaning"…).
**Action:** decide the convention (recommend: signature name as title, technical as subtitle/`alternateName` for SEO) and apply. This is a core differentiator ("botanical luxury; Rose reserved for the brand") that the live site currently drops.

---

## P1 — Data accuracy

### 3. Services with no price showing (null)
These render with no "From $X": **Botox & Neurotoxins**, **Injectables & Bio-Fillers** (generic), **Wellness** (generic), **PRF — Platelet-Rich Fibrin** (generic), **Microchanneling & Microneedling** (generic).
**Action:** add "From $X" (e.g., Botox "From $15/unit" per plan, or a per-area "From"), or convert the generic category-as-service entries (see #4).

### 4. Stale / duplicate / category-as-service entries in Sanity (not in Notion source of truth)
Sanity has service docs that don't exist in the Notion Services DB and look like older drafts or category placeholders:
- Generic placeholders: **"PRF — Platelet-Rich Fibrin," "Microchanneling & Microneedling," "Injectables & Bio-Fillers," "Wellness"** (these duplicate real, specific services).
- Extra acne/peel entries: **"Back Treatment — Acne & Texture," "Acne Peel," "The Clarity Bootcamp — 12-Week," "BioRePeel Duo — Gold Spot," "BioRePeel Advanced — Acne Scarring," "BioRePeel Body — Stretch Marks."**
**Action:** reconcile against Notion — keep what maps to a real source-of-truth row, fold the rest into the correct service (e.g., body/scar protocols as variants of PRF Body / Camellia), and retire the generic category-as-service docs so each lane has clean, non-overlapping entries.

### 5. Price values to verify against Notion rack
- **Glo2Facial** site "From $225" vs Notion *Lumière* rack **$199** — mismatch.
- Spot-check others against the MASTER menu (most match: ProCell $399, Dermaplaning $135, Camellia/BioRePeel $295, PRF Microchanneling $650).
**Action:** confirm each "From" = the Notion **rack** price (the published-rate convention), and decide whether founding intro rates surface anywhere.

### 6. Missing from the site vs Notion (intentional? confirm)
Notion source of truth includes services not visible in the published Sanity service list: **Event & Bridal Makeup**, **Exosome Infusion** (add-on), **Peptide Therapy** (proposed), **PRF Hair Restoration** is present ✓. Brandy's lane (Classic Facial, Hydrodermabrasion, Facial+Peel, Mommy & Me) is **Parked** in Notion — correctly excluded.
**Action:** confirm Makeup/Exosome/Peptide are deliberately held; if not, add them.

---

## P2 — Normalization / polish

### 7. Lane labels are inconsistent
Mixed Title Case and slugs: **"Injectables & Aesthetics"** (Sanity) vs **"Injectables & Bio-Fillers"** (Notion); **"beauty-enhancements"** (slug) vs **"Beauty & Enhancements"**; "Skin Renewal" and "Wellness & Restoration" are consistent.
**Action:** normalize to one canonical set of five lane labels (match Notion: Skin Renewal · Injectables & Bio-Fillers · Wellness & Restoration · Beauty & Enhancements · + Regeneration as needed) and use slugs only in routing.

### 8. Service imagery coverage
Only 4 of 28 services have an image (and those are the off-brand ones). Most cards will render imageless.
**Action:** part of the founding shoot (#1) — one warm hero per service.

---

## What's already aligned (no action)
- **Memberships/plans:** Lily (Essentials/Signature/Regenerative), Iris (I/II/III), Hydrangea rider, House Collective, the three Regeneration Plans (Renewal/Regeneration/Restoration), and Smooth Ritual waxing tiers — all present and matching the Notion architecture. ✓
- **Providers:** Amber, Diana, Brooke, Brandy. ✓
- **Retail "Ritual" line + pro lines:** Calm/Clear/Daily/Shield/Smooth Ritual + GlyMed+/Skin Script/ProCell aftercare. ✓
- **Pricing format:** majority already "From $X." ✓

---

## Recommended order of operations
1. **P0 #1 imagery** — swap the clinical/charcoal/syringe assets for warm, on-brand, full-house imagery (biggest brand fix).
2. **P0 #2 naming** — apply the botanical signature-name convention.
3. **P1 #3–#6** — fill null prices, reconcile stale/duplicate services, verify rack prices.
4. **P2 #7–#8** — normalize lane labels, add per-service imagery.

> Nothing here is changed yet. Say the word and I'll execute any tier — starting with the imagery + naming (P0), which is what actually makes the live site read as House of Rose v1.0.
