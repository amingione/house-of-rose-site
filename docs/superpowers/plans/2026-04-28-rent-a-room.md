# Rent-A-Room Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/rent-a-room` page to the House of Rose Astro site that markets private room rentals to solo beauty professionals and collects rental applications via a Netlify form.

**Architecture:** Fully static Astro page — no new Sanity schema needed (room specs are stable business facts, not editorial content). The page uses the existing `BaseLayout`, `Hero` component, and Tailwind design tokens. The application form uses Netlify Forms (`data-netlify="true"`) with a honeypot, matching the existing contact form pattern. Navigation and sitemap are updated to include the new route.

**Tech Stack:** Astro v5, Tailwind CSS v3, Netlify Forms, TypeScript strict

---

### Task 1: Create the `/rent-a-room` page

**Files:**
- Create: `packages/web/src/pages/rent-a-room.astro`

This is a fully static page. No Sanity fetch needed. All content is hardcoded.

**Page sections (in order):**
1. **Hero** — "Grow Your Practice Here" with CTA scrolling to the form
2. **Perks grid** — 6 cards with icon-style headings + descriptions
3. **Room details strip** — specs table (size, price range, utilities, sink, etc.)
4. **Who we're looking for** — 3-column cards for aesthetician / massage / PMU artist
5. **Application form** — Netlify form with honeypot
6. **Bottom CTA bar** — phone + email for direct questions

- [ ] **Step 1: Create the page file**

Create `packages/web/src/pages/rent-a-room.astro` with this exact content:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/Hero.astro';
---

<BaseLayout
  title="Rent a Private Suite | House of Rose — Punta Gorda FL"
  description="Private treatment room rentals for licensed aestheticians, massage therapists, and permanent makeup artists in Punta Gorda, FL. Starting at $850/mo. No utilities. Apply today."
