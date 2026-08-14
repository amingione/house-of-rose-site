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
    'The standalone Glo2Facial is directly bookable. Send a question first if you want to compare it with another facial.',
  biorepeel:
    'The standalone face treatment is directly bookable. Send a question first if you are deciding between BioRePeel and another skin service.',
  'dermal-fillers':
    'At the consultation, describe where you have noticed a change in facial volume. The five hyaluronic-acid filler options are shown above.',
  'face-reality-acne-program':
    'The $99 Acne Bootcamp Consultation is the directly bookable first appointment for the complete 12-week Face Reality program.',
  'acne-bootcamp':
    'Begin with the $99 Acne Bootcamp Consultation before enrolling in the complete 12-week program.',
  'glp-1-weight-management':
    'Request the $25 GLP-1 Consultation. Medication choice and ongoing medication pricing are discussed with the practice, not determined by this page.',
  'permanent-jewelry':
    'Call House of Rose for the $65, 20-minute fitting. If the chain material or charm matters to you, ask what is available before booking.',
  injectables:
    'At the consultation, point out the lines you notice when you frown, raise your brows, or squint. The Botox and Daxxify details are shown above.',
  'body-waxing':
    'Call House of Rose with the body area you want waxed. The seven available body-waxing appointments are shown above.',
  'iv-hydration-therapy':
    'Compare the six base IV options above. If formulation is part of your decision, call the practice because ingredient lists are not published here.',
  'prf-injections':
    'Use the consultation to ask about under-eye PRF or PRF Bio-Filler. Topical PRF belongs on the Microneedling page.',
  prf:
    'Start with the PRF route that matches the appointment you want: topical PRF with Microneedling, PRF Under Eyes, or PRF Bio-Filler.',
  'injectables-bio-fillers':
    'Open the child page that matches movement-related lines, facial volume, or PRF; each service has its own booking path.',
  dermaplaning:
    'Book the 50-minute standalone facial or the 25-minute add-on. Review Facial Waxing if you want one named facial area waxed.',
  microneedling:
    'Bring your questions about Procell Pro, Procell MD, or topical PRF to the consultation; all three options are explained above.',
  'facial-waxing':
    'Call with the area you want waxed: chin, upper lip, eyebrows, or eyebrow shaping.',
  'forma-rf-facial':
    'Reserve Forma, or send a question if you are comparing its non-invasive radiofrequency with Morpheus8 or Lumecca Peak.',
  'lumecca-peak-ipl':
    'Request a consultation and name the treatment area you want to discuss. The eight Lumecca Peak areas are shown above.',
  morpheus8:
    'Use the consultation to name the face, neck, chest, scar, or stretch-mark area you want to discuss; the single and three-treatment prices are shown above.',
  'morpheus8-body':
    'Use the consultation to name the body area and visible concern you want to discuss. Burst Deep small- and large-area package prices are shown above; call to confirm the appointment length.',
  'prf-under-eyes':
    'Request a consultation and describe whether the under-eye concern looks more like color, visible vessels, shadow, or a combination.',
  waxing:
    'Start with Facial Waxing or Body Waxing to see the available areas, prices, and appointment lengths before you call.',
};

export const getVerifiedServiceDuration = (slug: string): string | undefined =>
  VERIFIED_SERVICE_DURATIONS[slug];

export const getServiceAppointmentGuidance = (slug: string): string | undefined =>
  SERVICE_APPOINTMENT_GUIDANCE[slug];
