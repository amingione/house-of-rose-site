#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST_ROOT = path.join(ROOT, 'packages/web/dist');
const LOCAL_SITEMAP = path.join(DIST_ROOT, 'sitemap.xml');
const CANONICAL_ORIGIN = new URL('https://houseofrosefl.com/');
const DEPLOYED_ORIGIN = new URL(process.env.PUBLIC_SITE_URL ?? 'https://houseofrosefl.com/');

if (
  DEPLOYED_ORIGIN.protocol !== 'https:'
  || DEPLOYED_ORIGIN.username
  || DEPLOYED_ORIGIN.password
) {
  throw new Error('PUBLIC_SITE_URL must be an HTTPS origin without embedded credentials.');
}

if (!existsSync(LOCAL_SITEMAP)) {
  throw new Error('Missing packages/web/dist/sitemap.xml. Run the serialized web build before this verifier.');
}

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  }
  return value;
};

const jsonLdPayload = (html, label) => {
  const blocks = [...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match, index) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${label} has invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  });

  const normalized = JSON.stringify(stableValue(blocks));
  return {
    blocks: blocks.length,
    schemaTypes: blocks.map((block) => block?.['@type'] ?? '(graph)'),
    sha256: createHash('sha256').update(normalized).digest('hex'),
  };
};

const sitemapXml = readFileSync(LOCAL_SITEMAP, 'utf8');
const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap((match) => {
  try {
    const location = new URL(match[1]);
    if (
      location.origin !== CANONICAL_ORIGIN.origin
      || location.search
      || location.hash
      || !location.pathname.endsWith('/')
    ) return [];
    return [location.pathname];
  } catch {
    return [];
  }
});

if (routes.length === 0) {
  throw new Error('No canonical HTML routes were found in packages/web/dist/sitemap.xml.');
}
if (new Set(routes).size !== routes.length) {
  throw new Error('Duplicate canonical HTML routes were found in packages/web/dist/sitemap.xml.');
}

const localFileForRoute = (route) => route === '/'
  ? path.join(DIST_ROOT, 'index.html')
  : path.join(DIST_ROOT, route.replace(/^\//, ''), 'index.html');

const errorSummary = (error) => ({
  name: error instanceof Error ? error.name : 'UnknownError',
  message: (error instanceof Error ? error.message : String(error)).slice(0, 240),
});

const compareRoute = async (route) => {
  const localFile = localFileForRoute(route);
  if (!existsSync(localFile)) {
    return { route, state: 'missing-local-html' };
  }

  const local = jsonLdPayload(readFileSync(localFile, 'utf8'), `local ${route}`);
  if (local.blocks === 0) {
    return { route, state: 'missing-local-jsonld', local };
  }

  let response;
  try {
    response = await fetch(new URL(route, DEPLOYED_ORIGIN), {
      headers: { 'user-agent': 'HouseOfRoseDeploymentVerifier/1.0' },
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return { route, state: 'live-fetch-error', error: errorSummary(error), local };
  }
  if (!response.ok) {
    return { route, state: 'live-http-error', status: response.status, local };
  }

  let live;
  try {
    live = jsonLdPayload(await response.text(), `deployed ${route}`);
  } catch (error) {
    return { route, state: 'live-jsonld-error', error: errorSummary(error), local };
  }
  return {
    route,
    state: local.sha256 === live.sha256 ? 'matched' : 'schema-mismatch',
    local,
    live,
  };
};

const results = [];
for (let index = 0; index < routes.length; index += 8) {
  results.push(...await Promise.all(routes.slice(index, index + 8).map(compareRoute)));
}

const mismatches = results.filter(({ state }) => state !== 'matched');
console.log(JSON.stringify({
  task: 'fix-structured-data-errors',
  deployedOrigin: DEPLOYED_ORIGIN.origin,
  canonicalRoutesChecked: results.length,
  matched: results.length - mismatches.length,
  mismatches,
}, null, 2));

if (mismatches.length > 0) process.exitCode = 1;
