import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';
import {
  ALL_COMPARISONS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerSource = readFileSync(
  new URL('../packages/studio/scripts/create-daxxify-botox-comparison.mjs', import.meta.url),
  'utf8',
);
const sourceDocument = writerSource.match(
  /const sourceDocument\s*=\s*(\{[\s\S]*?\n\});\n\nconst current/,
)?.[1];
const optionFactory = writerSource.match(
  /const option\s*=\s*\(\)\s*=>\s*\(\s*(\{[\s\S]*?\})\s*\);/,
)?.[1];

test('the active comparison writer stores only routing and relationship truth', () => {
  assert.match(
    packageJson.scripts?.['content:daxxify-comparison:apply'] ?? '',
    /create-daxxify-botox-comparison\.mjs\s+--apply/,
  );
  assert.ok(sourceDocument, 'The Daxxify writer must define its source document.');
  assert.ok(optionFactory, 'The Daxxify writer must define its local-service option factory.');

  const retiredTopLevelFields = comparison.fields
    .filter((field) => field.readOnly === true)
    .map((field) => field.name);
  for (const fieldName of retiredTopLevelFields) {
    assert.doesNotMatch(sourceDocument, new RegExp(`\\b${fieldName}\\s*:`));
  }

  const optionA = comparison.fields.find(({ name }) => name === 'optionA');
  const retiredOptionFields = optionA && 'fields' in optionA
    ? optionA.fields.filter((field) => field.readOnly === true).map((field) => field.name)
    : [];
  for (const fieldName of retiredOptionFields) {
    assert.doesNotMatch(optionFactory, new RegExp(`\\b${fieldName}\\s*:`));
  }

  assert.match(sourceDocument, /status:\s*'live'/);
  assert.match(sourceDocument, /optionA:\s*option\(\)/);
  assert.match(sourceDocument, /optionB:\s*option\(\)/);
  assert.match(optionFactory, /serviceSlug:\s*INJECTABLES_SERVICE_SLUG/);
});

test('the active comparison writer uses the canonical local service slug', () => {
  assert.match(writerSource, /const INJECTABLES_SERVICE_SLUG = 'injectables'/);
  assert.doesNotMatch(writerSource, /_type:\s*'reference'|service->/);
});

test('comparison option authoring and projections use local service slugs', () => {
  const optionA = comparison.fields.find(({ name }) => name === 'optionA');
  assert.ok(optionA && 'fields' in optionA && Array.isArray(optionA.fields));
  const serviceSlug = optionA.fields.find(({ name }) => name === 'serviceSlug');
  assert.equal(serviceSlug?.type, 'string');
  assert.ok(Array.isArray(serviceSlug?.options?.list));

  for (const query of [ALL_COMPARISONS_QUERY, COMPARISON_BY_SLUG_QUERY]) {
    assert.match(query, /serviceSlug/);
    assert.doesNotMatch(query, /service->/);
  }
});
