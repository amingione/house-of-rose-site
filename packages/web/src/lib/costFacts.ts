export interface VerifiedCostFact {
  display: string;
  answer: string;
  verifiedAt: string;
}

const VERIFIED_AT = '2026-08-06';

const VERIFIED_COST_FACTS: Readonly<Record<string, VerifiedCostFact>> = {
  'botox-cost-punta-gorda': {
    display: '$14 per unit',
    answer: 'Botox at House of Rose in Punta Gorda is $14 per unit. Price verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
  'prf-microneedling-cost-punta-gorda': {
    display: '$595',
    answer: 'Topical PRF microneedling at House of Rose in Punta Gorda is $595. Price verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
  'dermal-fillers-cost-punta-gorda': {
    display: '$650–$850',
    answer: 'Dermal filler prices at House of Rose in Punta Gorda range from $650 to $850. Prices verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
  'forma-cost-punta-gorda': {
    display: '$600–$3,000',
    answer: 'Forma prices at House of Rose in Punta Gorda range from $600 to $3,000. Prices verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
  'ipl-photofacial-cost-punta-gorda': {
    display: '$250–$2,600',
    answer: 'Lumecca prices at House of Rose in Punta Gorda range from $250 to $2,600. Prices verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
  'biorepeel-cost-punta-gorda': {
    display: '$250',
    answer: 'A standalone BioRePeel at House of Rose in Punta Gorda is $250. Price verified August 6, 2026.',
    verifiedAt: VERIFIED_AT,
  },
};

export const getVerifiedCostFact = (slug: string): VerifiedCostFact | undefined =>
  VERIFIED_COST_FACTS[slug];
