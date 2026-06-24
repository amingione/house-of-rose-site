# Visual Editing — Netlify Visual Editor + Sanity

House of Rose uses **Netlify Visual Editor** (formerly Stackbit) for click-to-edit /
side-by-side visual editing. It sits **on top of** the existing Sanity project
(`4e7axyi7`) — it is **not** a second CMS and does **not** change the
`output: 'static'` architecture. Sanity remains the single source of truth.

> Why not Sanity's own Presentation tool? That path requires flipping Astro to
> SSR + draft-mode routes, which breaks the "Astro is static" architecture law.
> Netlify Visual Editor edits the same Sanity content while the site stays static.

---

## What's wired

| Piece | Location | Purpose |
|-------|----------|---------|
| Editor config | `stackbit.config.ts` (repo root) | Connects the editor to Sanity, maps page types → routes, runs Astro in the editor container |
| Dev deps | root `devDependencies` | `@stackbit/cli`, `@stackbit/cms-sanity`, `@stackbit/types` — dev-only, never imported by the site |
| Script | `npm run dev:visual` | `stackbit dev --port 4321` (runs the local visual editor) |
| Annotation helper | `packages/web/src/lib/visualEditing.ts` | `data-sb-*` helpers for inline click-to-edit |
| Env vars | `.env.example` → `.env.local` | `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_STUDIO_URL`, `SANITY_ACCESS_TOKEN` |

### Page model → route map

Mirrors the `CLAUDE.md` Routes table. Defined once in `stackbit.config.ts` (`PAGE_ROUTES`):

| Sanity type | Route |
|-------------|-------|
| `service` | `/services/{slug}` |
| `serviceCollection` | `/services/collections/{slug}` |
| `concern` | `/concerns/{slug}` |
| `costGuide` | `/cost/{slug}` |
| `comparison` | `/compare/{slug}` |
| `localArea` | `/areas/{slug}` |
| `caseStudy` | `/results/{slug}` |
| `blogPost` | `/blog/{slug}` |
| `treatmentPackage` | `/packages/{slug}` |

Add a new page-backed document type by adding one line to `PAGE_ROUTES`.

---

## Local setup

1. **Create an Editor token.** sanity.io/manage → project `4e7axyi7` → API → Tokens →
   add a token with **Editor** (read+write) permissions. Write is required for
   two-way sync.

2. **Add env vars** to `.env.local` (already gitignored). `stackbit.config.ts`
   auto-loads `.env.local`, so they live alongside the existing Sanity vars:

   ```dotenv
   SANITY_PROJECT_ID=4e7axyi7
   SANITY_DATASET=production
   SANITY_STUDIO_URL=https://studio.houseofrosefl.com
   SANITY_ACCESS_TOKEN=sk_your_editor_token
   ```

3. **Run the visual editor:**

   ```zsh
   npm run dev:visual
   ```

   This launches the Stackbit dev server on `http://localhost:3000`. It starts the
   Astro dev server inside the editor container via the configured `devCommand`
   (which reuses `scripts/run-with-env.mjs`, so `PUBLIC_SANITY_*` load exactly as
   in `npm run dev:web`). The editor shows the live site with a Pages panel,
   Content panel, and the sitemap navigator.

> Port note: Stackbit defaults to `3000` and expects the site dev server on a
> port it controls (`{PORT}`). The `dev:visual` script passes `--port 4321`; if
> 4321 is busy, change it or stop the standalone `npm run dev:web`.

---

## Cloud setup (collaborate with editors)

For non-developers to edit in the browser, enable Visual Editor on the Netlify
project:

1. Netlify → the `house-of-rose-web` project → **Visual editor** → enable / import
   the repo.
2. Set the same four `SANITY_*` env vars in the Visual Editor project settings
   (the cloud container does **not** read `.env.local`).
3. Netlify provisions a container that runs the `devCommand` from
   `stackbit.config.ts` — no extra config needed.

See: https://docs.netlify.com/manage/visual-editor/get-started/visual-editor-walkthrough-help/

---

## Levels of editing

1. **Content editor** (works now) — edit any Sanity document in a form panel with
   live preview. Zero annotation needed.
2. **Page editor** (works now) — `modelExtensions` in `stackbit.config.ts`
   expose page-backed documents with their URLs.
3. **Inline click-to-edit** (DONE for all Sanity-backed pages) — click text in the
   preview to edit it in place. Every Sanity-backed page + the shared components
   are annotated; coverage is enforced (see Automation below).

### Annotation rules (how it's wired)

Inline editing maps DOM elements to Sanity fields via `data-sb-*` attributes.
Always use the helpers in `packages/web/src/lib/visualEditing.ts` — never hand-write
the attributes.

- **Object id** — wrap the region that renders a document in `{...sbObjectId(doc._id)}`.
  All annotated fields must be DOM descendants of it. (`doc._id` must be in the GROQ
  projection — it already is across `queries.ts`.)
- **Field path** — `{...sbFieldPath('title')}`. The name is the **Sanity schema field
  name**, NOT a GROQ alias (e.g. we annotate `title`, never the aliased `slug`).
