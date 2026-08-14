import assert from 'node:assert/strict';
import test from 'node:test';

import { aboutPage } from '../packages/studio/schemas/aboutPage.ts';

function aboutField(name: string) {
  return aboutPage.fields.find((field) => field.name === name);
}

test('about copy and metadata replaced by reviewed website content are not editable publish controls', () => {
  const disconnectedFields = [
    'indexHeading',
    'indexIntro',
    'hraHeading',
    'hraIntro',
    'hraParagraphs',
    'providersHeading',
    'providersIntro',
    'indexSeo',
    'hraSeo',
    'providersSeo',
  ];

  for (const fieldName of disconnectedFields) {
    const field = aboutField(fieldName);
    assert.equal(field?.readOnly, true, `${fieldName} must remain source-compatible but read-only.`);
    assert.match(String(field?.title), /not published/i, `${fieldName} must be labeled accurately.`);
    assert.match(String(field?.description), /(?:legacy|does not publish)/i);
  }
});

test('published About image alt text uses the shared public-copy guard', () => {
  for (const fieldName of ['indexImage', 'hraImage']) {
    const field = aboutField(fieldName);
    assert.ok(field && 'fields' in field && Array.isArray(field.fields));
    assert.notEqual(field.readOnly, true, `${fieldName} must remain an active image control.`);

    const alt = field.fields.find((item) => item.name === 'alt');
    assert.equal(typeof alt?.validation, 'function');
    assert.match(String(alt?.validation), /validatePublicCopy/);
  }
});
