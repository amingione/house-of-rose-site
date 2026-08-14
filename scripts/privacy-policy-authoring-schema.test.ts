import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { privacyPolicy } from '../packages/studio/schemas/privacyPolicy.ts';

const structureSource = readFileSync(
  new URL('../packages/studio/structure.ts', import.meta.url),
  'utf8',
);
const routeSource = readFileSync(
  new URL('../packages/web/src/pages/privacy-policy.astro', import.meta.url),
  'utf8',
);

function privacyField(name: string) {
  return privacyPolicy.fields.find((field) => field.name === name);
}

test('directly rendered Privacy Policy copy uses the shared public-copy guard', () => {
  for (const fieldName of ['seoTitle', 'seoDescription', 'pageTitle', 'intro']) {
    const field = privacyField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }

  const sections = privacyField('sections');
  assert.ok(sections && 'of' in sections && Array.isArray(sections.of));
  const item = sections.of[0];
  assert.ok(item && 'fields' in item && Array.isArray(item.fields));
  const nestedFields = item.fields as Array<{ name?: string; validation?: unknown }>;

  for (const fieldName of ['heading', 'body']) {
    const field = nestedFields.find((candidate) => candidate.name === fieldName);
    assert.equal(typeof field?.validation, 'function');
    assert.match(String(field?.validation), /validatePublicCopy/);
  }
});

test('the overridden Privacy Policy update date is preserved without posing as a live control', () => {
  const lastUpdated = privacyField('lastUpdated');

  assert.equal(lastUpdated?.readOnly, true);
  assert.match(String(lastUpdated?.title), /not published/i);
  assert.match(String(lastUpdated?.description), /reviewed effective update date/i);
});

test('the public policy resolves only from the canonical Studio singleton', () => {
  const canonicalId = structureSource.match(
    /schemaType\('privacyPolicy'\)\.documentId\('([^']+)'\)/,
  )?.[1];
  assert.ok(canonicalId, 'Studio structure must define the Privacy Policy singleton ID.');
  assert.deepEqual(privacyPolicy.__experimental_actions, ['update', 'publish']);

  const query = routeSource.match(/const PRIVACY_POLICY_QUERY = \/\* groq \*\/ `([\s\S]*?)`;/)?.[1];
  assert.ok(query, 'The Privacy Policy route must define its Sanity query.');
  assert.match(query, new RegExp(`_id == "${canonicalId}"`));
  assert.doesNotMatch(query, /\*\[_type == "privacyPolicy"\]\[0\]/);
});
