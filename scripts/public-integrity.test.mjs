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

const metaContent = (html, expectedName) => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = new Map(
      [...match[0].matchAll(/\b([A-Za-z_:][-\w:.]*)\s*=\s*(["'])([\s\S]*?)\2/g)]
        .map((attribute) => [attribute[1].toLowerCase(), attribute[3]]),
    );
    if (attributes.get('name')?.toLowerCase() === expectedName.toLowerCase()) {
      return attributes.get('content') ?? '';
    }
  }
  return '';
};

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

test('public pages do not expose the private LLC ownership structure', () => {
  const failures = [];
  const privateOwnershipLanguage = /\b(?:co[- ]?owner|co[- ]?owned|authorized (?:LLC )?member)\b/i;

  for (const file of publicHtmlFiles) {
    const match = visibleText(readFileSync(file, 'utf8')).match(privateOwnershipLanguage);
    if (match) failures.push(`${relativeToRepo(file)} contains ${JSON.stringify(match[0])}`);
  }

  assert.equal(failures.length, 0, formatFailures('Private ownership language in public output', failures));
});

test('about page names the people behind the current service menu', () => {
  const file = path.join(DIST_ROOT, 'about/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = mainHtml(readFileSync(file, 'utf8'));
  const text = visibleText(html);
  const failures = [];

  for (const [label, pattern] of [
    ['Diana’s licence and scope', /Diana Morrison, RN[\s\S]{0,180}injectables[\s\S]{0,100}IV hydration[\s\S]{0,120}weight management/i],
    ['Amber’s licence and Procell scope', /Amber Mingione, Licensed Esthetician[\s\S]{0,180}Microneedling[\s\S]{0,100}Procell/i],
    ['Brandy’s licence and scope', /Brandy, Licensed Esthetician[\s\S]{0,160}facials[\s\S]{0,100}BioRePeel[\s\S]{0,100}facial waxing/i],
    ['Aundrea’s licence and scope', /Aundrea Pedigo, Licensed Esthetician[\s\S]{0,180}(?:wedding|special-event)[\s\S]{0,100}makeup/i],
  ]) {
    if (!pattern.test(text)) failures.push(`about: missing ${label}`);
  }
  if (!text.includes('Medical Director: Joshua Shaw, MD · FL Lic. ME136232')) {
    failures.push('about: missing canonical medical-director attribution');
  }

  for (const route of ['/about/providers/', '/services/']) {
    if (!html.includes(`href="${route}"`)) failures.push(`about: missing trust path ${route}`);
  }

  for (const vagueOrPrivate of ['Other team members', 'co-owner', 'co-owned']) {
    if (text.toLowerCase().includes(vagueOrPrivate.toLowerCase())) {
      failures.push(`about: contains ${JSON.stringify(vagueOrPrivate)}`);
    }
  }

  for (const retired of [
    'A service name is only part of the answer.',
    'follow their established provider roles and physician protocols',
    'See services and booking paths',
  ]) {
    if (text.includes(retired)) failures.push(`about: contains retired institutional copy ${JSON.stringify(retired)}`);
  }

  assert.equal(failures.length, 0, formatFailures('About-page provider depth regression', failures));
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

test('retired PRF cluster routes resolve one hop to reviewed canonical services', () => {
  const expectedRedirects = new Map([
    ['/compare/prf-injections-vs-ez-gel/', '/services/prf-injections/'],
    ['/compare/procell-serum-vs-prf/', '/services/prf/'],
    ['/compare/topical-prf-vs-prf-injections/', '/services/prf/'],
    ['/compare/prf-vs-prp/', '/services/prf/'],
    ['/services/prf-microneedling/', '/services/prf/'],
    ['/services/prf-fibrin-veil/', '/services/prf/'],
    ['/cost/prf-injections-cost-punta-gorda/', '/services/prf-injections/'],
    ['/cost/prf-microneedling-cost-punta-gorda/', '/services/prf/'],
    ['/packages/prf-under-eye-series-of-3/', '/services/prf-under-eyes/'],
  ]);
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');

  for (const [source, destination] of expectedRedirects) {
    const exactRules = redirectRules.filter((rule) => rule.from === source);
    assert.equal(exactRules.length, 1, `${source} must have exactly one redirect rule.`);
    assert.equal(exactRules[0].status, '301', `${source} must use a permanent 301.`);
    assert.equal(exactRules[0].to, destination, `${source} must redirect directly to ${destination}.`);
    assert.ok(!generatedTargetExists(source), `${source} must not generate a public HTML route.`);
    assert.ok(!sitemap.includes(`<loc>${SITE_ORIGIN}${source}</loc>`), `Sitemap must not contain ${source}.`);

    const destinationRule = redirectRules.find((rule) => rule.from === destination);
    assert.ok(
      !destinationRule || Number(destinationRule.status) >= 400,
      `${source} creates a redirect chain through ${destination}.`,
    );
  }

  for (const route of ['/services/prf/', '/services/prf-injections/', '/services/microneedling/', '/services/prf-under-eyes/']) {
    assert.ok(generatedTargetExists(route), `Reviewed PRF architecture is missing ${route}.`);
  }

  const hub = visibleText(mainHtml(readFileSync(path.join(DIST_ROOT, 'services/prf/index.html'), 'utf8')));
  for (const reviewedFact of [
    'small sample of your own blood',
    'Topical PRF Microneedling',
    'PRF Under-Eye',
    '$495',
    'PRF Bio-Filler',
    '$899',
  ]) {
    assert.ok(hub.includes(reviewedFact), `PRF hub is missing substantive reviewed fact ${JSON.stringify(reviewedFact)}.`);
  }
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
  const servicePage = readFileSync(path.join(DIST_ROOT, 'services/morpheus8/index.html'), 'utf8');
  if (!servicePage.includes(`href="/blog/${REVIEWED_BLOG.slug}/"`)) {
    failures.push('Morpheus8 service page is missing the reviewed safety-article path');
  }
  if (/<div\b(?=[^>]*data-reviewed-morpheus-safety="true")(?=[^>]*data-sb-field-path="body")/i.test(html)) {
    failures.push('local reviewed copy is incorrectly annotated as an editable Sanity body');
  }

  const fdaLinks = [...guide.matchAll(/href="(https:\/\/www\.fda\.gov\/[^"]+)"/gi)];
  if (fdaLinks.length < 2) failures.push('missing two primary FDA sources');
  for (const fact of [/medical procedure/i, /licensed health care provider/i, /burns/i, /scarring/i, /fat loss/i, /nerve damage/i, /individual experiences and outcomes vary/i]) {
    if (!fact.test(text)) failures.push(`missing reviewed safety fact ${fact}`);
  }
  for (const required of [
    'What does “FDA-cleared” tell me?',
    'Class II medical devices cleared through the FDA’s 510(k) process',
    'clearance applies to a specific device and its authorized indications',
  ]) {
    if (!text.includes(required)) failures.push(`missing FDA-clearance context ${JSON.stringify(required)}`);
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

  // Keep the evidence and article orientation without freezing full public headings.
  for (const [label, pattern] of [
    ['treatment-question/source orientation', /treatment questions?[\s\S]{0,100}(?:source|evidence)/i],
    ['Morpheus8 safety/source orientation', /Morpheus8[\s\S]{0,100}safety[\s\S]{0,140}(?:source|FDA)/i],
    ['FDA safety context', /FDA safety communications/i],
  ]) {
    if (!pattern.test(text)) failures.push(`journal index is missing ${label}`);
  }
  for (const route of ['/services/morpheus8/', '/contact/']) {
    if (!html.includes(`href="${route}"`)) failures.push(`journal index is missing ${route}`);
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

test('homepage preserves the approved surfaces, verified trust facts, and substantive paths', () => {
  const html = readFileSync(path.join(DIST_ROOT, 'index.html'), 'utf8');
  const main = mainHtml(html);
  const homepage = visibleText(main);
  const failures = [];

  // Preserve the named practice section without teaching the test suite a
  // preferred hero formula or restoring the rejected judgment/restraint voice.
  if (!homepage.includes('Inside House of Rose.')) {
    failures.push('homepage is missing the named practice section');
  }
  for (const verifiedFact of [
    'Diana Morrison, RN',
    'Amber Mingione, Licensed Esthetician',
    'Brandy, Licensed Esthetician',
    'Aundrea Pedigo, Licensed Esthetician',
    'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    '525 E Olympia Avenue',
    'Unit 9',
  ]) {
    if (!homepage.includes(verifiedFact)) failures.push(`homepage is missing verified fact ${JSON.stringify(verifiedFact)}`);
  }
  if (!/<a\b[^>]*href="\/about\/providers\/amber\/"[^>]*>[\s\S]*?<h3\b[^>]*>\s*Amber Mingione, Licensed Esthetician\s*<\/h3>/i.test(main)) {
    failures.push('homepage Amber profile card heading omits the practitioner licence type');
  }
  for (const route of [
    '/services/',
    '/services/prf/',
    '/services/prf-injections/',
    '/services/prf-under-eyes/',
    '/about/providers/',
    '/about/providers/brandy/',
    '/about/providers/aundrea/',
    '/experience/',
    '/consultation/',
  ]) {
    if (!main.includes(`href="${route}"`)) failures.push(`homepage is missing decision path ${route}`);
  }
  for (const substantiveFact of [
    'small sample of your own blood',
    'topical PRF',
    'PRF Bio-Filler',
    'autologous platelet concentrate',
    'Hyaluronic-acid dermal filler',
    'manufactured injectable gel',
    'four-person medical aesthetics practice',
    'makeup artistry',
    'permanent jewelry',
  ]) {
    if (!homepage.includes(substantiveFact)) {
      failures.push(`homepage is missing substantive context ${JSON.stringify(substantiveFact)}`);
    }
  }
  for (const retired of [
    'Good skin is a reflection of good judgment.',
    'Knowing what not to do matters more.',
    'You do not need to arrive knowing the treatment name.',
    'If the concern is clearer than the treatment name',
    'You do not need to name it before you ask about it',
    'Know what you want—or tell us what you are still figuring out.',
    'Every plan starts with a consultation',
    'Same source material. Three forms. Three different uses.',
    'Three uses of PRF. Three distinct appointments.',
    'A separate listing',
    'PRF EZ-Gel Bio-Filler',
    'Three ways PRF appears at House of Rose.',
    'Different concerns call for different tools.',
    'Looking well is specific',
    'A tired look can have more than one source.',
    'PRF and dermal filler begin with different materials.',
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

  if (!/<title>[^<]*(?:practice|visit|experience)[^<]*House of Rose Aesthetics[^<]*<\/title>/i.test(html)) {
    failures.push('experience: browser title is not entity-clear');
  }

  for (const [label, pattern] of [
    ['real practice photographs', /photographs above show[\s\S]{0,100}storefront[\s\S]{0,100}reception[\s\S]{0,100}IV suite[\s\S]{0,120}treatment room/i],
    ['booking and comparison distinction', /(?:reserve|book)[\s\S]{0,180}(?:compare|consultation|question)/i],
    ['question-to-service handoff', /(?:question|inquiry)[\s\S]{0,140}(?:relevant service|practitioner)/i],
    ['Unit 9 entrance guidance', /House of Rose Aesthetics sign[\s\S]{0,80}Unit 9/i],
    ['free parking', /free parking/i],
  ]) {
    if (!pattern.test(text)) failures.push(`experience: missing ${label}`);
  }
  for (const retired of [
    'See the room. Then review the service.',
    'What clients can expect',
    'whose work is not interchangeable',
    'Start with a consultation',
    'which service page or practitioner to start with',
  ]) {
    if (text.includes(retired)) failures.push(`experience: contains retired ${JSON.stringify(retired)}`);
  }

  const feedDescription = /storefront[\s\S]{0,100}treatment rooms[\s\S]{0,100}providers[\s\S]{0,100}visit/i;
  if (!feedDescription.test(compactFeed)) failures.push('llms.txt: missing reviewed experience description');
  if (!feedDescription.test(fullFeed)) failures.push('llms-full.txt: missing reviewed experience description');

  assert.equal(failures.length, 0, formatFailures('Experience depth regression', failures));
});

test('navigation and visit guidance speaks to clients rather than internal inventory', () => {
  const expectations = [
    {
      route: 'services/index.html',
      required: /moving line[\s\S]{0,120}lost fullness[\s\S]{0,120}uneven color[\s\S]{0,120}rough texture[\s\S]{0,240}service page[\s\S]{0,100}appointment details[\s\S]{0,120}book online[\s\S]{0,100}consultation[\s\S]{0,80}call/i,
      retired: 'Every service page explains what the appointment involves',
    },
    {
      route: 'compare/index.html',
      required: /comparison[\s\S]{0,100}(?:clarify|explain)[\s\S]{0,80}difference/i,
      retired: 'current menu facts',
    },
    {
      route: 'experience/index.html',
      required: /online booking[\s\S]{0,120}(?:consultation|phone call)/i,
      retired: 'Open the service page to book online',
    },
    {
      route: 'areas/port-charlotte/index.html',
      required: /(?:arrange|reserve|set)[\s\S]{0,100}(?:visit|appointment|time)[\s\S]{0,120}(?:before you leave|before leaving)/i,
      retired: 'whether the current listing can be booked',
    },
  ];
  const failures = [];

  for (const expectation of expectations) {
    const file = path.join(DIST_ROOT, expectation.route);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const text = visibleText(mainHtml(readFileSync(file, 'utf8')));
    if (!expectation.required.test(text)) {
      failures.push(`${expectation.route}: missing client-facing decision guidance`);
    }
    if (text.includes(expectation.retired)) {
      failures.push(`${expectation.route}: contains internal-inventory phrasing ${JSON.stringify(expectation.retired)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Client-language regression', failures));
});

test('orientation pages do not repeat the treatment-name reassurance formula', () => {
  const retiredFormulas = [
    'You do not have to sort out the menu first.',
    'You do not need to translate the change into a treatment name.',
    'you do not need a treatment name or a self-diagnosis',
    'you do not need to choose a treatment name first',
    'guessing at a treatment name',
    'You do not need to choose a treatment name before asking a question.',
    'You do not need a consultation to browse first.',
    'You are not expected to speak in treatment names.',
  ];
  const failures = [];

  for (const route of [
    'about/index.html',
    'services/index.html',
    'concerns/index.html',
    'support/index.html',
    'experience/index.html',
    'consultation/index.html',
  ]) {
    const file = path.join(DIST_ROOT, route);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const text = visibleText(mainHtml(readFileSync(file, 'utf8')));
    for (const retired of retiredFormulas) {
      if (text.toLowerCase().includes(retired.toLowerCase())) {
        failures.push(`${route}: contains repeated formula ${JSON.stringify(retired)}`);
      }
    }
  }

  assert.equal(failures.length, 0, formatFailures('Orientation-copy regression', failures));
});

test('service and concern pages do not turn product-choice reassurance into a template', () => {
  const retiredFormulas = [
    'You do not need to choose',
    'does not ask you to choose',
    'without choosing a product',
  ];
  const failures = [];

  for (const file of publicHtmlFiles) {
    const text = visibleText(mainHtml(readFileSync(file, 'utf8'))).toLowerCase();
    for (const retired of retiredFormulas) {
      if (text.includes(retired.toLowerCase())) {
        failures.push(`${relativeToRepo(file)}: contains repeated product-choice formula ${JSON.stringify(retired)}`);
      }
    }
  }

  assert.equal(failures.length, 0, formatFailures('Product-choice copy regression', failures));
});

test('public pages state concrete distinctions instead of repeating different-question copy', () => {
  const failures = [];

  for (const file of publicHtmlFiles) {
    const text = visibleText(mainHtml(readFileSync(file, 'utf8'))).toLowerCase();
    if (text.includes('different question')) {
      failures.push(`${relativeToRepo(file)}: contains the repeated different-question formula`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Concrete-distinction copy regression', failures));
});

test('public pages use the named GLP-1 service instead of provider-guided category language', () => {
  const failures = [];

  for (const file of publicHtmlFiles) {
    const text = visibleText(mainHtml(readFileSync(file, 'utf8'))).toLowerCase();
    if (/provider[ -]guided (?:glp-1 )?weight management/.test(text)) {
      failures.push(`${relativeToRepo(file)}: contains provider-guided weight-management wording`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('GLP-1 naming regression', failures));
});

test('public pages do not expose internal reconciliation language', () => {
  const internalPhrases = [
    'current verified menu',
    'current verified listing',
    'current menu sources disagree',
    'while current sources are reconciled',
    'because those details are not published online',
    'verified against the current GlossGenius menu',
  ];
  const failures = [];

  for (const file of publicHtmlFiles) {
    const text = visibleText(mainHtml(readFileSync(file, 'utf8'))).toLowerCase();
    for (const phrase of internalPhrases) {
      if (text.includes(phrase.toLowerCase())) {
        failures.push(`${relativeToRepo(file)} contains ${JSON.stringify(phrase)}`);
      }
    }
  }

  assert.equal(failures.length, 0, formatFailures('Internal reconciliation language', failures));
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

  for (const [label, pattern] of [
    ['Diana’s licence and scope', /Diana Morrison, RN[\s\S]{0,180}injectables[\s\S]{0,100}IV hydration[\s\S]{0,120}weight management/i],
    ['Amber’s licence and Procell scope', /Amber Mingione, Licensed Esthetician[\s\S]{0,180}Microneedling[\s\S]{0,100}Procell/i],
    ['Brandy’s licence and scope', /Brandy, Licensed Esthetician[\s\S]{0,160}facials[\s\S]{0,100}BioRePeel[\s\S]{0,100}facial waxing/i],
    ['Aundrea’s licence and scope', /Aundrea Pedigo, Licensed Esthetician[\s\S]{0,180}(?:wedding|special-event)[\s\S]{0,100}makeup/i],
    ['medical direction role', /Joshua Shaw, MD[\s\S]{0,140}medical director[\s\S]{0,140}(?:medical direction|protocol supervision)/i],
    ['medical director is not the treatment provider', /(?:does not|doesn't)[\s\S]{0,100}(?:perform|provide)[\s\S]{0,100}treatment appointments/i],
    ['named practitioner is associated with the appointment', /practitioner named[\s\S]{0,120}(?:associated with|provides)[\s\S]{0,80}appointment/i],
    ['canonical practice address', /525 E Olympia Ave[\s\S]{0,60}Unit 9[\s\S]{0,80}Punta Gorda, FL 33950/i],
  ]) {
    if (!pattern.test(text)) failures.push(`about/hra: missing ${label}`);
  }
  if (!visibleText(html).includes('Medical Director: Joshua Shaw, MD · FL Lic. ME136232')) {
    failures.push('about/hra: missing canonical medical-director attribution');
  }
  for (const misleading of ['Joshua Shaw treats', 'Joshua Shaw performs', 'on-site medical director']) {
    if (text.includes(misleading)) failures.push(`about/hra: contains misleading ${JSON.stringify(misleading)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Practice-accountability regression', failures));
});

test('the current walk-in policy has one direct public answer', () => {
  const expectations = {
    faq: 'Do you accept walk-ins?',
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
    const answer = walkInFaq?.answer ?? '';
    for (const [label, pattern] of [
      ['waxing and facial walk-ins', /walk-ins[\s\S]{0,100}(?:always|accepted)[\s\S]{0,100}waxing[\s\S]{0,60}facials|waxing[\s\S]{0,60}facials[\s\S]{0,100}walk-ins/i],
      ['schedule-dependent other services', /other services[\s\S]{0,120}schedule allows/i],
      ['appointment reserves a time', /appointments?[\s\S]{0,80}reserve[\s\S]{0,60}(?:specific )?time/i],
      ['availability phone number', /\(844\) 941-7673/i],
    ]) {
      if (!pattern.test(answer)) failures.push(`${route}: walk-in answer is missing ${label}`);
    }
    if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
      failures.push(`${route}: visible FAQ copy and FAQPage JSON-LD differ`);
    }
  }

  for (const route of ['consultation', 'areas/punta-gorda', 'areas/port-charlotte', 'experience']) {
    const file = path.join(DIST_ROOT, route, 'index.html');
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const text = visibleText(mainHtml(readFileSync(file, 'utf8')));
    if (/walk-ins are always accepted|other services, walk-ins are accepted/i.test(text)) {
      failures.push(`${route}: repeats the full walk-in policy outside the canonical FAQ`);
    }
  }
  const experienceHtml = readFileSync(path.join(DIST_ROOT, 'experience/index.html'), 'utf8');
  if (!/href="\/faq\/"[^>]*>current walk-in policy<\/a>/i.test(experienceHtml)) {
    failures.push('experience: missing the canonical walk-in policy link');
  }

  assert.equal(failures.length, 0, formatFailures('Walk-in policy regression', failures));
});

test('FAQ provider answer names verified practitioners instead of narrating the website', () => {
  const file = path.join(DIST_ROOT, 'faq/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const question = 'How can I tell who provides a service?';
  const visibleQuestions = [...main.matchAll(
    /<(h3|span)\b[^>]*data-visit-faq-question[^>]*>([\s\S]*?)<\/\1>/gi,
  )].map((match) => visibleText(match[2]));
  const visibleAnswers = [...main.matchAll(
    /<p\b[^>]*data-visit-faq-answer[^>]*>([\s\S]*?)<\/p>/gi,
  )].map((match) => visibleText(match[1]));
  const visibleAnswer = visibleAnswers[visibleQuestions.indexOf(question)] ?? '';
  const faqSchema = [...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )]
    .map((match) => JSON.parse(match[1]))
    .find((schema) => schema?.['@type'] === 'FAQPage');
  const schemaAnswer = faqSchema?.mainEntity?.find((item) => item.name === question)?.acceptedAnswer?.text ?? '';

  assert.equal(visibleAnswer, schemaAnswer, 'FAQ provider answer and FAQPage schema differ.');
  for (const [label, pattern] of [
    ['Diana’s licence and services', /Diana Morrison, RN[\s\S]{0,180}(?:Botox|Daxxify)[\s\S]{0,180}dermal fillers[\s\S]{0,180}injectable PRF[\s\S]{0,180}IV hydration[\s\S]{0,180}GLP-1/i],
    ['Amber’s licence and services', /Amber Mingione, Licensed Esthetician[\s\S]{0,180}Procell Microneedling[\s\S]{0,140}topical PRF[\s\S]{0,140}Glo2Facial[\s\S]{0,140}dermaplaning[\s\S]{0,140}BioRePeel/i],
    ['Brandy’s licence and services', /Brandy, Licensed Esthetician[\s\S]{0,140}facials[\s\S]{0,120}standalone BioRePeel[\s\S]{0,120}facial waxing/i],
    ['Aundrea’s licence and non-medical services', /Aundrea Pedigo, Licensed Esthetician[\s\S]{0,160}makeup[\s\S]{0,120}permanent jewelry[\s\S]{0,100}non-medical/i],
    ['medical-director role boundary', /Medical Director: Joshua Shaw, MD · FL Lic\. ME136232[\s\S]{0,180}medical direction[\s\S]{0,140}(?:does not|doesn't)[\s\S]{0,100}treatment appointments/i],
  ]) {
    assert.match(visibleAnswer, pattern, `FAQ provider answer is missing ${label}.`);
  }
  assert.doesNotMatch(visibleAnswer, /service page[\s\S]{0,100}provider directory/i);
});

// Protect the operational distinctions without freezing a full customer-facing sentence.
// Voice revisions may change syntax and cadence while these facts and schema parity remain binding.
test('consultation form explains that an inquiry does not reserve an appointment', () => {
  const file = path.join(DIST_ROOT, 'consultation/index.html');
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
    answer: visibleAnswers[index] ?? '',
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
  const reservationFaq = visibleFaqs.find(({ question }) =>
    /submitting the form|form.*reserve/i.test(question)
  );

  assert.ok(reservationFaq, 'Consultation page is missing the form-reservation FAQ.');
  for (const [label, pattern] of [
    ['request does not reserve a time', /consultation request[\s\S]{0,140}(?:does not|doesn't)[\s\S]{0,100}(?:hold|reserve)[\s\S]{0,60}(?:time|appointment)/i],
    ['practice arranges the consultation', /House of Rose[\s\S]{0,80}(?:contact|call|reach)[\s\S]{0,100}(?:arrange|schedule)[\s\S]{0,40}consultation/i],
    ['online-booking path', /online book(?:ing|able)|book(?:ing)? online/i],
    ['consultation-only path', /consultation-only/i],
    ['phone-first path', /phone-first/i],
  ]) {
    assert.match(reservationFaq.answer, pattern, `Consultation FAQ is missing the ${label} distinction.`);
  }
  assert.deepEqual(visibleFaqs, schemaFaqs, 'Consultation visible FAQs and FAQPage JSON-LD differ.');
});

test('contact form explains reply timing and preserves the messaging-consent contract', () => {
  const file = path.join(DIST_ROOT, 'contact/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const text = visibleText(main);
  const failures = [];

  for (const required of [
    'When to expect a reply',
    'When to call instead',
    '525 E Olympia Ave, Unit 9',
    'Punta Gorda, FL 33950',
    'Get directions',
  ]) {
    if (!text.includes(required)) failures.push(`contact: missing ${JSON.stringify(required)}`);
  }
  for (const [label, pattern] of [
    ['one-business-day reply window', /Monday (?:through|to) Friday[\s\S]{0,100}one business day/i],
    ['phone-number/text-consent boundary', /phone number[\s\S]{0,100}(?:does not|doesn't|is not)[\s\S]{0,100}(?:permission|consent)[\s\S]{0,60}text/i],
    ['topical PRF provider attribution', /Amber Mingione, Licensed Esthetician[\s\S]{0,100}topical PRF[\s\S]{0,80}Microneedling/i],
    ['injectable PRF provider attribution', /Diana Morrison, RN[\s\S]{0,100}injectable PRF/i],
    ['browser-location permission disclosure', /use my location[\s\S]{0,100}browser[\s\S]{0,80}location access[\s\S]{0,80}route/i],
    ['manual starting-address alternative', /enter a starting address/i],
    ['external map alternatives', /Google Maps[\s\S]{0,60}Apple Maps/i],
  ]) {
    if (!pattern.test(text)) failures.push(`contact: missing ${label}`);
  }
  for (const requiredMarkup of [
    'action="/.netlify/functions/lead-submit"',
    'value="PRF Microneedling (topical PRF)"',
    'value="Injectable PRF"',
    'aria-describedby="service-interest-help"',
    'name="consent-informational"',
    'name="consent-marketing"',
    'name="consent-none"',
    'href="tel:+18449417673"',
    'href="/privacy-policy/"',
  ]) {
    if (!main.includes(requiredMarkup)) failures.push(`contact: missing ${requiredMarkup}`);
  }
  for (const requiredField of ['name', 'email', 'phone']) {
    const fieldPattern = new RegExp(`<input\\b(?=[^>]*\\bname=["']${requiredField}["'])(?=[^>]*\\brequired\\b)[^>]*>`, 'i');
    if (!fieldPattern.test(main)) failures.push(`contact: ${requiredField} is no longer required`);
  }

  assert.equal(failures.length, 0, formatFailures('Contact-form guidance regression', failures));
});

test('privacy requests remain distinct from browser consent choices', () => {
  const file = path.join(DIST_ROOT, 'privacy-policy/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const text = visibleText(main);

  assert.match(
    text,
    /privacy question or request[\s\S]{0,120}(?:does not|doesn't)[\s\S]{0,80}(?:change|update)[\s\S]{0,80}(?:measurement|consent) preferences/i,
    'Privacy page must explain that a support request does not change browser consent.',
  );
  for (const [label, pattern] of [
    ['Mapbox directions processing', /directions and location access[\s\S]{0,220}Mapbox[\s\S]{0,160}(?:search|starting address)[\s\S]{0,120}(?:driving time|distance|route)/i],
    ['browser permission before coordinate use', /use my location[\s\S]{0,100}browser[\s\S]{0,100}permission[\s\S]{0,140}coordinates[\s\S]{0,100}Mapbox/i],
    ['location-free alternatives', /decline location access[\s\S]{0,160}(?:starting address|Google Maps|Apple Maps)/i],
    ['route data excluded from contact form', /directions tool[\s\S]{0,140}(?:does not|doesn't)[\s\S]{0,100}(?:starting address|current location)[\s\S]{0,100}contact form/i],
  ]) {
    assert.match(text, pattern, `Privacy page is missing ${label}.`);
  }
  for (const required of [
    'action="/.netlify/functions/privacy-contact"',
    'id="privacy-form-choices"',
    'type="button"',
    'hor:open-consent',
  ]) {
    assert.ok(html.includes(required), `Privacy page is missing ${required}.`);
  }
  for (const field of ['name', 'email', 'subject', 'message']) {
    assert.match(
      main,
      new RegExp(`<(?:input|textarea)\\b(?=[^>]*\\bname=["']${field}["'])(?=[^>]*\\brequired\\b)[^>]*>`, 'i'),
      `Privacy request form is missing required field ${field}.`,
    );
  }
});

test('shared form confirmation routes time-sensitive and emergency needs safely', () => {
  const file = path.join(DIST_ROOT, 'thank-you/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const text = visibleText(mainHtml(html));

  for (const [label, pattern] of [
    ['same-day appointment change', /same-day appointment change/i],
    ['unexpected post-appointment change', /unexpected change[\s\S]{0,100}House of Rose appointment/i],
    ['practice-hours phone handoff', /\(844\) 941-7673[\s\S]{0,120}Monday through Friday[\s\S]{0,80}9 AM[–-]5 PM ET/i],
    ['routine-reply exception', /instead of waiting[\s\S]{0,80}routine reply/i],
    ['emergency boundary', /medical emergency[\s\S]{0,80}(?:call 911|emergency care)/i],
  ]) {
    assert.match(text, pattern, `Thank-you page is missing ${label}.`);
  }
  assert.match(html, /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*nofollow/i);
  assert.ok(html.includes('href="tel:+18449417673"'), 'Thank-you page is missing the verified phone link.');
});

test('suite-rental application explains the next step without changing the form contract', () => {
  const file = path.join(DIST_ROOT, 'rent-a-room/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const text = visibleText(main);
  const failures = [];

  for (const [label, pattern] of [
    ['application next-step explanation', /(?:after I apply|after (?:an|the) application|application.*next)/i],
    ['non-reservation boundary', /form[\s\S]{0,120}(?:does not|doesn't)[\s\S]{0,80}reserve[\s\S]{0,40}(?:room|suite)/i],
    ['no-payment boundary', /(?:does not|doesn't)[\s\S]{0,80}(?:collect|take)[\s\S]{0,40}payment/i],
    ['rate-discussion step', /monthly rate[\s\S]{0,80}(?:discuss|review|confirm)/i],
    ['verified monthly range', /\$850\s*[–-]\s*\$1,100\s*\/\s*month/i],
    ['verified room size', /10\s*[×x]\s*14\s*ft private suite/i],
    ['application-data review purpose', /application (?:information|details)[\s\S]{0,100}(?:review|assess)[\s\S]{0,80}(?:request|application)/i],
    ['availability/tour reply purpose', /(?:reply|contact)[\s\S]{0,100}(?:availability|tour)/i],
  ]) {
    if (!pattern.test(text)) failures.push(`rent-a-room: missing ${label}`);
  }
  for (const requiredMarkup of [
    'name="suite-rental-application"',
    'action="/.netlify/functions/lead-submit"',
    'name="insurance-acknowledgement"',
    'name="license-number"',
    'href="tel:+18449417673"',
    'href="/privacy-policy/"',
  ]) {
    if (!main.includes(requiredMarkup)) failures.push(`rent-a-room: missing ${requiredMarkup}`);
  }
  for (const retired of ['fully-equipped', 'no-competing-services', 'within 48 hours', 'Guaranteed Clientele', 'premium environment']) {
    if (text.includes(retired)) failures.push(`rent-a-room: contains stale ${JSON.stringify(retired)}`);
  }

  assert.equal(failures.length, 0, formatFailures('Suite-rental guidance regression', failures));
});

test('skin imaging explains the three views and keeps visible FAQs aligned with schema', () => {
  const file = path.join(DIST_ROOT, 'skin-analysis/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const mainText = visibleText(main);
  const overview = main.match(
    /<section\b[^>]*data-skin-analysis-overview[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const overviewText = visibleText(overview);
  const section = main.match(
    /<section\b[^>]*data-skin-imaging-views[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const sectionText = visibleText(section);
  const workflow = main.match(
    /<section\b[^>]*data-skin-analysis-steps[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const failures = [];

  for (const [label, pattern] of [
    ['verified price', /\$65\b/],
    ['three imaging views', /standard[^.!?]{0,50}cross-polarized[^.!?]{0,50}UV/i],
    ['short image capture', /taking the images takes a few minutes/i],
    ['optional appointment boundary', /optional[^.!?]{0,40}not required/i],
    ['visual baseline and non-diagnostic boundary', /visual baseline[^.!?]{0,50}not a medical diagnosis/i],
  ]) {
    if (!pattern.test(overviewText)) failures.push(`skin-analysis overview: missing ${label}`);
  }
  const workflowSteps = workflow.match(/data-skin-analysis-step\b/gi) ?? [];
  if (workflowSteps.length !== 2) {
    failures.push(`skin-analysis workflow: expected 2 steps, found ${workflowSteps.length}`);
  }
  if (/Three lighting views/i.test(workflow)) {
    failures.push('skin-analysis workflow: repeats the three-view explanation');
  }

  for (const [label, pattern] of [
    ['standard-light view', /standard light/i],
    ['cross-polarized view', /cross-polarized light/i],
    ['UV view', /\bUV light\b/i],
    ['surface-reflection distinction', /(?:reduce|remove)[^.!?]{0,80}surface reflection/i],
    ['porphyrin-fluorescence distinction', /fluorescence[^.!?]{0,100}porphyrins/i],
    ['non-diagnostic medical-cause boundary', /(?:do not|does not|cannot|can't)[^.!?]{0,100}(?:determine|diagnose)[^.!?]{0,100}medical cause/i],
    ['skin-cancer screening boundary', /(?:do not|does not|cannot|can't)[^.!?]{0,100}screen[^.!?]{0,80}skin cancer/i],
    ['makeup/sunscreen preparation', /makeup[^.!?]{0,80}sunscreen/i],
  ]) {
    if (!pattern.test(sectionText)) failures.push(`skin-analysis: missing ${label}`);
  }
  for (const unsupported of ['M17', 'AI Skin Analyzer', 'diagnostic accuracy', 'hydration cues']) {
    if (mainText.includes(unsupported)) failures.push(`skin-analysis: contains unsupported ${JSON.stringify(unsupported)}`);
  }
  for (const [label, pattern] of [
    ['request does not reserve a time', /form[\s\S]{0,100}(?:does not|doesn't)[\s\S]{0,80}(?:hold|reserve)[\s\S]{0,60}(?:appointment )?time/i],
    ['online booking reserves a time', /online book(?:ing|able)[\s\S]{0,100}reserve[\s\S]{0,60}time/i],
  ]) {
    if (!pattern.test(mainText)) failures.push(`skin-analysis: missing ${label}`);
  }
  for (const requiredMarkup of [
    'name="skin-analysis"',
    'action="/.netlify/functions/lead-submit"',
    'data-booking-service="skin-analysis"',
    'data-booking-mode="direct"',
  ]) {
    if (!main.includes(requiredMarkup)) failures.push(`skin-analysis: missing ${requiredMarkup}`);
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

  if (!visibleFaqs.some(({ answer }) =>
    /(?:do not|does not|cannot|can't)[\s\S]{0,180}(?:diagnos|screen)/i.test(answer) &&
    /skin cancer/i.test(answer)
  )) {
    failures.push('skin-analysis: missing the visible non-diagnostic FAQ');
  }
  if (!visibleFaqs.some(({ answer }) => /makeup[\s\S]{0,100}sunscreen/i.test(answer))) {
    failures.push('skin-analysis: missing the visible image-preparation FAQ');
  }
  if (!visibleFaqs.some(({ answer }) =>
    /(?:taking|capturing)[\s\S]{0,80}(?:images|photos)[\s\S]{0,100}(?:does not|doesn't)[\s\S]{0,100}authoriz[\s\S]{0,80}publish/i.test(answer) &&
    /written[\s\S]{0,60}permission[\s\S]{0,80}website publication[\s\S]{0,80}recorded/i.test(answer)
  )) {
    failures.push('skin-analysis: missing the written website-publication consent boundary');
  }
  if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
    failures.push('skin-analysis: visible FAQ copy and FAQPage JSON-LD differ');
  }

  assert.equal(failures.length, 0, formatFailures('Skin-imaging depth regression', failures));
});

test('priority service pages retain reviewed facts instead of falling back to thin inventory', () => {
  const expectations = {
    'injectables-bio-fillers': [
      'Botox and Daxxify',
      '$14 per unit',
      'Juvéderm Ultra XC',
      'Juvéderm Voluma XC',
      'RHA 1',
      'RHA 2',
      'RHA 3',
      '$650–$850',
      'two distinct consultations',
      'PRF Under-Eye at $495',
      'PRF Bio-Filler at $899',
      'Diana Morrison, RN',
      'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    ],
    injectables: [
      'Botox',
      'Daxxify',
      '$14 per unit',
      '30 minutes',
      '60 minutes',
    ],
    'dermal-fillers': [
      'Juvéderm Ultra XC',
      'Juvéderm Voluma XC',
      'RHA 1',
      'RHA 2',
      'RHA 3',
      '$650',
      '$850',
    ],
    glo2facial: [
      'single-use OxyPod',
      'topical infusion and finishes with facial massage',
      'surface exfoliation',
      'topical infusion',
      'oxygenation step',
      'reaction between its OxyPod and Primer Gel',
      'carbon-dioxide-rich bubbly environment',
      'does not come from an external stream of oxygen',
      'no downtime',
      'Amber Mingione, Licensed Esthetician',
      'Who provides Glo2Facial at House of Rose?',
      '$225',
      '60 minutes',
    ],
    'forma-rf-facial': [
      'InMode non-invasive radiofrequency handpiece',
      'controlled dermal and subdermal heating',
      'Does Forma use needles?',
      'does not use microneedles',
      'Lumecca Peak delivers filtered optical energy as IPL.',
      'Forma and Forma Plus pricing by area',
      'Face',
      '$2,000',
      'Face & Neck',
      '$3,000',
      'Eyes',
      '$600',
      'Forma Plus — Abdomen',
      'Forma Plus — Arms',
      'Forma Plus — Inner-Outer Thighs',
      'Forma Plus — Lower Back',
      '$1,750',
      'Forma Plus — Knees',
      '$1,500',
      'Forma + Lumecca Bundle',
      '$2,599',
      'Bundle price',
    ],
    'lumecca-peak-ipl': [
      'InMode intense pulsed light (IPL) handpiece',
      'xenon flash lamp',
      'visible pigment, uneven tone, and selected texture concerns',
      'legs, full face, chest, neck, face and neck, face, neck, and chest, spot treatment, hands',
      'InMode and the FDA classify the applicator separately from laser applicators',
      'Lumecca Peak IPL Consultation',
      '$50',
      'Consultation appointment',
      '$850 single · $2,400 series of 3',
      '$500 single · $1,200 series of 3',
      '$500 single · $1,300 series of 3',
      '$350 single · $900 series of 3',
      '$800 single · $2,000 series of 3',
      '$950 single · $2,600 series of 3',
      '$250 single · $800 series of 3',
      'Hands',
    ],
    morpheus8: [
      'fractional bipolar radiofrequency',
      'visible tone and texture',
      'Full Face',
      '$1,200 single · $3,000 series of 3',
      'Face & Neck',
      '$1,250 single · $3,500 series of 3',
      'Morpheus8 Resurfacing — Full Face',
      '$750 single · $2,000 series of 3',
      'Morpheus8 Resurfacing — Face & Neck',
      '$950 single · $2,700 series of 3',
      'Morpheus8 Prime — Eyes & Mouth',
      '$1,000 single · $2,200 series of 3',
      'Morpheus8 Prime — Around the Eyes',
      '$450 single · $1,200 series of 3',
      'Morpheus8 Prime — Around the Mouth',
      'Morpheus8 Burst — Hyperhidrosis',
      '$2,200–$2,400',
      'Package of 3',
      'Morpheus8 + Lumecca Bundle',
      '$1,799',
      '2 total treatments',
    ],
    'morpheus8-body': [
      'same InMode platform',
      'body-skin tone, texture, eligible scars, and stretch marks',
      'Morpheus8 Burst Deep area packages',
      '$3,500',
      '$4,500',
    ],
    biorepeel: [
      'BioRePeel Cl3 Rejuvenation',
      'directly bookable',
      'Brandy, Licensed Esthetician',
      'Amber Mingione, Licensed Esthetician',
      'Gold Body',
      'Advanced Acne Scarring',
      'Duo Gold Spot Upgrade',
      'TCA stands for trichloroacetic acid',
      'BioRePeel Cl3 Rejuvenation',
      '$250',
      '45 minutes',
      'BioRePeel Gold — Body',
      '$325',
      'BioRePeel Advanced — Acne Scarring',
      '$450',
      '75 minutes',
      'BioRePeel Duo — Gold Spot Upgrade',
      '$395',
      '60 minutes',
    ],
    microneedling: [
      'Procell Microchanneling',
      'device-specific name',
      'Amber Mingione, Licensed Esthetician',
      'Injectable PRF',
      'Diana Morrison, RN',
      'Procell Therapies — Pro',
      '$300',
      'Procell Therapies — MD',
      '$400',
      'PRF Microneedling — Consultation',
      '$595',
    ],
    prf: [
      'Platelet-rich fibrin (PRF) is prepared from a small sample of your own blood.',
      'PRF Under-Eye and PRF Bio-Filler',
      'Diana Morrison, RN',
      'under medical direction',
      'Topical PRF Microneedling',
      'PRF Under-Eye',
      '$495',
      'PRF Bio-Filler',
      '$899',
    ],
    'prf-injections': [
      'eligible Microneedling appointment',
      'applied topically at the skin surface',
      'PRF is prepared from a small sample of your own blood.',
      'PRF Under-Eye — Consultation',
      '$495',
      'PRF Bio-Filler — Consultation',
      '$899',
      'Diana Morrison, RN',
    ],
    'permanent-jewelry': [
      'Aundrea Pedigo, Licensed Esthetician',
      'non-medical service',
      'not attached to the skin',
      'can be cut when removal is needed',
      '$65',
      '20 minutes',
    ],
    'iv-hydration-therapy': [
      'Diana Morrison, RN',
      'from $99 to $185',
      'one 30-minute base IV and 5 45-minute base IVs',
    ],
    dermaplaning: [
      'fine vellus hair and accumulated dead skin cells',
      'Amber Mingione, Licensed Esthetician',
      'Dermaplaning — Facial (standalone)',
      '$135',
      '50 minutes',
      'Dermaplaning — Add-On',
      '$45',
      '25 minutes',
      'it does not change the hair’s thickness, color, or rate of growth',
    ],
    'glp-1-weight-management': [
      'semaglutide',
      'tirzepatide',
      'Diana Morrison, RN',
      'GLP-1 Consultation',
      '$25',
      '40 minutes',
      'medication and ongoing program pricing',
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

  for (const { slug, href, labelTerms } of [
    {
      slug: 'glo2facial',
      href: '/about/providers/amber/',
      labelTerms: [/\bAmber Mingione\b/i, /\bLicensed Esthetician\b/i],
    },
    {
      slug: 'biorepeel',
      href: '/about/providers/brandy/',
      labelTerms: [/\bBrandy\b/i, /\bLicensed Esthetician\b/i],
    },
    {
      slug: 'biorepeel',
      href: '/about/providers/amber/',
      labelTerms: [/\bAmber Mingione\b/i, /\bLicensed Esthetician\b/i],
    },
    {
      slug: 'microneedling',
      href: '/about/providers/amber/',
      labelTerms: [/\bAmber Mingione\b/i, /\bLicensed Esthetician\b/i],
    },
  ]) {
    const html = readFileSync(path.join(DIST_ROOT, `services/${slug}/index.html`), 'utf8');
    const section = html.match(
      /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
    )?.[1] ?? '';
    const link = section.match(
      new RegExp(`<a\\b[^>]*href="${escapeRegExp(href)}"[^>]*>([\\s\\S]*?)<\\/a>`, 'i'),
    );
    assert.ok(link, `${slug} education must link ${href}.`);
    const label = visibleText(link[1]);
    for (const term of labelTerms) {
      assert.match(label, term, `${slug} provider link must retain the practitioner's licensed identity.`);
    }
  }

  const biorepeelHtml = readFileSync(
    path.join(DIST_ROOT, 'services/biorepeel/index.html'),
    'utf8',
  );
  const biorepeelEducation = biorepeelHtml.match(
    /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const microneedlingLink = biorepeelEducation.match(
    /<a\b[^>]*href="\/services\/microneedling\/"[^>]*>([\s\S]*?)<\/a>/i,
  );
  assert.ok(microneedlingLink, 'BioRePeel education must link the Microneedling service.');
  assert.match(
    visibleText(microneedlingLink[1]),
    /\bMicroneedling\b/i,
    'BioRePeel must identify its Microneedling relationship.',
  );

  const ivEducationHtml = readFileSync(
    path.join(DIST_ROOT, 'services/iv-hydration-therapy/index.html'),
    'utf8',
  );
  const ivEducationText = visibleText(
    ivEducationHtml.match(
      /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
    )?.[1] ?? '',
  );
  for (const [label, pattern] of [
    ['ingredient and add-on decision boundary', /ingredients?[\s\S]{0,140}add-ons?/i],
    ['call-before-booking guidance', /call House of Rose[\s\S]{0,160}before booking/i],
  ]) {
    if (!pattern.test(ivEducationText)) failures.push(`iv-hydration-therapy: missing ${label}`);
  }

  const microneedlingHtml = readFileSync(
    path.join(DIST_ROOT, 'services/microneedling/index.html'),
    'utf8',
  );
  const microneedlingEducation = microneedlingHtml.match(
    /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const prfOverviewLink = microneedlingEducation.match(
    /<a\b[^>]*href="\/services\/prf\/"[^>]*>([\s\S]*?)<\/a>/i,
  );
  assert.ok(prfOverviewLink, 'Microneedling education must link the canonical PRF overview.');
  const prfOverviewLabel = visibleText(prfOverviewLink[1]);
  for (const term of [/\btopical\b/i, /\binjectable\b/i, /\bPRF\b/i]) {
    assert.match(prfOverviewLabel, term, 'Microneedling must distinguish the topical and injectable PRF relationship.');
  }

  const prfHtml = readFileSync(
    path.join(DIST_ROOT, 'services/prf/index.html'),
    'utf8',
  );
  const prfEducation = prfHtml.match(
    /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const prfUnderEyesLink = prfEducation.match(
    /<a\b[^>]*href="\/services\/prf-under-eyes\/"[^>]*>([\s\S]*?)<\/a>/i,
  );
  assert.ok(prfUnderEyesLink, 'PRF education must link the canonical PRF Under Eyes service.');
  const prfUnderEyesLabel = visibleText(prfUnderEyesLink[1]);
  for (const term of [/\bPRF\b/i, /\bUnder[ -]?Eyes?\b/i]) {
    assert.match(prfUnderEyesLabel, term, 'PRF education must identify the under-eye relationship.');
  }

  const weightManagementFile = path.join(
    DIST_ROOT,
    'services/glp-1-weight-management/index.html',
  );
  const weightManagementHtml = readFileSync(weightManagementFile, 'utf8');
  const weightManagementText = visibleText(mainHtml(weightManagementHtml));
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
      'House of Rose names lips, cheeks, and folds on this service.',
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
  for (const retiredOrUnverified of ['HydraFacial', '$195', '$250']) {
    if (glo.toLowerCase().includes(retiredOrUnverified.toLowerCase())) {
      failures.push(`glo2facial: contains retired or unreconciled ${JSON.stringify(retiredOrUnverified)}`);
    }
  }
  const morpheus = visibleText(readFileSync(path.join(DIST_ROOT, 'services/morpheus8/index.html'), 'utf8'));
  for (const unsupported of ['tightening', 'lifting', 'jowls', 'body sculpting']) {
    if (morpheus.toLowerCase().includes(unsupported)) {
      failures.push(`morpheus8: contains unsupported positioning ${JSON.stringify(unsupported)}`);
    }
  }
  const morpheusHtml = readFileSync(path.join(DIST_ROOT, 'services/morpheus8/index.html'), 'utf8');
  const morpheusEducation = morpheusHtml.match(
    /<section\b[^>]*data-service-education[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const morpheusFaqCount = morpheusEducation.match(/<details\b/gi)?.length ?? 0;
  if (morpheusFaqCount !== 3) {
    failures.push(`morpheus8: expected 3 decision-support FAQs, found ${morpheusFaqCount}`);
  }
  for (const repeatedPriceQuestion of [
    'What are the Morpheus8 Burst single-treatment prices?',
    'How is Morpheus8 Resurfacing priced?',
    'How is Morpheus8 Prime priced?',
    'How is the Morpheus8 Burst Hyperhidrosis package priced?',
  ]) {
    if (morpheusEducation.includes(repeatedPriceQuestion)) {
      failures.push(`morpheus8: repeats the price table as FAQ copy ${JSON.stringify(repeatedPriceQuestion)}`);
    }
  }

  const lumeccaHtml = readFileSync(path.join(DIST_ROOT, 'services/lumecca-peak-ipl/index.html'), 'utf8');
  const formaHtml = readFileSync(path.join(DIST_ROOT, 'services/forma-rf-facial/index.html'), 'utf8');
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
  for (const required of [
    '20-minute, $50 Neuromodulator Consultation',
    '60-minute, $300 Dermal Filler Consultation',
  ]) {
    if (!injectablesHubText.includes(required)) {
      failures.push(`injectables-bio-fillers: missing ${JSON.stringify(required)}`);
    }
  }
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
    'Which IV hydration options does House of Rose offer?',
    'What does IV mean in IV hydration?',
    'The six appointment names alone do not identify a complete formulation.',
  ]) {
    if (!ivText.includes(required)) failures.push(`iv-hydration-therapy: missing ${JSON.stringify(required)}`);
  }
  for (const required of [
    'IV means intravenous.',
    'Intravenous means that fluid is administered through a vein.',
    'IV drip appointments are offered as IV Hydration Therapy',
    '6 named base options',
    'Hydration IV is the 30-minute option at $99.',
    'The other 5 base options are 45-minute appointments priced from $160 to $185.',
  ]) {
    if (!visibleText(ivCategoryOverview).includes(required)) {
      failures.push(`iv-hydration-therapy category overview: missing ${JSON.stringify(required)}`);
    }
  }
  for (const required of [
    'Which IV option is 30 minutes?',
    'How do I confirm the ingredients or available add-ons?',
  ]) {
    if (!ivText.includes(required)) failures.push(`iv-hydration-therapy: missing practical guidance ${JSON.stringify(required)}`);
  }
  const ivProviderLink = mainHtml(ivHtml).match(
    /<a\b[^>]*href="\/about\/providers\/diana\/"[^>]*>([\s\S]*?)<\/a>/i,
  );
  if (!ivProviderLink) {
    failures.push('iv-hydration-therapy: missing Diana Morrison provider profile link');
  } else {
    const ivProviderLabel = visibleText(ivProviderLink[1]);
    for (const term of [/\bDiana Morrison\b/i, /\bRN\b/i]) {
      if (!term.test(ivProviderLabel)) {
        failures.push('iv-hydration-therapy: provider link omits Diana Morrison, RN identity');
      }
    }
  }
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
  const faceRealityText = visibleText(faceRealityHtml);
  for (const required of [
    'Amber Mingione, Licensed Esthetician',
    'href="/about/providers/amber/"',
  ]) {
    if (!faceRealityHtml.includes(required)) failures.push(`face-reality-acne-program: missing ${JSON.stringify(required)}`);
  }
  for (const [label, pattern] of [
    ['Acne Peel #1', /Face Reality Acne Peel #1[\s\S]{0,80}\$135[\s\S]{0,40}50 minutes/i],
    ['Acne Peel #2', /Face Reality Acne Peel #2[\s\S]{0,80}\$155[\s\S]{0,40}45 minutes/i],
    ['Bright Skin Peel', /Face Reality Bright Skin Peel[\s\S]{0,80}\$165[\s\S]{0,40}45 minutes/i],
    ['Acne Back Peel', /Face Reality Acne Back Peel[\s\S]{0,80}\$205[\s\S]{0,40}10 minutes/i],
  ]) {
    if (!pattern.test(faceRealityText)) failures.push(`face-reality-acne-program: missing exact ${label} row`);
  }
  if (!/online booking is unavailable/i.test(faceRealityText)) {
    failures.push('face-reality-acne-program: missing staff-arranged peel booking boundary');
  }

  const bootcampHtml = mainHtml(readFileSync(path.join(DIST_ROOT, 'services/acne-bootcamp/index.html'), 'utf8'));
  for (const peelName of ['Face Reality Acne Peel #1', 'Face Reality Acne Peel #2', 'Face Reality Bright Skin Peel', 'Face Reality Acne Back Peel']) {
    if (bootcampHtml.includes(peelName)) failures.push(`acne-bootcamp: program menu unexpectedly includes ${peelName}`);
  }

  assert.equal(failures.length, 0, formatFailures('Priority service education regression', failures));
});

test('service FAQs remain optional and match FAQPage schema whenever they are published', () => {
  const failures = [];
  const serviceFiles = walkFiles(path.join(DIST_ROOT, 'services'), (file) => file.endsWith('index.html'));

  for (const file of serviceFiles) {
    const html = readFileSync(file, 'utf8');
    const main = mainHtml(html);
    const visibleFaqs = [...main.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)].map((match) => ({
      question: visibleText(
        match[1].match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ?? '',
      ).replace(/\s*\+$/, ''),
      answer: visibleText(
        match[1].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '',
      ),
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

    if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
      failures.push(`${relativeToRepo(file)}: visible questions and FAQPage JSON-LD differ`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Service FAQ parity regression', failures));
});

test('indexable public metadata stays within the search-snippet ceiling', () => {
  const failures = [];

  for (const file of publicHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    const robots = metaContent(html, 'robots');
    if (/\bnoindex\b/i.test(robots)) continue;

    const description = decodeHtmlEntities(metaContent(html, 'description'));

    if (!description || description.length > 160) {
      failures.push(`${routeForHtmlFile(file)}: meta description is ${description.length} characters`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Public metadata length regression', failures));
});

test('metadata parsing preserves apostrophes inside quoted descriptions', () => {
  const description = "House of Rose's complete 12-week program stays in one description.";
  const html = `<meta content="${description}" name="description">`;
  assert.equal(metaContent(html, 'description'), description);
});

test('service appointment sections give service-specific next-step guidance', () => {
  const serviceRoot = path.join(DIST_ROOT, 'services');
  const serviceSlugs = readdirSync(serviceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'collections')
    .filter((entry) => existsSync(path.join(serviceRoot, entry.name, 'index.html')))
    .map((entry) => entry.name)
    .sort();
  const guidanceBySlug = new Map();
  const failures = [];

  for (const slug of serviceSlugs) {
    const html = readFileSync(path.join(serviceRoot, slug, 'index.html'), 'utf8');
    const match = html.match(
      /<p\b[^>]*data-service-appointment-guidance[^>]*>([\s\S]*?)<\/p>/i,
    );
    const guidance = match ? visibleText(match[1]) : '';

    if (!guidance) failures.push(`${slug}: missing service-specific appointment guidance`);
    guidanceBySlug.set(slug, guidance);
  }

  const grouped = new Map();
  for (const [slug, guidance] of guidanceBySlug) {
    if (!grouped.has(guidance)) grouped.set(guidance, []);
    grouped.get(guidance).push(slug);
  }
  for (const [guidance, slugs] of grouped) {
    if (guidance && slugs.length > 1) {
      failures.push(`${slugs.join(', ')}: repeat the same appointment guidance ${JSON.stringify(guidance)}`);
    }
  }

  for (const generic of [
    'Request a consultation time, or contact the practice if you have a question before scheduling.',
    'Choose an available time in the current booking menu, or send a question before you reserve.',
    'Call the practice for current appointment availability, or send a question through the consultation form.',
  ]) {
    if ([...guidanceBySlug.values()].includes(generic)) {
      failures.push(`service inventory still renders generic fallback ${JSON.stringify(generic)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Service appointment-guidance regression', failures));
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

  for (const [label, pattern] of [
    ['observable distinctions', /moving line[\s\S]{0,80}lost fullness[\s\S]{0,80}uneven color[\s\S]{0,80}rough texture/i],
    ['observation-to-service handoff', /separate services[\s\S]{0,240}service page[\s\S]{0,100}appointment details/i],
    ['booking-path distinction', /book online[\s\S]{0,80}consultation[\s\S]{0,80}call/i],
    ['provider licence transparency', /provider directory[\s\S]{0,80}licence type/i],
  ]) {
    if (!pattern.test(guidanceText)) failures.push(`services index guidance is missing ${label}`);
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
      /BioRePeel[\s\S]{0,80}(?:only[\s\S]{0,30}add-on|add-on[\s\S]{0,30}only)/i,
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
      'Aundrea Pedigo, Licensed Esthetician',
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
      const present = value instanceof RegExp ? value.test(visibleText(main)) : main.includes(value);
      if (!present) {
        failures.push(`${slug}: missing ${value instanceof RegExp ? value : JSON.stringify(value)}`);
      }
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
    aundrea: ['Aundrea Pedigo, Licensed Esthetician', 'Wedding makeup', 'Special-event makeup', 'Photo-shoot makeup', 'Permanent jewelry'],
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
    'botox-cost-punta-gorda': ['Botox', '$14 per unit', '30 minutes'],
    'dermal-fillers-cost-punta-gorda': ['Juvéderm Ultra XC', 'Juvéderm Voluma XC', 'RHA 1', 'RHA 2', 'RHA 3', 'Dermal Filler Consultation', '$300'],
    'forma-cost-punta-gorda': ['Face & Neck', '$3,000', 'Eyes', '$600', 'Forma + Lumecca Bundle', '$2,599'],
    'ipl-photofacial-cost-punta-gorda': [
      'Lumecca Peak IPL Consultation', '$50',
      'Legs', '$850 single · $2,400 series of 3',
      'Full Face', '$500 single · $1,200 series of 3',
      'Chest', '$500 single · $1,300 series of 3',
      'Neck', '$350 single · $900 series of 3',
      'Face & Neck', '$800 single · $2,000 series of 3',
      'Face, Neck & Chest', '$950 single · $2,600 series of 3',
      'Spot Treatment', '$250 single · $800 series of 3',
      'Hands', '$350 single · $900 series of 3',
    ],
    'biorepeel-cost-punta-gorda': ['BioRePeel Cl3 Rejuvenation', '$250', 'Series of 3', '$699'],
    'microneedling-cost-punta-gorda': ['Procell Therapies — Pro', '$300', 'Procell Therapies — MD', '$400', 'PRF Microneedling — Consultation', '$595'],
    'morpheus8-cost-punta-gorda': [
      'Full Face', '$1,200 single · $3,000 series of 3',
      'Face & Neck', '$1,250 single · $3,500 series of 3',
      'Morpheus8 Burst — Hyperhidrosis', '$2,200–$2,400 · package of 3',
      'Morpheus8 Resurfacing — Full Face', '$750 single · $2,000 series of 3',
      'Morpheus8 Resurfacing — Face & Neck', '$950 single · $2,700 series of 3',
      'Morpheus8 Prime — Eyes & Mouth', '$1,000 single · $2,200 series of 3',
      'Morpheus8 Prime — Around the Eyes', '$450 single · $1,200 series of 3',
      'Morpheus8 Prime — Around the Mouth', '$450 single · $1,200 series of 3',
      'Morpheus8 Burst Deep — Small Area', '$3,500 · 4 × 10-inch area · Series of 3',
      'Morpheus8 Burst Deep — Large Area', '$4,500 · 8 × 11-inch area · Series of 3',
      'Morpheus8 + Lumecca Bundle', '$1,799 · 2 total treatments',
    ],
  };
  const failures = [];

  for (const [slug, requiredCopy] of Object.entries(expectations)) {
    const file = path.join(DIST_ROOT, `cost/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const text = visibleText(mainHtml(html));
    const metaDescription = decodeHtmlEntities(metaContent(html, 'description'));
    if (metaDescription.length < 120 || metaDescription.length > 160) {
      failures.push(`${slug}: meta description is ${metaDescription.length} characters`);
    }
    if (!metaDescription.includes('House of Rose')) {
      failures.push(`${slug}: meta description is missing the House of Rose entity`);
    }
    for (const value of requiredCopy) {
      if (!text.includes(value)) failures.push(`${slug}: missing ${JSON.stringify(value)}`);
    }
    const expectedVerificationDate = slug === 'morpheus8-cost-punta-gorda'
      ? 'August 14, 2026'
      : 'August 6, 2026';
    if (!text.includes(expectedVerificationDate)) {
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
    if (visibleFaqs.length === 0) failures.push(`${slug}: expected a factual answer to the cost intent`);
    if (JSON.stringify(visibleFaqs) !== JSON.stringify(schemaFaqs)) {
      failures.push(`${slug}: visible FAQ copy and FAQPage JSON-LD differ`);
    }

    if (slug === 'morpheus8-cost-punta-gorda') {
      for (const required of [
        'Morpheus8 vs. Microneedling',
        'Morpheus8 adds fractional bipolar radiofrequency',
      ]) {
        if (!text.includes(required)) failures.push(`${slug}: missing comparison context ${JSON.stringify(required)}`);
      }
      if (!html.includes('href="/compare/morpheus8-vs-microneedling/"')) {
        failures.push(`${slug}: missing canonical Morpheus8 vs. Microneedling comparison link`);
      }
      if (text.includes('Price per unit is only one difference.')) {
        failures.push(`${slug}: retains Botox-specific per-unit comparison copy`);
      }
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
  const text = visibleText(html);
  const failures = expectedServiceLinks
    .filter((href) => !html.includes(`href="${href}"`))
    .map((href) => `missing direct related-service link ${href}`);

  for (const [label, pattern] of [
    ['payment heading', /How can I pay\?/i],
    ['accepted cards', /American Express[\s\S]{0,60}Discover[\s\S]{0,60}Mastercard[\s\S]{0,60}Visa/i],
    ['debit cards and checks', /debit cards[\s\S]{0,60}checks/i],
    ['pre-visit payment handoff', /(?:due|payment)[\s\S]{0,100}before[\s\S]{0,60}(?:visit|reserve)/i],
  ]) {
    if (!pattern.test(text)) failures.push(`missing ${label}`);
  }
  if (!html.includes('href="tel:+18449417673"')) failures.push('missing verified payment-question phone link');

  assert.equal(failures.length, 0, formatFailures('Cost-index navigation regression', failures));
});

test('concern guides retain reviewed distinctions without enforcing one headline formula', () => {
  const concernSlugs = [
    'aging',
    'dark-circles',
    'fine-lines-laxity',
    'acne-scarring',
    'active-acne',
    'hyperpigmentation',
    'volume-loss',
    'sun-damage',
    'texture',
    'stretch-marks',
  ];
  const faceConcernFacts = {
    aging: ['rougher surface', 'uneven color', 'appears with expression', 'surface, pigment, movement, or volume'],
    'dark-circles': ['thin or translucent skin', 'visible vessels', 'structural shadow', 'outside what an aesthetic service can change'],
    'fine-lines-laxity': ['repeated facial movement', 'skin texture', 'facial support', 'neurotoxins for movement-related lines', 'fillers for selected volume changes', 'resurfacing or device services'],
    'volume-loss': ['hollow, fold, or shift in facial shape', 'manufactured hyaluronic-acid gels', 'small sample of your own blood', 'Botox and Daxxify'],
  };
  const practicalGuidance = {
    aging: ['face at rest and once in expression', 'what you would prefer to leave alone', 'not a perfectly posed one'],
    'fine-lines-laxity': ['Let your face rest', 'A relaxed photograph and one with expression', 'how much natural movement you want to keep'],
    'volume-loss': ['Look straight on and from the side', 'Bring a front and side photograph', 'a hollow, a fold, or a line that changes with expression'],
  };
  const retiredFaceConcernCadence = [
    /services below/i,
    /linked services/i,
    /different questions/i,
    /treatment categories/i,
    /not one visible change/i,
  ];
  const failures = [];

  for (const slug of concernSlugs) {
    const file = path.join(DIST_ROOT, `concerns/${slug}/index.html`);
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
    const html = readFileSync(file, 'utf8');
    const education = html.match(/<section\b[^>]*data-concern-education[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
    const text = visibleText(education);
    if (!education) failures.push(`${slug}: missing concern education section`);
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
    for (const guidance of practicalGuidance[slug] ?? []) {
      if (!mainText.includes(guidance)) failures.push(`${slug}: missing practical guidance ${JSON.stringify(guidance)}`);
    }
    const consultationHeading = visibleText(
      main.match(/<h2\b[^>]*data-concern-consultation-heading[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '',
    );
    const consultationPrompt = visibleText(
      main.match(/<p\b[^>]*data-concern-consultation-prompt[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? '',
    );
    if (!consultationHeading) failures.push(`${slug}: missing consultation heading`);
    if (!consultationPrompt) failures.push(`${slug}: missing concern-specific consultation context`);
    for (const retired of [
      'Talk with House of Rose.',
      'Call the practice, or send an inquiry with the concern you want to discuss.',
      'Recognize the concern, but not the distinction?',
    ]) {
      if (mainText.includes(retired)) failures.push(`${slug}: contains retired repeated CTA ${JSON.stringify(retired)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Concern-guide depth regression', failures));
});

test('concern index preserves reviewed distinctions and direct guide navigation', () => {
  const file = path.join(DIST_ROOT, 'concerns/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const guidance = html.match(/<section\b[^>]*data-concern-index-guidance[^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  const text = visibleText(guidance);
  const main = mainHtml(html);
  const cards = [...main.matchAll(
    /<a\b(?=[^>]*data-concern-guide-card)(?=[^>]*href=["']([^"']+)["'])[^>]*>([\s\S]*?)<\/a>/gi,
  )];
  const failures = [];

  if (!guidance) failures.push('concerns index is missing reviewed guidance');
  if (cards.length < 10) failures.push(`concerns index expected at least 10 substantive guide cards, found ${cards.length}`);
  for (const card of cards) {
    const href = card[1];
    const cardText = visibleText(card[2]);
    if (!/^\/concerns\/[a-z0-9-]+\/$/.test(href)) failures.push(`concern card has invalid guide route ${JSON.stringify(href)}`);
    if (cardText.split(/\s+/).length < 12) failures.push(`concern card is too thin: ${JSON.stringify(cardText)}`);
  }
  for (const [label, pattern] of [
    ['active-breakout versus aftermath distinction', /new breakouts[\s\S]{0,100}left behind/i],
    ['under-eye color versus shadow distinction', /under-eye darkness[\s\S]{0,80}color[\s\S]{0,80}shadow/i],
    ['line/movement overlap distinction', /same area[\s\S]{0,120}(?:line|movement|expression)/i],
    ['non-diagnostic observation boundary', /observations?[\s\S]{0,50}not a diagnosis/i],
  ]) {
    if (!pattern.test(text)) failures.push(`concerns index is missing ${label}`);
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
  const mainText = visibleText(main);
  for (const [label, pattern] of [
    ['pigment/texture/movement/volume orientation', /pigment[\s\S]{0,60}texture[\s\S]{0,60}movement[\s\S]{0,60}volume/i],
    ['skin-analysis baseline distinction', /skin analysis[\s\S]{0,100}visual baseline/i],
    ['consultation discussion distinction', /consultation[\s\S]{0,100}(?:compare|talk|discuss)/i],
  ]) {
    if (!pattern.test(mainText)) failures.push(`concerns index is missing ${label}`);
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

  for (const [label, pattern] of [
    ['single Punta Gorda appointment location', /every appointment[\s\S]{0,80}Punta Gorda practice/i],
    ['canonical street address', /525 E Olympia Ave, Unit 9/i],
    ['actual-storefront image disclosure', /(?:photograph|image)[\s\S]{0,60}actual storefront/i],
    ['no satellite-location boundary', /no separate House of Rose locations/i],
    ['Unit 9 arrival cue', /(?:look for|find|enter)[\s\S]{0,40}Unit 9/i],
    ['free-parking fact', /free parking[\s\S]{0,30}available/i],
  ]) {
    if (!pattern.test(text)) failures.push(`areas index: missing ${label}`);
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
      satelliteAnswer: 'Appointments for clients coming from Port Charlotte take place there.',
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
      'If your appointment time is not set, call before leaving',
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
      'What if I want a specific appointment time?',
      'Is parking available?',
    ]) {
      if (!text.includes(requiredFaq)) failures.push(`${slug}: visible FAQ is missing ${JSON.stringify(requiredFaq)}`);
      if (!html.includes(`"name":"${requiredFaq}"`)) failures.push(`${slug}: FAQ schema is missing ${JSON.stringify(requiredFaq)}`);
    }
  }

  assert.equal(failures.length, 0, formatFailures('Area-detail trip-planning regression', failures));
});

test('results index keeps the empty state concise and reserves proof guidance for published cases', () => {
  const file = path.join(DIST_ROOT, 'results/index.html');
  assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const standard = main.match(
    /<section\b[^>]*data-results-standard[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const text = visibleText(standard);
  const mainText = visibleText(main);
  const failures = [];

  const isEmpty = /<meta\s+name="robots"\s+content="[^"]*\bnoindex\b/i.test(html);
  if (isEmpty) {
    if (standard) failures.push('results index: empty state should not render proof-standard guidance');
    for (const [label, pattern] of [
      ['no currently published client cases', /No House of Rose client cases[\s\S]{0,60}currently published/i],
      ['no stock/context-free stand-ins', /(?:stock|borrowed)[\s\S]{0,100}context-free images/i],
      ['written website-publication permission', /written permission[\s\S]{0,80}website publication/i],
      ['treatment/timeframe photo context', /treatment[\s\S]{0,80}timeframe[\s\S]{0,100}photographs/i],
      ['appointment still does not authorize publication', /service appointment[\s\S]{0,100}(?:does not|doesn't)[\s\S]{0,80}authoriz[\s\S]{0,80}publication/i],
    ]) {
      if (!pattern.test(mainText)) {
        failures.push(`results index: empty state is missing ${label}`);
      }
    }
  } else {
    if (!standard) failures.push('results index: published cases are missing proof-standard guidance');
    for (const [label, pattern] of [
      ['comparable-photo conditions', /same distance[\s\S]{0,40}crop[\s\S]{0,40}angle[\s\S]{0,40}lighting[\s\S]{0,40}background/i],
      ['no result-changing edits', /(?:retouching|editing)[\s\S]{0,80}(?:must not|cannot|can't)[\s\S]{0,80}(?:change|alter)[\s\S]{0,60}(?:apparent )?result/i],
      ['concurrent-treatment context', /treatment[\s\S]{0,120}(?:anything else|other service|add-on)[\s\S]{0,120}(?:contributed|used)[\s\S]{0,60}result/i],
      ['timeframe and session context', /(?:elapsed )?timeframe[\s\S]{0,100}(?:number of )?sessions/i],
      ['written publication permission', /written[\s\S]{0,60}(?:client )?permission[\s\S]{0,80}website publication/i],
      ['appointment is not publication consent', /treatment appointment[\s\S]{0,100}(?:does not|doesn't)[\s\S]{0,80}authoriz[\s\S]{0,80}(?:website )?publication/i],
      ['individual-variation boundary', /individual (?:results|outcomes) vary/i],
      ['documented example is not a forecast', /documented example[\s\S]{0,80}not a forecast/i],
      ['photographs cannot predict an outcome', /photographs? alone[\s\S]{0,100}(?:cannot|can't)[\s\S]{0,100}(?:outcome|result)/i],
    ]) {
      if (!pattern.test(text)) failures.push(`results index: missing ${label}`);
    }
  }
  for (const retired of [
    'Real results, real clients',
    'being photographed now',
    'Use the service—not the photograph—as your starting point.',
    'A service page explains',
  ]) {
    if (mainText.includes(retired)) failures.push(`results index: contains retired ${JSON.stringify(retired)}`);
  }
  const nextStep = main.match(
    /<section\b[^>]*data-results-next-step[^>]*>([\s\S]*?)<\/section>/i,
  )?.[1] ?? '';
  const nextStepText = visibleText(nextStep);
  if (isEmpty) {
    if (nextStep) failures.push('results index: empty state should not render result-interpretation guidance');
  } else {
    for (const [label, pattern] of [
      ['photo starts but cannot finish the conversation', /photograph[\s\S]{0,80}(?:start|begin)[\s\S]{0,80}conversation[\s\S]{0,80}(?:cannot|can't|does not)[\s\S]{0,50}finish/i],
      ['individual response cannot be predicted', /(?:cannot|can't)[\s\S]{0,80}predict[\s\S]{0,80}(?:skin|response)/i],
      ['no promise to recreate another result', /not a promise[\s\S]{0,100}recreate[\s\S]{0,100}(?:someone else|another person)/i],
    ]) {
      if (!pattern.test(nextStepText)) failures.push(`results index: missing ${label}`);
    }
    for (const href of ['/services/', '/compare/']) {
      if (!nextStep.includes(`href="${href}"`)) failures.push(`results index: next step is missing ${href}`);
    }
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
  for (const [label, pattern] of [
    ['page identity', /Morpheus8 vs\. Microneedling/i],
    [
      'fractional-radiofrequency distinction',
      /Morpheus8[\s\S]{0,160}fractional bipolar radiofrequency[\s\S]{0,160}Procell[\s\S]{0,100}(?:does not|without radiofrequency)/i,
    ],
    ['shared microneedling', /both[\s\S]{0,80}(?:use|still use) microneedling/i],
    ['current service role', /Current House of Rose role/i],
  ]) {
    if (!pattern.test(morpheusText)) failures.push(`morpheus8-vs-microneedling: missing ${label}`);
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
  for (const requiredFact of [
    /Daxxify vs\. Botox/i,
    /product-specific unit/i,
    /\$14 per Daxxify unit/i,
    /\$14 per Botox unit/i,
    /60 minutes/i,
    /30 minutes/i,
    /Published onset evidence/i,
    /Median 3 days to subject-rated improvement of at least 1 point/i,
    /chemical denervation typically begins 1[–-]2 days after injection/i,
    /Downtime evidence/i,
    /possible adverse reactions and injection-related effects/i,
    /separate studies with different (?:definitions|endpoints)/i,
    /not a dose-conversion table, a direct head-to-head trial, or a promise about an individual result/i,
  ]) {
    if (!requiredFact.test(daxxifyText)) failures.push(`daxxify-vs-botox: missing ${requiredFact}`);
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
    'House of Rose menu (prices shown as of',
    'IV hydration menu:',
    'Hydration IV — $99 · 30 minutes.',
    'Appointment price: PRF Under-Eye — Consultation — $495.',
    'Call House of Rose to confirm how much time to allow for the appointment.',
  ]) {
    assert.ok(
      fullFeed.includes(reviewedDepth),
      `Full service inventory is missing reviewed depth: ${JSON.stringify(reviewedDepth)}.`,
    );
  }
  assert.match(
    fullFeed,
    /Procell Microneedling[\s\S]{0,180}(?:controlled microchannels|microchannel)[\s\S]{0,220}Morpheus8[\s\S]{0,180}fractional bipolar radiofrequency/i,
    'Full service inventory is missing the reviewed Procell/Morpheus8 device distinction.',
  );

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
    'House of Rose\'s Face Reality Acne Bootcamp',
    '12-week program',
    'Visits take place every two weeks',
    'home-care review',
    '$899',
  ]) {
    assert.ok(text.includes(required), `Packages index is missing ${JSON.stringify(required)}.`);
  }
  for (const [label, pattern] of [
    ['consultation price', /\$99[\s\S]{0,40}(?:Acne Bootcamp )?Consultation/i],
    ['provider licence and certification', /Amber Mingione, Licensed Esthetician[\s\S]{0,100}Face Reality Certified Acne Specialist[\s\S]{0,180}(?:consultation|12-week program)/i],
    ['non-prescription esthetics boundary', /non-prescription esthetics program/i],
    ['medical-evaluation threshold', /deep[\s\S]{0,40}painful[\s\S]{0,40}widespread[\s\S]{0,80}actively scarring[\s\S]{0,140}medical evaluation/i],
  ]) {
    assert.match(text, pattern, `Packages index is missing ${label}.`);
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

  const html = readFileSync(file, 'utf8');
  const main = mainHtml(html);
  const text = visibleText(main);
  const metaDescription = decodeHtmlEntities(metaContent(html, 'description'));
  assert.ok(
    metaDescription.length >= 120 && metaDescription.length <= 160,
    `Face Reality package meta description is ${metaDescription.length} characters.`,
  );
  for (const [label, pattern] of [
    ['program price', /\$899/],
    ['program length', /12-week(?: Face Reality)? program/i],
    ['consultation price', /\$99/],
    ['consultation length', /60-minute(?: Acne Bootcamp)? Consultation/i],
  ]) {
    assert.match(metaDescription, pattern, `Face Reality package metadata is missing ${label}.`);
  }
  for (const [label, pattern] of [
    ['complete-program price', /\$899[\s\S]{0,100}(?:complete )?12-week program/i],
    ['starting consultation', /60-minute[\s\S]{0,100}Acne Bootcamp Consultation[\s\S]{0,80}\$99[\s\S]{0,100}(?:booked directly|directly bookable)/i],
    ['separate home-care purchase', /home-care products[\s\S]{0,120}(?:purchased|sold)[\s\S]{0,80}separately/i],
    ['provider licence and certification', /Amber Mingione, Licensed Esthetician[\s\S]{0,100}Face Reality Certified Acne Specialist/i],
  ]) {
    assert.match(text, pattern, `Face Reality package is missing ${label}.`);
  }
  assert.ok(
    main.includes('href="/services/face-reality-acne-program/"'),
    'Face Reality package must link the related service overview.',
  );
  assert.ok(
    main.includes('href="/about/providers/amber/"'),
    'Face Reality package must link Amber’s verified provider profile.',
  );
  for (const retiredFormula of [
    'built around more than one visit',
    'rather than booked as unrelated facials',
    'does not enroll you in the program',
  ]) {
    assert.ok(!text.toLowerCase().includes(retiredFormula), `Face Reality package retains ${JSON.stringify(retiredFormula)}.`);
  }
});

test('waxing hub is a factual directory and PRF under-eye uses reviewed public facts', () => {
  const hubFile = path.join(DIST_ROOT, 'services/waxing/index.html');
  const facialFile = path.join(DIST_ROOT, 'services/facial-waxing/index.html');
  const bodyFile = path.join(DIST_ROOT, 'services/body-waxing/index.html');
  const serviceIndexFile = path.join(DIST_ROOT, 'services/index.html');
  const collectionFile = path.join(DIST_ROOT, 'services/collections/waxing/index.html');
  const prfUnderEyeFile = path.join(DIST_ROOT, 'services/prf-under-eyes/index.html');
  const prfHubFile = path.join(DIST_ROOT, 'services/prf/index.html');
  const sitemapFile = path.join(DIST_ROOT, 'sitemap.xml');
  const compactFeedFile = path.join(DIST_ROOT, 'llms.txt');
  const fullFeedFile = path.join(DIST_ROOT, 'llms-full.txt');

  for (const file of [hubFile, facialFile, bodyFile, serviceIndexFile, collectionFile, prfUnderEyeFile, prfHubFile]) {
    assert.ok(existsSync(file), `Missing generated ${relativeToRepo(file)}`);
  }

  const hub = mainHtml(readFileSync(hubFile, 'utf8'));
  const facial = mainHtml(readFileSync(facialFile, 'utf8'));
  const body = mainHtml(readFileSync(bodyFile, 'utf8'));
  const serviceIndex = mainHtml(readFileSync(serviceIndexFile, 'utf8'));
  const collection = readFileSync(collectionFile, 'utf8');
  const prfUnderEyeHtml = readFileSync(prfUnderEyeFile, 'utf8');
  const prfUnderEye = mainHtml(prfUnderEyeHtml);
  const prfHub = mainHtml(readFileSync(prfHubFile, 'utf8'));
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const compactFeed = readFileSync(compactFeedFile, 'utf8');
  const fullFeed = readFileSync(fullFeedFile, 'utf8');
  const publicInventory = `${hub}\n${sitemap}\n${compactFeed}\n${fullFeed}`.toLowerCase();

  assert.equal(occurrenceCount(hub, 'href="/services/facial-waxing/"'), 1, 'Waxing hub must link Facial Waxing once in main content.');
  assert.equal(occurrenceCount(hub, 'href="/services/body-waxing/"'), 1, 'Waxing hub must link Body Waxing once in main content.');
  const hubText = visibleText(hub);
  assert.match(hubText, /\b11\b/, 'Waxing hub must preserve the verified 11-appointment total.');
  assert.match(hubText, /\bfour\b[\s\S]{0,40}\b(?:face|facial)\b/i, 'Waxing hub must preserve the four facial appointments.');
  assert.match(hubText, /\bseven\b[\s\S]{0,40}\bbody\b/i, 'Waxing hub must preserve the seven body appointments.');
  assert.match(
    hub,
    /data-booking-service="facial-waxing"[^>]*data-booking-mode="direct"/i,
    'Waxing hub must render Facial Waxing with its verified direct-booking behavior.',
  );
  assert.match(
    hub,
    /data-booking-service="body-waxing"[^>]*data-booking-mode="phone"/i,
    'Waxing hub must render Body Waxing with its verified phone-booking behavior.',
  );
  assert.ok(
    visibleText(hub).includes('chin, upper lip, and brows')
      && visibleText(hub).includes('underarms, bikini line, chest, back, full leg, partial leg, and full arm'),
    'Waxing hub must identify the verified areas in each service lane.',
  );
  for (const required of ['Eyebrow Shape, Trim &amp; Wax', '$25', '25 minutes']) {
    assert.ok(facial.includes(required), `Facial Waxing is missing ${required}.`);
  }
  for (const required of ['Bikini Line', '$30', 'Full Arm', '$45']) {
    assert.ok(body.includes(required), `Body Waxing is missing ${required}.`);
  }
  for (const required of [
    'How do I book body waxing?',
    'Which bikini-area waxing appointment is available?',
    'The available bikini-area appointment is Bikini Line at $30 for 10 minutes.',
    '$30',
    '10 minutes',
  ]) {
    assert.ok(visibleText(body).includes(required), `Body Waxing is missing ${required}.`);
  }
  assert.ok(readFileSync(bodyFile, 'utf8').includes('"@type":"FAQPage"'), 'Body Waxing must emit FAQPage JSON-LD for its reviewed question.');
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
  assert.match(prfUnderEyeHtml, /<title>PRF Under Eyes \| House of Rose Aesthetics<\/title>/i);
  assert.match(prfUnderEye, /<h1\b[^>]*>\s*PRF Under Eyes\s*<\/h1>/i);
  for (const schemaType of ['HealthAndBeautyBusiness', 'Service', 'BreadcrumbList', 'MedicalProcedure', 'FAQPage']) {
    assert.ok(
      prfUnderEyeHtml.includes(`"@type":"${schemaType}"`),
      `PRF Under Eyes must emit ${schemaType} structured data.`,
    );
  }
  assert.ok(
    prfHub.includes('href="/services/prf-under-eyes/"'),
    'The PRF hub must link the reviewed PRF Under Eyes detail route.',
  );
  assert.ok(
    sitemap.includes(`<loc>${SITE_ORIGIN}/services/prf-under-eyes/</loc>`),
    'Sitemap is missing the canonical PRF Under Eyes route.',
  );
  assert.ok(prfUnderEyeHtml.includes('525 E Olympia Ave'), 'PRF Under Eyes is missing the canonical practice address.');
  assert.ok(prfUnderEyeHtml.includes('href="tel:+18449417673"'), 'PRF Under Eyes is missing the verified phone CTA.');
  assert.ok(prfUnderEyeHtml.includes('Diana Morrison, RN'), 'PRF Under Eyes is missing the verified provider attribution.');
  assert.ok(
    prfUnderEyeHtml.includes('Medical Director: Joshua Shaw, MD · FL Lic. ME136232'),
    'PRF Under Eyes is missing the canonical medical-director attribution.',
  );
  assert.ok(
    !prfUnderEye.includes('href="/compare/prf-vs-prp/"')
      && !prfUnderEye.includes('href="/packages/prf-under-eye-series-of-3/"'),
    'PRF Under Eyes must not revive retired or unreviewed task destinations.',
  );
  assert.ok(
    prfUnderEye.includes('PRF Under-Eye — Consultation'),
    'PRF Under Eyes must preserve the exact GlossGenius listing label with the price.',
  );
  assert.ok(
    !/\b(?:45|60|75) minutes\b/i.test(visibleText(prfUnderEye)),
    'PRF Under Eyes must withhold the unresolved appointment duration.',
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

test('collection routes are noindex navigation and stay out of discovery feeds', () => {
  const collectionRoot = path.join(DIST_ROOT, 'services/collections');
  const routeFiles = [
    {
      slug: '',
      file: path.join(collectionRoot, 'index.html'),
    },
    ...readdirSync(collectionRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        slug: entry.name,
        file: path.join(collectionRoot, entry.name, 'index.html'),
      }))
      .filter(({ file }) => isFile(file)),
  ];
  const sitemap = readFileSync(path.join(DIST_ROOT, 'sitemap.xml'), 'utf8');
  const compactFeed = readFileSync(path.join(DIST_ROOT, 'llms.txt'), 'utf8');
  const fullFeed = readFileSync(path.join(DIST_ROOT, 'llms-full.txt'), 'utf8');
  const failures = [];

  assert.ok(routeFiles.length > 1, 'No generated collection-detail pages were found.');
  for (const { slug, file } of routeFiles) {
    const html = readFileSync(file, 'utf8');
    const route = slug ? `/services/collections/${slug}/` : '/services/collections/';
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
