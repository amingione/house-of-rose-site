import type { SiteSettings } from './queries';

const FALLBACK_SITE_FACTS = {
  siteName: 'House of Rose Aesthetics',
  phone: '(941) 400-0165',
  supportPhone: '(844) 941-7673',
  email: 'info@houseofrosefl.com',
  address: '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
  instagramHandle: 'house.of.rose.aesthetics',
} as const;

function oneLine(value: string | undefined, fallback: string): string {
  return (
    value
      ?.trim()
      .replace(/\s*[\r\n]+\s*/g, ', ')
      .replace(/[\t ]+/g, ' ') || fallback
  );
}

export interface PublicSiteFacts {
  siteName: string;
  shortName: string;
  phone: string;
  supportPhone: string;
  email: string;
  address: string;
  addressWithExpandedRegion: string;
  instagramHandle: string;
  instagramUrl: string;
}

/** Resolve canonical public identity and NAP without allowing line breaks into text feeds. */
export function resolvePublicSiteFacts(
  settings: SiteSettings | null | undefined,
): PublicSiteFacts {
  const siteName = oneLine(settings?.siteName, FALLBACK_SITE_FACTS.siteName);
  const address = oneLine(settings?.address, FALLBACK_SITE_FACTS.address);
  const rawInstagramHandle = oneLine(
    settings?.instagramHandle,
    FALLBACK_SITE_FACTS.instagramHandle,
  );
  const instagramHandle =
    rawInstagramHandle.replace(/^@+/, '').trim() || FALLBACK_SITE_FACTS.instagramHandle;

  return {
    siteName,
    shortName: siteName.replace(/\s+Aesthetics$/, ''),
    phone: oneLine(settings?.phone, FALLBACK_SITE_FACTS.phone),
    supportPhone: oneLine(settings?.supportPhone, FALLBACK_SITE_FACTS.supportPhone),
    email: oneLine(settings?.email, FALLBACK_SITE_FACTS.email),
    address,
    addressWithExpandedRegion: address.replace(/, FL (\d{5}(?:-\d{4})?)$/, ', Florida $1'),
    instagramHandle,
    instagramUrl: `https://www.instagram.com/${instagramHandle}/`,
  };
}
