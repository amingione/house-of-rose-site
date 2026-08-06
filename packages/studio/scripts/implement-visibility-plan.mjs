/**
 * Idempotent production reconciliation for the 90-day visibility plan.
 *
 * Sources checked 2026-07-20:
 * - CLAUDE.md provider lanes and permanent retirements
 * - docs/internal_only/pricing/ALL-SERVICES-PRICING.MD
 * - docs/internal_only/pricing/advanced-facials-master-menu.md
 * - docs/internal_only/COMPLIANCE-COPY-RULES.md
 * - published Sanity catalog (read before this script was authored)
 *
 * Dry run:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/implement-visibility-plan.mjs
 * Apply:
 *   node scripts/run-with-env.mjs node packages/studio/scripts/implement-visibility-plan.mjs --apply
 */

const shouldApply = process.argv.includes('--apply');
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26';
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId || !dataset) throw new Error('Missing Sanity project ID or dataset.');

const slug = (current) => ({ _type: 'slug', current });
const ref = (_ref, _key) => ({ _type: 'reference', _ref, _key });
const faq = (_key, question, answer) => ({ _type: 'faq', _key, question, answer });

const parkedServiceIds = [
  'service-ai-skin-analysis',
  'service-glowtox-facial',
  'service-lunch-time-glow',
  'service-luxury-facial',
  'service-mommy-and-me-facial',
  'service-sculpt-and-lift-facial',
  'service-signature-facial',
  'service-skin-reset-facial',
];

const verifiedLiveServiceIds = [
  '52889a9f-ed52-410d-b78c-3d991c23ab24', // Acne Bootcamp — $899 in GG
  '7bd92dc1-9ced-42bd-a195-e9fa4628a848', // Botox & neurotoxins
  '46fb011c-6d0c-4667-83e4-81c7d87a3feb', // Dermal fillers
  'e8b38f03-900f-4ec5-9246-07cc1b65ed11', // Dermaplaning — $135
  '522cd772-c891-46b6-b3cf-2a24197264bc', // Face Reality acne hub
  '6e204a23-77a2-48a9-8381-878974cb92e4', // GLP-1
  '99566c9c-8033-4df6-b5a3-ac5de5d2d886', // IV hydration
  'e82404a8-a778-4359-9a6d-71377ab903d3', // Injectables hub
  '59219510-249d-48e7-9c11-373e8d2c460b', // Wellness hub
];

const parkedPackageIds = [
  'package-biorepeel-body-series-3',
  'package-biorepeel-body-series-6',
  'package-camellia-series-4',
  'package-bridal-bloom',
  'package-microneedling-corrective-series-3',
  'package-microneedling-corrective-series-6',
  'package-microneedling-body-series-3',
  'package-microneedling-body-series-6',
  'package-gilded-lily-journey',
  'package-prf-microneedling-series-4',
  'package-Procell-body-series-3',
  'package-Procell-body-series-6',
  'package-Procell-micro-series-3',
  'package-Procell-micro-series-6',
  'package-revival-series',
];

