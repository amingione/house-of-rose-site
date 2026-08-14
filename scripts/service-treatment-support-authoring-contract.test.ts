import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentPageFields } from '../packages/studio/schemas/objects/treatmentPageFields.ts';
import { TREATMENT_PAGE_FIELDS } from '../packages/web/src/lib/treatmentQueries.ts';

function treatmentField(name: string) {
  return treatmentPageFields.find((field) => field.name === name);
}

test('stored recovery-support fields cannot pose as published service controls', () => {
  for (const fieldName of ['downtime', 'aftercare']) {
    const field = treatmentField(fieldName);
    assert.ok(field, `Missing treatment ${fieldName} field.`);
    assert.equal(field.readOnly, true);
    assert.match(String(field.title), /not published/i);
    assert.match(String(field.description), /source compatibility and clinical review/i);
    assert.match(String(field.description), /does not publish/i);
  }
});

test('the public treatment projection and renderer omit unreviewed recovery-support data', () => {
  assert.doesNotMatch(TREATMENT_PAGE_FIELDS, /\bdowntime\s*\{/);
  assert.doesNotMatch(TREATMENT_PAGE_FIELDS, /\baftercare\s*\{/);

  const renderer = readFileSync(
    new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(renderer, /service\.(?:downtime|aftercare)\b/);
  assert.match(renderer, /Recovery and aftercare are medical-support copy/);
  assert.match(renderer, /remain stored for review but do not render or enter structured data/);
});
