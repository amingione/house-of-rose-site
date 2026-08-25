import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  provider,
  validateProviderDigitalCardPath,
  validateProviderProfileImagePath,
  validateProviderPublicProfile,
} from '../packages/studio/schemas/provider.ts';
import {
  PUBLIC_PROVIDER_DIGITAL_CARDS,
  PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES,
} from '../packages/web/src/lib/publicProviderContent.ts';
import {
  PUBLIC_PROVIDER_BY_SLUG_QUERY,
  PUBLIC_PROVIDERS_QUERY,
} from '../packages/web/src/lib/queries.ts';

function providerField(name: string) {
  return provider.fields.find((field) => field.name === name);
}

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

test('every provider text field that can reach a public profile uses the shared copy guard', () => {
  for (const fieldName of ['title', 'fullName', 'roleCredential', 'publicName', 'publicRole', 'summary']) {
    const field = providerField(fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }

  for (const fieldName of ['biography', 'serviceFocus']) {
    const field = providerField(fieldName);
    assert.ok(field && 'of' in field && Array.isArray(field.of), `${fieldName} must remain an array.`);
    const item = field.of[0];
    assert.equal(typeof item?.validation, 'function', `${fieldName} items must validate public copy.`);
    assert.match(String(item?.validation), /validatePublicCopy/);
  }

  const profileImage = providerField('profileImage');
  assert.ok(profileImage && 'fields' in profileImage && Array.isArray(profileImage.fields));
  const alt = profileImage.fields.find((field) => field.name === 'alt');
  assert.equal(typeof alt?.validation, 'function', 'Public profile-image alt text must validate public copy.');
  assert.match(String(alt?.validation), /validatePublicCopy/);
});

test('provider prompts support substantive profiles without a fixed process template', () => {
  const showOnWebsite = providerField('showOnWebsite');
  const summary = providerField('summary');
  const biography = providerField('biography');
  const serviceFocus = providerField('serviceFocus');

  assert.match(String(showOnWebsite?.description), /public profile route/i);
  assert.match(String(summary?.description), /enough verified context/i);
  assert.match(String(summary?.description), /process boilerplate/i);
  assert.match(String(biography?.description), /depth is welcome/i);
  assert.match(String(biography?.description), /do not force a fixed paragraph count/i);
  assert.match(String(serviceFocus?.description), /verified current public service labels/i);
});

test('public provider visibility requires the slug used by the public route query', () => {
  const slug = providerField('slug');
  assert.equal(typeof slug?.validation, 'function', 'Provider slug must validate public visibility.');
  assert.match(PUBLIC_PROVIDERS_QUERY, /showOnWebsite\s*==\s*true/);
  assert.match(PUBLIC_PROVIDERS_QUERY, /defined\(slug\.current\)/);

  let validate: ((value: { current?: string } | undefined, context: { document?: { showOnWebsite?: boolean } }) => true | string) | undefined;
  const rule = {
    custom(fn: typeof validate) {
      validate = fn;
      return this;
    },
  };
  slug.validation(rule);
  assert.ok(validate, 'Provider slug validation must expose a custom publication check.');

  assert.match(String(validate(undefined, { document: { showOnWebsite: true } })), /requires a slug/i);
  assert.equal(validate({ current: 'diana' }, { document: { showOnWebsite: true } }), true);
  assert.equal(validate(undefined, { document: { showOnWebsite: false } }), true);
});

test('public provider visibility requires the content the profile renderer consumes', () => {
  const completeProfile = {
    publicRole: 'Licensed Esthetician',
    summary: 'Verified current practice context.',
    biography: ['Verified biography paragraph.'],
    serviceFocus: ['Verified service'],
  };

  assert.equal(validateProviderPublicProfile(false, { document: {} }), true);
  assert.equal(validateProviderPublicProfile(true, { document: completeProfile }), true);

  for (const [missingField, expectedMessage] of [
    ['publicRole', /role/i],
    ['summary', /summary/i],
    ['biography', /biography/i],
    ['serviceFocus', /service focus/i],
  ] as const) {
    const incompleteProfile = { ...completeProfile, [missingField]: undefined };
    assert.match(
      String(validateProviderPublicProfile(true, { document: incompleteProfile })),
      expectedMessage,
    );
  }

  const visibility = providerField('showOnWebsite');
  assert.match(String(visibility?.validation), /validateProviderPublicProfile/);

  for (const query of [PUBLIC_PROVIDERS_QUERY, PUBLIC_PROVIDER_BY_SLUG_QUERY]) {
    assert.match(query, /coalesce\(publicRole, roleCredential, ""\) != ""/);
    assert.match(query, /coalesce\(summary, ""\) != ""/);
    assert.match(query, /count\(biography\) > 0/);
    assert.match(query, /count\(serviceFocus\) > 0/);
  }
});

test('provider digital-card links are limited to generated public routes before projection', () => {
  const digitalCardPath = providerField('digitalCardPath');
  assert.equal(typeof digitalCardPath?.validation, 'function');
  assert.match(String(digitalCardPath?.validation), /validateProviderDigitalCardPath/);
  assert.deepEqual(
    digitalCardPath && 'options' in digitalCardPath && digitalCardPath.options && 'list' in digitalCardPath.options
      ? digitalCardPath.options.list
      : undefined,
    PUBLIC_PROVIDER_DIGITAL_CARDS.map(({ title, path }) => ({ title, value: path })),
  );

  assert.equal(validateProviderDigitalCardPath(undefined), true);
  for (const { slug, path } of PUBLIC_PROVIDER_DIGITAL_CARDS) {
    assert.equal(validateProviderDigitalCardPath(path), true);
    assert.ok(
      existsSync(`${repoRoot}/packages/web/src/pages/${slug}.astro`),
      `${path} must have a generated Astro route.`,
    );
  }
  assert.match(String(validateProviderDigitalCardPath('/missing-card/')), /currently generated/i);
  assert.match(String(validateProviderDigitalCardPath('https://example.com/card/')), /currently generated/i);

  const pathInventory = JSON.stringify(PUBLIC_PROVIDER_DIGITAL_CARDS.map(({ path }) => path));
  for (const query of [PUBLIC_PROVIDERS_QUERY, PUBLIC_PROVIDER_BY_SLUG_QUERY]) {
    assert.ok(query.includes(pathInventory), 'Provider queries must use the shared card-route inventory.');
    assert.match(query, /"digitalCardPath":\s*select\(/);
    assert.doesNotMatch(query, /^\s*digitalCardPath,\s*$/m);
  }

  const renderer = readFileSync(
    `${repoRoot}/packages/web/src/pages/about/providers/[slug].astro`,
    'utf8',
  );
  assert.match(renderer, /href=\{profile\.digitalCardPath\}/);
  assert.match(renderer, /sameAs:\s*profile\.digitalCardPath/);
});

test('provider static image fallbacks are limited to generated public assets before projection', () => {
  const profileImagePath = providerField('profileImagePath');
  assert.equal(typeof profileImagePath?.validation, 'function');
  assert.match(String(profileImagePath?.validation), /validateProviderProfileImagePath/);
  assert.deepEqual(
    profileImagePath && 'options' in profileImagePath && profileImagePath.options && 'list' in profileImagePath.options
      ? profileImagePath.options.list
      : undefined,
    PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES.map(({ title, path }) => ({ title, value: path })),
  );

  assert.equal(validateProviderProfileImagePath(undefined), true);
  for (const { path } of PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES) {
    assert.equal(validateProviderProfileImagePath(path), true);
    assert.ok(
      existsSync(`${repoRoot}/packages/web/public${path}`),
      `${path} must be a generated public asset.`,
    );
  }

  for (const invalidPath of [
    '/images/providers/Aundrea.webp',
    '/images/providers/../private.webp',
    'https://example.com/provider.webp',
    '/images/providers/missing.webp',
  ]) {
    assert.match(String(validateProviderProfileImagePath(invalidPath)), /existing generated provider profile image/i);
  }

  const pathInventory = JSON.stringify(
    PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES.map(({ path }) => path),
  );
  for (const query of [PUBLIC_PROVIDERS_QUERY, PUBLIC_PROVIDER_BY_SLUG_QUERY]) {
    assert.ok(query.includes(pathInventory), 'Provider profile queries must use the shared static-image inventory.');
    assert.match(query, /select\(profileImagePath in .* => profileImagePath\)/s);
  }
});
