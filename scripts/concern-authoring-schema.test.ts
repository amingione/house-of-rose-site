import assert from 'node:assert/strict';
import test from 'node:test';

import { concern } from '../packages/studio/schemas/concern.ts';

function concernField(name: string) {
  return concern.fields.find((field) => field.name === name);
}

test('the rendered concern title uses the shared public-copy guard', () => {
  const title = concernField('title');

  assert.equal(typeof title?.validation, 'function');
  assert.match(String(title?.validation), /validatePublicCopy/);
  assert.match(String(title?.description), /public concern-guide name/i);
});

test('concern fields replaced by reviewed website content remain visible but are not editable publish controls', () => {
  for (const fieldName of ['intro', 'image', 'seo']) {
    const field = concernField(fieldName);
    assert.equal(field?.readOnly, true, `${fieldName} must remain source-compatible but read-only.`);
    assert.match(String(field?.title), /not published/i, `${fieldName} must be labeled accurately.`);
    assert.match(String(field?.description), /(?:legacy|do not render|generated)/i);
  }
});
