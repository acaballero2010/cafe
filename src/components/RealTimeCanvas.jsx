import React, { useState } from 'react'
import { Sparkles, Layers, Sun, Moon, Zap, Wand2, BookOpen } from 'lucide-react'

export function RealTimeCanvas({
  metrics,
  recipe,
  onOpenSopCard
}) {
  const [viewMode, setViewMode] = useState('live-cup') // 'live-cup' | 'ai-render'
  const [isGenerating, setIsGenerating] = useState(false)
  const [lightingPreset, setLightingPreset] = useState('daylight') // 'daylight' | 'neon' | 'softbox'

  const {
    vessel,
    ice,
    totalVesselVolumeMl,
    iceDisplacementMl,
    topOffVolumeMl,
    fixedLayersMl,
    layersDetailed
  } = metrics

  const isCoupe = vessel.id?.includes('coupe') || vessel.shape === 'coupe'

  const lightingThemes = {
    daylight: {
      name: '☀️ Warm Daylight',
      bg: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f4ede4 100%)',
      glow: 'rgba(217, 119, 6, 0.08)'
    },
    neon: {
      name: '🟣 Bar Neon',
      bg: 'radial-gradient(circle at 50% 30%, #2e1065 0%, #0f172a 100%)',
      glow: 'rgba(168, 85, 247, 0.25)'
    },
    softbox: {
      name: '💡 Studio Softbox',
      bg: 'radial-gradient(circle at 50% 30%, #f8fafc 0%, #cbd5e1 100%)',
      glow: 'rgba(148, 163, 184, 0.15)'
    }
  }

  const cycleLighting = () => {
    const keys = ['daylight', 'neon', 'softbox']
    const nextIdx = (keys.indexOf(lightingPreset) + 1) % keys.length
    setLightingPreset(keys[nextIdx])
  }

  // Calculate visual heights for glassware
  const cupBottomY = isCoupe ? 150 : 260
  const totalPixelHeight = isCoupe ? 85 : 190
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* 1. View Toggle Header (Top-Right Segmented Control) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '12px',
            gap: '3px'
          }}
        >
          <button
            onClick={() => setViewMode('live-cup')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: viewMode === 'live-cup' ? '#ffffff' : 'transparent',
              color: viewMode === 'live-cup' ? '#0f172a' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: viewMode === 'live-cup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🥛</span>
            <span>Cup Build</span>
          </button>

          <button
            onClick={() => setViewMode('ai-render')}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: 'none',
              background: viewMode === 'ai-render' ? '#ffffff' : 'transparent',
              color: viewMode === 'ai-render' ? '#0f172a' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: viewMode === 'ai-render' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>✨</span>
            <span>AI Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Canvas Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '270px',
          background: lightingThemes[lightingPreset].bg,
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
        }}
      >
        {/* Clickable Lighting Preset Pill */}
        <button
          onClick={cycleLighting}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 10
          }}
          title="Click to switch lighting preset"
        >
          <span>{lightingThemes[lightingPreset].name}</span>
        </button>

        {/* Countertop Table Reflection */}
        <div
          style={{
            position: 'absolute',
            bottom: isCoupe ? '18px' : '22px',
            width: isCoupe ? '150px' : '180px',
            height: '20px',
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.2) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />

        {viewMode === 'live-cup' ? (
          <div style={{ position: 'relative', width: '220px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
              <defs>
                {/* Coupe / Nick & Nora Bowl Clip */}
                <clipPath id="coupeBowlClip">
                  <path d="M 32,65 C 32,150 168,150 168,65 Z" />
                </clipPath>

                {/* Tumbler Clip */}
                <clipPath id="tumblerClip">
                  <polygon points="42,55 158,55 142,260 58,260" />
                </clipPath>

                {/* Glass Reflection Gradient */}
                <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="70%" stopColor="rgba(255,255,255,0.0)" />
                  <stop offset="95%" stopColor="rgba(255,255,255,0.4)" />
                </linearGradient>

                {/* Froth Texture */}
                <linearGradient id="frothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#fdfbf7" />
                </linearGradient>
              </defs>

              {isCoupe ? (
                /* === STEMWARE: COUPE / NICK & NORA GLASS === */
                <g>
                  {/* Liquid Fill in Bowl */}
                  <g clipPath="url(#coupeBowlClip)">
                    <rect x="0" y="0" width="200" height="280" fill="rgba(255,255,255,0.2)" />
                    
                    {/* Layer 1: Mezcal / Golden Agave Base */}
                    <rect x="20" y="105" width="160" height="50" fill="#b45309" opacity="0.92" />

                    {/* Layer 2: Citrus / Sour Mix */}
                    <rect x="20" y="80" width="160" height="28" fill="#d97706" opacity="0.85" />

                    {/* Layer 3: Frothy Aquafaba / Egg White Head */}
                    <rect x="20" y="65" width="160" height="18" fill="url(#frothGrad)" opacity="0.98" />

                    {/* Subtle internal bubbles in froth */}
                    <circle cx="85" cy="72" r="2" fill="rgba(245, 158, 11, 0.3)" />
                    <circle cx="115" cy="74" r="1.5" fill="rgba(245, 158, 11, 0.3)" />
                    <circle cx="100" cy="70" r="1.8" fill="rgba(245, 158, 11, 0.25)" />

                    {/* Glass Sheen in Bowl */}
                    <rect x="0" y="0" width="200" height="280" fill="url(#glassGlare)" pointerEvents="none" />
                  </g>

                  {/* Glassware Structural Outlines (Coupe Bowl + Stem + Foot) */}
                  {/* Stem */}
                  <path d="M 98,145 L 98,235 L 102,235 L 102,145 Z" fill="#94a3b8" opacity="0.6" stroke="#475569" strokeWidth="1.5" />
                  
                  {/* Circular Foot Base */}
                  <ellipse cx="100" cy="238" rx="42" ry="7" fill="rgba(255,255,255,0.5)" stroke="#334155" strokeWidth="2" />
                  <ellipse cx="100" cy="238" rx="36" ry="4" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />

                  {/* Bowl Contour */}
                  <path d="M 32,65 C 32,150 168,150 168,65" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Rim Ellipse */}
                  <ellipse cx="100" cy="65" rx="68" ry="9" fill="rgba(255,255,255,0.2)" stroke="#1e293b" strokeWidth="2.5" />

                  {/* Garnish: Torched Rosemary Sprig Silhouette on Rim */}
                  <g transform="translate(142, 45) rotate(22)">
                    {/* Stem */}
                    <path d="M 0,35 Q 8,15 15,-5" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Leaves */}
                    <path d="M 3,25 L -4,20" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 5,20 L 13,17" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 8,12 L 2,8" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 10,8 L 18,5" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 13,-1 L 7,-4" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
                    {/* Charred ember tip */}
                    <circle cx="15" cy="-5" r="2" fill="#78350f" />
                  </g>
                </g>
              ) : (
                /* === TUMBLER / COLD CUP === */
                <g>
                  <g clipPath="url(#tumblerClip)">
                    <rect x="0" y="0" width="200" height="280" fill="rgba(255,255,255,0.2)" />
                    {visualLayers.map((l, i) => (
                      <rect key={i} x="30" y={l.y} width="140" height={l.height + 2} fill={l.color} opacity="0.9" />
                    ))}
                    <rect x="0" y="0" width="200" height="280" fill="url(#glassGlare)" pointerEvents="none" />
                  </g>

                  {/* Tumbler Outline */}
                  <polygon points="42,55 158,55 142,260 58,260" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
                  <ellipse cx="100" cy="55" rx="58" ry="8" fill="rgba(255,255,255,0.2)" stroke="#334155" strokeWidth="2.5" />
                  <ellipse cx="100" cy="260" rx="42" ry="5" fill="none" stroke="#475569" strokeWidth="2" />
                </g>
              )}
            </svg>
          </div>
        ) : (
          /* AI Studio Render Card */
          <div style={{ position: 'relative', width: '200px', height: '220px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.18)', border: '2px solid rgba(255,255,255,0.9)' }}>
            <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 30%, #3e2723 0%, #1a120b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ textAlign: 'center', color: '#ffffff', padding: '12px' }}>
                <Sparkles size={24} color="#d97706" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>8K Commercial Shot</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>FLUX.1 / Midjourney Spec</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

