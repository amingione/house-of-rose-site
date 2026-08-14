import assert from 'node:assert/strict';
import test from 'node:test';

import { localArea } from '../packages/studio/schemas/localArea.ts';

function areaField(name: string) {
  return localArea.fields.find((field) => field.name === name);
}

test('direct public local-area text uses the shared public-copy guard', () => {
  for (const fieldName of ['city', 'region']) {
    const field = areaField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }

  const neighborhoods = areaField('neighborhoods');
  assert.ok(neighborhoods && 'of' in neighborhoods && Array.isArray(neighborhoods.of));
  assert.equal(typeof neighborhoods.of[0]?.validation, 'function');
  assert.match(String(neighborhoods.of[0]?.validation), /validatePublicCopy/);

  const image = areaField('image');
  assert.ok(image && 'fields' in image && Array.isArray(image.fields));
  const alt = image.fields.find((field) => field.name === 'alt');
  assert.equal(typeof alt?.validation, 'function');
  assert.match(String(alt?.validation), /validatePublicCopy/);
});

test('local-area prompts preserve the single-location boundary', () => {
  const city = areaField('city');
  const region = areaField('region');
  const neighborhoods = areaField('neighborhoods');

  assert.match(String(city?.description), /single Punta Gorda practice/i);
  assert.match(String(region?.description), /do not.*imply another.*location/i);
  assert.match(String(neighborhoods?.description), /not additional locations/i);
});
