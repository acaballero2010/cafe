// Molecular & Sensory Flavor Pairing Matrix for Beverage R&D Lab

export const FLAVOR_PROFILES_DATABASE = [
  {
    id: 'flavor-espresso',
    name: 'Specialty Espresso & Cold Brew',
    category: 'Coffee',
    icon: '☕',
    primaryCompounds: ['2-Furfurylthiol (Roasty)', 'Pyrazines (Nutty/Earthy)', 'Chlorogenic Acids (Acidity)'],
    recommendedPairings: [
      { ingredient: 'Salted Caramel & Toffee', score: 98, synergyType: 'Harmonic Lipid Sweetness', notes: 'Enhances espresso roasty notes and softens perceived bitterness.' },
      { ingredient: 'Oat Milk & Brown Sugar', score: 96, synergyType: 'Malted Grain Synergy', notes: 'Emulsifies into velvety body with cereal undertones.' },
      { ingredient: 'Tonic Water & Fresh Rosemary', score: 94, synergyType: 'Botanical Contrast', notes: 'Quinine effervescence elevates bright citric notes in light roasts.' },
      { ingredient: 'Pistachio Cream', score: 92, synergyType: 'Nutty Complement', notes: 'Rich nut oils round out bright espresso acidity.' },
      { ingredient: 'Yuzu & Sparkling Soda', score: 88, synergyType: 'Citric Lift', notes: 'Cuts through dark roast body with refreshing high citrus notes.' }
    ],
    avoidPairings: ['High-tannin green tea (creates muddy astrigency)', 'Unsweetened tart cranberries']
  },
  {
    id: 'flavor-matcha',
    name: 'Kyoto Ceremonial Uji Matcha',
    category: 'Tea',
    icon: '🍵',
    primaryCompounds: ['L-Theanine (Umami)', 'EGCG Catechins (Grassy/Astringent)', 'Dimethyl Sulfide (Marine Sweet)'],
    recommendedPairings: [
      { ingredient: 'Strawberry & Wild Berry Puree', score: 98, synergyType: 'Acidic-Sweet Counterpoint', notes: 'Natural fruit esters balance vegetal green tea tannins.' },
      { ingredient: 'Sea Salt Cheese Cold Foam', score: 96, synergyType: 'Umami-Lipid Amplification', notes: 'Saline dairy intensifies sweet vegetal L-theanine.' },
      { ingredient: 'White Chocolate / Condensed Milk', score: 95, synergyType: 'Fat & Sweetness Smoothing', notes: 'Cocoa butter rounds sharp catechin astringency.' },
      { ingredient: 'Oat Milk & Vanilla Bean', score: 93, synergyType: 'Creamy Earth Affinity', notes: 'Neutral oat sweetness allows green tea aroma to bloom.' },
      { ingredient: 'Yuzu & Honey Soda', score: 90, synergyType: 'Citrus Brightness', notes: 'Japanese citrus enhances green vibrancy without clouding.' }
    ],
    avoidPairings: ['Heavy spiced chai cinnamon (overpowers delicate green tea aroma)']
  },
  {
    id: 'flavor-taro-ube',
    name: 'Philippine Ube Halaya & Purple Taro',
    category: 'Botanical Root',
    icon: '🍠',
    primaryCompounds: ['Maltol (Cotton Candy/Sweet)', 'Earthy Ketones', 'Vanilla-like Esters'],
    recommendedPairings: [
      { ingredient: 'Coconut Milk & Gata Cream', score: 99, synergyType: 'Tropical Cream Marriage', notes: 'Lauric acid fats heighten creamy purple yam richness.' },
      { ingredient: 'Espresso Cold Foam', score: 95, synergyType: 'Bitter-Sweet Dynamic', notes: 'Roasted coffee bitterness balances dense ube halaya sweetness.' },
      { ingredient: 'Brown Sugar Tapioca Pearls', score: 94, synergyType: 'Caramel Texture Harmony', notes: 'Chewy warm pearls complement dense starch mouthfeel.' },
      { ingredient: 'Condensed Milk & Whole Milk', score: 92, synergyType: 'Dairy Sweet Synergy', notes: 'Smooths root starchiness into silky dessert milk.' }
    ],
    avoidPairings: ['Sharp high-acid citrus (causes undesirable dairy curdle and graying color)']
  },
  {
    id: 'flavor-pistachio',
    name: 'Artisanal Sicilian Pistachio',
    category: 'Nut & Confection',
    icon: '🥜',
    primaryCompounds: ['Benzaldehyde (Nutty/Almond)', 'Terpenes (Resinous)', 'Fatty Lipids'],
    recommendedPairings: [
      { ingredient: 'White Chocolate & Cardamom', score: 97, synergyType: 'Middle Eastern Heritage', notes: 'Warm spice elevates roasted green nut aromatics.' },
      { ingredient: 'Espresso Latte Float', score: 95, synergyType: 'Nutty Roast Complement', notes: 'Rich pistachio paste softens espresso acidity into dessert luxury.' },
      { ingredient: 'Matcha Cloud Cream', score: 94, synergyType: 'Green Hue & Umami Bridge', notes: 'Visual and savory green-toned synergy.' },
      { ingredient: 'Crispy Kunafa Shreds', score: 92, synergyType: 'Textural Crunch Contrast', notes: 'Viral dessert sensation mouthfeel.' }
    ],
    avoidPairings: ['Sour passionfruit (clashes with subtle nut paste oils)']
  },
  {
    id: 'flavor-passionfruit-yuzu',
    name: 'Passionfruit, Calamansi & Yuzu',
    category: 'Citrus & Tropical',
    icon: '🍋',
    primaryCompounds: ['Citric Acid', 'Limonene (Zesty)', 'Tropical Sulfur Esters'],
    recommendedPairings: [
      { ingredient: 'Jasmine Green Tea', score: 98, synergyType: 'Floral-Citrus Harmony', notes: 'Light floral tea tannins form clean backbone for juicy tartness.' },
      { ingredient: 'Sparkling Soda & Mint', score: 96, synergyType: 'Crisp Refreshment', notes: 'Carbonation releases volatile citrus terpenes onto palate.' },
      { ingredient: 'Wild Honey / Agave', score: 95, synergyType: 'Floral Sweetness Balance', notes: 'Smooths sharp citric bite without muting fruit brightness.' },
      { ingredient: 'Light Roast Cold Brew', score: 90, synergyType: 'Modern Sparkler', notes: 'Fruity Ethiopian coffee notes blend seamlessly with citrus.' }
    ],
    avoidPairings: ['Heavy dairy cream (causes immediate curdling unless separated by foam layer)']
  }
]
