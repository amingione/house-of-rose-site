const VERIFIED_SERVICE_DURATIONS: Readonly<Record<string, string>> = {
  'permanent-jewelry': '20 minutes',
  'iv-hydration-therapy': '30–45 minutes',
  'dermal-fillers': '30–45 minutes',
  'facial-waxing': '10–30 minutes by area',
};

export const getVerifiedServiceDuration = (slug: string): string | undefined =>
  VERIFIED_SERVICE_DURATIONS[slug];
