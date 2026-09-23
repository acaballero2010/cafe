// Sub-Recipes (Batches) with Ingredient Breakdown, Prep Shrinkage & Yields in Philippine Pesos (₱)

export const DEFAULT_SUB_RECIPES = [
  {
    id: 'sub-tiger-boba-batch',
    name: 'House Muscovado Tiger Tapioca Batch',
    category: 'boba',
    targetYieldQty: 2500, // 2500g output
    yieldUom: 'g',
    prepWasteRate: 0.08,
    shelfLifeHours: 4,
    densityBrix: 72.0,
    colorHex: '#160802',
    description: 'Slow-simmered dark tapioca pearls soaked in caramelized Muscovado brown sugar.',
    sopNotes: 'Boil raw pearls 25 mins, steam 20 mins, rinse warm, simmer in brown sugar glaze 15 mins.',
    items: [
      { ingredientId: 'tiger-boba-pearls', quantity: 1000, uom: 'g' },
      { ingredientId: 'tiger-brown-sugar-syrup', quantity: 600, uom: 'ml' }
    ]
  },
  {
    id: 'sub-cheese-foam-batch',
    name: 'Sea Salt Himalayan Cheese Cream Cap',
    category: 'topping',
    targetYieldQty: 1500, // 1500ml output
    yieldUom: 'ml',
    prepWasteRate: 0.06,
    shelfLifeHours: 24,
    densityBrix: 22.0,
    colorHex: '#fffdf0',
    description: 'Silky whipped cream cheese with organic dairy cream and pink Himalayan crystal salt.',
    sopNotes: 'Blend cream cheese with condensed milk until smooth, fold into whipped cold cream with sea salt.',
    items: [
      { ingredientId: 'organic-whole-milk', quantity: 400, uom: 'ml' },
      { ingredientId: 'cheese-foam-cap', quantity: 1000, uom: 'ml' }
    ]
  },
  {
    id: 'sub-cold-brew-batch',
    name: 'Cold Brew Toddy Batch (1:4 Concentrate)',
    category: 'coffee',
    targetYieldQty: 10000,
    yieldUom: 'ml',
    prepWasteRate: 0.18,
    shelfLifeHours: 168,
    densityBrix: 7.5,
    colorHex: '#261408',
    description: '20-hour steeped coarse single-origin Benguet brew with rich dark cocoa notes.',
    sopNotes: 'Coarse grind 2kg coffee, steep in 12L filtered RO water for 20 hours at 4°C, triple filter.',
    items: [
      { ingredientId: 'colombia-espresso', quantity: 2000, uom: 'g' }
    ]
  }
]

export function calculateSubRecipeMetrics(subRecipe, rawCatalog = []) {
  let rawBatchCost = 0
  const itemsDetailed = (subRecipe.items || []).map(item => {
    const ingredient = rawCatalog.find(c => c.id === item.ingredientId)
    const unitCost = ingredient ? ingredient.unitCostPerMl : 0.20
    const cost = item.quantity * unitCost
    rawBatchCost += cost

    return {
      ...item,
      name: ingredient ? ingredient.name : item.ingredientId,
      unitCost,
      totalCost: cost,
      colorHex: ingredient ? ingredient.colorHex : '#f59e0b'
    }
  })

  const prepWasteRate = Number(subRecipe.prepWasteRate || 0.05)
  const realBatchCostWithWaste = prepWasteRate < 1 ? (rawBatchCost / (1 - prepWasteRate)) : rawBatchCost
  const yieldQty = Number(subRecipe.targetYieldQty || 1000)
  const effectiveUnitCost = yieldQty > 0 ? (realBatchCostWithWaste / yieldQty) : 0

  const standardServingQty = subRecipe.yieldUom === 'g' ? 60 : 50
  const servingCost = effectiveUnitCost * standardServingQty
  const servingsPerBatch = yieldQty > 0 ? Math.floor(yieldQty / standardServingQty) : 0

  return {
    rawBatchCost,
    prepWasteDollar: realBatchCostWithWaste - rawBatchCost,
    realBatchCostWithWaste,
    effectiveUnitCost,
    effectiveUnitCostFormatted: effectiveUnitCost.toFixed(2),
    yieldQty,
    yieldUom: subRecipe.yieldUom,
    standardServingQty,
    servingCost,
    servingsPerBatch,
    itemsDetailed
  }
}
