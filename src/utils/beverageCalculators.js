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

/**
 * 1. MULTI-CUP AUTO-SCALING MATRIX
 * Scales a base recipe across standard cafe cup formats: 12oz (Hot/Small), 16oz (Standard), 22oz (Large), 1000ml (Sharing Carafe/Jug).
 */
export const CUP_SIZES = [
  { id: '12oz', label: '12oz (Small / Hot)', volumeMl: 355, volumeOz: 12, standardEspressoShots: 1, baseSyrupPumps: 2, packagingCost: 6.50, defaultPrice: 140 },
  { id: '16oz', label: '16oz (Standard Cold)', volumeMl: 473, volumeOz: 16, standardEspressoShots: 2, baseSyrupPumps: 3, packagingCost: 8.50, defaultPrice: 175 },
  { id: '22oz', label: '22oz (Jumbo / Tall)', volumeMl: 650, volumeOz: 22, standardEspressoShots: 3, baseSyrupPumps: 4, packagingCost: 11.00, defaultPrice: 215 },
  { id: '1000ml', label: '1-Liter (Pitcher / To-Go)', volumeMl: 1000, volumeOz: 34, standardEspressoShots: 4, baseSyrupPumps: 7, packagingCost: 18.00, defaultPrice: 380 }
]

export function calculateMultiCupScaling(recipe, baseCupSizeId = '16oz', targetMarginPct = 75) {
  const baseSpec = CUP_SIZES.find(c => c.id === baseCupSizeId) || CUP_SIZES[1]
  const baseVolume = baseSpec.volumeMl
  const layers = recipe?.layers || []

  return CUP_SIZES.map(cup => {
    const scaleFactor = cup.volumeMl / baseVolume
    
    // Scale layers with beverage intelligence (espresso stepped by shots, syrups by pump, liquids top-off)
    let totalLiquidCost = 0
    let scaledLayers = layers.map(layer => {
      const name = (layer.name || '').toLowerCase()
      const isEspresso = name.includes('espresso') || name.includes('coffee') || name.includes('ristretto')
      const isSyrup = name.includes('syrup') || name.includes('puree') || name.includes('sugar') || name.includes('sauce')
      const isTopOff = !!layer.isTopOff

      let scaledVol = Number(layer.volumeMl || 0)

      if (isEspresso) {
        // Espresso shots: 1 shot = 18-20ml, 2 shots = 36-40ml
        const baseShots = Math.max(1, Math.round(scaledVol / 18))
        const scaledShots = Math.max(1, Math.round(baseShots * (cup.volumeMl / 473)))
        scaledVol = scaledShots * 18
      } else if (isSyrup) {
        // Syrup scaled proportionally
        scaledVol = Math.round(scaledVol * scaleFactor)
      } else if (!isTopOff) {
        scaledVol = Math.round(scaledVol * scaleFactor)
      } else {
        // Top-off liquid will fill remaining space
        scaledVol = Math.round(scaledVol * scaleFactor)
      }

      const unitCost = Number(layer.unitCostPerMl || 0.15)
      const layerCost = scaledVol * unitCost
      totalLiquidCost += layerCost

      return {
        ...layer,
        volumeMl: scaledVol,
        layerCost: Number(layerCost.toFixed(2))
      }
    })

    const iceCost = 1.50
    const totalCogs = Number((totalLiquidCost + cup.packagingCost + iceCost).toFixed(2))
    const suggestedPrice = Math.ceil((totalCogs / (1 - (targetMarginPct / 100))) / 5) * 5
    const actualPrice = cup.defaultPrice || suggestedPrice
    const grossProfit = Number((actualPrice - totalCogs).toFixed(2))
    const marginPct = actualPrice > 0 ? Number((((actualPrice - totalCogs) / actualPrice) * 100).toFixed(1)) : 0

    return {
      cupId: cup.id,
      label: cup.label,
      volumeMl: cup.volumeMl,
      volumeOz: cup.volumeOz,
      packagingCost: cup.packagingCost,
      totalLiquidCost: Number(totalLiquidCost.toFixed(2)),
      totalCogs,
      suggestedPrice,
      actualPrice,
      grossProfit,
      marginPct,
      layers: scaledLayers,
      isBase: cup.id === baseCupSizeId
    }
  })
}

/**
 * 2. MULTI-CHANNEL & DELIVERY COMMISSION COSTING ENGINE
 * Calculates Dine-In vs Takeaway vs GrabFood (25%) vs FoodPanda (25%) profit margins and optimal markups.
 */
