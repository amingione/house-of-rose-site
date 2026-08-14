import assert from 'node:assert/strict';
import test from 'node:test';

import { REVIEWED_PUBLIC_COLLECTION_SLUGS } from '../packages/web/src/lib/publicCollectionContent.ts';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const collectionDocument = (slug?: string) => ({
  fields: slug ? { slug: { type: 'slug', value: slug } } : {},
});

test('Stackbit exposes only the reviewed public service-collection inventory', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?service-collection-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const reviewedEntries = REVIEWED_PUBLIC_COLLECTION_SLUGS.map((slug) => ({
    urlPath: `/services/collections/${slug}`,
    document: documentRef(`collection-${slug}`, 'serviceCollection'),
  }));
  const sitemap = [
    ...reviewedEntries,
    {
      urlPath: '/services/collections/unreviewed-category',
      document: documentRef('collection-unreviewed', 'serviceCollection'),
    },
    {
      urlPath: '/services/collections/missing-slug',
      document: documentRef('collection-missing-slug', 'serviceCollection'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ...REVIEWED_PUBLIC_COLLECTION_SLUGS.map((slug) => [
      `collection-${slug}`,
      collectionDocument(slug),
    ] as const),
    ['collection-unreviewed', collectionDocument('unreviewed-category')] as const,
    ['collection-missing-slug', collectionDocument()] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    [
      ...reviewedEntries.map(({ urlPath }) => urlPath),
      '/about',
    ],
  );
});
