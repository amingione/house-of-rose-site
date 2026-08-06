/**
 * Refresh the canonical Glo2Facial service copy.
 *
 * Owner-verified operational fact, 2026-08-06: Glo2Facial has no downtime.
 * The copy deliberately avoids the retired glow/radiance framing while keeping
 * the exact, procedure-specific downtime statement.
 */

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) throw new Error('Missing Sanity project ID or dataset.');
if (shouldApply && !token) throw new Error('Applying this update requires a Sanity write token.');

const { createClient } = await import('@sanity/client');
const { createReadStream, existsSync } = await import('node:fs');
const { fileURLToPath } = await import('node:url');
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
});

const companyImagePath = fileURLToPath(
  new URL('../../web/public/images/glo2facial/glo2facial-work.jpeg', import.meta.url),
);
if (!existsSync(companyImagePath)) throw new Error(`Missing Glo2Facial company image: ${companyImagePath}`);

const copy = {
  tagline:
    'A customizable facial for visible hydration, surface texture, and a fresh, well-rested look—with no downtime.',
  description:
    'Glo2Facial is a customizable 60-minute facial that combines surface exfoliation, topical infusion, and the Geneo oxygenation step. House of Rose confirms that this service has no downtime.\n\nDuring the appointment, your provider uses a single-use OxyPod selected for the treatment plan. The pod reacts with its paired gel to create carbon-dioxide bubbles at the skin’s surface while the Geneo handpiece moves across the treatment area. The appointment finishes with a facial massage.\n\nGlo2Facial may be considered when visible hydration and surface texture are the priorities. For deeper texture, selected scarring, or laxity, your provider may discuss other services. Candidacy and sequencing are reviewed before treatment, and individual results vary.',
  whoItsFor:
    'Adults who want to discuss a facial for visible hydration, surface texture, or a fresh, well-rested look without downtime. Your provider reviews skin history, sensitivity, recent treatments, goals, and candidacy before selecting an OxyPod. If deeper texture, selected scarring, or laxity is the priority, another service may be more appropriate.',
  process: [
    'Review your skin, goals, recent treatments, and candidacy; then select the OxyPod for the treatment plan.',
    'Cleanse and prepare the treatment area.',
    'Move the Geneo handpiece with a new single-use OxyPod across the skin with its paired gel. A light effervescent tingle and gentle warmth may be felt as carbon-dioxide bubbles form at the surface.',
    'Complete the topical infusion and facial massage steps selected for the appointment.',
    'Apply finishing skincare and review aftercare. Glo2Facial has no downtime.',
  ],
  faqs: [
    {
      _key: 'faq0',
      question: 'How does the oxygenation step work?',
      answer:
        'The single-use OxyPod reacts with its paired gel to create carbon-dioxide bubbles at the skin’s surface. Your provider explains the step and selects the OxyPod for the treatment plan.',
    },
    {
      _key: 'faq1',
      question: 'Is there any downtime?',
      answer:
        'No. House of Rose confirms that Glo2Facial has no downtime. You can return to your usual day after the appointment, and your provider will review any recommended aftercare.',
    },
    {
      _key: 'faq2',
      question: 'What does the appointment feel like?',
      answer:
        'Clients may feel a light effervescent tingle and gentle warmth during the handpiece pass. Your provider explains what to expect and checks your comfort throughout the appointment.',
    },
    {
      _key: 'faq3',
      question: 'How is Glo2Facial different from a basic facial?',
      answer:
        'Glo2Facial combines surface exfoliation, a carbon-dioxide oxygenation step, and topical infusion in one appointment. Your provider can help determine which facial best fits your skin and goals.',
    },
    {
      _key: 'faq4',
      question: 'How often should I schedule Glo2Facial?',
      answer:
        'Timing depends on your skin, goals, and broader treatment plan. Your provider will recommend an appropriate schedule rather than assuming the same interval for every client.',
    },
    {
      _key: 'faq5',
      question: 'Can Glo2Facial be part of a microneedling plan?',
      answer:
        'It may be considered as part of a broader skin plan. Your provider determines candidacy, sequencing, and whether the combination is appropriate for you.',
    },
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Glo2Facial in Punta Gorda, FL | House of Rose',
    metaDescription:
      'Explore Glo2Facial in Punta Gorda: a customizable facial combining exfoliation, topical infusion, and oxygenation with no downtime at House of Rose.',
  },
};

const documents = await client.fetch(
  '*[_type == "service" && slug.current == "glo2facial"]{_id,title}',
);

if (documents.length === 0) throw new Error('No Glo2Facial service document was found.');

console.log(
  JSON.stringify(
    {
      mode: shouldApply ? 'apply' : 'dry-run',
      dataset,
      documents,
      setFields: [...Object.keys(copy), 'image'],
    },
    null,
    2,
  ),
);

if (!shouldApply) {
  console.log('\nDry run only. Add --apply to publish the verified Glo2Facial copy.');
  process.exit(0);
}

const companyImageAsset = await client.assets.upload('image', createReadStream(companyImagePath), {
  filename: 'glo2facial-work.jpeg',
  contentType: 'image/jpeg',
});
const patch = {
  ...copy,
  image: {
    _type: 'image',
    asset: { _type: 'reference', _ref: companyImageAsset._id },
    alt: 'Glo2Facial company treatment overview showing the handpiece and treatment steps',
  },
};

let transaction = client.transaction();
for (const document of documents) transaction = transaction.patch(document._id, { set: patch });
await transaction.commit();

const verified = await client.fetch(
  '*[_type == "service" && slug.current == "glo2facial"]{_id,tagline,description,whoItsFor,process,faqs,seo,image}',
);
const invalid = verified.filter(
  (document) =>
    !document.tagline?.includes('no downtime') ||
    !document.description?.includes('no downtime') ||
    !document.whoItsFor?.includes('without downtime') ||
    !document.process?.some((step) => step.includes('no downtime')) ||
    !document.faqs?.some((faq) => faq.question === 'Is there any downtime?') ||
    !document.seo?.metaDescription?.includes('no downtime') ||
    !document.image?.asset?._ref ||
    !document.image?.alt?.startsWith('Glo2Facial company treatment overview'),
);

if (invalid.length > 0 || verified.length !== documents.length) {
  throw new Error(`Glo2Facial copy did not verify: ${JSON.stringify(invalid)}`);
}

console.log('Glo2Facial copy updated with the owner-verified no-downtime fact.');
