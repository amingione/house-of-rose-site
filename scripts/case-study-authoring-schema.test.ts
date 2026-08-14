import assert from 'node:assert/strict';
import test from 'node:test';

import { caseStudy } from '../packages/studio/schemas/caseStudy.ts';

test('directly published case-study copy uses the shared public-copy guard', () => {
  for (const fieldName of ['title', 'clientProfile', 'protocol', 'timeframe', 'outcome']) {
    const field = caseStudy.fields.find(({ name }) => name === fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }
});

test('case-study prompts require useful evidence without a promotional or process template', () => {
  const title = caseStudy.fields.find(({ name }) => name === 'title');
  const protocol = caseStudy.fields.find(({ name }) => name === 'protocol');
  const outcome = caseStudy.fields.find(({ name }) => name === 'outcome');

  assert.match(String(title?.description), /documented subject/i);
  assert.match(String(protocol?.description), /enough context/i);
  assert.match(String(protocol?.description), /do not narrate a generic treatment process/i);
  assert.match(String(outcome?.description), /observable documented change/i);
  assert.match(String(outcome?.description), /generic benefit line/i);
});
