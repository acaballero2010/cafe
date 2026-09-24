// Master Commercial Beverage Recipe Repository & Database (Philippine Peso ₱ Costing)

export const MASTER_RECIPE_REPOSITORY = [
  // 1. Specialty Espresso & Signatures
  {
    id: 'repo-spanish-latte',
    name: 'Iced Spanish Sweet Cream Latte',
    inspiredBy: '% Arabica Spanish Latte',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Ribbed Highball',
    menuPrice: 185.00,
    targetMarginPct: 80,
    prepTime: '2 mins',
    difficulty: 'Easy',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Iconic sweetened condensed milk layered with chilled whole milk, topped with a freshly extracted specialty espresso double shot float.',
    tags: ['Best Seller', 'Inspired by % Arabica', 'High Margin', 'Silky Sweet'],
    layers: [
      { id: 'l1', name: 'Sweetened Condensed Milk', volumeMl: 25, unitCostPerMl: 0.18, colorHex: '#fef08a', densityBrix: 72 },
      { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 160, unitCostPerMl: 0.10, colorHex: '#fffdfa', densityBrix: 12 },
      { id: 'l3', name: 'Specialty Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 }
    ],
    sensory: { sweetness: 72, acidity: 20, bitterness: 40, body: 85, aroma: 85, brix: 18.5 },
    sopSteps: [
      'Dispense 25ml condensed milk into bottom of glass.',
      'Add 140g crystal ice cubes.',
      'Pour 160ml cold whole milk gently over the condensed layer.',
      'Pull double espresso directly over ice via inverted bar spoon for sharp bi-layer contrast.'
    ]
  },
  {
    id: 'repo-brown-sugar-shaken',
    name: 'Brown Sugar Shaken Oat Espresso',
    inspiredBy: 'Starbucks Iced Shaken Espresso',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Highball Glass',
    menuPrice: 195.00,
    targetMarginPct: 76,
    prepTime: '2 mins',
    difficulty: 'Medium',
    photoKey: 'brown-sugar-shaken',
    photoUrl: '/beverages/brown-sugar-shaken.jpg',
    description: 'Freshly pulled blonde espresso shaken vigorously with artisanal muscovado brown sugar and cinnamon, topped with silky barista oat milk.',
    tags: ['Specialty Trending', 'Inspired by Starbucks', 'Plant Based', 'Aromatic'],
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
    id: 'repo-caramel-macchiato',
    name: 'Iced Caramel Macchiato',
    inspiredBy: 'Classic European Roastery',
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
      'Pump 25ml Vanilla Syrup into base of a 16oz glass.',
      'Drizzle thick caramel sauce along the inside walls of the glass.',
      'Add 160ml chilled whole milk and fill glass with crystalline ice to 80%.',
      'Slowly pour 36ml blonde double espresso over ice to create clean separation.',
      'Top with cold foam and crosshatch caramel drizzle.'
    ]
  },
  {
    id: 'repo-sea-salt-latte',
    name: 'Sea Salt Cold Foam Iced Latte',
    inspiredBy: 'Taiwanese Sea Salt Coffee',
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
  {
    id: 'repo-hot-spanish-latte',
    name: 'Artisanal Hot Spanish Latte',
    inspiredBy: '% Arabica Signature',
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
    id: 'repo-pistachio-latte',
    name: 'Sicilian Pistachio Cloud Latte',
    inspiredBy: 'Dubai Kunafa Coffee Trend',
    category: 'espresso',
    categoryName: 'Specialty Espresso',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Glass Tumbler',
    menuPrice: 230.00,
    targetMarginPct: 75,
    prepTime: '2.5 mins',
    difficulty: 'Medium',
    photoKey: 'caramel-macchiato',
    photoUrl: '/beverages/caramel-macchiato.jpg',
    description: 'Artisanal roasted Sicilian pistachio paste milk base, rich espresso float, and whipped pistachio cold foam.',
    tags: ['Viral Dubai Trend', 'Nutty Luxury', 'High Ticket'],
    layers: [
      { id: 'l1', name: 'Pure Sicilian Pistachio Paste', volumeMl: 25, unitCostPerMl: 0.55, colorHex: '#84cc16', densityBrix: 50 },
      { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 150, unitCostPerMl: 0.10, colorHex: '#fefce8', densityBrix: 12 },
      { id: 'l3', name: 'Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l4', name: 'Whipped Pistachio Cream', volumeMl: 35, unitCostPerMl: 0.45, colorHex: '#bef264', densityBrix: 30 }
    ],
    sensory: { sweetness: 68, acidity: 18, bitterness: 42, body: 90, aroma: 95, brix: 21.0 },
    sopSteps: [
      'Whisk pistachio paste with 30ml warm milk until smooth emulsion.',
      'Add ice and remaining 120ml cold milk.',
      'Float espresso double shot on top.',
      'Crown with whipped pistachio foam and crushed pistachio bits.'
    ]
  },

  // 2. Matcha, Hojicha & Tea Clouds
  {
    id: 'repo-strawberry-matcha',
    name: 'Strawberry Uji Matcha Cloud',
    inspiredBy: 'HeyTea Cheese Strawberry Matcha',
    category: 'matcha',
    categoryName: 'Matcha & Tea Clouds',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Cylindrical Glass',
    menuPrice: 215.00,
    targetMarginPct: 81,
    prepTime: '2.5 mins',
    difficulty: 'Medium',
    photoKey: 'matcha-strawberry',
    photoUrl: '/beverages/matcha-strawberry.jpg',
    description: 'Vibrant tri-layer aesthetic: crushed strawberry compote, silk milk, floated with whisked ceremonial Kyoto Uji matcha.',
    tags: ['Viral Social', 'Inspired by HeyTea', 'Visual Aesthetic', 'High Margin'],
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
      'Whisk 3g ceremonial matcha with 60ml 75°C water with chasen until frothy.',
      'Layer whisked matcha carefully on top of milk using a bar spoon.'
    ]
  },
  {
    id: 'repo-dirty-matcha',
    name: 'Dirty Uji Matcha Double Shot',
    inspiredBy: 'Tokyo Specialty Cafe',
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
  {
    id: 'repo-hojicha-caramel-latte',
    name: 'Roasted Hojicha Salted Cloud',
    inspiredBy: 'Kyoto Tea House',
    category: 'matcha',
    categoryName: 'Matcha & Tea Clouds',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Tall Tumbler',
    menuPrice: 200.00,
    targetMarginPct: 80,
    prepTime: '2 mins',
    difficulty: 'Easy',
    photoKey: 'matcha-strawberry',
    photoUrl: '/beverages/matcha-strawberry.jpg',
    description: 'Smoky deeply roasted Japanese Hojicha tea, creamy oat milk, and a delicate salted cream float.',
    tags: ['Low Caffeine', 'Smoky & Nutty', 'Smooth'],
    layers: [
      { id: 'l1', name: 'Smoked Cane Syrup', volumeMl: 20, unitCostPerMl: 0.20, colorHex: '#78350f', densityBrix: 60 },
      { id: 'l2', name: 'Whisked Roasted Hojicha Base', volumeMl: 80, unitCostPerMl: 0.35, colorHex: '#582f0e', densityBrix: 8 },
      { id: 'l3', name: 'Oat Milk Body', volumeMl: 140, unitCostPerMl: 0.21, colorHex: '#fef3c7', densityBrix: 12 },
      { id: 'l4', name: 'Salted Vanilla Cloud Foam', volumeMl: 35, unitCostPerMl: 0.30, colorHex: '#ffffff', densityBrix: 25 }
    ],
    sensory: { sweetness: 55, acidity: 15, bitterness: 35, body: 82, aroma: 96, brix: 15.0 },
    sopSteps: [
      'Whisk 4g hojicha with 80ml hot water.',
      'Pour cane syrup and whisked hojicha into glass with ice.',
      'Add oat milk and crown with salted vanilla cold foam.'
    ]
  },

  // 3. Artisan Boba & Local Specialties
  {
    id: 'repo-tiger-boba',
    name: 'Tiger Brown Sugar Boba Fresh Milk',
    inspiredBy: 'Tiger Sugar Taiwan',
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
    tags: ['All-Time Favorite', 'Inspired by Tiger Sugar', 'High Volume', 'Dessert Drink'],
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
  {
    id: 'repo-ube-halaya-latte',
    name: 'Ube Halaya Coconut Cloud Latte',
    inspiredBy: 'Philippine Specialty Modern Cafe',
    category: 'boba',
    categoryName: 'Artisan Boba & Tea',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Glass Tumbler',
    menuPrice: 210.00,
    targetMarginPct: 80,
    prepTime: '2 mins',
    difficulty: 'Medium',
    photoKey: 'matcha-strawberry',
    photoUrl: '/beverages/matcha-strawberry.jpg',
    description: 'Authentic Pampanga Ube Halaya compote puree base, creamy coconut milk, floated with espresso or sweet milk cloud.',
    tags: ['Philippine Heritage', 'Vibrant Purple', 'Top Local Seller'],
    layers: [
      { id: 'l1', name: 'Real Ube Halaya Compote Base', volumeMl: 40, unitCostPerMl: 0.35, colorHex: '#581c87', densityBrix: 55 },
      { id: 'l2', name: 'Rich Coconut Milk / Dairy Blend', volumeMl: 150, unitCostPerMl: 0.16, colorHex: '#faf5ff', densityBrix: 14 },
      { id: 'l3', name: 'Espresso Double Shot Float', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#3b0764', densityBrix: 9.5 }
    ],
    sensory: { sweetness: 75, acidity: 15, bitterness: 30, body: 92, aroma: 94, brix: 20.0 },
    sopSteps: [
      'Spread 40ml ube halaya at the bottom and swirl cup.',
      'Add ice cubes and pour coconut milk blend.',
      'Float espresso shot on top for striking purple-white-brown layers.'
    ]
  },

  // 4. Cold Brews & Refreshers
  {
    id: 'repo-nola-coldbrew',
    name: 'New Orleans Chicory Iced Cold Brew',
    inspiredBy: 'Blue Bottle NOLA Style',
    category: 'coldbrew',
    categoryName: 'Cold Brew & Cascara',
    temp: 'iced',
    vesselId: 'cold-16oz',
    vesselName: '16oz Highball Glass',
    menuPrice: 190.00,
    targetMarginPct: 82,
    prepTime: '1.5 mins',
    difficulty: 'Easy',
    photoKey: 'brown-sugar-shaken',
    photoUrl: '/beverages/brown-sugar-shaken.jpg',
    description: '18-hour cold brew infused with roasted French chicory root and pure organic cane sugar, topped with rich whole milk.',
    tags: ['Inspired by Blue Bottle', 'Cult Favorite', 'High Caffeine'],
    layers: [
      { id: 'l1', name: 'Organic Cane Sugar Syrup', volumeMl: 20, unitCostPerMl: 0.12, colorHex: '#fef3c7', densityBrix: 65 },
      { id: 'l2', name: 'Roasted Chicory Cold Brew Concentrate', volumeMl: 140, unitCostPerMl: 0.18, colorHex: '#1e1107', densityBrix: 10 },
      { id: 'l3', name: 'Creamy Whole Milk Float', volumeMl: 100, unitCostPerMl: 0.10, colorHex: '#ffffff', densityBrix: 12 }
    ],
    sensory: { sweetness: 60, acidity: 20, bitterness: 50, body: 80, aroma: 92, brix: 16.0 },
    sopSteps: [
      'Combine chicory cold brew and cane syrup over dense ice.',
      'Top with cold whole milk and swirl gently to serve.'
    ]
  },
  {
    id: 'repo-sparkling-espresso-tonic',
    name: 'Sparkling Rosemary Espresso Tonic',
    inspiredBy: 'Nordic Specialty Barista',
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
      'Float espresso double shot gently over tonic using back of a spoon.',
      'Express lemon peel and rosemary sprig over rim.'
    ]
  },
  {
    id: 'repo-lotus-biscoff-frappe',
    name: 'Lotus Biscoff Caramel Frappe',
    inspiredBy: 'Artisanal Dessert Cafe',
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
      'Pour blended frappe into cup, pipe whipped cream swirl, and sprinkle crushed Lotus biscuit.'
    ]
  }
]
