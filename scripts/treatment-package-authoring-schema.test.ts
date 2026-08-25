import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentPackage } from '../packages/studio/schemas/treatmentPackage.ts';
import { SERVICE_OPTIONS } from '../packages/web/src/lib/serviceCatalog.ts';
import {
  ALL_TREATMENT_PACKAGES_QUERY,
  TREATMENT_PACKAGE_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const titleField = treatmentPackage.fields.find(({ name }) => name === 'title');
const cadenceField = treatmentPackage.fields.find(({ name }) => name === 'cadence');
const rackPriceField = treatmentPackage.fields.find(({ name }) => name === 'rackPrice');
const imageField = treatmentPackage.fields.find(({ name }) => name === 'image');
const providerField = treatmentPackage.fields.find(({ name }) => name === 'provider');
const servicesIncludedField = treatmentPackage.fields.find(({ name }) => name === 'serviceSlugs') as
  | {
      type?: string;
      options?: { list?: readonly { title: string; value: string }[] };
      validation?: unknown;
    }
  | undefined;

test('the published package identity is required and uses the shared public-copy guard', () => {
  assert.equal(typeof titleField?.validation, 'function', 'Package title must validate public copy.');
  assert.match(String(titleField.validation), /required/);
  assert.match(String(titleField.validation), /validatePublicCopy/);

  let requiredCalls = 0;
  const rule = {
    required() {
      requiredCalls += 1;
      return this;
    },
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = titleField.validation(rule);

  assert.equal(requiredCalls, 1);
  assert.equal(validate('Face Reality 12-Week Program'), true);
  assert.match(String(validate('Premium Glow Transformation')), /retired or prohibited/i);
});

test('published package timing uses the shared guard without a process template', () => {
  assert.equal(typeof cadenceField?.validation, 'function', 'Package timing must validate public copy.');
  assert.match(String(cadenceField.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = cadenceField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('12 weeks, with an in-studio appointment every two weeks.'), true);
  assert.match(String(validate('A premium transformation over 12 weeks.')), /retired or prohibited/i);
});

test('stored package price cannot diverge from the reviewed public package facts', () => {
  assert.equal(rackPriceField?.readOnly, true);
  assert.match(String(rackPriceField?.title), /not published/i);
  assert.match(String(rackPriceField?.description), /reviewed package facts/i);
  assert.match(String(rackPriceField?.description), /current booking menu/i);

  for (const query of [ALL_TREATMENT_PACKAGES_QUERY, TREATMENT_PACKAGE_BY_SLUG_QUERY]) {
    assert.doesNotMatch(query, /\brackPrice\b/);
  }

  const card = readFileSync(
    new URL('../packages/web/src/components/TreatmentPackageCard.astro', import.meta.url),
    'utf8',
  );
  const detail = readFileSync(
    new URL('../packages/web/src/pages/packages/[slug].astro', import.meta.url),
    'utf8',
  );
  for (const renderer of [card, detail]) {
    assert.doesNotMatch(renderer, /pkg\.rackPrice/);
    assert.doesNotMatch(renderer, /(?:fp|sbFieldPath)\('rackPrice'\)/);
    assert.doesNotMatch(renderer, /packagePriceUsd|\$\{?\d/);
  }
});

test('published package image alt text uses the shared public-copy guard', () => {
  assert.ok(imageField && 'fields' in imageField && Array.isArray(imageField.fields));
  const alt = imageField.fields.find(({ name }) => name === 'alt');
  assert.equal(typeof alt?.validation, 'function', 'Package image alt must validate public copy.');
  assert.match(String(alt.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = alt.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('Face Reality products used during the 12-week program.'), true);
  assert.match(String(validate('A flawless skin transformation.')), /retired or prohibited/i);
});

test('the operational package provider relationship cannot pose as public package copy', () => {
  assert.equal(providerField?.type, 'reference');
  assert.notEqual(providerField?.readOnly, true, 'The internal provider assignment remains operational.');
  assert.match(String(providerField?.title), /internal.*not published/i);
  assert.match(String(providerField?.description), /operational notion mirror/i);
  assert.match(String(providerField?.description), /reviewed provider attribution/i);

  for (const query of [ALL_TREATMENT_PACKAGES_QUERY, TREATMENT_PACKAGE_BY_SLUG_QUERY]) {
    assert.doesNotMatch(query, /"provider"\s*:/);
    assert.doesNotMatch(query, /provider->\{[^}]*\blane\b/);
  }

  for (const relativePath of [
    '../packages/web/src/pages/packages/index.astro',
    '../packages/web/src/pages/packages/[slug].astro',
  ]) {
    const renderer = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    assert.doesNotMatch(renderer, /(?:pkg|package)\.provider/);
  }
});

test('stored package review fields and service taglines stay out of the public package payload', () => {
  for (const fieldName of ['whatsIncluded', 'outcome', 'candidacyNote']) {
    const field = treatmentPackage.fields.find(({ name }) => name === fieldName);
    assert.equal(field?.readOnly, true, `${fieldName} must remain a stored nonpublic field.`);
    assert.match(String(field?.title), /not published/i);
  }

  const positioning = treatmentPackage.fields.find(({ name }) => name === 'positioning');
  assert.match(String(positioning?.description), /internal display notes only/i);

  for (const query of [ALL_TREATMENT_PACKAGES_QUERY, TREATMENT_PACKAGE_BY_SLUG_QUERY]) {
    for (const fieldName of ['whatsIncluded', 'outcome', 'positioning', 'candidacyNote', 'tagline']) {
      assert.doesNotMatch(query, new RegExp(`\\b${fieldName}\\b`));
    }
  }

  for (const relativePath of [
    '../packages/web/src/pages/packages/index.astro',
    '../packages/web/src/pages/packages/[slug].astro',
    '../packages/web/src/components/TreatmentPackageCard.astro',
  ]) {
    const renderer = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    assert.doesNotMatch(
      renderer,
      /(?:pkg|package)\.(?:whatsIncluded|outcome|positioning|candidacyNote)/,
    );
    assert.doesNotMatch(renderer, /service\.tagline/);
  }
});

test('package service authoring and projections require routeable public services', () => {
  assert.equal(servicesIncludedField?.type, 'array');
  assert.deepEqual(servicesIncludedField?.options?.list, SERVICE_OPTIONS);
  assert.match(String(servicesIncludedField?.validation), /min\(1\)/);

  for (const query of [ALL_TREATMENT_PACKAGES_QUERY, TREATMENT_PACKAGE_BY_SLUG_QUERY]) {
    assert.match(query, /serviceSlugs/);
    assert.doesNotMatch(query, /servicesIncluded|_type == "service"/);
  }
});