const servicePatches = [
  {
    id: 'f5308b9c-73df-4812-8c0d-afcf4ee5839a',
    set: {
      title: 'Microneedling',
      slug: slug('microneedling'),
      kind: 'hub',
      status: 'live',
      tagline: 'Microneedling with the Procell Therapies device, planned around your skin goals and treatment area.',
      description: 'Microneedling creates controlled microchannels that support the skin’s natural renewal response. House of Rose performs this service with the Procell Therapies device. When the Procell brand or its materials are discussed, the service is called Procell Microchanneling. It is the same microneedling service, not a separate modality.',
      whoItsFor: 'Clients interested in microneedling for the appearance of texture, fine lines, enlarged-looking pores, selected scars, stretch marks, or crepey-looking skin. Amber confirms the treatment area, candidacy, settings, and aftercare before treatment.',
      process: [
        'Begin with a skin consultation and candidacy review.',
        'Confirm the treatment area, provider-selected settings, and aftercare appropriate for your plan.',
        'Complete microneedling with a new single-use cartridge for the Procell Therapies device.',
        'Review recovery guidance and the timing of any follow-up visit.',
      ],
      faqs: [
        faq('what-is-Procell', 'What does Procell Microchanneling mean?', 'Procell Microchanneling is the branded Procell context for the microneedling service performed with the Procell Therapies system. It is not a separate service category.'),
        faq('cost', 'How much does microneedling cost?', 'The treatment area and personalized plan shape the investment. Your provider confirms current pricing before treatment.'),
        faq('sessions', 'How many sessions will I need?', 'The number and timing are individualized. Amber reviews your goals, response, and recovery before recommending another visit.'),
      ],
      relatedServices: [
        ref('818469ff-9dee-4939-ad55-54fb1ca4e184', 'topical-prf'),
        ref('0e5554bd-f58d-4dbe-be0a-972ad9a27a0e', 'glo2facial'),
        ref('e8b38f03-900f-4ec5-9246-07cc1b65ed11', 'dermaplaning'),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Microneedling in Punta Gorda | House of Rose',
        metaDescription: 'Learn about microneedling with the Procell Therapies device for the face and approved body areas at House of Rose in Punta Gorda.',
      },
    },
    unset: ['parentService', 'price'],
  },
  {
    id: 'c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b',
    set: {
      title: 'Platelet-Rich Fibrin (PRF)',
      slug: slug('prf'),
      kind: 'hub',
      status: 'live',
      tagline: 'A clear starting point for understanding topical and injectable PRF options.',
      description: 'Platelet-rich fibrin, or PRF, is prepared from a small sample of the client’s own blood for use in a provider-directed aesthetic protocol. House of Rose keeps two lanes distinct: Amber may apply PRF topically during an appropriate needling appointment, while Diana, RN evaluates injectable PRF options in a separate clinical consultation. A provider confirms candidacy, treatment area, and aftercare before either service.',
      whoItsFor: 'Clients who want to understand whether topical PRF during a needling appointment or a separate injectable PRF consultation is relevant to their goals. Health history, treatment area, and provider assessment determine candidacy.',
      process: [
        'Start with a consultation to identify the appropriate PRF lane.',
        'Review health history, candidacy, and the intended treatment area.',
        'Proceed only with the provider-selected preparation and protocol.',
        'Follow the individualized aftercare and follow-up guidance.',
      ],
      faqs: [
        faq('what-is-prf', 'What is PRF?', 'PRF stands for platelet-rich fibrin. It is prepared from a small sample of your own blood and used the same day as part of a provider-directed aesthetic protocol.'),
        faq('two-lanes', 'What are the two PRF lanes at House of Rose?', 'Amber’s PRF role is topical only during an appropriate needling protocol. Diana, RN evaluates and performs injectable PRF options in a separate clinical lane.'),
        faq('candidate', 'Is everyone a candidate for PRF?', 'No. Health history, medications, the intended area, and the selected protocol all matter. The appropriate provider confirms candidacy and may recommend a different option or timing.'),
      ],
      relatedServices: [ref('818469ff-9dee-4939-ad55-54fb1ca4e184', 'topical-prf')],
      seo: {
        _type: 'seo',
        metaTitle: 'PRF Treatment Options in Punta Gorda',
        metaDescription: 'Understand topical and injectable PRF options, provider roles, candidacy, and next steps at House of Rose in Punta Gorda.',
      },
    },
    unset: ['provider'],
  },
  {
    id: '818469ff-9dee-4939-ad55-54fb1ca4e184',
    set: {
      title: 'Topical PRF with Microneedling',
      slug: slug('prf-microneedling'),
      kind: 'treatment',
      status: 'live',
      price: '$450',
      duration: '60 minutes',
      tagline: 'Client-derived PRF applied topically during an appropriate needling protocol.',
      description: 'Topical PRF is prepared from a small sample of your blood and applied to the skin surface during an appropriate microneedling appointment. It is not injected and is not described as being delivered into the skin. Amber confirms candidacy and provides written aftercare. The currently verified PRF Skin Renewal appointment is $450.',
      whoItsFor: 'Clients already suited to microneedling who want to discuss a topical, client-derived adjunct. Amber confirms whether the treatment area and health history make topical PRF appropriate.',
      process: [
        'Complete a skin consultation and candidacy review.',
        'Confirm whether microneedling fits the visible concern.',
        'Prepare PRF from a small blood draw when appropriate.',
        'Apply PRF topically during the selected needling protocol.',
        'Leave with written, provider-selected aftercare.',
      ],
      faqs: [
        faq('what-is-prf-needling', 'What is PRF microneedling?', 'At House of Rose, this means microneedling with PRF applied topically to the skin surface. Amber’s PRF role is topical only; injectable PRF is Diana, RN’s separate lane.'),
        faq('cost', 'How much does topical PRF needling cost?', 'The currently verified PRF Skin Renewal appointment is $450. Your provider confirms the current price, treatment area, and recommended protocol before you book.'),
        faq('sessions', 'How many sessions will I need?', 'The appropriate number and timing depend on your skin, visible concern, recovery, and response. Amber reviews progress before recommending a follow-up visit.'),
        faq('candidate', 'Who may not be a candidate?', 'Certain health histories, medications, active skin concerns, pregnancy or breastfeeding, and other factors may require a different plan or timing. Your provider completes the candidacy review.'),
      ],
      relatedServices: [
        ref('f5308b9c-73df-4812-8c0d-afcf4ee5839a', 'microneedling'),
        ref('c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b', 'prf'),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Topical PRF Needling in Punta Gorda',
        metaDescription: 'Learn how topical PRF is used with microneedling, who may be a candidate, and the verified $450 appointment.',
      },
    },
  },
  {
    id: 'e8b38f03-900f-4ec5-9246-07cc1b65ed11',
    set: {
      status: 'live',
      seo: {
        _type: 'seo',
        metaTitle: 'Dermaplaning in Punta Gorda, FL',
        metaDescription: 'Dermaplaning at House of Rose removes surface buildup and fine vellus hair for a smoother-looking finish. Appointments start at $135.',
      },
    },
  },
  {
    id: '0e5554bd-f58d-4dbe-be0a-972ad9a27a0e',
    set: {
      status: 'live',
      seo: {
        _type: 'seo',
        metaTitle: 'Glo2Facial in Punta Gorda, FL',
        metaDescription: 'Explore the Geneo Glo2Facial at House of Rose in Punta Gorda, including oxygenation, exfoliation, infusion, candidacy, and pricing from $195.',
      },
    },
  },
];

