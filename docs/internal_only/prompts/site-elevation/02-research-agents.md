# PHASE 2 — Parallel Research Agents (Every Treatment, Service & Product Line)

Prepend `00-MASTER-PROMPT.md`. Goal: a research brief per topic deep enough that a curious
client could learn everything from our site alone. These briefs are the *only* content
input for Phases 3–4.

## Source hierarchy (strict)

1. **Local docs first** — `docs/internal_only/services/**` is primary truth. Notably:
   - PRF: `docs/internal_only/services/PRF/`, `docs/internal_only/services/Diana/PRF_Treatment_Guide_House_of_Rose.pdf`,
     `PRF_Brochure_House_of_Rose.pdf`, `PRF_Pricing_House_of_Rose.pdf`,
     `House_of_Rose_Injectable_PRF_Pricing.pdf`, `docs/internal_only/services/Diana/filler/PRF_ez-gel.md`,
     `docs/internal_only/services/microchanneling/PRF.md` + `Procell-prf-delivery-research-report.md`
   - Facials: `docs/internal_only/services/facials/*` (Glo2Facial, BioRePeel, dermaplaning,
     hydrodermabrasion, Face Reality acne program, packages/add-ons)
   - Injectables: `docs/internal_only/services/Diana/tox/daxxify.md`, `docs/internal_only/services/Diana/filler/dermalfillers.md`,
     `docs/internal_only/services/Diana/**` (treatment menu, pricing CSV/MD)
   - Pricing: `docs/internal_only/pricing/*` · Makeup: `docs/internal_only/services/makeup/*` ·
     Waxing: `docs/internal_only/services/waxing/*` · Skin analysis: `docs/internal_only/services/features/*`
2. **Existing Sanity content** — query current `service`, `costGuide`, `comparison`,
   `concern`, `treatmentPackage` docs; don't contradict published truth without flagging it.
3. **Web research** — mechanism-of-action, candidacy, evidence, aftercare, comparison
   framing only. **Never prices, never medical claims** beyond what compliance rules allow.

## The agents (run in parallel; one Task per topic)

**Advanced treatments (Amber):** PRF topical · microneedling · microchanneling ·
Procell (MD vs Pro) · Glo2Facial · BioRePeel · dermaplaning · carboxy therapy

**Injectables & wellness (Diana, RN):** neurotoxins (incl. Daxxify) · dermal fillers ·
PRF injections & PRF EZ-Gel · IV hydration therapy · GLP-1 program

**Basic facials (Brandy):** enzyme exfoliation · hydrodermabrasion · light peels ·
facial waxing

**Retail:** Jane Iredale products (no makeup-application service)

**Cross-cutting:** advanced skin imaging (the evidence-based first step) · Face Reality acne
program · product lines (Procell, GlyMed+, Skin Script, Face Reality, Jane Iredale,
House of Rose retail)

## Brief template — each agent writes `docs/internal_only/research/<topic>.md`

1. **The 3-sentence answer** (what it is — becomes the answer-first opener)
2. **How it works** (mechanism, plain English + one level deeper for the curious)
3. **Who it's for / not for** (candidacy, honest limits)
4. **The visit** (protocol, sensation, downtime, aftercare, results timeline, cadence)
5. **Comparisons** (vs each adjacent treatment we offer — e.g. PRF topical vs Procell
   microneedling with the Procell Therapies device; Glo2Facial vs hydrodermabrasion; Daxxify vs other tox;
   IV hydration vs oral — when each wins, honestly)
6. **Concern mapping** (which client concerns this addresses → feeds `/concerns/`)
7. **Pairings & pathways** (what it stacks with; what to try first; retail follow-through)
8. **Cost factors** (what moves price — ranges only from local docs/Sanity)
9. **FAQ bank** (10–15 real questions with answer-first replies)
10. **Provider + compliance notes** (whose lane; phrases to avoid per compliance doc)
11. **Journey links** (which existing/planned pages this should link to and from)
12. **Why House of Rose** (differentiators, local grounding — no overclaiming)

**IV hydration brief gets an extra section:** the case for *routine* IV hydration and why
clients already getting it elsewhere should get it here (RN-administered, med-director
oversight, integration with skin-health plan) — persuasive but compliance-clean.

## Deliverables

- One brief per topic in `docs/internal_only/research/` + `docs/internal_only/research/_index.md` (topic → brief →
  target pages matrix)
- `docs/internal_only/research/_gaps.md` — contradictions found between local docs, Sanity, and the live
  site (pricing drift, lane mix-ups) for Amber to resolve
