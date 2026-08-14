import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { brandProfile } from '../packages/studio/schemas/brandProfile.ts';

const schemaIndex = readFileSync(
  new URL('../packages/studio/schemas/index.ts', import.meta.url),
  'utf8',
);
const structure = readFileSync(
  new URL('../packages/studio/structure.ts', import.meta.url),
  'utf8',
);
const stackbit = readFileSync(new URL('../stackbit.config.ts', import.meta.url), 'utf8');
const queries = readFileSync(
  new URL('../packages/web/src/lib/queries.ts', import.meta.url),
  'utf8',
);
const workingMemory = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');
const shopArchitecture = readFileSync(
  new URL('../docs/SHOP-ARCHITECTURE.md', import.meta.url),
  'utf8',
);
const shopBrandSchema = readFileSync(
  new URL('../packages/studio/schemas/shopBrand.ts', import.meta.url),
  'utf8',
);

test('the archival brand profile remains source-compatible without editable voice controls', () => {
  assert.match(String(brandProfile.title), /archival.*not published/i);
  assert.match(String(brandProfile.description), /not a current voice authority/i);
  assert.match(String(brandProfile.description), /does not publish/i);

  for (const field of brandProfile.fields) {
    assert.equal(field.readOnly, true, `${field.name} must remain archival and read-only.`);
  }
});

test('the archival brand profile has no active authoring or public query surface', () => {
  assert.match(schemaIndex, /\bbrandProfile,/);
  assert.doesNotMatch(structure, /schemaType\(['"]brandProfile['"]\)/);
  assert.doesNotMatch(stackbit, /brandProfile/);
  assert.doesNotMatch(queries, /BRAND_PROFILE_QUERY|interface BrandProfile|interface BrandPillar/);
});

test('active architecture sources do not describe the archival record as voice authority', () => {
  for (const source of [workingMemory, shopArchitecture, shopBrandSchema]) {
    assert.match(source, /archival, unpublished `brandProfile`/i);
    assert.match(source, /not current voice authority/i);
    assert.doesNotMatch(source, /brandProfile` \(House of Rose's own brand-voice\/strategy doc/i);
    assert.doesNotMatch(source, /brandProfile`, which is House of Rose's own brand-voice\/strategy document/i);
  }
});
