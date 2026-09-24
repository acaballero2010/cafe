import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Palette, 
  Smartphone, 
  Monitor, 
  Tag, 
  Share2, 
  Sliders, 
  RefreshCw,
  Eye,
  Type,
  Maximize2,
  SlidersHorizontal,
  FileText
} from 'lucide-react'

export function BeveragePhotoStudioModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  metrics = {}
}) {
  const [aspectRatio, setAspectRatio] = useState('1:1') // '1:1' | '9:16' | '16:9' | '4:6'
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'scene' | 'caption'
  const [sceneEnvironment, setSceneEnvironment] = useState('marble-sunlight')
  const [showPromoOverlay, setShowPromoOverlay] = useState(true)
  const [showPriceTag, setShowPriceTag] = useState(true)
  const [condensationLevel, setCondensationLevel] = useState('heavy') // 'heavy' | 'medium' | 'dry'
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [customTagline, setCustomTagline] = useState('Handcrafted Daily with Premium Artisanal Ingredients')

  if (!isOpen) return null

  const scenes = [
    {
      id: 'marble-sunlight',
      name: '☀️ Sunlit Marble Café',
      desc: 'Soft 5000K morning sunlight, clean marble surface with café bokeh.',
      bgGradient: 'linear-gradient(135deg, #fdfbf7 0%, #e5ded5 50%, #c8bba8 100%)',
      ambientColor: '#fff9ed',
      textColor: '#1e293b',
      accentColor: '#d97706'
    },
    {
      id: 'speakeasy-moody',
      name: '🍸 Moody Speakeasy Bar',
      desc: 'Dark mahogany wood, warm 2700K amber rim lighting, luxury evening vibe.',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1610 50%, #331a0e 100%)',
      ambientColor: '#2b1c11',
      textColor: '#ffffff',
      accentColor: '#f59e0b'
    },
    {
      id: 'studio-white',
      name: '⚪ Pure Studio E-Commerce',
      desc: 'Shadowless, ultra-crisp white studio backdrop for delivery menus.',
      bgGradient: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)',
      ambientColor: '#ffffff',
      textColor: '#0f172a',
      accentColor: '#2563eb'
    },
    {
      id: 'rustic-coffee',
      name: '☕ Roasted Beans & Timber',
      desc: 'Reclaimed teak wood counter, scattered espresso beans & cinnamon bark.',
      bgGradient: 'linear-gradient(135deg, #38220f 0%, #241407 60%, #130903 100%)',
      ambientColor: '#3d2314',
      textColor: '#fed7aa',
      accentColor: '#fb923c'
    },
    {
      id: 'tropical-garden',
      name: '🌿 Botanical Terrace',
      desc: 'Fresh sunlight dappled through tropical Monstera leaves on stone patio.',
      bgGradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%)',
      ambientColor: '#f0fdf4',
      textColor: '#064e3b',
      accentColor: '#059669'
    }
  ]

  const activeScene = scenes.find(s => s.id === sceneEnvironment) || scenes[0]

  // Dynamic layers for realistic liquid visualization
  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [
        { name: 'House Muscovado Syrup', volumeMl: 25, colorHex: '#3b1d0b' },
        { name: 'Blonde Espresso Double Shot', volumeMl: 36, colorHex: '#422415' },
        { name: 'Barista Oat Milk', volumeMl: 180, colorHex: '#f4ede2', isTopOff: true }
      ])

  const totalVol = layers.reduce((sum, l) => sum + (Number(l.calculatedVolumeMl || l.volumeMl || 30)), 0) || 240
  const drinkPrice = recipe.menuPrice || 185.00
  const drinkName = recipe.name || 'Iced Brown Sugar Oat Shaken Espresso'
  const shopName = 'Kape Craft Studio & Bar'

  // Auto-generate high-converting marketing copy for Facebook/Instagram
  const generatedSocialCopy = `✨ INTRODUCING: Our New ${drinkName}! ✨

Crafted for true specialty beverage lovers. Built with precision layers of ${layers.map(l => l.name.replace(/\s*\([^)]*\)/g, '').trim()).join(', ')}.

🔥 Why you'll love it:
• 100% Premium Wholesale Grade Ingredients
• Balanced to absolute perfection (silky mouthfeel, lingering notes)
• Served ice-cold in our signature ${recipe.vesselId?.includes('boba') ? '20oz Boba Cup' : '16oz Cold Cup'}

📍 Available daily at ${shopName}
🏷️ Introductory Price: ₱${drinkPrice.toFixed(2)}
🛵 Order for pick-up or delivery via GrabFood & FoodPanda!

#PourCraft #SpecialtyCoffeePH #ManilaCafe #BaristaDaily #BGCFoodies #PhilippineCoffee #CraftBeverage #CoffeeLoverPH #KapeTayo`

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedSocialCopy)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Draw high-res canvas for image download
  const handleDownloadImage = () => {
    setIsDownloading(true)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    let width = 1200
    let height = 1200

    if (aspectRatio === '9:16') {
      width = 1080
      height = 1920
    } else if (aspectRatio === '16:9') {
      width = 1920
      height = 1080
    } else if (aspectRatio === '4:6') {
      width = 1200
      height = 1800
    }

    canvas.width = width
    canvas.height = height

    // 1. Draw Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    if (activeScene.id === 'marble-sunlight') {
      bgGrad.addColorStop(0, '#fdfbf7')
      bgGrad.addColorStop(0.5, '#e5ded5')
      bgGrad.addColorStop(1, '#c8bba8')
    } else if (activeScene.id === 'speakeasy-moody') {
      bgGrad.addColorStop(0, '#0f172a')
      bgGrad.addColorStop(0.5, '#1e1610')
      bgGrad.addColorStop(1, '#331a0e')
    } else if (activeScene.id === 'studio-white') {
      bgGrad.addColorStop(0, '#ffffff')
      bgGrad.addColorStop(1, '#e2e8f0')
    } else if (activeScene.id === 'rustic-coffee') {
      bgGrad.addColorStop(0, '#38220f')
      bgGrad.addColorStop(0.6, '#241407')
      bgGrad.addColorStop(1, '#130903')
    } else {
      bgGrad.addColorStop(0, '#ecfdf5')
      bgGrad.addColorStop(0.5, '#d1fae5')
      bgGrad.addColorStop(1, '#a7f3d0')
    }
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Draw Table Surface Line
    const tableY = height * 0.76
    ctx.fillStyle = activeScene.id === 'speakeasy-moody' || activeScene.id === 'rustic-coffee' ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.06)'
    ctx.fillRect(0, tableY, width, height - tableY)

    // 3. Draw Ambient Table Reflection / Shadow
    const shadowGrad = ctx.createRadialGradient(width / 2, tableY, 40, width / 2, tableY, width * 0.35)
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.35)')
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = shadowGrad
    ctx.beginPath()
    ctx.ellipse(width / 2, tableY + 20, width * 0.28, 40, 0, 0, Math.PI * 2)
    ctx.fill()

    // 4. Draw Realistic Glass Cup
    const cupW = width * 0.32
    const cupH = height * 0.44
    const cupX = (width - cupW) / 2
    const cupY = tableY - cupH + 10

    // Draw Glass Silhouette & Layers
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(cupX, cupY, cupW, cupH, [16, 16, 24, 24])
    ctx.clip()

    // Draw liquid layers from bottom to top
    let currentY = cupY + cupH
    layers.forEach((layer) => {
      const fraction = (Number(layer.calculatedVolumeMl || layer.volumeMl || 30)) / totalVol
      const layerH = cupH * fraction
      currentY -= layerH

      ctx.fillStyle = layer.colorHex || '#f59e0b'
      ctx.fillRect(cupX, currentY, cupW, layerH)

      // Add subtle internal fluid gradient & lighting
      const fluidGrad = ctx.createLinearGradient(cupX, currentY, cupX + cupW, currentY)
      fluidGrad.addColorStop(0, 'rgba(255,255,255,0.15)')
      fluidGrad.addColorStop(0.3, 'rgba(255,255,255,0)')
      fluidGrad.addColorStop(0.7, 'rgba(0,0,0,0.1)')
      fluidGrad.addColorStop(1, 'rgba(0,0,0,0.25)')
      ctx.fillStyle = fluidGrad
      ctx.fillRect(cupX, currentY, cupW, layerH)
    })

    // Draw Ice Cubes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    for (let i = 0; i < 4; i++) {
      const ix = cupX + 25 + (i % 2) * (cupW * 0.45)
      const iy = cupY + 40 + Math.floor(i / 2) * 90
      ctx.beginPath()
      ctx.roundRect(ix, iy, cupW * 0.4, 70, 10)
      ctx.fill()
      ctx.stroke()
    }

    ctx.restore()

    // Draw Glass Outline & Highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.roundRect(cupX, cupY, cupW, cupH, [16, 16, 24, 24])
    ctx.stroke()

    // Specular Highlight
    const specGrad = ctx.createLinearGradient(cupX, cupY, cupX + 35, cupY)
    specGrad.addColorStop(0, 'rgba(255,255,255,0.6)')
    specGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = specGrad
    ctx.fillRect(cupX + 8, cupY + 12, 28, cupH - 24)

    // 5. Draw Promo Text Overlay if enabled
    if (showPromoOverlay) {
      ctx.fillStyle = activeScene.textColor
      ctx.font = '800 52px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(drinkName, width / 2, height * 0.14)

      ctx.fillStyle = activeScene.accentColor
      ctx.font = '700 24px system-ui, sans-serif'
      ctx.fillText(customTagline.toUpperCase(), width / 2, height * 0.18)

      if (showPriceTag) {
        const pillW = 240
        const pillH = 64
        const pillX = (width - pillW) / 2
        const pillY = height * 0.86

        ctx.fillStyle = activeScene.id === 'speakeasy-moody' ? 'rgba(255,255,255,0.12)' : '#ffffff'
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, pillW, pillH, 32)
        ctx.fill()
        ctx.strokeStyle = activeScene.accentColor
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillStyle = activeScene.textColor
        ctx.font = '800 32px system-ui, sans-serif'
        ctx.fillText(`₱${drinkPrice.toFixed(2)}`, width / 2, pillY + 44)
      }
    }

    setTimeout(() => {
      const imageURL = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${drinkName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-photo-studio.png`
      link.href = imageURL
      link.click()
      setIsDownloading(false)
    }, 400)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Modal Top Bar */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                AI Beverage Photo Studio
                <span style={{ fontSize: '0.66rem', background: '#fdf2f8', color: '#db2777', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  Marketing Ready
                </span>
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0' }}>
                Photorealistic marketing visuals for Facebook, Instagram & menus.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Mobile Studio Segmented View Tabs */}
        <div style={{ display: 'flex', background: '#f8fafc', padding: '6px 16px', borderBottom: '1px solid #e2e8f0', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'preview' ? '#0f172a' : 'transparent',
              color: activeTab === 'preview' ? '#ffffff' : '#64748b',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Camera size={13} />
            <span>Visual Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('scene')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'scene' ? '#0f172a' : 'transparent',
              color: activeTab === 'scene' ? '#ffffff' : '#64748b',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <SlidersHorizontal size={13} />
            <span>Scene & Style</span>
          </button>

          <button
            onClick={() => setActiveTab('caption')}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'caption' ? '#0f172a' : 'transparent',
              color: activeTab === 'caption' ? '#ffffff' : '#64748b',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <FileText size={13} />
            <span>AI Caption</span>
          </button>
        </div>

        {/* 3. Main Content Container (Mobile-Optimized Vertical Stack) */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* TAB 1: Visual Preview & Canvas */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Aspect Ratio Selector Pills */}
              <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '1:1' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '1:1' ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>1:1 Post</span>
                </button>

                <button
                  onClick={() => setAspectRatio('9:16')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '9:16' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '9:16' ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Smartphone size={12} />
                  <span>9:16 Story</span>
                </button>

                <button
                  onClick={() => setAspectRatio('16:9')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '16:9' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '16:9' ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Monitor size={12} />
                  <span>16:9 Web</span>
                </button>

                <button
                  onClick={() => setAspectRatio('4:6')}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '4:6' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '4:6' ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Tag size={12} />
                  <span>4x6 Standee</span>
                </button>
              </div>

              {/* Visual Studio Viewport Frame */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: aspectRatio === '9:16' ? '9/14' : aspectRatio === '16:9' ? '16/10' : aspectRatio === '4:6' ? '4/5.5' : '1/1',
                  maxHeight: '380px',
                  borderRadius: '20px',
                  background: activeScene.bgGradient,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 16px',
                  boxSizing: 'border-box',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(255,255,255,0.6)'
                }}
              >
                {/* Promo Header Text Overlay */}
                {showPromoOverlay ? (
                  <div style={{ textAlign: 'center', zIndex: 10, maxWidth: '92%' }}>
                    <div style={{ fontSize: '0.64rem', fontWeight: 800, textTransform: 'uppercase', color: activeScene.accentColor, letterSpacing: '0.08em', marginBottom: '2px' }}>
                      {shopName}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: activeScene.textColor, margin: 0, textShadow: activeScene.id === 'speakeasy-moody' ? '0 2px 8px rgba(0,0,0,0.8)' : '0 1px 4px rgba(255,255,255,0.6)', lineHeight: 1.25 }}>
                      {drinkName}
                    </h3>
                    <div style={{ fontSize: '0.64rem', fontWeight: 600, color: activeScene.accentColor, marginTop: '2px' }}>
                      {customTagline}
                    </div>
                  </div>
                ) : <div />}

                {/* Central Photorealistic Simulated Glass */}
                <div
                  style={{
                    width: '135px',
                    height: '195px',
                    borderRadius: '16px 16px 24px 24px',
                    border: '3px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.22), inset 0 0 20px rgba(255,255,255,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    zIndex: 5,
                    backdropFilter: 'blur(2px)'
                  }}
                >
                  {/* Glass Specular Reflection */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      width: '14px',
                      bottom: '12px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: '8px',
                      zIndex: 20
                    }}
                  />

                  {/* Layered Liquid Strata */}
                  {layers.map((layer, idx) => {
                    const fraction = (Number(layer.calculatedVolumeMl || layer.volumeMl || 30)) / totalVol
                    return (
                      <div
                        key={layer.id || idx}
                        style={{
                          height: `${Math.max(14, fraction * 100)}%`,
                          background: layer.colorHex || '#f59e0b',
                          width: '100%',
                          position: 'relative',
                          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.15)'
                        }}
                      />
                    )
                  })}

                  {/* Floating Ice Cubes & Foam */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '10px',
                      right: '10px',
                      height: '42px',
                      background: 'rgba(255,255,255,0.35)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.6)',
                      backdropFilter: 'blur(1px)'
                    }}
                  />

                  {/* Condensation Beads */}
                  {condensationLevel !== 'dry' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 1.5px)',
                        backgroundSize: '12px 14px',
                        opacity: condensationLevel === 'heavy' ? 0.75 : 0.45,
                        pointerEvents: 'none',
                        zIndex: 15
                      }}
                    />
                  )}
                </div>

                {/* Glass Pedestal Reflection / Shadow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '44px',
                    width: '160px',
                    height: '20px',
                    borderRadius: '50%',
                    background: activeScene.id === 'speakeasy-moody' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.12)',
                    filter: 'blur(8px)',
                    zIndex: 2
                  }}
                />

                {/* Promo Price Tag Pill */}
                {showPromoOverlay && showPriceTag ? (
                  <div
                    style={{
                      background: activeScene.id === 'speakeasy-moody' ? 'rgba(255,255,255,0.15)' : '#ffffff',
                      border: `1.5px solid ${activeScene.accentColor}`,
                      padding: '5px 16px',
                      borderRadius: '999px',
                      color: activeScene.textColor,
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: activeScene.accentColor, fontWeight: 700 }}>ONLY</span>
                    <span>₱{drinkPrice.toFixed(2)}</span>
                  </div>
                ) : <div />}
              </div>

              {/* 1-Tap Download Action Bar */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
                }}
              >
                {isDownloading ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                <span>{isDownloading ? 'Rendering High-Res PNG...' : 'Download High-Res Graphic (PNG)'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: Scene & Styling Controls */}
          {activeTab === 'scene' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Choose Scene Environment & Tabletop
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scenes.map(s => {
                    const isSelected = s.id === sceneEnvironment
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSceneEnvironment(s.id)}
                        style={{
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          border: `1.5px solid ${isSelected ? '#059669' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          padding: '10px 12px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isSelected ? '#065f46' : '#0f172a' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>
                            {s.desc}
                          </div>
                        </div>
                        {isSelected && <Check size={16} color="#059669" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Overlays & Beverage Styling
                </label>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Promotional Text & Title Overlay</span>
                    <input
                      type="checkbox"
                      checked={showPromoOverlay}
                      onChange={(e) => setShowPromoOverlay(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Price Badge (₱{drinkPrice.toFixed(2)})</span>
                    <input
                      type="checkbox"
                      checked={showPriceTag}
                      onChange={(e) => setShowPriceTag(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Exterior Condensation Droplets</span>
                    <select
                      value={condensationLevel}
                      onChange={(e) => setCondensationLevel(e.target.value)}
                      style={{ fontSize: '0.76rem', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="heavy">Heavy Frost</option>
                      <option value="medium">Medium Dew</option>
                      <option value="dry">Dry / Hot Cup</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Social Media Caption Generator */}
          {activeTab === 'caption' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#8b5cf6" />
                  <span>Facebook & Instagram Promotional Copy</span>
                </label>
                <button
                  onClick={handleCopyCaption}
                  style={{
                    background: isCopied ? '#ecfdf5' : '#f1f5f9',
                    border: `1px solid ${isCopied ? '#a7f3d0' : '#cbd5e1'}`,
                    color: isCopied ? '#059669' : '#475569',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{isCopied ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedSocialCopy}
                rows={10}
                style={{
                  width: '100%',
                  fontSize: '0.76rem',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
