import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { siteSettings } from '../packages/studio/schemas/siteSettings.ts';

const writerUrl = new URL(
  '../packages/studio/scripts/patch-launch-fixes.mjs',
  import.meta.url,
);

test('the retired launch-fix writer cannot overwrite public Site Settings', () => {
  const address = siteSettings.fields.find((field) => field.name === 'address');
  assert.ok(address, 'The canonical address must remain an explicit Site Settings field.');
  assert.notEqual(address.readOnly, true, 'NAP must remain maintainable through the reviewed Studio workflow.');

  const source = readFileSync(writerUrl, 'utf8');
  assert.doesNotMatch(source, /createClient|\.patch\(|\.commit\(|authToken|homedir/);

  const result = spawnSync(process.execPath, [writerUrl.pathname], {
    encoding: 'utf8',
    env: {},
  });

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /Archived one-off launch correction/);
});
