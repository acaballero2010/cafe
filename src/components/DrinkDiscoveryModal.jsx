import React, { useState, useMemo } from 'react'
import { Search, X, Lightbulb, Zap, ArrowRight, Check, Coffee, Sparkles } from 'lucide-react'

// Comprehensive Beverage Knowledge Base
const RECIPE_DATABASE = {
  'strawberry frappe': {
    id: 'disco-strawberry-frappe',
    title: 'Strawberry Cream Frappe',
    categoryBadge: 'Frappe / Blended',
    category: 'Coffee',
    difficultySubtext: 'Easy • 2.5 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 46.80,
    matchedSuppliers: 4,
    ingredients: [
      { name: 'Strawberry Puree Sauce', spec: '45ml swirl', type: 'syrup' },
      { name: 'Fresh Whole Milk', spec: '140ml', type: 'dairy' },
      { name: 'Vanilla Frappe Powder Base', spec: '25g scoop', type: 'powder' },
      { name: 'Whipped Cream Crown', spec: '30g swirl', type: 'cream' }
    ],
    proTip: 'Coat the interior walls of the cup with 15ml strawberry puree before pouring the blended frappe to create a clean marble drizzle effect.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱46.80', totalCost: 46.80, description: '16oz Blended Base' },
      { id: 'oat', label: 'Swap Oat Milk', delta: '+₱6.50', totalCost: 53.30, description: 'Oatly Barista + Non-Dairy' },
      { id: '22oz', label: 'Upsize 22oz', delta: '+₱14.00', totalCost: 60.80, description: '60ml Puree + Double Cream' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Strawberry Puree Sauce', volumeMl: 45, unitCostPerMl: 0.18, colorHex: '#e11d48', densityBrix: 45 },
        { id: 'l2', name: 'Blended Vanilla Milk Base', volumeMl: 140, unitCostPerMl: 0.11, colorHex: '#fff1f2', densityBrix: 18 },
        { id: 'l3', name: 'Whipped Cream Crown', volumeMl: 30, unitCostPerMl: 0.22, colorHex: '#ffffff', densityBrix: 25, isTopOff: true }
      ],
      oat: [
        { id: 'l1', name: 'Strawberry Puree Sauce', volumeMl: 45, unitCostPerMl: 0.18, colorHex: '#e11d48', densityBrix: 45 },
        { id: 'l2', name: 'Blended Oat Vanilla Base', volumeMl: 140, unitCostPerMl: 0.185, colorHex: '#fef3c7', densityBrix: 18 },
        { id: 'l3', name: 'Whipped Cream Crown', volumeMl: 30, unitCostPerMl: 0.22, colorHex: '#ffffff', densityBrix: 25, isTopOff: true }
      ],
      '22oz': [
        { id: 'l1', name: 'Strawberry Puree Sauce', volumeMl: 60, unitCostPerMl: 0.18, colorHex: '#e11d48', densityBrix: 45 },
        { id: 'l2', name: 'Blended Vanilla Milk Base', volumeMl: 200, unitCostPerMl: 0.11, colorHex: '#fff1f2', densityBrix: 18 },
        { id: 'l3', name: 'Whipped Cream Crown', volumeMl: 45, unitCostPerMl: 0.22, colorHex: '#ffffff', densityBrix: 25, isTopOff: true }
      ]
    }
  },
  'iced caramel macchiato': {
    id: 'disco-caramel-macchiato',
    title: 'Iced Caramel Macchiato',
    categoryBadge: 'Coffee / Espresso',
    category: 'Coffee',
    difficultySubtext: 'Easy • 2 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 42.10,
    matchedSuppliers: 3,
    ingredients: [
      { name: 'Vanilla Syrup', spec: '20ml / 2 pumps', type: 'syrup' },
      { name: 'Fresh Whole Milk', spec: '160ml', type: 'dairy' },
      { name: 'Double Espresso Float', spec: '36ml', type: 'coffee' },
      { name: 'Caramel Drizzle Crosshatch', spec: '10ml', type: 'syrup' }
    ],
    proTip: 'Pour espresso slowly over ice before adding caramel drizzle to prevent the drizzle from sinking directly to the bottom.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱42.10', totalCost: 42.10, description: '16oz Cold Base' },
      { id: 'oat', label: 'Swap Oat Milk', delta: '+₱8.50', totalCost: 50.60, description: 'Oatly Barista 160ml' },
      { id: '22oz', label: 'Upsize 22oz', delta: '+₱12.00', totalCost: 54.10, description: '220ml Milk + 3 shots' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Vanilla Syrup', volumeMl: 20, unitCostPerMl: 0.08, colorHex: '#fef08a', densityBrix: 55 },
        { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 160, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12 },
        { id: 'l3', name: 'Double Espresso Float', volumeMl: 36, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10 },
        { id: 'l4', name: 'Caramel Drizzle Crosshatch', volumeMl: 10, unitCostPerMl: 0.16, colorHex: '#d97706', densityBrix: 75, isTopOff: true }
      ],
      oat: [
        { id: 'l1', name: 'Vanilla Syrup', volumeMl: 20, unitCostPerMl: 0.08, colorHex: '#fef08a', densityBrix: 55 },
        { id: 'l2', name: 'Oat Milk Barista Edition', volumeMl: 160, unitCostPerMl: 0.185, colorHex: '#fef3c7', densityBrix: 12 },
        { id: 'l3', name: 'Double Espresso Float', volumeMl: 36, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10 },
        { id: 'l4', name: 'Caramel Drizzle Crosshatch', volumeMl: 10, unitCostPerMl: 0.16, colorHex: '#d97706', densityBrix: 75, isTopOff: true }
      ],
      '22oz': [
        { id: 'l1', name: 'Vanilla Syrup', volumeMl: 30, unitCostPerMl: 0.08, colorHex: '#fef08a', densityBrix: 55 },
        { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 220, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12 },
        { id: 'l3', name: 'Triple Espresso Float', volumeMl: 54, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10 },
        { id: 'l4', name: 'Caramel Drizzle Crosshatch', volumeMl: 15, unitCostPerMl: 0.16, colorHex: '#d97706', densityBrix: 75, isTopOff: true }
      ]
    }
  },
  'iced spanish latte': {
    id: 'disco-spanish-latte',
    title: 'Iced Spanish Latte',
    categoryBadge: 'Coffee / Espresso',
    category: 'Coffee',
    difficultySubtext: 'Easy • 2 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 38.50,
    matchedSuppliers: 3,
    ingredients: [
      { name: 'Sweetened Condensed Milk', spec: '25ml / 2 pumps', type: 'syrup' },
      { name: 'Fresh Whole Milk', spec: '180ml', type: 'dairy' },
      { name: 'Double Espresso', spec: '36ml', type: 'coffee' }
    ],
    proTip: 'Dissolve condensed milk in warm espresso or cold milk thoroughly before adding ice to prevent syrup sludge settling at the bottom.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱38.50', totalCost: 38.50, description: '16oz Cold Base' },
      { id: 'oat', label: 'Swap Oat Milk', delta: '+₱7.40', totalCost: 45.90, description: 'Oat Milk Barista' },
      { id: '22oz', label: 'Upsize 22oz', delta: '+₱11.00', totalCost: 49.50, description: '240ml Milk + 3 shots' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Sweetened Condensed Milk', volumeMl: 25, unitCostPerMl: 0.14, colorHex: '#fef08a', densityBrix: 70 },
        { id: 'l2', name: 'Fresh Whole Milk', volumeMl: 180, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12 },
        { id: 'l3', name: 'Double Espresso Float', volumeMl: 36, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10 }
      ]
    }
  },
  'uji matcha cloud': {
    id: 'disco-matcha-cloud',
    title: 'Uji Matcha Cloud Float',
    categoryBadge: 'Tea / Boba',
    category: 'Boba & Tea',
    difficultySubtext: 'Medium • 3 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 52.00,
    matchedSuppliers: 4,
    ingredients: [
      { name: 'House Cane Syrup', spec: '20ml', type: 'syrup' },
      { name: 'Oat Milk Barista', spec: '160ml', type: 'dairy' },
      { name: 'Ceremonial Uji Matcha', spec: '50ml whisked', type: 'tea' },
      { name: 'Salted Sweet Cream Foam', spec: '45ml crown', type: 'foam' }
    ],
    proTip: 'Whisk ceremonial matcha at 75°C max to preserve sweet umami theanine without extracting grassy bitterness.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱52.00', totalCost: 52.00, description: '16oz Cold Base' },
      { id: 'oat', label: 'Coconut Milk Base', delta: '+₱6.00', totalCost: 58.00, description: 'Rich tropical body' },
      { id: '22oz', label: 'Add Brown Sugar Boba', delta: '+₱12.50', totalCost: 64.50, description: '60g warm boba' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'House Cane Syrup', volumeMl: 20, unitCostPerMl: 0.05, colorHex: '#fbbf24', densityBrix: 55 },
        { id: 'l2', name: 'Oat Milk Barista', volumeMl: 160, unitCostPerMl: 0.185, colorHex: '#fef3c7', densityBrix: 12 },
        { id: 'l3', name: 'Ceremonial Uji Matcha', volumeMl: 50, unitCostPerMl: 0.45, colorHex: '#15803d', densityBrix: 5 },
        { id: 'l4', name: 'Salted Sweet Cream Foam', volumeMl: 45, unitCostPerMl: 0.16, colorHex: '#ffffff', densityBrix: 22, isTopOff: true }
      ]
    }
  },
  'smoked mezcal sour': {
    id: 'disco-mezcal-sour',
    title: 'Smoked Rosemary Mezcal Sour',
    categoryBadge: 'Cocktail / Bar',
    category: 'Cocktail',
    difficultySubtext: 'Advanced • 4 min prep • 7oz Coupe Glass',
    standardSize: '7oz Nick & Nora / Coupe',
    baseCogs: 68.40,
    matchedSuppliers: 3,
    ingredients: [
      { name: 'Espadín Mezcal Base', spec: '45ml', type: 'liquor' },
      { name: 'Fresh Lime & Agave Nectar', spec: '30ml', type: 'citrus' },
      { name: 'Aquafaba / Egg White Foam', spec: '20ml', type: 'foam' },
      { name: 'Torched Rosemary Sprig', spec: '1 pc garnish', type: 'garnish' }
    ],
    proTip: 'Perform a dry shake without ice for 15 seconds first to build stable micro-foam before hard shaking with large ice cubes.',
    variants: [
      { id: 'standard', label: 'Standard 7oz', delta: '₱68.40', totalCost: 68.40, description: 'Single Coupe' },
      { id: 'oat', label: 'Tequila Reposado Swap', delta: '-₱8.00', totalCost: 60.40, description: 'Milder Agave' },
      { id: '22oz', label: 'Smoked Cedar Cloche', delta: '+₱15.00', totalCost: 83.40, description: 'Table-side smoke' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Espadín Mezcal & Agave', volumeMl: 45, unitCostPerMl: 0.75, colorHex: '#d97706', densityBrix: 20 },
        { id: 'l2', name: 'Fresh Citrus Sour Cordial', volumeMl: 30, unitCostPerMl: 0.25, colorHex: '#fef08a', densityBrix: 15 },
        { id: 'l3', name: 'Velvet Citrus Micro-Foam', volumeMl: 20, unitCostPerMl: 0.20, colorHex: '#ffffff', densityBrix: 5, isTopOff: true }
      ]
    }
  },
  'brown sugar boba': {
    id: 'disco-brown-sugar-boba',
    title: 'Tiger Brown Sugar Boba Milk',
    categoryBadge: 'Tea / Boba',
    category: 'Boba & Tea',
    difficultySubtext: 'Easy • 2 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 44.50,
    matchedSuppliers: 4,
    ingredients: [
      { name: 'Warm Brown Sugar Tapioca', spec: '60g boba', type: 'boba' },
      { name: 'Muscovado Flame Tiger Stripes', spec: '20ml swirl', type: 'syrup' },
      { name: 'Fresh Whole Milk (4°C)', spec: '180ml', type: 'dairy' },
      { name: 'Torched Cheese Foam Crown', spec: '35ml', type: 'foam' }
    ],
    proTip: 'Swirl thick muscovado syrup against the cup sides while rotating at a 45-degree angle before pouring cold milk for high-contrast tiger stripes.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱44.50', totalCost: 44.50, description: '16oz Cold Base' },
      { id: 'oat', label: 'Swap Oat Milk', delta: '+₱7.50', totalCost: 52.00, description: 'Oatly Barista' },
      { id: '22oz', label: 'Upsize 22oz', delta: '+₱12.00', totalCost: 56.50, description: '240ml Milk + 80g Boba' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Warm Brown Sugar Boba', volumeMl: 60, unitCostPerMl: 0.12, colorHex: '#160802', densityBrix: 65 },
        { id: 'l2', name: 'Muscovado Syrup Stripes', volumeMl: 20, unitCostPerMl: 0.14, colorHex: '#78350f', densityBrix: 70 },
        { id: 'l3', name: 'Fresh Whole Milk', volumeMl: 180, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12 }
      ]
    }
  },
  'brown sugar shaken espresso': {
    id: 'disco-shaken-espresso',
    title: 'Iced Brown Sugar Shaken Espresso',
    categoryBadge: 'Coffee / Signature',
    category: 'Coffee',
    difficultySubtext: 'Easy • 2 min prep • 16oz Cold Cup',
    standardSize: '16oz Cold Cup',
    baseCogs: 60.69,
    matchedSuppliers: 4,
    ingredients: [
      { name: 'Spiced Brown Sugar Syrup', spec: '25ml / 2 pumps', type: 'syrup' },
      { name: 'Ground Saigon Cinnamon', spec: '0.5g dash', type: 'spice' },
      { name: 'Triple Blonde Espresso', spec: '45ml aerated', type: 'coffee' },
      { name: 'Oatly Barista Oat Milk Float', spec: '120ml crown', type: 'dairy' }
    ],
    proTip: 'Shake hot espresso vigorously over ice and syrup for 10-12s in a cocktail shaker to emulsify oils and whip a thick crema head before floating oat milk.',
    variants: [
      { id: 'standard', label: 'Standard 16oz', delta: '₱60.69', totalCost: 60.69, description: 'Oatly Barista 120ml' },
      { id: 'oat', label: 'House Muscovado Swap', delta: '-₱9.15', totalCost: 51.54, description: 'House 2:1 Syrup (73% GM)' },
      { id: '22oz', label: 'Upsize 22oz Quad Shot', delta: '+₱16.00', totalCost: 76.69, description: '4 shots + 160ml Oat' }
    ],
    layersData: {
      standard: [
        { id: 'l1', name: 'Spiced Brown Sugar Syrup', volumeMl: 25, unitCostPerMl: 0.48, colorHex: '#3b1d0b', densityBrix: 65 },
        { id: 'l2', name: 'Whipped Espresso Micro-Foam', volumeMl: 45, unitCostPerMl: 0.41, colorHex: '#522915', densityBrix: 10 },
        { id: 'l3', name: 'Oatly Barista Oat Milk Float', volumeMl: 120, unitCostPerMl: 0.20, colorHex: '#f4ede2', densityBrix: 12, isTopOff: true }
      ]
    }
  }
}

