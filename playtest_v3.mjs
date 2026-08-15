import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching headless browser to playtest AI QUEST...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log("Navigating to http://localhost:3001...");
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

    console.log("Skipping Intro Sequence...");
    let attempts = 0;
    while (attempts < 5) {
        const clicked = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const nextBtn = btns.find(b => b.innerText.includes('NEXT PROTOCOL') || b.innerText.includes('START PROTOCOL') || b.innerText.includes('ACCESS TERMINAL'));
            if (nextBtn) {
                nextBtn.click();
                return true;
            }
            return false;
        });
        if (clicked) {
            await new Promise(r => setTimeout(r, 1000));
        } else {
            break;
        }
        attempts++;
    }

    console.log("Looking for Lobby Join Button...");
    await new Promise(r => setTimeout(r, 2000));
    const joined = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const joinBtn = btns.find(b => b.innerText.includes('JOIN LOCAL TEST SERVER') || b.innerText.includes('START TEST MATCH'));
        if (joinBtn) {
            joinBtn.click();
            return true;
        }
        return false;
    });

    if (joined) {
        console.log("Found button! Clicked to Join Game...");
    } else {
        console.log("Could not find lobby join button!");
    }

    console.log("Waiting 6 seconds for dealing animation to complete...");
    await new Promise(r => setTimeout(r, 6000));

    console.log("\n--- GAME BOARD STATE EXTRACTION ---");
    const gameData = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('span, h1, h2, h3, div')).map(el => {
            let text = '';
            for (let node of el.childNodes) {
                if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
                    text += node.nodeValue.trim() + ' ';
                }
            }
            return text.trim();
        }).filter(t => t.length > 0);
        return [...new Set(textElements)];
    });

    console.log(gameData.join('\n'));
    console.log("-----------------------------------");

    await browser.close();
    console.log("Playtest successfully completed via Puppeteer.");
})();
