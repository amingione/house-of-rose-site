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

const visibleText = (html) => decodeHtmlEntities(html)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

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

test('publicly rendered local images stay within the 200 KB delivery budget', () => {
  const maxBytes = 200 * 1024;
  const imageAssets = new Map();

  for (const file of publicHtmlFiles) {
    const route = routeForHtmlFile(file);
    const html = readFileSync(file, 'utf8');
    for (const tag of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
      for (const attribute of tag[0].matchAll(/\b(?:src|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
        const rawValue = attribute[1] ?? attribute[2] ?? '';
        for (const candidate of rawValue.split(',').map((entry) => entry.trim().split(/\s+/)[0])) {
          if (!candidate.startsWith('/')) continue;
          let pathname;
          try {
            pathname = decodeURIComponent(new URL(candidate, SITE_ORIGIN).pathname);
          } catch {
            continue;
          }
          if (!/\.(?:avif|gif|jpe?g|png|webp)$/i.test(pathname)) continue;
          const assetPath = path.join(DIST_ROOT, pathname.replace(/^\/+/, ''));
          if (!isFile(assetPath)) continue;
          const routes = imageAssets.get(assetPath) ?? new Set();
          routes.add(route);
          imageAssets.set(assetPath, routes);
        }
      }
    }
  }

  const failures = [...imageAssets.entries()]
    .filter(([assetPath]) => statSync(assetPath).size > maxBytes)
    .map(([assetPath, routes]) => {
      const bytes = statSync(assetPath).size;
      return `${relativeToRepo(assetPath)} is ${Math.ceil(bytes / 1024)} KB; rendered on ${[...routes].slice(0, 5).join(', ')}`;
    });

  assert.ok(imageAssets.size > 0, 'No rendered local image assets were found.');
  assert.equal(failures.length, 0, formatFailures('Oversized rendered local images', failures));
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

test('the indexable concerns hub appears exactly once in the XML sitemap', () => {
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  const concernsHub = `<loc>${SITE_ORIGIN}/concerns/</loc>`;

  assert.equal(
    occurrenceCount(sitemap, concernsHub),
    1,
    'sitemap.xml must contain the canonical /concerns/ hub exactly once.',
  );
});

test('every generated provider profile appears exactly once in the XML sitemap', () => {
  const providersRoot = path.join(DIST_ROOT, 'about/providers');
  const generatedProviderRoutes = readdirSync(providersRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isFile(path.join(providersRoot, entry.name, 'index.html')))
    .map((entry) => `/about/providers/${entry.name}/`)
    .sort();
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  const sitemapProviderRoutes = [...sitemap.matchAll(
    new RegExp(`<loc>${escapeRegExp(SITE_ORIGIN)}(/about/providers/[^/]+/)</loc>`, 'g'),
  )].map((match) => match[1]).sort();

  assert.ok(generatedProviderRoutes.length > 0, 'No generated provider profiles were found.');
  assert.deepEqual(
    sitemapProviderRoutes,
    generatedProviderRoutes,
    'sitemap.xml provider-detail routes must exactly match generated provider profiles.',
  );
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

test('only reviewed journal articles generate public detail routes', () => {
  const blogRoot = path.join(DIST_ROOT, 'blog');
  const generatedSlugs = readdirSync(blogRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isFile(path.join(blogRoot, entry.name, 'index.html')))
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(generatedSlugs, [REVIEWED_BLOG.slug], 'An unreviewed Sanity journal article became public.');
});

test('reviewed Morpheus8 article retains sourced client decision support', () => {
  const file = path.join(DIST_ROOT, `blog/${REVIEWED_BLOG.slug}/index.html`);
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const guide = html.match(
    /<div\b[^>]*data-reviewed-morpheus-safety="true"[^>]*>([\s\S]*?)<\/div>/i,
  )?.[1] ?? '';
  const text = visibleText(guide);
  const failures = [];

  if (!guide) failures.push('missing the reviewed safety-guide region');
  if ((guide.match(/<h2\b/gi) ?? []).length < 6) failures.push('missing substantive decision sections');
  if ((guide.match(/<li\b/gi) ?? []).length < 7) failures.push('missing consultation questions and sources');
  if (!guide.includes('href="/services/morpheus8/"')) failures.push('missing the current service path');
  if (/<div\b(?=[^>]*data-reviewed-morpheus-safety="true")(?=[^>]*data-sb-field-path="body")/i.test(html)) {
    failures.push('local reviewed copy is incorrectly annotated as an editable Sanity body');
  }

  const fdaLinks = [...guide.matchAll(/href="(https:\/\/www\.fda\.gov\/[^"]+)"/gi)];
  if (fdaLinks.length < 2) failures.push('missing two primary FDA sources');
  for (const fact of [/medical procedure/i, /licensed health care provider/i, /burns/i, /scarring/i, /fat loss/i, /nerve damage/i, /individual experiences and outcomes vary/i]) {
    if (!fact.test(text)) failures.push(`missing reviewed safety fact ${fact}`);
  }
  for (const unsupported of [/\bno downtime\b/i, /\brisk[- ]free\b/i, /\bguaranteed\b/i]) {
    if (unsupported.test(text)) failures.push(`contains unsupported assurance ${unsupported}`);
  }
  if (!html.includes('"@type":"BlogPosting"')) failures.push('missing BlogPosting JSON-LD');

  assert.equal(failures.length, 0, formatFailures('Morpheus8 journal decision-support regression', failures));
});

test('journal index describes the reviewed article that is actually published', () => {
  const file = path.join(DIST_ROOT, 'blog/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const text = visibleText(mainHtml(html));
  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  const failures = [];

  for (const required of [
    'Treatment questions, answered with sources.',
    'Morpheus8 safety questions, with the source notes visible.',
    'FDA safety communications',
    'href="/services/morpheus8/"',
    'href="/contact/"',
  ]) {
    const haystack = required.startsWith('href=') ? html : text;
    if (!haystack.includes(required)) failures.push(`journal index is missing ${JSON.stringify(required)}`);
  }
  for (const retired of [
    'Read before you decide.',
    'Articles about microneedling, PRF, injectables, IV hydration',
  ]) {
    if (html.includes(retired)) failures.push(`journal index contains stale ${JSON.stringify(retired)}`);
  }
  const feedDescription = 'Reviewed treatment articles with linked sources and clearly stated limitations';
  if (!compactFeed.includes(feedDescription)) failures.push('llms.txt is missing the reviewed journal description');
  if (!fullFeed.includes(feedDescription)) failures.push('llms-full.txt is missing the reviewed journal description');

  assert.equal(failures.length, 0, formatFailures('Journal-index depth regression', failures));
});

test('homepage preserves its hero, verified trust facts, and useful depth', () => {
  const html = readFileSync(path.join(DIST_ROOT, 'index.html'), 'utf8');
  const main = mainHtml(html);
  const homepage = visibleText(main);
  const failures = [];

  for (const requiredAnchor of [
    'Good skin is a reflection of good judgment.',
    'You do not need to arrive knowing the treatment name.',
    'Inside House of Rose.',
  ]) {
    if (!homepage.includes(requiredAnchor)) failures.push(`homepage is missing required anchor ${JSON.stringify(requiredAnchor)}`);
  }
  for (const verifiedFact of [
    'Diana Morrison, RN',
    'Amber Mingione',
    'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    '525 E Olympia Avenue',
    'Unit 9',
  ]) {
    if (!homepage.includes(verifiedFact)) failures.push(`homepage is missing verified fact ${JSON.stringify(verifiedFact)}`);
  }
  for (const route of [
    '/services/',
    '/services/prf/',
    '/services/prf-under-eyes/',
    '/about/providers/',
    '/experience/',
    '/consultation/',
  ]) {
    if (!main.includes(`href="${route}"`)) failures.push(`homepage is missing decision path ${route}`);
  }
  if (homepage.split(/\s+/).length < 500) {
    failures.push('homepage has been reduced below the reviewed substantive-depth floor');
  }
  for (const retired of [
    'Every plan starts with a consultation',
    'Same source material. Three forms. Three different uses.',
    'PRF EZ-Gel Bio-Filler',
  ]) {
    if (homepage.includes(retired)) failures.push(`homepage contains retired copy ${JSON.stringify(retired)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Homepage depth regression', failures));
});

test('experience page connects the real practice to provider and booking information', () => {
  const file = path.join(DIST_ROOT, 'experience/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const text = visibleText(mainHtml(html));
  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  const failures = [];

  if (!html.includes('<title>Inside the Practice | House of Rose Aesthetics</title>')) {
    failures.push('experience: browser title is not entity-clear');
  }

  for (const required of [
    'Know the place. Know who you are seeing.',
    'The storefront, reception, IV suite, and treatment room pictured here are not stock photographs.',
    'To reserve a time',
    'When you are still comparing',
    'You do not need to choose a treatment name before asking a question.',
  ]) {
    if (!text.includes(required)) failures.push(`experience: missing ${JSON.stringify(required)}`);
  }
  for (const retired of ['See the room. Then review the service.', 'What clients can expect']) {
    if (text.includes(retired)) failures.push(`experience: contains retired ${JSON.stringify(retired)}`);
  }

  const feedDescription = 'Actual storefront, treatment rooms, providers, and visit information';
  if (!compactFeed.includes(feedDescription)) failures.push('llms.txt: missing reviewed experience description');
  if (!fullFeed.includes(feedDescription)) failures.push('llms-full.txt: missing reviewed experience description');

  assert.equal(failures.length, 0, formatFailures('Experience depth regression', failures));
});

test('practice story distinguishes the appointment provider from medical direction', () => {
  const file = path.join(DIST_ROOT, 'about/hra/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = mainHtml(readFileSync(file, 'utf8'));
  const section = html.match(
    /<div\b[^>]*data-practice-accountability[^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class="mt-12/i,
  )?.[1] ?? '';
  const text = visibleText(section);
  const failures = [];

  for (const required of [
    'Who will I actually see?',
    'Your service page names the practitioner and licence type',
    'The provider directory brings those names, roles, and current services together',
    'Joshua Shaw, MD is the practice’s medical director, providing medical direction and protocol supervision.',
    'He does not perform treatment appointments at House of Rose.',
    'The practitioner named for the service is the person associated with that appointment.',
    '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
  ]) {
    if (!text.includes(required)) failures.push(`about/hra: missing ${JSON.stringify(required)}`);
  }
  if (!visibleText(html).includes('Medical Director: Joshua Shaw, MD · FL Lic. ME136232')) {
    failures.push('about/hra: missing canonical medical-director attribution');
  }
  for (const misleading of ['Joshua Shaw treats', 'Joshua Shaw performs', 'on-site medical director']) {
    if (text.includes(misleading)) failures.push(`about/hra: contains misleading ${JSON.stringify(misleading)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Practice-accountability regression', failures));
});

test('direct visit FAQs state the current walk-in policy and match FAQPage schema', () => {
  const expectedAnswer = 'Yes. Walk-ins are always accepted for waxing and facials. For other services, walk-ins are accepted when the schedule allows. Appointments reserve a specific time; call (844) 941-7673 to check current availability.';
  const expectations = {
    faq: 'Do you accept walk-ins?',
    consultation: 'Do you take walk-ins?',
  };
  const failures = [];

  for (const [route, walkInQuestion] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, route, 'index.html');
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const main = mainHtml(html);
    const visibleQuestions = [...main.matchAll(
      /<(h3|span)\b[^>]*data-visit-faq-question[^>]*>([\s\S]*?)<\/\1>/gi,
    )].map((match) => visibleText(match[2]));
    const visibleAnswers = [...main.matchAll(
      /<p\b[^>]*data-visit-faq-answer[^>]*>([\s\S]*?)<\/p>/gi,
    )].map((match) => visibleText(match[1]));
    const visibleFaqs = visibleQuestions.map((question, index) => ({
      question,
      answer: visibleAnswers[index],
    }));
    const faqSchema = [...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    )]
      .map((match) => JSON.parse(match[1]))
      .find((schema) => schema?.['@type'] === 'FAQPage');
    const schemaFaqs = faqSchema?.mainEntity?.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer?.text,
    })) ?? [];

    const walkInFaq = visibleFaqs.find(({ question }) => question === walkInQuestion);
    if (walkInFaq?.answer !== expectedAnswer) {
      failures.push(`${route}: visible walk-in answer does not state the verified policy`);
    }
    if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
      failures.push(`${route}: visible FAQ copy and FAQPage JSON-LD differ`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Walk-in policy regression', failures));
});

test('skin imaging explains the three views and keeps visible FAQs aligned with schema', () => {
  const file = path.join(DIST_ROOT, 'skin-analysis/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const mainText = visibleText(main);
  const section = main.match(
    /<section\b[^>]*data-skin-imaging-views[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const sectionText = visibleText(section);
  const failures = [];

  for (const required of [
    'What each image adds—and what it cannot decide.',
    'Standard light',
    'Cross-polarized light',
    'UV light',
    'Reduces surface reflection',
    'fluorescence associated with some porphyrins',
    'do not determine their medical cause',
    'or screen for skin cancer',
    'makeup, sunscreen residue',
  ]) {
    if (!sectionText.includes(required)) failures.push(`skin-analysis: missing ${JSON.stringify(required)}`);
  }
  for (const unsupported of ['M17', 'AI Skin Analyzer', 'diagnostic accuracy', 'hydration cues']) {
    if (mainText.includes(unsupported)) failures.push(`skin-analysis: contains unsupported ${JSON.stringify(unsupported)}`);
  }

  const visibleFaqs = [...main.matchAll(
    /<h3\b[^>]*data-skin-analysis-faq-question[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*data-skin-analysis-faq-answer[^>]*>([\s\S]*?)<\/p>/gi,
  )].map((match) => ({
    question: visibleText(match[1]),
    answer: visibleText(match[2]),
  }));
  const faqSchema = [...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )]
    .map((match) => JSON.parse(match[1]))
    .find((schema) => schema?.['@type'] === 'FAQPage');
  const schemaFaqs = faqSchema?.mainEntity?.map((item) => ({
    question: item.name,
    answer: item.acceptedAnswer?.text,
  })) ?? [];

  if (!visibleFaqs.some(({ question }) => question === 'Can skin imaging diagnose a skin condition or screen for skin cancer?')) {
    failures.push('skin-analysis: missing the visible non-diagnostic FAQ');
  }
  if (!visibleFaqs.some(({ question }) => question === 'Can makeup or sunscreen affect the images?')) {
    failures.push('skin-analysis: missing the visible image-preparation FAQ');
  }
  if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
    failures.push('skin-analysis: visible FAQ copy and FAQPage JSON-LD differ');
  }

  assert.equal(failures.length, 0, formatFailures('Skin-imaging depth regression', failures));
});

test('priority service pages retain reviewed education instead of falling back to thin inventory', () => {
  const expectations = {
    'injectables-bio-fillers': [
      'Three materials shape the injectable menu.',
      'House of Rose offers neurotoxins for movement-related lines',
      'hyaluronic-acid fillers for selected areas of lost volume',
      'injectable PRF prepared from a small sample of your own blood',
      'Botox and Daxxify',
      '$14 per unit',
      'Juvéderm Ultra XC',
      'Juvéderm Voluma XC',
      'RHA 1',
      'RHA 2',
      'RHA 3',
      '$650–$850',
      'PRF Under-Eye — Consultation',
      '$495',
      'PRF Bio-Filler — Consultation',
      '$899',
      'Diana Morrison, RN',
      'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    ],
    injectables: [
      'Botox and Daxxify for movement-related lines.',
      'Lost facial volume in selected lip, cheek, and fold areas is covered on the dermal filler page.',
      'Botox',
      'Daxxify',
      '$14 per unit',
      '30 minutes',
      '60 minutes',
    ],
    'dermal-fillers': [
      'Five current fillers for lips, cheeks, and folds.',
      'Botox and Daxxify appear on the neurotoxin page for movement-related lines.',
      'Juvéderm Ultra XC',
      'Juvéderm Voluma XC',
      'RHA 1',
      'RHA 2',
      'RHA 3',
      '$650',
      '$850',
    ],
    glo2facial: [
      'A facial with three distinct steps.',
      'surface exfoliation',
      'topical infusion',
      'oxygenation step',
      'reaction between its OxyPod and Primer Gel',
      'carbon-dioxide-rich bubbly environment',
      'Is oxygen blown onto the skin during Glo2Facial?',
      'does not come from an external stream of oxygen',
      '60 minutes',
    ],
    'forma-rf-facial': [
      'Radiofrequency without needles.',
      'InMode non-invasive radiofrequency handpiece',
      'controlled dermal and subdermal heating',
      'How is Forma different from Morpheus8?',
      'Forma uses surface electrodes and does not use needles',
      'How is Forma different from Lumecca Peak?',
      'Lumecca Peak is an IPL handpiece',
    ],
    'lumecca-peak-ipl': [
      'InMode intense pulsed light (IPL) handpiece',
      'xenon flash lamp',
      'visible pigment, uneven tone, and selected texture concerns',
      'legs, full face, chest, neck, face and neck, face, neck, and chest, spot treatment, hands',
      'Is Lumecca Peak a laser?',
      'Which Lumecca Peak treatment areas are currently listed at House of Rose?',
      'InMode and the FDA classify its applicators separately from laser applicators',
    ],
    morpheus8: [
      'Microneedling and radiofrequency in one device.',
      'fractional bipolar radiofrequency',
      'visible tone and texture',
      'consultation-led service',
    ],
    'morpheus8-body': [
      'The Morpheus8 platform, used for selected body concerns.',
      'same InMode platform',
      'body-skin tone, texture, eligible scars, and stretch marks',
      'does not publish an unresolved treatment price, duration, or series',
    ],
    biorepeel: [
      'A topical chemical peel for visible texture and uneven tone.',
      'BioRePeel Cl3 Rejuvenation is a directly bookable, 45-minute standalone face treatment at $250.',
      'TCA stands for trichloroacetic acid',
      'Is BioRePeel a chemical peel?',
      'Does the standalone BioRePeel appointment include microneedling?',
      'Compare the Microneedling service',
      'BioRePeel Cl3 Rejuvenation',
      '$250',
      '45 minutes',
    ],
    microneedling: [
      'Procell is the device behind the Microneedling menu.',
      'Procell Microchanneling is the device-specific name used for this Microneedling service.',
      'Procell Therapies — Pro',
      '$300',
      'Procell Therapies — MD',
      '$400',
      'PRF Microneedling — Consultation',
      '$595',
    ],
    prf: [
      'Three current ways PRF appears on the menu.',
      'Under-Eye and Bio-Filler have their own injectable consultation listings.',
      'Topical PRF Microneedling',
      'PRF Under-Eye',
      '$495',
      'PRF Bio-Filler',
      '$899',
    ],
    'prf-injections': [
      'Two injectable PRF consultations are currently listed.',
      'Topical PRF appears on the Microneedling page, where it is applied to the skin surface.',
      'PRF Under-Eye — Consultation',
      '$495',
      'PRF Bio-Filler — Consultation',
      '$899',
      'Diana Morrison, RN',
    ],
    'permanent-jewelry': [
      'A fitted chain without a traditional clasp.',
      'Aundrea Pedigo, Esthetician',
      'non-medical service',
      'not attached to the skin',
      'can be cut when removal is needed',
      '$65',
      '20 minutes',
    ],
    'iv-hydration-therapy': [
      'Six current IV options, listed plainly.',
      'Diana Morrison, RN',
      'Formulations and add-ons are not listed',
      'from $99 to $185',
      '30 or 45 minutes',
    ],
    dermaplaning: [
      'Surface exfoliation and peach-fuzz removal in one service.',
      'fine vellus hair and accumulated dead skin cells',
      'Amber Mingione, Licensed Esthetician',
      'Dermaplaning — Facial (standalone)',
      '$135',
      '50 minutes',
      'Dermaplaning — Add-On',
      '$45',
      '25 minutes',
      'Will peach fuzz grow back thicker or darker after dermaplaning?',
      'it does not change the hair’s thickness, color, or rate of growth',
    ],
    'glp-1-weight-management': [
      'The current menu lists a consultation, semaglutide, and tirzepatide.',
      'semaglutide',
      'tirzepatide',
      'Diana Morrison, RN',
      'GLP-1 Consultation',
      '$25',
      '40 minutes',
      'Can I choose semaglutide or tirzepatide from this page?',
      'Medication pricing is not published',
    ],
  };
  const failures = [];

  for (const [slug, requiredCopy] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `services/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const section = html.match(/<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const text = visibleText(section);

    if (!section) failures.push(`${slug}: missing reviewed education section`);
    for (const value of requiredCopy) {
      if (!text.includes(value)) failures.push(`${slug}: missing ${JSON.stringify(value)}`);
    }
  }

  const weightManagementFile = path.join(
    DIST_ROOT,
    'services/glp-1-weight-management/index.html',
  );
  const weightManagementHtml = readFileSync(weightManagementFile, 'utf8');
  const weightManagementText = visibleText(mainHtml(weightManagementHtml));
  assert.ok(
    weightManagementHtml.includes('"@type":"FAQPage"'),
    'GLP-1 Weight Management must emit reviewed FAQPage JSON-LD.',
  );
  for (const unresolvedPrice of ['$299', '$399']) {
    assert.ok(
      !weightManagementText.includes(unresolvedPrice),
      `GLP-1 Weight Management must withhold unresolved medication price ${unresolvedPrice}.`,
    );
  }

  const retiredInjectableFormulas = {
    'injectables-bio-fillers': [
      'Movement, volume, and PRF are different questions.',
      'These services are not interchangeable.',
      'A movement-related line is not the same concern as lost volume',
      'Topical PRF is a separate service.',
    ],
    injectables: [
      'Movement and volume are different concerns.',
      'Dermal filler is a separate service category',
      'movement and volume are not the same concern',
    ],
    'dermal-fillers': [
      'Volume has more than one product.',
      'Neurotoxin injections are a separate service category',
      'not the volume category',
    ],
  };

  for (const [slug, retiredCopy] of Object.entries(retiredInjectableFormulas)) {
    const html = readFileSync(path.join(DIST_ROOT, `services/${slug}/index.html`), 'utf8');
    const section = html.match(/<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const text = visibleText(section);

    for (const value of retiredCopy) {
      if (text.includes(value)) failures.push(`${slug}: retains formulaic contrast ${JSON.stringify(value)}`);
    }
  }

  const retiredSkinRenewalFormulas = {
    biorepeel: [
      'A peel, not a needling service.',
      'does not require a separate needling service',
      'Separate from Microneedling',
      'a different service category',
    ],
    microneedling: [
      'One microneedling service. Several current menu options.',
      'not a second modality',
      'a separate current menu option',
    ],
    prf: [
      'PRF describes more than one service.',
      'as separate service categories',
      'are not interchangeable menu entries',
      'keeps topical and injectable PRF services separate',
    ],
    'prf-injections': [
      'Two injectable PRF listings. One separate topical service.',
      'are separate current menu listings',
      'is not part of this injectable category',
      'keeps topical and injectable PRF services separate',
    ],
  };

  for (const [slug, retiredCopy] of Object.entries(retiredSkinRenewalFormulas)) {
    const html = readFileSync(path.join(DIST_ROOT, `services/${slug}/index.html`), 'utf8');
    const section = html.match(/<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const text = visibleText(section);

    for (const value of retiredCopy) {
      if (text.includes(value)) failures.push(`${slug}: retains formulaic contrast ${JSON.stringify(value)}`);
    }
  }

  const glo = visibleText(readFileSync(path.join(DIST_ROOT, 'services/glo2facial/index.html'), 'utf8'));
  for (const retiredOrUnverified of ['HydraFacial', '$195', '$225', '$250', 'no downtime']) {
    if (glo.toLowerCase().includes(retiredOrUnverified.toLowerCase())) {
      failures.push(`glo2facial: contains retired or unreconciled ${JSON.stringify(retiredOrUnverified)}`);
    }
  }
  const gloHtml = readFileSync(path.join(DIST_ROOT, 'services/glo2facial/index.html'), 'utf8');
  if (!gloHtml.includes('"@type":"FAQPage"')) failures.push('glo2facial: missing FAQPage JSON-LD');

  const morpheus = visibleText(readFileSync(path.join(DIST_ROOT, 'services/morpheus8/index.html'), 'utf8'));
  for (const unsupported of ['tightening', 'lifting', 'jowls', 'body sculpting']) {
    if (morpheus.toLowerCase().includes(unsupported)) {
      failures.push(`morpheus8: contains unsupported positioning ${JSON.stringify(unsupported)}`);
    }
  }

  const dermaplaningHtml = readFileSync(path.join(DIST_ROOT, 'services/dermaplaning/index.html'), 'utf8');
  if (!dermaplaningHtml.includes('"@type":"FAQPage"')) failures.push('dermaplaning: missing FAQPage JSON-LD');

  const lumeccaHtml = readFileSync(path.join(DIST_ROOT, 'services/lumecca-peak-ipl/index.html'), 'utf8');
  if (!lumeccaHtml.includes('"@type":"FAQPage"')) failures.push('lumecca-peak-ipl: missing FAQPage JSON-LD');

  const formaHtml = readFileSync(path.join(DIST_ROOT, 'services/forma-rf-facial/index.html'), 'utf8');
  if (!formaHtml.includes('"@type":"FAQPage"')) failures.push('forma-rf-facial: missing FAQPage JSON-LD');
  for (const route of ['/services/morpheus8/', '/services/lumecca-peak-ipl/']) {
    if (!formaHtml.includes(`href="${route}"`)) failures.push(`forma-rf-facial: missing ${route}`);
  }

  const prfInjectionsHtml = readFileSync(path.join(DIST_ROOT, 'services/prf-injections/index.html'), 'utf8');
  const prfInjections = visibleText(mainHtml(prfInjectionsHtml));
  for (const required of [
    'Diana Morrison, RN',
    'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
  ]) {
    if (!prfInjections.includes(required)) failures.push(`prf-injections: missing ${JSON.stringify(required)}`);
  }
  for (const unsupported of ['EZ Gel', 'PRF Body Treatments', '$595']) {
    if (prfInjections.includes(unsupported)) failures.push(`prf-injections: contains out-of-scope ${JSON.stringify(unsupported)}`);
  }
  if (/PRF Under-Eye — Consultation[^<]{0,160}\b(?:45|60|75) minutes\b/i.test(prfInjectionsHtml)) {
    failures.push('prf-injections: publishes an unreconciled PRF Under-Eye duration');
  }

  const injectablesHubHtml = readFileSync(path.join(DIST_ROOT, 'services/injectables-bio-fillers/index.html'), 'utf8');
  const injectablesHubEducation = injectablesHubHtml.match(/<section\b[^>]*data-injectables-hub-overview[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  const injectablesHubText = visibleText(injectablesHubEducation);
  for (const unsupported of ['EZ Gel', 'RHA 4', 'Restylane', 'PRF Body Treatments']) {
    if (injectablesHubText.includes(unsupported)) {
      failures.push(`injectables-bio-fillers: contains unsupported ${JSON.stringify(unsupported)}`);
    }
  }
  if (/PRF Under-Eye — Consultation[^<]{0,160}\b(?:45|60|75) minutes\b/i.test(injectablesHubEducation)) {
    failures.push('injectables-bio-fillers: publishes an unreconciled PRF Under-Eye duration');
  }

  const ivHtml = readFileSync(path.join(DIST_ROOT, 'services/iv-hydration-therapy/index.html'), 'utf8');
  const ivText = visibleText(mainHtml(ivHtml));
  const ivCategoryOverview = ivHtml.match(
    /<div\b[^>]*data-iv-category-overview[^>]*>([\s\S]*?)<\/div>/i,
  )?.[1] ?? '';
  for (const required of [
    'Hydration IV',
    'Immunity IV',
    'Recovery IV',
    'Beauty Glow IV',
    'Reboot (Hangover Recovery) IV',
    "Myers' Cocktail IV",
    'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    'Which IV hydration options are currently listed?',
  ]) {
    if (!ivText.includes(required)) failures.push(`iv-hydration-therapy: missing ${JSON.stringify(required)}`);
  }
  for (const required of [
    'At House of Rose, an IV drip is IV Hydration Therapy.',
    'IV stands for intravenous',
    'six base options',
    'An option name is not an ingredient list.',
    'verified names, appointment lengths, and prices',
  ]) {
    if (!visibleText(ivCategoryOverview).includes(required)) {
      failures.push(`iv-hydration-therapy category overview: missing ${JSON.stringify(required)}`);
    }
  }
  if (!ivHtml.includes('"@type":"FAQPage"')) failures.push('iv-hydration-therapy: missing FAQPage JSON-LD');
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  if (!sitemap.includes(`<loc>${SITE_ORIGIN}/services/iv-hydration-therapy/</loc>`)) {
    failures.push('iv-hydration-therapy: canonical route is missing from sitemap.xml');
  }
  if (sitemap.includes(`${SITE_ORIGIN}/services/iv-drip/`)) {
    failures.push('iv-hydration-therapy: duplicate /services/iv-drip/ route appears in sitemap.xml');
  }
  for (const unsupported of ['no downtime', 'near-full-dose', 'bioavailability']) {
    if (ivText.toLowerCase().includes(unsupported)) failures.push(`iv-hydration-therapy: contains unsupported ${JSON.stringify(unsupported)}`);
  }

  const faceRealityHtml = mainHtml(readFileSync(path.join(DIST_ROOT, 'services/face-reality-acne-program/index.html'), 'utf8'));
  for (const required of [
    'Amber Mingione, Licensed Esthetician',
    'href="/about/providers/amber/"',
  ]) {
    if (!faceRealityHtml.includes(required)) failures.push(`face-reality-acne-program: missing ${JSON.stringify(required)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Priority service education regression', failures));
});

test('services index keeps canonical decision hubs and provider orientation visible', () => {
  const file = path.join(DIST_ROOT, 'services/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const guidance = main.match(
    /<section\b[^>]*data-service-index-guidance[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const guidanceText = visibleText(guidance);
  const failures = [];

  for (const required of [
    'Open the page that sounds closest to what you need.',
    'explains what the appointment is',
    'you will see the person’s name and licence type there too',
  ]) {
    if (!guidanceText.includes(required)) failures.push(`services index guidance is missing ${JSON.stringify(required)}`);
  }
  if (!guidance.includes('href="/about/providers/"')) {
    failures.push('services index guidance is missing the provider-directory link');
  }

  const requiredServiceRoutes = [
    '/services/injectables-bio-fillers/',
    '/services/biorepeel/',
    '/services/face-reality-acne-program/',
    '/services/microneedling/',
    '/services/prf/',
  ];
  for (const route of requiredServiceRoutes) {
    if (!main.includes(`href="${route}"`)) failures.push(`services index is missing canonical entry ${route}`);
  }

  for (const required of [
    'Topical TCA-based peel · standalone face treatment',
    'Procell Therapies · controlled microchannels · topical PRF option',
    'Acne consultation · 12-week Acne Bootcamp program',
    'Topical PRF with microneedling · injectable under-eye · Bio-Filler',
    'Six current IV options · 30 or 45 minutes',
  ]) {
    if (!visibleText(main).includes(required)) failures.push(`services index is missing ${JSON.stringify(required)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Services-index depth regression', failures));
});

test('provider profiles explain verified roles and connect them to current services', () => {
  const expectations = {
    diana: [
      'Diana Morrison, RN',
      'Botox and Daxxify for movement-related lines',
      'IV hydration',
      'GLP-1 weight management',
      'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
      'href="/services/injectables/"',
      'href="/services/iv-hydration-therapy/"',
    ],
    amber: [
      'Amber Mingione, Licensed Esthetician',
      'Microneedling with the Procell Therapies device',
      'BioRePeel when used as an add-on',
      'Diana Morrison, RN provides the injectable PRF appointments.',
      'href="/services/microneedling/"',
      'href="/services/dermaplaning/"',
    ],
    brandy: [
      'Brandy is a Licensed Esthetician',
      'Standalone BioRePeel is booked with Brandy',
      'brows, the upper lip, and the chin',
      'href="/services/biorepeel/"',
      'href="/services/facial-waxing/"',
    ],
    aundrea: [
      'Aundrea Pedigo, Esthetician',
      'weddings, special events, photo shoots, and celebrations',
      'fitted, clasp-free chain closed by welding',
      'non-medical services',
      'href="/services/permanent-jewelry/"',
    ],
  };
  const failures = [];

  for (const [slug, required] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `about/providers/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const main = mainHtml(html);
    for (const value of required) {
      if (!main.includes(value)) failures.push(`${slug}: missing ${JSON.stringify(value)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Provider-profile depth regression', failures));
});

test('provider directory and legacy contact cards match reviewed provider facts', () => {
  const directoryFile = path.join(DIST_ROOT, 'about/providers/index.html');
  assert.ok(existsSync(directoryFile), `Missing generated ${relativeToRepo(directoryFile)}`);
  const directoryHtml = mainHtml(readFileSync(directoryFile, 'utf8'));
  const directoryText = visibleText(directoryHtml);
  const directoryExpectations = {
    diana: ['Diana Morrison, RN', 'Neuromodulators', 'Dermal fillers', 'Injectable PRF', 'IV hydration', 'GLP-1 weight management'],
    amber: ['Amber Mingione, Licensed Esthetician', 'Microneedling with the Procell Therapies device', 'Topical PRF', 'Glo2Facial', 'Dermaplaning', 'BioRePeel add-on'],
    brandy: ['Brandy, Licensed Esthetician', 'Facials', 'Standalone BioRePeel', 'Facial waxing'],
    aundrea: ['Aundrea Pedigo, Esthetician', 'Wedding makeup', 'Special-event makeup', 'Photo-shoot makeup', 'Permanent jewelry'],
  };
  const expectedProfileRoutes = Object.keys(directoryExpectations)
    .map((slug) => `/about/providers/${slug}/`)
    .sort();
  const directoryProfileRoutes = [...new Set(
    extractHrefAttributes(directoryHtml, true)
      .filter((href) => /^\/about\/providers\/[^/]+\/$/.test(href)),
  )].sort();
  assert.deepEqual(
    directoryProfileRoutes,
    expectedProfileRoutes,
    'Provider directory must link each reviewed profile exactly once.',
  );
  for (const [slug, required] of Object.entries(directoryExpectations)) {
    for (const value of required) {
      assert.ok(directoryText.includes(value), `Provider directory ${slug} card is missing ${JSON.stringify(value)}.`);
    }
  }

  const cardExpectations = {
    amber: {
      required: ['Amber Mingione, Licensed Esthetician', 'BioRePeel add-on', 'Medical Director: Joshua Shaw, MD · FL Lic. ME136232'],
      forbidden: ['Face Reality Acne Program'],
    },
    diana: {
      required: ['Diana Morrison, RN', 'Injectable PRF', 'PRF Bio-Filler', 'Medical Director: Joshua Shaw, MD · FL Lic. ME136232'],
      forbidden: [],
    },
    brandy: {
      required: ['Brandy, Licensed Esthetician', 'Standalone BioRePeel', 'Facial Waxing'],
      forbidden: [],
    },
  };

  for (const [slug, expectation] of Object.entries(cardExpectations)) {
    const cardFile = path.join(DIST_ROOT, slug, 'index.html');
    const vcardFile = path.join(DIST_ROOT, `${slug}.vcf`);
    assert.ok(existsSync(cardFile), `Missing generated ${relativeToRepo(cardFile)}`);
    assert.ok(existsSync(vcardFile), `Missing generated ${relativeToRepo(vcardFile)}`);
    const cardHtml = mainHtml(readFileSync(cardFile, 'utf8'));
    const cardText = visibleText(cardHtml);
    const vcard = readFileSync(vcardFile, 'utf8');

    for (const value of expectation.required) {
      assert.ok(cardText.includes(value), `${slug} card is missing ${JSON.stringify(value)}.`);
    }
    for (const value of expectation.forbidden) {
      assert.ok(!cardText.includes(value), `${slug} card contains stale ${JSON.stringify(value)}.`);
      assert.ok(!vcard.includes(value), `${slug}.vcf contains stale ${JSON.stringify(value)}.`);
    }
    for (const required of [
      `href="/${slug}.vcf"`,
      `href="/about/providers/${slug}/"`,
      '(844) 941-7673',
      '525 E Olympia Ave, Unit 9',
      'Punta Gorda, FL 33950',
    ]) {
      assert.ok(cardHtml.includes(required), `${slug} card is missing ${JSON.stringify(required)}.`);
    }
    for (const required of [
      'ORG:House of Rose Aesthetics',
      'TEL;TYPE=CELL,VOICE:+18449417673',
      'EMAIL;TYPE=INTERNET,WORK:info@houseofrosefl.com',
      `URL:https://houseofrosefl.com/about/providers/${slug}/`,
      'ADR;TYPE=WORK:;;525 E Olympia Ave\\, Unit 9;Punta Gorda;FL;33950;USA',
    ]) {
      assert.ok(vcard.includes(required), `${slug}.vcf is missing ${JSON.stringify(required)}.`);
    }
  }
});

test('cost guides explain the current price structure instead of publishing a bare number', () => {
  const expectations = {
    'botox-cost-punta-gorda': ['Botox is priced by the unit.', 'What $14 per unit means.', 'Botox', '$14 per unit', '30 minutes', 'Is $14 the total price for a Botox appointment?'],
    'dermal-fillers-cost-punta-gorda': ['Five products make up the range.', 'Products, range, and consultation.', 'Juvéderm Ultra XC', 'Juvéderm Voluma XC', 'RHA 1', 'RHA 2', 'RHA 3', 'Dermal Filler Consultation', '$300'],
    'forma-cost-punta-gorda': ['The treatment area sets the listed price.', 'How the area menu is priced.', 'Face & Neck', '$3,000', 'Eyes', '$600', 'Forma + Lumecca Bundle', '$2,599'],
    'ipl-photofacial-cost-punta-gorda': ['Area and series determine the listing.', 'How to read the $250–$2,600 range.', 'Legs · Full Face · Chest · Neck', 'Spot · Hands', 'Single and three-session listings', '$250–$2,600 overall'],
    'biorepeel-cost-punta-gorda': ['One treatment or a series of three.', 'Standalone and series pricing.', 'BioRePeel Cl3 Rejuvenation', '$250', 'Series of 3', '$699'],
    'microneedling-cost-punta-gorda': ['Pro and MD are separate menu options.', 'Pro, MD, and topical PRF.', 'Procell Therapies — Pro', '$300', 'Procell Therapies — MD', '$400', 'PRF Microneedling — Consultation', '$595'],
    'morpheus8-cost-punta-gorda': ['Only the combination price is published.', 'What is—and is not—priced.', 'standalone Morpheus8 price is not published', 'Morpheus8 + Lumecca Bundle', '$1,799', 'not a standalone Morpheus8 price'],
  };
  const failures = [];

  for (const [slug, requiredCopy] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `cost/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const text = visibleText(mainHtml(html));
    for (const value of requiredCopy) {
      if (!text.includes(value)) failures.push(`${slug}: missing ${JSON.stringify(value)}`);
    }
    if (!text.includes('Menu checked August 6, 2026')) {
      failures.push(`${slug}: missing readable verification date`);
    }

    const faqSection = html.match(/<section\b[^>]*data-cost-faq[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const visibleFaqs = [...faqSection.matchAll(
      /<h3\b[^>]*data-cost-faq-question[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*data-cost-faq-answer[^>]*>([\s\S]*?)<\/p>/gi,
    )].map((match) => ({
      question: visibleText(match[1]),
      answer: visibleText(match[2]),
    }));
    const faqSchema = [...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    )]
      .map((match) => JSON.parse(match[1]))
      .find((schema) => schema?.['@type'] === 'FAQPage');
    const schemaFaqs = faqSchema?.mainEntity?.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer?.text,
    })) ?? [];
    if (visibleFaqs.length < 2) failures.push(`${slug}: expected at least two visible factual FAQs`);
    if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
      failures.push(`${slug}: visible FAQ copy and FAQPage JSON-LD differ`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Cost-guide depth regression', failures));
});

test('the cost index links each active guide to its related service', () => {
  const expectedServiceLinks = [
    '/services/injectables/',
    '/services/dermal-fillers/',
    '/services/forma-rf-facial/',
    '/services/lumecca-peak-ipl/',
    '/services/biorepeel/',
    '/services/microneedling/',
    '/services/morpheus8/',
  ];
  const file = path.join(DIST_ROOT, 'cost/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = mainHtml(readFileSync(file, 'utf8'));
  const failures = expectedServiceLinks
    .filter((href) => !html.includes(`href="${href}"`))
    .map((href) => `missing direct related-service link ${href}`);

  assert.equal(failures.length, 0, formatFailures('Cost-index navigation regression', failures));
});

test('concern guides explain the distinction before presenting a treatment list', () => {
  const expectations = {
    aging: 'What catches your eye first?',
    'dark-circles': 'Under-eye darkness may be color, shadow, or both.',
    'fine-lines-laxity': 'The same area can show more than one kind of line.',
    'acne-scarring': 'Look at the shape and depth of the scar.',
    'active-acne': 'Are new breakouts appearing, or are you seeing what they left behind?',
    hyperpigmentation: 'Is it one spot, a diffuse patch, or a mark left after inflammation?',
    'volume-loss': 'Where does the face look less full or supported?',
    'sun-damage': 'Do spots, uneven color, or a rougher surface stand out most?',
    texture: 'What does “texture” look like up close?',
    'stretch-marks': 'How do the marks look now?',
  };
  const faceConcernFacts = {
    aging: ['rougher surface', 'uneven color', 'appears with expression', 'surface, pigment, movement, or volume'],
    'dark-circles': ['thin or translucent skin', 'visible vessels', 'structural shadow', 'outside what an aesthetic service can change'],
    'fine-lines-laxity': ['repeated facial movement', 'skin texture', 'facial support', 'neurotoxins for movement-related lines', 'fillers for selected volume changes', 'resurfacing or device services'],
    'volume-loss': ['hollow, fold, or shift in facial shape', 'manufactured hyaluronic-acid gels', 'small sample of your own blood', 'Botox and Daxxify'],
  };
  const consultationHeadings = {
    aging: 'Bring the change you notice most.',
    'dark-circles': 'Describe the darkness in your own words.',
    'fine-lines-laxity': 'Point to the line or change that bothers you.',
    'acne-scarring': 'Show us the texture from more than one angle.',
    'active-acne': 'Tell us what is new and what has remained.',
    hyperpigmentation: 'Show us the color and its pattern.',
    'volume-loss': 'Tell us where the face looks less supported.',
    'sun-damage': 'Tell us what your eye goes to first.',
    texture: 'Describe what you see and what you can feel.',
    'stretch-marks': 'Show us the marks as they are today.',
  };
  const retiredFaceConcernCadence = [
    /services below/i,
    /linked services/i,
    /different questions/i,
    /treatment categories/i,
    /not one visible change/i,
  ];
  const failures = [];

  for (const [slug, heading] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `concerns/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const education = html.match(/<section\b[^>]*data-concern-education[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const text = visibleText(education);
    if (!education) failures.push(`${slug}: missing concern education section`);
    if (!text.includes(heading)) failures.push(`${slug}: missing ${JSON.stringify(heading)}`);
    const requiredFacts = faceConcernFacts[slug];
    if (requiredFacts) {
      for (const fact of requiredFacts) {
        if (!text.includes(fact)) failures.push(`${slug}: missing preserved distinction ${JSON.stringify(fact)}`);
      }
      for (const pattern of retiredFaceConcernCadence) {
        if (pattern.test(text)) failures.push(`${slug}: contains retired institutional cadence ${pattern}`);
      }
    }
    const main = mainHtml(html);
    const mainText = visibleText(main);
    const consultationHeading = visibleText(
      main.match(/<h2\b[^>]*data-concern-consultation-heading[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '',
    );
    const consultationPrompt = visibleText(
      main.match(/<p\b[^>]*data-concern-consultation-prompt[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '',
    );
    if (consultationHeading !== consultationHeadings[slug]) {
      failures.push(`${slug}: missing its concern-specific consultation heading`);
    }
    if (consultationPrompt.split(/\s+/).length < 12) {
      failures.push(`${slug}: consultation prompt is missing useful concern context`);
    }
    for (const retired of [
      'Talk with House of Rose.',
      'Call the practice, or send an inquiry with the concern you want to discuss.',
      'Recognize the concern, but not the distinction?',
    ]) {
      if (mainText.includes(retired)) failures.push(`${slug}: contains retired repeated CTA ${JSON.stringify(retired)}`);
    }
  }

  if (new Set(Object.values(consultationHeadings)).size !== Object.keys(expectations).length) {
    failures.push('concern-specific consultation headings are not unique');
  }

  assert.equal(failures.length, 0, formatFailures('Concern-guide depth regression', failures));
});

test('concern index preserves reviewed distinctions and direct guide navigation', () => {
  const file = path.join(DIST_ROOT, 'concerns/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const guidance = html.match(/<section\b[^>]*data-concern-index-guidance[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  const text = visibleText(guidance);
  const failures = [];

  if (!guidance) failures.push('concerns index is missing reviewed guidance');
  for (const required of [
    'Are new breakouts appearing, or are you seeing what they left behind?',
    'Under-eye darkness may be color, shadow, or both.',
    'The same area can show more than one kind of line.',
    'They are observations, not a diagnosis.',
  ]) {
    if (!text.includes(required)) failures.push(`concerns index is missing ${JSON.stringify(required)}`);
  }
  for (const route of [
    '/concerns/active-acne/',
    '/concerns/acne-scarring/',
    '/concerns/dark-circles/',
    '/concerns/fine-lines-laxity/',
    '/concerns/texture/',
    '/concerns/volume-loss/',
  ]) {
    if (!guidance.includes(`href="${route}"`)) failures.push(`concerns index guidance is missing ${route}`);
  }

  assert.equal(failures.length, 0, formatFailures('Concern-index depth regression', failures));
});

test('areas index identifies one real practice instead of implying satellite offices', () => {
  const file = path.join(DIST_ROOT, 'areas/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = mainHtml(readFileSync(file, 'utf8'));
  const practiceSection = html.match(
    /<section\b[^>]*data-area-index-practice[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const text = visibleText(practiceSection);
  const failures = [];

  for (const required of [
    'The city names below are service areas, not separate offices.',
    'one practice at 525 E Olympia Ave, Unit 9 in Punta Gorda',
    'The photograph is the storefront you will see when you arrive.',
    'not additional House of Rose locations',
    'free parking is available',
  ]) {
    if (!text.includes(required)) failures.push(`areas index: missing ${JSON.stringify(required)}`);
  }
  for (const required of [
    'src="/images/optimized/house-of-rose-storefront-700.webp"',
    'href="/contact/"',
    'href="/services/"',
  ]) {
    if (!practiceSection.includes(required)) failures.push(`areas index: missing ${JSON.stringify(required)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Area-index practice clarity regression', failures));
});

test('area detail guides distinguish the location from the service area and support trip planning', () => {
  const expectations = {
    'punta-gorda': {
      heading: 'House of Rose is in Unit 9.',
      locationAnswer: 'This is our one House of Rose practice',
      satelliteAnswer: undefined,
    },
    'port-charlotte': {
      heading: 'Your appointment is in Punta Gorda.',
      locationAnswer: undefined,
      satelliteAnswer: 'it does not represent a second location.',
    },
  };
  const failures = [];

  for (const [slug, expectation] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `areas/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const main = mainHtml(html);
    const visitPlanning = main.match(
      /<section\b[^>]*data-area-visit-planning[^>]*>([\s\S]*?)<\/section>/i,
    )?.[1] ?? '';
    const text = visibleText(main);

    if (!visitPlanning) failures.push(`${slug}: missing trip-planning section`);
    for (const required of [
      expectation.heading,
      'The storefront photograph shows the entrance',
      'Free parking is available.',
      'whether to book online, request a consultation, or call first',
      'href="/services/"',
      'href="tel:+18449417673"',
    ]) {
      const haystack = required.startsWith('href=') ? visitPlanning : visibleText(visitPlanning);
      if (!haystack.includes(required)) failures.push(`${slug}: missing ${JSON.stringify(required)}`);
    }
    if (expectation.locationAnswer && !text.includes(expectation.locationAnswer)) {
      failures.push(`${slug}: missing one-location answer`);
    }
    if (expectation.satelliteAnswer && !text.includes(expectation.satelliteAnswer)) {
      failures.push(`${slug}: missing satellite-office clarification`);
    }
    for (const requiredFaq of [
      'What should I check before making the trip?',
      'Is parking available?',
    ]) {
      if (!text.includes(requiredFaq)) failures.push(`${slug}: visible FAQ is missing ${JSON.stringify(requiredFaq)}`);
      if (!html.includes(`"name":"${requiredFaq}"`)) failures.push(`${slug}: FAQ schema is missing ${JSON.stringify(requiredFaq)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Area-detail trip-planning regression', failures));
});

test('results index explains the proof standard even when no cases are published', () => {
  const file = path.join(DIST_ROOT, 'results/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const standard = main.match(
    /<section\b[^>]*data-results-standard[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const text = visibleText(standard);
  const failures = [];

  for (const required of [
    'Two pictures can be persuasive before they are informative.',
    'same distance, crop, angle, lighting, and background',
    'Retouching or editing must not change the apparent result.',
    'anything else used in the same series that contributed to the result',
    'The elapsed timeframe—and the number of sessions when relevant',
    'Written client permission is required for website publication.',
    'individual results vary',
  ]) {
    if (!text.includes(required)) failures.push(`results index: missing ${JSON.stringify(required)}`);
  }

  if (/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b/i.test(html)) {
    const emptyState = 'No client cases are currently published. House of Rose does not substitute stock or context-free images for consented client documentation.';
    if (!visibleText(main).includes(emptyState)) failures.push('results index: empty state does not explain why proof is absent');
  }
  for (const retired of ['Real results, real clients', 'being photographed now']) {
    if (visibleText(main).includes(retired)) failures.push(`results index: contains retired ${JSON.stringify(retired)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Results-proof standard regression', failures));
});

test('comparison pages expose only reviewed factual row types', () => {
  const allowed = new Set(['technology', 'primary concerns', 'treatment areas', 'recovery']);
  const compareRoot = path.join(DIST_ROOT, 'compare');
  const comparisonFiles = readdirSync(compareRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(compareRoot, entry.name, 'index.html'))
    .filter(isFile);
  const failures = [];

  for (const file of comparisonFiles) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/data-sb-field-path="rows\.\d+\.attribute"[^>]*>\s*([^<]+?)\s*<\/td>/gi)) {
      const attribute = decodeHtmlEntities(match[1]).trim();
      if (!allowed.has(attribute.toLowerCase())) failures.push(`${relativeToRepo(file)}: ${attribute}`);
    }
  }

  const morpheusFile = path.join(compareRoot, 'morpheus8-vs-microneedling/index.html');
  assert.ok(existsSync(morpheusFile), `Missing generated ${relativeToRepo(morpheusFile)}`);
  const morpheusText = visibleText(mainHtml(readFileSync(morpheusFile, 'utf8')));
  for (const required of [
    'Morpheus8 vs. Microneedling',
    'Morpheus8 adds fractional bipolar radiofrequency; Procell microneedling does not.',
    'Where they separate',
    'What they have in common',
    'Current House of Rose role',
  ]) {
    if (!morpheusText.includes(required)) failures.push(`morpheus8-vs-microneedling: missing ${JSON.stringify(required)}`);
  }
  for (const retired of [
    'Which Texture Treatment Fits?',
    'The published differences are listed side by side below.',
    'Areas confirmed for the microneedling plan',
  ]) {
    if (morpheusText.includes(retired)) failures.push(`morpheus8-vs-microneedling: contains retired ${JSON.stringify(retired)}`);
  }

  const daxxifyFile = path.join(compareRoot, 'daxxify-vs-botox/index.html');
  assert.ok(existsSync(daxxifyFile), `Missing generated ${relativeToRepo(daxxifyFile)}`);
  const daxxifyHtml = readFileSync(daxxifyFile, 'utf8');
  const daxxifyText = visibleText(mainHtml(daxxifyHtml));
  for (const required of [
    'Daxxify vs. Botox',
    'cannot be compared or converted between products',
    '$14 per Daxxify unit',
    '$14 per Botox unit',
    'Published onset evidence',
    'Median 3 days to subject-rated improvement of at least 1 point',
    'chemical denervation typically begins 1–2 days after injection',
    'Downtime evidence',
    'does not establish one universal downtime period',
    'They are not a dose-conversion table, a direct head-to-head trial, or a promise about an individual result.',
    'Are Daxxify and Botox units interchangeable?',
    'Is there a verified downtime difference between Daxxify and Botox?',
  ]) {
    if (!daxxifyText.includes(required)) failures.push(`daxxify-vs-botox: missing ${JSON.stringify(required)}`);
  }
  for (const retired of [
    'Which Wrinkle Relaxer Is Right for You?',
    'The proven classic',
    'Fewer maintenance visits',
    'refreshed, not frozen',
    'Builds over ~2 weeks',
  ]) {
    if (daxxifyText.includes(retired)) failures.push(`daxxify-vs-botox: contains retired ${JSON.stringify(retired)}`);
  }
  if (/\bno downtime\b/i.test(daxxifyText)) {
    failures.push('daxxify-vs-botox: contains an unsupported no-downtime claim');
  }
  if (!daxxifyHtml.includes('"@type":"FAQPage"')) failures.push('daxxify-vs-botox: missing FAQPage JSON-LD');
  if (!daxxifyHtml.includes('"@type":"Article"')) failures.push('daxxify-vs-botox: missing Article JSON-LD');

  for (const inboundRoute of [
    'services/index.html',
    'services/injectables-bio-fillers/index.html',
    'services/injectables/index.html',
    'concerns/aging/index.html',
    'concerns/fine-lines-laxity/index.html',
  ]) {
    const inboundFile = path.join(DIST_ROOT, inboundRoute);
    const inboundHtml = readFileSync(inboundFile, 'utf8');
    if (!inboundHtml.includes('href="/compare/daxxify-vs-botox/"')) {
      failures.push(`daxxify-vs-botox: missing contextual link from /${inboundRoute.replace(/index\.html$/, '')}`);
    }
  }
  const allInboundSources = publicHtmlFiles.filter((file) =>
    readFileSync(file, 'utf8').includes('href="/compare/daxxify-vs-botox/"')
  );
  if (allInboundSources.length < 5) {
    failures.push(`daxxify-vs-botox: expected at least 5 inbound public HTML sources, found ${allInboundSources.length}`);
  }
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  if (!sitemap.includes(`<loc>${SITE_ORIGIN}/compare/daxxify-vs-botox/</loc>`)) {
    failures.push('daxxify-vs-botox: missing from sitemap.xml');
  }

  assert.equal(failures.length, 0, formatFailures('Unreviewed comparison rows', failures));
});

test('AI service inventory omits raw CMS prices and durations', () => {
  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  const compactServices = compactFeed.match(/## Services\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? '';
  const allowedDurations = new Set([
    '20 minutes',
    '30–45 minutes',
    '10–30 minutes by area',
  ]);
  const emittedDurations = [...fullFeed.matchAll(/^Duration:\s*(.+)$/gm)].map((match) => match[1].trim());

  assert.ok(!compactServices.includes('$'), 'Compact service inventory contains a raw CMS price.');
  assert.ok(!/^Price:/m.test(fullFeed), 'Full service inventory contains a raw CMS price.');
  assert.ok(
    emittedDurations.every((duration) => allowedDurations.has(duration)),
    `Full service inventory contains an unverified duration: ${emittedDurations.filter((duration) => !allowedDurations.has(duration)).join(', ')}`,
  );

  for (const reviewedDepth of [
    'Overview:',
    'Current verified menu',
    'Current verified IV menu:',
    'Hydration IV — $99 · 30 minutes.',
    'Current verified listing: PRF Under-Eye — Consultation — $495.',
    'The appointment length is omitted because current menu sources disagree.',
    'Morpheus8 combines microneedling with fractional bipolar radiofrequency in one InMode device.',
  ]) {
    assert.ok(
      fullFeed.includes(reviewedDepth),
      `Full service inventory is missing reviewed depth: ${JSON.stringify(reviewedDepth)}.`,
    );
  }

  for (const unresolvedFact of ['$299', '$399', 'EZ Gel']) {
    assert.ok(
      !fullFeed.includes(unresolvedFact),
      `Full service inventory contains unresolved service information: ${unresolvedFact}.`,
    );
  }
});

test('packages index explains and links only the verified current program', () => {
  const file = path.join(DIST_ROOT, 'packages/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);

  const main = mainHtml(readFileSync(file, 'utf8'));
  const text = visibleText(main);
  for (const required of [
    'At House of Rose, a treatment package is a defined program',
    'one program: Acne Bootcamp',
    '12-week Face Reality program',
    'in-studio visits every two weeks',
    '$899',
  ]) {
    assert.ok(text.includes(required), `Packages index is missing ${JSON.stringify(required)}.`);
  }

  const packageRoutes = [...new Set(
    extractHrefAttributes(main, true)
      .filter((href) => href.startsWith('/packages/')),
  )];
  assert.deepEqual(
    packageRoutes,
    ['/packages/face-reality-12-week-program/'],
    'Packages index must link only the verified current package route.',
  );
  assert.ok(
    main.includes('href="/services/face-reality-acne-program/"'),
    'Packages index must link the related Face Reality service.',
  );

  for (const retiredOrUnverified of [
    'glo2facial-series-',
    'dermaplaning-series-',
    'dermaplaning-package-',
    'prf-under-eye-series-',
    'prf-microneedling-series-',
  ]) {
    assert.ok(!main.includes(retiredOrUnverified), `Packages index contains ${retiredOrUnverified}.`);
  }
});

test('Face Reality package distinguishes the consultation, complete program, and home care', () => {
  const file = path.join(DIST_ROOT, 'packages/face-reality-12-week-program/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);

  const main = mainHtml(readFileSync(file, 'utf8'));
  const text = visibleText(main);
  for (const required of [
    'The $899 figure is the price of the complete 12-week program, not the price of one visit.',
    'The current menu lists a 60-minute Acne Bootcamp Consultation at $99.',
    'Home-care products selected after consultation are a separate purchase.',
    'Amber Mingione, Licensed Esthetician and Face Reality Certified Acne Specialist',
  ]) {
    assert.ok(text.includes(required), `Face Reality package is missing ${JSON.stringify(required)}.`);
  }
  assert.ok(
    main.includes('href="/services/face-reality-acne-program/"'),
    'Face Reality package must link the related service overview.',
  );
  assert.ok(
    main.includes('href="/about/providers/amber/"'),
    'Face Reality package must link Amber’s verified provider profile.',
  );
});

test('waxing hub is a factual directory and PRF under-eye uses reviewed public facts', () => {
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
  const facial = mainHtml(readFileSync(facialFile, 'utf8'));
  const body = mainHtml(readFileSync(bodyFile, 'utf8'));
  const serviceIndex = mainHtml(readFileSync(serviceIndexFile, 'utf8'));
  const collection = readFileSync(collectionFile, 'utf8');
  const prfUnderEyeHtml = readFileSync(prfUnderEyeFile, 'utf8');
  const prfUnderEye = mainHtml(prfUnderEyeHtml);
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const compactFeed = readFileSync(compactFeedFile, 'utf8');
  const fullFeed = readFileSync(fullFeedFile, 'utf8');
  const publicInventory = `${hub}\n${sitemap}\n${compactFeed}\n${fullFeed}`.toLowerCase();

  assert.equal(occurrenceCount(hub, 'href="/services/facial-waxing/"'), 1, 'Waxing hub must link Facial Waxing once in main content.');
  assert.equal(occurrenceCount(hub, 'href="/services/body-waxing/"'), 1, 'Waxing hub must link Body Waxing once in main content.');
  assert.ok(
    visibleText(hub).includes('Facial and body waxing, organized by area.'),
    'Waxing hub must orient clients to the two current area menus.',
  );
  assert.ok(
    visibleText(hub).includes('eyebrows, upper lip, and chin')
      && visibleText(hub).includes('underarms, bikini line, arms, legs, back, and chest'),
    'Waxing hub must identify the verified areas in each service lane.',
  );
  for (const required of ['Eyebrow Shape, Trim &amp; Wax', '$25', '25 minutes']) {
    assert.ok(facial.includes(required), `Facial Waxing is missing ${required}.`);
  }
  for (const required of ['Bikini Line', '$30', 'Full Arm', '$45']) {
    assert.ok(body.includes(required), `Body Waxing is missing ${required}.`);
  }
  assert.ok(!/10[–-]30 minutes|10[–-]40 minutes/i.test(hub), 'Waxing hub must not repeat disputed child durations.');
  assert.ok(serviceIndex.includes('href="/services/waxing/"'), 'Services index must link the Waxing hub.');
  assert.ok(!hub.includes('href="/services/collections/waxing/"'), 'Waxing hub must not send clients back to the same-named noindex collection.');
  assert.ok(hub.includes('href="/services/"'), 'Waxing hub must provide a path back to all services.');
  assert.ok(/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b[^"]*\bfollow\b/i.test(collection), 'Waxing collection must remain noindex,follow.');
  assert.ok(collection.includes('href="/services/waxing/"'), 'Waxing collection must link the canonical hub.');
  for (const route of ['/services/waxing/', '/services/facial-waxing/', '/services/body-waxing/']) {
    assert.ok(sitemap.includes(`<loc>${SITE_ORIGIN}${route}</loc>`), `Sitemap is missing ${route}`);
  }
  assert.ok(!publicInventory.includes('brazilian'), 'Public waxing inventory must not claim Brazilian waxing.');
  assert.ok(prfUnderEye.includes('$495'), 'PRF Under Eyes must publish the verified current listing price.');
  assert.ok(
    prfUnderEye.includes('PRF Under-Eye — Consultation'),
    'PRF Under Eyes must preserve the exact GlossGenius listing label with the price.',
  );
  assert.ok(
    !/\b(?:45|60|75) minutes\b/i.test(visibleText(prfUnderEye)),
    'PRF Under Eyes must withhold duration while current sources disagree.',
  );
  assert.ok(prfUnderEyeHtml.includes('"@type":"FAQPage"'), 'PRF Under Eyes must emit FAQPage JSON-LD.');
  assert.ok(
    visibleText(prfUnderEye).includes('preparation methods vary and the number of high-quality clinical trials remains limited'),
    'PRF Under Eyes must disclose the limits of the current evidence.',
  );
  for (const retired of [
    'service lane',
    'Different materials. Different questions.',
    'That uncertainty belongs in the conversation—not beneath a promise.',
    'Not the topical microneedling service.',
  ]) {
    assert.ok(!visibleText(prfUnderEye).includes(retired), `PRF Under Eyes contains retired formula ${retired}.`);
  }
});

test('collection detail routes are noindex navigation and stay out of discovery feeds', () => {
  const collectionRoot = path.join(DIST_ROOT, 'services/collections');
  const detailFiles = readdirSync(collectionRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      file: path.join(collectionRoot, entry.name, 'index.html'),
    }))
    .filter(({ file }) => isFile(file));
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  const failures = [];

  assert.ok(detailFiles.length > 0, 'No generated collection-detail pages were found.');
  for (const { slug, file } of detailFiles) {
    const html = readFileSync(file, 'utf8');
    const route = `/services/collections/${slug}/`;
    const absoluteUrl = `${SITE_ORIGIN}${route}`;
    if (!/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b[^"]*\bfollow\b/i.test(html)) {
      failures.push(`${relativeToRepo(file)} is missing noindex, follow`);
    }
    if (sitemap.includes(`<loc>${absoluteUrl}</loc>`)) failures.push(`sitemap.xml contains ${route}`);
    if (compactFeed.includes(absoluteUrl)) failures.push(`llms.txt contains ${route}`);
    if (fullFeed.includes(absoluteUrl)) failures.push(`llms-full.txt contains ${route}`);
  }

  assert.equal(failures.length, 0, formatFailures('Collection discovery/cannibalization drift', failures));
});
