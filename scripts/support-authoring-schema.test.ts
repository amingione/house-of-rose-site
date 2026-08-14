import assert from 'node:assert/strict';
import test from 'node:test';

import { supportPage } from '../packages/studio/schemas/supportPage.ts';

test('the disconnected Support singleton is preserved without presenting its fields as live controls', () => {
  const expectedFields = [
    'seoTitle',
    'seoDescription',
    'heroTitle',
    'heroDescription',
    'contactHeading',
    'contactIntro',
    'callTitle',
    'callBody',
    'callCta',
    'emailTitle',
    'emailBody',
    'emailCta',
    'bookingTitle',
    'bookingBody',
    'bookingCta',
    'faqHeading',
    'faqIntro',
    'faqs',
    'ctaHeading',
    'ctaBody',
    'ctaText',
  ];

  assert.deepEqual(supportPage.fields.map((field) => field.name), expectedFields);

  for (const field of supportPage.fields) {
    assert.equal(field.readOnly, true, `${field.name} must remain source-compatible but read-only.`);
    assert.match(String(field.title), /not published/i, `${field.name} must be labeled accurately.`);
    assert.match(String(field.description), /current \/support\/ route uses reviewed website content/i);
  }
});

test('Support Studio groups also state the current publication boundary', () => {
  for (const group of supportPage.groups ?? []) {
    assert.match(String(group.title), /not published/i);
  }
});
