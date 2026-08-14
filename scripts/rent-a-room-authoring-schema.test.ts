import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { rentARoom } from '../packages/studio/schemas/rentARoom.ts';

function rentalField(name: string) {
  return rentARoom.fields.find((field) => field.name === name);
}

test('only current room specifications remain an editable public-copy source', () => {
  const disconnectedFields = rentARoom.fields.filter((field) => field.name !== 'roomSpecs');

  for (const field of disconnectedFields) {
    assert.equal(field.readOnly, true, `${field.name} must remain source-compatible but read-only.`);
    assert.match(String(field.title), /not published/i, `${field.name} must be labeled accurately.`);
    assert.match(String(field.description), /current \/rent-a-room\/ route uses reviewed website content/i);
  }

  const roomSpecs = rentalField('roomSpecs');
  assert.notEqual(roomSpecs?.readOnly, true);
  assert.match(String(roomSpecs?.title), /published room specifications/i);
  assert.match(String(roomSpecs?.description), /verified current room, rate, and renter-requirement facts/i);
});

test('published room specification labels and values use the shared copy guard', () => {
  const roomSpecs = rentalField('roomSpecs');
  assert.ok(roomSpecs && 'of' in roomSpecs && Array.isArray(roomSpecs.of));
  const item = roomSpecs.of[0];
  assert.ok(item && 'fields' in item && Array.isArray(item.fields));
  const nestedFields = item.fields as Array<{ name?: string; validation?: unknown }>;

  for (const fieldName of ['label', 'value']) {
    const field = nestedFields.find((candidate) => candidate.name === fieldName);
    assert.equal(typeof field?.validation, 'function');
    assert.match(String(field?.validation), /validatePublicCopy/);
  }
});

test('the public rental route reads only the Studio canonical singleton', () => {
  const structure = readFileSync(
    new URL('../packages/studio/structure.ts', import.meta.url),
    'utf8',
  );
  const route = readFileSync(
    new URL('../packages/web/src/pages/rent-a-room.astro', import.meta.url),
    'utf8',
  );

  assert.match(
    structure,
    /schemaType\('rentARoom'\)\.documentId\('rentARoom'\)/,
    'Studio must keep the rental page on its canonical document ID.',
  );
  assert.match(
    route,
    /_type == "rentARoom" && _id == "rentARoom"/,
    'The public route must not select an arbitrary duplicate singleton.',
  );
});
