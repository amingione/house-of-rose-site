import assert from 'node:assert/strict';
import test from 'node:test';

import {
  blogPost,
  PUBLIC_BLOG_CATEGORIES,
  validateBlogPortableText,
} from '../packages/studio/schemas/blogPost.ts';
import { BLOG_POST_BY_SLUG_QUERY } from '../packages/web/src/lib/queries.ts';

test('blog Portable Text validation reviews complete paragraph text across decorated spans', () => {
  assert.equal(
    validateBlogPortableText({
      children: [
        { text: 'A useful article can be detailed, warm, and grounded in ' },
        { text: 'verified practice facts.' },
      ],
    }),
    true,
  );

  assert.match(
    String(validateBlogPortableText({ children: [{ text: 'A premium ' }, { text: 'boutique experience.' }] })),
    /retired or prohibited/i,
  );
});

test('directly published blog fields carry review guidance and validation', () => {
  for (const fieldName of ['title', 'excerpt']) {
    const field = blogPost.fields.find(({ name }) => name === fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
  }

  const body = blogPost.fields.find(({ name }) => name === 'body');
  assert.match(String(body?.description), /substantive, source-backed article/i);
  assert.match(String(body?.description), /do not force/i);

  const block = body && 'of' in body && Array.isArray(body.of)
    ? body.of.find((member) => member.type === 'block')
    : undefined;
  assert.equal(typeof block?.validation, 'function', 'Portable Text blocks must validate public copy.');
});

test('public blog categories are limited to current service and editorial areas', () => {
  const category = blogPost.fields.find(({ name }) => name === 'category');
  assert.equal(typeof category?.validation, 'function', 'Blog category must validate public output.');
  assert.deepEqual(
    category.options?.list,
    PUBLIC_BLOG_CATEGORIES.map((value) => ({ title: value, value })),
  );

  let guarded = false;
  let validValues: readonly string[] = [];
  const rule = {
    custom(fn: (value: string | undefined) => true | string) {
      guarded = fn('Premium Wellness') !== true;
      return this;
    },
    valid(...values: string[]) {
      validValues = values;
      return this;
    },
  };
  category.validation(rule);

  assert.equal(guarded, true);
  assert.deepEqual(validValues, PUBLIC_BLOG_CATEGORIES);
  assert.ok(validValues.includes('Provider-Guided Weight Management'));
  assert.ok(!validValues.includes('Hormone Optimization'));
  assert.ok(!validValues.includes('GLP-1 Weight Loss'));
});

test('blog image alt text uses the shared public-copy guard wherever it renders', () => {
  const featuredImage = blogPost.fields.find(({ name }) => name === 'featuredImage');
  assert.ok(featuredImage && 'fields' in featuredImage && Array.isArray(featuredImage.fields));
  const featuredAlt = featuredImage.fields.find(({ name }) => name === 'alt');

  const body = blogPost.fields.find(({ name }) => name === 'body');
  assert.ok(body && 'of' in body && Array.isArray(body.of));
  const bodyImage = body.of.find((member) => member.type === 'image');
  assert.ok(bodyImage && 'fields' in bodyImage && Array.isArray(bodyImage.fields));
  const bodyAlt = bodyImage.fields.find(({ name }) => name === 'alt');

  for (const [label, field] of [
    ['featured image alt', featuredAlt],
    ['body image alt', bodyAlt],
  ] as const) {
    assert.equal(typeof field?.validation, 'function', `${label} must validate public copy.`);
    assert.match(String(field.validation), /validatePublicCopy/);

    const rule = {
      custom(fn: (value: string | undefined) => true | string) {
        return { validate: fn };
      },
    };
    const { validate } = field.validation(rule);
    assert.equal(validate('Treatment room inside House of Rose Aesthetics.'), true);
    assert.match(String(validate('A premium boutique treatment room.')), /retired or prohibited/i);
  }
});

test('related-service CTAs can resolve only to generated public service routes', () => {
  const relatedService = blogPost.fields.find(({ name }) => name === 'relatedService');
  assert.equal(relatedService?.type, 'reference');
  const authoringFilter = String(relatedService?.options?.filter);

  assert.match(authoringFilter, /status in \["live", "actual-menu"\]/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(BLOG_POST_BY_SLUG_QUERY, /relatedService->status in \["live", "actual-menu"\]/);
  assert.match(BLOG_POST_BY_SLUG_QUERY, /defined\(relatedService->slug\.current\)/);
});
