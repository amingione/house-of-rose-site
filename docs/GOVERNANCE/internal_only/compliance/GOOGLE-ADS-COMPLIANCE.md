# House of Rose — Google Ads: How Not To Get Suspended

> Practical guide. Google Ads suspension is a **different risk** from Florida board discipline — different
> rulebook, different enforcer, different consequences. This file covers only Google. Florida rules live in
> this directory's `README.md` and `COMPLIANCE-COPY-RULES.md`.
>
> Verified 2026-07-26 against Google's published advertising policies.

---

## ⚠️ Correction — an earlier version of this file had this backwards

The first draft told you not to write "Botox" in ad copy, and that bidding the keyword was fine. **That is
the reverse of Google's actual policy in the United States.** Corrected below against the policy page
itself, read directly on 2026-07-26.

---

## The rule, straight from Google

[Google Ads — Restricted drug terms](https://support.google.com/adspolicy/answer/15595717), section
*"Campaigns targeting Canada, New Zealand, or United States"*, quoted verbatim:

> "You may use prescription drug terms for promotional purposes, in accordance with local laws and
> regulations. This includes content promoting the branding, use, sale, and distribution of prescription
> drugs.
>
> While you **don't need to be certified in order to use prescription drug terms in ads and landing
> pages**, you **must be certified in order to keyword-target these terms**. Certification is also
> required for certain business types, like online pharmacies, telemedicine providers, and pharmaceutical
> manufacturers."

So, for a US-targeted campaign:

| | Prescription drug terms — Botox, Daxxify, Juvéderm, Sculptra, semaglutide… |
|---|---|
| **Ad headlines & descriptions** | ✅ **Allowed. No certification.** |
| **Landing pages** | ✅ **Allowed. No certification.** |
| **Keywords you bid on** | ❌ **Certification required.** |
| **Advertiser-curated audiences** (customer match, remarketing lists, lookalikes) | ❌ Certification required — see below |

**You were right and I was wrong.** You can say Botox in the ad. What you can't do is *bid* on it.

### Two opposite rules — this is the trap

They pull in opposite directions, which is exactly why this is easy to get wrong:

| Term | Bid on it? | Write it in copy? | Why |
|---|---|---|---|
| **`dermatologist`** | ✅ Yes | ❌ **Never** | Florida R. 64B8-11.001(2)(k) — implies a specialty not held |
| **`Botox`** | ❌ **Not without certification** | ✅ Yes | Google Restricted drug terms — cert gates *keyword targeting*, not copy |

Bid derm, don't write it. Write Botox, don't bid it.

### The audience-targeting piece most people miss

[Restricted drug terms in personalized advertising](https://support.google.com/adspolicy/answer/16701653):
prescription-medication content is a **sensitive interest category**, so **advertiser-curated audiences** —
customer match lists, your own data segments, lookalikes, audience expansion — are restricted for that
content. Since 1 July 2025, US/Canada/NZ advertisers using personalized targeting need the **Restricted
Drug Term Personalization Certification**.

**Predefined Google audiences are fine** — in-market segments, affinity, demographics. So: no uploading
your client list to build a lookalike for an injectables campaign without that certification. Plain geo +
demographic targeting is unaffected.

### So what do you actually do?

**Option A — write the brand names, bid generic terms. No certification, launch today.**
Put "Botox" and "Juvéderm" in headlines and on the landing page where they help you convert. Bid on
`wrinkle treatment punta gorda`, `injectables punta gorda`, `med spa punta gorda`, `sun damage treatment
punta gorda`. **Negative-keyword the prescription brand terms** so phrase match can't drift you into
targeting them uncertified.

**Option B — get certified, then bid the brand terms too.** LegitScript accreditation (~$495 to apply,
~$1,950–$2,950/yr) plus Google healthcare certification, 4–8 weeks. Worth it only if brand-term volume
justifies it. At ~100/mo for "botox punta gorda," **it probably doesn't yet.** Revisit if you scale.

**Start with A.** It's free, it's immediate, and it keeps your strongest converting words in the ad where
customers actually read them.

### Florida still governs *what you say* about them

Google permitting the word is not the end of it. This directory's `README.md` and
`COMPLIANCE-COPY-RULES.md` still apply to the claims around it — no guarantees, no "permanent," no
uniform-result promises, provider attribution present. And **Botox® is Allergan's registered trademark**:
Google's trademark policy generally permits authorized-provider use, but confirm your provider agreement
covers ad-copy use before running it, since Allergan does enforce.

---

## The other suspension triggers, in order of how often they bite

| # | Trigger | Fix |
|---|---|---|
| 1 | **Bidding** prescription drug terms without certification | Negative-keyword them; bid generic terms instead. Copy and landing pages are fine uncertified — see above |
| 2 | **A sitelink or CTA that goes nowhere** — Google's Misrepresentation policy, and it can suspend outright | Click every sitelink before launch. Never promise a page that doesn't exist yet (this is why the "Our Pricing" sitelink can't ship until the pricing page does) |
| 3 | **Unsubstantiated claims** — "eliminate wrinkles," "permanent," "guaranteed results," "reverse aging" | Use "designed to," "supports," "helps improve the appearance of." Your own `COMPLIANCE-COPY-RULES.md` §2 already bans these — same list works here |
| 4 | **Before/after imagery** in ads or extensions | Don't run it. Also an FTC problem (`AD-COMPLIANCE-RUNBOOK.md` §3) — a disclaimer does not fix it |
| 5 | **Implying a credential you don't hold** — "dermatologist," "skin doctor," "medical clinic," "board certified" | Never in copy. See below on the keyword-vs-copy line |
| 6 | **Health-condition targeting** — Google's personalized advertising policy prohibits targeting users by inferred medical condition | Don't build audiences around conditions (acne, hair loss, obesity). Geo + demographic only |
| 7 | Landing page mismatch — ad promises something the page doesn't deliver | Ad message and page headline should obviously correspond |
| 8 | Automated features generating copy you never wrote | DKI off, automatically created assets off — `AD-COMPLIANCE-RUNBOOK.md` §2.1 |

### GLP-1 / weight loss — same rule, extra scrutiny

Semaglutide, tirzepatide and their brand names are prescription drug terms, so the same US rule applies:
**nameable in ads and landing pages, not bid-able without certification.**

Weight-loss advertising does draw heavier scrutiny than aesthetics generally — outcome claims,
before/afters and anything resembling a health promise are where disapprovals cluster. Keep that copy
strictly factual and make no outcome claims. **Run it as its own campaign** so a disapproval there doesn't
sit next to everything else in the account.

### The `dermatologist` keyword — bid it, never type it

Bidding on `dermatologist port charlotte` as a **keyword** is defensible. Putting "dermatologist" in
**ad copy** is not — under Florida R. 64B8-11.001(2)(k) it implies a specialty not held, and under Google's
Misrepresentation policy it misdescribes the business. Keep the wall absolute.

This is the mirror image of the Botox rule, and the published policy is unambiguous on both. Google's
Restricted drug terms page states the keyword-targeting certification requirement flatly, with no
exception for in-person clinics — **"you must be certified in order to keyword-target these terms"** —
so an uncertified med spa bidding `botox punta gorda` is targeting terms it isn't certified for. Don't.

---

## Policy-safe campaign setup

The controls below address restricted terms and campaign settings. They do not authorize campaign
voice, headlines, descriptions, or treatment claims. Use current reviewed campaign assets and
landing-page facts, then apply these controls before launch.

**Ad group: Skin & sun damage** — phrase/exact keywords. **No prescription drug terms in the keyword
list** — that is the part requiring certification. Brand names may appear in the *copy* if you want them.

```
"sun damage treatment punta gorda"      "skin resurfacing punta gorda"
"age spots treatment punta gorda"       "chemical peel punta gorda"
"microneedling punta gorda"             "facial punta gorda"
"skin analysis punta gorda"             "med spa punta gorda"
"medical spa punta gorda"               "aesthetics punta gorda"
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

- [ ] **No prescription drug term in the KEYWORD list** — copy and landing pages are fine uncertified
- [ ] Prescription brand terms added as **negatives** so phrase match can't drift into targeting them
- [ ] No customer-match, lookalike or remarketing audience layered on prescription-drug content without the Restricted Drug Term Personalization certification
- [ ] Every sitelink and CTA resolves to a real page
- [ ] No "dermatologist," "skin doctor," "medical clinic," "board certified" anywhere in copy
- [ ] No "guaranteed," "permanent," "eliminate," "reverse aging"
- [ ] No before/after imagery in any asset
- [ ] DKI off · automatically created assets off · auto-apply off
- [ ] Provider callout present
- [ ] No free, discounted, or credited service offer unless the exact approved § 456.062 disclosure appears in both the ad unit and landing page

### Florida offer check

The current `/skin-analysis/` page and Q3 Google ad copy carry no free, discounted, or credited service
offer. Do not add one from this guide. A future offer requires the exact approved § 456.062 disclosure
in the ad unit itself and on the landing page.

This is a Florida requirement rather than a Google Ads certification rule. Follow the current compliance
README and primary law; this guide does not supply or authorize disclosure text.

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
