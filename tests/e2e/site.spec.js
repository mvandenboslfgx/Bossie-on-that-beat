import { test, expect } from "@playwright/test";

const routes = ["/", "/music", "/worlds", "/cinema", "/about", "/industry", "/request", "/epk"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

// These tests do not submit customer enquiries or run checkout transactions.
for (const viewport of viewports) {
  test(`all public pages are readable without horizontal overflow — ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route} should be reachable at ${viewport.width}px`).toBe(200);
      await expect(page.locator("main").first()).toBeVisible();
      const result = await page.evaluate(() => ({
        width: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        headingCount: document.querySelectorAll("main h1").length,
      }));
      expect(result.documentWidth, `${route} document scrolls sideways at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 2);
      expect(result.headingCount, `${route} should have one main heading`).toBe(1);

      if (["/", "/music", "/request"].includes(route)) {
        // Keep real viewport evidence for design review on every change.
        const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
        await page.screenshot({
          path: testInfo.outputPath(`${viewport.name}-${name}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }
    }
  });
}

test("home makes listening and commissioning discoverable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Not just a beat.");
  await expect(page.locator(".atelier-feature")).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore the music/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Create your song/i }).first()).toBeVisible();
});

test("music discovery filters titles and supports restoring all releases", async ({ page }) => {
  await page.goto("/music");
  const search = page.getByRole("searchbox", { name: "Search releases" });
  await expect(search).toBeVisible();
  const initialCount = await page.locator("#bossie-releases article").count();
  expect(initialCount, "the local catalog fixture should expose artwork").toBeGreaterThan(0);

  await search.fill("completely-nonexistent-bossie-track-zzzzz");
  await expect(page.getByText("No releases match that search.")).toBeVisible();
  await page.getByRole("button", { name: /Show all releases/ }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator("#bossie-releases article").first()).toBeVisible();

  const filters = page.getByRole("group", { name: "Filter releases by genre" });
  const genreButtons = filters.locator("button");
  expect(await genreButtons.count()).toBeGreaterThan(1);
  await genreButtons.nth(1).click();
  await expect(genreButtons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await filters.getByRole("button", { name: "All sounds" }).click();
});

test("mobile navigation is keyboard accessible and dismissible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Cinema" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("prefilled licensing brief can reach review without submitting", async ({ page }) => {
  // No POST is ever made. Prevent accidental customer data writes even if
  // the form's submit button behaviour regresses.
  await page.route("**/api/request", (route) => route.abort());
  await page.goto("/request?type=licensing&track=QA%20Reference%20Track");
  await expect(page.getByRole("button", { name: /Existing Track Licensing/ }).first()).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Continue/ }).click();
  const recording = page.getByPlaceholder("Song or release title");
  await expect(recording).toHaveValue("QA Reference Track");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.locator('.wizard-panel textarea[required]').fill(
    "This is a non-commercial browser test description for a proposed film scene, its platforms and territory.",
  );
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("label", { name: "Name *" }).fill("Browser QA");
  await page.getByRole("label", { name: "Email *" }).fill("qa@example.invalid");
  await page.getByText("I agree my details may be used").click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("heading", { name: "Review your request" })).toBeVisible();
  await expect(page.getByText("QA Reference Track").first()).toBeVisible();
});

test("optional analytics is not loaded before explicit consent", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Analytics preferences" })).toBeVisible();
  await expect(page.locator('script[src*="tracker.metricool.com"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Essential only" }).click();
  await expect(page.getByRole("region", { name: "Analytics preferences" })).not.toBeVisible();
  await expect(page.locator('script[src*="tracker.metricool.com"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Privacy preferences" }).click();
  await expect(page.getByRole("region", { name: "Analytics preferences" })).toBeVisible();
});

test("request API refuses incomplete submissions without writing to D1", async ({ request }) => {
  const response = await request.post("/api/request", {
    data: {
      name: "Browser QA",
      email: "qa@example.invalid",
      projectType: "Custom Music",
      brief: "Too short",
      consent: "yes",
    },
  });
  expect(response.status()).toBe(400);
});
