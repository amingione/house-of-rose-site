# "Publish to Site" Button (Zapier ← Notion checkbox → Netlify)

Draft freely in Notion. Nothing reaches the website until you tick a checkbox — that
fires a Zap, which POSTs to a Netlify **content build hook**, which makes Netlify run
the Notion → Sanity sync and rebuild the site.

```
Notion checkbox ✅  →  Zapier (Webhooks POST)  →  Netlify content build hook
                       →  Netlify build runs sync + rebuild  →  live site
```

No GitHub token, no Sanity client install. The build hook URL is the only secret, and
it's unauthenticated by design (knowing the URL is the permission).

## Why drafts stay safe

The sync runs **inside the Netlify build**, but only when the build was started by the
content hook. `scripts/netlify-content-sync.mjs` checks `INCOMING_HOOK_TITLE`:

- Triggered by the content hook (title contains "Notion" / "Publish content") → run the sync, then build.
- Any normal git push / deploy → skip the sync, just build.

So pushing code never pulls your in-progress Notion edits onto the site.

---

## Step 1 — Create the Netlify content build hook

Netlify → site **house-of-rose-web** → Site configuration → Build & deploy → **Build hooks** → Add build hook:

- Name: **`Publish content from Notion`**  ← the name matters; it must contain "Notion" or "Publish content"
- Branch: `main`
- Save, then copy the URL (looks like `https://api.netlify.com/build_hooks/abc123…`).

## Step 2 — Add Netlify environment variables

Same site → Site configuration → Environment variables. Confirm/add:

| Variable | Value |
|----------|-------|
| `NOTION_TOKEN` | Your Notion internal integration token (the four DBs connected to it). |
| `SANITY_API_WRITE_TOKEN` | Sanity project API token with write access to the synced document types. Must be available to Builds, not only Functions. |
| `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` / `PUBLIC_SANITY_API_VERSION` | Already set. |

(Only `NOTION_TOKEN` is likely new.)

## Step 3 — A Notion control checkbox

Add a checkbox property named **`Publish to site`** to a small one-row "Site Controls"
database (or any control row). Tick it to publish.

## Step 4 — Build the Zap

**Trigger** — Notion → *Updated Database Item*
- Database: your control row's database.

**Filter** — only continue if `Publish to site` **is true**.

**Action** — Webhooks by Zapier → *POST*
- URL: your Netlify build hook URL from Step 1
- Payload type: `json`
- Data: *(leave empty — an empty POST is all the hook needs)*
- Unflatten: yes (default)

**Action (optional, recommended)** — Notion → *Update Database Item*
- Set `Publish to site` back to unchecked so the toggle is reusable.

## Step 5 — Test

1. Tick **Publish to site** in Notion.
2. In Netlify → Deploys, a new deploy starts; its log shows
   `[content-sync] Triggered by "Publish content from Notion" — running Notion → Sanity sync...`.
3. When it finishes, the synced catalog is live.

A direct test without Zapier: `curl -X POST "<your build hook URL>"`.

---

## Free fallback button (no Zapier)

`.github/workflows/sync-notion.yml` does the same thing from GitHub: Actions tab →
*Publish content (Notion → site)* → **Run workflow**. Add the build hook URL as a repo
secret named `NETLIFY_CONTENT_HOOK_URL` for it to work. Handy from the GitHub mobile app.

## What it does / doesn't do

- Upserts by deterministic id — re-runs update, never duplicate.
- Preserves website-only fields authored in the Studio (see `docs/notion-sync.md`).
- Does **not** delete: removing a Notion row won't remove the Sanity doc (delete it in the Studio).
- A failed sync fails the deploy (so problems are visible) rather than publishing partial data.
