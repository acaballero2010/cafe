import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Percent,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sliders,
  Check,
  Scale
} from 'lucide-react'
import {
  INGREDIENT_TIER_PRESETS,
  calculateRecipeTierComparison,
  applyIngredientTierToRecipe,
  calculateRecipeCostBounds,
  optimizeRecipeToTargetCost
} from '../utils/beverageCalculators'

export function IngredientTierSelectorCard({
  recipe,
  catalog = [],
  onUpdateRecipe = () => {},
  showToast = () => {}
}) {
  const [activeMode, setActiveMode] = useState('presets') // 'presets' | 'slider'
  const [showBrandBreakdown, setShowBrandBreakdown] = useState(false)
  
  const activeTierId = recipe.ingredientTier || 'signature'
  const basePrice = Number(recipe.price || recipe.menuPrice || 180)
  const tierComparisons = calculateRecipeTierComparison(recipe, catalog, basePrice)

  // Bounds for target cost slider
  const costBounds = useMemo(() => {
    return calculateRecipeCostBounds(recipe, catalog)
  }, [recipe, catalog])

  const [targetCostSlider, setTargetCostSlider] = useState(costBounds.currentCogs || 35.00)

  // Current dynamic optimization preview
  const optimizationPreview = useMemo(() => {
    return optimizeRecipeToTargetCost(recipe, targetCostSlider, catalog)
  }, [recipe, targetCostSlider, catalog])

  // Check if layers are mixed (hybrid)
  const layers = recipe.layers || []
  const layerTiers = layers.map(l => l.tier || 'signature').filter((v, i, a) => a.indexOf(v) === i)
  const isHybrid = layerTiers.length > 1 || activeTierId === 'hybrid'

  const handleSelectTier = (tierId) => {
    const updated = applyIngredientTierToRecipe(recipe, tierId, catalog)
    onUpdateRecipe(updated)

    const selectedPreset = INGREDIENT_TIER_PRESETS.find(t => t.id === tierId)
    if (showToast) {
      showToast(
        `Swapped to ${selectedPreset?.label || tierId}`,
        `Auto-calibrated layers to ${selectedPreset?.brandSummary || 'tier brands'}`,
        'success',
        2500
      )
    }
  }

  const handleApplyOptimizedSpec = () => {
    onUpdateRecipe(optimizationPreview.optimizedRecipe)
    if (showToast) {
      showToast(
        `Target Cost Spec Applied: ₱${optimizationPreview.actualCogs.toFixed(2)} COGS`,
        `Optimized brand blend across ${layers.length} layers for ₱${targetCostSlider.toFixed(2)} budget.`,
        'success',
        3000
      )
    }
  }

  const optProfit = basePrice - optimizationPreview.actualCogs
  const optMargin = basePrice > 0 ? ((optProfit / basePrice) * 100).toFixed(1) : 0

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '18px 20px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header & Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
              Ingredient Quality & Cost Intelligence
            </h3>
            {isHybrid && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#faf5ff',
                color: '#7e22ce',
                border: '1px solid #e9d5ff'
              }}>
                ✨ Custom Hybrid Blend
              </span>
            )}
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
            Switch presets or use the dynamic budget slider to auto-select brand ingredients matching your exact cost target.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'presets' ? '#ffffff' : 'transparent',
              color: activeMode === 'presets' ? '#0f172a' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: activeMode === 'presets' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeMode === 'presets' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            🏷️ 3 Tier Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('slider')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: activeMode === 'slider' ? '#ffffff' : 'transparent',
              color: activeMode === 'slider' ? '#0f172a' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: activeMode === 'slider' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeMode === 'slider' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sliders size={12} color="#0284c7" />
            <span>🎯 Target Cost Slider</span>
          </button>
        </div>
      </div>

      {/* MODE 1: PRESET TIERS */}
      {activeMode === 'presets' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowBrandBreakdown(!showBrandBreakdown)}
              style={{
                fontSize: '0.70rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#f8fafc',
                color: '#0284c7',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Info size={12} />
              <span>{showBrandBreakdown ? 'Hide Brand Guide' : 'Why COGS Varies?'}</span>
              {showBrandBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {/* Expandable Brand Comparison Guide */}
          {showBrandBreakdown && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 14px',
              fontSize: '0.74rem',
              color: '#334155'
            }}>
              <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                🏷️ Benchmark Brands by Pricing Tier:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontWeight: '800', color: '#0284c7', marginBottom: '4px' }}>⚡ Value / Commercial Bar</div>
                  <div style={{ color: '#64748b', fontSize: '0.70rem', lineHeight: '1.4' }}>
                    • <strong>Caramel / Vanilla:</strong> Top Creamery Syrup (₱0.16/ml)<br />
                    • <strong>Condensed:</strong> Angel / Liberty Creamer (₱0.10-0.12/ml)<br />
                    • <strong>Dairy:</strong> Metro Foodservice Fresh Milk (₱75/L)<br />
                    • <strong>Coffee:</strong> Bataan Robusta/Arabica Dark Blend (₱0.38/ml)
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontWeight: '800', color: '#059669', marginBottom: '4px' }}>⚖️ Signature / Craft Standard</div>
                  <div style={{ color: '#64748b', fontSize: '0.70rem', lineHeight: '1.4' }}>
                    • <strong>Caramel / Vanilla:</strong> Torani & Monin Gourmet (₱0.34-0.54/ml)<br />
                    • <strong>Condensed:</strong> Nestlé Carnation & Alaska Classic (₱0.15-0.17/ml)<br />
                    • <strong>Dairy:</strong> Magnolia Whole Milk / Oatside (₱95-160/L)<br />
                    • <strong>Coffee:</strong> Benguet / Mt. Apo Specialty Arabica (₱0.55/ml)
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontWeight: '800', color: '#9333ea', marginBottom: '4px' }}>👑 Artisanal / Reserve Luxury</div>
                  <div style={{ color: '#64748b', fontSize: '0.70rem', lineHeight: '1.4' }}>
                    • <strong>Caramel / Vanilla:</strong> 1883 Maison Routin France (₱0.77/ml)<br />
                    • <strong>Condensed:</strong> Nestlé Milkmaid Gold / Oatly Condensed (₱0.20-0.51/ml)<br />
                    • <strong>Dairy:</strong> Japanese Hokkaido Milk / Oatly Barista (₱210-230/L)<br />
                    • <strong>Coffee:</strong> Yardstick Ethiopia Guji Single-Origin (₱0.72/ml)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3 Tier Selector Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {tierComparisons.map((t) => {
              const isSelected = !isHybrid && activeTierId === t.tierId

              return (
                <div
                  key={t.tierId}
                  style={{
                    borderRadius: '16px',
                    border: isSelected ? `2px solid ${t.color}` : '1px solid #e2e8f0',
                    background: isSelected ? t.bg : '#ffffff',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? `0 4px 12px -2px ${t.color}25` : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    {/* Tier Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                        {t.label}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.64rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: t.color, color: '#ffffff' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.70rem', color: '#64748b', marginBottom: '8px' }}>
                      {t.tagline}
                    </div>

                    {/* Brand Stack Pill */}
                    <div style={{ background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '6px 8px', marginBottom: '10px', fontSize: '0.68rem', color: '#334155' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>🏷️ Brand Spec:</div>
                      <div style={{ color: '#475569', lineHeight: '1.3' }}>{t.brandSummary}</div>
                    </div>

                    {/* Financial Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px', borderRadius: '10px', background: isSelected ? '#ffffff' : '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.64rem', color: '#64748b', display: 'block' }}>Estimated COGS</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                          ₱{t.totalCogs.toFixed(2)}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.64rem', color: '#64748b', display: 'block' }}>Gross Margin</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '800', color: t.grossMarginPct >= 70 ? '#16a34a' : '#d97706', fontFamily: 'var(--font-mono)' }}>
                          {t.grossMarginPct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Select Action Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectTier(t.tierId)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: isSelected ? 'none' : `1px solid ${t.color}`,
                      background: isSelected ? t.color : '#ffffff',
                      color: isSelected ? '#ffffff' : t.color,
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Active Tier</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={12} />
                        <span>Auto-Select {t.tierId.charAt(0).toUpperCase() + t.tierId.slice(1)} SKUs</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* MODE 2: DYNAMIC TARGET COST SLIDER */}
      {activeMode === 'slider' && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Target Slider Controls */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                  Desired Recipe COGS Budget:
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                  ₱{Number(targetCostSlider).toFixed(2)}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Target Gross Margin: <strong style={{ color: optMargin >= 70 ? '#16a34a' : '#d97706' }}>{optMargin}%</strong>
                </span>
              </div>
            </div>

            <input
              type="range"
              min={costBounds.minCogs}
              max={costBounds.maxCogs}
              step="0.5"
              value={targetCostSlider}
              onChange={(e) => setTargetCostSlider(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#0284c7', height: '6px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
              <span>⚡ Min Possible: <strong>₱{costBounds.minCogs.toFixed(2)}</strong></span>
              <span>⚖️ Current Recipe: <strong>₱{costBounds.currentCogs.toFixed(2)}</strong></span>
              <span>👑 Max Artisanal: <strong>₱{costBounds.maxCogs.toFixed(2)}</strong></span>
            </div>
          </div>

          {/* Quick Preset Jump Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setTargetCostSlider(costBounds.minCogs)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              ⚡ Minimum COGS (₱{costBounds.minCogs.toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => {
                // 75% margin = basePrice * 0.25
                const sweetSpot = Math.max(costBounds.minCogs, Math.min(costBounds.maxCogs, Number((basePrice * 0.25).toFixed(2))))
                setTargetCostSlider(sweetSpot)
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #bbf7d0',
                background: '#f0fdf4',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#15803d',
                cursor: 'pointer'
              }}
            >
              🎯 75% Margin Sweet Spot (₱{(basePrice * 0.25).toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => setTargetCostSlider(costBounds.maxCogs)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #e9d5ff',
                background: '#faf5ff',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#7e22ce',
                cursor: 'pointer'
              }}
            >
              👑 Max Reserve (₱{costBounds.maxCogs.toFixed(2)})
            </button>
          </div>

          {/* Resulting Optimized Brand Mix Preview */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                Auto-Selected Brand Mix for ₱{Number(targetCostSlider).toFixed(2)} Target:
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                Exact Total COGS: ₱{optimizationPreview.actualCogs.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {optimizationPreview.optimizedRecipe.layers.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', padding: '4px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: l.colorHex || '#0284c7', color: '#ffffff', fontSize: '0.60rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </span>
                    <strong style={{ color: '#0f172a' }}>{l.name}</strong>
                    <span style={{ color: '#64748b' }}>({l.brand || l.supplier})</span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#334155', fontFamily: 'var(--font-mono)' }}>
                    ₱{((l.unitCostPerMl || 0.15) * (l.volumeMl || 30)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApplyOptimizedSpec}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                fontSize: '0.80rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Sparkles size={14} />
              <span>Apply This ₱{optimizationPreview.actualCogs.toFixed(2)} Brand Spec to Recipe</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
