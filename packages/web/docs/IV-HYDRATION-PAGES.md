# IV hydration pages

One hub, six bag pages, one content module.

## Routes

| Route | Rendered by | Content |
|---|---|---|
| `/services/iv-hydration-therapy/` | `pages/services/[slug].astro` → `components/treatment/IvHydrationLanding.astro` | `lib/ivHydrationLanding.ts` (+ `IV_DECISION_GUIDE` from `lib/ivDripContent.ts`) |
| `/services/iv-hydration-therapy/<drip>/` | `pages/services/iv-hydration-therapy/[drip].astro` → `components/treatment/IvDripPage.astro` | `lib/ivDripContent.ts` |

Drip slugs: `hydration-iv`, `immunity-iv`, `recovery-iv`, `beauty-glow-iv`, `reboot-iv`, `myers-cocktail-iv`.

## Source of truth

- **Names + durations:** `lib/ivHydrationFacts.ts` (`VERIFIED_IV_MENU`, mirrors the GlossGenius menu). `price` stays there for internal paste-ready use only; nothing public reads it.
- **Ingredients + copy:** `lib/ivDripContent.ts`, written from the practice's bag reference at `docs/GOVERNANCE/internal_only/services/Diana/Diana_services/ivHydration.md`. Change the bag there first, then here.
- **Shared notes** (provider attribution, screening, not-medical-care, compounding disclosure, pricing line): `IV_DRIP_STANDARD_NOTES` in the same module — rendered on every drip page.

## Page anatomy (each drip)

Hero → What it is → What's in the bag → What it helps with → The visit → Right for you? (good fit / talk with Diana Morrison, RN first) → Consider a different bag → Clinical responsibility → FAQ → Local → CTA.

## Hub additions

- `TreatmentOptions.astro` rows now link to each drip page (whole row clickable, "Book this IV" phone link preserved).
- `IvDecisionGuide.astro` — "Which IV is right for you?" goal-first cards, one per bag.
- Shared `.iv-page` styles moved to `service-landing/IvPageStyles.astro` so hub and drip pages cannot drift.

## Discovery

Drip routes are emitted in `sitemap.xml`, `/sitemap/`, `llms.txt`, and `llms-full.txt` (with ingredient lists).

## Guardrails (enforced in `scripts/public-integrity.test.mjs`, test "IV hydration hub links every bag…")

- Every bag named and linked ≥2× from the hub.
- Each drip page: name, named ingredients, `Medical Director: Joshua Shaw, MD · FL Lic. ME136232`, pricing line, FDA/compounding disclosure, "not a substitute for medical care", Diana profile link, hub back-link, sitemap entry, BreadcrumbList + FAQPage JSON-LD.
- Banned on drip pages: any `$` amount. Tone and claim wording are Amber's call; the test does not police them.
- Meta descriptions ≤ 160 chars; "when you book" is banned site-wide by the scheduling-inventory test, so the pricing line reads "Ask about current pricing when you call."

## Adding or changing a bag

1. Update the GlossGenius menu and `VERIFIED_IV_MENU`.
2. Add/edit the entry in `IV_DRIPS` (and `IV_DECISION_GUIDE`). `menuItem()` throws at build time if the name is not on the verified menu.
3. Add the slug + ingredient names to the `IV_DRIPS` table in the integrity test.
4. `npm run build:web` — the test runs as part of the build.
