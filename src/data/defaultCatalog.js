// Raw Materials & Packaging Catalog (Philippine Peso ₱ Pricing & Localized Suppliers)

export const DEFAULT_CATALOG = [
  // COFFEE & BASES
  {
    id: 'ethiopia-espresso',
    name: 'Ethiopia Guji Heirloom (Double Shot 36ml / 18g dose)',
    category: 'coffee',
    packSize: '1kg (1000g) Specialty Roasted Bag',
    packPrice: 1450.00, // ₱1,450 / kg
    unitYieldMl: 2000,
    unitCostPerMl: 0.725, // ~₱19.50 per double shot (36ml output from 18g dry)
    densityBrix: 9.5,
    supplier: 'Yardstick Coffee Wholesale (Manila)',
    scrapType: 'espresso',
    colorHex: '#3d2012',
    layerType: 'espresso'
  },
  {
    id: 'colombia-espresso',
    name: 'Benguet / Mt. Apo Specialty Arabica (Double Shot 36ml)',
    category: 'coffee',
    packSize: '1kg Roaster Pack (Cordillera / Davao)',
    packPrice: 1100.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.550, // ~₱14.80 per double shot
    densityBrix: 9.0,
    supplier: 'Kalsada Coffee / Local Origin',
    scrapType: 'espresso',
    colorHex: '#4a2810',
    layerType: 'espresso'
  },
  {
    id: 'cold-brew-conc',
    name: 'Nitro Cold Brew Concentrate (1:4 Dilution Yield)',
    category: 'coffee',
    packSize: '3.8L (1 Gallon) Jug',
    packPrice: 1200.00,
    unitYieldMl: 3800,
    unitCostPerMl: 0.315,
    densityBrix: 7.5,
    supplier: 'Manila Cold Brew Supply Co.',
    scrapType: 'standard',
    colorHex: '#261408',
    layerType: 'liquid'
  },

  // MILKS & ALT-MILKS
  {
    id: 'oatly-barista',
    name: 'Oatly Barista Edition Oat Milk',
    category: 'milk',
    packSize: 'Case of 6 x 1 Liter (6000ml)',
    packPrice: 1260.00, // ₱210 per liter
    unitYieldMl: 6000,
    unitCostPerMl: 0.210, // ~₱51.60 for 246ml top-off
    densityBrix: 12.0,
    supplier: 'BakeEtc / Gourmet Direct PH',
    scrapType: 'milk_steaming',
    colorHex: '#f3ece1',
    layerType: 'milk'
  },
  {
    id: 'califia-almond',
    name: 'Califia Farms Barista Almond Blend',
    category: 'milk',
    packSize: 'Case of 6 x 946ml (5,676ml)',
    packPrice: 1350.00,
    unitYieldMl: 5676,
    unitCostPerMl: 0.238,
    densityBrix: 6.5,
    supplier: 'Santini Fine Foods PH',
    scrapType: 'milk_steaming',
    colorHex: '#faf5ed',
    layerType: 'milk'
  },
  {
    id: 'organic-whole-milk',
    name: 'Emborg / Magnolia Fresh Whole Milk 3.8%',
    category: 'milk',
    packSize: 'Case of 12 x 1L (12,000ml)',
    packPrice: 1140.00, // ₱95 per liter
    unitYieldMl: 12000,
    unitCostPerMl: 0.095, // ~₱23.30 for 246ml top-off
    densityBrix: 11.5,
    supplier: 'San Miguel / Metro Foodservice',
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
    packPrice: 4800.00,
    unitYieldMl: 10000,
    unitCostPerMl: 0.480, // ~₱28.80 per 60ml serving
    densityBrix: 5.0,
    supplier: 'Matcha Manila Direct PH',
    scrapType: 'standard',
    colorHex: '#2d6a4f',
    layerType: 'matcha'
  },
  {
    id: 'ceylon-black-tea',
    name: 'Royal Ceylon Strong Black Tea Base',
    category: 'tea',
    packSize: '1kg Bulk Loose Leaf',
    packPrice: 850.00,
    unitYieldMl: 25000,
    unitCostPerMl: 0.034,
    densityBrix: 3.5,
    supplier: 'TeaSource PH Wholesale',
    scrapType: 'standard',
    colorHex: '#8b2e0b',
    layerType: 'tea'
  },
  {
    id: 'jasmine-green-tea',
    name: 'High Mountain Jasmine Green Tea Brew',
    category: 'tea',
    packSize: '1kg Loose Blossom Leaf',
    packPrice: 950.00,
    unitYieldMl: 28000,
    unitCostPerMl: 0.034,
    densityBrix: 2.8,
    supplier: 'Boba King Supply Manila',
    scrapType: 'standard',
    colorHex: '#d4a373',
    layerType: 'tea'
  },

  // SYRUPS & SWEETENERS (High Brix)
  {
    id: 'tiger-brown-sugar-syrup',
    name: 'House Muscovado Brown Sugar Syrup (68° Brix)',
    category: 'syrup',
    packSize: '2.5kg Jug',
    packPrice: 650.00,
    unitYieldMl: 1900,
    unitCostPerMl: 0.342, // ~₱8.55 for 25ml
    densityBrix: 68.0,
    supplier: 'Equicom Raw Sugar Bacolod',
    scrapType: 'syrup_line',
    colorHex: '#4a1e06',
    layerType: 'dense_syrup'
  },
  {
    id: 'vanilla-madagascar',
    name: 'Madagascar Pure Vanilla Bean Syrup',
    category: 'syrup',
    packSize: '750ml Glass Bottle (1883 Maison Routin)',
    packPrice: 580.00,
    unitYieldMl: 750,
    unitCostPerMl: 0.773,
    densityBrix: 62.0,
    supplier: 'Barista Depot Manila',
    scrapType: 'syrup_line',
    colorHex: '#c68b59',
    layerType: 'dense_syrup'
  },
  {
    id: 'strawberry-compote',
    name: 'La Trinidad Organic Strawberry Compote',
    category: 'syrup',
    packSize: '2000ml Foodservice Tub',
    packPrice: 780.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.390,
    densityBrix: 48.0,
    supplier: 'Benguet Fruit Growers Direct',
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
    packPrice: 2400.00,
    unitYieldMl: 15000,
    unitCostPerMl: 0.160, // ~₱12.00 per 75g scoop
    densityBrix: 72.0,
    supplier: 'Top Creamery Food Mfg Corp',
    scrapType: 'boba_pearls',
    colorHex: '#1a0c02',
    layerType: 'bottom_boba'
  },
  {
    id: 'cheese-foam-cap',
    name: 'Sea Salt Himalayan Cheese Cream Cap',
    category: 'topping',
    packSize: 'House Batch (1500ml yield)',
    packPrice: 280.00,
    unitYieldMl: 1500,
    unitCostPerMl: 0.187,
    densityBrix: 22.0,
    supplier: 'In-House Prep Batch',
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
    packPrice: 1950.00,
    unitYieldMl: 750,
    unitCostPerMl: 2.60, // ~₱117.00 per 45ml
    densityBrix: 0.5,
    supplier: 'Wine Warehouse Manila',
    scrapType: 'standard',
    colorHex: '#ebe9dc',
    layerType: 'spirit'
  },
  {
    id: 'fresh-lime-juice',
    name: 'Fresh Pressed Calamansi / Key Lime Juice',
    category: 'citrus',
    packSize: '1kg Fruit Yield (800ml)',
    packPrice: 180.00,
    unitYieldMl: 800,
    unitCostPerMl: 0.225,
    densityBrix: 8.5,
    supplier: 'Divisoria Fresh Produce',
    scrapType: 'fresh_citrus',
    colorHex: '#d8f3dc',
    layerType: 'liquid'
  },
  {
    id: 'smoked-rosemary-syrup',
    name: 'Smoked Rosemary Agave Nectar',
    category: 'syrup',
    packSize: '1000ml Batch',
    packPrice: 420.00,
    unitYieldMl: 1000,
    unitCostPerMl: 0.420,
    densityBrix: 55.0,
    supplier: 'In-House Bar Lab',
    scrapType: 'syrup_line',
    colorHex: '#7f5539',
    layerType: 'dense_syrup'
  }
]

