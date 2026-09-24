// Community Trending Recipes & Barista Reviews Data for PourCraft OS

export const INITIAL_TRENDING_RECIPES = [
  {
    id: 'trend-brown-sugar-oat-shaken',
    title: 'Seattle Brown Sugar Shaken Oat Espresso',
    authorName: 'Chef Marco D.',
    authorCafe: 'Kape Craft Studio (BGC, Taguig)',
    authorAvatar: '👨‍🍳',
    avatarBg: '#0f172a',
    category: 'Coffee',
    venue: 'coffee',
    featuredBadge: '🔥 Top Trending #1',
    description: 'Double blonde espresso aerated with spiced Muscovado and crowned with silky chilled barista oat milk.',
    retailPrice: 185.00,
    cogsCost: 44.20,
    grossMarginPct: 76,
    targetVessel: '16oz Cold Cup (473ml)',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    rating: 4.9,
    ratingsCount: 58,
    layers: [
      { id: 'l1', name: 'House Muscovado Syrup', volumeMl: 25, unitCostPerMl: 0.342, colorHex: '#3b1d0b', densityBrix: 68 },
      { id: 'l2', name: 'Blonde Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.725, colorHex: '#422415', densityBrix: 9.5 },
      { id: 'l3', name: 'Oatly Barista Oat Milk', volumeMl: 180, unitCostPerMl: 0.185, colorHex: '#f4ede2', densityBrix: 12.0, isTopOff: true }
    ],
    sopSteps: [
      'Pump 25ml House Muscovado Syrup into stainless shaker.',
      'Pull 36ml double espresso shot directly over syrup.',
      'Add 1 scoop ice (140g) and shake vigorously for 10-12 seconds until dense crema forms.',
      'Strain over fresh regular ice in 16oz PET cup.',
      'Top off smoothly with chilled Oatly Barista (~246ml). Dust lightly with Ceylon cinnamon.'
    ],
    proTips: 'Coat cup walls with syrup swirl before pouring for signature marble drizzle. Shake with large dense cubes for 10-12s to aerate velvety microfoam without over-diluting.',
    comments: [
      {
        id: 'c1',
        userName: 'Patricia Santos',
        userRole: 'Head Barista',
        cafeLocation: 'Daily Grind Cafe, Makati',
        rating: 5,
        timestamp: '2 hours ago',
        commentText: 'Swapped Oatly with Oatside Barista from Gourmet Direct—shaved ₱4.20 off our COGS and customers actually prefer the creaminess! Outstanding SOP.',
        helpfulCount: 24
      },
      {
        id: 'c2',
        userName: 'Kenji Ramos',
        userRole: 'Shop Owner',
        cafeLocation: 'Kohi Hub, Cebu City',
        rating: 5,
        timestamp: '1 day ago',
        commentText: 'Our best-selling cold drink this summer. 76% margin makes it our most profitable signature espresso item by far.',
        helpfulCount: 17
      },
      {
        id: 'c3',
        userName: 'Bea Alcantara',
        userRole: 'Beverage Consultant',
        cafeLocation: 'Quezon City',
        rating: 4,
        timestamp: '3 days ago',
        commentText: 'Make sure baristas use a heavy stainless shaker. If you shake for under 8 seconds, you miss out on that beautiful thick crema layer on top.',
        helpfulCount: 9
      }
    ]
  },
  {
    id: 'trend-sea-salt-matcha-cloud',
    title: 'Sea Salt Uji Matcha Cloud Latte',
    authorName: 'Aiko Tanaka',
    authorCafe: 'Zen Matcha Lab (Poblacion, Makati)',
    authorAvatar: '🍵',
    avatarBg: '#065f46',
    category: 'Tea & Matcha',
    venue: 'coffee',
    featuredBadge: '⭐ 4.95 Rating',
    description: 'First-harvest Kyoto Uji ceremonial matcha floating over sweet oat milk and crowned with dense sea salt cold cream.',
    retailPrice: 220.00,
    cogsCost: 48.60,
    grossMarginPct: 78,
    targetVessel: '16oz Cold Cup (473ml)',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    rating: 4.95,
    ratingsCount: 43,
    layers: [
      { id: 'l1', name: 'Organic Strawberry Puree Swirl', volumeMl: 30, unitCostPerMl: 0.18, colorHex: '#e11d48', densityBrix: 45 },
      { id: 'l2', name: 'Barista Oat Milk', volumeMl: 140, unitCostPerMl: 0.185, colorHex: '#fef3c7', densityBrix: 12 },
      { id: 'l3', name: 'Whisked Kyoto Ceremonial Matcha', volumeMl: 60, unitCostPerMl: 0.28, colorHex: '#15803d', densityBrix: 5 },
      { id: 'l4', name: 'Sea Salt Cheese Foam Crown', volumeMl: 40, unitCostPerMl: 0.24, colorHex: '#ffffff', densityBrix: 25, isTopOff: true }
    ],
    sopSteps: [
      'Whisk 4g Uji ceremonial matcha with 50ml 75°C water using bamboo chasen until microfroth forms.',
      'Drizzle 30ml strawberry puree along the interior cup walls.',
      'Fill glass with 140g ice and pour 140ml chilled barista oat milk.',
      'Slowly float whisked matcha on top using inverted bar spoon.',
      'Crown with 40ml sea salt cheese foam.'
    ],
    proTips: 'Water temperature must be between 70°C-75°C. Boiling water scorches the delicate amino acids in ceremonial tencha and creates bitter astringency.',
    comments: [
      {
        id: 'c4',
        userName: 'Gelo Fernandez',
        userRole: 'Cafe Manager',
        cafeLocation: 'Brew & Leaf, Pasig',
        rating: 5,
        timestamp: '5 hours ago',
        commentText: 'The 3-layer visual gradient is an absolute Instagram magnet. Sales went up 30% after introducing this.',
        helpfulCount: 31
      },
      {
        id: 'c5',
        userName: 'Chloe Lim',
        userRole: 'Owner',
        cafeLocation: 'Matcha Manila, BGC',
        rating: 5,
        timestamp: '2 days ago',
        commentText: 'The sea salt balance cuts through the richness of the oat milk perfectly. 10/10 recipe.',
        helpfulCount: 12
      }
    ]
  },
  {
    id: 'trend-spanish-pistachio-latte',
    title: 'Iced Spanish Latte with Roasted Pistachio Cream',
    authorName: 'Chef Carlo M.',
    authorCafe: 'Casa Espresso (San Juan, Metro Manila)',
    authorAvatar: '☕',
    avatarBg: '#78350f',
    category: 'Coffee',
    venue: 'coffee',
    featuredBadge: '💸 81% Margin Winner',
    description: 'Sweetened condensed milk base, double dark roast espresso, fresh milk, and roasted Sicilian pistachio cold foam.',
    retailPrice: 210.00,
    cogsCost: 39.80,
    grossMarginPct: 81,
    targetVessel: '16oz Cold Cup (473ml)',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    rating: 4.88,
    ratingsCount: 39,
    layers: [
      { id: 'l1', name: 'Sweetened Condensed Milk', volumeMl: 25, unitCostPerMl: 0.14, colorHex: '#fef08a', densityBrix: 70 },
      { id: 'l2', name: 'Fresh Whole Dairy Milk', volumeMl: 140, unitCostPerMl: 0.105, colorHex: '#fdfbf7', densityBrix: 12 },
      { id: 'l3', name: 'Double Shot Espresso', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#3b1d0b', densityBrix: 9 },
      { id: 'l4', name: 'Roasted Pistachio Cold Foam', volumeMl: 40, unitCostPerMl: 0.22, colorHex: '#d9f99d', densityBrix: 28, isTopOff: true }
    ],
    sopSteps: [
      'Pour 25ml condensed milk into bottom of glass.',
      'Fill glass 70% with regular ice.',
      'Add 140ml fresh whole milk and stir condensed milk lightly to integrate.',
      'Pull double espresso shot and float slowly over milk.',
      'Crown with 40ml aerated pistachio cold foam and sprinkle crushed pistachio.'
    ],
    proTips: 'For the pistachio cold foam, blend 80ml heavy whipping cream with 20ml whole milk and 15g pistachio paste for 20 seconds on low speed.',
    comments: [
      {
        id: 'c6',
        userName: 'Miguel Torres',
        userRole: 'Owner',
        cafeLocation: 'Artisan Kape, Antipolo',
        rating: 5,
        timestamp: '1 day ago',
        commentText: 'Our customers went crazy over the pistachio foam. Huge profit margin at ₱39.80 COGS!',
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'trend-tiger-brown-sugar-boba',
    title: 'Tiger Flame Brown Sugar Fresh Milk Boba',
    authorName: 'Chef Lin Wei',
    authorCafe: 'Formosa Boba Bar (Binondo, Manila)',
    authorAvatar: '🧋',
    avatarBg: '#92400e',
    category: 'Milk Tea & Boba',
    venue: 'boba',
    featuredBadge: '🔥 Classic Hit',
    description: 'Slow-simmered Okinawa Muscovado warm tapioca pearls, farm-fresh milk, and torched brown sugar cheese brulee.',
    retailPrice: 190.00,
    cogsCost: 38.50,
    grossMarginPct: 80,
    targetVessel: '20oz Boba Cup (591ml)',
    vesselId: 'boba-20oz',
    iceTypeId: 'light',
    rating: 4.92,
    ratingsCount: 65,
    layers: [
      { id: 'l1', name: 'Warm Tiger Brown Sugar Tapioca', volumeMl: 60, unitCostPerMl: 0.12, colorHex: '#170c06', densityBrix: 72 },
      { id: 'l2', name: 'Muscovado Wall Coating', volumeMl: 20, unitCostPerMl: 0.35, colorHex: '#451a03', densityBrix: 68 },
      { id: 'l3', name: 'Cold Fresh Farm Milk', volumeMl: 260, unitCostPerMl: 0.105, colorHex: '#ffffff', densityBrix: 11, isTopOff: true }
    ],
    sopSteps: [
      'Scoop 60g warm slow-simmered brown sugar tapioca into cup bottom.',
      'Tilt and rotate cup 360 degrees to coat sides with sticky caramel tiger stripes.',
      'Fill with light ice (25% displacement).',
      'Pour 260ml cold fresh milk slowly down the center to preserve tiger flame marbling.'
    ],
    proTips: 'Keep boba pearls in syrup at 55°C-60°C in a thermal warmer. Cold boba loses elasticity and turns hard.',
    comments: [
      {
        id: 'c7',
        userName: 'Jasmine Co',
        userRole: 'Owner',
        cafeLocation: 'Boba Hub, Cebu',
        rating: 5,
        timestamp: '4 days ago',
        commentText: 'The 60°C warmer tip saved our operations during rush hours. Super reliable!',
        helpfulCount: 22
      }
    ]
  }
]
