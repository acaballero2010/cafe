// Beverage Intelligence: Sensory Profiling, Allergen Detection, Sugar Tiers & Prime Costing

/**
 * Calculates 5-axis sensory scores (1 to 10 scale) based on beverage formulation.
 */
export function calculateSensoryProfile(recipe) {
  const layers = recipe?.layers || []
  let totalVolume = 0
  let weightedBrix = 0
  let hasEspresso = false
  let espressoVolume = 0
  let dairyVolume = 0
  let plantMilkVolume = 0
  let citrusVolume = 0
  let teaVolume = 0
  let floralHerbVolume = 0

  layers.forEach(layer => {
    const vol = Number(layer.volumeMl || 0)
    totalVolume += vol
    const brix = Number(layer.densityBrix || 10)
    weightedBrix += vol * brix

    const name = (layer.name || '').toLowerCase()
    if (name.includes('espresso') || name.includes('coffee') || name.includes('ristretto')) {
      hasEspresso = true
      espressoVolume += vol
    }
    if (name.includes('milk') || name.includes('cream') || name.includes('half and half') || name.includes('condensed')) {
      dairyVolume += vol
    }
    if (name.includes('oat') || name.includes('almond') || name.includes('soy') || name.includes('coconut')) {
      plantMilkVolume += vol
    }
    if (name.includes('lemon') || name.includes('lime') || name.includes('yuzu') || name.includes('calamansi') || name.includes('citrus') || name.includes('tonic')) {
      citrusVolume += vol
    }
    if (name.includes('tea') || name.includes('matcha') || name.includes('hojicha') || name.includes('earl grey') || name.includes('jasmine')) {
      teaVolume += vol
    }
    if (name.includes('vanilla') || name.includes('lavender') || name.includes('rose') || name.includes('mint') || name.includes('cinnamon') || name.includes('caramel')) {
      floralHerbVolume += vol
    }
  })

  const avgBrix = totalVolume > 0 ? (weightedBrix / totalVolume) : 12

  // 1. Sweetness (1-10) based on Brix and syrup content
  let sweetness = Math.min(10, Math.max(1, Math.round((avgBrix / 45) * 10)))

  // 2. Acidity (1-10)
  let acidity = 3
  if (citrusVolume > 0) acidity += Math.min(6, Math.round((citrusVolume / 40) * 5))
  if (hasEspresso) acidity += 2
  acidity = Math.min(10, Math.max(1, acidity))

  // 3. Bitterness (1-10)
  let bitterness = 2
  if (espressoVolume > 0) bitterness += Math.min(6, Math.round((espressoVolume / 36) * 4))
  if (teaVolume > 0) bitterness += Math.min(4, Math.round((teaVolume / 80) * 3))
  bitterness = Math.min(10, Math.max(1, bitterness))

  // 4. Body / Texture (1-10)
  let body = 3
  if (dairyVolume > 0) body += Math.min(6, Math.round((dairyVolume / 150) * 5))
  if (plantMilkVolume > 0) body += Math.min(5, Math.round((plantMilkVolume / 150) * 4))
  if (avgBrix > 20) body += 2
  body = Math.min(10, Math.max(1, body))

  // 5. Aroma / Complexity (1-10)
  let aroma = 5
  if (hasEspresso) aroma += 2
  if (teaVolume > 0 || floralHerbVolume > 0) aroma += 3
  aroma = Math.min(10, Math.max(1, aroma))

  return {
    sweetness,
    acidity,
    bitterness,
    body,
    aroma,
    avgBrix: avgBrix.toFixed(1)
  }
}

/**
 * Automatically inspects ingredients to flag allergens, dietary compliance, caffeine, and estimated calories.
 */
