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
  Info
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
  const activeTierId = recipe.ingredientTier || 'signature'
  const basePrice = Number(recipe.price || recipe.menuPrice || 180)
  const tierComparisons = calculateRecipeTierComparison(recipe, catalog, basePrice)

  const handleSelectTier = (tierId) => {
    if (tierId === activeTierId) return
    const updated = applyIngredientTierToRecipe(recipe, tierId, catalog)
    onUpdateRecipe(updated)

    const selectedPreset = INGREDIENT_TIER_PRESETS.find(t => t.id === tierId)
    if (showToast) {
      showToast(
        `Swapped to ${selectedPreset?.label || tierId}`,
        `All recipe layers auto-calibrated to ${selectedPreset?.tagline || 'tier'}`,
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
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: '#0f172a' }}>
              Intelligent Quality & Ingredient Tier Presets
            </h3>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.74rem', color: '#64748b' }}>
            Auto-selects and re-costs all recipe layers across commercial economy, craft cafe standard, or single-origin luxury tiers.
          </p>
        </div>

        <span style={{
          fontSize: '0.68rem',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '999px',
          background: '#f1f5f9',
          color: '#475569',
          border: '1px solid #e2e8f0'
        }}>
          1-Tap Recipe Restock
        </span>
      </div>

      {/* 3-Tier Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '10px'
      }}>
        {tierComparisons.map((tier) => {
          const isSelected = tier.tierId === activeTierId

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
                  <CheckCircle2 size={10} /> ACTIVE RECIPE
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.90rem', color: isSelected ? '#0f172a' : '#334155' }}>
                    {tier.label}
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
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

                <p style={{ margin: '0 0 10px 0', fontSize: '0.70rem', color: '#64748b', lineHeight: '1.3' }}>
                  {tier.desc}
                </p>

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
    </div>
  )
}
