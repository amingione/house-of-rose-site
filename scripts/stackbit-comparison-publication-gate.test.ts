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

const comparisonDocument = (slug: string, status: string) => ({
  fields: {
    slug: { type: 'slug', value: slug },
    status: { type: 'string', value: status },
  },
});

test('Stackbit exposes only live comparisons with reviewed public overlays', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?comparison-gate=${Date.now()}`, import.meta.url).href
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
      urlPath: '/compare/daxxify-vs-botox',
      document: documentRef('reviewed-live', 'comparison'),
    },
    {
      urlPath: '/compare/morpheus8-vs-microneedling',
      document: documentRef('reviewed-parked', 'comparison'),
    },
    {
      urlPath: '/compare/unreviewed-device-comparison',
      document: documentRef('unreviewed-live', 'comparison'),
    },
    {
      urlPath: '/about/providers/amber-mingione/',
      document: documentRef('provider-amber', 'provider'),
    },
  ];
  const documents = new Map<string, ReturnType<typeof comparisonDocument>>([
    ['reviewed-live', comparisonDocument('daxxify-vs-botox', 'live')],
    ['reviewed-parked', comparisonDocument('morpheus8-vs-microneedling', 'parked')],
    ['unreviewed-live', comparisonDocument('unreviewed-device-comparison', 'live')],
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/compare/daxxify-vs-botox', '/about/providers/amber-mingione/'],
  );
});
