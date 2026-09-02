/**
 * Public, client-facing content for each House of Rose IV bag.
 *
 * Names and durations come from the verified GlossGenius menu in
 * `ivHydrationFacts.ts`. Ingredient lists come from the practice's IV bag
 * reference (docs/GOVERNANCE/internal_only/services/Diana/Diana_services/ivHydration.md).
 *
 * Boundaries that every string here respects:
 * - No pricing. Ever. "Ask about current pricing when you call."
 * - No disease, cure, prevention, or guaranteed-result claims.
 * - Every practitioner mention carries a license type (§ 456.072(1)(t)).
 * - Prescription medications are named factually, never promoted.
 */
import { VERIFIED_IV_MENU, type VerifiedIvMenuItem } from '@/lib/ivHydrationFacts';
import type { ServiceFaq } from '@/lib/ivHydrationLanding';

export type IvDripSlug =
  | 'hydration-iv'
  | 'immunity-iv'
  | 'recovery-iv'
  | 'beauty-glow-iv'
  | 'reboot-iv'
  | 'myers-cocktail-iv';

export interface IvIngredient {
  readonly name: string;
  /** What the ingredient is and the role it plays in the bag. Plain language, no claims. */
  readonly role: string;
}

export interface IvExpectationStep {
  readonly title: string;
  readonly text: string;
}

export interface IvDripAlternative {
  readonly slug: IvDripSlug;
  /** Completes the sentence "Consider this instead if…" */
  readonly when: string;
}

export interface IvDripContent {
  readonly slug: IvDripSlug;
  /** Exact GlossGenius service name. */
  readonly name: string;
  /** Short name used in navigation and cross-links. */
  readonly shortName: string;
  readonly durationMinutes: number;
  readonly metaTitle: string;
  readonly metaDescription: string;
  /** One line under the H1. */
  readonly tagline: string;
  /** Section 1 — what the drip is. */
  readonly whatItIs: readonly string[];
  /** Section 2 — what is in the bag. */
  readonly ingredients: readonly IvIngredient[];
  /** Section 3 — what it helps with, phrased as reasons clients book it. */
  readonly helpsWith: readonly string[];
  /** Section 4 — what the visit is like. */
  readonly expectations: readonly IvExpectationStep[];
  /** Section 5 — decision support: fits well when… */
  readonly goodFitWhen: readonly string[];
  /** Section 5 — decision support: talk with the nurse first when… */
  readonly talkFirstWhen: readonly string[];
  /** Section 6 — alternatives inside the House of Rose menu. */
  readonly alternatives: readonly IvDripAlternative[];
  /** Section 7 — FAQ. */
  readonly faqs: readonly ServiceFaq[];
}

/** Decision-guide entry rendered on the IV hub page. */
export interface IvDecisionGuideEntry {
  readonly goal: string;
  readonly detail: string;
  readonly slug: IvDripSlug;
}

export const IV_DRIP_BASE_PATH = '/services/iv-hydration-therapy';

export const ivDripPath = (slug: IvDripSlug): string => `${IV_DRIP_BASE_PATH}/${slug}/`;

const menuItem = (name: VerifiedIvMenuItem['name']): VerifiedIvMenuItem => {
  const item = VERIFIED_IV_MENU.find((entry) => entry.name === name);
  if (!item) throw new Error(`[ivDripContent] "${name}" is not on the verified IV menu`);
  return item;
};

const PROVIDER = 'Diana Morrison, RN';
const MEDICAL_DIRECTOR = 'Medical Director: Joshua Shaw, MD · FL Lic. ME136232';

/** Shared, plainly stated boundaries. Rendered on every drip page. */
export const IV_DRIP_STANDARD_NOTES = {
  provider: `${PROVIDER} provides every IV at House of Rose under written physician protocol and medical direction. ${MEDICAL_DIRECTOR}.`,
  screening:
    'Before your first infusion you complete a short health history and a telehealth clearance. Some health conditions, medications, and pregnancy mean an IV is not the right choice, and Diana Morrison, RN will tell you so plainly.',
  notMedicalCare:
    'IV therapy at House of Rose is a wellness service, not a substitute for medical care. If you are severely dehydrated, cannot keep fluids down, or feel unwell in a way that worries you, seek medical attention first.',
  compounding:
    'The vitamins, minerals, and amino acids used in these IVs are prepared by a licensed compounding pharmacy. Compounded products are not reviewed by the FDA for safety or effectiveness, and these statements have not been evaluated by the FDA. Results and how you feel afterward vary from person to person.',
  pricing: 'Ask about current pricing when you call.',
} as const;

