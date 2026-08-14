import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { localArea } from '../packages/studio/schemas/localArea.ts';
import { LOCAL_AREA_BY_SLUG_QUERY } from '../packages/web/src/lib/queries.ts';

const contentModelMap = readFileSync(
  new URL('../docs/CONTENT-MODEL-MAP.md', import.meta.url),
  'utf8',
);
const areaRoute = readFileSync(
  new URL('../packages/web/src/pages/areas/[slug].astro', import.meta.url),
  'utf8',
);

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

test('featured service links can resolve only to generated public service routes', () => {
  const servedServices = areaField('servedServices');
  assert.ok(servedServices && 'of' in servedServices && Array.isArray(servedServices.of));
  const reference = servedServices.of[0];
  assert.ok(reference && 'options' in reference);
  const authoringFilter = String(reference.options?.filter);

  assert.match(authoringFilter, /status in \["live", "actual-menu"\]/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(LOCAL_AREA_BY_SLUG_QUERY, /servedServices\[[\s\S]*?@->status in \["live", "actual-menu"\]/);
  assert.match(LOCAL_AREA_BY_SLUG_QUERY, /servedServices\[[\s\S]*?defined\(@->slug\.current\)/);
});

test('the content model distinguishes active area facts from legacy CMS prose', () => {
  const areaContract = contentModelMap.match(
    /### 5\. Local authority page([\s\S]*?)\n### 6\. Before\/after \/ proof page/,
  )?.[1];

  assert.ok(areaContract, 'The content map must retain an inspectable local-area contract.');
  assert.match(areaContract, /Active CMS inputs/i);
  for (const activeInput of [
    'slug',
    'city',
    'region',
    'servedServices',
    'neighborhoods',
    'image',
    'orderRank',
  ]) {
    assert.match(areaContract, new RegExp(activeInput, 'i'));
  }
  assert.match(areaContract, /reviewed area inventory/i);
  assert.match(areaContract, /generates public location\s+copy, FAQs, and metadata/i);
  assert.match(areaContract, /Legacy source fields/i);
  assert.match(areaContract, /read-only in\s+Studio and are not public copy authority/i);

  for (const legacyField of ['intro', 'whyLocal', 'faqs', 'seo']) {
    assert.equal(areaField(legacyField)?.readOnly, true, `${legacyField} must remain read-only.`);
    assert.doesNotMatch(areaRoute, new RegExp(`area\\.${legacyField}\\b`));
  }
  assert.match(areaRoute, /const localIntro =/);
  assert.match(areaRoute, /const localFaqs =/);
});
