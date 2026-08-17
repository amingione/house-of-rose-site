import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerSource = readFileSync(
  new URL('../packages/studio/scripts/archive-legacy-daxxify-comparison.mjs', import.meta.url),
  'utf8',
);
const setPayload = writerSource.match(/const set\s*=\s*(\{[\s\S]*?\n\});/)?.[1];

test('the active comparison archive does not rewrite read-only publication fields', () => {
  assert.match(
    packageJson.scripts?.['content:daxxify-legacy-archive:apply'] ?? '',
    /archive-legacy-daxxify-comparison\.mjs\s+--apply/,
  );
  assert.ok(setPayload, 'The comparison archive writer must define its patch payload.');

  const readOnlyFields = comparison.fields
    .filter((field) => field.readOnly === true)
    .map((field) => field.name);
  for (const fieldName of readOnlyFields) {
    assert.doesNotMatch(setPayload, new RegExp(`\\b${fieldName}\\s*:`));
  }

  assert.match(setPayload, /status:\s*'parked'/);
  assert.match(writerSource, /state\.canonical\.status\s*!==\s*'live'/);
  assert.match(writerSource, /state\.canonical\.slug\s*!==\s*'daxxify-vs-botox'/);
});
