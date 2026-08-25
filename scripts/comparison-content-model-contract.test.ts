import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';
import {
  ALL_COMPARISONS_QUERY,
  ALL_COMPARISON_SLUGS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';
import { SERVICE_OPTIONS } from '../packages/web/src/lib/serviceCatalog.ts';

const contentModelMap = readFileSync(new URL('../docs/CONTENT-MODEL-MAP.md', import.meta.url), 'utf8');
const comparisonRoute = readFileSync(
  new URL('../packages/web/src/pages/compare/[slug].astro', import.meta.url),
  'utf8',
);
const field = (name: string) => comparison.fields.find((candidate) => candidate.name === name);

test('the comparison content model documents local service-slug relationships', () => {
  const contract = contentModelMap.match(
    /### 4\. Comparison page([\s\S]*?)\n### 5\. Local authority page/,
  )?.[1];
  assert.ok(contract);
  for (const input of ['slug', 'status', 'optionA.serviceSlug', 'optionB.serviceSlug', 'orderRank']) {
    assert.match(contract, new RegExp(input.replace('.', '\\.'), 'i'));
  }
  assert.doesNotMatch(contract, /optionA\.service\b|optionB\.service\b/);
});

test('comparison service choices come from the typed Astro catalog', () => {
  for (const optionName of ['optionA', 'optionB']) {
    const option = field(optionName);
    assert.ok(option && 'fields' in option && Array.isArray(option.fields));
    const serviceSlug = option.fields.find((candidate) => candidate.name === 'serviceSlug');
    assert.equal(serviceSlug?.type, 'string');
    assert.deepEqual(serviceSlug?.options?.list, SERVICE_OPTIONS);
    assert.match(String(serviceSlug?.validation), /required/);
    assert.equal(option.fields.some((candidate) => candidate.name === 'service'), false);
  }
});

test('comparison queries project slug strings without dereferencing service documents', () => {
  for (const query of [ALL_COMPARISONS_QUERY, COMPARISON_BY_SLUG_QUERY]) {
    assert.match(query, /serviceSlug/);
    assert.doesNotMatch(query, /service->|_type == "service"/);
  }
  for (const query of [ALL_COMPARISONS_QUERY, COMPARISON_BY_SLUG_QUERY, ALL_COMPARISON_SLUGS_QUERY]) {
    assert.match(query, /status == "live"/);
  }
});

test('the detail route hydrates comparison options from the local catalog', () => {
  assert.match(comparisonRoute, /getPublicServiceBySlug/);
  assert.match(comparisonRoute, /getComparisonServiceSlugs/);
  assert.match(comparisonRoute, /getPublicComparisonContent\(cmp\.slug\)/);
});
