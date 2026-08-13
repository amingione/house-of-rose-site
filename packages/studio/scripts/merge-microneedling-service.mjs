/**
 * Merge microneedling and microchanneling into one public service taxonomy.
 *
 * Owner direction, 2026-08-06:
 * - Microneedling is the generic service name.
 * - Procell Microchanneling is the branded Procell context for that service.
 * - Microchanneling is not presented as a separate modality or protocol choice.
 *
 * Dry run:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/merge-microneedling-service.mjs
 * Apply:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/merge-microneedling-service.mjs --apply
 */

throw new Error(
  'Archived by the 2026-08-13 voice reset. Rewrite and review the embedded public copy before use.',
);

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) throw new Error('Missing Sanity project ID or dataset.');
if (shouldApply && !token) throw new Error('Applying this migration requires a Sanity write token.');

const { createClient } = await import('@sanity/client');
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
});

const ids = {
  microneedling: 'f5308b9c-73df-4812-8c0d-afcf4ee5839a',
  mergedFace: '17e135ae-a153-46ac-89e1-34fa9899cbda',
  body: '302fe86d-4b15-4caa-93e5-b21d70da595e',
  mergedProcell: '2f050dfe-7ec7-459c-b3d6-f895a53805e8',
  mergedProcellBody: '4f55771d-f09c-4f31-a9ac-b4beaef27f73',
  retiredComparison: '383712f3-f854-491c-954c-7b6fa6420827',
  cost: 'hor-cost-microneedling',
  retiredProcellCost: 'hor-cost-procell-microchanneling',
};

const mergedReferences = new Map([
  [ids.mergedFace, ids.microneedling],
  [ids.mergedProcell, ids.microneedling],
  [ids.mergedProcellBody, ids.body],
]);

const documents = await client.fetch('*[_type != "sanity.imageAsset"]');
const byId = new Map(documents.map((document) => [document._id, document]));

function normalizeServiceLanguage(value) {
  if (typeof value !== 'string') return value;

  return value
    .replace(
      /\bProcell Microchanneling,\s*microneedling with the Procell Therapies device\b/gi,
      'Procell Microchanneling',
    )
    .replace(
      /\bProcell Microchanneling,\s*(?:and\s+)?microneedling(?: services)?\b/gi,
      'microneedling services, including Procell Microchanneling',
    )
    .replace(/\bmicrochanneling\s*(?:\/|&|and|or)\s*microneedling\b/gi, 'microneedling')
    .replace(/\bmicroneedling\s*(?:\/|&|and|or)\s*microchanneling\b/gi, 'microneedling')
    .replace(/\bmicrochanneling\s*,\s*microneedling\b/gi, 'microneedling')
    .replace(/\bmicroneedling\s*,\s*microchanneling\b/gi, 'microneedling')
    .replace(/\bregular body microneedling\b/gi, 'body microneedling')
    .replace(/\bregular facial microneedling\b/gi, 'facial microneedling')
    .replace(/\bregular microneedling\b/gi, 'microneedling')
    .replace(/\bprocell\s*[\/-]\s*microchanneling\b/gi, 'Procell Microchanneling')
    .replace(/\bprocell microchanneling\b/gi, 'Procell Microchanneling')
    .replace(/(?<!Procell )\bmicrochanneling\b/gi, (match) => {
      if (match === match.toUpperCase()) return 'MICRONEEDLING';
      return match === 'Microchanneling' ? 'Microneedling' : 'microneedling';
    })
    .replace(/\bmicroneedling\s*,\s*(?:and\s+)?microneedling\b/gi, 'microneedling')
    .replace(/\bmicroneedling\s+(?:and|or)\s+microneedling\b/gi, 'microneedling');
}

function normalizeNode(value) {
  if (Array.isArray(value)) return value.map(normalizeNode);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (key === '_ref' && typeof item === 'string') {
          return [key, mergedReferences.get(item) ?? item];
        }
        if (key === '_key' || key === '_type') return [key, item];
        return [key, normalizeNode(item)];
      }),
    );
  }
  return normalizeServiceLanguage(value);
}

function genericPatch(document) {
  const set = {};
  for (const [key, value] of Object.entries(document)) {
    if (key.startsWith('_') || key === 'slug' || key === 'competitorPricing') continue;
    const replacement = normalizeNode(value);
    if (JSON.stringify(replacement) !== JSON.stringify(value)) set[key] = replacement;
  }
  return set;
}

function mergeReferences(...groups) {
  const merged = new Map();
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const item of normalizeNode(group)) {
      if (!item?._ref) continue;
      merged.set(item._ref, item);
    }
  }
  return [...merged.values()];
}

