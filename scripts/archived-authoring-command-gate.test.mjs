import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
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
  ]) {
    assert.equal(typeof scripts[name], 'string', `${name} should remain available`);
  }
});

test('the retired service-page template patch fails closed before editing source', () => {
  const targetUrl = new URL('../packages/web/src/pages/services/[slug].astro', import.meta.url);
  const before = readFileSync(targetUrl, 'utf8');
  const result = spawnSync(process.execPath, ['scripts/patch-service-page.mjs', '--dry'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /Archived by the 2026-08-13 voice reset/);
  assert.equal(readFileSync(targetUrl, 'utf8'), before);
});
