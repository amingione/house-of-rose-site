# AGENTS.md — additions

Append to the existing `AGENTS.md`. Written after an agent pass that produced
three avoidable errors on one task, each traceable to skipping a document this
file already pointed at.

---

## Read before touching anything (this is not advisory)

`AGENTS.md` line 5 already says *"Read `CLAUDE.md` before any work."* It is
routinely skipped because the task looks self-contained. It never is.

Minimum read set before any customer-facing or compliance-adjacent work:

| File | Why |
|---|---|
| `CLAUDE.md` | Entity structure, medical direction, NAP, statutory copy rules |
| `docs/SEO-AEO-PLAYBOOK.md` | The 7 page types + the JSON-LD contract per type |
| `docs/CONTENT-MODEL-MAP.md` | page type → doc type → route → JSON-LD → query |
| `docs/services/ALL-SERVICES-PRICING.MD` | The only prices that exist |

If a rule is stated in one of these, **follow it as written**. Do not re-derive
it, do not reason around it, do not upgrade it into an open question.

---

## Scope of practice is settled. Stop raising it.

**A medical director is on file: `Joshua Shaw, MD · FL Lic. ME136232`, via
Guardian Medical Direction.** Aesthetics runs on a § 464.012(3) written physician
protocol.

Consequences that follow, and are not up for re-litigation:

- **Microneedling and microchanneling are performed here under that protocol.**
  Rule 61G5-18.00015 conditions on delegation; the delegation exists. Do not cite
  the rule as a blocker, do not mark a treatment "pending scope review," and do
  not withhold provider copy over it.
- Esthetician-delivered-under-medical-direction is a real, correct configuration.
  It is the `esthetics-medical` scope preset. Use it.
- If a genuine scope question ever arises, it goes in **one line** to Amber. It
  does not become a schema field, a build gate, or a spec document.

**Anti-pattern this replaces:** inventing a `PENDING_AMBER` state, wiring a
verifier to block publish on it, and writing a spec doc explaining the dilemma.
That is three artefacts of pure drift generated from one wrong assumption.

---

## Practitioner names: required, not forbidden

The instinct to strip all names from public copy is **backwards**.

- **§ 456.072(1)(t):** wherever a practitioner is named, the **licence type**
  must appear. `MD` / `DO` / `APRN` / `RN`.
- "Aesthetic Injector," "Injector," "Provider," "Skin Specialist" are job titles
  and **satisfy nothing**.
- Advertising credential is `Diana Morrison, RN` — she is an RN, **not** an APRN.
- Canonical attribution line, verbatim, on medically directed services:
  `Medical Director: Joshua Shaw, MD · FL Lic. ME136232`

Never imply the medical director performs treatments, is on site, or holds a
dermatology specialty — his NPI taxonomy is **Surgery**, and R. 64B8-11.001(2)(a)
and (2)(k) are violated by implication alone.

Never write **dermatologist**, **skin doctor**, or **dermatology specialist** in
copy — including in a referral sentence. Bidding the keyword is fine; the word in
copy is not.

---

## Geo pages are `localArea`. They are not service pages.

A request for *"PRF Microneedling in Punta Gorda"* or *"IV Hydration in Charlotte
County"* is a **`localArea` doc at `/areas/[slug]`**. This is worked example #1 in
`SEO-AEO-PLAYBOOK.md` §2.

Do not put a geo modifier in a service page H1, title tag, or slug as a
substitute. Do not invent a `localSeo` field on `service`. The page type exists;
extend it or use it.

The general form of this error: **re-deriving an architectural decision the repo
already documented, and landing somewhere different.** Check the page-type table
first. If a request doesn't fit a type, extend that type's schema — never bypass
it.

---

## Do not create parallel documents

The 2026-07-23 pricing reconciliation existed because contradicting docs had
multiplied. Do not repeat it.

- **Update the doc that already owns the topic.** Architecture → `CLAUDE.md` /
  `CONTENT-MODEL-MAP.md`. Prices → `ALL-SERVICES-PRICING.MD`. Nothing else.
- A new `.md` is justified only when no existing doc covers the subject. "I want
  to explain my reasoning" is not a subject.
- Never write a doc whose main content is open questions, TBDs, or a decision
  matrix for Amber. Apply what is known and produce working output. If something
  is genuinely unknown, ask in chat — not in a committed file.

---

## Standing product rules

- **GlossGenius is commerce truth.** Prices flow GG → `ALL-SERVICES-PRICING.MD` →
  Sanity. Never invent a price; never publish one that isn't in GG.
- **Memberships are permanently dead.** Rose Circle, Rose Method, member rates,
  plans, tiers. Deleted 2026-07-23. Never rebuild, never reference.
- **No discount or "special" framing.** Bundles and programs only.
- Every results claim carries a variance line — R. 64B8-11.001.
- Banned copy: `pamper`, `indulge`, `amazing`, `attention to detail`,
  `steady hand`, `exosome`, `stem cell`, `guaranteed`, `cure`, `reverse-aging`,
  `Groupon`, `dermatologist`. No exclamation points.
- **URLs use trailing slashes.** `/services/prf-microneedling/`.

---

## Working style

- Amber dictates by voice. Read for intent, not literal phrasing.
- Apply available knowledge and produce a working output. Placeholders, TBDs, and
  "awaiting your decision" states are a failure mode, not diligence.
- Generic copy is rejected on sight. Every claim must be specific and checkable.
- Direct logs. Explain the *why* of the logic and the *how* of the
  implementation. Skip preamble.