const patches = new Map();

function addPatch(id, { set = {}, unset = [] }) {
  const current = patches.get(id) ?? { set: {}, unset: [] };
  patches.set(id, {
    set: { ...current.set, ...set },
    unset: [...new Set([...current.unset, ...unset])],
  });
}

for (const document of documents) {
  if (document._id.startsWith('_.')) continue;
  if (document._type === 'testimonial' || document._type.endsWith('Submission')) continue;
  const set = genericPatch(document);
  if (Object.keys(set).length > 0) addPatch(document._id, { set });
}

for (const prefix of ['', 'drafts.']) {
  const canonicalId = `${prefix}${ids.microneedling}`;
  const canonical = byId.get(canonicalId);
  if (canonical) {
    const procell = byId.get(`${prefix}${ids.mergedProcell}`) ?? byId.get(ids.mergedProcell);
    addPatch(canonicalId, {
      set: {
        title: 'Microneedling',
        kind: 'hub',
        status: 'live',
        tagline:
          'Microneedling with the Procell Therapies device, planned around your skin goals and treatment area.',
        description:
          'Microneedling creates controlled microchannels that support the skin’s natural renewal response. House of Rose performs this service with the Procell Therapies device. When the Procell brand or its treatment materials are discussed, the service is called Procell Microchanneling. It is the same microneedling service—not a separate modality clients need to choose between.\n\nYour provider reviews your skin history, visible concerns, treatment area, candidacy, preparation, recovery guidance, and any eligible topical plan before treatment. Microneedling may be considered for the face or approved body areas, and individual outcomes vary.',
        whoItsFor:
          'Adults who want to discuss microneedling for the appearance of texture, fine lines, enlarged-looking pores, selected scars, stretch marks, or crepey-looking skin on the face or an approved body area. Active infection or breakouts in the treatment area, a history of keloids, recent isotretinoin, blood thinners, pregnancy, and other health factors require provider review. Not every client or concern is a fit.',
        process: [
          'Begin with a consultation and skin assessment.',
          'Confirm the treatment area, provider-selected settings, and whether an eligible Procell or topical PRF plan belongs in the appointment.',
          'Complete microneedling with a new single-use cartridge for the Procell Therapies device.',
          'Follow the written preparation, aftercare, and follow-up guidance selected for your skin.',
        ],
        faqs: [
          {
            _type: 'faq',
            _key: 'procell-name',
            question: 'What does Procell Microchanneling mean?',
            answer:
              'Procell Microchanneling is the Procell-specific name used for microneedling with the Procell Therapies system. At House of Rose, it is not a separate service category from microneedling.',
          },
          {
            _type: 'faq',
            _key: 'areas',
            question: 'What areas may be treated?',
            answer:
              'The face and selected body areas may be considered, depending on the visible concern, skin condition, and provider assessment. Your consultation confirms the area and whether treatment is appropriate.',
          },
          {
            _type: 'faq',
            _key: 'recovery',
            question: 'What should I expect after microneedling?',
            answer:
              'Temporary redness, mild swelling, tightness, dryness, or light flaking may occur. Recovery varies by treatment area, provider-selected settings, and individual response, and you will receive written aftercare.',
          },
          {
            _type: 'faq',
            _key: 'topical-prf',
            question: 'Can topical PRF be part of the appointment?',
            answer:
              'Topical PRF may be discussed when appropriate. At House of Rose it is applied to the skin surface only and is not injected. Blood-draw eligibility and treatment candidacy are confirmed before it is included.',
          },
          {
            _type: 'faq',
            _key: 'candidate',
            question: 'Is everyone a candidate?',
            answer:
              'No. Your provider reviews skin status, health history, medications, pregnancy, recent procedures, and other factors before confirming treatment or recommending different timing.',
          },
        ],
        bookingMode: procell?.bookingMode ?? canonical.bookingMode ?? 'consultation',
        bookingUrl: procell?.bookingUrl ?? canonical.bookingUrl,
        bookingVerifiedAt:
          procell?.bookingVerifiedAt ?? canonical.bookingVerifiedAt ?? '2026-08-04',
        image: (procell?.image ?? canonical.image)
          ? {
              ...(procell?.image ?? canonical.image),
              alt: 'Procell Therapies device used for Procell Microchanneling',
            }
          : undefined,
        relatedServices: mergeReferences(canonical.relatedServices, procell?.relatedServices),
        seo: {
          _type: 'seo',
          metaTitle: 'Microneedling in Punta Gorda, FL | House of Rose',
          metaDescription:
            'Explore microneedling with the Procell Therapies device for the face and approved body areas at House of Rose in Punta Gorda, Florida.',
        },
      },
      unset: ['parentService'],
    });
  }

  const bodyId = `${prefix}${ids.body}`;
  const body = byId.get(bodyId);
  if (body) {
    const procellBody =
      byId.get(`${prefix}${ids.mergedProcellBody}`) ?? byId.get(ids.mergedProcellBody);
    addPatch(bodyId, {
      set: {
        title: 'Microneedling — Body',
        kind: 'treatment',
        status: 'live',
        parentService: { _type: 'reference', _ref: ids.microneedling },
        tagline:
          'Microneedling with the Procell Therapies device for approved body areas.',
        description:
          'Body microneedling at House of Rose is performed with the Procell Therapies device. In Procell-specific context, the treatment is called Procell Microchanneling; it remains the same microneedling service rather than a separate modality.\n\nYour provider confirms the body area, visible concern, health history, candidacy, preparation, settings, and any eligible topical plan. Temporary redness, mild swelling, tightness, dryness, or light flaking may follow, and recovery varies by area and person. Written aftercare is provided.',
        whoItsFor:
          'Adults who want to discuss body microneedling for the appearance of mature stretch marks, selected scars, or crepey-looking texture on an approved area. A history of keloids, recent isotretinoin, blood thinners, active infection, pregnancy, and other health factors require provider review. Not every client or body area is a candidate, and individual outcomes vary.',
        process: [
          'Review the target area, visible concern, skin history, medications, and candidacy.',
          'Confirm the area, provider-selected settings, and whether an eligible topical plan belongs in the appointment.',
          'Complete body microneedling with a new single-use cartridge for the Procell Therapies device.',
          'Follow written aftercare and return only on the provider-recommended schedule.',
        ],
        faqs: [
          {
            _type: 'faq',
            _key: 'procell-name',
            question: 'Is body Procell Microchanneling a different service?',
            answer:
              'No. Procell Microchanneling is the Procell-specific name for the microneedling service performed with the Procell Therapies system.',
          },
          {
            _type: 'faq',
            _key: 'areas',
            question: 'Which body areas may be treated?',
            answer:
              'Selected areas may be considered after consultation. Your provider confirms the area, skin condition, visible concern, candidacy, and current pricing before treatment.',
          },
          {
            _type: 'faq',
            _key: 'expectations',
            question: 'Can body microneedling remove stretch marks or scars?',
            answer:
              'No treatment should promise removal. Microneedling may support improvement in their appearance over time, but response varies by concern, area, and person.',
          },
          {
            _type: 'faq',
            _key: 'recovery',
            question: 'What should I expect after body microneedling?',
            answer:
              'Temporary redness, mild swelling, tightness, tenderness, dryness, or light flaking may occur. Recovery varies by area and individual response, and written aftercare is provided.',
          },
        ],
        bookingMode: procellBody?.bookingMode ?? body.bookingMode ?? 'consultation',
        bookingUrl: procellBody?.bookingUrl ?? body.bookingUrl,
        bookingVerifiedAt:
          procellBody?.bookingVerifiedAt ?? body.bookingVerifiedAt ?? '2026-08-04',
        image: (procellBody?.image ?? body.image)
          ? {
              ...(procellBody?.image ?? body.image),
              alt: 'Procell Therapies device used for body Procell Microchanneling',
            }
          : undefined,
        relatedServices: mergeReferences(body.relatedServices, procellBody?.relatedServices),
        seo: {
          _type: 'seo',
          metaTitle: 'Body Microneedling in Punta Gorda | House of Rose',
          metaDescription:
            'Explore body microneedling with the Procell Therapies device, candidacy, treatment-area planning, recovery, and aftercare in Punta Gorda.',
        },
      },
    });
  }

  const duplicateSettings = [
    {
      id: `${prefix}${ids.mergedFace}`,
      title: 'Microneedling — Face (Merged)',
      description:
        'This record was merged into the canonical Microneedling service. Face microneedling is represented at /services/microneedling/.',
    },
    {
      id: `${prefix}${ids.mergedProcell}`,
      title: 'Procell Microchanneling (Merged)',
      description:
        'This record was merged into the canonical Microneedling service. Procell Microchanneling is the branded Procell context for that microneedling service, not a separate modality.',
    },
    {
      id: `${prefix}${ids.mergedProcellBody}`,
      title: 'Procell Microchanneling — Body (Merged)',
      description:
        'This record was merged into Microneedling — Body. Procell Microchanneling is the branded Procell context for that microneedling service, not a separate modality.',
    },
  ];

  for (const duplicate of duplicateSettings) {
    if (!byId.has(duplicate.id)) continue;
    addPatch(duplicate.id, {
      set: {
        title: duplicate.title,
        status: 'duplicate',
        description: duplicate.description,
      },
      unset: ['bookingMode', 'bookingUrl', 'bookingVerifiedAt', 'parentService', 'price', 'image'],
    });
  }

  const comparisonId = `${prefix}${ids.retiredComparison}`;
  if (byId.has(comparisonId)) {
    addPatch(comparisonId, {
      set: {
        status: 'parked',
        title: 'Retired Comparison — Microneedling Terminology',
        intro:
          'This comparison was retired because House of Rose treats microneedling as one service category. Procell Microchanneling is the branded Procell context for that service, not a separate modality.',
        verdict:
          'Use the canonical Microneedling service page. Clients do not need to choose between microneedling and a separate microchanneling service.',
      },
    });
  }

  const retiredCostId = `${prefix}${ids.retiredProcellCost}`;
  if (byId.has(retiredCostId)) {
    addPatch(retiredCostId, {
      set: {
        title: 'Procell Microchanneling Cost — Merged into Microneedling Cost',
        treatment: { _type: 'reference', _key: 'treatment', _ref: ids.microneedling },
        answer:
          'This guide is consolidated into the canonical microneedling cost guide. Procell Microchanneling is the branded Procell context for the same microneedling service.',
      },
    });
  }
}

