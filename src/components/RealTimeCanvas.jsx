import React, { useState } from 'react'
import { Sparkles, Camera, Eye, Download, Share2, Sun, Moon, Layers, CheckCircle2 } from 'lucide-react'

export function RealTimeCanvas({
  metrics,
  recipe,
  onOpenSopCard
}) {
  const [viewMode, setViewMode] = useState('live-cup') // 'live-cup' | 'ai-render'
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSuccess, setGeneratedSuccess] = useState(false)
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

  // Calculate visual heights
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
      setGeneratedSuccess(true)
      setViewMode('ai-render')
    }, 1000)
  }

  return (
    <div className="card-clean" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '620px' }}>
      {/* 1. Canvas Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Step 2 • Real-Time Canvas
          </span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            {recipe.name || 'Untitled Drink'}
          </h2>
        </div>

        {/* View Switcher Pills */}
        <div className="pill-group">
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
            <span>AI Studio Look</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Center Stage (Warm Clean Studio Backdrop) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          minHeight: '400px',
          background:
            lightingTheme === 'daylight'
              ? 'linear-gradient(180deg, #fdfbf7 0%, #f4efe6 100%)'
              : 'linear-gradient(180deg, #2d2621 0%, #171311 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Soft Ambient Shadow Base */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            width: '180px',
            height: '24px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />

        {viewMode === 'live-cup' ? (
          /* Realistic SVG Beverage Cup Stage */
          <div style={{ position: 'relative', width: '220px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 200 320"
              style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))' }}
            >
              <defs>
                <clipPath id="cleanCupClip">
                  {vessel.shape === 'coupe' ? (
                    <path d="M 30 110 C 30 190, 170 190, 170 110 Z" />
                  ) : (
                    <polygon points="40,65 160,65 142,275 58,275" />
                  )}
                </clipPath>

                {/* Smooth Gradient Highlights */}
                <linearGradient id="cleanGlassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.05)" />
                  <stop offset="80%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </linearGradient>
              </defs>

              {/* Liquid Strata Stack */}
              <g clipPath="url(#cleanCupClip)">
                <rect x="0" y="0" width="200" height="320" fill="rgba(255,255,255,0.2)" />
                {visualLayers.map((l, i) => (
                  <rect
                    key={i}
                    x="30"
                    y={l.y}
                    width="140"
                    height={l.height + 2}
                    fill={l.color}
                    opacity={l.layerType === 'milk' ? 0.95 : 0.88}
                  />
                ))}

                {/* Floating Ice Cubes */}
                {ice.displacementRatio > 0 && (
                  <g opacity="0.75">
                    <rect x="70" y="110" width="26" height="24" rx="5" transform="rotate(12 83 122)" fill="rgba(255,255,255,0.38)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
                    <rect x="105" y="125" width="28" height="26" rx="5" transform="rotate(-15 119 138)" fill="rgba(255,255,255,0.38)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
                    {ice.displacementRatio > 0.25 && (
                      <rect x="68" y="160" width="26" height="25" rx="5" transform="rotate(8 81 172)" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
                    )}
                  </g>
                )}

                {/* Glass Sheen */}
                <rect x="0" y="0" width="200" height="320" fill="url(#cleanGlassSheen)" pointerEvents="none" />
              </g>

              {/* Glassware Contour Outline */}
              <polygon
                points="40,65 160,65 142,275 58,275"
                fill="none"
                stroke="rgba(17, 24, 39, 0.25)"
                strokeWidth="2"
              />
              <ellipse cx="100" cy="65" rx="60" ry="7" fill="none" stroke="rgba(17, 24, 39, 0.3)" strokeWidth="2" />
              <ellipse cx="100" cy="275" rx="42" ry="5" fill="none" stroke="rgba(17, 24, 39, 0.2)" strokeWidth="1.5" />
            </svg>
          </div>
        ) : (
          /* Photorealistic AI Rendered Marketing Asset */
          <div style={{ position: 'relative', width: '260px', height: '340px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.8)' }}>
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
              {/* Realistic Mockup Simulation Container */}
              <div
                style={{
                  width: '140px',
                  height: '220px',
                  borderRadius: '12px 12px 20px 20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.2)'
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

              {/* 8K Studio Watermark */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={11} color="#d97706" />
                <span>8K Commercial Asset</span>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Lighting Switcher */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setLightingTheme(lightingTheme === 'daylight' ? 'moody' : 'daylight')}
            className="btn-clean btn-clean-secondary btn-clean-sm"
            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            {lightingTheme === 'daylight' ? <Sun size={12} color="#d97706" /> : <Moon size={12} color="#a855f7" />}
            <span>{lightingTheme === 'daylight' ? 'Warm Daylight' : 'Moody Bar'}</span>
          </button>
        </div>
      </div>

      {/* 3. Clean Pastel Fill Level Meter */}
      <div style={{ background: '#f8f9fb', borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Cup Fill Capacity ({totalVesselVolumeMl}ml • {vessel.volumeOz}oz)
          </span>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: fillPercentage > 100 ? '#e11d48' : '#059669', fontFamily: 'var(--font-mono)' }}>
            {fillPercentage}% Filled
          </span>
        </div>

        {/* Progress Bar */}
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

        {/* Subtle spec note */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>Ice Displacement: -{iceDisplacementMl}ml</span>
          <span>Liquid Top-Off: {topOffVolumeMl}ml</span>
        </div>
      </div>

      {/* 4. Single Prominent Primary Action Button */}
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
