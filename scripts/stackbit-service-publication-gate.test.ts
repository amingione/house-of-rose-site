import assert from 'node:assert/strict';
import test from 'node:test';

import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const serviceDocument = (slug?: string, status?: string) => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(status ? { status: { type: 'string', value: status } } : {}),
  },
});

test('Stackbit exposes only services with generated public routes', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?service-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const unavailableEntries = UNAVAILABLE_PUBLIC_SERVICE_SLUGS.map((slug) => ({
    urlPath: `/services/${slug}`,
    document: documentRef(`service-${slug}`, 'service'),
  }));
  const sitemap = [
    {
      urlPath: '/services/prf',
      document: documentRef('service-live', 'service'),
    },
    {
      urlPath: '/services/permanent-jewelry',
      document: documentRef('service-actual-menu', 'service'),
    },
    {
      urlPath: '/services/proposed-service',
      document: documentRef('service-proposed', 'service'),
    },
    {
      urlPath: '/services/missing-slug',
      document: documentRef('service-missing-slug', 'service'),
    },
    ...unavailableEntries,
    {
      urlPath: '/areas/punta-gorda',
      document: documentRef('area-punta-gorda', 'localArea'),
    },
  ];
  const documents = new Map([
    ['service-live', serviceDocument('prf', 'live')] as const,
    ['service-actual-menu', serviceDocument('permanent-jewelry', 'actual-menu')] as const,
    ['service-proposed', serviceDocument('proposed-service', 'proposed')] as const,
    ['service-missing-slug', serviceDocument(undefined, 'live')] as const,
    ...UNAVAILABLE_PUBLIC_SERVICE_SLUGS.map((slug) => [
      `service-${slug}`,
      serviceDocument(slug, 'live'),
    ] as const),
    ['area-punta-gorda', serviceDocument('punta-gorda', 'live')] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/services/prf', '/services/permanent-jewelry', '/areas/punta-gorda'],
  );
});
