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
];

const blanketRule = new RegExp(
  [
    'required guardrails on (?:the|any|every)(?: neurotoxin)? surface',
    'compliance banner for every surface',
    'every surface must carry',
    'every surface carries',
    'provider-authority language is mandatory on every surface',
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
