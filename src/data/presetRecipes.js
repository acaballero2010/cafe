// Specialty Drink Presets with exact layering, cup type, ice levels, and visual styling

export const PRESET_RECIPES = [
  {
    id: 'iced-brown-sugar-shaken',
    name: 'Iced Brown Sugar Oat Shaken Espresso',
    venue: 'coffee',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard', // 35%
    menuPrice: 6.75,
    targetMarginPct: 78,
    description: 'Double shot blonde roast espresso shaken vigorously with spiced brown sugar & topped with velvety oat milk.',
    garnishes: ['Ceylon Cinnamon Dust', 'Double Wall Rim'],
    packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'kraft-sleeve', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-syrup',
        ingredientId: 'tiger-brown-sugar-syrup',
        name: 'House Spiced Brown Sugar (68° Brix)',
        volumeMl: 25,
        unitCostPerMl: 0.0076,
        colorHex: '#3b1d0b',
        densityBrix: 68,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-espresso',
        ingredientId: 'ethiopia-espresso',
        name: 'Ethiopia Guji Espresso (Double Shot)',
        volumeMl: 36,
        unitCostPerMl: 0.0105,
        colorHex: '#422415',
        densityBrix: 9.5,
        scrapType: 'espresso',
        isTopOff: false,
        layerType: 'espresso'
      },
      {
        id: 'layer-milk',
        ingredientId: 'oatly-barista',
        name: 'Oatly Barista Edition (Top-Off)',
        volumeMl: 0, // Auto calculated by liquid displacement!
        unitCostPerMl: 0.00387,
        colorHex: '#f4ede2',
        densityBrix: 12.0,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      }
    ],
    sopSteps: [
      'Pump 25ml House Brown Sugar Syrup into stainless shaker.',
      'Pull 36ml Ethiopia Guji double espresso shot directly over syrup.',
      'Add 1 scoop ice (140g) and shake vigorously for 12 seconds to aerate microfoam.',
      'Strain over fresh 35% ice in 16oz PET cup.',
      'Top off smoothly with chilled Oatly Barista (~246ml). Dust with ground Ceylon cinnamon.'
    ]
  },
  {
    id: 'strawberry-matcha-cloud',
    name: 'Strawberry Uji Matcha Cloud Latte',
    venue: 'coffee',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    menuPrice: 7.25,
    targetMarginPct: 80,
    description: 'Distinct tri-layer beauty: House organic strawberry compote, silk whole milk, floated with whisked Kyoto ceremonial matcha.',
    garnishes: ['Matcha Dust', 'Freeze-Dried Strawberry'],
    packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-strawberry',
        ingredientId: 'strawberry-compote',
        name: 'Organic Strawberry Compote Purée',
        volumeMl: 40,
        unitCostPerMl: 0.0080,
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
        volumeMl: 0, // Auto calculated top off
        unitCostPerMl: 0.00387,
        colorHex: '#fcf8f2',
        densityBrix: 12.0,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      },
      {
        id: 'layer-matcha',
        ingredientId: 'ceremonial-matcha',
        name: 'Uji Ceremonial Matcha Float',
        volumeMl: 60,
        unitCostPerMl: 0.0095,
        colorHex: '#2d6a4f',
        densityBrix: 5.0,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'matcha'
      }
    ],
    sopSteps: [
      'Spoon 40ml strawberry compote at base of 16oz cup and swirl up the sides for marbling effect.',
      'Fill cup with 35% standard ice cubes.',
      'Slowly pour oat milk up to 1.5 inches below rim.',
      'Whisk 3g Uji ceremonial matcha with 60ml 80°C water using bamboo chasen.',
      'Slowly float whisked green matcha over the milk using the back of a bar spoon for clean color separation.'
    ]
  },
  {
    id: 'tiger-boba-brown-sugar',
    name: 'Tiger Stripe Brown Sugar Milk (Salted Foam)',
    venue: 'boba',
    vesselId: 'boba-20oz',
    iceTypeId: 'standard', // 35%
    menuPrice: 7.50,
    targetMarginPct: 82,
    description: 'Slow-cooked warm tapioca pearls, flame-marbled brown sugar stripes, fresh milk, capped with Himalayan sea salt cream.',
    garnishes: ['Torched Brown Sugar Brulee', 'Extra Thick Straw'],
    packagingIds: ['cup-16oz-pet', 'lid-dome-boba', 'boba-bamboo-straw', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-boba',
        ingredientId: 'tiger-boba-pearls',
        name: 'Warm Tiger Brown Sugar Tapioca',
        volumeMl: 75,
        unitCostPerMl: 0.0034,
        colorHex: '#120803',
        densityBrix: 72,
        scrapType: 'boba_pearls',
        isTopOff: false,
        layerType: 'bottom_boba'
      },
      {
        id: 'layer-syrup',
        ingredientId: 'tiger-brown-sugar-syrup',
        name: 'Okinawa Tiger Stripe Drizzle',
        volumeMl: 30,
        unitCostPerMl: 0.0076,
        colorHex: '#4a1e06',
        densityBrix: 68,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-milk',
        ingredientId: 'organic-whole-milk',
        name: 'Organic Grass-Fed Whole Milk (Top-Off)',
        volumeMl: 0,
        unitCostPerMl: 0.00145,
        colorHex: '#fffefa',
        densityBrix: 11.5,
        scrapType: 'milk_steaming',
        isTopOff: true,
        layerType: 'milk'
      },
      {
        id: 'layer-cheese-cap',
        ingredientId: 'cheese-foam-cap',
        name: 'Sea Salt Himalayan Cheese Cream Cap',
        volumeMl: 50,
        unitCostPerMl: 0.0041,
        colorHex: '#fffbee',
        densityBrix: 22,
        scrapType: 'milk_steaming',
        isTopOff: false,
        layerType: 'top_foam'
      }
    ],
    sopSteps: [
      'Scoop 75ml fresh warm boba pearls into bottom of 20oz cup.',
      'Coat the inner walls of the cup with 30ml thick brown sugar syrup by tilting and rotating.',
      'Fill with standard ice to 80% mark.',
      'Pour chilled whole milk to fill line.',
      'Layer 50ml salted cheese cream on top and dust with organic demerara sugar before torching for 3 seconds.'
    ]
  },
  {
    id: 'smoked-rosemary-mezcal-sour',
    name: 'Smoked Rosemary Agave Mezcal Sour',
    venue: 'cocktail',
    vesselId: 'coupe-7oz',
    iceTypeId: 'none', // Chilled & strained
    menuPrice: 18.00,
    targetMarginPct: 84,
    description: 'Artisanal Oaxaca Mezcal, fresh hand-pressed lime juice, house-smoked rosemary nectar, silky emulsified foam head.',
    garnishes: ['Smoked Fresh Rosemary Sprig', 'Dehydrated Blood Orange Wheel'],
    packagingIds: ['cocktail-garnish-pick', 'custom-logo-label'],
    layers: [
      {
        id: 'layer-syrup',
        ingredientId: 'smoked-rosemary-syrup',
        name: 'House Smoked Rosemary Agave',
        volumeMl: 25,
        unitCostPerMl: 0.0085,
        colorHex: '#7f5539',
        densityBrix: 55,
        scrapType: 'syrup_line',
        isTopOff: false,
        layerType: 'dense_syrup'
      },
      {
        id: 'layer-lime',
        ingredientId: 'fresh-lime-juice',
        name: 'Fresh Key Lime Juice',
        volumeMl: 30,
        unitCostPerMl: 0.0155,
        colorHex: '#d8f3dc',
        densityBrix: 8.5,
        scrapType: 'fresh_citrus',
        isTopOff: false,
        layerType: 'liquid'
      },
      {
        id: 'layer-mezcal',
        ingredientId: 'artisanal-mezcal',
        name: 'Del Maguey Vida Artisanal Mezcal',
        volumeMl: 55,
        unitCostPerMl: 0.0453,
        colorHex: '#ebe9dc',
        densityBrix: 0.5,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'spirit'
      },
      {
        id: 'layer-foam',
        ingredientId: 'cheese-foam-cap',
        name: 'Aquafaba Botanical Froth Cap',
        volumeMl: 30,
        unitCostPerMl: 0.0041,
        colorHex: '#faf9f6',
        densityBrix: 4.0,
        scrapType: 'standard',
        isTopOff: false,
        layerType: 'top_foam'
      }
    ],
    sopSteps: [
      'Add 55ml mezcal, 30ml lime juice, and 25ml smoked rosemary syrup into shaker tin.',
      'Add 30ml aquafaba froth and dry shake without ice for 10 seconds to build silky emulsion.',
      'Add king cube ice and hard shake for 12 seconds until tin frosts.',
      'Double strain into pre-chilled 7oz Coupe glass.',
      'Torch a sprig of fresh rosemary over cedar wood and clip to rim.'
    ]
  }
]
