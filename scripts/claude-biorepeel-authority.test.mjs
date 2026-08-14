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