export const SALES_CHANNELS = [
  { id: 'dine_in', name: 'Dine-In Store', commissionPct: 0, paymentFeePct: 1.5, packagingAddon: 0.00, desc: 'Zero commission, washable glassware/standard cups' },
  { id: 'takeaway', name: 'Takeaway / To-Go', commissionPct: 0, paymentFeePct: 1.5, packagingAddon: 3.50, desc: 'Single-cup kraft carrier + straw + cup sleeve' },
  { id: 'grabfood', name: 'GrabFood Merchant', commissionPct: 25, paymentFeePct: 0, packagingAddon: 8.50, desc: '25% commission + tamper-seal + thermal ice pack' },
  { id: 'foodpanda', name: 'FoodPanda Merchant', commissionPct: 25, paymentFeePct: 0, packagingAddon: 8.50, desc: '25% commission + tamper-seal + spill bag' },
  { id: 'pickaroo', name: 'Pick-A-Roo / Web Store', commissionPct: 15, paymentFeePct: 2.0, packagingAddon: 6.00, desc: '15% platform fee + online gateway fee' }
]

export function calculateChannelCosting(baseCogs, baseDineInPrice = 180, targetMarginPct = 75) {
  return SALES_CHANNELS.map(ch => {
    const totalChannelCogs = Number((baseCogs + ch.packagingAddon).toFixed(2))
    const feeRate = (ch.commissionPct + ch.paymentFeePct) / 100

    // Markup required so net profit matches or exceeds target margin after platform fees
    // Net Revenue = MenuPrice * (1 - feeRate)
    // Target: (Net Revenue - totalChannelCogs) / MenuPrice >= targetMarginPct
    // MenuPrice * (1 - feeRate - targetMargin) = totalChannelCogs
    const effectiveRetention = 1 - feeRate - (targetMarginPct / 100)
    const suggestedDeliveryPrice = effectiveRetention > 0 
      ? Math.ceil((totalChannelCogs / effectiveRetention) / 5) * 5 
      : Math.ceil((baseDineInPrice * (1 + (ch.commissionPct / 100) + 0.10)) / 5) * 5

    const activePrice = ch.id === 'dine_in' ? baseDineInPrice : suggestedDeliveryPrice
    const commissionDeduction = Number((activePrice * (ch.commissionPct / 100)).toFixed(2))
    const paymentFeeDeduction = Number((activePrice * (ch.paymentFeePct / 100)).toFixed(2))
    const netPayout = Number((activePrice - commissionDeduction - paymentFeeDeduction).toFixed(2))
    const netProfit = Number((netPayout - totalChannelCogs).toFixed(2))
    const netMarginPct = activePrice > 0 ? Number(((netProfit / activePrice) * 100).toFixed(1)) : 0

    return {
      channelId: ch.id,
      name: ch.name,
      commissionPct: ch.commissionPct,
      paymentFeePct: ch.paymentFeePct,
      packagingAddon: ch.packagingAddon,
      totalChannelCogs,
      suggestedPrice: suggestedDeliveryPrice,
      activePrice,
      commissionDeduction,
      paymentFeeDeduction,
      netPayout,
      netProfit,
      netMarginPct,
      desc: ch.desc
    }
  })
}

/**
 * 3. WHAT-IF PRICE SURGE & INFLATION STRESS-TEST ENGINE
 * Simulates the catalog-wide financial impact of supplier price increases.
 */