export const PACKAGING_ITEMS = [
  { id: 'cup-16oz-pet', name: '16oz Crystal-Clear 95mm U-Cup (PET)', unitCost: 4.80, category: 'cold', supplier: 'EcoPack Manila' },
  { id: 'lid-sip-cold', name: 'Strawless Direct-Sip Clear Lid', unitCost: 1.80, category: 'cold', supplier: 'EcoPack Manila' },
  { id: 'lid-dome-boba', name: 'Wide-Hole Dome Lid for Boba', unitCost: 2.00, category: 'boba', supplier: 'EcoPack Manila' },
  { id: 'boba-bamboo-straw', name: '12mm Compostable Bamboo Boba Straw', unitCost: 1.50, category: 'boba', supplier: 'EcoFriendly PH' },
  { id: 'kraft-sleeve', name: 'Embossed Corrugated Kraft Sleeve', unitCost: 1.20, category: 'both', supplier: 'PrintHub B2B Manila' },
  { id: 'custom-logo-label', name: 'Waterproof Die-Cut UV Gloss Sticker', unitCost: 0.90, category: 'both', supplier: 'StickerPrint PH' },
  { id: 'cocktail-garnish-pick', name: 'Bamboo Knotted Craft Pick', unitCost: 1.20, category: 'cocktail', supplier: 'BarEquip PH' }
]
