import assert from 'node:assert/strict';
import test from 'node:test';

import {
  REVIEWED_PUBLIC_COMPARISON_SLUGS,
  filterReviewedPublicComparisons,
  getPublicComparisonContent,
  isReviewedPublicComparisonSlug,
} from '../packages/web/src/lib/publicComparisonContent.ts';
import {
  ALL_COMPARISONS_QUERY,
  ALL_COMPARISON_SLUGS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

const reviewedSlugs = REVIEWED_PUBLIC_COMPARISON_SLUGS;
const reviewedSlugsGroq = JSON.stringify(reviewedSlugs);

test('the two reviewed comparison overlays remain public', () => {
  for (const slug of reviewedSlugs) {
    assert.equal(isReviewedPublicComparisonSlug(slug), true);
    assert.ok(getPublicComparisonContent(slug));
  }
});

test('a live Sanity comparison cannot become public without a reviewed overlay', () => {
  const liveSanityComparisons = [
    ...reviewedSlugs.map((slug) => ({ slug, status: 'live' as const })),
    { slug: 'unreviewed-live-comparison', status: 'live' as const },
  ];

  assert.deepEqual(
    filterReviewedPublicComparisons(liveSanityComparisons).map(({ slug }) => slug),
    reviewedSlugs,
  );
  assert.equal(isReviewedPublicComparisonSlug('unreviewed-live-comparison'), false);
  assert.equal(getPublicComparisonContent('unreviewed-live-comparison'), null);

  for (const query of [
    ALL_COMPARISONS_QUERY,
    ALL_COMPARISON_SLUGS_QUERY,
    COMPARISON_BY_SLUG_QUERY,
  ]) {
    assert.ok(
      query.includes(`slug.current in ${reviewedSlugsGroq}`),
      'Public comparison query is missing the reviewed-slug publication gate.',
    );
  }
});
