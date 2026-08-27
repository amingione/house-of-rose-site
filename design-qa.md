# IV Hydration Landing Page — Design QA

## Comparison target

- Source visual truth path: `/Users/ambermingione/.codex/generated_images/01a04400-30eb-7d90-84c6-e2161fd5b99f/exec-13d258da-cfd9-4022-8421-e2f60a729e60.png`
- Source pixels: 751 × 2095
- Source role: directional composition for Option 3, not a pixel-perfect specification
- Implementation URL: `http://127.0.0.1:4321/services/iv-hydration-therapy/`
- Implementation screenshot path: unavailable — the in-app browser runtime reported no available browser
- Intended viewport set: 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1728 CSS px
- Implementation pixels / density normalization: unavailable because a browser-rendered screenshot could not be captured
- State: default page, FAQ closed, mobile sticky CTA visible until the final CTA or footer enters view

## Findings

- [P1] Browser-rendered responsive evidence is unavailable
  - Location: complete IV Hydration route.
  - Evidence: the source visual was opened at 751 × 2095, but the selected in-app browser reported no available browser, so no implementation screenshot could be captured or placed in a combined comparison input.
  - Impact: typography wrapping, real image crops, visual rhythm, horizontal overflow, sticky positioning, and footer overlap cannot be truthfully approved from source code alone.
  - Fix: reconnect the in-app browser, capture the default page at the intended desktop, tablet, and mobile viewports, then compare the source and implementation images together.

## Full-view comparison evidence

- Source visual opened successfully and shows the intended predominantly dark editorial treatment, split hero, information rail, vertical IV ledger, high-contrast personalized-treatment break, restrained dividers, provider authority section, FAQ, and final CTA.
- No browser-rendered implementation image is available. A full-view fidelity comparison was not performed.

## Focused region comparison evidence

- Not performed because the implementation screenshot is unavailable.
- Priority regions for the first visual pass: hero crop and headline wrap; the IV ledger at 320 and 768 CSS px; the personalized IV image/text break; Diana Morrison, RN portrait crop and attribution; FAQ summary alignment; mobile sticky CTA at the transition into the final CTA and footer.

## Required fidelity surfaces

- Fonts and typography: source uses a high-contrast display serif with a restrained sans-serif system; implementation maps this to the existing House of Rose Baskerville/Libre Baskerville and Avenir stack. Visual wrapping and optical weight remain unverified.
- Spacing and layout rhythm: implementation encodes full-bleed, editorial spread, thin rail, ledger, alternating split, and quiet text sections with minimal radii. Browser-rendered rhythm remains unverified.
- Colors and visual tokens: implementation is predominantly Slate Noir (`#1C1E22`) and Smoked Slate surfaces, with one intentional ivory visual break and restrained linen/brass details. Rendered contrast and balance remain unverified.
- Image quality and asset fidelity: implementation uses four distinct repository assets for the hero, IV suite, House of Rose interior, and Diana Morrison, RN. Build integrity confirmed every below-fold image stays within the repository's public image budget. Browser crops remain unverified.
- Copy and content: visible copy uses verified House of Rose treatment names, durations, provider credentials, NAP, clinical attribution, and limitations. Public-integrity tests confirm no treatment price is rendered and visible FAQs match FAQPage schema.

## Primary interactions tested

- Static/generated verification confirms all section anchors resolve.
- Static/generated verification confirms all IV phone CTAs use the canonical public phone link.
- Native `<details>` elements provide ten keyboard-operable FAQ controls in the generated page.
- Mobile sticky CTA logic observes both the final CTA and footer and toggles `inert` while hidden.
- Live local route smoke test returned HTTP 200.
- Browser clicks, focus traversal, scroll behavior, and runtime console errors were not tested because no browser was available.

## Comparison history

- Iteration 1: blocked before the first visual comparison. No visual findings or visual fixes can be claimed without implementation evidence.

## Implementation checklist

- Reconnect the in-app browser.
- Capture 1440 × 1000 desktop, 768 × 1024 tablet, and 390 × 844 mobile full-page evidence at density 1.
- Inspect all requested viewport widths for overflow and heading/image crop failures.
- Exercise FAQ keyboard controls, section navigation, all phone/contact actions, and mobile sticky CTA/footer behavior.
- Check runtime console errors.
- Put the source visual and latest implementation screenshot in the same comparison input and repeat until no P0/P1/P2 findings remain.

## Follow-up polish

- None assigned before browser-rendered evidence is available.

final result: blocked
