import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { resolvePublicSiteFacts } from '../packages/web/src/lib/publicSiteFacts.ts';
import {
  localBusiness,
  siteEntityGraph,
} from '../packages/web/src/lib/structuredData.ts';

const siteUrl = 'https://houseofrosefl.com/';

function siteNodes(siteFacts: ReturnType<typeof resolvePublicSiteFacts>) {
  const graph = siteEntityGraph(
    {
      url: siteUrl,
      name: siteFacts.siteName,
      description: 'Practice description.',
      image: `${siteUrl}image.webp`,
      siteFacts,
    },
    siteUrl,
  );
  const nodes = graph['@graph'];
  assert.ok(Array.isArray(nodes));
  const business = nodes.find(
    (node): node is Record<string, unknown> =>
      typeof node === 'object' && node !== null && node['@id'] === `${siteUrl}#business`,
  );
  const website = nodes.find(
    (node): node is Record<string, unknown> =>
      typeof node === 'object' && node !== null && node['@id'] === `${siteUrl}#website`,
  );
  assert.ok(business);
  assert.ok(website);
  return { business, website };
}

test('production-shaped Site Settings drive sitewide and local-area NAP without output drift', () => {
  const siteFacts = resolvePublicSiteFacts({
    siteName: 'House of Rose Aesthetics',
    phone: '(844) 941-7673',
    email: 'info@houseofrosefl.com',
    address: '525 E Olympia Ave, Unit 9\nPunta Gorda, FL 33950',
    instagramHandle: 'house.of.rose.aesthetics',
  });
  const expectedAddress = {
    '@type': 'PostalAddress',
    streetAddress: '525 E Olympia Ave, Unit 9',
    addressLocality: 'Punta Gorda',
    addressRegion: 'FL',
    postalCode: '33950',
    addressCountry: 'US',
  };
  const expectedProfiles = [
    'https://www.instagram.com/house.of.rose.aesthetics/',
    'https://www.facebook.com/hofraesthetics',
  ];

  const { business: siteBusiness } = siteNodes(siteFacts);
  const areaBusiness = localBusiness({
    url: `${siteUrl}areas/punta-gorda/`,
    areaName: 'Punta Gorda, FL',
    siteFacts,
  });

  for (const business of [siteBusiness, areaBusiness]) {
    assert.equal(business.name, siteFacts.siteName);
    assert.equal(business.telephone, '+18449417673');
    assert.equal(business.email, siteFacts.email);
    assert.deepEqual(business.address, expectedAddress);
    assert.deepEqual(business.sameAs, expectedProfiles);
  }
});

test('malformed editor phone and address values fail closed in structured data', () => {
  const siteFacts = resolvePublicSiteFacts({
    siteName: 'Updated Practice Name',
    phone: 'not-a-phone',
    email: 'contact@example.com',
    address: 'unstructured address',
    instagramHandle: '@updated.practice',
  });
  const { business, website } = siteNodes(siteFacts);
  const areaBusiness = localBusiness({
    url: `${siteUrl}areas/example/`,
    siteFacts,
  });

  assert.equal(business.name, 'Updated Practice Name');
  assert.equal(
    business.description,
    'Updated Practice Name is a medical aesthetics practice in Punta Gorda, Florida.',
  );
  assert.equal(
    website.description,
    'Updated Practice Name is a medical aesthetics practice in Punta Gorda, Florida, serving Charlotte County and Southwest Florida.',
  );
  assert.equal(
    areaBusiness.description,
    'Updated Practice Name is a medical aesthetics practice in Punta Gorda, Florida, serving Charlotte County and Southwest Florida.',
  );
  assert.equal(business.email, 'contact@example.com');
  assert.equal(business.telephone, '+18449417673');
  assert.deepEqual(business.address, {
    '@type': 'PostalAddress',
    streetAddress: '525 E Olympia Ave, Unit 9',
    addressLocality: 'Punta Gorda',
    addressRegion: 'FL',
    postalCode: '33950',
    addressCountry: 'US',
  });
  assert.deepEqual(business.sameAs, [
    'https://www.instagram.com/updated.practice/',
    'https://www.facebook.com/hofraesthetics',
  ]);
});

test('BaseLayout and local-area rendering share the normalized Site Settings authority', () => {
  const layout = readFileSync(
    new URL('../packages/web/src/layouts/BaseLayout.astro', import.meta.url),
    'utf8',
  );
  const areaRoute = readFileSync(
    new URL('../packages/web/src/pages/areas/[slug].astro', import.meta.url),
    'utf8',
  );

  assert.match(layout, /const siteFacts = resolvePublicSiteFacts\(settings\)/);
  assert.match(layout, /siteFacts,/);

  assert.match(areaRoute, /sanityFetch<SiteSettings \| null>\(SITE_SETTINGS_QUERY\)/);
  assert.match(areaRoute, /const siteFacts = resolvePublicSiteFacts\(settings\)/);
  assert.match(areaRoute, /const practiceAddress = siteFacts\.address/);
  assert.match(areaRoute, /Call \$\{siteFacts\.phone\}/);
  assert.match(areaRoute, /const phoneHref = `tel:\$\{structuredTelephone\(siteFacts\)\}`/);
  assert.match(areaRoute, /href=\{phoneHref\}/);
  assert.match(areaRoute, /Call \{siteFacts\.phone\}/);
  assert.match(areaRoute, /\$\{siteFacts\.siteName\} is a medical aesthetics practice/);
  assert.match(areaRoute, /one \$\{siteFacts\.shortName\} practice/);
  assert.match(areaRoute, /\$\{siteFacts\.shortName\} is in Unit 9/);
  assert.match(areaRoute, /Medical Aesthetics in Punta Gorda, FL \| \$\{siteFacts\.shortName\}/);
  assert.match(areaRoute, /localBusiness\(\{[\s\S]*?siteFacts,/);
  assert.doesNotMatch(areaRoute, /const practiceAddress = ['"]/);
  assert.doesNotMatch(areaRoute, /href="tel:\+18449417673"/);
  assert.doesNotMatch(areaRoute, />Call \(844\) 941-7673</);
});
