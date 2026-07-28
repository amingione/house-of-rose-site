# Measurement Account Cleanup — House of Rose

**Status:** VERIFIED against live Google admin (read-only sweep, 2026-07-28)
**Scope:** House of Rose Aesthetics. Other clients named only where they explain the mess.
**Permanent owner identity (your choice):** `ambermingione@gmail.com`

---

## 1. Root cause

One mistake, made five times: **Google properties were created from inside Google Ads onboarding wizards** instead of in Analytics and Tag Manager first. Each wizard silently spawns an Analytics account named `Google Ads Account`, a GA4 property, a Google tag, and a Tag Manager account to administer that tag.

Compounding it: **two Google identities.** Verified — they see different worlds:

| | `info@houseofrosefl.com` (authuser=1) | `ambermingione@gmail.com` (authuser=0) |
|---|---|---|
| Analytics accounts visible | `Google Ads Account` only | `Google Ads Account` + `Southern Smokers LLC` |
| GMP orgs visible | `House of Rose Aesthetics LLC` only | all three orgs |

Both are already **Administrator** on account `203932451` and on the Google tag, so no permission grants are needed to proceed.

---

## 2. What's actually working — verified, not assumed

I checked these against the live admin. All green:

| Check | Result |
|---|---|
| Measurement ID on stream `14603824376` | **`G-QBDHB89WTR`** — matches `measurement.ts` exactly |
| Stream URL | `https://www.houseofrosefl.com` |
| Data collection | Active in past 48 hours; tag instructions show **Data flowing** |
| Connected site tags | **0 connected** — you are not double-tagging |
| GTM workspace changes | **0 pending** — nothing stuck in draft (my earlier concern was wrong) |
| Container tag count | Exactly 3, all clean |

Container `GTM-NSDKJFP9` contents:

| Tag | Type | Trigger |
|---|---|---|
| GA4 - Google tag | Google Tag | Initialization - All Pages |
| GA4 - Typed events | GA4 Event | DLV - Allowed measurement events |
| Google Ads - Conversion Linker | Conversion Linker | All Pages |

That allowlist trigger pairing with the typed `MeasurementEvent` union in `measurement.ts` is a genuinely good pattern. The implementation is not your problem.

---

## 3. What's actually broken — ranked

### 🔴 P0 — Three service accounts can read (and one can edit) every client

Account-level access on `203932451`, 20 rows. The humans are fine. These are not:

| Principal | Role | Problem |
|---|---|---|
| `localstorm-seo-writer@gen-lang-client-0378241520.iam.gserviceaccount.com` | **Editor** | Can **modify settings** on all five clients' properties — House of Rose, FAS, Flores Law, Kirk's, rozskin |
| `fas-n8n-seo@fas-motorsports-469804.iam.gserviceaccount.com` | Analyst | A **FAS Motorsports** automation pipeline can read a **medical aesthetics** client's analytics |
| `grafana-analytics@fas-motorsports-469804.iam.gserviceaccount.com` | Analyst | Same — FAS dashboards can read House of Rose |

These were almost certainly granted at account level because that was the easy click. For an agency this is the finding that actually matters: it's a client-confidentiality breach waiting to be noticed, and for a med spa it reads badly even though GA4 holds no PHI. **Regrant each of these at property level, scoped to the property it was meant for.**

Also linked at account level: Google Ads accounts `230-991-0049`, `704-392-4923`, `803-936-8488` (5 permission rows each). Note your repo's `GOOGLE_ADS_CUSTOMER_ID=492-149-3013` matches **none** of them — worth reconciling before you enable offline conversion imports.

### 🔴 P0 — The property-move sequencing is the opposite of what you'd guess

Verified: selecting org **House of Rose Aesthetics LLC** returns *"You do not have access to any Analytics accounts in this organization."*

**Account `203932451` belongs to no GMP organization at all.**

This inverts the migration order. Google blocks a property move when the source account lacks org membership but the destination has it. So:

```
✅ CORRECT   create destination account with NO org
             → move property 534881520
             → then link the destination account to LaunchWell Brands

❌ WRONG     create destination account inside LaunchWell Brands
             → move is blocked outright
```

Get this backwards and you'll spend an afternoon convinced Google is broken.

### 🟠 P1 — Container quality: **Urgent**

Diagnostics flags *"Additional domains detected for configuration."* Google's own suggested fix is to modify the **Google Ads - Conversion Linker** tag.

Translation: your tag is firing on domains the container doesn't know about, so link decoration isn't happening there and **conversion attribution is leaking**. Given your booking flow runs on GlossGenius, the likely missing domains are `app.glossgenius.com` and the apex/`www` pair. For a med spa where the booking *is* the conversion, this is the highest-value measurement fix on the list.

