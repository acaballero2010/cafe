// Liquid Physics, Ice Displacement, Density & Scrap Math

export const VESSELS = [
  { id: 'cold-16oz', name: '16oz Cold Cup (PET)', category: 'cold', volumeMl: 473, volumeOz: 16, shape: 'tapered', icon: 'cup' },
  { id: 'boba-20oz', name: '20oz Boba Tumbler', category: 'boba', volumeMl: 591, volumeOz: 20, shape: 'cylinder', icon: 'cup' },
  { id: 'boba-24oz', name: '24oz Jumbo Boba Cup', category: 'boba', volumeMl: 710, volumeOz: 24, shape: 'tall', icon: 'cup' },
  { id: 'hot-12oz', name: '12oz Double-Wall Hot', category: 'hot', volumeMl: 355, volumeOz: 12, shape: 'hot_cup', icon: 'cup' },
  { id: 'hot-16oz', name: '16oz Double-Wall Hot', category: 'hot', volumeMl: 473, volumeOz: 16, shape: 'hot_cup', icon: 'cup' },
  { id: 'cortado-8oz', name: '8oz Gibraltar / Cortado', category: 'glass', volumeMl: 240, volumeOz: 8, shape: 'gibraltar', icon: 'glass' },
  { id: 'coupe-7oz', name: '7oz Nick & Nora / Coupe', category: 'cocktail', volumeMl: 210, volumeOz: 7, shape: 'coupe', icon: 'cocktail' },
  { id: 'highball-12oz', name: '12oz Cut-Crystal Highball', category: 'cocktail', volumeMl: 355, volumeOz: 12, shape: 'highball', icon: 'glass' },
]

export const ICE_TYPES = [
  { id: 'none', name: 'No Ice', displacementRatio: 0.0, meltDilutionMl: 0, desc: 'Maximum liquid top-off' },
  { id: 'light', name: 'Light Ice (20%)', displacementRatio: 0.20, meltDilutionMl: 15, desc: 'Quick chill, standard dilution' },
  { id: 'standard', name: 'Standard Ice (35%)', displacementRatio: 0.35, meltDilutionMl: 25, desc: 'Standard cafe & boba baseline' },
  { id: 'extra', name: 'Extra Ice (50%)', displacementRatio: 0.50, meltDilutionMl: 35, desc: 'High displacement, lower liquid COGS' },
  { id: 'craft_cube', name: '2" King Clear Cube (55%)', displacementRatio: 0.55, meltDilutionMl: 8, desc: 'Slow melt craft cocktail standard' },
  { id: 'crushed', name: 'Crushed / Nugget Ice (45%)', displacementRatio: 0.45, meltDilutionMl: 40, desc: 'Boba & tiki rapid cooling' }
]

export const SCRAP_PROFILES = {
  espresso: { name: 'Grinder Dial-in & Purge Scrap', defaultRate: 0.08, desc: '150-250g daily grind calibration loss' },
  milk_steaming: { name: 'Pitcher Residual & Foam Scrap', defaultRate: 0.15, desc: 'Over-pitching for microfoam & latte art' },
  boba_pearls: { name: '4-Hour Texture Batch Expiry', defaultRate: 0.18, desc: 'Discarded tapioca after freshness window' },
  fresh_citrus: { name: 'Juice Oxidation & Bar Scrap', defaultRate: 0.10, desc: 'Fresh squeezed juice end-of-day waste' },
  syrup_line: { name: 'Pump & Bottle Residual Loss', defaultRate: 0.04, desc: 'Thick syrup clinging to container base' },
  standard: { name: 'Standard Bar Loss', defaultRate: 0.03, desc: 'General spill and measure tolerance' }
}

/**
 * Calculates complete displacement, top-off liquid needed, and real vs nominal cost breakdown.
 */
