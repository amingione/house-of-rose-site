# House of Rose

An advanced aesthetic & wellness brand featuring a modern Astro storefront and Sanity CMS.

## Monorepo Structure

This is a monorepo managed with npm workspaces:

```
house-of-rose-site/
├── packages/
│   ├── web/          # @house-of-rose/web — Astro storefront
│   └── studio/       # @house-of-rose/studio — Sanity Studio v3
├── netlify.toml      # Studio deployment config
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Installation

```bash
# Install all workspace dependencies
npm install
```

### Development

```bash
# Run Astro storefront (localhost:4321)
npm run dev:web

# Run Sanity Studio (localhost:3333)
npm run dev:studio

# Run both in parallel
npm run dev
```

### Build

```bash
# Build both packages
npm run build

# Build individual packages
npm run build -w @house-of-rose/web
npm run build -w @house-of-rose/studio
```

## Deployment

Deployed on Netlify:

| Package | Site | Domain | Config |
|---------|------|--------|--------|
| **Web** | `house-of-rose-web` | [houseofrosefl.com](https://houseofrosefl.com) | Base dir: `packages/web` |
| **Studio** | `house-of-rose-studio` | [studio.houseofrosefl.com](https://studio.houseofrosefl.com) | Root `netlify.toml` |

### Environment Variables

Required for production builds (set in Netlify dashboard):

```bash
# Sanity configuration
PUBLIC_SANITY_PROJECT_ID=4e7axyi7
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-04-26
SANITY_API_READ_TOKEN=<secret>

# Site configuration
PUBLIC_SITE_URL=https://houseofrosefl.com
PUBLIC_BOOKING_EMAIL=book@houseofrosefl.com
```

For local development, copy these to `packages/web/.env.local` (gitignored).

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5 (static output)
- **CMS**: [Sanity](https://www.sanity.io) v3
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v3
- **Language**: TypeScript (strict mode)
- **Hosting**: [Netlify](https://www.netlify.com)

## Project Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed architecture, schemas, and development notes.

## License

Proprietary - House of Rose