for (const prefix of ['', 'drafts.']) {
  const costId = `${prefix}${ids.cost}`;
  if (byId.has(costId)) {
    addPatch(costId, {
      set: {
        title: 'How Much Does Microneedling Cost in Punta Gorda?',
        treatment: { _type: 'reference', _key: 'treatment', _ref: ids.microneedling },
        answer:
          'Microneedling in Punta Gorda is priced according to the treatment area and personalized plan. House of Rose performs the service with the Procell Therapies device; when the Procell brand or its treatment materials are discussed, it may be called Procell Microchanneling. That is not a separate service or cost category. Your exact investment is confirmed before treatment.',
        whatsIncluded:
          'A skin and candidacy review, a fresh single-use cartridge for the Procell Therapies device, provider-selected microneedling for the approved area, a post-treatment finish, and personalized aftercare and follow-up guidance.',
        seo: {
          _type: 'seo',
          metaTitle: 'Microneedling Cost in Punta Gorda | House of Rose',
          metaDescription:
            'Learn what shapes microneedling cost in Punta Gorda, including treatment area and optional topical plans, before your provider confirms the investment.',
        },
      },
    });
  }
}

for (const prefix of ['', 'drafts.']) {
  const homepageId = `${prefix}homepage`;
  const homepage = byId.get(homepageId);
  if (homepage?.serviceGroups) {
    addPatch(homepageId, {
      set: {
        serviceGroups: normalizeNode(homepage.serviceGroups).map((group) =>
          group?._key === 'skin-renewal'
            ? {
                ...group,
                description:
                  'Explore microneedling, PRF, BioRePeel, radiofrequency, and IPL options by concern and recovery preference.',
              }
            : group,
        ),
      },
    });
  }

  const settingsId = `${prefix}siteSettings`;
  const settings = byId.get(settingsId);
  if (settings?.aiSearchFaqs) {
    addPatch(settingsId, {
      set: {
        aiSearchFaqs: normalizeNode(settings.aiSearchFaqs).map((faq) => {
          if (faq?._key === 'services') {
            return {
              ...faq,
              answer:
                'House of Rose offers advanced facials and skin services, PRF, microneedling—including Procell Microchanneling—injectables, IV hydration, provider-guided weight management, facial waxing, and professional home care. Service availability and candidacy vary by provider.',
            };
          }
          if (faq?._key === 'regenerative') {
            return {
              ...faq,
              answer:
                'Yes. House of Rose offers PRF and microneedling services, including Procell Microchanneling. The right plan depends on your goals and candidacy, and final recommendations are confirmed by the appropriate provider.',
            };
          }
          return faq;
        }),
      },
    });
  }

  const acneId = `${prefix}ad938cc9-1677-42ce-ad14-085362954677`;
  if (byId.has(acneId)) {
    addPatch(acneId, {
      set: {
        intro:
          'Acne scars may be discussed through microneedling, topical PRF when appropriate, or advanced BioRePeel combination planning. Your consultation reviews scar type, skin status, candidacy, and the most appropriate next step.',
        seo: {
          metaTitle: 'Acne Scar Treatments in Punta Gorda | House of Rose',
          metaDescription:
            'Explore consultation-led options for the appearance of acne scars in Punta Gorda, including microneedling, topical PRF, and BioRePeel planning.',
        },
      },
    });
  }

  const pigmentId = `${prefix}concern-hyperpigmentation`;
  if (byId.has(pigmentId)) {
    addPatch(pigmentId, {
      set: {
        intro:
          'Dark spots, melasma, and post-breakout marks can have different causes and require individualized planning. House of Rose may discuss BioRePeel, microneedling—including Procell Microchanneling when appropriate—or oxygenating facials after reviewing your skin type, pigment pattern, candidacy, and sun exposure.',
      },
    });
  }
}

