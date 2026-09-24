import React, { useState } from 'react'
import { PieChart, DollarSign, TrendingUp, Sparkles, ArrowRight, Layers, AlertCircle } from 'lucide-react'

export function CostBreakdownRing({
  recipe = {},
  metrics = {},
  onOpenSupplierPicker = () => {}
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [])

  const packagingCost = recipe.packagingItems?.reduce((sum, p) => sum + (p.unitCost || 0), 0) || 8.50
  const menuPrice = recipe.menuPrice || 185.00

  // Calculate items and costs
  const layerItems = layers.map((layer, idx) => {
    const vol = Number(layer.calculatedVolumeMl || layer.volumeMl || 30)
    const cost = vol * (Number(layer.unitCostPerMl) || 0.25)
    return {
      id: layer.id || `layer-${idx}`,
      name: layer.name,
      cost: cost,
      colorHex: layer.colorHex || '#f59e0b',
      type: 'ingredient',
      index: idx
    }
  })

  // Add packaging item
  const allCostItems = [
    ...layerItems,
    {
      id: 'packaging',
      name: 'Cup & Packaging (Lid, Straw, Sleeve)',
      cost: packagingCost,
      colorHex: '#64748b',
      type: 'packaging'
    }
  ]

  const totalCogs = allCostItems.reduce((sum, item) => sum + item.cost, 0) || 45.00
  const grossMargin = (((menuPrice - totalCogs) / menuPrice) * 100).toFixed(1)

  // Find top cost driver
  const sortedByCost = [...allCostItems].sort((a, b) => b.cost - a.cost)
  const topCostDriver = sortedByCost[0]
  const topCostPct = topCostDriver ? ((topCostDriver.cost / totalCogs) * 100).toFixed(0) : 0

  // Calculate SVG Pie Segments
  let cumulativeAngle = 0
  const radius = 60
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const segments = allCostItems.map((item, idx) => {
    const percentage = totalCogs > 0 ? item.cost / totalCogs : 0
    const strokeDasharray = `${percentage * circumference} ${circumference}`
    const strokeDashoffset = -cumulativeAngle * circumference
    cumulativeAngle += percentage

    return {
      ...item,
      percentage: (percentage * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset,
      isHovered: hoveredIdx === idx
    }
  })

  return (
    <div
      style={{
        background: 'var(--bg-card, #ffffff)',
        borderRadius: '20px',
        padding: '16px 18px',
        border: '1px solid var(--border-light, #e2e8f0)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
          <PieChart size={14} color="#059669" />
          <span>Ingredient Cost Distribution</span>
        </label>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '2px 8px', borderRadius: '999px' }}>
          {grossMargin}% Margin
        </span>
      </div>

      {/* Ring Chart & Center Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', padding: '6px 0' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="140" height="140" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((seg, idx) => (
              <circle
                key={seg.id}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.colorHex}
                strokeWidth={seg.isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  opacity: hoveredIdx === null || seg.isHovered ? 1 : 0.4
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Center Info Hole */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.60rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              {hoveredIdx !== null ? segments[hoveredIdx].name.split(' ')[0] : 'TOTAL COGS'}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono, monospace)' }}>
              ₱{hoveredIdx !== null ? segments[hoveredIdx].cost.toFixed(2) : totalCogs.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669' }}>
              {hoveredIdx !== null ? `${segments[hoveredIdx].percentage}%` : `${grossMargin}% GM`}
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
          {segments.map((seg, idx) => (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 6px',
                borderRadius: '8px',
                background: seg.isHovered ? 'rgba(0,0,0,0.04)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.colorHex, flexShrink: 0 }} />
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {seg.name.split('(')[0].trim()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono, monospace)' }}>
                  ₱{seg.cost.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.60rem', color: '#94a3b8' }}>
                  ({seg.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cost Driver Insight & Quick Swap Action */}
      {topCostDriver && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#059669" />
            <div style={{ fontSize: '0.70rem', color: '#166534' }}>
              <strong>{topCostDriver.name.split('(')[0].trim()}</strong> is your highest cost driver ({topCostPct}% of cup cost).
            </div>
          </div>

          <button
            onClick={() => onOpenSupplierPicker(topCostDriver.index || 0)}
            style={{
              background: '#059669',
              border: 'none',
              color: '#ffffff',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.66rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
            }}
          >
            <span>Swap & Save ₱</span>
            <ArrowRight size={10} />
          </button>
        </div>
      )}
    </div>
  )
}
