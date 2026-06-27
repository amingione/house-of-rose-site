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
| Script | `npm run dev:visual` | `stackbit dev` (runs the local visual editor on `:3000`) |
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

> Port note: `stackbit dev` serves the **editor** on `http://localhost:3000`
> (its default) — this is the origin you open, and the one registered in Sanity
> CORS, so do **not** override it with `--port`. The `--port` flag changes the
> editor port, **not** the Astro preview port; passing `--port 4321` moves the
> editor onto an origin Sanity CORS doesn't allow, which breaks content
> loading/saving. The Astro preview runs on a separate port that Stackbit
> assigns itself and injects into the `devCommand` via the `{PORT}` placeholder,
> so you never set it by hand. If `3000` is already in use, free it (or pass
> `--port <free-port>` **and** add that origin to Sanity CORS).

---

## Sanity 6 compatibility bridge (REQUIRED — read before debugging `dev:visual`)

`@stackbit/cms-sanity@0.2.93` is the **latest published** connector and is frozen
at the Sanity **v3** era. It reads the Studio schema by monkey-patching a Sanity
internal CLI file (`node_modules/sanity/lib/_internal/cli/threads/getGraphQLAPIs.js`).
This Studio runs **`sanity@6`**, which deleted that internal CLI surface entirely
(the CLI is now the separate `@sanity/cli` package). Out of the box `stackbit dev`
therefore dies with: `Could not find Sanity file: …getGraphQLAPIs.js`.

We bridge it **dev-only**, without downgrading Sanity:

| Piece | What it does |
|-------|--------------|
| `scripts/visual-editing/extract-sanity-schema.mjs` | esbuild-bundles `packages/studio/schemas/index.ts` (Sanity/React external) and writes the authored `schema.types` to `packages/studio/.stackbit/sanity-schema.json` in the exact shape the connector's `fetchSchema()` returns (`{ projectId, dataset, title, models }`). Runs first in `dev:visual`. |
| `patches/@stackbit+cms-sanity+0.2.93.patch` | Teaches the connector's `fetchSchema()` to return that JSON when present (instead of the dead internal-file path). Generated with `patch-package`. |
| `scripts/visual-editing/apply-patches.mjs` | `prepare`-time reapply of `patches/` after every `npm install`. Non-fatal if `patch-package` is missing (prod / `--omit=dev`). |

`.stackbit/` is gitignored — the schema JSON is regenerated on each `dev:visual`.
After editing any **Studio schema**, just re-run `npm run dev:visual` to refresh it.

> Validation/preview/`hidden` functions are dropped (JSON round-trip). The editor
> only needs field **shapes**, so this is intentional and harmless.

### Env var names the editor needs (NOT the `PUBLIC_*` ones)

`stackbit.config.ts` calls `requireEnv()` for names **distinct** from the site's
`PUBLIC_SANITY_*`. They must exist in `.env.local`:

```dotenv
SANITY_PROJECT_ID=4e7axyi7
SANITY_DATASET=production
SANITY_STUDIO_URL=https://studio.houseofrosefl.com
SANITY_ACCESS_TOKEN=sk_…   # Editor (read+write); reuse SANITY_API_WRITE_TOKEN's value
```

### Troubleshooting `dev:visual`

| Symptom | Cause → Fix |
|---------|-------------|
| `stackbit: command not found` / `@stackbit/*` missing | Dev deps were omitted. Check `echo $NODE_ENV` (must not be `production`) and `npm config get omit` (must not be `dev`), then `npm install --include=dev`. |
| `[stackbit.config] Missing required env var "SANITY_PROJECT_ID"` | The four `SANITY_*` names above aren't in `.env.local`. Add them. |
| `Could not find Sanity file: …getGraphQLAPIs.js` | The connector patch isn't applied. Run `node scripts/visual-editing/apply-patches.mjs` (or `npm install`). |
| Editor starts but 0 models | `extract-sanity-schema` failed — run it directly to see the error: `node scripts/visual-editing/extract-sanity-schema.mjs`. |

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

## Phase 3 — hardcoded pages migrated into Sanity ✅ DONE

All formerly-hardcoded pages are now Sanity-backed singletons (schema deployed,
content seeded + published to `production`, pages rewired with Sanity-first +
original-copy fallbacks, and annotated). Edit them in Studio → **Home Page** /
**Pages**:

| Page | Sanity type (singleton `_id`) |
|------|-------------------------------|
| `/` | `homepage` |
| `/memberships` | `membershipsPage` |
| `/contact` | `contactPage` (form untouched) |
| `/privacy-policy` | `privacyPolicy` |
| `/rent-a-room` | `rentARoom` (form untouched) |
| `/skin-analysis` | `skinAnalysis` |
| `/thank-you` | `thankYou` |

Every site page now passes `npm run ve:check` (0 missing). Singletons are edited
via the Studio **Pages** group and inline on the live preview; they intentionally
aren't in `PAGE_ROUTES` (that map is for slug-routed document types only).

<details><summary>Original migration plan (for reference / future pages)</summary>

Eight pages once rendered hardcoded content in `.astro`: `index` (homepage),
`memberships`, `contact`, `privacy-policy`, `rent-a-room`, `skin-analysis`,
`thank-you`.

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

</details>

---

## References

- Inline editor (annotation reference): https://docs.netlify.com/manage/visual-editor/visual-editing/inline-editor/
- Netlify Visual Editor + Astro: https://docs.netlify.com/manage/visual-editor/frameworks/astro/
- Netlify Visual Editor + Sanity: https://docs.netlify.com/manage/visual-editor/content-sources/sanity/
- Config reference: https://visual-editor-reference.netlify.com/config
