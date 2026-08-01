#!/usr/bin/env node
/**
 * Drift guard — fails the build/commit if retired or wrong-fact strings reappear
 * in the shipping source. Mirrors the FAS Motorsports drift discipline.
 *
 * Scope: only the code that ships to users (site source, Sanity schemas, functions).
 * Docs under `docs/` are intentionally NOT scanned — they legitimately reference these
 * terms as *retired / historical*.
 *
 * Banned = things that must never appear as CURRENT in shipping code:
 *   - Wrong NAP:            33982 (zip), 7376 (phone)
 *   - Retired routes/ids:   /memberships, /rose-circle, /plans route, membershipsPage,
 *                           roseCirclePage, MembershipTiers, membershipGroup,
 *                           PUBLIC_MEMBERSHIPS/REGENERATIVE_PLANS queries
 *   - Retired programs:     Rose Circle, Rose Rewards, Rose Method, Rose Pass,
 *                           Collagen Bank, House Collective
 *   - Dead botanical names: Gilded Lily, Porcelain Petal, Camellia Peel, Lumière,
 *                           Clarity Session
 *   - Positioning:          "day spa"  (NOTE: "med spa" is allowed — not banned)
 *   - Visit policy:         appointment-only / no-walk-ins claims
 *   - GBP identity:         old social URLs, unavailable SMS CTAs, direct online-booking CTA,
 *                           wrong legal name, and July 9 opening date
 *
 * Usage:  node scripts/drift-guard.mjs        (exit 1 on any hit)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Only scan shipping source. Docs/history are excluded on purpose.
const SCAN_DIRS = [
  'packages/web/src',
  'packages/studio/schemas',
  'packages/web/netlify',
];

const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.stackbit']);
const TEXT_EXT = new Set([
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.md', '.mdx', '.css', '.html', '.txt',
]);

/** Each rule: human label + regex (case-insensitive unless it's a digit string). */
const RULES = [
  { label: 'Wrong ZIP (use 33950)', re: /33982/ },
  { label: 'Wrong phone fragment (use …7673)', re: /\b\d{3}[-.\s]?\d{3}[-.\s]?7376\b|\)\s?\d{3}[-.\s]?7376|7376\b(?=[^0-9])/ },
  { label: 'Wrong legal name (use House of Rose Aesthetics LLC)', re: /House of Rose LLC(?!", "House of Rose Aesthetics LLC")/ },
  { label: 'Retired route /memberships', re: /\/memberships(\/|"|'|`|\b)/ },
  { label: 'Retired route /rose-circle', re: /\/rose-circle(\/|"|'|`|\b)/ },
  { label: 'Retired route /plans', re: /["'`]\/plans\/?["'`]|href=["'`]\/plans/ },
  { label: 'Retired schema/component id', re: /membershipsPage|roseCirclePage|MembershipTiers|membershipGroup|PUBLIC_MEMBERSHIPS|REGENERATIVE_PLANS|ALL_MEMBERSHIP/ },
  { label: 'Retired program name', re: /Rose Circle|Rose Rewards|Rose Method|Rose Pass|Collagen Bank|House Collective/i },
  { label: 'Dead botanical name', re: /Gilded Lily|Porcelain Petal|Camellia Peel|Lumi[eè]re|Clarity Session/i },
  { label: 'Banned positioning "day spa"', re: /day spa/i },
  { label: 'Wrong visit policy (walk-ins are welcome)', re: /appointment[- ]only|walk-ins? (?:are )?not (?:offered|accepted)|no walk-ins?/i },
  { label: 'Unavailable SMS CTA (SMS verification is pending)', re: /call\s*(?:or|\/)\s*text|sms:\+?18449417673/i },
  { label: 'Direct online-booking CTA (use consultation/contact or services menu)', re: /\bBook Online\b|houseofrose\.glossgenius\.com\/book/ },
  { label: 'Old Instagram profile', re: /instagram\.com\/houseofrosefl\/?|@houseofrosefl(?!\.com)\b/i },
  { label: 'Old Facebook profile', re: /facebook\.com\/(?:people\/)?House-Of-Rose-Aesthetics/i },
  { label: 'Old Facebook profile-ID URL (use /hofraesthetics)', re: /facebook\.com\/profile\.php\?id=61590233534310/i },
  { label: 'Wrong opening date (use June 15, 2026)', re: /July 9,? 2026/i },
];

/** @type {{file:string, line:number, label:string, text:string}[]} */
const hits = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (TEXT_EXT.has(path.extname(name))) {
      scanFile(full);
    }
  }
}

function scanFile(file) {
  const rel = path.relative(ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((text, i) => {
    for (const { label, re } of RULES) {
      if (re.test(text)) {
        hits.push({ file: rel, line: i + 1, label, text: text.trim().slice(0, 120) });
      }
    }
  });
}

for (const d of SCAN_DIRS) walk(path.join(ROOT, d));

if (hits.length === 0) {
  console.log('✅ drift-guard: clean — no retired/wrong-fact strings in shipping source.');
  process.exit(0);
}

console.error(`\n❌ drift-guard: ${hits.length} banned string(s) found in shipping source:\n`);
for (const h of hits) {
  console.error(`  ${h.file}:${h.line}  [${h.label}]`);
  console.error(`      ${h.text}`);
}
console.error(
  '\nThese are retired or wrong per CLAUDE.md. Fix them, or — if this is a genuine,' +
  '\nintentional exception — narrow the rule in scripts/drift-guard.mjs.' +
  '\n(Reminder: "med spa" is allowed; only "day spa" is banned.)\n'
);
process.exit(1);
