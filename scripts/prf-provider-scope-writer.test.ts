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
const underEyeWriterSource = readFileSync(
  new URL('../packages/studio/scripts/create-prf-under-eyes.mjs', import.meta.url),
  'utf8',
);
const underEyeDisclaimerMatch = underEyeWriterSource.match(
  /providerScope:\s*\{[\s\S]*?disclaimer:\s*'([^']+)'/,
);
const underEyeProviderScopeMatch = underEyeWriterSource.match(
  /providerScope:\s*(\{[\s\S]*?\n\s*\}),\n\s*status:/,
);
const underEyeDocumentMatch = underEyeWriterSource.match(
  /const document\s*=\s*(\{[\s\S]*?\n\});/,
);
const disclaimerField = treatmentProviderScope.fields.find(({ name }) => name === 'disclaimer');

function validateVarianceNote(value: string): true | string {
  assert.ok(disclaimerField?.validation, 'The provider-scope schema must validate its variance note.');
  const rule = {
    custom(fn: (input: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = disclaimerField.validation(rule);
  return validate(value);
}

test('the active PRF provider-scope command uses a schema-valid variance note', () => {
  assert.match(
    packageJson.scripts?.['content:prf-injections-scope:apply'] ?? '',
    /patch-prf-injections-provider-scope\.mjs\s+--apply/,
  );
  assert.ok(disclaimerMatch?.[1], 'The PRF provider-scope writer must define its variance note.');
  assert.equal(validateVarianceNote(disclaimerMatch[1]), true);
});

test('the PRF under-eye public-record writer uses a schema-valid variance note', () => {
  assert.match(underEyeWriterSource, /status:\s*'actual-menu'/);
  assert.ok(
    underEyeDisclaimerMatch?.[1],
    'The PRF under-eye writer must define its provider-scope variance note.',
  );
  assert.ok(underEyeProviderScopeMatch?.[1], 'The PRF under-eye writer must define provider scope.');
  assert.doesNotMatch(underEyeProviderScopeMatch[1], /\bconsultRequired\b/);
  assert.equal(validateVarianceNote(underEyeDisclaimerMatch[1]), true);
});

test('the PRF under-eye writer does not recreate unresolved timing or hidden-price claims', () => {
  assert.ok(underEyeDocumentMatch?.[1], 'The PRF under-eye writer must define its document payload.');
  assert.doesNotMatch(underEyeDocumentMatch[1], /\bduration\s*:/);
  assert.doesNotMatch(underEyeDocumentMatch[1], /hidden from the client-facing menu/i);
  assert.match(underEyeDocumentMatch[1], /rackPrice:\s*'\$495'/);
});
