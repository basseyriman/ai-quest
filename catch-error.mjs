import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    console.log("Navigating to http://localhost:3001/play/TEST_ROOM ...");
    await page.goto('http://localhost:3001/play/TEST_ROOM', { waitUntil: 'networkidle0' });

    console.log("Waiting a few seconds...");
    await new Promise(r => setTimeout(r, 2000));
    
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    if (bodyHTML.includes('Application error')) {
        console.log("CRASH DETECTED IN HTML!");
    } else {
        console.log("No crash detected in HTML.");
    }

    await browser.close();
}

run().catch(console.error);
