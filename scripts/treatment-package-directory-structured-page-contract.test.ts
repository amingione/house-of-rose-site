import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { ALL_TREATMENT_PACKAGES_QUERY } from '../packages/web/src/lib/queries.ts';
import { VERIFIED_TREATMENT_PACKAGE_SLUGS } from '../packages/web/src/lib/publicTreatmentPackageContent.ts';
import { itemListPage, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const directorySource = readFileSync(
  new URL('../packages/web/src/pages/packages/index.astro', import.meta.url),
  'utf8',
);

test('the treatment-package directory derives structured entries from its guarded public inventory', () => {
  assert.match(ALL_TREATMENT_PACKAGES_QUERY, /status == "live"/);
  assert.ok(
    ALL_TREATMENT_PACKAGES_QUERY.includes(
      `slug.current in ${JSON.stringify(VERIFIED_TREATMENT_PACKAGE_SLUGS)}`,
    ),
    'The package directory query must use the shared verified route inventory.',
  );
  assert.match(ALL_TREATMENT_PACKAGES_QUERY, /serviceSlugs/);
  assert.doesNotMatch(ALL_TREATMENT_PACKAGES_QUERY, /servicesIncluded|_type == "service"/);
  assert.match(directorySource, /items: packages\.map\(\(pkg\) => \(\{/);
  assert.match(directorySource, /name: pkg\.title/);
  assert.match(
    directorySource,
    /new URL\(`\/packages\/\$\{pkg\.slug\}\/`, site\)\.toString\(\)/,
  );
  assert.equal(
    directorySource.match(/itemListPage\(/g)?.length,
    1,
    'The route must emit one canonical treatment-package ItemList.',
  );
});

test('the treatment-package directory connects one CollectionPage node to its ItemList', () => {
  assert.match(directorySource, /structuredPageType="CollectionPage"/);
  assert.match(
    directorySource,
    /structuredPageMainEntityId=\{`\$\{canonical\}#itemlist`\}/,
  );
  assert.match(directorySource, /<SchemaMarkup item=\{packagesSchema\} slot="head" \/>/);
  assert.match(directorySource, /<SchemaMarkup item=\{breadcrumb\} slot="head" \/>/);

  const site = 'https://houseofrosefl.com/';
  const canonical = `${site}packages/`;
  const entries = [
    { name: 'Verified treatment package', url: `${canonical}verified-program/` },
  ];
  const list = itemListPage(
    {
      name: 'Treatment Packages',
      description: 'Verified treatment packages.',
      url: canonical,
      items: entries,
    },
    site,
  );
  const graph = siteEntityGraph(
    {
      url: canonical,
      name: 'Treatment Packages',
      description: 'Verified treatment packages.',
      image: `${site}packages.webp`,
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
