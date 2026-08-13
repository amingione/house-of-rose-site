import assert from 'node:assert/strict';
import test from 'node:test';

import { treatmentProviderScope } from '../packages/studio/schemas/objects/treatmentBlocks.ts';

const disclaimerField = treatmentProviderScope.fields.find(({ name }) => name === 'disclaimer');

test('provider scope does not prefill the retired disclaimer cadence', () => {
  assert.ok(disclaimerField, 'Missing provider-scope variance field.');
  assert.equal(disclaimerField.initialValue, undefined);
});

test('provider scope accepts a concise variance note and rejects old boilerplate', () => {
  assert.ok(disclaimerField?.validation, 'Missing provider-scope variance validation.');
  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = disclaimerField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('Individual outcomes vary.'), true);
  assert.equal(
    validate('Individual outcomes vary. A consultation is required before treatment because this is a medically directed service.'),
    true,
  );
  assert.match(
    String(validate('Individual results vary. Candidacy is determined at consultation.')),
    /retired candidacy\/consultation boilerplate/i,
  );
  assert.match(
    String(validate('This page is general information and is not medical advice.')),
    /generic medical-advice boilerplate/i,
  );
  assert.match(String(validate('Ask the practice for details.')), /must state/i);
});
