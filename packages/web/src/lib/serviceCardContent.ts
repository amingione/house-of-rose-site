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
  biorepeel: 'Topical peel · face and body',
  microneedling: 'Visible texture · eligible scars · face and body',
  'neck-decollete-extension': 'Neck and décolleté · added to an eligible facial service',
  injectables: 'Neuromodulators · movement-related lines',
  'dermal-fillers': 'Lost facial volume · lips, cheeks, and folds',
  prf: 'Topical and injectable options · not interchangeable',
  'prf-injections': 'Injectable PRF · face and under-eye concerns',
  'prf-under-eyes': 'Injectable PRF · under-eye hollows and visible shadowing',
  'iv-hydration-therapy': 'Hydration, immunity, and recovery drips',
  'glp-1-weight-management': 'Semaglutide · tirzepatide · medical consultation',
  glo2facial: 'Oxygen infusion · surface exfoliation',
  dermaplaning: 'Peach fuzz · surface buildup · smoother makeup application',
  waxing: 'Facial and body waxing',
  'facial-waxing': 'Brows · upper lip · chin',
  'body-waxing': 'Underarms · bikini line · arms · legs · back · chest',
};

export const getServiceCardSummary = (slug: string): string | undefined =>
  SERVICE_CARD_SUMMARIES[slug];
