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
| Sidebar shortcuts | `stackbit.config.ts` → `sidebarButtons` | Opens site settings, the skin-analysis preview, Sanity Studio, and the Netlify project |
| Dev deps | root `devDependencies` | `@stackbit/cli`, `@stackbit/cms-sanity`, `@stackbit/types` — dev-only, never imported by the site |
| Script | `npm run dev:visual` | Starts Astro on `:3000` and the local Stackbit editor/proxy on `:8090` |
| Annotation helper | `packages/web/src/lib/visualEditing.ts` | `data-sb-*` helpers for inline click-to-edit |
| Env vars | `.env.example` → `.env.local` | `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_STUDIO_URL`, `SANITY_ACCESS_TOKEN` |

### Page model → route maps

The editor promotes only document types whose fields currently affect a public route. Slug-backed
models live in `PAGE_ROUTES`; active fixed-route singletons live in `SINGLETON_PAGE_ROUTES`.
Registered Sanity schemas that are absent from both maps remain data models, not editable public pages.

| Sanity type | Route |
|-------------|-------|
| `service` | `/services/{slug}` |
| Service collections | Local Astro catalog; not editable in Visual Editor |
| `concern` | `/concerns/{slug}` |
| `costGuide` | `/cost/{slug}` |
| `comparison` | `/compare/{slug}` |
| `localArea` | `/areas/{slug}` |
| `caseStudy` | `/results/{slug}` |
| `blogPost` | `/blog/{slug}` |
| `treatmentPackage` | `/packages/{slug}` |
| `provider` | `/about/providers/{slug}` |
| `product` | `/shop/{slug}` only when `PUBLIC_SHOP_ENABLED=true` |

| Active singleton type | Route |
|-----------------------|-------|
| `aboutPage` | `/about` |
| `privacyPolicy` | `/privacy-policy` |
| `termsOfService` | `/terms-of-service` |
| `rentARoom` | `/rent-a-room` |
| `janeIredalePage` | `/shop/jane-iredale` only when `PUBLIC_SHOP_ENABLED=true` |

Add a mapping only when the corresponding document fields are genuinely rendered on that route.

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

   The local orchestrator starts Astro on `http://localhost:3000`, then starts the
   Stackbit editor/proxy on `http://localhost:8090`. Open the
   `http://localhost:8090/_stackbit` URL printed by the command. The configured
   `devCommand` is for the cloud Visual Editor container; local startup is owned
   by `scripts/visual-editing/dev-visual.mjs`. If either port is occupied, stop
   the conflicting process before retrying rather than passing an ad-hoc port.

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

### How `npm run dev:visual` works locally

`stackbit dev` does **not** start the framework dev server — it runs the editor/
proxy on `:8090` and forwards preview requests to a dev server it expects on
`http://localhost:3000`. (The `devCommand` in `stackbit.config.ts` is consumed by
the **cloud** Visual Editor container, not local `stackbit dev`.) So local dev is
orchestrated by `scripts/visual-editing/dev-visual.mjs`, which:

1. extracts the Sanity schema (the Sanity-6 bridge above),
2. starts **Astro on `:3000`** from inside `packages/web` (so `@astrojs/tailwind`
   resolves `tailwind.config` — launching from the repo root yields empty
   Tailwind `content` and HTTP 500 on every page),
3. waits until Astro actually serves, then
4. starts **Stackbit** (`:8090`), which proxies the preview to Astro.

`Ctrl+C` tears down all three. Open the `http://localhost:8090/_stackbit` URL it
prints. `run-with-env` loads the repo-root `.env.local` regardless of cwd and
forwards termination signals so Astro is never orphaned.

### Troubleshooting `dev:visual`

| Symptom | Cause → Fix |
|---------|-------------|
| `stackbit: command not found` / `@stackbit/*` missing | Dev deps were omitted. Check `echo $NODE_ENV` (must not be `production`) and `npm config get omit` (must not be `dev`), then `npm install --include=dev`. |
| `[stackbit.config] Missing required env var "SANITY_PROJECT_ID"` | The four `SANITY_*` names above aren't in `.env.local`. Add them. |
| `Could not find Sanity file: …getGraphQLAPIs.js` | The connector patch isn't applied. Run `node scripts/visual-editing/apply-patches.mjs` (or `npm install`). |
| Editor starts but 0 models | `extract-sanity-schema` failed — run it directly to see the error: `node scripts/visual-editing/extract-sanity-schema.mjs`. |
| Editor loads but preview is blank / "can't connect" / 500 | Astro on `:3000` isn't serving. `dev-visual.mjs` waits for it, but if you run `stackbit dev` directly it won't start Astro. Use `npm run dev:visual`. If `:3000` is taken, free it (`lsof -nP -iTCP:3000 -sTCP:LISTEN`). |

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
  `ServiceCard.astro`, `TreatmentPackageCard.astro`.

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
- `PAGE_ROUTES` owns slug-routed page models and `SINGLETON_PAGE_ROUTES` owns
  fixed-route page models. A registered schema is not enough to enter either map:
  the public renderer must actually consume the document's fields. `ve:sync`
  checks the slug-routed map against dynamic routes and GROQ types.

---

## Singleton publication boundaries during the voice reset

The migration-era records remain registered and stored, but registration does not make their prose
public or editable. The current renderer contract is:

| Public route | Singleton record | Current publication boundary | Visual Editor page model |
|--------------|------------------|------------------------------|--------------------------|
| `/` | `homepage` | Reviewed local copy; stored CMS prose is archival/read-only | No |
| `/contact/` | `contactPage` | Reviewed local copy and form; stored CMS prose is archival/read-only | No |
| `/support/` | `supportPage` | Reviewed local copy and FAQs; query identity may annotate the region, but stored prose is not rendered | No |
| `/privacy-policy/` | `privacyPolicy` | Active canonical singleton plus reviewed local form/channel guidance | Yes |
| `/terms-of-service/` | `termsOfService` | Active canonical singleton with reviewed fallbacks | Yes |
| `/rent-a-room/` | `rentARoom` | Only `roomSpecs` is an active CMS copy source; the rest is reviewed local copy | Yes |
| `/skin-analysis/` | `skinAnalysis` | Reviewed local copy and form; stored CMS prose is archival/read-only | No |
| `/thank-you/` | `thankYou` | Reviewed local confirmation; query identity may annotate the region, but stored prose is not rendered | No |
| `/about/` | `aboutPage` | Active canonical singleton for the About index and practice story | Yes |

Disabled storefront singletons become page models only behind `PUBLIC_SHOP_ENABLED=true`. The Studio structure exposes the active
singleton sources; disconnected records remain schema-registered so stored data is preserved without
presenting it as live page copy.

Every Sanity-backed renderer still has to pass `npm run ve:check`. That coverage gate proves that
rendered CMS fields are annotated; it does not imply that every registered schema should be promoted
to a page model.

---

## References

- Inline editor (annotation reference): https://docs.netlify.com/manage/visual-editor/visual-editing/inline-editor/
- Netlify Visual Editor + Astro: https://docs.netlify.com/manage/visual-editor/frameworks/astro/
- Netlify Visual Editor + Sanity: https://docs.netlify.com/manage/visual-editor/content-sources/sanity/
- Config reference: https://visual-editor-reference.netlify.com/config
