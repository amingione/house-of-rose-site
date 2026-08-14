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

const providerDocument = (slug?: string, showOnWebsite?: boolean) => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(showOnWebsite === undefined
      ? {}
      : { showOnWebsite: { type: 'boolean', value: showOnWebsite } }),
  },
});

test('Stackbit exposes only providers with generated public profile routes', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?provider-gate=${Date.now()}`, import.meta.url).href
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
      urlPath: '/about/providers/public-provider',
      document: documentRef('provider-public', 'provider'),
    },
    {
      urlPath: '/about/providers/hidden-provider',
      document: documentRef('provider-hidden', 'provider'),
    },
    {
      urlPath: '/about/providers/missing-slug',
      document: documentRef('provider-missing-slug', 'provider'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ['provider-public', providerDocument('public-provider', true)] as const,
    ['provider-hidden', providerDocument('hidden-provider', false)] as const,
    ['provider-missing-slug', providerDocument(undefined, true)] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/about/providers/public-provider', '/about'],
  );
});
