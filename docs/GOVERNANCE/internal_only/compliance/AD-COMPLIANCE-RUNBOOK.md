# House of Rose — Advertising Compliance Runbook

> Operational pre-launch checklist. The former `FL-ADVERTISING-LAW.md` and
> `CONSULTATION-FEE-POLICY.md` drafts were intentionally deleted on 2026-07-27. This runbook does not
> replace current source verification or Florida healthcare counsel review.

---

## 1. Pre-launch gate

**No spend authorisation until every row is ✅.** A blocked row blocks the campaign, not just its own
line. Copy this table into the campaign folder at launch and date each sign-off.

| # | Gate | Owner | Evidence required | Status |
|---|---|---|---|---|
| G1 | § 456.062 block deployed on every surface carrying the offer, per placement matrix | Amber | Screenshot of each surface, rendered | ☐ |
| G2 | Medical director's name, degree and FL license number | Amber | ✅ **Done** — Joshua Shaw, MD · FL Lic. ME136232, verified against the CMS NPI Registry 2026-07-26 | ☑ |
| G2b | Naming rights — **check the Guardian agreement**; only seek separate consent if that clause is silent | Amber | Agreement clause reference, or signed consent if needed | ☐ |
| G2c | Florida DOH licence status confirmed clear and unencumbered | Amber | DOH lookup screenshot, dated | ☐ |
| G2d | Wherever he appears, the title **"Medical Director"** is present | Amber | Rendered page | ☐ |
| G3 | Provider attribution present on every ad unit and in the landing-page **body** | Amber | Rendered previews, all units | ☐ |
| G4 | License type stated for every named practitioner | Amber | Copy review checklist | ☐ |
| G5 | § 400.9905(4)(g) exemption position documented; certificate decision made | Counsel | Written legal opinion on file | ☐ |
| G6 | § 464.012 supervising-physician protocol current and covering **every advertised service** | Amber + medical director | Signed, dated protocol | ☐ |
| G7 | Consultation fee and credit terms approved and retained outside this repository | Amber + counsel | Executed policy or counsel-approved terms | ☐ |
| G8 | Google: DKI off, automatically created assets off | Amber | Settings screenshots (§2.1) | ☐ |
| G9 | Meta: Advantage+ creative enhancements and text variations off | Amber | Settings screenshots (§2.2) | ☐ |
| G10 | Every image cleared for sourcing — model labelled, or client consent + material-connection disclosure on file | Amber + counsel | Per-asset log (§3) | ☐ |
| G11 | No before/after imagery running, or counsel has cleared it | Counsel | Written clearance | ☐ |
| G12 | Every sitelink and CTA reaches content that actually exists | Amber | Click-through test log | ☐ |
| G13 | Negative keyword list applied | Amber | Google Ads export | ☐ |
| G14 | Ad archive log created and the first entries filed | Amber | `ad-archive-log.csv` (§4) | ☐ |
| G15 | Review solicitation policy adopted and staff briefed | Amber | §5 acknowledged | ☐ |
| G16 | Medical director has reviewed and approved final copy | Medical director | Signed sign-off block (§7) | ☐ |
| G17 | Florida healthcare attorney has reviewed both files | Counsel | Signed sign-off block (§7) | ☐ |

**🚫 Never put a DEA number in this repo, in an ad platform, in Sanity, or in email.** It has no
advertising-compliance purpose and is a prescription-fraud vector. Name, credential and state licence
number are the only provider identifiers that belong in advertising.

**G6 deserves emphasis.** It is not in the original audit, and it is arguably the most important row on
this page. An APRN cannot practise aesthetics under autonomous registration — § 464.0123 limits
autonomous practice to primary care. The written physician protocol is what makes the clinical practice
lawful, and therefore what makes advertising it lawful. Advertising a service the protocol does not
cover is a scope problem wearing a marketing problem's clothes. **Read the protocol against the service
menu, service by service, and confirm coverage of each one.**

---

## 2. Platform automation lockdown

Both platforms will generate ad copy you never wrote. Rule 64B8-11.001(5) makes the physician
responsible for advertising placed through agents and corporate entities — an ad network is an agent.
"The platform generated it" is not a defence.

### 2.1 Google Ads

| Setting | Required state | Where | Why |
|---|---|---|---|
| Dynamic Keyword Insertion | **Off** — remove every `{KeyWord:…}` token from all headlines and descriptions | Ad level, all ad groups | With a `dermatologist` bid live, DKI renders the searched query into the headline and auto-publishes "Dermatologist Punta Gorda" — a specialty implication under 64B8-11.001(2)(k) |
| Automatically created assets | **Off** | Campaign settings → Asset automation | Generates headlines and descriptions from landing-page content and the query, unreviewed |
| Ad suggestions / auto-apply recommendations | **Off** | Recommendations → Auto-apply | Silently edits live copy |
| Dynamic Search Ads | **Do not use** | Campaign type | Headlines are generated from page content |
| Broad match | **Avoid** in the skin/derm ad group | Keyword match types | Phrase and exact only; broad match invites credential-adjacent queries |
| Location targeting | **Presence: people in your targeted locations** | Campaign → Locations | "Presence or interest" serves people researching from out of state |
| Provider attribution | **Callout extension** | Assets → Callouts | Not subject to headline character limits |

