/**
 * Prepare unpublished Sanity drafts for the House of Rose copy humanization pass.
 *
 * Default:
 *   npm run content:humanize
 *
 * Create missing drafts (never publishes or overwrites an existing draft):
 *   npm run content:humanize:apply
 *
 * Refresh drafts created by this workflow, while preserving pre-existing drafts:
 *   npm run content:humanize:refresh
 *
 * Verify the prepared drafts without publishing:
 *   npm run content:humanize:verify
 */

import { createClient } from '@sanity/client';

throw new Error('Archived by the 2026-08-13 voice reset. Do not recreate these drafts.');

const APPLY = process.argv.includes('--apply');
const REFRESH = process.argv.includes('--refresh');
const VERIFY = process.argv.includes('--verify');
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  '4e7axyi7';
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.PUBLIC_SANITY_DATASET ??
  'production';
const apiVersion =
  process.env.SANITY_API_VERSION ??
  process.env.PUBLIC_SANITY_API_VERSION ??
  '2025-04-26';
const token =
  process.env.SANITY_API_WRITE_TOKEN ??
  process.env.SANITY_AUTH_TOKEN ??
  process.env.SANITY_TOKEN;

const homepagePatch = {
  seoDescription:
    'Explore advanced aesthetics, injectables, facials, wellness services, and professional skincare at House of Rose in Punta Gorda, Florida.',
  heroDescription:
    'Thoughtful treatments for your skin, features, and overall wellness—chosen around your goals and what makes sense for you. We focus on natural-looking results and long-term skin health.',
  aboutHeading: 'Care that starts with listening.',
  aboutPara1:
    'House of Rose is for people who want to understand their options, ask questions, and never feel rushed through a treatment.',
  aboutPara2:
    'We look at your goals, your skin, and your comfort level before recommending a next step. Advanced imaging can add useful detail, while a real conversation keeps the plan grounded in what matters to you.',
  aboutPara3:
    "That might mean one focused service or a plan that changes over time. Either way, you'll know what we're recommending and why.",
  approachHeading: 'Advanced care, with a clear reason behind it.',
  approachPara1:
    'Good treatment planning is less about chasing every new option and more about choosing the right service at the right time.',
  approachPara2:
    'PRF, microneedling, facials, injectables, and wellness services each have a place. We look at candidacy, recovery, and the result you want before deciding what belongs in your plan.',
  approachClosing: 'You should leave feeling like yourself—just well cared for.',
  servicesHeading: 'Start with what you want to improve.',
  servicesIntro:
    "You don't need to know the name of every treatment before you begin. Explore the four areas below, then we'll help you narrow the options around your goals, candidacy, and preferred recovery time.",
  scanKicker: 'Advanced Skin Imaging',
  scanHeading: 'See what your skin is showing us.',
  scanPara1:
    "If you're not sure where to start, advanced skin imaging can give us a closer look at texture, hydration, pores, pigmentation, fine lines, and visible sun exposure.",
  scanPara2:
    "We'll review the images with you in plain language and connect what we see to the goals you share. You'll leave with a practical starting point and no pressure to book a treatment.",
  scanQuote: "Bring your questions. We'll help you make sense of the options.",
  scanCtaSecondaryText: 'Book a Skin Analysis',
  careKicker: 'Home Care',
  careHeading: 'Skincare that earns its place on your shelf.',
  carePara1:
    'The products you use between visits matter. We carry post-treatment aftercare, acne support, mineral makeup, SPF, and professional skincare that can fit into a realistic home routine.',
  carePara2:
    "We'll help you sort through the options and explain what each recommendation is for, so you can spend less time guessing and more time using what works for your plan.",
  expKicker: 'The practice',
  expHeading: 'Inside House of Rose.',
  expPara1: 'These are the actual treatment rooms and storefront at 525 E Olympia Avenue in Punta Gorda.',
  localHeading: 'Advanced aesthetics, right here in Punta Gorda.',
  localPara1:
    'House of Rose welcomes clients from Punta Gorda, Charlotte County, and across Southwest Florida for advanced aesthetics, skin care, injectables, and wellness services.',
  localPara2:
    "Know what you want? Book your visit online. Still sorting through the options? Call or send us a message and we'll help you choose a sensible place to start.",
  finalHeading: 'Ready to talk through your options?',
  finalPara:
    "Tell us what you're hoping to improve, and we'll help you find the next step that fits your goals.",
};

