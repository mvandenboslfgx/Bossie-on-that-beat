import { test, expect } from "@playwright/test";

// Read-only production inspection. This job runs only after the Bossie Worker
// deploy and the existing HTTP/content health gate have succeeded.
test("live Bossie pages retain responsive media bounds and Cinema content", async ({ page }, testInfo) => {
  test.skip(!process.env.BOSSIE_PRODUCTION_VISUAL, "Runs only after production deploy");

  const paths = ["/", "/music", "/worlds", "/cinema", "/about", "/industry", "/request", "/epk", "/links", "/privacy"];
  const cards = ".epk-release-card, .atelier-release, .cinema-editorial-card, .studio-music-card, .epk-brand-asset, .release-card-v2";

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Production page ${path} at ${width}px`).toBe(200);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("main h1")).toHaveCount(1);

      const issues = await page.evaluate((selector) => {
        const tolerance = 2;
        const failures = [];
        const viewportWidth = window.innerWidth;
        if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
          failures.push("document exceeds viewport");
        }
        for (const card of document.querySelectorAll(selector)) {
          const bounds = card.getBoundingClientRect();
          for (const image of card.querySelectorAll("img, video, iframe")) {
            const r = image.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.left < bounds.left - tolerance || r.right > bounds.right + tolerance ||
                r.top < bounds.top - tolerance || r.bottom > bounds.bottom + tolerance) {
              failures.push(`${String(card.className)}: media ${String(image.className)} exceeds card`);
            }
          }
        }
        return failures;
      }, cards);
      expect(issues, `Production media overflow on ${path} at ${width}px`).toEqual([]);

      if (path === "/cinema") {
        const shortCards = page.locator(".cinema-collection-shorts .cinema-editorial-card");
        const cinemaLayout = await page.evaluate(() => {
          const all = [...document.querySelectorAll(".cinema-index-section .cinema-editorial-stack > .cinema-editorial-card")];
          const compactTitles = all.every((card) => {
            const heading = card.querySelector("h3");
            return heading && parseFloat(getComputedStyle(heading).fontSize) < 35 &&
              heading.scrollWidth <= heading.clientWidth + 2;
          });
          const framed = all.every((card) => {
            const art = card.querySelector(".cinema-editorial-thumb-link");
            return art && art.getBoundingClientRect().right <= card.getBoundingClientRect().right + 2;
          });
          return { count: all.length, compactTitles, framed };
        });
        expect(cinemaLayout.count, "Live Cinema should display actual D1 video cards").toBeGreaterThan(0);
        expect(cinemaLayout.compactTitles, `Compact Cinema titles at ${width}px`).toBe(true);
        expect(cinemaLayout.framed, `Cinema artwork containment at ${width}px`).toBe(true);
        if (await shortCards.count() >= 2) {
          const layout = await shortCards.evaluateAll((cards) =>
            cards.map((card) => {
              const b = card.getBoundingClientRect();
              return { left: b.left, top: b.top };
            }),
          );
          if (width === 390) expect(layout[1].top).toBeGreaterThan(layout[0].top + 30);
        }
        // Scroll through lazy Cinema artwork before taking the actual production screenshot.
        await page.addStyleTag({ content: "html {scroll-behavior:auto!important}" });
        await page.evaluate(async () => {
          const step = Math.max(300, Math.floor(innerHeight * .8));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo({ top: y, behavior: "instant" });
            await new Promise((resolve) => setTimeout(resolve, 65));
          }
          window.scrollTo({ top: 0, behavior: "instant" });
          await document.fonts.ready;
        });
        await page.screenshot({
          path: testInfo.outputPath(`production-cinema-${width}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }

      if (path === "/epk") {
        const cinemaCards = page.locator(".epk-cinema-card");
        expect(await cinemaCards.count(), "Live D1 Cinema content should be present").toBeGreaterThan(0);
        const problems = await cinemaCards.evaluateAll((items) => {
          const boxes = items.map((item) => item.getBoundingClientRect());
          const results = [];
          for (let i = 0; i < items.length; i++) {
            const frame = items[i].querySelector(".epk-cinema-thumb-link");
            const image = items[i].querySelector(".epk-cinema-thumb");
            if (!frame) { results.push(`Missing frame ${i}`); continue; }
            const f = frame.getBoundingClientRect();
            if (Math.abs(f.width / f.height - 16 / 9) > 0.04) {
              results.push(`Invalid aspect ratio for Cinema card ${i}`);
            }
            if (image) {
              const a = image.getBoundingClientRect();
              if (a.left < f.left - 2 || a.right > f.right + 2 ||
                  a.top < f.top - 2 || a.bottom > f.bottom + 2) {
                results.push(`Cinema image ${i} escapes frame`);
              }
            }
            for (let j = i + 1; j < boxes.length; j++) {
              const intersectionX = Math.min(boxes[i].right, boxes[j].right) - Math.max(boxes[i].left, boxes[j].left);
              const intersectionY = Math.min(boxes[i].bottom, boxes[j].bottom) - Math.max(boxes[i].top, boxes[j].top);
              if (intersectionX > 2 && intersectionY > 2) results.push(`Cards ${i} and ${j} overlap`);
            }
          }
          return results;
        });
        expect(problems, `Live EPK Cinema at ${width}px`).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`production-epk-${width}.png`),
          fullPage: true,
          animations: "disabled",
        });
      }
    }
  }
});
