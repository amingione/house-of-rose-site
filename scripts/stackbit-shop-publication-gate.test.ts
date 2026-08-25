import assert from 'node:assert/strict';
import test from 'node:test';

interface ModelExtension {
  name: string;
  type: string;
  urlPath: string;
}

interface StackbitConfigShape {
  modelExtensions: ModelExtension[];
}

function unwrapConfig(value: unknown): StackbitConfigShape {
  if (typeof value === 'object' && value !== null && 'default' in value) {
    return unwrapConfig(value.default);
  }
  return value as StackbitConfigShape;
}

async function loadModelExtensions(shopEnabled: boolean): Promise<ModelExtension[]> {
  process.env.SANITY_PROJECT_ID = '4e7axyi7';
  process.env.SANITY_ACCESS_TOKEN = 'test-only-token';
  process.env.PUBLIC_SHOP_ENABLED = shopEnabled ? 'true' : 'false';

  const moduleUrl = new URL(
    `../stackbit.config.ts?shop-enabled=${shopEnabled}-${Date.now()}`,
    import.meta.url,
  );
  const imported = await import(moduleUrl.href);
  return unwrapConfig(imported.default).modelExtensions;
}

test('Stackbit advertises shop page models only when the public storefront is enabled', async () => {
  const disabledExtensions = await loadModelExtensions(false);
  const enabledExtensions = await loadModelExtensions(true);

  for (const publicModel of ['provider']) {
    assert.ok(
      disabledExtensions.some(({ name }) => name === publicModel),
      `${publicModel} must remain available when the shop is disabled.`,
    );
  }
  assert.equal(disabledExtensions.some(({ name }) => name === 'service'), false);

  for (const shopModel of ['product', 'janeIredalePage']) {
    assert.equal(
      disabledExtensions.some(({ name }) => name === shopModel),
      false,
      `${shopModel} must not advertise a forced-404 route in the page editor.`,
    );
    assert.equal(
      enabledExtensions.some(({ name, type }) => name === shopModel && type === 'page'),
      true,
      `${shopModel} must return as a page model when the storefront is enabled.`,
    );
  }

  assert.equal(
    enabledExtensions.find(({ name }) => name === 'product')?.urlPath,
    '/shop/{slug}',
  );
  assert.equal(
    enabledExtensions.find(({ name }) => name === 'janeIredalePage')?.urlPath,
    '/shop/jane-iredale',
  );
});