const summary = {
  mode: shouldApply ? 'apply' : 'dry-run',
  dataset,
  patches: [...patches.entries()].map(([id, patch]) => ({
    _id: id,
    _type: byId.get(id)?._type,
    title: byId.get(id)?.title,
    setFields: Object.keys(patch.set),
    unsetFields: patch.unset,
  })),
};

console.log(JSON.stringify(summary, null, 2));

if (!shouldApply) {
  console.log('\nDry run only. Add --apply to merge the microneedling service taxonomy.');
  process.exit(0);
}

let transaction = client.transaction();
for (const [id, patch] of patches) {
  transaction = transaction.patch(id, { set: patch.set, unset: patch.unset });
}
await transaction.commit();

const activeDuplicateServices = await client.fetch(
  '*[_type == "service" && status in ["live", "actual-menu"] && slug.current in $slugs]{_id,title,"slug":slug.current,status}',
  {
    slugs: ['microchanneling', 'microneedling-corrective', 'procell-microchanneling-body'],
  },
);
if (activeDuplicateServices.length > 0) {
  throw new Error(`Duplicate microneedling services remain active: ${JSON.stringify(activeDuplicateServices)}`);
}

const activeDuplicateReferences = await client.fetch(
  '*[_type == "service" && status in ["live", "actual-menu"] && references($ids)]{_id,title,"slug":slug.current,status}',
  { ids: [...mergedReferences.keys()] },
);
if (activeDuplicateReferences.length > 0) {
  throw new Error(
    `Active services still reference merged records: ${JSON.stringify(activeDuplicateReferences)}`,
  );
}

