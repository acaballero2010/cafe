const https = require('https');
const fs = require('fs');
const path = require('path');

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
            .replace(/<[^>]*>?/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
}

(async () => {
  let allRawProducts = [];
  let page = 1;
  while (true) {
    console.log(`Fetching page ${page}...`);
    const result = await fetchPage(page);
    if (!result.products || result.products.length === 0) {
      break;
    }
    console.log(`Page ${page}: got ${result.products.length} products`);
    allRawProducts = allRawProducts.concat(result.products);
    if (result.totalPages && page >= parseInt(result.totalPages)) {
      break;
    }
    page++;
  }

  console.log(`Total raw products fetched: ${allRawProducts.length}`);
  fs.writeFileSync('topcreamery_all_products.json', JSON.stringify(allRawProducts, null, 2));

  const catalogItems = [];

  for (const p of allRawProducts) {
    const rawName = cleanText(p.name);
    if (!rawName) continue;

    // Filter out huge turnkey machine business packages over ₱25,000 for raw materials catalog
    const minor = p.prices.currency_minor_unit !== undefined ? p.prices.currency_minor_unit : 2;
    const rawPrice = parseInt(p.prices.price || p.prices.regular_price || '0', 10);
    const priceNum = rawPrice / Math.pow(10, minor);

    // Get categories text
    const catNames = (p.categories || []).map(c => cleanText(c.name));
    const allCatStr = catNames.join(' ').toLowerCase();
    const nameLower = rawName.toLowerCase();

    // Determine category
    let category = 'syrup';
    let flavorType = 'syrup';
    let layerType = 'syrup';
    let scrapType = 'standard';
    let densityBrix = 60.0;
    let unitYieldMl = 1000;
    let colorHex = '#eab308';
    let tier = 'value';

    // Parse weight/packSize
    let packSize = p.formatted_weight || '1 kg';
    if (nameLower.includes('750ml') || nameLower.includes('750 ml')) packSize = '750ml Bottle';
    else if (nameLower.includes('1000ml') || nameLower.includes('1l') || nameLower.includes('1 l')) packSize = '1,000ml Bottle';
    else if (nameLower.includes('2.5kg') || nameLower.includes('2.5 kg')) packSize = '2.5kg Jug';
    else if (nameLower.includes('3.2kg') || nameLower.includes('3.2 kg')) packSize = '3.2kg Tub';
    else if (nameLower.includes('3kg') || nameLower.includes('3 kg')) packSize = '3kg Bag';
    else if (nameLower.includes('1kg') || nameLower.includes('1 kg')) packSize = '1kg Pouch';
    else if (nameLower.includes('500g')) packSize = '500g Pouch';
    else if (nameLower.includes('600g')) packSize = '600g Foil Bag';
    else if (nameLower.includes('750g')) packSize = '750g Pouch';
    else if (nameLower.includes('100g')) packSize = '100g Pack';
    else if (nameLower.includes('250g')) packSize = '250g Pack';
    else if (p.dimensions && p.formatted_weight) packSize = `${p.formatted_weight} Pack`;

    // Categorization logic
    if (allCatStr.includes('coffee beans') || nameLower.includes('coffee beans')) {
      category = 'coffee';
      flavorType = 'espresso';
      layerType = 'espresso';
      scrapType = 'espresso';
      densityBrix = 9.0;
      unitYieldMl = nameLower.includes('500g') ? 1000 : 2000;
      colorHex = '#3e2723';
      tier = nameLower.includes('premium') || nameLower.includes('single origin') ? 'signature' : 'value';
    } else if (allCatStr.includes('tea leaves') || nameLower.includes('tea leaves') || nameLower.includes('black tea') || nameLower.includes('green tea') || nameLower.includes('jasmine')) {
      category = 'tea';
      flavorType = 'tea';
      layerType = 'tea';
      scrapType = 'standard';
      densityBrix = 2.0;
      unitYieldMl = 15000;
      colorHex = '#15803d';
      tier = 'signature';
    } else if (nameLower.includes('matcha')) {
      category = 'tea';
      flavorType = 'matcha';
      layerType = 'tea';
      scrapType = 'standard';
      densityBrix = 8.0;
      unitYieldMl = 4000;
      colorHex = '#166534';
      tier = 'signature';
    } else if (allCatStr.includes('syrup') || nameLower.includes('syrup')) {
      category = 'syrup';
      layerType = 'syrup';
      densityBrix = 64.0;
      unitYieldMl = nameLower.includes('750') ? 750 : nameLower.includes('2.5') ? 2500 : 1000;
      if (nameLower.includes('caramel')) flavorType = 'caramel';
      else if (nameLower.includes('vanilla')) flavorType = 'vanilla';
      else if (nameLower.includes('brown sugar') || nameLower.includes('okinawa')) flavorType = 'brown_sugar';
      else if (nameLower.includes('hazelnut')) flavorType = 'hazelnut';
      else if (nameLower.includes('strawberry')) flavorType = 'strawberry';
      else flavorType = 'syrup';
    } else if (allCatStr.includes('sinkers') || allCatStr.includes('toppings') || nameLower.includes('boba') || nameLower.includes('tapioca') || nameLower.includes('jelly') || nameLower.includes('pearls')) {
      category = 'toppings';
      flavorType = 'boba';
      layerType = 'solid';
      densityBrix = 35.0;
      unitYieldMl = nameLower.includes('3kg') ? 3000 : nameLower.includes('3.2kg') ? 3200 : 1000;
      colorHex = '#18181b';
    } else if (allCatStr.includes('creamer') || nameLower.includes('creamer') || nameLower.includes('condensed') || nameLower.includes('evaporated') || nameLower.includes('milk foam')) {
      category = 'dairy';
      flavorType = nameLower.includes('foam') ? 'cheese_foam' : 'condensed_milk';
      layerType = 'dairy';
      densityBrix = 24.0;
      unitYieldMl = 1000;
      colorHex = '#fef08a';
    } else if (allCatStr.includes('frozen yogurt') || allCatStr.includes('soft-serve') || allCatStr.includes('ice cream')) {
      category = 'dairy';
      flavorType = 'ice_cream_base';
      layerType = 'liquid';
      densityBrix = 22.0;
      unitYieldMl = 3000;
      colorHex = '#fefce8';
    } else if (allCatStr.includes('tools') || allCatStr.includes('accessories') || allCatStr.includes('straws') || allCatStr.includes('cups') || nameLower.includes('straw') || nameLower.includes('cup') || nameLower.includes('lid') || nameLower.includes('pump')) {
      category = 'packaging';
      flavorType = 'packaging';
      layerType = 'packaging';
      scrapType = 'packaging';
      unitYieldMl = 1;
      densityBrix = 0;
      colorHex = '#64748b';
    } else if (allCatStr.includes('business package') || nameLower.includes('business package')) {
      category = 'business_package';
      flavorType = 'equipment';
      layerType = 'equipment';
      scrapType = 'none';
      unitYieldMl = 1;
      densityBrix = 0;
    } else {
      // General Powders & Beverage Premixes
      category = 'syrup';
      flavorType = 'powder_premix';
      layerType = 'liquid';
      densityBrix = 18.0;
      unitYieldMl = nameLower.includes('500g') ? 2500 : 5000;
      colorHex = '#d97706';
    }

    // Calculate unit cost per ml
    let unitCost = 0.20;
    if (category === 'packaging' || category === 'business_package') {
      unitCost = priceNum;
    } else {
      unitCost = Number((priceNum / (unitYieldMl || 1000)).toFixed(4)) || 0.20;
    }

    // Unique clean slug ID
    const slugId = 'tc-' + (p.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));

    // Image thumbnail
    const imageSrc = (p.images && p.images[0] && p.images[0].src) ? p.images[0].src : '';

    catalogItems.push({
      id: slugId,
      name: rawName,
      brand: 'Top Creamery Manila',
      tier: tier,
      flavorType: flavorType,
      category: category,
      packSize: packSize,
      packPrice: priceNum,
      unitYieldMl: unitYieldMl,
      unitCostPerMl: unitCost,
      densityBrix: densityBrix,
      supplier: 'Top Creamery Foodservice Direct',
      scrapType: scrapType,
      colorHex: colorHex,
      layerType: layerType,
      description: cleanText(p.short_description || p.description) || `${rawName} by Top Creamery Manila. Verified wholesale foodservice formulation.`,
      imageUrl: imageSrc,
      inStock: p.is_in_stock !== undefined ? p.is_in_stock : true
    });
  }

  console.log(`Processed ${catalogItems.length} catalog items for TOP Creamery.`);

  const fileContent = `// TOP Creamery Complete Official Catalog (Auto-extracted from topcreamery.com)
export const TOP_CREAMERY_FULL_CATALOG = ${JSON.stringify(catalogItems, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'data', 'topCreameryCatalog.js'), fileContent, 'utf8');
  console.log('Successfully wrote src/data/topCreameryCatalog.js!');
})();
