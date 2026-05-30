House of Rose Luxury Redesign Implementation Plan
For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

Goal: Ship an approved luxury redesign across Home, Services Hub, Service Detail, and Experience with responsive full-bleed composition and sticky shrinking header behavior.

Architecture: Keep the existing App Router structure and data authorities (Sanity content, Medusa pricing signal), while replacing presentation composition and header behavior. Introduce a single client header behavior controller and a stricter CSS system for edge-to-edge sections and viewport-specific behavior. Verify with Playwright smoke coverage for header transitions and responsive layout regressions.

Tech Stack: Next.js 16 (App Router), React 19, TypeScript, global CSS, Playwright end-to-end smoke tests.

File Structure Lock-In
Create
src/components/StickySiteHeader.tsx (client header behavior: transparent/solid transition + shrink state + mobile trigger)
src/components/MobileNavDrawer.tsx (mobile navigation menu presentation)
tests/layout/header-behavior.spec.ts (header transition and shrink checks)
tests/layout/responsive-pages.spec.ts (mobile/tablet/desktop smoke checks)
playwright.config.ts (test runner configuration)
Modify
src/components/SiteChrome.tsx (replace current header export usage with sticky behavior component entrypoint)
src/app/globals.css (remove framed/card styling in primary sections, enforce full-bleed + no-radius major surfaces)
src/app/page.tsx (approved section sequence and full-bleed structure)
src/app/services/page.tsx (services hub structure)
src/app/services/[slug]/page.tsx (service detail sequence)
src/app/experience/page.tsx (experience narrative sequence)
package.json (add Playwright scripts)
.gitignore (add Playwright artifacts if missing)
Docs
docs/superpowers/specs/2026-04-23-house-of-rose-luxury-site-redesign-design.md (mark implementation complete later)
Task 1: Add Regression Test Harness (Playwright)
Files:

Create: playwright.config.ts

Create: tests/layout/header-behavior.spec.ts

Modify: package.json

Test: tests/layout/header-behavior.spec.ts

 Step 1: Write the failing test

// tests/layout/header-behavior.spec.ts
import { expect, test } from "@playwright/test";

test("header transitions from transparent to solid and shrinks after hero scroll", async ({ page }) => {
  await page.goto("/");

  const header = page.locator("header.lux-header");
  await expect(header).toBeVisible();

  const before = await header.getAttribute("data-header-state");
  expect(before).toBe("over-hero");

  await page.mouse.wheel(0, 1400);

  const after = await header.getAttribute("data-header-state");
  expect(after).toBe("scrolled");
});
 Step 2: Run test to verify it fails
Run: npx playwright test tests/layout/header-behavior.spec.ts --project=chromium
Expected: FAIL because data-header-state is not implemented yet.

 Step 3: Add minimal test tooling setup
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://127.0.0.1:3000" },
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
// package.json (scripts)
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed"
  }
}
 Step 4: Run test to verify toolchain is active
Run: npm run test:e2e -- tests/layout/header-behavior.spec.ts
Expected: FAIL for behavior assertion (not infra errors).

 Step 5: Commit
git add playwright.config.ts tests/layout/header-behavior.spec.ts package.json package-lock.json
git commit -m "test: add playwright harness for layout/header regression checks"
Task 2: Implement Sticky Shrinking Header + Mobile Variant
Files:

Create: src/components/StickySiteHeader.tsx

Create: src/components/MobileNavDrawer.tsx

Modify: src/components/SiteChrome.tsx

Modify: src/app/globals.css

Test: tests/layout/header-behavior.spec.ts

 Step 1: Write the failing behavior assertions

// tests/layout/header-behavior.spec.ts (add)
test("mobile header remains sticky with compact nav trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.locator("button[data-mobile-nav-trigger]");
  await expect(trigger).toBeVisible();

  await page.mouse.wheel(0, 1200);
  await expect(page.locator("header.lux-header")).toHaveAttribute("data-header-size", "compact");
});
 Step 2: Run test to verify it fails
