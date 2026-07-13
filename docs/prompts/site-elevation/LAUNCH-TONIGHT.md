# LAUNCH TONIGHT — Single-Session Ship Prompt

You are Claude Code running **Fable 5 at high reasoning effort** in `house-of-rose-site`.
Mission: the site goes **public tonight**. No redesign, no new schemas, no new page types —
finish and polish what exists until it is launch-clean. Timebox everything; fix > perfect.

Binding docs (read first, they win over this prompt): `CLAUDE.md`,
`docs/COMPLIANCE-COPY-RULES.md`, `docs/SEO-AEO-PLAYBOOK.md`, `docs/CONTENT-MODEL-MAP.md`.

## Scope rules

- **In**: fixing broken/wrong/placeholder content, CTA repetition, dead links, compliance,
  NAP, metadata, JSON-LD, accessibility blockers, build errors.
- **Out**: new pages, new schemas, research programs, structural refactors, React islands.
  If you find a gap that needs a new page, log it in `docs/research/_post-launch.md` and
  move on.

## Pass 1 — Blockers (parallel subagents, then fix everything found)

1. **Build & types**: `npm run build` + `npx tsc --noEmit` in `packages/web`. Fix all.
2. **Placeholder sweep**: grep pages + Sanity-published content for lorem, TODO, "coming
   soon", empty fallbacks rendering blank sections, broken image refs. Fix or hide.
3. **Compliance & facts**: banned phrases (compliance doc §2), retired terms (Rose Pass /
   Circle / Rewards / Method, memberships, `/plans`), botanical names, "day spa",
   `book@`, `7376`, `33982`, `Ste`/`Suite`. NAP everywhere = 525 E Olympia Ave **Unit 9**,
   Punta Gorda FL **33950** · (844) 941-7673 · info@houseofrosefl.com. Provider lanes
   correct (Amber = PRF **topical only**; Diana = injections/IV/GLP-1).
4. **Links**: crawl built output — inner links end in `/`, no 404s, no links to retired
   routes, redirects in `packages/web/netlify.toml` intact.

## Pass 2 — Polish (only after Pass 1 is clean)

5. **CTA de-duplication, cheap version**: no new components. On each page, rewrite the
   booking CTA label to be page-specific ("Book a PRF consult with Diana", "Start with an
   AI skin analysis") and make sure every page has at least one contextual forward link to
   a related service/comparison/cost page. Reuse existing components and Sanity fields.
6. **Metadata & JSON-LD**: every page has unique title/description; JSON-LD via
   `structuredData.ts` builders matches its page type; `LOCAL_BUSINESS` matches
   `siteSettings` exactly. Sitemap + `llms.txt` build correctly.
7. **A11y quick wins**: image alts, heading order, focus visibility. Nothing structural.

## Pass 3 — Verify & ship

- Re-run: build, `npm run ve:check`, link crawl, compliance grep. All clean.
- Write `docs/research/_launch-report.md`: what was fixed, what was deferred to
  `_post-launch.md`, evidence per gate.
- Update `CHANGELOG.md`. Then tell Amber to push via Desktop Commander
  (`git push origin main`) and verify both Netlify deploys (web + studio) go green and
  https://houseofrosefl.com/ renders.
