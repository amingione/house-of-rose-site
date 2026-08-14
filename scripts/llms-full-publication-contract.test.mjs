import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('../packages/web/src/pages/llms-full.txt.ts', import.meta.url),
  'utf8',
);

test('the full AI feed emits links only for generated public service routes', () => {
  const query = source.match(
    /const SERVICES_FULL_QUERY = \/\* groq \*\/ `([\s\S]*?)`;/,
  )?.[1];

  assert.ok(query, 'The full AI feed service query must remain inspectable.');
  assert.match(query, /status in \["live", "actual-menu"\]/);
  assert.match(query, /defined\(slug\.current\)/);
  assert.match(query, /!\(slug\.current in \[/);
  assert.match(
    source,
    /URL: \$\{base\}\/services\/\$\{s\.slug\}\//,
    'The route guard is required because the feed publishes each service slug as a URL.',
  );
});
