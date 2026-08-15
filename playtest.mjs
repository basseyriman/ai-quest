import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log("Navigating to http://localhost:3001...");
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

    // Wait for intro to finish or be skippable
    console.log("Waiting for Intro/Lobby...");
    await new Promise(r => setTimeout(r, 2000));

    // Try to find the join button
    try {
        await page.waitForSelector('button', { timeout: 5000 });
        const buttons = await page.$$eval('button', btns => btns.map(b => b.innerText));
        console.log("Available buttons:", buttons);

        // Click JOIN LOCAL TEST SERVER
        const joinBtnHandle = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(b => b.innerText.includes('JOIN LOCAL TEST SERVER') || b.innerText.includes('START TEST MATCH'));
        });

        if (joinBtnHandle) {
            console.log("Clicking Join Game button...");
            await joinBtnHandle.evaluate(b => b.click());
        } else {
            console.log("Could not find join button. Checking text on screen...");
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log("Screen Text:", bodyText.substring(0, 500));
        }
    } catch (e) {
        console.log("Error finding buttons:", e.message);
    }

    // Wait for dealing to finish
    console.log("Waiting 5 seconds for dealing phase...");
    await new Promise(r => setTimeout(r, 5000));

    // Get the game state (DOM elements)
    console.log("Extracting Game Board State...");
    const gameState = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('span, h1, h2, h3, div')).map(el => {
            // Only get direct text nodes to avoid massive duplication
            let text = '';
            for (let node of el.childNodes) {
                if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
                    text += node.nodeValue.trim() + ' ';
                }
            }
            return text.trim();
        }).filter(t => t.length > 0);
        
        // Remove duplicates and empty strings
        return [...new Set(textElements)];
    });

    console.log("--- GAME BOARD TEXT ---");
    console.log(gameState.join('\n'));
    console.log("-----------------------");

    await browser.close();
    console.log("Playtest complete.");
})();
