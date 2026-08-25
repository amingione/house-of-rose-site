export const GLOSSGENIUS_HOST = 'houseofrose.glossgenius.com';
export const GLOSSGENIUS_SERVICES_URL = `https://${GLOSSGENIUS_HOST}/services`;
export const SKIN_ANALYSIS_BOOKING_URL = `https://${GLOSSGENIUS_HOST}/book?service_token=1000f-ad93f96c-64b0-4a51-959b-4301ca28039c`;
export const PRACTICE_PHONE_HREF = 'tel:+19414000165';

const GLOSSGENIUS_BOOKING_PATHS = new Set(['/book', '/services']);

export type BookingMode = 'direct' | 'consultation' | 'phone';

export interface ServiceBookingSource {
  slug: string;
  bookingMode?: BookingMode;
  bookingUrl?: string;
}

export interface BookingAction {
  href: string;
  label: string;
  mode: BookingMode;
  external: boolean;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  analytics: {
    'data-booking-service': string;
    'data-booking-mode': BookingMode;
    'data-cta-location': string;
  };
}

export const isVerifiedGlossGeniusBookingUrl = (value: string | undefined): boolean => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname === GLOSSGENIUS_HOST &&
      GLOSSGENIUS_BOOKING_PATHS.has(url.pathname) &&
      Boolean(url.searchParams.get('service_token')?.trim())
    );
  } catch {
    return false;
  }
};

export const resolveServiceBooking = (
  service: ServiceBookingSource,
  ctaLocation: string,
): BookingAction => {
  const mode = service.bookingMode ?? (isVerifiedGlossGeniusBookingUrl(service.bookingUrl) ? 'direct' : 'phone');
  const hasVerifiedExternalUrl =
    mode !== 'phone' && isVerifiedGlossGeniusBookingUrl(service.bookingUrl);

  if (!hasVerifiedExternalUrl) {
    return {
      href: PRACTICE_PHONE_HREF,
      label: 'Call to discuss',
      mode: 'phone',
      external: false,
      analytics: {
        'data-booking-service': service.slug,
        'data-booking-mode': 'phone',
        'data-cta-location': ctaLocation,
      },
    };
  }

  return {
    href: service.bookingUrl as string,
    label: mode === 'consultation' ? 'Schedule a consultation' : 'Book this service',
    mode,
    external: true,
    target: '_blank',
    rel: 'noopener noreferrer',
    analytics: {
      'data-booking-service': service.slug,
      'data-booking-mode': mode,
      'data-cta-location': ctaLocation,
    },
  };
};
