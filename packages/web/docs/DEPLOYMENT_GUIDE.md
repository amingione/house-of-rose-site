# House of Rose - Deployment Guide

This guide covers deploying both the Astro storefront and Sanity Studio to Netlify.

---

## Prerequisites

- [x] Content added to Sanity Studio (see `CONTENT_CHECKLIST.md`)
- [x] Build tested locally (`npm run build`)
- [x] Git repository pushed to GitHub
- [x] Netlify account with access to the project

---

## Netlify Sites Overview

| Site | Purpose | Base Directory | Build Command | Publish Directory |
|------|---------|----------------|---------------|-------------------|
| `house-of-rose-web` | Astro storefront | `packages/web` | `npm run build` | `packages/web/dist` |
| `house-of-rose-studio` | Sanity Studio | (root) | `npm run build:studio` | `packages/studio/dist` |

---

## 1. Deploy Astro Storefront (`house-of-rose-web`)

### Netlify Configuration

**Site ID**: `0de4617d-5ba1-4e80-b59e-4900b540f5c0`
**Custom Domain**: `houseofrosefl.com`

### Environment Variables (Production)

Navigate to: **Site settings → Environment variables → Add a variable**

| Variable | Value | Scopes |
|----------|-------|--------|
| `PUBLIC_SANITY_PROJECT_ID` | `4e7axyi7` | Builds, Functions, Post processing |
| `PUBLIC_SANITY_DATASET` | `production` | Builds, Functions, Post processing |
| `PUBLIC_SANITY_API_VERSION` | `2025-04-26` | Builds, Functions, Post processing |
| `SANITY_API_WRITE_TOKEN` | `[SECRET]` | Builds, Functions |
| `PUBLIC_SITE_URL` | `https://houseofrosefl.com` | Builds, Functions, Post processing |
| `PUBLIC_BOOKING_EMAIL` | `book@houseofrosefl.com` | Builds, Functions, Post processing |

