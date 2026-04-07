// scripts/testBing.js
const axios = require('axios');

async function test() {
  const query = encodeURIComponent('RTX 4070 product photo');
  const url   = `https://www.bing.com/images/search?q=${query}&form=HDRSC2&first=1`;

  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'fr-FR,fr;q=0.9',
    }
  });

  // Affiche les 3000 premiers caractères pour voir la structure
  console.log(res.data.substring(0, 3000));
}

test();