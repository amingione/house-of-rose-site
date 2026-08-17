import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { service, siteEntityGraph } from '../packages/web/src/lib/structuredData.ts';

const detailSource = readFileSync(
  new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
  'utf8',
);

test('service detail pages connect the webpage to their canonical Service node', () => {
  assert.match(
    detailSource,
    /structuredPageMainEntityId=\{`\$\{canonicalURL\.toString\(\)\}#service`\}/,
  );
  assert.match(detailSource, /<SchemaMarkup item=\{serviceSchema\} slot="head" \/>/);
  assert.equal(
    detailSource.match(/serviceJsonLd\(/g)?.length,
    1,
    'Each service detail route must emit one canonical Service node.',
  );

  const site = 'https://houseofrosefl.com/';
  const canonical = `${site}services/example-treatment/`;
  const serviceNode = service(
    {
      name: 'Example treatment',
      description: 'Verified treatment description.',
      url: canonical,
      serviceType: 'Example treatment',
    },
    site,
  );
  const graph = siteEntityGraph(
    {
      url: canonical,
      name: 'Example treatment',
      description: 'Verified treatment description.',
      image: `${site}treatment.webp`,
      mainEntityId: `${canonical}#service`,
    },
    site,
  );

  assert.equal(serviceNode['@type'], 'Service');
  assert.equal(serviceNode['@id'], `${canonical}#service`);

  const pageNodes = graph['@graph'].filter(
    (node) => node['@id'] === `${canonical}#webpage`,
  );
  assert.equal(pageNodes.length, 1);
  assert.deepEqual(pageNodes[0]?.mainEntity, { '@id': serviceNode['@id'] });
});
