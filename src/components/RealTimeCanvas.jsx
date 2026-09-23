import React, { useState } from 'react'
import { Sparkles, Camera, Eye, Download, Share2, Sun, Moon, Layers, CheckCircle2 } from 'lucide-react'

export function RealTimeCanvas({
  metrics,
  recipe,
  onOpenSopCard
}) {
  const [viewMode, setViewMode] = useState('live-cup')
  const [isGenerating, setIsGenerating] = useState(false)
  const [lightingTheme, setLightingTheme] = useState('daylight')

  const {
    vessel,
    ice,
    totalVesselVolumeMl,
    iceDisplacementMl,
    topOffVolumeMl,
    fixedLayersMl,
    isOverflowing,
    layersDetailed
  } = metrics

  const totalFilledLiquidMl = fixedLayersMl + topOffVolumeMl
  const totalVolumeFilledMl = totalFilledLiquidMl + iceDisplacementMl
  const fillPercentage = totalVesselVolumeMl > 0 ? Math.min(125, Math.round((totalVolumeFilledMl / totalVesselVolumeMl) * 100)) : 100

  // Calculate visual heights for the glass
  const cupBottomY = 275
  const totalPixelHeight = 210
  let currentY = cupBottomY
  const visualLayers = []

  layersDetailed.forEach((layer) => {
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

  const handleGenerateAi = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setViewMode('ai-render')
    }, 900)
  }

  return (
    <div className="card-clean" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '620px' }}>
      {/* 1. Canvas Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Step 2 • Real-Time Canvas
          </span>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px', lineHeight: 1.25 }}>
            {recipe.name || 'Untitled Drink'}
          </h2>
        </div>

        {/* View Switcher Pills */}
        <div className="pill-group" style={{ flexShrink: 0 }}>
          <button
            className={`pill-btn ${viewMode === 'live-cup' ? 'active' : ''}`}
            onClick={() => setViewMode('live-cup')}
          >
            <Layers size={13} />
            <span>Cup Build</span>
          </button>
          <button
            className={`pill-btn ${viewMode === 'ai-render' ? 'active' : ''}`}
            onClick={() => setViewMode('ai-render')}
          >
            <Sparkles size={13} color="#d97706" />
            <span>AI Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Center Stage (Enhanced Glassware & Crisp Ice Cubes) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: '410px',
          background:
            lightingTheme === 'daylight'
              ? 'radial-gradient(circle at 50% 35%, #ffffff 0%, #f3eee6 100%)'
              : 'radial-gradient(circle at 50% 35%, #382c24 0%, #171310 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {/* Soft Table Counter Surface */}
        <div
          style={{
            position: 'absolute',
            bottom: '38px',
            width: '210px',
            height: '28px',
            background: 'radial-gradient(ellipse at center, rgba(69, 26, 3, 0.22) 0%, rgba(69, 26, 3, 0.04) 55%, transparent 75%)',
            borderRadius: '50%'
          }}
        />

        {viewMode === 'live-cup' ? (
          /* High-Contrast SVG Glassware & Crystal Ice Stage */
          <div style={{ position: 'relative', width: '230px', height: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 200 320"
              style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.12))' }}
            >
              <defs>
                {/* Precise Cup Interior Clip */}
                <clipPath id="crispGlassClip">
                  {vessel.shape === 'coupe' ? (
                    <path d="M 30 110 C 30 190, 170 190, 170 110 Z" />
                  ) : (
                    <polygon points="40,65 160,65 142,275 58,275" />
                  )}
                </clipPath>

                {/* Crystal Ice Cube Shading & Specular Gradients */}
                <linearGradient id="crystalIceFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
                  <stop offset="40%" stopColor="rgba(224, 242, 254, 0.65)" />
                  <stop offset="100%" stopColor="rgba(186, 230, 253, 0.45)" />
                </linearGradient>

                <linearGradient id="glassReflectionGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="18%" stopColor="rgba(255,255,255,0.12)" />
                  <stop offset="75%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="96%" stopColor="rgba(255,255,255,0.45)" />
                </linearGradient>
              </defs>

              {/* Liquid Strata Stack (Clipped) */}
              <g clipPath="url(#crispGlassClip)">
                <rect x="0" y="0" width="200" height="320" fill="rgba(255,255,255,0.3)" />

                {visualLayers.map((l, i) => (
                  <rect
                    key={i}
                    x="25"
                    y={l.y}
                    width="150"
                    height={l.height + 2}
                    fill={l.color}
                    opacity={l.layerType === 'milk' ? 0.96 : 0.90}
                  />
                ))}

                {/* HIGH-CONTRAST VISIBLE CRYSTAL ICE CUBES */}
                {ice.displacementRatio > 0 && (
                  <g className="high-contrast-ice-cubes">
                    {/* Cube 1 (Top Left) */}
                    <g transform="rotate(12 80 120)">
                      <rect
                        x="68"
                        y="108"
                        width="30"
                        height="28"
                        rx="6"
                        fill="url(#crystalIceFill)"
                        stroke="#ffffff"
                        strokeWidth="2.2"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
                      />
                      {/* Internal Ice Refraction Lines */}
                      <path d="M72 114 L92 114" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="82" cy="124" r="2.5" fill="rgba(255,255,255,0.85)" />
                      <line x1="88" y1="120" x2="94" y2="130" stroke="rgba(14, 165, 233, 0.5)" strokeWidth="1.2" />
                    </g>

                    {/* Cube 2 (Top Right) */}
                    <g transform="rotate(-15 120 135)">
                      <rect
                        x="104"
                        y="122"
                        width="32"
                        height="30"
                        rx="6"
                        fill="url(#crystalIceFill)"
                        stroke="#ffffff"
                        strokeWidth="2.2"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
                      />
                      <path d="M109 128 L130 128" stroke="rgba(255,255,255,0.95)" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="122" cy="140" r="3" fill="rgba(255,255,255,0.85)" />
                    </g>

                    {/* Cube 3 (Mid Left) */}
                    {ice.displacementRatio > 0.25 && (
                      <g transform="rotate(8 80 168)">
                        <rect
                          x="66"
                          y="156"
                          width="30"
                          height="28"
                          rx="6"
                          fill="url(#crystalIceFill)"
                          stroke="#ffffff"
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                        />
                        <path d="M71 162 L88 162" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="75" y1="170" x2="85" y2="178" stroke="rgba(14, 165, 233, 0.45)" strokeWidth="1" />
                      </g>
                    )}

                    {/* Cube 4 (Mid Right for Regular/Extra Ice) */}
                    {ice.displacementRatio >= 0.35 && (
                      <g transform="rotate(-10 115 180)">
                        <rect
                          x="102"
                          y="168"
                          width="28"
                          height="26"
                          rx="5"
                          fill="url(#crystalIceFill)"
                          stroke="#ffffff"
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                        />
                        <circle cx="114" cy="180" r="2" fill="rgba(255,255,255,0.8)" />
                      </g>
                    )}
                  </g>
                )}

                {/* Glass Inner Sheen & Reflections */}
                <rect x="0" y="0" width="200" height="320" fill="url(#glassReflectionGlow)" pointerEvents="none" />
              </g>

              {/* Crisp Glass Outlines & Realistic Edges */}
              <polygon
                points="40,65 160,65 142,275 58,275"
                fill="none"
                stroke="#374151"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <ellipse
                cx="100"
                cy="65"
                rx="60"
                ry="8"
                fill="rgba(255,255,255,0.2)"
                stroke="#374151"
                strokeWidth="2.5"
              />
              <ellipse
                cx="100"
                cy="275"
                rx="42"
                ry="5"
                fill="none"
                stroke="#4b5563"
                strokeWidth="2"
              />

              {/* Exterior Vertical Light Glare */}
              <line x1="48" y1="75" x2="62" y2="265" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        ) : (
          /* 8K AI Studio View */
          <div style={{ position: 'relative', width: '270px', height: '350px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.18)', border: '2px solid rgba(255,255,255,0.9)' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 30%, #3e2723 0%, #1a120b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '150px',
                  height: '230px',
                  borderRadius: '12px 12px 22px 22px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  border: '2px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.3)'
                }}
              >
                {metrics.layersDetailed.map((layer, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: `${layer.heightPercent * 1.5}%`,
                      background: layer.colorHex,
                      position: 'relative'
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Sparkles size={12} color="#d97706" />
                <span>8K Commercial Render</span>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Lighting Switcher */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <button
            onClick={() => setLightingTheme(lightingTheme === 'daylight' ? 'moody' : 'daylight')}
            className="btn-clean btn-clean-secondary btn-clean-sm"
            style={{ fontSize: '0.72rem', padding: '5px 10px', background: '#ffffff' }}
          >
            {lightingTheme === 'daylight' ? <Sun size={13} color="#d97706" /> : <Moon size={13} color="#a855f7" />}
            <span>{lightingTheme === 'daylight' ? 'Warm Daylight' : 'Moody Bar'}</span>
          </button>
        </div>
      </div>

      {/* 3. Pastel Fill Level Meter */}
      <div style={{ background: '#f8f9fb', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Cup Fill Capacity ({totalVesselVolumeMl}ml • {vessel.volumeOz}oz)
          </span>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: fillPercentage > 100 ? '#e11d48' : '#059669', fontFamily: 'var(--font-mono)' }}>
            {fillPercentage}% Filled
          </span>
        </div>

        <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, fillPercentage)}%`,
              height: '100%',
              background: fillPercentage > 100 ? '#e11d48' : 'linear-gradient(90deg, #d97706, #059669)',
              transition: 'width 0.25s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>Ice Displacement: -{iceDisplacementMl}ml</span>
          <span>Liquid Top-Off: {topOffVolumeMl}ml</span>
        </div>
      </div>

      {/* 4. Prominent Action Button */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn-clean btn-clean-accent"
          onClick={handleGenerateAi}
          disabled={isGenerating}
          style={{ flex: 1, padding: '12px 20px', fontSize: '0.92rem', fontWeight: 700 }}
        >
          {isGenerating ? (
            <span>Generating 8K AI Visual...</span>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Generate AI Visual & SOP</span>
            </>
          )}
        </button>

        <button
          className="btn-clean btn-clean-secondary"
          onClick={onOpenSopCard}
          title="Quick Barista Build Card"
        >
          <span>SOP Card</span>
        </button>
      </div>
    </div>
  )
}
