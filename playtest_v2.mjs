import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching headless browser to playtest AI QUEST...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log("Navigating to http://localhost:3001...");
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

    console.log("Skipping Intro Sequence...");
    try {
        // Find and click all 'NEXT PROTOCOL' buttons or 'SKIP'
        let attempts = 0;
        while (attempts < 5) {
            const nextBtn = await page.evaluateHandle(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.includes('NEXT PROTOCOL') || b.innerText.includes('START PROTOCOL') || b.innerText.includes('ACCESS TERMINAL'));
            });
            if (nextBtn) {
                await nextBtn.evaluate(b => b.click());
                await new Promise(r => setTimeout(r, 1000));
            } else {
                break;
            }
            attempts++;
        }
    } catch (e) {
        console.log("Intro skip error:", e.message);
    }

    // Try to find the join button in the lobby
    console.log("Looking for Lobby Join Button...");
    try {
        await new Promise(r => setTimeout(r, 2000));
        const joinBtnHandle = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(b => b.innerText.includes('JOIN LOCAL TEST SERVER') || b.innerText.includes('START TEST MATCH'));
        });

        if (joinBtnHandle) {
            console.log("Found button! Clicking to Join Game...");
            await joinBtnHandle.evaluate(b => b.click());
        } else {
            console.log("Could not find lobby join button!");
        }
    } catch (e) {
        console.log("Lobby error:", e.message);
    }

    // Wait for dealing to finish
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
