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

interface StackbitDocument {
  fields: Record<string, unknown>;
}

const comparisonDocument = (
  slug: string,
  status: string,
  optionAServiceId?: string,
  optionBServiceId?: string,
): StackbitDocument => ({
  fields: {
    slug: { type: 'slug', value: slug },
    status: { type: 'string', value: status },
    ...(optionAServiceId
      ? {
          optionA: {
            type: 'object',
            fields: {
              service: { type: 'reference', refType: 'document', refId: optionAServiceId },
            },
          },
        }
      : {}),
    ...(optionBServiceId
      ? {
          optionB: {
            type: 'object',
            fields: {
              service: { type: 'reference', refType: 'document', refId: optionBServiceId },
            },
          },
        }
      : {}),
  },
});

const serviceDocument = (slug: string, status: string): StackbitDocument => ({
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
      urlPath: '/compare/missing-service-reference',
      document: documentRef('reviewed-missing-service', 'comparison'),
    },
    {
      urlPath: '/compare/unavailable-service-reference',
      document: documentRef('reviewed-unavailable-service', 'comparison'),
    },
    {
      urlPath: '/compare/nonlive-service-reference',
      document: documentRef('reviewed-nonlive-service', 'comparison'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const routeableServices = ['service-a', 'service-b'] as const;
  const documents = new Map<string, StackbitDocument>([
    ['reviewed-live', comparisonDocument('daxxify-vs-botox', 'live', ...routeableServices)],
    [
      'reviewed-parked',
      comparisonDocument('morpheus8-vs-microneedling', 'parked', ...routeableServices),
    ],
    [
      'unreviewed-live',
      comparisonDocument('unreviewed-device-comparison', 'live', ...routeableServices),
    ],
    [
      'reviewed-missing-service',
      comparisonDocument('morpheus8-vs-microneedling', 'live', 'service-a'),
    ],
    [
      'reviewed-unavailable-service',
      comparisonDocument(
        'morpheus8-vs-microneedling',
        'live',
        'service-a',
        'service-unavailable',
      ),
    ],
    [
      'reviewed-nonlive-service',
      comparisonDocument(
        'morpheus8-vs-microneedling',
        'live',
        'service-a',
        'service-nonlive',
      ),
    ],
    ['service-a', serviceDocument('injectables', 'live')],
    ['service-b', serviceDocument('morpheus8', 'actual-menu')],
    ['service-unavailable', serviceDocument('wellness', 'live')],
    ['service-nonlive', serviceDocument('future-service', 'proposed')],
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/compare/daxxify-vs-botox', '/about'],
  );
});
