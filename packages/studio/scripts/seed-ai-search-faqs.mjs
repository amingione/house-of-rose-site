/**
 * Seeds the plain-language "Essentials" FAQ into the siteSettings singleton.
 *
 * Usage:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-ai-search-faqs.mjs
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-ai-search-faqs.mjs --apply
 */
// @sanity/client v3 is CommonJS; a static `import { createClient }` fails under
// ESM, so it is loaded via dynamic import at point of use (see below).

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset.');
}

const faqs = [
  {
    _key: 'ai-what-is-house-of-rose',
    _type: 'faq',
    question: 'What is House of Rose?',
    answer: 'House of Rose Aesthetics is an advanced aesthetics and wellness studio and medical spa in Punta Gorda, Florida. The studio brings personalized skin, aesthetic, and wellness services together in a calm, unhurried setting for clients across Charlotte County and Southwest Florida. Walk-ins are welcome, and appointments are recommended to reserve a time.',
  },
  {
    _key: 'ai-where-is-house-of-rose',
    _type: 'faq',
    question: 'Where is House of Rose located?',
    answer: 'House of Rose Aesthetics is located at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. The studio serves Punta Gorda, Port Charlotte, Charlotte Harbor, Babcock Ranch, Burnt Store Marina, and Punta Gorda Isles.',
  },
  {
    _key: 'ai-services-offered',
    _type: 'faq',
    question: 'What services does House of Rose offer?',
    answer: 'House of Rose offers advanced facials and skin services, PRF, microneedling—including Procell Microchanneling—injectables, IV hydration, GLP-1 support, facial waxing, and Jane Iredale products. Service availability and candidacy vary by provider.',
  },
  {
    _key: 'ai-choose-treatment',
    _type: 'faq',
    question: 'How do I choose the right treatment?',
    answer: 'Start with a consultation or AI-assisted skin analysis so your goals, skin, preferences, and candidacy can guide the recommendation. A provider will explain suitable options and help you choose a service or sequence without pressure.',
  },
  {
    _key: 'ai-regenerative-aesthetics',
    _type: 'faq',
    question: 'Does House of Rose offer regenerative aesthetics?',
    answer: 'Yes. House of Rose offers PRF and microneedling services, including Procell Microchanneling. The right plan depends on your goals and candidacy, and final recommendations are confirmed by the appropriate provider.',
  },
  {
    _key: 'ai-treatment-cost',
    _type: 'faq',
    question: 'How much do treatments cost?',
    answer: 'Treatment investment varies by service, provider, treatment area, product, and whether a series is appropriate. Current options and starting prices are shown in the services menu; personalized recommendations may require a consultation before final pricing is confirmed.',
  },
  {
    _key: 'ai-treatment-plans',
    _type: 'faq',
    question: 'How do personalized treatment plans and series work?',
    answer: 'House of Rose builds recommendations around your goals, candidacy, timing, and preferred level of care. Services may be booked individually, while some treatments are available as a package or series when consistency and sequencing are appropriate.',
  },
  {
    _key: 'ai-treatment-safety',
    _type: 'faq',
    question: 'How does House of Rose approach treatment safety?',
    answer: 'Safety begins with appropriate consultation, candidacy review, and clear expectations. Not every client is a candidate for every service; final treatment recommendations are made by the appropriate licensed provider based on candidacy, contraindications, and local regulations, and individual outcomes vary.',
  },
  {
    _key: 'ai-book-consultation',
    _type: 'faq',
    question: 'How do I book a consultation?',
    answer: 'Call (844) 941-7673 to reserve a time, or review the service menu at https://houseofrose.glossgenius.com/services. Walk-ins are welcome; appointments are recommended for guaranteed timing.',
  },
  {
    _key: 'ai-house-of-rose-difference',
    _type: 'faq',
    question: 'What makes House of Rose different?',
    answer: 'House of Rose combines advanced aesthetics, wellness support, and personalized guidance in one private Punta Gorda studio. Visits are designed to feel focused and unhurried, with clear recommendations, thoughtful treatment sequencing, and natural-looking goals rather than a one-size-fits-all menu.',
  },
];

const content = {
  instagramHandle: 'house.of.rose.aesthetics',
  aiSearchFaqHeading: 'The Essentials',
  aiSearchFaqIntro: 'Direct answers about House of Rose Aesthetics, our Punta Gorda studio, and what to expect before you book.',
  aiSearchFaqs: faqs,
};

if (!shouldApply) {
  console.log(JSON.stringify(content, null, 2));
  console.log('\nDry run only. Add --apply to update the siteSettings document.');
  process.exit(0);
}

if (!token) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN.');
}

const sanityClientModule = await import('@sanity/client');
// This @sanity/client build exports the factory as the default; older/newer
// builds expose a named `createClient`. Resolve whichever is present.
const createClient =
  sanityClientModule.createClient ??
  sanityClientModule.default?.createClient ??
  sanityClientModule.default;
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

try {
  const settings = await client.fetch(`*[_id == "siteSettings" && _type == "siteSettings"][0]{ _id }`);

  if (!settings?._id) {
    throw new Error('The siteSettings singleton was not found; refusing to create a competing document.');
  }

  await client.patch('siteSettings').set(content).commit();
  console.log(`Updated siteSettings with ${faqs.length} Essentials FAQ entries.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Unknown Sanity update error.');
  process.exit(1);
}