const supportingDocuments = [
  {
    _id: 'cee6f8f5-ab0d-4ddb-990d-11e4ea992960',
    _type: 'costGuide',
    title: 'How Much Does Topical PRF Microneedling Cost in Punta Gorda?',
    slug: slug('prf-microneedling-cost-punta-gorda'),
    treatment: ref('818469ff-9dee-4939-ad55-54fb1ca4e184', 'treatment'),
    answer: 'The currently verified PRF Skin Renewal appointment at House of Rose is $450. It includes a candidacy review, PRF preparation from a small blood draw, the provider-selected needling protocol, topical PRF application, and aftercare. Your provider confirms the current investment and whether the treatment is appropriate before booking.',
    priceLow: 450,
    priceHigh: 450,
    priceUnit: 'per session',
    costFactors: [
      { _key: 'protocol', factor: 'Microneedling plan', effect: 'Amber confirms whether microneedling fits the visible concern and candidacy.' },
      { _key: 'area', factor: 'Treatment area', effect: 'The verified $450 appointment is the current reference; other areas require a consultation and current quote.' },
      { _key: 'follow-up', factor: 'Follow-up planning', effect: 'Another visit is recommended only after response, recovery, and goals are reviewed.' },
    ],
    whatsIncluded: 'Skin and candidacy review, blood draw and PRF preparation, the selected needling protocol, topical PRF application, written aftercare, and follow-up guidance.',
    faqs: [
      faq('insurance', 'Does insurance cover topical PRF needling?', 'It is an elective aesthetic service and is generally self-pay. House of Rose confirms the current investment before treatment.'),
      faq('series', 'Do I have to buy a series?', 'No. Your provider recommends timing based on your goals and response. A consultation explains whether more than one visit is sensible for you.'),
      faq('injected', 'Is the PRF injected during this appointment?', 'No. Amber applies PRF topically during the selected needling protocol. Injectable PRF is a separate clinical service performed by Diana, RN.'),
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Topical PRF Microneedling Cost in Punta Gorda',
      metaDescription: 'Topical PRF Skin Renewal at House of Rose is currently $450. See what is included and which factors your provider reviews first.',
    },
    orderRank: 10,
  },
  {
    _id: 'hor-cost-microneedling',
    _type: 'costGuide',
    title: 'How Much Does Microneedling Cost in Punta Gorda?',
    slug: slug('microneedling-cost-punta-gorda'),
    treatment: ref('f5308b9c-73df-4812-8c0d-afcf4ee5839a', 'treatment'),
    answer: 'Microneedling investment depends on the approved treatment area and personalized plan. House of Rose performs the service with the Procell Therapies device; when the Procell brand or its materials are discussed, it may be called Procell Microchanneling. That is not a separate service or cost category. Current pricing is confirmed before treatment.',
    costFactors: [
      { _key: 'area', factor: 'Treatment area', effect: 'Face, extended, and body areas may require different appointment plans and current quotes.' },
      { _key: 'topical', factor: 'Topical plan', effect: 'Eligible Procell materials or topical PRF may change the appointment plan and investment.' },
      { _key: 'follow-up', factor: 'Follow-up plan', effect: 'Future visits are based on goals, recovery, and individual response.' },
    ],
    whatsIncluded: 'Skin consultation and candidacy review, a new single-use cartridge for the Procell Therapies device, provider-selected microneedling, aftercare, and follow-up guidance.',
    faqs: [
      faq('starting-cost', 'What is the cost of microneedling?', 'House of Rose confirms current pricing after reviewing the treatment area and personalized plan.'),
      faq('series', 'Do I need a series?', 'The number and timing are individualized. Amber reviews your response before recommending follow-up.'),
      faq('consult', 'Why is a consultation important?', 'The consultation confirms candidacy, treatment area, recovery considerations, and current pricing.'),
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Microneedling Cost in Punta Gorda | House of Rose',
      metaDescription: 'Learn what shapes microneedling cost in Punta Gorda, including treatment area and optional topical plans, before your provider confirms the investment.',
    },
    orderRank: 20,
  },
  {
    _id: 'hor-area-port-charlotte',
    _type: 'localArea',
    title: 'Advanced Aesthetics Near Port Charlotte, FL',
    slug: slug('port-charlotte'),
    city: 'Port Charlotte',
    region: 'Charlotte County, FL',
    intro: 'House of Rose Aesthetics serves Port Charlotte clients from its advanced aesthetics and wellness studio at 525 E Olympia Ave, Unit 9 in Punta Gorda. Walk-ins are welcome, and appointments are recommended to reserve a time. Clients visit for Advanced Skin Imaging & Analysis, Procell Microchanneling, topical PRF, Glo2Facial, dermaplaning, injectables, and wellness services.',
    whyLocal: 'House of Rose is located in downtown Punta Gorda, not in Port Charlotte. The studio serves clients from across Charlotte County with thoughtful consultations, individualized treatment planning, and clear preparation and aftercare guidance.',
    servedServices: [
      ref('f5308b9c-73df-4812-8c0d-afcf4ee5839a', 'microneedling'),
      ref('818469ff-9dee-4939-ad55-54fb1ca4e184', 'topical-prf'),
      ref('0e5554bd-f58d-4dbe-be0a-972ad9a27a0e', 'glo2'),
      ref('e8b38f03-900f-4ec5-9246-07cc1b65ed11', 'dermaplaning'),
    ],
    neighborhoods: ['Charlotte Harbor', 'Murdock', 'Deep Creek', 'Harbour Heights'],
    faqs: [
      faq('location', 'Is House of Rose located in Port Charlotte?', 'No. House of Rose is located at 525 E Olympia Ave, Unit 9 in Punta Gorda and serves clients who travel from Port Charlotte and surrounding Charlotte County communities.'),
      faq('start', 'Where should a Port Charlotte client start?', 'If you are unsure which skin service fits, begin with Advanced Skin Imaging & Analysis and a provider-reviewed consultation at the Punta Gorda studio.'),
      faq('book', 'How do I schedule from Port Charlotte?', 'Review the current services menu or call (844) 941-7673. The team can help you choose an appropriate consultation or service.'),
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Advanced Aesthetics Near Port Charlotte, FL',
      metaDescription: 'Port Charlotte clients visit House of Rose in Punta Gorda for Advanced Skin Imaging & Analysis, Procell, topical PRF, facials, injectables, and wellness.',
    },
    orderRank: 20,
  },
];

