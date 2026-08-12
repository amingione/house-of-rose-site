/**
 * Public storefront visibility.
 *
 * The shop is intentionally opt-in while it is temporarily hidden. Set
 * PUBLIC_SHOP_ENABLED=true at build time to restore shop navigation, cart UI,
 * sitemap entries, product routes, and the Merchant Center feed.
 */
export const SHOP_ENABLED = import.meta.env.PUBLIC_SHOP_ENABLED === 'true';
