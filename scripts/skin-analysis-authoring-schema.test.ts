import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { skinAnalysis } from '../packages/studio/schemas/skinAnalysis.ts';

test('the disconnected Skin Analysis singleton is read-only while preserving stored fields', () => {
  assert.equal(skinAnalysis.readOnly, true);
  assert.match(String(skinAnalysis.title), /not published/i);
  assert.match(String(skinAnalysis.description), /current \/skin-analysis\/ route uses reviewed website content/i);

  const fieldNames = new Set(skinAnalysis.fields.map((field) => field.name));
  for (const retainedField of ['seoTitle', 'heroTitle', 'steps', 'concernLinks', 'faqs', 'ctaHeading']) {
    assert.equal(fieldNames.has(retainedField), true, `${retainedField} must remain source-compatible.`);
  }

  for (const group of skinAnalysis.groups ?? []) {
    assert.match(String(group.title), /not published/i);
  }
});

test('the public Skin Analysis route uses local reviewed content, not the Studio singleton', () => {
  const route = readFileSync(
    new URL('../packages/web/src/pages/skin-analysis.astro', import.meta.url),
    'utf8',
  );
  const stackbit = readFileSync(new URL('../stackbit.config.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(route, /skinAnalysis|sanityFetch|SKIN_ANALYSIS_QUERY/);
  assert.match(stackbit, /skinAnalysis:\s*['"]\/skin-analysis['"]/);
});
