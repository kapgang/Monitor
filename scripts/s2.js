const puppeteer = require('puppeteer');

// const webhook = 'https://discord.com/api/webhooks/1105680569813176351/1fQkPC0jCHwz_wa5ya6LaoRcA2D-vDQqX8h1_hMoNn81rUGfEb6jzIx-e0e4a6bmEpz1'

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const urls = [
    'https://www.walgreens.com/store/c/cerave-face-and-body-moisturizing-cream-for-normal-to-dry-skin-with-hyaluronic-acid/ID=300396184-product',
    'https://www.walgreens.com/store/c/cerave-vitamin-c-face-serum,-skin-brightening-serum-for-face-with-hyaluronic-acid/ID=prod6402924-product',
    'https://www.walgreens.com/store/c/cerave-hydrating-facial-cleanser/ID=300396947-product'
  ];

  let index = 0;

  while (urls.length > 0) {
    const url = urls[index % urls.length];

    await page.goto(url);

    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      await page.click('.icon.icon__shipping');
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        await page.click('.icon.icon__shipping');
        console.log(`Product at ${url} is in stock`);
        urls.splice(index % urls.length, 1); // Remove the URL from the array
      } catch (error) {
        console.log(`Product at ${url} is out of stock`);
      }
    } catch (error) {
      console.log(`Product at ${url} is out of stock. Unable to click .icon.icon__shipping. Trying again after 30 seconds.`);
    }

    // Wait 30 seconds before checking the next URL
    await new Promise(resolve => setTimeout(resolve, 30000));

    index++;
  }

  await browser.close();
})();