const skinAnalysisPatch = {
  heroTitle: 'Advanced skin imaging gives you a clearer place to start.',
  heroDescription:
    'In-studio imaging helps us take a closer look at pigmentation, texture, pores, fine lines, hydration cues, and visible sun exposure before you choose a skin treatment.',
  heroCtaPrimaryText: 'Request a Skin Analysis',
  whatHeading: 'A closer look before you choose a treatment.',
  whatPara1:
    'It can be hard to tell what your skin needs from the mirror alone. Advanced imaging gives us another way to look at pigmentation, texture, pores, hydration cues, and visible sun exposure.',
  whatPara2:
    'We use those images to guide the conversation, not to make a diagnosis. The scan supports provider judgment and helps explain why one option may fit your goals better than another.',
  howHeading: "Here's how the visit works.",
  steps: [
    {
      _key: 'step-capture',
      n: '01',
      title: 'Take the images',
      body: 'We photograph your skin in consistent, controlled lighting, including views that can reveal patterns that are easy to miss in an ordinary mirror.',
    },
    {
      _key: 'step-analyze',
      n: '02',
      title: 'Review the details',
      body: 'Imaging under standard, cross-polarized, and UV light helps us look more closely at pigmentation, pores, texture, fine lines, hydration cues, and visible signs of sun exposure.',
    },
    {
      _key: 'step-plan',
      n: '03',
      title: 'Talk through a plan',
      body: 'We review the images with you, answer your questions, and discuss which concerns make sense to address first.',
    },
  ],
  lookHeading: 'What the images can help us see.',
  lookPara:
    "We'll explain each marker in plain language and connect it to the concerns you brought up. You can ask questions as we go.",
  whyHeading: 'A clearer conversation about your skin.',
  whyPara:
    'A baseline makes it easier to focus on the concern that matters most to you and avoid treatments that do not belong in your plan. Future images can also help you and your provider discuss visible changes over time.',
  planHeading: 'Match what we see to a sensible next step.',
  planPara:
    'Explore the concerns below to learn about common options, or bring your questions to the appointment and let us help you narrow the list.',
  ctaHeading: 'Want a closer look at your skin?',
  ctaPara:
    "Leave your details and we'll reach out to arrange advanced skin imaging in Punta Gorda. You can review the images, ask questions, and decide what—if anything—you want to do next.",
  ctaPrimaryText: 'Request a Skin Analysis',
  faqs: [
    {
      _key: 'faq-need-analysis',
      q: 'Do I need a skin analysis before treatment?',
      a: 'No. It is not required for every appointment. The analysis can be helpful when you are unsure where to begin or want a clearer baseline before choosing a skin treatment.',
    },
    {
      _key: 'faq-what-looks-for',
      q: 'What does the skin imaging show?',
      a: 'The scanner helps evaluate visible and subsurface patterns such as pigmentation, sun exposure, pores, texture, fine lines, hydration cues, and overall skin quality. Your provider reviews the results for treatment planning; the scan is not a medical diagnosis.',
    },
    {
      _key: 'faq-track-progress',
      q: 'Can the scan track before-and-after progress?',
      a: 'Yes. The scan creates a baseline that can be compared over time, which can be useful when discussing visible changes from advanced skin treatments, professional skincare, and long-term maintenance.',
    },
    {
      _key: 'faq-how-long',
      q: 'How long does it take?',
      a: 'Taking the images only takes a few minutes. We spend the rest of the visit walking through what we see, answering your questions, and discussing possible next steps.',
    },
    {
      _key: 'faq-uncomfortable',
      q: 'Is skin imaging uncomfortable?',
      a: 'No. It is non-invasive, with no needles and no downtime. We take the images, review them with you, and explain what the analysis may mean for your options.',
    },
    {
      _key: 'faq-photos',
      q: 'What happens to my photos?',
      a: 'Your images are kept private and used only to inform your care. They are not shared or published without your explicit permission.',
    },
  ],
};

const contactPatch = {
  heroKicker: 'Questions Are Welcome',
  heroDescription:
    "Call, review the services menu, or send us a message. We'll help you figure out who to see and what to book.",
  bookLabel: 'Know What You Want?',
  bookNote: 'Review current services anytime',
  formKicker: 'Send a Message',
  formHeading: 'How can we help?',
  formIntro:
    "Tell us what you're considering or what you need help with. A member of the team will follow up.",
  phoneHours: 'Mon–Fri, 9AM–5PM ET',
};

