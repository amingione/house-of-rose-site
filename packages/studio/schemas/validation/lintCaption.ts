export type LintViolation = {
  rule: string;
  message: string;
  excerpt?: string;
};

export type LintResult = {
  passed: boolean;
  violations: LintViolation[];
};

const BANNED_PHRASES: RegExp[] = [
  /\bdelve\b/i,
  /\belevate\b/i,
  /\bunlock\b/i,
  /\btransform(ative)?\b/i,
  /\bjourney\b/i,
  /\bnestled\b/i,
  /\bseamless\b/i,
  /\bgame[- ]?changer\b/i,
  /\brevolutioniz\w*/i,
  /\bsay goodbye to\b/i,
  /\blook no further\b/i,
  /\bin today'?s world\b/i,
  /\bwhen it comes to\b/i,
  /\bthe secret to\b/i,
  /\bwe'?ve got you covered\b/i,
  /\byour skin deserves\b/i,
  /\bunlock your best skin\b/i,
  /\belevate your self-?care routine\b/i,
];

const NEGATIVE_PARALLELISM = /\bit'?s not (just|only) [^,.;]+,\s*it'?s\b/i;
const RHETORICAL_OPENER = /^\s*(ever|have you ever|what if|did you know)\b/i;
const EM_DASH = /—/g;
const HAS_SPECIFICITY = /\d|(minutes?|hours?|days?|weeks?|sessions?)\b/i;

/**
 * Flags common AI-marketing tells in a caption. Pure function, no
 * network calls. Passing does not mean the copy is good — it only
 * means it's clear of the known patterns.
 */
export function lintCaption(caption: string): LintResult {
  const text = caption.trim();
  const violations: LintViolation[] = [];

  if (!text) {
    return { passed: false, violations: [{ rule: 'empty', message: 'Caption is empty' }] };
  }

  for (const pattern of BANNED_PHRASES) {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        rule: 'banned-phrase',
        message: `Remove AI-marketing phrase: "${match[0]}"`,
        excerpt: match[0],
      });
    }
  }

  if (NEGATIVE_PARALLELISM.test(text)) {
    violations.push({
      rule: 'negative-parallelism',
      message: 'Remove the "it\'s not just X, it\'s Y" construction',
    });
  }

  if (RHETORICAL_OPENER.test(text)) {
    violations.push({
      rule: 'rhetorical-opener',
      message: 'Do not open with a rhetorical question',
    });
  }

  const emDashCount = (text.match(EM_DASH) ?? []).length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount > 0 && emDashCount / wordCount > 0.02) {
    violations.push({
      rule: 'em-dash-density',
      message: `Too many em dashes (${emDashCount} in ${wordCount} words) — vary the punctuation`,
    });
  }

  if (!HAS_SPECIFICITY.test(text)) {
    violations.push({
      rule: 'missing-specificity',
      message: 'Add a concrete detail: a number, a timeframe, or a downtime window',
    });
  }

  return { passed: violations.length === 0, violations };
}
