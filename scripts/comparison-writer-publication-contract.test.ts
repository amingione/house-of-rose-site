import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';

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