Run: npm run test:e2e -- tests/layout/header-behavior.spec.ts
Expected: FAIL for missing data-mobile-nav-trigger and data-header-size.

 Step 3: Implement minimal sticky header controller
// src/components/StickySiteHeader.tsx
"use client";
import { useEffect, useState } from "react";

export function StickySiteHeader(/* props */) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="lux-header"
      data-header-state={scrolled ? "scrolled" : "over-hero"}
      data-header-size={scrolled ? "compact" : "full"}
    >
      {/* nav */}
      <button data-mobile-nav-trigger type="button" aria-label="Open navigation">Menu</button>
    </header>
  );
}
/* src/app/globals.css */
.lux-header[data-header-state="over-hero"] { background: transparent; }
.lux-header[data-header-state="scrolled"] { background: #13100d; }
.lux-header[data-header-size="full"] .lux-header-inner { min-height: 64px; }
.lux-header[data-header-size="compact"] .lux-header-inner { min-height: 52px; }
 Step 4: Run tests to verify pass
Run: npm run test:e2e -- tests/layout/header-behavior.spec.ts
Expected: PASS.

 Step 5: Commit
git add src/components/StickySiteHeader.tsx src/components/MobileNavDrawer.tsx src/components/SiteChrome.tsx src/app/globals.css tests/layout/header-behavior.spec.ts
git commit -m "feat: add sticky shrinking header with transparent-to-solid transition"
Task 3: Recompose Home Page to Approved Edge-to-Edge Sequence
Files:

Modify: src/app/page.tsx

Modify: src/app/globals.css

Create: tests/layout/responsive-pages.spec.ts

Test: tests/layout/responsive-pages.spec.ts

 Step 1: Write failing layout checks

// tests/layout/responsive-pages.spec.ts
import { expect, test } from "@playwright/test";

test("home hero and full-bleed sections render without framed margins", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section[data-section='home-hero']");
  await expect(hero).toBeVisible();
  await expect(hero).toHaveCSS("border-radius", "0px");
});
 Step 2: Run test to verify it fails
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: FAIL because data-section='home-hero' and no-radius rules are missing.

 Step 3: Implement approved section order and full-bleed structure
// src/app/page.tsx (structure markers)
<section data-section="home-hero" className="lux-hero lux-bleed">...</section>
<section data-section="home-split" className="lux-split lux-bleed">...</section>
<section data-section="home-full-image" className="lux-full-image lux-bleed">...</section>
<section data-section="home-service-preview">...</section>
<section data-section="home-experience-teaser">...</section>
<section data-section="home-contact">...</section>
/* src/app/globals.css */
.lux-bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); }
.lux-hero, .lux-full-image { border-radius: 0; }
 Step 4: Run tests to verify pass
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: PASS for home section shape checks.

 Step 5: Commit
git add src/app/page.tsx src/app/globals.css tests/layout/responsive-pages.spec.ts
git commit -m "feat: rebuild home page with approved full-bleed luxury sequence"
Task 4: Rebuild Services Hub and Service Detail Composition
Files:

Modify: src/app/services/page.tsx

Modify: src/app/services/[slug]/page.tsx

Modify: src/app/globals.css

Test: tests/layout/responsive-pages.spec.ts

 Step 1: Write failing route layout checks

// tests/layout/responsive-pages.spec.ts (add)
test("services hub and detail pages expose required section markers", async ({ page }) => {
  await page.goto("/services");
  await expect(page.locator("section[data-section='services-hero']")).toBeVisible();

  await page.goto("/services/injectables");
  await expect(page.locator("section[data-section='service-detail-process']")).toBeVisible();
  await expect(page.locator("section[data-section='service-detail-faq']")).toBeVisible();
});
 Step 2: Run tests to verify they fail
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: FAIL for missing markers/sections.

 Step 3: Implement page sequence updates
