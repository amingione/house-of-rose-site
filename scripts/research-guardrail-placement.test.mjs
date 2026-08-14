import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const researchRoot = new URL('../docs/GOVERNANCE/internal_only/research/', import.meta.url);

const activeBriefs = [
  'C02_CARBOXY_GLO2FACIAL/glo2facial.md',
  'PRF/prf-topical.md',
  'PROCELL/procell.md',
  'advanced-skin-imaging.md',
  'biorepeel.md',
  'dermal-fillers.md',
  'dermaplaning.md',
  'enzyme-exfoliation.md',
  'glp-1.md',
  'hydrodermabrasion.md',
  'light-peels.md',
  'neurotoxins.md',
  'product-lines.md',
];

const blanketRule = new RegExp(
  [
    'required guardrails on (?:the|any|every)(?: neurotoxin)? surface',
    'compliance banner for every surface',
    'every surface must carry',
    'every surface carries',
    'provider-authority language is mandatory on every surface',
    'required guardrails on every retail surface',
  ].join('|'),
  'i',
);

test('active research places safeguards with relevant claims instead of every surface', () => {
  for (const relativePath of activeBriefs) {
    const brief = readFileSync(new URL(relativePath, researchRoot), 'utf8');
    assert.doesNotMatch(brief, blanketRule, `${relativePath} still requires boilerplate on every surface.`);
    assert.match(
      brief,
      /(?:place safeguards|claims and safety boundaries|where the content creates the need|where the capability creates the need)/i,
      `${relativePath} must retain a contextual safeguard-placement rule.`,
    );
  }
});

test('active research does not recommend retired glow or escalation framing', () => {
  const lightPeels = readFileSync(new URL('light-peels.md', researchRoot), 'utf8');
  const biorepeel = readFileSync(new URL('biorepeel.md', researchRoot), 'utf8');

  assert.doesNotMatch(lightPeels, /naming law:[^\n]*"Glow Peel"/i);
  assert.doesNotMatch(biorepeel, /no-downtime advantage|a true ladder|private studio|RN assistant/i);
});

test('active research uses the current practice category and direct language', () => {
  const briefs = [
    'C02_CARBOXY_GLO2FACIAL/glo2facial.md',
    'advanced-skin-imaging.md',
    'carboxy-therapy.md',
    'light-peels.md',
  ];

  for (const relativePath of briefs) {
    const brief = readFileSync(new URL(relativePath, researchRoot), 'utf8');
    assert.doesNotMatch(
      brief,
      /private studio|lead "advanced aesthetics & wellness"|pre-event glow|maintenance\/glow|pampers|radiance" cluster|smart-first-step funnel|brand promise|three expert lanes|right treatment, honest lane|clean cross-lane handoffs|glow \+ awake|serious advanced-aesthetics/i,
      `${relativePath} still teaches superseded positioning or canned funnel language.`,
    );
  }
});
