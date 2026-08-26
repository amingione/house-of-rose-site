/**
 * Short, fact-checked service-directory summaries.
 *
 * These name the visible concern, treatment area, or practical appointment
 * outcome. They deliberately avoid the promotional CMS taglines while the
 * public voice reset is in effect.
 */
const SERVICE_CARD_SUMMARIES: Record<string, string> = {
  morpheus8: 'Visible texture · eligible scars · stretch marks',
  'lumecca-peak-ipl': 'Visible pigment · uneven tone · selected texture concerns',
  'forma-rf-facial': 'Crepey-looking facial texture · collagen support',
  biorepeel: 'Topical TCA-based face peel',
  microneedling: 'Procell Therapies · controlled microchannels · topical PRF option',
  'neck-decollete-extension': 'Neck and décolleté · added to an eligible facial service',
  injectables: 'Neuromodulators · movement-related lines',
  'injectables-bio-fillers': 'Neurotoxins · dermal fillers · injectable PRF',
  'dermal-fillers': 'Lost facial volume · lips, cheeks, and folds',
  prf: 'Topical PRF with microneedling · injectable under-eye · Bio-Filler',
  'prf-injections': 'Injectable PRF · face and under-eye concerns',
  'prf-under-eyes': 'Injectable PRF · under-eye hollows and visible shadowing',
  'iv-hydration-therapy': 'Intravenous hydration provided by Diana Morrison, RN',
  'glp-1-weight-management': 'Semaglutide · tirzepatide · medical consultation',
  glo2facial: 'Surface exfoliation · topical infusion · oxygenation',
  dermaplaning: 'Peach fuzz · surface buildup · smoother makeup application',
  'face-reality-acne-program': 'Acne consultation · 12-week Acne Bootcamp program',
  waxing: 'Facial and body waxing',
  'facial-waxing': 'Brows · upper lip · chin',
  'body-waxing': 'Underarms · bikini line · arms · legs · back · chest',
};

export const getServiceCardSummary = (slug: string): string | undefined =>
  SERVICE_CARD_SUMMARIES[slug];
