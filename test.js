const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001');
  
  await page.waitForTimeout(2000);
  
  // Enter a name
  await page.waitForSelector('input');
  const inputs = await page.$$('input');
  await inputs[0].fill('TestBot');
  await page.click('button:has-text("INITIALIZE")');
  await page.waitForTimeout(2000);
  
  // Start game
  await page.click('button:has-text("START SIMULATION")');
  await page.waitForTimeout(2000);
  
  console.log('Game started, clicking deck to setup...');
  for(let i=0; i<4; i++) {
     await page.locator('text=Main Deck').first().click();
     await page.waitForTimeout(1000);
  }
  console.log('Setup complete. Waiting for AI...');
  await page.waitForTimeout(4000);
  
  // Draw one card for turn
  console.log('Drawing for turn...');
  await page.locator('text=Main Deck').first().click();
  await page.waitForTimeout(4000);
  
  console.log('Attempting to click a card in hand...');
  // The player hand is at the bottom, their cards are mapped.
  // Find all cards inside the bottom container.
  const cards = await page.$$('div.flex.items-center.justify-center.gap-4 > div');
  console.log('Found cards:', cards.length);
  if(cards.length > 0) {
      await cards[0].click();
      console.log('Clicked card!');
      await page.waitForTimeout(2000);
      
      const newCards = await page.$$('div.flex.items-center.justify-center.gap-4 > div');
      console.log('Cards after click:', newCards.length);
  } else {
      console.log('No cards found!');
  }
  
  await browser.close();
})();