const SHARED_EXPECTATIONS = {
  arrive: {
    title: 'Arrive and settle in',
    text: 'You check in, review your health history with Diana Morrison, RN, and get comfortable in the IV suite. Eat something and drink water beforehand; veins are easier to access when you are not running on empty.',
  },
  placement: {
    title: 'A single small catheter',
    text: 'A small, flexible catheter is placed in a vein in your arm or hand. It feels like a quick pinch. Once it is in, the needle is gone and only the soft catheter stays for the infusion.',
  },
  finish: {
    title: 'Finish and go',
    text: 'The catheter comes out, the site gets a small dressing, and you are free to drive and get on with your day. There is no downtime.',
  },
} as const;

const SHARED_TALK_FIRST: readonly string[] = [
  'You have kidney disease, heart failure, or liver disease — fluid and mineral loads matter more for you.',
  'You are pregnant or breastfeeding.',
  'You take prescription medication daily; some interact with the minerals or medications in an IV.',
  'You have a known allergy to any vitamin, mineral, or preservative.',
];

const hydrationMenu = menuItem('Hydration IV');
const immunityMenu = menuItem('Immunity IV');
const recoveryMenu = menuItem('Recovery IV');
const beautyGlowMenu = menuItem('Beauty Glow IV');
const rebootMenu = menuItem('Reboot (Hangover Recovery) IV');
const myersMenu = menuItem("Myers' Cocktail IV");

