import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [humanSitemap, xmlSitemap, compactFeed, fullFeed, footer] = await Promise.all([
  readFile(new URL('../packages/web/src/pages/sitemap.astro', import.meta.url), 'utf8'),
  readFile(new URL('../packages/web/src/pages/sitemap.xml.ts', import.meta.url), 'utf8'),
  readFile(new URL('../packages/web/src/pages/llms.txt.ts', import.meta.url), 'utf8'),
  readFile(new URL('../packages/web/src/pages/llms-full.txt.ts', import.meta.url), 'utf8'),
  readFile(new URL('../packages/web/src/components/Footer.astro', import.meta.url), 'utf8'),
]);

test('the active Support route remains discoverable across public route indexes', () => {
  assert.match(
    humanSitemap,
    /\{ title: 'Support', href: '\/support\/' \}/,
    'The human sitemap must include the active Support route.',
  );
  assert.match(
    xmlSitemap,
    /\{ loc: `\$\{baseUrl\}\/support\/`/,
    'The XML sitemap must include the active Support route.',
  );

  for (const [name, source] of [
    ['compact AI feed', compactFeed],
    ['full AI feed', fullFeed],
  ]) {
    assert.ok(source.includes('${base}/support/'), `${name} must include the active Support route.`);
  }

  assert.match(
    footer,
    /<a href="\/support\/">[^<]+<\/a>/,
    'The global footer must keep an inbound link to the active Support route.',
  );
});
