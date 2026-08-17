import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const writer = readFileSync(
  new URL('../packages/studio/scripts/create-waxing-hub.mjs', import.meta.url),
  'utf8',
);

test('the Waxing hierarchy writer fails closed on unroutable relationships', () => {
  assert.match(writer, /PUBLIC_CHILD_STATUSES = new Set\(\['live', 'actual-menu'\]\)/);
  assert.match(writer, /!current\.collection\.slug/);
  assert.match(writer, /!PUBLIC_CHILD_STATUSES\.has\(child\.status\) \|\| !child\.slug/);

  const relationshipGuard = writer.indexOf('const unroutableChildren');
  const dryRunBoundary = writer.indexOf('if (!apply)');
  const transaction = writer.indexOf('const transaction = client');

  assert.ok(relationshipGuard >= 0);
  assert.ok(relationshipGuard < dryRunBoundary, 'Relationship validation must run during dry validation.');
  assert.ok(relationshipGuard < transaction, 'Relationship validation must run before mutations.');
});
