# Treatment Page Directive & Sitewide Plan

Status: new governing plan, written 2026-08-25 at Amber's direction. Supersedes prior
STYLE guidance for treatment/service pages (see "What this does NOT override" below).
This is a plan, not yet executed — see "Execution status" at the bottom.

## Why this exists

The service pages listed treatments instead of selling them, cross-referenced nothing,
and reused the same handful of generic room photos everywhere instead of the real,
treatment-specific photography and client before/afters already sitting in this repo
unused. This document is the fix: a new voice directive, a full treatment-by-treatment
connection map, and a concrete image-replacement plan.

## What this does NOT override

Discarding the old *style* does not discard the law. These stay non-negotiable
regardless of voice, and this document does not touch them:
- § 456.062 disclosure on any free/discounted/credited offer
- License type beside any named practitioner (MD/DO/APRN/RN — never a job title alone)
- No public pricing anywhere, ever (binding 2026-08-20 rule)
- No fabricated outcomes, reviews, or "results typical" claims
- No memberships, no invented "signature" service names
- Real photography only, real consent only — never present a stock/AI/manufacturer
  photo as a House of Rose client result unless it is truthfully labeled as such

Everything else — the clinical/institutional cadence, the "selection / sequencing /
indication / candidacy" tone, the flat card-grid listings, the internal-reference
habit — is replaced by the directive below.

---

## Part 1 — The directive: sell the treatment, never describe the website

**The one rule underneath all of this: every sentence on a treatment page is either
about the treatment, the benefit, the person providing it, or real proof. Nothing is
ever about the website itself.**

### Banned pattern: explaining the site to the reader

A customer never wants to read what a page, directory, menu, or category *is* or
*does*. That's internal documentation voice, not marketing. Confirmed live examples
found in this sweep (fix wherever found, this exact pattern, anywhere):

| Bad (internal-reference) | Why | Good (talks to the reader) |
|---|---|---|
| "The provider directory names each person, their licence type, and the services they provide." | Describes what a directory *contains* | "Meet Amber, Diana, and Brandy — see what each of them does and their license type before you book." |
| "Each profile names the services that person currently provides." | Describes a data field | "Diana provides injectables, IV hydration, and GLP-1 management. Amber provides Microneedling, PRF, Glo2Facial, and dermaplaning." |
| `'Dermaplaning — Facial (standalone)'` / `'Dermaplaning — Add-On'` | Internal appointment-name copy-paste, parenthetical labels | "The full 50-minute facial" and "Add it to another skin treatment in 25 minutes" |
| "No individual service pages are currently linked to this category." | CMS/empty-state jargon | Never show this at all — a category with nothing in it doesn't render a nav entry |
| Any `"(standalone)"`, `"(add-on)"`, `"(hub)"` suffix on a name | Internal categorization leaking into a proper name | State the real difference in a sentence instead of tagging the name |

**Still live and unfixed as of the last sweep** (the other agent's sweep may already
be mid-fix on some of these — verify current state before touching):
- `packages/web/src/lib/dermaplaningEducation.ts:17,22`
- `packages/web/src/pages/about/index.astro:98`
- `packages/web/src/lib/aboutFallbacks.ts:21,27`
- `packages/web/src/pages/services/collections/[collection].astro:133`

### What replaces the flat listing

Every treatment page does four things, in this order, none of them optional:
1. **What it is** — plain, human, specific. Not a dictionary definition.
2. **Why someone wants it** — the actual benefit, tied to a real concern (aging,
   texture, volume loss, acne scarring — the concern taxonomy already exists in
   `serviceCatalog.ts`). Persuasive, not clinical.
3. **How it's delivered / its real variations** — as connected, interlinked prose
   (see Part 2), never a bare card grid as the *only* presentation. Cards can still
   follow underneath for click-through, but the page has to tell the story first.
4. **Real proof** — a real before/after or real device/room photo that actually
   belongs to that treatment (see Part 3), captioned honestly. If no real proof
   exists yet for a given treatment, the section is skipped — never filled with a
   stand-in.