const experiencePatch = {
  heroSubtitle:
    'See what to expect before, during, and after a visit to House of Rose.',
  storyHeading: 'A calm place to ask questions and make a plan.',
  storyParagraph1:
    'House of Rose was built around a simple idea: good care includes the way you are treated, not only the service you receive. We make time for conversation, explain our recommendations, and keep the pace comfortable.',
  storyParagraph2:
    'We are a small aesthetics and wellness studio in Punta Gorda. Walk-ins are welcome, and appointments are recommended when you want to reserve a specific time. You will always have room to ask questions before a service begins.',
  standards: [
    {
      _key: 'std-1',
      title: 'Clear Reasons',
      description:
        'We explain why a service may fit your goals and what you can realistically expect from it.',
    },
    {
      _key: 'std-2',
      title: 'Care That Fits You',
      description:
        'Your goals, relevant history, timing, and comfort with recovery all shape the recommendation.',
    },
    {
      _key: 'std-3',
      title: 'Unhurried',
      description:
        'There is time to talk. Your questions are welcome before, during, and after your visit.',
    },
    {
      _key: 'std-4',
      title: 'Honest',
      description:
        'We will tell you when a service does not fit and will not promise an outcome we cannot guarantee.',
    },
  ],
  journeySteps: [
    {
      _key: 'step-1',
      step: '01',
      title: 'Choose how to start',
      description:
        'Book the service you already know you want, request a consultation, or stop in as a walk-in. Calling ahead is the best way to reserve a specific time.',
    },
    {
      _key: 'step-2',
      step: '02',
      title: 'Talk through the options',
      description:
        'Tell us what you want to improve and what matters to you about timing or recovery. We will explain the services that may fit.',
    },
    {
      _key: 'step-3',
      step: '03',
      title: 'Know what to expect',
      description:
        'Before the service begins, you will understand what happens during the visit, the likely recovery, and the aftercare.',
    },
    {
      _key: 'step-4',
      step: '04',
      title: 'Check in and adjust',
      description:
        'If your goal involves more than one visit, we review how you responded before recommending the next appointment.',
    },
  ],
};

const rentARoomPatch = {
  seoDescription:
    'Private suite rentals for aestheticians, massage therapists, and PMU artists in Punta Gorda, FL. Starting at $850 per month with utilities included.',
  heroDescription:
    'Private, equipped rooms for independent beauty and wellness professionals who want to grow their own practice in Punta Gorda.',
  perksHeading: 'The practical details are already handled',
  perksIntro:
    'Utilities and shared studio essentials are included, so you can focus on your clients and your own business.',
  candidatesIntro:
    'We are looking for licensed professionals who care about their clients and are ready to run an independent practice.',
  candidates: [
    {
      _key: 'c1',
      number: '01',
      title: 'Aestheticians',
      description:
        'Licensed facial specialists, skin care therapists, and estheticians who want a private room for seeing their own clients.',
    },
    {
      _key: 'c2',
      number: '02',
      title: 'Massage Therapists',
      description:
        'Licensed massage therapists who want a dedicated treatment room without taking on the overhead of a standalone studio.',
    },
    {
      _key: 'c3',
      number: '03',
      title: 'PMU Artists',
      description:
        'Permanent makeup artists who want a clean, professional room for brow, lip, liner, or microblading clients.',
    },
  ],
  ctaBody:
    'We limit the number of suites and do not place competing specialties in the studio. Once a specialty is represented, that opening closes until the room becomes available again.',
};

const collectionDescriptions = {
  'collection-acne-bootcamp':
    'A 12-week Face Reality program that combines regular in-studio visits, guided home care, and ongoing support for clearer-looking skin.',
  'collection-advanced-facials':
    'Compare Glo2Facial, dermaplaning, Procell, and topical PRF options for visible texture, tone, hydration, and overall skin quality.',
  'collection-enhancements':
    'Optional finishing steps and add-ons that may be paired with an eligible service when they fit your treatment plan.',
  'collection-facials':
    'Professional facials for maintenance, hydration, surface texture, congestion, and a fresh, well-rested look.',
  '16b4ca79-a320-4bd8-be88-f69952169f17':
    'Explore neurotoxin injections, dermal fillers, PRF injections, and EZ Gel options with natural-looking goals and licensed-provider guidance.',
  'collection-microchanneling':
    'Explore microneedling—including Procell Microchanneling—and eligible topical PRF options for face and body concerns.',
  'service-collection-rf-ipl-skin-treatments':
    'Explore InMode options for visible tone, pigment, texture, scars, stretch marks, and collagen-supporting RF facial care.',
  '546e9841-b81f-413b-99b1-19b36e96451d':
    'Explore PRF, Procell, and other advanced skin-renewal options for visible texture, tone, and overall skin quality.',
  '5ae70d4c-c42e-4824-881e-b6bb4157de7f':
    'Facial waxing with hard wax, clear preparation guidance, and walk-in availability.',
  '8b6d323b-ad1e-48bd-abd8-d5a7bf9c8964':
    'Learn about IV hydration and provider-guided weight-management services, including screening and follow-up.',
};

