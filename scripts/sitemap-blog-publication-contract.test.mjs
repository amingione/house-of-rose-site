import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { isReviewedPublicBlogSlug } from '../packages/web/src/lib/publicBlogContent.ts';

const sitemapSource = await readFile(
  new URL('../packages/web/src/pages/sitemap.astro', import.meta.url),
  'utf8',
);

test('the human sitemap lists only reviewed Journal routes', () => {
  assert.equal(isReviewedPublicBlogSlug('is-morpheus8-safe'), true);
  assert.equal(isReviewedPublicBlogSlug('unreviewed-draft'), false);

  assert.match(
    sitemapSource,
    /const publicBlogPosts = blogPosts\.filter\(\(post\) => isReviewedPublicBlogSlug\(post\.slug\)\);/,
  );
  assert.match(sitemapSource, /links: publicBlogPosts\.map\(\(post\) => \(\{/);
  assert.doesNotMatch(sitemapSource, /links: blogPosts\.map\(\(post\) => \(\{/);
});
