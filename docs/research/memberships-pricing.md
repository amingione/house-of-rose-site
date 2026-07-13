# Membership Pricing — Derived Recommendation (GlossGenius-anchored)

**Date:** 2026-07-13 · **Status:** recommendation for Amber to confirm — not final published pricing.
**Source of truth:** the live **GlossGenius catalog** (`docs/glossgenius_catalog.csv`, provided by Amber
2026-07-13). GlossGenius is where services + payments actually live; local docs and Sanity are staging/display
and are **superseded by GlossGenius wherever they differ** (they differ a lot — see `_pricing-catalog.md`).
**Rule honored:** every fee below is a **real GlossGenius price**, or a cadence of one — nothing invented, nothing from the web.

---

## 1. What the GlossGenius catalog changed

Reconciling to the live catalog moved three things that reshape membership pricing:

1. **Brandy's basic-facials lane is priced after all** — GlossGenius has a full "Facials" ladder (9 services,
   **$80–$200**). The "entry tier is blocked" problem is **gone**; the entry tier now derives cleanly.
2. **No packages/series and no memberships exist in GlossGenius yet** — so the earlier "$147.50 = your
   Series-of-6 committed rate" story had no real basis (those series prices were local-doc-only). Anchors now
   come from **GlossGenius single-service prices**.
3. **Glo2Facial is $195** (not $185), waxing/makeup are cheaper than the local docs, and **there is no
   Brazilian** in GlossGenius — so the old "$65 = Brazilian" wax anchor is retired.

**The model is unchanged:** a flat monthly fee, banked 1:1 as rollover credit (if GlossGenius supports a member
credit balance) *or* delivered as one included service per month (GlossGenius-native fallback), plus a small
bonus welcome credit + perks as the join incentive — never a "% off / deal." Memberships run **in GlossGenius**,
not our checkout; the `/memberships/` page markets and links clients to join.

---

## 2. Real GlossGenius anchors (every fee derives from these)

| Lane (GG category) | Anchor service | GG price | Membership use |
| --- | --- | --- | --- |
| Facials (Brandy) | Signature Rose Facial (30m) | **$80** | entry facial-of-the-month |
| Facials (Brandy) | Lunch Time Glow (30m) | $100 | entry alt |
| Facials (Brandy) | Signature Facial (45m) / Luxe Rose (1h) | **$120** | standard facial-of-the-month |
| Facials (Brandy) | Skin Reset (50m) | $140 | standard+ |
| Facials (Brandy) | Sculpt & Lift (1h) / Luxury Facial (1h15) | $180 / $200 | premium facial |
| Advanced Facials (Amber) | **Glo2Facial (1h)** | **$195** | advanced facial-of-the-month |
| Advanced Facials (Amber) | Glo2 + ProCell MD / GlowTox | $475 | high-end (occasional, not monthly) |
| Microchanneling (Amber) | ProCell MD Microchanneling | $349 | corrective cadence |
| Skin Renewal (Amber) | PRF Skin Renewal | $450 | regenerative (occasional) |
| Wellness (Diana) | Wellness drip (Recovery/Beauty Glow/Reboot) | **$185** | IV-of-the-month |
| Wellness (Diana) | Hydration IV | $100 | IV entry |
| GLP-1 (Diana) | Semaglutide / Tirzepatide | **$225 / $325 per month** | already monthly (own program) |
| Waxing (Aundrea) | Full Leg $65 · Bikini Line $30 · Underarm $20 (no Brazilian) | $20–$65 | wax credit (see §5) |
| Permanent Jewelry / Lash / Makeup | $65 / $25–$85 / $30–$175 | — | occasional, not monthly |

---

## 3. UPDATE (2026-07-13) — facials membership shelved; REAL tier numbers surfaced

Two changes from Amber + Diana's reconciliation sheet:

- **Facials membership is REMOVED for now** ("not ready for it," per `ALL-SERVICES-PRICING.MD`). The
  Facial-of-the-Month tiers in §4 are **parked**, not launching.
- **🔑 Real membership tiers found:** both of Diana's own menus agree exactly on **Essentials $99/mo ·
  Radiance $199/mo · Luxe $299/mo** (`Diana_Pricing_Reconciliation.xlsx`, "BONUS FINDING"). These are the
  actual intended tiers — they **replace the placeholder pricing** in the site membership rebuild. Confirm what
  each tier *includes* (they read as whole-studio/wellness tiers, not facial-only) and I'll wire $99/$199/$299
  into the Sanity draft tiers + the `/memberships/` page.

Current live membership scope per Amber: **IV Membership** (IV Hydration lane) + **Weight Management** (GLP-1,
already monthly). The §4 facial tiers stay documented below for when that membership is ready.

---

## 4. Facial-of-the-Month tiers (all = real GG facial prices)

| Tier | Monthly fee (= GG price) | Member gets each month | Suggested welcome bonus | Notes |
| --- | --- | --- | --- | --- |
| **Essential** | **$80–$100/mo** (Signature Rose Facial $80 / Lunch Time Glow $100) | one 30-min facial (or bank the value) | +$20 credit | lowest barrier; Brandy's lane |
| **Signature (recommended · featured)** | **$120/mo** (Signature Facial / Luxe Rose Facial) | one signature facial (or bank) | +$30 credit | the everyday-glow sweet spot |
| **Advanced (Glo2)** | **$195/mo** (Glo2Facial) | one Glo2Facial (or bank toward advanced) | +$40 credit | Amber's lane; premium |

