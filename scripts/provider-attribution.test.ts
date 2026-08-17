import assert from 'node:assert/strict';
import test from 'node:test';

import { verifiedProviderIdentity } from '../packages/web/src/lib/treatmentQueries.ts';

test('uses a referenced RN public name when the licence type is present', () => {
  assert.deepEqual(
    verifiedProviderIdentity(
      { _id: 'provider-diana', publicName: 'Diana Morrison, RN', profileSlug: 'diana' },
      'rn',
    ),
    { publicName: 'Diana Morrison, RN', profileSlug: 'diana' },
  );
});

test('uses reviewed esthetician identities when a partial Sanity record lacks public fields', () => {
  assert.deepEqual(
    verifiedProviderIdentity({ _id: 'provider-brandy' }, 'esthetician'),
    { publicName: 'Brandy, Licensed Esthetician', profileSlug: 'brandy' },
  );
});

test('uses the reviewed licensed-esthetician form for Amber', () => {
  assert.deepEqual(
    verifiedProviderIdentity(
      { _id: 'provider-amber', publicName: 'Amber Mingione, Esthetician', profileSlug: 'amber' },
      'esthetician',
    ),
    { publicName: 'Amber Mingione, Licensed Esthetician', profileSlug: 'amber' },
  );
});

test('does not use a verified identity for a different provider-scope preset', () => {
  assert.equal(
    verifiedProviderIdentity({ _id: 'provider-diana', publicName: 'Diana Morrison, RN' }, 'esthetician'),
    undefined,
  );
});

test('does not name an unfamiliar provider without a matching licence-bearing public name', () => {
  assert.equal(
    verifiedProviderIdentity({ _id: 'provider-unknown', publicName: 'Taylor Provider' }, 'rn'),
    undefined,
  );
});
