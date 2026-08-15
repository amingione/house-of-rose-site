import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';
import {
  ALL_COMPARISONS_QUERY,
  ALL_COMPARISON_SLUGS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';

const contentModelMap = readFileSync(
  new URL('../docs/CONTENT-MODEL-MAP.md', import.meta.url),
  'utf8',
);
const comparisonRoute = readFileSync(
  new URL('../packages/web/src/pages/compare/[slug].astro', import.meta.url),
  'utf8',
);
const querySource = readFileSync(
  new URL('../packages/web/src/lib/queries.ts', import.meta.url),
  'utf8',
);

const field = (name: string) => comparison.fields.find((candidate) => candidate.name === name);

test('the comparison content model distinguishes active routing inputs from legacy prose', () => {
  const comparisonContract = contentModelMap.match(
    /### 4\. Comparison page([\s\S]*?)\n### 5\. Local authority page/,
  )?.[1];

  assert.ok(comparisonContract, 'The content map must retain an inspectable comparison contract.');
  assert.match(comparisonContract, /Active CMS inputs/i);
  for (const activeInput of ['slug', 'status', 'optionA.service', 'optionB.service', 'orderRank']) {
    assert.match(comparisonContract, new RegExp(activeInput.replace('.', '\\.'), 'i'));
  }
  assert.match(comparisonContract, /reviewed website overlay/i);
  assert.match(comparisonContract, /Legacy source fields/i);
  assert.match(comparisonContract, /read-only in Studio and are not public copy authority/i);
});

test('the comparison schema and detail route enforce that documented ownership split', () => {
  for (const legacyField of ['intro', 'rows', 'verdict', 'faqs', 'seo']) {
    assert.equal(field(legacyField)?.readOnly, true, `${legacyField} must remain read-only.`);
  }

  for (const optionName of ['optionA', 'optionB']) {
    const option = field(optionName);
    assert.ok(option && 'fields' in option && Array.isArray(option.fields));

    for (const legacyField of ['label', 'summary', 'bestFor']) {
      assert.equal(
        option.fields.find((candidate) => candidate.name === legacyField)?.readOnly,
        true,
        `${optionName}.${legacyField} must remain read-only.`,
      );
    }
    const service = option.fields.find((candidate) => candidate.name === 'service');
    assert.equal(service?.type, 'reference', `${optionName}.service must remain active.`);
    assert.match(String(service?.validation), /required/);
    assert.match(String(service?.options?.filter), /status in \["live", "actual-menu"\]/);
    assert.match(String(service?.options?.filter), /defined\(slug\.current\)/);
    assert.match(String(service?.options?.filter), /!\(slug\.current in \$unavailableSlugs\)/);
    assert.deepEqual(service?.options?.filterParams, {
      unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS,
    });
  }

  assert.match(comparisonRoute, /getPublicComparisonContent\(cmp\.slug\)/);
});

test('public comparison payloads expose routing relationships, not overlay-owned copy', () => {
  const comparisonType = querySource.match(
    /export interface Comparison \{([\s\S]*?)\n\}/,
  )?.[1];
  const comparisonOptionType = querySource.match(
    /export interface ComparisonOption \{([\s\S]*?)\n\}/,
  )?.[1];

  assert.ok(comparisonType);
  assert.ok(comparisonOptionType);
  assert.match(comparisonType, /\b_id:\s*string/);
  assert.match(comparisonType, /\bslug:\s*string/);
  assert.match(comparisonType, /\b_updatedAt\?/);
  assert.match(comparisonType, /\boptionA\?/);
  assert.match(comparisonType, /\boptionB\?/);
  assert.match(comparisonOptionType, /\bservice\?/);

  for (const legacyField of ['title', 'intro', 'rows', 'verdict', 'faqs', 'seo']) {
    assert.doesNotMatch(
      comparisonType,
      new RegExp(`\\b${legacyField}\\??:`),
      `${legacyField} must not remain in the public Comparison type.`,
    );
  }
  for (const legacyField of ['label', 'summary', 'bestFor']) {
    assert.doesNotMatch(
      comparisonOptionType,
      new RegExp(`\\b${legacyField}\\??:`),
      `${legacyField} must not remain in the public ComparisonOption type.`,
    );
  }

  for (const query of [ALL_COMPARISONS_QUERY, COMPARISON_BY_SLUG_QUERY]) {
    assert.doesNotMatch(query, /\bintro\b|\bverdict\b|\brows\s*\[\]|\bfaqs\s*\[\]|"seo"\s*:/);
    assert.doesNotMatch(query, /\blabel\s*,|\bsummary\s*,|\bbestFor\s*,/);
    assert.match(query, /"service":\s*select\(/);
  }
});

test('every public comparison query requires both option services to have generated routes', () => {
  for (const query of [
    ALL_COMPARISONS_QUERY,
    COMPARISON_BY_SLUG_QUERY,
    ALL_COMPARISON_SLUGS_QUERY,
  ]) {
    for (const optionName of ['optionA', 'optionB']) {
      assert.match(query, new RegExp(`${optionName}\\.service->status in \\\["live", "actual-menu"\\\]`));
      assert.match(query, new RegExp(`defined\\(${optionName}\\.service->slug\\.current\\)`));
      assert.match(query, new RegExp(`!\\(${optionName}\\.service->slug\\.current in \\\[`));
    }
  }
});
