# IndexNow — House of Rose

IndexNow lets us notify participating search engines (Bing, Yandex, Seznam,
Naver, and others) the moment our content changes, instead of waiting for them
to recrawl on their own schedule. One ping to any participating endpoint
propagates to all of them.

Reference: <https://www.bing.com/indexnow/getstarted#implementation>

## How it's set up

| Piece | Where | Notes |
|-------|-------|-------|
| **API key** | `packages/web/public/c1b6b0cbabc948d3bb8942418553a2f2.txt` | Served at `https://houseofrosefl.com/c1b6b0cbabc948d3bb8942418553a2f2.txt`. The file body equals the key (Bing verifies this). |
| **Submission CLI** | `scripts/indexnow.mjs` | Reads the live sitemap, derives host + key, POSTs to IndexNow. |
| **npm scripts** | root `package.json` | `indexnow`, `indexnow:dry` (run via `run-with-env.mjs`, which loads `.env.local`). |

The key file **must be deployed live** before the first submission — IndexNow
fetches `keyLocation` to verify ownership. Deploy `packages/web` to Netlify, then
confirm the file is reachable:

```zsh
curl -i https://houseofrosefl.com/c1b6b0cbabc948d3bb8942418553a2f2.txt
# → 200, body: c1b6b0cbabc948d3bb8942418553a2f2
```

## Usage

Run from the repo root (`run-with-env.mjs` injects `PUBLIC_SITE_URL` and friends
from `.env.local`):

```zsh
# Preview the payload — fetches the sitemap, builds the request, sends nothing
npm run indexnow:dry

# Submit every URL in the live sitemap
npm run indexnow

# Submit only specific URL(s) — e.g. after publishing one blog post
node scripts/run-with-env.mjs node scripts/indexnow.mjs \
  https://houseofrosefl.com/blog/my-new-post/
```

### Flags

| Flag | Effect |
|------|--------|
| `--dry` / `--dry-run` | Build and print the payload, submit nothing. |
| `--sitemap <url>` | Override the sitemap URL (default `<base>/sitemap.xml`). |
| `--endpoint <url>` | Override the IndexNow endpoint (default `api.indexnow.org`). |

### Environment

| Var | Purpose |
|-----|---------|
| `PUBLIC_SITE_URL` | Canonical origin. Drives `host`, `keyLocation`, and the default sitemap URL. Falls back to `https://houseofrosefl.com`. |
| `INDEXNOW_KEY` | Optional. Overrides the key; otherwise the committed key file is used. |
| `INDEXNOW_ENDPOINT` | Optional. Overrides the submission endpoint. |

## How the CLI stays correct

- **Key never drifts** — the CLI discovers the key from the committed
  `public/<hex>.txt` file (the one whose body equals its basename), so the API
  key and the publicly-served key file are always the same value.
- **Submits exactly what's indexable** — URLs come straight from the site's own
  `/sitemap.xml`, so the submission set matches the canonical index set.
- **Host-safe** — any URL whose host isn't the configured host is dropped before
  submission (IndexNow rejects mixed/foreign hosts). Duplicates are removed and
  requests are chunked to the IndexNow 10,000-URL-per-request limit.

## Responses

- `200 OK` — URLs accepted.
- `202 Accepted` — accepted, key validation pending.
- `400` — bad request (malformed URLs/JSON).
- `403` — key not valid (key file not found/served, or contents mismatch).
- `422` — URLs don't match the host, or key/keyLocation mismatch.

A `403`/`422` almost always means the key file isn't live yet — deploy first,
verify with the `curl` above, then re-run.

## Rotating the key

1. Generate a new key (32 hex chars works well): `openssl rand -hex 16`.
2. Replace `packages/web/public/<old>.txt` with `<new>.txt` containing the new key.
3. Deploy. The CLI auto-discovers the new key file — no code change needed.

## Automated submission on deploy (wired)

Production Netlify deploys submit automatically. The web build command in
`packages/web/netlify.toml` ends with `node scripts/postdeploy-indexnow.mjs`,
which:

- runs **only** when `CONTEXT=production` (deploy previews and branch deploys are
  skipped, so pre-release URLs are never submitted);
- **never fails the deploy** — any IndexNow error or timeout is logged and
  swallowed (the wrapper always exits 0);
- reads `PUBLIC_SITE_URL` from the Netlify build environment (no `.env.local` in
  CI) and reuses `scripts/indexnow.mjs`.

`npm run indexnow` remains available for manual/ad-hoc submission (e.g. a single
freshly published URL) without waiting for a deploy.
