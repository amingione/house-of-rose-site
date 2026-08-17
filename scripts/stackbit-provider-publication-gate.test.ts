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

interface ProviderDocumentOptions {
  slug?: string;
  showOnWebsite?: boolean;
  publicRole?: string;
  roleCredential?: string;
  summary?: string;
  biography?: string[];
  serviceFocus?: string[];
}

const providerDocument = ({
  slug,
  showOnWebsite,
  publicRole,
  roleCredential,
  summary,
  biography,
  serviceFocus,
}: ProviderDocumentOptions) => ({
  fields: {
    ...(slug ? { slug: { type: 'slug', value: slug } } : {}),
    ...(showOnWebsite === undefined
      ? {}
      : { showOnWebsite: { type: 'boolean', value: showOnWebsite } }),
    ...(publicRole ? { publicRole: { type: 'string', value: publicRole } } : {}),
    ...(roleCredential ? { roleCredential: { type: 'string', value: roleCredential } } : {}),
    ...(summary ? { summary: { type: 'string', value: summary } } : {}),
    ...(biography ? {
      biography: {
        type: 'list',
        items: biography.map((value) => ({ type: 'string', value })),
      },
    } : {}),
    ...(serviceFocus ? {
      serviceFocus: {
        type: 'list',
        items: serviceFocus.map((value) => ({ type: 'string', value })),
      },
    } : {}),
  },
});

const completeProviderDocument = (overrides: ProviderDocumentOptions = {}) => providerDocument({
  slug: 'public-provider',
  showOnWebsite: true,
  publicRole: 'Licensed Esthetician',
  summary: 'Verified current practice context.',
  biography: ['Verified biography paragraph.'],
  serviceFocus: ['Verified service'],
  ...overrides,
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
      urlPath: '/about/providers/missing-summary',
      document: documentRef('provider-missing-summary', 'provider'),
    },
    {
      urlPath: '/about/providers/missing-biography',
      document: documentRef('provider-missing-biography', 'provider'),
    },
    {
      urlPath: '/about/providers/missing-service-focus',
      document: documentRef('provider-missing-service-focus', 'provider'),
    },
    {
      urlPath: '/about/providers/missing-role',
      document: documentRef('provider-missing-role', 'provider'),
    },
    {
      urlPath: '/about',
      document: documentRef('aboutPage', 'aboutPage'),
    },
  ];
  const documents = new Map([
    ['provider-public', completeProviderDocument()] as const,
    ['provider-hidden', completeProviderDocument({ slug: 'hidden-provider', showOnWebsite: false })] as const,
    ['provider-missing-slug', completeProviderDocument({ slug: undefined })] as const,
    ['provider-missing-summary', completeProviderDocument({ slug: 'missing-summary', summary: undefined })] as const,
    ['provider-missing-biography', completeProviderDocument({ slug: 'missing-biography', biography: [] })] as const,
    ['provider-missing-service-focus', completeProviderDocument({ slug: 'missing-service-focus', serviceFocus: [] })] as const,
    ['provider-missing-role', completeProviderDocument({ slug: 'missing-role', publicRole: undefined, roleCredential: undefined })] as const,
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
