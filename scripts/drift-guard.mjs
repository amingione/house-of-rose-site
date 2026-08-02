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

/**
 * WARN-ONLY tier — retired brand language per the House of Rose Creative System v1.0
 * (`docs/House_of_Rose_Creative_System/`, Book 1 §12 "Retired language").
 *
 * These are reported but do NOT fail the build, on purpose: the lead-descriptor sweep is
 * still open (P0 in docs/DRIFT-CLEANUP-CHECKLIST.md), so shipping source legitimately still
 * contains some of these today. Promote a rule into RULES above once its sweep is done.
 */
const WARN_RULES = [
  { label: 'Retired positioning (luxury/luxe/premium/boutique as self-description)', re: /\b(luxury|luxe|premium|boutique)\b/i },
  { label: 'Retired beauty language (glow/radiance/flawless/ageless/timeless beauty)', re: /\b(glow|glowing|radiance|radiant|flawless|ageless)\b|timeless beauty/i },
  { label: 'Retired spa language (pamper/indulge/treat yourself)', re: /\b(pamper(ing|ed)?|indulge|indulgent)\b|treat yourself/i },
  { label: 'Retired outcome language (transformation/turn back time/best version)', re: /instant transformation|turn back (?:the )?(?:time|clock)|best version of yourself|reveal your beauty/i },
  { label: 'Unqualified claim (pain-free / blanket "no downtime" / guaranteed results)', re: /\bpain[- ]free\b|\bno downtime\b|guaranteed results/i },
  { label: 'Superseded lead descriptor (lead is "Medical Aesthetics Practice")', re: /lead with ["'“]?advanced aesthetics/i },
];

/**
 * Lines exempt from WARN_RULES only (never from RULES). The retired-language rules target
 * *brand copy*; these are not brand copy, and leaving them in makes the warn tier noisy
 * enough to be ignored — which defeats the point.
 */
const WARN_EXEMPT = [
  // Code/CSS/markup comments — implementation notes, not customer-facing words.
  /^\s*(?:\/\/|\/\*|\*(?!\/)|<!--)/,
  // Real vendor product names we resell. "Glow Time" is Jane Iredale's SKU, not our voice.
  /Glow Time|Radiance-Boosting|Skintuition/i,
];

// Historical membership URLs must be hard-not-found responses. A homepage
// redirect keeps the retired URLs alive in GSC as redirecting pages.
const RETIRED_ROUTE_CONFIGS = [
  '/memberships/*',
  '/rose-circle/*',
  '/plans/*',
];

/** @type {{file:string, line:number, label:string, text:string}[]} */
const hits = [];

/** Same shape as `hits`, but never affects the exit code. */
/** @type {{file:string, line:number, label:string, text:string}[]} */
const warnings = [];

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
    if (!WARN_EXEMPT.some((re) => re.test(text))) {
      for (const { label, re } of WARN_RULES) {
        if (re.test(text)) {
          warnings.push({ file: rel, line: i + 1, label, text: text.trim().slice(0, 120) });
        }
      }
    }
  });
}

for (const d of SCAN_DIRS) walk(path.join(ROOT, d));

const netlifyConfig = readFileSync(path.join(ROOT, 'packages/web/netlify.toml'), 'utf8');
for (const route of RETIRED_ROUTE_CONFIGS) {
  const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const routeBlock = netlifyConfig.match(
    new RegExp(`\\[\\[redirects\\]\\][\\s\\S]*?from\\s*=\\s*["']${escapedRoute}["'][\\s\\S]*?(?=\\n\\[\\[redirects\\]\\]|$)`),
  )?.[0];

  if (!routeBlock || !/to\s*=\s*["']\/404\.html["']/.test(routeBlock) || !/status\s*=\s*404\b/.test(routeBlock) || !/force\s*=\s*true\b/.test(routeBlock)) {
    hits.push({
      file: 'packages/web/netlify.toml',
      line: 1,
      label: 'Retired membership route must return a forced 404',
      text: route,
    });
  }
}

function reportWarnings() {
  if (warnings.length === 0) return;
  console.warn(
    `\n⚠️  drift-guard: ${warnings.length} retired brand-language warning(s) ` +
    '(Creative System Book 1 §12 — does NOT fail the build):\n',
  );
  for (const w of warnings) {
    console.warn(`  ${w.file}:${w.line}  [${w.label}]`);
    console.warn(`      ${w.text}`);
  }
  console.warn(
    '\nThese are retired per docs/House_of_Rose_Creative_System/. Some are expected until the' +
    '\nlead-descriptor sweep lands (P0 in docs/DRIFT-CLEANUP-CHECKLIST.md). Rewrite them in' +
    '\nCreative System voice, or narrow the rule in scripts/drift-guard.mjs if it is a false positive.\n',
  );
}

if (hits.length === 0) {
  console.log('✅ drift-guard: clean — no retired/wrong-fact strings in shipping source.');
  reportWarnings();
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
reportWarnings();
process.exit(1);