const skinAnalysisPatch = {
  seoTitle: 'Advanced Skin Imaging & Analysis in Punta Gorda, FL',
  seoDescription: 'See your skin first with advanced multi-spectrum imaging and a provider-reviewed consultation at House of Rose in Punta Gorda. Build a clearer treatment plan.',
  heroKicker: 'See Your Skin First · Punta Gorda',
  heroTitle: 'See your skin before choosing a treatment.',
  heroDescription: 'Advanced multi-spectrum imaging gives you and your provider a clearer view of visible skin patterns, followed by a consultation that turns the images into an individualized plan.',
  heroCtaPrimaryText: 'Begin With a Skin Consultation',
  ctaKicker: 'See Your Skin First',
  ctaHeading: 'Begin with a clearer view of your skin.',
  ctaPara: 'Share your details and our team will follow up during business hours to arrange your advanced skin imaging session and provider-reviewed consultation in Punta Gorda.',
  ctaPrimaryText: 'Begin With a Skin Consultation',
  concernLinks: [
    { _key: 'fine-lines', title: 'Fine Lines & Laxity', slug: 'fine-lines-laxity' },
    { _key: 'acne-scarring', title: 'Acne Scarring', slug: 'acne-scarring' },
    { _key: 'sun-damage', title: 'Sun Damage', slug: 'sun-damage' },
    { _key: 'under-eyes', title: 'Dark Circles & Under-Eyes', slug: 'dark-circles' },
    { _key: 'stretch-marks', title: 'Stretch Marks', slug: 'stretch-marks' },
    { _key: 'texture', title: 'Texture', slug: 'texture' },
  ],
};

