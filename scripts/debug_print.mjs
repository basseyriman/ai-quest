import { chromium } from "playwright";
import fs from "fs";
import path from "path";
// Instead of pypdf, we can just save the PDF to a test file, and then call a python script to check it!
import { execSync } from "child_process";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const testUrl = "http://localhost:3001/print-manual/factory-sheet?no-bg=1";
  
  // We will run multiple tests with different CSS injections
  const tests = [
    {
      name: "1_default",
      css: ""
    },
    {
      name: "2_position_absolute",
      css: ".manual-factory-page { position: absolute !important; } .manual-factory-page:nth-child(1) { top: 0 !important; } .manual-factory-page:nth-child(2) { top: 926.34pt !important; }"
    },
    {
      name: "3_no_page_break_after",
      css: ".manual-factory-page { page-break-after: auto !important; break-after: auto !important; }"
    },
    {
      name: "4_overflow_visible_all",
      css: "* { overflow: visible !important; }"
    },
    {
      name: "5_display_flex_print",
      css: ".print-sheet-container { display: flex !important; flex-direction: column !important; }"
    }
  ];

  for (const t of tests) {
    console.log(`Running test: ${t.name}...`);
    await page.goto(testUrl, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
    
    if (t.css) {
      await page.evaluate((cssString) => {
        const style = document.createElement("style");
        style.innerHTML = cssString;
        document.head.appendChild(style);
      }, t.css);
    }
    
    await page.waitForTimeout(2000);
    const pdfPath = `test_${t.name}.pdf`;
    
    const pdf = await page.pdf({
      width: "244mm",
      height: "326.8mm",
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });
    
    fs.writeFileSync(pdfPath, pdf);
    
    // Call python script to verify page count and page 2 text length
    try {
      const output = execSync(`python -c "
from pypdf import PdfReader
reader = PdfReader(r'${pdfPath}')
print('Pages:', len(reader.pages), 'P1 text:', len(reader.pages[0].extract_text()), 'P2 text:', len(reader.pages[1].extract_text()) if len(reader.pages) > 1 else 'N/A')
"`).toString().trim();
      console.log(`Result for ${t.name}: ${output}`);
    } catch (err) {
      console.error(`Python check failed for ${t.name}:`, err.message);
    }
  }

  await browser.close();
}

run().catch(console.error);
