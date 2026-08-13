import assert from 'node:assert/strict';
import test from 'node:test';

import { verifiedRnProviderName } from '../packages/web/src/lib/treatmentQueries.ts';

test('uses a referenced RN public name when the licence type is present', () => {
  assert.equal(
    verifiedRnProviderName(
      { _id: 'provider-diana', publicName: 'Diana Morrison, RN', profileSlug: 'diana' },
      'rn',
    ),
    'Diana Morrison, RN',
  );
});

test('does not name an RN when the public name lacks the licence type', () => {
  assert.equal(
    verifiedRnProviderName({ _id: 'provider-diana', publicName: 'Diana Morrison' }, 'rn'),
    undefined,
  );
});

test('does not use an RN identity for a different provider-scope preset', () => {
  assert.equal(
    verifiedRnProviderName({ _id: 'provider-diana', publicName: 'Diana Morrison, RN' }, 'esthetician'),
    undefined,
  );
});
