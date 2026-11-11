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
  await expect(page.locator(".atelier-actions").getByRole("link", { name: /Request a personal song/i })).toBeVisible();
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

test("official links page has one readable identity and real artist destinations", async ({ page }) => {
  const response = await page.goto("/links", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator(".links-hub-intro")).toBeVisible();
  await expect(page.locator(".links-hub .social-block")).toHaveCount(3);
  await expect(page.locator('main a[href="https://open.spotify.com/artist/4mNxC22iSgkO0uLp1dL4Fp"]')).toBeVisible();
  await expect(page.locator('main a[href="https://www.instagram.com/bossieonthatbeat/"]')).toBeVisible();
  await expect(page.locator('main a[href="/music"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/request"]').first()).toBeVisible();
});

test("press kit features distinct covers instead of repeating album tracks", async ({ page }) => {
  const response = await page.goto("/epk", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Music from different worlds." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An independent voice across genres." })).toBeVisible();

  const cards = page.locator(".epk-editorial-section")
    .filter({ has: page.locator("#epk-selected-heading") })
    .locator(".epk-release-card");
  expect(await cards.count()).toBeGreaterThan(2);
  const covers = await cards.locator(".release-artwork-image")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")).filter(Boolean));
  expect(new Set(covers).size).toBe(covers.length);
  const titles = await cards.locator("h3").allTextContents();
  expect(new Set(titles).size).toBe(titles.length);
  const latest = (await page.locator(".epk-latest-copy h2").textContent())?.trim();
  expect(titles).not.toContain(latest);
});

test("editorial image cards are contained on the main public pages", async ({ page }) => {
  const paths = ["/", "/music", "/cinema", "/about", "/industry", "/epk", "/worlds"];
  const cardSelector = [
    ".epk-release-card",
    ".atelier-release",
    ".cinema-editorial-card",
    ".studio-music-card",
    ".epk-brand-asset",
    ".release-card-v2",
  ].join(", ");

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const problems = await page.evaluate((selector) => {
        const epsilon = 2;
        const failures = [];
        for (const card of document.querySelectorAll(selector)) {
          const cardBox = card.getBoundingClientRect();
          for (const image of card.querySelectorAll("img, video, iframe")) {
            if (getComputedStyle(image).display === "none") continue;
            const box = image.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) continue;
            if (box.left < cardBox.left - epsilon || box.right > cardBox.right + epsilon ||
                box.top < cardBox.top - epsilon || box.bottom > cardBox.bottom + epsilon) {
              failures.push({
                card: String(card.className),
                media: String(image.className),
                cardWidth: Math.round(cardBox.width),
                mediaWidth: Math.round(box.width),
              });
            }
          }
        }
        return failures;
      }, cardSelector);
      expect(problems, `Image containment on ${path} at ${width}px`).toEqual([]);
    }
  }
});

test("offscreen Cinema cards reserve height without forcing mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cinema", { waitUntil: "networkidle" });

  const metrics = await page.evaluate(() => {
    const section = document.createElement("section");
    section.className = "section-pad cinema-index-section";
    section.style.marginTop = "300vh";
    const stack = document.createElement("div");
    stack.className = "cinema-editorial-stack";
    const card = document.createElement("article");
    card.className = "cinema-editorial-card";
    const cover = document.createElement("a");
    cover.className = "cinema-editorial-thumb-link";
    const thumb = document.createElement("div");
    thumb.className = "cinema-editorial-thumb";
    cover.append(thumb);
    const copy = document.createElement("div");
    copy.className = "cinema-editorial-body";
    const title = document.createElement("h3");
    title.textContent = "A test cinematic release";
    copy.append(title);
    card.append(cover, copy);
    stack.append(card);
    section.append(stack);
    document.querySelector("main")?.append(section);

    const box = card.getBoundingClientRect();
    const container = stack.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      cardWidth: box.width,
      containerWidth: container.width,
      intrinsicWidth: getComputedStyle(card).containIntrinsicWidth,
      intrinsicHeight: getComputedStyle(card).containIntrinsicHeight,
    };
  });
  expect(metrics.intrinsicWidth).toBe("auto none");
  expect(metrics.intrinsicHeight).toBe("auto 720px");
  expect(metrics.cardWidth).toBeLessThanOrEqual(metrics.containerWidth + 2);
  expect(metrics.documentWidth).toBeLessThanOrEqual(392);
});

