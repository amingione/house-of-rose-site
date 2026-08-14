import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const governanceRoot = fileURLToPath(new URL('../docs/GOVERNANCE/internal_only/', import.meta.url));
const repositoryRoot = resolve(governanceRoot, '../../..');

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
  });
}

test('active governance documents reference the current governance tree', () => {
  const files = markdownFiles(governanceRoot);
  const staleReferences = files.flatMap((path) => {
    const lines = readFileSync(path, 'utf8').split('\n');
    return lines.flatMap((line, index) =>
      line.includes('docs/internal_only/') ? [`${path}:${index + 1}`] : [],
    );
  });

  assert.deepEqual(
    staleReferences,
    [],
    `Governance documents still reference the retired docs/internal_only tree:\n${staleReferences.join('\n')}`,
  );

  const missingReferences = files.flatMap((path) => {
    const source = readFileSync(path, 'utf8');
    return [...source.matchAll(/`(docs\/GOVERNANCE\/internal_only\/[^`]+)`/g)].flatMap(
      ([, reference]) => {
        if (/[*{}]/.test(reference) || existsSync(join(repositoryRoot, reference))) return [];
        return [`${path}: ${reference}`];
      },
    );
  });

  assert.deepEqual(
    missingReferences,
    [],
    `Governance documents contain missing current-tree references:\n${missingReferences.join('\n')}`,
  );
});
