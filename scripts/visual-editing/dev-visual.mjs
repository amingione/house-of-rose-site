/**
 * dev-visual.mjs — local Netlify Visual Editor (Stackbit) launcher.
 *
 * WHY a custom runner
 * -------------------
 * `stackbit dev` does NOT start the framework dev server itself — it runs an
 * editor/proxy on :8090 and forwards preview requests to a dev server it expects
 * on http://localhost:3000. (The `devCommand` in stackbit.config.ts is used by
 * the *cloud* Netlify Visual Editor container, not local `stackbit dev`.) So
 * locally we must start Astro on :3000 ourselves, then start Stackbit.
 *
 * Astro is launched from inside `packages/web` (cwd) so `@astrojs/tailwind`
 * resolves `tailwind.config` — launching from the repo root yields empty
 * Tailwind `content` and HTTP 500 on every page. `run-with-env` loads the
 * repo-root `.env.local` regardless of cwd.
 *
 * Order: extract schema → start Astro :3000 → wait until it serves → start
 * Stackbit. Ctrl-C (or either child dying) tears both down.
 */
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WEB = path.join(ROOT, 'packages/web');
const ASTRO_PORT = 3000; // the port Stackbit proxies its preview to
// Astro defaults to binding `localhost`, which on macOS is often IPv6 [::1].
// Stackbit also proxies to `localhost:3000`, so we leave Astro on its default
// host (matching Stackbit) and probe BOTH stacks for readiness.
const PROBE_HOSTS = ['127.0.0.1', '::1'];

/** @type {import('node:child_process').ChildProcess[]} */
const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  // Give children a moment, then force exit.
  setTimeout(() => process.exit(code), 500);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

function run(label, command, args, opts = {}) {
  const child = spawn(command, args, { stdio: 'inherit', ...opts });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(`\n[dev-visual] ${label} exited (code=${code} signal=${signal}); shutting down.`);
      shutdown(code ?? 0);
    }
  });
  return child;
}

function probe(host, port) {
  return new Promise((resolve) => {
    const req = http.get({ host, port, path: '/', timeout: 3000 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForHttp(port, hosts, timeoutMs = 90_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (shuttingDown) return;
      const results = await Promise.all(hosts.map((h) => probe(h, port)));
      if (results.some(Boolean)) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Astro did not start on :${port} within ${timeoutMs}ms`));
        return;
      }
      setTimeout(tick, 1000);
    };
    tick();
  });
}

async function main() {
  // 1. Extract the Sanity schema for the Stackbit connector (one-shot; fatal on
  //    failure — surface problems immediately in local dev). Spawned directly so
  //    its normal exit does NOT trigger the long-running-child shutdown handler.
  const extract = spawn(
    process.execPath,
    [path.join(ROOT, 'scripts/visual-editing/extract-sanity-schema.mjs')],
    { stdio: 'inherit', cwd: ROOT },
  );
  const [extractCode] = await once(extract, 'exit');
  if (extractCode !== 0) {
    console.error('[dev-visual] schema extraction failed — aborting.');
    process.exit(extractCode ?? 1);
  }
  if (shuttingDown) return;

  // 2. Start Astro on :3000 from packages/web (cwd) with repo-root env.
  console.log(`[dev-visual] starting Astro on http://localhost:${ASTRO_PORT} …`);
  run(
    'astro',
    process.execPath,
    [
      path.join(ROOT, 'scripts/run-with-env.mjs'),
      path.join(ROOT, 'node_modules/.bin/astro'),
      'dev',
      '--port',
      String(ASTRO_PORT),
    ],
    { cwd: WEB },
  );

  // 3. Wait for Astro to actually serve before starting the editor proxy.
  await waitForHttp(ASTRO_PORT, PROBE_HOSTS);
  if (shuttingDown) return;
  console.log('[dev-visual] Astro is up — starting Stackbit editor …');

  // 4. Start Stackbit (editor/proxy on :8090 → forwards to :3000).
  run('stackbit', path.join(ROOT, 'node_modules/.bin/stackbit'), ['dev'], { cwd: ROOT });
}

main().catch((err) => {
  console.error('[dev-visual] FAILED:', err?.stack || err);
  shutdown(1);
});
