# Measurement Account Cleanup — House of Rose

**Status:** diagnosis + runbook
**Date:** 2026-07-28
**Scope:** House of Rose Aesthetics only. FAS / Flores / Kirk's / Southern Smokers are named where they explain the mess, but their migration is deferred.

---

## 1. What actually happened

One root cause, repeated five times: **you built Google properties from inside Google Ads onboarding wizards instead of building them in Analytics and Tag Manager first.**

Every time you complete a Google Ads signup flow, Google silently auto-creates four things and names them after itself:

1. an Analytics **account** literally named `Google Ads Account`
2. a GA4 **property** inside it
3. a **Google tag** (`G-…` for Analytics, `AW-…` for Ads)
4. a Tag Manager **"account"** whose only job is to administer that Google tag

That fingerprint is all over your screenshots. It is not five separate mistakes — it is one mistake made five times.

A second factor compounds it: **you are working across two Google identities.** Your open tabs show `authuser=0` and `authuser=1` on the same GA property, plus an unresolved *"You've been invited to access a Google tag"* email sitting in `info@houseofrosefl.com`. Ownership is split, so nothing looks consistent from either login.

---

## 2. Inventory — what each object really is

### Organizations (3, should be 1)

| Org | Verdict |
|---|---|
| House of Rose | Duplicate — retire |
| House of Rose Aesthetics LLC | Duplicate — retire |
| **LaunchWell Brands** | **Keep. This is the agency parent.** |

### Analytics

| Object | ID | Verdict |
|---|---|---|
| Account `Google Ads Acco…` | `203932451` | Auto-created junk name. Now holds **five unrelated clients**. Rename now, split later. |
| Property `House of Rose Aesthetics` | `534881520` | ✅ **The live one.** Stream `14603824376`. |
| Property `www.rozskin.com` | `373594780` | Unrelated + closed. **Trash it** (§4, Phase 3). |
| Property `FAS Motorsports` | `508031598` | Wrong home — deferred |
| Property `Flores Law Office` | `483342297` | Wrong home — deferred |
| Property `Kirk's Mowing & Landscaping` | `482119139` | Wrong home — deferred |
| Account `Southern Smokers LLC` | `349095409` | Separate and clean. Leave alone. |

### Tag Manager — the duplicate that's confusing you

You have two Tag Manager accounts both named **House of Rose**. They are not duplicates of each other. They are two *different kinds of object* that Tag Manager displays in the same list:

| Account | Container | What it actually is |
|---|---|---|
| House of Rose `6352389737` | `250813725` → `G-QBDHB89WTR` | **Not a GTM container.** This is the *Google tag admin surface* for your GA4 measurement ID. Tag Manager mirrors Google tags here so you can manage who administers them. Auto-created. |
| House of Rose `6367955689` | `259351754` → `GTM-NSDKJFP9` | ✅ **The real container.** This is what's live on houseofrosefl.com. |
| F.A.S. Motorsports Google Ads account `6318988858` | `232453478` → `AW-17641771829` | Same pattern, Ads flavor. Your Tag Assistant tab shows it has **open container issues**. Deferred. |

**This is why deleting the "duplicate" felt dangerous — it isn't a duplicate container, and treating it like one can break your GA4 tag.** Handling in §4, Phase 2.

---

## 3. The code is not the problem

Verified against `house-of-rose-site`. The implementation is clean and consistent:

- `PUBLIC_GTM_ID=GTM-NSDKJFP9`, served **first-party** through the Netlify edge function `google-tag-gateway.ts` → `/metrics/` → `gtm-nsdkjfp9.fps.goog`. This is the right architecture and most people don't do it.
- `packages/web/src/lib/measurement.ts` pins `ga4MeasurementId: 'G-QBDHB89WTR'` as a literal type — a single source of truth, enforced at compile time.
- `ConsentBootstrap.astro` sets Consent Mode v2 defaults to **denied** before any tag loads, with a `wait_for_update` of 500ms. Correct.
- **No stray hardcoded `gtag()` config anywhere in `src/`.** You are not double-tagging.

Three small drift items to close (§5):

| Item | Issue |
|---|---|
| `PUBLIC_GA4_ID` | Set in both `.env.local` files, but only referenced by `env.d.ts` — nothing reads it. The real ID lives in `measurement.ts`. Dead variable. |
| `CLAUDE.md` | Documents `PUBLIC_GTM_ID` (lines 291, 391) but not the GA4 measurement ID. |
| `packages/web/.env.local.bak` | Stale backup holding tracking IDs. Remove. |
| GTM container `259351754` | Your tab shows `containerDraftId=3` — **unpublished workspace changes pending.** Verify before anything else. |

---

## 4. Runbook

### Phase 0 — Freeze (5 min, do this first)

You have a **second Google Ads account signup in progress** — `ocid=8429806518`, with a Performance Max draft for House of Rose Aesthetics — separate from your existing `Amber MG` account (`ocid=7795571676`).

- [ ] **Do not complete that onboarding flow.** Finishing it will auto-spawn another GA4 property, another Google tag, and another Tag Manager account — the exact mess you're trying to undo.
- [ ] If you want that PMax campaign, build it *inside the existing Ads account* instead.
- [ ] Decide the permanent owner identity. **Recommended:** a LaunchWell-owned Google account is Administrator on every asset; `info@houseofrosefl.com` is Administrator on House of Rose assets only. Client keeps real access, you keep continuity.

