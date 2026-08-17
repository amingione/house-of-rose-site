import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { product } from '../../packages/studio/schemas/product.ts';

const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerSource = readFileSync(
  new URL('../../packages/studio/scripts/activate-merchant-products.mjs', import.meta.url),
  'utf8',
);
const decisionBlock = writerSource.match(
  /const decisions = products\.map\(\(product\) => \{([\s\S]*?)\n\}\);/,
)?.[1];

test('Merchant activation preserves the schema-supported excluded state', () => {
  assert.match(
    packageJson.scripts?.['google:catalog:activate:apply'] ?? '',
    /activate-merchant-products\.mjs[\s\S]*--apply/,
  );

  const statusField = product.fields.find((field) => field.name === 'merchantStatus');
  const statusValues = statusField && 'options' in statusField
    ? statusField.options?.list?.map((item) => typeof item === 'string' ? item : item.value)
    : [];
  assert.ok(statusValues?.includes('excluded'), 'Product schema must retain an explicit excluded state.');
  assert.ok(decisionBlock, 'Merchant activation must define a per-product decision block.');
  assert.match(decisionBlock, /product\.merchantStatus === 'excluded'/);
  assert.match(decisionBlock, /explicitlyExcluded\s*\?\s*'excluded'/);
  assert.match(decisionBlock, /explicitlyExcluded\s*\?\s*product\.exclusionReason/);
  assert.match(decisionBlock, /explicitlyExcluded && !product\.exclusionReason/);
});
