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

test('the InMode writer verifies each managed service canonical route before patching', () => {
  const servicesBlock = writer.slice(
    writer.indexOf('const services = ['),
    writer.indexOf('const excludedPublicFiles = ['),
  );

  for (const [documentId, slug] of [
    ['service-morpheus8', 'morpheus8'],
    ['service-lumecca-peak-ipl', 'lumecca-peak-ipl'],
    ['service-forma-rf-facial', 'forma-rf-facial'],
  ]) {
    assert.match(
      servicesBlock,
      new RegExp(`documentId: '${documentId}',\\s+slug: '${slug}',`),
    );
  }

  assert.match(writer, /"slug":slug\.current/);
  assert.match(writer, /published\.slug === service\.slug/);

  const routeGuardIndex = writer.indexOf('published.slug === service.slug');
  const transactionIndex = writer.indexOf('const transaction = client.transaction()');
  assert.ok(routeGuardIndex > -1, 'The writer must validate canonical service slugs.');
  assert.ok(
    routeGuardIndex < transactionIndex,
    'Canonical-route validation must complete before the evidence transaction begins.',
  );
});
