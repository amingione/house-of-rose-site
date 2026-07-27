# House of Rose — Florida Advertising Law: Legal-Readiness Framework

> **Status: FRAMEWORK — not a launch authorization.** This file resolves the seven-item adversarial
> compliance audit into verified authority, required text, and named owners. It is the statutory layer.
> It does **not** clear any campaign to spend money. Nothing here is legal advice; item 7 (attorney
> review) is a real, unclosed gate.
>
> **Verified:** 2026-07-26 against primary sources (Florida Senate statute text — 2024 and 2025
> editions confirmed identical for every passage quoted here; 2025 is current — Cornell LII /
> Justia for the Florida Administrative Code, eCFR for 16 CFR § 255). Every quote below carries its
> source. **Independently re-verified the same day by a second adversarial pass**, which confirmed the
> § 456.062 statement as a byte-exact 349-character match, confirmed § 464.0123 and § 400.9935(6) in
> full, and **corrected one citation error and surfaced one missed exposure** — see §7.

---

## 0. How this file relates to the rest

Two compliance instruments, deliberately separate. Do not merge them and do not duplicate content
between them.

| File | Governs | Question it answers |
|---|---|---|
| `docs/staff/COMPLIANCE-COPY-RULES.md` | Voice, claims, banned phrases | *"Am I allowed to say this?"* |
| **`docs/compliance/FL-ADVERTISING-LAW.md`** (this file) | Statutes, rules, disclosures, licensure, attribution | *"What does Florida law require me to include, hold, or hold back?"* |
| `docs/compliance/CONSULTATION-FEE-POLICY.md` | The consultation fee, credit and refund terms | *"What exactly did we promise about money?"* |
| `docs/compliance/AD-COMPLIANCE-RUNBOOK.md` | Pre-launch gate, platform lockdown, retention, reviews | *"What do I do, in what order, before and after publishing?"* |

A copy rule can be broken and cost you a customer. A rule in *this* file can be broken and cost you a
license. When they conflict, this file wins.

### Verification convention used throughout

| Mark | Meaning |
|---|---|
| ✅ **VERBATIM** | Quoted word-for-word from the cited primary source on 2026-07-26. |
| ⚠️ **IN SUBSTANCE** | Two independent sources agree on the effect; exact wording not captured. Confirm against the official text before relying on it in a filing. |
| 🔴 **OPEN** | Requires a fact from Amber, the medical director, or counsel. Cannot be closed by research. |

---

## 1. Verified authority

### 1.1 Fla. Stat. § 456.062 — free / discounted / reduced-fee advertising