Booking stays reachable everywhere (hero, floating button, final CTA) but is never
the *only* thing a section offers — persuasion comes first, the button is always
there once you're persuaded.

### When source material looks thin: research it, don't just wait

Some internal folders (e.g. `services/Diana/tox/`, `services/Diana/filler/`) are
empty not because the facts don't exist, but because an earlier AI pass tried to
generate a brochure and produced nothing usable. For topics with a real, abundant,
verifiable public literature — how neurotoxin injections work, how hyaluronic-acid
fillers behave, general device/protocol mechanics — an empty internal folder is not
a blocker. Research the topic directly (manufacturer sites, clinical sources),
verify it per `CLAUDE.md` Rule #0, and cite the source. This does **not** apply to
facts that are inherently House-of-Rose-specific (what a given provider actually
offers, House of Rose's own protocol choices, anything about a specific person's
techniques) — those still need Amber, because no amount of web research tells you
what Brandy or Aundrea actually do.

---

## Part 2 — Treatment-by-treatment connection map

Current structure (25 public services across 6 collections) is mostly sound — most
parent/child relationships are already correctly modeled. The problems are:
(a) real cross-collection relationships that exist in the world but aren't linked
in the data, and (b) two hubs with zero children that need real content, not new
child pages that don't exist.

### Injectables & Bio-Fillers (hub: `injectables-bio-fillers`)
- **Children (already correct):** Neurotoxin Injections (`injectables`), Dermal
  Fillers (`dermal-fillers`).
- **New cross-links to add:** PRF (`prf`, both its Bio-Filler and Under-Eye
  injectable forms are Diana's injectable lane) and IV Hydration (`iv-hydration-therapy`,
  same provider, same "things Diana delivers by needle/infusion" story the hub
  page should actually tell). The hub's copy explains filler, Botox, vitamin
  IV/B12 hydration, and PRF as one connected story about what Diana provides —
  each named delivery gets an inline link out to its own page.
- **Note:** `prf`'s hub record lives in the `facials` collection while both its
  children live in `injectables-bio-fillers` — this is real (PRF genuinely spans
  Amber's topical/microneedling lane and Diana's injectable lane), so don't force
  it into one collection. Fix it with cross-links, not by picking a side.

### PRF (hub: `prf`, collection: `facials`)
- **Children:** PRF Under Eyes (`prf-under-eyes`), PRF Injections (`prf-injections`).
- **Cross-link:** Microneedling (`microneedling`) — topical PRF is delivered during
  a Microneedling appointment; this link already exists as a verified line item in
  `skinRenewalServiceEducation.ts` and should render as an inline hover-underlined
  link, not just plain text.

### Microneedling (hub: `microneedling`, collection: `facials`) — currently 0 children
This is the richest documented service in the whole catalog (full Procell research
library, 11 real client before/after photos, verified education content) and the
page currently doesn't reflect any of it. It needs:
- Inline links out to **PRF** (topical delivery option) and to **Morpheus8**
  (`morpheus8`, RF-based alternative — different collection, same underlying
  concern set: texture, acne scarring, stretch marks) as "different ways to
  approach microneedling-based treatment," with an honest one-line distinction
  between the Procell (Amber, esthetician) and Morpheus8 (RF device) approaches.
- The 11 real before/after photos wired into a results section (Part 3).
- Add `relatedSlugs: ['prf', 'morpheus8', 'biorepeel', 'glo2facial', 'dermaplaning']`
  (some already present) so the connection is real in the data, not just prose.

### InMode (`morpheus8`, `morpheus8-body`, `lumecca-peak-ipl`, `forma-rf-facial`)
- Already well cross-linked to each other via `relatedSlugs`. Keep that.
- **New cross-link:** `lumecca-peak-ipl` (sun damage, hyperpigmentation, texture)
  and `forma-rf-facial` (texture) overlap in concern with `biorepeel` (facials
  collection) — a client comparing "how do I deal with sun damage/texture" should
  be able to find both device-based and peel-based options from either page.
  Add mutual `relatedSlugs` entries.
