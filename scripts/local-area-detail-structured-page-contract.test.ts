import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { localBusiness, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const detailSource = readFileSync(
  new URL('../packages/web/src/pages/areas/[slug].astro', import.meta.url),
  'utf8',
);

test('local-area detail pages connect the webpage to their page-scoped business node', () => {
  assert.match(
    detailSource,
    /structuredPageMainEntityId=\{`\$\{canonical\}#localbusiness`\}/,
  );
  assert.match(detailSource, /<SchemaMarkup item=\{business\} slot="head" \/>/);
  assert.equal(
    detailSource.match(/localBusiness\(/g)?.length,
    1,
    'Each local-area detail route must emit one page-scoped business node.',
  );

  const site = 'https://houseofrosefl.com/';
  const canonical = `${site}areas/example-area/`;
  const business = localBusiness({
    url: canonical,
    areaName: 'Example Area, FL',
  });
  const graph = siteEntityGraph(
    {
      url: canonical,
      name: 'Medical Aesthetics Near Example Area, FL',
      description: 'Verified local-area description.',
      image: `${site}area.webp`,
      mainEntityId: `${canonical}#localbusiness`,
    },
    site,
  );

  assert.equal(business['@type'], 'HealthAndBeautyBusiness');
  assert.equal(business['@id'], `${canonical}#localbusiness`);

  const pageNodes = graph['@graph'].filter(
    (node) => node['@id'] === `${canonical}#webpage`,
  );
  assert.equal(pageNodes.length, 1);
  assert.deepEqual(pageNodes[0]?.mainEntity, { '@id': business['@id'] });
});
