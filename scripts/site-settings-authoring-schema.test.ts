import assert from 'node:assert/strict';
import test from 'node:test';

import { siteSettings } from '../packages/studio/schemas/siteSettings.ts';

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

test('canonical contact and NAP fields remain operational', () => {
  for (const fieldName of ['email', 'phone', 'address', 'instagramHandle', 'bookingEmail']) {
    assert.notEqual(settingsField(fieldName)?.readOnly, true, `${fieldName} must remain editable.`);
  }
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
