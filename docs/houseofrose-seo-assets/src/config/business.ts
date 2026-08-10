// src/config/business.ts
// Single source of truth for NAP + business facts. Every schema component reads from here.
// >>> Fill in every TODO with your real, verified details, and keep them IDENTICAL to your
//     Google Business Profile / Yelp / Facebook listings (entity consistency = AI trust). <<<

export const business = {
  name: "House of Rose Aesthetics",
  legalName: "House of Rose Aesthetics", // TODO: legal entity name if different
  url: "https://houseofrosefl.com",
  logo: "https://houseofrosefl.com/logo.png", // TODO: real logo URL (square, >=112x112)
  image: "https://houseofrosefl.com/storefront.jpg", // TODO: real photo of the location
  description:
    "Medical spa in Punta Gorda, FL offering Morpheus8, microneedling, PRF/PRP, injectables, facials, IV hydration therapy and more, serving Charlotte and Lee County.",
  telephone: "+1-941-000-0000", // TODO: real phone in E.164 format
  email: "hello@houseofrosefl.com", // TODO
  priceRange: "$$",

  address: {
    streetAddress: "TODO 123 Example St, Suite 100",
    addressLocality: "Punta Gorda",
    addressRegion: "FL",
    postalCode: "TODO 33950",
    addressCountry: "US",
  },

  // TODO: exact coordinates of your front door (get from Google Maps → right-click → copy)
  geo: { latitude: 26.9298, longitude: -82.0454 },

  // Cities you serve (used for areaServed). Order = priority.
  areaServed: [
    "Punta Gorda, FL",
    "Port Charlotte, FL",
    "Fort Myers, FL",
    "Cape Coral, FL",
    "Charlotte County, FL",
    "Lee County, FL",
  ],

  // Opening hours — TODO: set your real hours. Format: [day(s), open, close]
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "10:00", closes: "16:00" },
    // Sunday closed → omit
  ],

  // All your other profiles — critical for the schema `sameAs` (entity disambiguation).
  sameAs: [
    "https://www.google.com/maps/place/TODO", // Google Business Profile
    "https://www.instagram.com/TODO",
    "https://www.facebook.com/TODO",
    "https://www.yelp.com/biz/TODO",
    // "https://www.healthgrades.com/TODO",
  ],
} as const;

export type Business = typeof business;
