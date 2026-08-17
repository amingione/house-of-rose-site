export const PUBLIC_PROVIDER_DIGITAL_CARDS = [
  { slug: 'amber', title: 'Amber', path: '/amber/' },
  { slug: 'diana', title: 'Diana', path: '/diana/' },
  { slug: 'brandy', title: 'Brandy', path: '/brandy/' },
] as const;

export const PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES = [
  { slug: 'amber', title: 'Amber profile', path: '/images/providers/amber-profile-1122.webp' },
  { slug: 'brandy', title: 'Brandy profile', path: '/images/providers/brandy-profile-1122.webp' },
  { slug: 'diana', title: 'Diana profile', path: '/images/providers/diana-profile-1122.webp' },
] as const;

export const PUBLIC_PROVIDER_STATIC_PROFILE_IMAGE_PATHS =
  PUBLIC_PROVIDER_STATIC_PROFILE_IMAGES.map(({ path }) => path);

export const PUBLIC_PROVIDER_DIGITAL_CARD_PATHS = PUBLIC_PROVIDER_DIGITAL_CARDS.map(
  ({ path }) => path,
);

export type PublicProviderDigitalCardSlug = (typeof PUBLIC_PROVIDER_DIGITAL_CARDS)[number]['slug'];

export function getPublicProviderDigitalCardPath(
  slug: PublicProviderDigitalCardSlug,
): (typeof PUBLIC_PROVIDER_DIGITAL_CARD_PATHS)[number] {
  const card = PUBLIC_PROVIDER_DIGITAL_CARDS.find((candidate) => candidate.slug === slug);
  if (!card) throw new Error(`Missing public provider digital-card route for ${slug}.`);
  return card.path;
}

export function isPublicProviderDigitalCardPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    PUBLIC_PROVIDER_DIGITAL_CARD_PATHS.some((path) => path === value)
  );
}

export function isPublicProviderStaticProfileImagePath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    PUBLIC_PROVIDER_STATIC_PROFILE_IMAGE_PATHS.some((path) => path === value)
  );
}
