import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const feedSources = [
  '../packages/web/src/pages/llms.txt.ts',
  '../packages/web/src/pages/llms-full.txt.ts',
].map((relativePath) => ({
  relativePath,
  source: readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
}));
const providerResolverSource = readFileSync(
  new URL('../packages/web/src/lib/aboutFallbacks.ts', import.meta.url),
  'utf8',
);

test('AI feeds use the same guarded provider inventory as public routes and sitemaps', () => {
  for (const { relativePath, source } of feedSources) {
    assert.match(source, /PUBLIC_PROVIDERS_QUERY/);
    assert.match(
      source,
      /sanityFetch<PublicProviderProfile\[\]>\(PUBLIC_PROVIDERS_QUERY\)/,
      `${relativePath} must fetch provider records through the public route predicate.`,
    );
    assert.match(source, /const providers = resolvePublicProviderProfiles\(sanityProviders\)/);
    assert.doesNotMatch(
      source,
      /const providers = PROVIDER_PROFILE_FALLBACKS/,
      `${relativePath} must not freeze AI discovery to the current fallback inventory.`,
    );
  }
});

test('the shared resolver preserves reviewed overlays and passes through future public profiles', () => {
  const resolver = providerResolverSource.match(
    /export function resolvePublicProviderProfiles\([\s\S]*?\n\}/,
  )?.[0];

  assert.ok(resolver, 'The public provider resolver must remain inspectable.');
  assert.match(resolver, /PROVIDER_PROFILE_FALLBACKS\.map\(\(fallback\)\s*=>/);
  assert.match(resolver, /return \{[\s\S]*?\.\.\.sanityProvider,[\s\S]*?\.\.\.fallback,/);
  assert.match(
    resolver,
    /\.\.\.sanityProviders\.filter\(\(provider\)\s*=>\s*!reviewedSlugs\.has\(provider\.slug\)\)/,
    'A future complete provider selected by PUBLIC_PROVIDERS_QUERY must pass through to every public inventory.',
  );
});
