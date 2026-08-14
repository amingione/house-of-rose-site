import assert from 'node:assert/strict';
import test from 'node:test';

import { provider } from '../packages/studio/schemas/provider.ts';
import { PUBLIC_PROVIDERS_QUERY } from '../packages/web/src/lib/queries.ts';

function providerField(name: string) {
  return provider.fields.find((field) => field.name === name);
}

test('every provider text field that can reach a public profile uses the shared copy guard', () => {
  for (const fieldName of ['title', 'fullName', 'roleCredential', 'publicName', 'publicRole', 'summary']) {
    const field = providerField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }

  for (const fieldName of ['biography', 'serviceFocus']) {
    const field = providerField(fieldName);
    assert.ok(field && 'of' in field && Array.isArray(field.of), `${fieldName} must remain an array.`);
    const item = field.of[0];
    assert.equal(typeof item?.validation, 'function', `${fieldName} items must validate public copy.`);
    assert.match(String(item?.validation), /validatePublicCopy/);
  }

  const profileImage = providerField('profileImage');
  assert.ok(profileImage && 'fields' in profileImage && Array.isArray(profileImage.fields));
  const alt = profileImage.fields.find((field) => field.name === 'alt');
  assert.equal(typeof alt?.validation, 'function', 'Public profile-image alt text must validate public copy.');
  assert.match(String(alt?.validation), /validatePublicCopy/);
});

test('provider prompts support substantive profiles without a fixed process template', () => {
  const showOnWebsite = providerField('showOnWebsite');
  const summary = providerField('summary');
  const biography = providerField('biography');
  const serviceFocus = providerField('serviceFocus');

  assert.match(String(showOnWebsite?.description), /public profile route/i);
  assert.match(String(summary?.description), /enough verified context/i);
  assert.match(String(summary?.description), /process boilerplate/i);
  assert.match(String(biography?.description), /depth is welcome/i);
  assert.match(String(biography?.description), /do not force a fixed paragraph count/i);
  assert.match(String(serviceFocus?.description), /verified current public service labels/i);
});

test('public provider visibility requires the slug used by the public route query', () => {
  const slug = providerField('slug');
  assert.equal(typeof slug?.validation, 'function', 'Provider slug must validate public visibility.');
  assert.match(PUBLIC_PROVIDERS_QUERY, /showOnWebsite\s*==\s*true/);
  assert.match(PUBLIC_PROVIDERS_QUERY, /defined\(slug\.current\)/);

  let validate: ((value: { current?: string } | undefined, context: { document?: { showOnWebsite?: boolean } }) => true | string) | undefined;
  const rule = {
    custom(fn: typeof validate) {
      validate = fn;
      return this;
    },
  };
  slug.validation(rule);
  assert.ok(validate, 'Provider slug validation must expose a custom publication check.');

  assert.match(String(validate(undefined, { document: { showOnWebsite: true } })), /requires a slug/i);
  assert.equal(validate({ current: 'diana' }, { document: { showOnWebsite: true } }), true);
  assert.equal(validate(undefined, { document: { showOnWebsite: false } }), true);
});
