/// <reference types="astro/client" />

// @polgubau/astro-reveal's "./styles" export maps to a plain .css file with
// no extension in the specifier, so Astro's built-in `*.css` ambient module
// pattern (which matches on extension) never matches this import. Declare it
// explicitly so `import '@polgubau/astro-reveal/styles'` type-checks.
declare module '@polgubau/astro-reveal/styles';

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_BOOKING_EMAIL: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GSC_VERIFY?: string;
  readonly PUBLIC_COMING_SOON?: string;
  readonly SANITY_API_WRITE_TOKEN?: string;
  readonly RESEND_API_KEY?: string;
  readonly PRIVACY_SUPPORT_FROM?: string;
  readonly PRIVACY_SUPPORT_TO?: string;
  readonly PUBLIC_SANITY_API_READ_TOKEN?: never;
  readonly PUBLIC_SANITY_API_WRITE_TOKEN?: never;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
