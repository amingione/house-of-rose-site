import assert from 'node:assert/strict';
import test from 'node:test';

import { service } from '../packages/studio/schemas/service.ts';
import {
  ALL_SERVICES_QUERY,
  ALL_SERVICE_SLUGS_QUERY,
  ALL_SITEMAP_SERVICES_QUERY,
  SERVICE_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

type NestedField = {
  name?: string;
  fields?: NestedField[];
  of?: NestedField[];
  options?: { filter?: string };
  validation?: unknown;
};

function serviceField(name: string) {
  return service.fields.find((field) => field.name === name);
}

function nestedObjectFields(fieldName: string): NestedField[] {
  const field = serviceField(fieldName) as NestedField | undefined;
  assert.ok(field?.of && Array.isArray(field.of));
  const item = field.of[0];
  assert.ok(item?.fields && Array.isArray(item.fields));
  return item.fields;
}

function assertSharedGuard(field: NestedField | undefined, label: string): void {
  const validation = field?.validation;
  assert.equal(typeof validation, 'function', `${label} must validate public copy.`);
  assert.match(String(validation), /validatePublicCopy/);
}

test('directly published service identity text uses the shared public-copy guard', () => {
  for (const fieldName of ['title', 'price', 'duration']) {
    assertSharedGuard(serviceField(fieldName), fieldName);
  }

  const image = serviceField('image') as NestedField | undefined;
  assert.ok(image?.fields && Array.isArray(image.fields));
  assertSharedGuard(image.fields.find((field) => field.name === 'alt'), 'image.alt');

  const gallery = serviceField('gallery') as NestedField | undefined;
  assert.ok(gallery?.of && Array.isArray(gallery.of));
  const galleryImage = gallery.of[0];
  assert.ok(galleryImage?.fields && Array.isArray(galleryImage.fields));
  assertSharedGuard(galleryImage.fields.find((field) => field.name === 'alt'), 'gallery.alt');
});

test('approved evidence editorial copy is guarded without rewriting source citations', () => {
  const evidenceFields = nestedObjectFields('evidenceMedia');
  const evidenceImage = evidenceFields.find((field) => field.name === 'image');
  assert.ok(evidenceImage?.fields && Array.isArray(evidenceImage.fields));
  assertSharedGuard(evidenceImage.fields.find((field) => field.name === 'alt'), 'evidence image alt');

  for (const fieldName of ['title', 'caption']) {
    assertSharedGuard(evidenceFields.find((field) => field.name === fieldName), `evidence ${fieldName}`);
  }
  assert.doesNotMatch(String(evidenceFields.find((field) => field.name === 'sourceCredit')?.validation), /validatePublicCopy/);

  const researchFields = nestedObjectFields('researchReferences');
  for (const fieldName of ['summary', 'limitations']) {
    assertSharedGuard(researchFields.find((field) => field.name === fieldName), `research ${fieldName}`);
  }
  for (const fieldName of ['title', 'journal']) {
    assert.doesNotMatch(String(researchFields.find((field) => field.name === fieldName)?.validation), /validatePublicCopy/);
  }
});

test('the archival service tagline cannot pose as a live control', () => {
  const tagline = serviceField('tagline');
  assert.equal(tagline?.readOnly, true);
  assert.match(String(tagline?.title), /not published/i);
});

test('related-service authoring only offers relationships the public query can render', () => {
  const relatedServices = serviceField('relatedServices') as NestedField | undefined;
  assert.ok(relatedServices?.of && Array.isArray(relatedServices.of));

  const reference = relatedServices.of[0];
  const filter = reference?.options?.filter ?? '';
  assert.match(filter, /status in \["live", "actual-menu"\]/);
  assert.match(filter, /defined\(slug\.current\)/);

  const relatedProjection = SERVICE_BY_SLUG_QUERY.match(
    /"relatedServices": relatedServices\[([\s\S]*?)\]->/,
  );
  assert.ok(relatedProjection?.[1], 'The service query must guard related-service links.');
  assert.match(relatedProjection[1], /@->status in \["live", "actual-menu"\]/);
  assert.match(relatedProjection[1], /defined\(@->slug\.current\)/);
});

test('service collection authoring and projections require a generated collection route', () => {
  const collection = serviceField('collection') as NestedField | undefined;
  const authoringFilter = collection?.options?.filter ?? '';
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(authoringFilter, /!\(slug\.current in \[/);

  for (const query of [ALL_SERVICES_QUERY, SERVICE_BY_SLUG_QUERY]) {
    const collectionProjection = query.match(
      /"collection": select\(([\s\S]*?)=>\s*collection->/,
    );
    assert.ok(collectionProjection?.[1], 'The service query must guard collection links.');
    assert.match(collectionProjection[1], /defined\(collection->slug\.current\)/);
    assert.match(collectionProjection[1], /!\(collection->slug\.current in/);
  }
});

test('parent-service authoring and public projections require a routeable public hub', () => {
  const parentService = serviceField('parentService') as NestedField | undefined;
  const filter = parentService?.options?.filter ?? '';
  assert.match(filter, /kind == "hub"/);
  assert.match(filter, /status in \["live", "actual-menu"\]/);
  assert.match(filter, /defined\(slug\.current\)/);

  for (const query of [SERVICE_BY_SLUG_QUERY, ALL_SITEMAP_SERVICES_QUERY]) {
    const parentProjection = query.match(/"parentService": select\(([\s\S]*?)=> parentService->/);
    assert.ok(parentProjection?.[1], 'The query must guard its parent-service projection.');
    assert.match(parentProjection[1], /parentService->kind == "hub"/);
    assert.match(parentProjection[1], /parentService->status in \["live", "actual-menu"\]/);
    assert.match(parentProjection[1], /defined\(parentService->slug\.current\)/);
  }
});

test('the public service directory only lists records with generated routes', () => {
  const slug = serviceField('slug');
  assert.equal(typeof slug?.validation, 'function', 'Service slugs must remain required.');
  assert.match(String(slug?.validation), /required/);

  for (const query of [ALL_SERVICES_QUERY, ALL_SERVICE_SLUGS_QUERY]) {
    assert.match(query, /status in \["live", "actual-menu"\]/);
    assert.match(query, /defined\(slug\.current\)/);
  }
});

test('service hub child links require generated public routes', () => {
  const childProjection = SERVICE_BY_SLUG_QUERY.match(
    /"treatments": \*\[([\s\S]*?)\] \| order/,
  );
  assert.ok(childProjection?.[1], 'The service query must guard child-treatment links.');
  assert.match(childProjection[1], /status in \["live", "actual-menu"\]/);
  assert.match(childProjection[1], /defined\(slug\.current\)/);
  assert.match(childProjection[1], /parentService\._ref == \^\._id/);
});
