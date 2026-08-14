import assert from 'node:assert/strict';
import test from 'node:test';

import { blogPost, validateBlogPortableText } from '../packages/studio/schemas/blogPost.ts';

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
