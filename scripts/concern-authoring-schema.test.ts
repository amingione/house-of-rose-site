import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { concern } from '../packages/studio/schemas/concern.ts';
import {
  ALL_CONCERNS_QUERY,
  ALL_CONCERN_SLUGS_QUERY,
  CONCERN_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const querySource = readFileSync(
  new URL('../packages/web/src/lib/queries.ts', import.meta.url),
  'utf8',
);
const concernRenderers = [
  '../packages/web/src/pages/concerns/index.astro',
  '../packages/web/src/pages/concerns/[slug].astro',
].map((relativePath) => readFileSync(new URL(relativePath, import.meta.url), 'utf8'));

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

test('public concern payloads exclude fields owned by reviewed website education', () => {
  const concernType = querySource.match(
    /export interface Concern \{([\s\S]*?)\n\}/,
  )?.[1];

  assert.ok(concernType);
  for (const activeField of ['_id', 'title', 'slug', 'treatments', 'comparisons']) {
    assert.match(concernType, new RegExp(`\\b${activeField}\\??:`));
  }
  for (const nonPublicField of ['intro', 'image', 'seo']) {
    assert.doesNotMatch(
      concernType,
      new RegExp(`\\b${nonPublicField}\\??:`),
      `${nonPublicField} must not remain in the public Concern type.`,
    );
  }

  assert.doesNotMatch(ALL_CONCERNS_QUERY, /\bintro\b|"image"\s*:|"seo"\s*:/);
  const concernIdentityProjection = CONCERN_BY_SLUG_QUERY.split('"treatments":')[0];
  assert.doesNotMatch(concernIdentityProjection, /\bintro\b|"image"\s*:|"seo"\s*:/);

  for (const renderer of concernRenderers) {
    assert.match(renderer, /getConcernEducation/);
    assert.doesNotMatch(renderer, /concern(?:Data)?\.(?:intro|image|seo)\b/);
  }
});

test('only the schema public status can generate or enter public concern routes', () => {
  const status = concernField('status');
  assert.ok(status && 'options' in status && Array.isArray(status.options?.list));
  assert.deepEqual(
    status.options.list.map((option) => option.value),
    ['live', 'parked'],
  );
  assert.equal(
    status.initialValue,
    'parked',
    'A new concern must require an affirmative decision before it can publish.',
  );

  for (const query of [ALL_CONCERNS_QUERY, CONCERN_BY_SLUG_QUERY, ALL_CONCERN_SLUGS_QUERY]) {
    assert.match(query, /_type == "concern" && status == "live"/);
    assert.doesNotMatch(query, /status != "parked"/);
  }

  const serviceRoute = readFileSync(
    new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(serviceRoute, /SERVICE_BY_SLUG_QUERY|sanityFetch<Service/);
});

test('concern inventories and linked treatments require generated route slugs', () => {
  const slug = concernField('slug');
  assert.match(String(slug?.validation), /required/);

  for (const query of [ALL_CONCERNS_QUERY, ALL_CONCERN_SLUGS_QUERY]) {
    assert.match(
      query,
      /_type == "concern" && status == "live" && defined\(slug\.current\)/,
      'Every public concern inventory must reject records without a route slug.',
    );
  }

  assert.doesNotMatch(CONCERN_BY_SLUG_QUERY, /_type == "service"|"treatments":/);
  const detailRenderer = concernRenderers[1] ?? '';
  assert.match(detailRenderer, /getPublicServicesForConcern/);
});
