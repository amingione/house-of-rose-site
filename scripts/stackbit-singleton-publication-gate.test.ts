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

test('Stackbit exposes only canonical records for fixed-route singleton pages', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?singleton-gate=${Date.now()}`, import.meta.url).href
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
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
    {
      urlPath: '/privacy-policy',
      document: documentRef('privacyPolicy', 'privacyPolicy'),
    },
    {
      urlPath: '/terms-of-service',
      document: documentRef('drafts.termsOfService', 'termsOfService'),
    },
    {
      urlPath: '/rent-a-room',
      document: documentRef('rentARoom', 'rentARoom'),
    },
    {
      urlPath: '/about',
      document: documentRef('duplicate-about-record', 'aboutPage'),
    },
    {
      urlPath: '/settings',
      document: documentRef('siteSettings', 'siteSettings'),
    },
  ];

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: () => undefined,
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/about', '/privacy-policy', '/terms-of-service', '/rent-a-room', '/settings'],
  );
});
