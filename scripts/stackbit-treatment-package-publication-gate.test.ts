import assert from 'node:assert/strict';
import test from 'node:test';

import { VERIFIED_TREATMENT_PACKAGE_SLUGS } from '../packages/web/src/lib/publicTreatmentPackageContent.ts';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const treatmentPackageDocument = (slug?: string, status?: string) => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(status ? { status: { type: 'string', value: status } } : {}),
  },
});

test('Stackbit exposes only live treatment packages with verified public pricing', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?treatment-package-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const verifiedSlug = VERIFIED_TREATMENT_PACKAGE_SLUGS[0];
  const sitemap = [
    {
      urlPath: `/packages/${verifiedSlug}`,
      document: documentRef('package-verified-live', 'treatmentPackage'),
    },
    {
      urlPath: `/packages/${verifiedSlug}-parked`,
      document: documentRef('package-verified-parked', 'treatmentPackage'),
    },
    {
      urlPath: '/packages/unverified-program',
      document: documentRef('package-unverified-live', 'treatmentPackage'),
    },
    {
      urlPath: '/packages/missing-slug',
      document: documentRef('package-missing-slug', 'treatmentPackage'),
    },
    {
      urlPath: '/about/providers/amber-mingione/',
      document: documentRef('provider-amber', 'provider'),
    },
  ];
  const documents = new Map([
    ['package-verified-live', treatmentPackageDocument(verifiedSlug, 'live')] as const,
    ['package-verified-parked', treatmentPackageDocument(verifiedSlug, 'parked')] as const,
    ['package-unverified-live', treatmentPackageDocument('unverified-program', 'live')] as const,
    ['package-missing-slug', treatmentPackageDocument(undefined, 'live')] as const,
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    [`/packages/${verifiedSlug}`, '/about/providers/amber-mingione/'],
  );
});
