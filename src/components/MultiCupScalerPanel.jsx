import React, { useState } from 'react'
import {
  Maximize2,
  Minimize2,
  DollarSign,
  Coffee,
  Layers,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Percent,
  Sliders,
  Package
} from 'lucide-react'
import { calculateMultiCupScaling, CUP_SIZES } from '../utils/beverageCalculators'

export function MultiCupScalerPanel({
  recipe,
  onApplyScaledRecipe = () => {},
  targetMarginPct = 75
}) {
  const [activeBaseCup, setActiveBaseCup] = useState('16oz')
  const [selectedMargin, setSelectedMargin] = useState(targetMarginPct)
  const [appliedCupId, setAppliedCupId] = useState(null)

  const scaledCups = calculateMultiCupScaling(recipe, activeBaseCup, selectedMargin)

  const handleApplySize = (cup) => {
    setAppliedCupId(cup.cupId)
    // Create new recipe object with scaled layers and updated menu price
    const mappedVessel = cup.cupId === '12oz' 
      ? 'hot-12oz' 
      : cup.cupId === '22oz' 
        ? 'boba-20oz' 
        : cup.cupId === '1000ml' 
          ? 'boba-24oz' 
          : 'cold-16oz'

    const scaledRecipe = {
      ...recipe,
      vesselId: mappedVessel,
      targetVolumeMl: cup.volumeMl,
      menuPrice: cup.actualPrice || cup.suggestedPrice || 180,
      price: cup.actualPrice || cup.suggestedPrice || 180,
      srp: cup.suggestedPrice,
      layers: cup.layers.map(l => ({
        ...l,
        volumeMl: l.volumeMl
      }))
    }
    onApplyScaledRecipe(scaledRecipe, cup)
    setTimeout(() => setAppliedCupId(null), 1500)
  }

  return (
    <div className="multi-cup-scaler-panel" style={{
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid var(--border-color, #e2e8f0)',
      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)'
    }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📐</span>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary, #0f172a)' }}>
              Multi-Cup Sizing & Proportional Cost Matrix
            </h3>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0'
            }}>
              Auto-Balanced
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
            Automatically scales espresso shots, syrup pumps, dairy displacement, and packaging COGS across standard cafe cup formats.
          </p>
        </div>

        {/* Target Margin Dial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-subtle, #f8fafc)', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <Percent size={14} color="#64748b" />
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Target Margin:</span>
          <select
            value={selectedMargin}
            onChange={(e) => setSelectedMargin(Number(e.target.value))}
            style={{
              fontWeight: '700',
              fontSize: '0.82rem',
              border: 'none',
              background: 'transparent',
              color: '#0284c7',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value={65}>65% (High Volume)</option>
            <option value={70}>70% (Balanced)</option>
            <option value={75}>75% (Target Standard)</option>
            <option value={80}>80% (Premium Signature)</option>
            <option value={85}>85% (Ultra High Margin)</option>
          </select>
        </div>
      </div>

      {/* Grid of Cups */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {scaledCups.map((cup) => {
          const isBase = cup.isBase
          const isApplied = appliedCupId === cup.cupId

          return (
            <div
              key={cup.cupId}
              style={{
                borderRadius: '14px',
                border: isBase ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                background: isBase ? 'rgba(59, 130, 246, 0.03)' : '#ffffff',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: isBase ? '0 4px 12px rgba(59,130,246,0.1)' : 'none'
              }}
            >
              {isBase && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '12px',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  letterSpacing: '0.5px'
                }}>
                  CURRENT RECIPE
                </span>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b' }}>{cup.label}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>{cup.volumeMl} ml</span>
                </div>

                {/* Metrics Breakdown */}
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Liquid COGS:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>₱{cup.totalLiquidCost.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Packaging & Ice:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>₱{(cup.packagingCost + 1.50).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingTop: '4px', borderTop: '1px dashed #cbd5e1', fontWeight: '700' }}>
                    <span style={{ color: '#0f172a' }}>Total Prime COGS:</span>
                    <span style={{ color: '#dc2626' }}>₱{cup.totalCogs.toFixed(2)}</span>
                  </div>
                </div>

                {/* Price & Margin Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: '600' }}>SUGGESTED SRP</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#15803d' }}>₱{cup.suggestedPrice}</div>
                  </div>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#1e40af', fontWeight: '600' }}>GROSS MARGIN</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#2563eb' }}>{cup.marginPct}%</div>
                  </div>
                </div>

                {/* Ingredient Spec Summary */}
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {cup.layers.slice(0, 3).map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>• {l.name}</span>
                      <span style={{ fontWeight: '600', color: '#334155' }}>{l.volumeMl}ml</span>
                    </div>
                  ))}
                  {cup.layers.length > 3 && (
                    <span style={{ fontSize: '0.68rem', fontStyle: 'italic', color: '#94a3b8' }}>+{cup.layers.length - 3} other layers...</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleApplySize(cup)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isApplied ? '#10b981' : isBase ? '#3b82f6' : '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 size={14} /> Applied to Studio!
                  </>
                ) : (
                  <>
                    <Sliders size={14} /> Load Size in Studio
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.76rem',
        color: '#92400e',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Sparkles size={16} color="#d97706" style={{ flexShrink: 0 }} />
        <span>
          <strong>Pro-Barista Calibration:</strong> Espresso extractions are automatically quantised into full/half-shot intervals (18g dry dose standard) while syrup pumps align to 10ml barista dosing standards.
        </span>
      </div>
    </div>
  )
}
