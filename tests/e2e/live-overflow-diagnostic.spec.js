import { test } from "@playwright/test";

// Temporary, read-only diagnosis of actual production mobile layout.
// No form submission, authentication or external purchase interaction.
test("diagnose live Cinema horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cinema", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => {
    const viewport = window.innerWidth;
    const elements = [...document.body.querySelectorAll("*")];
    const offenders = elements.map((el) => {
      const rect = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: String(el.className).slice(0, 160),
        id: el.id,
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        scrollWidth: el.scrollWidth,
        cssWidth: s.width,
        minWidth: s.minWidth,
        display: s.display,
        position: s.position,
        overflowX: s.overflowX,
        transform: s.transform,
        text: (el.textContent ?? "").trim().slice(0, 65),
        parent: String(el.parentElement?.className ?? "").slice(0, 100),
      };
    }).filter((el) => el.right > viewport + 2 || el.left < -2);
    offenders.sort((a, b) => b.right - a.right);
    return {
      viewport,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      offenders: offenders.slice(0, 35),
    };
  });
  console.log("LIVE_CINEMA_OVERFLOW_DIAGNOSTIC=" + JSON.stringify(result, null, 2));
});
