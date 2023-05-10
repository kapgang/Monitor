
const axios = require('axios');

const affId = 'kk5';  // Fill in your actual Affiliate ID
const clientId = '12345';  // Fill in your actual Client ID
const apiKey = 'xegUMalqK0iStKypqHloScm9rJOHJm0v';
const clientCartId = 'Cart1';  // Generate a unique cart ID
const skuId = '300396184';  // The product you want to check
const qty = '1';  // The quantity you want to check
const type = 'DL';  // The product type

axios.post('https://services-qa.walgreens.com/api/cart/addToCart/v1', {
    affId,
    apiKey,
    clientId,
    clientCartId,
    products: [
        {
            skuId,
            qty,
            type
        }
    ]
}, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    const productStatus = response.data.items[0].statusCode;
    switch (productStatus) {
        case '000':
            console.log('Item added to cart with requested quantity');
            break;
        case '001':
            console.log('Item is out of stock');
            break;
        default:
            console.log('Received unknown status code:', productStatus);
    }
}).catch(error => {
    console.error('Failed to check product stock:', error);
});
