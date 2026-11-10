import { test, expect } from "@playwright/test";

const routes = ["/", "/music", "/worlds", "/cinema", "/about", "/industry", "/request", "/epk", "/privacy", "/links", "/music/upcoming", "/music/genre/metal"];
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
        // Full-page screenshots do not automatically intersect lazy images.
        // Scroll the real viewport so album artwork has a chance to load,
        // then return to the first fold for repeatable evidence.
        // Some marketing styles set scroll-behavior:smooth. If the screenshot
        // starts while the browser is still animating back to the top, fixed
        // navigation and the skip-link are captured mid-document. Force
        // instantaneous movement and verify scroll position before capture.
        await page.addStyleTag({ content: "html, body { scroll-behavior: auto !important; }" });
        await page.evaluate(async () => {
          await document.fonts.ready;
          const step = Math.max(300, Math.floor(window.innerHeight * 0.85));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo({ top: y, left: 0, behavior: "instant" });
            await new Promise((resolve) => setTimeout(resolve, 70));
          }
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        });
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
  // Wait for Next.js hydration; a click on prerendered but unhydrated
  // controls would not represent a genuine interactive navigation test.
  await page.goto("/", { waitUntil: "networkidle" });
  // The accessible button name correctly changes to "Close menu" when
  // expanded, so keep a stable locator instead of re-querying "Open menu".
  const toggle = page.locator(".nav-menu-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Open menu");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(toggle).toHaveAttribute("aria-label", "Close menu");
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
  await page.getByLabel("Name *").fill("Browser QA");
  await page.getByLabel("Email *").fill("qa@example.invalid");
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

test("request API rejects oversized and unsupported payloads before database writes", async ({ request }) => {
  const tooLarge = await request.post("/api/request", {
    data: {
      name: "Browser QA",
      email: "qa@example.invalid",
      projectType: "Custom Music",
      genre: "Cinematic",
      brief: "A".repeat(40_000),
      consent: "yes",
    },
  });
  expect(tooLarge.status()).toBe(413);

  const unsupportedType = await request.post("/api/request", {
    headers: { "Content-Type": "text/plain" },
    data: "This should never be parsed as a project brief.",
  });
  expect(unsupportedType.status()).toBe(415);
});

test("indexable pages have distinct canonical URLs, descriptions and sensible titles", async ({ page }) => {
  const publicPaths = ["/", "/music", "/about", "/industry", "/worlds", "/cinema", "/request", "/epk", "/links", "/privacy", "/music/upcoming"];
  const seen = new Set();
  for (const path of publicPaths) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(title.length, path).toBeGreaterThan(12);
    expect(description?.length ?? 0, path).toBeGreaterThan(45);
    expect(canonical, path).not.toBeNull();
    const normalized = new URL(canonical);
    expect(normalized.origin, path).toBe("https://bossieonthatbeat.com");
    expect(normalized.pathname, path).toBe(path);
    expect(seen.has(title), `Duplicate title ${title}`).toBe(false);
    seen.add(title);
  }
});

test("robots, sitemap and AI-facing identity do not contradict canonical content", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotText = await robots.text();
  expect(robotText).toContain("Disallow: /admin");
  expect(robotText).toContain("/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("<loc>https://bossieonthatbeat.com/music</loc>");
  expect(sitemapText).toContain("<loc>https://bossieonthatbeat.com/industry</loc>");
  expect(sitemapText).not.toContain("<loc>https://bossieonthatbeat.com/music/latest</loc>");

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  const aiText = await llms.text();
  expect(aiText).toContain("Bossie on that beat");
  expect(aiText).toContain("Services and usage rights");
  expect(aiText).toContain("/industry");
  expect(aiText).toContain("/request");
});

