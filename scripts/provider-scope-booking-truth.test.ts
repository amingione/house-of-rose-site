import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentProviderScope } from '../packages/studio/schemas/objects/treatmentBlocks.ts';

const consultationField = treatmentProviderScope.fields.find(({ name }) => name === 'consultRequired');
const publicProjection = readFileSync(
  new URL('../packages/web/src/lib/treatmentQueries.ts', import.meta.url),
  'utf8',
);
const activePrfWriter = readFileSync(
  new URL('../packages/studio/scripts/patch-prf-injections-provider-scope.mjs', import.meta.url),
  'utf8',
);

test('legacy consultation flag cannot pose as public booking truth', () => {
  assert.ok(consultationField, 'The stored legacy field should remain available for existing records.');
  assert.equal(consultationField.readOnly, true);
  assert.equal(consultationField.initialValue, undefined);
  assert.match(String(consultationField.title), /legacy.*not published/i);
  assert.match(String(consultationField.description), /booking mode and verified booking URL/i);
  assert.doesNotMatch(publicProjection, /consultRequired/);
  assert.doesNotMatch(activePrfWriter, /consultRequired/);
});
