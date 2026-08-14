import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../docs/GOVERNANCE/internal_only/research/', import.meta.url);

const read = (relativePath) => readFileSync(new URL(relativePath, root), 'utf8');

const collectMarkdown = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) return collectMarkdown(child);
    return entry.name.endsWith('.md') ? [readFileSync(child, 'utf8')] : [];
  });

const activePricingBriefs = [
  'C02_CARBOXY_GLO2FACIAL/glo2facial.md',
  'PRF/prf-injections-ezgel.md',
  'PRF/prf-topical.md',
  'PROCELL/procell.md',
  'advanced-skin-imaging.md',
  'biorepeel.md',
  'carboxy-therapy.md',
  'dermal-fillers.md',
  'dermaplaning.md',
  'face-reality-acne-program.md',
  'glp-1.md',
  'iv-hydration.md',
  'neurotoxins.md',
  'product-lines.md',
];

test('active research does not prescribe pricing euphemisms or sales ladders', () => {
  const corpus = collectMarkdown(root).join('\n');
  const activeCorpus = activePricingBriefs.map(read).join('\n');

  assert.doesNotMatch(corpus, /\binvestment\b/i);
  assert.doesNotMatch(
    activeCorpus,
    /starting at|value play|intended sell|sell the series|soft cross-sell|impulse\/gift\/loyalty/i,
  );
});

test('active research does not direct authors to retired treatment routes', () => {
  const activeCorpus = activePricingBriefs
    .map(read)
    .join('\n')
    .split('\n')
    .filter((line) => !line.includes('docs/internal_only/'))
    .join('\n');

  assert.doesNotMatch(
    activeCorpus,
    /\/services\/(?:prf-microneedling|microneedling-body|prf-body-treatments|microchanneling|Procell-microchanneling-body|microneedling-corrective|biorepeel-advanced-acne-scarring|acne-peel|back-treatment|lightstim-led-therapy|neck-decollete-extension)\//i,
  );
});

test('research mirrors the current high-risk service price facts', () => {
  const glo2 = read('C02_CARBOXY_GLO2FACIAL/glo2facial.md');
  assert.match(glo2, /\$225, 60-minute standalone appointment/i);
  assert.doesNotMatch(glo2, /\$185|\$499|\$885/);

  const carboxy = read('carboxy-therapy.md');
  assert.match(carboxy, /CO2 Lift Carboxy — Facial \(standalone\)[^\n]*\*\*\$175\*\*[^\n]*60 min/i);
  assert.match(carboxy, /CO2 Lift Carboxy — Add-On[^\n]*\*\*\$100\*\*[^\n]*30 min/i);
  assert.match(carboxy, /Staff-added only; booking off by design/i);
  assert.doesNotMatch(carboxy, /not current GlossGenius inventory|unbookable research concept/i);

  const iv = read('iv-hydration.md');
  for (const row of [
    /Hydration IV \| \*\*\$99\*\* \| 30 min/,
    /Immunity IV \| \$160 \| 45 min/,
    /Recovery IV \| \$175 \| 45 min/,
    /Beauty Glow IV \| \$170 \| 45 min/,
    /Reboot \(Hangover Recovery\) IV \| \$165 \| 45 min/,
    /Myers' Cocktail IV \| \$185 \| 45 min/,
  ]) assert.match(iv, row);
  assert.doesNotMatch(iv, /From \$129|Hydration IV[^\n]*\$100/i);
  assert.match(iv, /current menu does not verify the\s+complete formulation/i);
  assert.doesNotMatch(
    iv,
    /build IV therapy into your wellness rhythm|same skin goals|sustaining at-home|vitamin-C serum|glutathione add-on[^\n]*\$|NAD\+[^\n]*\$/i,
  );

  const procell = read('PROCELL/procell.md');
  for (const fact of [/\$50[^\n]*60-minute/i, /\$300[^\n]*55 minutes/i, /\$400[^\n]*55 minutes/i, /\$595[^\n]*60 minutes/i]) {
    assert.match(procell, fact);
  }
  assert.doesNotMatch(procell, /\$250|\$325|\$349|\$675|\$875|\$1,200|\$1,560|\$1,675/);

  const biorepeel = read('biorepeel.md');
  for (const amount of ['$250', '$699', '$325', '$450', '$395']) {
    assert.ok(biorepeel.includes(amount), `BioRePeel research must retain ${amount}.`);
  }
  assert.doesNotMatch(biorepeel, /\$295|\$1,050|\$1,560/);

  const faceReality = read('face-reality-acne-program.md');
  assert.match(faceReality, /consultation[^\n]*\*\*\$99\*\*[^\n]*60 min/i);
  assert.match(faceReality, /Acne Bootcamp[^\n]*\*\*\$899\*\*[^\n]*60 min/i);
  for (const row of [
    /Face Reality Acne Peel #1[^\n]*\*\*\$135\*\*[^\n]*50 min/i,
    /Face Reality Acne Peel #2[^\n]*\*\*\$155\*\*[^\n]*45 min/i,
    /Face Reality Bright Skin Peel[^\n]*\*\*\$165\*\*[^\n]*45 min/i,
    /Face Reality Acne Back Peel[^\n]*\*\*\$205\*\*[^\n]*10 min/i,
  ]) assert.match(faceReality, row);
  assert.match(faceReality, /staff-arranged[^\n]*booking off/i);
  assert.doesNotMatch(faceReality, /From \$139|From \$159|\$429|\$765/);
});

