# Memberships — Reinstatement Brief & Decision Checklist

**Date:** 2026-07-13 · **Trigger:** owner decision to bring memberships back (reverses the 2026-07-07 teardown).
**Status:** framework rebuilt on branch `feat/reinstate-memberships` (drafts only, nothing published live).
**Owner:** Amber — the ☐ items below are yours; I never invent membership pricing.

---

## 1. What I built tonight (reversible, no live publish)

| Piece | File | State |
| --- | --- | --- |
| Schema | `packages/studio/schemas/membership.ts` (registered in `schemas/index.ts`, in Studio sidebar via `structure.ts`) | ✅ built |
| Public page | `packages/web/src/pages/memberships.astro` — Sanity-first, on-brand fallback tiers, **no invented prices**, visual-editing annotated | ✅ built |
| Query | `ALL_MEMBERSHIPS_QUERY` + `Membership` type in `queries.ts` (only `status=="active"` renders publicly) | ✅ built |
| Nav / feeds | Footer link, `sitemap.xml`, `llms.txt` all include `/memberships/` | ✅ built |
| Redirects | `packages/web/netlify.toml` — removed `/memberships/*→/`; `/rose-circle/*` + `/plans/*` now 301 → `/memberships/` | ✅ built |
| Docs | `CLAUDE.md` + `docs/COMPLIANCE-COPY-RULES.md` updated: memberships reinstated + the compliant framing rule | ✅ built |
| Sanity content | 3 **draft** membership tiers seeded (unpublished) | ✅ drafts |
| Binding law | Sanity docs stay **draft** until you approve; nothing is public (site is also still coming-soon) | — |

## 2. The model I defaulted to (and why)

**Banked monthly credit + perks.** The member pays a set monthly amount that accrues as **spendable
studio credit** (rolls over), applied to any service or take-home retail — plus perks (priority booking,
member events, guest pass, birthday gift).

This is the literal *"money in the bank every month"* engine you described, and it's the **most
compliance-clean** option: it reads as prepaid *investment / member credit*, not a *"% off deal."* Your
own `COMPLIANCE-COPY-RULES.md` still bans discount/pressure framing, so I kept the copy to "investment,"
"founding-member access," "member credit." The revenue outcome is the same; the words stay on-brand.

The alternatives (for reference): **perks-only** (flat fee, no credit) and **standing service discount**
(a "member rate" % off — closest to the framing your compliance doc discourages).

## 3. Decisions only you can make (these gate publishing)

- ☐ **Model** — confirm banked-credit (default), or switch to perks-only / member-rate.
- ☐ **Tiers & names** — I seeded plain names: **Skin Health Membership**, **Advanced Facial Membership**,
  **Wax Membership**. Keep, rename, add/remove tiers, or go per-provider-lane (Amber / Diana / Brandy /
  Aundrea) like the old Rose Circle.
- ☐ **Monthly prices** — a **GlossGenius-anchored recommendation now exists** in
  `docs/research/memberships-pricing.md`, rebuilt from the live GG catalog (2026-07-13). Recommended
  "Facial of the Month" tiers = real GG facial prices: **Essential $80–$100 · Signature $120 · Advanced
  (Glo2) $195**, plus an **IV $185/mo** add-on. Pick your tiers, or give me your own fees. Nothing is published until you do.
- ☐ **Perks per tier** — confirm the priority-booking / events / guest-pass / birthday list.
- ☐ **Old brand names?** — reinstate **"Rose Circle" / "Rose Pass"** (a conscious reversal of the still-active
  naming law), or keep plain searchable names. Default = plain names.
- ☐ **Rose Method** — the old clinical-process story (Analyze → Evaluate → Sequence → Track) is recoverable
  (`git show b113e90^:marketing/regeneration-plans.md`). Want it folded into the membership page as the
  "how the plan works" narrative?
- ☐ **Billing runs in GlossGenius, not the website** (owner correction 2026-07-13). GlossGenius is the true
  system of record for services + payments; Sanity + the Astro site are display/content only. So the
  membership + recurring billing + credit ledger live in **GlossGenius native memberships** — **not** our
  one-time Stripe Elements checkout, and no Stripe subscription rail is needed. The `/memberships/` page just
  markets it and links clients to join via GlossGenius (call/text for now). Verify GlossGenius supports
  banked/rollover credit; if not, use its included-service / member-benefit model.

## 4. Prior-approved membership content recoverable from git (don't reinvent)

The full pre-teardown implementation is in commit **`b113e90`** (parent = last version before removal):
`membership.ts`, `membershipsPage.ts`, `MembershipTiers.astro`, `memberships.astro`, `plans.astro`,
`rose-circle.astro`, `marketing/regeneration-plans.md`, `docs/services/waxing/rosePass.md`. The old
**Rose Circle** was a 6-month, provider-lane-organized membership at *member rates* (IV with Diana, basic
facials with Brandy, wax with Aundrea, advanced facials with Amber). Recover with
`git show b113e90^:<path>` if you want to restore any of that copy.

## 5. Phase-2 tie-in (memberships change several "gaps")

Several treatment research briefs flagged "stale membership references — remove." **Those are no longer
errors** — they're rebuild hooks now. `docs/research/_gaps.md` §8 lists them as *assets to reconcile*
(the PRF cost-guide "Membership" cost factor, `packagesAdd-ons.md` "monthly membership" line, the Diana
v2 PDF's member-unit pricing, the permanent-jewelry doc's "Rose Circle" wrapper, the `brazilian-wax-pass`
package). Reuse them; don't delete them.

## 6. Compliance guardrail (unchanged, restated for memberships)

Membership copy must carry: provider-authority ("tiers/candidacy confirmed by your licensed provider"),
candidacy ("not every client needs a membership"), individual-outcomes ("outcomes are individual"). And it
must **never** use discount/pressure language. See `docs/COMPLIANCE-COPY-RULES.md` (new membership rule).
