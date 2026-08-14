import assert from 'node:assert/strict';
import test from 'node:test';

import { costGuide } from '../packages/studio/schemas/costGuide.ts';
import {
  ALL_COST_GUIDES_QUERY,
  COST_GUIDE_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const titleField = costGuide.fields.find(({ name }) => name === 'title');
const treatmentField = costGuide.fields.find(({ name }) => name === 'treatment') as
  | { options?: { filter?: string }; description?: string }
  | undefined;

test('the public cost-guide title is required and uses the shared public-copy guard', () => {
  assert.equal(typeof titleField?.validation, 'function', 'Cost-guide title must validate public copy.');
  assert.match(String(titleField.validation), /required/);
  assert.match(String(titleField.validation), /validatePublicCopy/);
  assert.match(String(titleField.description), /does not need to follow one fixed formula/i);

  let requiredCalls = 0;
  const rule = {
    required() {
      requiredCalls += 1;
      return this;
    },
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = titleField.validation(rule);

  assert.equal(requiredCalls, 1);
  assert.equal(validate('What Does Dermal Filler Cost?'), true);
  assert.equal(validate('Dermal Filler Pricing in Punta Gorda'), true);
  assert.match(String(validate('Premium Filler Transformation!')), /retired or prohibited/i);
});

test('cost-guide treatment authoring and projections require a routeable public service', () => {
  const filter = treatmentField?.options?.filter ?? '';
  assert.match(filter, /status in \["live", "actual-menu"\]/);
  assert.match(filter, /defined\(slug\.current\)/);
  assert.match(treatmentField?.description ?? '', /canonical public service/i);

  for (const query of [ALL_COST_GUIDES_QUERY, COST_GUIDE_BY_SLUG_QUERY]) {
    const treatmentProjection = query.match(/"treatment": select\(([\s\S]*?)=> treatment->/);
    assert.ok(treatmentProjection?.[1], 'The cost query must guard its treatment projection.');
    assert.match(treatmentProjection[1], /treatment->status in \["live", "actual-menu"\]/);
    assert.match(treatmentProjection[1], /defined\(treatment->slug\.current\)/);
  }
});
