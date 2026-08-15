import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 962, height: 1288 });
  const url = "http://localhost:3001/print-manual/factory-sheet?no-bg=1&side=front";
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
  await page.waitForTimeout(2000);

  const metrics = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        sel,
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        position: cs.position,
        width: cs.width,
        height: cs.height,
        transform: cs.transform,
      };
    };
    return {
      html: pick("html"),
      body: pick("body"),
      root: pick(".rulebook-factory-root"),
      factoryPage: pick(".manual-factory-page"),
      slot: pick(".rulebook-artwork-slot"),
      a5root: pick(".a5-manual-root"),
      a5sheet: pick(".a5-sheet"),
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
  });

  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
}

run().catch(console.error);
