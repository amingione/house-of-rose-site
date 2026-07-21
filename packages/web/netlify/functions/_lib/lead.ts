const BUSINESS_TIME_ZONE = 'America/New_York';

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
}

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
});

const getParts = (date: Date): ZonedParts => {
  const values = Object.fromEntries(
    partsFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    weekday: values.weekday,
  };
};

const timeZoneOffset = (date: Date): number => {
  const parts = getParts(date);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - date.getTime();
};

const easternDate = (year: number, month: number, day: number, hour: number): Date => {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));
  return new Date(guess.getTime() - timeZoneOffset(guess));
};

const isWeekend = (weekday: string): boolean => weekday === 'Sat' || weekday === 'Sun';

const nextBusinessMorning = (from: Date): Date => {
  let cursor = new Date(from);
  do {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  } while (isWeekend(getParts(cursor).weekday));

  const parts = getParts(cursor);
  return easternDate(parts.year, parts.month, parts.day, 11);
};

/** Two business hours during office hours, otherwise 11:00 AM next open day. */
export const getFollowUpDueAt = (submittedAt: Date): string => {
  const parts = getParts(submittedAt);

  if (!isWeekend(parts.weekday)) {
    if (parts.hour < 9) {
      return easternDate(parts.year, parts.month, parts.day, 11).toISOString();
    }

    if (parts.hour < 15 || (parts.hour === 15 && parts.minute === 0 && parts.second === 0)) {
      return new Date(submittedAt.getTime() + 2 * 60 * 60 * 1000).toISOString();
    }
  }

  return nextBusinessMorning(submittedAt).toISOString();
};

export const safeText = (value: string, maxLength = 500): string =>
  Array.from(value)
    .map((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint <= 31 || codePoint === 127 ? ' ' : character;
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);

export const safePathOrUrl = (value: string, maxLength = 1000): string => {
  const normalized = safeText(value, maxLength);
  if (!normalized) return '';

  if (normalized.startsWith('/')) return normalized;

  try {
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString().slice(0, maxLength) : '';
  } catch {
    return '';
  }
};
