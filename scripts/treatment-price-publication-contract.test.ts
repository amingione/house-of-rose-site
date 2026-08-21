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

// House of Rose pricing is never public (binding 2026-08-20, see CLAUDE.md
// "Public website pricing is NEVER permitted"). `formatPriceRange` and
// `treatmentOffer` remain as generic, pure formatting helpers (useful for
// internal ops / GlossGenius paste-ready docs, per the repo's Two-Menu
// architecture) and are exercised directly above — but neither may be wired
// to a real value on any public route. This test asserts the disclosure
// boundary at both call sites: the component never prints a formatted price,
// and the one route that used to read a Sanity price hardcodes it to
// `undefined` so the JSON-LD `Offer`/`AggregateOffer` branch can never fire.
test('the visible price block and the service-page JSON-LD never disclose a price', () => {
  const component = readFileSync(
    new URL('../packages/web/src/components/treatment/PriceRangeBlock.astro', import.meta.url),
    'utf8',
  );
  const route = readFileSync(
    new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url),
    'utf8',
  );

  // PriceRangeBlock must never call formatPriceRange (or otherwise format its
  // `priceRange` prop) into visible copy — it accepts the prop only to keep
  // existing callers type-checking and shows a booking CTA instead.
  assert.doesNotMatch(component, /formatPriceRange\(/);
  assert.match(component, /Ask about current pricing when you book/i);

  // The route must hardcode reviewedPriceRange to undefined — never read
  // `service.priceRange` — so both <PriceRangeBlock> and treatmentOffer()
  // are structurally unreachable with a real price.
  assert.match(route, /const reviewedPriceRange = undefined;/);
  assert.doesNotMatch(route, /const reviewedPriceRange = service\.priceRange/);
  assert.match(route, /const offerSchema = reviewedPriceRange\s*\n?\s*\?\s*treatmentOffer/);
});
