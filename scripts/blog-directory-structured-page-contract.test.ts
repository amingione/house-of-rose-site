import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ALL_BLOG_POSTS_QUERY } from '../packages/web/src/lib/queries.ts';
import { itemListPage, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const directorySource = readFileSync(
  new URL('../packages/web/src/pages/blog/index.astro', import.meta.url),
  'utf8',
);

test('the Journal directory derives structured entries from the reviewed public inventory', () => {
  assert.match(ALL_BLOG_POSTS_QUERY, /defined\(publishedAt\)/);
  assert.match(ALL_BLOG_POSTS_QUERY, /defined\(slug\.current\)/);
  assert.match(ALL_BLOG_POSTS_QUERY, /count\(body\) > 0/);
  assert.match(
    directorySource,
    /\.filter\(\(post\) => isReviewedPublicBlogSlug\(post\.slug\)\)/,
  );
  assert.match(directorySource, /items: posts\.map\(\(post\) => \(\{/);
  assert.match(directorySource, /name: getPublicBlogTitle\(post\)/);
  assert.match(
    directorySource,
    /new URL\(`\/blog\/\$\{post\.slug\}\/`, site\)\.toString\(\)/,
  );
  assert.equal(
    directorySource.match(/itemListPage\(/g)?.length,
    1,
    'The Journal must emit one canonical ItemList.',
  );
});

test('the Journal directory connects one CollectionPage node to its ItemList', () => {
  assert.match(directorySource, /structuredPageType="CollectionPage"/);
  assert.match(
    directorySource,
    /structuredPageMainEntityId=\{`\$\{canonical\}#itemlist`\}/,
  );
  assert.match(directorySource, /<SchemaMarkup item=\{journalSchema\} slot="head" \/>/);
  assert.match(directorySource, /<SchemaMarkup item=\{breadcrumb\} slot="head" \/>/);

  const site = 'https://houseofrosefl.com/';
  const canonical = `${site}blog/`;
  const items = [
    { name: 'Reviewed article', url: `${canonical}reviewed-article/` },
  ];
  const list = itemListPage(
    {
      name: 'Treatment Journal',
      description: 'Reviewed treatment articles.',
      url: canonical,
      items,
    },
    site,
  );
  const graph = siteEntityGraph(
    {
      url: canonical,
      name: 'Treatment Journal',
      description: 'Reviewed treatment articles.',
      image: `${site}journal.webp`,
      pageType: 'CollectionPage',
      mainEntityId: `${canonical}#itemlist`,
    },
    site,
  );

  assert.equal(list['@type'], 'ItemList');
  assert.equal(list['@id'], `${canonical}#itemlist`);
  assert.equal(list.numberOfItems, items.length);
  assert.deepEqual(
    list.itemListElement.map((entry) => entry.url),
    items.map((entry) => entry.url),
  );

  const pageNodes = graph['@graph'].filter(
    (node) => node['@id'] === `${canonical}#webpage`,
  );
  assert.equal(pageNodes.length, 1);
  assert.equal(pageNodes[0]?.['@type'], 'CollectionPage');
  assert.deepEqual(pageNodes[0]?.mainEntity, { '@id': list['@id'] });
});