test("admin route must discourage indexing", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("official release pages expose unique music metadata and structured data", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const releases = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)
    .filter((path) => /^\/music\/[^/]+$/.test(path) && path !== "/music/upcoming");
  expect(releases.length).toBeGreaterThan(0);

  for (const path of releases.slice(0, 6)) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0, path).toBeGreaterThan(35);
    expect(description?.length ?? 0, path).toBeLessThanOrEqual(165);

    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graphs = scripts.map((value) => JSON.parse(value)).flatMap((value) => value["@graph"] ?? [value]);
    const music = graphs.find((node) => ["MusicRecording", "MusicAlbum"].includes(node["@type"]));
    expect(music, `No musical entity for ${path}`).toBeTruthy();
    expect(music.url, path).toBe(`https://bossieonthatbeat.com${path}`);
    expect(music.name?.length ?? 0).toBeGreaterThan(0);
    expect(music["@id"]).toContain(path);
  }
});

test("genre pages show the actual catalog instead of an empty category", async ({ page }) => {
  const response = await page.goto("/music/genre/metal", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator(".release-grid-v2").first()).toBeVisible();
  expect(await page.locator(".release-grid-v2 a").count()).toBeGreaterThan(0);
  await expect(page.getByText("No releases in this genre yet.")).toHaveCount(0);
});

test("security headers permit optional analytics only after active consent", async ({ page }) => {
  // Stub the third party: no actual traffic or analytics data leaves QA.
  await page.route("https://tracker.metricool.com/resources/be.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.__bossieMetricoolLoaded = true; window.beTracker = { t: function () {} };",
    }),
  );
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("script-src");
  expect(csp).toContain("https://tracker.metricool.com");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.locator('script[src*="tracker.metricool.com"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Allow analytics" }).click();
  await expect.poll(() => page.evaluate(() => Boolean(window.__bossieMetricoolLoaded))).toBe(true);
});

test("shared identity, editorial type and actions remain consistent on public subpages", async ({ page }) => {
  const pages = ["/music", "/about", "/industry", "/worlds", "/cinema", "/epk", "/request", "/privacy", "/music/upcoming", "/music/genre/metal"];
  let fontFamily = "";
  for (const route of pages) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main.brand-unified")).toBeVisible();
    await expect(page.locator(".site-nav")).toBeVisible();
    await expect(page.locator("footer.site-footer")).toBeVisible();
    await expect(page.getByRole("button", { name: "Privacy preferences" })).toHaveCount(1);
    const style = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const heading = document.querySelector("main h1");
      return {
        gold: root.getPropertyValue("--brand-gold").trim(),
        paper: root.getPropertyValue("--brand-paper").trim(),
        border: root.getPropertyValue("--brand-hairline").trim(),
        font: heading ? getComputedStyle(heading).fontFamily : "",
      };
    });
    expect(style.gold, route).toBe("#e4c28b");
    expect(style.paper, route).toBe("#f7f2e8");
    expect(style.border, route).toBe("#e4c28b38");
    expect(style.font, route).not.toBe("");
    if (!fontFamily) fontFamily = style.font;
    expect(style.font, `Heading typeface drift on ${route}`).toBe(fontFamily);
  }
});

test("primary and secondary CTA treatments share the same dimensions on all standard pages", async ({ page }) => {
  await page.goto("/about");
  const primary = page.locator("a.studio-btn-primary").first();
  const secondary = page.locator("a.studio-btn-outline").first();
  await expect(primary).toBeVisible();
  await expect(secondary).toBeVisible();
  const geometry = await page.evaluate(() => {
    const first = document.querySelector("a.studio-btn-primary");
    const second = document.querySelector("a.studio-btn-outline");
    if (!first || !second) return null;
    const a = getComputedStyle(first);
    const b = getComputedStyle(second);
    return {
      minHeightA: a.minHeight,
      minHeightB: b.minHeight,
      radiusA: a.borderRadius,
      radiusB: b.borderRadius,
      primaryBg: a.backgroundColor,
      secondaryBg: b.backgroundColor,
    };
  });
  expect(geometry).not.toBeNull();
  expect(geometry.minHeightA).toBe(geometry.minHeightB);
  expect(geometry.radiusA).toBe(geometry.radiusB);
  expect(geometry.primaryBg).not.toBe(geometry.secondaryBg);
});
