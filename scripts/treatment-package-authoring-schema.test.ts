import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentPackage } from '../packages/studio/schemas/treatmentPackage.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';
import {
  ALL_TREATMENT_PACKAGES_QUERY,
  ALL_TREATMENT_PACKAGE_SLUGS_QUERY,
  TREATMENT_PACKAGE_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const titleField = treatmentPackage.fields.find(({ name }) => name === 'title');
const cadenceField = treatmentPackage.fields.find(({ name }) => name === 'cadence');
const rackPriceField = treatmentPackage.fields.find(({ name }) => name === 'rackPrice');
const imageField = treatmentPackage.fields.find(({ name }) => name === 'image');
const providerField = treatmentPackage.fields.find(({ name }) => name === 'provider');
const servicesIncludedField = treatmentPackage.fields.find(({ name }) => name === 'servicesIncluded') as
  | {
      of?: Array<{
        options?: { filter?: string; filterParams?: Record<string, unknown> };
      }>;
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

test('published package price text uses the shared guard without locking a value', () => {
  assert.equal(typeof rackPriceField?.validation, 'function', 'Package price must validate public copy.');
  assert.match(String(rackPriceField.validation), /validatePublicCopy/);

  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  const { validate } = rackPriceField.validation(rule);

  assert.equal(validate(undefined), true);
  assert.equal(validate('$899'), true);
  assert.equal(validate('$250–$850'), true);
  assert.match(String(validate('Premium package — $899!')), /retired or prohibited/i);
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

test('package service authoring and projections require routeable public services', () => {
  const authoringFilter = servicesIncludedField?.of?.[0]?.options?.filter ?? '';
  assert.match(authoringFilter, /status in \["live", "actual-menu"\]/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(authoringFilter, /!\(slug\.current in \$unavailableSlugs\)/);
  assert.deepEqual(servicesIncludedField?.of?.[0]?.options?.filterParams, {
    unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS,
  });
  assert.match(String(servicesIncludedField?.validation), /min\(1\)/);

  for (const query of [
    ALL_TREATMENT_PACKAGES_QUERY,
    TREATMENT_PACKAGE_BY_SLUG_QUERY,
    ALL_TREATMENT_PACKAGE_SLUGS_QUERY,
  ]) {
    assert.match(query, /count\(servicesIncluded\[/);
    assert.match(query, /@->status in \["live", "actual-menu"\]/);
    assert.match(query, /defined\(@->slug\.current\)/);
    assert.match(query, /!\(@->slug\.current in \[/);
    assert.match(query, /\]\) > 0/);
  }

  for (const query of [ALL_TREATMENT_PACKAGES_QUERY, TREATMENT_PACKAGE_BY_SLUG_QUERY]) {
    const servicesProjection = query.match(
      /"servicesIncluded": servicesIncluded\[([\s\S]*?)\]->/,
    );
    assert.ok(servicesProjection?.[1], 'The package query must guard included-service routes.');
    assert.match(servicesProjection[1], /@->status in \["live", "actual-menu"\]/);
    assert.match(servicesProjection[1], /defined\(@->slug\.current\)/);
  }
});
