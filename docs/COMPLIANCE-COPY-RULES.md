# House of Rose — Compliance Copy Rules

> **This is binding infrastructure.** Every agent or person who writes or edits customer-facing
> copy for House of Rose — website pages, Sanity content, social blurbs, email, ads — MUST follow
> these rules. It is referenced from `AGENTS.md` and sits alongside `docs/SEO-AEO-PLAYBOOK.md`
> (strategy) and `docs/CONTENT-MODEL-MAP.md` (wiring), so it is inherited automatically by any
> content task. The voice notes in `marketing/regeneration-plans.md` §8 are the same spirit — this
> file is the enforceable, structured version: **what we never say, what we say instead, and why.**

---

## 1. Why this exists

House of Rose packages its services into **plans, a client affiliation, and recurring
memberships** — *Regeneration Plans* (the Rose Method™ ladder), *The Rose Circle* (the direct
client affiliation that unlocks the fully immersive, provider-guided experience — **not** a
membership), and recurring *memberships* (Rose Pass, IV Hydration Membership, Rose Collagen Bank)
— rather than à-la-carte facials.
Productizing aesthetics raises the compliance stakes: the more we describe outcomes, sequences, and
"transformation," the easier it is to drift into language Florida regulators, the FTC, and the
brand itself prohibit.

House of Rose is a **private, appointment-only aesthetics & wellness studio in Punta Gorda, FL**.
It is **not** a "med spa," and copy must never imply it diagnoses, treats, or cures any medical
condition. Advanced/clinical treatments are delivered under the appropriate licensed provider and
medical-director oversight — that authority lives with the *provider*, never with the marketing
copy. When in doubt, defer to the provider and say less.

These rules are conservative by design. If a phrase is borderline, **don't use it.**

---

## 2. The bar — what we never say (and what we say instead)

Each row is a hard avoid. The "Say instead" column is the approved, compliance-safe alternative.

| ❌ Never say | Why it's a problem | ✅ Say instead |
| --- | --- | --- |
| "med spa," "medspa," "medical spa," "clinic" (describing House of Rose) | FL med-spa regulation + brand positioning; implies a medical practice we don't hold out as | "advanced aesthetics & wellness studio," "private studio," "by appointment" |
| "reverse aging," "anti-aging," "turn back the clock," "age-defying" | Implies a result skin biology can't deliver; unprovable claim | "supports skin longevity," "helps reveal healthier-looking skin," "age-*affirming* / regenerative care" |
| "guaranteed," "guaranteed results," "permanent," "will eliminate / erase / cure" | Outcome guarantee; individual results vary and are never assured | "designed to," "supports," "helps," "many clients notice," "intended to" |
| "stem cell" / "stem-cell therapy" (as a treatment we provide or a claim) | Unapproved/overstated regenerative claim; regulatory minefield | Name the actual service (e.g. "PRF," "ProCell microchanneling") and describe it factually |
| "exosome" / "peptide" therapeutic claims that aren't substantiated | Unsupported efficacy claims on emerging actives | Describe the product/ingredient neutrally; make no healing/efficacy promise |
| "treats," "cures," "heals," "fixes" + a condition (acne, rosacea, eczema, scarring, hair loss, disease) | Medical-treatment / disease claim; we are not a medical practice in our copy | "for the appearance of," "helps improve the look of," "supports the skin's…," "may help with the visible signs of" |
| "Groupon," "deal," "discount," "% off," "sale," "coupon," "lowest price," "cheap" | Off-brand and erodes premium positioning; the brand is "a destination, never a deal" | "investment," "from," "starting at," "founding-member rate," "member access," "curated" |
| "FDA-approved" / "clinically proven" (unless citing a specific, verifiable clearance/study) | Unverifiable or misattributed authority claim | State what the treatment *is* and *does* in plain terms; cite only what's real |
| Uniform before/after promises ("you will look like…") | Implies a guaranteed, universal outcome | "individual results vary," show consented, honest case studies only |

> The avoid-list mirrors LWB-11's brief: reverse-aging, guaranteed results, stem-cell claims,
> cure/treat-disease language, Groupon-style discounting, and unsupported exosome/peptide claims —
> and never calling House of Rose a "med spa."

---

## 3. Required guardrails — what every plan/treatment surface must carry

Whenever copy *sells* a plan, package, membership, or advanced treatment, it must include:

1. **Provider authority.** Final treatment combinations, dosing, intervals, and suitability are
   determined by the licensed provider at consultation — not promised in marketing.
   *Canonical line (already used site-wide):* "Final treatment combinations and candidacy are
   confirmed by your licensed provider based on candidacy, contraindications, and local
   regulations." (see `treatmentPackage.candidacyNote`).
2. **Candidacy is real.** "Not every client is a candidate for every service." State it wherever a
   plan is sold (`/plans`, `/packages`, `/memberships`, `/rose-circle`).
3. **Individual outcomes.** "Outcomes are individual and depend on your skin, candidacy, and
   consistency." Case studies render only with `consentGiven == true`.
4. **Pricing as investment.** Always "investment," "from," or "starting at"; monthly options framed
   as *support for consistency*, never financing pressure or a discount.

---

## 4. Approved vocabulary (the safe palette)

Reach for these first. They carry the brand's calm, regenerative, honest voice without claiming a
medical result:

- **Outcome-leaning:** "designed to," "supports," "helps reveal," "intended to," "many clients
  notice," "for the appearance of," "the visible signs of."
- **Positioning:** "regenerative," "skin longevity," "skin health," "natural-looking results,"
  "advanced aesthetics & wellness," "personalized," "unhurried," "curated," "guided plan."
- **Structure (the differentiator):** "Skin transforms through timing, consistency, and structure,"
  "sequenced," "phased," "a plan, not a punch card."
- **Membership framing:** "access," "priority booking," "member pricing," "curated credits,"
  "belonging," "continuity" — **never** "discount club."

Brand voice in one line: *confident, not loud; specific over superlative; sensory but disciplined.*
(See also the brand-voice guidance in `llms.txt` / `llms-full.txt`.)

---

## 5. Pre-publish checklist (compliance)

Before publishing or editing any customer-facing copy, confirm:

- [ ] House of Rose is never called a "med spa" / "medical spa" / "clinic."
- [ ] No guarantees, no "permanent," no "reverse aging" / "anti-aging."
- [ ] No "treats / cures / heals" + a medical condition.
- [ ] No stem-cell / unsupported exosome / unsupported peptide efficacy claims.
- [ ] No Groupon / discount / "% off" language; pricing is "investment / from / starting at."
- [ ] Provider-authority + candidacy + individual-outcomes language is present where a plan/treatment is sold.
- [ ] Before/after only with written consent (`caseStudy.consentGiven == true`).
- [ ] Claims of authority ("FDA-approved," "clinically proven") are removed unless specifically verifiable.

When a phrase is borderline, choose the more conservative wording or omit it. Compliance outranks
copy polish, every time.

---

## 6. Related

- `docs/SEO-AEO-PLAYBOOK.md` — content strategy, the 7 page types, the publish checklist.
- `docs/CONTENT-MODEL-MAP.md` — page type → Sanity doc → route → JSON-LD → GROQ.
- `marketing/regeneration-plans.md` §8 — the originating voice & compliance notes for the plans/membership architecture.
- Schemas that encode these guardrails: `treatmentPackage` (`candidacyNote`, `outcome`),
  `membership`, `caseStudy` (`consentGiven`).