const fixedPatches = new Map([
  ['homepage', homepagePatch],
  ['skinAnalysis', skinAnalysisPatch],
  ['contactPage', contactPatch],
  ['47df3479-6bcc-4ad5-a083-dfd6ab0912e4', experiencePatch],
  ['rentARoom', rentARoomPatch],
  ...Object.entries(collectionDescriptions).map(([id, description]) => [
    id,
    { description },
  ]),
]);

const publicCopyFields = new Set([
  'tagline',
  'description',
  'whoItsFor',
  'process',
  'faqs',
  'seo',
  'intro',
  'whyLocal',
  'answer',
  'costFactors',
  'whatsIncluded',
  'verdict',
  'optionA',
  'optionB',
  'outcome',
  'protocol',
  'timeframe',
  'clientProfile',
  'excerpt',
  'body',
]);

const textReplacements = [
  [
    /It's offered as a complimentary first step\. Confirm current availability when you book\./gi,
    'Ask about current availability when you book.',
  ],
  [/complimentary (?=(?:AI(?:-assisted)? )?skin analysis)/gi, ''],
  [/complimentary analysis/gi, 'skin analysis'],
  [/We do not take walk-ins\./gi, 'Walk-ins are welcome. Appointments are recommended to reserve a time.'],
  [/a private, appointment-only/gi, 'a private, walk-in-friendly'],
  [/appointment-only/gi, 'walk-in-friendly'],
  [/Amber, a Face Reality Certified Acne Specialist/gi, 'a Face Reality Certified Acne Specialist'],
  [/Amber, a licensed esthetician/gi, 'a licensed esthetician'],
  [/Amber, an advanced esthetician/gi, 'an advanced esthetician'],
  [/Diana[’']s/gi, "your licensed provider's"],
  [/Diana Morrison, RN/gi, 'your licensed provider'],
  [/Diana, RN/gi, 'your licensed provider'],
  [/\bDiana\b/g, 'your licensed provider'],
  [/Brandy[’']s/gi, "your provider's"],
  [/\bBrandy\b/g, 'your provider'],
  [/Amber[’']s/gi, "your provider's"],
  [/\bAmber\b/g, 'your provider'],
  [/our RN/gi, 'a licensed RN'],
  [/physician-informed/gi, 'provider-guided'],
  [/evidence-based first step/gi, 'helpful first step'],
  [/personalized plan/gi, 'plan built around your goals'],
  [/personalized/gi, 'individual'],
  [/curated/gi, 'carefully selected'],
  [/intentional/gi, 'thoughtful'],
  [/effortless/gi, 'easy'],
  [/elevated/gi, 'polished'],
  [/skin journey/gi, 'skin goals'],
];

const genericTypes = [
  'service',
  'localArea',
  'costGuide',
  'comparison',
  'concern',
  'blogPost',
];

function rewriteText(value) {
  return textReplacements.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    value,
  );
}

function rewriteCopyValue(value) {
  if (typeof value === 'string') return rewriteText(value);
  if (Array.isArray(value)) return value.map(rewriteCopyValue);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      key,
      key.startsWith('_') ? nested : rewriteCopyValue(nested),
    ]),
  );
}

function genericCopyPatch(document) {
  const patch = {};
  for (const field of publicCopyFields) {
    if (!(field in document)) continue;
    const next = rewriteCopyValue(document[field]);
    if (JSON.stringify(next) !== JSON.stringify(document[field])) patch[field] = next;
  }
  return patch;
}

function matchesExpected(actual, expected) {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      expected.every((item, index) => matchesExpected(actual[index], item))
    );
  }
  if (expected && typeof expected === 'object') {
    return (
      actual &&
      typeof actual === 'object' &&
      Object.entries(expected).every(([key, value]) =>
        matchesExpected(actual[key], value),
      )
    );
  }
  return actual === expected;
}