Bank-vs-included: if GlossGenius supports a **member credit balance**, bank the fee 1:1 (rollover, no expiry on
paid credit — see §7) so a member who skips a month accrues toward a bigger treatment. If it only supports
**included services**, deliver one facial/month + let unused months convert to a small credit or a guest pass.

---

## 5. Optional lane add-on memberships (real GG anchors)

| Membership | Monthly fee (= GG price) | Covers | Note |
| --- | --- | --- | --- |
| **IV Wellness** | **$185/mo** (Recovery / Beauty Glow / Reboot drip) | one wellness drip/month | cleanest 1:1; Diana's lane |
| **Wax** | anchor to a real cadence — **Full Leg $65** or a bundle of the smaller waxes | wax credit toward regular upkeep | weaker without a Brazilian; consider folding into whole-studio credit instead of a standalone tier |
| **GLP-1** | already **$225 (semaglutide) / $325 (tirzepatide) per month** | the monthly program itself | already functions as a membership — cross-link, don't rebuild as credit |

Injectables recur ~quarterly (Botox $14/unit), so they fit whole-studio credit or a prepaid-units benefit, not a monthly tier.

---

## 6. Blockers — mostly cleared

| Item | Old status | Now (per GlossGenius) |
| --- | --- | --- |
| Basic-facials lane | hard blocker (unpriced) | **RESOLVED** — priced $80–$200 in GG |
| Wax anchor | Brazilian $65 | **changed** — no Brazilian in GG; re-anchor (Full Leg $65 or bundle) |
| Glo2Facial price | $185 (local) | **$195** (GG) |
| Series/committed-rate anchors | assumed from local docs | **gone** — GG has no packages/series; use single-service prices |
| Carboxy, BioRePeel, corrective microneedling, ProCell Pro tier, Face Reality bootcamp | assumed bookable | **NOT in GlossGenius** — see §8; can't anchor a tier on a service that isn't bookable |

---

## 7. Constraints (unchanged)

- **Memberships run in GlossGenius** (services + payments live there); the website page is display + join link.
  Confirm whether GG supports a **banked/rollover credit balance**; if not, use its **included-service** membership model.
- **Paid credit should not expire** (Fla. Stat. § 501.95 likely bars expiry/fees on paid stored value) —
  **confirm with FL counsel**; only granted *bonus* credit may expire.
- Margin comes from the **menu-vs-cost spread + retail attach + breakage**, not from banking less than paid —
  **confirm cost-to-deliver** per facial so the fee clears the margin floor.

---

## 8. ⚠️ Bigger issue this surfaced — GlossGenius vs the website menu diverge

Amber's canonical taxonomy (`_service-taxonomy.md`) largely answers the earlier "is the site aspirational?"
question: services like BioRePeel, ProCell PRO/MD, PRF Topical, and the whole advanced-facial **body** lane are
**intended** — they're just **not entered in GlossGenius yet** (GG is incomplete, not the site over-promising).
So the fix is to **add the intended services to GlossGenius** (with prices), not trim the site. Only two things
appear in *neither* the taxonomy nor GG — **carboxy facial** and the **Face Reality Acne** program (bootcamp/
peel/back-treatment; GG's "Acne Bootcamp" category has 0 services) — so **confirm whether those are dropped or
still pending.** Membership tiers can only bundle what's actually in GlossGenius, so until Amber's advanced-facial
menu is entered there, the reliable membership anchors are the **basic-facial ladder + Glo2Facial + IV** (all live in GG).

---

## 9. Owner decision checklist

- ☐ **Pick facial tiers** (§4) — confirm the 2–3 fees off the GG ladder (Essential / Signature / Advanced).
- ☐ **Bank vs included** — check whether GlossGenius supports a member credit balance; pick the model.
- ☐ **Welcome-bonus credit** amount + expiry (paid credit must not expire; bonus may).
- ☐ **Wax membership** — keep as a standalone (anchor?) or fold wax into whole-studio credit.
- ☐ **Confirm cost-to-deliver** per facial so fees clear the margin floor.
- ☐ **FL counsel** on Fla. Stat. § 501.95 before selling stored-value credit.
- ☐ **BIG ONE (§8):** decide whether GlossGenius or the website is the intended menu, and reconcile the two.

Once you pick, I'll set the Sanity display tiers to the real GG-anchored fees, revise the `/memberships/` page
cards, and add the "join via GlossGenius" path.

## Sources
- `docs/glossgenius_catalog.csv` — live GlossGenius catalog (SOURCE OF TRUTH, 2026-07-13).
- `docs/research/_pricing-catalog.md` — reconciliation of GG vs local docs vs Sanity.
- `docs/research/memberships-economics.md` — membership model/structure (banking, FL § 501.95, billing rails).
- `docs/research/memberships.md` — reinstatement brief + owner decision checklist.
