// Specialty Drink Presets with Philippine Peso (₱) Costing & Precise Layering

export const PRESET_RECIPES = [
  {
    id: 'iced-brown-sugar-shaken',
    name: 'Iced Brown Sugar Oat Shaken Espresso',
    venue: 'coffee',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard', // 35%
    menuPrice: 185.00, // ₱185 retail
    targetMarginPct: 75,
    description: 'Double shot blonde roast espresso shaken vigorously with spiced Muscovado brown sugar & topped with velvety oat milk.',
    garnishes: ['Ceylon Cinnamon Dust', 'Double Wall Rim'],
    packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'kraft-sleeve', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-syrup',
        ingredientId: 'tiger-brown-sugar-syrup',
        name: 'House Muscovado Syrup (25ml / 2 pumps)',
        volumeMl: 25,
        unitCostPerMl: 0.342, // ~₱8.55
        colorHex: '#3b1d0b',
        densityBrix: 68,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-espresso',
        ingredientId: 'ethiopia-espresso',
        name: 'Ethiopia Guji Espresso (2 shots / 36ml)',
        volumeMl: 36,
        unitCostPerMl: 0.725, // ~₱26.10
        colorHex: '#422415',
        densityBrix: 9.5,
        scrapType: 'espresso',
        isTopOff: false,
        layerType: 'espresso'
      },
      {
        id: 'layer-milk',
        ingredientId: 'oatly-barista',
        name: 'Oatly Barista Oat Milk (Top-Off)',
        volumeMl: 0, // Auto calculated: 246ml -> ~₱51.60
        unitCostPerMl: 0.210,
        colorHex: '#f4ede2',
        densityBrix: 12.0,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      }
    ],
    sopSteps: [
      'Pump 25ml House Muscovado Syrup into stainless shaker.',
      'Pull 36ml double espresso shot directly over syrup.',
      'Add 1 scoop ice (140g) and shake vigorously for 10-12 seconds until dense crema forms.',
      'Strain over fresh regular ice in 16oz PET cup.',
      'Top off smoothly with chilled Oatly Barista (~246ml). Dust lightly with Ceylon cinnamon.'
    ]
  },
  {
    id: 'strawberry-matcha-cloud',
    name: 'Strawberry Uji Matcha Cloud Latte',
    venue: 'coffee',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    menuPrice: 210.00,
    targetMarginPct: 78,
    description: 'Tri-layer signature: La Trinidad organic strawberry compote, silk oat milk, floated with Kyoto ceremonial matcha.',
    garnishes: ['Matcha Dust', 'Freeze-Dried Strawberry'],
    packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-strawberry',
        ingredientId: 'strawberry-compote',
        name: 'Organic Strawberry Compote (40ml)',
        volumeMl: 40,
        unitCostPerMl: 0.390,
        colorHex: '#c9184a',
        densityBrix: 48,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-milk',
        ingredientId: 'oatly-barista',
        name: 'Oatly Barista Oat Milk (Body)',
        volumeMl: 0,
        unitCostPerMl: 0.210,
        colorHex: '#fcf8f2',
        densityBrix: 12.0,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      },
      {
        id: 'layer-matcha',
        ingredientId: 'ceremonial-matcha',
        name: 'Uji Ceremonial Matcha Float (60ml)',
        volumeMl: 60,
        unitCostPerMl: 0.480,
        colorHex: '#2d6a4f',
        densityBrix: 5.0,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'matcha'
      }
    ],
    sopSteps: [
      'Spoon 40ml strawberry compote at base of cup and swirl up the sides for marbling.',
      'Fill cup with regular ice cubes to 75% mark.',
      'Slowly pour oat milk up to 1.5 inches below rim.',
      'Whisk 3g Uji matcha with 60ml warm 80°C water using bamboo chasen.',
      'Float whisked green matcha gently over the milk with a bar spoon for clean separation.'
    ]
  },
  {
    id: 'tiger-boba-brown-sugar',
    name: 'Tiger Stripe Brown Sugar Boba Fresh Milk',
    venue: 'boba',
    vesselId: 'boba-20oz',
    iceTypeId: 'standard',
    menuPrice: 165.00,
    targetMarginPct: 80,
    description: 'Slow-cooked warm brown sugar tapioca pearls, flame-marbled cup stripes, fresh milk, capped with Himalayan sea salt cream.',
    garnishes: ['Torched Muscovado Sugar', 'Thick 12mm Straw'],
    packagingIds: ['cup-16oz-pet', 'lid-dome-boba', 'boba-bamboo-straw', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-boba',
        ingredientId: 'tiger-boba-pearls',
        name: 'Warm Tiger Tapioca Pearls (75g)',
        volumeMl: 75,
        unitCostPerMl: 0.160,
        colorHex: '#120803',
        densityBrix: 72,
        scrapType: 'boba_pearls',
        isTopOff: false,
        layerType: 'bottom_boba'
      },
      {
        id: 'layer-syrup',
        ingredientId: 'tiger-brown-sugar-syrup',
        name: 'Muscovado Tiger Stripe Drizzle (30ml)',
        volumeMl: 30,
        unitCostPerMl: 0.342,
        colorHex: '#4a1e06',
        densityBrix: 68,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-milk',
        ingredientId: 'organic-whole-milk',
        name: 'Magnolia / Emborg Fresh Milk (Top-Off)',
        volumeMl: 0,
        unitCostPerMl: 0.095,
        colorHex: '#fffefa',
        densityBrix: 11.5,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      },
      {
        id: 'layer-cheese-cap',
        ingredientId: 'cheese-foam-cap',
        name: 'Sea Salt Himalayan Cheese Cream Cap (50ml)',
        volumeMl: 50,
        unitCostPerMl: 0.187,
        colorHex: '#fffbee',
        densityBrix: 22,
        scrapType: 'milk_steaming',
        isTopOff: false,
        layerType: 'top_foam'
      }
    ],
    sopSteps: [
      'Scoop 75g fresh warm boba pearls into bottom of 20oz cup.',
      'Coat inner cup walls with 30ml thick brown sugar syrup by rotating cup.',
      'Fill with regular ice to fill line.',
      'Pour fresh cold milk smoothly.',
      'Layer 50ml salted cheese cream on top; dust with Muscovado sugar.'
    ]
  },
  {
    id: 'smoked-rosemary-mezcal-sour',
    name: 'Smoked Rosemary Agave Mezcal Sour',
    venue: 'cocktail',
    vesselId: 'coupe-7oz',
    iceTypeId: 'none',
    menuPrice: 380.00,
    targetMarginPct: 82,
    description: 'Artisanal Mezcal, fresh pressed Calamansi/Lime juice, smoked rosemary agave nectar, silky foam head.',
    garnishes: ['Smoked Fresh Rosemary Sprig', 'Dehydrated Citrus Wheel'],
    packagingIds: ['cocktail-garnish-pick', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-syrup',
        ingredientId: 'smoked-rosemary-syrup',
        name: 'Smoked Rosemary Agave (25ml)',
        volumeMl: 25,
        unitCostPerMl: 0.420,
        colorHex: '#7f5539',
        densityBrix: 55,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-lime',
        ingredientId: 'fresh-lime-juice',
        name: 'Fresh Key Lime / Calamansi (30ml)',
        volumeMl: 30,
        unitCostPerMl: 0.225,
        colorHex: '#d8f3dc',
        densityBrix: 8.5,
        scrapType: 'fresh_citrus',
        isTopOff: false,
        layerType: 'liquid'
      },
      {
        id: 'layer-mezcal',
        ingredientId: 'artisanal-mezcal',
        name: 'Del Maguey Artisanal Mezcal (45ml)',
        volumeMl: 45,
        unitCostPerMl: 2.600,
        colorHex: '#ebe9dc',
        densityBrix: 0.5,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'spirit'
      },
      {
        id: 'layer-foam',
        ingredientId: 'cheese-foam-cap',
        name: 'Botanical Froth Cap (30ml)',
        volumeMl: 30,
        unitCostPerMl: 0.187,
        colorHex: '#faf9f6',
        densityBrix: 4.0,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'top_foam'
      }
    ],
    sopSteps: [
      'Add 45ml mezcal, 30ml lime juice, and 25ml smoked rosemary syrup into shaker tin.',
      'Dry shake without ice for 8 seconds to build emulsion.',
      'Add ice and hard shake for 12 seconds until tin frosts.',
      'Double strain into pre-chilled 7oz Coupe glass.',
      'Torch a sprig of fresh rosemary and clip to rim.'
    ]
  }
]
