import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { treatmentOffer } from '../packages/web/src/lib/structuredData.treatment.ts';
import { formatPriceRange, type TreatmentPriceRange } from '../packages/web/src/lib/treatmentQueries.ts';

const exactPrice: TreatmentPriceRange = {
  minPrice: 475,
  unit: 'session',
};

test('one verified numeric value stays an exact price in visible and structured output', () => {
  assert.equal(formatPriceRange(exactPrice), '$475 per session');
  assert.equal(formatPriceRange({ ...exactPrice, maxPrice: 475 }), '$475 per session');
  assert.doesNotMatch(formatPriceRange(exactPrice), /\bfrom\b|starting at|investment/i);

  const offer = treatmentOffer({
    url: 'https://houseofrosefl.com/services/example/',
    name: 'Example Service',
    priceRange: exactPrice,
  });
  assert.equal(offer['@type'], 'Offer');
  assert.equal(offer.price, 475);
  assert.equal(offer.lowPrice, undefined);
  assert.equal(offer.highPrice, undefined);
});

test('a genuine low and high price remains an explicit range', () => {
  const range: TreatmentPriceRange = {
    minPrice: 195,
    maxPrice: 595,
    unit: 'session',
  };

  assert.equal(formatPriceRange(range), '$195–$595 per session');

  const offer = treatmentOffer({
    url: 'https://houseofrosefl.com/services/example/',
    name: 'Example Service',
    priceRange: range,
  });
  assert.equal(offer['@type'], 'AggregateOffer');
  assert.equal(offer.lowPrice, 195);
  assert.equal(offer.highPrice, 595);
  assert.equal(offer.price, undefined);
});

test('the visible block and JSON-LD use the same reviewed price-range authority', () => {
  const component = readFileSync(
    new URL('../packages/web/src/components/treatment/PriceRangeBlock.astro', import.meta.url),
    'utf8',
  );
  const route = readFileSync(
    new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
    'utf8',
  );

  assert.match(component, /formatPriceRange\(priceRange\)/);
  assert.match(route, /<PriceRangeBlock[\s\S]*?priceRange=\{reviewedPriceRange\}/);
  assert.match(route, /treatmentOffer\(\{[\s\S]*?priceRange:\s*reviewedPriceRange/);
});
