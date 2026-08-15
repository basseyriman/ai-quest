/**
 * Export CSS 3D retail box to PNG (matches PrintBoxNet lid).
 * Run: npm run dev  →  npm run export:box-3d
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "ai_quest_box_3d.png");
const URL = process.env.BOX_RENDER_URL ?? "http://localhost:3001/box-render";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 1400 },
  deviceScaleFactor: 3,
});
await page.goto(URL, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForSelector(".landing-box3d-scene", { timeout: 60_000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const scene = page.locator(".landing-box3d-scene");
const buffer = await scene.screenshot({ type: "png", omitBackground: true });
fs.writeFileSync(OUT, buffer);
await browser.close();

console.log(`Wrote ${OUT} (${buffer.length} bytes)`);