export function simulateCatalogPriceInflation(recipes = [], catalog = [], surgeParams = {
  dairyIncreasePct: 15,
  coffeeIncreasePct: 20,
  syrupIncreasePct: 10,
  packagingIncreasePct: 10,
  cupsSoldMonthlyPerDrink: 350
}) {
  let totalCurrentMonthlyProfit = 0
  let totalSurgedMonthlyProfit = 0
  let totalMonthlyProfitLoss = 0

  const recipeImpacts = recipes.map(recipe => {
    const layers = recipe.layers || []
    let baseLiquidCost = 0
    let surgedLiquidCost = 0

    layers.forEach(layer => {
      const vol = Number(layer.volumeMl || 0)
      const unitCost = Number(layer.unitCostPerMl || 0.15)
      const originalCost = vol * unitCost
      baseLiquidCost += originalCost

      const name = (layer.name || '').toLowerCase()
      let multiplier = 1.0
      if (name.includes('milk') || name.includes('cream') || name.includes('oat') || name.includes('dairy')) {
        multiplier += (surgeParams.dairyIncreasePct / 100)
      } else if (name.includes('espresso') || name.includes('coffee') || name.includes('bean')) {
        multiplier += (surgeParams.coffeeIncreasePct / 100)
      } else if (name.includes('syrup') || name.includes('sauce') || name.includes('sugar') || name.includes('puree')) {
        multiplier += (surgeParams.syrupIncreasePct / 100)
      }
      surgedLiquidCost += originalCost * multiplier
    })

    const basePkgCost = 8.50
    const surgedPkgCost = basePkgCost * (1 + (surgeParams.packagingIncreasePct / 100))

    const currentCogs = Number((baseLiquidCost + basePkgCost + 1.50).toFixed(2))
    const surgedCogs = Number((surgedLiquidCost + surgedPkgCost + 1.50).toFixed(2))
    const cogsDelta = Number((surgedCogs - currentCogs).toFixed(2))

    const menuPrice = Number(recipe.price || recipe.srp || 180)
    const currentMarginPct = menuPrice > 0 ? Number((((menuPrice - currentCogs) / menuPrice) * 100).toFixed(1)) : 0
    const surgedMarginPct = menuPrice > 0 ? Number((((menuPrice - surgedCogs) / menuPrice) * 100).toFixed(1)) : 0

    const recommendedPriceHike = Math.ceil((surgedCogs / (1 - (currentMarginPct / 100))) / 5) * 5
    const monthlyCups = surgeParams.cupsSoldMonthlyPerDrink || 350
    const monthlyProfitCurrent = (menuPrice - currentCogs) * monthlyCups
    const monthlyProfitSurged = (menuPrice - surgedCogs) * monthlyCups
    const monthlyLoss = monthlyProfitCurrent - monthlyProfitSurged

    totalCurrentMonthlyProfit += monthlyProfitCurrent
    totalSurgedMonthlyProfit += monthlyProfitSurged
    totalMonthlyProfitLoss += monthlyLoss

    return {
      id: recipe.id,
      title: recipe.title || recipe.name,
      menuPrice,
      currentCogs,
      surgedCogs,
      cogsDelta,
      currentMarginPct,
      surgedMarginPct,
      marginErosionPct: Number((currentMarginPct - surgedMarginPct).toFixed(1)),
      recommendedPriceHike,
      monthlyLoss: Number(monthlyLoss.toFixed(2)),
      status: surgedMarginPct < 65 ? 'critical' : surgedMarginPct < 72 ? 'warning' : 'healthy'
    }
  })

  return {
    totalCurrentMonthlyProfit: Number(totalCurrentMonthlyProfit.toFixed(2)),
    totalSurgedMonthlyProfit: Number(totalSurgedMonthlyProfit.toFixed(2)),
    totalMonthlyProfitLoss: Number(totalMonthlyProfitLoss.toFixed(2)),
    recipesAffected: recipeImpacts.filter(r => r.marginErosionPct > 2).length,
    recipeImpacts
  }
}

/**
 * 4. REVERSE TARGET MARGIN & PRICE LADDER RECOMMENDER
 */
export function calculateTargetPriceLadder(cogs = 45.00, taxRatePct = 0) {
  const marginTiers = [65, 70, 75, 80, 85]

  return marginTiers.map(margin => {
    const rawPrice = cogs / (1 - (margin / 100))
    // Standard retail charm pricing (ends in 0 or 5, e.g. ₱145, ₱150, ₱165)
    const charmPrice = Math.ceil(rawPrice / 5) * 5
    const grossProfit = Number((charmPrice - cogs).toFixed(2))
    const actualMargin = Number(((grossProfit / charmPrice) * 100).toFixed(1))
    const paymentFeeMaya = Number((charmPrice * 0.015).toFixed(2)) // 1.5% e-wallet fee
    const netProfitAfterFees = Number((grossProfit - paymentFeeMaya).toFixed(2))

    return {
      targetMarginPct: margin,
      rawPrice: Number(rawPrice.toFixed(2)),
      charmPrice,
      grossProfit,
      actualMargin,
      paymentFeeMaya,
      netProfitAfterFees
    }
  })
}

/**
 * 5. BATCH SPOILAGE & SHELF-LIFE COST AMORTIZATION
 * Calculates the true effective cost per serving of perishable prep items (e.g. 4-hr Boba Pearls).
 */
