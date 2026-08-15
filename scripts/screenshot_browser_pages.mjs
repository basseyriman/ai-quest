import { chromium } from "playwright";
import path from "path";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const brainDir = "C:\\Users\\basse\\.gemini\\antigravity\\brain\\c2c29a6a-b14e-4e5c-b8e3-da232e2eeabb";

  const jobs = [
    {
      name: "rulebook_alignment",
      url: "http://localhost:3001/print-manual/factory-sheet",
      width: 1000,
      height: 2400,
    },
    {
      name: "box_alignment",
      url: "http://localhost:3001/print-box/factory-sheet",
      width: 1600,
      height: 1200,
    }
  ];

  for (const job of jobs) {
    console.log(`Navigating to ${job.url}...`);
    await page.setViewportSize({ width: job.width, height: job.height });
    await page.goto(job.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000); // Allow render settlement

    const outPath = path.join(brainDir, `${job.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Saved screenshot to ${outPath}`);
  }

  await browser.close();
}

run().catch(console.error);