test('injectable and topical PRF research preserves current names and unknowns', () => {
  const topical = read('PRF/prf-topical.md');
  assert.match(topical, /PRF Microneedling — Consultation \| \$595 \| 60 minutes/i);
  assert.doesNotMatch(topical, /From \$425|From \$475|From \$599|\+\$175|\+\$200/);
  assert.doesNotMatch(topical, /EZ-?Gel|signature stack|provider lane|retail follow-through/i);

  const injectable = read('PRF/prf-injections-ezgel.md');
  assert.match(injectable, /PRF Under-Eye — Consultation \| \$495 \| Confirm by phone/i);
  assert.match(injectable, /PRF Bio-Filler — Consultation \| \$899 \| 45 minutes/i);
  assert.match(injectable, /Do not call PRF Bio-Filler `EZ-Gel`/i);
  assert.match(injectable, /do not create `\/services\/ez-gel-bio-filler\/`/i);
  assert.doesNotMatch(injectable, /\$650|\$700|\$775|\$800|\$1,700|signature treatment|luxury band/i);
});

test('skin imaging research preserves the current paid optional appointment', () => {
  const skinAnalysis = read('advanced-skin-imaging.md');

  assert.match(skinAnalysis, /Skin Analysis & Consultation \| \$65 \| Direct online booking/i);
  assert.match(skinAnalysis, /it is optional/i);
  assert.doesNotMatch(
    skinAnalysis,
    /complimentary|no-pressure|no price listed|microchanneling from|PRF microneedling from|Glo2Facial from|BioRePeel from/i,
  );
});

test('GLP, dermaplaning, fillers, and neurotoxins use exact current structures', () => {
  const glp = read('glp-1.md');
  assert.match(glp, /\$25, 40-minute[\s\S]{0,40}consultation/i);
  assert.doesNotMatch(glp, /\$(?:225|299|325|349|399)(?:\/month)?/);
  assert.match(glp, /medication and ongoing\s+program prices must be confirmed/i);

  const dermaplaning = read('dermaplaning.md');
  assert.match(dermaplaning, /\$135[^\n]*50-minute standalone/i);
  assert.match(dermaplaning, /\$45[^\n]*25-minute add-on/i);

  const fillers = read('dermal-fillers.md');
  assert.match(fillers, /\$650–\$850 range/i);
  assert.match(fillers, /Consultation is \$300/i);
  assert.match(fillers, /does not establish that PRF\s+Bio-Filler is EZ-Gel/i);

  const neurotoxins = read('neurotoxins.md');
  assert.match(neurotoxins, /\$14(?: per unit|\/unit)/i);
  assert.match(neurotoxins, /product-specific/i);
});
