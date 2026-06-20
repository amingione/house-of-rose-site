# Notion → Sanity Sync

Keeps the website's Sanity content in step with the master Notion service system. **Notion is the source of truth**; this is a one-way pull.

## What it syncs

| Notion database | → Sanity type | Synced (Notion-owned) fields |
|-----------------|---------------|------------------------------|
| HOUSE OF ROSE: Providers | `provider` | title, fullName, lane, role/credential, scope, production status |
| HOUSE OF ROSE: Services | `service` | title, signatureName, duration, category, status, pricingModel, Founding/Rack/Member price, pricingNotes, competitorPricing, provider |
| HOUSE OF ROSE: Packages & Series | `treatmentPackage` | title, type, status, what's included, cadence, Founding/Rack price, provider, servicesIncluded |
| HOUSE OF ROSE: Memberships & Plans | `membership` | title, type, lane, status, monthlyPrice, what's included, perks, provider, linkedServices, linkedPackages |

### Preserved (website-only) fields — never overwritten

The sync uses *upsert* (create-if-missing, then set only the columns above), so anything you author in the Studio survives every run:

- `service`: description, whoItsFor, process, faqs, image, SEO, collection, concerns, relatedServices
- `treatmentPackage`: outcome, positioning, candidacyNote, image
- slugs: set on first import, then left to the editor

## One-time setup

1. **Create a Notion internal integration** at <https://www.notion.so/my-integrations> → copy its token.
2. **Connect the four databases** to that integration (open each DB → ••• → Connections → your integration).
3. **Add the token** to `.env.local` at the repo root:
   ```
   NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. **Sanity auth** uses your local CLI login (`sanity login`) — same as the other studio scripts. No write token needed.

## Run it

```zsh
# preview — fetches and prints what would change, writes nothing
npm run sync:notion:dry

# real sync
npm run sync:notion
```

Both load `.env.local` via `scripts/run-with-env.mjs`. After a sync, run `npm run dev:studio` to see the imported documents, or rebuild the site to render them.

## How identity works

Each Sanity document gets a deterministic id derived from its Notion page id (`hor.<type>.<notionId>`), so re-running the sync updates the same documents instead of creating duplicates. Relations (provider, services included, linked services/packages) resolve through the same id scheme, and the databases are processed in dependency order (providers → services → packages → memberships) so references always point at documents that already exist.

## Notes & limits

- Select values are normalized to kebab-case Sanity values (e.g. `Advanced Aesthetics` → `advanced-aesthetics`). The maps live at the top of `packages/studio/scripts/sync-from-notion.mjs`; update them if you add new Notion options.
- The sync does not delete. If you remove or archive a row in Notion, delete the matching document in the Studio (or extend the script to prune).
- Images are not transferred — add hero/treatment imagery in the Studio.
