import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const readSource = (path: string): string =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

test('the shared entity graph defaults to WebPage and supports one typed page node', () => {
  const baseInput = {
    url: 'https://houseofrosefl.com/example/',
    name: 'Example',
    description: 'Example description.',
    image: 'https://houseofrosefl.com/example.webp',
  };
  const defaultGraph = siteEntityGraph(baseInput, 'https://houseofrosefl.com/');
  const typedGraph = siteEntityGraph(
    {
      ...baseInput,
      pageType: 'ProfilePage',
      mainEntityId: 'https://houseofrosefl.com/example/#person',
    },
    'https://houseofrosefl.com/',
  );

  const defaultNodes = defaultGraph['@graph'];
  const typedNodes = typedGraph['@graph'];
  assert.ok(Array.isArray(defaultNodes));
  assert.ok(Array.isArray(typedNodes));

  const defaultPage = defaultNodes.find(
    (node): node is Record<string, unknown> =>
      typeof node === 'object' && node !== null && node['@id'] === `${baseInput.url}#webpage`,
  );
  const typedPages = typedNodes.filter(
    (node): node is Record<string, unknown> =>
      typeof node === 'object' && node !== null && node['@id'] === `${baseInput.url}#webpage`,
  );

  assert.equal(defaultPage?.['@type'], 'WebPage');
  assert.equal(typedPages.length, 1, 'The typed graph must keep one canonical page node.');
  assert.equal(typedPages[0]?.['@type'], 'ProfilePage');
  assert.deepEqual(typedPages[0]?.mainEntity, { '@id': `${baseInput.url}#person` });
});

test('provider routes select the documented structured page types and entities', () => {
  const layout = readSource('../packages/web/src/layouts/BaseLayout.astro');
  const directory = readSource('../packages/web/src/pages/about/providers/index.astro');
  const detail = readSource('../packages/web/src/pages/about/providers/[slug].astro');

  assert.match(layout, /pageType: structuredPageType/);
  assert.match(layout, /mainEntityId: structuredPageMainEntityId/);

  assert.match(directory, /structuredPageType="CollectionPage"/);
  assert.match(directory, /structuredPageMainEntityId=\{`\$\{canonical\}#itemlist`\}/);
  assert.match(directory, /itemListPage\(/);
  assert.match(directory, /<SchemaMarkup item=\{breadcrumb\}/);

  assert.match(detail, /structuredPageType="ProfilePage"/);
  assert.match(detail, /structuredPageMainEntityId=\{`\$\{canonical\}#person`\}/);
  assert.match(detail, /personProfile\(/);
  assert.match(detail, /<SchemaMarkup item=\{breadcrumb\}/);
});
