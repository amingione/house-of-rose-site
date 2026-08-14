import assert from 'node:assert/strict';
import test from 'node:test';

import {
  RETIRED_COST_GUIDE_SLUGS,
  REVIEWED_PUBLIC_COST_GUIDE_SLUGS,
} from '../packages/web/src/lib/publicCostGuideContent.ts';
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

interface StackbitDocument {
  fields: Record<string, unknown>;
}

const costGuideDocument = (slug?: string, treatmentId?: string): StackbitDocument => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(treatmentId
      ? {
          treatment: {
            type: 'reference',
            refType: 'document',
            refId: treatmentId,
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

test('Stackbit exposes only reviewed, routeable cost guides', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?cost-guide-gate=${Date.now()}`, import.meta.url).href
  );
  const transformSitemap = unwrapConfig(imported.default).transformSitemap;
  assert.equal(typeof transformSitemap, 'function');

  const documentRef = (id: string, modelName: string) => ({
    srcType: 'sanity',
    srcProjectId: '4e7axyi7:production',
    modelName,
    id,
  });
  const reviewedEntries = REVIEWED_PUBLIC_COST_GUIDE_SLUGS.map((slug) => ({
    urlPath: `/cost/${slug}`,
    document: documentRef(`cost-${slug}`, 'costGuide'),
  }));
  const retiredEntries = RETIRED_COST_GUIDE_SLUGS.map((slug) => ({
    urlPath: `/cost/${slug}`,
    document: documentRef(`cost-${slug}`, 'costGuide'),
  }));
  const sitemap = [
    ...reviewedEntries,
    ...retiredEntries,
    {
      urlPath: '/cost/unreviewed-treatment-cost',
      document: documentRef('cost-unreviewed', 'costGuide'),
    },
    {
      urlPath: '/cost/missing-slug',
      document: documentRef('cost-missing-slug', 'costGuide'),
    },
    {
      urlPath: '/cost/missing-treatment',
      document: documentRef('cost-missing-treatment', 'costGuide'),
    },
    {
      urlPath: '/cost/unavailable-treatment',
      document: documentRef('cost-unavailable-treatment', 'costGuide'),
    },
    {
      urlPath: '/cost/nonlive-treatment',
      document: documentRef('cost-nonlive-treatment', 'costGuide'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ...REVIEWED_PUBLIC_COST_GUIDE_SLUGS.map((slug) => [
      `cost-${slug}`,
      costGuideDocument(slug, 'service-routeable'),
    ] as const),
    ...RETIRED_COST_GUIDE_SLUGS.map((slug) => [
      `cost-${slug}`,
      costGuideDocument(slug, 'service-routeable'),
    ] as const),
    ['cost-unreviewed', costGuideDocument('unreviewed-treatment-cost', 'service-routeable')] as const,
    ['cost-missing-slug', costGuideDocument(undefined, 'service-routeable')] as const,
    [
      'cost-missing-treatment',
      costGuideDocument(REVIEWED_PUBLIC_COST_GUIDE_SLUGS[0]),
    ] as const,
    [
      'cost-unavailable-treatment',
      costGuideDocument(REVIEWED_PUBLIC_COST_GUIDE_SLUGS[0], 'service-unavailable'),
    ] as const,
    [
      'cost-nonlive-treatment',
      costGuideDocument(REVIEWED_PUBLIC_COST_GUIDE_SLUGS[0], 'service-nonlive'),
    ] as const,
    ['service-routeable', serviceDocument('morpheus8', 'live')] as const,
    [
      'service-unavailable',
      serviceDocument(UNAVAILABLE_PUBLIC_SERVICE_SLUGS[0], 'live'),
    ] as const,
    ['service-nonlive', serviceDocument('future-service', 'proposed')] as const,
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
