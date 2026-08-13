import assert from 'node:assert/strict';
import test from 'node:test';

import { seo } from '../packages/studio/schemas/objects/seo.ts';
import { blogPost } from '../packages/studio/schemas/blogPost.ts';
import { concern } from '../packages/studio/schemas/concern.ts';
import { validatePublicCopy } from '../packages/studio/schemas/validation/publicCopy.ts';

test('shared SEO fields include the public-copy guard without replacing length guidance', () => {
  for (const fieldName of ['metaTitle', 'metaDescription']) {
    const field = seo.fields.find(({ name }) => name === fieldName);
    assert.ok(field?.validation, `Missing ${fieldName} validation.`);

    const rule = {
      max() { return this; },
      warning() { return this; },
      custom(fn: typeof validatePublicCopy) { return { validate: fn }; },
    };
    const validations = field.validation(rule);
    assert.equal(validations.length, 2);
    assert.equal(validations[1].validate('Medical aesthetics in Punta Gorda.'), true);
    assert.match(String(validations[1].validate('Turn back time with guaranteed results.')), /retired or prohibited/i);
  }
});

test('blog and concern metadata use the guarded shared SEO object', () => {
  for (const schema of [blogPost, concern]) {
    const field = schema.fields.find(({ name }) => name === 'seo');
    assert.equal(field?.type, 'seo', `${schema.name} bypasses the shared SEO validation.`);
  }
});

test('the guard preserves substantive copy and the exact verified IV service name', () => {
  assert.equal(
    validatePublicCopy('Compare current services, appointment lengths, published prices, and provider information.'),
    true,
  );
  assert.equal(validatePublicCopy('Beauty Glow IV is listed on the current menu.'), true);
  assert.equal(validatePublicCopy('A consultation reviews medical history before this service.'), true);
  assert.match(String(validatePublicCopy('A premium boutique experience!')), /retired or prohibited/i);
});