const truthSetPatches = [
  {
    id: 'homepage',
    set: {
      serviceGroups: [
        {
          _key: 'sg1',
          name: 'Advanced Skin Treatments',
          description: 'Procell microchanneling and topical PRF needling selected around visible texture, tone, fine lines, scars, stretch marks, candidacy, and recovery preferences.',
          imagePath: '/images/new-microchanneling.webp',
        },
        {
          _key: 'sg2',
          name: 'Injectables & Structural Enhancements',
          description: 'Botox, dermal fillers, PRF under-eye rejuvenation, and EZ Gel bio-filler chosen with a careful, balanced, consultation-led approach.',
          imagePath: '/images/new-injectables.webp',
        },
        {
          _key: 'sg3',
          name: 'Skin Health & Corrective Care',
          description: 'Face Reality acne care, Glo2Facial, dermaplaning, and personalized guidance rooted in what your skin is showing today.',
          imagePath: '/images/new-facials.png',
        },
        {
          _key: 'sg4',
          name: 'Wellness & Performance Support',
          description: 'IV hydration, provider-guided weight management, and select services that complement your aesthetic goals and overall care experience.',
          imagePath: '/images/new-wellness.webp',
        },
      ],
    },
  },
  {
    id: 'collection-advanced-facials',
    set: {
      description: 'Consultation-led Glo2Facial, dermaplaning, Procell, and topical PRF options selected around your visible skin goals and candidacy.',
    },
  },
  {
    id: 'collection-facials',
    set: {
      description: 'Thoughtful, results-focused facial care with clear process guidance, realistic expectations, and provider-selected next steps.',
    },
  },
  {
    id: '6e204a23-77a2-48a9-8381-878974cb92e4',
    set: {
      description: 'GLP-1 Weight Management is a medically supervised, physician-guided program led by Diana, RN. It includes candidacy screening, provider-selected medication and dosing when appropriate, and regular check-ins to review tolerance and progress. These medications can affect appetite and fullness, but individual response varies and medication does not replace nutrition, hydration, movement, or ongoing medical guidance. Common side effects can include nausea, vomiting, diarrhea, and constipation. Diana reviews risks, exclusions, and when to contact the clinical team before a client begins.',
      faqs: [
        faq('faq0', 'What results should I expect?', 'Individual response varies. Your provider discusses realistic goals, monitors progress, and adjusts the plan based on candidacy, tolerance, and clinical judgment.'),
        faq('faq1', 'Are these the same as Ozempic, Wegovy, Mounjaro, or Zepbound?', 'Some programs use medications with the same active ingredients found in those branded prescriptions. Your provider explains the exact medication, source, indication, and dosing considered for your plan.'),
        faq('faq2', 'What is the difference between semaglutide and tirzepatide?', 'They act on different appetite-related pathways. Your provider determines whether either option is appropriate after reviewing your health history, goals, contraindications, and current guidance.'),
        faq('faq3', 'What are the common side effects?', 'Common effects can include nausea, vomiting, diarrhea, or constipation. Your provider explains dose timing, monitoring, and when to contact the clinical team.'),
        faq('faq4', 'Why is provider oversight important?', 'Screening, medication review, dose decisions, side-effect monitoring, and accessible follow-up all require clinical judgment. Online convenience does not replace an appropriate provider relationship.'),
        faq('faq5', 'What happens if I stop?', 'Appetite effects may change after stopping and weight regain is possible. Continuation, maintenance, or tapering should be discussed with your provider rather than decided without clinical guidance.'),
      ],
    },
  },
  {
    id: '59219510-249d-48e7-9c11-373e8d2c460b',
    set: {
      faqs: [
        faq('faq0', 'What is included in the Wellness lane?', 'The current lane includes IV Hydration Therapy and provider-guided GLP-1 Weight Management. Diana, RN provides these services under the appropriate clinical oversight.'),
        faq('faq1', 'Who administers these wellness services?', 'Diana, RN leads this lane under the appropriate medical oversight. The team routes each inquiry to the provider whose scope matches the service.'),
        faq('faq2', 'Do I need a consultation first?', 'Yes. Diana reviews health history, medications, goals, and service-specific exclusions before determining candidacy.'),
        faq('faq3', 'Can IV therapy or weight management support my skin goals?', 'Hydration and overall wellness can complement a skin-care plan, but they do not replace skin consultation, daily care, sun protection, or treatment selected for a visible concern.'),
        faq('faq4', 'How do I choose between IV therapy and the GLP-1 program?', 'They address different goals and require different screening. Diana helps determine whether either service fits your health history and goals.'),
        faq('faq5', 'Are these services intended to treat a diagnosed condition?', 'No. These offerings support wellness and are not presented as a substitute for diagnosis or care from your physician.'),
      ],
    },
  },
];

