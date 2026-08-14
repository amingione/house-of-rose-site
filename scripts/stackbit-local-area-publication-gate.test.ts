import assert from 'node:assert/strict';
import test from 'node:test';

import { REVIEWED_PUBLIC_LOCAL_AREA_SLUGS } from '../packages/web/src/lib/publicLocalAreaContent.ts';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const localAreaDocument = (slug?: string) => ({
  fields: slug ? { slug: { type: 'slug', value: slug } } : {},
});

test('Stackbit exposes only the reviewed public local-area inventory', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?local-area-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const reviewedEntries = REVIEWED_PUBLIC_LOCAL_AREA_SLUGS.map((slug) => ({
    urlPath: `/areas/${slug}`,
    document: documentRef(`area-${slug}`, 'localArea'),
  }));
  const sitemap = [
    ...reviewedEntries,
    {
      urlPath: '/areas/unreviewed-community',
      document: documentRef('area-unreviewed', 'localArea'),
    },
    {
      urlPath: '/areas/missing-slug',
      document: documentRef('area-missing-slug', 'localArea'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ...REVIEWED_PUBLIC_LOCAL_AREA_SLUGS.map((slug) => [
      `area-${slug}`,
      localAreaDocument(slug),
    ] as const),
    ['area-unreviewed', localAreaDocument('unreviewed-community')] as const,
    ['area-missing-slug', localAreaDocument()] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    [...reviewedEntries.map(({ urlPath }) => urlPath), '/about'],
  );
});
