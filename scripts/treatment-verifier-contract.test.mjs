import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const verifier = readFileSync(
  new URL('../packages/studio/scripts/verify-treatment-pages.mjs', import.meta.url),
  'utf8',
);
const renderer = readFileSync(
  new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
  'utf8',
);

test('the service verifier validates supplied provider scope without requiring it universally', () => {
  assert.doesNotMatch(verifier, /if\s*\(\s*!doc\.providerScope\s*\)/);
  assert.doesNotMatch(verifier, /Every live treatment must state who performs it/);

  assert.match(verifier, /const varianceNote = doc\.providerScope\?\.disclaimer\?\.trim\(\)/);
  assert.match(verifier, /if \(varianceNote &&/);
  assert.match(verifier, /doc\.providerScope\?\.medicalDirection/);
});

test('the public service renderer keeps provider scope and medical schema conditional', () => {
  assert.match(renderer, /const procedureSchema = service\.providerScope/);
  assert.match(renderer, /\{service\.providerScope && \(/);
});
