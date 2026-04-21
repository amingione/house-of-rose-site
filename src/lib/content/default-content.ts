import { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  brandName: "House of Rose",
  city: "Punta Gorda",
  state: "FL",
  hero: {
    eyebrow: "Boutique Aesthetics Studio",
    title: "A quieter kind of luxury for women who want to look exquisitely well kept.",
    description:
      "House of Rose pairs consultation-led aesthetics with a private, elevated guest experience designed to feel calm, considered, and unmistakably high touch.",
    secondaryDescription:
      "From injectables and skin renewal to wellness support, every recommendation is personalized for your features, your lifestyle, and the level of refinement you actually want.",
    primaryCtaLabel: "Book Consultation",
    primaryCtaHref: "https://example.com/book-house-of-rose",
    secondaryCtaLabel: "Explore Services",
    secondaryCtaHref: "/services",
  },
  services: [
    {
      id: "svc-injectables",
      slug: "injectables",
      name: "Injectables",
      description:
        "Subtle, architecture-aware injectables designed to soften, lift, and restore without erasing what makes your face yours.",
      highlight: "Balanced refinement with expression-preserving artistry",
      promise:
        "For clients who want to look fresher, smoother, and more rested, injectables at House of Rose are mapped with restraint and facial harmony in mind.",
      details:
        "Each injectable appointment begins with a full-face assessment, movement review, and conversation about how you want to look in real life, not just in the treatment chair. The plan is tailored to your features, your tolerance for maintenance, and the finish you want others to notice without being able to name.",
      benefits: [
        "Softens dynamic lines while preserving natural movement",
        "Restores strategic structure where the face has started to look tired or flat",
        "Builds a polished result gradually, without chasing overfilled or frozen outcomes",
      ],
      idealFor: [
        "Clients seeking polished, natural-looking refreshment",
        "Anyone who wants a personalized plan instead of a standard syringe count",
        "Guests who value subtlety, symmetry, and long-term facial balance",
      ],
      approach: [
        "Detailed facial assessment and expression mapping",
        "Conservative placement strategy guided by anatomy and proportion",
        "Thoughtful aftercare and maintenance planning tailored to lifestyle",
      ],
      results: [
        "A softer, smoother, more rested appearance",
        "Better balance through the forehead, midface, lips, or lower face where indicated",
        "A finish that reads refined rather than obvious",
      ],
      consultationNote:
        "Exact product selection, placement, and pricing are confirmed during consultation so the treatment plan matches your anatomy and goals.",
      duration: "45-60 minutes",
      downtime: "Minimal to mild swelling or bruising depending on treatment area",
      heroImage: "/inspo/reception-marble.png",
      heroImagePosition: "left center",
      heroAlt: "Warm marble textures and soft gold lighting for injectable treatments at House of Rose",
    },
    {
      id: "svc-procell",
      slug: "procell-microchanneling",
      name: "ProCell Microchanneling",
      description:
        "A regenerative skin treatment for clients who want smoother texture, stronger glow, and a more refined surface quality.",
      highlight: "Collagen-forward renewal with visible luminosity",
      promise:
        "ProCell is designed for skin that needs more than a facial and less than an aggressive reset, delivering a fresher, healthier-looking finish with minimal disruption.",
      details:
        "At House of Rose, microchanneling is approached as a skin-quality treatment rather than a trendy add-on. We assess tone, texture, pores, scarring, and recovery preferences to create a protocol that supports collagen production while keeping the experience comfortable and intentional.",
      benefits: [
        "Refines texture and supports a smoother-looking complexion",
        "Softens the appearance of acne scarring, fine lines, and enlarged pores",
        "Improves overall radiance without a lengthy recovery window",
      ],
      idealFor: [
        "Clients focused on texture, clarity, and glow",
        "Those preparing for events, photos, or a long-term skin reset",
        "Guests who want results-driven skin treatment without looking overtreated",
      ],
      approach: [
        "Customized assessment of skin condition and goals",
        "Targeted microchanneling paired with regenerative topical support",
        "Aftercare guidance designed to protect results and recovery",
      ],
      results: [
        "A smoother, brighter, more polished skin finish",
        "Healthier-looking tone and improved visual clarity over time",
        "An elevated glow that still feels like your skin",
      ],
      consultationNote:
        "Treatment cadence, home-care recommendations, and any pairing with additional regenerative services are tailored during consultation.",
      duration: "60 minutes",
      downtime: "24-72 hours of redness depending on intensity and skin sensitivity",
      heroImage: "/inspo/treatment-gold.png",
      heroImagePosition: "left center",
      heroAlt: "Softly lit treatment room atmosphere for skin renewal appointments at House of Rose",
    },
    {
      id: "svc-permanent-makeup",
      slug: "permanent-makeup",
      name: "Permanent Makeup",
      description:
        "Soft-definition cosmetic tattooing for brows and lips that makes everyday beauty feel more effortless.",
      highlight: "Face-framing detail work with refined finish",
      promise:
        "Permanent makeup at House of Rose is for clients who want to wake up looking composed, balanced, and naturally finished without relying on a full daily routine.",
      details:
        "The process starts with facial balance, undertone, shape, and lifestyle in mind. We take a tailored approach to pigment and placement so the finished result enhances your features with softness and intention rather than reading harsh or heavily tattooed.",
      benefits: [
        "Creates definition while keeping the result elegant and believable",
        "Reduces the need for daily brow or lip makeup",
        "Supports symmetry and polish in a way that still feels understated",
      ],
      idealFor: [
        "Clients who want a more effortless morning routine",
        "Guests seeking subtle enhancement rather than dramatic cosmetic tattooing",
        "Anyone who values precision, symmetry, and long-wear beauty",
      ],
      approach: [
        "Face mapping and shape design before any pigment placement",
        "Customized color selection based on undertone and finish preference",
        "Healing guidance and refinement planning for long-term wear",
      ],
      results: [
        "Brows or lips that look softly finished from the moment you wake up",
        "Greater definition without daily product layering",
        "An elegant enhancement that supports your natural features",
      ],
      consultationNote:
        "Shape, pigment family, and touch-up timing are confirmed during consultation to keep the final result aligned with your features and preferences.",
      duration: "120-150 minutes",
      downtime: "Mild tenderness and flaking during the initial healing window",
      heroImage: "/inspo/reception-white.png",
      heroImagePosition: "center center",
      heroAlt: "Refined treatment suite prepared for permanent makeup appointments at House of Rose",
    },
    {
      id: "svc-permanent-jewelry",
      slug: "permanent-jewelry",
      name: "Permanent Jewelry",
      description:
        "An elevated styling experience for clasp-free fine chains fitted with intention and worn every day.",
      highlight: "Custom-fit adornment with signature polish",
      promise:
        "Permanent jewelry is designed for clients who want a subtle luxury detail that feels personal, wearable, and quietly distinctive.",
      details:
        "This is less about novelty and more about refinement. You choose the chain profile, finish, and fit, then we complete the piece with precision so it wears like part of your personal style rather than an occasional accessory.",
      benefits: [
        "Creates a timeless, always-on styling detail",
        "Makes layering effortless for wrists and ankles",
        "Works beautifully for milestones, gifting, and matching sets",
      ],
      idealFor: [
        "Clients who love understated luxury details",
        "Friends, partners, or family booking a shared experience",
        "Guests who want jewelry that feels easy, personal, and modern",
      ],
      approach: [
        "Chain and finish selection based on your style direction",
        "Precise fit so the piece feels effortless in everyday wear",
        "A polished, in-studio experience with a celebratory feel",
      ],
      results: [
        "Jewelry that becomes part of your everyday signature",
        "A custom-fit finish with no clasp bulk or interruption",
        "A luxe but low-maintenance style statement",
      ],
      consultationNote:
        "Chain options, fit, and occasion-based styling recommendations are finalized during the appointment experience.",
      duration: "20-30 minutes",
      downtime: "None",
      heroImage: "/inspo/refreshment-corner.png",
      heroImagePosition: "center center",
      heroAlt: "A softly styled hospitality corner reflecting the permanent jewelry experience at House of Rose",
    },
    {
      id: "svc-prp",
      slug: "prp-rejuvenation",
      name: "PRP Rejuvenation",
      description:
        "Regenerative aesthetic support that uses your body’s own growth factors to encourage renewal in a precise, clinically guided way.",
      highlight: "Biologic renewal for skin and hair-focused goals",
      promise:
        "PRP is ideal for clients who want a more regenerative path to rejuvenation, especially when texture, vitality, or restoration is the priority.",
      details:
        "At House of Rose, PRP is approached with a high-touch clinical lens. We review your concerns, treatment history, and candidacy to determine whether platelet-rich plasma is best used alone or alongside other services to support healthier-looking skin or hair.",
      benefits: [
        "Supports regenerative improvement using your own biologic material",
        "Pairs well with select texture and renewal-focused protocols",
        "Offers a natural-feeling path to revitalization",
      ],
      idealFor: [
        "Clients interested in regenerative aesthetics",
        "Those wanting support for skin quality or hair-focused concerns",
        "Guests seeking a treatment path that feels clinically grounded and individualized",
      ],
      approach: [
        "Assessment of candidacy and desired treatment outcomes",
        "Personalized PRP protocol with attention to comfort and pairing opportunities",
        "Follow-up guidance based on expected response and recovery",
      ],
      results: [
        "Skin or hair-focused support rooted in regenerative care",
        "A treatment plan that feels bespoke and medically considered",
        "Improvement that builds with time rather than looking sudden or artificial",
      ],
      consultationNote:
        "Whether PRP should be performed alone or paired with another treatment is determined during consultation based on candidacy and goals.",
      duration: "60 minutes",
      downtime: "Mild post-treatment sensitivity depending on application area",
      heroImage: "/inspo/lounge-hero.png",
      heroImagePosition: "center 72%",
      heroAlt: "Soft lounge-inspired atmosphere representing regenerative aesthetic care at House of Rose",
    },
    {
      id: "svc-glp1",
      slug: "glp-1-wellness",
      name: "GLP-1 Wellness",
      description:
        "Medical weight and wellness support with thoughtful oversight, accountability, and a plan that respects real life.",
      highlight: "Structured wellness guidance with provider oversight",
      promise:
        "For clients seeking body-composition support in a more elevated and medically supervised setting, GLP-1 wellness is built around clarity, consistency, and long-term sustainability.",
      details:
        "This is not a rushed prescription visit. We look at goals, screening, habits, timelines, and the level of support you need in order to create a wellness plan that feels realistic, clinically appropriate, and aligned with your lifestyle.",
      benefits: [
        "Connects medication support with real accountability and follow-through",
        "Offers structured oversight instead of a transactional program",
        "Keeps the experience personalized, private, and easy to navigate",
      ],
      idealFor: [
        "Clients wanting medically supervised body-composition support",
        "Those who value accountability and a more concierge-style experience",
        "Guests looking for a sustainable wellness path rather than a quick fix",
      ],
      approach: [
        "Screening and candidacy review before any recommendations are made",
        "A personalized plan that combines medical support with practical guidance",
        "Check-ins designed to keep momentum realistic and sustainable",
      ],
      results: [
        "A clearer, more supported wellness journey",
        "Greater confidence in the structure of your treatment plan",
        "Progress guided by medical oversight rather than guesswork",
      ],
      consultationNote:
        "Medication candidacy, monitoring cadence, and pricing are reviewed during consultation after an appropriate wellness assessment.",
      duration: "30-45 minutes initial consult",
      downtime: "None",
      heroImage: "/inspo/reception-marble.png",
      heroImagePosition: "center 40%",
      heroAlt: "Warm hospitality-focused setting for wellness consultations at House of Rose",
    },
    {
      id: "svc-hydration",
      slug: "hydration-therapy",
      name: "Hydration Therapy",
      description:
        "A restorative wellness treatment designed to help you feel replenished, reset, and better supported for the demands of everyday life.",
      highlight: "Lounge-style recovery with intentional wellness support",
      promise:
        "Hydration therapy at House of Rose is for clients who want more than convenience. The experience is designed to feel restorative, polished, and thoughtfully tailored to how you want to feel afterward.",
      details:
        "Whether you are recovering, traveling, preparing for an event, or simply trying to get ahead of depletion, we tailor hydration support around the moment you are in. The setting remains calm and comfortable, with a boutique atmosphere that turns a wellness appointment into genuine reset time.",
      benefits: [
        "Supports fluid replenishment and overall recovery",
        "Offers a polished wellness reset before events, travel, or busy weeks",
        "Delivers supportive care in a calm lounge environment",
      ],
      idealFor: [
        "Clients needing a restorative wellness appointment",
        "Guests preparing for travel, events, or recovery days",
        "Anyone who wants supportive care in a more luxurious environment",
      ],
      approach: [
        "Selection of hydration support based on current needs and goals",
        "Comfort-first treatment experience in a calming setting",
        "Guidance on how the session fits into broader wellness routines",
      ],
      results: [
        "A more replenished, clear, supported feeling after treatment",
        "A wellness experience that feels both useful and indulgent",
        "A calmer return to the rest of your day",
      ],
      consultationNote:
        "Hydration options and candidacy are reviewed at the appointment so recommendations remain appropriate and personalized.",
      duration: "45-60 minutes",
      downtime: "None",
      heroImage: "/inspo/lounge-hero.png",
      heroImagePosition: "center 72%",
      heroAlt: "Comfort-led hydration therapy atmosphere at House of Rose",
    },
  ],
  about: {
    heading: "An aesthetics experience designed to feel as elevated as the result.",
    description:
      "House of Rose blends medical aesthetics, skin-quality expertise, and boutique hospitality into a guest journey that feels deeply personalized from the first conversation onward. Every treatment recommendation is shaped around balance, longevity, comfort, and tasteful results.",
    credentials: [
      "Consultation-first care tailored to goals, lifestyle, and anatomy",
      "Natural-looking outcomes guided by restraint and clinical precision",
      "A private, polished environment that makes every visit feel considered",
    ],
  },
  testimonials: [
    {
      id: "t1",
      quote:
        "Everything felt intentional, from the consultation to the final result. I looked fresher, softer, and still completely like myself.",
      author: "House of Rose client",
      treatment: "Injectables",
    },
    {
      id: "t2",
      quote:
        "My skin looked brighter, smoother, and more expensive in the best way. It felt like real treatment planning, not a rushed appointment.",
      author: "House of Rose client",
      treatment: "ProCell Microchanneling",
    },
    {
      id: "t3",
      quote:
        "The studio feels calm and elevated, and the care feels personal. It is the first place that made aesthetics feel luxurious and trustworthy at the same time.",
      author: "House of Rose client",
      treatment: "Concierge Experience",
    },
  ],
  faqs: [
    {
      id: "f1",
      question: "Do I need a consultation before treatment?",
      answer:
        "Yes. House of Rose is consultation led. Every treatment begins with a review of goals, candidacy, timing, and the level of refinement you want so recommendations stay personalized and clinically appropriate.",
    },
    {
      id: "f2",
      question: "Will I know pricing before committing?",
      answer:
        "Yes. Final treatment recommendations and pricing are reviewed once your consultation clarifies what is appropriate for your features, goals, and maintenance preferences. Select package signals may also appear from Medusa when available.",
    },
    {
      id: "f3",
      question: "How natural are the results?",
      answer:
        "The guiding standard is polished, balanced, and never overdone. House of Rose prioritizes tasteful outcomes that look believable in daily life, close conversation, and photos.",
    },
  ],
  contact: {
    phone: "(941) 000-0000",
    email: "concierge@houseofrose.com",
    addressLine1: "House of Rose",
    addressLine2: "Punta Gorda, FL",
    hours: "Monday through Saturday by appointment",
  },
  seo: {
    title: "House of Rose | Luxury Med Spa in Punta Gorda, FL",
    description:
      "House of Rose is a boutique aesthetics and wellness studio in Punta Gorda, Florida offering injectables, ProCell microchanneling, permanent makeup, permanent jewelry, PRP rejuvenation, GLP-1 wellness, and hydration therapy.",
  },
};
