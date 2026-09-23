// Raw Materials & Packaging Catalog with Yields, Suppliers, Density & Pack Sizes

export const DEFAULT_CATALOG = [
  // COFFEE & BASES
  {
    id: 'ethiopia-espresso',
    name: 'Ethiopia Guji Heirloom (Double Shot 36ml / 18g dose)',
    category: 'coffee',
    packSize: '2.2 lb (1000g) Bag',
    packPrice: 28.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.0105, // ~$0.38 per double shot (36ml output from 18g dry)
    densityBrix: 9.5,
    supplier: 'Onyx Coffee Lab B2B',
    scrapType: 'espresso',
    colorHex: '#3d2012',
    layerType: 'espresso'
  },
  {
    id: 'colombia-espresso',
    name: 'Colombia Huila Supremo Espresso (Double Shot 36ml)',
    category: 'coffee',
    packSize: '5 lb (2268g) Roaster Pack',
    packPrice: 48.00,
    unitYieldMl: 4500,
    unitCostPerMl: 0.0088,
    densityBrix: 9.0,
    supplier: 'Red Apron Local Roaster',
    scrapType: 'espresso',
    colorHex: '#4a2810',
    layerType: 'espresso'
  },
  {
    id: 'cold-brew-conc',
    name: 'Nitro Cold Brew Concentrate (1:4 Dilution Yield)',
    category: 'coffee',
    packSize: '1 Gallon (3785ml) Jug',
    packPrice: 24.00,
    unitYieldMl: 3785,
    unitCostPerMl: 0.0063,
    densityBrix: 7.5,
    supplier: 'Stumptown Wholesale',
    scrapType: 'standard',
    colorHex: '#261408',
    layerType: 'liquid'
  },

  // MILKS & ALT-MILKS
  {
    id: 'oatly-barista',
    name: 'Oatly Barista Edition Oat Milk',
    category: 'milk',
    packSize: 'Case of 12 x 32oz (11,350ml)',
    packPrice: 44.00,
    unitYieldMl: 11350,
    unitCostPerMl: 0.00387, // ~$0.11 per 30ml / ~$0.85 per 220ml
    densityBrix: 12.0,
    supplier: 'Sysco Metro Supply',
    scrapType: 'milk_steaming',
    colorHex: '#f3ece1',
    layerType: 'milk'
  },
  {
    id: 'califia-almond',
    name: 'Califia Farms Barista Almond Blend',
    category: 'milk',
    packSize: 'Case of 6 x 32oz (5,678ml)',
    packPrice: 26.50,
    unitYieldMl: 5678,
    unitCostPerMl: 0.00466,
    densityBrix: 6.5,
    supplier: 'UNFI Specialty Distribution',
    scrapType: 'milk_steaming',
    colorHex: '#faf5ed',
    layerType: 'milk'
  },
  {
    id: 'organic-whole-milk',
    name: 'Organic Valley Whole Milk (Grass-fed)',
    category: 'milk',
    packSize: 'Case of 4 x 1 Gallon (15,140ml)',
    packPrice: 22.00,
    unitYieldMl: 15140,
    unitCostPerMl: 0.00145,
    densityBrix: 11.5,
    supplier: 'Clover Sonoma Dairy',
    scrapType: 'milk_steaming',
    colorHex: '#fffdfa',
    layerType: 'milk'
  },

  // TEAS & MATCHA
  {
    id: 'ceremonial-matcha',
    name: 'Uji First-Harvest Ceremonial Matcha (60ml whisked)',
    category: 'tea',
    packSize: '500g Commercial Tin (Uji, Kyoto)',
    packPrice: 95.00,
    unitYieldMl: 10000,
    unitCostPerMl: 0.0095, // ~$0.57 per 60ml shot (3g matcha)
    densityBrix: 5.0,
    supplier: 'Ippodo / Marukyu Koyamaen Direct',
    scrapType: 'standard',
    colorHex: '#2d6a4f',
    layerType: 'matcha'
  },
  {
    id: 'ceylon-black-tea',
    name: 'Royal Ceylon Strong Black Tea Base',
    category: 'tea',
    packSize: '1kg Bulk Loose Leaf',
    packPrice: 18.00,
    unitYieldMl: 25000,
    unitCostPerMl: 0.00072,
    densityBrix: 3.5,
    supplier: 'TeaSource Wholesale',
    scrapType: 'standard',
    colorHex: '#8b2e0b',
    layerType: 'tea'
  },
  {
    id: 'jasmine-green-tea',
    name: 'High Mountain Jasmine Green Tea Brew',
    category: 'tea',
    packSize: '1kg Loose Blossom Leaf',
    packPrice: 22.00,
    unitYieldMl: 28000,
    unitCostPerMl: 0.00078,
    densityBrix: 2.8,
    supplier: 'Sunwide Global Boba',
    scrapType: 'standard',
    colorHex: '#d4a373',
    layerType: 'tea'
  },

  // SYRUPS & SWEETENERS (High Brix)
  {
    id: 'tiger-brown-sugar-syrup',
    name: 'House Okinawa Spiced Brown Sugar Syrup (68° Brix)',
    category: 'syrup',
    packSize: '2.5kg Jug',
    packPrice: 14.50,
    unitYieldMl: 1900,
    unitCostPerMl: 0.0076,
    densityBrix: 68.0,
    supplier: 'Bossen Food Corp',
    scrapType: 'syrup_line',
    colorHex: '#4a1e06',
    layerType: 'dense_syrup'
  },
  {
    id: 'vanilla-madagascar',
    name: 'Madagascar Pure Vanilla Bean Syrup',
    category: 'syrup',
    packSize: '750ml Glass Bottle',
    packPrice: 9.80,
    unitYieldMl: 750,
    unitCostPerMl: 0.0130, // ~$0.26 per 20ml pump
    densityBrix: 62.0,
    supplier: '1883 Maison Routin',
    scrapType: 'syrup_line',
    colorHex: '#c68b59',
    layerType: 'dense_syrup'
  },
  {
    id: 'taro-puree',
    name: 'Fresh Steamed Taro & Purple Sweet Potato Purée',
    category: 'syrup',
    packSize: '3kg Tub',
    packPrice: 19.00,
    unitYieldMl: 2500,
    unitCostPerMl: 0.0076,
    densityBrix: 45.0,
    supplier: 'Sunwide Global Boba',
    scrapType: 'boba_pearls',
    colorHex: '#7b5294',
    layerType: 'dense_syrup'
  },
  {
    id: 'strawberry-compote',
    name: 'Macerated Organic Strawberry Compote Purée',
    category: 'syrup',
    packSize: '2000ml Foodservice Tub',
    packPrice: 16.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.0080,
    densityBrix: 48.0,
    supplier: 'Les Vergers Boiron',
    scrapType: 'syrup_line',
    colorHex: '#c9184a',
    layerType: 'dense_syrup'
  },

  // BOBA TOPPINGS & CLOUDS
  {
    id: 'tiger-boba-pearls',
    name: 'Fresh Warm Tiger Tapioca Pearls (4h window)',
    category: 'topping',
    packSize: 'Case of 6 x 3kg bags (18kg total)',
    packPrice: 52.00,
    unitYieldMl: 15000,
    unitCostPerMl: 0.0034, // ~$0.20 per 60g scoop
    densityBrix: 72.0,
    supplier: 'Bossen Food Corp',
    scrapType: 'boba_pearls',
    colorHex: '#1a0c02',
    layerType: 'bottom_boba'
  },
  {
    id: 'cheese-foam-cap',
    name: 'Sea Salt Himalayan Cheese Cream Cap',
    category: 'topping',
    packSize: 'House Batch (1500ml yield)',
    packPrice: 6.20,
    unitYieldMl: 1500,
    unitCostPerMl: 0.0041,
    densityBrix: 22.0,
    supplier: 'House Recipe Blend',
    scrapType: 'milk_steaming',
    colorHex: '#fffdf0',
    layerType: 'top_foam'
  },

  // SPIRITS & COCKTAIL MODIFIERS
  {
    id: 'artisanal-mezcal',
    name: 'Del Maguey Vida Artisanal Mezcal (45ml / 1.5oz)',
    category: 'spirit',
    packSize: '750ml Bottle',
    packPrice: 34.00,
    unitYieldMl: 750,
    unitCostPerMl: 0.0453, // ~$2.04 per 1.5oz pour
    densityBrix: 0.5,
    supplier: 'Southern Glazer Wine & Spirits',
    scrapType: 'standard',
    colorHex: '#ebe9dc',
    layerType: 'spirit'
  },
  {
    id: 'campari-aperitivo',
    name: 'Campari Bitter Aperitivo (30ml / 1oz)',
    category: 'spirit',
    packSize: '750ml Bottle',
    packPrice: 26.00,
    unitYieldMl: 750,
    unitCostPerMl: 0.0346,
    densityBrix: 24.0,
    supplier: 'RNDC Distribution',
    scrapType: 'standard',
    colorHex: '#c9184a',
    layerType: 'spirit'
  },
  {
    id: 'fresh-lime-juice',
    name: 'Fresh Hand-Pressed Key Lime Juice',
    category: 'citrus',
    packSize: 'Case of 200 Limes (1800ml yield)',
    packPrice: 28.00,
    unitYieldMl: 1800,
    unitCostPerMl: 0.0155,
    densityBrix: 8.5,
    supplier: 'FreshPoint Produce',
    scrapType: 'fresh_citrus',
    colorHex: '#d8f3dc',
    layerType: 'liquid'
  },
  {
    id: 'smoked-rosemary-syrup',
    name: 'Smoked Rosemary Agave Nectar',
    category: 'syrup',
    packSize: '1000ml Batch',
    packPrice: 8.50,
    unitYieldMl: 1000,
    unitCostPerMl: 0.0085,
    densityBrix: 55.0,
    supplier: 'In-House Bar Lab',
    scrapType: 'syrup_line',
    colorHex: '#7f5539',
    layerType: 'dense_syrup'
  }
]

