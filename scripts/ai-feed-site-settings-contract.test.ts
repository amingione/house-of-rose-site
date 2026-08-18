import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { SITE_SETTINGS_QUERY } from '../packages/web/src/lib/queries.ts';
import { resolvePublicSiteFacts } from '../packages/web/src/lib/publicSiteFacts.ts';

const feedSources = [
  readFileSync(new URL('../packages/web/src/pages/llms.txt.ts', import.meta.url), 'utf8'),
  readFileSync(new URL('../packages/web/src/pages/llms-full.txt.ts', import.meta.url), 'utf8'),
];

test('AI feeds resolve canonical identity and NAP from the exact Site Settings singleton', () => {
  assert.match(SITE_SETTINGS_QUERY, /_type == "siteSettings" && _id == "siteSettings"/);

  for (const source of feedSources) {
    assert.match(source, /sanityFetch<SiteSettings \| null>\(SITE_SETTINGS_QUERY\)/);
    assert.match(source, /resolvePublicSiteFacts\(settings\)/);
    assert.doesNotMatch(source, /525 E Olympia Ave/);
    assert.doesNotMatch(source, /\(941\) 400-0165/);
    assert.doesNotMatch(source, /info@houseofrosefl\.com/);
    assert.doesNotMatch(source, /house\.of\.rose\.aesthetics/);
  }
});

test('AI-feed site facts remain one-line and preserve the current public output values', () => {
  const facts = resolvePublicSiteFacts({
    siteName: ' House of Rose Aesthetics ',
    address: '525 E Olympia Ave, Unit 9\nPunta Gorda, FL 33950',
    phone: ' (941) 400-0165 ',
    supportPhone: ' (844) 941-7673 ',
    email: ' info@houseofrosefl.com ',
    instagramHandle: '@house.of.rose.aesthetics',
  });

  assert.deepEqual(facts, {
    siteName: 'House of Rose Aesthetics',
    shortName: 'House of Rose',
    phone: '(941) 400-0165',
    supportPhone: '(844) 941-7673',
    email: 'info@houseofrosefl.com',
    address: '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
    addressWithExpandedRegion: '525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33950',
    instagramHandle: 'house.of.rose.aesthetics',
    instagramUrl: 'https://www.instagram.com/house.of.rose.aesthetics/',
  });

  for (const value of Object.values(facts)) {
    assert.doesNotMatch(value, /[\r\n]/, 'Resolved site facts must not break line-oriented feeds.');
  }
});

test('AI-feed site facts keep current build-safe values when the singleton is unavailable', () => {
  assert.deepEqual(resolvePublicSiteFacts(null), {
    siteName: 'House of Rose Aesthetics',
    shortName: 'House of Rose',
    phone: '(941) 400-0165',
    supportPhone: '(844) 941-7673',
    email: 'info@houseofrosefl.com',
    address: '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
    addressWithExpandedRegion: '525 E Olympia Ave, Unit 9, Punta Gorda, Florida 33950',
    instagramHandle: 'house.of.rose.aesthetics',
    instagramUrl: 'https://www.instagram.com/house.of.rose.aesthetics/',
  });
});
