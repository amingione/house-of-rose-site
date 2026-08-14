import assert from 'node:assert/strict';
import test from 'node:test';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const blogDocument = (slug: string, publishedAt?: string, bodyBlocks = 1) => ({
  fields: {
    slug: { type: 'slug', value: slug },
    ...(publishedAt
      ? { publishedAt: { type: 'datetime', value: publishedAt } }
      : {}),
    ...(bodyBlocks > 0
      ? { body: { type: 'list', items: Array.from({ length: bodyBlocks }, () => ({ type: 'object' })) } }
      : {}),
  },
});

test('Stackbit exposes only complete, dated blog posts with reviewed public content', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?blog-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const sitemap = [
    {
      urlPath: '/blog/is-morpheus8-safe',
      document: documentRef('reviewed-dated', 'blogPost'),
    },
    {
      urlPath: '/blog/is-morpheus8-safe-draft',
      document: documentRef('reviewed-undated', 'blogPost'),
    },
    {
      urlPath: '/blog/is-morpheus8-safe-empty',
      document: documentRef('reviewed-empty', 'blogPost'),
    },
    {
      urlPath: '/blog/unreviewed-treatment-guide',
      document: documentRef('unreviewed-dated', 'blogPost'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map<string, ReturnType<typeof blogDocument>>([
    ['reviewed-dated', blogDocument('is-morpheus8-safe', '2026-08-01T12:00:00Z')],
    ['reviewed-undated', blogDocument('is-morpheus8-safe')],
    ['reviewed-empty', blogDocument('is-morpheus8-safe', '2026-08-01T12:00:00Z', 0)],
    ['unreviewed-dated', blogDocument('unreviewed-treatment-guide', '2026-08-01T12:00:00Z')],
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/blog/is-morpheus8-safe', '/about'],
  );
});
