/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly PUBLIC_SANITY_API_VERSION: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_BOOKING_EMAIL: string;
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
