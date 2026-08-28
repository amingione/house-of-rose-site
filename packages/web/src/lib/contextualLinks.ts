export interface ContextualLinkCandidate {
  href: string;
  phrases: readonly string[];
}

export interface ContextualTextSegment {
  text: string;
  href?: string;
}

interface ServiceLinkSource {
  slug: string;
  title: string;
}

interface ContextualizeOptions {
  currentPath: string;
  maxLinks?: number;
  usedHrefs?: Set<string>;
}

const SERVICE_PHRASES: Readonly<Record<string, readonly string[]>> = {
  injectables: ['neurotoxins', 'Botox and Daxxify', 'Botox', 'Daxxify'],
  'dermal-fillers': ['dermal fillers', 'hyaluronic-acid fillers', 'fillers'],
  prf: ['Injectable PRF', 'platelet-rich fibrin', 'PRF'],
  microneedling: ['microneedling'],
  morpheus8: ['Morpheus8', 'fractional radiofrequency microneedling'],
  'lumecca-peak-ipl': ['Lumecca Peak IPL', 'Lumecca Peak'],
  'forma-rf-facial': ['Forma RF Facial', 'Forma'],
  'face-reality-acne-program': ['Face Reality Acne Program', 'Face Reality program'],
  'iv-hydration-therapy': ['IV hydration', 'IV therapy'],
  'glp-1-weight-management': ['GLP-1 weight management', 'weight-management services'],
  biorepeel: ['BioRePeel'],
  glo2facial: ['Glo2Facial'],
  dermaplaning: ['dermaplaning'],
};

const normalizePath = (path: string): string => {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  if (pathname === '/') return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const isWordCharacter = (value: string | undefined): boolean =>
  value !== undefined && /[\p{L}\p{N}]/u.test(value);

const hasPhraseBoundary = (text: string, start: number, length: number): boolean =>
  !isWordCharacter(text[start - 1]) && !isWordCharacter(text[start + length]);

const findPhrase = (text: string, phrase: string, fromIndex: number): number => {
  const haystack = text.toLocaleLowerCase('en-US');
  const needle = phrase.toLocaleLowerCase('en-US');
  let index = haystack.indexOf(needle, fromIndex);

  while (index !== -1 && !hasPhraseBoundary(text, index, phrase.length)) {
    index = haystack.indexOf(needle, index + 1);
  }

  return index;
};

export const serviceContextualLink = (
  service: ServiceLinkSource,
): ContextualLinkCandidate => ({
  href: `/services/${service.slug}/`,
  phrases: Array.from(new Set([service.title, ...(SERVICE_PHRASES[service.slug] ?? [])])),
});

export const contextualizeText = (
  text: string,
  candidates: readonly ContextualLinkCandidate[],
  { currentPath, maxLinks = 2, usedHrefs = new Set<string>() }: ContextualizeOptions,
): ContextualTextSegment[] => {
  if (maxLinks <= 0 || candidates.length === 0) return [{ text }];

  const current = normalizePath(currentPath);
  const eligible = candidates
    .filter((candidate) => normalizePath(candidate.href) !== current && !usedHrefs.has(candidate.href))
    .flatMap((candidate) =>
      candidate.phrases
        .filter((phrase) => phrase.trim().length > 1)
        .map((phrase) => ({ href: candidate.href, phrase })),
    );

  const segments: ContextualTextSegment[] = [];
  let cursor = 0;
  let linkCount = 0;

  while (cursor < text.length && linkCount < maxLinks) {
    let next: { href: string; phrase: string; index: number } | undefined;

    for (const candidate of eligible) {
      if (usedHrefs.has(candidate.href)) continue;
      const index = findPhrase(text, candidate.phrase, cursor);
      if (index === -1) continue;
      if (!next || index < next.index || (index === next.index && candidate.phrase.length > next.phrase.length)) {
        next = { ...candidate, index };
      }
    }

    if (!next) break;
    if (next.index > cursor) segments.push({ text: text.slice(cursor, next.index) });

    const end = next.index + next.phrase.length;
    segments.push({ text: text.slice(next.index, end), href: next.href });
    usedHrefs.add(next.href);
    cursor = end;
    linkCount += 1;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
};
