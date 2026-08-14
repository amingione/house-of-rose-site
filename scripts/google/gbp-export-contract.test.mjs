import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const rootPackage = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const writer = readFileSync(new URL('./export-gbp-services.mjs', import.meta.url), 'utf8');

test('the advertised GBP export only includes services with generated public routes', () => {
  assert.match(rootPackage.scripts['google:gbp:export'], /export-gbp-services\.mjs/);
  assert.match(
    writer,
    /googleBusinessProfile\.enabled\s*==\s*true[\s\S]*status in \["live", "actual-menu"\][\s\S]*defined\(slug\.current\)/,
  );
  assert.match(writer, /const invalid = services\.filter\([\s\S]*!service\.slug/);
  assert.match(writer, /`https:\/\/houseofrosefl\.com\/services\/\$\{service\.slug\}\/`/);
});

test('the GBP export remains review-only', () => {
  assert.doesNotMatch(writer, /\.(?:create|createIfNotExists|createOrReplace|delete|patch|transaction|mutate)\s*\(/);
});
