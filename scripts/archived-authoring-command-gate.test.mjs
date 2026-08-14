import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const scripts = packageJson.scripts ?? {};

const retiredTargets = [
  'implement-visibility-plan.mjs',
  'seed-rf-ipl-services.mjs',
  'prepare-humanized-copy.mjs',
  'reinforce-brand-search.mjs',
  'refresh-homepage-conversion-copy.mjs',
  'seed-about-providers.mjs',
  'remove-skinpen-service.mjs',
  'update-glo2facial-verified-copy.mjs',
  'correct-inmode-indications.mjs',
  'merge-microneedling-service.mjs',
  'reconcile-glossgenius-booking.mjs',
];

test('npm does not advertise archived copy migrations as runnable authoring workflows', () => {
  const advertised = Object.entries(scripts).flatMap(([name, command]) =>
    retiredTargets
      .filter((target) => String(command).includes(target))
      .map((target) => `${name} -> ${target}`),
  );

  assert.deepEqual(advertised, []);
});

test('reviewed active content commands remain available', () => {
  for (const name of [
    'content:daxxify-comparison',
    'content:daxxify-legacy-archive',
    'content:prf-injections-scope',
  ]) {
    assert.equal(typeof scripts[name], 'string', `${name} should remain available`);
  }
});
