const puppeteer = require('puppeteer');
const { WebhookClient } = require('discord.js');

const urls = [
  'https://www.walgreens.com/store/c/walgreens-regular-strength-antacid-chewable-tablets,-500-mg/ID=prod3252246-product?skuId=sku3251081',
  'https://www.walgreens.com/store/c/black-girl-sunscreen-spf-30/ID=300425138-product',
  'https://www.walgreens.com/store/c/walgreens-ephrine-nose-drops-extra-strength/ID=300433946-product',
  'https://www.walgreens.com/store/c/serica-moisturizing-scar-formula/ID=prod6349694-product'

  

];

let currentIndex = 0;

// Create a new webhook client
const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1094877013875105832/OF5iq4putm_y9WSV20Yt5qYXoFHLOMlqvJ_69CES-v5FAGQ2x-L2ZxfTk5pfGPpRJ2s0' });

async function checkStock() {
  const browser = await puppeteer.launch({ 
    headless: true,
    // executablePath: 'C:/Program Files/Google/Chrome/Applications/chrome.exe',
    // args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  while (true) {
    const url = urls[currentIndex];
    console.log(`Checking stock for product at ${url}`);
    await page.goto(url);
    await page.waitForTimeout(5000);

    try {
      await page.click('.icon.icon__shipping');
      await page.waitForTimeout(5000);

      try {
        await page.click('.icon.icon__shipping');
        console.log('Product is in stock');
        
        // Send message to Discord
        webhookClient.send(`Product is in stock at ${url}`);
        
        urls.splice(currentIndex, 1); // Remove the URL from the list as the product is in stock
        if (urls.length === 0) {
          break;
        }
      } catch (e) {
        console.log('Product is out of stock');
      }
    } catch (e) {
      console.log('Product is out of stock');
    }

    currentIndex = (currentIndex + 1) % urls.length;
    await page.waitForTimeout(15000); // Wait for 15 seconds before checking the next product
  }

  await browser.close();
}

checkStock().catch(console.error);
