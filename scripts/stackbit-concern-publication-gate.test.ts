import assert from 'node:assert/strict';
import test from 'node:test';

import { RETIRED_PUBLIC_CONCERN_SLUGS } from '../packages/web/src/lib/publicConcernContent.ts';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const concernDocument = (slug?: string, status?: string) => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(status ? { status: { type: 'string', value: status } } : {}),
  },
});

test('Stackbit exposes only concern guides with generated public routes', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?concern-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const retiredEntries = RETIRED_PUBLIC_CONCERN_SLUGS.map((slug) => ({
    urlPath: `/concerns/${slug}`,
    document: documentRef(`concern-retired-${slug}`, 'concern'),
  }));
  const sitemap = [
    {
      urlPath: '/concerns/active-acne',
      document: documentRef('concern-live', 'concern'),
    },
    {
      urlPath: '/concerns/parked-concern',
      document: documentRef('concern-parked', 'concern'),
    },
    ...retiredEntries,
    {
      urlPath: '/concerns/missing-slug',
      document: documentRef('concern-missing-slug', 'concern'),
    },
    {
      urlPath: '/about',
      document: documentRef('about-page', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ['concern-live', concernDocument('active-acne', 'live')] as const,
    ['concern-parked', concernDocument('parked-concern', 'parked')] as const,
    ...RETIRED_PUBLIC_CONCERN_SLUGS.map(
      (slug) => [`concern-retired-${slug}`, concernDocument(slug, 'live')] as const,
    ),
    ['concern-missing-slug', concernDocument(undefined, 'live')] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/concerns/active-acne', '/about'],
  );
});
