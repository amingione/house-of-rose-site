const LONG_BRAND = 'House of Rose Aesthetics';
const SHORT_BRAND = 'House of Rose';
/** SERP display budget. Exported so callers can shape a title that fits instead of being truncated. */
export const SEO_TITLE_LIMIT = 60;
const TITLE_LIMIT = SEO_TITLE_LIMIT;

const cleanSeparators = (value: string): string =>
  value
    .replace(/\s*[|—–-]\s*house of rose.*$/i, '')
    .replace(/\bhouse of rose(?: aesthetics)?\b/gi, '')
    .replace(/\s*[|—–-]\s*$/, '')
    .replace(/^\s*[|—–-]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

const truncateAtWord = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;

  const shortened = value.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  const lastSpace = shortened.lastIndexOf(' ');
  const wordSafe = lastSpace >= Math.floor(maxLength * 0.65)
    ? shortened.slice(0, lastSpace)
    : shortened;

  return `${wordSafe.trimEnd()}…`;
};

/** Produces one readable, non-duplicated title within the SERP target. */
export const formatSeoTitle = (title: string, siteName = LONG_BRAND): string => {
  const suppliedTitle = (title || siteName).trim();

  // The homepage intentionally leads with the full business name so close brand
  // variants such as "rose aesthetics" resolve to the same local entity. Keep a
  // concise, already-complete brand-first title verbatim instead of moving the
  // brand to the end with the general inner-page formatter below.
  if (
    suppliedTitle.length <= TITLE_LIMIT
    && /^house of rose aesthetics\s*[|—–-]/i.test(suppliedTitle)
  ) {
    return suppliedTitle;
  }

  const cleaned = cleanSeparators(suppliedTitle);
  const normalizedSiteName = siteName.trim() || LONG_BRAND;

  if (
    !cleaned
    || cleaned.toLowerCase() === normalizedSiteName.toLowerCase()
    || cleaned.toLowerCase() === SHORT_BRAND.toLowerCase()
  ) {
    return normalizedSiteName;
  }

  const longTitle = `${cleaned} | ${normalizedSiteName}`;
  if (longTitle.length <= TITLE_LIMIT) return longTitle;

  const shortTitle = `${cleaned} | ${SHORT_BRAND}`;
  if (shortTitle.length <= TITLE_LIMIT) return shortTitle;

  const available = TITLE_LIMIT - ` | ${SHORT_BRAND}`.length;
  return `${truncateAtWord(cleaned, available)} | ${SHORT_BRAND}`;
};
