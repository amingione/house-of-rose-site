const LONG_BRAND = 'House of Rose Aesthetics';
const SHORT_BRAND = 'House of Rose';
const TITLE_LIMIT = 60;

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
  const cleaned = cleanSeparators(title || siteName);
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
