import React, { useState } from 'react'
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
  HelpCircle
} from 'lucide-react'
import {
  INGREDIENT_TIER_PRESETS,
  calculateRecipeTierComparison,
  applyIngredientTierToRecipe
} from '../utils/beverageCalculators'

export function IngredientTierSelectorCard({
  recipe,
  catalog = [],
  onUpdateRecipe = () => {},
  showToast = () => {}
}) {
  const [showBrandBreakdown, setShowBrandBreakdown] = useState(false)
  const activeTierId = recipe.ingredientTier || 'signature'
  const basePrice = Number(recipe.price || recipe.menuPrice || 180)
  const tierComparisons = calculateRecipeTierComparison(recipe, catalog, basePrice)

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
              Intelligent Quality & Brand Tier Presets
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
            Auto-swaps all recipe layers to matching commercial, specialty craft, or single-origin brand SKUs with live COGS differences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBrandBreakdown(!showBrandBreakdown)}
          style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '8px',
            background: '#f8fafc',
            color: '#0284c7',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Info size={13} />
          <span>{showBrandBreakdown ? 'Hide Brand Guide' : 'Why COGS Varies?'}</span>
          {showBrandBreakdown ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expandable Brand Comparison Guide */}
      {showBrandBreakdown && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '14px',
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
                • <strong>Dairy:</strong> Metro Foodservice Fresh Milk (₱75/L)<br />
                • <strong>Coffee:</strong> Bataan Robusta/Arabica Dark Blend (₱0.38/ml)<br />
                • <strong>Matcha:</strong> Culinary Grade Green Tea (₱0.18/ml)
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontWeight: '800', color: '#059669', marginBottom: '4px' }}>⚖️ Signature / Craft Standard</div>
              <div style={{ color: '#64748b', fontSize: '0.70rem', lineHeight: '1.4' }}>
                • <strong>Caramel / Vanilla:</strong> Torani & Monin Gourmet (₱0.34-0.54/ml)<br />
                • <strong>Dairy:</strong> Magnolia Whole Milk / Oatside (₱95-160/L)<br />
                • <strong>Coffee:</strong> Benguet / Mt. Apo Specialty Arabica (₱0.55/ml)<br />
                • <strong>Matcha:</strong> Kyoto Ceremonial Grade Blend (₱0.32/ml)
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontWeight: '800', color: '#9333ea', marginBottom: '4px' }}>👑 Artisanal / Reserve Luxury</div>
              <div style={{ color: '#64748b', fontSize: '0.70rem', lineHeight: '1.4' }}>
                • <strong>Caramel / Vanilla:</strong> 1883 Maison Routin France (₱0.77/ml)<br />
                • <strong>Dairy:</strong> Oatly Barista / Hokkaido Farm Milk (₱210-230/L)<br />
                • <strong>Coffee:</strong> Ethiopia Guji Heirloom Single-Origin (₱0.725/ml)<br />
                • <strong>Matcha:</strong> Uji First-Harvest Ceremonial Grade (₱0.48/ml)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Tier Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '10px'
      }}>
        {tierComparisons.map((tier) => {
          const isSelected = !isHybrid && tier.tierId === activeTierId

          return (
            <div
              key={tier.tierId}
              onClick={() => handleSelectTier(tier.tierId)}
              style={{
                borderRadius: '14px',
                border: isSelected ? `2px solid ${tier.color}` : '1px solid #e2e8f0',
                background: isSelected ? tier.bg : '#ffffff',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.18s ease',
                boxShadow: isSelected ? `0 4px 12px ${tier.color}18` : 'none',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-9px',
                  right: '12px',
                  background: tier.color,
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <CheckCircle2 size={10} /> ACTIVE TIER
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.92rem', color: isSelected ? '#0f172a' : '#334155' }}>
                    {tier.label}
                  </span>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    color: tier.color,
                    border: `1px solid ${tier.border}`
                  }}>
                    {tier.tagline.split(' & ')[0]}
                  </span>
                </div>

                {/* Prominent Brand Summary Pill */}
                <div style={{
                  fontSize: '0.68rem',
                  color: '#475569',
                  background: isSelected ? 'rgba(255,255,255,0.7)' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  🏷️ {tier.brandSummary}
                </div>

                {/* Financial Metrics */}
                <div style={{
                  background: isSelected ? '#ffffff' : '#f8fafc',
                  borderRadius: '10px',
                  padding: '10px',
                  border: isSelected ? `1px solid ${tier.border}` : '1px solid #f1f5f9',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                    <span style={{ color: '#64748b' }}>Estimated COGS:</span>
                    <span style={{ fontWeight: '800', color: '#dc2626' }}>₱{tier.totalCogs.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
                    <span style={{ color: '#64748b' }}>Gross Margin:</span>
                    <span style={{ fontWeight: '800', color: tier.grossMarginPct >= 75 ? '#059669' : '#b45309' }}>
                      {tier.grossMarginPct}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Net Profit:</span>
                    <span style={{ fontWeight: '800', color: '#2563eb' }}>+₱{tier.grossProfit.toFixed(2)} / pour</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectTier(tier.tierId)
                }}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? tier.color : '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 size={13} /> Active Tier
                  </>
                ) : (
                  <>
                    <RefreshCw size={12} /> Auto-Select {tier.label.split(' ')[1]} SKUs
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Hybrid Note */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '10px',
        padding: '8px 12px',
        fontSize: '0.72rem',
        color: '#92400e',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Sparkles size={14} color="#d97706" style={{ flexShrink: 0 }} />
        <span>
          <strong>Custom Hybrid Flexibility:</strong> You can mix different brands (e.g. 1883 Vanilla + Oatside Milk + Benguet Arabica) and adjust custom portion ml for each layer anytime using the <strong>Swap SKU</strong> button below.
        </span>
      </div>
    </div>
  )
}
