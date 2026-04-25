# Medusa Quickstart (Frontend)

This frontend never owns commerce logic. Medusa remains the single authority for package and pricing data.

## What to use in code

Use `src/lib/medusa-client.ts` only:

- `getPackages(limit?)`
- `getServiceCatalog(limit?)`
- `getProductByHandle(handle)`

Use `src/lib/medusa.ts` when you need UI-ready package cards for the homepage.

## Local development modes

### Mode A: Mock mode (fastest for UI work)

Set in `.env.local`:

```bash
MEDUSA_MOCK_MODE=true
```

No Medusa backend is required. You get stable mock catalog data.

### Mode B: Live Medusa

Set in `.env.local`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_API_KEY=your_publishable_key
MEDUSA_MOCK_MODE=false
MEDUSA_REQUEST_TIMEOUT_MS=8000
```

If live calls fail, the client logs a readable warning and falls back to mock data so the UI keeps working.

## Common startup warnings

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL is missing...`
: No backend configured. App is using mock data.
- `MEDUSA_PUBLISHABLE_API_KEY is not set...`
: Your backend may reject requests depending on store config.
- `Unable to reach Medusa (...)`
: Network, CORS, DNS, or backend health issue. App falls back to mock data.

## Quick checks

Run app:

```bash
npm run dev
```

Validate build:

```bash
npm run lint
npm run build
```

## Notes

- Do not call Stripe or Shippo from this frontend.
- Commerce requests stay read-only from frontend to Medusa store APIs.
