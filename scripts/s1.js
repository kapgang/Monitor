const puppeteer = require('puppeteer');
const { WebhookClient } = require('discord.js');

const urls = [
  'https://www.walgreens.com/store/c/cerave-face-and-body-moisturizing-cream-for-normal-to-dry-skin-with-hyaluronic-acid/ID=300396184-product',
  'https://www.walgreens.com/store/c/cerave-vitamin-c-face-serum,-skin-brightening-serum-for-face-with-hyaluronic-acid/ID=prod6402924-product',
  'https://www.walgreens.com/store/c/cerave-hydrating-facial-cleanser/ID=300396947-product',
  'https://www.walgreens.com/store/c/cerave-foaming-face-cleanser,-fragrance-free-face-wash-with-hyaluronic-acid/ID=300396945-product',
  'https://www.walgreens.com/store/c/cerave-pm-facial-moisturizing-lotion-fragrance-free-for-nighttime-use/ID=300396964-product',
  'https://www.walgreens.com/store/c/cerave-am-face-moisturizer-spf-30-oil-free-cream-with-sunscreen/ID=300397121-product',
  'https://www.walgreens.com/store/c/cerave-anti-aging-skin-renewing-night-face-cream-with-hyaluronic-acid/ID=300403254-product',
  'https://www.walgreens.com/store/c/cerave-am-face-moisturizer-spf-30,-oil-free-face-cream-with-sunscreen/ID=300396942-product',
  'https://www.walgreens.com/store/c/cerave-face-lotion-for-night-with-hyaluronic-acid,-fragrance-free-pm-night-cream/ID=300396660-product',
  'https://www.walgreens.com/store/c/serica-moisturizing-scar-formula/ID=prod6349694-product',
  'https://www.walgreens.com/store/c/cerave-skin-renewing-gel-oil-face-moisturizer-fragrance-free/ID=300396970-product',
  'https://www.walgreens.com/store/c/cerave-renewing-salicylic-acid-body-cream-for-rough-and-bumpy-skin,-fragrance-free/ID=300396968-product',
  'https://www.walgreens.com/store/c/cerave-sa-body-wash-for-rough-and-bumpy-skin/ID=300396967-product',
  'https://www.walgreens.com/store/c/cerave-under-eye-repair-cream-for-dark-circles-and-puffiness,-fragrance-free/ID=300396953-product',
  'https://www.amazon.com/Nature-Made-Softgels-Flaxseed-Safflower/dp/B010RS1NBE/ref=sr_1_5?crid=27VEXRUK1ICHL&keywords=B010RS1NBE&qid=1684016260&sprefix=b010rs1nbe%2Caps%2C174&sr=8-5',
  'https://www.walgreens.com/store/c/cerave-foaming-face-cleanser,-fragrance-free-face-wash-with-hyaluronic-acid/ID=300396946-product'
  

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
