import React, { useState } from 'react'
import { Droplet, Sparkles, AlertTriangle, Eye, Layers, Maximize2 } from 'lucide-react'

export function DrinkVisualizer({
  metrics,
  recipe,
  onEditLayer
}) {
  const [showLabels, setShowLabels] = useState(true)
  const [showCondensation, setShowCondensation] = useState(true)

  const {
    vessel,
    ice,
    totalVesselVolumeMl,
    iceDisplacementMl,
    availableLiquidCapacityMl,
    fixedLayersMl,
    topOffVolumeMl,
    isOverflowing,
    overflowAmountMl,
    layersDetailed
  } = metrics

  const totalFilledLiquidMl = fixedLayersMl + topOffVolumeMl
  const totalVolumeFilledMl = totalFilledLiquidMl + iceDisplacementMl
  const fillPercentage = totalVesselVolumeMl > 0 ? Math.min(130, Math.round((totalVolumeFilledMl / totalVesselVolumeMl) * 100)) : 100

  // Calculate layer heights in % of total vessel height (up to max liquid line ~88%)
  const maxUsableHeight = 84 // max visual percentage inside the cup
  const iceHeightPct = (iceDisplacementMl / totalVesselVolumeMl) * maxUsableHeight

  // Generate ice cubes based on ice type
  const renderIceCubes = () => {
    if (ice.displacementRatio === 0) return null

    if (ice.id === 'craft_cube') {
      return (
        <g className="craft-ice-cube" opacity="0.85">
          <rect
            x="65"
            y="120"
            width="70"
            height="70"
            rx="8"
            fill="rgba(255, 255, 255, 0.35)"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="1.5"
          />
          <path d="M72 128 L125 128" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="85" cy="150" r="3" fill="rgba(255,255,255,0.6)" />
          <circle cx="115" cy="165" r="2" fill="rgba(255,255,255,0.5)" />
        </g>
      )
    }

    const cubeCount = ice.displacementRatio > 0.4 ? 7 : ice.displacementRatio > 0.25 ? 5 : 3
    const cubes = [
      { x: 70, y: 110, w: 26, h: 24, r: 12 },
      { x: 104, y: 125, w: 28, h: 26, r: -15 },
      { x: 62, y: 155, w: 26, h: 25, r: 8 },
      { x: 108, y: 170, w: 25, h: 24, r: -10 },
      { x: 80, y: 195, w: 30, h: 28, r: 18 },
      { x: 60, y: 220, w: 28, h: 24, r: -8 },
      { x: 105, y: 215, w: 27, h: 25, r: 14 }
    ].slice(0, cubeCount)

    return (
      <g className="ice-cubes-group" opacity="0.8">
        {cubes.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            rx="5"
            transform={`rotate(${c.r} ${c.x + c.w/2} ${c.y + c.h/2})`}
            fill="rgba(255, 255, 255, 0.32)"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="1.2"
          />
        ))}
      </g>
    )
  }

  // Render Boba Pearls at the base if recipe has boba
  const hasBoba = layersDetailed.some(l => l.layerType === 'bottom_boba' || l.ingredientId?.includes('boba'))
  const renderBobaPearls = () => {
    if (!hasBoba) return null
    const pearls = [
      { cx: 62, cy: 268, r: 8 }, { cx: 78, cy: 270, r: 8.5 }, { cx: 95, cy: 269, r: 8 },
      { cx: 112, cy: 271, r: 8.5 }, { cx: 128, cy: 267, r: 8 }, { cx: 140, cy: 268, r: 7.5 },
      { cx: 70, cy: 254, r: 8 }, { cx: 86, cy: 253, r: 8.5 }, { cx: 103, cy: 255, r: 8 },
      { cx: 120, cy: 253, r: 8.5 }, { cx: 134, cy: 255, r: 7.5 }, { cx: 78, cy: 240, r: 8 },
      { cx: 96, cy: 239, r: 8.5 }, { cx: 114, cy: 241, r: 8 }
    ]

    return (
      <g className="boba-pearls-group">
        {pearls.map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={p.r} fill="#140802" />
            <circle cx={p.cx - 2} cy={p.cy - 2} r={p.r * 0.35} fill="rgba(255,255,255,0.4)" />
          </g>
        ))}
      </g>
    )
  }

  // Calculate visual stack of layers from bottom to top
  // SVG viewBox is 0 0 200 320
  // Cup liquid interior runs roughly from Y = 280 (bottom) to Y = 60 (top rim) -> Total liquid height = 220px
  const cupBottomY = 280
  const cupTopY = 60
  const totalPixelHeight = 220

  let currentY = cupBottomY
  const visualLayers = []

  // Sum calculated volumes
  const totalVolumeInCupMl = layersDetailed.reduce((acc, l) => acc + l.calculatedVolumeMl, 0)

  layersDetailed.forEach((layer, idx) => {
    const layerVolume = layer.calculatedVolumeMl || 0
    if (layerVolume <= 0) return

    const layerHeightPx = totalVesselVolumeMl > 0 ? (layerVolume / totalVesselVolumeMl) * totalPixelHeight : 0
    const startY = currentY - layerHeightPx

    visualLayers.push({
      ...layer,
      y: startY,
      height: layerHeightPx,
      color: layer.colorHex || '#d97706',
      name: layer.name,
      volumeMl: layerVolume,
      isTopOff: layer.isTopOff
    })

    currentY = startY
  })

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              Live Displacement Visualizer
            </h3>
            <span className={`badge ${fillPercentage > 100 ? 'badge-danger' : fillPercentage > 92 ? 'badge-success' : 'badge-warning'}`}>
              {fillPercentage}% Cup Fill
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {vessel.name} • {ice.name}
          </p>
        </div>

        {/* View toggles */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn btn-secondary btn-sm ${showLabels ? 'active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle Layer Labels"
          >
            <Layers size={13} />
          </button>
          <button
            className={`btn btn-secondary btn-sm ${showCondensation ? 'active' : ''}`}
            onClick={() => setShowCondensation(!showCondensation)}
            title="Toggle Condensation & Ice"
          >
            <Droplet size={13} />
          </button>
        </div>
      </div>

      {/* Overflow Alert Banner if needed */}
      {isOverflowing && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <AlertTriangle size={18} color="#fb7185" />
          <div style={{ fontSize: '0.76rem', color: '#fecdd3' }}>
            <strong>Liquid Overflow Alert:</strong> Recipe exceeds cup capacity by{' '}
            <span style={{ fontWeight: 700, color: '#ffffff' }}>+{overflowAmountMl} ml</span> with current ice level.
            Reduce ice or decrease base volume.
          </div>
        </div>
      )}

      {/* SVG Canvas Vessel Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          background: 'radial-gradient(circle at 50% 40%, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Backlight Glow */}
        <div
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: visualLayers.length > 0 ? visualLayers[0].color : '#f59e0b',
            filter: 'blur(70px)',
            opacity: 0.25,
            pointerEvents: 'none'
          }}
        />

        <svg
          viewBox="0 0 200 320"
          style={{ width: '220px', height: '350px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}
        >
          <defs>
            {/* Cup Clip Path - Tapered Tumbler */}
            <clipPath id="cupInteriorClip">
              {vessel.shape === 'coupe' ? (
                <path d="M 30 110 C 30 190, 170 190, 170 110 Z" />
              ) : vessel.shape === 'gibraltar' ? (
                <polygon points="45,80 155,80 140,275 60,275" />
              ) : (
                <polygon points="40,65 160,65 142,280 58,280" />
              )}
            </clipPath>

            {/* Glass Highlights Gradient */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="95%" stopColor="rgba(255,255,255,0.25)" />
            </linearGradient>

            {/* Crema / Foam texture */}
            <linearGradient id="foamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(245,235,220,0.85)" />
            </linearGradient>
          </defs>

          {/* Liquid Layers Group (Clipped to cup interior) */}
          <g clipPath="url(#cupInteriorClip)">
            {/* Background Liquid Void */}
            <rect x="0" y="0" width="200" height="320" fill="rgba(15, 23, 42, 0.3)" />

            {/* Render Layers */}
            {visualLayers.map((l, i) => (
              <g key={i}>
                <rect
                  x="30"
                  y={l.y}
                  width="140"
                  height={l.height + 2} // +2 overlap to avoid subpixel lines
                  fill={l.color}
                  opacity={l.layerType === 'milk' ? 0.95 : 0.88}
                />
                {/* Surface meniscus line */}
                <line
                  x1="35"
                  y1={l.y}
                  x2="165"
                  y2={l.y}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                />
              </g>
            ))}

            {/* Boba Pearls if any */}
            {renderBobaPearls()}

            {/* Floating Ice Cubes */}
            {showCondensation && renderIceCubes()}

            {/* Glass Interior Surface Reflections */}
            <rect x="0" y="0" width="200" height="320" fill="url(#glassReflection)" pointerEvents="none" />
          </g>

          {/* Glass Contour & Outline */}
          {vessel.shape === 'coupe' ? (
            <g>
              {/* Coupe Bowl */}
              <path
                d="M 30 110 C 30 190, 170 190, 170 110"
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2.5"
              />
              {/* Stem */}
              <line x1="100" y1="175" x2="100" y2="270" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" />
              {/* Base */}
              <ellipse cx="100" cy="272" rx="42" ry="7" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2.5" />
            </g>
          ) : (
            <g>
              {/* Tumbler Body Outline */}
              <polygon
                points="40,65 160,65 142,280 58,280"
                fill="none"
                stroke="rgba(255, 255, 255, 0.55)"
                strokeWidth="2.5"
              />
              {/* Top Rim Oval */}
              <ellipse
                cx="100"
                cy="65"
                rx="60"
                ry="8"
                fill="none"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth="2.5"
              />
              {/* Base Oval */}
              <ellipse
                cx="100"
                cy="280"
                rx="42"
                ry="5"
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Condensation Droplets */}
          {showCondensation && (
            <g opacity="0.6">
              <circle cx="52" cy="140" r="1.5" fill="#ffffff" />
              <circle cx="54" cy="180" r="2.2" fill="#ffffff" />
              <path d="M 54 182 Q 54 195 55 205" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" fill="none" />
              <circle cx="145" cy="150" r="2" fill="#ffffff" />
              <circle cx="143" cy="220" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Straw if Boba or Cold Cup */}
          {recipe.venue !== 'cocktail' && (
            <path
              d="M 115 25 L 90 270"
              stroke={recipe.venue === 'boba' ? 'rgba(217, 119, 6, 0.85)' : 'rgba(16, 185, 129, 0.8)'}
              strokeWidth={recipe.venue === 'boba' ? '12' : '6'}
              strokeLinecap="round"
              opacity="0.8"
            />
          )}
        </svg>

        {/* Dynamic Floating Layer Callouts */}
        {showLabels && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '16px',
              bottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              pointerEvents: 'none'
            }}
          >
            {visualLayers.slice().reverse().map((l, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(13, 19, 29, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${l.color}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  fontSize: '0.68rem'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{l.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                    {l.calculatedVolumeMl} ml ({l.calculatedVolumeOz} oz) {l.isTopOff && '• [Auto Top-Off]'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Displacement Summary Pill */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.74rem'
        }}
      >
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Vessel Capacity</div>
          <div style={{ fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {totalVesselVolumeMl} ml ({vessel.volumeOz} oz)
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Ice Displacement</div>
          <div style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            -{iceDisplacementMl} ml ({ice.displacementRatio * 100}%)
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)' }}>Required Top-Off</div>
          <div style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            {topOffVolumeMl} ml (Liquid)
          </div>
        </div>
      </div>
    </div>
  )
}
