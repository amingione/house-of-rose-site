import assert from 'node:assert/strict';
import test from 'node:test';

import { treatmentPriceRange } from '../packages/studio/schemas/objects/treatmentBlocks.ts';
import { service, validatePublicServicePrice } from '../packages/studio/schemas/service.ts';

const noteField = treatmentPriceRange.fields.find(({ name }) => name === 'note');
const maxPriceField = treatmentPriceRange.fields.find(({ name }) => name === 'maxPrice');
const servicePriceField = service.fields.find(({ name }) => name === 'price');

test('service price authoring rejects starting-price euphemisms without replacing the shared copy guard', () => {
  assert.ok(servicePriceField?.validation, 'Missing service-price validation.');
  assert.match(servicePriceField.description ?? '', /exact amount or explicit range/i);
  assert.doesNotMatch(servicePriceField.description ?? '', /starting[- ]at|\bfrom\b|investment/i);
  assert.match(String(servicePriceField.validation), /validatePublicServicePrice/);
  assert.match(String(servicePriceField.validation), /validatePublicCopy/);

  const validators: Array<(value: string | undefined) => true | string> = [];
  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      validators.push(fn);
      return this;
    },
  };
  servicePriceField.validation(rule);
  assert.equal(validators.length, 2, 'Service price must retain the shared guard plus its price-format guard.');
  assert.match(String(validators[0]('Premium pricing')), /retired or prohibited/i);

  assert.equal(validatePublicServicePrice(undefined), true);
  assert.equal(validatePublicServicePrice('$399'), true);
  assert.equal(validatePublicServicePrice('$399–$499'), true);
  assert.match(String(validatePublicServicePrice('From $399')), /verified amount or explicit range/i);
  assert.match(String(validatePublicServicePrice(' Starting at $399')), /verified amount or explicit range/i);
  assert.match(String(validatePublicServicePrice('Investment: $399')), /verified amount or explicit range/i);
});

test('price-range authoring describes and previews a single value as an exact price', () => {
  assert.match(maxPriceField?.description ?? '', /one exact price/i);
  assert.doesNotMatch(maxPriceField?.description ?? '', /starting[- ]at|\bfrom\b|investment/i);

  const prepare = treatmentPriceRange.preview?.prepare;
  assert.ok(prepare, 'Missing treatment price-range preview.');
  assert.equal(prepare({ min: 399, unit: 'session' }).title, '$399');
  assert.equal(prepare({ min: 399, max: 499, unit: 'session' }).title, '$399–$499');
});

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