- `morpheus8` is `kind: 'standalone'` despite functioning as a hub (it has
  `morpheus8-body` as a real child) — every other parent in the dataset is
  `kind: 'hub'`. Recommend flipping `morpheus8`'s `kind` to `'hub'` for
  consistency; this is cosmetic (nothing renders differently) but keeps the data
  model honest.

### BioRePeel (hub: `biorepeel`, collection: `facials`) — currently 0 children
No new child pages are warranted — the real structure here is **two provider
lanes on one treatment**, not two treatments. The page needs to explain both,
by name, linked to each provider's own profile:
- Amber's lane: BioRePeel as an **add-on** to an eligible advanced skin service
  (no independently verified add-on price exists — the copy should say what it
  is, not dodge around a number).
- Brandy's lane: BioRePeel as a **standalone face appointment or Series of 3**.

This is the exact "different provider lanes, both correct" pattern already
documented in `CLAUDE.md` — the fix is telling that story in the page copy
instead of a bare card grid, not restructuring the data.

### Face Reality Acne Program (hub) → Acne Bootcamp (child)
Already correctly modeled, one real child. No structural change — just apply the
new voice/proof standard when this page gets its rewrite.

### Waxing (hub) → Facial Waxing, Body Waxing (children)
Already correctly modeled. No structural change.

### IV Hydration Therapy / GLP-1 Weight Management
Both standalone, correctly separate (different programs, not delivery variants of
one thing). Cross-link into the Injectables & Bio-Fillers hub as described above;
no other structural change.

### Makeup (`bridal-makeup`, `event-makeup`, `everyday-makeup`)
Collection exists but `publicRoute: false` — the three pages are live and public,
but orphaned (reachable only by direct URL, no nav/directory path in). **Decision
needed from Amber, not made here:** flip the collection to a public route so these
three are discoverable, or is that intentionally minimal for now? Not changing
this without your call.

### Radiance & Renewal Facial (`radiance-and-renewal-facial`, Brandy) — resolved
Confirmed: this is Brandy's current facial, the successor to what used to be
called "Sculpt & Lift" (same underlying record — its `_id` is still literally
`service-sculpt-and-lift-facial`, a naming artifact from before the rename, not a
sign of duplication). It stays `public: false` deliberately — no dedicated website
page/URL, consistent with the whole point of this project (not every individual
service gets its own website page). That setting has zero effect on GlossGenius,
which is a separate system this repo doesn't control — its GlossGenius booking
listing is unaffected either way and is Amber's to manage there directly. Its real
facts remain available as source material for whenever Brandy's provider page or
the Facials collection page describes her current facial menu in prose — it just
doesn't need a URL of its own.

---

## Part 3 — Image replacement plan

The core finding: most of the catalog already has real, treatment-specific
photography or client before/afters sitting in the repo, unwired, while the page
shows a generic, reused facility-room photo instead. This is fixable without
requesting new photography for most of the list.

