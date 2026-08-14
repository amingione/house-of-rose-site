import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { siteSettings } from '../packages/studio/schemas/siteSettings.ts';
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

  assert.equal(tagline?.readOnly, true);
  assert.match(String(tagline?.title), /not published/i);
  assert.match(String(tagline?.description), /do not use a CMS tagline/i);
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
  for (const fieldName of ['email', 'phone', 'address', 'instagramHandle']) {
    assert.notEqual(settingsField(fieldName)?.readOnly, true, `${fieldName} must remain editable.`);
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
