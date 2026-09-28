const https = require('https');
const fs = require('fs');

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    https.get('https://topcreamery.com/wp-json/wc/store/products?per_page=100&page=' + page, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(data);
            resolve({ products: json, total: res.headers['x-wp-total'], totalPages: res.headers['x-wp-totalpages'] });
          } else {
            resolve({ products: [], total: 0, totalPages: 0, status: res.statusCode });
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#038;/g, '&')
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'")
            .replace(/&rdquo;/g, '"')
            .replace(/&ldquo;/g, '"')
            .replace(/&#8211;/g, '-')
            .replace(/&#8212;/g, '--')
            .replace(/&#8217;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
}

function escapeCsv(str) {
  if (!str) return '""';
  const clean = str.replace(/"/g, '""');
  return `"${clean}"`;
}

(async () => {
  let allProducts = [];
  let page = 1;
  while (true) {
    console.log(`Fetching page ${page}...`);
    const result = await fetchPage(page);
    if (!result.products || result.products.length === 0) {
      console.log(`Finished at page ${page}`);
      break;
    }
    console.log(`Page ${page}: got ${result.products.length} products (Total: ${result.total || 'unknown'})`);
    allProducts = allProducts.concat(result.products);
    if (result.totalPages && page >= parseInt(result.totalPages)) {
      break;
    }
    page++;
  }

  console.log(`Total products fetched: ${allProducts.length}`);

  // Sort alphabetically by product name
  allProducts.sort((a, b) => a.name.localeCompare(b.name));

  // Build CSV
  const csvRows = ['"Product Name","Category","Price"'];

  for (const p of allProducts) {
    const name = cleanText(p.name);
    
    // Determine category or series
    let category = '';
    if (p.categories && p.categories.length > 0) {
      const meaningfulCat = p.categories.find(c => !c.name.startsWith('TOPGuides') && c.name !== 'New Products');
      category = meaningfulCat ? cleanText(meaningfulCat.name) : cleanText(p.categories[0].name);
    } else if (p.brands && p.brands.length > 0) {
      category = cleanText(p.brands[0].name);
    } else {
      category = 'General Supplies';
    }

    // Format price in PHP
    let priceFormatted = '';
    if (p.prices) {
      const minor = p.prices.currency_minor_unit !== undefined ? p.prices.currency_minor_unit : 2;
      const rawPrice = parseInt(p.prices.price || p.prices.regular_price || '0', 10);
      const priceNum = rawPrice / Math.pow(10, minor);
      if (p.prices.price_range && p.prices.price_range.min_amount && p.prices.price_range.max_amount && p.prices.price_range.min_amount !== p.prices.price_range.max_amount) {
        const minP = parseInt(p.prices.price_range.min_amount, 10) / Math.pow(10, minor);
        const maxP = parseInt(p.prices.price_range.max_amount, 10) / Math.pow(10, minor);
        priceFormatted = `₱${minP.toFixed(2)} - ₱${maxP.toFixed(2)}`;
      } else {
        priceFormatted = `₱${priceNum.toFixed(2)}`;
      }
    }

    csvRows.push(`${escapeCsv(name)},${escapeCsv(category)},${escapeCsv(priceFormatted)}`);
  }

  const csvContent = csvRows.join('\n');
  fs.writeFileSync('topcreamery_catalog.csv', csvContent, 'utf8');
  console.log('Saved topcreamery_catalog.csv successfully!');
})();
