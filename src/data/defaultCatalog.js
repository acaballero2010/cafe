// Raw Materials & Packaging Catalog (Philippine Peso ₱ Pricing & Localized Brand Database)

export const DEFAULT_CATALOG = [
  // ==========================================
  // 1. COFFEE & BASES (Value, Signature, Artisanal)
  // ==========================================
  {
    id: 'commercial-espresso-blend',
    name: 'Commercial Robusta/Arabica Dark Roast Blend',
    brand: 'Bataan Roasters Bulk',
    tier: 'value',
    flavorType: 'espresso',
    category: 'coffee',
    packSize: '1kg Bulk Roaster Pack',
    packPrice: 760.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.380, // ~₱10.20 per double shot
    densityBrix: 8.0,
    supplier: 'Metro Manila B2B Roasters',
    scrapType: 'espresso',
    colorHex: '#2b170c',
    layerType: 'espresso'
  },
  {
    id: 'colombia-espresso',
    name: 'Benguet / Mt. Apo Specialty Arabica (Double Shot 36ml)',
    brand: 'Kalsada Coffee / Local Origin',
    tier: 'signature',
    flavorType: 'espresso',
    category: 'coffee',
    packSize: '1kg Roaster Pack (Cordillera / Davao)',
    packPrice: 1100.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.550, // ~₱14.80 per double shot
    densityBrix: 9.0,
    supplier: 'Kalsada Coffee Direct',
    scrapType: 'espresso',
    colorHex: '#4a2810',
    layerType: 'espresso'
  },
  {
    id: 'ethiopia-espresso',
    name: 'Ethiopia Guji Heirloom Single-Origin Reserve (36ml)',
    brand: 'Yardstick Coffee Wholesale',
    tier: 'artisanal',
    flavorType: 'espresso',
    category: 'coffee',
    packSize: '1kg Specialty Nitrogen Flush Bag',
    packPrice: 1450.00,
    unitYieldMl: 2000,
    unitCostPerMl: 0.725, // ~₱19.50 per double shot
    densityBrix: 9.5,
    supplier: 'Yardstick Coffee Wholesale (Manila)',
    scrapType: 'espresso',
    colorHex: '#3d2012',
    layerType: 'espresso'
  },
  {
    id: 'cold-brew-conc',
    name: 'Nitro Cold Brew Concentrate (1:4 Dilution Yield)',
    brand: 'Manila Cold Brew Supply Co.',
    tier: 'signature',
    flavorType: 'espresso',
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

  // ==========================================
  // 2. MILKS & ALT-MILKS (Value, Signature, Artisanal)
  // ==========================================
  {
    id: 'commercial-fresh-milk',
    name: 'Commercial Barista Fresh Milk 3.2%',
    brand: 'Metro Foodservice Wholesale',
    tier: 'value',
    flavorType: 'milk_whole',
    category: 'milk',
    packSize: 'Case of 12 x 1L (12,000ml)',
    packPrice: 900.00, // ₱75 per liter
    unitYieldMl: 12000,
    unitCostPerMl: 0.075,
    densityBrix: 10.5,
    supplier: 'Metro Foodservice Wholesale',
    scrapType: 'milk_steaming',
    colorHex: '#fffefa',
    layerType: 'milk'
  },
  {
    id: 'organic-whole-milk',
    name: 'Emborg / Magnolia Fresh Whole Milk 3.8%',
    brand: 'Magnolia / Emborg Professional',
    tier: 'signature',
    flavorType: 'milk_whole',
    category: 'milk',
    packSize: 'Case of 12 x 1L (12,000ml)',
    packPrice: 1140.00, // ₱95 per liter
    unitYieldMl: 12000,
    unitCostPerMl: 0.095,
    densityBrix: 11.5,
    supplier: 'San Miguel / Metro Foodservice',
    scrapType: 'milk_steaming',
    colorHex: '#fffdfa',
    layerType: 'milk'
  },
  {
    id: 'hokkaido-milk',
    name: 'Japanese Hokkaido Farm Fresh Milk 4.0%',
    brand: 'Hokkaido Dairy Direct',
    tier: 'artisanal',
    flavorType: 'milk_whole',
    category: 'milk',
    packSize: 'Case of 12 x 1L (12,000ml)',
    packPrice: 2760.00, // ₱230 per liter
    unitYieldMl: 12000,
    unitCostPerMl: 0.230,
    densityBrix: 13.0,
    supplier: 'Gourmet Direct Imports PH',
    scrapType: 'milk_steaming',
    colorHex: '#fffef5',
    layerType: 'milk'
  },
  {
    id: 'commercial-oat-milk',
    name: 'Commercial Barista Oat Milk',
    brand: 'Boba King Supply',
    tier: 'value',
    flavorType: 'milk_oat',
    category: 'milk',
    packSize: 'Case of 6 x 1L (6,000ml)',
    packPrice: 720.00, // ₱120 per liter
    unitYieldMl: 6000,
    unitCostPerMl: 0.120,
    densityBrix: 11.0,
    supplier: 'Boba King Supply Manila',
    scrapType: 'milk_steaming',
    colorHex: '#f0ece1',
    layerType: 'milk'
  },
  {
    id: 'oatside-barista',
    name: 'Oatside Barista Blend Oat Milk',
    brand: 'Oatside PH',
    tier: 'signature',
    flavorType: 'milk_oat',
    category: 'milk',
    packSize: 'Case of 6 x 1L (6,000ml)',
    packPrice: 960.00, // ₱160 per liter
    unitYieldMl: 6000,
    unitCostPerMl: 0.160,
    densityBrix: 11.5,
    supplier: 'Oatside Direct PH',
    scrapType: 'milk_steaming',
    colorHex: '#f4ede4',
    layerType: 'milk'
  },
  {
    id: 'oatly-barista',
    name: 'Oatly Barista Edition Oat Milk (Sweden)',
    brand: 'Oatly',
    tier: 'artisanal',
    flavorType: 'milk_oat',
    category: 'milk',
    packSize: 'Case of 6 x 1L (6,000ml)',
    packPrice: 1260.00, // ₱210 per liter
    unitYieldMl: 6000,
    unitCostPerMl: 0.210,
    densityBrix: 12.0,
    supplier: 'BakeEtc / Gourmet Direct PH',
    scrapType: 'milk_steaming',
    colorHex: '#f3ece1',
    layerType: 'milk'
  },

  // ==========================================
  // 3. CARAMEL & SAUCES (Value, Signature, Artisanal)
  // ==========================================
  {
    id: 'value-caramel-sauce',
    name: 'Top Creamery Salted Caramel Syrup',
    brand: 'Top Creamery Food Mfg',
    tier: 'value',
    flavorType: 'caramel',
    category: 'syrup',
    packSize: '2.5kg Commercial Jug',
    packPrice: 400.00,
    unitYieldMl: 2500,
    unitCostPerMl: 0.160,
    densityBrix: 60.0,
    supplier: 'Top Creamery Direct',
    scrapType: 'syrup_line',
    colorHex: '#b45309',
    layerType: 'dense_syrup'
  },
  {
    id: 'torani-caramel-sauce',
    name: 'Torani Classic Salted Caramel Sauce (Puremade)',
    brand: 'Torani / Monin',
    tier: 'signature',
    flavorType: 'caramel',
    category: 'syrup',
    packSize: '1.89L (64oz) Bottle with Pump',
    packPrice: 650.00,
    unitYieldMl: 1890,
    unitCostPerMl: 0.342,
    densityBrix: 66.0,
    supplier: 'Barista Depot Manila',
    scrapType: 'syrup_line',
    colorHex: '#c2410c',
    layerType: 'dense_syrup'
  },
  {
    id: 'maison-routin-caramel',
    name: '1883 Maison Routin Fleur de Sel Salted Caramel',
    brand: '1883 Maison Routin (France)',
    tier: 'artisanal',
    flavorType: 'caramel',
    category: 'syrup',
    packSize: '1000ml Glass Bottle',
    packPrice: 773.00,
    unitYieldMl: 1000,
    unitCostPerMl: 0.773,
    densityBrix: 68.0,
    supplier: 'Gourmet Direct Imports PH',
    scrapType: 'syrup_line',
    colorHex: '#9a3412',
    layerType: 'dense_syrup'
  },

  // ==========================================
  // 4. VANILLA & FLAVORINGS (Value, Signature, Artisanal)
  // ==========================================
  {
    id: 'value-vanilla-syrup',
    name: 'Top Creamery French Vanilla Syrup',
    brand: 'Top Creamery Food Mfg',
    tier: 'value',
    flavorType: 'vanilla',
    category: 'syrup',
    packSize: '2.5kg Commercial Jug',
    packPrice: 400.00,
    unitYieldMl: 2500,
    unitCostPerMl: 0.160,
    densityBrix: 58.0,
    supplier: 'Top Creamery Direct',
    scrapType: 'syrup_line',
    colorHex: '#fef08a',
    layerType: 'dense_syrup'
  },
  {
    id: 'monin-vanilla-syrup',
    name: 'Monin French Vanilla Gourmet Syrup',
    brand: 'Monin',
    tier: 'signature',
    flavorType: 'vanilla',
    category: 'syrup',
    packSize: '700ml Glass Bottle',
    packPrice: 380.00,
    unitYieldMl: 700,
    unitCostPerMl: 0.542,
    densityBrix: 62.0,
    supplier: 'Barista Depot Manila',
    scrapType: 'syrup_line',
    colorHex: '#fef08a',
    layerType: 'dense_syrup'
  },
  {
    id: 'vanilla-madagascar',
    name: '1883 Maison Routin Madagascar Pure Vanilla Bean',
    brand: '1883 Maison Routin (France)',
    tier: 'artisanal',
    flavorType: 'vanilla',
    category: 'syrup',
    packSize: '750ml Glass Bottle',
    packPrice: 580.00,
    unitYieldMl: 750,
    unitCostPerMl: 0.773,
    densityBrix: 64.0,
    supplier: 'Barista Depot Manila',
    scrapType: 'syrup_line',
    colorHex: '#c68b59',
    layerType: 'dense_syrup'
  },

  // ==========================================
  // 5. BROWN SUGAR & MUSCOVADO
  // ==========================================
  {
    id: 'tiger-brown-sugar-syrup',
    name: 'House Muscovado Brown Sugar Syrup (68° Brix)',
    brand: 'Equicom Raw Sugar Bacolod',
    tier: 'signature',
    flavorType: 'brown_sugar',
    category: 'syrup',
    packSize: '2.5kg Jug',
    packPrice: 650.00,
    unitYieldMl: 1900,
    unitCostPerMl: 0.342,
    densityBrix: 68.0,
    supplier: 'Equicom Raw Sugar Bacolod',
    scrapType: 'syrup_line',
    colorHex: '#4a1e06',
    layerType: 'dense_syrup'
  },
  {
    id: 'okinawa-black-sugar',
    name: 'Artisanal Okinawa Kokuto Black Sugar Puree',
    brand: 'Okinawa Artisanal Imports',
    tier: 'artisanal',
    flavorType: 'brown_sugar',
    category: 'syrup',
    packSize: '1000ml Jar',
    packPrice: 650.00,
    unitYieldMl: 1000,
    unitCostPerMl: 0.650,
    densityBrix: 72.0,
    supplier: 'Gourmet Direct Imports PH',
    scrapType: 'syrup_line',
    colorHex: '#291204',
    layerType: 'dense_syrup'
  },
  {
    id: 'value-cane-syrup',
    name: 'Value Pure Cane / Fructose Syrup',
    brand: 'Top Creamery Food Mfg',
    tier: 'value',
    flavorType: 'brown_sugar',
    category: 'syrup',
    packSize: '2.5kg Commercial Jug',
    packPrice: 400.00,
    unitYieldMl: 2500,
    unitCostPerMl: 0.160,
    densityBrix: 65.0,
    supplier: 'Top Creamery Direct',
    scrapType: 'syrup_line',
    colorHex: '#fef08a',
    layerType: 'dense_syrup'
  },

  // ==========================================
  // 6. TEAS, MATCHA & BOTANICALS
  // ==========================================
  {
    id: 'ceremonial-matcha',
    name: 'Uji First-Harvest Ceremonial Matcha (60ml)',
    brand: 'Kyoto Uji Direct',
    tier: 'artisanal',
    flavorType: 'matcha',
    category: 'tea',
    packSize: '500g Commercial Tin (Kyoto)',
    packPrice: 4800.00,
    unitYieldMl: 10000,
    unitCostPerMl: 0.480,
    densityBrix: 5.0,
    supplier: 'Matcha Manila Direct PH',
    scrapType: 'standard',
    colorHex: '#2d6a4f',
    layerType: 'matcha'
  },
  {
    id: 'signature-matcha',
    name: 'Kyoto Barista Grade Ceremonial Matcha Blend',
    brand: 'Matcha Manila Specialty',
    tier: 'signature',
    flavorType: 'matcha',
    category: 'tea',
    packSize: '1kg Foil Pack',
    packPrice: 3200.00,
    unitYieldMl: 10000,
    unitCostPerMl: 0.320,
    densityBrix: 4.5,
    supplier: 'Matcha Manila Direct PH',
    scrapType: 'standard',
    colorHex: '#40916c',
    layerType: 'matcha'
  },
  {
    id: 'ceylon-black-tea',
    name: 'Royal Ceylon Strong Black Tea Base',
    brand: 'TeaSource PH Wholesale',
    tier: 'signature',
    flavorType: 'tea',
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
    name: 'High Mountain Jasmine Blossom First Flush',
    brand: 'Boba King / TeaSource',
    tier: 'artisanal',
    flavorType: 'tea',
    category: 'tea',
    packSize: '1kg Loose Blossom Leaf',
    packPrice: 1600.00,
    unitYieldMl: 25000,
    unitCostPerMl: 0.064,
    densityBrix: 2.8,
    supplier: 'Boba King Supply Manila',
    scrapType: 'standard',
    colorHex: '#d4a373',
    layerType: 'tea'
  },

  // ==========================================
  // 7. BOBA TOPPINGS & CLOUDS
  // ==========================================
  {
    id: 'tiger-boba-pearls',
    name: 'Fresh Warm Tiger Tapioca Pearls (4h window)',
    brand: 'Top Creamery Food Mfg Corp',
    tier: 'signature',
    flavorType: 'topping',
    category: 'topping',
    packSize: 'Case of 6 x 3kg bags (18kg total)',
    packPrice: 2400.00,
    unitYieldMl: 15000,
    unitCostPerMl: 0.160,
    densityBrix: 72.0,
    supplier: 'Top Creamery Food Mfg Corp',
    scrapType: 'boba_pearls',
    colorHex: '#1a0c02',
    layerType: 'bottom_boba'
  },
  {
    id: 'cheese-foam-cap',
    name: 'Sea Salt Himalayan Cheese Cream Cap',
    brand: 'In-House Prep Batch',
    tier: 'signature',
    flavorType: 'topping',
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

  // ==========================================
  // 8. CITRUS & COCKTAIL SPIRITS
  // ==========================================
  {
    id: 'fresh-lime-juice',
    name: 'Fresh Pressed Calamansi / Key Lime Juice',
    brand: 'Divisoria Fresh Farm Produce',
    tier: 'signature',
    flavorType: 'citrus',
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
    id: 'artisanal-mezcal',
    name: 'Del Maguey Vida Artisanal Mezcal (45ml)',
    brand: 'Del Maguey (Oaxaca)',
    tier: 'artisanal',
    flavorType: 'spirit',
    category: 'spirit',
    packSize: '750ml Bottle',
    packPrice: 1950.00,
    unitYieldMl: 750,
    unitCostPerMl: 2.60,
    densityBrix: 0.5,
    supplier: 'Wine Warehouse Manila',
    scrapType: 'standard',
    colorHex: '#ebe9dc',
    layerType: 'spirit'
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
