# Site Elevation Prompt Pack

Phased prompts for Claude Code (**Fable 5, high reasoning effort**) to elevate
houseofrosefl.com into an informationally heavy, one-of-a-kind knowledge destination —
perfect what exists, research every treatment deeply, kill repetitive CTAs, and build
journey loops so no page dead-ends.

## How to run

```zsh
cd ~/LocalStorm/Workspace/DevProjects/house_of_rose/house-of-rose-site
claude --model fable-5
```

Then paste the master prompt, followed by one phase per session (keeps context tight):

| Order | File | What it does |
|-------|------|--------------|
| 0 | `00-MASTER-PROMPT.md` | Mission, binding laws, definition of done. Paste at the top of **every** phase session. |
| 1 | `01-audit-and-perfect.md` | Audit + perfect everything already built. |
| 2 | `02-research-agents.md` | Parallel research agents — every treatment, service, product line. |
| 3 | `03-cta-and-journey-loops.md` | CTA differentiation + internal-linking journey loops. |
| 4 | `04-new-pages-and-sanity.md` | New informational pages, schemas, Sanity seeding. |
| 5 | `05-qa-verification.md` | Build, link-crawl, JSON-LD, compliance, coverage gates. |

Phases 1 and 2 can run in parallel sessions. 3 and 4 depend on 2's research briefs.
Phase 5 runs last, always.

## Rules of the pack

- Prompts reference the repo's **binding docs** (`SEO-AEO-PLAYBOOK.md`,
  `CONTENT-MODEL-MAP.md`, `COMPLIANCE-COPY-RULES.md`, `CLAUDE.md`). If a prompt and a
  binding doc conflict, the binding doc wins.
- Research briefs land in `docs/research/` and are the single input for phases 3–4.
- All Sanity writes are made as **drafts** with a review checklist — Amber publishes.