export function calculateBatchSpoilageAmortization({
  batchPrepCost = 120.00,
  batchYieldServings = 10,
  shelfLifeHours = 4,
  expectedSellThroughPct = 75 // e.g. only 75% of batch sold before expiry
}) {
  const nominalCostPerServing = batchYieldServings > 0 ? (batchPrepCost / batchYieldServings) : 0
  const actualServingsSold = Math.max(1, (batchYieldServings * (expectedSellThroughPct / 100)))
  const wastedServings = Math.max(0, batchYieldServings - actualServingsSold)
  const trueCostPerServing = batchPrepCost / actualServingsSold
  const spoilageWasteLoss = wastedServings * nominalCostPerServing
  const costInflationDelta = trueCostPerServing - nominalCostPerServing

  return {
    batchPrepCost: Number(batchPrepCost.toFixed(2)),
    batchYieldServings,
    shelfLifeHours,
    expectedSellThroughPct,
    actualServingsSold: Number(actualServingsSold.toFixed(1)),
    wastedServings: Number(wastedServings.toFixed(1)),
    nominalCostPerServing: Number(nominalCostPerServing.toFixed(2)),
    trueCostPerServing: Number(trueCostPerServing.toFixed(2)),
    spoilageWasteLoss: Number(spoilageWasteLoss.toFixed(2)),
    costInflationDelta: Number(costInflationDelta.toFixed(2)),
    isHighRisk: expectedSellThroughPct < 70
  }
}

/**
 * 6. INTELLIGENT INGREDIENT TIER PRESET ENGINE
 * Auto-selects and swaps all recipe ingredients across 3 calibrated quality & pricing tiers:
 * - 'value' (⚡ Value / Commercial Bar - Lowest Pricing)
 * - 'signature' (⚖️ Signature / Craft Standard - Benchmark Mid-Tier)
 * - 'artisanal' (👑 Artisanal / Reserve Luxury - Single-Origin Premium)
 */
