/**
 * Treatment page content.
 *
 * Every price here is mirrored from `docs/services/ALL-SERVICES-PRICING.MD`
 * (verified against GlossGenius 2026-07-23). If GlossGenius and this file
 * disagree, GlossGenius wins and this file is corrected — never the reverse.
 *
 * Voice rules enforced on review:
 *   - Declarative, clinically grounded. No exclamation points.
 *   - Banned: pamper, indulge, amazing, luxurious-as-adjective, "steady hands",
 *     "attention to detail", and any discount or membership framing.
 *   - No owner or staff names. Licensure only.
 *   - No exosome or stem-cell language anywhere.
 *
 * Scope presets map to how the treatment is actually delivered. Microchanneling
 * and topical PRF run `esthetics-medical` — esthetician-delivered under the
 * written physician protocol held with the medical director on file.
 */

const VERIFIED = '2026-07-23';

const RESULTS_DISCLAIMER =
  'Individual results vary. Candidacy is determined at consultation. This page is general information and is not medical advice.';

/** Shared credential language for RN-delivered, medically directed treatments. */
const RN_CREDENTIALS = [
  'Performed by a Florida-licensed registered nurse.',
  'Delivered under the delegation of a supervising physician medical director.',
  'Consultation and health history reviewed before every first treatment.',
];

/** Esthetics scope, no medical direction required. */
const ESTHETICS_CREDENTIALS = [
  'Performed by a Florida-licensed esthetician.',
  'Manufacturer-certified on the specific system used.',
  'Skin assessed at each visit before the protocol is selected.',
];

/**
 * Esthetician-delivered under written physician protocol. This is how
 * microchanneling and topical PRF run here — the medical director is on file and
 * the delegation covers them. Do not re-open this.
 */
const ESTHETICS_MEDICAL_CREDENTIALS = [
  'Performed by a Florida-licensed esthetician.',
  'Delivered under written physician protocol and medical direction.',
  'Manufacturer-certified on the specific system used.',
  'Consultation and health history reviewed before every first treatment.',
];

