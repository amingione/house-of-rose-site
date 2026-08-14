import assert from 'node:assert/strict';
import test from 'node:test';

import { treatmentPriceRange } from '../packages/studio/schemas/objects/treatmentBlocks.ts';

const noteField = treatmentPriceRange.fields.find(({ name }) => name === 'note');

test('the rendered treatment pricing note uses the shared public-copy guard', () => {
  assert.ok(noteField?.validation, 'Missing treatment pricing-note validation.');
  assert.match(String(noteField.validation), /validatePublicCopy/);
});

test('the pricing-note guard preserves useful facts and rejects retired positioning', () => {
  assert.ok(noteField?.validation, 'Missing treatment pricing-note validation.');

  const rule = {
    max(limit: number) {
      assert.equal(limit, 280);
      return this;
    },
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = noteField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('The total depends on the number of units used.'), true);
  assert.match(String(validate('Premium results at every appointment.')), /retired or prohibited/i);
});
