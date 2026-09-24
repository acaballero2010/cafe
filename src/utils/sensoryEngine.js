// Sensory Food Science Flavor Balance & Radar Engine for PourCraft OS

/**
 * Calculates 5-axis sensory scores, total beverage Brix, flavor descriptors, and imbalance warnings.
 * @param {Object} recipe - Active recipe object containing layers, vessel, ice, etc.
 * @param {Object} metrics - Physics metrics containing calculated volumes and liquid amounts.
 * @returns {Object} Sensory analysis result
 */
export function calculateSensoryProfile(recipe = {}, metrics = {}) {
  const layers = metrics.layersDetailed && metrics.layersDetailed.length > 0 
    ? metrics.layersDetailed 
    : (recipe.layers || [])

  const totalLiquidMl = layers.reduce((sum, l) => sum + Number(l.calculatedVolumeMl || l.volumeMl || 30), 0) || 240

  let weightedBrixSum = 0
  let sweetnessPoints = 0
  let acidityPoints = 0
  let bitternessPoints = 0
  let bodyPoints = 0
  let aromaPoints = 0

  const descriptors = []

  // Analyze each layer's food science parameters
  layers.forEach(layer => {
    const vol = Number(layer.calculatedVolumeMl || layer.volumeMl || 30)
    const ratio = vol / totalLiquidMl
    const nameLower = (layer.name || '').toLowerCase()
    const brix = Number(layer.densityBrix || 12)

    weightedBrixSum += brix * ratio

    // 1. Syrups & Sweeteners
    if (nameLower.includes('syrup') || nameLower.includes('sugar') || nameLower.includes('condensed') || nameLower.includes('caramel') || brix >= 40) {
      sweetnessPoints += (brix / 70) * ratio * 280
      aromaPoints += 25 * ratio

      if (nameLower.includes('brown sugar') || nameLower.includes('muscovado') || nameLower.includes('okinawa')) {
        bodyPoints += 20 * ratio
        descriptors.push('Caramelized Muscovado')
        descriptors.push('Warm Molasses')
      } else if (nameLower.includes('vanilla')) {
        descriptors.push('Madagascar Vanilla')
      } else if (nameLower.includes('pistachio')) {
        descriptors.push('Toasted Pistachio')
        bodyPoints += 30 * ratio
      } else if (nameLower.includes('caramel')) {
        descriptors.push('Toffee Caramel')
      }
    }

    // 2. Condensed / Evaporated Milk
    if (nameLower.includes('condensed') || nameLower.includes('sweetened')) {
      sweetnessPoints += 60 * ratio * 3.5
      bodyPoints += 85 * ratio * 3.0
      descriptors.push('Velvety Creaminess')
    }

    // 3. Espresso & Coffee
    if (nameLower.includes('espresso') || nameLower.includes('coffee') || nameLower.includes('shot') || nameLower.includes('cold brew')) {
      bitternessPoints += 75 * ratio * 4.5
      aromaPoints += 90 * ratio * 4.0

      if (nameLower.includes('blonde') || nameLower.includes('light') || nameLower.includes('ethiopia') || nameLower.includes('guji')) {
        acidityPoints += 70 * ratio * 4.0
        descriptors.push('Bright Stone Fruit')
        descriptors.push('Citrus Blossom')
      } else if (nameLower.includes('dark') || nameLower.includes('santos') || nameLower.includes('house blend')) {
        bitternessPoints += 85 * ratio * 4.5
        descriptors.push('Dark Cacao')
        descriptors.push('Roasted Hazelnut')
      } else {
        acidityPoints += 45 * ratio * 3.5
        descriptors.push('Balanced Roast')
      }
    }

    // 4. Teas & Matcha
    if (nameLower.includes('matcha') || nameLower.includes('tencha')) {
      bitternessPoints += 45 * ratio * 3.5
      aromaPoints += 75 * ratio * 3.0
      bodyPoints += 35 * ratio * 2.0
      descriptors.push('Kyoto Umami')
      descriptors.push('Stone-Ground Green Tea')
    } else if (nameLower.includes('black tea') || nameLower.includes('assam') || nameLower.includes('ruby')) {
      bitternessPoints += 50 * ratio * 3.0
      aromaPoints += 60 * ratio * 2.5
      descriptors.push('Malted Black Tea')
      descriptors.push('Crisp Tannins')
    }

    // 5. Milks & Plant-Based Dairy
    if (nameLower.includes('oat') || nameLower.includes('oatly') || nameLower.includes('oatside') || nameLower.includes('milklab')) {
      bodyPoints += 68 * ratio * 1.8
      sweetnessPoints += 20 * ratio * 1.5
      descriptors.push('Silky Oat Cream')
      descriptors.push('Toasted Grain')
    } else if (nameLower.includes('fresh milk') || nameLower.includes('whole milk') || nameLower.includes('dairy')) {
      bodyPoints += 60 * ratio * 1.8
      sweetnessPoints += 15 * ratio * 1.5
      descriptors.push('Dairy Butterfat')
    }

    // 6. Cold Foams & Creams
    if (nameLower.includes('foam') || nameLower.includes('cream') || nameLower.includes('cloud')) {
      bodyPoints += 85 * ratio * 3.0
      aromaPoints += 40 * ratio * 2.0
      if (nameLower.includes('sea salt') || nameLower.includes('cheese')) {
        descriptors.push('Savory Sea Salt Foam')
      } else {
        descriptors.push('Aerated Cold Cream')
      }
    }

    // 7. Fruit Purees & Citrus
    if (nameLower.includes('strawberry') || nameLower.includes('lemon') || nameLower.includes('berry') || nameLower.includes('passion')) {
      acidityPoints += 80 * ratio * 3.5
      sweetnessPoints += 45 * ratio * 2.0
      aromaPoints += 70 * ratio * 2.5
      descriptors.push('Ripe Fruit Acidity')
    }

    // 8. Boba & Tapioca
    if (nameLower.includes('boba') || nameLower.includes('tapioca') || nameLower.includes('pearl')) {
      bodyPoints += 45 * ratio * 2.5
      sweetnessPoints += 30 * ratio * 2.0
      descriptors.push('Chewy Brown Sugar Pearls')
    }
  })

  // Normalize scores between 5 and 100
  const sweetnessScore = Math.min(100, Math.max(8, Math.round(sweetnessPoints)))
  const acidityScore = Math.min(100, Math.max(5, Math.round(acidityPoints)))
  const bitternessScore = Math.min(100, Math.max(5, Math.round(bitternessPoints)))
  const bodyScore = Math.min(100, Math.max(10, Math.round(bodyPoints)))
  const aromaScore = Math.min(100, Math.max(12, Math.round(aromaPoints)))
  const totalBrix = Number(weightedBrixSum.toFixed(1))

  // Unique descriptors (limit to top 4)
  const uniqueDescriptors = Array.from(new Set(descriptors)).slice(0, 4)
  if (uniqueDescriptors.length === 0) {
    uniqueDescriptors.push('Smooth Texture', 'Balanced Formula')
  }

  // Imbalance Detection & Food Science Alerts
  const alerts = []

  if (totalBrix > 22.0 || sweetnessScore > 82) {
    alerts.push({
      type: 'warning',
      title: 'High Sugar Load (>22°Bx)',
      message: `Total dissolved solids is ${totalBrix}°Bx. High sugar concentration may overpower delicate espresso or tea aromatics.`
    })
  }

  if (bitternessScore > 75 && sweetnessScore < 25 && bodyScore < 30) {
    alerts.push({
      type: 'warning',
      title: 'Astringent / High Bitterness',
      message: 'Tannin and caffeine concentration is high without sufficient lipid buffering from milk or sweetener.'
    })
  }

  if (bodyScore < 25 && (recipe.iceTypeId === 'standard' || recipe.iceTypeId === 'extra')) {
    alerts.push({
      type: 'info',
      title: 'Low Viscosity Dilution Risk',
      message: 'Body score is light; drink may taste watery as regular ice displacement melts.'
    })
  }

  if (sweetnessScore >= 40 && sweetnessScore <= 72 && bodyScore >= 45 && aromaScore >= 45) {
    alerts.push({
      type: 'success',
      title: '✨ Harmonious Golden Balance',
      message: 'Optimal equilibrium between sweetness, roasted aromatics, and velvety mouthfeel.'
    })
  }

  // Overall Balance Score (0-100)
  const deviations = [
    Math.abs(sweetnessScore - 55),
    Math.abs(bodyScore - 60),
    Math.abs(aromaScore - 65)
  ]
  const avgDev = deviations.reduce((a, b) => a + b, 0) / deviations.length
  const balanceScore = Math.max(50, Math.min(98, Math.round(100 - (avgDev * 0.7))))

  return {
    sweetnessScore,
    acidityScore,
    bitternessScore,
    bodyScore,
    aromaScore,
    totalBrix,
    balanceScore,
    descriptors: uniqueDescriptors,
    alerts
  }
}
