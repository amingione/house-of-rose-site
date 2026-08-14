import assert from 'node:assert/strict';
import test from 'node:test';

import { serviceCollection } from '../packages/studio/schemas/serviceCollection.ts';

function collectionField(name: string) {
  return serviceCollection.fields.find((field) => field.name === name);
}

test('the public collection title uses the shared public-copy guard', () => {
  const title = collectionField('title');

  assert.equal(typeof title?.validation, 'function');
  assert.match(String(title?.validation), /validatePublicCopy/);
  assert.match(String(title?.description), /public category name/i);
});

test('disconnected collection editorial fields are preserved but not presented as publishing controls', () => {
  const disconnectedFields = [
    'description',
    'presentation',
    'headline',
    'intro',
    'featuredServices',
    'customizationTitle',
    'customizationIntro',
    'customizations',
    'closingTitle',
    'closingBody',
  ];

  for (const fieldName of disconnectedFields) {
    const field = collectionField(fieldName);
    assert.equal(field?.readOnly, true, `${fieldName} must remain source-compatible but read-only.`);
    assert.match(String(field?.title), /not published/i, `${fieldName} must be labeled accurately.`);
    assert.match(String(field?.description), /(?:legacy|does not|instead|retained)/i);
  }
});
