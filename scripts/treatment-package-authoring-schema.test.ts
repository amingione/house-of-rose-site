import assert from 'node:assert/strict';
import test from 'node:test';

import { treatmentPackage } from '../packages/studio/schemas/treatmentPackage.ts';

const titleField = treatmentPackage.fields.find(({ name }) => name === 'title');
const cadenceField = treatmentPackage.fields.find(({ name }) => name === 'cadence');
const rackPriceField = treatmentPackage.fields.find(({ name }) => name === 'rackPrice');
const imageField = treatmentPackage.fields.find(({ name }) => name === 'image');

test('the published package identity is required and uses the shared public-copy guard', () => {
  assert.equal(typeof titleField?.validation, 'function', 'Package title must validate public copy.');
  assert.match(String(titleField.validation), /required/);
  assert.match(String(titleField.validation), /validatePublicCopy/);

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
  assert.equal(validate('Face Reality 12-Week Program'), true);
  assert.match(String(validate('Premium Glow Transformation')), /retired or prohibited/i);
});

test('published package timing uses the shared guard without a process template', () => {
  assert.equal(typeof cadenceField?.validation, 'function', 'Package timing must validate public copy.');
  assert.match(String(cadenceField.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = cadenceField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('12 weeks, with an in-studio appointment every two weeks.'), true);
  assert.match(String(validate('A premium transformation over 12 weeks.')), /retired or prohibited/i);
});

test('published package price text uses the shared guard without locking a value', () => {
  assert.equal(typeof rackPriceField?.validation, 'function', 'Package price must validate public copy.');
  assert.match(String(rackPriceField.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = rackPriceField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('$899'), true);
  assert.equal(validate('$250–$850'), true);
  assert.match(String(validate('Premium package — $899!')), /retired or prohibited/i);
});

test('published package image alt text uses the shared public-copy guard', () => {
  assert.ok(imageField && 'fields' in imageField && Array.isArray(imageField.fields));
  const alt = imageField.fields.find(({ name }) => name === 'alt');
  assert.equal(typeof alt?.validation, 'function', 'Package image alt must validate public copy.');
  assert.match(String(alt.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = alt.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('Face Reality products used during the 12-week program.'), true);
  assert.match(String(validate('A flawless skin transformation.')), /retired or prohibited/i);
});
