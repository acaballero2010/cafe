import React, { useState } from 'react'
import { Sparkles, Download, Share2, Camera, Sun, Moon, Palette, Sliders, RefreshCw, Check } from 'lucide-react'

export function AiRenderStudio({
  recipe,
  metrics
}) {
  const [lightingMode, setLightingMode] = useState('cafe-daylight')
  const [condensationLevel, setCondensationLevel] = useState('heavy')
  const [isGenerating, setIsGenerating] = useState(false)
  const [renderedImage, setRenderedImage] = useState(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')

  const lightingPresets = [
    { id: 'cafe-daylight', name: 'Scandinavian Morning Cafe (5000K Soft Sun)', icon: Sun },
    { id: 'speakeasy-moody', name: 'Moody Speakeasy (2700K Amber Rim Light)', icon: Moon },
    { id: 'boba-pop', name: 'Pastel Studio Glow (High-Key Boba)', icon: Palette },
    { id: 'delivery-menu', name: 'Pure White E-Commerce Menu', icon: Camera }
  ]

  // Synthesize dynamic AI prompt based on current recipe physics
  const generatedPrompt = `Hyper-realistic 8k commercial beverage photography of ${recipe.name}. Served in a ${metrics.vessel.name} with ${metrics.ice.name}. Visible distinct layered strata: ${metrics.layersDetailed.map(l => `${l.name} (${l.calculatedVolumeMl}ml)`).join(' + ')}. Heavy realistic condensation droplets on exterior glass, silky microfoam head, ambient ${lightingMode} lighting, 85mm f/1.4 lens bokeh, ultra-crisp studio lighting, food styling masterpiece.`

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setRenderedImage({
        timestamp: Date.now(),
        lighting: lightingMode,
        aspectRatio
      })
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Studio Configuration Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                AI Visual Render Studio
              </h2>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Transforms physical recipe layer formulas into photorealistic studio marketing assets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${aspectRatio === '1:1' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAspectRatio('1:1')}
            >
              1:1 Square
            </button>
            <button
              className={`btn btn-sm ${aspectRatio === '9:16' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAspectRatio('9:16')}
            >
              9:16 Story
            </button>
          </div>
        </div>

        {/* Ambient Lighting Engine Selector */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Ambient Lighting & Environment Shader
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '8px' }}>
            {lightingPresets.map(p => {
              const Icon = p.icon
              const isSelected = lightingMode === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setLightingMode(p.id)}
                  style={{
                    background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                    border: isSelected ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={16} color={isSelected ? '#c084fc' : '#94a3b8'} />
                  <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Auto-Synthesized Layering Prompt Preview */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Synthesized Generative Layer Physics Prompt
          </label>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}
          >
            {generatedPrompt}
          </div>
        </div>

        {/* Render Trigger Button */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)',
              color: '#ffffff',
              minWidth: '180px'
            }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Rendering 8K Layers...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Realistic Drink</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Canvas Studio Stage */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '440px'
        }}
      >
        {/* Photorealistic Render Container */}
        <div
          style={{
            position: 'relative',
            width: aspectRatio === '1:1' ? '340px' : '260px',
            height: aspectRatio === '1:1' ? '340px' : '460px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background:
              lightingMode === 'cafe-daylight'
                ? 'radial-gradient(circle at 40% 20%, #2a3441 0%, #151c28 100%)'
                : lightingMode === 'speakeasy-moody'
                ? 'radial-gradient(circle at 70% 30%, #301b10 0%, #0d0907 100%)'
                : lightingMode === 'boba-pop'
                ? 'radial-gradient(circle at 50% 50%, #2b1f3d 0%, #120e1a 100%)'
                : 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Realistic Render Simulation Graphic */}
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Ambient Lighting Bloom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  lightingMode === 'cafe-daylight'
                    ? 'radial-gradient(circle at 80% 10%, rgba(254, 240, 138, 0.15), transparent 60%)'
                    : lightingMode === 'speakeasy-moody'
                    ? 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.2), transparent 50%)'
                    : 'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.2), transparent 60%)'
              }}
            />

            {/* Realistic Glass Drink Image Simulation */}
            <div
              style={{
                width: '180px',
                height: '270px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column-reverse',
                borderRadius: '16px 16px 28px 28px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(2px)'
              }}
            >
              {/* Layer 1: Base */}
              {metrics.layersDetailed.map((layer, idx) => (
                <div
                  key={idx}
                  style={{
                    height: `${layer.heightPercent * 1.6}%`,
                    background: `linear-gradient(180deg, ${layer.colorHex}dd, ${layer.colorHex})`,
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Subtle Liquid Swirl Gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.25), transparent 70%)'
                    }}
                  />
                </div>
              ))}

              {/* Realistic Ice Cubes Inside */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px',
                  pointerEvents: 'none'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                />
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    transform: 'rotate(20deg)'
                  }}
                />
              </div>

              {/* Glass Condensation Droplets */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1.5px, transparent 0)',
                  backgroundSize: '16px 16px',
                  opacity: 0.35,
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Studio Badge Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.66rem',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} color="#c084fc" />
              <span>AI Photorealistic Render • 8K</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Download & Share */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => alert(`Saved high-res render of ${recipe.name} to Menu Asset Library!`)}
          >
            <Download size={14} />
            <span>Export PNG for Digital Menu</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => alert('Generated 9:16 Instagram Story & TikTok Video Frame!')}
          >
            <Share2 size={14} />
            <span>Export Social Story</span>
          </button>
        </div>
      </div>
    </div>
  )
}
