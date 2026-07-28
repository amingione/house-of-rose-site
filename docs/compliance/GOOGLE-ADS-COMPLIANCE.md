# House of Rose — Google Ads: How Not To Get Suspended

> Practical guide. Google Ads suspension is a **different risk** from Florida board discipline — different
> rulebook, different enforcer, different consequences. This file covers only Google. Florida rules live in
> `FL-ADVERTISING-LAW.md`.
>
> Verified 2026-07-26 against Google's published advertising policies.

---

## The one rule that prevents ~90% of med spa suspensions

**Never write a prescription product name in ad copy, keywords, or on the landing page your ads point to.**

Google's Healthcare and medicines policy restricts prescription drug terminology in ads and landing pages,
and gates it behind certification. Med spas get disapproved and then suspended for exactly one thing more
than any other: typing "Botox" into an ad.

| ❌ Never in ads or on ad landing pages | ✅ Use instead |
|---|---|
| Botox, Dysport, Daxxify, Xeomin, Jeuveau | wrinkle relaxers · neuromodulator treatments · injectable treatments for lines |
| Juvéderm, Restylane, RHA, Sculptra, Radiesse | dermal fillers · injectable volume treatments |
| Semaglutide, tirzepatide, Ozempic, Wegovy, Mounjaro, Zepbound | *(see the GLP-1 warning below — don't advertise this at all for now)* |
| Kybella, Latisse | *(prescription — same rule)* |

**This applies to the landing page too, not just the ad.** Google crawls the destination. An ad that says
"injectable treatments" pointing at a page that says "Botox $12/unit" fails on the landing page.

### 🚨 GLO-1 / weight-loss: keep it entirely out of Google Ads for now

The GLP-1 programme is the single highest suspension risk on the menu — prescription weight-loss drugs are
among the most aggressively enforced categories Google has. **Do not advertise it, do not bid on it, and do
not point any ad at a page that names those drugs.** If a landing page mentions the programme in a sidebar
or nav, use a different landing page for ads.

### If you want to say "Botox" in ads

That is the certification path, and it is real but slow:

1. **LegitScript certification** — roughly $495 to apply plus $1,950–$2,950/year.
2. **Google Ads healthcare certification**, which follows the LegitScript accreditation.
3. Budget **8–10 weeks** before launch.

Worth it only if brand-name search volume justifies it. Given the local volume (~100/mo for
"botox punta gorda"), **it almost certainly does not right now.** Run generic-term ads instead.

---

## The other suspension triggers, in order of how often they bite

| # | Trigger | Fix |
|---|---|---|
| 1 | Prescription product names in copy, keywords or landing page | Above |
| 2 | **A sitelink or CTA that goes nowhere** — Google's Misrepresentation policy, and it can suspend outright | Click every sitelink before launch. Never promise a page that doesn't exist yet (this is why the "Our Pricing" sitelink can't ship until the pricing page does) |
| 3 | **Unsubstantiated claims** — "eliminate wrinkles," "permanent," "guaranteed results," "reverse aging" | Use "designed to," "supports," "helps improve the appearance of." Your own `COMPLIANCE-COPY-RULES.md` §2 already bans these — same list works here |
| 4 | **Before/after imagery** in ads or extensions | Don't run it. Also an FTC problem (`FL-ADVERTISING-LAW.md` §1.6) — a disclaimer does not fix it |
| 5 | **Implying a credential you don't hold** — "dermatologist," "skin doctor," "medical clinic," "board certified" | Never in copy. See below on the keyword-vs-copy line |
| 6 | **Health-condition targeting** — Google's personalized advertising policy prohibits targeting users by inferred medical condition | Don't build audiences around conditions (acne, hair loss, obesity). Geo + demographic only |
| 7 | Landing page mismatch — ad promises something the page doesn't deliver | Ad message and page headline should obviously correspond |
| 8 | Automated features generating copy you never wrote | DKI off, automatically created assets off — `AD-COMPLIANCE-RUNBOOK.md` §2.1 |

### The `dermatologist` keyword — bid it, never type it

Bidding on `dermatologist port charlotte` as a **keyword** is defensible. Putting "dermatologist" in
**ad copy** is not — under Florida R. 64B8-11.001(2)(k) it implies a specialty not held, and under Google's
Misrepresentation policy it misdescribes the business. Keep the wall absolute.

⚠️ **Verify in-account before relying on prescription-brand keywords.** Google's October 2025 update
tightened keyword targeting of prescription drug terms, gating it behind healthcare certification in the
US. Whether that reaches an in-person med spa bidding "botox punta gorda" is not clear from the published
policy. **Test with a small budget and be ready to pull those keywords.** Generic-term keywords carry no
such question.

---

## A starter ad you can actually run

Safe by construction: no prescription names, no credential implication, no free/discounted offer (so no
§ 456.062 block is needed in the ad), no claims requiring substantiation.

**Ad group: Skin & sun damage** — phrase/exact keywords, no prescription terms:

```
"sun damage treatment punta gorda"      "skin resurfacing punta gorda"
"age spots treatment punta gorda"       "chemical peel punta gorda"
"microneedling punta gorda"             "facial punta gorda"
"skin analysis punta gorda"             "med spa punta gorda"
"medical spa punta gorda"               "aesthetics punta gorda"
```

**Headlines (15):**

```
Sun Damage & Age Spots          Punta Gorda Skin Studio
Advanced Skin Treatments        See Your Skin First
Skin Analysis & Imaging         Texture, Tone & Pigment
A Plan Built For Your Skin      Microneedling & Peels
House of Rose Aesthetics        Walk-Ins Welcome
Punta Gorda, FL                 Book A Skin Analysis
Provider-Led Consultations      Florida Sun Damage Care
Advanced Aesthetics & Wellness
```

**Descriptions (4):**

```
Skin imaging and a provider review, so your plan is built around what your skin is actually showing.
Texture, tone, pigment and sun damage — addressed in sequence, not sold from a menu.
Advanced aesthetics and wellness in Punta Gorda. Walk-ins welcome; appointments recommended.
Candidacy is determined by your provider at consultation. Not every client is a candidate.
```

**Callout extensions:**

```
Medical Director: Joshua Shaw, MD · FL Lic. ME136232
Skin Imaging & Analysis
Walk-Ins Welcome
Punta Gorda, FL
```

**Sitelinks** — only ones whose pages exist today. Verify each before launch. Do **not** add a pricing
sitelink until a pricing page exists.

**Negative keywords:**

```
-botox -dysport -daxxify -xeomin -jeuveau -juvederm -restylane -sculptra -filler
-semaglutide -ozempic -wegovy -tirzepatide -glp1 -glp-1 -weight loss
-free -cheap -groupon -coupon -deal -discount -jobs -hiring -salary -school -training
-certification -course -classes -diy -at home -lawsuit -gone wrong -botched -side effects
-fort myers -naples -sarasota -cape coral -venice -tampa -massage -nails -hair -tanning
```

Note the first two lines: negativing your own prescription brand terms keeps a broad or phrase match from
dragging you into a category you aren't certified for.

**Settings:** Location = *Presence: people in your targeted locations.* Phrase/exact match only. DKI off.
Automatically created assets off. Auto-apply recommendations off.

---

## Before you press go

- [ ] No prescription product name in any headline, description, keyword, extension, or on the landing page
- [ ] Landing page does not mention GLP-1 / weight-loss drugs anywhere visible
- [ ] Every sitelink and CTA resolves to a real page
- [ ] No "dermatologist," "skin doctor," "medical clinic," "board certified" anywhere in copy
- [ ] No "guaranteed," "permanent," "eliminate," "reverse aging"
- [ ] No before/after imagery in any asset
- [ ] DKI off · automatically created assets off · auto-apply off
- [ ] Provider callout present
- [ ] **Landing page § 456.062 issue resolved** — see below

### The one Florida item that touches this ad

If your ad points at `/skin-analysis/`, that page currently advertises a **"Complimentary"** consultation,
which triggers Fla. Stat. § 456.062 and needs the 72-hour disclosure block. Two ways to close it — either
is fine:

- **Add the block** to the page (`FL-ADVERTISING-LAW.md` §5.1 — one component, ready to paste), or
- **Remove the word "Complimentary"** from the page, which removes the trigger.

This is a Florida requirement, not a Google one — Google will not suspend you for it. But it is one small
edit and it is the last thing standing between the page and a clean ad.

---

## If you do get suspended

1. **Don't create a new account.** Circumventing a suspension is what turns a fixable disapproval into a permanent ban.
2. Read the specific policy cited in the notice — it names one.
3. Fix the copy *and* the landing page, then appeal from within the account.
4. Most first-time healthcare disapprovals resolve on appeal once the offending term is gone.

---

## Sources

- [Google Ads — Healthcare and medicines policy](https://support.google.com/adspolicy/answer/176031)
- [Google Ads — Prescription drug services](https://support.google.com/adspolicy/answer/15598647)
- [Google Ads — Pharmaceutical manufacturers](https://support.google.com/adspolicy/answer/15597836)
- [Search Engine Land — Google loosens prescription drug term restrictions for non-promotional use (Oct 2025)](https://searchengineland.com/google-certification-prescription-drug-advertising-463409)

---

| Date | Change |
|---|---|
| 2026-07-26 | Created. Practical Google-suspension guidance separated from the Florida statutory layer, with a paste-ready compliant starter ad. |