export const INGREDIENT_TIER_PRESETS = [
  {
    id: 'value',
    label: '⚡ Value Bar',
    fullName: '⚡ Value / Commercial Bar',
    tagline: 'Lowest Cost & High Margin',
    desc: 'Cost-optimized wholesale SKUs designed for high-volume delivery, school kiosks & value menus.',
    badge: 'Budget / Grab-Optimized',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    packagingUnitCost: 4.20,
    featuredBrands: ['Top Creamery', 'Metro Foodservice', 'Bataan Bulk Roasters'],
    brandSummary: 'Top Creamery + Metro Milk + Bataan Roasters',
    itemMappings: {
      espresso: { name: 'Commercial Robusta/Arabica Dark Roast Blend', brand: 'Bataan Roasters Bulk', unitCostPerMl: 0.380, supplier: 'Bataan Roasters Wholesale' },
      cold_brew: { name: 'Commercial Cold Brew Concentrate', brand: 'Metro Foodservice', unitCostPerMl: 0.220, supplier: 'Metro Foodservice' },
      condensed_milk: { name: 'Angel Sweetened Condensed Milk / Kremdensada', brand: 'Angel / Liberty', unitCostPerMl: 0.118, supplier: 'Metro Wholesale FMCG' },
      evaporated_milk: { name: 'Angel Evaporada Culinary Blend', brand: 'Angel / Century', unitCostPerMl: 0.082, supplier: 'Metro Wholesale FMCG' },
      heavy_cream: { name: 'Commercial Non-Dairy Whipping Cream', brand: 'Top Creamery', unitCostPerMl: 0.145, supplier: 'Top Creamery Foodservice' },
      milk_whole: { name: 'Commercial Barista Fresh Milk 3.2%', brand: 'Metro Foodservice Wholesale', unitCostPerMl: 0.075, supplier: 'Metro Foodservice' },
      milk_oat: { name: 'Commercial Barista Oat Milk', brand: 'Boba King Supply', unitCostPerMl: 0.120, supplier: 'Boba King Supply Manila' },
      milk_almond: { name: 'Commercial Barista Almond Milk', brand: 'Boba King Supply', unitCostPerMl: 0.140, supplier: 'Boba King Supply' },
      caramel: { name: 'Top Creamery Salted Caramel Syrup', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.160, supplier: 'Top Creamery Direct' },
      vanilla: { name: 'Top Creamery French Vanilla Syrup', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.160, supplier: 'Top Creamery Direct' },
      brown_sugar: { name: 'Value Pure Cane / Fructose Syrup', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.160, supplier: 'Top Creamery Direct' },
      chocolate: { name: 'Commercial Cocoa Sauce & Powder', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.180, supplier: 'Top Creamery Direct' },
      hazelnut: { name: 'Top Creamery Roasted Hazelnut Syrup', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.160, supplier: 'Top Creamery Direct' },
      strawberry: { name: 'Commercial Strawberry Fruit Puree', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.190, supplier: 'Top Creamery Direct' },
      syrup: { name: 'Value Pure Cane / Fructose Syrup', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.160, supplier: 'Top Creamery Direct' },
      tea: { name: 'Commercial Ceylon Black Tea Brew', brand: 'TeaSource Wholesale', unitCostPerMl: 0.024, supplier: 'TeaSource Wholesale' },
      matcha: { name: 'Culinary Grade Green Tea Powder', brand: 'Boba King Supply', unitCostPerMl: 0.180, supplier: 'Boba King Supply' },
      topping: { name: 'Standard Tapioca Pearls', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.110, supplier: 'Top Creamery Food Mfg' },
      cheese_foam: { name: 'Commercial Salted Cream Powder Cap', brand: 'Top Creamery Food Mfg', unitCostPerMl: 0.120, supplier: 'Top Creamery Direct' },
      citrus: { name: 'Commercial Calamansi Concentrate', brand: 'Divisoria Bulk', unitCostPerMl: 0.120, supplier: 'Divisoria Bulk' },
      spirit: { name: 'House Well Spirit', brand: 'House Well', unitCostPerMl: 1.20, supplier: 'Beverage Wholesale PH' }
    }
  },
  {
    id: 'signature',
    label: '⚖️ Signature Standard',
    fullName: '⚖️ Signature / Craft Standard',
    tagline: 'Balanced Specialty Benchmark',
    desc: 'Mainstream specialty cafe standard balancing robust flavor clarity with optimal 75% margin.',
    badge: 'Standard Cafe Benchmark',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    packagingUnitCost: 7.80,
    featuredBrands: ['Torani / Monin', 'Magnolia / Emborg', 'Kalsada Arabica'],
    brandSummary: 'Torani/Monin + Magnolia Milk + Kalsada Arabica',
    itemMappings: {
      espresso: { name: 'Benguet / Mt. Apo Specialty Arabica (Double Shot)', brand: 'Kalsada Coffee / Local Origin', unitCostPerMl: 0.550, supplier: 'Kalsada Coffee Direct' },
      cold_brew: { name: 'Nitro Cold Brew Concentrate (1:4 Dilution Yield)', brand: 'Manila Cold Brew Supply Co.', unitCostPerMl: 0.315, supplier: 'Manila Cold Brew Supply Co.' },
      condensed_milk: { name: 'Nestlé Carnation Sweetened Condensed Milk', brand: 'Nestlé Carnation', unitCostPerMl: 0.175, supplier: 'Nestlé Foodservice PH' },
      evaporated_milk: { name: 'Alaska Evaporated Milk (Classic)', brand: 'Alaska Milk Corp', unitCostPerMl: 0.110, supplier: 'Alaska Foodservice PH' },
      heavy_cream: { name: 'Anchor Culinary Heavy Whipping Cream 35%', brand: 'Anchor Food Professionals', unitCostPerMl: 0.285, supplier: 'Fonterra Foodservice PH' },
      milk_whole: { name: 'Emborg / Magnolia Fresh Whole Milk 3.8%', brand: 'Magnolia / Emborg Professional', unitCostPerMl: 0.095, supplier: 'San Miguel / Metro Foodservice' },
      milk_oat: { name: 'Oatside Barista Blend Oat Milk', brand: 'Oatside PH', unitCostPerMl: 0.160, supplier: 'Oatside Direct PH' },
      milk_almond: { name: 'Califia Farms Barista Almond Blend', brand: 'Califia Farms', unitCostPerMl: 0.238, supplier: 'Santini Fine Foods PH' },
      caramel: { name: 'Torani Classic Salted Caramel Sauce (Puremade)', brand: 'Torani / Monin', unitCostPerMl: 0.342, supplier: 'Barista Depot Manila' },
      vanilla: { name: 'Monin French Vanilla Gourmet Syrup', brand: 'Monin', unitCostPerMl: 0.542, supplier: 'Barista Depot Manila' },
      brown_sugar: { name: 'House Muscovado Brown Sugar Syrup (68° Brix)', brand: 'Equicom Raw Sugar Bacolod', unitCostPerMl: 0.342, supplier: 'Equicom Raw Sugar Bacolod' },
      chocolate: { name: 'Ghirardelli / Monin Dark Chocolate Sauce', brand: 'Ghirardelli / Monin', unitCostPerMl: 0.420, supplier: 'Barista Depot Manila' },
      hazelnut: { name: 'Torani Classic Roasted Hazelnut Syrup', brand: 'Torani', unitCostPerMl: 0.342, supplier: 'Barista Depot Manila' },
      strawberry: { name: 'Monin Real Strawberry Fruit Puree', brand: 'Monin', unitCostPerMl: 0.390, supplier: 'Barista Depot Manila' },
      syrup: { name: 'House Muscovado Brown Sugar Syrup', brand: 'Equicom Raw Sugar Bacolod', unitCostPerMl: 0.342, supplier: 'Equicom Raw Sugar Bacolod' },
      tea: { name: 'Royal Ceylon Strong Black Tea Base', brand: 'TeaSource PH Wholesale', unitCostPerMl: 0.034, supplier: 'TeaSource PH Wholesale' },
      matcha: { name: 'Kyoto Barista Grade Ceremonial Matcha Blend', brand: 'Matcha Manila Specialty', unitCostPerMl: 0.320, supplier: 'Matcha Manila Direct PH' },
      topping: { name: 'Fresh Warm Tiger Tapioca Pearls (4h window)', brand: 'Top Creamery Food Mfg Corp', unitCostPerMl: 0.160, supplier: 'Top Creamery Food Mfg Corp' },
      cheese_foam: { name: 'Sea Salt Himalayan Cheese Cream Cap', brand: 'In-House Prep Batch', unitCostPerMl: 0.187, supplier: 'In-House Prep Batch' },
      citrus: { name: 'Fresh Pressed Calamansi / Key Lime Juice', brand: 'Divisoria Fresh Farm Produce', unitCostPerMl: 0.225, supplier: 'Divisoria Fresh Produce' },
      spirit: { name: 'Craft Small-Batch Spirit', brand: 'Craft Spirits PH', unitCostPerMl: 2.10, supplier: 'Wine Warehouse Manila' }
    }
  },
  {
    id: 'artisanal',
    label: '👑 Artisanal Reserve',
    fullName: '👑 Artisanal / Reserve Luxury',
    tagline: 'Top-Shelf Single-Origin & Luxury',
    desc: 'Exceptional single-origin roasts, Japanese imported dairy, and organic purees for boutique positioning.',
    badge: 'Artisanal Single-Origin',
    color: '#9333ea',
    bg: '#faf5ff',
    border: '#e9d5ff',
    packagingUnitCost: 10.50,
    featuredBrands: ['1883 Maison Routin', 'Oatly / Hokkaido', 'Yardstick Ethiopia Guji'],
    brandSummary: '1883 Maison Routin + Oatly/Hokkaido + Yardstick Guji',
    itemMappings: {
      espresso: { name: 'Ethiopia Guji Heirloom Single-Origin Reserve (36ml)', brand: 'Yardstick Coffee Wholesale', unitCostPerMl: 0.725, supplier: 'Yardstick Coffee Wholesale (Manila)' },
      cold_brew: { name: 'Single-Origin Geisha Cold Drip Extraction', brand: 'Artisanal Lab Manila', unitCostPerMl: 0.550, supplier: 'In-House Lab' },
      condensed_milk: { name: 'Nestlé Milkmaid Full Cream Sweetened Condensed Milk', brand: 'Nestlé Milkmaid (Gold Label)', unitCostPerMl: 0.200, supplier: 'Gourmet Direct Imports PH' },
      evaporated_milk: { name: 'Alpine 100% Full Cream Evaporated Milk', brand: 'Alpine Evaporated Milk', unitCostPerMl: 0.165, supplier: 'Gourmet Direct Imports PH' },
      heavy_cream: { name: 'Elle & Vire Extra Dry French Cream 35%', brand: 'Elle & Vire France', unitCostPerMl: 0.380, supplier: 'Euro Specialty Imports' },
      milk_whole: { name: 'Japanese Hokkaido Farm Fresh Milk 4.0%', brand: 'Hokkaido Dairy Direct', unitCostPerMl: 0.230, supplier: 'Gourmet Direct Imports PH' },
      milk_oat: { name: 'Oatly Barista Edition Oat Milk (Sweden)', brand: 'Oatly', unitCostPerMl: 0.210, supplier: 'BakeEtc / Gourmet Direct PH' },
      milk_almond: { name: 'Califia Farms Organic Barista Blend', brand: 'Califia Farms', unitCostPerMl: 0.260, supplier: 'Santini Fine Foods' },
      caramel: { name: '1883 Maison Routin Fleur de Sel Salted Caramel', brand: '1883 Maison Routin (France)', unitCostPerMl: 0.773, supplier: 'Gourmet Direct Imports PH' },
      vanilla: { name: '1883 Maison Routin Madagascar Pure Vanilla Bean', brand: '1883 Maison Routin (France)', unitCostPerMl: 0.773, supplier: 'Barista Depot Manila' },
      brown_sugar: { name: 'Artisanal Okinawa Kokuto Black Sugar Puree', brand: 'Okinawa Artisanal Imports', unitCostPerMl: 0.650, supplier: 'Gourmet Direct Imports PH' },
      chocolate: { name: 'Valrhona Single-Origin French Mocha Ganache', brand: 'Valrhona France', unitCostPerMl: 0.850, supplier: 'Gourmet Direct Imports PH' },
      hazelnut: { name: '1883 Maison Routin Piedmont Roasted Hazelnut', brand: '1883 Maison Routin (France)', unitCostPerMl: 0.773, supplier: 'Barista Depot Manila' },
      strawberry: { name: 'La Trinidad Hand-Picked Organic Strawberry Compote', brand: 'Benguet Fruit Growers Direct', unitCostPerMl: 0.680, supplier: 'Benguet Fruit Direct' },
      syrup: { name: '1883 Maison Routin Madagascar Pure Vanilla Bean', brand: '1883 Maison Routin (France)', unitCostPerMl: 0.773, supplier: 'Barista Depot Manila' },
      tea: { name: 'High Mountain Jasmine Blossom First Flush', brand: 'Boba King / TeaSource', unitCostPerMl: 0.064, supplier: 'Boba King Supply Manila' },
      matcha: { name: 'Uji First-Harvest Ceremonial Matcha (60ml)', brand: 'Kyoto Uji Direct', unitCostPerMl: 0.480, supplier: 'Matcha Manila Direct PH' },
      topping: { name: 'Artisanal Okinawa Boba Pearls & Gold Flakes', brand: 'Artisanal Imports', unitCostPerMl: 0.240, supplier: 'In-House Bar Lab' },
      cheese_foam: { name: 'Himalayan Pink Rock Salt Mascarpone Cream Foam', brand: 'In-House Bar Lab', unitCostPerMl: 0.250, supplier: 'In-House Bar Lab' },
      citrus: { name: 'Japanese Yuzu & Organic Calamansi Puree', brand: 'Gourmet Direct Imports PH', unitCostPerMl: 0.450, supplier: 'Gourmet Direct PH' },
      spirit: { name: 'Del Maguey Vida Artisanal Mezcal (45ml)', brand: 'Del Maguey (Oaxaca)', unitCostPerMl: 2.60, supplier: 'Wine Warehouse Manila' }
    }
  }
]

