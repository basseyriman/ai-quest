import { chromium } from "playwright";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 962, height: 1288 });
  const url = "http://localhost:3001/print-manual/factory-sheet?no-bg=1&side=front";
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
  await page.waitForSelector(".manual-factory-page");
  await page.waitForTimeout(2000);

  const outDir = "c:\\Users\\basse\\Documents\\RimanTech\\AI QUEST GAME\\ai-quest\\production_artwork\\temp";

  await page.screenshot({
    path: `${outDir}\\debug_rulebook_screenshot.png`,
    fullPage: false,
  });

  const variants = [
    { name: "explicit_mm", opts: { width: "244mm", height: "326.8mm", preferCSSPageSize: false } },
    { name: "css_page_size", opts: { preferCSSPageSize: true } },
    { name: "screen_media", media: "screen" },
    { name: "no_print_media", skipPrint: true },
  ];

  for (const v of variants) {
    if (v.media) await page.emulateMedia({ media: v.media });
    else if (!v.skipPrint) await page.emulateMedia({ media: "print" });

    const pdf = await page.pdf({
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      ...(v.opts ?? { width: "244mm", height: "326.8mm", preferCSSPageSize: false }),
    });
    const path = `${outDir}\\debug_rulebook_${v.name}.pdf`;
    fs.writeFileSync(path, pdf);
    console.log("wrote", path, pdf.length, "bytes");
  }

  await browser.close();
}

run().catch(console.error);
