# Copy Deck — Trust & Proof Assets

**Status:** Draft for Amber's review
**Why this exists:** the competitive review named it plainly — House of Rose communicates atmosphere and philosophy well, but proof (credentials, oversight, safety, real outcomes) is less visible than the polish. These assets close that gap. They're the difference between a reader who's intrigued and a reader who books.
**Where it lands:** a **Team & Credentials** block (on `/experience/` or a dedicated `/team/` section, and mirrored into each provider's card), a **Safety** section (reusable across service hubs + `/experience/`), a **reusable candidacy block** (drops into every advanced-service page), and the **before/after framework** for `/results/`.

> All names, credentials, and NAP below are verified against the provider cards and CLAUDE.md. Do not invent titles. Advanced/clinical authority lives with the *provider*, never the copy.

---

## 1. Team & Credentials

### Section intro
The person holding the needle — or the pen, or the peel — is the treatment. At House of Rose, care is delivered by a small, named team, each working within a defined lane and, for advanced and injectable work, under medical-director oversight. We'd rather you know exactly who's treating you and why they're qualified to than dress it up. Here's who you'll meet.

### Diana Morrison, RN — Aesthetic Nurse Injector
Diana is a registered nurse and House of Rose's injector. She leads all injectable work — neurotoxin (Botox and Daxxify), hyaluronic-acid filler (Juvéderm and RHA), and injectable PRF, including under-eye rejuvenation — under medical-director oversight. Her approach is conservative by design: she doses to soften, not to freeze, chooses products that move with your face, and builds gradually because you can always add. She's also the person who'll tell you when an injectable isn't the right tool for what you want.

**Card line:** Registered Nurse · Aesthetic Nurse Injector

### Amber Mingione — Advanced Aesthetics Specialist
Amber leads the advanced facial lane: microneedling with the Procell Therapies device, topical PRF, dermaplaning, BioRePeel (as an add-on to her needling work), Glo2Facial, and carboxy. She's also a **Face Reality Certified Acne Specialist** who runs the full acne program. One boundary she keeps crisp: her PRF is **topical only — applied to the skin during treatment, never injected** (injectable PRF is Diana's lane). Amber holds an RN-assistant role alongside her esthetics license, which is part of why the clinical detail here runs deep.

**Card line:** Advanced Aesthetics Specialist · Face Reality Certified Acne Expert

### Brandy — Facials & Peels
Brandy handles the relaxing and maintenance side of skin health — enzyme exfoliation, hydrodermabrasion, light peels, standalone BioRePeel, and facial waxing. It's the lane you come to for consistent, feel-good upkeep between advanced treatments.

**Card line:** Facials & Peels Specialist

### The oversight line (use wherever advanced/injectable services are sold)
Advanced and injectable treatments at House of Rose are performed by the appropriate licensed provider under medical-director oversight. Candidacy, dosing, intervals, and treatment combinations are confirmed by your provider — never promised in advance.

---

## 2. Safety, in plain terms

### Section intro
Regenerative and advanced treatments are only as good as the standards behind them. None of this is glamorous, which is exactly why we put it in writing.

- **Your own biology, prepared on-site.** PRF is drawn from you and spun down in-studio the same day, with nothing added — fully autologous. Injectable PRF is placed only by Diana, RN.
- **One client, one cartridge.** Microneedling uses a fresh, single-use cartridge every session. No exceptions.
- **Screening before treatment.** Every advanced service starts with a candidacy and contraindication review — health history, medications, pregnancy or breastfeeding, skin condition on the day. If it's not safe or not right, we say so.
- **Consent you actually read.** Advanced treatments carry written consent and pre- and post-care instructions, and injectable work is consultation-first — which is why injectables aren't booked online.
- **Honest limits.** We don't diagnose, treat, or cure medical conditions, and we refer out — to a dermatologist or physician — when that's the responsible call.

### The candidacy truth (short version for footers/callouts)
Not every client is a candidate for every service, and outcomes are individual — which is the whole reason we start with a consultation instead of a checkout.

---

## 3. Reusable candidacy block (drops into every advanced-service page)

> Adapt the specifics per treatment; keep the shape. This satisfies the compliance guardrail (provider authority + real candidacy + individual outcomes) without sounding like a legal disclaimer bolted on.

**Heading:** Is this right for you?

**Body pattern:**
This is a strong fit if you [named goals for the treatment]. It's not the right step — or not right yet — if you [named contraindications: pregnancy/breastfeeding, active infection or breakout, recent isotretinoin, relevant medications, etc.]. [Provider name] confirms your candidacy at consultation, because the honest answer is sometimes "not this," or "not now," or "this, but alongside something else." You'll get an assessment, not an automatic yes.

**Micro-version (for cards/cost pages):**
[Provider] confirms candidacy at consultation — not every client is a candidate, and results are individual.

---

## 4. Before/After framework (`/results/`)

### Framework intro (honest by design)
Before-and-afters are the most persuasive thing on any aesthetics site and the easiest to abuse. Ours follow three rules, always: every image is a **real House of Rose client** who gave **written consent**; every result names the **actual protocol and timeframe** behind it; and every one carries the same truth — **results are individual**, shaped by your skin, your candidacy, and your consistency. No stock photos, no borrowed galleries, no "you will look like this."

### What each case study shows
- **The concern** — what the client came in for, in plain language.
- **The plan** — the exact treatment(s), provider, and number of sessions.
- **The timeframe** — how long it took, honestly (regenerative results build over weeks to months).
- **The result** — consented before/after imagery, with a note that outcomes vary.

### Placeholder state (until consented sets exist)
Until we have consented before-and-afters to show, this page says so rather than filling space with stock imagery:

> We're building this gallery the slow, honest way — with real clients' consented results and the exact protocols behind them. In the meantime, the fastest way to see what's realistic for *your* skin is a consultation. [CTA: Ask what's realistic for you]

### Consent gate (build note)
Case studies render only when `caseStudy.consentGiven == true`. Photography/model-release forms already exist in `docs/internal_only/Consent Forms/`. JSON-LD: `ImageObject` (before + after) + `BreadcrumbList`.

---

## Review & build notes (not for the page)

**Credential sources:** provider cards `/amber/`, `/diana/`, `/brandy/`; CLAUDE.md Providers & Team; `docs/internal_only/research/face-reality-acne-program.md` (Amber = certified specialist).

**Do-not-say (binding):** no "med spa" as the *lead* descriptor (allowed as support); no "day spa"; no membership/"member" framing; no discount language; no "cures/treats" + condition; PRF topical vs injectable lane never blurred; no guaranteed/universal before/after outcome.

**Distinct CTAs introduced here (all differ from treatment decks):** "Meet the person who'll treat you" · "Ask what's realistic for you" · "Start with a consultation" — reserve these for trust/proof surfaces so callouts stay varied site-wide.

**Open items for Amber to confirm before publishing credentials:**
- Amber's exact license/title wording (esthetician license #, "RN-assistant" phrasing) — confirm how she wants it stated.
- Diana's medical-director name/relationship, if it should be named.
- Brandy's preferred public first-name/last-initial and whether her lane is launched (CLAUDE.md notes the basic-facial lane is "parked" until a launch decision).
