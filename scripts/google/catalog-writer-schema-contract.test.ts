import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { product } from '../../packages/studio/schemas/product.ts';

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerSource = readFileSync(
  new URL('../../packages/studio/scripts/migrate-google-catalog.mjs', import.meta.url),
  'utf8',
);
const setPayload = writerSource.match(/\n\s{4}set:\s*(\{[\s\S]*?\n\s{4}\}),\n\s{4}unset:/)?.[1];
const ledgerReconciliation = writerSource.match(
  /for \(const patch of patches\) \{([\s\S]*?)\n\}\nconst newAssignments/,
)?.[1];

test('the active catalog migration does not overwrite static read-only product fields', () => {
  assert.match(
    packageJson.scripts?.['google:catalog:apply'] ?? '',
    /migrate-google-catalog\.mjs[\s\S]*--apply/,
  );
  assert.ok(setPayload, 'The catalog migration must define its product set payload.');

  const staticReadOnlyFields = product.fields
    .filter((field) => field.readOnly === true)
    .map((field) => field.name);
  for (const fieldName of staticReadOnlyFields) {
    assert.doesNotMatch(setPayload, new RegExp(`\\b${fieldName}\\s*:`));
  }

  assert.match(setPayload, /brandRef:\s*\{\s*_type:\s*'reference'/);
});

test('the catalog migration never overwrites an existing immutable SKU', () => {
  const skuField = product.fields.find((field) => field.name === 'sku');
  assert.equal(typeof skuField?.readOnly, 'function');
  if (typeof skuField?.readOnly !== 'function') return;
  assert.equal(
    skuField.readOnly({ document: { _createdAt: '2026-08-14T00:00:00Z', sku: 'HOR-TEST-0001' } }),
    true,
  );

  assert.ok(setPayload, 'The catalog migration must define its product set payload.');
  assert.ok(ledgerReconciliation, 'The catalog migration must reconcile the reviewed SKU ledger.');
  assert.match(setPayload, /\.\.\.\(product\.sku \? \{\} : \{ sku: candidateSku \}\)/);
  assert.match(ledgerReconciliation, /patch\.existingSku !== assigned/);
  assert.match(ledgerReconciliation, /if \(!patch\.existingSku\) patch\.set\.sku = assigned/);
});
