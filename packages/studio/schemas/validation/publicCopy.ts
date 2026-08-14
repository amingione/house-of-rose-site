const RETIRED_OR_PROHIBITED_PUBLIC_COPY = [
  /!/,
  /\bageless\b/i,
  /\bamazing\b/i,
  /\banti[ -]?aging\b/i,
  /\battention to detail\b/i,
  /\bbest version of (?:yourself|you)\b/i,
  /\bboutique\b/i,
  /\bcur(?:e|es|ed|ing)\b/i,
  /\bdermatologists?\b/i,
  /\bdermatology specialists?\b/i,
  /\bexosomes?\b/i,
  /\bflawless\b/i,
  /\bglow(?:s|ed|ing)?\b/i,
  /\bglowtox\b/i,
  /\bgroupon\b/i,
  /\bguaranteed\b/i,
  /\bindulge\b/i,
  /\blux(?:e|ury)\b/i,
  /\bno[ -]?downtime\b/i,
  /\bpain[ -]?free\b/i,
  /\bpamper\b/i,
  /\bpremium\b/i,
  /\bradian(?:ce|t)\b/i,
  /\breverse[ -]?aging\b/i,
  /\bskin doctor\b/i,
  /\bstem[ -]?cells?\b/i,
  /\bsteady hands?\b/i,
  /\btimeless beauty\b/i,
  /\btransformation\b/i,
  /\btreat yourself\b/i,
  /\bturn back (?:time|the clock)\b/i,
] as const;

export function validatePublicCopy(value: string | undefined): true | string {
  if (!value) return true;

  // Exact current catalog names remain factual even when one word would be
  // retired as free-standing positioning language.
  const reviewableCopy = value.replace(/\bBeauty Glow IV\b/gi, 'verified IV service');
  const retiredPhrase = RETIRED_OR_PROHIBITED_PUBLIC_COPY.find((pattern) => pattern.test(reviewableCopy));

  return retiredPhrase
    ? 'Remove retired or prohibited language before publishing this public copy.'
    : true;
}
