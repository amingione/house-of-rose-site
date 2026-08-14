const VERIFIED_SERVICE_DURATIONS: Readonly<Record<string, string>> = {
  'permanent-jewelry': '20 minutes',
  'iv-hydration-therapy': '30–45 minutes',
  'dermal-fillers': '30–45 minutes',
  'facial-waxing': '10–30 minutes by area',
};

// Reviewed next-step copy for the current public service inventory. These lines
// use facts already published in the service education modules; they keep the
// final appointment section useful without repeating one generic consultation
// sentence across every service page.
const SERVICE_APPOINTMENT_GUIDANCE: Readonly<Record<string, string>> = {
  glo2facial:
    'The $225, 60-minute standalone Glo2Facial is directly bookable with Amber Mingione, Licensed Esthetician. The surface pass uses an OxyPod with Primer Gel, followed by topical infusion and facial massage.',
  biorepeel:
    'The $250, 45-minute standalone face treatment and $699 Series of 3 are directly bookable. Call House of Rose to discuss Gold Body at $325 for 45 minutes, Advanced Acne Scarring at $450 for 75 minutes, or the Duo Gold Spot Upgrade at $395 for 60 minutes.',
  'dermal-fillers':
    'Request the 60-minute, $300 Dermal Filler Consultation and describe whether the change in volume is at the lips, cheeks, or folds. You do not need to choose among the Juvéderm and RHA products first.',
  'face-reality-acne-program':
    'The $99 Acne Bootcamp Consultation is booked separately from the complete $899, 12-week Face Reality program. Home-care products are also a separate purchase.',
  'acne-bootcamp':
    'Book the $99 Acne Bootcamp Consultation to discuss the complete $899, 12-week program and its separately purchased home care.',
  'glp-1-weight-management':
    'The first appointment is a 40-minute, $25 consultation with Diana Morrison, RN. Medication and ongoing program charges are separate; call House of Rose for those prices.',
  'permanent-jewelry':
    'Call House of Rose for the $65, 20-minute fitting. If the chain material or charm matters to you, ask what is available before booking.',
  injectables:
    'The 20-minute, $50 Neuromodulator Consultation with Diana Morrison, RN is for describing which lines appear or deepen when you frown, raise your brows, or squint. Botox and Daxxify are each $14 per unit; the treatment appointment total depends on the number of units administered.',
  'body-waxing':
    'Call House of Rose and name the body area you want waxed; for legs, specify Full Leg or Partial Leg.',
  'iv-hydration-therapy':
    'If ingredients or add-ons are part of your decision, call House of Rose before booking and ask about the IV appointment you are considering.',
  'prf-injections':
    'Diana Morrison, RN provides two injectable PRF consultations under medical direction: PRF Under-Eye is $495 with appointment length confirmed by phone; PRF Bio-Filler is $899 for 45 minutes. During eligible Microneedling, PRF is applied topically at the skin surface rather than injected.',
  prf:
    'For PRF applied at the skin surface, ask about Microneedling with Amber Mingione, Licensed Esthetician. For injectable PRF with Diana Morrison, RN, ask about PRF Under-Eye or PRF Bio-Filler.',
  'injectables-bio-fillers':
    'Describe whether what you notice changes with expression, looks like lost volume at the lips, cheeks, or folds, or involves under-eye color, vessels, or shadow. A product name is not required.',
  dermaplaning:
    'Book the 50-minute standalone facial or the 25-minute add-on. Dermaplaning addresses fine vellus hair and surface buildup across the face; Facial Waxing is booked by area for the brows, upper lip, or chin.',
  microneedling:
    'The $50, 60-minute Procell Therapies Consultation with Amber Mingione, Licensed Esthetician covers the Pro and MD serum options, which use the same Procell device. PRF Microneedling is a separate $595, 60-minute consultation where PRF is applied at the skin surface.',
  'facial-waxing':
    'Book Facial Waxing online by selecting Chin at $10 for 30 minutes, Upper Lip at $10 for 10 minutes, Eyebrows at $15 for 10 minutes, or Eyebrow Shape, Trim & Wax at $25 for 25 minutes.',
  'forma-rf-facial':
    'Call House of Rose with the area you want to discuss. Forma covers face, neck, face and neck, eyes, jawline, and nasolabial folds; Forma Plus covers abdomen, arms, inner-outer thighs, lower back, and knees. Forma delivers radiofrequency through surface electrodes without microneedles; Morpheus8 is RF microneedling, and Lumecca Peak is IPL for pigment-related questions.',
  'lumecca-peak-ipl':
    'Request the $50 consultation and name one of the current treatment areas: legs; full face; chest; neck; face and neck; face, neck, and chest; spot treatment; or hands.',
  morpheus8:
    'Request a consultation and name the Morpheus8 option and area you want to discuss. Burst covers Full Face, Face & Neck, Scars, Chest, Stretch Marks, and Hyperhidrosis; Resurfacing is available for Full Face or Face & Neck; Prime is available for Eyes & Mouth, Around the Eyes, or Around the Mouth. Call to confirm the appointment length.',
  'morpheus8-body':
    'When requesting the consultation, name the body area and whether your question is about tone, texture, an eligible scar, or stretch marks. Burst Deep is $3,500 for a 4 × 10-inch area or $4,500 for an 8 × 11-inch area, each as a series of three. Call to confirm the appointment length.',
  'prf-under-eyes':
    'Request a consultation and describe whether the under-eye concern looks more like color, visible vessels, shadow, or a combination.',
  waxing:
    'Facial Waxing can be booked online. For Body Waxing, call House of Rose with the area you want waxed.',
};

export const getVerifiedServiceDuration = (slug: string): string | undefined =>
  VERIFIED_SERVICE_DURATIONS[slug];

export const getServiceAppointmentGuidance = (slug: string): string | undefined =>
  SERVICE_APPOINTMENT_GUIDANCE[slug];
