// Master Commercial Beverage Recipe Repository & Database (Philippine Peso ₱ Costing)

export const MASTER_RECIPE_REPOSITORY = [
  // 1. Specialty Espresso & Signatures
  {
    id: 'repo-caramel-macchiato',
    name: 'Iced Caramel Macchiato',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Faceted Tall Glass',
    menuPrice: 185.00,
    targetMarginPct: 78,
    prepTime: '2 mins',
    difficulty: 'Easy',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Thick golden caramel sauce dripping down interior glass walls, vanilla milk base, layered espresso float, and velvety cold foam.',
    tags: ['Best Seller', 'High Margin', 'Sweet & Velvety'],
    layers: [
      { id: 'l1', name: 'Madagascar Vanilla Syrup', volumeMl: 25, unitCostPerMl: 0.28, colorHex: '#d97706', densityBrix: 65 },
      { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 160, unitCostPerMl: 0.10, colorHex: '#fffdfa', densityBrix: 12 },
      { id: 'l3', name: 'Blonde Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l4', name: 'Vanilla Cold Foam & Caramel Drizzle', volumeMl: 30, unitCostPerMl: 0.35, colorHex: '#fef3c7', densityBrix: 35 }
    ],
    sensory: { sweetness: 75, acidity: 25, bitterness: 40, body: 80, aroma: 85, brix: 19.5 },
    sopSteps: [
      'Pump 25ml Vanilla Syrup into the base of a 16oz glass.',
      'Drizzle thick caramel sauce along the inside walls of the glass.',
      'Add 160ml chilled whole milk and fill glass with crystalline ice to 80%.',
      'Slowly pour 36ml blonde double espresso over ice to create clean separation.',
      'Top with cold foam and crosshatch caramel drizzle.'
    ]
  },
  {
    id: 'repo-brown-sugar-shaken',
    name: 'Iced Brown Sugar Oat Shaken Espresso',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Ribbed Highball',
    menuPrice: 190.00,
    targetMarginPct: 76,
    prepTime: '2 mins',
    difficulty: 'Medium',
    photoKey: 'brown-sugar-shaken',
    photoUrl: '/beverages/brown-sugar-shaken.jpg',
    description: 'Freshly pulled blonde espresso shaken vigorously with artisanal muscovado brown sugar and cinnamon, topped with silk oat milk.',
    tags: ['Specialty Trending', 'Plant Based', 'Aromatic'],
    layers: [
      { id: 'l1', name: 'House Muscovado Syrup', volumeMl: 25, unitCostPerMl: 0.32, colorHex: '#3b1d0b', densityBrix: 68 },
      { id: 'l2', name: 'Ethiopia Guji Blonde Double Shot', volumeMl: 36, unitCostPerMl: 0.72, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l3', name: 'Barista Oat Milk (Top-Off)', volumeMl: 180, unitCostPerMl: 0.21, colorHex: '#f4ede2', densityBrix: 12, isTopOff: true }
    ],
    sensory: { sweetness: 65, acidity: 35, bitterness: 45, body: 75, aroma: 90, brix: 16.2 },
    sopSteps: [
      'Pump 25ml Muscovado syrup into stainless shaker.',
      'Pull 36ml double blonde espresso directly over syrup.',
      'Add 140g ice and shake vigorously for 10-12s until dense microfoam crema forms.',
      'Strain over fresh ice in 16oz highball glass.',
      'Top off with chilled Oatly Barista oat milk and dust with Ceylon cinnamon.'
    ]
  },
  {
    id: 'repo-hot-spanish-latte',
    name: 'Artisanal Hot Spanish Latte',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'hot',
    vesselId: 'hot-8oz',
    vesselName: '8oz Ceramic Café Cup',
    menuPrice: 165.00,
    targetMarginPct: 80,
    prepTime: '2.5 mins',
    difficulty: 'Medium',
    photoKey: 'hot-spanish-latte',
    photoUrl: '/beverages/hot-latte-ceramic.jpg',
    description: 'Velvety steamed milk infused with premium sweetened condensed milk, rich double espresso, and swan latte art.',
    tags: ['Classic Favorite', 'High Margin', 'Silky Sweet'],
    layers: [
      { id: 'l1', name: 'Sweetened Condensed Milk', volumeMl: 20, unitCostPerMl: 0.18, colorHex: '#fef08a', densityBrix: 72 },
      { id: 'l2', name: 'Specialty Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l3', name: 'Steamed Microfoam Whole Milk', volumeMl: 180, unitCostPerMl: 0.10, colorHex: '#ffffff', densityBrix: 12, isTopOff: true }
    ],
    sensory: { sweetness: 70, acidity: 20, bitterness: 45, body: 85, aroma: 80, brix: 18.0 },
    sopSteps: [
      'Dispense 20ml condensed milk into pre-warmed 8oz ceramic cup.',
      'Pull double espresso directly onto condensed milk and stir well for 5 seconds.',
      'Steam whole milk to 62°C creating glossy microfoam.',
      'Pour with precision to etch rosette or swan latte art.'
    ]
  },
  {
    id: 'repo-sea-salt-latte',
    name: 'Sea Salt Cold Foam Iced Latte',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Cold Tumbler',
    menuPrice: 195.00,
    targetMarginPct: 79,
    prepTime: '2 mins',
    difficulty: 'Medium',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Smooth iced latte crowned with whipped sea salt cream that perfectly cuts through rich espresso and milk sweetness.',
    tags: ['Trending', 'Sweet & Savory', 'Signature Foam'],
    layers: [
      { id: 'l1', name: 'Simple Cane Syrup', volumeMl: 15, unitCostPerMl: 0.12, colorHex: '#fde68a', densityBrix: 65 },
      { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 160, unitCostPerMl: 0.10, colorHex: '#ffffff', densityBrix: 12 },
      { id: 'l3', name: 'Double Espresso Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l4', name: 'Himalayan Sea Salt Sweet Cream', volumeMl: 40, unitCostPerMl: 0.40, colorHex: '#fefce8', densityBrix: 28 }
    ],
    sensory: { sweetness: 60, acidity: 20, bitterness: 45, body: 85, aroma: 85, brix: 15.5 },
    sopSteps: [
      'Combine cane syrup and milk in cup with ice.',
      'Float freshly extracted espresso over milk.',
      'Froth heavy cream, condensed milk, and pinch of pink Himalayan sea salt into dense cream.',
      'Gently pour sea salt foam over the drink.'
    ]
  },

  // 2. Matcha, Hojicha & Tea Clouds
  {
    id: 'repo-strawberry-matcha',
    name: 'Strawberry Uji Matcha Cloud',
    category: 'matcha',
    categoryName: 'Matcha & Tea Clouds',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Cylindrical Glass',
    menuPrice: 210.00,
    targetMarginPct: 81,
    prepTime: '2.5 mins',
    difficulty: 'Medium',
    photoKey: 'matcha-strawberry',
    photoUrl: '/beverages/matcha-strawberry.jpg',
    description: 'Vibrant tri-layer aesthetic: crushed La Trinidad strawberry compote, silk milk, floated with whisked ceremonial Kyoto Uji matcha.',
    tags: ['Viral Social', 'Visual Aesthetic', 'High Margin'],
    layers: [
      { id: 'l1', name: 'Organic Strawberry Compote', volumeMl: 40, unitCostPerMl: 0.38, colorHex: '#c9184a', densityBrix: 48 },
      { id: 'l2', name: 'Barista Oat Milk', volumeMl: 150, unitCostPerMl: 0.21, colorHex: '#fcf8f2', densityBrix: 12 },
      { id: 'l3', name: 'Ceremonial Uji Matcha Whisked Float', volumeMl: 60, unitCostPerMl: 0.45, colorHex: '#38b000', densityBrix: 4.5 }
    ],
    sensory: { sweetness: 65, acidity: 50, bitterness: 30, body: 75, aroma: 95, brix: 17.0 },
    sopSteps: [
      'Spoon 40ml strawberry puree into bottom of glass.',
      'Fill glass with ice to top rim.',
      'Pour 150ml chilled milk gently over strawberry layer.',
      'Whisk 3g ceremonial matcha with 60ml 80°C water with chasen until frothy.',
      'Layer whisked matcha carefully on top of milk using a bar spoon.'
    ]
  },
  {
    id: 'repo-dirty-matcha',
    name: 'Dirty Uji Matcha Double Shot',
    category: 'matcha',
    categoryName: 'Matcha & Tea Clouds',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Ribbed Glass',
    menuPrice: 220.00,
    targetMarginPct: 79,
    prepTime: '2 mins',
    difficulty: 'Hard',
    photoKey: 'matcha-strawberry',
    photoUrl: '/beverages/matcha-strawberry.jpg',
    description: 'The ultimate barista crossover: rich ceremonial green matcha, fresh whole milk, crowned with a freshly pulled blonde espresso double shot.',
    tags: ['Barista Signature', 'Earthy & Bold', 'Double Caffeinated'],
    layers: [
      { id: 'l1', name: 'Whisked Ceremonial Matcha', volumeMl: 50, unitCostPerMl: 0.45, colorHex: '#2d6a4f', densityBrix: 18 },
      { id: 'l2', name: 'Fresh Milk Body', volumeMl: 150, unitCostPerMl: 0.10, colorHex: '#ffffff', densityBrix: 12 },
      { id: 'l3', name: 'Blonde Espresso Double Float', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 }
    ],
    sensory: { sweetness: 45, acidity: 30, bitterness: 65, body: 80, aroma: 95, brix: 14.0 },
    sopSteps: [
      'Whisk matcha and light syrup with warm water in base of glass.',
      'Add crystal ice and pour whole milk over matcha base.',
      'Extract double espresso and gently float over the milk layer.'
    ]
  },

  // 3. Artisan Boba & Milk Teas
  {
    id: 'repo-tiger-boba',
    name: 'Tiger Brown Sugar Boba Fresh Milk',
    category: 'boba',
    categoryName: 'Artisan Boba & Tea',
    temp: 'iced',
    vesselId: 'boba-20oz',
    vesselName: '20oz Boba Cup',
    menuPrice: 175.00,
    targetMarginPct: 82,
    prepTime: '1.5 mins',
    difficulty: 'Easy',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Warm slow-cooked brown sugar tapioca pearls, tiger stripe syrup walls, farm-fresh cold milk, and torched brown sugar cream.',
    tags: ['All-Time Favorite', 'High Volume', 'Dessert Drink'],
    layers: [
      { id: 'l1', name: 'Warm Brown Sugar Tapioca Pearls', volumeMl: 60, unitCostPerMl: 0.15, colorHex: '#1c1008', densityBrix: 62 },
      { id: 'l2', name: 'Dark Muscovado Tiger Glaze', volumeMl: 20, unitCostPerMl: 0.25, colorHex: '#2b1507', densityBrix: 70 },
      { id: 'l3', name: 'Fresh Jersey Full Cream Milk', volumeMl: 220, unitCostPerMl: 0.11, colorHex: '#ffffff', densityBrix: 12, isTopOff: true }
    ],
    sensory: { sweetness: 85, acidity: 10, bitterness: 15, body: 90, aroma: 75, brix: 22.5 },
    sopSteps: [
      'Scoop 60ml warm caramelized boba into 20oz cup.',
      'Coat the entire inside surface of cup with brown sugar syrup for tiger marbling.',
      'Add ice to 75% cup capacity.',
      'Pour ice-cold fresh milk to the rim line and serve with wide boba straw.'
    ]
  },

  // 4. Cold Brews & Cascara Tonics
  {
    id: 'repo-nitro-cascara-tonic',
    name: 'Yuzu Cascara Nitro Sparkling Tonic',
    category: 'coldbrew',
    categoryName: 'Cold Brew & Cascara',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Clear Glass',
    menuPrice: 195.00,
    targetMarginPct: 84,
    prepTime: '1.5 mins',
    difficulty: 'Easy',
    photoKey: 'takeaway-iced-cup',
    photoUrl: '/beverages/takeaway-iced-cup.jpg',
    description: 'Super-refreshing coffee cherry cascara tea reduction, Japanese yuzu citrus puree, and artisanal sparkling tonic water.',
    tags: ['Low Calorie', 'Ultra Refreshing', 'Zero Dairy'],
    layers: [
      { id: 'l1', name: 'Japanese Yuzu Puree', volumeMl: 20, unitCostPerMl: 0.42, colorHex: '#fef08a', densityBrix: 40 },
      { id: 'l2', name: 'Artisanal Cascara Cherry Concentrate', volumeMl: 60, unitCostPerMl: 0.22, colorHex: '#7f1d1d', densityBrix: 22 },
      { id: 'l3', name: 'Fever-Tree Sparkling Tonic Water', volumeMl: 160, unitCostPerMl: 0.15, colorHex: '#f8fafc', densityBrix: 8 }
    ],
    sensory: { sweetness: 50, acidity: 70, bitterness: 25, body: 40, aroma: 95, brix: 11.5 },
    sopSteps: [
      'Combine yuzu puree and cascara concentrate in base of glass.',
      'Fill glass with dense crystal ice.',
      'Pour chilled sparkling tonic water slowly down bar spoon to preserve effervescence.',
      'Garnish with a slice of dehydrated grapefruit or fresh rosemary sprig.'
    ]
  },
  {
    id: 'repo-coconut-cloud-coldbrew',
    name: 'Coconut Cloud Cold Brew',
    category: 'coldbrew',
    categoryName: 'Cold Brew & Cascara',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Tumbler',
    menuPrice: 190.00,
    targetMarginPct: 80,
    prepTime: '1.5 mins',
    difficulty: 'Easy',
    photoKey: 'brown-sugar-shaken',
    photoUrl: '/beverages/brown-sugar-shaken.jpg',
    description: '18-hour single origin cold brew steeped with roasted cacao nibs, floated with whipped sweet coconut cream cloud.',
    tags: ['Plant Based', 'Smooth Energy', 'Tropical Notes'],
    layers: [
      { id: 'l1', name: 'Vanilla Coconut Syrup', volumeMl: 20, unitCostPerMl: 0.26, colorHex: '#fef3c7', densityBrix: 55 },
      { id: 'l2', name: '18-Hr Steeped Cold Brew Concentrate', volumeMl: 150, unitCostPerMl: 0.16, colorHex: '#1e1107', densityBrix: 8 },
      { id: 'l3', name: 'Whipped Coconut Cold Foam', volumeMl: 50, unitCostPerMl: 0.32, colorHex: '#ffffff', densityBrix: 25 }
    ],
    sensory: { sweetness: 55, acidity: 30, bitterness: 45, body: 75, aroma: 90, brix: 13.5 },
    sopSteps: [
      'Stir vanilla coconut syrup with cold brew in glass.',
      'Add crystal ice cubes.',
      'Whip chilled coconut cream and pour softly over ice.'
    ]
  },

  // 5. Craft Mocktails & Refreshers
  {
    id: 'repo-sparkling-espresso-tonic',
    name: 'Sparkling Espresso Citrus Tonic',
    category: 'mocktails',
    categoryName: 'Craft Mocktails',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Highball Glass',
    menuPrice: 185.00,
    targetMarginPct: 83,
    prepTime: '2 mins',
    difficulty: 'Medium',
    photoKey: 'takeaway-iced-cup',
    photoUrl: '/beverages/takeaway-iced-cup.jpg',
    description: 'Brisk artisanal tonic, fresh lemon peel oils, and a freshly pulled Ethiopian espresso shot floated over sparkling bubbles.',
    tags: ['Afternoon Pick-Me-Up', 'Effervescent', 'Crisp'],
    layers: [
      { id: 'l1', name: 'Craft Lemon Agave Syrup', volumeMl: 20, unitCostPerMl: 0.28, colorHex: '#fef9c3', densityBrix: 50 },
      { id: 'l2', name: 'Premium Botanical Indian Tonic', volumeMl: 180, unitCostPerMl: 0.14, colorHex: '#f8fafc', densityBrix: 8 },
      { id: 'l3', name: 'Ethiopia Espresso Double Float', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#3b1d0b', densityBrix: 9.5 }
    ],
    sensory: { sweetness: 45, acidity: 65, bitterness: 55, body: 40, aroma: 90, brix: 10.8 },
    sopSteps: [
      'Pour lemon agave syrup into glass, add ice to brim.',
      'Pour chilled tonic water to 85% full.',
      'Float espresso double shot gently over tonic using back of a spoon to create two-tone effect.',
      'Express lemon peel over rim and drop inside.'
    ]
  },

  // 6. Frappes & Blended Signatures
  {
    id: 'repo-lotus-biscoff-frappe',
    name: 'Lotus Biscoff Caramel Frappe',
    category: 'frappe',
    categoryName: 'Frappes & Blended',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Takeaway Cold Cup',
    menuPrice: 225.00,
    targetMarginPct: 77,
    prepTime: '3 mins',
    difficulty: 'Hard',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Blended espresso with caramelized Lotus Biscoff cookie butter spread, whole milk, whipped cream peaks, and crushed biscuit crumble.',
    tags: ['Decadent Treat', 'Customer Obsession', 'High Ticket'],
    layers: [
      { id: 'l1', name: 'Lotus Biscoff Spread Base', volumeMl: 35, unitCostPerMl: 0.45, colorHex: '#b45309', densityBrix: 60 },
      { id: 'l2', name: 'Espresso Double Shot (Blended)', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l3', name: 'Frappe Base Milk & Ice Blend', volumeMl: 180, unitCostPerMl: 0.15, colorHex: '#fde68a', densityBrix: 22 },
      { id: 'l4', name: 'Whipped Cream & Biscuit Crumble', volumeMl: 40, unitCostPerMl: 0.38, colorHex: '#ffffff', densityBrix: 28 }
    ],
    sensory: { sweetness: 85, acidity: 15, bitterness: 35, body: 95, aroma: 90, brix: 24.0 },
    sopSteps: [
      'Add espresso, Biscoff spread, milk, frappe powder, and 160g ice to commercial blender.',
      'Blend on high speed for 25s until ultra-creamy consistency.',
      'Coat interior walls of cup with Biscoff drizzle.',
      'Pour blended frappe into cup, pipe whipped cream swirl, and sprinkle with crushed Lotus biscuit.'
    ]
  }
]
