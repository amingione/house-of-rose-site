# 00 · START HERE — House of Rose AI Brand Factory

This is the index for the full prompt-template library. Every folder below holds a ready-to-run
`Prompt_Template.md` (the **Agent 3** output of the 4-agent pipeline in `AI BRAND FACTORY.md`). You
fill the INPUT, run the prompt, drop the result back in the folder, then run the **Systems Auditor**
(`SYSTEMS-AUDITOR.md`) to check it against everything else.

## The locked brand context (every template inherits this)

- **House of Rose Aesthetics** · Punta Gorda, FL · by appointment. Tagline: **"Where beauty blooms within."**
- Category: **Advanced Aesthetics** — never medical / med spa / boutique / luxury self-label. Luxury is the *felt* experience, never claimed.
- A **full destination** — never one hero treatment; don't over-index on PRF/microchanneling.
- Energy: fresh, modern, radiant + bold, iconic; fashion-house confidence (Chanel/Dior) with rose/bloom warmth — **never clinical, never a coffin.**
- Voice: confident not loud; specific over superlative; warm + expert. Pricing reads **"From $X"** / range. Compliant; defer clinical specifics to licensed providers.

> Single source of truth for the above: `01-Strategy & Foundation Documents/00-HoR-Brand-Context.md`.

## Run order (later phases depend on earlier ones)

| # | Phase | Depends on | Items |
|---|-------|-----------|-------|
| 01 | Strategy & Foundation | — | 11 |
| 02 | Visual Identity | 01 (Positioning, Archetype) | 7 |
| 03 | Brand Guidelines & Standards | 01 + 02 | 4 |
| 04 | Messaging & Communication | 01 (Positioning, Voice) | 7 |
| 05 | Digital & Web | 01–04 + visual system | 6 |
| 06 | Marketing & Communication Materials | 01–05 | 6 |
| 07 | Print & Collateral | 02–03 | 9 |
| 08 | Product & Packaging (retail line) | 02–03 | 6 |
| 09 | Internal & HR | 01–04 | 4 |
| 10 | Measurement & Performance | 01–06 | 4 |
| 11 | Governance & Evolution | 01–10 | 4 |

## How to use a template

1. Open the phase folder → the document subfolder → `Prompt_Template.md`.
2. Fill the **INPUT** block with your locked prior-phase outputs + specific facts.
3. Run it. Save the result as `Output.md` in the same folder (keeps the paper trail).
4. Run `SYSTEMS-AUDITOR.md` with the new output + the list of what's already done.

## Pipeline reference

`AI BRAND FACTORY.md` holds the 4 agents (Research Analyst → Brand Architect → Prompt Engineer →
Systems Auditor). The templates here are pre-built Agent 3 outputs, so day-to-day you mostly **run a
template, then audit**. Use Agents 1–2 only when you want to deepen or rebuild a specific template.