const verifiedServices = await client.fetch(
  '*[_id in $ids]{_id,title,"slug":slug.current,status,bookingMode,bookingUrl,"parent":parentService._ref,description}',
  { ids: [ids.microneedling, ids.body] },
);
const invalidServices = verifiedServices.filter(
  (service) =>
    service.status !== 'live' ||
    service.bookingMode !== 'consultation' ||
    !service.bookingUrl?.includes('service_token=') ||
    !service.description?.includes('Procell Microchanneling') ||
    (service._id === ids.body && service.parent !== ids.microneedling),
);
if (invalidServices.length > 0 || verifiedServices.length !== 2) {
  throw new Error(`Canonical microneedling services did not verify: ${JSON.stringify(invalidServices)}`);
}

const publishedDocuments = await client.fetch('*[!(_id in path("drafts.**")) && _type != "sanity.imageAsset"]');
const terminologyViolations = [];
const splitPattern =
  /\b(?:microchanneling\s*(?:\/|&|and|or|vs\.?|versus)\s*microneedling|microneedling\s*(?:\/|&|and|or|vs\.?|versus)\s*microchanneling|regular microneedling)\b/i;
const genericMicrochannelingPattern = /(?<!Procell )\bmicrochanneling\b/i;

function findTerminologyViolations(value, path, document) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findTerminologyViolations(item, `${path}[${index}]`, document),
    );
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key.startsWith('_') || key === 'slug' || key === 'competitorPricing') continue;
      findTerminologyViolations(item, path ? `${path}.${key}` : key, document);
    }
    return;
  }
  if (
    typeof value === 'string' &&
    (splitPattern.test(value) || genericMicrochannelingPattern.test(value))
  ) {
    terminologyViolations.push({
      _id: document._id,
      _type: document._type,
      title: document.title,
      path,
      value,
    });
  }
}

for (const document of publishedDocuments) {
  if (document._id.startsWith('_.')) continue;
  if (document.status === 'parked' || document.status === 'duplicate') continue;
  if (document._type === 'testimonial' || document._type.endsWith('Submission')) continue;
  if (document._id === ids.retiredProcellCost) continue;
  findTerminologyViolations(document, '', document);
}

if (terminologyViolations.length > 0) {
  throw new Error(
    `Microneedling taxonomy violations remain: ${JSON.stringify(terminologyViolations)}`,
  );
}

console.log(
  'Microneedling is now the single service category; Procell Microchanneling remains the branded context.',
);
