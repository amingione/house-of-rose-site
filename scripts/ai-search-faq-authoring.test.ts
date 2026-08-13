import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { siteSettings } from '../packages/studio/schemas/siteSettings.ts';

const legacyFieldNames = [
  'aiSearchFaqHeading',
  'aiSearchFaqIntro',
  'aiSearchFaqs',
] as const;

test('legacy AI-search FAQ fields are retained but unavailable for Studio authoring', () => {
  for (const fieldName of legacyFieldNames) {
    const field = siteSettings.fields.find(({ name }) => name === fieldName);
    assert.ok(field, `Missing source-compatible ${fieldName} field.`);
    assert.equal(field.hidden, true, `${fieldName} remains visible to editors.`);
    assert.equal(field.readOnly, true, `${fieldName} remains editable.`);
    assert.match(String(field.description), /not published/i);
  }
});

test('the unused AI FAQ query cannot suggest a live publication path', async () => {
  const querySource = await readFile(
    new URL('../packages/web/src/lib/queries.ts', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(querySource, /AI_SEARCH_FAQ_QUERY|AiSearchFaqSection|CANONICAL_AI_FAQ_ANSWERS/);
});
