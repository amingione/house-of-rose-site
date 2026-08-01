# PHASE 5 — QA & Verification (always last)

Prepend `00-MASTER-PROMPT.md`. Goal: prove the definition of done with evidence, not
assertion. Run independent verification subagents where noted.

## Gates (all must pass)

1. **Build**: `npm run build` from repo root (web + studio). Zero errors, zero TS
   diagnostics. `npx tsc --noEmit` in `packages/web`.
2. **Visual editing**: `npm run ve:check` and `npm run ve:sync` clean.
3. **Journeys**: `scripts/check-journeys.mjs` — no duplicate CTA labels, no dead ends, no
   orphans, no retired routes (`/memberships/`, `/rose-circle/`, `/plans/`).
4. **Links**: crawl `dist/` — every internal inner-page href ends in `/`; no 404s against
   the route inventory; external links resolve (HEAD check, report-only).
5. **Structured data**: extract JSON-LD from every built page; validate shape per
   `CONTENT-MODEL-MAP.md` contracts; `LOCAL_BUSINESS` matches `siteSettings` NAP exactly
   (phone `+18449417673`, Unit 9, 33950).
6. **Compliance sweep** (independent subagent): grep `dist/` + Sanity drafts for every
   banned phrase in `COMPLIANCE-COPY-RULES.md` §2, retired brand terms, botanical names,
   `7376`, `33982`, `Ste`/`Suite`, "day spa", membership language, and public-NAP use of `book@`.
   The confirmed `book@houseofrosefl.com` alias is allowed only in rental/booking `mailto:` links.
7. **Content spot-audit** (independent subagent): sample 10 pages across page types; score
   against the experience doctrine — answer-first opener, unique CTA labels, ≥2 contextual
   forward links, local grounding, no boilerplate clones. All 10 pass or fix and re-run.
8. **Accessibility**: heading hierarchy, image alts, contrast per `COLOR-CONTRAST.md`,
   keyboard focus on interactive components (spot-check via chrome-devtools if available).
9. **Fact-check pricing**: every price shown on a page traces to `docs/internal_only/pricing/**`,
   `docs/internal_only/services/Diana/**`, or a Sanity doc. List any untraceable price as P0.

## Wrap-up

- `docs/internal_only/research/_qa-report.md`: each gate, evidence (command output summaries, counts),
  and anything waived with justification.
- Update `CHANGELOG.md` (dated entry per phase) and the `CLAUDE.md` routes table.
- Remind Amber: publish drafts via `_publish-checklist.md`, then push via Desktop Commander
  (`git push origin main`) and verify Netlify deploys for both sites.
