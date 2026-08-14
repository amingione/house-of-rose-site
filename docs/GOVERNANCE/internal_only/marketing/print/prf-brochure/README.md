# PRF Regenerative Pairing Brochure — Review Notes

**Status label (Creative System Book 5/7): DRAFT — pending clinical & brand review.**
A small "Internal Draft" tag is on the cover so this doesn't accidentally go to print
or a client's hands before sign-off. Delete that `.corner-tag` span in the HTML/script
once approved.

## Facts that require verification
- **Lumecca IPL and Morpheus8 are confirmed in-house InMode services** per
  `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD` — but that doc notes
  the **provider is not specified** in the GlossGenius export. Confirm who actually runs
  these before this goes out, since provider lane isn't printed in the brochure (by design —
  provider lanes stay internal-only in customer copy) but you'll need it to route bookings.
- Confirm current Lumecca/Morpheus8 naming and eligibility against the reviewed service education and
  owner direction recorded in `CLAUDE.md` before release.

## Claims that require clinical approval
- **PRF + Lumecca** and **PRF + Morpheus8** are framed as provider-recommended pairings
  a client can *ask about* — not as an existing, fixed, published protocol. That's
  intentional: the research folder (`docs/GOVERNANCE/internal_only/research/PRF/`) only
  documents topical PRF paired with **Procell microneedling** as a confirmed protocol.
  Pairing PRF with Lumecca or Morpheus8 specifically is a **new concept this brochure is
  proposing**, not something already clinically protocoled — please have your medical
  director / clinical review confirm sequencing, spacing, and eligibility before staff
  start booking it that way.
- Morpheus8/Lumecca copy is restricted to **tone, texture, pigment, stretch marks, scars**
  only — no tightening/lifting/laxity language — per the binding 2026-08-06 owner directive.
  Recheck the current reviewed service education if you edit it.
- No claim above Level 2 (Creative System Book 2 §6) was used: no "clinically proven," no
  "no downtime," no "pain-free," no guarantees. If you want a stronger performance claim
  anywhere, it needs documented substantiation + clinical + legal review first.

## Assets still needed
- Real House of Rose photography (architectural, real skin/hands, per Book 4) — this
  version is intentionally typography-only/monogram-only to stay inside the visual
  blacklist (no stock spa imagery, no AI faces) until you supply approved photos.
- Approved § 456.062 disclosure copy, **only if** you ever add a "free/complimentary
  consultation" offer to this piece — none is used here on purpose, since that disclosure
  language doesn't exist yet per CLAUDE.md.

## What's in this folder
- `House-of-Rose-PRF-Brochure-DRAFT.pdf` — print-ready, 6-page, Letter-size (8.5×11), dark
  mode, built from the live site's actual brand tokens (`tailwind.config.ts` / `global.css`)
  and the signage stylesheet's Cochin display type.
- `House-of-Rose-PRF-Brochure-DRAFT.html` — same brochure, editable, opens in any browser.
- `assets/` — the exact Cochin font files and HR monogram already used elsewhere in the
  repo, copied here so the HTML is portable (no dependency on the sandbox).
- `build_brochure.py` — regenerate the PDF anytime after editing the HTML/CSS in the script:
  `cd` into this folder and run `python3 build_brochure.py` (requires `pip install
  weasyprint --break-system-packages`).

## Copy law check
- No pricing anywhere (per your ask).
- No provider names (Amber/Diana) — provider lane stays internal per the binding
  Public-Facing Copy Law.
- No memberships, no retired language (no "glow," "luxury," "pamper," "no downtime," etc.).
- Medical Director attribution + NAP on the back cover.
