import assert from 'node:assert/strict';
import test from 'node:test';

import { service } from '../../packages/studio/schemas/service.ts';
import { validatePublicCopy } from '../../packages/studio/schemas/validation/publicCopy.ts';

type ValidationResult = {
  validate: (value: string | undefined, context: { parent?: unknown }) => true | string;
};

test('enabled GBP manifest copy is required and uses the explicit public-copy guard', () => {
  const googleBusinessProfile = service.fields.find(({ name }) => name === 'googleBusinessProfile');
  assert.ok(googleBusinessProfile && 'fields' in googleBusinessProfile);

  for (const fieldName of ['displayName', 'description']) {
    const field = googleBusinessProfile.fields.find(({ name }) => name === fieldName);
    assert.ok(field?.validation, `Missing ${fieldName} validation.`);

    const rule = {
      max() { return this; },
      custom(fn: typeof validatePublicCopy) { return { validate: fn }; },
    };
    const validations = field.validation(rule) as [unknown, ValidationResult];
    const validator = validations[1].validate;

    assert.match(String(validator(undefined, { parent: { enabled: true } })), /required/i);
    assert.equal(validator(undefined, { parent: { enabled: false } }), true);
    assert.equal(
      validator('Botox is listed at $14 per unit on the current menu.', { parent: { enabled: true } }),
      true,
    );
    assert.match(
      String(validator('A premium treatment with guaranteed results!', { parent: { enabled: true } })),
      /retired or prohibited/i,
    );
  }
});
