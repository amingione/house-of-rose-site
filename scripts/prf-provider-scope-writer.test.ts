import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentProviderScope } from '../packages/studio/schemas/objects/treatmentBlocks.ts';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  scripts?: Record<string, string>;
};
const writerUrl = new URL(
  '../packages/studio/scripts/patch-prf-injections-provider-scope.mjs',
  import.meta.url,
);
const writerSource = readFileSync(writerUrl, 'utf8');
const disclaimerMatch = writerSource.match(
  /const providerScope\s*=\s*\{[\s\S]*?disclaimer:\s*'([^']+)'/,
);
const disclaimerField = treatmentProviderScope.fields.find(({ name }) => name === 'disclaimer');

test('the active PRF provider-scope command uses a schema-valid variance note', () => {
  assert.match(
    packageJson.scripts?.['content:prf-injections-scope:apply'] ?? '',
    /patch-prf-injections-provider-scope\.mjs\s+--apply/,
  );
  assert.ok(disclaimerMatch?.[1], 'The PRF provider-scope writer must define its variance note.');
  assert.ok(disclaimerField?.validation, 'The provider-scope schema must validate its variance note.');

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = disclaimerField.validation(rule);

  assert.equal(validate(disclaimerMatch[1]), true);
});
