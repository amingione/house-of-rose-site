import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { homepage } from '../packages/studio/schemas/homepage.ts';

const writerUrl = new URL(
  '../packages/studio/scripts/refine-homepage-voice.mjs',
  import.meta.url,
);

test('the retired homepage writer fails closed before any mutation path', () => {
  assert.equal(homepage.readOnly, true);

  const source = readFileSync(writerUrl, 'utf8');
  assert.doesNotMatch(source, /createClient|\.patch\(|\.commit\(|SANITY_API_WRITE_TOKEN/);

  const result = spawnSync(process.execPath, [writerUrl.pathname, '--apply'], {
    encoding: 'utf8',
    env: {},
  });

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /Archived by the 2026-08-13 voice reset/);
});
