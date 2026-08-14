import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { homepage } from '../packages/studio/schemas/homepage.ts';

test('the locally reviewed homepage remains read-only in Studio without dropping stored fields', () => {
  assert.equal(homepage.readOnly, true);
  assert.match(String(homepage.title), /not published/i);
  assert.match(String(homepage.description), /current homepage uses reviewed website content/i);

  const fieldNames = new Set(homepage.fields.map((field) => field.name));
  for (const retainedField of ['seoTitle', 'heroTitle', 'serviceGroups', 'scanHeading', 'expHeading', 'finalHeading']) {
    assert.equal(fieldNames.has(retainedField), true, `${retainedField} must remain source-compatible.`);
  }

  for (const group of homepage.groups ?? []) {
    assert.match(String(group.title), /not published/i);
  }
});

test('the public homepage and editor mappings agree that Studio copy is disconnected', () => {
  const route = readFileSync(
    new URL('../packages/web/src/pages/index.astro', import.meta.url),
    'utf8',
  );
  const stackbit = readFileSync(new URL('../stackbit.config.ts', import.meta.url), 'utf8');
  const structure = readFileSync(
    new URL('../packages/studio/structure.ts', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(route, /HOMEPAGE_QUERY|sanityFetch/);
  assert.match(route, /const treatmentCategories = \[/);
  assert.match(stackbit, /homepage:\s*['"]\/['"]/);
  assert.match(structure, /schemaType\(['"]homepage['"]\)/);
});
