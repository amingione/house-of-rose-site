import assert from 'node:assert/strict';
import test from 'node:test';

import { thankYou } from '../packages/studio/schemas/thankYou.ts';

test('queried but disconnected Thank You copy is preserved without posing as a live control', () => {
  const expectedFields = [
    'seoTitle',
    'seoDescription',
    'kicker',
    'heading',
    'paragraph1',
    'paragraph2',
    'ctaPrimaryText',
    'ctaSecondaryText',
  ];

  assert.deepEqual(thankYou.fields.map((field) => field.name), expectedFields);

  for (const field of thankYou.fields) {
    assert.equal(field.readOnly, true, `${field.name} must remain source-compatible but read-only.`);
    assert.match(String(field.title), /not published/i, `${field.name} must be labeled accurately.`);
    assert.match(String(field.description), /current \/thank-you\/ route uses reviewed website content/i);
  }
});

test('Thank You Studio groups state the current publication boundary', () => {
  for (const group of thankYou.groups ?? []) {
    assert.match(String(group.title), /not published/i);
  }
});
