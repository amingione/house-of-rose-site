export interface PermanentJewelryEducation {
  readonly title: string;
  readonly whatItIs: string;
  readonly appointment: string;
  readonly fitAndClosure: string;
  readonly permanenceAndRemoval: string;
  readonly provider: {
    readonly publicName: string;
    readonly role: string;
    readonly profilePath: string;
  };
  readonly faqs: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly menu: {
    readonly name: string;
    readonly priceUsd: number;
    readonly durationMinutes: number;
    readonly verifiedAt: string;
  };
}

/**
 * Current non-medical service facts. The public page deliberately does not name
 * metals, chain tiers, charms, or event packages because those details are not
 * reconciled in the current GlossGenius-backed menu.
 */
export const PERMANENT_JEWELRY_EDUCATION: PermanentJewelryEducation = {
  title: 'Permanent Jewelry',
  whatItIs:
    'Permanent jewelry is a chain fitted in person and closed without a traditional clasp. At House of Rose, it is a non-medical service.',
  appointment:
    'The fitting and closure happen during one appointment: the chain is fitted to the wearer, then its ends are joined by welding. The appointment takes 20 minutes; ask about current pricing when you book.',
  fitAndClosure:
    'The weld closes the chain so a traditional clasp is not needed. Clasp-free describes how the jewelry closes; it is not attached to the skin.',
  permanenceAndRemoval:
    'Permanent means the chain remains closed during wear instead of being opened and fastened with a clasp. It can be cut when removal is needed, so the closure is not irreversible.',
  provider: {
    publicName: 'Aundrea Pedigo, Licensed Esthetician',
    role: 'Permanent Jewelry Artist',
    profilePath: '/about/providers/aundrea/',
  },
  faqs: [
    {
      question: 'Is permanent jewelry attached to the skin?',
      answer:
        'No. The chain is fitted to the wearer and its ends are welded together; it is not attached to the skin.',
    },
    {
      question: 'Can permanent jewelry be removed?',
      answer:
        'Yes. The chain can be cut when removal is needed. “Permanent” refers to the clasp-free closure, not an irreversible attachment.',
    },
  ],
  menu: {
    name: 'Permanent Jewelry',
    priceUsd: 65,
    durationMinutes: 20,
    verifiedAt: '2026-08-06',
  },
};
