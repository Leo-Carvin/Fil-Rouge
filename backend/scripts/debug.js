const axios = require('axios');
axios.get('https://www.bing.com/images/search?q=RTX+4070+Ti+product&form=HDRSC2', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
}).then(r => {
  const matches = r.data.match(/https?:\/\/[^\s'"]{20,}\.(jpg|jpeg|png|webp)/gi);
  if (matches) {
    const filtered = matches.filter(u => !u.includes('bing.com') && !u.includes('bing.net'));
    console.log(filtered.slice(0, 10));
  } else {
    console.log('Rien trouve');
  }
});
