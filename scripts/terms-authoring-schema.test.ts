import assert from 'node:assert/strict';
import test from 'node:test';

import {
  termsOfService,
  validateTermsEffectiveDate,
  validateTermsPublicCopy,
} from '../packages/studio/schemas/termsOfService.ts';

function termsField(name: string) {
  return termsOfService.fields.find((field) => field.name === name);
}

test('every directly published top-level Terms field uses the compliance-aware public-copy guard', () => {
  for (const fieldName of [
    'seoTitle',
    'seoDescription',
    'pageTitle',
    'intro',
    'shippingPolicy',
    'returnPolicy',
  ]) {
    const field = termsField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validateTermsPublicCopy/);
    assert.notEqual(field?.readOnly, true, `${fieldName} remains a live legal-content control.`);
  }

  const sections = termsField('sections');
  assert.ok(sections && 'of' in sections && Array.isArray(sections.of));
  const item = sections.of[0];
  assert.ok(item && 'fields' in item && Array.isArray(item.fields));
  const nestedFields = item.fields as Array<{ name?: string; validation?: unknown }>;

  for (const fieldName of ['heading', 'body']) {
    const field = nestedFields.find((candidate) => candidate.name === fieldName);
    assert.equal(typeof field?.validation, 'function');
    assert.match(String(field?.validation), /validateTermsPublicCopy/);
  }
});

test('the published legal effective date is optional, format-safe, and calendar-valid', () => {
  const effectiveDate = termsField('effectiveDate');
  assert.equal(typeof effectiveDate?.validation, 'function');
  assert.match(String(effectiveDate?.description), /Effective July 11, 2026/);

  let customCalls = 0;
  const validatedRule = { kind: 'terms-effective-date' };
  const rule = {
    custom(receivedValidator: unknown) {
      customCalls += 1;
      assert.equal(receivedValidator, validateTermsEffectiveDate);
      return validatedRule;
    },
    required() {
      assert.fail('The Terms effective date must remain optional while the fallback is active.');
    },
  };

  assert.equal(effectiveDate.validation(rule), validatedRule);
  assert.equal(customCalls, 1);

  for (const value of [
    undefined,
    '',
    '   ',
    'Effective July 11, 2026',
    'Effective July 11, 2026.',
    'Effective February 29, 2028',
  ]) {
    assert.equal(validateTermsEffectiveDate(value), true, `${String(value)} should be accepted.`);
  }

  for (const value of [
    'Coming soon',
    'July 11, 2026',
    'Effective 2026-07-11',
    'Effective February 29, 2026',
    'Effective February 30, 2026',
    'Effective April 31, 2026',
  ]) {
    assert.notEqual(validateTermsEffectiveDate(value), true, `${value} should be rejected.`);
  }

  assert.match(
    String(validateTermsEffectiveDate('Effective Guaranteed results, 2026')),
    /remove retired or prohibited language/i,
  );
});

test('legal negations remain valid while promotional guarantee language remains blocked', () => {
  assert.equal(validateTermsPublicCopy('Appointment availability is not guaranteed.'), true);
  assert.equal(validateTermsPublicCopy('Individual outcomes vary, and no result is guaranteed.'), true);
  assert.match(String(validateTermsPublicCopy('Guaranteed results.')), /remove retired or prohibited language/i);
});
