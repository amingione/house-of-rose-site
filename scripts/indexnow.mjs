/**
 * IndexNow submission CLI — House of Rose
 * ----------------------------------------
 * Pings the IndexNow API so participating search engines (Bing, Yandex, Seznam,
 * Naver, …) recrawl changed URLs immediately instead of waiting for a scheduled
 * crawl. See https://www.bing.com/indexnow/getstarted#implementation
 *
 * How it stays in sync with the site:
 *   - Host + canonical base come from PUBLIC_SITE_URL (falls back to the
 *     production domain), matching astro.config.ts / siteUrl.ts.
 *   - The key is read from the committed key file in packages/web/public/ (the
 *     single `<hex>.txt` whose contents equal its own basename), so the API key
 *     and the publicly-served key file can never drift apart.
 *   - The URL list is pulled live from the site's own /sitemap.xml by default,
 *     so whatever is indexable is exactly what gets submitted.
 *
 * Usage (from repo root):
 *   npm run indexnow              # submit every URL in the live sitemap
 *   npm run indexnow:dry          # build + print the payload, submit nothing
 *   node scripts/run-with-env.mjs node scripts/indexnow.mjs https://houseofrosefl.com/blog/new-post/
 *                                 # submit only the explicit URL(s) passed as args
 *
 * Flags:
 *   --dry            Print the payload and exit without calling the API.
 *   --sitemap <url>  Override the sitemap URL (default: <base>/sitemap.xml).
 *   --endpoint <url> Override the IndexNow endpoint (default: api.indexnow.org,
 *                    or INDEXNOW_ENDPOINT). Any participating endpoint notifies
 *                    all others.
 *
 * Env:
 *   PUBLIC_SITE_URL     Canonical site origin (e.g. https://houseofrosefl.com).
 *   INDEXNOW_KEY        Optional override for the key (else read from key file).
 *   INDEXNOW_ENDPOINT   Optional override for the submission endpoint.
 *
 * Exit codes: 0 success/dry-run, 1 configuration or submission failure.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @typedef {{ dry: boolean, sitemap: string | null, endpoint: string | null, urls: string[] }} CliArgs */

const FALLBACK_SITE_URL = 'https://houseofrosefl.com';
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_PATTERN = /^[a-f0-9]{8,128}$/i;
/** IndexNow accepts at most 10,000 URLs per request. */
const MAX_URLS_PER_REQUEST = 10000;

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(REPO_ROOT, 'packages', 'web', 'public');

/**
 * Parse argv into a typed options object. Bare arguments are treated as
 * explicit URLs to submit (bypassing the sitemap).
 * @param {string[]} argv
 * @returns {CliArgs}
 */
function parseArgs(argv) {
  /** @type {CliArgs} */
  const args = { dry: false, sitemap: null, endpoint: null, urls: [] };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry' || arg === '--dry-run') {
      args.dry = true;
    } else if (arg === '--sitemap') {
      args.sitemap = argv[++i] ?? null;
    } else if (arg === '--endpoint') {
      args.endpoint = argv[++i] ?? null;
    } else if (arg.startsWith('http://') || arg.startsWith('https://')) {
      args.urls.push(arg);
    } else {
      throw new Error(`Unrecognized argument: ${arg}`);
    }
  }

  return args;
}

/**
 * Resolve the canonical origin (no trailing slash) from PUBLIC_SITE_URL.
 * @returns {string}
 */
function resolveBaseUrl() {
  const raw = process.env.PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  try {
    return new URL(raw).toString().replace(/\/$/, '');
  } catch {
    console.warn(`[indexnow] PUBLIC_SITE_URL ("${raw}") is invalid; falling back to ${FALLBACK_SITE_URL}`);
    return FALLBACK_SITE_URL;
  }
}

/**
 * Read the IndexNow key from INDEXNOW_KEY, or discover the committed key file in
 * packages/web/public/ (a `<hex>.txt` whose body equals its basename).
 * @returns {string}
 */
