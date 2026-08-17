import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ALL_SERVICES_QUERY } from '../packages/web/src/lib/queries.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';
import { itemListPage, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const directorySource = readFileSync(
  new URL('../packages/web/src/pages/services/index.astro', import.meta.url),
  'utf8',
);

test('the service directory derives structured entries from the generated public inventory', () => {
  assert.match(ALL_SERVICES_QUERY, /status in \["live", "actual-menu"\]/);
  assert.match(ALL_SERVICES_QUERY, /defined\(slug\.current\)/);
  assert.ok(
    ALL_SERVICES_QUERY.includes(
      `!(slug.current in ${JSON.stringify(UNAVAILABLE_PUBLIC_SERVICE_SLUGS)})`,
    ),
    'The directory query must exclude the shared unavailable service inventory.',
  );
  assert.match(ALL_SERVICES_QUERY, /kind != "treatment" \|\| !defined\(kind\)/);

  assert.match(directorySource, /items: allServices\.map\(\(service\) => \(\{/);
  assert.match(directorySource, /new URL\(`\/services\/\$\{service\.slug\}\/`, site\)\.toString\(\)/);
  assert.equal(
    directorySource.match(/itemListPage\(/g)?.length,
    1,
    'The route must emit one canonical service ItemList.',
  );
});

test('the service directory connects one CollectionPage node to its ItemList', () => {
  assert.match(directorySource, /structuredPageType="CollectionPage"/);
  assert.match(directorySource, /structuredPageMainEntityId=\{`\$\{canonical\}#itemlist`\}/);
  assert.match(directorySource, /<SchemaMarkup item=\{directorySchema\} slot="head" \/>/);
  assert.match(directorySource, /<SchemaMarkup item=\{breadcrumb\} slot="head" \/>/);

  const site = 'https://houseofrosefl.com/';
  const canonical = `${site}services/`;
  const entries = [
    { name: 'Service A', url: `${canonical}service-a/` },
    { name: 'Service B', url: `${canonical}service-b/` },
  ];
  const list = itemListPage(
    {
      name: 'Services',
      description: 'Public service directory.',
      url: canonical,
      items: entries,
    },
    site,
  );
  const graph = siteEntityGraph(
    {
      url: canonical,
      name: 'Services',
      description: 'Public service directory.',
      image: `${site}services.webp`,
      pageType: 'CollectionPage',
      mainEntityId: `${canonical}#itemlist`,
    },
    site,
  );

  assert.equal(list['@type'], 'ItemList');
  assert.equal(list['@id'], `${canonical}#itemlist`);
  assert.equal(list.numberOfItems, entries.length);
  assert.deepEqual(
    list.itemListElement.map((entry) => entry.url),
    entries.map((entry) => entry.url),
  );

  const pageNodes = graph['@graph'].filter(
    (node) => node['@id'] === `${canonical}#webpage`,
  );
  assert.equal(pageNodes.length, 1);
  assert.equal(pageNodes[0]?.['@type'], 'CollectionPage');
  assert.deepEqual(pageNodes[0]?.mainEntity, { '@id': list['@id'] });
});
