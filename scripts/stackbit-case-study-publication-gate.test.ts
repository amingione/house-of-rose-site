import assert from 'node:assert/strict';
import test from 'node:test';

interface StackbitConfigShape {
  transformSitemap?: (options: unknown) => Array<{ urlPath: string }>;
}

interface CaseStudyOptions {
  slug?: string;
  consentGiven?: boolean;
  beforeImage?: string;
  afterImage?: string;
  treatmentSlug?: string;
}

interface StackbitDocument {
  fields: Record<string, unknown>;
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

const caseStudyDocument = ({
  slug,
  consentGiven,
  beforeImage,
  afterImage,
  treatmentSlug,
}: CaseStudyOptions): StackbitDocument => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(consentGiven === undefined
      ? {}
      : { consentGiven: { type: 'boolean', value: consentGiven } }),
    ...(beforeImage
      ? { beforeImage: { type: 'reference', refType: 'asset', refId: beforeImage } }
      : {}),
    ...(afterImage
      ? { afterImage: { type: 'reference', refType: 'asset', refId: afterImage } }
      : {}),
    ...(treatmentSlug
      ? { treatmentSlug: { type: 'string', value: treatmentSlug } }
      : {}),
  },
});

test('Stackbit exposes only routeable, consented case studies with both image assets', async () => {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';

  const imported = await import(
    new URL(`../stackbit.config.ts?case-study-gate=${Date.now()}`, import.meta.url).href
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
      urlPath: '/results/consented-complete',
      document: documentRef('consented-complete', 'caseStudy'),
    },
    {
      urlPath: '/results/consent-missing',
      document: documentRef('consent-missing', 'caseStudy'),
    },
    {
      urlPath: '/results/before-image-missing',
      document: documentRef('before-image-missing', 'caseStudy'),
    },
    {
      urlPath: '/results/after-image-missing',
      document: documentRef('after-image-missing', 'caseStudy'),
    },
    {
      urlPath: '/results/slug-missing',
      document: documentRef('slug-missing', 'caseStudy'),
    },
    {
      urlPath: '/results/treatment-missing',
      document: documentRef('treatment-missing', 'caseStudy'),
    },
    {
      urlPath: '/results/treatment-unavailable',
      document: documentRef('treatment-unavailable', 'caseStudy'),
    },
    {
      urlPath: '/results/treatment-nonlive',
      document: documentRef('treatment-nonlive', 'caseStudy'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const completeImages = {
    beforeImage: 'image-before-1200x1200-jpg',
    afterImage: 'image-after-1200x1200-jpg',
  };
  const routeableTreatment = { treatmentSlug: 'injectables' };
  const documents = new Map<string, StackbitDocument>([
    [
      'consented-complete',
      caseStudyDocument({
        slug: 'consented-complete',
        consentGiven: true,
        ...completeImages,
        ...routeableTreatment,
      }),
    ],
    [
      'consent-missing',
      caseStudyDocument({
        slug: 'consent-missing',
        consentGiven: false,
        ...completeImages,
        ...routeableTreatment,
      }),
    ],
    [
      'before-image-missing',
      caseStudyDocument({
        slug: 'before-image-missing',
        consentGiven: true,
        afterImage: completeImages.afterImage,
        ...routeableTreatment,
      }),
    ],
    [
      'after-image-missing',
      caseStudyDocument({
        slug: 'after-image-missing',
        consentGiven: true,
        beforeImage: completeImages.beforeImage,
        ...routeableTreatment,
      }),
    ],
    [
      'slug-missing',
      caseStudyDocument({ consentGiven: true, ...completeImages, ...routeableTreatment }),
    ],
    [
      'treatment-missing',
      caseStudyDocument({ slug: 'treatment-missing', consentGiven: true, ...completeImages }),
    ],
    [
      'treatment-unavailable',
      caseStudyDocument({
        slug: 'treatment-unavailable',
        consentGiven: true,
        ...completeImages,
        treatmentSlug: 'wellness',
      }),
    ],
    [
      'treatment-nonlive',
      caseStudyDocument({
        slug: 'treatment-nonlive',
        consentGiven: true,
        ...completeImages,
        treatmentSlug: 'future-service',
      }),
    ],
  ]);

  const filtered = transformSitemap!({
    sitemap,
    getDocumentById: ({ id }: { id: string }) => documents.get(id),
  });

  assert.deepEqual(
    filtered.map(({ urlPath }) => urlPath),
    ['/results/consented-complete', '/about'],
  );
});