function resolveKey() {
  const envKey = process.env.INDEXNOW_KEY?.trim();
  if (envKey) {
    if (!KEY_PATTERN.test(envKey)) {
      throw new Error(`INDEXNOW_KEY "${envKey}" is not a valid IndexNow key (8-128 hex chars).`);
    }
    return envKey;
  }

  /** @type {string[]} */
  let entries;
  try {
    entries = readdirSync(PUBLIC_DIR);
  } catch (error) {
    throw new Error(`Cannot read public dir at ${PUBLIC_DIR}: ${error instanceof Error ? error.message : String(error)}`);
  }

  /** @type {string[]} */
  const matches = [];
  for (const name of entries) {
    if (!name.endsWith('.txt')) continue;
    const base = name.slice(0, -'.txt'.length);
    if (!KEY_PATTERN.test(base)) continue;
    const body = readFileSync(join(PUBLIC_DIR, name), 'utf8').trim();
    if (body === base) matches.push(base);
  }

  if (matches.length === 0) {
    throw new Error(
      `No IndexNow key file found in ${PUBLIC_DIR}. ` +
        `Expected a "<key>.txt" whose contents equal the key, or set INDEXNOW_KEY.`
    );
  }
  if (matches.length > 1) {
    throw new Error(`Multiple IndexNow key files found (${matches.join(', ')}). Set INDEXNOW_KEY to disambiguate.`);
  }

  return matches[0];
}

/**
 * Fetch the sitemap and extract <loc> values.
 * @param {string} sitemapUrl
 * @returns {Promise<string[]>}
 */
async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl, { headers: { Accept: 'application/xml' } });
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  /** @type {string[]} */
  const urls = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  /** @type {RegExpExecArray | null} */
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

/**
 * Split an array into chunks of a given size.
 * @template T
 * @param {T[]} items
 * @param {number} size
 * @returns {T[][]}
 */
function chunk(items, size) {
  /** @type {T[][]} */
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * POST one batch of URLs to IndexNow.
 * @param {string} endpoint
 * @param {{ host: string, key: string, keyLocation: string, urlList: string[] }} payload
 * @returns {Promise<{ ok: boolean, status: number, statusText: string, body: string }>}
 */
async function submit(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const body = await res.text().catch(() => '');
  return { ok: res.ok, status: res.status, statusText: res.statusText, body };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = resolveBaseUrl();
  const host = new URL(base).hostname;
  const key = resolveKey();
  const keyLocation = `${base}/${key}.txt`;
  const endpoint = args.endpoint ?? process.env.INDEXNOW_ENDPOINT?.trim() ?? DEFAULT_ENDPOINT;
  const sitemapUrl = args.sitemap ?? `${base}/sitemap.xml`;

  /** @type {string[]} */
  let urls;
  if (args.urls.length > 0) {
    urls = args.urls;
    console.log(`[indexnow] Using ${urls.length} URL(s) from CLI arguments.`);
  } else {
    console.log(`[indexnow] Fetching sitemap: ${sitemapUrl}`);
    urls = await fetchSitemapUrls(sitemapUrl);
    console.log(`[indexnow] Found ${urls.length} URL(s) in sitemap.`);
  }

  // Only submit URLs on this host — IndexNow rejects mixed/foreign hosts.
  const onHost = urls.filter((u) => {
    try {
      return new URL(u).hostname === host;
    } catch {
      return false;
    }
  });
  const skipped = urls.length - onHost.length;
  if (skipped > 0) console.warn(`[indexnow] Skipping ${skipped} URL(s) not on host ${host}.`);

  // De-duplicate while preserving order.
  const unique = [...new Set(onHost)];

  if (unique.length === 0) {
    console.error('[indexnow] No submittable URLs. Nothing to do.');
    process.exit(1);
  }

  console.log('[indexnow] Configuration:');
  console.log(`  host        : ${host}`);
  console.log(`  key         : ${key}`);
  console.log(`  keyLocation : ${keyLocation}`);
  console.log(`  endpoint    : ${endpoint}`);
  console.log(`  urls        : ${unique.length}`);

  if (args.dry) {
    console.log('\n[indexnow] --dry: payload preview (no request sent):');
    console.log(
      JSON.stringify(
        { host, key, keyLocation, urlList: unique.slice(0, 10) },
        null,
        2
      )
    );
    if (unique.length > 10) console.log(`  … and ${unique.length - 10} more URL(s).`);
    return;
  }

  const batches = chunk(unique, MAX_URLS_PER_REQUEST);
  let failures = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const urlList = batches[i];
    const label = batches.length > 1 ? ` (batch ${i + 1}/${batches.length})` : '';
    const result = await submit(endpoint, { host, key, keyLocation, urlList });
    // IndexNow returns 200 (accepted) or 202 (accepted, pending validation).
    if (result.ok) {
      console.log(`[indexnow] ✓ Submitted ${urlList.length} URL(s)${label} — ${result.status} ${result.statusText}`);
    } else {
      failures += 1;
      console.error(
        `[indexnow] ✗ Failed${label} — ${result.status} ${result.statusText}` +
          (result.body ? `\n${result.body}` : '')
      );
    }
  }

  if (failures > 0) process.exit(1);
  console.log('[indexnow] Done.');
}

main().catch((error) => {
  console.error(`[indexnow] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
