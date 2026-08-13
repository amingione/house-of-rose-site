import assert from 'node:assert/strict';
import test from 'node:test';

import {
  alignPublicChannelCopy,
  findPublicCopyRisks,
} from '../packages/web/src/lib/publicCopy.ts';

test('normalizes only the exact legal entity name', () => {
  assert.equal(
    alignPublicChannelCopy('House of Rose LLC'),
    'House of Rose Aesthetics LLC',
  );
});

test('does not silently change CTAs, visit policy, or geography', () => {
  const source =
    'Call or text. Walk-ins are welcome. Clients visit from Port Charlotte and North Port.';

  assert.equal(alignPublicChannelCopy(source), source);
});

test('reports an unsupported treatment phrase without sanitizing it', () => {
  const source = 'Ask about our stem-cell treatment.';
  const risks = findPublicCopyRisks(source);

  assert.equal(alignPublicChannelCopy(source), source);
  assert.deepEqual(risks.map(({ code }) => code), ['unsupported-treatment-review']);
});