export const PACKAGING_ITEMS = [
  { id: 'cup-16oz-pet', name: '16oz Crystal-Clear PET Cup', unitCost: 0.14, category: 'cold', supplier: 'EcoCraft Packaging' },
  { id: 'lid-sip-cold', name: 'Strawless Sip-Through Clear Lid', unitCost: 0.06, category: 'cold', supplier: 'EcoCraft Packaging' },
  { id: 'lid-dome-boba', name: 'Wide-Hole Dome Lid (for Boba Straw)', unitCost: 0.07, category: 'boba', supplier: 'EcoCraft Packaging' },
  { id: 'boba-bamboo-straw', name: '12mm Compostable Bamboo Fiber Boba Straw', unitCost: 0.05, category: 'boba', supplier: 'PlanetBoba Supplies' },
  { id: 'kraft-sleeve', name: 'Embossed Corrugated Kraft Sleeve', unitCost: 0.04, category: 'both', supplier: 'PrintHub B2B' },
  { id: 'custom-logo-label', name: 'Waterproof Die-Cut UV Gloss Label', unitCost: 0.03, category: 'both', supplier: 'StickerMule Wholesale' },
  { id: 'cocktail-garnish-pick', name: 'Bamboo Knotted Craft Cocktail Pick & Brand Tag', unitCost: 0.04, category: 'cocktail', supplier: 'BarProducts B2B' },
]
