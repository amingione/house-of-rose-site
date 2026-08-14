import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { costGuide } from '../packages/studio/schemas/costGuide.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';
import {
  ALL_COST_GUIDE_SLUGS_QUERY,
  ALL_COST_GUIDES_QUERY,
  COST_GUIDE_BY_SLUG_QUERY,
  REVIEWED_PUBLIC_COST_GUIDE_SLUGS,
} from '../packages/web/src/lib/queries.ts';

const titleField = costGuide.fields.find(({ name }) => name === 'title');
const slugField = costGuide.fields.find(({ name }) => name === 'slug');
const treatmentField = costGuide.fields.find(({ name }) => name === 'treatment') as
  | {
      options?: { filter?: string; filterParams?: { unavailableSlugs?: readonly string[] } };
      description?: string;
      validation?: (rule: { required: () => unknown }) => unknown;
    }
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
  assert.match(filter, /!\(slug\.current in \$unavailableSlugs\)/);
  assert.deepEqual(treatmentField?.options?.filterParams, {
    unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS,
  });
  assert.match(treatmentField?.description ?? '', /canonical public service/i);
  assert.equal(typeof treatmentField?.validation, 'function');
  assert.match(String(treatmentField.validation), /required/);

  for (const query of [
    ALL_COST_GUIDES_QUERY,
    COST_GUIDE_BY_SLUG_QUERY,
    ALL_COST_GUIDE_SLUGS_QUERY,
  ]) {
    assert.match(query, /treatment->status in \["live", "actual-menu"\]/);
    assert.match(query, /defined\(treatment->slug\.current\)/);
    assert.match(query, /!\(treatment->slug\.current in \[/);
  }

  for (const query of [ALL_COST_GUIDES_QUERY, COST_GUIDE_BY_SLUG_QUERY]) {
    const treatmentProjection = query.match(/"treatment": select\(([\s\S]*?)=> treatment->/);
    assert.ok(treatmentProjection?.[1], 'The cost query must guard its treatment projection.');
    assert.match(treatmentProjection[1], /treatment->status in \["live", "actual-menu"\]/);
    assert.match(treatmentProjection[1], /defined\(treatment->slug\.current\)/);
  }
});

test('cost-guide public inventories require the schema-required route slug', () => {
  let requiredCalls = 0;
  const rule = {
    required() {
      requiredCalls += 1;
      return this;
    },
  };

  assert.equal(typeof slugField?.validation, 'function', 'Cost-guide slug must be validated.');
  slugField.validation(rule);
  assert.equal(requiredCalls, 1, 'Cost-guide slug must remain required in Studio.');

  for (const query of [ALL_COST_GUIDES_QUERY, ALL_COST_GUIDE_SLUGS_QUERY]) {
    assert.match(
      query,
      /_type == "costGuide" && defined\(slug\.current\)/,
      'Every public cost-guide inventory must reject records without a route slug.',
    );
  }
});

test('cost-guide creation cannot publish without a reviewed factual overlay', () => {
  assert.ok(REVIEWED_PUBLIC_COST_GUIDE_SLUGS.length > 0, 'The reviewed cost-guide inventory must not be empty.');
  const reviewedSlugSet = JSON.stringify(REVIEWED_PUBLIC_COST_GUIDE_SLUGS);
  const costFactsSource = readFileSync(
    new URL('../packages/web/src/lib/costFacts.ts', import.meta.url),
    'utf8',
  );

  for (const query of [
    ALL_COST_GUIDES_QUERY,
    COST_GUIDE_BY_SLUG_QUERY,
    ALL_COST_GUIDE_SLUGS_QUERY,
  ]) {
    assert.ok(
      query.includes(`slug.current in ${reviewedSlugSet}`),
      'Every public cost-guide query must fail closed to fact-backed slugs.',
    );
  }

  for (const slug of REVIEWED_PUBLIC_COST_GUIDE_SLUGS) {
    assert.match(
      costFactsSource,
      new RegExp(`['"]${slug}['"]\\s*:`),
      `${slug} must have a reviewed cost-fact overlay before it can publish.`,
    );
  }
});
