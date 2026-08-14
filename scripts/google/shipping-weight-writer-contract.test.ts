import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { product } from '../../packages/studio/schemas/product.ts';

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerSource = readFileSync(
  new URL('../../packages/studio/scripts/apply-researched-shipping-weights.mjs', import.meta.url),
  'utf8',
);
const evidencePayload = writerSource.match(
  /shippingWeightEvidence:\s*(\{[\s\S]*?\n\s{6}\}),\n\s{4}\},/,
)?.[1];

test('shipping-weight reconciliation compares and patches the complete evidence object', () => {
  assert.match(
    packageJson.scripts?.['google:catalog:weights:apply'] ?? '',
    /apply-researched-shipping-weights\.mjs[\s\S]*--apply/,
  );

  const evidenceField = product.fields.find((field) => field.name === 'shippingWeightEvidence');
  const evidenceFields = evidenceField && 'fields' in evidenceField
    ? evidenceField.fields.map((field) => field.name)
    : [];
  assert.ok(evidenceFields.length > 0, 'Product schema must define shipping-weight evidence fields.');
  assert.ok(evidencePayload, 'The shipping-weight writer must define its evidence payload.');
  for (const fieldName of evidenceFields) {
    assert.match(evidencePayload, new RegExp(`\\b${fieldName}\\s*:`));
  }

  assert.match(
    writerSource,
    /isDeepStrictEqual\(product\.shippingWeightEvidence, set\.shippingWeightEvidence\)/,
  );
  assert.match(writerSource, /for \(const \{ product, set \} of pendingPatches\)/);
  assert.match(writerSource, /toApply:\s*pendingPatches\.length/);
});
