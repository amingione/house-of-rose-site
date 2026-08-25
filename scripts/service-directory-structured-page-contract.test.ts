import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { isVerifiedGlossGeniusBookingUrl } from '../packages/web/src/lib/booking.ts';
import {
  ALL_LOCAL_SERVICE_RECORDS,
  PUBLIC_DIRECTORY_SERVICES,
  PUBLIC_SERVICES,
  getPublicCollections,
} from '../packages/web/src/lib/serviceCatalog.ts';
import { itemListPage, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const directorySource = readFileSync(
  new URL('../packages/web/src/pages/services/index.astro', import.meta.url),
  'utf8',
);

test('the service directory derives structured entries from the local Astro catalog', () => {
  assert.equal(PUBLIC_SERVICES.length, 24);
  assert.equal(new Set(PUBLIC_SERVICES.map(({ slug }) => slug)).size, PUBLIC_SERVICES.length);
  assert.ok(PUBLIC_DIRECTORY_SERVICES.every(({ kind }) => kind !== 'treatment'));
  assert.equal(getPublicCollections().length, 5);

  assert.match(directorySource, /items: allServices\.map\(\(service\) => \(\{/);
  assert.match(directorySource, /new URL\(`\/services\/\$\{service\.slug\}\/`, site\)\.toString\(\)/);
  assert.equal(
    directorySource.match(/itemListPage\(/g)?.length,
    1,
    'The route must emit one canonical service ItemList.',
  );
});

test('the local catalog preserves booking and publication boundaries', () => {
  const radianceRenewal = ALL_LOCAL_SERVICE_RECORDS.find(
    ({ slug }) => slug === 'radiance-and-renewal-facial',
  );
  assert.equal(radianceRenewal?.title, 'Radiance & Renewal Facial');
  assert.equal(radianceRenewal?.public, false);
  assert.ok(!PUBLIC_SERVICES.some(({ slug }) => slug === 'radiance-and-renewal-facial'));

  for (const service of PUBLIC_SERVICES) {
    assert.ok(!('price' in service), `${service.slug} must not carry a public service price`);
    if (service.bookingMode === 'direct' || service.bookingMode === 'consultation') {
      assert.ok(
        isVerifiedGlossGeniusBookingUrl(service.bookingUrl),
        `${service.slug} needs a verified GlossGenius booking URL`,
      );
    }
  }
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
