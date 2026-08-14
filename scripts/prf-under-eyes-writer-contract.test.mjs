import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const writer = readFileSync(
  new URL('../packages/studio/scripts/create-prf-under-eyes.mjs', import.meta.url),
  'utf8',
);

test('the PRF Under Eyes creator verifies its canonical public parent before creation', () => {
  assert.match(writer, /const PARENT_SERVICE_SLUG = 'prf';/);
  assert.match(writer, /const PUBLIC_SERVICE_STATUSES = new Set\(\['live', 'actual-menu'\]\);/);
  assert.match(writer, /parentService:\s*\{[^}]*_ref:\s*PARENT_SERVICE_ID[^}]*\}/);
  assert.match(writer, /_type == "service" && _id == \$id/);
  assert.match(writer, /parentService\.slug !== PARENT_SERVICE_SLUG/);
  assert.match(writer, /parentService\.kind !== 'hub'/);
  assert.match(writer, /!PUBLIC_SERVICE_STATUSES\.has\(parentService\.status\)/);

  const preflightIndex = writer.indexOf('const parentService = await client.fetch');
  const dryRunIndex = writer.indexOf('if (!apply)', preflightIndex);
  const createIndex = writer.indexOf('client.create(document)');

  assert.ok(preflightIndex > -1, 'The writer must fetch the canonical parent service.');
  assert.ok(dryRunIndex > preflightIndex, 'Dry-run validation must follow the parent preflight.');
  assert.ok(createIndex > dryRunIndex, 'Document creation must follow the parent preflight.');
});

test('the existing-record reconciliation path remains non-creative', () => {
  const existingExitIndex = writer.indexOf("action: 'exists'");
  const preflightIndex = writer.indexOf('const parentService = await client.fetch');

  assert.ok(existingExitIndex > -1);
  assert.ok(
    existingExitIndex < preflightIndex,
    'An existing record must exit before the create-only relationship preflight.',
  );
  assert.match(writer, /client\.patch\(existing\._id\)\.unset\(\['price'\]\)/);
});