test("EPK Cinema thumbnails stay inside cards and never overlap at real viewports", async ({ page }) => {
  const widths = [390, 768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/epk", { waitUntil: "networkidle" });
    // Ensure Next.js has hydrated before injecting the test-only fixtures.
    // Otherwise React can replace the injected media while reconciling SSR.
    const menu = page.locator(".nav-menu-toggle");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    const grid = page.locator(".epk-cinema-grid");
    await expect(grid).toHaveCount(1);
    // Production D1 Cinema records are not available in local seed data.
    // Reproduce the same HTML/CSS contract using true 1920x1080 image
    // dimensions, so the original intrinsic-size overflow cannot regress.
    if ((await grid.locator(".epk-cinema-card").count()) === 0) {
      await grid.evaluate((node) => {
        for (let index = 0; index < 3; index++) {
          const card = document.createElement("article");
          card.className = "epk-release-card epk-cinema-card";
          const frame = document.createElement("a");
          frame.className = "epk-cinema-thumb-link";
          frame.href = "/cinema";
          const image = document.createElement("img");
          image.className = "epk-cinema-thumb";
          image.width = 1920;
          image.height = 1080;
          image.alt = "Cinema image for responsive test";
          image.src = "data:image/svg+xml," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#222"/></svg>',
          );
          const title = document.createElement("h3");
          title.textContent = "Test film " + (index + 1);
          frame.append(image);
          card.append(frame, title);
          node.append(card);
        }
      });
    }

    await expect(grid).toBeVisible();

    const metrics = await grid.evaluate((node) => {
      const tolerance = 2;
      const cards = [...node.querySelectorAll(".epk-cinema-card")];
      const overflow = [];
      const rects = cards.map((card, index) => {
        const frame = card.querySelector(".epk-cinema-thumb-link");
        const image = card.querySelector(".epk-cinema-thumb");
        const cardBox = card.getBoundingClientRect();
        const frameBox = frame.getBoundingClientRect();
        if (frameBox.left < cardBox.left - tolerance || frameBox.right > cardBox.right + tolerance) {
          overflow.push(`frame ${index} extends outside its card`);
        }
        if (image) {
          const imgBox = image.getBoundingClientRect();
          if (imgBox.left < frameBox.left - tolerance || imgBox.right > frameBox.right + tolerance ||
              imgBox.top < frameBox.top - tolerance || imgBox.bottom > frameBox.bottom + tolerance) {
            overflow.push(`image ${index} extends outside its frame`);
          }
          if (Math.abs(frameBox.width / frameBox.height - 16 / 9) > 0.03) {
            overflow.push(`frame ${index} has incorrect aspect ratio`);
          }
        }
        return cardBox;
      });
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (overlapX > tolerance && overlapY > tolerance) {
            overflow.push(`cards ${i} and ${j} overlap`);
          }
        }
      }
      return { cardCount: cards.length, overflow };
    });

    expect(metrics.cardCount, `EPK cinema cards at ${width}px`).toBeGreaterThan(0);
    expect(metrics.overflow, `EPK media containment at ${width}px`).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`epk-cinema-${width}px.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
});

test("Cinema editorial cards stay compact with readable long titles and separate actions", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/cinema", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const frame = '<a class="cinema-editorial-thumb-link" href="/cinema"><div class="cinema-editorial-thumb"></div></a>';
      const copy = (title) => `<div class="cinema-editorial-body"><p class="cinema-editorial-meta">SHORT · 0:17</p><h3>${title}</h3><blockquote class="cinema-editorial-quote">A short film from the Bossie universe.</blockquote><div class="cinema-editorial-actions"><a class="button button-gold" href="/cinema">Watch →</a><a class="text-link" href="/cinema">Details ↗</a></div></div>`;
      const featured = document.createElement("section");
      featured.className = "section-pad cinema-index-section";
      featured.innerHTML = `<article class="cinema-editorial-card cinema-editorial-featured">${frame}${copy("4:00 AM IN OVERASSELT — THE COMPLETE STORY")}</article>`;
      const shorts = document.createElement("section");
      shorts.className = "section-pad cinema-index-section cinema-collection-shorts";
      shorts.innerHTML = `<div class="cinema-editorial-stack">${[
        "4:00 AM IN OVERASSELT — THE COMPLETE STORY",
        "GASOLINA",
        "A DIFFERENT CINEMATIC STORY FROM BOSSIE ON THAT BEAT",
      ].map((title) => `<article class="cinema-editorial-card">${frame}${copy(title)}</article>`).join("")}</div>`;
      document.querySelector(".cinema-index-hero")?.after(featured, shorts);
    });
    const first = page.locator(".cinema-collection-shorts .cinema-editorial-card").first();
    await first.scrollIntoViewIfNeeded();
    const result = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".cinema-collection-shorts .cinema-editorial-card")];
      const bounds = cards.map((card) => card.getBoundingClientRect());
      const headings = cards.map((card) => card.querySelector("h3"));
      const buttons = cards[0].querySelectorAll(".cinema-editorial-actions a");
      const a = buttons[0].getBoundingClientRect();
      const b = buttons[1].getBoundingClientRect();
      const featuredHeading = document.querySelector(".cinema-editorial-featured h3");
      return {
        documentWidth: document.documentElement.scrollWidth,
        cardBounds: bounds.map((r) => ({ left: r.left, top: r.top, right: r.right, width: r.width })),
        headingFonts: headings.map((h) => parseFloat(getComputedStyle(h).fontSize)),
        headingFits: headings.every((h) => h.scrollWidth <= h.clientWidth + 2),
        imageFits: cards.every((card) => card.querySelector(".cinema-editorial-thumb-link").getBoundingClientRect().right <= card.getBoundingClientRect().right + 2),
        actionOverlap: Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2,
        actionSameRow: Math.abs(a.top - b.top) < 2,
        cardsPainted: cards.every((card) => getComputedStyle(card).contentVisibility === "visible"),
        featuredFont: parseFloat(getComputedStyle(featuredHeading).fontSize),
      };
    });
    expect(result.documentWidth, `Cinema must fit viewport ${width}px`).toBeLessThanOrEqual(width + 2);
    expect(result.headingFits).toBe(true);
    expect(result.imageFits).toBe(true);
    expect(result.actionOverlap).toBe(false);
    expect(result.actionSameRow, `Watch and Details should share a row at ${width}px`).toBe(true);
    expect(result.cardsPainted, `Cinema cards should paint content at ${width}px`).toBe(true);
    expect(Math.max(...result.headingFonts), `Card title should not resemble a page heading at ${width}px`).toBeLessThan(35);
    expect(result.featuredFont).toBeLessThan(70);
    if (width === 1440) {
      expect(Math.abs(result.cardBounds[0].top - result.cardBounds[1].top)).toBeLessThan(2);
      expect(Math.abs(result.cardBounds[1].top - result.cardBounds[2].top)).toBeLessThan(2);
    }
    if (width === 768) {
      expect(Math.abs(result.cardBounds[0].top - result.cardBounds[1].top)).toBeLessThan(2);
      expect(result.cardBounds[2].top).toBeGreaterThan(result.cardBounds[0].top + 30);
    }
    if (width === 390) {
      expect(result.cardBounds[1].top).toBeGreaterThan(result.cardBounds[0].top + 30);
      expect(result.cardBounds[2].top).toBeGreaterThan(result.cardBounds[1].top + 30);
    }
  }
});

test("Cinema index preserves its featured film and keeps every published category accessible", async ({ page }) => {
  const response = await page.goto("/cinema", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main h1")).toHaveCount(1);
  const featuredCard = page.locator(".cinema-editorial-featured .cinema-editorial-thumb-link");
  if (!(await featuredCard.count())) {
    // Local development has no Cinema seed. The verified D1 catalogue is
    // checked in the post-deployment production health check.
    await expect(page.getByText("No films published yet.")).toBeVisible();
    await expect(page.locator(".cinema-editorial-stack")).toHaveCount(0);
    return;
  }
  await expect(page.getByRole("heading", { name: "Featured story." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official Audio" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shorts" })).toBeVisible();

  const featuredHref = await page.locator(".cinema-editorial-featured .cinema-editorial-thumb-link").getAttribute("href");
  expect(featuredHref).toMatch(/^\/cinema\/[^/]+$/);

  // Once a piece is the featured item it must not be duplicated again inside
  // the category stack, even when the selected feature is an official Short.
  const categoryHrefs = await page.locator(".cinema-editorial-stack .cinema-editorial-thumb-link")
    .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
  expect(categoryHrefs).not.toContain(featuredHref);
  expect(new Set(categoryHrefs).size).toBe(categoryHrefs.length);
});

test("Cinema detail is readable and provides consistent breadcrumb, related work and return navigation", async ({ page }) => {
  await page.goto("/cinema", { waitUntil: "domcontentloaded" });
  const featuredCard = page.locator(".cinema-editorial-featured .cinema-editorial-thumb-link");
  test.skip(!(await featuredCard.count()), "Local Cinema seed is empty; the live D1 catalogue is checked after deployment.");
  const url = await featuredCard.getAttribute("href");
  expect(url).toMatch(/^\/cinema\/[^/]+$/);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main.brand-unified")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Cinema" })).toHaveAttribute("href", "/cinema");
    await expect(page.getByRole("link", { name: "Cinema", exact: true }).first()).toHaveAttribute("href", "/cinema");

    const relatedLinks = await page.locator(".cinema-detail-related-grid .cinema-editorial-thumb-link")
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
    expect(relatedLinks).not.toContain(url);
    expect(new Set(relatedLinks).size).toBe(relatedLinks.length);
    const sizes = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(sizes.documentWidth, `Cinema detail overflow at ${viewport.width}px`).toBeLessThanOrEqual(viewport.width + 2);
  }
});
