#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const NETLIFY_CONFIG = path.join(ROOT, 'packages/web/netlify.toml');
const DEPLOYED_ORIGIN = new URL(process.env.PUBLIC_SITE_URL ?? 'https://houseofrosefl.com/');

if (
  DEPLOYED_ORIGIN.protocol !== 'https:'
  || DEPLOYED_ORIGIN.username
  || DEPLOYED_ORIGIN.password
) {
  throw new Error('PUBLIC_SITE_URL must be an HTTPS origin without embedded credentials.');
}

if (!existsSync(NETLIFY_CONFIG)) {
  throw new Error('Missing packages/web/netlify.toml.');
}

const redirectRules = readFileSync(NETLIFY_CONFIG, 'utf8')
  .split('[[redirects]]')
  .slice(1)
  .map((block) => Object.fromEntries(
    [...block.matchAll(/^\s*(from|to|status)\s*=\s*(?:"([^"]*)"|(\d+))\s*$/gm)]
      .map((match) => [match[1], match[2] ?? match[3]]),
  ))
  .filter(({ from, to, status }) => (
    status === '301'
    && from?.startsWith('/')
    && to?.startsWith('/')
    && !from.includes('*')
    && !/:[A-Za-z][\w-]*/.test(from)
  ));

if (redirectRules.length === 0) {
  throw new Error('No exact internal 301 redirects were found in packages/web/netlify.toml.');
}

const duplicateSources = redirectRules
  .map(({ from }) => from)
  .filter((source, index, sources) => sources.indexOf(source) !== index);
if (duplicateSources.length > 0) {
  throw new Error(`Duplicate exact 301 sources: ${[...new Set(duplicateSources)].join(', ')}`);
}

const errorSummary = (error) => ({
  name: error instanceof Error ? error.name : 'UnknownError',
  message: (error instanceof Error ? error.message : String(error)).slice(0, 240),
});

const deployedUrl = (pathname) => new URL(pathname, DEPLOYED_ORIGIN);

const checkRule = async ({ from, to }) => {
  let response;
  try {
    response = await fetch(deployedUrl(from), {
      headers: { 'user-agent': 'HouseOfRoseDeploymentVerifier/1.0' },
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return { from, to, state: 'fetch-error', error: errorSummary(error) };
  }

  const location = response.headers.get('location');
  if (response.status !== 301) {
    return { from, to, state: 'wrong-status', status: response.status, location };
  }
  if (!location) {
    return { from, to, state: 'missing-location', status: response.status };
  }

  let actual;
  try {
    actual = new URL(location, deployedUrl(from));
  } catch (error) {
    return {
      from,
      to,
      state: 'invalid-location',
      status: response.status,
      location,
      error: errorSummary(error),
    };
  }

  const expected = deployedUrl(to);
  if (actual.origin !== expected.origin || actual.pathname !== expected.pathname || actual.search !== expected.search) {
    return {
      from,
      to,
      state: 'wrong-location',
      status: response.status,
      location: actual.toString(),
    };
  }

  return { from, to, state: 'matched' };
};

const results = [];
for (let index = 0; index < redirectRules.length; index += 8) {
  results.push(...await Promise.all(redirectRules.slice(index, index + 8).map(checkRule)));
}

const mismatches = results.filter(({ state }) => state !== 'matched');
console.log(JSON.stringify({
  deployedOrigin: DEPLOYED_ORIGIN.origin,
  exactInternalRedirectsChecked: results.length,
  matched: results.length - mismatches.length,
  mismatches,
}, null, 2));

if (mismatches.length > 0) process.exitCode = 1;
