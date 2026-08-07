/**
 * Draft-only seed for the RF & IPL Skin Treatments collection.
 *
 * The public claims in this file were checked 2026-07-24 against:
 * - InMode OptimasMAX: https://offer.inmodemd.com/OptimasMAX
 * - InMode Morpheus8: https://offer.inmodemd.com/morpheus8
 * - Hellman J. Retrospective Analysis of Outcomes with a Unique IPL System:
 *   https://doi.org/10.4236/jcdsa.2021.112012
 * - Forma facial/neck RF study:
 *   https://www.inmodemd.com/archive/PeerRev_JCLT_Forma_ANGL.pdf
 *
 * Usage from the repository root:
 *   node packages/studio/scripts/seed-rf-ipl-services.mjs --validate
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-rf-ipl-services.mjs --apply
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-rf-ipl-services.mjs --replace
 *
 * The default is validation only. `--apply` creates missing drafts and never
 * changes an existing draft. `--replace` atomically refreshes only this script's
 * four known draft IDs; do not use it after editorial changes in Studio.
 * Nothing in this script publishes content.
 */

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const REPLACE = process.argv.includes('--replace');
const SHOULD_WRITE = APPLY || REPLACE;
const VALIDATE = process.argv.includes('--validate') || !SHOULD_WRITE;

const ids = {
  collection: 'drafts.service-collection-rf-ipl-skin-treatments',
  morpheus8: 'drafts.service-morpheus8',
  lumecca: 'drafts.service-lumecca-peak-ipl',
  forma: 'drafts.service-forma-rf-facial',
};

const concernIds = {
  acneScarring: 'ad938cc9-1677-42ce-ad14-085362954677',
  fineLinesLaxity: 'ac651187-ec12-4324-a5c6-974a73b42f1a',
  hyperpigmentation: 'concern-hyperpigmentation',
  stretchMarks: 'f36aa3c0-9681-4e82-95dd-1ad4abbdb3f8',
  sunDamage: 'e07ca64c-62da-4aef-94f5-a0517ccb70fb',
  texture: 'e775f8a4-266e-4edb-8c6f-eba826fc94cd',
};

const publishedId = (id) => id.replace(/^drafts\./, '');
const slug = (current) => ({ _type: 'slug', current });
const reference = (_ref, _key, weak = false) => ({
  _type: 'reference',
  _ref,
  _key,
  ...(weak ? { _weak: true } : {}),
});
const serviceReference = (id, _key) => reference(publishedId(ids[id]), _key, true);
const collectionReference = () => reference(publishedId(ids.collection), 'rf-ipl-collection', true);
const concernReference = (id, _key) => reference(concernIds[id], _key);
const faq = (question, answer, _key) => ({ _type: 'faq', _key, question, answer });
const treatmentArea = (area, focus, _key) => ({ _type: 'object', _key, area, focus });

const collection = {
  _id: ids.collection,
  _type: 'serviceCollection',
  title: 'RF & IPL Skin Treatments',
  slug: slug('rf-ipl-skin-treatments'),
  description:
    'Explore InMode options for visible tone, pigment, texture, scars, stretch marks, and separate radiofrequency facial goals in Punta Gorda.',
  orderRank: 4.5,
};

