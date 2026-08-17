import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAddToCartCta,
  getBrandCta,
  getProductLearnMoreCta,
  getProductPurchaseCta,
} from '../packages/web/src/lib/shopCta.ts';

test('shop defaults describe the control action instead of rotating marketing phrases', () => {
  const skincare = getProductPurchaseCta({ _id: 'skin-1', category: 'skincare' });
  const giftCard = getProductPurchaseCta({ _id: 'gift-1', category: 'gift-cards' });
  const accessory = getProductPurchaseCta({ _id: 'accessory-1', category: 'accessories' });

  assert.equal(skincare, giftCard);
  assert.equal(giftCard, accessory);
  assert.match(skincare, /\bshop\b[\s\S]*\bproduct\b/i);
  assert.match(getAddToCartCta({}), /\badd\b[\s\S]*\bcart\b/i);
  assert.match(getProductLearnMoreCta({ _id: 'detail-1' }), /\bproduct\b[\s\S]*\bdetails\b/i);

  const brandAction = getBrandCta({ _id: 'brand-1', title: 'Face Reality' });
  assert.match(brandAction, /\bshop\b/i);
  assert.match(brandAction, /\bFace Reality\b/i);
});

test('reviewed editor overrides remain available without whitespace drift', () => {
  assert.equal(
    getProductPurchaseCta({ _id: 'p-1', category: 'skincare', ctaLabel: '  View purchase options  ' }),
    'View purchase options',
  );
  assert.equal(getAddToCartCta({ ctaLabel: '  Add cleanser  ' }), 'Add cleanser');
  assert.equal(
    getProductLearnMoreCta({ _id: 'p-2', ctaLabel: '  View cleanser details  ' }),
    'View cleanser details',
  );
  assert.equal(
    getBrandCta({ _id: 'brand-2', title: 'GlyMed+', ctaLabel: '  View GlyMed+ products  ' }),
    'View GlyMed+ products',
  );
});