export function DrinkDiscoveryModal({
  isOpen = true,
  onClose = () => {},
  onLoadIntoStudio = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('Iced Caramel Macchiato')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('classics')
  const [selectedVariant, setSelectedVariant] = useState('standard') // 'standard' | 'oat' | '22oz'

  const quickTags = [
    { id: 'classics', label: '☕ Popular Classics', query: 'Iced Caramel Macchiato' },
    { id: 'shaken', label: '⚡ Shaken Espresso', query: 'Brown Sugar Shaken Espresso' },
    { id: 'frappes', label: '🍓 Frappes & Blended', query: 'Strawberry Frappe' },
    { id: 'boba', label: '🧋 Boba Trends', query: 'Uji Matcha Cloud' },
    { id: 'tiger', label: '🐯 Brown Sugar Boba', query: 'Brown Sugar Boba' },
    { id: 'cocktails', label: '🍸 Cocktails', query: 'Smoked Mezcal Sour' }
  ]

  // Dynamic Recipe Resolver (Must be called unconditionally on every render BEFORE any early return!)
  const activeDrink = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase()
    
    // Direct matches or substring matches
    if (q.includes('shaken') || (q.includes('brown') && q.includes('sugar') && q.includes('espresso')) || q.includes('starbucks') || q.includes('oat milk shaken')) {
      return RECIPE_DATABASE['brown sugar shaken espresso']
    }
    if (q.includes('straw') || q.includes('frap') || q.includes('blend')) {
      return RECIPE_DATABASE['strawberry frappe']
    }
    if (q.includes('caramel') || q.includes('macchiato')) {
      return RECIPE_DATABASE['iced caramel macchiato']
    }
    if (q.includes('spanish') || q.includes('condensed')) {
      return RECIPE_DATABASE['iced spanish latte']
    }
    if (q.includes('matcha') || q.includes('cloud') || q.includes('green tea')) {
      return RECIPE_DATABASE['uji matcha cloud']
    }
    if (q.includes('mezcal') || q.includes('sour') || q.includes('cocktail') || q.includes('margarita')) {
      return RECIPE_DATABASE['smoked mezcal sour']
    }
    if (q.includes('boba') || q.includes('tiger') || q.includes('tapioca')) {
      return RECIPE_DATABASE['brown sugar boba']
    }

    // Dynamic Generator for any unlisted custom search query
    if (q.length > 0) {
      const formattedTitle = searchQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      return {
        id: `disco-custom-${q.replace(/[^a-z0-9]/g, '-')}`,
        title: formattedTitle,
        categoryBadge: 'Specialty Beverage',
        category: 'Coffee',
        difficultySubtext: 'Easy • 2 min prep • 16oz Cold Cup',
        standardSize: '16oz Cold Cup',
        baseCogs: 45.00,
        matchedSuppliers: 3,
        ingredients: [
          { name: `${formattedTitle} Base Flavor`, spec: '30ml cordial / syrup', type: 'syrup' },
          { name: 'Fresh Milk or Tea Base', spec: '170ml', type: 'dairy' },
          { name: 'Double Shot Extract / Tea Liquor', spec: '36ml', type: 'extract' },
          { name: 'Specialty Top Garnish / Foam', spec: '15ml crown', type: 'foam' }
        ],
        proTip: `Calibrate ice displacement at 160g solid cubes to balance sweetness and preserve the distinctive flavor profile of ${formattedTitle}.`,
        variants: [
          { id: 'standard', label: 'Standard 16oz', delta: '₱45.00', totalCost: 45.00, description: '16oz Cold Base' },
          { id: 'oat', label: 'Swap Oat Milk', delta: '+₱8.00', totalCost: 53.00, description: 'Oatly Barista Edition' },
          { id: '22oz', label: 'Upsize 22oz', delta: '+₱12.00', totalCost: 57.00, description: '220ml Base + Double Portion' }
        ],
        layersData: {
          standard: [
            { id: 'l1', name: `${formattedTitle} Cordial`, volumeMl: 30, unitCostPerMl: 0.12, colorHex: '#f59e0b', densityBrix: 45 },
            { id: 'l2', name: 'Fresh Dairy Base', volumeMl: 170, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12 },
            { id: 'l3', name: 'Concentrated Extract Float', volumeMl: 36, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10 }
          ]
        }
      }
    }

    return RECIPE_DATABASE['iced caramel macchiato']
  }, [searchQuery])

  // Early return ONLY after all hooks have been invoked
  if (!isOpen) return null

  // Safe variant calculation
  const variantsList = (activeDrink && activeDrink.variants) ? activeDrink.variants : [
    { id: 'standard', label: 'Standard 16oz', delta: '₱42.10', totalCost: 42.10, description: '16oz Base' }
  ]
  const activeVariantObj = variantsList.find(v => v.id === selectedVariant) || variantsList[0]
  const liveCostFormatted = (activeVariantObj && activeVariantObj.totalCost != null) ? Number(activeVariantObj.totalCost).toFixed(2) : '42.10'

  const handleApplyToStudio = () => {
    if (!activeDrink) return
    const layers = (activeDrink.layersData && activeDrink.layersData[selectedVariant]) || 
                   (activeDrink.layersData && activeDrink.layersData.standard) || [
      { id: 'l1', name: `${activeDrink.title} Base`, volumeMl: 200, unitCostPerMl: 0.12, colorHex: '#f59e0b', densityBrix: 12 }
    ]
    
    const recipeObject = {
      id: `recipe-disco-${Date.now()}`,
      name: `${activeDrink.title} ${selectedVariant === 'oat' ? '(Oat)' : selectedVariant === '22oz' ? '(22oz)' : ''}`.trim(),
      venue: activeDrink.category === 'Cocktail' ? 'cocktail' : activeDrink.category === 'Boba & Tea' ? 'boba' : 'coffee',
      vesselId: selectedVariant === '22oz' ? 'boba-20oz' : (activeDrink.standardSize && activeDrink.standardSize.includes('Coupe')) ? 'coupe-7oz' : 'cold-16oz',
      iceTypeId: 'standard',
      targetMarginPct: 75,
      menuPrice: selectedVariant === '22oz' ? 220.00 : 180.00,
      packagingIds: ['cup-16oz-pet', 'lid-sip-cold'],
      layers: layers.map((l, i) => ({
        id: `layer-disco-${Date.now()}-${i}`,
        ingredientId: `ing-${(l.name || 'item').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: l.name || 'Ingredient',
        volumeMl: Number(l.volumeMl || 30),
        unitCostPerMl: Number(l.unitCostPerMl || 0.12),
        colorHex: l.colorHex || '#f59e0b',
        densityBrix: Number(l.densityBrix || 10),
        scrapType: 'standard',
        isTopOff: l.isTopOff || false,
        layerType: 'liquid'
      }))
    }
    onLoadIntoStudio(recipeObject)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '16px 20px 32px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Native iOS Drag Handle */}
        <div
          style={{
            width: '40px',
            height: '6px',
            background: '#cbd5e1',
            borderRadius: '9999px',
            margin: '0 auto 12px',
            flexShrink: 0
          }}
        />

        {/* Header Title with Circular Dismiss */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Drink Recipe Discovery
            </h2>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 500 }}>
              Curated master beverage formulas with instant supplier linking
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              flexShrink: 0
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Search Input Header with Clear Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '10px 14px',
            gap: '8px'
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any drink (e.g., Strawberry Frappe, Spanish Latte)..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.86rem',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 600
            }}
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: '#e2e8f0',
                border: 'none',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                padding: 0,
                flexShrink: 0
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Horizontal Category Filter Bar with Smooth Right Padding */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingRight: '16px',
            paddingBottom: '2px',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {quickTags.map((tag) => {
            const isSelected = (searchQuery || '').toLowerCase().includes(tag.query.toLowerCase().split(' ')[0])
            return (
              <button
                key={tag.id}
                onClick={() => {
                  setActiveCategoryFilter(tag.id)
                  setSearchQuery(tag.query)
                  setSelectedVariant('standard')
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: isSelected ? '#0f172a' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
              >
                {tag.label}
              </button>
            )
          })}
        </div>

        {/* 3. Live Matching Recipe Discovery Result Card */}
        {activeDrink && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}
          >
            {/* Card Title, Category Badge, Subtext & Right-Aligned COGS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                    {activeDrink.title}
                  </h3>
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px'
                    }}
                  >
                    {activeDrink.categoryBadge}
                  </span>
                </div>
                <div style={{ fontSize: '0.81rem', color: '#64748b', marginTop: '3px', fontWeight: 500 }}>
                  {activeDrink.difficultySubtext}
                </div>
              </div>

              {/* Right-Aligned COGS Metric */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  EST. BASELINE COGS
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '1px' }}>
                  ₱{Number(activeDrink.baseCogs || 42.10).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Clean Ingredient Pills */}
            <div>
              <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Standard Ingredients Spec
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(activeDrink.ingredients || []).map((ing, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '6px 10px',
                      fontSize: '0.76rem',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{ing.name}</span>
                    <span style={{ color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>({ing.spec})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barista Pro-Tip Callout Box */}
            {activeDrink.proTip && (
              <div
                style={{
                  background: 'rgba(254, 243, 199, 0.65)',
                  border: '1px solid rgba(253, 230, 138, 0.8)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ color: '#d97706', marginTop: '1px', flexShrink: 0 }}>
                  <Lightbulb size={16} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#92400e', lineHeight: 1.45 }}>
                  <strong style={{ color: '#78350f', fontWeight: 800 }}>Barista Pro-Tip:</strong> {activeDrink.proTip}
                </div>
              </div>
            )}

            {/* 4. Variant Selectors */}
            <div>
              <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Quick Spec Variants
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {variantsList.map((v) => {
                  const isSelected = selectedVariant === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                        background: isSelected ? '#ffffff' : '#f8fafc',
                        color: isSelected ? '#0f172a' : '#475569',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s ease',
                        minHeight: '48px'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: isSelected ? 800 : 600, lineHeight: 1.2 }}>
                        {v.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 700,
                          color: isSelected ? '#059669' : '#94a3b8',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {v.delta}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. Supplier Banner */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="#059669" fill="#059669" />
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#065f46' }}>
              ⚡ {activeDrink?.matchedSuppliers || 3} registered local suppliers match these ingredients.
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #86efac',
              padding: '4px 8px',
              borderRadius: '9999px',
              flexShrink: 0
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)'
              }}
            />
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669' }}>
              Live Prices Synced
            </span>
          </div>
        </div>

        {/* 6. Primary Action Button */}
        <button
          onClick={handleApplyToStudio}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '18px',
            border: 'none',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#ffffff',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>Load Recipe into Studio & Cost (₱{liveCostFormatted})</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  )
}
