import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const researchRoot = new URL('../docs/GOVERNANCE/internal_only/research/', import.meta.url);

const routeGuidanceBriefs = [
  'C02_CARBOXY_GLO2FACIAL/glo2facial.md',
  'PRF/prf-injections-ezgel.md',
  'PRF/prf-topical.md',
  '_prf-source-library.md',
  'advanced-skin-imaging.md',
  'biorepeel.md',
  'carboxy-therapy.md',
  'dermaplaning.md',
  'face-reality-acne-program.md',
  'product-lines.md',
];

const retiredOrAdHocRoute = new RegExp(
  [
    '`/guides/',
    '`/services/collections/skin-renewal/',
    '`/services/collections/injectables-aesthetics/',
    '`/services/microchanneling/',
    '`/services/prf-microneedling/',
    '`/packages/prf-microchanneling-journey/',
  ].join('|'),
  'i',
);

test('active research points writers to current canonical routes', () => {
  for (const relativePath of routeGuidanceBriefs) {
    const brief = readFileSync(new URL(relativePath, researchRoot), 'utf8');
    assert.doesNotMatch(
      brief,
      retiredOrAdHocRoute,
      `${relativePath} still recommends a retired redirect or ad-hoc page shape.`,
    );
  }
});

test('active acne research recognizes the generated concern route', () => {
  for (const relativePath of ['face-reality-acne-program.md', 'product-lines.md']) {
    const brief = readFileSync(new URL(relativePath, researchRoot), 'utf8');
    assert.match(brief, /\/concerns\/active-acne\//);
    assert.doesNotMatch(brief, /only `acne-scarring` exists|missing anchor/i);
  }
});

test('dormant storefront research cannot act as current route or price authority', () => {
  const productLines = readFileSync(new URL('product-lines.md', researchRoot), 'utf8');

  assert.match(productLines, /storefront is opt-in and remains disabled/i);
  assert.match(productLines, /GlossGenius and `ALL-SERVICES-PRICING\.MD`/);
  assert.match(productLines, /not[\s\S]{0,80}current public inventory/i);
  assert.doesNotMatch(productLines, /Sanity \(the price source of truth\)/i);
});

test('active route guidance does not prescribe retired brand language', () => {
  for (const relativePath of routeGuidanceBriefs) {
    const brief = readFileSync(new URL(relativePath, researchRoot), 'utf8');
    assert.doesNotMatch(
      brief,
      /\bflawless\b/i,
      `${relativePath} still recommends retired outcome language.`,
    );
  }
});

test('unsupported facial concepts do not retain active treatment briefs', () => {
  for (const relativePath of [
    'enzyme-exfoliation.md',
    'hydrodermabrasion.md',
    'light-peels.md',
  ]) {
    assert.equal(
      existsSync(new URL(relativePath, researchRoot)),
      false,
      `${relativePath} must not act as service authority without a current appointment.`,
    );
  }

  const currentResearch = routeGuidanceBriefs.map((relativePath) =>
    readFileSync(new URL(relativePath, researchRoot), 'utf8')).join('\n');
  assert.doesNotMatch(currentResearch, /\/services\/hydrodermabrasion\//i);
  assert.doesNotMatch(currentResearch, /\/compare\/(?:glo2facial-vs-hydrodermabrasion|hydrodermabrasion-vs-glo2facial)\//i);
});

test('PRF research cannot regenerate the rejected strategy artifact', () => {
  assert.equal(
    existsSync(new URL(
      'compass_artifact_wf-116088fa-2d44-4fdf-a81e-8886533f95e6_text_markdown.md',
      researchRoot,
    )),
    false,
    'The raw PRF strategy artifact must not remain available as drafting authority.',
  );

  const prfResearch = [
    'PRF/prf-injections-ezgel.md',
    'PRF/prf-topical.md',
  ].map((relativePath) => readFileSync(new URL(relativePath, researchRoot), 'utf8')).join('\n');

  assert.doesNotMatch(
    prfResearch,
    /signature stack|signature treatment|price to the local luxury band|provider lane|retail follow-through|recurring revenue/i,
  );
  assert.doesNotMatch(
    prfResearch,
    /Proposed new pages|\/concerns\/hair-thinning\/|\/services\/prf-microneedling\/|\/services\/prf-body-treatments\//i,
  );
  assert.match(prfResearch, /Medical Director: Joshua Shaw, MD · FL Lic\. ME136232/);
});
