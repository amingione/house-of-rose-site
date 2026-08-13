/**
 * Keep Morpheus8 and Lumecca copy within the indications approved by the owner.
 *
 * Owner direction, 2026-08-06:
 * - Do not position Morpheus8 or Lumecca for skin tightening or lifting.
 * - Limit their public routing to tone, texture, pigment, stretch marks, and scars.
 * - Position Forma only for crepey-looking texture and collagen support, without
 *   tightening, lifting, sculpting, contouring, firmness, laxity, or jowl claims.
 *
 * The supplied InMode library supports Lumecca pigment/tone/selected texture copy,
 * while the supplied pricing material lists Morpheus8 scars and stretch marks.
 * The supplied Forma tissue study supports cautious collagen-response language.
 *
 * Usage from the repository root:
 *   npm run content:inmode-indications
 *   npm run content:inmode-indications:apply
 */

throw new Error(
  'Archived by the 2026-08-13 voice reset. Preserve the verified indication limits, but rewrite and review the embedded public copy before use.',
);

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
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
});

const reference = (_ref, _key) => ({ _type: 'reference', _ref, _key });
const faq = (question, answer, _key) => ({ _type: 'faq', _key, question, answer });
const treatmentArea = (area, focus, _key) => ({ _type: 'object', _key, area, focus });

const concernIds = {
  acneScarring: 'ad938cc9-1677-42ce-ad14-085362954677',
  hyperpigmentation: 'concern-hyperpigmentation',
  stretchMarks: 'f36aa3c0-9681-4e82-95dd-1ad4abbdb3f8',
  sunDamage: 'e07ca64c-62da-4aef-94f5-a0517ccb70fb',
  texture: 'e775f8a4-266e-4edb-8c6f-eba826fc94cd',
};

const concern = (name, _key) => reference(concernIds[name], _key);

const morpheus8Copy = {
  tagline:
    'RF microneedling for visible tone, texture, scars, and stretch marks on eligible face and body areas.',
  description:
    'Morpheus8 RF Microneedling combines controlled microneedling with fractional bipolar radiofrequency. At House of Rose Aesthetics in Punta Gorda, it is used for the appearance of uneven tone and texture, visible scars, and stretch marks on eligible face and body areas. Treatment depth, energy, and area are selected after consultation, and individual outcomes vary.',
  whoItsFor:
    'Morpheus8 may fit clients considering treatment for uneven tone or texture, visible scar texture, or stretch marks on the face or body. Your consultation reviews the intended area, skin condition, health history, medications, recent procedures, recovery preferences, and any reason treatment should be postponed.',
  concerns: [
    concern('texture', 'texture'),
    concern('acneScarring', 'acne-scarring'),
    concern('stretchMarks', 'stretch-marks'),
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
    'The skin is prepared and a comfort plan is discussed before the Morpheus8 handpiece is used.',
    'Controlled microneedling and fractional radiofrequency are delivered at provider-selected settings for the planned area.',
    'Recovery varies by treatment area and settings. Your provider reviews likely redness, swelling, skincare pauses, sun care, and aftercare before treatment.',
    'The response is reviewed after the initial recovery period. Additional sessions are recommended only after the area, response, and candidacy are evaluated.',
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
      'Recovery varies by treatment area and settings. Redness, swelling, sensitivity, or a temporarily textured appearance can occur, so your provider reviews skincare pauses, sun protection, and aftercare before the appointment.',
      'recovery',
    ),
    faq(
      'When are Morpheus8 results reviewed?',
      'The treated area is reviewed after the initial recovery period. Your provider explains what can reasonably be assessed and when a follow-up evaluation makes sense. Individual outcomes vary.',
      'results',
    ),
    faq(
      'How many Morpheus8 sessions will I need?',
      'There is no universal count. The recommendation depends on the area, visible concern, treatment settings, response, and your individualized plan.',
      'sessions',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Morpheus8 RF Microneedling in Punta Gorda | House of Rose',
    metaDescription:
      'Explore Morpheus8 RF microneedling for visible tone, texture, scars, and stretch marks at House of Rose Aesthetics in Punta Gorda.',
  },
};