### Fix now — real asset exists, just needs wiring
| Service | Currently shows | Real asset sitting unused | Action |
|---|---|---|---|
| `microneedling` | Generic-but-acceptable room photo, **no result proof** | `public/images/before-after/procell/IMG_0138.webp` → `IMG_0149.webp` — 11 real Procell client before/afters | Wire a curated subset into a results section |
| `prf-under-eyes` | Generic facial suite room, no result proof | `public/images/before-after/PRF/prf-undereyes-ezgel.png` — real, HOR-branded PRF before/after | Wire into a results section |
| `morpheus8-body` | Duplicate of the *face* device handpiece photo (not body-specific) | `public/images/inmode/Morpheus8-Burst-Deep-Before-and-After-Buttocks.png` — real manufacturer before/after, credited | Add as a second `evidenceMedia` entry, matching the pattern `lumecca-peak-ipl` already uses (device + before/after) |
| `forma-rf-facial` | Device photo only | `public/images/inmode/Forma-Before-and-After.png` — unwired | Add as second `evidenceMedia` entry |
| `dermaplaning` | Generic facial suite room | `public/images/dermaplaning/dermaplaning.png` — real in-progress photo at House of Rose | Wire in as hero/gallery image — **but confirm provenance first** (real client vs. stock) before captioning it as proof |
| `injectables-bio-fillers` hub, `injectables`, `dermal-fillers` | Generic facial suite room | `public/images/fillers-botox/botox-house-of-rose-aesthetics.webp` (real HOR room, but has baked-in graphic text/neon sign — not clean for a hero) and `public/images/fillers-botox/DERMAL FILLERS.png` (unverified content) | Use in gallery, not hero, until a clean text-free crop exists or Amber confirms `DERMAL FILLERS.png` is usable |

### No fix available — genuinely unphotographed
`prf-injections` (beyond the shared under-eye image), `prf-fibrin-veil`,
`prf-body-treatments`, waxing (hub + both children), `back-treatment`,
`lightstim-led-therapy`, `neck-decollete-extension`. These need real photography
from Amber before a results section can honestly exist — the generic room photo
stays as a placeholder hero (not as "proof") until then, and no page claims proof
it doesn't have.

### Already correct — no action needed
`iv-hydration-therapy`, `lumecca-peak-ipl`, `biorepeel` (product photo, no proof
claim), `glo2facial`, `face-reality-acne-program`/`acne-bootcamp`, `morpheus8` (face).

---

## Part 4 — Readiness tiers (can this treatment get a full rewrite today?)

**Ready today** — real research doc + real education/facts file already exists,
no invented facts needed, and empty internal brochure folders (where present)
don't block anything because the underlying clinical/manufacturer facts are
independently researchable: `microneedling`, `prf`, `prf-under-eyes`,
`prf-injections`, `iv-hydration-therapy`, `glp-1-weight-management`, `glo2facial`,
`biorepeel`, `waxing`/`facial-waxing`, `injectables`, `dermal-fillers`,
`lumecca-peak-ipl`.

**Ready, minor gaps** — real research exists, just needs the image wiring from
Part 3: `forma-rf-facial`, `morpheus8-body`, `morpheus8`, `dermaplaning` (pending
photo-provenance check).

**Blocked on Amber** — these gaps are genuinely House-of-Rose-specific, not
something web research can fill:
- `docs/GOVERNANCE/internal_only/services/makeup/` — empty; all three makeup
  pages currently share one generic non-bridal-specific image and no dedicated
  research. What Aundrea actually does in a bridal vs. event vs. everyday
  appointment is business-specific, not a broadly documented public topic.
- No body-zone research doc exists to mirror `waxing/face.md` — `body-waxing`
  copy stays thinner than `facial-waxing` until one exists, though the general
  waxing research already covers the mechanics.
- `docs/GOVERNANCE/internal_only/services/microchanneling/` — empty, but
  Microneedling itself is already well-documented elsewhere, so this doesn't
  actually block that page; flagged for completeness only.

**Not part of this plan:** `bridal-makeup`, `event-makeup`, `everyday-makeup` get
the new voice standard applied to what exists today, but a real persuasive rewrite
with real specifics waits on source material from Amber/Aundrea.

---

## Execution status

This document is the plan only. Nothing described above has been implemented yet
except two small fixes already made and discussed with Amber directly:
`injectables`/`dermal-fillers` reclassified to `kind: 'treatment'` in
`serviceCatalog.ts`, and the `services/index.astro` provider-directory line
rewritten. All other file edits are paused while a separate concurrent agent
sweep is in flight across this same repo, to avoid two agents overwriting each
other's work. Next step, once that sweep is done and the tree is stable: execute
this plan treatment by treatment, starting with the "ready today" tier.
