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
 *   - Visit policy:         false appointment-only / no-walk-ins claims
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
  'packages/web/public',
  'packages/studio/schemas',
  'packages/web/netlify',
];

const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.stackbit']);
const TEXT_EXT = new Set([
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.md', '.mdx', '.css', '.html', '.txt', '.vcf',
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
  { label: 'Incorrect visit policy', re: /appointment[- ]only|walk-ins? (?:are )?not (?:offered|accepted)|no walk-ins?/i },
  { label: 'Unavailable SMS CTA (SMS verification is pending)', re: /call\s*(?:or|\/)\s*text|sms:\+?18449417673/i },
  { label: 'Retired GlossGenius host (use houseofrose.glossgenius.com)', re: /houseofrosefl\.glossgenius\.com/i },
  { label: 'Old Instagram profile', re: /instagram\.com\/houseofrosefl\/?|@houseofrosefl(?!\.com)\b/i },
  { label: 'Old Facebook profile', re: /facebook\.com\/(?:people\/)?House-Of-Rose-Aesthetics/i },
  { label: 'Old Facebook profile-ID URL (use /hofraesthetics)', re: /facebook\.com\/profile\.php\?id=61590233534310/i },
  { label: 'Wrong opening date (use June 15, 2026)', re: /July 9,? 2026/i },
  { label: 'Retired SkinPen service', re: /\bSkinPen\b/i },
  { label: 'Retired microneedling/microchanneling service split', re: /\b(?:microchanneling\s*(?:\/|&|and|or|vs\.?|versus)\s*microneedling|microneedling\s*(?:\/|&|and|or|vs\.?|versus)\s*microchanneling|regular microneedling)\b/i },
];

/**
 * WARN-ONLY tier — cliché and high-risk language signals retained during the voice reset.
 *
 * These are reported but do NOT fail the build. They identify strings for human review; they do
 * not certify voice quality and must never be "fixed" with mechanical synonym substitution.
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
  // Risk-detector patterns name retired phrases so CMS copy can be flagged for source review.
  /\.replace\(\/.*(?:guaranteed results|treat yourself|best version of yourself|instant transformation)/i,
  // Exact catalog/vendor names are facts, not House of Rose voice. "Beauty Glow IV"
  // is the current GlossGenius service name; the other matches are Jane Iredale SKUs.
  /Beauty Glow IV|Glow Time|Radiance-Boosting|Skintuition/i,
  // Cosmetic *finish* vocabulary. "Radiant coverage" is a foundation finish type (the
  // opposite of matte) and is Jane Iredale's own term — technical product language, not a
  // brand pillar. Bare "radiance"/"radiant" in brand copy is still flagged.
  /radiant (?:coverage|foundation|finish)/i,
];

/**
 * Reviewed, documented exception. Put `drift-guard-ok: <reason>` on the offending line or the
 * line immediately above it (eslint-disable-next-line style) when a retired phrase is factually
 * correct for that exact procedure and has been reviewed by the appropriate owner or clinician.
 * The reason is required: a bare marker exempts nothing.
 */
const REVIEWED_EXCEPTION = /drift-guard-ok:\s*\S+/;

// Historical membership URLs must be hard-not-found responses. A homepage
// redirect keeps the retired URLs alive in GSC as redirecting pages.
const RETIRED_ROUTE_CONFIGS = [
  '/memberships/*',
  '/rose-circle/*',
  '/plans/*',
  '/aundrea/*',
  '/aundrea.vcf',
  '/services/professional-makeup/*',
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
    const reviewed = REVIEWED_EXCEPTION.test(text) || REVIEWED_EXCEPTION.test(lines[i - 1] ?? '');
    const publicCopyDetector = rel.endsWith('packages/web/src/lib/publicCopy.ts')
      && (/\.replace\(/.test(text) || /\.match\(/.test(text) || /^\s*\//.test(text) || /^\s*\? \/\\b/.test(text));
    if (!reviewed && !publicCopyDetector && !WARN_EXEMPT.some((re) => re.test(text))) {
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
    `\n⚠️  drift-guard: ${warnings.length} copy-risk warning(s) ` +
    '(human review signal — does NOT fail the build):\n',
  );
  for (const w of warnings) {
    console.warn(`  ${w.file}:${w.line}  [${w.label}]`);
    console.warn(`      ${w.text}`);
  }
  console.warn(
    '\nReview these in their exact context. Fix source copy when needed, or narrow the detector' +
    '\nwhen the match is code, product nomenclature, or another documented false positive.\n',
  );
}

if (hits.length === 0) {
  console.log('✅ drift-guard: fact and retired-term checks passed. This is not a voice-quality certification.');
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
