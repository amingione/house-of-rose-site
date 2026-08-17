import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  ALL_CASE_STUDIES_QUERY,
  ALL_COMPARISONS_QUERY,
  ALL_COST_GUIDES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
  COMPARISON_BY_SLUG_QUERY,
  COST_GUIDE_BY_SLUG_QUERY,
  LOCAL_AREA_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';

const relationshipQueries = [
  ALL_COST_GUIDES_QUERY,
  COST_GUIDE_BY_SLUG_QUERY,
  ALL_COMPARISONS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
  LOCAL_AREA_BY_SLUG_QUERY,
  ALL_CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
] as const;

test('public service relationships expose route identity and booking action without raw appointment facts', () => {
  const querySource = readFileSync(
    new URL('../packages/web/src/lib/queries.ts', import.meta.url),
    'utf8',
  );
  const serviceRefType = querySource.match(/export interface ServiceRef \{([\s\S]*?)\n\}/)?.[1];
  const serviceRefProjection = querySource.match(
    /const SERVICE_REF_FIELDS = \/\* groq \*\/ `([\s\S]*?)`;/,
  )?.[1];

  assert.ok(serviceRefType, 'The shared public service-reference type must remain defined.');
  assert.ok(serviceRefProjection, 'The shared public service-reference projection must remain defined.');

  for (const field of ['_id', 'title', 'slug', 'bookingMode', 'bookingUrl']) {
    assert.match(serviceRefType, new RegExp(`\\b${field}\\??:`));
    assert.match(serviceRefProjection, new RegExp(`\\b${field === 'slug' ? 'slug\\.current' : field}\\b`));
  }

  for (const field of ['price', 'duration', 'bookingVerifiedAt']) {
    assert.doesNotMatch(serviceRefType, new RegExp(`\\b${field}\\b`));
    assert.doesNotMatch(serviceRefProjection, new RegExp(`\\b${field}\\b`));
    for (const query of relationshipQueries) {
      assert.doesNotMatch(query, new RegExp(`\\b${field}\\b`));
    }
  }
});

test('lean service relationships retain the public-route predicates used by their renderers', () => {
  const unavailableSlugs = JSON.stringify(UNAVAILABLE_PUBLIC_SERVICE_SLUGS);

  for (const query of relationshipQueries) {
    assert.match(query, /status in \["live", "actual-menu"\]/);
    assert.match(query, /defined\([^)]*slug\.current\)/);
    assert.ok(
      query.includes(`slug.current in ${unavailableSlugs}`),
      'Each relationship query must continue to reference the shared unavailable-service authority.',
    );
    for (const field of ['_id', 'title', 'bookingMode', 'bookingUrl']) {
      assert.match(query, new RegExp(`\\b${field}\\b`));
    }
    assert.match(query, /"slug": slug\.current/);
  }
});