export const IV_DRIPS: readonly IvDripContent[] = [
  {
    slug: 'hydration-iv',
    name: hydrationMenu.name,
    shortName: 'Hydration',
    durationMinutes: hydrationMenu.durationMinutes,
    metaTitle: 'Hydration IV in Punta Gorda | House of Rose Aesthetics',
    metaDescription:
      'A 30-minute fluid and electrolyte IV provided by Diana Morrison, RN at House of Rose in Punta Gorda, FL. What is in it, who books it, and what to expect.',
    tagline: 'Fluid and electrolytes, straight in. The fastest visit on the menu.',
    whatItIs: [
      'The Hydration IV is the foundation every other bag is built on: sterile fluid with electrolytes, delivered directly into a vein over about 30 minutes. No vitamin blend, no medication — just the volume your body uses to do everything else.',
      'Drinking water works through the digestive tract and takes time. An IV bypasses that route entirely, so the fluid is in circulation as it drips. That is the whole appeal: after a long flight, a day on the water in August, a hard workout, or a stretch of not looking after yourself, it is a quick way to catch up.',
      'Because there is nothing else in the bag, it is also the simplest place to add one thing you actually want. House of Rose offers IV add-ons including vitamin C, B12, biotin, magnesium, glutathione, and NAD+; availability is confirmed when you call.',
    ],
    ingredients: [
      {
        name: 'Sterile IV fluid',
        role: 'Normal saline or lactated Ringer’s: water with sodium and chloride balanced to match your blood, so it moves into circulation without pulling water out of your cells.',
      },
      {
        name: 'Electrolytes',
        role: 'Sodium, chloride, and, in lactated Ringer’s, potassium and calcium. These are the minerals your body loses through sweat and uses to hold fluid where it belongs.',
      },
    ],
    helpsWith: [
      'Rehydrating after travel, heat, sun, or a long day outdoors in Southwest Florida',
      'Catching up after a workout, a race, or a physically demanding week',
      'Feeling headachy, sluggish, or dry-mouthed from simply not drinking enough',
      'A quick reset before or after an event when you are short on time',
      'A clean base for a single add-on such as B12, magnesium, or glutathione',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 30 minutes in the chair',
        text: 'The fluid runs at a steady pace. Most people feel cool at the IV site and nothing else. Bring headphones or a book; this is the shortest IV visit at House of Rose.',
      },
      SHARED_EXPECTATIONS.finish,
    ],
    goodFitWhen: [
      'You mainly want fluid, fast, and you are otherwise feeling fine',
      'You are short on time and want the 30-minute option',
      'You want to try IV therapy for the first time without a full vitamin blend',
      'You want a base bag to pair with one specific add-on',
    ],
    talkFirstWhen: SHARED_TALK_FIRST,
    alternatives: [
      { slug: 'reboot-iv', when: 'you are nauseated or hungover and fluid alone will not cut it.' },
      { slug: 'recovery-iv', when: 'you trained hard and want amino acids and magnesium along with the fluid.' },
      { slug: 'myers-cocktail-iv', when: 'you want the broad vitamin-and-mineral blend rather than fluid only.' },
    ],
    faqs: [
      {
        question: 'How much fluid is in a Hydration IV?',
        answer: 'The volume is set by the written physician protocol and reviewed by Diana Morrison, RN based on your health history, size, and the reason for your visit. Ask at your appointment and she will tell you exactly what you are receiving.',
      },
      {
        question: 'Is a Hydration IV better than drinking water?',
        answer: 'It is faster, not magic. For everyday hydration, water works. An IV makes sense when you are behind and want to catch up quickly, or when you have not been able to keep fluids down.',
      },
      {
        question: 'Can I add vitamins to the Hydration IV?',
        answer: 'Yes. House of Rose offers add-ons including vitamin C, B12, biotin, magnesium, glutathione, and NAD+. Availability and what makes sense for you are confirmed when you call.',
      },
      {
        question: 'How long does a Hydration IV take?',
        answer: 'Plan on about 30 minutes for the infusion plus a few minutes to check in. It is the shortest IV visit House of Rose offers.',
      },
      {
        question: 'How often can I get a Hydration IV?',
        answer: 'That depends on why you want it. Diana Morrison, RN sets timing with you based on your health history and the reason for the visit rather than a fixed schedule.',
      },
    ],
  },
  {
    slug: 'immunity-iv',
    name: immunityMenu.name,
    shortName: 'Immunity',
    durationMinutes: immunityMenu.durationMinutes,
    metaTitle: 'Immunity IV in Punta Gorda | House of Rose Aesthetics',
    metaDescription:
      'Vitamin C, zinc, B-complex, and magnesium in a 45-minute IV provided by Diana Morrison, RN at House of Rose in Punta Gorda, FL. Ingredients and who books it.',
    tagline: 'Vitamin C, zinc, B vitamins, and magnesium: the nutrients your immune system runs on.',
    whatItIs: [
      'The Immunity IV pairs hydration with the vitamins and minerals most closely tied to normal immune function: a high dose of vitamin C, zinc, a full B-complex, and magnesium. Delivered by IV, they reach your bloodstream at levels that oral supplements cannot match.',
      'It is the bag people book when the season turns, when the kids bring something home from school, when they are about to fly, or when they have been running on too little sleep and want to give their body what it needs to keep up.',
      'Be clear-eyed about what it is: nutritional support for a system that is already doing its job, not a shield and not a treatment for an illness you already have. If you are sick, see your doctor first.',
    ],
    ingredients: [
      {
        name: 'Vitamin C (ascorbic acid)',
        role: 'A water-soluble antioxidant your body cannot make on its own. It contributes to normal immune cell function and helps protect cells from oxidative stress.',
      },
      {
        name: 'Zinc',
        role: 'A trace mineral involved in the development and activity of immune cells. Zinc is common in food but easy to run low on during stress, illness, or a restrictive diet.',
      },
      {
        name: 'B-complex vitamins',
        role: 'B1, B2, B3, B5, and B6. These help your cells turn food into usable energy, which is why running low tends to feel like fatigue.',
      },
      {
        name: 'Magnesium',
        role: 'A mineral involved in hundreds of enzyme reactions, including nerve and muscle function. Many people are lower than they think.',
      },
      {
        name: 'Sterile IV fluid',
        role: 'The hydration base that carries the nutrients and helps you feel better in its own right.',
      },
    ],
    helpsWith: [
      'Supporting your body during cold and flu season or after exposure',
      'Before and after travel, especially flights and crowded events',
      'Periods of high stress, poor sleep, or heavy workloads',
      'Nutritional support when your diet has slipped',
      'Feeling run-down without a clear reason',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 45 minutes in the chair',
        text: 'Higher-dose vitamin C is infused at a measured pace. Some people notice a faint metallic taste or a cool feeling along the arm, both of which pass. Magnesium can bring a brief wave of warmth.',
      },
      SHARED_EXPECTATIONS.finish,
    ],
    goodFitWhen: [
      'You want nutritional support ahead of travel, a busy season, or a known exposure',
      'You feel depleted and want the vitamins and hydration together',
      'You are looking for a repeatable wellness visit rather than a one-time fix',
    ],
    talkFirstWhen: [
      ...SHARED_TALK_FIRST,
      'You have G6PD deficiency or a history of kidney stones; high-dose vitamin C is not appropriate for everyone.',
      'You are currently sick with fever, vomiting, or trouble breathing — that is a call to your doctor, not an IV appointment.',
    ],
    alternatives: [
      { slug: 'myers-cocktail-iv', when: 'you want the broader mix with B12 and calcium instead of zinc.' },
      { slug: 'hydration-iv', when: 'you mostly want fluid and would rather add a single vitamin.' },
      { slug: 'recovery-iv', when: 'the drain is physical — training, heat, or exertion — rather than seasonal.' },
    ],
    faqs: [
      {
        question: 'Will the Immunity IV keep me from getting sick?',
        answer: 'No IV can promise that. The Immunity IV supplies vitamin C, zinc, B vitamins, magnesium, and fluid, which are nutrients your immune system relies on to function normally. Sleep, hand-washing, and vaccination remain the things that actually reduce your odds.',
      },
      {
        question: 'Can I get an Immunity IV when I am already sick?',
        answer: 'If you have a fever, cannot keep fluids down, or feel seriously unwell, see your doctor first. If you are mildly run-down and cleared to proceed, Diana Morrison, RN will review your symptoms before starting.',
      },
      {
        question: 'How much vitamin C is in it?',
        answer: 'The dose is set by the written physician protocol and confirmed by Diana Morrison, RN based on your health history. Ask at your visit and she will tell you exactly what is in your bag.',
      },
      {
        question: 'What does the Immunity IV feel like?',
        answer: 'Mostly nothing. A cool sensation at the IV site is common, some people notice a brief metallic taste from the vitamin C, and magnesium can cause a short flush of warmth. All of it passes.',
      },
      {
        question: 'How is the Immunity IV different from the Myers’ Cocktail?',
        answer: 'Both include vitamin C, B-complex, and magnesium. The Immunity IV adds zinc and leans on a higher vitamin C dose; the Myers’ Cocktail adds B12 and calcium for a broader general-wellness blend.',
      },
    ],
  },
  {
    slug: 'recovery-iv',
    name: recoveryMenu.name,
    shortName: 'Recovery',
    durationMinutes: recoveryMenu.durationMinutes,
    metaTitle: 'Recovery IV in Punta Gorda | House of Rose Aesthetics',
    metaDescription:
      'Amino acids, magnesium, B-complex, and vitamin C in a 45-minute IV provided by Diana Morrison, RN at House of Rose in Punta Gorda, FL. Built for exertion.',
    tagline: 'Amino acids, magnesium, and B vitamins for the days your body has been asked for a lot.',
    whatItIs: [
      'The Recovery IV is built for exertion: the marathon, the tournament weekend, the two-a-days, the day spent hauling in the Florida heat. It combines fluid with a blend of amino acids, magnesium, a full B-complex, and antioxidant vitamin C.',
      'Amino acids are the building blocks of muscle protein. Magnesium is the mineral your muscles use to relax after they contract. B vitamins help turn what you eat into energy. Delivered together, with fluid and electrolytes, they replace what hard effort uses up.',
      'It does not replace sleep, food, or a proper cool-down, and it will not make a sore muscle un-sore on the spot. What it does is give a tired body the raw material it is looking for, faster than a meal and a lot of water.',
    ],
    ingredients: [
      {
        name: 'Amino acid blend',
        role: 'Protein building blocks your muscles use for repair. Supplied directly rather than through digestion.',
      },
      {
        name: 'Magnesium',
        role: 'The mineral behind muscle relaxation and nerve signaling. Heavy sweating drains it, and low magnesium is one reason muscles cramp.',
      },
      {
        name: 'B-complex vitamins',
        role: 'B1, B2, B3, B5, and B6, the cofactors your cells use to convert carbohydrates, fats, and protein into energy.',
      },
      {
        name: 'Vitamin C (ascorbic acid)',
        role: 'An antioxidant that helps buffer the oxidative stress hard exercise creates.',
      },
      {
        name: 'Sterile IV fluid and electrolytes',
        role: 'The hydration base that replaces what you sweated out.',
      },
    ],
    helpsWith: [
      'Rehydrating and refueling after endurance events, races, or tournaments',
      'Heavy training blocks and back-to-back workouts',
      'Long, physical days in the heat — boating, fishing, yard work, job sites',
      'Muscle fatigue and cramping tied to sweat loss',
      'Getting back to normal after a physically demanding week',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 45 minutes in the chair',
        text: 'The blend runs at a steady pace while you rest. Magnesium can bring a brief wave of warmth, and some people feel their muscles loosen as it goes in. Many use the time to simply sit still, which is its own form of recovery.',
      },
      SHARED_EXPECTATIONS.finish,
    ],
    goodFitWhen: [
      'Your fatigue is physical — you trained, raced, or worked hard and feel it',
      'You cramp easily or sweat heavily',
      'You want hydration plus nutrients rather than fluid alone',
      'You are planning around an event and want the visit on the other side of it',
    ],
    talkFirstWhen: [
      ...SHARED_TALK_FIRST,
      'You have a heart rhythm condition; magnesium and electrolytes need a closer look.',
      'You are recovering from heat exhaustion with confusion, fainting, or a very high temperature — that is emergency care, not an IV visit.',
    ],
    alternatives: [
      { slug: 'hydration-iv', when: 'you just need fluid and you are short on time.' },
      { slug: 'reboot-iv', when: 'the problem is nausea and a headache after a night out rather than a workout.' },
      { slug: 'myers-cocktail-iv', when: 'you want a general vitamin-and-mineral blend rather than an exertion-focused one.' },
    ],
    faqs: [
      {
        question: 'Should I get the Recovery IV before or after an event?',
        answer: 'Most clients book it after, when the body is actually depleted. Some book a Hydration IV beforehand. Diana Morrison, RN can help you decide based on the event and your training.',
      },
      {
        question: 'Will it stop muscle soreness?',
        answer: 'Not on the spot. Soreness is a normal repair process. The Recovery IV supplies fluid, amino acids, magnesium, and B vitamins that support that process; it does not switch it off.',
      },
      {
        question: 'Is the amino acid blend the same as a protein shake?',
        answer: 'Same idea, different route. A shake has to be digested first. IV amino acids go straight into circulation. Neither replaces eating a real meal after hard effort.',
      },
      {
        question: 'Can I work out the same day?',
        answer: 'Yes. There is no downtime. Give the IV site a couple of hours before heavy lifting with that arm and keep it clean and dry.',
      },
      {
        question: 'How is the Recovery IV different from the Reboot IV?',
        answer: 'Recovery is for exertion: amino acids, magnesium, B vitamins, and vitamin C. Reboot is for hangover symptoms: fluid, B vitamins, and prescription anti-nausea and anti-inflammatory medication under physician protocol.',
      },
    ],
  },
  {
    slug: 'beauty-glow-iv',
    name: beautyGlowMenu.name,
    shortName: 'Beauty Glow',
    durationMinutes: beautyGlowMenu.durationMinutes,
    metaTitle: 'Beauty Glow IV in Punta Gorda | House of Rose Aesthetics',
    metaDescription:
      'Glutathione, vitamin C, and biotin in a 45-minute IV provided by Diana Morrison, RN at House of Rose in Punta Gorda, FL. Skin, hair, and nails, from the inside.',
    tagline: 'Glutathione, vitamin C, and biotin. Skin, hair, and nails, supported from the inside.',
    whatItIs: [
      'The Beauty Glow IV is the skin-and-hair bag. It delivers three nutrients tied to how skin, hair, and nails are built and protected: glutathione, vitamin C, and biotin, carried in hydrating fluid.',
      'Vitamin C is a required cofactor for collagen synthesis, the protein that gives skin its structure. Biotin supports keratin, the protein hair and nails are made of. Glutathione is the body’s primary intracellular antioxidant, working against the oxidative stress that sun, stress, and age put on skin.',
      'It is the IV clients book alongside skin treatments at House of Rose, or in the run-up to a wedding, a photo shoot, or a season of being seen. Think of it as nutritional support for the skin you are already investing in, rather than a treatment on its own.',
    ],
    ingredients: [
      {
        name: 'Glutathione',
        role: 'A tripeptide antioxidant made of three amino acids. Your cells produce it, and levels fall with age, stress, and sun exposure. It helps neutralize free radicals inside the cell.',
      },
      {
        name: 'Vitamin C (ascorbic acid)',
        role: 'Required for collagen production and a water-soluble antioxidant in its own right. Delivered by IV it reaches blood levels oral vitamin C cannot.',
      },
      {
        name: 'Biotin (vitamin B7)',
        role: 'A B vitamin involved in keratin production, the structural protein in hair and nails.',
      },
      {
        name: 'Sterile IV fluid',
        role: 'The hydration base. Well-hydrated skin simply looks better, and this is the fastest way to get there.',
      },
    ],
    helpsWith: [
      'Nutritional support for skin, hair, and nails',
      'Pairing with Procell microchanneling, Morpheus8, or a facial series',
      'The weeks before a wedding, event, or photo shoot',
      'Skin that feels dull, dry, or tired after sun and travel',
      'Antioxidant support during periods of high stress',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 45 minutes in the chair',
        text: 'The vitamin C and biotin infuse first, then the glutathione. Some people notice a faint metallic taste from the vitamin C. Otherwise it is a quiet 45 minutes.',
      },
      SHARED_EXPECTATIONS.finish,
    ],
    goodFitWhen: [
      'Your goal is skin, hair, and nail support rather than energy or recovery',
      'You are already in a skin-treatment series and want to support it from the inside',
      'You have an event on the calendar and want to start a few weeks ahead',
      'You want an antioxidant-forward IV',
    ],
    talkFirstWhen: [
      ...SHARED_TALK_FIRST,
      'You have asthma; a small number of people react to glutathione with wheezing.',
      'You have G6PD deficiency or a history of kidney stones; high-dose vitamin C is not appropriate for everyone.',
    ],
    alternatives: [
      { slug: 'myers-cocktail-iv', when: 'you want general wellness support more than skin-specific nutrients.' },
      { slug: 'hydration-iv', when: 'you mainly want hydration and would add glutathione or biotin as a single add-on.' },
      { slug: 'immunity-iv', when: 'you are feeling depleted and want zinc and a higher vitamin C dose.' },
    ],
    faqs: [
      {
        question: 'Will one Beauty Glow IV change how my skin looks?',
        answer: 'One infusion hydrates you and delivers the nutrients; most clients who book it for skin do so as a series alongside their treatment plan. Results vary from person to person and no outcome is guaranteed.',
      },
      {
        question: 'Does the Beauty Glow IV lighten skin?',
        answer: 'House of Rose does not offer glutathione for skin lightening and does not make that claim. Glutathione is included here as an antioxidant.',
      },
      {
        question: 'Can I get the Beauty Glow IV the same day as a skin treatment?',
        answer: 'Often, yes. Amber Mingione, Licensed Esthetician and Diana Morrison, RN coordinate the order of treatments when you schedule both.',
      },
      {
        question: 'How far ahead of an event should I start?',
        answer: 'Clients planning for an event typically begin a few weeks out. Diana Morrison, RN can map a schedule with you.',
      },
      {
        question: 'Is biotin by IV better than a biotin supplement?',
        answer: 'It reaches your bloodstream directly instead of passing through digestion. Whether that matters for you depends on your diet and goals, which is a conversation worth having at your visit.',
      },
    ],
  },
  {
    slug: 'reboot-iv',
    name: rebootMenu.name,
    shortName: 'Reboot',
    durationMinutes: rebootMenu.durationMinutes,
    metaTitle: 'Reboot Hangover Recovery IV in Punta Gorda | House of Rose Aesthetics',
    metaDescription:
      'Fluid, B vitamins, and prescription anti-nausea and anti-inflammatory medication for hangover symptoms. 45 minutes with Diana Morrison, RN in Punta Gorda, FL.',
    tagline: 'Fluid, B vitamins, and medication for nausea and headache. The morning-after bag.',
    whatItIs: [
      'The Reboot IV is the one you book when last night was a great idea and this morning is not. It goes after the three things that make a hangover miserable — dehydration, nausea, and a pounding head — with rehydrating fluid, B vitamins, and prescription medication.',
      'Alcohol is a diuretic, so you wake up short on fluid and the water-soluble B vitamins that go out with it. The fluid and B-complex replace both. Under the written physician protocol, Diana Morrison, RN can also include ondansetron, a prescription anti-nausea medication, and ketorolac, a prescription non-steroidal anti-inflammatory, so relief does not depend on keeping anything down.',
      'It is relief for hangover symptoms, not a reset button on alcohol. Someone who is confused, cannot be woken, or is vomiting repeatedly needs emergency care, not an IV appointment.',
    ],
    ingredients: [
      {
        name: 'Sterile IV fluid and electrolytes',
        role: 'Normal saline or lactated Ringer’s to replace the fluid volume alcohol pulled out of you overnight.',
      },
      {
        name: 'B-complex vitamins',
        role: 'The water-soluble B vitamins that alcohol depletes. They are part of how your cells make energy.',
      },
      {
        name: 'Ondansetron (prescription anti-nausea medication)',
        role: 'Blocks the signal that triggers nausea and vomiting. Included under physician protocol when nausea is part of the picture.',
      },
      {
        name: 'Ketorolac (prescription anti-inflammatory)',
        role: 'A non-steroidal anti-inflammatory for headache and body aches. Included under physician protocol when appropriate for you.',
      },
    ],
    helpsWith: [
      'Hangover symptoms: dehydration, nausea, headache, and body aches',
      'Getting functional after a wedding weekend, a bachelor or bachelorette trip, or a big night out',
      'Nausea that makes it hard to drink water or eat',
      'A headache that is not responding to what you have at home',
      'Feeling foggy and depleted after too little sleep and too much celebrating',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 45 minutes in the chair',
        text: 'Anti-nausea medication is typically given first so the rest of the bag is comfortable. Fluid and B vitamins follow. Most people feel the nausea ease within the visit and the headache lift as the fluid goes in.',
      },
      {
        title: 'Finish and go',
        text: 'The catheter comes out and the site gets a small dressing. Eat something real, keep drinking water, and get to bed early; the IV is a head start, not the whole recovery.',
      },
    ],
    goodFitWhen: [
      'You are hungover, nauseated, and cannot get water to stay down',
      'You have somewhere to be today and need to function',
      'You want medication for nausea and headache along with the fluid',
    ],
    talkFirstWhen: [
      ...SHARED_TALK_FIRST,
      'You take blood thinners or have a history of stomach ulcers or bleeding; ketorolac may not be appropriate.',
      'You have a heart rhythm condition or take medication that affects heart rhythm; ondansetron needs a closer look.',
      'You are still intoxicated, confused, or vomiting repeatedly — that is emergency care, not an IV visit.',
    ],
    alternatives: [
      { slug: 'hydration-iv', when: 'you are dehydrated but not nauseated and want the quickest option.' },
      { slug: 'recovery-iv', when: 'you are wrecked from physical exertion rather than alcohol.' },
      { slug: 'myers-cocktail-iv', when: 'you want a broad vitamin-and-mineral bag rather than symptom relief.' },
    ],
    faqs: [
      {
        question: 'How fast does the Reboot IV work?',
        answer: 'Most clients feel nausea ease during the visit and the headache lift as the fluid goes in. Everyone is different, and the rest of your recovery still depends on food, water, and sleep.',
      },
      {
        question: 'Do I have to have the medications?',
        answer: 'No. Ondansetron and ketorolac are included under physician protocol when they are appropriate for you and you want them. Diana Morrison, RN reviews your health history and medications first.',
      },
      {
        question: 'Can I book the Reboot IV the same morning?',
        answer: 'Call House of Rose as early as you can. Same-day availability depends on the schedule, and a first-time client also completes a short telehealth clearance before the infusion.',
      },
      {
        question: 'Will the Reboot IV sober me up?',
        answer: 'No. It addresses hangover symptoms after alcohol has left your system. It does not lower blood alcohol, and House of Rose will not treat someone who is still intoxicated.',
      },
      {
        question: 'Is it safe to drive afterward?',
        answer: 'Ondansetron and ketorolac do not typically cause drowsiness, and most clients drive themselves. If you feel lightheaded, take a few extra minutes before you leave.',
      },
    ],
  },
  {
    slug: 'myers-cocktail-iv',
    name: myersMenu.name,
    shortName: "Myers' Cocktail",
    durationMinutes: myersMenu.durationMinutes,
    metaTitle: "Myers' Cocktail IV in Punta Gorda | House of Rose Aesthetics",
    metaDescription:
      "The classic vitamin C, B-complex, B12, magnesium, and calcium IV. 45 minutes with Diana Morrison, RN at House of Rose in Punta Gorda, FL. Ingredients and fit.",
    tagline: 'The original vitamin infusion: vitamin C, B-complex, B12, magnesium, and calcium.',
    whatItIs: [
      'The Myers’ Cocktail is the formula that started IV vitamin therapy. Dr. John Myers, a Baltimore physician, began giving patients a blend of vitamins and minerals by IV in the 1960s and 70s; the version used today was standardized after his death and has been the benchmark general-wellness infusion ever since.',
      'The blend is deliberately broad: vitamin C, the full B-complex, vitamin B12, magnesium, and calcium, in hydrating fluid. Nothing exotic, just the water-soluble vitamins and two key minerals your body uses constantly and cannot store in large amounts.',
      'That breadth is why it is the most-booked IV at practices everywhere. It is the bag for people who feel generally run-down — from work, travel, a busy season, poor sleep, or a diet that has slipped — and want a comprehensive top-up rather than one targeted ingredient.',
    ],
    ingredients: [
      {
        name: 'Vitamin C (ascorbic acid)',
        role: 'A water-soluble antioxidant your body cannot make. Supports normal immune function and collagen production.',
      },
      {
        name: 'B-complex vitamins',
        role: 'B1, B2, B3, B5, and B6, the cofactors your cells use to turn food into energy.',
      },
      {
        name: 'Vitamin B12',
        role: 'Essential for red blood cell formation and nerve function. Common to run low on with age, plant-based diets, or certain medications.',
      },
      {
        name: 'Magnesium',
        role: 'Involved in hundreds of enzyme reactions, muscle relaxation, and nerve signaling. The ingredient responsible for the warm feeling during the infusion.',
      },
      {
        name: 'Calcium',
        role: 'A mineral for muscle contraction and nerve signaling; included to balance the magnesium.',
      },
      {
        name: 'Sterile IV fluid',
        role: 'The hydration base that carries the blend.',
      },
    ],
    helpsWith: [
      'General fatigue and feeling run-down without a single obvious cause',
      'Travel, jet lag, and long stretches of poor sleep',
      'Busy seasons when diet and rest have slipped',
      'A comprehensive vitamin-and-mineral top-up as part of a wellness routine',
      'Clients who want the classic, well-established formula rather than a specialty blend',
    ],
    expectations: [
      SHARED_EXPECTATIONS.arrive,
      SHARED_EXPECTATIONS.placement,
      {
        title: 'About 45 minutes in the chair',
        text: 'The blend runs at a measured pace. Magnesium produces a distinctive spreading warmth, sometimes with a brief flush, that most people describe as pleasant. A faint metallic taste from the vitamin C is common. Both pass.',
      },
      SHARED_EXPECTATIONS.finish,
    ],
    goodFitWhen: [
      'You want the broadest vitamin-and-mineral blend on the menu',
      'You feel generally depleted rather than sick, sore, or hungover',
      'You are building a repeatable wellness routine',
      'You are new to IV therapy and want the standard formula',
    ],
    talkFirstWhen: [
      ...SHARED_TALK_FIRST,
      'You have G6PD deficiency or a history of kidney stones; high-dose vitamin C is not appropriate for everyone.',
      'You take medication for blood pressure or heart rhythm; magnesium and calcium interact with some of them.',
    ],
    alternatives: [
      { slug: 'immunity-iv', when: 'you want zinc and a higher vitamin C dose for a seasonal push.' },
      { slug: 'recovery-iv', when: 'your fatigue comes from training or physical work.' },
      { slug: 'beauty-glow-iv', when: 'skin, hair, and nails are the goal.' },
    ],
    faqs: [
      {
        question: 'What is a Myers’ Cocktail?',
        answer: 'A vitamin and mineral infusion of vitamin C, B-complex, B12, magnesium, and calcium in IV fluid. It is named for Dr. John Myers, the Baltimore physician who pioneered IV nutrient therapy, and it is the most widely used vitamin IV formula.',
      },
      {
        question: 'Why does it feel warm going in?',
        answer: 'That is the magnesium. It relaxes blood vessels as it enters circulation, which produces a spreading warmth and sometimes a brief flush. Diana Morrison, RN controls the rate so it stays comfortable.',
      },
      {
        question: 'How often do people get a Myers’ Cocktail?',
        answer: 'It varies. Some clients book it monthly as part of a wellness routine; others book it around travel or a demanding stretch. Diana Morrison, RN sets timing with you rather than a fixed schedule.',
      },
      {
        question: 'Does the Myers’ Cocktail treat any medical condition?',
        answer: 'House of Rose offers it as wellness support, not as a treatment for any disease. If you are managing a medical condition, keep your physician in the loop.',
      },
      {
        question: 'Can I add glutathione or NAD+ to a Myers’ Cocktail?',
        answer: 'Yes, add-ons can be discussed when you call. Availability and whether they make sense for you are confirmed by Diana Morrison, RN.',
      },
    ],
  },
];

