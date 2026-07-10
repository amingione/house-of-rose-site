/**
 * Netlify post-build IndexNow ping — House of Rose
 * ------------------------------------------------
 * Thin, deploy-safe wrapper around scripts/indexnow.mjs, intended to be chained
 * onto the production build command in packages/web/netlify.toml:
 *
 *   command = "npm install && npm run build -w @house-of-rose/web && node scripts/postdeploy-indexnow.mjs"
 *
 * Design rules:
 *   - PRODUCTION ONLY. Netlify sets CONTEXT=production for production deploys;
 *     deploy previews and branch deploys are skipped so we never submit
 *     pre-release URLs to search engines.
 *   - NEVER FAILS THE DEPLOY. Any error (network blip, IndexNow 4xx/5xx, timeout)
 *     is logged and swallowed — this process always exits 0.
 *   - Reads PUBLIC_SITE_URL from the Netlify build environment (no .env.local in
 *     CI), which scripts/indexnow.mjs already consumes directly.
 *
 * The key file is committed and served from the live site, so by the time a
 * production build runs, IndexNow can always validate ownership.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const context = process.env.CONTEXT?.trim();

// Run only for production deploys. When CONTEXT is unset (e.g. a manual local
// invocation), default to running so `node scripts/postdeploy-indexnow.mjs`
// still works for testing.
if (context && context !== 'production') {
  console.log(`[indexnow] Skipping submission for non-production context: ${context}`);
  process.exit(0);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const target = join(scriptDir, 'indexnow.mjs');

console.log('[indexnow] Production deploy — submitting sitemap URLs to IndexNow…');

const result = spawnSync(process.execPath, [target], {
  stdio: 'inherit',
  timeout: 60_000, // hard cap so a hung request can never stall the deploy
});

if (result.error) {
  console.warn(`[indexnow] Submission wrapper error (ignored): ${result.error.message}`);
} else if (typeof result.status === 'number' && result.status !== 0) {
  console.warn(`[indexnow] Submission exited ${result.status} (ignored — deploy not affected).`);
}

// Always succeed: an SEO ping must never break a deploy.
process.exit(0);
