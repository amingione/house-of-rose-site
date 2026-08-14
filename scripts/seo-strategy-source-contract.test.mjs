import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const architecturePath = new URL(
  '../docs/HRAaudits/letaido-findings/Service-Page-Architecture-2026-08-11.md',
  import.meta.url,
);
const competitorPath = new URL(
  "../docs/HRAaudits/letaido-findings/Second-Pass-—-Amber's-Named-Competitors-2026-08-11.md",
  import.meta.url,
);
const demandPath = new URL(
  '../docs/HRAaudits/letaido-findings/houseofrose-local-demand-2026-08-10.csv',
  import.meta.url,
);

const architecture = readFileSync(architecturePath, 'utf8');
const competitorStudy = readFileSync(competitorPath, 'utf8');
const demand = readFileSync(demandPath, 'utf8');
const strategySources = `${architecture}\n${competitorStudy}\n${demand}`;

test('SEO strategy sources cannot reintroduce permanently retired programs', () => {
  assert.doesNotMatch(
    strategySources,
    /\b(?:wax pass|waxing membership|laser hair removal membership)\b|\/memberships\//i,
  );
});

test('service architecture cannot create unsupported routes or branded equivalence', () => {
  assert.doesNotMatch(architecture, /\/services\/brazilian-wax\//i);
  assert.doesNotMatch(architecture, /glo2facial[^\n]{0,180}hydrafacial|hydrafacial[^\n]{0,180}glo2facial/i);
});

test('service architecture keeps geographic intent out of service title templates', () => {
  assert.doesNotMatch(architecture, /\*\*H1:\*\*[^\n]*(?:near me|punta gorda)/i);
  assert.doesNotMatch(architecture, /\*\*Title tag:\*\*[^\n]*(?:near me|punta gorda|port charlotte)/i);
  assert.match(architecture, /geographic intent handled by the `localArea` page type/i);
});