export const IV_DECISION_GUIDE: readonly IvDecisionGuideEntry[] = [
  {
    goal: 'I just need fluid, fast',
    detail: 'Travel, heat, a long day outside, or simply not drinking enough. Thirty minutes, fluid and electrolytes, done.',
    slug: 'hydration-iv',
  },
  {
    goal: 'I feel run-down and want a full top-up',
    detail: 'General fatigue without one obvious cause. The broadest blend on the menu: vitamin C, B-complex, B12, magnesium, and calcium.',
    slug: 'myers-cocktail-iv',
  },
  {
    goal: 'The season is turning and I keep getting exposed',
    detail: 'Vitamin C, zinc, B vitamins, and magnesium: the nutrients normal immune function depends on.',
    slug: 'immunity-iv',
  },
  {
    goal: 'I trained, raced, or worked hard and I feel it',
    detail: 'Amino acids, magnesium, and B vitamins with fluid, built for exertion and heavy sweat loss.',
    slug: 'recovery-iv',
  },
  {
    goal: 'Skin, hair, and nails are the goal',
    detail: 'Glutathione, vitamin C, and biotin. The bag clients pair with skin treatments and pre-event plans.',
    slug: 'beauty-glow-iv',
  },
  {
    goal: 'Last night was a great idea and this morning is not',
    detail: 'Fluid, B vitamins, and prescription anti-nausea and anti-inflammatory medication under physician protocol.',
    slug: 'reboot-iv',
  },
];

export const getIvDrip = (slug: string): IvDripContent | undefined =>
  IV_DRIPS.find((drip) => drip.slug === slug);

export const getIvDripOrThrow = (slug: IvDripSlug): IvDripContent => {
  const drip = getIvDrip(slug);
  if (!drip) throw new Error(`[ivDripContent] unknown IV drip slug "${slug}"`);
  return drip;
};