### Phase 1 — Establish truth (15 min)

- [ ] GA4 → Admin → Data streams → stream `14603824376` → confirm the Measurement ID reads **`G-QBDHB89WTR`**. If it does not, the site is reporting into the wrong property and that becomes P0.
- [ ] Tag Manager account `6367955689` → container `259351754` → check the workspace. Publish or discard draft 3 deliberately.
- [ ] Run Tag Assistant on `houseofrosefl.com`. You should see **exactly one** `GTM-NSDKJFP9` and **exactly one** `G-QBDHB89WTR`, loading through `/metrics/`. Two of either = double-counted sessions.

### Phase 2 — Neutralize the fake duplicate (10 min)

Do **not** start by deleting account `6352389737`.

- [ ] GA4 → Admin → Data streams → your stream → **Configure tag settings** → **Admin** → add your permanent owner identity as an administrator of the Google tag. This moves control to where it belongs — with the property, not a phantom Tag Manager account.
- [ ] Resolve the *"You've been invited to access a Google tag"* email in `info@houseofrosefl.com` — accept or decline it consciously, so the invite stops re-creating confusion.
- [ ] Rename account `6352389737` to **`⚠️ House of Rose — Google tag mirror (do not use)`**. Renaming is free, reversible, and stops you clicking the wrong one.
- [ ] Rename account `6367955689` → **`House of Rose Aesthetics`**, container `259351754` → **`houseofrosefl.com — web`**.
- [ ] Only after Tag Assistant still shows a healthy `G-QBDHB89WTR` for 48 hours, consider removing yourself from `6352389737`. **Verify before deleting** — removing an account that mirrors a live Google tag is not something to do on faith.

### Phase 3 — Remove rozskin.com (5 min)

- [ ] GA4 → select property `www.rozskin.com` (`373594780`) → Admin → **Property settings** → **Move to trash**.
- [ ] 35-day recovery window, so this is reversible. It self-deletes after that.
- [ ] If the option is greyed out you lack **Administrator** on that property — grant yourself at account level `203932451` first, then retry.

### Phase 4 — Untangle the shared account

The real fix. Rename first, migrate second.

- [ ] Rename account `203932451` from `Google Ads Account` → **`LaunchWell — Legacy Shared (migrating)`**. Instant clarity, zero risk.
- [ ] **Check org membership before anything else:** GA4 → Admin → Account → confirm which Google Marketing Platform organization `203932451` belongs to. This determines everything below.
- [ ] Create a new Analytics account **`House of Rose Aesthetics`** inside the **same organization** as `203932451`.
- [ ] Move property `534881520`: Admin → Property settings → **Move property**.

Google's rules for a property move, confirmed current:

| | |
|---|---|
| **Permissions** | Administrator **and** Editor on *both* source and destination accounts |
| **Organization** | Both accounts must be in the **same** GMP organization — a cross-org move is blocked outright |
| **Tracking ID** | **Unchanged.** No retagging, no code deploy, no data gap. |
| **Transfers with it** | All data streams, settings, reporting history, and links to Google Ads / BigQuery / Search Console / Firebase |
| **Left behind** | Change history stays in the source account |
| **Hard blockers** | An active Google Ad Manager link, in-flight unsampled reports, or a destination account already at 50 properties |

- [ ] Consolidate organizations last. GMP organizations **cannot be merged** — you move accounts out of the strays and then delete the empty orgs. Keep **LaunchWell Brands**; retire `House of Rose` and `House of Rose Aesthetics LLC`.

### Phase 5 — Make it not happen again

- [ ] **Never create GA4 or GTM from inside a Google Ads wizard.** Create the property and container first, then link Ads to them.
- [ ] Naming convention, applied to every client going forward:

```
Org:        LaunchWell Brands
Account:    <Client Legal Name>
Property:   <Brand> — <primary domain>
Stream:     <domain> — web
GTM acct:   <Client Legal Name>
Container:  <domain> — web
```

- [ ] One Analytics account per client. One property per brand. One container per site. No exceptions — exceptions are how this started.

---

## 5. Repo follow-ups

| # | Change | File |
|---|---|---|
| 1 | Drop the unused `PUBLIC_GA4_ID` var, or wire `measurement.ts` to read it — pick one source of truth | `.env.local`, `packages/web/.env.local`, `packages/web/src/env.d.ts` |
| 2 | Document the GA4 measurement ID alongside `PUBLIC_GTM_ID` in the env table | `CLAUDE.md` (~line 391) |
| 3 | Delete the stale backup holding tracking IDs | `packages/web/.env.local.bak` |
| 4 | Record the final account IDs once Phase 4 lands | this file |

---

## 6. Reference

- [\[GA4\] Move a property — Analytics Help](https://support.google.com/analytics/answer/9305872?hl=en)
- [Find your way around Tag Manager — Tag Manager Help](https://support.google.com/tagmanager/answer/14842866?hl=en)
- [Managing users and permissions — Tag Manager Help](https://support.google.com/tagmanager/answer/6107011?hl=en)
