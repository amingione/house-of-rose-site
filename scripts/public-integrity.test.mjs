import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_ROOT = path.join(REPO_ROOT, 'packages/web/dist');
const NETLIFY_CONFIG = path.join(REPO_ROOT, 'packages/web/netlify.toml');
const SITE_ORIGIN = 'https://houseofrosefl.com';

const RETIRED_EMPTY_CONCERN_ROUTES = [
  '/concerns/enlarged-pored/',
  '/concerns/enlarged-pores/',
  '/concerns/hair-thinning/',
  '/concerns/ingrown-hair/',
];

const REVIEWED_BLOG = {
  slug: 'is-morpheus8-safe',
  title: 'Is Morpheus8 Safe? What to Ask Before Treatment',
  retiredTitle: 'Is Morpheus8 Safe? What to Really Expect Before and After',
};

if (!existsSync(DIST_ROOT)) {
  throw new Error(`Generated web dist is missing at ${DIST_ROOT}. Run the web build before this gate.`);
}

const walkFiles = (directory, predicate) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolutePath, predicate));
    else if (predicate(absolutePath)) files.push(absolutePath);
  }
  return files;
};

const relativeToRepo = (absolutePath) => path.relative(REPO_ROOT, absolutePath).split(path.sep).join('/');

const routeForHtmlFile = (absolutePath) => {
  const relativePath = path.relative(DIST_ROOT, absolutePath).split(path.sep).join('/');
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'index.html'.length)}`;
  return `/${relativePath}`;
};

const parseNetlifyRedirects = () => {
  const source = readFileSync(NETLIFY_CONFIG, 'utf8');
  return source
    .split('[[redirects]]')
    .slice(1)
    .map((block) => {
      const values = {};
      for (const match of block.matchAll(
        /^\s*(from|to|status|force)\s*=\s*(?:"([^"]*)"|(\d+|true|false))\s*$/gm,
      )) {
        values[match[1]] = match[2] ?? match[3];
      }
      return values;
    })
    .filter((rule) => rule.from && rule.status);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const canonicalPath = (value) => value === '/' ? '/' : value.replace(/\/+$/, '');

const routeMatchesRule = (pathname, sourceRule) => {
  if (!sourceRule.includes('*') && !/:[A-Za-z][\w-]*/.test(sourceRule)) {
    return canonicalPath(pathname) === canonicalPath(sourceRule);
  }

  const pattern = sourceRule
    .split(/(\*|:[A-Za-z][\w-]*)/)
    .map((part) => part === '*' || part.startsWith(':') ? '.*' : escapeRegExp(part))
    .join('');
  return new RegExp(`^${pattern}$`).test(pathname);
};

const redirectRules = parseNetlifyRedirects();
const permanentRedirectRules = redirectRules.filter(({ status }) => {
  const numericStatus = Number(status);
  return numericStatus >= 300 && numericStatus < 400;
});
const forcedNotFoundRules = redirectRules.filter(
  ({ from, force, status }) => status === '404' && force === 'true' && from !== '/*',
);

const matchingRule = (pathname, rules) => rules.find(({ from }) => routeMatchesRule(pathname, from));
const isForcedNotFoundRoute = (pathname) => Boolean(matchingRule(pathname, forcedNotFoundRules));

const allHtmlFiles = walkFiles(DIST_ROOT, (file) => file.endsWith('.html'));
const publicHtmlFiles = allHtmlFiles.filter((file) => {
  const route = routeForHtmlFile(file);
  return route !== '/404.html' && !isForcedNotFoundRoute(route);
});

const decodeHtmlEntities = (value) => value
  .replace(/&amp;|&#38;|&#x26;/gi, '&')
  .replace(/&quot;|&#34;|&#x22;/gi, '"')
  .replace(/&apos;|&#39;|&#x27;/gi, "'")
  .replace(/&lt;|&#60;|&#x3c;/gi, '<')
  .replace(/&gt;|&#62;|&#x3e;/gi, '>');

const extractHrefAttributes = (html, anchorsOnly = false) => {
  const tag = anchorsOnly ? 'a\\b' : '[A-Za-z][^\\s>/]*';
  const pattern = new RegExp(
    `<${tag}[^>]*\\bhref\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'gis',
  );
  return [...html.matchAll(pattern)].map((match) => decodeHtmlEntities(match[1] ?? match[2] ?? match[3]));
};

