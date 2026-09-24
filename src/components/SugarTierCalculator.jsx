import React, { useState } from 'react'
import { Sparkles, Flame, DollarSign, Droplets, CheckCircle2 } from 'lucide-react'
import { calculateSugarTiers } from '../utils/beverageCalculators'
import { triggerHaptic } from '../utils/haptics'

export function SugarTierCalculator({
  recipe,
  standardCogs = 45.00,
  isDarkMode = false
}) {
  const [selectedPct, setSelectedPct] = useState(100)
  const tiers = calculateSugarTiers(recipe, standardCogs)
  const currentTier = tiers.find(t => t.pct === selectedPct) || tiers[4]

  return (
    <div
      style={{
        background: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Droplets size={16} color="#38bdf8" />
          <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
            Customer Sweetness Tiers & Dosing
          </h4>
        </div>
        <span style={{ fontSize: '0.66rem', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
          Auto-Scaled
        </span>
      </div>

      {/* 5-Tier Selector Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {tiers.map(tier => {
          const isSelected = tier.pct === selectedPct
          return (
            <button
              key={tier.pct}
              onClick={() => {
                triggerHaptic('selection')
                setSelectedPct(tier.pct)
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 2px',
                borderRadius: '10px',
                border: isSelected ? '1.5px solid #0284c7' : (isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'),
                background: isSelected ? '#0284c7' : (isDarkMode ? '#0f172a' : '#f8fafc'),
                color: isSelected ? '#ffffff' : (isDarkMode ? '#94a3b8' : '#475569'),
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{tier.pct}%</span>
              <span style={{ fontSize: '0.58rem', fontWeight: 600, opacity: 0.9 }}>
                {tier.pumps} {Number(tier.pumps) === 1 ? 'pump' : 'pumps'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Selected Tier Metrics Card */}
      <div
        style={{
          background: isDarkMode ? '#0f172a' : '#f8fafc',
          borderRadius: '12px',
          padding: '10px 12px',
          border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          textAlign: 'center'
        }}
      >
        <div>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Syrup Vol</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
            {currentTier.syrupMl} ml
          </div>
          <div style={{ fontSize: '0.6rem', color: '#0284c7', fontWeight: 700 }}>
            {currentTier.pumps} pumps
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Calorie Delta</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: currentTier.calDelta <= 0 ? '#16a34a' : '#d97706', marginTop: '2px' }}>
            {currentTier.calDelta > 0 ? `+${currentTier.calDelta}` : currentTier.calDelta} kcal
          </div>
          <div style={{ fontSize: '0.6rem', color: '#64748b' }}>vs standard</div>
        </div>

        <div>
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Adjusted COGS</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
            ₱{currentTier.adjustedCogsPhp}
          </div>
          <div style={{ fontSize: '0.6rem', color: Number(currentTier.costDeltaPhp) < 0 ? '#16a34a' : '#64748b', fontWeight: 700 }}>
            {Number(currentTier.costDeltaPhp) < 0 ? `Saved ₱${Math.abs(Number(currentTier.costDeltaPhp)).toFixed(2)}` : 'Baseline'}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.68rem', color: isDarkMode ? '#94a3b8' : '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>💡 <strong>Barista Dosing SOP:</strong> {currentTier.desc} — dispense exact pump quantity before ice addition.</span>
      </div>
    </div>
  )
}