>
  <!-- ── Hero ──────────────────────────────────────────────────── -->
  <Hero
    title="Grow Your Practice Here"
    kicker="Suite Rentals"
    description="Private, fully-equipped rooms in a luxury spa environment — where independent professionals thrive."
    size="small"
    backgroundImage="/images/bg-treatment-room.jpg"
    showCTA={true}
    ctaPrimary={{ text: 'Apply Now', href: '#apply' }}
    ctaSecondary={{ text: 'Learn More', href: '#perks' }}
  />

  <!-- ── Why House of Rose ─────────────────────────────────────── -->
  <section id="perks" class="bg-charcoal py-[clamp(56px,8vw,96px)] px-6">
    <div class="max-w-[1280px] mx-auto">
      <div class="text-center mb-16">
        <span class="kicker">What's Included</span>
        <h2 class="font-serif text-[clamp(30px,4vw,46px)] text-white mt-2">
          Everything You Need to Succeed
        </h2>
        <p class="text-[#777] text-[15px] max-w-[560px] mx-auto mt-4 leading-relaxed">
          We handle the business infrastructure. You focus on your clients.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        <!-- Perk 1 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">No Competing Services</span>
          <h3 class="font-serif text-[20px] text-white mb-3">Guaranteed Clientele</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            We enforce a no-competing-services policy. If someone calls for your specialty, that booking belongs to you — no internal competition.
          </p>
        </div>

        <!-- Perk 2 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">Team Member Listing</span>
          <h3 class="font-serif text-[20px] text-white mb-3">Visible on Our Website</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            You're listed as a House of Rose team member with your services on our booking platform — giving you immediate exposure to our existing client base.
          </p>
        </div>

        <!-- Perk 3 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">Business Development</span>
          <h3 class="font-serif text-[20px] text-white mb-3">We Send You Clients</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            When calls come in requesting your services, we direct that business straight to you. No leads left on the table.
          </p>
        </div>

        <!-- Perk 4 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">Marketing Included</span>
          <h3 class="font-serif text-[20px] text-white mb-3">Shop-Run Advertising</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            House of Rose runs ongoing digital and local advertising for the shop. Your services benefit from our marketing investment at no extra cost.
          </p>
        </div>

        <!-- Perk 5 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">Utilities Included</span>
          <h3 class="font-serif text-[20px] text-white mb-3">No Hidden Costs</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            All utilities are covered in your monthly rate. Water, electric — no surprises. You know exactly what you're paying.
          </p>
        </div>

        <!-- Perk 6 -->
        <div class="bg-charcoal p-8 hover:bg-charcoal-lighter transition-colors duration-300">
          <span class="kicker">Your Space</span>
          <h3 class="font-serif text-[20px] text-white mb-3">Sink & Product Display</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            Each room includes a sink and dedicated shelf space to display and sell your own retail products. Build your brand within ours.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Room Details ──────────────────────────────────────────── -->
  <section class="bg-charcoal-lighter py-[clamp(48px,7vw,88px)] px-6">
    <div class="max-w-[1280px] mx-auto">
      <div class="text-center mb-12">
        <span class="kicker">Room Specifications</span>
        <h2 class="font-serif text-[clamp(28px,4vw,40px)] text-white mt-2">
          Private Suites Built for Professionals
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Specs list -->
        <dl class="space-y-0 divide-y divide-white/5">
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Room Size</dt>
            <dd class="text-white text-[15px]">10 × 14 ft private suite</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Monthly Rate</dt>
            <dd class="text-white text-[15px]">$850 – $1,100 / month</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Utilities</dt>
            <dd class="text-white text-[15px]">Included — all covered</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Sink</dt>
            <dd class="text-white text-[15px]">Available in room</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Product Display</dt>
            <dd class="text-white text-[15px]">Shelf space included</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Insurance</dt>
            <dd class="text-white text-[15px]">Renter carries own policy</dd>
          </div>
          <div class="flex justify-between items-center py-5">
            <dt class="text-[11px] tracking-[0.3em] uppercase text-gold">Location</dt>
            <dd class="text-white text-[15px]">525 E Olympia Ave, Unit 9 — Punta Gorda, FL 33950</dd>
          </div>
        </dl>

        <!-- CTA aside -->
        <div class="bg-charcoal p-10 border border-gold/20">
          <span class="kicker">Ready to Apply?</span>
          <h3 class="font-serif text-[clamp(22px,3vw,30px)] text-white mb-4 leading-snug">
            Space Is Limited.<br />Reserve Yours.
          </h3>
          <p class="text-[#666] text-[14px] leading-relaxed mb-8">
            We keep our suite count intentionally small to protect the no-competing-services guarantee. When a specialty slot fills, it's closed until it opens again.
          </p>
          <a href="#apply" class="btn-gold">
            Submit Your Application
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Who We're Looking For ────────────────────────────────── -->
  <section class="bg-charcoal py-[clamp(56px,8vw,96px)] px-6">
    <div class="max-w-[1280px] mx-auto">
      <div class="text-center mb-16">
        <span class="kicker">Ideal Candidates</span>
        <h2 class="font-serif text-[clamp(28px,4vw,40px)] text-white mt-2">
          Who We're Looking For
        </h2>
        <p class="text-[#777] text-[15px] max-w-[560px] mx-auto mt-4 leading-relaxed">
          We partner with licensed, passionate professionals who are ready to grow their independent practice in a premium environment.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Aesthetician -->
        <div class="border border-white/8 p-8 text-center hover:border-gold/40 transition-colors duration-300">
          <div class="w-12 h-12 border border-gold/30 mx-auto mb-6 flex items-center justify-center">
            <span class="text-gold text-[10px] tracking-[0.3em] uppercase">01</span>
          </div>
          <h3 class="font-serif text-[22px] text-white mb-3">Aestheticians</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            Licensed facial specialists, skin care therapists, and estheticians looking for a private suite to serve clients in a luxury setting.
          </p>
        </div>

        <!-- Massage -->
        <div class="border border-white/8 p-8 text-center hover:border-gold/40 transition-colors duration-300">
          <div class="w-12 h-12 border border-gold/30 mx-auto mb-6 flex items-center justify-center">
            <span class="text-gold text-[10px] tracking-[0.3em] uppercase">02</span>
          </div>
          <h3 class="font-serif text-[22px] text-white mb-3">Massage Therapists</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            Licensed massage specialists who want a dedicated treatment room with all the infrastructure — without the overhead of a standalone studio.
          </p>
        </div>

        <!-- PMU -->
        <div class="border border-white/8 p-8 text-center hover:border-gold/40 transition-colors duration-300">
          <div class="w-12 h-12 border border-gold/30 mx-auto mb-6 flex items-center justify-center">
            <span class="text-gold text-[10px] tracking-[0.3em] uppercase">03</span>
          </div>
          <h3 class="font-serif text-[22px] text-white mb-3">PMU Artists</h3>
          <p class="text-[#666] text-[14px] leading-relaxed">
            Permanent makeup artists specializing in microblading, brows, lips, or liner — working in a clean, professional space that matches your artistry.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Application Form ──────────────────────────────────────── -->
  <section id="apply" class="bg-charcoal-lighter py-[clamp(56px,8vw,96px)] px-6">
    <div class="max-w-[840px] mx-auto">
      <div class="text-center mb-12">
        <span class="kicker">Apply for a Suite</span>
        <h2 class="font-serif text-[clamp(28px,4vw,40px)] text-white mt-2">
          Tell Us About Yourself
        </h2>
        <p class="text-[#777] text-[15px] max-w-[560px] mx-auto mt-4 leading-relaxed">
          Fill out the form below and we'll be in touch within 48 hours to schedule a tour and answer any questions.
        </p>
      </div>

      <form
        name="suite-rental-application"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="space-y-6"
      >
        <!-- Netlify hidden fields -->
        <input type="hidden" name="form-name" value="suite-rental-application" />
        <p class="hidden">
          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
        </p>

        <!-- Row: Name + Phone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="applicant-name" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="applicant-name"
              name="name"
              required
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label for="applicant-phone" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="applicant-phone"
              name="phone"
              required
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="applicant-email" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="applicant-email"
            name="email"
            required
            class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <!-- Row: Specialty + License -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="applicant-specialty" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              Specialty *
            </label>
            <select
              id="applicant-specialty"
              name="specialty"
              required
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled selected>Select your specialty</option>
              <option value="aesthetician">Licensed Aesthetician</option>
              <option value="massage-therapist">Massage Therapist</option>
              <option value="pmu-artist">Permanent Makeup Artist</option>
              <option value="other">Other (describe below)</option>
            </select>
          </div>
          <div>
            <label for="applicant-license" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              License / Certification #
            </label>
            <input
              type="text"
              id="applicant-license"
              name="license-number"
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors"
              placeholder="FL-XXXXXXX"
            />
          </div>
        </div>

        <!-- Row: Business Name + Years Experience -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="applicant-business" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="applicant-business"
              name="business-name"
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors"
              placeholder="Your LLC or trade name (if any)"
            />
          </div>
          <div>
            <label for="applicant-experience" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
              Years of Experience *
            </label>
            <select
              id="applicant-experience"
              name="years-experience"
              required
              class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled selected>Select range</option>
              <option value="under-1">Less than 1 year</option>
              <option value="1-3">1 – 3 years</option>
              <option value="3-5">3 – 5 years</option>
              <option value="5-plus">5+ years</option>
            </select>
          </div>
        </div>

        <!-- Message -->
        <div>
          <label for="applicant-message" class="block text-gold text-[11px] tracking-[0.3em] uppercase mb-2">
            Tell Us About Yourself *
          </label>
          <textarea
            id="applicant-message"
            name="message"
            rows="5"
            required
            class="w-full bg-charcoal border border-white/10 text-white px-5 py-3.5 text-[15px] focus:outline-none focus:border-gold transition-colors resize-vertical"
            placeholder="Share your background, the services you offer, your clientele, and what you're looking for in a suite rental."
          ></textarea>
        </div>

        <!-- Insurance acknowledgement -->
        <div class="bg-charcoal/60 border border-gold/20 p-6">
          <label class="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="insurance-acknowledgement"
              value="yes"
              required
              class="mt-1 w-5 h-5 bg-charcoal border-2 border-white/30 checked:bg-gold checked:border-gold focus:outline-none transition-colors cursor-pointer"
            />
            <span class="text-white/80 text-[14px] leading-relaxed group-hover:text-white transition-colors">
              I understand that renters are responsible for maintaining their own professional liability insurance policy. *
            </span>
          </label>
        </div>

        <!-- Submit -->
        <div class="pt-2">
          <button type="submit" class="btn-gold w-full md:w-auto md:min-w-[280px]">
            Submit Application
          </button>
        </div>

        <p class="text-[#666] text-[12px]">
          * Required fields. We'll respond within 48 hours to schedule a tour.
        </p>
      </form>
    </div>
  </section>

  <!-- ── Bottom CTA bar ────────────────────────────────────────── -->
  <section class="bg-charcoal border-t border-white/5 py-12 px-6">
    <div class="max-w-[960px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div>
        <span class="kicker">Have Questions?</span>
        <p class="text-white text-[16px] font-serif">We're happy to walk you through the details before you apply.</p>
      </div>
      <div class="flex gap-4 flex-wrap justify-center">
        <a href="tel:+18449417673" class="btn-outline-gold">
          (844) 941-7673
        </a>
        <a href="mailto:info@houseofrosefl.com" class="btn-outline-white">
          Email Us
        </a>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  select option {
    background-color: #1a1816;
    color: white;
  }

  input:focus,
  textarea:focus,
  select:focus,
  input[type="checkbox"]:focus {
    outline: 2px solid #C9A063;
    outline-offset: 2px;
  }
