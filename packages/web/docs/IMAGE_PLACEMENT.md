# Image & Logo Placement Guide

This document tracks where all images and logos from `/public` have been placed throughout the site.

## Logo Usage

### Header (All Pages)
**File**: `src/components/Header.astro`
- **Logo**: `/logos/house-of-rose-straight-logo-package/svg/logo-white.svg`
- **Usage**: Main site logo in header navigation
- **Size**: `h-12` (48px height), auto width
- **Sticky state**: Scales down to `h-10` (40px) on scroll

### Favicons (All Pages)
**File**: `src/layouts/BaseLayout.astro`
- **Monogram favicon.ico**: `/logos/house-of-rose-monogram-logo-package/favicon/favicon.ico`
- **16x16 PNG**: `/logos/house-of-rose-monogram-logo-package/favicon/16.png`
- **32x32 PNG**: `/logos/house-of-rose-monogram-logo-package/favicon/32.png`
- **48x48 PNG**: `/logos/house-of-rose-monogram-logo-package/favicon/48.png`
- **Apple Touch Icon (512x512)**: `/logos/house-of-rose-monogram-logo-package/png/logo-512.png`

### Open Graph / Social Media
**File**: `src/layouts/BaseLayout.astro`
- **OG Image**: `/logos/house-of-rose-straight-logo-package/social/og.png`
- **Usage**: Default social sharing image when no page-specific image is set
- **Size**: 1200x630px (optimized for Facebook/Twitter/LinkedIn)

---

## Hero Background Images

### Homepage
**File**: `src/pages/index.astro`
- **Image**: `/images/house-of-rose-med-spa-exterior-branding-florida 2.webp`
- **Context**: Full-screen hero showcasing exterior branding
- **Purpose**: Establishes location and professional aesthetic

### Services Index
**File**: `src/pages/services/index.astro`
- **Image**: `/images/house-of-rose-spa-aesthetic-treatment-tools-setup 2.webp`
- **Context**: Small hero with treatment tools
- **Purpose**: Sets clinical/professional tone for services

### Experience Page
**File**: `src/pages/experience.astro`
- **Image**: `/images/house-of-rose-med-spa-relaxation-lounge-interior 2.webp`
- **Context**: Small hero showing relaxation lounge
- **Purpose**: Emphasizes comfort and luxury experience

---

## Split Section Images

### Homepage - First Split Section
**File**: `src/pages/index.astro` (Physician-Informed Care section)
- **Image**: `/images/house-of-rose-med-spa-skincare-consultation-room 2.webp`
- **Position**: Right side of split layout
- **Size**: 800x600
- **Purpose**: Shows consultation environment

### Homepage - Second Split Section
**File**: `src/pages/index.astro` (Experience section)
- **Image**: `/images/house-of-rose-spa-luxe-treatment-room-punta-gorda 2.webp`
- **Position**: Left side of split layout (order-2 on mobile, order-1 on desktop)
- **Size**: 800x600
- **Purpose**: Showcases luxury treatment room

### Experience Page - Story Section
**File**: `src/pages/experience.astro`
- **Image**: `/images/house-of-rose-med-spa-reception-desk-punta-gorda 2.webp`
- **Position**: Right side of split layout
- **Size**: 800x600
- **Purpose**: Fallback image (can be overridden by Sanity CMS)
- **Note**: This image is used when `experienceContent.storyImage` is not set in Sanity

---

## Available Logo Variants

You have three logo packages available in `/public/logos`:

### 1. House of Rose Straight Logo Package
- **Best for**: Headers, main branding, social media
- **Variants**:
  - `svg/logo-white.svg` ✅ (Currently used in header)
  - `svg/logo-black.svg`
  - `svg/logo-primary.svg`
  - `png/logo-512.png`
  - `png/logo-1024.png`
  - `social/og.png` ✅ (Currently used for OG image)
  - `social/twitter.png`

### 2. House of Rose LLC Logo Package
- **Best for**: Legal/formal contexts, footer disclaimers
- **Variants**: Same as straight package
- **Contains**: LLC designation

### 3. House of Rose Monogram Logo Package
- **Best for**: Favicons, app icons, compact spaces
- **Variants**: Same as straight package
- **Usage**: Currently used for all favicons ✅

---

## Unused Images (Available for Future Use)

These images are in `/public/images` but not yet placed on the site:

### Interior Spaces
- `house-of-rose-couples-spa-suite-punta-gorda-fl 2.webp` - Couples suite
- `house-of-rose-facial-treatment-bed-setup-florida 2.webp` - Facial treatment setup
- `house-of-rose-spa-massage-table-serene-ambiance 2.webp` - Massage table
- `house-of-rose-spa-warm-lighting-cozy-suite-florida 2.webp` - Cozy suite lighting

### Product & Ambiance
- `house-of-rose-luxury-spa-towel-flower-arrangement 2.webp` - Towel arrangement
- `house-of-rose-spa-candle-aromatherapy-ambiance 2.webp` - Candle/aromatherapy
- `house-of-rose-spa-natural-botanical-product-flatlay 2.webp` - Product flatlay
- `house-of-rose-spa-skincare-product-display 2.webp` - Product display
- `house-of-rose-relaxing-spa-bath-soaking-ritual 2.webp` - Bath/soaking

### Decorative
- `pale-pink-rose-wall.webp` - Rose wall background
- `single-trellis-wall.webp` - Trellis wall background

---

## Suggested Future Placements

### Service Detail Pages
Currently, service detail pages (`services/[slug].astro`) use images from **Sanity CMS**. If Sanity images aren't populated, consider adding fallbacks:

```astro
backgroundImage={service.image
  ? urlFor(service.image).url()
  : '/images/house-of-rose-facial-treatment-bed-setup-florida 2.webp'
}
```

### Testimonial Section Background
Use decorative images as background overlays:
- `pale-pink-rose-wall.webp` or `single-trellis-wall.webp`

### About/Team Page (Future)
- Reception desk image
- Couples suite for consultations

### Blog Posts (Future)
- Product flatlay images
- Ambiance shots (candles, towels)
- Treatment room details

---

## How to Swap Images

### Replace a Hero Image
1. Open the page file (e.g., `src/pages/index.astro`)
2. Find the `<Hero>` component
3. Update the `backgroundImage` prop:
```astro
backgroundImage="/images/your-new-image.webp"
```

### Replace a Split Section Image
1. Open the page file
2. Find the `<img>` tag in the split section
3. Update the `src` attribute:
```astro
<img
  src="/images/your-new-image.webp"
  alt="Update the alt text"
  class="w-full h-full object-cover"
  width="800"
  height="600"
/>
```

### Replace the Header Logo
1. Open `src/components/Header.astro`
2. Find the logo `<img>` tag
3. Update the `src` to use a different variant:
```astro
src="/logos/house-of-rose-llc-logo-package/svg/logo-white.svg"
```

---

## Image Optimization Notes

All images are in **WebP format** for optimal performance. If you add new images:

1. **Convert to WebP** for better compression
2. **Optimize file size** (target <200KB for backgrounds, <50KB for thumbnails)
3. **Use descriptive filenames** matching the pattern: `house-of-rose-[context]-[description] 2.webp`
4. **Provide width/height attributes** for better layout stability
5. **Write descriptive alt text** for accessibility

---

## Accessibility Checklist

All images should have:
- ✅ Descriptive `alt` text
- ✅ Explicit `width` and `height` attributes
- ✅ Appropriate file size for context
- ✅ High contrast for overlaid text (use gradient overlays on heroes)

---

Last updated: 2025-04-27