✅ **VERBATIM** — [Florida Senate, 2024 Statutes § 456.062](https://www.flsenate.gov/Laws/Statutes/2024/0456.062):

> "456.062 Advertisement by a health care practitioner of free or discounted services; required
> statement.—In any advertisement for a free, discounted fee, or reduced fee service, examination, or
> treatment by a health care practitioner licensed under chapter 458, chapter 459, chapter 460, chapter
> 461, chapter 462, chapter 463, chapter 464, chapter 465, chapter 466, chapter 467, chapter 478,
> chapter 483, part I of chapter 484, chapter 486, chapter 490, or chapter 491, the following statement
> shall appear in capital letters clearly distinguishable from the rest of the text: THE PATIENT AND ANY
> OTHER PERSON RESPONSIBLE FOR PAYMENT HAS A RIGHT TO REFUSE TO PAY, CANCEL PAYMENT, OR BE REIMBURSED
> FOR PAYMENT FOR ANY OTHER SERVICE, EXAMINATION, OR TREATMENT THAT IS PERFORMED AS A RESULT OF AND
> WITHIN 72 HOURS OF RESPONDING TO THE ADVERTISEMENT FOR THE FREE, DISCOUNTED FEE, OR REDUCED FEE
> SERVICE, EXAMINATION, OR TREATMENT. However, the required statement shall not be necessary as an
> accompaniment to an advertisement of a licensed health care practitioner defined by this section if
> the advertisement appears in a classified directory the primary purpose of which is to provide
> products and services at free, reduced, or discounted prices to consumers and in which the statement
> prominently appears in at least one place."

**Three corrections to the audit's framing of this item.**

1. **The audit says it applies to "ch. 458 (MD/DO) and ch. 464 (RN/APRN)."** Imprecise. Chapter 458 is
   medical practice (**MD**); chapter 459 is osteopathic medicine (**DO**). Both are in the list, along
   with 464 (nursing). All three are in scope here. Cite 458 **and** 459.
2. **The audit says "already built into the landing page."** It is not. See §4.1 — this is a live
   finding, not a launch item.
3. **The audit says "confirm with counsel whether ad-level placement is also required."** Too soft. The
   statute reads *"In any advertisement."* Rule 64B8-11.001(3) defines an advertisement as any
   statement disseminated to the public to sell professional services — a Meta ad, a Google responsive
   search ad, a Reel, a Story, a GBP post and an email each qualify independently. **The operating rule
   is therefore: if the ad unit itself communicates a free, discounted or reduced-fee service, the
   disclosure goes in that unit.** Where a format cannot carry it, the compliant answer is to keep the
   free/discounted offer out of that format — not to omit the disclosure. Counsel can confirm; the
   default is include-or-omit-the-offer, not publish-and-hope.

**What triggers it here.** Both live and proposed structures trigger it:

| Structure | Trigger | Basis |
|---|---|---|
| Consultation advertised as **complimentary** (current live copy) | ✅ Yes | "free … service, examination, or treatment" — squarely within the plain text |
| Consultation advertised at a **fee credited toward treatment** | ✅ Yes, treat as triggered | "discounted fee, or reduced fee" — the net price of the assessment is reduced to near zero for a buyer who proceeds. Strongly arguable; do not litigate this over a disclosure that costs one paragraph |
| Consultation at a **fixed, non-credited, non-discounted fee** | Likely no | No free/discounted/reduced element. Confirm with counsel before removing the block |

**Format requirement:** capital letters, *clearly distinguishable from the rest of the text.* Note
honestly what the statute does **not** impose: **no point size and no boldface requirement.** The styling
guidance at §5.1 is therefore prudence, not statutory command — but "clearly distinguishable" does mean
visually distinct, and small grey caps buried in a footer is a weak position to defend.

**Whose licence triggers it:** the statute keys to the licensure of the *practitioner* whose services are
advertised. **Chapter 477 (cosmetology / facial specialist — estheticians) is not on the list.** So an ad
for esthetician-only services arguably falls outside § 456.062, while an ad naming or promoting the
APRN's, RN's or physician's services is squarely inside it. In practice House of Rose advertises across
both, so treat the block as required and do not build a campaign on that distinction.

**What the statute does *not* say:** it does not require the block twice, nor adjacent to the offer, nor
adjacent to the CTA. Placing it at both the offer and the conversion point is defensive best practice —
adopt it, but know it is prudence, not statutory command, so nobody later "discovers" the second
placement is unnecessary and deletes the first one too.

### 1.2 Fla. Stat. § 456.072(1)(t) — license type wherever a practitioner is named

✅ **VERBATIM** — [Florida Senate, 2024 Statutes § 456.072](https://www.flsenate.gov/Laws/Statutes/2024/0456.072):

> "Failing to identify through written notice, which may include the wearing of a name tag, or orally
> to a patient the type of license under which the practitioner is practicing. Any advertisement for
> health care services naming the practitioner must identify the type of license the practitioner
> holds. This paragraph does not apply to a practitioner while the practitioner is providing services
> in a facility licensed under chapter 394, chapter 395, chapter 400, or chapter 429. Each board, or
> the department where there is no board, is authorized by rule to determine how its practitioners may
> comply with this disclosure requirement."

This is a **discipline ground**, not a guideline. "Aesthetic Injector," "Skin Specialist," "Provider"
and "Injector" are job titles and satisfy nothing. The license type is the credential as issued —
**MD**, **DO**, **APRN**, **RN**.

⚠️ **Scope note worth getting right:** § 456.072 reaches *health care practitioners* regulated under
chapter 456. A **licensed esthetician** is licensed by DBPR under chapter 477 and is not a ch. 456
health care practitioner, so this paragraph does not reach an esthetician-only credential. If the same
person also holds a nursing license and is named in a health care advertisement, it does reach the
nursing credential. Amber holds an esthetician credential and (per `CLAUDE.md`) an RN-assistant role —
🔴 **OPEN:** confirm which licenses she actually holds before naming her in any health care ad, and name
the license type that matches the capacity she is being named in.

### 1.3 Fla. Admin. Code R. 64B8-11.001 — Board of Medicine advertising rule

Sources: [Cornell LII](https://www.law.cornell.edu/regulations/florida/Fla-Admin-Code-Ann-R-64B8-11-001) ·
[Justia](https://regulations.justia.com/states/florida/64/64b8/chapter-64b8-11/section-64b8-11-001/)

| Subsection | Effect | Mark |
|---|---|---|
| (2)(a) | Advertising that "contains a misrepresentation of facts" is deceptive/misleading | ✅ VERBATIM |
| (2)(d) | Contains representations or claims the physician "does not expect to perform" | ✅ VERBATIM |
| (2)(g) | Represents services "can or will be competently performed for a stated fee when this is not the case" — **and** requires disclosure of all variables and material factors affecting the actual fee charged | ⚠️ IN SUBSTANCE (first clause verbatim; the "all variables" clause confirmed by two sources — confirm exact wording against the official FAC text) |
| (2)(i) | "Fails to conspicuously identify the physician by name in the advertisement" | ✅ VERBATIM |
| (2)(k) | "Implies specialty or sub-specialty for which the physician has not received specialty recognition" | ✅ VERBATIM |
| (3) | "Advertisement"/"advertising" = any statement, oral or written, disseminated to or before the public with the intent of furthering the purpose of selling professional services | ✅ VERBATIM |
| (4) | Physicians using electronic media must maintain and preserve an exact copy of audio/video advertisements **for at least six months from the date the advertisement is aired** | ✅ VERBATIM |
| (5) | The physician remains responsible for advertising used to solicit patients, including advertising placed through agents and corporate entities | ✅ VERBATIM |

**Why this rule binds House of Rose at all.** It is a Board of *Medicine* rule and attaches to
physicians. It reaches this practice through the **assigned medical director** — subsection (5) makes
that physician responsible for advertising placed by the entity and its agents. Practically: the
medical director carries the regulatory risk for ad copy he may never have read. Which is precisely why
items 2, 6 and 7 exist.

🔴 **OPEN:** the Board of Nursing maintains its own advertising provisions for ch. 464 licensees.
Chapter 456 provisions (§§ 456.062, 456.072) bind all licensees regardless of board. Confirm with
counsel which nursing-board rules apply to an APRN-owned practice so the framework is complete on both
boards, not just Medicine.

### 1.4 Fla. Stat. § 400.9905 / § 400.9935 — health care clinic licensure

✅ **VERBATIM** — § 400.9905(4), [FindLaw](https://codes.findlaw.com/fl/title-xxix-public-health/fl-st-sect-400-9905.html):

> "'Clinic' means an entity where health care services are provided to individuals and which tenders
> charges for reimbursement for such services, including a mobile clinic and a portable equipment
> provider."

✅ **VERBATIM** — § 400.9905(4)(g), [Florida Senate, 2025 Statutes](https://www.flsenate.gov/Laws/Statutes/2025/400.9905):

> "(g) A sole proprietorship, group practice, partnership, or corporation that provides health care
> services by licensed health care practitioners under chapter 457, chapter 458, chapter 459, chapter
> 460, chapter 461, chapter 462, chapter 463, chapter 466, chapter 467, chapter 480, chapter 484,
> chapter 486, chapter 490, chapter 491, or part I, part III, part X, part XIII, or part XIV of chapter
> 468, **or s. 464.012**, and that is wholly owned by one or more licensed health care practitioners,
> or the licensed health care practitioners set forth in this paragraph and the spouse, parent, child,
> or sibling of a licensed health care practitioner if one of the owners who is a licensed health care
> practitioner is supervising the business activities and is legally responsible for the entity's
> compliance with all federal and state laws. However, a health care practitioner may not supervise
> services beyond the scope of the practitioner's license, except that, for the purposes of this part,
> a clinic owned by a licensee in s. 456.053(3)(b) which provides only services authorized pursuant to
> s. 456.053(3)(b) may be supervised by a licensee specified in s. 456.053(3)(b)."

**Read that enumeration carefully — it is closed, and it is narrower than it looks.**

1. **It reaches nursing only through `s. 464.012`, not "chapter 464."** § 464.012 is the APRN section.
   So an **APRN owner qualifies**; a plain **RN or LPN owner does not** — even though § 456.001(4)
   defines "health care practitioner" broadly enough to include them. **Do not reason from
   § 456.001(4) here.** § 400.9905 contains no definition of "health care practitioner" and never
   cites § 456.001; paragraph (4)(g) carries its own list, and that list governs. Citing the general
   definition over-includes and produces a false exemption conclusion.
2. **Chapter 477 is not on the list.** Estheticians and facial specialists are licensed under chapter
   477 by DBPR. An esthetician is therefore **not a qualifying owner under (4)(g)** — and is not a
   "health care practitioner" under § 456.001(4) either. See §3, item 3, Catch 1: this is the live
   licensure question for this practice, not a footnote.
3. **The scope limiter is real:** "a health care practitioner may not supervise services beyond the
   scope of the practitioner's license." An APRN owner supervising the business does not thereby
   acquire supervisory authority over services outside APRN scope.

✅ **VERBATIM** — § 400.9935(4)(a)2, [Florida Senate, 2024 Statutes](https://www.flsenate.gov/Laws/Statutes/2024/0400.9935) — a third-degree felony to:

> "Offer[] or advertise[] services that require licensure as a clinic under this part or part II of
> chapter 408 without a license."

✅ **VERBATIM** — § 400.9935(6), [Florida Senate, 2025 Statutes](https://www.flsenate.gov/Laws/Statutes/2025/400.9935):

> "(6) Any person or entity providing health care services which is not a clinic, as defined under s.
> 400.9905, **may voluntarily apply for a certificate of exemption** from licensure under its exempt
> status with the agency on a form that sets forth its name or names and addresses, a statement of the
> reasons why it cannot be defined as a clinic, and other information deemed necessary by the agency.
> **An exemption may be valid for up to 2 years and is not transferable.** The agency may charge an
> applicant for a certificate of exemption in an amount equal to $100 or the actual cost of processing
> the certificate, whichever is less. **An entity seeking a certificate of exemption must publish and
> maintain a schedule of charges for the medical services offered to patients. The schedule must
> include the prices charged to an uninsured person paying for such services by cash, check, credit
> card, or debit card.** The schedule must be posted in a conspicuous place in the reception area of
> the entity and must include, but is not limited to, the 50 services most frequently provided by the
> entity. The schedule may group services by three price levels, listing services in each price level.
> **The posting must be at least 15 square feet in size.** As a condition precedent to receiving a
> certificate of exemption, an applicant must provide to the agency documentation of compliance with
> these requirements."

**The fee-schedule posting is a condition precedent to the exemption certificate — not a borrowed
licensure condition.** And note the scale of it: the **50 most frequently provided services**, with
uninsured cash prices, posted **on a sign of at least 15 square feet** in the reception area. That is
roughly 4 ft × 4 ft. Read §3, item 3, Catch 3 before deciding to apply.

AHCA publishes the form: [Application for Certificate of Exemption from Licensure as a Health Care Clinic,
AHCA Form 3110-0014](https://flrules.org/gateway/readRefFile.asp?refId=16431&filename=Health_Care_Clinic_Exemptions_Application_AHCA_Form_3110-0014_August2023.pdf).
See also [Kubicki Draper's guide to the Health Care Clinic Act](https://www.kubickidraper.com/a-users-guide-to-the-florida-health-care-clinic-act-florida-statute-%C2%A7%C2%A7-400-990-to-400-995/).

### 1.5 Fla. Stat. § 464.0123 — APRN autonomous practice is primary care only

✅ **VERBATIM** — [Florida Senate, 2024 Statutes § 464.0123](https://www.flsenate.gov/Laws/Statutes/2024/0464.0123) — an autonomous APRN may:

> "Engage in autonomous practice only in primary care practice, including family medicine, general
> pediatrics, and general internal medicine"

and

> "may not perform any surgical procedure other than a subcutaneous procedure."

And the lawful path is in the adjacent section. ✅ **VERBATIM** —
[§ 464.012(3)](https://www.flsenate.gov/Laws/Statutes/2025/464.012):

> "A practitioner currently licensed under chapter 458, chapter 459, or chapter 466 shall maintain
> supervision for directing the specific course of medical treatment."

with authorized APRN functions performed "within the framework of an established protocol … unless the
advanced practice registered nurse is registered and practicing under s. 464.0123."

**The audit missed this entirely, and it is the most consequential item in the file.** Aesthetic
medicine is not primary care, and Board of Nursing rule 64B9-4.001 defines primary care in
disease-and-health terms that do not reach elective cosmetic enhancement. So:

- **Precise statement:** autonomous registration under § 464.0123 does **not** authorize aesthetics.
- **What does:** an established written protocol with a supervising ch. 458/459 physician under
  § 464.012(3) — the assigned medical director.
- **What is wrong to say:** "an APRN cannot perform aesthetics." She can — under protocol. Get this
  phrasing right; overstating the limit is its own misrepresentation.

The protocol — not the ad copy — is the foundation everything else rests on. See item 3 in §3.

### 1.6 16 CFR § 255 — FTC Endorsement Guides (2023 revision)

Source: [eCFR, 16 CFR Part 255](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255) ·
[FTC final notice](https://www.ftc.gov/system/files/ftc_gov/pdf/p204500_endorsement_guides_in_2023.pdf)

| Provision | Effect | Mark |
|---|---|---|
| § 255.2(c) | Advertisements representing "actual consumers" should use actual consumers, or clearly disclose that the persons depicted are not actual users | ✅ VERBATIM |
| § 255.2(e)(6) | Using stock imagery in place of actual endorsers misrepresents results where the depicted improvement does not match what was actually achieved | ✅ VERBATIM |
| § 255.2(e)(11) | **Selectively inviting only satisfied customers to post reviews** while merely thanking less-pleased customers "may be an unfair or deceptive practice" where it skews posted reviews substantially more positive than they otherwise would be | ✅ VERBATIM |
| § 255.5(a) | A connection between endorser and seller that might materially affect the weight or credibility of the endorsement "must be disclosed clearly and conspicuously" — including free or discounted products | ✅ VERBATIM |

Confirmed: the 2023 revision withdrew reliance on a bare "results not typical" disclaimer as a cure for
a deceptive typicality implication. **Consequence: a before/after disclaimer is not a fix.** Either the
depicted result is representative of what clients generally achieve, or the ad is deceptive regardless
of what the small print says.

---

## 2. House of Rose's actual structure, as it bears on all of this

Stated by Amber, 2026-07-26: **owned by a registered nurse practitioner**; **medical director assigned
through Guardian**; the medical director is the named responsible provider for advertising attribution.

| Question | Reading | Confidence |
|---|---|---|
| Is the APRN owner a qualifying owner under § 400.9905(4)(g)? | **Yes** — (4)(g) enumerates `s. 464.012`, the APRN section. **Cite s. 464.012, not § 456.001(4) and not "chapter 464"** — a plain RN or LPN owner would **not** qualify | High |
| Is an **esthetician** a qualifying owner under (4)(g)? | **No.** Chapter 477 is absent from (4)(g)'s closed list, and an esthetician is not a "health care practitioner" under § 456.001(4) either | High |
| Does (g) exempt the practice from clinic licensure? | Yes **if** wholly owned by qualifying licensee(s), a licensee-owner supervises business activities and is legally responsible for compliance, and no non-qualifying owner (including an esthetician) holds equity | Medium — fact-dependent, and turns on who actually holds equity |
| Does § 400.9935(4)(a)2 felony exposure attach? | Not if (g) holds — services then don't require clinic licensure. But (g) is an affirmative, fact-dependent position | Medium |
| Can the APRN practice aesthetics autonomously? | **No.** § 464.0123 limits autonomous practice to primary care | High |
| What makes the aesthetic practice lawful, then? | A current written supervising-physician protocol under § 464.012 — the Guardian medical director | High |
| Who carries advertising risk under 64B8-11.001(5)? | **Joshua Shaw, MD** — FL license **ME136232**, assigned through Guardian Medical Direction | High — identity verified, see §5.4 |
| Is he a dermatologist? | **No.** His NPI primary taxonomy is **Surgery** (208600000X). Nothing in the campaign may imply dermatology | High |

**Read that table together and the shape of the risk is clear.** Clinic licensure is probably fine. The
thing actually holding the practice up is a **written physician protocol** — and the thing actually
exposed by bad ad copy is a **physician who did not write it**. Every remaining item flows from those
two facts.

---

## 3. The seven items, resolved

### Item 1 — § 456.062 72-hour disclosure · 🟡 TEXT READY, PLACEMENT OPEN

**Verified text:** §1.1. **Required text block:** §5.1. **Placement matrix:** §5.3.

- Owner: Amber (site + ad build), medical director (approval), counsel (confirm trigger + adequacy).
- The audit's "already built into the landing page" is **wrong** — see §4.1.
- Ad-level placement is required wherever the ad unit itself carries the free/discounted offer. Not optional. See §1.1.
- Do not paraphrase, abbreviate, sentence-case or translate the block. It is a verbatim statutory string.

### Item 2 — Conspicuous provider identification · 🟢 IDENTITY VERIFIED — ONE CONSENT OUTSTANDING

Two separate obligations, routinely collapsed into one. They are not the same:

| Obligation | Source | What satisfies it |
|---|---|---|
| Name the **physician** conspicuously in the ad | R. 64B8-11.001(2)(i) | The medical director's name, in the ad, conspicuously |
| State the **license type** of any named practitioner | § 456.072(1)(t) | MD / DO / APRN / RN — as issued |

**Resolved 2026-07-26.** The medical director is **Joshua Shaw, MD**, Florida license **ME136232**,
assigned through Guardian Medical Direction. Identity and credential independently verified — see §5.4.
The attribution line is now fillable and appears at §5.2.

🔴 **Still open — two consents and two facts:**

1. **Naming rights — check the Guardian agreement first, don't chase a signature.** Being named as
   medical director is standard to the engagement, so the Guardian Medical Direction agreement very
   likely already grants it. Read that clause before asking Dr. Shaw for anything. Only if it is silent
   does this need a separate written consent. What does still matter independently is gate G16 — his
   review of the *clinical claims* in the copy, since R. 64B8-11.001(5) puts that risk on him.
2. Whether **Diana** holds RN or APRN, and which licenses **Amber** holds — each drives the license type
   under § 456.072(1)(t) wherever they are named, and Amber's licensure also drives the § 400.9905(4)(g)
   equity question at item 3.

### Item 3 — AHCA clinic licensure · 🟢 LIKELY EXEMPT, TWO REAL CATCHES

Analysis: §2. This item is in much better shape than the audit assumed — an APRN owner very likely lands
inside the § 400.9905(4)(g) exemption, which means the § 400.9935(4)(a)2 felony framing, while correctly
stated, probably does not bite. **Do not treat that as closed, for two reasons.**

**Catch 1 — 🔴 who actually holds equity? An esthetician owner defeats the exemption.**
This is the real open question and it was not in the audit. § 400.9905(4)(g)'s list of qualifying owners
**omits chapter 477**, where estheticians and facial specialists are licensed. It reaches nursing only
through `s. 464.012` (APRN) — so an APRN owner qualifies and a plain RN owner does not. The exemption
requires the entity be **wholly owned** by qualifying licensees (plus the named relatives).

Per `CLAUDE.md`, Amber is an **esthetician + RN assistant**. Amber states the business is **owned by a
registered nurse practitioner**. Those two facts need reconciling on paper before anyone relies on (g):

- The registering legal entity is **House of Rose LLC** (per `docs/compliance/grasshopper-toll-free-guidelines.md`). For an LLC the question is **membership interests** — who are the members, and in what percentages?
- Does any esthetician-only or RN-only licensee hold **any** equity, including a minority or silent interest?
- Is the APRN owner the one supervising business activities and legally responsible for compliance?
- Do any owners fall inside the spouse/parent/child/sibling allowance rather than qualifying directly?

If an esthetician holds equity, (g) is unavailable and the § 400.9935(4)(a)2 advertising-felony analysis
comes back into play. **Do not assume this is fine because an APRN is involved.** Resolve it with counsel
and the cap table, in writing, before spend.

**Catch 2 — the exemption is a position you must be able to defend in writing, before you spend.**
Document the basis: equity composition per Catch 1; licensee-owner supervision and legal responsibility;
services rendered by licensed practitioners within scope (noting (4)(g)'s own limiter — "a health care
practitioner may not supervise services beyond the scope of the practitioner's license"). Get counsel's
written opinion and keep it with this file. An undocumented exemption is not a defense, it is a hope.

**Catch 3 — the certificate of exemption requires a 15-square-foot price list in your reception area.**
This one is sharper than it first appears, and it collides head-on with your competitive-confidentiality
decision to strip published pricing. Per § 400.9935(6), **as a condition precedent** to the certificate,
the applicant must publish and maintain a schedule of charges including **uninsured cash/check/card
prices**, covering at least the **50 most frequently provided services**, posted conspicuously in the
reception area on a sign of **at least 15 square feet** (~4 ft × 4 ft).

So the trade is concrete: the certificate buys documented proof of exempt status; the price of it is a
four-foot price board facing every client and every competitor who walks in. **The exemption does not
depend on holding the certificate** — the certificate is evidence of the exemption, not its source. That
makes this a deliberate business call: take the documentation benefit and post the board, or rely on a
well-documented counsel opinion instead. Decide it on purpose; do not let it be decided by whoever fills
in the form.

🔴 **OPEN:** equity composition (Catch 1); counsel opinion on (g) applicability; certificate decision.

### Item 4 — Refund and fee policy in writing · 🟢 DRAFTED

Full policy: **`docs/compliance/CONSULTATION-FEE-POLICY.md`**.

The audit named the real hazard precisely: copy that promises to tell people *"you're not a candidate"*
next to a fee described as *non-refundable, no cash value* is a complaint generator, because the client
who is turned away paid for a service and received a refusal. R. 64B8-11.001(2)(g) compounds it by
requiring disclosure of all variables affecting the actual fee. The policy therefore enumerates every
variable — the not-a-candidate case, credit expiry, combinability, transferability, no-show and
cancellation — and is written **offer-agnostic** so it holds whether the consultation is complimentary or
carries a credited fee.

🔴 **OPEN:** Amber sets the actual figures and windows; medical director and counsel countersign.

### Item 5 — The "AI" claim · 🟢 SUBSTANTIATED, WITH LIMITS

**Verdict: "AI" is defensible here.** It is not an inflated capability claim, for two independent
reasons:

1. **It is the device's proper product name.** The studio uses the **M17 AI Skin Analyzer** — the
   manufacturer's own product name. Naming the device you use is not a capability claim.
2. **The device performs software-driven analysis, not just capture.** Per `docs/research/ai-skin-analysis.md`
   and `docs/services/features/multi-imaging-skinAnalysis.md`: multi-spectral capture (RGB, cross-polarized,
   UV), software that organizes captures into concern-grouped metrics, 3D facial mapping with localized
   zoom, baseline-vs-follow-up comparison imaging, and predictive age-trend visualization. That is
   analysis, not conventional photography.

**So the audit's conditional resolves in your favor — but the limit is strict.** What is defensible is
*"AI skin analysis"* as the name of an imaging-and-analysis step. What is not defensible, and stays
banned:

- ❌ "diagnoses," "detects disease," "detects/screens for skin cancer or melanoma"
- ❌ "medical imaging," "medical-grade diagnostic," "clinical diagnosis"
- ❌ "FDA-approved," "FDA-cleared," "clinically proven" — not verified for this device
- ❌ **Any specific indicator or dimension count.** The source material flags that public seller pages
  disagree with each other ("18 analysis images" vs "18+5+1 dimensions"). Say *"multiple skin concerns
  across multiple imaging modes."* A number you cannot source is a § 64B8-11.001(2)(a) misrepresentation
  and a 16 CFR § 255 substantiation problem at once.
- ❌ "AI decides / AI recommends your treatment." The provider reviews and decides. The imaging informs.

**Substantiation record** (keep dated, produce on request):
`docs/services/features/multi-imaging-skinAnalysis.md`,
`docs/services/features/house_of_rose_m17_ai_skin_analyzer_20260701_025924.pdf`, and the peer-reviewed
mechanism review at [PMC10988667](https://pmc.ncbi.nlm.nih.gov/articles/PMC10988667/) for the light-mode
claims. Re-verify against the studio's own M17 manual before publishing any new capability claim.

⚠️ One honest caveat to hold: that review documents real confounders — makeup, sunscreen residue and
surface contaminants fluoresce under UV; hair interferes with wrinkle detection; diffuse redness resists
automatic segmentation. This is exactly why "provider-reviewed" is not marketing softness but the
accurate description of how the output is used. Keep it.

### Item 6 — Platform automation lockdown · 🟢 SPECIFIED

Settings, verification steps and audit cadence: **`docs/compliance/AD-COMPLIANCE-RUNBOOK.md` §2.**

The audit is right that Dynamic Keyword Insertion and automatically created assets will manufacture a
dermatology credential claim from a `dermatologist` keyword bid, and right that R. 64B8-11.001(5) means
"Google generated it" is not a defense. **The audit stops one platform short:** Meta's Advantage+
creative enhancements and automatic text variations rewrite primary text and headlines with the same
unreviewed-output problem. Both platforms get locked down, not just Google.

### Item 7 — Provider and attorney review · 🔴 OPEN — HARD GATE

Sign-off block: **`docs/compliance/AD-COMPLIANCE-RUNBOOK.md` §5.**

Nothing in this framework substitutes for it. Two reviewers, both named, both dated: the **medical
director** (who carries 64B8-11.001(5) risk) and a **Florida healthcare attorney** (for the § 400.9905(4)(g)
exemption position, the § 456.062 trigger, and the 16 CFR § 255 image-sourcing and endorsement exposure).

**Scope the attorney's engagement explicitly** so you get answers to the questions that are actually
open, rather than a general review:

1. Does § 400.9905(4)(g) exempt this entity? Should we file for the certificate of exemption given the fee-schedule posting condition?
2. Is the § 464.012 supervising-physician protocol current and does it cover every advertised service?
3. Does § 456.062 attach to a credited-consultation structure, and is ad-level placement required in every format?
4. Which Board of Nursing advertising rules apply alongside 64B8-11.001?
5. Is the consultation fee policy sufficient under 64B8-11.001(2)(g)?
6. Image sourcing and endorsement exposure under 16 CFR § 255 for model, client and before/after imagery.

---

## 4. Live findings — exposure that exists right now

These are not launch items. They are true of the published site today.

### 4.1 🔴 The live landing page advertises a free consultation with no § 456.062 disclosure

`packages/web/src/pages/skin-analysis.astro` — line 343 renders:

```
Complimentary · By appointment · Punta Gorda
```

There is no § 456.062 block anywhere in the file (verified 2026-07-26: no match for `72`, `refuse to
pay`, `cancel payment`, or `reimbursed`). **"Complimentary" is the statute's first listed trigger.** The
audit recorded this item as "already built into the landing page"; it is not built anywhere. This is
live exposure, and it does not depend on any campaign launching.

**Fix:** insert the §5.1 block per the §5.3 placement matrix. Highest priority item in this file.

### 4.2 🔴 "By appointment" on the same line contradicts the binding walk-in policy

Same line 343. `CLAUDE.md`'s Walk-In Policy (binding, 2026-07-24) prohibits "by appointment only" or any
framing that forecloses walk-ins, and `COMPLIANCE-COPY-RULES.md` §2 lists it as a hard avoid. Correct
pattern: *"Walk-ins welcome — appointments recommended."*

### 4.3 🟡 `COMPLIANCE-COPY-RULES.md` contradicts itself and `CLAUDE.md` — corrected

Two drift bugs found and fixed in this pass:

- **§1 described the studio as "private, appointment-only,"** while §2 of the same file bans exactly that
  phrase. Self-contradictory, and wrong against the binding walk-in policy. Corrected.
- **§2's "Say instead" column recommended "founding-member rate" and "member access,"** which
  `CLAUDE.md` prohibits outright ("Never add membership UI, schema, tiers, or 'member rate' framing
  anywhere"). A banned concept was sitting in the *approved* column of the binding copy file — the
  single most likely way memberships get reintroduced by a future session. Corrected.
- **§1's parenthetical said memberships were "deferred post-launch."** `CLAUDE.md` is unambiguous: not
  offered, none planned, permanently dead unless Amber revives them. "Deferred" invites revival.
  Corrected.

### 4.4 🟡 The Drive strategy doc conflicts with binding repo rules

`houseofroseadcampaign.md` (Google Drive) was written without `CLAUDE.md` loaded. Independent of the
seven audit items, it contains:

| Conflict | Binding rule |
|---|---|
| Offer named **"The Rose Reading"** | `CLAUDE.md` naming law — plain, technical, searchable names only; no invented or "signature" names |
| Programme named **"The Season Plan"** | Same |
| "What to build next: **The membership**" | `CLAUDE.md` — memberships permanently dead; never add tiers or member-rate framing |
| **"Pricing in the Open"** pillar, published-pricing headlines, sitelink and Concept C v2 | Superseded by Amber's competitive-confidentiality decision; prices were removed from Sanity 2026-07-24 and cost guides are dollar-free |

Per Amber's instruction this pass is legalities only, so **no copy was rewritten.** Logged here so it
is not mistaken for cleared material later.

### 4.5 🟡 Keep the strategy document out of the shipping path

The audit's final checklist item is correct: the Drive doc names ten competitors and characterizes their
conduct ("borrowed luxury, from a landlord," "trained 565 Groupon customers to wait for a deal," "dead
address"). Reasonable internal analysis; a liability in anything client-facing.

`docs/` sits outside `packages/web/`, so it is not deployed and does not feed `llms.txt` — but the
cleanest posture is to **leave the strategy document in Drive and never commit it.** If it must enter
the repo, it goes to `docs/competitor_analysis/` with a "CONFIDENTIAL — internal, not for distribution"
header, never alongside shipping copy.

---

## 5. Required text and placement

### 5.1 The § 456.062 disclosure block — verbatim, do not edit

**Plain text** (for ad primary text, email, print, GBP posts):

```
THE PATIENT AND ANY OTHER PERSON RESPONSIBLE FOR PAYMENT HAS A RIGHT TO REFUSE TO PAY, CANCEL PAYMENT,
OR BE REIMBURSED FOR PAYMENT FOR ANY OTHER SERVICE, EXAMINATION, OR TREATMENT THAT IS PERFORMED AS A
RESULT OF AND WITHIN 72 HOURS OF RESPONDING TO THE ADVERTISEMENT FOR THE FREE, DISCOUNTED FEE, OR
REDUCED FEE SERVICE, EXAMINATION, OR TREATMENT.
```

**Astro / HTML** — styled to satisfy "capital letters clearly distinguishable from the rest of the text."
`uppercase` is applied *and* the source text is already capitalised, so the requirement survives a CSS
failure:

```astro
<aside
  class="my-8 border-2 border-ink/25 bg-ink/[0.03] px-5 py-4"
  role="note"
  aria-label="Florida Statute 456.062 required statement"
>
  <p class="text-[13px] font-semibold uppercase leading-[1.6] tracking-[0.02em] text-ink">
    THE PATIENT AND ANY OTHER PERSON RESPONSIBLE FOR PAYMENT HAS A RIGHT TO REFUSE TO PAY, CANCEL
    PAYMENT, OR BE REIMBURSED FOR PAYMENT FOR ANY OTHER SERVICE, EXAMINATION, OR TREATMENT THAT IS
    PERFORMED AS A RESULT OF AND WITHIN 72 HOURS OF RESPONDING TO THE ADVERTISEMENT FOR THE FREE,
    DISCOUNTED FEE, OR REDUCED FEE SERVICE, EXAMINATION, OR TREATMENT.
  </p>
</aside>
```

**Rules of use.** Never paraphrase, shorten, sentence-case, split across elements, or place it behind a
disclosure toggle, accordion, tooltip or "read more" — hidden is not "clearly distinguishable."
Contrast must clear WCAG AA (see `docs/COLOR-CONTRAST.md`); a legally-required disclosure set in grey
at 11px is an argument you do not want to have.

### 5.2 Provider attribution standard

**Live values — verified 2026-07-26, use exactly as written:**

```
Medical Director: Joshua Shaw, MD · FL Lic. ME136232
Candidacy determined at consultation.
```

Compact variant where space is tight (Google callout, end card):

```
Joshua Shaw, MD · FL Lic. ME136232
```

Where a treating practitioner is also named, that person's license type appears too:

```
[PRACTITIONER FULL NAME], [APRN|RN] · FL Lic. [NUMBER AS PRINTED ON LICENSE]
```

**Rules.**

- No ad ships without the physician name (64B8-11.001(2)(i)) and every named practitioner's license type (§ 456.072(1)(t)).
- **Never** substitute a job title for a credential. "Aesthetic Injector," "Injector," "Skin Specialist," "Provider," "Nurse" — all non-compliant as a license type.
- Do not imply a specialty not held (64B8-11.001(2)(k)) — no "dermatology specialists," "our dermatologists," "skin doctor." Implication alone violates; no "board certified" language is needed to trip it.
- Provider **lanes** stay internal per `CLAUDE.md`'s Public-Facing Copy Law. Naming a provider with a credential for legal attribution is required and is a different thing from explaining internal lane structure to customers. Do both correctly: attribution yes, lane commentary no.
- Google Ads: carry attribution as a **callout extension**, which is not subject to headline character limits.

### 5.4 Provider register — verified identities

**Publish only the columns marked publishable.** Everything else is internal.

| Field | Value | Publishable? |
|---|---|---|
| Name | Joshua Shaw | ✅ Required in every ad — R. 64B8-11.001(2)(i) |
| Credential / license type | **MD** | ✅ Required — § 456.072(1)(t) |
| Florida license number | **ME136232** | ✅ Safe and advisable — it is public record and verifiable |
| Role | Medical Director (assigned through Guardian Medical Direction) | ✅ Accurate; see the caution below |
| Florida licence expiry | **2028-01-31** | ❌ Internal — but calendar it (runbook §6) |
| Original issue | 2018-04-27 | ❌ Internal |
| NPI | On file | ❌ No advertising purpose |
| **DEA number** | **On file — DO NOT RECORD OR TRANSMIT** | 🚫 **Never.** Not in this repo, not in ad platforms, not in email, not in Sanity. A DEA number in a shared document is a prescription-fraud vector and has no compliance role in advertising. It has been deliberately excluded from every file in this directory |

**Verification.** `ME` is the Florida Board of Medicine prefix for an allopathic physician, so the
credential is **MD**, not DO. Name, credential and the Florida licence number were confirmed
independently against the [CMS NPI Registry](https://npiregistry.cms.hhs.gov/), which returns "JOSHUA
SHAW", credential "M.D.", and Florida licence "ME136232". Re-verify against the [Florida DOH licence
lookup](https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders) before launch to
confirm the licence status is clear and unencumbered — the NPI registry does not report discipline.

**🚫 Two traps to avoid, both easy to walk into.**

1. **Do not imply he is a dermatologist, or a specialist of any kind.** His NPI primary taxonomy is
   **Surgery (208600000X)**. R. 64B8-11.001(2)(k) is violated by *implication* alone — no "board
   certified" language required. Naming an MD on a page that also bids `dermatologist port charlotte`
   makes the specialty implication easier to draw, not harder. Keep "dermatologist," "skin doctor" and
   "dermatology specialists" out of copy absolutely, and never pair his name with a specialty word.
2. **Keep the title on him — "Medical Director" is the whole fix.** The title is accurate and it
   already distinguishes oversight from treatment, so a photograph carrying that title is fine. The
   only thing to avoid is dropping him into a treating-provider row *without* the title, where the
   surrounding context would imply he performs treatments (R. 64B8-11.001(2)(a)). Title present = no
   issue. `packages/web/public/images/providers/joshua-shaw-MD.jpg` is already named for the role.

   ```
   Medical Director: Joshua Shaw, MD · FL Lic. ME136232
   ```

   Add the oversight sentence only if he appears in the same visual row as the treating providers:
   *"Medical oversight and protocol supervision."*

### 5.3 Placement matrix

| Surface | § 456.062 block | Provider attribution | Notes |
|---|---|---|---|
| Landing page advertising the offer | **Required** — near the offer and again near the final CTA | **Required in the page body**, not only the footer | 64B8-11.001(2)(i) says "conspicuously"; a footer-only mention is weak |
| Any page stating "complimentary"/"free"/credited consultation | **Required** | Required | Includes `/skin-analysis/`, `/consultation/`, `/contact/` if the offer appears |
| Meta primary text | **Required** where the unit carries the offer | Required | Primary text has room. Use it |
| Meta headline / description only | Cannot carry it → **omit the offer from that unit** | Required | Never publish the offer without the block |
| Google RSA headlines/descriptions | Cannot carry it → **keep the offer out of RSA copy** | Callout extension | Do not name a free/discounted consult in an RSA |
| Google sitelinks | Do not point a sitelink at content that does not exist — 64B8-11.001(2)(d) plus a Google landing-page-experience violation | — | |
| Reels / Stories / video | **Required** on an end card, legible, held long enough to read | Required on end card | Plus 6-month retention, §1.3(4) |
| Google Business Profile posts | **Required** where the offer appears | Required | |
| Email | **Required** where the offer appears | Required | |
| Print / direct mail | **Required** | Required | |

---

## 6. Status summary

| # | Item | Status | Blocked on |
|---|---|---|---|
| 1 | § 456.062 disclosure | 🟡 Text ready; **not deployed** | Amber (build), counsel (trigger + adequacy) |
| 2 | Provider identification | 🟡 Identity verified (Joshua Shaw, MD · ME136232) | **Dr. Shaw's written consent to be named**; Diana's and Amber's license types |
| 3 | AHCA clinic licensure | 🟡 Exemption available **only if** no esthetician/RN-only owner holds equity | **Equity composition**; counsel opinion; certificate decision |
| 4 | Refund / fee policy | 🟢 Drafted | Amber's figures; two countersignatures |
| 5 | "AI" claim | 🟢 Substantiated | — (claim limits binding) |
| 6 | Platform automation lockdown | 🟢 Specified | Execution at launch |
| 7 | Provider + attorney review | 🔴 Open — hard gate | Both reviewers |
| + | Reel retention, review solicitation, license types | 🟢 Specified in runbook | Execution |
| + | **Live landing-page exposure (§4.1)** | 🔴 **Open now** | Amber — fix independent of any campaign |

**Three things worth holding together.**

1. **The item recorded as already handled is the one actually exposed.** Item 1's disclosure is absent
   from a live page advertising a complimentary consultation. Fix it first; it does not depend on any
   campaign.
2. **The item called "the gate" is narrower than the audit framed it, and narrower than it first looked
   to me.** An APRN owner qualifies under § 400.9905(4)(g) — but the paragraph's list is closed, omits
   chapter 477, and reaches nursing only through `s. 464.012`. **If an esthetician holds any equity, the
   exemption is unavailable.** That is now the single unresolved licensure question.
3. **The thing holding the clinical practice up is a document nobody advertised.** § 464.0123 confines
   autonomous APRN practice to primary care, so aesthetics runs on the § 464.012 physician protocol.
   Confirm it covers each advertised service (runbook gate G6) — the service menu changes faster than
   protocols get re-signed.

---

## 7. Change log

| Date | Change |
|---|---|
| 2026-07-26 | **Provider identity resolved.** Medical director recorded as Joshua Shaw, MD, FL ME136232 (Guardian Medical Direction); name, credential and licence number independently verified against the CMS NPI Registry, and the `ME` prefix confirms allopathic (MD, not DO). Attribution line at §5.2 filled with live values; provider register added at §5.4. **DEA number deliberately excluded from all files** — no advertising purpose and a fraud vector if circulated. Flagged two implication traps: his NPI taxonomy is Surgery, so nothing may imply dermatology (R. 64B8-11.001(2)(k) is violated by implication alone), and nothing may imply he performs treatments or is on site (R. 64B8-11.001(2)(a)). Licence expiry 2028-01-31 added to the runbook cadence. |
| 2026-07-26 | **Correction pass** after independent adversarial verification. (a) Fixed a citation error: § 400.9905(4)(g) reaches nursing only through `s. 464.012` (APRN) — the earlier draft reasoned from § 456.001(4)'s general "health care practitioner" definition, which over-includes and would have produced a false exemption conclusion for an RN-owned entity. § 400.9905 never cites § 456.001. (b) Surfaced a missed exposure: **chapter 477 is absent from (4)(g)'s closed list, so an esthetician owner defeats the exemption** — now the leading open question at item 3, Catch 1. (c) Upgraded § 400.9935(6) to verbatim and added the elements previously missing — the $100-or-actual-cost fee, the 50-most-frequent-services floor, and the **15-square-foot** posting minimum, which materially sharpens the collision with the pricing-confidentiality decision. (d) Narrowed the § 464.0123 phrasing: autonomous registration does not authorise aesthetics, but an APRN *may* perform aesthetics under a § 464.012(3) physician protocol — added that verbatim. (e) Noted that § 456.062 imposes no point-size or boldface requirement, and that chapter 477 is absent from its list too. |
| 2026-07-26 | Created. Seven audit items resolved against verified primary sources. Established APRN-owner exemption analysis under § 400.9905(4)(g); surfaced § 464.0123 primary-care limit on autonomous practice and the resulting dependence on the § 464.012 physician protocol (missed by the audit); found the § 456.062 disclosure absent from the live landing page (audit recorded it as present); resolved the "AI" claim as substantiated by the M17 device name and its software analysis, with claim limits; extended the item-6 lockdown to Meta; corrected three drift bugs in `docs/staff/COMPLIANCE-COPY-RULES.md`. |
