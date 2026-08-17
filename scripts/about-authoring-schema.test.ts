import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { aboutPage } from '../packages/studio/schemas/aboutPage.ts';
import { ABOUT_PAGE_QUERY } from '../packages/web/src/lib/queries.ts';

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

test('the About query and renderers expose only active singleton image controls', () => {
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
  const routes = [
    '../packages/web/src/pages/about/index.astro',
    '../packages/web/src/pages/about/hra.astro',
    '../packages/web/src/pages/about/providers/index.astro',
  ].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

  assert.match(ABOUT_PAGE_QUERY, /_type == "aboutPage" && _id == "aboutPage"/);
  for (const fieldName of ['indexImage', 'hraImage']) {
    assert.match(ABOUT_PAGE_QUERY, new RegExp(`"${fieldName}Url": ${fieldName}\\.asset->url`));
    assert.match(ABOUT_PAGE_QUERY, new RegExp(`"${fieldName}Alt": ${fieldName}\\.alt`));
  }

  for (const fieldName of disconnectedFields) {
    assert.doesNotMatch(ABOUT_PAGE_QUERY, new RegExp(`\\b${fieldName}\\b`));
    for (const route of routes) {
      assert.doesNotMatch(route, new RegExp(`content\\?\\.${fieldName}\\b`));
    }
  }
});
