# House of Rose — Full Service-Page Deep Research & Rewrite

**Recommended model:** Fable 5 in Claude Code — it sits in Anthropic's Mythos tier, above Opus, and this task's depth (multi-source research + long-horizon consistency across 9 pages) benefits from the strongest model available. Its extra safety guardrails are specific to biology, cybersecurity, and LLM R&D — none of which apply here. Opus 4.8 is the fallback if Fable 5 isn't selectable on your plan.

**MODE — pick one, delete the other line before running:**
- Sequential with checkpoints: finish all six phases on one page, output the changelog entry, then stop and wait for my go-ahead before starting the next page.
- Full autonomous batch: run all pages through all six phases and give me one master report at the end.

---

## ROLE

You are running a full page-by-page content, SEO, and compliance overhaul of every treatment/service page on the House of Rose Aesthetics site. You have repo access. Depth and accuracy outrank speed at every step — this is not a bulk content generation pass, it is a research-then-write pass, one page at a time.

## MANDATORY PRE-WORK — do not write a single word of content before this is done

1. Locate and read the **governance folder** in this repo in full (check repo root, `/docs/governance`, and any path referenced from `CLAUDE.md`). If you genuinely cannot find a folder by that name, search the repo for it before proceeding and tell me if it's actually absent — don't skip it.
2. Read, in this order: `CLAUDE.md`, `AGENTS.md`, `SEO-AEO-PLAYBOOK.md`, `CONTENT-MODEL-MAP.md`, `ALL-SERVICES-PRICING.MD`.
3. Read the existing treatment-page system already built: the Sanity object types, GROQ projections, TypeScript types, Astro components, and the build-time compliance verifier covering the current treatment pages and their 8 content blocks (who it's for, benefits, downtime, pricing, provider qualifications, aftercare, FAQs, why House of Rose). You are extending this system, not inventing a new one.
4. Confirm you understand these settled rules before starting:
   - Scope of practice is closed — do not re-raise it as a blocker.
   - Geo-modified content never goes on service pages — it lives only in `localArea` doc types.
   - `ALL-SERVICES-PRICING.MD` (GG-verified) is the only source for any price. Never estimate or round.
   - Rose Circle / membership "collagen bank" language is permanently dead — never reintroduce it.
   - No duplicate or parallel canonical docs — one source per topic.

Report back a short confirmation of what's in the governance folder and the five docs above before touching any page.

## NON-NEGOTIABLE VOICE RULES — apply to every sentence you write

- No hype, no exclamation points, ever.
- Banned words/phrases: "pamper," "indulge," "amazing," "revolutionary," "cutting-edge," "unlock," "elevate," "journey," "transform your life," "game-changer" — and anything else that reads like a generic AI-written med spa page.
- No throat-clearing openers ("In today's world...", "When it comes to..."), no restating the question, no filler transitions.
- Declarative, clinically grounded, hospitality-minded tone. Confident and specific, never salesy.
- Never say the same thing twice in different words on one page — every sentence adds new information.
- Wherever a practitioner is named, the license type goes with the name (§456.072(1)(t)) — e.g. "Amber, licensed esthetician" / "Diana, RN."

## WORKFLOW — repeat all six phases for each service page

### Phase 1 — Research
- Pull the treatment's current organic keywords, ranking position, and top-ranking competitor URLs (use the Ahrefs MCP if connected: organic keywords, keyword gap, rank tracker, competitor overview).
- Identify the 3–5 pages currently ranking for this treatment's core queries among Southwest Florida med spas/dermatology practices (Naples, Fort Myers, Charlotte County, Punta Gorda). Extract exactly what topics, questions, and depth they cover that we don't.
- Pull the real clinical mechanism — how the treatment actually works on skin — from real sources: the PubMed MCP and the manufacturer/training materials already in the repo library (e.g. the `/library` PRF reference set), not from general knowledge. Note what you sourced so I can spot-check it.
- Collect every question competitor pages and "People Also Ask" surface for this treatment, so the FAQ block answers all of them plus anything they miss.

### Phase 2 — Content
- Write to the existing 8-block model, but go deeper wherever Phase 1 shows a competitor or a real patient question isn't covered yet.
- Length follows topical coverage, not a word-count target — nothing padded.
- Every specific claim (downtime, mechanism, results timeline) has to trace back to something from Phase 1, not general assertion.
- FAQ block: phrase questions as an actual person (or AI assistant) would ask them, answer in the first sentence, expand after — structured for both Google FAQ rich results and AI-assistant answer extraction.

### Phase 3 — Imagery
- **Before/after and result imagery:** real House of Rose clinical photos are the priority — pull from the repo's existing asset library first and use those wherever they exist. Where no real photo exists for a treatment, an illustrative before/after-style rendering may be generated. It must:
  - Show real-looking skin — natural texture, pores, and minor imperfections. No airbrushed, plastic, or over-smoothed AI skin.
  - Depict a degree of change that's clinically plausible for that specific treatment, matched to what Phase 1 research says the treatment actually produces — not exaggerated, not understated.
  - Be labeled as illustrative/conceptual in alt text and any on-page caption, and not styled to mimic actual clinical documentation (no matched lighting/angle grids, timestamps, or patient-file formatting implying a real, specific patient).
  - Never caption a generated image as an actual client outcome.
- **Mechanism/process diagrams** (how the treatment works on skin — cross-section, biological process, timeline): fine to generate, since these are clearly illustrative, not photographic result claims. Match the brand palette (Gold #AB9040, True Black #222222, Cream #F8F6F2) and Cormorant Garamond/Arial typography so it reads as House of Rose material, not a stock illustration.
- **Facility/interior images:** check the repo for existing real photography of 525 E. Olympia Ave first. If you must generate one, reference our actual documented facility (6 treatment rooms, reconfigurable champagne-bar lobby, Rose Circle room, gold monogram, brand palette) specifically enough that it doesn't read as generic AI med-spa stock art. Flag every generated image as generated in your changelog so I can swap in real photography later.

### Phase 4 — Schema & technical SEO
- Match the JSON-LD schema types and patterns already implemented elsewhere in the repo (Service/MedicalProcedure, FAQPage, LocalBusiness) — extend, don't invent a new pattern.
- Meta title/description, Open Graph tags, canonical URL, and alt text for every image — same voice rules apply to metadata too.
- Confirm the page renders correctly and is crawlable on mobile.

### Phase 5 — Linking
- Internal links: wherever a treatment, condition, or concept in the copy has its own page (other service pages, the relevant `localArea` page, a provider bio), link the specific descriptive phrase — not "click here."
- External links: only to authoritative sources (PubMed, manufacturer clinical data, FDA/medical board) to back a specific clinical claim — never to a competitor.
- Don't over-link — one link per genuinely useful destination per section, not per mention.

### Phase 6 — Compliance & QA
- Run the existing build-time compliance verifier on the page.
- Re-check: pricing matches `ALL-SERVICES-PRICING.MD` exactly, credentials appear everywhere a name does, no geo-modified H1 or `localSeo` field was added to this service page, no banned voice words survived, nothing duplicates an existing canonical doc.
- If anything is uncertain — a clinical claim you can't source, a price that looks off, a scope question — stop and flag it to me by name. Don't guess, and don't quietly soften a real gap into vague language.

## REPORTING

- After each page: a 4–6 line changelog — what was researched, what changed, which images are real vs. generated vs. still needed, compliance verifier result.
- After all pages: one master table — page | target keywords | competitors analyzed | content gaps closed | images (real/generated/needed) | schema added | compliance status.

## HONEST NOTE ON "OUTRANKING"

This pass makes every page more comprehensive, accurate, and technically sound than every page currently ranking above ours for its target queries — that part is fully in your control and is the actual goal. Final ranking position also depends on backlinks, domain authority, and algorithm factors outside the page itself, so treat "outrank" as "close every content and topical gap against current competitors," not as a guaranteed SERP outcome.

## TOOLS AVAILABLE IN THIS ENVIRONMENT — use them

**Before starting Phase 1 on the first page, confirm Ahrefs and PubMed are actually connected as MCP servers in this Claude Code session** (`claude mcp list`), not just available in claude.ai chat — they're separate configurations. If either is missing, stop and tell me before falling back to plain web search for that data — Ahrefs' real keyword/ranking data and PubMed's peer-reviewed sourcing are meaningfully better than generic search results for this and I'd rather pause than quietly downgrade.

- Ahrefs MCP (organic keywords, keyword gap, rank tracker, competitor overview)
- PubMed MCP (clinical source verification)
- Built-in WebSearch/WebFetch as a fallback only, and only after flagging that Ahrefs/PubMed weren't available
- SEO/AEO and schema-markup skills if installed in this environment
- Website-copywriting skill tuned to luxury med spa voice, if installed
- Filesystem/Desktop Commander access to the repo for the governance folder and canonical docs

## PAGE LIST

Use the treatment pages already scoped in the current content model (the 9 pages built with the 8-block system). If that list has changed since this prompt was written, paste the current list here before running.

## START

Begin with the mandatory pre-work confirmation. Then tell me which page you're starting with and begin Phase 1.
