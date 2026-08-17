import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../', import.meta.url);

const read = async (path: string): Promise<string> =>
  readFile(new URL(path, root), 'utf8');

const robotsAllows = (robots: string, userAgent: string, path: string): boolean => {
  const groups: Array<{ agents: string[]; rules: Array<{ kind: 'allow' | 'disallow'; path: string }> }> = [];
  let current: (typeof groups)[number] | undefined;

  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      if (!current || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && (field === 'allow' || field === 'disallow')) {
      current.rules.push({ kind: field, path: value });
    }
  }

  const normalizedAgent = userAgent.toLowerCase();
  const matchingGroups = groups.filter(({ agents }) =>
    agents.some((agent) => agent === '*' || normalizedAgent.includes(agent)),
  );
  const specificGroups = matchingGroups.filter(({ agents }) => agents.some((agent) => agent !== '*'));
  const rules = (specificGroups.length > 0 ? specificGroups : matchingGroups).flatMap(({ rules }) => rules);
  const matches = rules
    .filter((rule) => rule.path && path.startsWith(rule.path))
    .sort((left, right) => right.path.length - left.path.length);

  return matches[0]?.kind !== 'disallow';
};

test('public robots policy allows named answer-engine crawlers and protects staff routes', async () => {
  const robots = await read('packages/web/public/robots.txt');

  for (const crawler of ['GPTBot', 'ClaudeBot', 'PerplexityBot']) {
    assert.equal(robotsAllows(robots, crawler, '/'), true, `${crawler} should crawl public pages`);
    assert.equal(robotsAllows(robots, crawler, '/services/'), true, `${crawler} should crawl services`);
    assert.equal(robotsAllows(robots, crawler, '/staff/'), false, `${crawler} should not crawl staff tools`);
  }
  assert.match(robots, /^Sitemap: https:\/\/houseofrosefl\.com\/sitemap\.xml$/m);
});

test('BaseLayout emits optional GSC verification and consent-gates analytics vendors', async () => {
  const layout = await read('packages/web/src/layouts/BaseLayout.astro');
  const measurement = await read('packages/web/src/lib/measurement.ts');

  assert.match(layout, /import\.meta\.env\.PUBLIC_GSC_VERIFY/);
  assert.match(layout, /name="google-site-verification" content=\{gscVerify\}/);
  assert.match(layout, /import\.meta\.env\.DEV \? undefined : ['"][^'"]+['"]/);
  assert.match(layout, /window\.__horMeasurementConfig=\{ahrefsKey:/);

  assert.match(measurement, /consent\.analytics_storage !== 'granted'/);
  assert.match(measurement, /https:\/\/analytics\.ahrefs\.com\/analytics\.js/);
  assert.match(measurement, /script\.dataset\.key = key/);
  assert.match(measurement, /isLocalMeasurementHost\(\)/);
  assert.match(measurement, /https:\/\/script\.crazyegg\.com\/pages\/scripts\/0133\/4876\.js/);
  assert.doesNotMatch(layout, /script\.crazyegg\.com/);
});

test('consent defaults deny optional measurement before vendor initialization', async () => {
  const bootstrap = await read('packages/web/src/components/ConsentBootstrap.astro');
  const layout = await read('packages/web/src/layouts/BaseLayout.astro');

  assert.match(bootstrap, /analytics_storage:'denied'/);
  assert.match(bootstrap, /ad_storage:'denied'/);
  assert.ok(
    layout.indexOf('<ConsentBootstrap />') < layout.indexOf('window.__horMeasurementConfig='),
    'consent default must be emitted before measurement configuration',
  );
});

test('lead-form mirroring waits for form validation before posting', async () => {
  const measurement = await read('packages/web/src/lib/measurement.ts');

  assert.match(measurement, /document\.addEventListener\('submit', \(event\) =>/);
  assert.match(measurement, /event\.defaultPrevented/);
  assert.doesNotMatch(measurement, /form\.addEventListener\('submit'/);
});