const services = [
  {
    _id: ids.morpheus8,
    _type: 'service',
    title: 'Morpheus8 RF Microneedling',
    slug: slug('morpheus8'),
    collection: collectionReference(),
    kind: 'standalone',
    category: 'skin-renewal',
    status: 'live',
    pricingModel: 'consult',
    pricingNotes:
      'Consultation required. Treatment area, settings, comfort plan, timing, and investment are confirmed after candidacy is reviewed.',
    orderRank: 1,
    tagline: 'RF microneedling for visible tone, texture, scars, and stretch marks on eligible face and body areas.',
    description:
      'Morpheus8 RF Microneedling combines controlled microneedling with fractional bipolar radiofrequency. At House of Rose Aesthetics in Punta Gorda, it is used for the appearance of uneven tone and texture, visible scars, and stretch marks on eligible face and body areas. Treatment depth, energy, and area are selected after consultation, and individual outcomes vary.',
    whoItsFor:
      'Morpheus8 may fit clients considering treatment for uneven tone or texture, visible scar texture, or stretch marks on the face or body. Your consultation reviews the intended area, skin condition, health history, medications, recent procedures, recovery preferences, and any reason treatment should be postponed.',
    concerns: [
      concernReference('texture', 'texture'),
      concernReference('acneScarring', 'acne-scarring'),
      concernReference('stretchMarks', 'stretch-marks'),
    ],
    benefits: [
      'Supports a smoother, more even-looking surface',
      'Improves the appearance of uneven tone and texture',
      'Addresses the visible texture of eligible scars',
      'Improves the appearance of stretch marks on selected body areas',
    ],
    treatmentAreas: [
      treatmentArea(
        'Face',
        'Uneven tone and texture, including the visible texture of eligible facial scars.',
        'face',
      ),
      treatmentArea(
        'Neck & Chest',
        'Uneven tone, uneven surface texture, and eligible scar concerns.',
        'neck-chest',
      ),
      treatmentArea(
        'Selected Body Areas',
        'Stretch marks, visible scars, and uneven tone or texture selected during consultation.',
        'body',
      ),
    ],
    process: [
      'Begin with a consultation to review the visible concern, treatment area, health history, and recovery preferences.',
      'The skin is prepared and a personalized comfort plan is discussed before the Morpheus8 handpiece is used.',
      'Controlled microneedling and fractional radiofrequency are delivered at provider-selected settings for the planned area.',
      'Expect a more involved recovery than a non-invasive facial. Your provider explains likely redness, swelling, skincare pauses, sun care, and individualized aftercare before treatment.',
      'Visible change develops gradually. The number and timing of sessions are recommended only after your goals, response, and candidacy are evaluated.',
    ],
    faqs: [
      faq(
        'How does Morpheus8 RF Microneedling work?',
        'Morpheus8 uses microneedles to deliver fractional bipolar radiofrequency at provider-selected depths. House of Rose uses the treatment for the appearance of uneven tone and texture, eligible scars, and stretch marks.',
        'how-it-works',
      ),
      faq(
        'What concerns can Morpheus8 address?',
        'Morpheus8 may be considered for uneven-looking tone, uneven texture, the visible texture of eligible scars, and stretch marks. The treatment area and settings depend on your consultation.',
        'concerns',
      ),
      faq(
        'Can Morpheus8 be used on the face and body?',
        'Yes. House of Rose considers Morpheus8 for eligible face, neck, chest, and selected body areas when tone, texture, scars, or stretch marks are the stated concern. Final area selection is confirmed after candidacy and available treatment tips are reviewed.',
        'face-body',
      ),
      faq(
        'What is Morpheus8 recovery like?',
        'Recovery varies by treatment area and settings. Redness, swelling, sensitivity, or a temporarily textured appearance can occur, so your provider will review skincare pauses, sun protection, and a personalized aftercare plan before the appointment.',
        'recovery',
      ),
      faq(
        'When do Morpheus8 results develop?',
        'Morpheus8 results develop gradually as the skin responds to the controlled treatment. Your provider will explain what can reasonably be assessed after the initial recovery period and when a follow-up evaluation makes sense.',
        'results',
      ),
      faq(
        'How many Morpheus8 sessions will I need?',
        'A single session or a series may be discussed, but there is no universal count. The recommendation depends on the area, visible concern, treatment intensity, response, and your individualized plan.',
        'sessions',
      ),
    ],
    relatedServices: [
      serviceReference('lumecca', 'lumecca'),
      serviceReference('forma', 'forma'),
    ],
    seo: {
      metaTitle: 'Morpheus8 RF Microneedling Punta Gorda | House of Rose',
      metaDescription:
        'Explore Morpheus8 RF microneedling for visible tone, texture, scars, and stretch marks at House of Rose Aesthetics in Punta Gorda.',
    },
  },
  {
    _id: ids.lumecca,
    _type: 'service',
    title: 'Lumecca Peak IPL Photofacial',
    slug: slug('lumecca-peak-ipl'),
    collection: collectionReference(),
    kind: 'standalone',
    category: 'skin-renewal',
    status: 'live',
    pricingModel: 'consult',
    pricingNotes:
      'Consultation required. Treatment area, skin assessment, timing, and investment are confirmed after candidacy is reviewed.',
    orderRank: 2,
    tagline: 'IPL for visible pigment, uneven tone, and selected texture concerns.',
    description:
      'Lumecca Peak is an intense pulsed light photofacial used for the appearance of visible pigment, uneven tone, and selected texture concerns. At House of Rose Aesthetics in Punta Gorda, IPL settings and treatment areas are selected after a review of your skin, recent sun exposure, and candidacy. Individual outcomes vary.',
    whoItsFor:
      'Lumecca Peak IPL may fit clients considering treatment for visible pigment, uneven tone, or selected texture concerns on the face, neck, chest, or hands. Recent tanning or sun exposure, light-sensitive medications, active irritation, and certain health or skin histories can affect timing or candidacy, so an IPL consultation is required before treatment.',
    concerns: [
      concernReference('sunDamage', 'sun-damage'),
      concernReference('hyperpigmentation', 'hyperpigmentation'),
      concernReference('texture', 'texture'),
    ],
    benefits: [
      'Improves the appearance of visible sun-related pigment',
      'Addresses the look of brown spots and freckles',
      'Supports more even-looking tone across exposed areas',
      'May be considered for selected visible texture concerns',
      'Uses customizable IPL settings selected for the planned area and skin assessment',
    ],
    treatmentAreas: [
      treatmentArea(
        'Face',
        'Visible pigment, brown spots, freckles, uneven-looking tone, and selected texture concerns.',
        'face',
      ),
      treatmentArea(
        'Neck & Chest',
        'The appearance of sun-related discoloration and uneven tone across frequently exposed skin.',
        'neck-chest',
      ),
      treatmentArea(
        'Hands',
        'Visible brown spots and uneven-looking tone associated with cumulative sun exposure.',
        'hands',
      ),
    ],
    process: [
      'Begin with a consultation that reviews the visible concern, skin characteristics, medications, and recent sun exposure.',
      'Protective eyewear is used while the Lumecca Peak handpiece delivers brief pulses of intense light to the selected area.',
      'The sensation is commonly described as a quick flash or snap, with comfort varying by area and settings.',
      'Pigmented spots can look temporarily darker before they fade, and temporary redness can occur. Your provider explains sun care, skincare, and individualized aftercare.',
      'Progress is reviewed after the skin settles. Additional sessions are recommended only when they fit the concern, response, and candidacy.',
    ],
    faqs: [
      faq(
        'Is Lumecca Peak IPL a laser?',
        'No. IPL uses broad-spectrum intense pulsed light rather than a single laser wavelength. The settings are selected for visible pigment, uneven tone, and eligible texture concerns.',
        'ipl-vs-laser',
      ),
      faq(
        'What does Lumecca Peak IPL help improve?',
        'Lumecca Peak IPL is used for the appearance of brown spots, freckles, sun-related pigment, uneven-looking tone, and selected texture concerns. A consultation determines whether IPL is the right approach for the specific concern.',
        'concerns',
      ),
      faq(
        'Where can Lumecca Peak IPL be used?',
        'Common areas include the face, neck, chest, and hands. The planned area must be assessed before treatment, especially when recent sun exposure, active irritation, or a change in skin condition is present.',
        'areas',
      ),
      faq(
        'What does a Lumecca Peak IPL appointment feel like?',
        'Clients commonly describe each pulse as a quick flash or light snap. Sensation varies by the area, settings, and individual sensitivity, and protective eyewear is used during treatment.',
        'sensation',
      ),
      faq(
        'What should I expect after Lumecca Peak IPL?',
        'Temporary redness can occur, and visible brown spots may look darker before they gradually fade. Your provider will explain sun protection, skincare, and when normal products or activities may be resumed.',
        'after',
      ),
      faq(
        'How many Lumecca Peak IPL sessions will I need?',
        'The number of sessions is individualized. The visible concern, treatment area, skin assessment, sun history, and response all influence whether one appointment or a series is recommended.',
        'sessions',
      ),
    ],
    relatedServices: [
      serviceReference('morpheus8', 'morpheus8'),
      serviceReference('forma', 'forma'),
    ],
    seo: {
      metaTitle: 'Lumecca Peak IPL Punta Gorda | House of Rose',
      metaDescription:
        'Explore Lumecca Peak IPL for visible pigment, uneven tone, and selected texture concerns at House of Rose Aesthetics in Punta Gorda.',
    },
  },
  {
    _id: ids.forma,
    _type: 'service',
    title: 'Forma RF Facial',
    slug: slug('forma-rf-facial'),
    collection: collectionReference(),
    kind: 'standalone',
    category: 'skin-renewal',
    status: 'live',
    pricingModel: 'consult',
    pricingNotes:
      'Consultation required. Facial area, timing, series recommendation, and investment are confirmed after candidacy is reviewed.',
    orderRank: 3,
    tagline: 'A warm, non-invasive RF facial for smoother, firmer, more defined-looking facial contours.',
    description:
      'Forma RF Facial is a non-invasive, temperature-controlled radiofrequency treatment designed to support smoother, firmer-looking skin and more refined facial contours. At House of Rose Aesthetics in Punta Gorda, Forma is offered for the face, jawline, and neck with real-time temperature monitoring and a personalized treatment plan.',
    whoItsFor:
      'Forma may fit clients who want to improve the appearance of mild facial laxity, crepey-looking texture, or less-defined contours without a microneedling procedure. Your consultation reviews the area, skin condition, health history, recent procedures, comfort preferences, and any reason treatment should be postponed.',
    concerns: [
      concernReference('fineLinesLaxity', 'fine-lines-laxity'),
      concernReference('texture', 'texture'),
    ],
    benefits: [
      'Supports smoother, firmer-looking facial skin',
      'Refines the appearance of mild laxity and crepey-looking texture',
      'Uses real-time temperature monitoring during the appointment',
      'Provides a non-invasive option with minimal interruption to the day',
    ],
    treatmentAreas: [
      treatmentArea(
        'Face & Cheeks',
        'Smoother-looking texture, visible firmness, and refined facial contours.',
        'face-cheeks',
      ),
      treatmentArea(
        'Jawline',
        'The appearance of mild laxity and less-defined lower-face contours.',
        'jawline',
      ),
      treatmentArea(
        'Neck',
        'Crepey-looking texture and a smoother, firmer overall appearance.',
        'neck',
      ),
    ],
    process: [
      'Begin with a consultation to confirm that a non-invasive RF facial fits your skin goals and health history.',
      'The Forma handpiece is moved continuously across the selected facial area while temperature is monitored in real time.',
      'The experience is typically warm and massage-like, with settings adjusted to the area and your comfort.',
      'Forma is designed for minimal interruption to the day. Your provider explains skincare, heat or sun considerations, and individualized aftercare.',
      'Visible change develops with the skin’s response over time. A single appointment or series may be discussed after your goals and response are evaluated.',
    ],
    faqs: [
      faq(
        'How does Forma RF Facial work?',
        'Forma delivers controlled radiofrequency while monitoring skin temperature in real time. The warm, non-invasive treatment is designed to support smoother, firmer-looking skin and more refined facial contours.',
        'how-it-works',
      ),
      faq(
        'What areas can be treated with Forma at House of Rose?',
        'House of Rose offers Forma for the face, cheeks, jawline, and neck. Your consultation confirms which facial areas fit your goals and candidacy.',
        'areas',
      ),
      faq(
        'What concerns is Forma best suited for?',
        'Forma may be considered for the appearance of mild facial laxity, crepey-looking texture, and less-defined contours. Clients seeking correction of visible pigment or a more intensive needling treatment may be guided toward another option.',
        'concerns',
      ),
      faq(
        'What does a Forma appointment feel like?',
        'Forma is generally experienced as a controlled warmth while the handpiece moves across the skin. Sensation varies, and the provider monitors temperature and adjusts the experience for the planned facial area.',
        'sensation',
      ),
      faq(
        'Is there downtime after Forma RF Facial?',
        'Forma is a non-invasive treatment designed for minimal interruption to the day. Temporary warmth or redness can occur, and your provider will review personalized skincare and aftercare.',
        'downtime',
      ),
      faq(
        'How many Forma appointments will I need?',
        'Forma can be planned as one appointment or a series depending on the visible concern, desired maintenance, and response. Your provider recommends timing only after a consultation and follow-up assessment.',
        'sessions',
      ),
    ],
    relatedServices: [
      serviceReference('morpheus8', 'morpheus8'),
      serviceReference('lumecca', 'lumecca'),
    ],
    seo: {
      metaTitle: 'Forma RF Facial Punta Gorda | House of Rose',
      metaDescription:
        'Explore Forma RF Facial for smoother, firmer-looking face, jawline, and neck contours at House of Rose Aesthetics in Punta Gorda.',
    },
  },
];

