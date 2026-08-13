/**
 * Restore the three approved service URLs that were omitted from static builds
 * because their Sanity status was not public.
 *
 * Dry run:
 *   npx sanity exec scripts/fix-missing-service-pages.mjs --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/fix-missing-service-pages.mjs --with-user-token -- --apply
 */
import { getCliClient } from 'sanity/cli';

throw new Error(
  'Archived by the 2026-08-13 voice reset. This script reactivates unsupported services and stale public copy.',
);

const apply = process.argv.includes('--apply');
const apiVersion = '2025-04-26';
const client = getCliClient({ apiVersion });

const services = [
  {
    _id: 'a4bc2059-2510-445b-ae7c-db9f4c3251e7',
    slug: 'neck-decollete-extension',
    set: {
      status: 'live',
      description:
        "The Neck & Décolleté Extension is an add-on, not a standalone facial — it carries the treatment you're already having (a Glo2Facial, a BioRePeel, or a microneedling session) down onto the neck and chest so the results don't stop at your jawline. It exists because the neck and décolleté are among the first areas to show the visible signs of aging and sun exposure — in SW Florida especially — yet they're often left out of facial treatments, which creates a mismatch between a refreshed face and untreated skin below it. When you add the extension, whatever your core treatment does for your face is continued over the neck and chest by the same provider in the same visit: with a Glo2Facial, the exfoliating, infusing, oxygenating pass and massage carry down; with a BioRePeel, the resurfacing peel is applied to the extended area; with microneedling, the treatment is carried onto the neck and chest, and topical PRF — when part of your plan — is applied over those freshly treated areas, never injected. The sensation, downtime, and aftercare for the extended skin mirror your core treatment, so a no-downtime Glo2Facial extension stays no-downtime, while a peel or needling extension carries that treatment's light flaking or redness onto the neck and chest. Neck and chest skin is thinner and more delicate than the face, so the provider adjusts intensity for the area. Honest note: this is an add-on that extends an existing treatment — it is booked alongside a core service, not on its own.",
      faqs: [
        {
          _key: 'faq0',
          question: 'Is this a standalone facial?',
          answer:
            "No — it's an add-on that extends a treatment you're already having. It's booked alongside a Glo2Facial, BioRePeel, or microneedling session to carry the results onto the neck and chest, not on its own.",
        },
        {
          _key: 'faq1',
          question: 'Why treat the neck and décolleté separately?',
          answer:
            "The neck and chest are among the first areas to show the visible signs of aging and sun exposure, yet they're often left out of facial treatments. Extending your treatment down keeps your refreshed face and the skin below it consistent.",
        },
        {
          _key: 'faq2',
          question: 'Will the downtime be different for my neck and chest?',
          answer:
            "The extended skin follows your core treatment. A no-downtime Glo2Facial extension stays no-downtime, while a peel or needling extension carries that treatment's light flaking or redness onto the neck and chest. Neck skin is more delicate, so the provider adjusts intensity accordingly.",
        },
        {
          _key: 'faq3',
          question: 'Is the PRF injected into my neck?',
          answer:
            'No. When PRF is part of your needling plan, it is applied topically over the freshly treated skin; it is never injected. Injectable PRF is a separate clinical procedure performed by a licensed medical provider.',
        },
        {
          _key: 'faq4',
          question: 'Which treatments can I add this to?',
          answer:
            "It pairs with a Glo2Facial, a BioRePeel, or microneedling to address the selected concern below the jawline. Your provider confirms it's appropriate alongside your chosen treatment.",
        },
        {
          _key: 'faq5',
          question: 'Does neck and chest skin need a gentler approach?',
          answer:
            'Yes — skin here is thinner and more delicate than the face, so the provider adjusts intensity for the area. Candidacy and approach are confirmed at consultation, and individual outcomes vary.',
        },
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Neck & Décolleté Treatment Extension | Punta Gorda',
        metaDescription:
          'Extend an eligible facial, peel, or microneedling treatment to the neck and décolleté at House of Rose in Punta Gorda.',
      },
    },
  },
  {
    _id: 'e9842046-4d2c-448d-92fa-39cb4fff5b2d',
    slug: 'prf-body-treatments',
    set: {
      status: 'live',
      description:
        "PRF Body Treatments extend topical PRF beyond the face to approved body zones, layering your own growth factors onto a corrective microneedling protocol over the body. The mechanism is the same as the facial service: a small sample of your blood is drawn and spun gently with no anticoagulant, forming a natural fibrin scaffold that holds your platelets, white blood cells, and growth factors. That fluid PRF is applied to the skin surface during needling, then releases its growth factors gradually over the following days to support your skin's natural collagen-renewal response. It is topical only and never injected. Because body skin is thicker and more resilient than facial skin, the practical differences are larger treatment areas, more product, and a longer series. Body PRF is commonly chosen to support the appearance of the texture and color variation of mature stretch marks, defined texture, or crepey-looking skin. It is honest to set expectations here: this is an adjunct that supports the appearance of these concerns, not a treatment that removes stretch marks or scars. Comfort is supported by numbing, and you will feel the needling more than the PRF. Redness, tightness, and light tenderness in the area can occur, early changes often appear around two to six weeks, and collagen remodeling continues over weeks to months. Body goals are typically planned as a longer series, often a series of six, with the exact zone and cadence confirmed at your consultation.",
      faqs: [
        {
          _key: 'faq0',
          question: 'Which body areas can be treated?',
          answer:
            'Body PRF is offered as a per-zone upgrade for approved areas, commonly to support the appearance of mature stretch marks, scars, or crepey-looking skin. The specific zone and your candidacy are assessed separately at your consultation, since suitability varies by area and skin.',
        },
        {
          _key: 'faq1',
          question: 'Is the PRF injected on the body?',
          answer:
            'No. Body PRF is applied to the skin surface during a microneedling protocol; it is never injected. Injectable PRF is a separate clinical procedure performed by a licensed medical provider.',
        },
        {
          _key: 'faq2',
          question: 'Will this remove my stretch marks or scars?',
          answer:
            'No. Topical PRF on the body is an adjunct that supports the appearance of the texture and color variation of mature stretch marks and defined texture; it does not remove them. Results are individual, build gradually, and vary from person to person.',
        },
        {
          _key: 'faq3',
          question: 'How many sessions will I need for a body zone?',
          answer:
            'Body skin is thicker and more resilient, so body goals are typically planned as a longer series, often a series of six, spaced several weeks apart, then individualized maintenance. Your provider sets the exact plan after assessing the zone.',
        },
        {
          _key: 'faq4',
          question: 'How much downtime should I expect on the body?',
          answer:
            'Typically minimal, though it varies with the zone, depth, and your skin. Redness, tightness, mild tenderness, or light peeling in the treated area can occur for a short time. You will receive written aftercare, including sun, heat, and exercise guidance, rather than a fixed recovery promise.',
        },
        {
          _key: 'faq5',
          question: 'When will I see changes on the body?',
          answer:
            'Many clients notice early changes around two to six weeks, with collagen remodeling continuing over weeks to months. Because body skin is thicker and body goals often involve mature texture, consistency across the full series matters, and individual outcomes vary.',
        },
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Topical PRF Body Treatments in Punta Gorda',
        metaDescription:
          'Explore topical PRF with body microneedling for the appearance of stretch-mark, scar, and crepey skin texture at House of Rose in Punta Gorda.',
      },
    },
  },
  {
    _id: 'hor.service.prf-fibrin-veil',
    slug: 'prf-fibrin-veil',
    set: {
      title: 'PRF Fibrin Veil',
      status: 'live',
      kind: 'treatment',
      duration: '105–120 minutes',
      tagline: 'A two-phase topical PRF treatment with a naturally formed fibrin finishing veil.',
      description:
        "The PRF Fibrin Veil is a two-phase topical PRF treatment that pairs provider-selected microneedling with liquid PRF during the treatment and a naturally formed fibrin gel as the finishing layer. PRF is prepared from a small sample of your own blood and applied to the skin's surface; it is never described as injected or delivered to a specific depth. The treatment is designed to support smoother-looking texture, refreshed luminosity, and the appearance of fine lines, enlarged-looking pores, and selected scar texture. Your licensed provider confirms blood-draw eligibility, device choice, and whether the protocol fits your skin. Individual response, downtime, and results vary.",
      whoItsFor:
        'The PRF Fibrin Veil may be considered for clients who are comfortable with a small blood draw and are candidates for microneedling. Your licensed provider reviews skin status, health history, medications, recovery timing, and treatment goals before confirming candidacy.',
      pricingModel: 'consult',
      pricingNotes:
        'Public website is consultation-first and price-free until the service is added to GlossGenius. Confirm current protocol and investment before booking.',
      process: [
        'Complete a consultation and candidacy review for the selected treatment area and needling pathway.',
        'Prepare PRF from a small blood sample using the provider-selected protocol.',
        'Apply liquid PRF topically during the selected microneedling treatment.',
        'Allow a second PRF portion to naturally form the soft fibrin finishing veil.',
        'Apply the veil as the final surface layer and provide individualized written aftercare.',
      ],
      faqs: [
        {
          _key: 'f0',
          question: 'Is the PRF Fibrin Veil injected?',
          answer:
            "No. Liquid PRF and the naturally formed fibrin veil are applied topically to the skin's surface. The treatment is not represented as injecting PRF or delivering it to a specific skin depth.",
        },
        {
          _key: 'f1',
          question: 'What does the PRF Fibrin Veil treatment include?',
          answer:
            'The treatment includes a candidacy review, PRF collection and preparation, provider-selected microneedling, topical liquid PRF, the naturally formed fibrin finishing veil, and personalized aftercare.',
        },
        {
          _key: 'f2',
          question: 'Is the PRF Fibrin Veil a complete treatment?',
          answer:
            'Yes. The PRF Fibrin Veil is a complete two-phase protocol rather than a small finishing add-on. Your licensed provider selects the needling pathway and confirms whether the full treatment is appropriate for you.',
        },
        {
          _key: 'f3',
          question: 'Why does the treatment require a blood draw?',
          answer:
            'PRF is prepared from a small sample of your own blood. One portion remains liquid for topical use during the selected needling protocol, while another naturally develops into the soft fibrin finishing veil.',
        },
        {
          _key: 'f4',
          question: 'What downtime should I expect?',
          answer:
            'Downtime follows the selected microneedling treatment. Temporary redness, warmth, tightness, tenderness, dryness, or light flaking may occur, and your licensed provider will give you written aftercare.',
        },
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'PRF Fibrin Veil Treatment in Punta Gorda',
        metaDescription:
          'Learn how the PRF Fibrin Veil pairs topical liquid PRF with microneedling and a naturally formed fibrin finish in Punta Gorda.',
      },
    },
    unset: ['price'],
  },
];