export function detectLayerFlavorProfile(layer) {
  const name = (layer.name || '').toLowerCase()
  
  // 1. Specific Concentrated Dairy & Sweeteners (Checked BEFORE generic milk/cream!)
  if (name.includes('condensed') || name.includes('condensada') || name.includes('sweetened condensed')) return 'condensed_milk'
  if (name.includes('evaporated') || name.includes('evap') || name.includes('evaporada')) return 'evaporated_milk'
  if (name.includes('heavy cream') || name.includes('whipping cream') || name.includes('half and half') || name.includes('creamer')) return 'heavy_cream'

  // 2. Specific Syrups, Sauces & Flavor Profiles
  if (name.includes('caramel') || name.includes('toffee')) return 'caramel'
  if (name.includes('vanilla')) return 'vanilla'
  if (name.includes('brown sugar') || name.includes('muscovado') || name.includes('okinawa') || name.includes('cane') || name.includes('fructose') || name.includes('sugar')) return 'brown_sugar'
  if (name.includes('chocolate') || name.includes('mocha') || name.includes('cocoa') || name.includes('ganache')) return 'chocolate'
  if (name.includes('hazelnut') || name.includes('nut') || name.includes('pistachio')) return 'hazelnut'
  if (name.includes('strawberry') || name.includes('berry') || name.includes('fruit') || name.includes('compote')) return 'strawberry'
  
  // 3. Milks & Plant Alternatives
  if (name.includes('oat')) return 'milk_oat'
  if (name.includes('almond')) return 'milk_almond'
  if (name.includes('soy')) return 'milk_soy'
  if (name.includes('coconut')) return 'milk_coconut'
  if (name.includes('milk') || name.includes('dairy') || name.includes('latte')) return 'milk_whole'
  
  // 4. Coffee
  if (name.includes('cold brew')) return 'cold_brew'
  if (name.includes('espresso') || name.includes('coffee') || name.includes('ristretto') || name.includes('shot')) return 'espresso'
  
  // 5. Tea & Matcha
  if (name.includes('matcha') || name.includes('hojicha')) return 'matcha'
  if (name.includes('tea') || name.includes('jasmine') || name.includes('ceylon') || name.includes('earl grey')) return 'tea'
  
  // 6. Toppings & Foam
  if (name.includes('cheese') || name.includes('foam') || name.includes('cap') || name.includes('cloud')) return 'cheese_foam'
  if (name.includes('boba') || name.includes('pearl') || name.includes('tapioca') || name.includes('jelly')) return 'topping'
  
  // 7. Citrus & Spirits
  if (name.includes('lime') || name.includes('lemon') || name.includes('calamansi') || name.includes('citrus') || name.includes('yuzu')) return 'citrus'
  if (name.includes('mezcal') || name.includes('gin') || name.includes('spirit') || name.includes('rum') || name.includes('whiskey')) return 'spirit'
  return 'syrup'
}