function assertStaticContent() {
  const serialized = JSON.stringify(Object.fromEntries(fixedPatches));
  const forbidden = [
    'complimentary',
    'appointment-only',
    'we do not take walk-ins',
    'provider lane',
    'day spa',
  ];

  for (const phrase of forbidden) {
    if (serialized.toLowerCase().includes(phrase)) {
      throw new Error(`Static draft copy still contains forbidden phrase: ${phrase}`);
    }
  }

  for (const [id, patch] of fixedPatches) {
    for (const key of Object.keys(patch)) {
      if (key.startsWith('_')) {
        throw new Error(`${id} attempts to patch reserved field ${key}`);
      }
    }
  }
}

function cleanDraftDocument(document, patch) {
  const draft = {
    ...document,
    ...patch,
    _id: `drafts.${document._id}`,
  };
  delete draft._rev;
  delete draft._createdAt;
  delete draft._updatedAt;
  delete draft._system;
  return draft;
}

async function run() {
  assertStaticContent();

  console.log(`Validated ${fixedPatches.size} fixed document patches.`);
  console.log(`Generic copy cleanup covers: ${genericTypes.join(', ')}.`);

  if (!APPLY && !REFRESH && !VERIFY) {
    console.log('Validation only. Run npm run content:humanize:apply to create missing drafts.');
    return;
  }

  if (!projectId || !dataset) {
    throw new Error('Missing Sanity project ID or dataset.');
  }
  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN.');
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'published',
  });

  const fixedIds = [...fixedPatches.keys()];
  const fixedDocuments = await client.fetch(
    '*[_id in $ids]',
    { ids: fixedIds },
  );
  const genericDocuments = await client.fetch(
    `*[
      _type in $types &&
      !(_id in path("drafts.**")) &&
      (_type != "service" || status == "live")
    ]`,
    { types: genericTypes },
  );

  const candidates = new Map();
  for (const document of fixedDocuments) {
    candidates.set(document._id, {
      document,
      patch: fixedPatches.get(document._id),
    });
  }
  for (const document of genericDocuments) {
    const patch = genericCopyPatch(document);
    if (Object.keys(patch).length === 0) continue;
    const current = candidates.get(document._id);
    candidates.set(document._id, {
      document,
      patch: { ...(current?.patch ?? {}), ...patch },
    });
  }

  const draftIds = [...candidates.keys()].map((id) => `drafts.${id}`);
  const existingDrafts = await client.fetch(
    '*[_id in $ids]',
    { ids: draftIds },
    { perspective: 'raw' },
  );
  const existing = new Set(existingDrafts.map((draft) => draft._id));

  if (VERIFY) {
    const existingById = new Map(
      existingDrafts.map((draft) => [draft._id, draft]),
    );
    const missing = [];
    const mismatched = [];

    for (const [id, candidate] of candidates) {
      const draft = existingById.get(`drafts.${id}`);
      if (!draft) {
        missing.push(id);
        continue;
      }

      // contactPage had a draft before this workflow began. Preserve it exactly.
      if (id === 'contactPage') continue;

      for (const [field, expected] of Object.entries(candidate.patch)) {
        if (!matchesExpected(draft[field], expected)) {
          mismatched.push(`${id}.${field}`);
        }
      }
    }

    if (missing.length > 0 || mismatched.length > 0) {
      if (missing.length > 0) {
        console.error(`Missing ${missing.length} expected draft(s):`);
        for (const id of missing) console.error(`- ${id}`);
      }
      if (mismatched.length > 0) {
        console.error(`Found ${mismatched.length} draft field mismatch(es):`);
        for (const field of mismatched) console.error(`- ${field}`);
      }
      throw new Error('Humanized draft verification failed.');
    }

    console.log(`Verified ${candidates.size} unpublished draft(s).`);
    console.log('Preserved the pre-existing contactPage draft without changes.');
    return;
  }

  const transaction = client.transaction();
  const created = [];
  const skipped = [];

  for (const [id, candidate] of candidates) {
    const draftId = `drafts.${id}`;
    if (existing.has(draftId) && REFRESH && id !== 'contactPage') {
      transaction.patch(draftId, { set: candidate.patch });
      created.push(id);
      continue;
    }
    if (existing.has(draftId)) {
      skipped.push(id);
      continue;
    }
    transaction.createIfNotExists(
      cleanDraftDocument(candidate.document, candidate.patch),
    );
    created.push(id);
  }

  if (created.length > 0) await transaction.commit();

  console.log(
    REFRESH
      ? `Refreshed or created ${created.length} unpublished draft(s).`
      : `Created ${created.length} unpublished draft(s).`,
  );
  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} document(s) with existing drafts:`);
    for (const id of skipped) console.log(`- ${id}`);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
