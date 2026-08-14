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
  'face-reality-acne-program.md',
  'glp-1.md',
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
  const biorepeel = readFileSync(new URL('biorepeel.md', researchRoot), 'utf8');

  assert.doesNotMatch(
    biorepeel,
    /no-downtime advantage|a true ladder|private studio|RN assistant|provider-split|provider lane|retail follow-through|event-ready|wins when|wins for/i,
  );
  assert.match(biorepeel, /do not infer[\s\S]{0,240}downtime[\s\S]{0,160}aftercare/i);
});

test('active research uses the current practice category and direct language', () => {
  const briefs = [
    'C02_CARBOXY_GLO2FACIAL/glo2facial.md',
    'advanced-skin-imaging.md',
    'carboxy-therapy.md',
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

test('GLP research cannot regenerate a clinical script or cross-sell pathway', () => {
  const glp = readFileSync(new URL('glp-1.md', researchRoot), 'utf8');

  assert.match(glp, /do not publish dosing, titration, administration instructions/i);
  assert.doesNotMatch(
    glp,
    /provider lane|wellness & restoration lane|retail follow-through|downstream aesthetic pathway|whole-journey wellness|start low, go slow|monthly in-person check-ins|faceless online subscription|Ozempic face/i,
  );
});

test('dermal filler research cannot regenerate a clinical script or cross-sell pathway', () => {
  const fillers = readFileSync(new URL('dermal-fillers.md', researchRoot), 'utf8');

  assert.match(fillers, /Place safeguards where the content creates the need/i);
  assert.doesNotMatch(
    fillers,
    /^## (?:The visit|Pairings & pathways|Journey links|Why House of Rose)|retail follow-through|skin analysis.*first|frequently paired|classic "relax \+ restore"/im,
  );
});

test('Face Reality research cannot regenerate a clinical script, offer rule, or sales pathway', () => {
  const faceReality = readFileSync(new URL('face-reality-acne-program.md', researchRoot), 'utf8');

  assert.match(faceReality, /Place safeguards where the content creates the need/i);
  assert.match(faceReality, /ordinary price does not by itself create a free, discounted, or credited offer/i);
  assert.doesNotMatch(
    faceReality,
    /provider lane|program wins|rule of thumb|pairings & pathways|retail follow-through|the retail closes the loop|clear, then refine|guided journey|purging is expected|titration|mandelic acid|benzoyl peroxide|Accutane|6–8 weeks|3–6 months|72-hour disclosure/i,
  );
});

test('dormant retail research cannot regenerate a treatment-to-product sales ladder', () => {
  const products = readFileSync(new URL('product-lines.md', researchRoot), 'utf8');

  assert.match(products, /No automatic treatment-to-product pathway/i);
  assert.match(products, /Storefront restoration is one coordinated release, not a copy toggle/i);
  assert.match(products, /Place safeguards where the content creates the need/i);
  assert.doesNotMatch(
    products,
    /retail follow-through|natural first (?:professional )?purchase|universal close|retail entry ladder|rule of thumb|when it wins|results you paid for|the retail closes the loop|why house of rose|provider lane/i,
  );
});
