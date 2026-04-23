import { expect, test, type Locator, type Page } from "@playwright/test";

const VIEWPORTS = [
  { name: "desktop", size: { width: 1440, height: 1200 } },
  { name: "mobile", size: { width: 390, height: 844 } },
] as const;
const LIGHT_HERO_FOREGROUND = "rgb(248, 239, 228)";

async function expectFullBleed(page: Page, locator: Locator) {
  const viewport = page.viewportSize();

  expect(viewport).not.toBeNull();

  const box = await locator.boundingBox();

  expect(box).not.toBeNull();

  if (!viewport || !box) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x).toBeLessThanOrEqual(1);
  expect(box.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.x + box.width).toBeGreaterThanOrEqual(viewport.width - 1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
}

for (const viewport of VIEWPORTS) {
  test.describe(`responsive full-bleed layout (${viewport.name})`, () => {
    test.use({ viewport: viewport.size });

    test("home edge-to-edge sections reach the viewport bounds", async ({ page }) => {
      await page.goto("/");

      const hero = page.locator("section[data-section='home-hero']");
      const split = page.locator("section[data-section='home-split']");
      const fullImage = page.locator("section[data-section='home-full-image']");
      const servicePreview = page.locator("section[data-section='home-service-preview']");
      const experienceTeaser = page.locator(
        "section[data-section='home-experience-teaser']",
      );
      const contact = page.locator("section[data-section='home-contact']");

      await expect(hero).toBeVisible();
      await expect(split).toBeVisible();
      await expect(fullImage).toBeVisible();
      await expect(servicePreview).toBeVisible();
      await expect(experienceTeaser).toBeVisible();
      await expect(contact).toBeVisible();

      await expect(hero).toHaveCSS("border-radius", "0px");
      await expect(fullImage).toHaveCSS("border-radius", "0px");

      await expectFullBleed(page, hero);
      await expectFullBleed(page, split);
      await expectFullBleed(page, fullImage);
    });

    test("services hero reaches the viewport bounds", async ({ page }) => {
      await page.goto("/services");

      const hero = page.locator("main > section").first();
      const heading = page.locator("section[data-section='services-hero'] h1");

      await expect(hero).toBeVisible();
      await expect(heading).toBeVisible();
      await expect(hero).toHaveClass(/lux-hero/);
      await expect(hero).toHaveCSS("border-radius", "0px");
      await expect(heading).toHaveCSS("color", LIGHT_HERO_FOREGROUND);
      await expect(heading).not.toHaveCSS("color", "rgb(39, 29, 22)");
      await expectFullBleed(page, hero);
    });

    test("services hub and detail pages expose required section markers", async ({
      page,
    }) => {
      await page.goto("/services");
      await expect(page.locator("section[data-section='services-hero']")).toBeVisible();
      await expect(page.locator("section[data-section='services-index']")).toBeVisible();
      await expect(
        page.locator("section[data-section='services-how-to-choose']"),
      ).toBeVisible();
      await expect(page.locator("section[data-section='services-cta']")).toBeVisible();

      await page.goto("/services/injectables");
      const serviceHeading = page.locator("section[data-section='service-detail-hero'] h1");
      await expect(
        page.locator("section[data-section='service-detail-hero']"),
      ).toBeVisible();
      await expect(serviceHeading).toBeVisible();
      await expect(serviceHeading).toHaveCSS("color", LIGHT_HERO_FOREGROUND);
      await expect(serviceHeading).not.toHaveCSS("color", "rgb(39, 29, 22)");
      await expect(
        page.locator("section[data-section='service-detail-intro']"),
      ).toBeVisible();
      await expect(
        page.locator("section[data-section='service-detail-process']"),
      ).toBeVisible();
      await expect(
        page.locator("section[data-section='service-detail-faq']"),
      ).toBeVisible();
      await expect(
        page.locator("section[data-section='service-detail-related']"),
      ).toBeVisible();
      await expect(
        page.locator("section[data-section='service-detail-cta']"),
      ).toBeVisible();
    });

    test("experience hero reaches the viewport bounds", async ({ page }) => {
      await page.goto("/experience");

      const hero = page.locator("main > section").first();

      await expect(hero).toBeVisible();
      await expect(hero).toHaveClass(/lux-hero/);
      await expect(hero).toHaveCSS("border-radius", "0px");
      await expectFullBleed(page, hero);
    });
  });
}

const EXPERIENCE_OVERFLOW_VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;

for (const viewport of EXPERIENCE_OVERFLOW_VIEWPORTS) {
  test(`experience page has no horizontal overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/experience");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );

    expect(overflow).toBe(false);
  });
}