- **Arrays use the numeric INDEX**, not `_key`:
  `{...sbFieldPathParts('faqs', i, 'question')}` → `faqs.0.question`
  (the Sanity CSI maps index → `_key` when saving). String arrays: `sbFieldPath(\`process.\${i}\`)`.
- **Nested objects** use dot paths: `sbFieldPath('optionA.label')`.
- **Referenced documents** (a card that renders *another* doc — related services,
  treatments, packages' services, etc.) are **rescoped** with their own
  `{...sbObjectId(ref._id)}`, then annotated relative to that ref.
- **Components** forward annotations via an optional `objectId` prop and stay inert
  when it's omitted (so hardcoded usage like the homepage is unaffected). See
  `ServiceCard.astro`, `TreatmentPackageCard.astro`, `MembershipTiers.astro`.

```astro
---
import { sbObjectId, sbFieldPath, sbFieldPathParts } from "@/lib/visualEditing";
---
<article {...sbObjectId(service._id)}>
  <h1 {...sbFieldPath("title")}>{service.title}</h1>
  {service.faqs?.map((faq, i) => (
    <div>
      <h3 {...sbFieldPathParts("faqs", i, "question")}>{faq.question}</h3>
      <p {...sbFieldPathParts("faqs", i, "answer")}>{faq.answer}</p>
    </div>
  ))}
</article>
```

The attributes are inert `data-*` in production — no runtime cost, no effect on the
static build. Reference: <https://docs.netlify.com/manage/visual-editor/visual-editing/inline-editor/>.

---

## Automation — keeping coverage at 100%

So new pages/components can't silently ship without click-to-edit:

| Command | What it does |
|---------|--------------|
| `npm run ve:check` | Fails if any **Sanity-backed** page/component lacks `data-sb-*` annotations. Allow-list (with reasons) lives in `scripts/visual-editing/check-coverage.mjs`. |
| `npm run ve:sync` | Verifies `PAGE_ROUTES` ↔ detail routes ↔ GROQ types are in sync. `-- --fix` stubs missing routes. |
| `npm run ve:new -- component <Name>` | Scaffolds a **pre-annotated** component. |
| `npm run ve:new -- page --type <t> --route /x/[slug] --query X_BY_SLUG_QUERY` | Scaffolds a pre-annotated detail page **and auto-registers** its route in `PAGE_ROUTES`. |

A **git pre-commit hook** (installed automatically by the `prepare` script on
`npm install`) runs `ve:sync` + `ve:check` and blocks the commit on any gap.
Re-install manually with `node scripts/visual-editing/install-git-hook.mjs`.

> This is the "auto-wire new things into the config" mechanism: scaffolding a new
> page registers its route in `stackbit.config.ts`, and the hook refuses commits
> that introduce un-annotated Sanity-backed files.

---

## Guardrails

- `@stackbit/*` are **devDependencies** and are never imported by site code — the
  production bundle and static output are unchanged.
- Visual Editor writes go to the **same** Sanity dataset (`production`). Consider a
  separate dataset or draft workflow before giving many editors write access.
- `PAGE_ROUTES` in `stackbit.config.ts` is the source of truth for page types —
  `ve:sync` keeps it honest against `CLAUDE.md`'s Routes table.

---

## Phase 3 — migrating the hardcoded pages into Sanity (in progress)

Eight pages still render hardcoded content in `.astro` and therefore can't be
inline-edited until modeled in Sanity: `index` (homepage), `memberships`,
`contact`, `privacy-policy`, `rent-a-room`, `skin-analysis`, `thank-you`.

Plan (each page is a vertical slice):

1. **Model** — add a Sanity schema. A reusable `page` document (hero + Portable
   Text body + flexible sections) covers the simple pages (`privacy-policy`,
   `rent-a-room`, `skin-analysis`, `thank-you`, `contact`); `homepage` and
   `memberships` get bespoke singletons.
2. **Deploy schema** — `npm run deploy:studio` (or `sanity deploy` in
   `packages/studio`).
3. **Seed content** — a migration script (`packages/studio/scripts/seed-*.ts`
   using `@sanity/client` `createOrReplace`) ports the current hardcoded copy into
   documents so nothing is lost.
4. **Rewire** — replace the page's hardcoded constants with a `sanityFetch`, then
   annotate per the rules above.
5. **Verify** — `npm run ve:check` (coverage), `npm run dev:visual` (preview).

Steps 2–3 and the final build **must run on your machine** (the Studio deploy +
content seed write to the live `production` dataset and need the Sanity CLI/login).

---

## References

- Inline editor (annotation reference): https://docs.netlify.com/manage/visual-editor/visual-editing/inline-editor/
- Netlify Visual Editor + Astro: https://docs.netlify.com/manage/visual-editor/frameworks/astro/
- Netlify Visual Editor + Sanity: https://docs.netlify.com/manage/visual-editor/content-sources/sanity/
- Config reference: https://visual-editor-reference.netlify.com/config