const verifiedComparisonId = '383712f3-f854-491c-954c-7b6fa6420827';
const parkedComparisonIds = [
  'hor.comparison.prf-injections-vs-ez-gel',
  'hor.comparison.Procell-serum-vs-prf',
  'hor.comparison.Procell-vs-topical-prf',
  'hor.comparison.topical-prf-vs-prf-injections',
];

const summary = {
  parkedServices: parkedServiceIds.length,
  activatedVerifiedServices: verifiedLiveServiceIds.length,
  priorityServicePatches: servicePatches.length,
  parkedPackages: parkedPackageIds.length,
  supportingDocuments: supportingDocuments.map((document) => `${document._type}:${document._id}`),
  concernRepairs: ['Texture → texture', 'enlarged-pored → enlarged-pores', 'hair-thinning → parked'],
  truthSetPatches: truthSetPatches.map((item) => item.id),
};

if (!shouldApply) {
  console.log(JSON.stringify(summary, null, 2));
  console.log('\nDry run only. Add --apply to reconcile the published dataset.');
  process.exit(0);
}

if (!token) throw new Error('Missing Sanity write token.');

// Resolve the promise-based client bundled with the web workspace. The hoisted
// legacy v3 client returns Observables, so `await transaction.commit()` would
// otherwise complete without subscribing or sending the mutation.
const sanityClientModule = await import('../../../node_modules/@sanity/client/dist/index.js');
const { createClient } = sanityClientModule;
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const requiredIds = [
  ...parkedServiceIds,
  ...verifiedLiveServiceIds,
  ...servicePatches.map((item) => item.id),
  verifiedComparisonId,
  ...parkedComparisonIds,
  ...truthSetPatches.map((item) => item.id),
  'skinAnalysis',
];
const existingIds = await client.fetch(`*[_id in $ids]._id`, { ids: requiredIds });
const missingIds = requiredIds.filter((id) => !existingIds.includes(id));
if (missingIds.length) throw new Error(`Refusing to apply: missing expected documents: ${missingIds.join(', ')}`);

let transaction = client.transaction();