const morpheus8BodyCopy = {
  tagline:
    'RF microneedling for visible stretch marks, scars, and uneven body-skin tone and texture.',
  description:
    'Morpheus8 Body combines controlled microneedling with fractional bipolar radiofrequency for eligible body areas. At House of Rose Aesthetics in Punta Gorda, it is used for the appearance of stretch marks, visible scars, and uneven tone or texture. The treatment area, depth, energy, recovery plan, and follow-up are set after consultation. Individual outcomes vary.',
  whoItsFor:
    'Morpheus8 Body may fit clients considering treatment for visible stretch marks, scars, or uneven tone and texture on an eligible body area. Your provider reviews the area, skin condition, health history, medications, recent procedures, recovery preferences, and candidacy before defining the plan.',
  concerns: [
    concern('stretchMarks', 'cx-stretch'),
    concern('texture', 'cx-texture'),
  ],
  benefits: [
    'Improves the appearance of stretch marks on selected body areas',
    'Addresses the visible texture of eligible scars',
    'Supports smoother, more even-looking body-skin texture',
    'Uses area-specific settings selected after consultation',
  ],
  treatmentAreas: [
    treatmentArea('Abdomen & Trunk', 'Stretch marks, visible scars, and uneven tone or texture.', 'trunk'),
    treatmentArea('Arms & Legs', 'Eligible scar, stretch-mark, tone, and texture concerns.', 'limbs'),
    treatmentArea(
      'Other Selected Areas',
      'The consultation confirms whether the visible concern and requested area are appropriate.',
      'selected',
    ),
  ],
  process: [
    'Begin with a consultation to review the visible concern, body area, skin condition, health history, and recovery preferences.',
    'The treatment area is mapped and prepared, and a comfort plan is discussed before the handpiece is used.',
    'Controlled microneedling and fractional radiofrequency are delivered at provider-selected settings for the planned body area.',
    'Your provider reviews expected redness, warmth, sensitivity, skincare pauses, sun care, and written aftercare before treatment.',
    'The response is assessed after recovery. Additional sessions are discussed only after the treated area and response are reviewed.',
  ],
  faqs: [
    faq(
      'What concerns can Morpheus8 Body address?',
      'House of Rose uses Morpheus8 Body for the appearance of stretch marks, visible scars, and uneven body-skin tone or texture. A consultation confirms whether the concern and area are appropriate.',
      'concerns',
    ),
    faq(
      'Which body areas can be considered?',
      'Eligible areas may include the abdomen, trunk, arms, legs, and other selected body areas. Your provider confirms the area after reviewing the visible concern, skin condition, and available treatment tips.',
      'areas',
    ),
    faq(
      'How is Morpheus8 Body used at House of Rose?',
      'The treatment is planned around visible tone, texture, scars, or stretch marks. The provider selects the treatment area, depth, energy, comfort plan, and aftercare after consultation.',
      'use',
    ),
    faq(
      'How many sessions will I need?',
      'There is no universal session count. The recommendation depends on the area, visible concern, settings, response, and recovery preferences.',
      'sessions',
    ),
    faq(
      'How is candidacy reviewed?',
      'Your provider reviews the requested area, skin condition, health history, medications, recent procedures, and recovery preferences before deciding whether to proceed.',
      'candidacy',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Morpheus8 Body in Punta Gorda, FL | House of Rose',
    metaDescription:
      'Explore Morpheus8 Body for visible stretch marks, scars, and uneven body-skin tone or texture at House of Rose Aesthetics in Punta Gorda.',
  },
};

const lumeccaCopy = {
  tagline: 'IPL for visible pigment, uneven tone, and selected texture concerns.',
  description:
    'Lumecca Peak is an intense pulsed light photofacial used for the appearance of visible pigment, uneven tone, and selected texture concerns. At House of Rose Aesthetics in Punta Gorda, IPL settings and treatment areas are selected after a review of your skin, recent sun exposure, and candidacy. Individual outcomes vary.',
  whoItsFor:
    'Lumecca Peak IPL may fit clients considering treatment for visible pigment, uneven tone, or selected texture concerns on the face, neck, chest, or hands. Recent tanning or sun exposure, light-sensitive medications, active irritation, and certain health or skin histories can affect timing or candidacy, so an IPL consultation is required before treatment.',
  concerns: [
    concern('sunDamage', 'sun-damage'),
    concern('hyperpigmentation', 'hyperpigmentation'),
    concern('texture', 'texture'),
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
      'The appearance of sun-related pigment, uneven tone, and selected texture concerns.',
      'neck-chest',
    ),
    treatmentArea('Hands', 'Visible pigment and uneven-looking tone associated with sun exposure.', 'hands'),
  ],
  process: [
    'Begin with a consultation that reviews the visible concern, skin characteristics, medications, and recent sun exposure.',
    'Protective eyewear is used while the Lumecca Peak handpiece delivers brief pulses of intense light to the selected area.',
    'The sensation is commonly described as a quick flash or snap, with comfort varying by area and settings.',
    'Pigmented spots can look temporarily darker before they fade, and temporary redness can occur. Your provider explains sun care, skincare, and aftercare.',
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
      'Temporary redness can occur, and visible pigment may look darker before it gradually fades. Your provider explains sun protection, skincare, and when normal products or activities may be resumed.',
      'after',
    ),
    faq(
      'How many Lumecca Peak IPL sessions will I need?',
      'There is no universal session count. The visible concern, treatment area, skin assessment, sun history, and response influence whether another appointment is recommended.',
      'sessions',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Lumecca Peak IPL in Punta Gorda, FL | House of Rose',
    metaDescription:
      'Explore Lumecca Peak IPL for visible pigment, uneven tone, and selected texture concerns at House of Rose Aesthetics in Punta Gorda.',
  },
};

