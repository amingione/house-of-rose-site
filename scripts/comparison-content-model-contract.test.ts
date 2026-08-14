import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { comparison } from '../packages/studio/schemas/comparison.ts';

const contentModelMap = readFileSync(
  new URL('../docs/CONTENT-MODEL-MAP.md', import.meta.url),
  'utf8',
);
const comparisonRoute = readFileSync(
  new URL('../packages/web/src/pages/compare/[slug].astro', import.meta.url),
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
    assert.equal(
      option.fields.find((candidate) => candidate.name === 'service')?.type,
      'reference',
      `${optionName}.service must remain an active service relationship.`,
    );
  }

  assert.match(comparisonRoute, /getPublicComparisonContent\(cmp\.slug\)/);
});
