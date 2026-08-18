import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  siteSettings,
  validateInstagramHandle,
  validatePublicAddress,
  validatePublicPhone,
} from '../packages/studio/schemas/siteSettings.ts';
import { SITE_SETTINGS_QUERY } from '../packages/web/src/lib/queries.ts';

const structureSource = readFileSync(
  new URL('../packages/studio/structure.ts', import.meta.url),
  'utf8',
);

function settingsField(name: string) {
  return siteSettings.fields.find((field) => field.name === name);
}

test('sitewide public brand text uses the shared public-copy guard', () => {
  for (const fieldName of ['siteName', 'description']) {
    const field = settingsField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }

  assert.match(String(settingsField('siteName')?.description), /site entity graph/i);
  assert.match(String(settingsField('description')?.description), /useful detail is welcome/i);
});

test('the archival tagline cannot pose as a live sitewide control', () => {
  const tagline = settingsField('tagline');
  const layout = readFileSync(
    new URL('../packages/web/src/layouts/BaseLayout.astro', import.meta.url),
    'utf8',
  );

  assert.equal(tagline?.readOnly, true);
  assert.match(String(tagline?.title), /not published/i);
  assert.match(String(tagline?.description), /do not use a CMS tagline/i);
  assert.doesNotMatch(SITE_SETTINGS_QUERY, /\btagline\b/);
  assert.doesNotMatch(layout, /settings(?:\?\.|\.)tagline/);
});

test('stored brand images cannot pose as the website asset authority', () => {
  for (const fieldName of ['logo', 'socialImage']) {
    const field = settingsField(fieldName);
    assert.equal(field?.readOnly, true);
    assert.match(String(field?.title), /not published/i);
    assert.match(String(field?.description), /reviewed local/i);
  }

  assert.doesNotMatch(SITE_SETTINGS_QUERY, /\b(?:logo|socialImage|image)\s*\{/);

  const layout = readFileSync(
    new URL('../packages/web/src/layouts/BaseLayout.astro', import.meta.url),
    'utf8',
  );
  assert.match(layout, /defaultOgImage\s*=\s*new URL\('\/images\/socialShareCover\//);
  assert.doesNotMatch(layout, /settings\?\.(?:logo|socialImage)/);

  const structuredData = readFileSync(
    new URL('../packages/web/src/lib/structuredData.ts', import.meta.url),
    'utf8',
  );
  assert.match(structuredData, /new URL\('\/logos\/hr-monogram-2026\/monogram-gold-512\.png'/);
});

test('canonical contact and NAP fields remain operational', () => {
  for (const fieldName of ['email', 'phone', 'supportPhone', 'address', 'instagramHandle']) {
    assert.notEqual(settingsField(fieldName)?.readOnly, true, `${fieldName} must remain editable.`);
  }
});

test('public NAP and social controls reject malformed values without becoming required', () => {
  for (const [fieldName, validator] of [
    ['phone', validatePublicPhone],
    ['supportPhone', validatePublicPhone],
    ['address', validatePublicAddress],
    ['instagramHandle', validateInstagramHandle],
  ] as const) {
    const field = settingsField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate its public format.`);

    let customCalls = 0;
    const validatedRule = { fieldName };
    const rule = {
      custom(receivedValidator: unknown) {
        customCalls += 1;
        assert.equal(receivedValidator, validator, `${fieldName} must use its semantic validator.`);
        return validatedRule;
      },
      required() {
        assert.fail(`${fieldName} must remain optional.`);
      },
    };

    assert.equal(field.validation(rule), validatedRule);
    assert.equal(customCalls, 1);
  }

  for (const empty of [undefined, '', '   ']) {
    assert.equal(validatePublicPhone(empty), true);
    assert.equal(validatePublicAddress(empty), true);
    assert.equal(validateInstagramHandle(empty), true);
  }

  for (const phone of ['(941) 400-0165', '+1 941.400.0165', '941-400-0165', '(844) 941-7673']) {
    assert.equal(validatePublicPhone(phone), true, `${phone} should be accepted.`);
  }
  for (const phone of ['941-400-016', '+44 20 7946 0958', 'call 941-400-0165']) {
    assert.notEqual(validatePublicPhone(phone), true, `${phone} should be rejected.`);
  }

  for (const address of [
    '525 E Olympia Ave, Unit 9\nPunta Gorda, FL 33950',
    '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
    '100 Main St, Port Charlotte, FL 33952-1234',
  ]) {
    assert.equal(validatePublicAddress(address), true, `${address} should be accepted.`);
  }
  for (const address of ['525 E Olympia Ave', 'Punta Gorda, Florida', 'Punta Gorda, FL']) {
    assert.notEqual(validatePublicAddress(address), true, `${address} should be rejected.`);
  }

  for (const handle of ['house.of.rose.aesthetics', 'house_of_rose', 'houseofrose']) {
    assert.equal(validateInstagramHandle(handle), true, `${handle} should be accepted.`);
  }
  for (const handle of [
    '@house.of.rose.aesthetics',
    'https://instagram.com/houseofrose',
    'house of rose',
    '.',
    'name..part',
    'name.',
  ]) {
    assert.notEqual(validateInstagramHandle(handle), true, `${handle} should be rejected.`);
  }
});

test('the deployment-owned booking alias cannot pose as a live Studio control', () => {
  const bookingEmail = settingsField('bookingEmail');
  assert.equal(bookingEmail?.readOnly, true);
  assert.match(String(bookingEmail?.title), /not published/i);
  assert.match(String(bookingEmail?.description), /PUBLIC_BOOKING_EMAIL/);
  assert.doesNotMatch(SITE_SETTINGS_QUERY, /\bbookingEmail\b/);

  const rentalRoute = readFileSync(
    new URL('../packages/web/src/pages/rent-a-room.astro', import.meta.url),
    'utf8',
  );
  assert.match(rentalRoute, /import\.meta\.env\.PUBLIC_BOOKING_EMAIL/);
  assert.doesNotMatch(rentalRoute, /SITE_SETTINGS_QUERY/);
});

test('the sitewide structured-data email is format-validated without becoming required', () => {
  const email = settingsField('email');
  assert.equal(typeof email?.validation, 'function', 'email must carry format validation.');
  assert.match(String(email?.description), /sitewide entity graph/i);

  let emailRuleCalls = 0;
  const validatedRule = { kind: 'email-rule' };
  const rule = {
    email() {
      emailRuleCalls += 1;
      return validatedRule;
    },
    required() {
      assert.fail('The public business email must remain optional.');
    },
  };

  assert.equal(email.validation(rule), validatedRule);
  assert.equal(emailRuleCalls, 1);
});

test('sitewide public data resolves only from the canonical Studio singleton', () => {
  const canonicalId = structureSource.match(
    /schemaType\('siteSettings'\)[\s\S]*?\.documentId\('([^']+)'\)/,
  )?.[1];
  assert.ok(canonicalId, 'Studio structure must define the Site Settings singleton ID.');
  assert.deepEqual(siteSettings.__experimental_actions, ['update', 'publish']);
  assert.match(SITE_SETTINGS_QUERY, new RegExp(`_id == "${canonicalId}"`));
  assert.doesNotMatch(SITE_SETTINGS_QUERY, /\*\[_type == "siteSettings"\]\[0\]/);
});