for (const id of parkedServiceIds) transaction = transaction.patch(id, { set: { status: 'parked' } });
for (const id of verifiedLiveServiceIds) transaction = transaction.patch(id, { set: { status: 'live' } });
for (const id of parkedPackageIds) transaction = transaction.patch(id, { set: { status: 'parked' } });
for (const id of parkedComparisonIds) transaction = transaction.patch(id, { set: { status: 'parked' } });
transaction = transaction.patch(verifiedComparisonId, { set: { status: 'live' } });
for (const item of servicePatches) transaction = transaction.patch(item.id, { set: item.set, unset: item.unset ?? [] });
for (const item of truthSetPatches) transaction = transaction.patch(item.id, { set: item.set });

transaction = transaction
  .patch('ad938cc9-1677-42ce-ad14-085362954677', { set: { status: 'live' } })
  .patch('5542890f-9add-4d83-9048-2e50cd5f43c1', { set: { status: 'live' } })
  .patch('6b793d2e-1932-4b07-b1b7-82a48108c716', { set: { status: 'live' } })
  .patch('4ac9c656-55f5-46fc-ad1e-e8619f474e84', { set: { status: 'live' } })
  .patch('f36aa3c0-9681-4e82-95dd-1ad4abbdb3f8', { set: { status: 'live' } })
  .patch('e07ca64c-62da-4aef-94f5-a0517ccb70fb', { set: { status: 'live' } })
  .patch('ac651187-ec12-4324-a5c6-974a73b42f1a', { set: { status: 'live' } })
  .patch('8f656986-2176-42b6-bf07-1071d5a03887', { set: { status: 'parked' } })
  .patch('e775f8a4-266e-4edb-8c6f-eba826fc94cd', {
    set: {
      status: 'live',
      title: 'Texture',
      slug: slug('texture'),
      seo: {
        _type: 'seo',
        metaTitle: 'Skin Texture Treatments in Punta Gorda, FL',
        metaDescription: 'Explore consultation-led options for visible skin texture at House of Rose in Punta Gorda, including Procell, topical PRF, and facials.',
      },
    },
  })
  .patch('bf424b8e-119f-49b6-827f-82d2b24cefb1', {
    set: {
      status: 'live',
      title: 'Enlarged-Looking Pores',
      slug: slug('enlarged-pores'),
      seo: {
        _type: 'seo',
        metaTitle: 'Enlarged-Looking Pore Care in Punta Gorda',
        metaDescription: 'Learn which consultation-led skin services may support the appearance of enlarged pores at House of Rose in Punta Gorda.',
      },
    },
  })
  .patch('383712f3-f854-491c-954c-7b6fa6420827', {
    set: {
      status: 'parked',
      title: 'Retired Comparison — Microneedling Terminology',
      slug: slug('microchanneling-vs-microneedling'),
      seo: {
        _type: 'seo',
        metaTitle: 'Microneedling in Punta Gorda | House of Rose',
        metaDescription: 'Use the canonical House of Rose microneedling guide for treatment areas, candidacy, recovery, and Procell context in Punta Gorda.',
      },
    },
  })
  .patch('skinAnalysis', { set: skinAnalysisPatch });

await transaction.commit();

// Keep creates outside the transaction: older @sanity/client versions used by
// Studio can silently omit createOrReplace mutations when mixed into the large
// reconciliation transaction above.
for (const document of supportingDocuments) {
  await client.createOrReplace(document);
}

const supportingIds = supportingDocuments.map((document) => document._id);
const verifiedSupportingIds = await client.fetch(`*[_id in $ids]._id`, { ids: supportingIds });
const missingSupportingIds = supportingIds.filter((id) => !verifiedSupportingIds.includes(id));
if (missingSupportingIds.length) {
  throw new Error(`Supporting documents were not persisted: ${missingSupportingIds.join(', ')}`);
}

const privateLegacySupportingIds = ['hor.cost.Procell-microchanneling', 'hor.area.port-charlotte'];
const existingLegacySupportingIds = await client.fetch(`*[_id in $ids]._id`, { ids: privateLegacySupportingIds });
for (const legacyId of existingLegacySupportingIds) {
  await client.delete(legacyId);
}

console.log('Visibility plan reconciliation applied successfully.');
console.log(JSON.stringify(summary, null, 2));
