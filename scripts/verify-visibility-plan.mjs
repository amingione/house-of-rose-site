#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'packages/web/dist');

if (!existsSync(DIST)) {
  console.error('Visibility verification needs a current web build. Run npm run build:web first.');
  process.exit(1);
}

const htmlFiles = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    const fullPath = path.join(directory, name);
    if (statSync(fullPath).isDirectory()) walk(fullPath);
    else if (name.endsWith('.html')) htmlFiles.push(fullPath);
  }
};
walk(DIST);

const failures = [];
const banned = [
  ['membership language', /\b(member pricing|memberships?|rose circle|rose pass)\b/i],
  ['discount campaign language', /\b(groupon|buy 5[, ]+get 1|percentage off)\b/i],
  ['retired treatment', /\b(glowtox|skinpen|prf hair restoration|hair restoration with prf)\b/i],
  ['retired microneedling split', /\b(?:microchanneling\s*(?:\/|&|and|or|vs\.?|versus)\s*microneedling|microneedling\s*(?:\/|&|and|or|vs\.?|versus)\s*microchanneling|regular microneedling)\b/i],
  ['prohibited claim', /\b(reverse aging|stem[- ]cell treatment|guaranteed results?)\b/i],
  ['retired package language', /\b(signature ritual|signature package|curated rituals)\b/i],
];
const redirectedCanonicals = new Set([
  '/services/ai-skin-analysis/',
  '/services/microchanneling-microneedling/',
  '/services/microchanneling/',
  '/services/microneedling-corrective/',
  '/services/procell-microchanneling-body/',
  '/concerns/Texture/',
  '/concerns/enlarged-pored/',
  '/concerns/hair-thinning/',
  '/compare/prf-microchanneling-vs-microneedling/',
  '/compare/microchanneling-vs-microneedling/',
  '/cost/procell-microchanneling-cost-punta-gorda/',
  '/compare/prf-injections-vs-ez-gel/',
  '/compare/Procell-serum-vs-prf/',
  '/compare/Procell-vs-topical-prf/',
  '/compare/topical-prf-vs-prf-injections/',
]);
const retiredMembershipRoutes = [
  /\/memberships(?:\/|["'?])/i,
  /\/rose-circle(?:\/|["'?])/i,
  /\/plans(?:\/|["'?])/i,
];

for (const file of htmlFiles) {
  const relative = path.relative(DIST, file);
  const html = readFileSync(file, 'utf8');
  const visibleText = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');

  if (!/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html)) {
    failures.push(`${relative}: missing JSON-LD`);
  }

  for (const [label, pattern] of banned) {
    if (pattern.test(visibleText)) failures.push(`${relative}: ${label}`);
  }

  for (const pattern of retiredMembershipRoutes) {
    if (pattern.test(html)) failures.push(`${relative}: links to a retired membership route`);
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/&amp;/g, '&').trim();
  if (!title) failures.push(`${relative}: missing title`);
  else {
    if (title.length > 60) failures.push(`${relative}: title is ${title.length} characters`);
    if (/House of Rose(?: Aesthetics)?.*House of Rose/i.test(title)) failures.push(`${relative}: duplicated brand in title`);
  }

  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]
    ?? html.match(/<meta\s+content="([^"]*)"\s+name="description"/i)?.[1];
  if (!description) failures.push(`${relative}: missing meta description`);
  else if (description.length > 160) failures.push(`${relative}: meta description is ${description.length} characters`);

  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
    ?? html.match(/<link\s+href="([^"]+)"\s+rel="canonical"/i)?.[1];
  if (!canonical) failures.push(`${relative}: missing canonical`);
  else {
    const url = new URL(canonical);
    if (redirectedCanonicals.has(url.pathname)) failures.push(`${relative}: canonical points to retired route ${url.pathname}`);
    if (url.pathname !== '/' && !url.pathname.endsWith('/')) failures.push(`${relative}: canonical lacks trailing slash`);
    if (/[A-Z]/.test(url.pathname)) failures.push(`${relative}: canonical path contains uppercase characters`);
  }

  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imageTags) {
    if (!/\salt=("[^"]*"|'[^']*')/i.test(tag)) failures.push(`${relative}: image missing alt attribute`);
  }
}

for (const relative of ['sitemap.xml', 'llms.txt', 'llms-full.txt']) {
  const file = path.join(DIST, relative);
  if (!existsSync(file)) {
    failures.push(`${relative}: missing crawler-facing output`);
    continue;
  }

  const content = readFileSync(file, 'utf8');
  for (const [label, pattern] of banned) {
    if (pattern.test(content)) failures.push(`${relative}: ${label}`);
  }
  for (const pattern of retiredMembershipRoutes) {
    if (pattern.test(content)) failures.push(`${relative}: contains a retired membership route`);
  }
}

if (failures.length) {
  console.error(`\nVisibility verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Visibility verification passed across ${htmlFiles.length} HTML pages.`);
