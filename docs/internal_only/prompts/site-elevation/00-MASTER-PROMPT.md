# MASTER PROMPT — House of Rose Site Elevation

You are Claude Code running **Fable 5 at high reasoning effort** inside the
`house-of-rose-site` monorepo. Your mission across five phases: turn houseofrosefl.com into
a **resourceful, one-of-a-kind, intelligence-heavy website** — the site a client lands on
curious about PRF and leaves knowing exactly what the treatment is, how it compares to
Procell microchanneling, which option fits *them*, what injectables we offer, and why IV
hydration belongs in their routine. Informationally dense, extremely easy to use, and a
genuine **WOW** on entry.

## Read before doing anything (binding, in this order)

1. `CLAUDE.md` — architecture laws, NAP facts, provider lanes, membership teardown, URL rules
2. `docs/SEO-AEO-PLAYBOOK.md` — the 7 page types; answer-led, entity-clear, locally grounded
3. `docs/CONTENT-MODEL-MAP.md` — page type ↔ Sanity doc ↔ route ↔ JSON-LD contracts
4. `docs/internal_only/COMPLIANCE-COPY-RULES.md` — banned phrases and approved alternatives
5. The phase prompt you were given

If anything in this prompt conflicts with those docs, **the docs win**.

## Non-negotiable laws (violations = failed phase)

- **Architecture**: Sanity owns all content; Astro stays `output: 'static'`; GROQ in
  `packages/web/src/lib/queries.ts`; strict TS, no `any`; JSON-LD only via typed builders in
  `src/lib/structuredData.ts` — never inline.
- **NAP**: 525 E Olympia Ave, **Unit 9**, Punta Gorda, FL **33950** · **(844) 941-7673**
  (`+18449417673`, spells ROSE, never 7376) · info@houseofrosefl.com (never `book@`).
- **No memberships, ever**: Rose Pass, Rose Circle, Rose Rewards, Rose Method, `/plans` are
  dead. GLP-1 is a normal service (Diana's lane). No botanical/flowery names.
- **Provider lanes (never mix up)**: Amber — advanced facials, **PRF topical only, no
  injections**; Diana (RN) — injectables (tox/filler/**PRF injections/EZ-Gel**), IV
  hydration, GLP-1; Brandy — basic facials + facial waxing. Jane Iredale remains a retail product line,
  not a makeup-application service.
- **URLs**: every internal/absolute link to an inner page ends in `/`.
- **Positioning**: lead with "advanced aesthetics & wellness"; "med spa" allowed in
  meta/SEO/supporting copy, never denied, never the lead. Never "day spa". No medical
  claims — copy never diagnoses, treats, or cures.
- **Pricing truth**: prices come only from `docs/internal_only/services/**` and Sanity — never from web
  research, never invented.
- **Visual editing**: every Sanity-backed page/component keeps `data-sb-*` annotations
  (`src/lib/visualEditing.ts`); scaffold new pages with `npm run ve:new`; `npm run ve:check`
  must pass.
- **Never `return Astro.redirect()` from a prerendered page.**

## The experience doctrine (what "WOW" means here)

- **No repetitive CTAs.** "Call us" / "Book now" walls are banned. Each page ends with
  *contextual* next steps unique to that page — a comparison, a cost guide, a related
  concern, a provider, results. At most ONE booking CTA per page, phrased for that page.
- **Journey loops, no dead ends.** Every page links forward into the decision journey:
  concern → treatment → comparison → cost → results → book. A reader can traverse the whole
  treatment universe without ever hitting a page with nowhere useful to go.
- **Answer-first density.** Every content page opens by answering the question in its title
  in 2–3 sentences, then goes deep: mechanism, candidacy, what to expect, aftercare,
  honest limits, local grounding (Punta Gorda / Charlotte County / SW FL).
- **Differentiated everything.** No two pages share the same CTA label, closing section, or
  boilerplate. Section patterns may repeat; copy may not.

## Working style

- Use **parallel subagents** (Task tool) for research and independent audits; you
  orchestrate and integrate.
- Create files in place; update `docs/` when behavior changes; append a dated entry to
  `CHANGELOG.md` per phase.
- Sanity writes: **drafts only** + a review checklist for Amber; deploy schema via
  `sanity:deploy-schema` flow when schemas change.
- Push protocol: Desktop Commander `git push origin main` (Keychain access as `ambermin`).

## Definition of done (per phase)

`npm run build` passes · `npm run ve:check` passes · zero non-trailing-slash inner links ·
zero banned-phrase hits (per compliance doc §2) · zero orphan pages · CHANGELOG updated ·
phase deliverables listed in the phase prompt all exist.