**Keyword vs. copy — the line that matters.** Bidding on `dermatologist` is defensible: it is a generic
category term and a keyword bid is not itself an advertisement under 64B8-11.001(3). Putting
"dermatologist" in *copy* is not defensible. Keep the distinction absolute.

- ✅ Safe in copy: "dermatology services," "medical skin treatments," "skin and resurfacing," "sun damage," "age spots"
- ❌ Never in copy: "dermatologist," "our dermatologists," "skin doctor," "dermatology specialists," "board certified"

The landing page receiving derm-intent traffic must also carry provider identity and a plain statement
that House of Rose is not a dermatology practice. The FTC assesses net impression across the whole
journey, not one ad in isolation.

### 2.2 Meta

The original audit covers Google and stops. Meta has the same class of problem.

| Setting | Required state | Where | Why |
|---|---|---|---|
| Advantage+ creative enhancements | **Off** — all individual toggles | Ad level → Creative | Rewrites and restyles creative, including text overlays and image adjustments |
| Text variations / automatic text improvements | **Off** | Ad level | Generates alternate primary text and headlines; a generated variant can drop the § 456.062 block or the attribution line |
| Advantage+ audience expansion | **Review** — keep, but understand it widens beyond the defined audience | Ad set | Not a copy risk; a targeting-accuracy one |
| Site links / automatic destinations | **Off** unless each destination is verified | Ad level | Same dead-link exposure as Google sitelinks |

**Rule:** if a platform feature can alter published text, it is off. A required statutory disclosure
cannot survive an optimiser that is free to rewrite the paragraph it sits in.

### 2.3 Weekly rendered-ad audit — first four weeks, then monthly

Auditing the *settings* is not auditing the *output*. Check what actually served.

1. Google Ads → Ads & assets → filter to served combinations; review every rendered headline/description permutation.
2. Meta Ads Manager → Ad previews → every placement (Feed, Stories, Reels, Audience Network).
3. Confirm on each: no credential or specialty implication; provider attribution intact; § 456.062 block intact wherever the offer appears.
4. **Screenshot the rendered output and file it** with the week's date. An audit you cannot evidence did not happen.
5. Log the result in §4's archive log with `asset_type = audit`.

---

## 3. Image sourcing log

One row per image asset, before it runs. 16 CFR § 255.2(c) prohibits representing a non-client as a
client; § 255.5(a) requires disclosure of material connections, including free or discounted services.

| Field | Values |
|---|---|
| `asset_file` | Filename or asset ID |
| `subject_type` | `stock` · `staff` · `real_client` · `no_person` |
| `label_required` | Visible **"Model"** label required for `stock` and `staff` |
| `consent_on_file` | Written authorisation — required for `real_client` |
| `material_connection` | Whether the person received free or discounted services; if yes, disclosure text and its placement |
| `before_after` | `yes` / `no`. If `yes` → **blocked pending counsel clearance** |
| `cleared_by` / `cleared_date` | Reviewer and date |

**Before/after is a hard stop, not a disclaimer problem.** The 2023 revision of the Endorsement Guides
removed reliance on "results not typical" as a cure for a deceptive typicality implication. Either the
depicted result is representative of what clients generally achieve — and you can substantiate that — or
the ad is deceptive whatever the caption says. `caseStudy.consentGiven == true` is necessary and not
sufficient.

**Also:** if a treatment-plan document is photographed, use a clearly fictional name and label the image
"sample." Photographing a real client's plan with her name on it is a privacy problem no consent form
cleanly solves.

---

## 4. Audio/video ad archive — Rule 64B8-11.001(4)

**Requirement:** maintain and preserve an exact copy of every audio/video advertisement for at least six
months from the date it is aired. Applies to Reels, Stories with audio or video, YouTube, and any paid
video placement.

**"Exact copy" means the published file, not the source project.** Export what actually shipped —
post-platform-compression if that is what aired — and store it immutably. A Premiere project is not an
exact copy of an advertisement.

**Storage:** `HoR-ops/library/ad-archive/YYYY/` — outside the site repo, backed up, write-once by
convention. Do not rely on the platform to retain it; a deleted post takes its copy with it, and the
retention clock runs from **last airing**, not from posting.

**Log:** `HoR-ops/library/ad-archive/ad-archive-log.csv`

