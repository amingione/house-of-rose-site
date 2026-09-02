# Social Content Pipeline

Sanity-only pipeline between raw capture and a copy-paste-ready post. No auto-publish — you still
post manually in Meta Business Suite.

## Schemas

- `packages/studio/schemas/socialAsset.ts` — raw photo/video, device, content pillar, consent gate.
  If `clientInFrame` is true, `consent.signedAt` + a signed PDF are required before the document
  validates, and revoked/expired consent blocks it again later.
- `packages/studio/schemas/socialPost.ts` — platforms, linked assets, caption draft/final, status.
  Status cannot move to `ready` unless:
  1. `captionFinal` passes the voice linter, and
  2. every linked asset with a client in frame still has non-revoked, non-expired consent (checked
     live via `context.getClient`, so a later revocation blocks a previously-fine post).

## Voice linter

`packages/studio/schemas/validation/lintCaption.ts` — pure function, zero dependencies. Flags:
- banned AI-marketing phrases (delve, elevate, unlock, transform, journey, nestled, seamless,
  game-changer, revolutionize, "say goodbye to," "look no further," "the secret to," "your skin
  deserves," etc.)
- "it's not just X, it's Y" constructions
- rhetorical-question openers ("Ever wondered...")
- em-dash overuse (>2% of word count)
- missing specificity (no number, timeframe, or downtime window)

Passing doesn't mean the copy is good — it means it's clear of the known tells.

## Query: posts ready to copy out

```groq
*[_type == "socialPost" && status == "ready"] | order(scheduledAt asc) {
  title,
  platforms,
  captionFinal,
  scheduledAt,
  "assets": assets[]->{title, mediaType, photo, video}
}
```

## Status

Both schema types are registered in `packages/studio/schemas/index.ts`. They are **not** yet added
to `packages/studio/structure.ts`, which is an explicit nav allowlist (not an auto-generated list) —
so `socialAsset` and `socialPost` documents are creatable and editable in Studio (e.g. via Vision or
a direct document URL) but have no dedicated nav entry yet. Add list items there when the desired
nav placement is decided.

## Not in scope (by design)

No publishing integration, no scheduler, no AI caption generation. The voice-note-to-draft step
(transcribe → structure-only) is a separate function to add later if wanted — this pipeline only
enforces the consent gate and the voice check on the way to `ready`.