export function analyzeAllergensAndNutrition(recipe) {
  const layers = recipe?.layers || []
  const allergens = new Set()
  const dietary = new Set(['Vegetarian', 'Gluten-Free'])
  
  let totalCaffeineMg = 0
  let totalCaloriesKcal = 0
  let isVegan = true

  layers.forEach(layer => {
    const name = (layer.name || '').toLowerCase()
    const vol = Number(layer.volumeMl || 0)

    // Dairy / Lactose
    if (name.includes('milk') && !name.includes('oat') && !name.includes('almond') && !name.includes('soy') && !name.includes('coconut')) {
      allergens.add('Dairy / Lactose')
      isVegan = false
      totalCaloriesKcal += vol * 0.65 // ~65 kcal per 100ml whole milk
    } else if (name.includes('cream') || name.includes('condensed') || name.includes('cheese') || name.includes('half and half')) {
      allergens.add('Dairy / Lactose')
      isVegan = false
      totalCaloriesKcal += vol * 2.10 // Rich cream
    }

    // Plant Milk Calories
    if (name.includes('oat milk')) {
      totalCaloriesKcal += vol * 0.50
    }
    if (name.includes('almond milk')) {
      allergens.add('Tree Nuts (Almond)')
      totalCaloriesKcal += vol * 0.30
    }
    if (name.includes('soy milk')) {
      allergens.add('Soy')
      totalCaloriesKcal += vol * 0.45
    }
    if (name.includes('hazelnut') || name.includes('pistachio') || name.includes('peanut')) {
      allergens.add('Tree Nuts')
    }

    // Syrups & Sugar
    if (name.includes('syrup') || name.includes('sugar') || name.includes('puree') || name.includes('caramel') || name.includes('honey')) {
      totalCaloriesKcal += vol * 3.80 // ~38 kcal per 10ml
    }

    // Caffeine estimation
    if (name.includes('espresso') || name.includes('ristretto')) {
      totalCaffeineMg += Math.round((vol / 18) * 64) // ~64mg per single shot (18ml)
      totalCaloriesKcal += 5
    } else if (name.includes('cold brew') || name.includes('concentrate')) {
      totalCaffeineMg += Math.round((vol / 100) * 110)
      totalCaloriesKcal += 10
    } else if (name.includes('matcha')) {
      totalCaffeineMg += 70
      totalCaloriesKcal += 25
    } else if (name.includes('black tea') || name.includes('earl grey') || name.includes('thai tea')) {
      totalCaffeineMg += Math.round((vol / 100) * 45)
    } else if (name.includes('green tea') || name.includes('jasmine')) {
      totalCaffeineMg += Math.round((vol / 100) * 28)
    }
  })

  if (isVegan) {
    dietary.add('Vegan')
    dietary.add('Dairy-Free')
  }

  return {
    allergens: Array.from(allergens),
    dietary: Array.from(dietary),
    caffeineMg: Math.round(totalCaffeineMg),
    caloriesKcal: Math.round(Math.max(15, totalCaloriesKcal)),
    isVegan
  }
}

/**
 * Calculates adjusted specs, syrup pump quantities, and COGS for sweetness levels (0%, 25%, 50%, 75%, 100%).
 */
export function calculateSugarTiers(recipe, standardCogs = 45.00) {
  const layers = recipe?.layers || []
  
  // Find syrup/sugar layers
  const syrupLayers = layers.filter(l => {
    const name = (l.name || '').toLowerCase()
    return name.includes('syrup') || name.includes('sugar') || name.includes('puree') || name.includes('fructose') || name.includes('condensed')
  })

  const baseSyrupMl = syrupLayers.reduce((sum, l) => sum + Number(l.volumeMl || 0), 0)
  const baseSyrupCost = syrupLayers.reduce((sum, l) => sum + (Number(l.volumeMl || 0) * (l.unitCostPerMl || 0.15)), 0)
  const basePumps = Math.max(1, Math.round(baseSyrupMl / 10))

  const tiers = [
    { pct: 0, label: '0% Unsweetened', multiplier: 0, desc: 'Zero added sugar / keto friendly' },
    { pct: 25, label: '25% Light Sweet', multiplier: 0.25, desc: 'Subtle hint of sweetness' },
    { pct: 50, label: '50% Half Sweet', multiplier: 0.50, desc: 'Balanced coffee forward' },
    { pct: 75, label: '75% Less Sweet', multiplier: 0.75, desc: 'Standard cafe reduced sweet' },
    { pct: 100, label: '100% Standard', multiplier: 1.00, desc: 'Original signature formulation' }
  ]

  return tiers.map(tier => {
    const adjustedMl = Math.round(baseSyrupMl * tier.multiplier)
    const adjustedPumps = (basePumps * tier.multiplier).toFixed(1)
    const costDelta = (baseSyrupCost * tier.multiplier) - baseSyrupCost
    const adjustedCogs = Math.max(10, standardCogs + costDelta)
    const estimatedCalDelta = Math.round((adjustedMl - baseSyrupMl) * 3.8)

    return {
      ...tier,
      syrupMl: adjustedMl,
      pumps: adjustedPumps,
      costDeltaPhp: costDelta.toFixed(2),
      adjustedCogsPhp: adjustedCogs.toFixed(2),
      calDelta: estimatedCalDelta
    }
  })
}

/**
 * Prime Cost = COGS + Direct Barista Preparation Labor.
 * Average barista wage in Philippines: ~₱90/hour (₱1.50/min).
 */
export function calculatePrimeCost({
  cogs = 45.00,
  prepTimeSeconds = 90,
  baristaHourlyRate = 95.00,
  pitcherWastePct = 4.0
}) {
  const prepMinutes = prepTimeSeconds / 60
  const laborCostPerDrink = (baristaHourlyRate / 60) * prepMinutes
  const wasteCost = cogs * (pitcherWastePct / 100)
  const truePrimeCost = cogs + laborCostPerDrink + wasteCost

  return {
    cogs: Number(cogs.toFixed(2)),
    prepTimeSeconds,
    baristaHourlyRate,
    laborCostPerDrink: Number(laborCostPerDrink.toFixed(2)),
    wasteCost: Number(wasteCost.toFixed(2)),
    pitcherWastePct,
    truePrimeCost: Number(truePrimeCost.toFixed(2))
  }
}