```csv
ad_id,platform,placement,asset_type,file_path,first_aired,last_aired,retain_until,provider_attribution_present,disclosure_456062_present,archived_by,archived_date,notes
```

- `retain_until` = `last_aired` + 6 months. **Recompute it every time the ad is re-run** — the clock restarts.
- `asset_type` = `reel` · `story` · `video` · `audio` · `audit`
- Both `*_present` columns are `yes`/`no`/`n/a`. A `no` on a live ad is an incident, not a note.

**Retention sweep:** monthly. Confirm nothing due for retention has been deleted, and that `retain_until`
reflects the true last-aired date.

---

## 5. Google review solicitation policy

**Adopted rule: solicit every client, or solicit none. No middle option.**

16 CFR § 255.2(e)(11) treats selectively inviting only satisfied customers — while merely thanking
less-pleased ones for their feedback — as potentially unfair or deceptive where it skews posted reviews
substantially more positive than they otherwise would be. The mechanism is what matters: any process
that routes happy clients toward a public review and unhappy ones toward a private channel is the
practice the FTC describes, however well-intentioned.

**Operating rules.**

1. **Same request, same timing, every client.** Identical script, identical channel, identical interval after the appointment. No provider discretion at the moment of asking.
2. **No sentiment gating.** No satisfaction survey that determines who gets the review link. No "would you recommend us?" fork.
3. **No incentives** — no discounts, credits, entries or gifts for a review. An incentive is a material connection requiring disclosure under § 255.5, and it corrupts the sample.
4. **No filtering of who is asked** by outcome, spend, or how the visit went.
5. **Never suppress, hide, or ask for removal** of a truthful negative review. Respond publicly and professionally instead.
6. **Automate it** so it cannot be applied selectively. A rule that depends on a person remembering to be even-handed will not stay even-handed.

**If it is impossible to ask everyone** — e.g. clients with no email on file — ask no one in that
channel rather than ask the reachable subset, unless reachability is genuinely unrelated to sentiment.
Document the basis either way.

**Responding to complaints:** never confirm, deny, or reference an individual's status as a client, or
any clinical detail, in a public reply. Respond generically and move the conversation to a private
channel.

---

## 6. Post-launch cadence

| Frequency | Action |
|---|---|
| Weekly, weeks 1–4 | Rendered-ad audit (§2.3), screenshots filed |
| Weekly | Confirm every sitelink and CTA still resolves |
| Monthly, after week 4 | Rendered-ad audit; retention sweep (§4) |
| Monthly | Confirm § 456.062 block still present on every live surface — a CMS edit or a Sanity publish can silently remove it |
| Quarterly | Re-verify the cited statutes and rules against current primary sources; update the active compliance documents and change log |
| Quarterly | Re-confirm the § 464.012 protocol covers the current service menu — the menu changes more often than the protocol |
| **Annually, and by 2027-11-30** | **Re-verify Dr. Shaw's Florida licence — ME136232 expires 2028-01-31.** Every ad carrying his name and licence number becomes a misrepresentation the day it lapses. Set the reminder 60 days out |
| On any credential, license, ownership or medical-director change | **Stop advertising.** Re-run gates G2–G6 before resuming |

That last row is the one that gets skipped. A medical director change invalidates every ad carrying the
previous physician's name, immediately.

---

## 7. Sign-off — audit item 7

Campaign or framework version reviewed: `[VERSION / COMMIT]` · Date: `[DATE]`

| Reviewer | Role | Scope confirmed | Signature | Date |
|---|---|---|---|---|
| `[NAME, MD/DO]` | Medical director | Copy, credential attribution, clinical claims, protocol coverage | | |
| `[NAME, FIRM]` | Florida healthcare attorney | § 400.9905(4)(g) position · § 456.062 trigger and placement · 64B8-11.001 · 16 CFR § 255 image and endorsement exposure · fee policy sufficiency | | |
| Amber Mingione | Owner | Gates G1–G15 evidenced | | |

**Reviewed files:** `docs/GOVERNANCE/internal_only/compliance/README.md` ·
`docs/GOVERNANCE/internal_only/compliance/GOOGLE-ADS-COMPLIANCE.md` ·
`docs/GOVERNANCE/internal_only/compliance/AD-COMPLIANCE-RUNBOOK.md` · the shipping ad copy · the strategy document ·
the current external legal source packet supplied to the reviewers.

---

## 8. Change log

| Date | Change |
|---|---|
| 2026-07-26 | Created. 17-row pre-launch gate; Google **and** Meta automation lockdown (the audit covered Google only); rendered-output audit with evidence capture; image sourcing log; Rule 64B8-11.001(4) archive with `retain_until` recomputation on re-runs; all-or-none review solicitation policy; post-launch cadence including the stop-advertising trigger on any credential or medical-director change. Added gate G6 for the § 464.012 protocol, absent from the original audit. |
