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
  injectables: 'Expression lines · natural facial movement',
  'dermal-fillers': 'Lost facial volume · lips, cheeks, and folds',
  'iv-hydration-therapy': 'Fluids, electrolytes, and vitamins · medical screening first',
  'glp-1-weight-management': 'Provider-guided medication · regular progress and tolerance reviews',
  glo2facial: 'Visible hydration · surface texture · a well-rested look',
  dermaplaning: 'Peach fuzz · surface buildup · smoother makeup application',
  'facial-waxing': 'Brows · upper lip · chin',
  'body-waxing': 'Underarms · bikini line · arms · legs · back · chest',
};

export const getServiceCardSummary = (slug: string): string | undefined =>
  SERVICE_CARD_SUMMARIES[slug];
