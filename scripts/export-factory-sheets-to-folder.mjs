import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/** Convert mm to CSS pixels at 96 DPI (Chromium default). */
function mmToPx(mm) {
  return Math.ceil((mm * 96) / 25.4);
}

/** Parse a dimension string like "244mm" or "691.65pt" into millimetres. */
function parseMm(dim) {
  const match = String(dim).match(/^([\d.]+)(mm|pt)$/);
  if (!match) throw new Error(`Unsupported dimension: ${dim}`);
  const value = parseFloat(match[1]);
  return match[2] === "mm" ? value : (value * 25.4) / 72;
}

async function exportPDF(page, url, outputPath, width, height, selector, pages = "1") {
  const widthMm = parseMm(width);
  const heightMm = parseMm(height);

  await page.setViewportSize({
    width: mmToPx(widthMm) + 40,
    height: mmToPx(heightMm) + 40,
  });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 180_000 });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
  await page.evaluate(() => document.fonts.ready);

  console.log(`Waiting for selector: ${selector}...`);
  await page.waitForSelector(selector, { timeout: 60_000 });
  await page.waitForTimeout(2000);

  console.log(`Generating PDF (${width} x ${height})...`);
  const pdfOptions = {
    width,
    height,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  };
  if (pages) {
    pdfOptions.pageRanges = pages;
  }
  const pdf = await page.pdf(pdfOptions);

  fs.writeFileSync(outputPath, pdf);
  console.log(`Successfully saved: ${outputPath}`);
}

function concatRulebookPages(frontPath, backPath, outputPath) {
  const scriptPath = path.join(
    "c:\\Users\\basse\\Documents\\RimanTech\\AI QUEST GAME\\ai-quest",
    "scripts",
    "concat_rulebook_pages.py"
  );
  execSync(`python "${scriptPath}" "${frontPath}" "${backPath}" "${outputPath}"`, {
    stdio: "inherit",
  });
}

async function run() {
  const baseDir = "c:\\Users\\basse\\Documents\\RimanTech\\AI QUEST GAME\\ai-quest\\production_artwork";

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = "http://localhost:3001";

  const jobs = [
    {
      url: `${baseUrl}/print-cards/factory-sheets?sheet=0&no-bg=1`,
      outputPath: path.join(baseDir, "01_cards_sheet_1.pdf"),
      width: "1376mm",
      height: "673mm",
      selector: ".factory-sheet",
      pages: "1",
    },
    {
      url: `${baseUrl}/print-cards/factory-sheets?sheet=1&no-bg=1`,
      outputPath: path.join(baseDir, "02_cards_sheet_2.pdf"),
      width: "1376mm",
      height: "673mm",
      selector: ".factory-sheet",
      pages: "1",
    },
    {
      url: `${baseUrl}/print-cards/factory-sheets?sheet=2&no-bg=1`,
      outputPath: path.join(baseDir, "03_cards_sheet_3.pdf"),
      width: "1376mm",
      height: "673mm",
      selector: ".factory-sheet",
      pages: "1",
    },
    {
      url: `${baseUrl}/print-cards/factory-sheets?sheet=3&no-bg=1`,
      outputPath: path.join(baseDir, "04_cards_sheet_4.pdf"),
      width: "1376mm",
      height: "673mm",
      selector: ".factory-sheet",
      pages: "1",
    },
    {
      url: `${baseUrl}/print-box/factory-sheet?no-bg=1`,
      outputPath: path.join(baseDir, "05_box_art_sheet.pdf"),
      width: "540mm",
      height: "380mm",
      selector: ".box-factory-sheet",
      pages: "1",
    },
    {
      url: `${baseUrl}/print-scorecard`,
      outputPath: path.join(baseDir, "08_ip_score_trackers.pdf"),
      width: "210mm",
      height: "297mm",
      selector: ".tracker-sheet",
      pages: "1-2",
    },
  ];

  for (const job of jobs) {
    try {
      await exportPDF(page, job.url, job.outputPath, job.width, job.height, job.selector, job.pages);
    } catch (err) {
      console.error(`Failed to export ${job.outputPath}:`, err);
    }
  }

  // Rulebook: export front and back as separate single-page PDFs, then concatenate.
  const rulebookFront = path.join(baseDir, "temp_rulebook_front.pdf");
  const rulebookBack = path.join(baseDir, "temp_rulebook_back.pdf");
  const rulebookFinal = path.join(baseDir, "06_rulebook_sheet.pdf");

  try {
    await exportPDF(
      page,
      `${baseUrl}/print-manual/factory-sheet?no-bg=1&side=front`,
      rulebookFront,
      "151mm",
      "213mm",
      ".manual-factory-page",
      "1"
    );
    await exportPDF(
      page,
      `${baseUrl}/print-manual/factory-sheet?no-bg=1&side=back`,
      rulebookBack,
      "151mm",
      "213mm",
      ".manual-factory-page",
      "1"
    );
    concatRulebookPages(rulebookFront, rulebookBack, rulebookFinal);
    console.log(`Concatenated rulebook pages -> ${rulebookFinal}`);
    
    // Clean up temporary split files
    fs.unlinkSync(rulebookFront);
    fs.unlinkSync(rulebookBack);
  } catch (err) {
    console.error("Failed to export rulebook:", err);
  }

  await browser.close();
  console.log("All artwork PDFs generated successfully directly in production_artwork!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