### 🟠 P1 — Google tag gateway: **Incomplete**

You built a first-party gateway at the Netlify edge (`/metrics/` → `gtm-nsdkjfp9.fps.goog`) — genuinely sophisticated work. But on Google's side, the Google tag's own gateway configuration reads **Incomplete**. The container-level gateway is serving (data is flowing), but the tag-level registration was never finished, so you may not be getting the durability benefit you built for.

### 🟡 P2 — Smaller items

| Item | Detail |
|---|---|
| No Ads conversion tag | Container has the Conversion Linker but **no Google Ads Conversion Tracking tag**. Conversions reach Ads only via GA4 import. |
| URL query redaction off | Redact data: email **active**, URL query parameter keys **inactive**. With `gclid`/UTM traffic and consultation forms, turn query-key redaction on. |
| Data sharing off | "Google products & services" unchecked — limits some Ads optimization features. Deliberate choice or accident? |
| Account name | Still literally `Google Ads Account`, created 2021-08-02. |
| `rozskin.com` | Property `373594780`, closed and unrelated, still sitting alongside client data. |
| Second Ads signup in progress | `ocid=8429806518` with a PMax draft — completing it spawns another property + tag + GTM account. |

---

## 4. Runbook

### Phase 0 — Freeze
- [ ] Do **not** complete the Google Ads onboarding at `ocid=8429806518`. Build that PMax campaign inside the existing Ads account instead.

### Phase 1 — Fix the leaks (highest value, lowest risk)
- [ ] GTM → container diagnostics → **Configure your domains** → add `houseofrosefl.com`, `www.houseofrosefl.com`, and your GlossGenius booking domain to the Conversion Linker. Preview, then Submit.
- [ ] Finish **Google tag gateway** setup on the Google tag (account `6352389737` → Admin → Google tag gateway).
- [ ] GA4 → Data streams → Redact data → enable **URL query parameter keys**.

### Phase 2 — Close the permission holes
- [ ] Remove `localstorm-seo-writer@…` from **account-level Editor**. Regrant at property level, only where it's needed.
- [ ] Remove both `…@fas-motorsports-469804…` service accounts from account level. Regrant on the FAS property (`508031598`) only.
- [ ] Reconcile Ads customer IDs: repo says `492-149-3013`, linked accounts are `230-991-0049` / `704-392-4923` / `803-936-8488`.

### Phase 3 — Naming (free, reversible, stops misclicks)
- [ ] Account `203932451` → `LaunchWell — Legacy Shared (migrating)`
- [ ] GTM `6352389737` → `⚠️ House of Rose — Google tag mirror (not a container)`
- [ ] GTM `6367955689` → `House of Rose Aesthetics`; container → `houseofrosefl.com — web`

### Phase 4 — Remove rozskin.com
- [ ] GA4 → property `373594780` → Admin → Property settings → **Move to Trash Can**. 35-day undo window.

### Phase 5 — Migrate (respect the org sequencing from §3)
- [ ] Create Analytics account `House of Rose Aesthetics` with **no organization**.
- [ ] Move property `534881520` into it. Tracking ID does **not** change — no retagging, no data gap. Change history stays behind.
- [ ] Then link the new account to **LaunchWell Brands**.
- [ ] Repeat per client. Retire the empty `House of Rose` and `House of Rose Aesthetics LLC` orgs — GMP orgs can't be merged, only emptied and deleted.

### Phase 6 — Standard going forward
- [ ] Never create GA4/GTM from inside a Google Ads wizard. Create first, link second.
- [ ] Grant service accounts at **property** level, never account level.

```
Org:        LaunchWell Brands
Account:    <Client Legal Name>
Property:   <Brand> — <primary domain>
Stream:     <domain> — web
GTM acct:   <Client Legal Name>
Container:  <domain> — web
```

---

## 5. Repo follow-ups

| # | Change | File |
|---|---|---|
| 1 | Drop unused `PUBLIC_GA4_ID` or wire `measurement.ts` to read it — one source of truth | `.env.local`, `packages/web/.env.local`, `packages/web/src/env.d.ts` |
| 2 | Document the GA4 measurement ID beside `PUBLIC_GTM_ID` | `CLAUDE.md` ~line 391 |
| 3 | Delete stale backup holding tracking IDs | `packages/web/.env.local.bak` |
| 4 | Reconcile `GOOGLE_ADS_CUSTOMER_ID` against actually-linked Ads accounts | `.env.example` |

---

## 6. Reference

- [\[GA4\] Move a property](https://support.google.com/analytics/answer/9305872?hl=en)
- [Find your way around Tag Manager](https://support.google.com/tagmanager/answer/14842866?hl=en)
- [Managing users and permissions](https://support.google.com/tagmanager/answer/6107011?hl=en)
