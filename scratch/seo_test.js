const http = require('http');

const urls = [
  'http://localhost:3000/sarkari-result/banking',
  'http://localhost:3000/news',
  'http://localhost:3000/sbi-circle-based-officers-cbo-result-2025',
];

urls.forEach(url => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const matches = [...data.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)];
      console.log('\n--- URL:', url, '---');
      matches.forEach(m => {
        try {
          const parsed = JSON.parse(m[1]);
          if (parsed['@graph']) {
             parsed['@graph'].forEach(g => {
                console.log(`[Schema Type via @graph]: ${JSON.stringify(g['@type'])}`);
             });
          } else {
             console.log(`[Schema Type]: ${JSON.stringify(parsed['@type'])}`);
          }
        } catch (e) {
           console.log('Error parsing JSON-LD:', e.message);
        }
      });
    });
  });
});