const ignoredHref = (href) => !href
  || href.startsWith('#')
  || /^(?:mailto|tel|sms|javascript|data|blob):/i.test(href);

const runtimeRouteException = (pathname) => [
  '/.netlify/functions/',
  '/api/',
  '/metrics/',
].some((prefix) => pathname.startsWith(prefix));

const isFile = (candidate) => existsSync(candidate) && statSync(candidate).isFile();

const generatedTargetExists = (pathname) => {
  if (runtimeRouteException(pathname)) return true;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const resolved = path.resolve(DIST_ROOT, `.${decodedPath}`);
  if (resolved !== DIST_ROOT && !resolved.startsWith(`${DIST_ROOT}${path.sep}`)) return false;

  const withoutTrailingSlash = resolved.replace(/[\\/]$/, '');
  return [
    resolved,
    path.join(resolved, 'index.html'),
    `${withoutTrailingSlash}.html`,
  ].some(isFile);
};

const formatFailures = (heading, failures) => {
  const visible = failures.slice(0, 60).map((failure) => `  - ${failure}`).join('\n');
  const remainder = failures.length > 60 ? `\n  - …and ${failures.length - 60} more` : '';
  return `${heading} (${failures.length}):\n${visible}${remainder}`;
};

const absoluteUrls = (text) => [...text.matchAll(/https?:\/\/[^\s<>"'`)\]]+/g)]
  .map((match) => match[0].replace(/[.,;]+$/, ''));

const internalPath = (href, basePath = '/') => {
  if (ignoredHref(href)) return null;
  try {
    const url = new URL(href, new URL(basePath, SITE_ORIGIN));
    return url.origin === SITE_ORIGIN ? decodeURIComponent(url.pathname) : null;
  } catch {
    return undefined;
  }
};

const collectExpandedJsonLdIds = (value, ids = []) => {
  if (Array.isArray(value)) {
    for (const entry of value) collectExpandedJsonLdIds(entry, ids);
  } else if (value && typeof value === 'object') {
    if (typeof value['@id'] === 'string' && value['@type']) ids.push(value['@id']);
    for (const entry of Object.values(value)) collectExpandedJsonLdIds(entry, ids);
  }
  return ids;
};

const mainHtml = (html) => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;

const occurrenceCount = (text, value) => text.split(value).length - 1;

test('all generated JSON-LD is valid JSON without HTML entities', () => {
  const failures = [];
  let blockCount = 0;
  const htmlEntity = /&(?:[a-z][a-z0-9]+|#\d+|#x[\da-f]+);/gi;

  for (const file of allHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    let jsonLdIndex = 0;
    for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(script[1])) continue;
      blockCount += 1;
      jsonLdIndex += 1;
      const rawJson = script[2].trim();
      const entities = [...new Set(rawJson.match(htmlEntity) ?? [])];
      if (entities.length > 0) {
        failures.push(`${relativeToRepo(file)} JSON-LD #${jsonLdIndex}: HTML entities ${entities.join(', ')}`);
      }
      try {
        JSON.parse(rawJson);
      } catch (error) {
        failures.push(`${relativeToRepo(file)} JSON-LD #${jsonLdIndex}: ${error.message}`);
      }
    }
  }

  assert.ok(blockCount > 0, 'No JSON-LD blocks were found in generated HTML.');
  assert.equal(failures.length, 0, formatFailures('Invalid JSON-LD', failures));
});

test('each generated page defines every JSON-LD entity id only once', () => {
  const failures = [];

  for (const file of allHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    const ids = [];
    for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\btype\s*=\s*(["'])application\/ld\+json\1/i.test(script[1])) continue;
      collectExpandedJsonLdIds(JSON.parse(script[2].trim()), ids);
    }
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    if (duplicates.length > 0) failures.push(`${relativeToRepo(file)}: ${duplicates.join(', ')}`);
  }

  assert.equal(failures.length, 0, formatFailures('Duplicate expanded JSON-LD entity ids', failures));
});

test('generated pages do not load two complete Tailwind stylesheets', () => {
  const failures = [];

  for (const file of allHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    const cssFiles = extractHrefAttributes(html)
      .filter((href) => href.endsWith('.css'))
      .map((href) => path.join(DIST_ROOT, href.replace(/^\//, '')))
      .filter(isFile);
    const fullTailwindSheets = cssFiles.filter((cssFile) => {
      const css = readFileSync(cssFile, 'utf8');
      return css.includes('--tw-border-spacing-x') && css.includes('.sr-only');
    });
    if (fullTailwindSheets.length > 1) {
      failures.push(`${relativeToRepo(file)}: ${fullTailwindSheets.map(relativeToRepo).join(', ')}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Duplicate Tailwind stylesheets', failures));
});

test('internal anchors on public generated pages resolve', () => {
  const failures = [];
  let anchorCount = 0;

  for (const file of publicHtmlFiles) {
    const sourceRoute = routeForHtmlFile(file);
    const html = readFileSync(file, 'utf8');
    for (const href of extractHrefAttributes(html, true)) {
      anchorCount += 1;
      const pathname = internalPath(href, sourceRoute);
      if (pathname === null) continue;
      if (pathname === undefined) {
        failures.push(`${relativeToRepo(file)} -> invalid href ${JSON.stringify(href)}`);
      } else if (isForcedNotFoundRoute(pathname)) {
        const rule = matchingRule(pathname, forcedNotFoundRules);
        failures.push(`${relativeToRepo(file)} -> ${href} (forced ${rule.status} by ${rule.from})`);
      } else if (!generatedTargetExists(pathname)) {
        failures.push(`${relativeToRepo(file)} -> ${href} (no generated target for ${pathname})`);
      }
    }
  }

  assert.ok(anchorCount > 0, 'No anchors were found in public generated HTML.');
  assert.equal(failures.length, 0, formatFailures('Broken internal HTML anchors', failures));
});

test('public HTML, AI feeds, and sitemap do not link to edge-retired routes', () => {
  const references = [];

  for (const file of publicHtmlFiles) {
    const sourceRoute = routeForHtmlFile(file);
    const html = readFileSync(file, 'utf8');
    for (const href of extractHrefAttributes(html)) references.push({ source: relativeToRepo(file), href, basePath: sourceRoute });
    for (const href of absoluteUrls(html)) references.push({ source: relativeToRepo(file), href, basePath: sourceRoute });
  }

  for (const name of ['llms.txt', 'llms-full.txt', 'sitemap.xml']) {
    const file = path.join(DIST_ROOT, name);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    for (const href of absoluteUrls(readFileSync(file, 'utf8'))) {
      references.push({ source: relativeToRepo(file), href, basePath: '/' });
    }
  }

  const failures = [];
  const seen = new Set();
  for (const { source, href, basePath } of references) {
    const pathname = internalPath(href, basePath);
    if (pathname === null || pathname === undefined) continue;
    const rule = matchingRule(pathname, permanentRedirectRules) ?? matchingRule(pathname, forcedNotFoundRules);
    if (!rule) continue;
    const key = `${source}\0${pathname}\0${rule.from}`;
    if (seen.has(key)) continue;
    seen.add(key);
    failures.push(`${source} -> ${pathname} (${rule.status} source ${rule.from}${rule.to ? ` -> ${rule.to}` : ''})`);
  }

  assert.equal(failures.length, 0, formatFailures('Links to Netlify redirect/forced-404 sources', failures));
});

test('retired empty concern routes are not generated', () => {
  const failures = RETIRED_EMPTY_CONCERN_ROUTES
    .filter(generatedTargetExists)
    .map((route) => `${route} still has a generated file under packages/web/dist`);

  assert.equal(failures.length, 0, formatFailures('Retired concern routes still generated', failures));
});

test('reviewed Morpheus8 article title is consistent in HTML and both AI feeds', () => {
  const expectedUrl = `${SITE_ORIGIN}/blog/${REVIEWED_BLOG.slug}/`;
  const files = [
    path.join(DIST_ROOT, 'blog/index.html'),
    path.join(DIST_ROOT, `blog/${REVIEWED_BLOG.slug}/index.html`),
    path.join(DIST_ROOT, 'llms.txt'),
    path.join(DIST_ROOT, 'llms-full.txt'),
  ];
  const failures = [];

  for (const file of files) {
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const content = readFileSync(file, 'utf8');
    if (!content.includes(REVIEWED_BLOG.title)) {
      failures.push(`${relativeToRepo(file)} does not contain ${JSON.stringify(REVIEWED_BLOG.title)}`);
    }
    if (content.includes(REVIEWED_BLOG.retiredTitle)) {
      failures.push(`${relativeToRepo(file)} still contains retired title ${JSON.stringify(REVIEWED_BLOG.retiredTitle)}`);
    }
  }

  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  if (!compactFeed.includes(`[${REVIEWED_BLOG.title}](${expectedUrl})`)) {
    failures.push(`packages/web/dist/llms.txt is missing the reviewed title/link pair for ${expectedUrl}`);
  }
  if (!fullFeed.includes(`### ${REVIEWED_BLOG.title}\nURL: ${expectedUrl}`)) {
    failures.push(`packages/web/dist/llms-full.txt is missing the reviewed title/link pair for ${expectedUrl}`);
  }

  assert.equal(failures.length, 0, formatFailures('Reviewed blog title drift', failures));
});

test('waxing hub is a factual directory and PRF under-eye price stays internal', () => {
  const hubFile = path.join(DIST_ROOT, 'services/waxing/index.html');
  const facialFile = path.join(DIST_ROOT, 'services/facial-waxing/index.html');
  const bodyFile = path.join(DIST_ROOT, 'services/body-waxing/index.html');
  const serviceIndexFile = path.join(DIST_ROOT, 'services/index.html');
  const collectionFile = path.join(DIST_ROOT, 'services/collections/waxing/index.html');
  const prfUnderEyeFile = path.join(DIST_ROOT, 'services/prf-under-eyes/index.html');
  const sitemapFile = path.join(DIST_ROOT, 'sitemap.xml');
  const compactFeedFile = path.join(DIST_ROOT, 'llms.txt');
  const fullFeedFile = path.join(DIST_ROOT, 'llms-full.txt');

  for (const file of [hubFile, facialFile, bodyFile, serviceIndexFile, collectionFile, prfUnderEyeFile]) {
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  }

  const hub = mainHtml(readFileSync(hubFile, 'utf8'));
  const serviceIndex = mainHtml(readFileSync(serviceIndexFile, 'utf8'));
  const collection = readFileSync(collectionFile, 'utf8');
  const prfUnderEye = mainHtml(readFileSync(prfUnderEyeFile, 'utf8'));
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const compactFeed = readFileSync(compactFeedFile, 'utf8');
  const fullFeed = readFileSync(fullFeedFile, 'utf8');
  const publicInventory = `${hub}\n${sitemap}\n${compactFeed}\n${fullFeed}`.toLowerCase();

  assert.equal(occurrenceCount(hub, 'href="/services/facial-waxing/"'), 1, 'Waxing hub must link Facial Waxing once in main content.');
  assert.equal(occurrenceCount(hub, 'href="/services/body-waxing/"'), 1, 'Waxing hub must link Body Waxing once in main content.');
  assert.ok(!/10[–-]30 minutes|10[–-]40 minutes/i.test(hub), 'Waxing hub must not repeat disputed child durations.');
  assert.ok(serviceIndex.includes('href="/services/waxing/"'), 'Services index must link the Waxing hub.');
  assert.ok(/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b[^"]*\bfollow\b/i.test(collection), 'Waxing collection must remain noindex,follow.');
  assert.ok(collection.includes('href="/services/waxing/"'), 'Waxing collection must link the canonical hub.');
  for (const route of ['/services/waxing/', '/services/facial-waxing/', '/services/body-waxing/']) {
    assert.ok(sitemap.includes(`<loc>${SITE_ORIGIN}${route}</loc>`), `Sitemap is missing ${route}`);
  }
  assert.ok(!publicInventory.includes('brazilian'), 'Public waxing inventory must not claim Brazilian waxing.');
  assert.ok(!prfUnderEye.includes('$495'), 'PRF Under Eyes must not publish the internal verified price on its service page.');
});
