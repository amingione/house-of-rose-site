# Sanity API Usage Audit — 2026-07-23

**Source:** request-level usage export from project `4e7axyi7`, 2026-07-16 → 2026-07-23 (281,660 requests).
**Verdict:** zero of this traffic is website visitors. The storefront is fully static — the built site never calls the Sanity API. The spend is Studio browser tabs, an authentication-failure retry storm, and build-time query duplication.

## Where the 281k requests came from

| Source | Requests | Share |
|---|---|---|
| Sanity Studio browser sessions (listeners, previews, search) | ~169,000 | 60% |
| — of which a **401 retry storm** (expired auth, listeners retrying in a loop) | 66,551 | 24% |
| Netlify build agents (`@sanity/client 6.29.1`, AWS IPs) | ~76,800 | 27% |
| Local dev (`npm run dev:web` + Visual Editor from residential IPs) | ~30,000 | 11% |
| Bots hitting image CDN (AhrefsBot etc.) | ~1,100 | <1% |

99.96% of requests hit the **uncached live API** (`4e7axyi7.api.sanity.io`); this is expected given `useCdn: false` (kept deliberately — CDN staleness broke fresh publishes; see `packages/web/src/lib/sanity.ts`).

## Cause 1 — Studio 401 retry storm (66,551 requests, pure waste)

Studio tabs on two machines (a Mac at `76.123.69.94` and a ChromeOS device at `98.219.102.70` / `73.255.156.9`) kept running after the Sanity session expired. The Studio's preview listeners (`sanity.studio.preview.observe-document-set.listen`, the `sanity.canvas.link` document watcher) do not stop on 401 — they retry in a tight loop. Spikes: **24,166** requests on 7/16 and **31,298** on 7/22, each from a single stale tab.

**Action (manual):**
1. Close Studio tabs when done — especially on the Chromebook. A backgrounded tab keeps a live listener per visible document.
2. When Studio shows logged-out / stale state, log out and back in rather than leaving the tab.
3. Keep the `sanity` package current (`npm update sanity` in `packages/studio`) — newer Studio releases add backoff on failed listeners.

## Cause 2 — Build-time query duplication (~1,000–1,800 requests per build)

35 distinct Netlify build/Visual Editor sessions in the week. Each production build fired 1,036–1,796 API requests because every page independently re-runs the same global queries:

| Query | Requests (week) |
|---|---|
| `ALL_SERVICES_QUERY` variants | 19,949 |
| `SITE_SETTINGS_QUERY` variants | 19,819 |
| `ALL_COLLECTIONS_QUERY` variants | 14,997 |
| `PRODUCT_BY_SLUG_QUERY` | 10,292 |

A static build is one Node process reading one content snapshot — the same query can only return the same result, so re-fetching it per page is pure duplication.

**Fix (shipped in this commit):** `sanityFetch()` in `packages/web/src/lib/sanity.ts` now memoizes query+params → promise for the lifetime of a production build. Global queries collapse from ~200+ calls to **1 call each**; per-slug queries collapse to one call per slug. Expected build cost: **~1,700 → under ~150 requests** (dominated by unique per-slug fetches). Dev (`astro dev`, Netlify Visual Editor) is deliberately uncached so edits stay live.

`useCdn: false` was **not** changed — the staleness reason documented in the file stands. If API-request quota ever becomes the binding constraint again, moving *build* fetches to the CDN is the next lever, but it trades freshness on webhook-triggered rebuilds.

## Cause 3 — Long Visual Editor / dev sessions

Several multi-hour AWS sessions (e.g. 7/20 08:30–10:14, 9,508 requests) match Netlify Visual Editor usage — the hosted `astro dev` re-fetches on every navigation and HMR. That's inherent to live editing; just worth knowing that an afternoon in the Visual Editor costs thousands of (legitimate) requests. Close the editor when not actively editing.

## Expected impact

- 401 storm eliminated by tab hygiene: **−66k/week**
- Build dedup: builds drop ~90%: **−65–70k/week**
- Studio listener volume drops with tabs closed when idle: **−50k+/week**

Realistic steady state: **under 30k requests/week** for the same amount of work — an ~85–90% reduction — with headroom that scales as pages are added (new pages no longer add global-query cost to builds).
