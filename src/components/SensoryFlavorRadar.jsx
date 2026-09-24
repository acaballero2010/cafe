import React, { useState, useMemo } from 'react'
import { 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Activity, 
  Layers, 
  Coffee, 
  ChevronDown, 
  ChevronUp,
  BarChart2
} from 'lucide-react'
import { calculateSensoryProfile } from '../utils/sensoryEngine'

export function SensoryFlavorRadar({
  recipe = {},
  metrics = {}
}) {
  const [viewMode, setViewMode] = useState('radar') // 'radar' | 'bars'
  const [isExpanded, setIsExpanded] = useState(true)

  const sensory = useMemo(() => {
    return calculateSensoryProfile(recipe, metrics)
  }, [recipe, metrics])

  const {
    sweetnessScore,
    acidityScore,
    bitternessScore,
    bodyScore,
    aromaScore,
    totalBrix,
    balanceScore,
    descriptors,
    alerts
  } = sensory

  // 5 Radar Axes configuration
  const axes = [
    { key: 'sweetness', label: 'Sweetness', icon: '🍬', score: sweetnessScore, angle: -90, color: '#f59e0b' },
    { key: 'acidity', label: 'Acidity', icon: '🍋', score: acidityScore, angle: -18, color: '#eab308' },
    { key: 'bitterness', label: 'Bitterness', icon: '☕', score: bitternessScore, angle: 54, color: '#78350f' },
    { key: 'body', label: 'Body & Cream', icon: '🥛', score: bodyScore, angle: 126, color: '#0284c7' },
    { key: 'aroma', label: 'Aroma', icon: '🌸', score: aromaScore, angle: 198, color: '#ec4899' }
  ]

  // Radar SVG Math
  const size = 260
  const center = size / 2
  const maxRadius = 92

  const getCoordinates = (angleDeg, valueNormalized) => {
    const angleRad = (angleDeg * Math.PI) / 180
    const r = maxRadius * (valueNormalized / 100)
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad)
    }
  }

  // Polygon Points
  const polygonPoints = axes.map(axis => {
    const coords = getCoordinates(axis.angle, axis.score)
    return `${coords.x},${coords.y}`
  }).join(' ')

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '18px 20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* 1. Header with Sensory Balance Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Activity size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Sensory Flavor Radar & Balance
            </h2>
            <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
              Real-time 5-axis taste equilibrium and food-science diagnostics.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('radar')}
              style={{
                border: 'none',
                background: viewMode === 'radar' ? '#ffffff' : 'transparent',
                color: viewMode === 'radar' ? '#0f172a' : '#64748b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: viewMode === 'radar' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Radar
            </button>
            <button
              onClick={() => setViewMode('bars')}
              style={{
                border: 'none',
                background: viewMode === 'bars' ? '#ffffff' : 'transparent',
                color: viewMode === 'bars' ? '#0f172a' : '#64748b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: viewMode === 'bars' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Bars
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar (Brix, Balance Score) */}
      <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ESTIMATED BRIX</span>
          <div style={{ fontSize: '0.94rem', fontWeight: 900, color: totalBrix > 22 ? '#d97706' : '#0f172a', fontFamily: 'var(--font-mono)' }}>
            {totalBrix}°Bx
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>BALANCE SCORE</span>
          <div style={{ fontSize: '0.94rem', fontWeight: 900, color: balanceScore >= 80 ? '#059669' : '#d97706', fontFamily: 'var(--font-mono)' }}>
            {balanceScore}/100 {balanceScore >= 85 ? '✨ Harmonious' : 'Good'}
          </div>
        </div>

        <div style={{ flex: 1.2 }}>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SWEETNESS RATIO</span>
          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
            {sweetnessScore > 75 ? 'Intense' : sweetnessScore < 30 ? 'Subtle' : 'Balanced'} ({sweetnessScore}%)
          </div>
        </div>
      </div>

      {/* 3. Taste Notes Descriptor Pills */}
      <div>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
          Auto-Generated Taste Profile Descriptors:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {descriptors.map((desc, idx) => (
            <span
              key={idx}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} color="#d97706" />
              <span>{desc}</span>
            </span>
          ))}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 4. Interactive Radar Chart / Metric Bars */}
          {viewMode === 'radar' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', position: 'relative' }}>
              <svg width={size} height={size} style={{ overflow: 'visible' }}>
                {/* Background Concentric Grid Rings */}
                {[20, 40, 60, 80, 100].map(level => {
                  const ringCoords = axes.map(axis => {
                    const c = getCoordinates(axis.angle, level)
                    return `${c.x},${c.y}`
                  }).join(' ')
                  return (
                    <polygon
                      key={level}
                      points={ringCoords}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={level === 100 ? 'none' : '2,2'}
                    />
                  )
                })}

                {/* Radial Axis Spokes */}
                {axes.map(axis => {
                  const end = getCoordinates(axis.angle, 100)
                  return (
                    <line
                      key={axis.key}
                      x1={center}
                      y1={center}
                      x2={end.x}
                      y2={end.y}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  )
                })}

                {/* Shaded Sensory Profile Polygon */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(245, 158, 11, 0.28)"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Axis Vertex Nodes */}
                {axes.map(axis => {
                  const c = getCoordinates(axis.angle, axis.score)
                  return (
                    <g key={axis.key}>
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#d97706"
                        strokeWidth="2.5"
                      />
                    </g>
                  )
                })}

                {/* Axis Text Labels & Icons */}
                {axes.map(axis => {
                  const labelRadius = maxRadius + 24
                  const angleRad = (axis.angle * Math.PI) / 180
                  const lx = center + labelRadius * Math.cos(angleRad)
                  const ly = center + labelRadius * Math.sin(angleRad)

                  return (
                    <text
                      key={axis.key}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: '10px', fontWeight: '800', fill: '#0f172a', fontFamily: 'system-ui' }}
                    >
                      {axis.icon} {axis.label} ({axis.score}%)
                    </text>
                  )
                })}
              </svg>
            </div>
          ) : (
            /* Sensory Bars View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '6px 0' }}>
              {axes.map(axis => (
                <div key={axis.key} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>
                      {axis.icon} {axis.label}
                    </span>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      {axis.score}%
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${axis.score}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${axis.color}, #f59e0b)`,
                        borderRadius: '999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Food Science Imbalance & Optimization Alerts */}
          {alerts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              {alerts.map((alert, idx) => {
                const isWarning = alert.type === 'warning'
                const isSuccess = alert.type === 'success'

                return (
                  <div
                    key={idx}
                    style={{
                      background: isSuccess ? '#f0fdf4' : isWarning ? '#fffbeb' : '#f8fafc',
                      border: `1px solid ${isSuccess ? '#bbf7d0' : isWarning ? '#fde68a' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    {isSuccess ? (
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : isWarning ? (
                      <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <Info size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}

                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSuccess ? '#065f46' : isWarning ? '#92400e' : '#0369a1' }}>
                        {alert.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isSuccess ? '#047857' : isWarning ? '#78350f' : '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                        {alert.message}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