export const TREATMENT_CONTENT = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'prf-microneedling',
    aliases: ['prf-skin-renewal', 'prf-topical', 'prf-facial'],
    displayName: 'PRF Microneedling',
    scopeDecision: 'esthetics-medical',
    priceRange: {
      minPrice: 450,
      unit: 'session',
      note: 'Priced from $450 per session. Three protocol options are available; the right one is selected at consultation based on skin condition and the number of areas treated.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'moderate',
      summary:
        'Expect the look of a firm sunburn for the first day — flushed, warm, and tight. Redness settles substantially by day two and most clients are comfortable in public by day three. Some skin sheds lightly around days three to five as the surface turns over.',
      returnToMakeup: '24 hours — mineral makeup only',
      returnToExercise: '48 hours — no sauna, steam room, or hot yoga',
      timeline: [
        { window: 'First 24 hours', expectation: 'Redness, warmth, and a tight surface feel. The fibrin layer is left on the skin and is not washed off.' },
        { window: 'Days 2–3', expectation: 'Redness fades to a light flush. Skin may feel rough or sandpapery as it begins to turn over.' },
        { window: 'Days 3–5', expectation: 'Light flaking or shedding is normal. Do not pick or exfoliate it away.' },
        { window: 'Weeks 2–6', expectation: 'Surface texture and tone continue to change as the skin remodels. Results build rather than appear at once.' },
      ],
    },
    aftercare: {
      intro:
        'What happens in the 72 hours after treatment determines a meaningful share of the result. The channels created during treatment stay receptive for hours afterward, so what touches the skin matters.',
      firstDay: [
        'Leave the fibrin layer undisturbed. Do not rinse, wipe, or apply anything over it.',
        'Sleep on a clean pillowcase, face up if possible.',
        'Keep hands off the skin entirely.',
      ],
      firstWeek: [
        'Cleanse with a gentle, non-foaming cleanser and lukewarm water.',
        'Use only the post-treatment products provided or approved.',
        'Apply mineral SPF 30 or higher every morning without exception.',
        'Drink water consistently and expect the skin to feel drier than usual.',
      ],
      avoid: [
        'Retinoids, retinol, and prescription vitamin A for seven days.',
        'AHAs, BHAs, and any acid or enzyme exfoliation for seven days.',
        'Direct sun, tanning, sauna, steam, and hot yoga for 48 hours.',
        'Swimming pools, hot tubs, and open water for 72 hours.',
        'Picking, scrubbing, or peeling flaking skin.',
      ],
      ongoing: [
        'A series is typical. Spacing is set at consultation based on how the skin responds.',
        'Daily broad-spectrum SPF protects the result more than any single product.',
      ],
      protocolRef: 'HOR-P001 (PRF Microchanneling) · HOR-P004 (PRF & ProCell Aftercare)',
    },
    whyQualified: [
      'PRF is prepared in-house from your own blood, spun on the certified system it was validated for. Spin protocols are never substituted between systems.',
      'The fibrin veil is prepared using our own chilled-tube method, which thickens liquid PRF to a workable consistency in about five minutes without an incubator.',
      'Nothing is added to the PRF. It is single-use, prepared for you, and used in the same visit it is drawn.',
      'Written protocols govern preparation, application, and aftercare, and are followed the same way every time.',
      'The blood draw, the spin, and the treatment all happen in one room, in one appointment.',
    ],
    faqs: [
      {
        question: 'What is PRF, and how is it different from PRP?',
        answer:
          'Platelet-rich fibrin is concentrated from a small sample of your own blood. Unlike PRP, it is spun at lower speed with no anticoagulant, which leaves a fibrin scaffold intact. That scaffold is what allows it to be applied as a layer that stays on the skin rather than a liquid that runs off.',
      },
      {
        question: 'Does it hurt?',
        answer:
          'A topical numbing agent is applied before treatment. Most clients describe the sensation as vibration and heat rather than sharp pain. The blood draw is a standard venipuncture.',
      },
      {
        question: 'How many sessions will I need?',
        answer:
          'A series is typical rather than a single visit. The number and spacing are set at consultation based on your skin and your goals. Individual results vary.',
      },
      {
        question: 'Can I have this before an event?',
        answer:
          'Not in the same week. Plan a minimum of two weeks between treatment and any event where you want to be photographed. Redness and light shedding are expected in the first several days.',
      },
      {
        question: 'Is there anything that disqualifies me?',
        answer:
          'Active skin infection, certain blood and clotting conditions, pregnancy, isotretinoin use within the last six months, and some autoimmune conditions are among the reasons treatment may be deferred. Health history is reviewed at consultation.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'procell-microchanneling',
    aliases: ['procell-md-microchanneling', 'microchanneling', 'procell'],
    displayName: 'ProCell Microchanneling',
    scopeDecision: 'esthetics-medical',
    priceRange: {
      minPrice: 349,
      unit: 'session',
      note: 'ProCell MD Microchanneling is $349 for a 45-minute session. Combined with a Glo2Facial, the same treatment is $475 (MD) or $525 (Pro).',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'minimal',
      summary:
        'Redness similar to mild windburn for the first day, fading substantially overnight. Most clients are comfortable returning to normal activity the same afternoon and wearing makeup the next morning.',
      returnToMakeup: '24 hours',
      returnToExercise: '24 hours — no sauna or steam',
      timeline: [
        { window: 'First 24 hours', expectation: 'Flushed, warm skin with a tight feel. Serum from the treatment is left on the skin overnight.' },
        { window: 'Day 2', expectation: 'Redness largely resolved. Skin may feel dry or slightly rough.' },
        { window: 'Days 3–5', expectation: 'Light surface flaking in some clients. Texture begins to smooth.' },
        { window: 'Weeks 2–4', expectation: 'Tone and texture continue to change as the skin turns over.' },
      ],
    },
    aftercare: {
      intro:
        'The treatment serum is left on the skin deliberately. Leaving it undisturbed overnight is the single most important thing you can do for the result.',
      firstDay: [
        'Do not wash the face for the rest of the day. Leave the serum in place.',
        'No makeup over the treated area.',
        'Sleep on a clean pillowcase.',
      ],
      firstWeek: [
        'Cleanse gently with lukewarm water starting the next morning.',
        'Keep the routine simple — cleanser, the provided post-care, and SPF.',
        'Mineral SPF 30 or higher daily.',
      ],
      avoid: [
        'Retinoids and acids for five to seven days.',
        'Physical scrubs and exfoliating tools for one week.',
        'Sauna, steam, and hot yoga for 24 hours.',
        'Direct, unprotected sun exposure.',
      ],
      ongoing: [
        'Sessions are typically spaced several weeks apart in a series.',
        'Home care between sessions carries a real share of the result.',
      ],
      protocolRef: 'HOR-P003 (ProCell Biocellulose Recovery Mask) · HOR-P004 (PRF & ProCell Aftercare)',
    },
    whyQualified: [
      'We run the ProCell system as the manufacturer specifies, on the certified protocol, without improvised settings.',
      'Depth and pass count are selected per area and per skin condition rather than run as a single fixed setting across the whole face.',
      'A biocellulose recovery mask protocol is documented and used as part of the treatment rather than sold as an upgrade.',
      'The same treatment can be paired with a Glo2Facial or with PRF in one appointment, so you are not booking two visits to get one result.',
    ],
    faqs: [
      {
        question: 'What is microchanneling?',
        answer:
          'A controlled device creates very fine channels in the skin surface. Those channels prompt the skin to remodel and also let the treatment serum reach beyond the surface layer, which it otherwise could not do.',
      },
      {
        question: 'How is this different from microneedling I have had elsewhere?',
        answer:
          'The device, the depth, and the serum differ between systems, and results follow the system. We run a certified ProCell protocol rather than a generic needling pass.',
      },
      {
        question: 'Why can I not wash my face afterward?',
        answer:
          'The channels stay open for a period after treatment. Washing the serum off early removes the part of the treatment that is still working.',
      },
      {
        question: 'How soon will I see a difference?',
        answer:
          'Surface glow is often visible within a week. Texture and tone changes build over several weeks and across a series. Individual results vary.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'glowtox-facial',
    aliases: ['glowtox'],
    displayName: 'GlowTox Facial',
    scopeDecision: 'rn-medical',
    priceRange: {
      minPrice: 475,
      unit: 'session',
      note: 'GlowTox Facial is $475 for a 60-minute appointment, inclusive of the neurotoxin used in the protocol.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'minimal',
      summary:
        'Small raised points at the injection sites settle within an hour or two. Mild flushing is common on the day of treatment. Most clients return to normal activity immediately and are photograph-ready the next day.',
      returnToMakeup: 'Next morning',
      returnToExercise: '24 hours',
      timeline: [
        { window: 'First 2 hours', expectation: 'Small raised points at treatment sites, resolving on their own. Stay upright.' },
        { window: 'Rest of day 1', expectation: 'Possible light flushing. No makeup over the treated area.' },
        { window: 'Days 2–7', expectation: 'Skin looks smoother and reflects light more evenly as the surface settles.' },
        { window: 'Weeks 2–3', expectation: 'The full effect of the neurotoxin component is established.' },
      ],
    },
    aftercare: {
      intro:
        'The neurotoxin component has specific handling rules for the first several hours. These are not optional — they affect where the product stays.',
      firstDay: [
        'Stay upright for four hours. Do not lie flat or bend at the waist repeatedly.',
        'Do not rub, massage, or press on the treated area.',
        'No makeup over the treated area for the rest of the day.',
      ],
      firstWeek: [
        'Resume a normal gentle routine the following morning.',
        'Mineral SPF 30 or higher daily.',
      ],
      avoid: [
        'Facials, massage, and facial tools for seven days.',
        'Sauna, steam, and hot yoga for 24 hours.',
        'Strenuous exercise for 24 hours.',
        'Lying face down for four hours after treatment.',
      ],
      ongoing: [
        'The effect is temporary. Retreatment intervals are discussed at your follow-up.',
      ],
    },
    whyQualified: [
      'The neurotoxin component is a prescription medication administered by a registered nurse under physician medical direction — not a facial add-on.',
      'Injection depth is superficial and intradermal by design, which is a different technique from standard wrinkle treatment and is dosed accordingly.',
      'The facial and the injectable portion are performed in one appointment, in one room, by providers working from the same protocol.',
      'Candidacy is assessed before booking rather than at the chair.',
    ],
    faqs: [
      {
        question: 'Is GlowTox the same as regular Botox?',
        answer:
          'No. The same class of medication is used, but it is placed superficially in the skin at low dose across a broad area rather than into specific muscles. The intent is surface quality and light reflection rather than stopping movement.',
      },
      {
        question: 'Will my face look frozen?',
        answer:
          'The technique places product in the skin rather than in the muscles of expression. It is dosed for surface effect. Expression is discussed at consultation and dosing is adjusted to your preference.',
      },
      {
        question: 'How long does it last?',
        answer:
          'The effect is temporary and wears off gradually. Retreatment timing is individual and is discussed at your follow-up. Individual results vary.',
      },
      {
        question: 'Can I do this before an event?',
        answer:
          'Yes, with planning. Allow two weeks so the full effect is established and any injection-site marks have fully resolved.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'botox-daxxify',
    aliases: ['botox', 'daxxify', 'neurotoxin', 'tox'],
    displayName: 'Botox and Daxxify',
    scopeDecision: 'rn-medical',
    priceRange: {
      minPrice: 14,
      unit: 'unit',
      note: 'Both Botox and Daxxify are $14 per unit. Total cost depends on the number of units used, which depends on the areas treated and your muscle strength. Unit counts are confirmed with you before treatment begins.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'minimal',
      summary:
        'Small raised points at injection sites settle within about an hour. Occasional pinpoint bruising is possible and covers easily with makeup the following day. There is no recovery period.',
      returnToMakeup: 'Next morning',
      returnToExercise: '24 hours',
      timeline: [
        { window: 'First 2 hours', expectation: 'Small raised points at injection sites. Stay upright.' },
        { window: 'Days 1–3', expectation: 'Occasional pinpoint bruising in some clients. Softening may begin.' },
        { window: 'Days 3–7', expectation: 'The effect becomes clearly visible as movement softens.' },
        { window: 'Weeks 2', expectation: 'Full effect established. This is when a follow-up assessment is appropriate.' },
      ],
    },
    aftercare: {
      intro:
        'The first four hours matter most. After that, there is very little to do.',
      firstDay: [
        'Stay upright for four hours. Do not lie flat or bend repeatedly at the waist.',
        'Do not rub or massage the treated areas.',
        'Gently activate the treated muscles for the first hour.',
      ],
      firstWeek: [
        'Return to your normal skincare routine the next morning.',
        'Book a follow-up assessment at two weeks if this is your first treatment with us.',
      ],
      avoid: [
        'Facials, facial massage, and microcurrent for seven days.',
        'Sauna, steam, and hot yoga for 24 hours.',
        'Strenuous exercise for 24 hours.',
        'Lying face down for four hours after treatment.',
      ],
      ongoing: [
        'The effect is temporary. Retreatment intervals are individual and are set from how your last treatment wore off.',
      ],
    },
    whyQualified: [
      'Both products are administered by a Florida-licensed registered nurse under physician medical direction.',
      'Botox and Daxxify are priced identically at $14 per unit, so product selection is a clinical conversation with no cost pressure attached.',
      'Unit counts are confirmed with you before any injection is placed. You are not billed for a number you did not agree to.',
      'A two-week follow-up assessment is standard for first-time clients so dosing can be adjusted from observed result rather than assumption.',
    ],
    faqs: [
      {
        question: 'What is the difference between Botox and Daxxify?',
        answer:
          'They are different formulations in the same medication class. Daxxify uses a peptide stabiliser rather than human serum albumin. Reported duration differs between products and between individuals. Which one suits you is decided at consultation, and both are the same price here.',
      },
      {
        question: 'How many units will I need?',
        answer:
          'That depends on the areas treated and how strong the underlying muscles are. It varies widely between people. Your count is assessed and confirmed with you before treatment.',
      },
      {
        question: 'How long before I see anything?',
        answer:
          'Softening typically begins within three to seven days, with the full effect established around two weeks. Individual results vary.',
      },
      {
        question: 'Will I bruise?',
        answer:
          'Pinpoint bruising is possible but not typical. If you bruise easily, avoid alcohol, fish oil, and NSAIDs for a few days beforehand where your physician permits it.',
      },
      {
        question: 'Who administers the injection?',
        answer:
          'A Florida-licensed registered nurse, working under the delegation of a supervising physician medical director.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'iv-hydration',
    aliases: ['iv-therapy', 'hydration-iv', 'iv'],
    displayName: 'IV Hydration and Vitamin Therapy',
    scopeDecision: 'rn-medical',
    priceRange: {
      minPrice: 100,
      maxPrice: 190,
      unit: 'session',
      note: 'Formulas run from $100 for a 30-minute Hydration IV to $190 for a Myers\u2019 Cocktail. Add-ons are priced separately: vitamin C, B12, biotin, or magnesium at $25, glutathione at $35, NAD+ at $100.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'none',
      summary:
        'There is no downtime. You can drive, return to work, and exercise the same day. The only lasting marks are a small bandage at the insertion site and, occasionally, mild tenderness there for a day.',
      returnToMakeup: 'Immediately',
      returnToExercise: 'Same day',
      timeline: [
        { window: 'During (30–45 min)', expectation: 'You are seated in a private room. Some clients notice a mineral taste or a cool sensation along the arm.' },
        { window: 'Immediately after', expectation: 'Normal activity resumes. Keep the bandage on for an hour.' },
        { window: 'Rest of day', expectation: 'Mild tenderness at the insertion site is possible.' },
      ],
    },
    aftercare: {
      intro:
        'IV therapy requires very little afterward, but a few things protect the insertion site and help you get the benefit of the session.',
      firstDay: [
        'Keep the bandage on for at least one hour.',
        'Continue drinking water — the IV supplements your intake rather than replacing it.',
        'Eat something within a couple of hours if you came in fasted.',
      ],
      firstWeek: [
        'Monitor the insertion site. Mild bruising is normal and resolves within a few days.',
      ],
      avoid: [
        'Heavy lifting with the treated arm for the rest of the day.',
        'Alcohol for the remainder of the day, particularly after a recovery formula.',
      ],
      ongoing: [
        'Frequency is individual. Some clients come seasonally, others around travel or events.',
      ],
    },
    whyQualified: [
      'Every IV is placed and monitored by a Florida-licensed registered nurse under physician medical direction.',
      'Health history and current medications are reviewed before a formula is selected — the menu is a starting point, not an order form.',
      'Sessions are private. This is a treatment room, not a shared drip lounge.',
      'Add-ons are priced transparently and discussed before they are added rather than after.',
    ],
    faqs: [
      {
        question: 'Which IV should I choose?',
        answer:
          'That depends on why you are coming in. Hydration is the simplest option at $100. Immunity, Recovery, Beauty Glow, Reboot, and the Myers\u2019 Cocktail each carry different formulations. Your history is reviewed and a recommendation is made before anything is started.',
      },
      {
        question: 'How long does an appointment take?',
        answer:
          'A Hydration IV runs about 30 minutes. The other formulas run about 45 minutes. Add-ons do not meaningfully extend that.',
      },
      {
        question: 'Does it hurt?',
        answer:
          'You feel the initial insertion. After that, most clients report no discomfort for the rest of the session.',
      },
      {
        question: 'Can I drive afterward?',
        answer:
          'Yes. There is no sedation involved and no restriction on driving.',
      },
      {
        question: 'Is there anyone who should not have IV therapy?',
        answer:
          'Certain kidney, heart, and blood conditions, pregnancy, and some medications make IV therapy inappropriate. This is why history is reviewed before treatment rather than after booking.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'dermal-fillers',
    aliases: ['fillers', 'juvederm', 'rha'],
    displayName: 'Dermal Fillers',
    scopeDecision: 'rn-medical',
    priceRange: {
      minPrice: 650,
      maxPrice: 850,
      unit: 'syringe',
      note: 'Priced per syringe: Juv\u00e9derm Ultra XC from $650, RHA 1 from $650, RHA 2 from $700, RHA 3 from $800, Juv\u00e9derm Voluma XC from $850. The number of syringes needed is assessed at consultation.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'moderate',
      summary:
        'Swelling and firmness in the treated area are expected for the first two to three days. Bruising is common and can take a week to resolve fully. Plan two weeks before any event where you want to be photographed.',
      returnToMakeup: '24 hours',
      returnToExercise: '48 hours',
      timeline: [
        { window: 'First 24 hours', expectation: 'Swelling, tenderness, and firmness. Possible bruising at injection points.' },
        { window: 'Days 2–3', expectation: 'Swelling peaks then begins to settle. Bruising may darken before it fades.' },
        { window: 'Days 4–7', expectation: 'Most swelling resolves. Bruising fades and covers with makeup.' },
        { window: 'Week 2', expectation: 'Product has settled and integrated. This is when the result is assessed.' },
      ],
    },
    aftercare: {
      intro:
        'Filler moves in the first 48 hours. Protecting the area during that window is what keeps the result where it was placed.',
      firstDay: [
        'Apply a cool compress gently — no pressure, no ice directly on skin.',
        'Stay upright for four hours.',
        'No makeup over injection sites for 24 hours.',
        'Sleep with your head elevated.',
      ],
      firstWeek: [
        'Sleep on your back where possible for the first few nights.',
        'Return to normal skincare after 24 hours.',
        'Book a two-week assessment.',
      ],
      avoid: [
        'Facials, massage, and facial tools for two weeks.',
        'Sauna, steam, hot yoga, and sunbathing for 48 hours.',
        'Strenuous exercise for 48 hours.',
        'Dental work for two weeks where it can be deferred.',
      ],
      ongoing: [
        'Hyaluronic acid fillers are temporary and metabolise gradually. Timing for retreatment is individual.',
      ],
    },
    whyQualified: [
      'All filler is placed by a Florida-licensed registered nurse under physician medical direction.',
      'Both the Juv\u00e9derm and RHA lines are stocked, so product is matched to the area and the tissue rather than to inventory.',
      'A two-week assessment is standard so the settled result is reviewed rather than assumed.',
      'Consultation precedes treatment. We do not book filler as a walk-in service.',
    ],
    faqs: [
      {
        question: 'How many syringes will I need?',
        answer:
          'That is assessed at consultation and depends on the area, the volume change you are looking for, and your anatomy. You will know the number and the cost before treatment begins.',
      },
      {
        question: 'What is the difference between Juv\u00e9derm and RHA?',
        answer:
          'They are both hyaluronic acid fillers manufactured with different cross-linking technologies, which gives them different handling characteristics. RHA products are formulated for areas with more movement. Which line suits your treatment area is a clinical decision made at consultation.',
      },
      {
        question: 'How long does filler last?',
        answer:
          'It varies by product, by area, and by individual metabolism. Your provider will give you a realistic expectation for the specific product and area at consultation. Individual results vary.',
      },
      {
        question: 'What if I do not like the result?',
        answer:
          'Hyaluronic acid fillers can be dissolved. This is discussed as part of consent before treatment, not after.',
      },
      {
        question: 'Can I have filler and tox in the same visit?',
        answer:
          'Often yes. Sequencing is decided by your provider based on the areas being treated.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'glo2facial',
    aliases: ['glo2-facial', 'glo2'],
    displayName: 'Glo2Facial',
    scopeDecision: 'esthetics',
    priceRange: {
      minPrice: 195,
      maxPrice: 595,
      unit: 'session',
      note: 'Glo2Facial alone is $195 for 60 minutes. Combined 90-minute appointments: with ProCell MD $475, with ProCell Pro $525, with PRF $595.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'none',
      summary:
        'There is no downtime. Skin typically looks brighter and feels smoother immediately. Makeup can be applied the same day, which is why this is the treatment most often booked ahead of an event.',
      returnToMakeup: 'Same day',
      returnToExercise: 'Same day',
      timeline: [
        { window: 'Immediately after', expectation: 'Skin looks brighter and more even. Some clients notice mild transient flushing.' },
        { window: 'Same day', expectation: 'Normal activity and makeup with no restriction.' },
        { window: 'Days 2–7', expectation: 'Hydration and surface smoothness hold.' },
      ],
    },
    aftercare: {
      intro:
        'Very little is required. The main thing is to avoid undoing the surface work with aggressive products in the days that follow.',
      firstDay: [
        'Apply mineral SPF before going outside.',
        'Keep your routine simple.',
      ],
      firstWeek: [
        'Resume active ingredients after 48 hours unless told otherwise.',
        'Daily broad-spectrum SPF.',
      ],
      avoid: [
        'Acids and retinoids for 48 hours.',
        'Physical scrubs for 48 hours.',
        'Extended unprotected sun exposure.',
      ],
      ongoing: [
        'Monthly is a common cadence. Timing around events is easy to plan given there is no downtime.',
      ],
    },
    whyQualified: [
      'Performed by a Florida-licensed esthetician certified on the Glo2Facial system.',
      'The protocol is selected from your skin at that visit rather than run as a single fixed sequence for everyone.',
      'It can be combined with ProCell or PRF in one 90-minute appointment, so you are not booking two visits.',
      'No downtime makes it the reliable option in the two weeks before a wedding or event, and it is scheduled that way deliberately.',
    ],
    faqs: [
      {
        question: 'What does the Glo2Facial actually do?',
        answer:
          'It combines exfoliation, an oxygenating step, and infusion of a treatment serum in one sequence. The intent is immediate surface quality — brightness, hydration, and smoothness — rather than deep remodelling.',
      },
      {
        question: 'How close to an event can I book it?',
        answer:
          'It can be done the same week, and often the day before. There is no downtime and no expected redness.',
      },
      {
        question: 'Should I add ProCell or PRF?',
        answer:
          'Adding either changes the treatment from a surface facial to a resurfacing treatment, which introduces downtime. If you are treating texture or tone rather than looking for immediate glow, that is the conversation to have at consultation.',
      },
      {
        question: 'Is it suitable for sensitive skin?',
        answer:
          'It is generally well tolerated, but your skin is assessed before the protocol is selected. Individual results vary.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'acne-program',
    aliases: ['acne-bootcamp', 'face-reality', 'acne'],
    displayName: 'The Face Reality Acne Program',
    scopeDecision: 'esthetics',
    priceRange: {
      minPrice: 899,
      unit: 'program',
      note: 'The twelve-week program is $899 and includes biweekly in-clinic appointments across the full course. It is offered as a program only — not as single sessions.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'minimal',
      summary:
        'Individual appointments have little downtime, but the program itself has a purging phase. Skin commonly looks worse before it looks better in the first several weeks. That is expected and is explained before you enrol.',
      returnToMakeup: 'Next day',
      returnToExercise: 'Same day',
      timeline: [
        { window: 'Weeks 1–2', expectation: 'Home care is introduced gradually. Skin adjusts to the actives.' },
        { window: 'Weeks 3–6', expectation: 'Purging phase. Congestion already in the skin surfaces. This is the hardest stretch and it is expected.' },
        { window: 'Weeks 7–10', expectation: 'Breakout frequency typically begins to decrease. Home care is adjusted at each visit.' },
        { window: 'Weeks 11–12', expectation: 'Program review and a maintenance plan for what comes after.' },
      ],
    },
    aftercare: {
      intro:
        'The in-clinic appointments are roughly a quarter of this program. The home care regimen is the rest of it, and compliance is what determines whether the twelve weeks work.',
      firstDay: [
        'Follow the home care regimen exactly as it is written for you.',
        'Do not add products that were not part of the plan.',
      ],
      firstWeek: [
        'Introduce actives on the schedule given rather than all at once.',
        'Mineral SPF daily — non-negotiable while on actives.',
        'Report irritation rather than stopping the regimen on your own.',
      ],
      avoid: [
        'Picking or extracting at home.',
        'Adding new products mid-program without discussing them first.',
        'Pore-clogging ingredients in makeup, hair products, and sunscreen.',
        'Skipping appointments — the regimen is adjusted at each one.',
      ],
      ongoing: [
        'A maintenance plan is set at the end of week twelve.',
      ],
    },
    whyQualified: [
      'Delivered by a Face Reality certified acne specialist working the full certified protocol, not a general facial adapted for acne.',
      'The home care regimen is adjusted at every biweekly visit based on how your skin actually responded, rather than issued once at the start.',
      'The purging phase is explained before you enrol so you know what weeks three through six look like and do not abandon the program during them.',
      'It is sold as a twelve-week program because that is how long it takes. Single sessions are not offered for this reason.',
    ],
    faqs: [
      {
        question: 'Why twelve weeks?',
        answer:
          'Skin cells turn over on a cycle, and acne that is already forming beneath the surface takes weeks to clear. Twelve weeks covers enough cycles to see real change rather than temporary improvement.',
      },
      {
        question: 'Will my skin get worse first?',
        answer:
          'Commonly, yes. The purging phase around weeks three to six brings existing congestion to the surface. It is expected and it is the reason the program is structured with regular check-ins.',
      },
      {
        question: 'What is included in the $899?',
        answer:
          'The biweekly in-clinic appointments across the twelve weeks. Home care products are discussed at consultation.',
      },
      {
        question: 'Can I just book one acne facial?',
        answer:
          'No. Standalone acne sessions are not offered. Acne responds to a sustained regimen, and single treatments do not produce durable change.',
      },
      {
        question: 'Does this replace medical treatment for acne?',
        answer:
          'No. This is an esthetics program. Severe, cystic, or scarring acne warrants medical care, and we will refer you rather than enrol you.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'weight-management',
    aliases: ['glp-1', 'semaglutide', 'tirzepatide', 'medical-weight-loss'],
    displayName: 'Medical Weight Management',
    scopeDecision: 'rn-medical',
    priceRange: {
      minPrice: 225,
      maxPrice: 325,
      unit: 'month',
      note: 'Semaglutide from $225 per month, tirzepatide from $325 per month. Which medication is appropriate, and at what dose, is a medical decision made at consultation.',
      verifiedAgainstGlossGenius: VERIFIED,
    },
    downtime: {
      level: 'none',
      summary:
        'There is no downtime from the injection itself. Side effects from the medication — most commonly nausea and digestive changes, particularly after a dose increase — are managed through the dosing schedule and monitored at each check-in.',
      returnToMakeup: 'Immediately',
      returnToExercise: 'Same day',
      timeline: [
        { window: 'Week 1', expectation: 'Starting dose. Digestive side effects are most common in the first days after each new dose.' },
        { window: 'Weeks 2–4', expectation: 'The body adjusts. Appetite changes typically become noticeable.' },
        { window: 'Monthly', expectation: 'Check-in, dose review, and side effect assessment before the next month is issued.' },
      ],
    },
    aftercare: {
      intro:
        'This is an ongoing medical program rather than a treatment with an aftercare window. What follows applies throughout.',
      firstDay: [
        'Rotate injection sites as instructed.',
        'Eat smaller portions and stop when full rather than when the plate is empty.',
      ],
      firstWeek: [
        'Prioritise protein and water intake.',
        'Report side effects rather than adjusting the dose yourself.',
        'Keep the monthly check-in — the prescription depends on it.',
      ],
      avoid: [
        'Changing your own dose in either direction.',
        'Alcohol in quantity, particularly after a dose increase.',
        'Large or high-fat meals, which worsen nausea.',
        'Skipping check-ins.',
      ],
      ongoing: [
        'Dose is titrated over time under medical supervision.',
        'An exit or maintenance strategy is part of the plan from the start.',
      ],
    },
    whyQualified: [
      'Prescribed and monitored under physician medical direction with monthly in-person review, not issued by questionnaire.',
      'Dose titration is managed clinically rather than left to a fixed schedule you follow alone.',
      'Injections are taught in person at the first visit rather than by video.',
      'Both semaglutide and tirzepatide are available, so the medication is matched to you rather than to what is stocked.',
    ],
    faqs: [
      {
        question: 'What is the difference between semaglutide and tirzepatide?',
        answer:
          'They act on different receptor targets. Which is appropriate depends on your medical history and your response. That decision is made at consultation.',
      },
      {
        question: 'What does the monthly price include?',
        answer:
          'The medication and the medical oversight that goes with it, including your monthly review. Pricing starts at $225 for semaglutide and $325 for tirzepatide.',
      },
      {
        question: 'What are the common side effects?',
        answer:
          'Nausea, reduced appetite, and digestive changes are the most commonly reported, particularly in the days following a dose increase. These are reviewed at each check-in and the dosing schedule is adjusted accordingly.',
      },
      {
        question: 'Do I need to come in every month?',
        answer:
          'Yes. This is a prescription medication under active medical supervision. The monthly review is a requirement of the program, not an optional add-on.',
      },
      {
        question: 'Is everyone a candidate?',
        answer:
          'No. Personal and family medical history, current medications, and certain conditions determine eligibility. This is assessed at consultation. Individual results vary.',
      },
    ],
  },
];

/** Scope presets applied by the seed script. */
export const SCOPE_PRESETS = {
  'rn-medical': {
    performedBy: 'rn',
    medicalDirection: true,
    credentialPoints: RN_CREDENTIALS,
    consultRequired: true,
    disclaimer: RESULTS_DISCLAIMER,
  },
  'esthetics-medical': {
    performedBy: 'esthetician',
    medicalDirection: true,
    credentialPoints: ESTHETICS_MEDICAL_CREDENTIALS,
    consultRequired: true,
    disclaimer: RESULTS_DISCLAIMER,
  },
  esthetics: {
    performedBy: 'esthetician',
    medicalDirection: false,
    credentialPoints: ESTHETICS_CREDENTIALS,
    consultRequired: true,
    disclaimer: RESULTS_DISCLAIMER,
  },
};

/**
 * Services intentionally NOT authored here.
 * Do not invent pages for these — they are not on the GlossGenius menu.
 */
export const BLOCKED_TREATMENTS = [
  {
    name: 'Morpheus8',
    reason:
      'Not present in ALL-SERVICES-PRICING.MD, not in GlossGenius, and no RF microneedling device is listed anywhere in the repo. Publishing a Morpheus8 page would advertise a device the practice does not appear to own. Confirm the device and add it to GlossGenius first.',
  },
];
