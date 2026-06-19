import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

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
  const envFile = readFileSync('.env.local', 'utf8');

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

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }

  process.exit(code ?? 0);
});