const formaCopy = {
  tagline:
    'Temperature-controlled radiofrequency for crepey-looking facial texture and collagen support.',
  description:
    'Forma RF Facial uses non-invasive, temperature-controlled radiofrequency on eligible facial areas. At House of Rose Aesthetics in Punta Gorda, it is used for the appearance of crepey texture and to support the skin’s collagen response. The handpiece moves continuously across the selected area while monitoring skin temperature in real time. The area, settings, timing, and candidacy are confirmed at consultation, and individual outcomes vary.',
  whoItsFor:
    'Forma may fit clients considering a non-needling radiofrequency option for crepey-looking texture on an eligible facial area. Your consultation reviews the area, skin condition, health history, recent procedures, comfort preferences, and any reason treatment should be postponed.',
  concerns: [concern('texture', 'texture')],
  benefits: [
    'Improves the appearance of crepey-looking facial texture',
    'Supports the skin’s collagen response over time',
    'Uses real-time temperature monitoring during the appointment',
    'Provides a non-invasive option with minimal interruption to the day',
  ],
  treatmentAreas: [
    treatmentArea(
      'Face & Cheeks',
      'The appearance of crepey-looking texture on eligible facial skin.',
      'face-cheeks',
    ),
    treatmentArea(
      'Lower Face',
      'Crepey-looking texture on an eligible lower-face area selected during consultation.',
      'lower-face',
    ),
    treatmentArea(
      'Neck',
      'The appearance of crepey-looking neck texture when the area is appropriate for treatment.',
      'neck',
    ),
  ],
  process: [
    'Begin with a consultation to confirm that a non-invasive RF facial fits the visible texture concern and health history.',
    'The Forma handpiece is moved continuously across the selected facial area while skin temperature is monitored in real time.',
    'The experience is typically warm and massage-like, with settings adjusted to the area and individual comfort.',
    'Forma is designed for minimal interruption to the day. Your provider explains skincare, heat or sun considerations, and aftercare.',
    'The treated area is reviewed after the skin has had time to respond. Another appointment is discussed only after the visible texture, response, and candidacy are evaluated.',
  ],
  faqs: [
    faq(
      'How does Forma RF Facial work?',
      'Forma delivers controlled radiofrequency while monitoring skin temperature in real time. House of Rose uses the non-invasive treatment for the appearance of crepey facial texture and to support the skin’s collagen response.',
      'how-it-works',
    ),
    faq(
      'What areas can be treated with Forma at House of Rose?',
      'House of Rose considers Forma for eligible areas of the face, cheeks, lower face, and neck. Your consultation confirms whether the area and crepey-texture concern fit the treatment.',
      'areas',
    ),
    faq(
      'What concern is Forma used for at House of Rose?',
      'House of Rose uses Forma for the appearance of crepey-looking facial texture and to support the skin’s collagen response. A consultation confirms whether the visible texture concern and requested area are appropriate.',
      'concerns',
    ),
    faq(
      'What does a Forma appointment feel like?',
      'Forma is generally experienced as controlled warmth while the handpiece moves across the skin. Sensation varies, and the provider monitors temperature and adjusts the experience for the planned facial area.',
      'sensation',
    ),
    faq(
      'What should I expect after Forma RF Facial?',
      'Forma is a non-invasive treatment designed for minimal interruption to the day. Temporary warmth or redness can occur, and your provider reviews skincare and aftercare for the selected area.',
      'recovery',
    ),
    faq(
      'How many Forma appointments will I need?',
      'There is no universal appointment count. Your provider reviews the crepey-texture concern, selected area, skin response, and candidacy before recommending timing or another appointment.',
      'sessions',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Forma RF Facial for Crepey Texture | Punta Gorda',
    metaDescription:
      'Explore temperature-controlled Forma RF Facial for crepey-looking facial texture and collagen support at House of Rose Aesthetics in Punta Gorda.',
  },
};

const morpheusComparisonCopy = {
  title: 'Morpheus8 vs. Microneedling: Which Texture Treatment Fits?',
  intro:
    'Morpheus8 and microneedling are both considered for visible tone, texture, and eligible scar concerns. Morpheus8 adds fractional bipolar radiofrequency and can also be planned for stretch marks on selected body areas. The right option depends on the concern, area, recovery preferences, and consultation.',
  optionA: {
    label: 'Morpheus8 RF Microneedling',
    summary:
      'Microneedling with fractional bipolar radiofrequency for visible tone, texture, eligible scars, and stretch marks on selected face or body areas.',
    bestFor: 'Tone, texture, eligible scars, stretch marks, and selected face or body areas.',
    service: reference('service-morpheus8', 'svcA'),
  },
  optionB: {
    label: 'Microneedling (Procell Therapies device)',
    summary:
      'Microneedling planned for visible tone, texture, and eligible facial scar concerns without radiofrequency.',
    bestFor: 'Tone, texture, and eligible facial scar concerns.',
    service: reference('f5308b9c-73df-4812-8c0d-afcf4ee5839a', 'svcB'),
  },
  rows: [
    {
      _key: 'how',
      _type: 'comparisonRow',
      attribute: 'Technology',
      valueA: 'Microneedling + fractional bipolar radiofrequency',
      valueB: 'Microneedling without radiofrequency',
    },
    {
      _key: 'benefit',
      _type: 'comparisonRow',
      attribute: 'Primary concerns',
      valueA: 'Tone, texture, scars, and stretch marks',
      valueB: 'Tone, texture, and eligible facial scars',
    },
    {
      _key: 'area',
      _type: 'comparisonRow',
      attribute: 'Treatment areas',
      valueA: 'Eligible face and selected body areas',
      valueB: 'Areas confirmed for the microneedling plan',
    },
    {
      _key: 'planning',
      _type: 'comparisonRow',
      attribute: 'How the plan is set',
      valueA: 'Area, depth, energy, recovery, and candidacy',
      valueB: 'Area, depth, recovery, and candidacy',
    },
    {
      _key: 'downtime',
      _type: 'comparisonRow',
      attribute: 'Recovery',
      valueA: 'Varies by area and settings',
      valueB: 'Varies by area and settings',
    },
  ],
  verdict:
    'Choose between Morpheus8 and microneedling by matching the technology to the visible tone, texture, scar, or stretch-mark concern and the requested area. House of Rose reviews candidacy, recovery, and settings before recommending either option. Individual outcomes vary.',
  faqs: [
    faq(
      'How are Morpheus8 and microneedling different?',
      'Both use microneedles. Morpheus8 also delivers fractional bipolar radiofrequency at provider-selected settings. House of Rose compares the concern, treatment area, recovery preferences, and candidacy before recommending either option.',
      'f1',
    ),
    faq(
      'Which treatment has more downtime?',
      'Recovery varies with the area, depth, settings, and individual response. Your provider explains the expected response, skincare pauses, and aftercare before either treatment.',
      'f2',
    ),
    faq(
      'Can both treatments be part of a skin plan?',
      'They may be considered at different times when each has a separate tone, texture, scar, or stretch-mark goal. The provider determines whether the sequence is appropriate.',
      'f3',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Morpheus8 vs. Microneedling | Punta Gorda, FL',
    metaDescription:
      'Compare Morpheus8 and microneedling for visible tone, texture, scars, stretch marks, treatment areas, planning, and recovery in Punta Gorda.',
  },
};

const morpheusCostCopy = {
  answer:
    'Morpheus8 pricing in Punta Gorda depends on the treatment area and the plan confirmed at consultation. House of Rose uses Morpheus8 for visible tone, texture, eligible scars, and stretch marks, with depth, energy, recovery, and follow-up selected for the specific area.',
  costFactors: [
    {
      _key: 'area',
      factor: 'Treatment area',
      effect:
        'Face, neck, chest, and selected body areas are planned separately. The requested area affects the appointment and current investment.',
    },
    {
      _key: 'sessions',
      factor: 'Number of sessions',
      effect:
        'There is no universal session count. The visible tone, texture, scar, or stretch-mark concern and the response to treatment guide any additional recommendation.',
    },
    {
      _key: 'depth',
      factor: 'Treatment settings',
      effect:
        'The provider selects depth and radiofrequency energy for the concern and area after reviewing candidacy and recovery preferences.',
    },
    {
      _key: 'plan',
      factor: 'Individual plan',
      effect:
        'Consultation, preparation, treatment area, aftercare, and follow-up are reviewed before the final plan and current investment are confirmed.',
    },
  ],
  faqs: [
    faq(
      'Why does Morpheus8 pricing vary?',
      'The treatment area, visible concern, settings, and number of appointments affect the plan. Your provider confirms the current investment after consultation.',
      'vary',
    ),
    faq(
      'How many sessions will I need?',
      'There is no universal count. Your provider reviews the tone, texture, scar, or stretch-mark concern, treatment area, response, and recovery preferences before recommending another appointment.',
      'sessions',
    ),
    faq(
      'Which concerns are used to plan Morpheus8?',
      'House of Rose plans Morpheus8 around visible tone, texture, eligible scars, and stretch marks. Consultation confirms whether the requested concern and area are appropriate. Individual outcomes vary.',
      'concerns',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Morpheus8 Cost in Punta Gorda | House of Rose',
    metaDescription:
      'Learn what shapes Morpheus8 cost in Punta Gorda for visible tone, texture, scars, and stretch marks, including area, settings, and session planning.',
  },
};

const lumeccaCostCopy = {
  answer:
    'Lumecca Peak IPL pricing in Punta Gorda depends on the treatment area and whether one session or a three-session package is selected. The consultation reviews visible pigment, uneven tone, selected texture concerns, recent sun exposure, candidacy, and the current investment.',
  costFactors: [
    {
      _key: 'area',
      factor: 'Area treated',
      effect:
        'The face, neck, chest, hands, and other listed areas have separate pricing. The consultation confirms the requested area.',
    },
    {
      _key: 'sessions',
      factor: 'Number of sessions',
      effect:
        'Single-session and three-session pricing is listed by area. The provider recommends timing only after reviewing the visible concern and response.',
    },
    {
      _key: 'concern',
      factor: 'Visible concern',
      effect:
        'Pigment, uneven tone, and selected texture concerns are assessed before settings and treatment timing are chosen.',
    },
    {
      _key: 'sun',
      factor: 'Sun exposure and timing',
      effect:
        'Recent sun exposure can affect candidacy and timing, so the planned date is part of the consultation.',
    },
  ],
  faqs: [
    faq(
      'Why does Lumecca Peak IPL pricing vary?',
      'The selected area and whether one session or a three-session package is planned affect the current investment. Your provider confirms the area and candidacy before treatment.',
      'vary',
    ),
    faq(
      'How many sessions will I need?',
      'There is no universal count. The visible pigment, tone, or texture concern, treatment area, sun history, and response guide any additional recommendation.',
      'sessions',
    ),
    faq(
      'What should I expect after Lumecca Peak IPL?',
      'Temporary redness can occur, and visible pigment may look darker before it gradually fades. Your provider explains sun protection, skincare, and aftercare for the selected area.',
      'recovery',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Lumecca Peak IPL Cost in Punta Gorda | House of Rose',
    metaDescription:
      'Learn what shapes Lumecca Peak IPL cost in Punta Gorda for visible pigment, uneven tone, and selected texture concerns, including area and sessions.',
  },
};

const formaCostCopy = {
  title: 'How Much Does Forma RF Facial Cost in Punta Gorda?',
  answer:
    'Forma RF Facial pricing in Punta Gorda depends on the selected facial area and the number of appointments in the plan. House of Rose uses Forma for the appearance of crepey-looking texture and to support the skin’s collagen response. The consultation reviews the area, candidacy, timing, and current investment before treatment.',
  costFactors: [
    {
      _key: 'series',
      factor: 'Single appointment or series',
      effect:
        'There is no universal appointment count. The visible texture concern, selected area, skin response, and candidacy guide whether another appointment is discussed.',
    },
    {
      _key: 'area',
      factor: 'Area treated',
      effect:
        'Eligible areas of the face and neck are planned separately. The consultation confirms the requested area and current investment.',
    },
    {
      _key: 'follow-up',
      factor: 'Follow-up plan',
      effect:
        'The provider reviews the treated area after it has had time to respond before recommending further timing or care.',
    },
  ],
  whatsIncluded:
    'A consultation and skin review, the temperature-controlled Forma RF treatment for the selected area, and aftercare guidance.',
  faqs: [
    faq(
      'Why might Forma be planned as a series?',
      'The skin’s collagen response develops over time and varies by person. Your provider reviews the crepey-texture concern, selected area, and response before recommending another appointment.',
      'series',
    ),
    faq(
      'What should I expect after Forma?',
      'Forma is non-invasive and designed for minimal interruption to the day. Temporary warmth or redness can occur, and your provider reviews aftercare for the selected area.',
      'recovery',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Forma RF Facial Cost in Punta Gorda | House of Rose',
    metaDescription:
      'Learn what shapes Forma RF Facial cost in Punta Gorda for crepey-looking facial texture and collagen support, including area and appointment planning.',
  },
};

const serviceDocuments = await client.fetch(
  `*[_type == "service" && slug.current in ["morpheus8", "morpheus8-body", "lumecca-peak-ipl", "forma-rf-facial"]]`,
);
const targetIds = [
  'hor-compare-morpheus8-vs-microneedling',
  'drafts.hor-compare-morpheus8-vs-microneedling',
  'hor-compare-ultherapy-vs-morpheus8',
  'drafts.hor-compare-ultherapy-vs-morpheus8',
  'hor-cost-morpheus8',
  'drafts.hor-cost-morpheus8',
  'hor-cost-lumecca-ipl',
  'drafts.hor-cost-lumecca-ipl',
  'hor-cost-forma',
  'drafts.hor-cost-forma',
  'service-collection-rf-ipl-skin-treatments',
  'drafts.service-collection-rf-ipl-skin-treatments',
  'hor-blog-is-morpheus8-safe',
  'drafts.hor-blog-is-morpheus8-safe',
];
const relatedDocuments = await client.fetch('*[_id in $targetIds]', { targetIds });
const allDocuments = [...serviceDocuments, ...relatedDocuments];
const byId = new Map(allDocuments.map((document) => [document._id, document]));

const servicePatches = [];
for (const document of serviceDocuments) {
  const slug = document.slug?.current;
  if (slug === 'morpheus8') {
    servicePatches.push({
      id: document._id,
      set: {
        ...morpheus8Copy,
        evidenceMedia: (document.evidenceMedia ?? []).filter((item) => item.kind === 'device'),
      },
    });
  }
  if (slug === 'morpheus8-body') {
    servicePatches.push({
      id: document._id,
      set: {
        ...morpheus8BodyCopy,
        evidenceMedia: (document.evidenceMedia ?? []).filter((item) => item.kind === 'device'),
      },
    });
  }
  if (slug === 'lumecca-peak-ipl') {
    servicePatches.push({
      id: document._id,
      set: {
        ...lumeccaCopy,
        researchReferences: (document.researchReferences ?? []).map((item) =>
          item._key === 'lumecca-retrospective-2021'
            ? {
                ...item,
                summary:
                  'The paper reviewed photographs from several clinics and reported visible improvement across selected pigment and texture concerns after treatment with a Lumecca IPL system.',
              }
            : item,
        ),
      },
    });
  }
  if (slug === 'forma-rf-facial') {
    servicePatches.push({
      id: document._id,
      set: {
        ...formaCopy,
        evidenceMedia: (document.evidenceMedia ?? [])
          .filter((item) => item.kind === 'device')
          .map((item) =>
            item._key === 'forma-device'
              ? {
                  ...item,
                  caption:
                    'The Forma handpiece delivers non-invasive radiofrequency while monitoring skin temperature in real time. House of Rose considers eligible areas of the face and neck after consultation.',
                }
              : item,
          ),
        researchReferences: (document.researchReferences ?? []).filter(
          (item) => item._key === 'forma-split-face-2017',
        ),
      },
    });
  }
}

const directPatches = [
  {
    ids: ['hor-compare-morpheus8-vs-microneedling', 'drafts.hor-compare-morpheus8-vs-microneedling'],
    set: morpheusComparisonCopy,
  },
  {
    ids: ['hor-cost-morpheus8', 'drafts.hor-cost-morpheus8'],
    set: morpheusCostCopy,
  },
  {
    ids: ['hor-cost-lumecca-ipl', 'drafts.hor-cost-lumecca-ipl'],
    set: lumeccaCostCopy,
  },
  {
    ids: ['hor-cost-forma', 'drafts.hor-cost-forma'],
    set: formaCostCopy,
  },
  {
    ids: [
      'service-collection-rf-ipl-skin-treatments',
      'drafts.service-collection-rf-ipl-skin-treatments',
    ],
    set: {
      description:
        'Explore InMode options for visible tone, pigment, texture, scars, stretch marks, and collagen-supporting RF facial care.',
    },
  },
];

for (const patch of directPatches) {
  for (const id of patch.ids) {
    if (byId.has(id)) servicePatches.push({ id, set: patch.set });
  }
}

for (const id of ['hor-blog-is-morpheus8-safe', 'drafts.hor-blog-is-morpheus8-safe']) {
  const document = byId.get(id);
  if (!document) continue;
  servicePatches.push({
    id,
    set: {
      body: (document.body ?? []).map((block) => ({
        ...block,
        children: (block.children ?? []).map((child) =>
          child._key === 's1'
            ? {
                ...child,
                text:
                  'If you have researched Morpheus8 for visible tone, texture, scars, or stretch marks, you have probably run into a few frightening headlines - the kind with phrases like "ruined my skin." A careful review should separate possible side effects, candidacy, treatment settings, and aftercare from dramatic online conclusions. Here is what to discuss before treatment and what to expect at each stage. Individual experiences and outcomes vary.',
              }
            : child,
        ),
      })),
    },
  });
}

const deleteIds = [
  'hor-compare-ultherapy-vs-morpheus8',
  'drafts.hor-compare-ultherapy-vs-morpheus8',
].filter((id) => byId.has(id));

console.log(
  JSON.stringify(
    {
      mode: shouldApply ? 'apply' : 'dry-run',
      dataset,
      patches: servicePatches.map(({ id, set }) => ({ id, fields: Object.keys(set) })),
      deleteIds,
    },
    null,
    2,
  ),
);

if (!shouldApply) {
  console.log('\nDry run only. Add --apply to update Sanity.');
  process.exit(0);
}

let transaction = client.transaction();
for (const patch of servicePatches) {
  transaction = transaction.patch(patch.id, { set: patch.set });
}
for (const id of deleteIds) transaction = transaction.delete(id);
await transaction.commit();

const verificationDocuments = await client.fetch(
  `*[!(_id in path("_.**")) && !(_type match "sanity.*")]`,
);
const strings = (value, path = '$', output = []) => {
  if (typeof value === 'string') output.push({ path, value });
  else if (Array.isArray(value)) {
    value.forEach((item, index) => strings(item, `${path}[${index}]`, output));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => strings(item, `${path}.${key}`, output));
  }
  return output;
};
const prohibitedDirection = /\b(?:tighten(?:ing|s|ed)?|lift(?:ing|s|ed)?|laxity|firm(?:er|ing|ness)?|sagging|jowls?|contour(?:ing|s|ed)?|sculpt(?:ing|s|ed)?|facelift)\b/i;
const inModeName = /\b(?:Morpheus8|Lumecca(?: Peak)?|Forma)\b/i;
const lumeccaName = /\bLumecca(?: Peak)?\b/i;
const lumeccaOutsideLane = /\b(?:vascular|vessels?|redness|capillaries?|rosacea)\b/i;
const invalidStrings = [];
const invalidFormaStrings = [];

for (const document of verificationDocuments) {
  const documentContainsForma = /\bForma\b|service-forma-rf-facial/i.test(
    JSON.stringify(document),
  );
  for (const entry of strings(document)) {
    if (
      (inModeName.test(entry.value) && prohibitedDirection.test(entry.value)) ||
      (lumeccaName.test(entry.value) && lumeccaOutsideLane.test(entry.value))
    ) {
      invalidStrings.push({ id: document._id, ...entry });
    }
    if (documentContainsForma && prohibitedDirection.test(entry.value)) {
      invalidFormaStrings.push({ id: document._id, ...entry });
    }
  }
}

const restrictedServices = verificationDocuments.filter(
  (document) =>
    document._type === 'service' &&
    ['morpheus8', 'morpheus8-body', 'lumecca-peak-ipl', 'forma-rf-facial'].includes(
      document.slug?.current,
    ),
);
const invalidServices = restrictedServices.filter((document) => {
  const refs = new Set((document.concerns ?? []).map((item) => item._ref));
  const permitted =
    document.slug.current === 'lumecca-peak-ipl'
      ? new Set([concernIds.sunDamage, concernIds.hyperpigmentation, concernIds.texture])
      : document.slug.current === 'morpheus8'
        ? new Set([concernIds.texture, concernIds.acneScarring, concernIds.stretchMarks])
        : document.slug.current === 'morpheus8-body'
          ? new Set([concernIds.texture, concernIds.stretchMarks])
          : new Set([concernIds.texture]);
  return (
    [...refs].some((ref) => !permitted.has(ref)) ||
    ((document.slug.current.startsWith('morpheus8') ||
      document.slug.current === 'forma-rf-facial') &&
      (document.evidenceMedia ?? []).some((item) => item.kind === 'before-after'))
  );
});
const deletedComparison = await client.fetch(
  'count(*[_id in ["hor-compare-ultherapy-vs-morpheus8", "drafts.hor-compare-ultherapy-vs-morpheus8"]])',
);

if (
  invalidStrings.length ||
  invalidFormaStrings.length ||
  invalidServices.length ||
  deletedComparison !== 0
) {
  throw new Error(
    `InMode indication verification failed: ${JSON.stringify({ invalidStrings, invalidFormaStrings, invalidServices: invalidServices.map((item) => item._id), deletedComparison })}`,
  );
}

console.log(
  `Updated ${servicePatches.length} documents, removed ${deleteIds.length} restricted comparison document(s), and verified the InMode indication set.`,
);
