import assert from 'node:assert/strict';
import test from 'node:test';

import { promotion } from '../packages/studio/schemas/promotion.ts';
import { ALL_PROMOTIONS_QUERY } from '../packages/web/src/lib/queries.ts';

type PromotionField = {
  name?: string;
  description?: string;
  fields?: PromotionField[];
  validation?: unknown;
};

function field(name: string): PromotionField | undefined {
  return promotion.fields.find((candidate) => candidate.name === name) as PromotionField | undefined;
}

function publicCopyValidator(target: PromotionField | undefined, label: string) {
  assert.equal(typeof target?.validation, 'function', `${label} must validate public copy.`);
  assert.match(String(target.validation), /validatePublicCopy/);

  const rule = {
    required() {
      return this;
    },
    custom(fn: (value: string | undefined) => true | string) {
      return { validate: fn };
    },
  };
  return target.validation(rule).validate as (value: string | undefined) => true | string;
}

test('promotion prompts request factual context without a sales-copy formula', () => {
  assert.match(String(field('headline')?.description), /plainly/i);
  assert.match(String(field('headline')?.description), /do not add urgency/i);
  assert.match(String(field('teaser')?.description), /specific, verified product context/i);
  assert.match(String(field('teaser')?.description), /avoid a generic sales line/i);
  assert.match(String(field('ctaLabel')?.description), /destination clear/i);
});

test('every promotion string rendered by PromoBanner uses the shared public-copy guard', () => {
  const image = field('image');
  assert.ok(image?.fields && Array.isArray(image.fields));
  const imageAlt = image.fields.find(({ name }) => name === 'alt');

  for (const [label, target, factual, rejected] of [
    ['headline', field('headline'), 'Face Reality products are back in stock', 'Premium skin transformation!'],
    ['teaser', field('teaser'), 'Three cleanser sizes are available in the current catalog.', 'Indulge in a flawless glow.'],
    ['CTA label', field('ctaLabel'), 'View Face Reality products', 'Shop the luxe collection!'],
    ['image alt', imageAlt, 'Face Reality cleansers on the House of Rose shelf.', 'A radiant premium display.'],
  ] as const) {
    const validate = publicCopyValidator(target, label);
    assert.equal(validate(factual), true);
    assert.match(String(validate(rejected)), /retired or prohibited/i);
  }

  for (const projectedField of ['headline', 'teaser', 'ctaLabel', 'alt']) {
    assert.match(
      ALL_PROMOTIONS_QUERY,
      new RegExp(`\\b${projectedField}\\b`),
      `${projectedField} must remain part of the public promotion projection.`,
    );
  }
});