const documents = [collection, ...services];

const forbiddenPhrases = [
  /\banti-aging\b/i,
  /\breverse aging\b/i,
  /\bguaranteed\b/i,
  /\bpermanent\b/i,
  /\bstem[- ]cell\b/i,
  /\bcures?\b/i,
  /\btreats?\b/i,
  /\bheals?\b/i,
  /\bfixes?\b/i,
  /\bFDA[- ]approved\b/i,
  /\bclinically proven\b/i,
  /\bGroupon\b/i,
  /\bdiscount\b/i,
  /\bBook Online\b/i,
  /\bSchedule Now\b/i,
  /\bAmber\b|\bDiana\b|\bBrandy\b/i,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateSeed() {
  assert(documents.length === 4, `Expected 4 documents, found ${documents.length}.`);
  assert(new Set(documents.map((document) => document._id)).size === documents.length, 'Document IDs must be unique.');

  for (const document of documents) {
    assert(document._id.startsWith('drafts.'), `${document.title} must use a draft ID.`);
    assert(!publishedId(document._id).includes('.'), `${document.title} must use a public-safe ID without periods.`);
    assert(document.slug?._type === 'slug' && document.slug.current, `${document.title} needs a valid slug.`);
  }

  for (const service of services) {
    assert(service.status === 'live', `${service.title} must be ready to become visible when its reviewed draft is published.`);
    assert(service.kind === 'standalone', `${service.title} must remain a standalone service page.`);
    assert(service.pricingModel === 'consult', `${service.title} must remain consult-only.`);
    assert(!service.price && !service.rackPrice && !service.bookingUrl && !service.provider, `${service.title} must not expose price, booking URL, or provider data.`);
    assert(service.benefits.length >= 4, `${service.title} needs at least four benefits.`);
    assert(service.treatmentAreas.length >= 3, `${service.title} needs at least three treatment areas.`);
    assert(service.process.length >= 4, `${service.title} needs practical expectations.`);
    assert(service.faqs.length >= 6, `${service.title} needs at least six FAQs.`);
    assert(service.relatedServices.length === 2, `${service.title} must cross-link the other two treatments.`);
    assert(service.concerns.every((item) => item._ref), `${service.title} contains an unresolved concern reference.`);
    assert(service.seo.metaTitle.length <= 60, `${service.title} meta title is longer than 60 characters.`);
    assert(service.seo.metaDescription.length <= 155, `${service.title} meta description is longer than 155 characters.`);
  }

  const nonMorpheusContent = JSON.stringify([collection, ...services.filter((service) => service._id !== ids.morpheus8)]);
  assert(!/\bForma Plus\b/i.test(nonMorpheusContent), 'Forma Plus must not appear in this content.');
  assert(!/\bbody areas?\b|\bbody skin\b|\bbody-skin\b/i.test(JSON.stringify(services.find((service) => service._id === ids.forma))), 'Forma must remain facial-only.');

  const restrictedIndicationCopy = JSON.stringify([
    services.find((service) => service._id === ids.morpheus8),
    services.find((service) => service._id === ids.lumecca),
  ]);
  assert(
    !/\b(?:tighten(?:ing|s|ed)?|lift(?:ing|s|ed)?|laxity|firm(?:er|ing|ness)?|sagging|jowls?|contour(?:ing|s|ed)?)\b/i.test(
      restrictedIndicationCopy,
    ),
    'Morpheus8 and Lumecca must not be positioned for tightening, lifting, laxity, firmness, sagging, jowls, or contouring.',
  );
  assert(
    !/\b(?:vascular|vessels?|capillaries?|rosacea)\b/i.test(
      JSON.stringify(services.find((service) => service._id === ids.lumecca)),
    ),
    'Lumecca must remain within the approved pigment, tone, and selected-texture lane.',
  );

  const permittedConcernIds = {
    [ids.morpheus8]: new Set([concernIds.texture, concernIds.acneScarring, concernIds.stretchMarks]),
    [ids.lumecca]: new Set([concernIds.sunDamage, concernIds.hyperpigmentation, concernIds.texture]),
  };
  for (const serviceId of [ids.morpheus8, ids.lumecca]) {
    const service = services.find((item) => item._id === serviceId);
    assert(
      service.concerns.every((item) => permittedConcernIds[serviceId].has(item._ref)),
      `${service.title} contains a concern outside its approved indication set.`,
    );
  }

  const content = JSON.stringify(documents);
  for (const phrase of forbiddenPhrases) {
    assert(!phrase.test(content), `Compliance validation failed for ${phrase}.`);
  }

  console.log(`Validated ${documents.length} draft documents: 1 collection and ${services.length} services.`);
  console.log('No provider names, public prices, online-booking links, publication operations, or prohibited claims are present.');
}

function resolveToken() {
  const envToken = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;
  if (envToken) return envToken;

  try {
    const localEnv = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    for (const line of localEnv.split(/\r?\n/)) {
      const match = line.match(/^\s*(SANITY_API_WRITE_TOKEN|SANITY_AUTH_TOKEN|SANITY_TOKEN)\s*=\s*(.*?)\s*$/);
      if (!match?.[2]) continue;
      const value = match[2].replace(/^(?:['"])(.*)(?:['"])$/, '$1');
      if (value) return value;
    }
  } catch {
    // A repository-local environment file is optional.
  }

  try {
    return JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
  } catch {
    return undefined;
  }
}

async function verifyReferences(client) {
  const existingSlugs = await client.fetch(
    '*[_type in ["service", "serviceCollection"] && slug.current in $slugs]{_id, _type, title, "slug": slug.current}',
    { slugs: documents.map((document) => document.slug.current) },
  );
  const managedIds = new Set(documents.flatMap((document) => [document._id, publishedId(document._id)]));
  const conflicts = existingSlugs.filter((document) => !managedIds.has(document._id));
  assert(conflicts.length === 0, `Slug conflict detected: ${JSON.stringify(conflicts)}`);

  const concernDocs = await client.fetch(
    '*[_type == "concern" && _id in $ids && status != "parked"]{_id, title, "slug": slug.current}',
    { ids: Object.values(concernIds) },
  );
  assert(concernDocs.length === Object.keys(concernIds).length, 'One or more verified live concern references are missing or parked.');
}

async function applySeed() {
  const token = resolveToken();
  assert(token, 'No Sanity write token found. Set SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN, or run `sanity login`.');

  const { createClient } = await import('@sanity/client');
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
    dataset: process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
    token,
    useCdn: false,
  });

  await verifyReferences(client);

  const transaction = client.transaction();
  if (REPLACE) {
    for (const document of documents) transaction.delete(document._id);
    for (const document of documents) transaction.create(document);
  } else {
    for (const document of documents) transaction.createIfNotExists(document);
  }
  await transaction.commit();

  if (REPLACE) {
    console.log(`Refreshed ${documents.length} managed draft documents.`);
  } else {
    console.log(`Created any missing drafts among ${documents.length} managed documents.`);
    console.log('Existing drafts were left untouched.');
  }
  console.log('Nothing was published. Review and publish the four drafts in Sanity Studio when approved.');
}

try {
  validateSeed();
  if (SHOULD_WRITE) await applySeed();
  if (VALIDATE && !SHOULD_WRITE) {
    console.log('Static validation complete. Run with --apply to create missing review drafts.');
  }
} catch (error) {
  console.error(`RF/IPL seed validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
