# "Publish to Site" Button (Zapier ← Notion checkbox)

Draft freely in Notion. Nothing reaches the website until you tick a checkbox — that
fires a Zap, which runs the GitHub Action, which syncs Notion → Sanity and rebuilds the site.

```
Notion checkbox ✅  →  Zapier  →  GitHub Action (sync-notion.yml)  →  Sanity write  →  Netlify rebuild
```

The Action only runs on demand (`workflow_dispatch` + `repository_dispatch`). A normal
code push never triggers a content sync, so drafts stay private until you say so.

---

## Step 1 — Add GitHub repository secrets

In `amingione/house-of-rose-site` → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
|--------|-------|
| `NOTION_TOKEN` | Your Notion internal integration token (the four DBs must be connected to it). |
| `SANITY_API_WRITE_TOKEN` | A Sanity write token (Studio → API → Tokens → "Editor"). |
| `NETLIFY_BUILD_HOOK_URL` | *(optional)* A Netlify build hook URL — Site → Build & deploy → Build hooks → Add. Without it the sync still runs; the site just won't auto-rebuild. |

Project id / dataset / API version are already hard-coded in the workflow (`4e7axyi7` / `production` / `2025-04-26`).

## Step 2 — Make a GitHub token for Zapier

Zapier needs to call the GitHub API. Create a **fine-grained personal access token**
(GitHub → Settings → Developer settings → Fine-grained tokens):

- Repository access: only `amingione/house-of-rose-site`
- Permissions: **Contents → Read and write** (this is what `repository_dispatch` requires)
- Copy the token — you'll paste it into the Zap.

## Step 3 — A Notion control surface

Add a single control row you can toggle. Two options:

- **Simple:** add a checkbox property named **`Publish to site`** to any small control row (even a one-row database called "Site Controls").
- Tick it to publish; the last Zap step unchecks it so it's ready next time.

## Step 4 — Build the Zap

**Trigger** — Notion → *Updated Database Item*
- Database: your control row's database
- (Zapier polls every 1–15 min depending on plan.)

**Filter** — only continue if `Publish to site` **is true**.

**Action** — Webhooks by Zapier → *Custom Request*  (requires a paid Zapier plan)
- Method: `POST`
- URL: `https://api.github.com/repos/amingione/house-of-rose-site/dispatches`
- Data Pass-Through: off
- Data (JSON):
  ```json
  { "event_type": "sync-notion" }
  ```
- Headers:
  | Key | Value |
  |-----|-------|
  | `Authorization` | `Bearer YOUR_FINE_GRAINED_TOKEN` |
  | `Accept` | `application/vnd.github+json` |
  | `X-GitHub-Api-Version` | `2022-11-28` |
  | `User-Agent` | `house-of-rose-zap` |

**Action (optional, recommended)** — Notion → *Update Database Item*
- Set `Publish to site` back to unchecked, so the toggle is reusable.

## Step 5 — Test

1. Tick **Publish to site** in Notion.
2. Watch the run appear under the repo's **Actions** tab (`Sync Notion → Sanity`).
3. It syncs Sanity, then (if the build hook is set) Netlify rebuilds. New catalog data is live.

A successful `dispatches` call returns HTTP **204** with an empty body — that's expected.

---

## No-Zapier fallbacks

- **GitHub button:** Actions tab → *Sync Notion → Sanity* → **Run workflow**. Same result, pressed in GitHub (works in the mobile app too).
- **Notion native webhook:** if you'd rather skip Zapier entirely, a Notion button block can POST to a **Netlify build hook** URL directly — but that path runs the sync inside the Netlify build instead of the Action. Ask and I'll wire that variant.

## What it does / doesn't do

- Upserts by deterministic id — re-runs update, never duplicate.
- Preserves website-only fields you author in the Studio (see `docs/notion-sync.md`).
- Does **not** delete: removing a Notion row won't remove the Sanity doc (delete it in the Studio).
