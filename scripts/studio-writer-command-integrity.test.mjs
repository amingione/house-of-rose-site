import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const rootPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const studioPackage = JSON.parse(
  readFileSync(new URL('../packages/studio/package.json', import.meta.url), 'utf8'),
);

test('root commands delegate only to implemented Studio workspace scripts', () => {
  const missingTargets = Object.entries(rootPackage.scripts ?? {}).flatMap(([name, command]) => {
    const target = String(command).match(/\bnpm run ([\w:-]+) -w packages\/studio\b/)?.[1];
    return target && !studioPackage.scripts?.[target] ? [`${name} -> ${target}`] : [];
  });

  assert.deepEqual(missingTargets, []);
});
