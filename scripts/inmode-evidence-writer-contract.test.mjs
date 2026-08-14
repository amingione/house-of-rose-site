import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const writer = readFileSync(
  new URL('../packages/studio/scripts/add-inmode-evidence.mjs', import.meta.url),
  'utf8',
);

test('the InMode writer cannot self-approve subject publication consent', () => {
  assert.doesNotMatch(
    writer,
    /kind\s*===\s*['"]before-after['"]\s*\?\s*\{\s*consentConfirmed:\s*true/,
  );
  assert.match(writer, /typeof consentConfirmed === ['"]boolean['"]/);
});

test('the managed public evidence set excludes the unverified Lumecca before-and-after', () => {
  const servicesBlock = writer.slice(
    writer.indexOf('const services = ['),
    writer.indexOf('const excludedPublicFiles = ['),
  );
  assert.doesNotMatch(servicesBlock, /Lumecca-Peak-Before-and-After\.png/);
  assert.match(writer, /const excludedPublicFiles = \[[\s\S]*Lumecca-Peak-Before-and-After\.png/);
});