</style>
```

- [ ] **Step 2: Verify the file was created and builds without error**

Run: `cd packages/web && npx astro check 2>&1 | tail -20`

Expected: no TypeScript or Astro errors on `rent-a-room.astro`

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/pages/rent-a-room.astro
git commit -m "feat: add /rent-a-room suite rental page with application form"
```

---

### Task 2: Add "Rent a Suite" nav link to Header

**Files:**
- Modify: `packages/web/src/components/Header.astro`

Add the link to both the desktop nav and the mobile drawer. Position it between "Contact" and the "Book Now" CTA button in desktop, and between "Contact" and "Book Now" in mobile.

- [ ] **Step 1: Add to desktop nav — insert after the Contact `<a>` block and before the Book Now `<a>` block**

In `packages/web/src/components/Header.astro`, find the desktop nav section. After the Contact link (ends at `</a>`) and before the Book Now CTA link, insert:

```html
      <a
        href="/rent-a-room"
        class={`nav-link text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${
          isActive('/rent-a-room') ? 'text-gold' : 'text-white/90 hover:text-gold'
        }`}
      >
        Rent a Suite
      </a>
```

- [ ] **Step 2: Add to mobile drawer — insert after the Contact mobile link and before the Book Now mobile CTA**

In the same file, in the `#mobile-drawer` nav section, after the Contact `<a>` and before the Book Now mobile CTA, insert:

