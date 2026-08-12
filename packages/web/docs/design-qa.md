# Design QA — One-Time Scan and Manual Comparison Hero

## Fidelity ledger

| Review point | Requested behavior | Rendered result | Resolution |
|---|---|---|---|
| Entry motion | The page should open with one scan animation | The supplied 5.04-second H.264 video autoplays muted and inline once per page load; it does not loop | Passed |
| End state | The animation should resolve to a straight-on face | The video fades into a centered, straight-on comparison pair built from the same identity and crop | Passed |
| Persistent comparison | The final state should stay divided | The comparison remains on screen after playback with a fixed visible divider | Passed |
| Manual control | The divider must swipe back and forth | Pointer capture now tracks the visible comparison area continuously; real mouse drags reached 24%, 70%, and 82%, a phone-sized drag reached 78%, and keyboard arrows moved the divider by one step | Passed |
| Visible skin difference | Pores, pigmentation, hydration appearance, and firmness should read differently | The aligned comparison pair shows smaller-looking pores, diminished pigmentation, better-hydrated texture, softened lines, and restrained tightening without changing the subject’s identity | Passed as draft visualization |
| Language | Remove the staged timeline wording | “Baseline,” “Early continuation,” “Mid-course,” “Later continuation,” and the treatment-continuation status row were removed; no replacement marketing labels were added | Passed |
| Responsive behavior | The scan and divider must work on mobile | At phone widths the scan is a dedicated 320px visual panel, the divider stays inside the face image, copy begins below it, and both CTAs share one visible row; 360 × 800 and 390 × 844 have no horizontal overflow | Passed |
| Accessibility | Motion and manual control must remain accessible | Reduced-motion users skip directly to the comparison; the divider is a keyboard-operable labeled range input with live value text | Passed |

## Verification

- Source media inspected as a five-frame contact sheet plus exact first and last frames.
- Desktop viewports checked at 1440 × 900 and 722 × 898; mobile checked at 360 × 800 and 390 × 844.
- Video state verified during playback and at `ended`; the slider remains disabled until the video finishes.
- Core interaction verified with actual pointer drags in both directions on desktop and at 390 × 844, plus keyboard control.
- Above-the-fold copy diff: existing headline, description, CTAs, navigation, practice, location, and phone copy are unchanged; the rejected timeline labels are absent.
- `astro-check`, production build, and whitespace checks were rerun after implementation.

## Publishing constraint

- This is a generated concept visualization, not consented patient evidence. It requires owner and clinical approval and must not be represented as a treatment result or case study.

final result: passed for draft preview