export function calculateDrinkMetrics({
  vesselId,
  iceTypeId,
  layers = [],
  packagingItems = [],
  includeScrap = true,
  targetMarginPct = 75,
  menuPrice = 6.00
}) {
  const vessel = VESSELS.find(v => v.id === vesselId) || VESSELS[0]
  const ice = ICE_TYPES.find(i => i.id === iceTypeId) || ICE_TYPES[2]

  const totalVesselVolumeMl = vessel.volumeMl
  const iceDisplacementMl = Math.round(totalVesselVolumeMl * ice.displacementRatio)
  const availableLiquidCapacityMl = Math.max(0, totalVesselVolumeMl - iceDisplacementMl)

  // Separate fixed layers vs auto-top-off layer
  let fixedLayersMl = 0
  let layersDetailed = []

  // Check if there's an auto top-off layer
  const topOffIndex = layers.findIndex(l => l.isTopOff)

  layers.forEach((layer, idx) => {
    if (idx !== topOffIndex) {
      fixedLayersMl += Number(layer.volumeMl || 0)
    }
  })

  // Compute required volume for top-off layer
  const topOffVolumeMl = Math.max(0, availableLiquidCapacityMl - fixedLayersMl)
  const isOverflowing = fixedLayersMl > availableLiquidCapacityMl

  let nominalLiquidCost = 0
  let realLiquidCostWithScrap = 0

  layers.forEach((layer, idx) => {
    const isTopOff = idx === topOffIndex
    const actualVolumeMl = isTopOff ? topOffVolumeMl : Number(layer.volumeMl || 0)
    
    // Cost calculation based on unit cost
    // unitCost is typically $/ml or $/oz
    const unitCostPerMl = layer.unitCostPerMl || (layer.unitCostPerOz ? layer.unitCostPerOz / 29.5735 : 0.005)
    const nominalCost = actualVolumeMl * unitCostPerMl

    // Scrap multiplier
    const scrapType = layer.scrapType || 'standard'
    const scrapRate = SCRAP_PROFILES[scrapType] ? SCRAP_PROFILES[scrapType].defaultRate : 0.03
    const scrapMultiplier = includeScrap ? (1 + scrapRate) : 1
    const realCost = nominalCost * scrapMultiplier

    nominalLiquidCost += nominalCost
    realLiquidCostWithScrap += realCost

    layersDetailed.push({
      ...layer,
      calculatedVolumeMl: actualVolumeMl,
      calculatedVolumeOz: (actualVolumeMl / 29.5735).toFixed(1),
      nominalCost,
      realCost,
      scrapRate,
      heightPercent: totalVesselVolumeMl > 0 ? (actualVolumeMl / totalVesselVolumeMl) * 100 : 0
    })
  })

  // Packaging Consumables Cost
  let packagingCost = 0
  packagingItems.forEach(pkg => {
    if (pkg.selected) {
      packagingCost += Number(pkg.unitCost || 0)
    }
  })

  // Ice Cost (Purified RO / craft ice batch estimate)
  const iceCost = ice.displacementRatio > 0 ? 0.04 : 0.00

  const totalCogsNominal = nominalLiquidCost + packagingCost + iceCost
  const totalCogsReal = realLiquidCostWithScrap + packagingCost + iceCost

  const actualCogs = includeScrap ? totalCogsReal : totalCogsNominal

  // Margin Calculations
  const grossProfit = Math.max(0, menuPrice - actualCogs)
  const grossMarginPct = menuPrice > 0 ? ((menuPrice - actualCogs) / menuPrice) * 100 : 0

  // Suggested Price at Target Margin
  const suggestedMenuPrice = targetMarginPct < 100 ? (actualCogs / (1 - (targetMarginPct / 100))) : (actualCogs * 4)

  return {
    vessel,
    ice,
    totalVesselVolumeMl,
    iceDisplacementMl,
    availableLiquidCapacityMl,
    fixedLayersMl,
    topOffVolumeMl,
    isOverflowing,
    overflowAmountMl: isOverflowing ? (fixedLayersMl - availableLiquidCapacityMl) : 0,
    layersDetailed,
    packagingCost,
    iceCost,
    nominalLiquidCost,
    realLiquidCostWithScrap,
    scrapLossDollar: realLiquidCostWithScrap - nominalLiquidCost,
    totalCogsNominal,
    totalCogsReal,
    totalCogs: actualCogs,
    menuPrice,
    grossProfit,
    grossMarginPct,
    suggestedMenuPrice,
    targetMarginPct
  }
}
