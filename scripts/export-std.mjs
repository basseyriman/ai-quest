import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportCards() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a high device scale factor for high-resolution PNGs
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });

    console.log('Navigating to export route...');
    await page.goto('http://localhost:3001/export-cards', { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for the fonts and rendering to be ready
    await page.waitForSelector('#export-ready', { timeout: 30000 });
    console.log('Page ready. Starting export...');

    const outDir = path.join(__dirname, '../public/cards/standard_cards');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const cards = await page.$$('.export-std-card');
    console.log(`Found ${cards.length} cards to export.`);

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const outPath = path.join(outDir, `std_${i}.png`);
        
        await card.screenshot({
            path: outPath,
            omitBackground: true, // This ensures the rounded corners are transparent!
        });
        
        if ((i + 1) % 20 === 0) {
            console.log(`Exported ${i + 1} / ${cards.length} cards...`);
        }
    }

    console.log('Successfully exported all Standard cards!');
    await browser.close();
}

exportCards().catch(console.error);