```html
      <a
        href="/rent-a-room"
        class="mobile-nav-link text-[13px] tracking-[0.22em] uppercase text-white/75 py-3 w-full text-center min-h-[48px] flex items-center justify-center"
      >
        Rent a Suite
      </a>
```

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/components/Header.astro
git commit -m "feat: add Rent a Suite nav link to header"
```

---

### Task 3: Add `/rent-a-room` to sitemap

**Files:**
- Modify: `packages/web/src/pages/sitemap.xml.ts`

Add the new static route to the `staticPages` array.

- [ ] **Step 1: Add the entry to `staticPages`**

In `packages/web/src/pages/sitemap.xml.ts`, find the `staticPages` array. Add after the `/contact` entry:

```ts
    { loc: `${baseUrl}/rent-a-room`, priority: '0.7', changefreq: 'monthly', lastmod: now },
```

- [ ] **Step 2: Verify the sitemap builds**

Run: `cd packages/web && npx astro check 2>&1 | tail -10`

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/pages/sitemap.xml.ts
git commit -m "feat: add /rent-a-room to sitemap"
```

---

## Self-Review

**Spec coverage:**
- ✅ Room specs: 10×14, $850–$1,100/mo, no utilities, sink, product shelf — in Room Specifications section
- ✅ No competing services = guaranteed clientele — in Perks grid (perk 1)
- ✅ Listed as team member — in Perks grid (perk 2)
- ✅ Business directed to them — in Perks grid (perk 3)
- ✅ Shop runs ads — in Perks grid (perk 4)
- ✅ Insurance required (renter's own) — in Room Specifications and application form checkbox
- ✅ Target audience: aestheticians, massage specialists, PMU artists — in "Who We're Looking For" section
- ✅ Application form with relevant fields (specialty, license, experience, message)
- ✅ Attractive luxury page design matching existing brand (charcoal/gold, serif headings, kicker labels)
- ✅ Navigation updated (Task 2)
- ✅ Sitemap updated (Task 3)

**Placeholder scan:** No TBDs, todos, or vague instructions — all code blocks are complete and self-contained.

**Type consistency:** No TypeScript types introduced — page is pure Astro markup. No cross-task type references.
