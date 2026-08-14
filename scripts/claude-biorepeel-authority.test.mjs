import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const claude = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8');

test('binding BioRePeel rules follow the current provider and commerce authority', () => {
  assert.match(
    claude,
    /Amber uses BioRePeel only as an add-on to an eligible advanced skin service/i,
    'The binding provider rule must preserve Amber’s add-on-only boundary.',
  );
  assert.match(
    claude,
    /no independent(?:ly verified)? add-on price[^\n]*current GlossGenius ledger/i,
    'The binding rule must not invent an independent BioRePeel add-on price.',
  );
  assert.match(
    claude,
    /Brandy provides standalone BioRePeel[^\n]*face appointment and Series of 3/i,
    'The binding provider rule must preserve Brandy’s current standalone and Series of 3 menu.',
  );
  assert.doesNotMatch(
    claude,
    /BioRePeel[^\n]{0,160}\+\$65|\+\$65[^\n]{0,160}BioRePeel/i,
    'CLAUDE.md must not regenerate the unsupported +$65 BioRePeel price.',
  );
  assert.doesNotMatch(
    claude,
    /Brandy[^\n]{0,180}BioRePeel[^\n]{0,100}series of 4/i,
    'CLAUDE.md must not describe the current standalone booking option as a series of 4.',
  );
});

test('binding series rules distinguish protocol material from live appointment inventory', () => {
  assert.match(
    claude,
    /Protocol guidance is not public appointment inventory/i,
    'CLAUDE.md must not promote manufacturer cadence into a public menu rule.',
  );
  assert.match(
    claude,
    /GlossGenius-backed ledger lists one BioRePeel Series of 3/i,
    'The binding rule must preserve the sole current series appointment.',
  );
  assert.match(
    claude,
    /does not list a\s+Procell, Glo2Facial, or general Microneedling series/i,
    'The binding rule must keep unsupported series out of public inventory.',
  );
  assert.doesNotMatch(
    claude,
    /Procell\s*=\s*series|Glo2Facial\s*=\s*\*\*3\/6\*\*|microneedling\s*=\s*\*\*3–6\*\*/i,
    'Retired series-count shorthand must not return to the governing rules.',
  );
});
