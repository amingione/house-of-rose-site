export const PUBLIC_PROVIDER_DIGITAL_CARDS = [
  { slug: 'amber', title: 'Amber', path: '/amber/' },
  { slug: 'diana', title: 'Diana', path: '/diana/' },
  { slug: 'brandy', title: 'Brandy', path: '/brandy/' },
] as const;

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
