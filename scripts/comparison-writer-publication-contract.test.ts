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
  assert.ok(optionFactory, 'The Daxxify writer must define its service-reference option factory.');

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
  assert.match(optionFactory, /service:\s*\{\s*_type:\s*'reference'/);
});

test('the active comparison writer requires the canonical public service route before creation', () => {
  assert.match(writerSource, /current\.service\.slug !== 'injectables'/);
  assert.match(writerSource, /!\['live', 'actual-menu'\]\.includes\(current\.service\.status\)/);

  const serviceGuard = writerSource.indexOf("current.service.slug !== 'injectables'");
  const dryRunBoundary = writerSource.indexOf('if (!apply)');
  const createCall = writerSource.indexOf('client.create(document');

  assert.ok(serviceGuard >= 0);
  assert.ok(serviceGuard < dryRunBoundary, 'Service route validation must run during dry validation.');
  assert.ok(serviceGuard < createCall, 'Service route validation must run before document creation.');
});

test('comparison option authoring and projections require routeable public services', () => {
  const optionA = comparison.fields.find(({ name }) => name === 'optionA');
  assert.ok(optionA && 'fields' in optionA && Array.isArray(optionA.fields));
  const serviceReference = optionA.fields.find(({ name }) => name === 'service') as
    | { options?: { filter?: string } }
    | undefined;
  const authoringFilter = serviceReference?.options?.filter ?? '';
  assert.match(authoringFilter, /status in \["live", "actual-menu"\]/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);

  for (const query of [ALL_COMPARISONS_QUERY, COMPARISON_BY_SLUG_QUERY]) {
    const serviceProjection = query.match(/"service": select\(([\s\S]*?)=> service->/);
    assert.ok(serviceProjection?.[1], 'The comparison query must guard option service routes.');
    assert.match(serviceProjection[1], /service->status in \["live", "actual-menu"\]/);
    assert.match(serviceProjection[1], /defined\(service->slug\.current\)/);
  }
});
