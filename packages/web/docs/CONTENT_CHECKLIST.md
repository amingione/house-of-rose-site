# House of Rose - Content Checklist

This guide outlines the content that needs to be added to Sanity Studio to populate the website.

## Access Sanity Studio

Local: `http://localhost:3333/`
Production: `https://studio.houseofrosefl.com/`

---

## 1. Site Settings (Singleton)

**Required for**: Header, Footer, meta tags

Navigate to: **Site Settings** (single document)

- **Site Name**: `House of Rose`
- **Tagline**: `Luxury Spa & Wellness`
- **Description**: Site-wide meta description (150-160 chars)
- **Contact Email**: `book@houseofrosefl.com`
- **Phone**: `(844) 941-7673`
- **Address**: `525 E Olympia Ave, Unit 9, Punta Gorda, FL 33982`
- **Social Links**: Instagram, Facebook URLs

---

## 2. Service Collections (Optional)

**Required for**: `/services/collections/[collection]` pages

Navigate to: **Service Collections**

Example collections:
- **Facials** - Skin rejuvenation and facial treatments
- **Body Treatments** - Body contouring and wellness
- **Injectables** - Medical aesthetics and injectables

For each collection:
- **Title**: Collection name
- **Slug**: URL-friendly (auto-generated)
- **Description**: 2-3 sentences

---

## 3. Services (CRITICAL)

**Required for**: Homepage, `/services`, `/services/[slug]`

Navigate to: **Services**

Minimum 3-6 services recommended. For each service:

### Basic Info
- **Title**: Service name (e.g., "PRF Microneedling")
- **Slug**: Auto-generated from title
- **Tagline**: Short descriptor (e.g., "Regenerative skin renewal")
- **Description**: 2-3 paragraphs explaining the treatment
- **Image**: High-quality treatment image (1200x800px recommended)
  - Include **Alt Text** for accessibility

### Service Details
- **Who It's For**: 2-3 sentences describing ideal candidates
- **The Process**: Array of steps (e.g., "Skin cleanse and prep", "PRF extraction", etc.)
- **Collection**: Link to a Service Collection (optional)

### Pricing & Booking
- **Duration**: Time estimate (e.g., "60 minutes")
- **Price**: Optional - can use "Contact for pricing"

### FAQs
Add 3-5 frequently asked questions:
- **Question**: "Does it hurt?"
- **Answer**: 2-3 sentence response

### Related Services
- Select up to 3 related services (appears at bottom of detail page)

---

## 4. Testimonials

**Required for**: Homepage featured testimonial

Navigate to: **Testimonials**

Create at least 1 testimonial:
- **Quote**: 2-3 sentences from a client
- **Author**: Client name (or "A Happy Client")
- **Role**: Optional (e.g., "Regular Client since 2023")
- **Background Image**: Optional hero image for testimonial section
  - Include **Alt Text**
- **Featured**: Toggle ON for homepage display (only 1 should be featured)

---

## 5. Experience Content (Singleton)

**Required for**: `/experience` page

Navigate to: **Experience Content** (single document)

### Hero Section
- **Hero Title**: `The Experience`
- **Hero Subtitle**: 1-2 sentence description

### Story Section
- **Story Heading**: `Physician-Informed. Client-Centered.`
- **Story Paragraph 1**: First paragraph about your approach
- **Story Paragraph 2**: Second paragraph
- **Story Image**: Image for the split section (800x600px)
  - Include **Alt Text**

### The House of Rose Standard (3 items)
Example standards:
1. **Title**: `Clinical Precision`
   **Description**: `Every protocol is physician-informed and evidence-based.`

2. **Title**: `Personalized Care`
   **Description**: `No two clients are treated the same. Your plan is yours alone.`

3. **Title**: `Long-Term Results`
   **Description**: `We design protocols for compounding, measurable outcomes.`

### Your Guest Journey (5 steps)
Timeline steps (numbered 1-5):

1. **Step**: `1`
   **Title**: `Inquiry`
   **Description**: `Reach out via phone or email to begin your journey.`

2. **Step**: `2`
   **Title**: `Consultation`
   **Description**: `Private assessment to understand your goals and health history.`

3. **Step**: `3`
   **Title**: `Protocol Design`
   **Description**: `We create a staged treatment plan tailored to you.`

4. **Step**: `4`
   **Title**: `First Appointment`
   **Description**: `Your first treatment begins. Relax and restore.`

5. **Step**: `5`
   **Title**: `Ongoing Care`
   **Description**: `We monitor progress and adjust your protocol over time.`

---

## 6. Products (Optional - Future Phase)

**Required for**: E-commerce functionality (not yet implemented)

Navigate to: **Products**

This schema is ready but not yet wired to the frontend. You can add products now for future use:
- **Title**: Product name
- **Slug**: Auto-generated
- **Description**: Product details
- **Price**: Retail price
- **Image**: Product photo
- **Category**: Skincare, Wellness, Gift Cards, etc.
- **In Stock**: Toggle availability

---

## Priority Order

1. **Site Settings** - Sets global info (name, contact, social)
2. **Services (3-6 minimum)** - Populates homepage + services pages
3. **Testimonials (1 featured)** - Adds social proof to homepage
4. **Experience Content** - Completes the `/experience` page
5. Service Collections - Optional, organizes services by category

---

## Testing After Content Entry

1. **View Homepage**: `http://localhost:4322/` (Astro dev server)
   - Check services grid (shows first 6)
   - Check featured testimonial section

2. **View Services Page**: `http://localhost:4322/services`
   - All services should be listed

3. **View Service Detail**: `http://localhost:4322/services/[slug]`
   - Replace `[slug]` with actual service slug
   - Check FAQs, process steps, related services

4. **View Experience**: `http://localhost:4322/experience`
   - Check timeline, standards, story section

---

## Notes

- All images should be **optimized** (use WebP if possible, max 2MB)
- Use **Alt Text** on all images for SEO and accessibility
- **Slugs** auto-generate from titles but can be customized
- **Featured Testimonial**: Only mark ONE testimonial as featured
- Changes in Sanity require **rebuilding** the Astro site (dev server auto-rebuilds)
