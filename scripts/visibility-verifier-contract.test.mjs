import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const verifier = readFileSync(
  new URL('./verify-visibility-plan.mjs', import.meta.url),
  'utf8',
);

test('visibility verification caps metadata without imposing padding', () => {
  assert.match(verifier, /description\.length > 160/);
  assert.doesNotMatch(verifier, /description\.length < \d+/);
  assert.doesNotMatch(verifier, /meta description is .*warning/i);
});
