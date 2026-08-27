export interface ServiceEducationStep {
  title: string;
  text: string;
}

export interface ServiceEducationPairing {
  title: string;
  text: string;
  href?: string;
}

export interface ServiceEducationDetails {
  benefits: readonly string[];
  treatmentSteps: readonly ServiceEducationStep[];
  sessionGuidance: string;
  pairings: readonly ServiceEducationPairing[];
}

const individualized = (service: string): string =>
  `There is no single best number of ${service} treatments for everyone. Your starting point, response, and goal determine whether one visit or a longer plan makes sense.`;

const noAutomaticPairing = (service: string): readonly ServiceEducationPairing[] => [{
  title: 'Planning another service?',
  text: `${service} can stand on its own. If another appointment is part of your plan, share it before scheduling so timing and preparation can be checked.`,
}];

const makeupSteps: readonly ServiceEducationStep[] = [
  { title: 'Plan the look', text: 'The setting, clothing, photography, timing, and preferred finish guide the makeup plan.' },
  { title: 'Prepare the skin', text: 'Skin is prepared so complexion products apply evenly and comfortably.' },
  { title: 'Build and refine', text: 'Complexion, eyes, cheeks, and lips are applied and balanced as one finished look.' },
];

const waxingSteps: readonly ServiceEducationStep[] = [
  { title: 'Review the area', text: 'The skin and hair length are checked before wax is applied.' },
  { title: 'Remove hair from the root', text: 'Wax is worked in sections appropriate to the selected facial or body area.' },
  { title: 'Soothe the skin', text: 'The service finishes with simple post-wax care and instructions for the first day.' },
];