/**
 * Automatically applies an ingredient quality & pricing tier across all layers of a recipe.
 */
export function applyIngredientTierToRecipe(recipe, tierId = 'signature', catalog = []) {
  const tier = INGREDIENT_TIER_PRESETS.find(t => t.id === tierId) || INGREDIENT_TIER_PRESETS[1]
  const layers = recipe?.layers || []

  const updatedLayers = layers.map(layer => {
    // Keep custom sub-recipe batch preps unchanged or adjust unitCost if applicable
    if (layer.isSubRecipe) return layer

    const flavor = detectLayerFlavorProfile(layer)
    const tierMapping = tier.itemMappings[flavor] || tier.itemMappings.syrup

    if (!tierMapping) return layer

    return {
      ...layer,
      name: tierMapping.name,
      brand: tierMapping.brand,
      unitCostPerMl: tierMapping.unitCostPerMl,
      supplier: tierMapping.supplier,
      tier: tierId
    }
  })

  return {
    ...recipe,
    ingredientTier: tierId,
    layers: updatedLayers
  }
}

/**
 * Calculates side-by-side comparison across all 3 tiers (Value, Signature, Artisanal) for the given recipe.
 */
export function calculateRecipeTierComparison(recipe, catalog = [], basePrice = 180) {
  // Check if current recipe is hybrid or matches an active tier
  const activeTierId = recipe.ingredientTier || 'signature'

  return INGREDIENT_TIER_PRESETS.map(tier => {
    const previewRecipe = applyIngredientTierToRecipe(recipe, tier.id, catalog)
    const layers = previewRecipe.layers || []

    let totalLiquidCost = 0
    layers.forEach(l => {
      const vol = Number(l.volumeMl || 0)
      const cost = vol * Number(l.unitCostPerMl || 0.15)
      totalLiquidCost += cost
    })

    const totalCogs = Number((totalLiquidCost + tier.packagingUnitCost + 1.50).toFixed(2))
    const grossProfit = Number((basePrice - totalCogs).toFixed(2))
    const grossMarginPct = basePrice > 0 ? Number(((grossProfit / basePrice) * 100).toFixed(1)) : 0
    const suggestedPrice = Math.ceil((totalCogs / 0.25) / 5) * 5 // 75% target margin

    return {
      tierId: tier.id,
      label: tier.label,
      fullName: tier.fullName,
      tagline: tier.tagline,
      desc: tier.desc,
      color: tier.color,
      bg: tier.bg,
      border: tier.border,
      featuredBrands: tier.featuredBrands,
      brandSummary: tier.brandSummary,
      totalLiquidCost: Number(totalLiquidCost.toFixed(2)),
      packagingCost: tier.packagingUnitCost,
      totalCogs,
      grossProfit,
      grossMarginPct,
      suggestedPrice,
      isActive: activeTierId === tier.id
    }
  })
}
