# PRF & ProCell education seed — review and publish checklist

The draft-only seed lives at `packages/studio/scripts/seed-prf-procell-education.mjs`.

## Safe usage

```sh
node packages/studio/scripts/seed-prf-procell-education.mjs --validate
node packages/studio/scripts/seed-prf-procell-education.mjs --apply
```

`--apply` verifies the live `provider-amber` and `provider-diana` documents, then creates only missing `drafts.hor.*` documents. It never overwrites, publishes, patches, or deletes Studio content.

## Drafts to review

- Service hubs: Microchanneling & Microneedling, ProCell Microchanneling, PRF.
- Service treatments: ProCell Pro, ProCell MD, Topical PRF, PRF Injections, EZ Gel Bio-Filler, Rose PRF Fibrin Veil.
- Comparisons: Microchanneling vs Microneedling; ProCell Pro vs MD; ProCell vs Topical PRF; Topical PRF vs PRF Injections; PRF Injections vs EZ Gel; ProCell Serum vs PRF.

## Before publishing any draft

- Complete the related route/query/JSON-LD/sitemap/`llms.txt` implementation and verify all links use trailing slashes.
- Confirm topical PRF remains Amber’s topical-only lane; PRF injections and EZ Gel remain Diana, RN’s injectable lane.
- Confirm the current ProCell manufacturer wording before publishing the MD/Pro comparison.
- Have Diana, RN approve injectable areas, candidacy, aftercare, consent, and outcome wording.
- Keep all pages consult-only. Exact investments stay in local service documentation; public FAQs may use only non-exact orientation such as “begins in the low-$200s.” Do not add unsupported claims or a device-delivery claim for topical PRF.
- Review every draft in Studio before publishing. Outcomes, candidacy, and any series timing are individual and provider-determined.
