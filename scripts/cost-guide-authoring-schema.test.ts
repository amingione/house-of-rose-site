import assert from 'node:assert/strict';
import test from 'node:test';

import { costGuide } from '../packages/studio/schemas/costGuide.ts';

const titleField = costGuide.fields.find(({ name }) => name === 'title');

test('the public cost-guide title is required and uses the shared public-copy guard', () => {
  assert.equal(typeof titleField?.validation, 'function', 'Cost-guide title must validate public copy.');
  assert.match(String(titleField.validation), /required/);
  assert.match(String(titleField.validation), /validatePublicCopy/);
  assert.match(String(titleField.description), /does not need to follow one fixed formula/i);

  let requiredCalls = 0;
  const rule = {
    required() {
      requiredCalls += 1;
      return this;
    },
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = titleField.validation(rule);

  assert.equal(requiredCalls, 1);
  assert.equal(validate('What Does Dermal Filler Cost?'), true);
  assert.equal(validate('Dermal Filler Pricing in Punta Gorda'), true);
  assert.match(String(validate('Premium Filler Transformation!')), /retired or prohibited/i);
});