**Where to get `SANITY_API_WRITE_TOKEN`**:
1. Go to Sanity project: https://sanity.io/manage/personal/project/4e7axyi7
2. Navigate to **API** → **Tokens**
3. Create a project API token with write permissions for lead submissions and the Notion sync document types (`provider`, `service`, `treatmentPackage`, `membership`)
4. Copy the token (you'll only see it once)

### Build Settings

Navigate to: **Site settings → Build & deploy → Build settings**

- **Base directory**: `packages/web`
- **Build command**: `npm run build`
- **Publish directory**: `packages/web/dist`
- **Node version**: `20.x` (set via env var `NODE_VERSION=20`)

### Deploy Commands

```bash
# From repo root
git add .
git commit -m "Deploy: [describe changes]"
git push origin main
```

Netlify will automatically build and deploy on push to `main`.

### Manual Deploy Trigger

Navigate to: **Deploys → Trigger deploy → Deploy site**

---

## 2. Deploy Sanity Studio (`house-of-rose-studio`)

### Netlify Configuration

**Site ID**: `44c4d348-8afd-4c0d-adb2-f8f9b7ffde15`
**Custom Domain**: `studio.houseofrosefl.com`

### Environment Variables (Production)

Navigate to: **Site settings → Environment variables**

| Variable | Value | Scopes |
|----------|-------|--------|
| `SANITY_STUDIO_PROJECT_ID` | `4e7axyi7` | Builds |
| `SANITY_STUDIO_DATASET` | `production` | Builds |

### Build Settings

Navigate to: **Site settings → Build & deploy → Build settings**

- **Base directory**: (leave empty - uses root)
- **Build command**: `npm run build:studio`
- **Publish directory**: `packages/studio/dist`
- **Node version**: `20.x`

### Deploy Commands

Same as storefront - push to `main` triggers build.

---

## 3. CORS Configuration in Sanity

Ensure Netlify domains are allowed to access Sanity API.

Navigate to: https://sanity.io/manage/personal/project/4e7axyi7/api

**Registered CORS origins**:
- `http://localhost:3333` (local Studio)
- `http://localhost:4321` (local Astro dev)
- `https://studio.houseofrosefl.com` (production Studio)
- `https://houseofrosefl.com` (production storefront)

If missing, add via:
```bash
cd packages/studio
npx sanity cors add https://houseofrosefl.com --credentials
npx sanity cors add https://studio.houseofrosefl.com --credentials
```

---

## 4. Custom Domain Setup

### Storefront (`houseofrosefl.com`)

Navigate to: **Site settings → Domain management → Add custom domain**

1. Add domain: `houseofrosefl.com`
2. Add `www.houseofrosefl.com` (redirects to root)
3. Enable **HTTPS** (Netlify auto-provisions Let's Encrypt SSL)
4. Set DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify load balancer IP)

   Type: CNAME
   Name: www
   Value: house-of-rose-web.netlify.app
   ```

### Studio (`studio.houseofrosefl.com`)

1. Add domain: `studio.houseofrosefl.com`
2. Enable **HTTPS**
3. Set DNS record:
   ```
   Type: CNAME
   Name: studio
   Value: house-of-rose-studio.netlify.app
   ```

---

## 5. Post-Deployment Verification

### Storefront Checklist

- [ ] Visit `https://houseofrosefl.com`
- [ ] Verify homepage loads with services
- [ ] Check `/services` page
- [ ] Check individual service pages (`/services/[slug]`)
- [ ] Check `/experience` page
- [ ] Verify images load from Sanity CDN
- [ ] Test mobile menu (responsive)
- [ ] Verify CTAs (phone, email links)
- [ ] Check `https://houseofrosefl.com/sitemap.xml`
- [ ] Check `https://houseofrosefl.com/robots.txt`
- [ ] Validate structured data: https://search.google.com/test/rich-results

### Studio Checklist

- [ ] Visit `https://studio.houseofrosefl.com`
- [ ] Log in with Google account
- [ ] Verify all schemas visible: Services, Testimonials, Experience Content, etc.
- [ ] Create a test service and publish
- [ ] Trigger a rebuild of the storefront (Netlify dashboard)
- [ ] Verify new service appears on the website

---

## 6. Continuous Deployment Workflow

### Content Updates (via Sanity Studio)

1. Edit content in Sanity Studio (`studio.houseofrosefl.com`)
2. Publish changes
3. **Manually trigger Netlify deploy** (for now)
   - Navigate to: Netlify → Deploys → Trigger deploy → Deploy site
   - This rebuilds the site with fresh Sanity content

**Future Enhancement**: Set up a Sanity webhook to auto-trigger Netlify builds on publish.

### Code Updates (via Git)

1. Make code changes locally
2. Test with `npm run build`
3. Commit and push to `main`
4. Netlify auto-deploys

---

## 7. Sanity Webhook Setup (Future)

To auto-rebuild the storefront when content changes in Sanity:

### In Sanity Project

1. Navigate to: https://sanity.io/manage/personal/project/4e7axyi7/api/webhooks
2. Click **Add Webhook**
3. Configure:
   - **Name**: `Netlify Deploy Trigger`
   - **URL**: `https://api.netlify.com/build_hooks/[YOUR_BUILD_HOOK_ID]`
   - **Dataset**: `production`
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Filter**: `_type in ["service", "testimonial", "experienceContent", "siteSettings"]`
   - **HTTP method**: `POST`
   - **Include drafts**: `No`

### Get Netlify Build Hook URL

1. Navigate to: Netlify → Site settings → Build & deploy → Build hooks
2. Click **Add build hook**
3. Name: `Sanity Content Update`
4. Branch: `main`
5. Copy the webhook URL

Now, when you publish changes in Sanity, the site will auto-rebuild.

---

## 8. Monitoring & Analytics

### Ahrefs Analytics

Already installed via script in `BaseLayout.astro`:
```html
<script src="https://analytics.ahrefs.com/analytics.js" data-key="XdzOvGXmUENnBpyYIDhXOQ" async></script>
```

View analytics: https://ahrefs.com/webmaster-tools

### Netlify Analytics

Navigate to: **Analytics** tab in Netlify dashboard

- Pageviews
- Unique visitors
- Bandwidth usage
- Build minutes

---

## 9. SEO Checklist

Post-deployment SEO tasks:

- [x] Submit sitemap to Google Search Console: `https://houseofrosefl.com/sitemap.xml`
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify `robots.txt`: `https://houseofrosefl.com/robots.txt`
- [ ] Test structured data: https://search.google.com/test/rich-results
- [ ] Verify OpenGraph tags (share on social media to test)
- [x] Set up Google Business Profile (for local SEO)
- [ ] Claim business on Yelp, HealthGrades, etc.

---

## 10. Rollback Procedure

If a deployment breaks the site:

### Via Netlify Dashboard

1. Navigate to: **Deploys**
2. Find the last working deploy
3. Click **Publish deploy** on that version

### Via Git

```bash
git log --oneline  # Find the commit hash of last working version
git revert [commit-hash]
git push origin main
```

---

## Support

**Netlify Docs**: https://docs.netlify.com
**Sanity Docs**: https://www.sanity.io/docs
**Astro Docs**: https://docs.astro.build

**Project Support**:
- Amber Mingione: ambermingione@gmail.com