const ids = services.map(({ _id }) => _id);
const current = await client.fetch(
  `*[_id in $ids]{
    _id,
    _rev,
    title,
    "slug": slug.current,
    status
  } | order(slug asc)`,
  { ids },
);

if (current.length !== services.length) {
  throw new Error(`Expected ${services.length} documents; found ${current.length}.`);
}

console.log(
  JSON.stringify(
    {
      mode: apply ? 'apply' : 'dry-run',
      services: current.map(({ _id, slug, status }) => ({ _id, slug, status })),
    },
    null,
    2,
  ),
);

if (!apply) {
  console.log('Dry run only. Re-run with --apply to update Sanity.');
  process.exit(0);
}

let transaction = client.transaction();
for (const service of services) {
  const document = current.find(({ _id }) => _id === service._id);
  transaction = transaction.patch(service._id, (patch) => {
    let next = patch.ifRevisionId(document._rev).set(service.set);
    if (service.unset?.length) next = next.unset(service.unset);
    return next;
  });
}

await transaction.commit({ visibility: 'sync' });

const updated = await client.fetch(
  `*[_id in $ids]{
    _id,
    title,
    "slug": slug.current,
    status,
    kind,
    duration,
    price,
    "metaTitle": seo.metaTitle
  } | order(slug asc)`,
  { ids },
);

console.log(JSON.stringify({ updated }, null, 2));
