import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Anchor .env.local to the repo root (this script lives in <root>/scripts/), so
// the env loads correctly even when invoked from a different cwd — e.g. the
// Visual Editor devCommand runs Astro from inside packages/web. Falls back to a
// cwd-relative .env.local for any caller that relies on the old behavior.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const [, , ...command] = process.argv;

if (command.length === 0) {
  console.error('Usage: node scripts/run-with-env.mjs <command> [...args]');
  process.exit(1);
}

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const equalsIndex = trimmed.indexOf('=');

  if (equalsIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();

  if (!key) {
    return null;
  }

  const quote = value.at(0);

  if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

try {
  let envFile;
  try {
    envFile = readFileSync(join(REPO_ROOT, '.env.local'), 'utf8');
  } catch (rootError) {
    if (rootError.code !== 'ENOENT') throw rootError;
    envFile = readFileSync('.env.local', 'utf8'); // cwd fallback
  }

  for (const line of envFile.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);

    if (parsed) {
      const [key, value] = parsed;
      process.env[key] = value;
    }
  }
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

process.env.ASTRO_TELEMETRY_DISABLED ??= '1';

const child = spawn(command[0], command.slice(1), {
  env: process.env,
  stdio: 'inherit',
});

// Forward termination signals to the child so it doesn't get orphaned when a
// parent (e.g. the Visual Editor launcher) tears us down.
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    if (!child.killed) child.kill(signal);
  });
}

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 0);
});