const DETAILS: Readonly<Record<string, ServiceEducationDetails>> = {
  inmode: {
    benefits: ['Separates texture and remodeling concerns from visible pigment and redness.', 'Makes treatment intensity and recovery part of the decision before a modality is selected.'],
    treatmentSteps: [
      { title: 'Identify the dominant concern', text: 'Texture, eligible acne scars, visible color, redness, and mild firmness concerns point toward different treatment paths.' },
      { title: 'Assess skin and timing', text: 'Skin condition, anatomy, sun history, recovery window, and candidacy are reviewed before a modality is selected.' },
      { title: 'Sequence the plan', text: 'One treatment can stand alone, or separate modalities can be spaced when each has a distinct job.' },
    ],
    sessionGuidance: 'There is no single OptimasMAX session count. Morpheus8, Lumecca Peak, and Forma use different protocols, and the selected area, concern, response, and recovery window shape the plan.',
    pairings: [{ title: 'Combination planning', text: 'Morpheus8, Lumecca Peak, and Forma can be sequenced when each modality addresses a separate concern. More modalities in one appointment are not automatically better.' }],
  },
  'injectables-bio-fillers': {
    benefits: ['Understand the difference between movement-related lines, facial volume, and PRF options.', 'Start with the service category that matches the change you want to discuss.'],
    treatmentSteps: [
      { title: 'Describe the change', text: 'Begin with what you notice in movement, volume, or the under-eye area rather than trying to choose a product yourself.' },
      { title: 'Review the options', text: 'Diana Morrison, RN reviews anatomy, goals, history, and candidacy under written physician protocol and medical direction.' },
      { title: 'Create an individual plan', text: 'Product, amount, placement, and follow-up are determined for the person being treated.' },
    ],
    sessionGuidance: individualized('injectable or bio-filler'),
    pairings: noAutomaticPairing('An injectable or PRF service'),
  },
  'bridal-makeup': {
    benefits: ['A camera-aware finish planned for the wedding setting.', 'A cohesive look that accounts for the dress, lighting, schedule, and personal style.'],
    treatmentSteps: makeupSteps,
    sessionGuidance: 'Bridal Makeup is one wedding-day service. A separate trial can be used to test and refine the look before the event.',
    pairings: [{ title: 'Bridal trial', text: 'A separate trial is the useful companion when you want to confirm the finish, colors, and wear before the wedding day.' }],
  },
  'event-makeup': {
    benefits: ['A finished look suited to the event and its lighting.', 'Makeup planned to read well both in person and in photographs.'],
    treatmentSteps: makeupSteps,
    sessionGuidance: 'Event Makeup is a single service for one event. It does not require a series.',
    pairings: noAutomaticPairing('Event Makeup'),
  },
  'everyday-makeup': {
    benefits: ['A polished look for daytime, work, portraits, or a non-formal occasion.', 'A finish calibrated to how soft or defined you want the makeup to appear.'],
    treatmentSteps: makeupSteps,
    sessionGuidance: 'Everyday Makeup is a single service and does not require a series.',
    pairings: noAutomaticPairing('Everyday Makeup'),
  },
  'iv-hydration-therapy': {
    benefits: ['Intravenous delivery of the selected fluid formulation.', 'An RN-led review of the current formula and whether it is appropriate for you.'],
    treatmentSteps: [
      { title: 'Clinical review', text: 'Diana Morrison, RN reviews relevant health information and the current IV formulation.' },
      { title: 'IV placement', text: 'A small catheter is placed into a vein so fluid can be administered intravenously.' },
      { title: 'Monitored infusion', text: 'The infusion is monitored, then the catheter is removed and the site is dressed.' },
    ],
    sessionGuidance: individualized('IV hydration'),
    pairings: noAutomaticPairing('IV hydration'),
  },
  'morpheus8': {
    benefits: ['Addresses the appearance of uneven texture, eligible scars, and selected areas of laxity.', 'Combines controlled microneedling and fractional bipolar radiofrequency in one device.'],
    treatmentSteps: [
      { title: 'Map the treatment area', text: 'The area, skin condition, depth, and treatment goal are reviewed before settings are selected.' },
      { title: 'Deliver RF microneedling', text: 'The Morpheus8 handpiece places microneedles at controlled depths and delivers fractional radiofrequency.' },
      { title: 'Protect the recovery window', text: 'You leave with treatment-specific instructions for cleansing, topical products, sun exposure, and activity.' },
    ],
    sessionGuidance: 'House of Rose has Morpheus8 options for one treatment or a series of three, depending on the applicator and area. The appropriate option is selected after the area and goal are reviewed.',
    pairings: [{ title: 'Lumecca Peak IPL', text: 'House of Rose has a current Morpheus8 + Lumecca option when both texture and visible pigment are being addressed. It is not an automatic recommendation.', href: '/services/lumecca-peak-ipl/' }],
  },
  'morpheus8-body': {
    benefits: ['Applies RF microneedling to selected body areas.', 'Addresses visible texture and eligible stretch-mark or scar concerns when appropriate.'],
    treatmentSteps: [
      { title: 'Define the area', text: 'The body area and its dimensions are reviewed before treatment is planned.' },
      { title: 'Deliver controlled energy', text: 'Microneedles and fractional bipolar radiofrequency are delivered through the Morpheus8 handpiece.' },
      { title: 'Follow area-specific care', text: 'Aftercare reflects the depth, body area, and skin response.' },
    ],
    sessionGuidance: 'Current Morpheus8 Burst Deep body options are structured as a series of three for a small or large treatment area.',
    pairings: noAutomaticPairing('Morpheus8 Body'),
  },
  'injectables': {
    benefits: ['Softens the appearance of lines created by facial movement.', 'Allows Botox and Daxxify to be considered as distinct, product-specific options.'],
    treatmentSteps: [
      { title: 'Movement assessment', text: 'Diana Morrison, RN reviews the lines that appear or deepen when you frown, raise the brows, or squint.' },
      { title: 'Product and dose planning', text: 'Product choice, dose, and placement are determined individually under written physician protocol and medical direction.' },
      { title: 'Injection and follow-up', text: 'The selected product is injected in planned points, with a separate two-week check-in available after treatment.' },
    ],
    sessionGuidance: 'One treatment is planned at a time. A two-week check-in is available, and maintenance timing is individualized.',
    pairings: noAutomaticPairing('Neurotoxin treatment'),
  },
  'dermal-fillers': {
    benefits: ['Addresses selected areas of lost facial volume.', 'Allows the lips, cheeks, or folds to be planned with a product suited to the area and goal.'],
    treatmentSteps: [
      { title: 'Facial assessment', text: 'The area, anatomy, history, and desired degree of change are reviewed first.' },
      { title: 'Choose product and placement', text: 'Diana Morrison, RN determines the hyaluronic-acid filler, amount, and placement under written physician protocol and medical direction.' },
      { title: 'Inject and review', text: 'Filler is placed in the planned area and immediate post-treatment instructions are reviewed.' },
    ],
    sessionGuidance: individualized('dermal filler'),
    pairings: noAutomaticPairing('Dermal filler'),
  },
  'glp-1-weight-management': {
    benefits: ['A clinical conversation about semaglutide and tirzepatide.', 'Ongoing review rather than a one-time injection-only transaction.'],
    treatmentSteps: [
      { title: 'Initial consultation', text: 'Diana Morrison, RN reviews history, goals, current medications, and whether the program is appropriate.' },
      { title: 'Medication plan', text: 'If appropriate, the medication and ongoing plan are determined under the practice protocol.' },
      { title: 'Ongoing monitoring', text: 'Progress, tolerance, and questions are reviewed over time.' },
    ],
    sessionGuidance: 'This is an ongoing program, not a one-visit treatment. The length and follow-up schedule are determined clinically for the individual.',
    pairings: noAutomaticPairing('GLP-1 weight management'),
  },
  'lumecca-peak-ipl': {
    benefits: ['Targets the appearance of visible pigment, sun-related discoloration, and uneven tone.', 'Treats a selected area with filtered optical energy rather than needles.'],
    treatmentSteps: [
      { title: 'Skin and sun-exposure review', text: 'The treatment area, skin response, recent sun exposure, and candidacy are reviewed before settings are selected.' },
      { title: 'IPL pulses', text: 'The handpiece delivers controlled pulses of filtered broad-spectrum light across the planned area.' },
      { title: 'Post-light care', text: 'Cooling and sun-protection instructions are reviewed for the treated area.' },
    ],
    sessionGuidance: 'Current House of Rose options are organized as one session or a series of three by treatment area. The best fit depends on the pigment pattern, area, and response.',
    pairings: [
      { title: 'Forma RF Facial', text: 'A current Forma + Lumecca option combines a surface-radiofrequency treatment with IPL when both texture and visible pigment belong in the plan.', href: '/services/forma-rf-facial/' },
      { title: 'Morpheus8', text: 'A current Morpheus8 + Lumecca option pairs RF microneedling with IPL for distinct texture and pigment goals.', href: '/services/morpheus8/' },
    ],
  },
  'biorepeel': {
    benefits: ['Exfoliates the skin with a topical TCA-based peel.', 'Addresses the appearance of uneven texture, tone, and selected breakout-related concerns.'],
    treatmentSteps: [
      { title: 'Prepare the skin', text: 'The skin is cleansed and checked before the peel is applied.' },
      { title: 'Apply the peel', text: 'BioRePeel is applied topically according to the selected face, body, or targeted service.' },
      { title: 'Remove and protect', text: 'The peel is removed according to protocol and post-peel product and sun-care instructions are reviewed.' },
    ],
    sessionGuidance: 'Brandy, Licensed Esthetician provides BioRePeel as one face treatment or a series of three. Amber Mingione, Licensed Esthetician uses BioRePeel only as an add-on to an eligible advanced skin service. Body and targeted services are discussed separately.',
    pairings: [{ title: 'Eligible advanced skin services', text: 'BioRePeel may be used as an add-on to an eligible advanced skin service with Amber Mingione, Licensed Esthetician. Eligibility and timing are determined for the skin being treated.', href: '/services/microneedling/' }],
  },
  'forma-rf-facial': {
    benefits: ['Uses non-invasive, temperature-monitored radiofrequency at the skin surface.', 'Addresses selected face or neck areas without microneedles.'],
    treatmentSteps: [
      { title: 'Select the area', text: 'The face or neck area and the change you want to discuss are reviewed first.' },
      { title: 'Temperature-controlled RF', text: 'The Forma handpiece moves across the skin while delivering radiofrequency and monitoring temperature.' },
      { title: 'Finish and review', text: 'The skin is finished and any short-term care instructions are reviewed.' },
    ],
    sessionGuidance: individualized('Forma'),
    pairings: [{ title: 'Lumecca Peak IPL', text: 'House of Rose has a current Forma + Lumecca option for plans that address both texture and visible pigment. The two devices perform different jobs.', href: '/services/lumecca-peak-ipl/' }],
  },
  'glo2facial': {
    benefits: ['Combines surface exfoliation, topical infusion, oxygenation at the skin surface, and facial massage.', 'Provides a complete device-based facial without presenting oxygen as being blown onto the face.'],
    treatmentSteps: [
      { title: 'Oxfoliation', text: 'A single-use OxyPod and Primer Gel work together at the skin surface for exfoliation and the oxygenation step.' },
      { title: 'Topical infusion', text: 'The selected serum is worked across the skin as the second part of the facial.' },
      { title: 'Facial massage', text: 'The service finishes with facial massage and final skin care.' },
    ],
    sessionGuidance: individualized('Glo2Facial'),
    pairings: noAutomaticPairing('Glo2Facial'),
  },
  'dermaplaning': {
    benefits: ['Removes fine vellus hair from the facial surface.', 'Lifts accumulated surface skin cells for a smoother-looking and smoother-feeling surface.'],
    treatmentSteps: [
      { title: 'Cleanse and prepare', text: 'The face is cleansed and dried before the exfoliation pass.' },
      { title: 'Controlled blade pass', text: 'A specialized blade is held at a controlled angle and moved across the surface in sections.' },
      { title: 'Finish the skin', text: 'The service concludes with appropriate finishing products and sun-care guidance.' },
    ],
    sessionGuidance: individualized('dermaplaning'),
    pairings: [{ title: 'Eligible facial services', text: 'Dermaplaning is available as a complete facial or as an add-on when it is appropriate for the selected facial and current skin condition.' }],
  },
  'face-reality-acne-program': {
    benefits: ['Connects professional esthetic care with a structured daily home-care plan.', 'Creates regular opportunities to adjust products and in-studio care as the skin responds.'],
    treatmentSteps: [
      { title: 'Consultation and baseline', text: 'Current products, habits, skin response, and visible breakout patterns are reviewed.' },
      { title: 'Visits every two weeks', text: 'Professional exfoliation and extractions are selected for the skin at that point in the program.' },
      { title: 'Daily home care', text: 'A specific home-care routine continues between visits and is adjusted when needed.' },
    ],
    sessionGuidance: 'The program runs for twelve weeks with in-studio care every two weeks and daily home care between visits.',
    pairings: [{ title: 'Face Reality home care', text: 'Home care is part of the program itself, not an optional treatment add-on. Products are selected and adjusted for the client.' }],
  },
  'acne-bootcamp': {
    benefits: ['A defined twelve-week structure for the appearance of recurring breakouts.', 'Combines biweekly professional care with daily home care.'],
    treatmentSteps: [
      { title: 'Establish the routine', text: 'The first phase establishes a home-care routine and a baseline for response.' },
      { title: 'Biweekly professional care', text: 'The skin is reassessed every two weeks and the in-studio treatment is selected accordingly.' },
      { title: 'Adjust across twelve weeks', text: 'Home care and professional treatment can be adjusted as tolerance and visible response change.' },
    ],
    sessionGuidance: 'Acne Bootcamp is a twelve-week program with visits every two weeks, not an open-ended facial series.',
    pairings: [{ title: 'Face Reality home care', text: 'The home-care plan is a required part of the twelve-week program and continues between professional visits.' }],
  },
  'waxing': { benefits: ['Removes unwanted facial or body hair from the root.', 'Lets you choose only the area that needs attention.'], treatmentSteps: waxingSteps, sessionGuidance: 'Waxing is booked by area. Repeat timing depends on hair regrowth and skin response.', pairings: noAutomaticPairing('Waxing') },
  'facial-waxing': { benefits: ['Removes hair from the brows, upper lip, or chin.', 'Supports brow cleanup or a defined shape-and-trim service.'], treatmentSteps: waxingSteps, sessionGuidance: 'Facial waxing is one visit per selected area. Repeat timing depends on regrowth and skin response.', pairings: noAutomaticPairing('Facial waxing') },
  'body-waxing': { benefits: ['Removes hair from the selected body area at the root.', 'Offers area-specific service rather than a one-size-fits-all full-body treatment.'], treatmentSteps: waxingSteps, sessionGuidance: 'Body waxing is one visit per selected area. Repeat timing depends on hair regrowth and skin response.', pairings: noAutomaticPairing('Body waxing') },
  'microneedling': {
    benefits: ['Addresses the appearance of uneven texture, eligible scars, fine lines, and selected tone concerns.', 'Uses controlled microchannels with a Procell device and a treatment-specific topical option.'],
    treatmentSteps: [
      { title: 'Prepare the skin', text: 'The treatment area is cleansed, assessed, and prepared before channeling begins.' },
      { title: 'Create controlled microchannels', text: 'The Procell device moves across the planned area at settings selected for the skin and goal.' },
      { title: 'Apply the selected topical', text: 'The service uses the selected Procell Pro, Procell MD, or topical PRF pathway, followed by written aftercare.' },
    ],
    sessionGuidance: 'Treatment count depends on the concern, selected depth, skin response, and whether the Procell Pro, Procell MD, or topical PRF option is used.',
    pairings: [{ title: 'Topical PRF Microneedling', text: 'Topical PRF is a current Microneedling option. A small blood sample is processed, and the PRF is applied topically rather than injected.', href: '/services/prf/' }],
  },
  'prf': {
    benefits: ['Uses platelet-rich fibrin prepared from a small sample of your own blood.', 'Separates topical PRF with Microneedling from injectable under-eye and bio-filler services.'],
    treatmentSteps: [
      { title: 'Collect and process', text: 'A small blood sample is collected and centrifuged to separate the platelet-rich fibrin.' },
      { title: 'Choose the correct route', text: 'PRF is either applied topically with Microneedling or injected by Diana Morrison, RN, depending on the selected service.' },
      { title: 'Follow route-specific care', text: 'Topical Microneedling care and injectable PRF care are different and are reviewed for the service received.' },
    ],
    sessionGuidance: individualized('PRF'),
    pairings: [{ title: 'Microneedling with topical PRF', text: 'At House of Rose, PRF may be applied topically during an eligible Microneedling service. It is not injected in this treatment.', href: '/services/microneedling/' }],
  },
  'prf-under-eyes': {
    benefits: ['Uses injectable PRF prepared from the client’s own blood.', 'Focuses the consultation and treatment plan on the under-eye area.'],
    treatmentSteps: [
      { title: 'Under-eye assessment', text: 'Diana Morrison, RN reviews the under-eye concern, history, anatomy, and candidacy.' },
      { title: 'Blood draw and processing', text: 'A small sample is centrifuged to prepare platelet-rich fibrin.' },
      { title: 'Targeted injection', text: 'PRF is injected according to the individual plan, followed by specific post-injection care.' },
    ],
    sessionGuidance: individualized('PRF Under-Eye'),
    pairings: noAutomaticPairing('PRF Under-Eye'),
  },
  'prf-injections': {
    benefits: ['Uses platelet-rich fibrin prepared from the client’s own blood.', 'Keeps injectable PRF distinct from topical PRF Microneedling.'],
    treatmentSteps: [
      { title: 'Clinical assessment', text: 'Diana Morrison, RN reviews the area, history, and candidacy.' },
      { title: 'Blood draw and centrifuge', text: 'A small sample is processed to separate the PRF.' },
      { title: 'Inject and review care', text: 'PRF is injected according to the plan and post-injection instructions are reviewed.' },
    ],
    sessionGuidance: individualized('injectable PRF'),
    pairings: noAutomaticPairing('Injectable PRF'),
  },
};

export const getServiceEducationDetails = (slug: string): ServiceEducationDetails | undefined =>
  DETAILS[slug];
