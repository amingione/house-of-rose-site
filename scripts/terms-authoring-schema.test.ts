import assert from 'node:assert/strict';
import test from 'node:test';

import { termsOfService, validateTermsPublicCopy } from '../packages/studio/schemas/termsOfService.ts';

function termsField(name: string) {
  return termsOfService.fields.find((field) => field.name === name);
}

test('every directly published top-level Terms field uses the compliance-aware public-copy guard', () => {
  for (const fieldName of [
    'seoTitle',
    'seoDescription',
    'pageTitle',
    'effectiveDate',
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

test('legal negations remain valid while promotional guarantee language remains blocked', () => {
  assert.equal(validateTermsPublicCopy('Appointment availability is not guaranteed.'), true);
  assert.equal(validateTermsPublicCopy('Individual outcomes vary, and no result is guaranteed.'), true);
  assert.match(String(validateTermsPublicCopy('Guaranteed results.')), /remove retired or prohibited language/i);
});
