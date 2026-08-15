import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  SERVICE_BY_SLUG_QUERY,
  type ServiceLocalArea,
} from '../packages/web/src/lib/queries.ts';
import { REVIEWED_PUBLIC_LOCAL_AREA_SLUGS } from '../packages/web/src/lib/publicLocalAreaContent.ts';

const serviceRoute = readFileSync(
  new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
  'utf8',
);

test('service pages receive only reviewed local-area backlinks from servedServices', () => {
  const localAreaProjection = SERVICE_BY_SLUG_QUERY.match(
    /"localAreas":\s*\*\[([\s\S]*?)\]\s*\|\s*order\([^)]*\)\s*\{([\s\S]*?)\n\s{4}\},/,
  );

  assert.ok(localAreaProjection, 'The service detail query must expose its routeable local-area backlinks.');
  assert.match(localAreaProjection[1], /_type\s*==\s*"localArea"/);
  assert.match(
    localAreaProjection[1],
    new RegExp(`slug\\.current\\s+in\\s+${escapeRegExp(JSON.stringify(REVIEWED_PUBLIC_LOCAL_AREA_SLUGS))}`),
  );
  assert.match(localAreaProjection[1], /\^\._id\s+in\s+servedServices\[\]._ref/);

  for (const field of ['_id', 'city', '"slug": slug.current']) {
    assert.match(localAreaProjection[2], new RegExp(escapeRegExp(field)));
  }
});

test('service local-area backlinks render as trailing-slash routes', () => {
  assert.match(serviceRoute, /service\.localAreas\?\.map\(\(area\)\s*=>/);
  assert.match(serviceRoute, /href=\{`\/areas\/\$\{area\.slug\}\/`\}/);
  assert.match(serviceRoute, /\{area\.city\}/);

  const fixture: ServiceLocalArea = {
    _id: 'area-fixture',
    city: 'Routeable City',
    slug: 'routeable-city',
  };
  assert.equal(`/areas/${fixture.slug}/`, '/areas/routeable-city/');
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