// src/app/services/page.tsx
<section data-section="services-hero" className="lux-hero lux-bleed">...</section>
<section data-section="services-index">...</section>
<section data-section="services-how-to-choose">...</section>
<section data-section="services-cta">...</section>
// src/app/services/[slug]/page.tsx
<section data-section="service-detail-hero" className="lux-hero lux-bleed">...</section>
<section data-section="service-detail-intro">...</section>
<section data-section="service-detail-process">...</section>
<section data-section="service-detail-faq">...</section>
<section data-section="service-detail-related">...</section>
<section data-section="service-detail-cta">...</section>
 Step 4: Run tests to verify pass
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: PASS for services and detail section checks.

 Step 5: Commit
git add src/app/services/page.tsx src/app/services/[slug]/page.tsx src/app/globals.css tests/layout/responsive-pages.spec.ts
git commit -m "feat: align services hub and detail pages to approved information architecture"
Task 5: Rebuild Experience Page + Responsive Stability Pass
Files:

Modify: src/app/experience/page.tsx

Modify: src/app/globals.css

Test: tests/layout/responsive-pages.spec.ts

 Step 1: Write failing experience + viewport checks

// tests/layout/responsive-pages.spec.ts (add)
const viewports = [
  { width: 320, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`experience page has no horizontal overflow at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/experience");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}
 Step 2: Run tests to verify they fail
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: FAIL if overflow/structure issues remain.

 Step 3: Implement experience sequence and responsive cleanup
// src/app/experience/page.tsx
<section data-section="experience-hero" className="lux-hero lux-bleed">...</section>
<section data-section="experience-philosophy">...</section>
<section data-section="experience-journey">...</section>
<section data-section="experience-cta">...</section>
/* src/app/globals.css */
html, body { overflow-x: clip; }
.lux-hero img, .lux-full-image img { object-fit: cover; object-position: center; }
 Step 4: Run tests to verify pass
Run: npm run test:e2e -- tests/layout/responsive-pages.spec.ts
Expected: PASS for all viewport overflow checks.

 Step 5: Commit
git add src/app/experience/page.tsx src/app/globals.css tests/layout/responsive-pages.spec.ts
git commit -m "feat: finalize experience page composition and responsive stability"
Task 6: Final Verification, Accessibility Spot Check, and Documentation
Files:

Modify: README.md

Modify: docs/superpowers/specs/2026-04-23-house-of-rose-luxury-site-redesign-design.md

Test: full repository validation

 Step 1: Add failing validation checkpoint in CI script notes

# README.md
## Validation
- npm run lint
- npm run build
- npm run test:e2e
 Step 2: Run full verification before final docs update
Run: npm run lint && npm run build && npm run test:e2e
Expected: initial FAIL if any regression remains.

 Step 3: Fix residual issues and mark spec completion notes
# docs/superpowers/specs/2026-04-23-house-of-rose-luxury-site-redesign-design.md
## Implementation Status
- [x] Header transition and shrink behavior
- [x] Full-bleed section composition
- [x] Responsive acceptance checks at 320/768/1440
 Step 4: Re-run full verification to green
Run: npm run lint && npm run build && npm run test:e2e
Expected: PASS across all commands.

 Step 5: Commit
git add README.md docs/superpowers/specs/2026-04-23-house-of-rose-luxury-site-redesign-design.md
git commit -m "docs: add verification workflow and mark redesign implementation complete"
Self-Review Checklist
Spec coverage
Covered all approved pages: Home, Services Hub, Service Detail, Experience, Contact conversion blocks.
Covered approved visual rules: edge-to-edge major sections, no rounded major surfaces, no framed first-view style.
Covered approved header behavior: transparent over hero, sticky shrink, solid after threshold.
Covered responsive expectations with explicit viewport checks.
Placeholder scan
No TODO/TBD markers in tasks.
Every code-changing step includes concrete code blocks.
Every task includes executable commands and expected outcomes.
Type/contract consistency
Header state contract standardized with data-header-state and data-header-size.
Section marker convention standardized with data-section attributes across pages.
Test selectors depend on stable attributes rather than brittle visual text.